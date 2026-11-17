import { db } from "@/lib/db";
import { approveLead } from "@/lib/models/lead.model";
import { evaluateMagicLinkEligibility, type MagicLinkEligibility } from "@/lib/magic-link-eligibility";

export { evaluateMagicLinkEligibility };
export type { MagicLinkEligibility };

/**
 * Magic Link dari menu Manajemen Pengguna.
 *
 * Dua jalur pembuatan akun USER dibedakan dengan tegas:
 *  A. Dari permohonan demo (Lead) → admin menyetujui → Magic Link dibuat. Hanya akun dengan
 *     Lead berstatus APPROVED yang boleh menerima Magic Link; tombol di Manajemen Pengguna
 *     menerbitkan ULANG tautan untuk Lead tersebut (alur & aturan sama dengan menu Permohonan Demo).
 *  B. Dibuat manual oleh admin (tanpa Lead) → TIDAK ada Magic Link. Akun tidak pernah dianggap
 *     sebagai permohonan yang disetujui; undangan manual adalah fitur terpisah yang menunggu
 *     keputusan bisnis.
 * Aturan dievaluasi di backend; UI hanya menampilkan hasilnya.
 */

const userWithLeads = {
  role: true,
  leads: { select: { id: true, approvalStatus: true, createdAt: true } },
} as const;

export async function getMagicLinkEligibility(userId: string): Promise<MagicLinkEligibility> {
  const user = await db.user.findUnique({ where: { id: userId }, include: userWithLeads });
  if (!user) return { eligible: false, code: "NOT_FOUND", reason: "Pengguna tidak ditemukan." };
  return evaluateMagicLinkEligibility({ roleName: user.role?.name, status: user.status, demoExpiresAt: user.demoExpiresAt, leads: user.leads });
}

/**
 * Menerbitkan ulang Magic Link untuk akun USER yang memiliki Lead APPROVED. Durasi & jadwal
 * demo TIDAK diubah (memakai nilai Lead yang sudah disetujui). Tautan lama otomatis nonaktif.
 */
export async function reissueMagicLinkForUser(userId: string, approvedBy: string) {
  const eligibility = await getMagicLinkEligibility(userId);
  if (!eligibility.eligible) return { ok: false as const, eligibility };
  const lead = await db.lead.findUnique({
    where: { id: eligibility.leadId },
    select: { id: true, demoDurationDays: true, confirmedDemoDate: true },
  });
  if (!lead) return { ok: false as const, eligibility: { eligible: false as const, code: "NOT_FOUND" as const, reason: "Permohonan demo tidak ditemukan." } };
  const result = await approveLead(lead.id, {
    durationDays: lead.demoDurationDays,
    confirmedDemoDate: lead.confirmedDemoDate ? lead.confirmedDemoDate.toISOString() : null,
    approvedBy,
  });
  return { ok: true as const, leadId: lead.id, magicLinkUrl: result.magicLinkUrl, expiresAt: result.expiresAt };
}
