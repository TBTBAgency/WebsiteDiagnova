import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getAppBaseUrl } from "@/lib/app-url";
import { isUserRole } from "@/lib/roles";
import { signSessionToken, SESSION_DURATION_HOURS } from "@/lib/auth-session";
import { getUserAccessWindow } from "@/lib/demo-access";
import { recordAuditLogTx } from "@/lib/models/audit.model";
import { AuthSessionPayload } from "@/types";

/** Masa berlaku tautan (bukan masa demo). */
export const MAGIC_LINK_TTL_HOURS = 24;

/** Token mentah: 32 byte acak dalam hex (64 karakter). */
export const MAGIC_TOKEN_PATTERN = /^[a-f0-9]{64}$/;

export function hashMagicToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * URL yang dikirim ke client. Token diletakkan di fragment (#) sehingga:
 *  - tidak pernah terkirim ke server pada GET (tidak masuk access log / referer),
 *  - crawler preview (WhatsApp, email scanner) yang membuka URL tidak dapat mengonsumsinya.
 * Konsumsi hanya terjadi lewat POST eksplisit saat pengguna menekan tombol.
 */
export function buildMagicLinkUrl(rawToken: string): string {
  return `${getAppBaseUrl()}/auth/verify-magic-link#token=${rawToken}`;
}

/**
 * Menerbitkan tautan baru untuk satu periode akses di dalam transaksi pemanggil.
 * Tautan lama periode tersebut yang belum dipakai dicabut (revoked_at) — TTL aslinya tetap tersimpan.
 */
export async function issueMagicLink(
  tx: Prisma.TransactionClient,
  params: { demoAccessId: string; email: string },
  now: Date = new Date()
): Promise<{ magicLinkUrl: string; expiresAt: Date; revokedCount: number }> {
  const revoked = await tx.demoMagicLink.updateMany({
    where: { demoAccessId: params.demoAccessId, usedAt: null, revokedAt: null, expiresAt: { gt: now } },
    data: { revokedAt: now },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(now.getTime() + MAGIC_LINK_TTL_HOURS * 60 * 60 * 1000);

  await tx.demoMagicLink.create({
    data: {
      tokenHash: hashMagicToken(rawToken),
      email: params.email.toLowerCase().trim(),
      demoAccessId: params.demoAccessId,
      expiresAt,
    },
  });

  return { magicLinkUrl: buildMagicLinkUrl(rawToken), expiresAt, revokedCount: revoked.count };
}

export type ConsumeFailureCode =
  | "INVALID" // token tidak dikenal / format salah / tidak berhak
  | "USED"
  | "EXPIRED"
  | "REVOKED" // tautan diganti tautan yang lebih baru, atau akses dicabut admin
  | "ACCOUNT_INACTIVE"
  | "DEMO_EXPIRED";

export type ConsumeResult =
  | {
      success: true;
      sessionToken: string;
      sessionMaxAgeSeconds: number;
      session: AuthSessionPayload;
      leadId: string;
      firstLogin: boolean;
      demoExpiresAt: Date;
    }
  | { success: false; code: ConsumeFailureCode; leadId?: string; userId?: string };

class ConsumeAbort extends Error {
  constructor(public readonly code: ConsumeFailureCode, public readonly leadId?: string, public readonly userId?: string) {
    super(code);
  }
}

type SessionSigner = (payload: AuthSessionPayload, maxAgeSeconds: number) => Promise<string>;

/**
 * Memvalidasi lalu mengonsumsi magic link secara atomik (all-or-nothing):
 *  1. validasi token, akun, dan periode akses — gagal = tidak ada perubahan apa pun;
 *  2. klaim token (UPDATE bersyarat used_at IS NULL) — dua request bersamaan tidak mungkin sama-sama berhasil;
 *  3. aktivasi periode akses bila belum aktif;
 *  4. transisi Lead Dihubungi -> Jadwal Demo HANYA pada login pertama (demo_started_at IS NULL);
 *  5. audit transisi & login di transaksi yang sama;
 *  6. JWT sesi ditandatangani SEBELUM commit — bila gagal, seluruh langkah di atas dibatalkan (GW-04).
 * Cookie disetel oleh Route Handler memakai token yang sudah jadi (operasi header, tidak dapat gagal parsial).
 */
export async function consumeMagicLink(
  rawToken: unknown,
  meta: { ipAddress?: string | null; userAgent?: string | null } = {},
  signer: SessionSigner = signSessionToken
): Promise<ConsumeResult> {
  if (typeof rawToken !== "string" || !MAGIC_TOKEN_PATTERN.test(rawToken)) {
    return { success: false, code: "INVALID" };
  }

  const tokenHash = hashMagicToken(rawToken);
  const now = new Date();

  try {
    return await db.$transaction(async (tx): Promise<ConsumeResult> => {
      const link = await tx.demoMagicLink.findUnique({
        where: { tokenHash },
        include: {
          demoAccess: {
            include: {
              lead: { select: { id: true, status: true, approvalStatus: true } },
              user: { include: { role: { select: { code: true } } } },
            },
          },
        },
      });

      if (!link) throw new ConsumeAbort("INVALID");

      const access = link.demoAccess;
      const user = access.user;
      const leadId = access.leadId;
      const fail = (code: ConsumeFailureCode) => new ConsumeAbort(code, leadId, user.id);

      if (link.usedAt) throw fail("USED");
      if (link.revokedAt || access.revokedAt) throw fail("REVOKED");
      if (link.expiresAt <= now) throw fail("EXPIRED");
      if (access.lead.approvalStatus === "REJECTED") throw fail("REVOKED");

      // Tautan terikat ke satu akun USER sejak dibuat; tidak ada pencarian berdasarkan email.
      if (!isUserRole(user.role?.code)) throw fail("INVALID");
      if (user.email.toLowerCase() !== link.email.toLowerCase()) throw fail("INVALID");
      if (user.status !== "ACTIVE" || user.deletedAt) throw fail("ACCOUNT_INACTIVE");

      // Periode yang sudah aktif harus masih berlaku (atau tercakup perpanjangan)
      if (access.activatedAt && access.expiresAt && access.expiresAt <= now) {
        const window = await getUserAccessWindow(tx, user.id, now);
        if (!window) throw fail("DEMO_EXPIRED");
      }

      // Klaim atomik
      const claimed = await tx.demoMagicLink.updateMany({
        where: { id: link.id, usedAt: null, revokedAt: null, expiresAt: { gt: now } },
        data: {
          usedAt: now,
          ipAddress: meta.ipAddress ? meta.ipAddress.substring(0, 50) : null,
          userAgent: meta.userAgent ? meta.userAgent.substring(0, 255) : null,
        },
      });
      if (claimed.count !== 1) throw fail("USED");

      // Aktivasi periode pada login pertama periode ini
      if (!access.activatedAt) {
        await tx.demoAccess.updateMany({
          where: { id: access.id, activatedAt: null },
          data: {
            activatedAt: now,
            expiresAt: new Date(now.getTime() + access.durationDays * 24 * 60 * 60 * 1000),
          },
        });
      }

      const window = await getUserAccessWindow(tx, user.id, now);
      if (!window) throw fail("DEMO_EXPIRED");

      // Transisi Lead: hanya sekali, hanya dari Dihubungi
      const transitioned = await tx.lead.updateMany({
        where: { id: leadId, status: "CONTACTED", demoStartedAt: null },
        data: { status: "SCHEDULED", demoStartedAt: now },
      });
      const firstLogin = transitioned.count === 1;

      const actor = { type: "USER" as const, userId: user.id, email: user.email, role: "USER" };
      if (firstLogin) {
        await recordAuditLogTx(tx, {
          actor,
          action: "LEAD_STATUS_CHANGED",
          entity: "leads",
          recordId: leadId,
          oldValue: { status: "CONTACTED" },
          newValue: { status: "SCHEDULED", trigger: "FIRST_DEMO_LOGIN" },
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
        });
      }
      await recordAuditLogTx(tx, {
        actor,
        action: "DEMO_LOGIN_SUCCEEDED",
        entity: "demo_accesses",
        recordId: access.id,
        newValue: { leadId, firstLogin, accessEndsAt: window.coverageEnd.toISOString() },
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      });

      const session: AuthSessionPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: "USER",
        demoExpiresAt: window.coverageEnd.toISOString(),
      };
      const remaining = Math.floor((window.coverageEnd.getTime() - now.getTime()) / 1000);
      const maxAge = Math.max(1, Math.min(SESSION_DURATION_HOURS * 3600, remaining));

      // Gagal menandatangani sesi -> exception -> ROLLBACK seluruh transaksi
      const sessionToken = await signer(session, maxAge);

      return {
        success: true,
        sessionToken,
        sessionMaxAgeSeconds: maxAge,
        session,
        leadId,
        firstLogin,
        demoExpiresAt: window.coverageEnd,
      };
    });
  } catch (error) {
    if (error instanceof ConsumeAbort) {
      return { success: false, code: error.code, leadId: error.leadId, userId: error.userId };
    }
    throw error;
  }
}
