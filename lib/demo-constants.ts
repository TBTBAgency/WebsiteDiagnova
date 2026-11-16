// Konstanta akses demo & status lead. Tanpa dependensi server (aman diimpor komponen client).

/** Durasi akses demo yang disepakati (hari). */
export const DEMO_DURATION_OPTIONS = [3, 7, 14, 30] as const;
export type DemoDurationDays = (typeof DEMO_DURATION_OPTIONS)[number];
export const DEFAULT_DEMO_DURATION_DAYS: DemoDurationDays = 7;

export function isValidDemoDuration(days: unknown): days is DemoDurationDays {
  return typeof days === "number" && (DEMO_DURATION_OPTIONS as readonly number[]).includes(days);
}

/** Status CRM lead (sumber kebenaran tunggal: kolom leads.status). */
export const LEAD_STATUS = {
  NEW: 1, // Baru
  CONTACTED: 2, // Dihubungi
  SCHEDULED: 3, // Jadwal Demo  -> saat client berhasil login demo pertama kali
  COMPLETED: 4, // Selesai      -> saat masa akses demo berakhir
} as const;
