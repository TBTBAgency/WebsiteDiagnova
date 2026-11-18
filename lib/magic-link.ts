import crypto from "crypto";
import { LeadApprovalStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { AuthSessionPayload } from "@/types";
import { setSessionCookie } from "@/lib/auth-session";
import { recordAuditLog } from "@/lib/models/audit.model";
import { LEAD_STATUS, transitionLeadStatus } from "@/lib/models/lead.model";
import { buildMagicLinkUrl, getAppBaseUrl } from "@/lib/app-url";
import { getDemoAccessUrl } from "@/lib/demo-access";

export const MAGIC_LINK_TTL_HOURS = 24;

export interface MagicLinkCreationResult {
  rawToken: string;
  magicLinkUrl: string;
  expiresAt: Date;
}

/** Alasan kegagalan magic link (dipakai sebagai kode di URL & pesan UI). */
export type MagicLinkFailureReason =
  | "missing"
  | "invalid"
  | "used"
  | "link_expired"
  | "not_approved"
  | "account_inactive"
  | "account_forbidden"
  | "demo_expired";

export const MAGIC_LINK_FAILURE_MESSAGES: Record<MagicLinkFailureReason, string> = {
  missing: "Tautan akses demo tidak memiliki token verifikasi yang valid.",
  invalid: "Tautan magic link tidak valid atau tidak ditemukan.",
  used: "Tautan ini baru saja dipakai oleh permintaan lain. Muat ulang halaman tautan lalu coba masuk kembali.",
  link_expired:
    "Tautan magic link telah kedaluwarsa, dicabut, atau sudah digantikan tautan yang lebih baru. Hubungi tim Diagnova untuk mendapatkan tautan baru.",
  not_approved: "Permohonan demo untuk tautan ini tidak lagi aktif. Hubungi tim Diagnova untuk informasi lebih lanjut.",
  account_inactive: "Akun demo Anda sedang dinonaktifkan. Hubungi tim Diagnova untuk informasi lebih lanjut.",
  account_forbidden: "Tautan ini tidak dapat digunakan untuk akun tersebut.",
  demo_expired:
    "Masa aktif akun demo Anda telah berakhir. Terima kasih telah mencoba Diagnova. Hubungi tim kami untuk perpanjangan atau lisensi penuh.",
};

export type VerifyMagicLinkResult =
  | { success: true; sessionPayload: AuthSessionPayload; redirectUrl: string }
  | { success: false; reason: MagicLinkFailureReason; message: string };

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
}

function fail(reason: MagicLinkFailureReason): VerifyMagicLinkResult {
  return { success: false, reason, message: MAGIC_LINK_FAILURE_MESSAGES[reason] };
}

/**
 * Membuat token Magic Link (32 byte acak; hanya hash SHA-256 yang disimpan).
 * Tautan lama yang belum terpakai untuk lead yang sama otomatis dinonaktifkan,
 * sehingga hanya tautan terbaru yang berlaku. Riwayatnya tetap tersimpan.
 */
export async function createDemoMagicLink(
  leadId: string,
  email: string,
  userId?: string | null,
  expiresInHours: number = MAGIC_LINK_TTL_HOURS
): Promise<MagicLinkCreationResult> {
  // Validasi base URL lebih dulu: bila konfigurasi salah (mis. localhost di production),
  // tidak ada token yang dibuat dan tautan lama tidak dinonaktifkan.
  getAppBaseUrl();

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000);

  await db.$transaction([
    // Semua tautan lama lead ini dicabut — termasuk tautan yang sudah dipakai dan masih dapat
    // dipakai untuk masuk kembali — sehingga hanya tautan terbaru yang berlaku.
    db.demoMagicLink.updateMany({
      where: { leadId, expiresAt: { gt: now } },
      data: { expiresAt: now },
    }),
    db.demoMagicLink.create({
      data: {
        tokenHash,
        email: email.toLowerCase().trim(),
        leadId,
        userId: userId || null,
        expiresAt,
      },
    }),
  ]);

  const magicLinkUrl = buildMagicLinkUrl(rawToken);

  return { rawToken, magicLinkUrl, expiresAt };
}

/**
 * Mengambil magic link aktif terakhir untuk suatu lead
 */
export async function getLatestMagicLinkForLead(leadId: string) {
  return db.demoMagicLink.findFirst({
    where: { leadId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Memeriksa status token TANPA mengonsumsinya. Dipakai oleh halaman GET agar
 * crawler / pemindai tautan email tidak menghabiskan token sekali pakai.
 */
export async function inspectMagicLink(
  rawToken: string | undefined
): Promise<
  | { valid: true; leadName: string; institution: string; returning: boolean; accessExpiresAt: string | null }
  | { valid: false; reason: MagicLinkFailureReason }
> {
  if (!rawToken || !/^[a-f0-9]{64}$/i.test(rawToken.trim())) {
    return { valid: false, reason: rawToken ? "invalid" : "missing" };
  }
  const record = await db.demoMagicLink.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: {
      lead: { select: { name: true, institution: true, approvalStatus: true } },
      user: { select: { demoActivatedAt: true, demoExpiresAt: true } },
    },
  });
  if (!record) return { valid: false, reason: "invalid" };
  const now = new Date();
  const accessEnded = !!(record.user?.demoActivatedAt && record.user.demoExpiresAt && now > record.user.demoExpiresAt);
  if (accessEnded) return { valid: false, reason: "demo_expired" };
  if (now > record.expiresAt) return { valid: false, reason: "link_expired" };
  if (record.lead.approvalStatus !== LeadApprovalStatus.APPROVED) return { valid: false, reason: "not_approved" };
  return {
    valid: true,
    leadName: record.lead.name,
    institution: record.lead.institution,
    returning: record.usedAt !== null,
    accessExpiresAt: record.usedAt && record.user?.demoExpiresAt ? record.user.demoExpiresAt.toISOString() : null,
  };
}

/**
 * Memverifikasi dan mengonsumsi Magic Link (dipanggil HANYA dari aksi POST eksplisit).
 *
 * Aturan:
 *  - Token sekali pakai; konsumsi dilakukan atomik (aman dari race / klik ganda).
 *  - Kegagalan login tidak mengubah status lead.
 *  - Login pertama yang berhasil memindahkan lead Dihubungi (2) -> Jadwal Demo (3);
 *    login berikutnya tidak menimbulkan transisi baru.
 *  - Kedaluwarsa akses demo tidak mengubah status lead.
 */
export async function verifyAndConsumeMagicLink(
  rawToken: string,
  clientIp?: string,
  userAgent?: string
): Promise<VerifyMagicLinkResult> {
  if (!rawToken || rawToken.trim() === "") return fail("missing");
  if (!/^[a-f0-9]{64}$/i.test(rawToken.trim())) return fail("invalid");

  const magicRecord = await db.demoMagicLink.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { lead: true, user: { include: { role: true } } },
  });

  if (!magicRecord) return fail("invalid");

  const auditFailure = async (reason: MagicLinkFailureReason) => {
    await recordAuditLog({
      userId: magicRecord.userId,
      action: "MAGIC_LINK_FAILED",
      entity: "Lead",
      recordId: magicRecord.leadId,
      newValue: { reason, magicLinkId: magicRecord.id },
      ipAddress: clientIp,
      userAgent,
    });
    return fail(reason);
  };

  const now = new Date();

  // Pastikan akun klien tersedia dan memang akun USER yang aktif
  let user = magicRecord.user;
  if (!user) {
    user = await db.user.findUnique({ where: { email: magicRecord.email }, include: { role: true } });
  }

  if (user && user.role?.name !== "USER") return auditFailure("account_forbidden");
  if (user && user.status !== 1) return auditFailure("account_inactive");
  // Masa akses habis: mekanisme akses demo tidak dapat dipakai lagi (status lead TIDAK diubah).
  if (user?.demoActivatedAt && user.demoExpiresAt && now > user.demoExpiresAt) {
    return auditFailure("demo_expired");
  }
  if (now > magicRecord.expiresAt) return auditFailure("link_expired");
  if (magicRecord.lead.approvalStatus !== LeadApprovalStatus.APPROVED) return auditFailure("not_approved");

  // LOGIN ULANG: tautan yang sudah aktif dapat dipakai lagi selama masa akses berlaku
  // (expiresAt tautan = akhir masa akses; dicabut bila ada tautan baru / penolakan).
  // Tidak ada perubahan status lead dan tidak ada perubahan masa akses.
  if (magicRecord.usedAt !== null) {
    if (!user || !user.demoActivatedAt || !user.demoExpiresAt) return auditFailure("invalid");
    await recordAuditLog({
      userId: user.id,
      action: "MAGIC_LINK_RELOGIN",
      entity: "Lead",
      recordId: magicRecord.leadId,
      newValue: { magicLinkId: magicRecord.id },
      ipAddress: clientIp,
      userAgent,
    });
    const sessionPayload: AuthSessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || "USER",
      demoExpiresAt: user.demoExpiresAt.toISOString(),
    };
    await setSessionCookie(sessionPayload);
    return { success: true, sessionPayload, redirectUrl: getDemoAccessUrl() };
  }

  // Konsumsi token secara atomik: hanya satu request yang bisa berhasil
  const consumed = await db.demoMagicLink.updateMany({
    where: { id: magicRecord.id, usedAt: null, expiresAt: { gt: now } },
    data: {
      usedAt: now,
      ipAddress: clientIp ? clientIp.slice(0, 50) : null,
      userAgent: userAgent ? userAgent.slice(0, 255) : null,
    },
  });
  if (consumed.count !== 1) return auditFailure("used");

  if (!user) {
    const targetRole =
      (await db.role.findFirst({ where: { name: "USER" } })) ||
      (await db.role.create({
        data: { name: "USER", description: "Pengguna terdaftar / pemohon akses demo Diagnova" },
      }));

    user = await db.user.create({
      data: {
        name: magicRecord.lead.name,
        email: magicRecord.email,
        institution: magicRecord.lead.institution,
        jobTitle: magicRecord.lead.jobTitle,
        phone: magicRecord.lead.phone,
        roleId: targetRole.id,
        status: 1,
      },
      include: { role: true },
    });
  }

  await db.demoMagicLink.update({ where: { id: magicRecord.id }, data: { userId: user.id } });
  if (magicRecord.lead.userId !== user.id) {
    await db.lead.update({ where: { id: magicRecord.leadId }, data: { userId: user.id } });
  }

  // Masa aktif akun demo dihitung sejak aktivasi pertama
  let demoExpiresAt = user.demoExpiresAt;
  if (!user.demoActivatedAt) {
    const durationDays = magicRecord.lead.demoDurationDays || user.demoDurationDays || 7;
    demoExpiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    await db.user.update({
      where: { id: user.id },
      data: { demoDurationDays: durationDays, demoActivatedAt: now, demoExpiresAt },
    });
    await recordAuditLog({
      userId: user.id,
      action: "DEMO_ACCESS_ACTIVATED",
      entity: "Lead",
      recordId: magicRecord.leadId,
      newValue: { durationDays, demoExpiresAt: demoExpiresAt.toISOString() },
      ipAddress: clientIp,
      userAgent,
    });
  }

  // Setelah aktif, tautan yang sama berlaku untuk masuk kembali sampai masa akses berakhir.
  if (demoExpiresAt) {
    await db.demoMagicLink.updateMany({
      where: { id: magicRecord.id, usedAt: { not: null } },
      data: { expiresAt: demoExpiresAt },
    });
  }

  await recordAuditLog({
    userId: user.id,
    action: "MAGIC_LINK_CONSUMED",
    entity: "Lead",
    recordId: magicRecord.leadId,
    newValue: { magicLinkId: magicRecord.id },
    ipAddress: clientIp,
    userAgent,
  });

  // Login pertama yang berhasil: Dihubungi -> Jadwal Demo (atomik & idempoten)
  const transitioned = await transitionLeadStatus(
    magicRecord.leadId,
    LEAD_STATUS.CONTACTED,
    LEAD_STATUS.SCHEDULED
  );
  if (transitioned) {
    await recordAuditLog({
      userId: user.id,
      action: "LEAD_STATUS_CHANGED",
      entity: "Lead",
      recordId: magicRecord.leadId,
      oldValue: { status: LEAD_STATUS.CONTACTED },
      newValue: { status: LEAD_STATUS.SCHEDULED, trigger: "FIRST_MAGIC_LINK_LOGIN" },
      ipAddress: clientIp,
      userAgent,
    });
  }

  const sessionPayload: AuthSessionPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.name || "USER",
    demoExpiresAt: demoExpiresAt ? demoExpiresAt.toISOString() : undefined,
  };

  await setSessionCookie(sessionPayload);

  return { success: true, sessionPayload, redirectUrl: getDemoAccessUrl() };
}
