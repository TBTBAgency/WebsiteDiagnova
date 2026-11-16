// Konstanta workflow Lead & akses demo. Tanpa dependensi server (aman diimpor komponen client).

/** Durasi akses demo yang disepakati (hari). */
export const DEMO_DURATION_OPTIONS = [3, 7, 14, 30] as const;
export type DemoDurationDays = (typeof DEMO_DURATION_OPTIONS)[number];
export const DEFAULT_DEMO_DURATION_DAYS: DemoDurationDays = 7;

export function isValidDemoDuration(days: unknown): days is DemoDurationDays {
  return typeof days === "number" && (DEMO_DURATION_OPTIONS as readonly number[]).includes(days);
}

/**
 * Tahap Lead (sumber kebenaran: kolom leads.status, enum lead_stage).
 *  CONTACTED  Dihubungi    — form tervalidasi & tersimpan (otomatis)
 *  SCHEDULED  Jadwal Demo  — login demo pertama berhasil (otomatis)
 *  COMPLETED  Selesai      — admin mengonfirmasi demo telah dilaksanakan ("Tandai Demo Selesai")
 * Berakhirnya masa akses TIDAK mengubah tahap Lead.
 */
export const LEAD_STAGES = ["CONTACTED", "SCHEDULED", "COMPLETED"] as const;
export type LeadStageCode = (typeof LEAD_STAGES)[number];

export const LEAD_STAGE_LABELS: Record<LeadStageCode, string> = {
  CONTACTED: "Dihubungi",
  SCHEDULED: "Jadwal Demo",
  COMPLETED: "Selesai",
};

export function isLeadStage(value: unknown): value is LeadStageCode {
  return typeof value === "string" && (LEAD_STAGES as readonly string[]).includes(value);
}

/** Status periode akses demo — DITURUNKAN dari timestamp, tidak disimpan. */
export type DemoAccessState = "PENDING_ACTIVATION" | "QUEUED" | "ACTIVE" | "EXPIRED" | "REVOKED";

export const DEMO_ACCESS_STATE_LABELS: Record<DemoAccessState, string> = {
  PENDING_ACTIVATION: "Menunggu aktivasi",
  QUEUED: "Perpanjangan terjadwal",
  ACTIVE: "Aktif",
  EXPIRED: "Berakhir",
  REVOKED: "Dicabut",
};

type DateLike = Date | string | null | undefined;
const toTime = (d: DateLike) => (d ? new Date(d).getTime() : null);

export function getDemoAccessState(
  access: { activatedAt: DateLike; expiresAt: DateLike; revokedAt: DateLike },
  now: Date = new Date()
): DemoAccessState {
  if (access.revokedAt) return "REVOKED";
  const activated = toTime(access.activatedAt);
  const expires = toTime(access.expiresAt);
  if (activated === null || expires === null) return "PENDING_ACTIVATION";
  if (now.getTime() < activated) return "QUEUED";
  if (now.getTime() >= expires) return "EXPIRED";
  return "ACTIVE";
}

/** Status tautan magic link — diturunkan dari timestamp. */
export type MagicLinkState = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

export function getMagicLinkState(
  link: { usedAt: DateLike; revokedAt?: DateLike; expiresAt: DateLike },
  now: Date = new Date()
): MagicLinkState {
  if (link.usedAt) return "USED";
  if (link.revokedAt) return "REVOKED";
  const expires = toTime(link.expiresAt);
  if (expires === null || expires <= now.getTime()) return "EXPIRED";
  return "ACTIVE";
}
