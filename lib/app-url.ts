/**
 * Base URL publik aplikasi untuk tautan yang dikirim ke luar (Magic Link via WhatsApp/email).
 *
 * Urutan sumber (server-side, dibaca saat runtime):
 *   1. APP_URL                      — konfigurasi utama, mis. https://website-diagnova.vercel.app
 *   2. NEXT_PUBLIC_APP_URL          — kompatibilitas dengan konfigurasi lama
 *   3. VERCEL_PROJECT_PRODUCTION_URL (VERCEL_ENV=production) / VERCEL_URL (preview)
 *                                   — disediakan otomatis oleh Vercel, tanpa hardcode domain
 *   4. http://localhost:3000        — HANYA development lokal (NODE_ENV !== "production")
 *
 * Production tidak pernah menghasilkan URL localhost: bila hasilnya localhost/loopback,
 * fungsi ini melempar AppUrlConfigError sehingga Magic Link tidak dibuat sama sekali.
 * Pengecualian satu-satunya: ALLOW_LOCALHOST_APP_URL=true untuk QA build production di
 * mesin lokal — dan pengecualian ini selalu ditolak bila berjalan di Vercel.
 */

export class AppUrlConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppUrlConfigError";
  }
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]", "::1"]);

function normalize(raw: string, source: string): URL {
  const value = raw.trim();
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
  if (hasScheme && !/^https?:\/\//i.test(value)) {
    throw new AppUrlConfigError(`${source} harus memakai http atau https.`);
  }
  const withScheme = hasScheme ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new AppUrlConfigError(`${source} bukan URL yang valid.`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new AppUrlConfigError(`${source} harus memakai http atau https.`);
  }
  return url;
}

function isLoopback(url: URL): boolean {
  return LOOPBACK_HOSTS.has(url.hostname.toLowerCase());
}

export function getAppBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  const isProduction = env.NODE_ENV === "production";
  const onVercel = env.VERCEL === "1";

  let url: URL | null = null;
  let source = "";

  if (env.APP_URL?.trim()) {
    source = "APP_URL";
    url = normalize(env.APP_URL, source);
  } else if (env.NEXT_PUBLIC_APP_URL?.trim()) {
    source = "NEXT_PUBLIC_APP_URL";
    url = normalize(env.NEXT_PUBLIC_APP_URL, source);
  } else if (onVercel) {
    const host =
      env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL
        ? env.VERCEL_PROJECT_PRODUCTION_URL
        : env.VERCEL_URL;
    if (host?.trim()) {
      source = "VERCEL_URL";
      url = normalize(host, source);
    }
  }

  if (!url) {
    if (isProduction || onVercel) {
      throw new AppUrlConfigError("APP_URL belum dikonfigurasi pada environment production.");
    }
    return "http://localhost:3000";
  }

  if ((isProduction || onVercel) && isLoopback(url)) {
    const allowLocal = !onVercel && env.ALLOW_LOCALHOST_APP_URL === "true";
    if (!allowLocal) {
      throw new AppUrlConfigError(`${source} menunjuk ke localhost; tidak diizinkan pada production.`);
    }
  }

  if ((isProduction || onVercel) && !isLoopback(url) && url.protocol !== "https:") {
    throw new AppUrlConfigError(`${source} harus memakai https pada production.`);
  }

  // Hanya origin (tanpa path / query / trailing slash) agar route tujuan selalu konsisten.
  return url.origin;
}

/** URL halaman verifikasi Magic Link. Token hanya disisipkan sebagai query parameter. */
export function buildMagicLinkUrl(rawToken: string, env: NodeJS.ProcessEnv = process.env): string {
  const url = new URL("/auth/verify-magic-link", getAppBaseUrl(env));
  url.searchParams.set("token", rawToken);
  return url.toString();
}
