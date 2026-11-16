import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { AuthSessionPayload } from "@/types";
import { getAppBaseUrl } from "@/lib/app-url";
import { DEMO_ROLE_NAME, isDemoRole } from "@/lib/roles";
import {
  DEFAULT_DEMO_DURATION_DAYS,
  LEAD_STATUS,
  isValidDemoDuration,
} from "@/lib/demo-constants";

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

export type MagicLinkStatus = "ACTIVE" | "USED" | "EXPIRED";

export function getMagicLinkStatus(
  link: { usedAt: Date | null; expiresAt: Date },
  now: Date = new Date()
): MagicLinkStatus {
  if (link.usedAt) return "USED";
  if (link.expiresAt <= now) return "EXPIRED";
  return "ACTIVE";
}

/**
 * Membuat token baru untuk sebuah lead di dalam transaksi pemanggil.
 * Semua token lama yang belum dipakai untuk lead tersebut dicabut (expiresAt = now)
 * sehingga hanya tautan terbaru yang berlaku.
 */
export async function issueMagicLink(
  tx: Prisma.TransactionClient,
  params: { leadId: string; email: string; userId: string },
  now: Date = new Date()
): Promise<{ rawToken: string; magicLinkUrl: string; expiresAt: Date }> {
  await tx.demoMagicLink.updateMany({
    where: { leadId: params.leadId, usedAt: null, expiresAt: { gt: now } },
    data: { expiresAt: now },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(now.getTime() + MAGIC_LINK_TTL_HOURS * 60 * 60 * 1000);

  await tx.demoMagicLink.create({
    data: {
      tokenHash: hashMagicToken(rawToken),
      email: params.email.toLowerCase().trim(),
      leadId: params.leadId,
      userId: params.userId,
      expiresAt,
    },
  });

  return { rawToken, magicLinkUrl: buildMagicLinkUrl(rawToken), expiresAt };
}

export type ConsumeFailureCode =
  | "INVALID" // token tidak dikenal / format salah / tidak berhak
  | "USED"
  | "EXPIRED"
  | "ACCOUNT_INACTIVE"
  | "DEMO_EXPIRED";

export type ConsumeResult =
  | {
      success: true;
      session: AuthSessionPayload;
      leadId: string;
      firstLogin: boolean;
      demoExpiresAt: Date;
    }
  | { success: false; code: ConsumeFailureCode; leadId?: string; userId?: string };

/**
 * Memvalidasi lalu mengonsumsi magic link secara atomik.
 *
 * Seluruh validasi dilakukan SEBELUM token ditandai terpakai; bila ada validasi yang gagal
 * token tetap utuh. Klaim token memakai UPDATE bersyarat (used_at IS NULL) di dalam transaksi
 * sehingga dua request bersamaan tidak mungkin sama-sama berhasil. Aktivasi akun demo dan
 * perubahan status lead terjadi dalam transaksi yang sama (all-or-nothing).
 *
 * Fungsi ini tidak menyetel cookie; pemanggil (Route Handler) yang membuat sesi.
 */
export async function consumeMagicLink(
  rawToken: unknown,
  meta: { ipAddress?: string | null; userAgent?: string | null } = {}
): Promise<ConsumeResult> {
  if (typeof rawToken !== "string" || !MAGIC_TOKEN_PATTERN.test(rawToken)) {
    return { success: false, code: "INVALID" };
  }

  const tokenHash = hashMagicToken(rawToken);
  const now = new Date();

  return db.$transaction(async (tx): Promise<ConsumeResult> => {
    const link = await tx.demoMagicLink.findUnique({
      where: { tokenHash },
      include: { lead: true, user: { include: { role: true } } },
    });

    if (!link) return { success: false, code: "INVALID" };

    const base = { leadId: link.leadId, userId: link.userId ?? undefined };

    if (link.usedAt) return { success: false, code: "USED", ...base };
    if (link.expiresAt <= now) return { success: false, code: "EXPIRED", ...base };

    // Permohonan harus masih berstatus disetujui
    if (link.lead.approvalStatus !== "APPROVED") return { success: false, code: "INVALID", ...base };

    // Tautan terikat ke satu akun demo sejak dibuat. Tidak ada pencarian berdasarkan email,
    // sehingga tautan tidak dapat dipakai untuk masuk ke akun lain (mis. akun admin).
    const user = link.user;
    if (!user) return { success: false, code: "INVALID", ...base };
    if (!isDemoRole(user.role?.name)) return { success: false, code: "INVALID", ...base };
    if (user.email.toLowerCase() !== link.email.toLowerCase()) {
      return { success: false, code: "INVALID", ...base };
    }
    if (user.status !== 1) return { success: false, code: "ACCOUNT_INACTIVE", ...base };
    if (user.demoExpiresAt && user.demoExpiresAt <= now) {
      return { success: false, code: "DEMO_EXPIRED", ...base };
    }

    // Klaim atomik: hanya satu request yang mendapatkan count = 1
    const claimed = await tx.demoMagicLink.updateMany({
      where: { id: link.id, usedAt: null, expiresAt: { gt: now } },
      data: {
        usedAt: now,
        ipAddress: meta.ipAddress ? meta.ipAddress.substring(0, 50) : null,
        userAgent: meta.userAgent ? meta.userAgent.substring(0, 255) : null,
      },
    });
    if (claimed.count !== 1) return { success: false, code: "USED", ...base };

    // Aktivasi masa demo saat login pertama
    let demoExpiresAt = user.demoExpiresAt;
    let firstLogin = false;

    if (!user.demoActivatedAt) {
      const duration = isValidDemoDuration(link.lead.demoDurationDays)
        ? link.lead.demoDurationDays
        : DEFAULT_DEMO_DURATION_DAYS;
      const expiry = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

      const activated = await tx.user.updateMany({
        where: { id: user.id, demoActivatedAt: null },
        data: { demoActivatedAt: now, demoExpiresAt: expiry, demoDurationDays: duration },
      });

      if (activated.count === 1) {
        firstLogin = true;
        demoExpiresAt = expiry;
      } else {
        // Diaktifkan oleh request lain (tautan berbeda) pada saat bersamaan
        const fresh = await tx.user.findUnique({ where: { id: user.id } });
        demoExpiresAt = fresh?.demoExpiresAt ?? expiry;
      }
    }

    if (!demoExpiresAt) {
      throw new Error("Masa demo tidak dapat ditentukan.");
    }

    // Status lead -> Jadwal Demo, hanya dari Baru/Dihubungi (tidak pernah mundur, idempoten)
    await tx.lead.updateMany({
      where: { id: link.leadId, status: { in: [LEAD_STATUS.NEW, LEAD_STATUS.CONTACTED] } },
      data: { status: LEAD_STATUS.SCHEDULED },
    });
    // Cerminan masa berlaku demo pada lead (satu nilai: users.demo_expires_at)
    await tx.lead.update({
      where: { id: link.leadId },
      data: { userId: user.id, voucherExpiry: demoExpiresAt },
    });

    return {
      success: true,
      leadId: link.leadId,
      firstLogin,
      demoExpiresAt,
      session: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: DEMO_ROLE_NAME,
        demoExpiresAt: demoExpiresAt.toISOString(),
      },
    };
  });
}
