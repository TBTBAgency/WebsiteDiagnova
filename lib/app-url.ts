/**
 * Base URL publik aplikasi untuk tautan yang dikirim ke luar (magic link, email).
 *
 * Urutan: APP_BASE_URL (server-only, dibaca saat runtime) -> NEXT_PUBLIC_APP_URL.
 * Di production wajib di-set; tidak ada fallback ke localhost agar tautan yang dikirim
 * ke client tidak pernah mengarah ke host yang salah.
 */
export function getAppBaseUrl(): string {
  const raw = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "";

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("APP_BASE_URL / NEXT_PUBLIC_APP_URL belum di-set pada environment production.");
    }
    return "http://localhost:3000";
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("APP_BASE_URL / NEXT_PUBLIC_APP_URL bukan URL yang valid.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("APP_BASE_URL harus menggunakan http atau https.");
  }

  return url.origin;
}
