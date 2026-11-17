/**
 * Tujuan akses demo setelah klien berhasil masuk melalui Magic Link.
 *
 * SEMENTARA: aplikasi LIS yang akan didemonstrasikan belum memiliki URL. Selama itu klien
 * diarahkan ke DEFAULT_DEMO_ACCESS_URL. Ini BUKAN aplikasi LIS; ketika URL LIS asli tersedia,
 * cukup set environment variable DEMO_ACCESS_URL (tanpa perubahan kode), mis.
 *   DEMO_ACCESS_URL=https://lis-demo.example.com/
 */
export const DEFAULT_DEMO_ACCESS_URL = "https://website-diagnova.vercel.app/";

/** URL tujuan demo yang valid (https; http hanya untuk localhost saat pengembangan). */
export function getDemoAccessUrl(): string {
  const raw = (process.env.DEMO_ACCESS_URL || "").trim();
  if (!raw) return DEFAULT_DEMO_ACCESS_URL;
  try {
    const url = new URL(raw);
    const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol === "https:" || (url.protocol === "http:" && isLocal && process.env.NODE_ENV !== "production")) {
      return url.toString();
    }
  } catch {
    // jatuh ke default di bawah
  }
  console.warn("DEMO_ACCESS_URL tidak valid (harus https://...). Memakai URL demo sementara bawaan.");
  return DEFAULT_DEMO_ACCESS_URL;
}
