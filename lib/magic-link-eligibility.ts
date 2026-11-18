/**
 * Aturan kelayakan Magic Link dari Manajemen Pengguna (fungsi murni, tanpa akses database).
 * Lihat lib/models/user-magic-link.model.ts untuk penjelasan dua jalur pembuatan akun.
 */
export type MagicLinkIneligibleCode =
  | "NOT_FOUND"
  | "NOT_CLIENT_ACCOUNT"
  | "ACCOUNT_INACTIVE"
  | "NO_DEMO_REQUEST"
  | "REQUEST_PENDING"
  | "REQUEST_REJECTED"
  | "DEMO_EXPIRED";

export type MagicLinkEligibility =
  | { eligible: true; leadId: string; reason: string }
  | { eligible: false; code: MagicLinkIneligibleCode; reason: string; leadId?: string };

interface EligibilityInput {
  roleName: string | null | undefined;
  status: number;
  demoExpiresAt: Date | null;
  leads: { id: string; approvalStatus: "PENDING" | "APPROVED" | "REJECTED"; createdAt: Date }[];
}

export function evaluateMagicLinkEligibility(u: EligibilityInput, now: Date = new Date()): MagicLinkEligibility {
  if (u.roleName !== "USER") {
    return { eligible: false, code: "NOT_CLIENT_ACCOUNT", reason: "Magic Link hanya untuk akun klien (USER)." };
  }
  if (u.status !== 1) {
    return { eligible: false, code: "ACCOUNT_INACTIVE", reason: "Akun nonaktif. Aktifkan akun terlebih dahulu." };
  }
  if (u.leads.length === 0) {
    return {
      eligible: false,
      code: "NO_DEMO_REQUEST",
      reason:
        "Akun dibuat manual tanpa permohonan demo. Magic Link hanya tersedia untuk permohonan demo yang sudah disetujui di menu Permohonan Demo.",
    };
  }
  const leads = [...u.leads].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const approved = leads.find((l) => l.approvalStatus === "APPROVED");
  if (!approved) {
    const pending = leads.find((l) => l.approvalStatus === "PENDING");
    return pending
      ? { eligible: false, code: "REQUEST_PENDING", leadId: pending.id, reason: "Permohonan demo belum disetujui. Setujui di menu Permohonan Demo." }
      : { eligible: false, code: "REQUEST_REJECTED", leadId: leads[0].id, reason: "Permohonan demo akun ini ditolak." };
  }
  if (u.demoExpiresAt && u.demoExpiresAt <= now) {
    return {
      eligible: false,
      code: "DEMO_EXPIRED",
      leadId: approved.id,
      reason: "Masa akses demo telah berakhir. Perpanjang akses melalui menu Permohonan Demo bila disetujui.",
    };
  }
  return { eligible: true, leadId: approved.id, reason: "Permohonan demo disetujui — tautan baru dapat diterbitkan." };
}
