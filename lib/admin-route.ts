/**
 * Penyembunyian area admin (dipakai middleware — aman untuk Edge runtime, tanpa Prisma).
 *
 * - Halaman login admin hanya dapat dibuka lewat path rahasia dari env ADMIN_LOGIN_PATH
 *   (mis. "/masuk-7f3k9q2x"). Nilai ini hanya dibaca server, tidak pernah dikirim ke browser.
 * - Seluruh /admin/* bagi pengunjung yang bukan ADMIN menghasilkan 404 yang sama dengan halaman
 *   yang tidak ada, sehingga keberadaan area admin tidak terungkap.
 *
 * Catatan: ini lapisan tambahan (mengurangi penemuan). Keamanan data tetap ditegakkan di server
 * oleh requireAdmin() pada setiap API admin/LIS.
 */

/** Segmen top-level yang sudah dipakai aplikasi dan tidak boleh dijadikan path login. */
const RESERVED_SEGMENTS = new Set([
  "admin", "api", "auth", "demo", "demo-expired", "uploads", "images", "_next",
  "platform", "solutions", "modules", "nova-ai", "integration", "request-demo",
  "sitemap.xml", "robots.txt", "favicon.ico",
]);

/** Path login rahasia yang valid, atau null bila tidak di-set / tidak valid. */
export function getAdminLoginPath(): string | null {
  const raw = (process.env.ADMIN_LOGIN_PATH || "").trim();
  if (!raw) return null;
  // Satu segmen, 8–64 karakter huruf/angka/-/_ ; sulit ditebak dan tidak bentrok dengan rute lain.
  const m = /^\/([A-Za-z0-9_-]{8,64})$/.exec(raw);
  if (!m || RESERVED_SEGMENTS.has(m[1].toLowerCase())) return null;
  return raw;
}

/**
 * Path login yang berlaku:
 * - ADMIN_LOGIN_PATH valid -> path tersebut (/admin/login langsung = 404);
 * - tidak di-set di development -> "/admin/login" (agar pengembangan lokal tetap jalan);
 * - tidak di-set di production -> null (login admin tidak tersedia sampai env diisi; fail-closed).
 */
export function getEffectiveAdminLoginPath(): string | null {
  const configured = getAdminLoginPath();
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : "/admin/login";
}

export function isAdminAreaPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
