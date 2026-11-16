// Utilitas waktu bisnis. Zona operasional: Asia/Jakarta (UTC+7, tanpa DST). Database menyimpan timestamptz (UTC).

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" (tanggal kalender WIB) -> awal hari tersebut sebagai instan UTC. null bila format salah. */
export function jakartaDayStart(dateStr: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr ?? "");
  if (!m) return null;
  const utcMidnight = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(utcMidnight - JAKARTA_OFFSET_MS);
  return isNaN(d.getTime()) ? null : d;
}

/** Akhir hari kalender WIB (inklusif, presisi ms). */
export function jakartaDayEnd(dateStr: string): Date | null {
  const start = jakartaDayStart(dateStr);
  return start ? new Date(start.getTime() + DAY_MS - 1) : null;
}

/** Rentang bulan kalender WIB yang memuat `now`: [awal, awal bulan berikutnya). */
export function jakartaMonthRange(now: Date = new Date()): { start: Date; end: Date } {
  const local = new Date(now.getTime() + JAKARTA_OFFSET_MS);
  const y = local.getUTCFullYear();
  const mo = local.getUTCMonth();
  return {
    start: new Date(Date.UTC(y, mo, 1) - JAKARTA_OFFSET_MS),
    end: new Date(Date.UTC(y, mo + 1, 1) - JAKARTA_OFFSET_MS),
  };
}

/** Kunci hari WIB "YYYY-MM-DD" untuk agregasi harian. */
export function jakartaDateKey(date: Date): string {
  return new Date(date.getTime() + JAKARTA_OFFSET_MS).toISOString().slice(0, 10);
}

export function formatJakarta(date: Date | string | null | undefined, withTime = true): string {
  if (!date) return "-";
  return new Date(date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    ...(withTime ? { timeStyle: "short" } : {}),
  });
}
