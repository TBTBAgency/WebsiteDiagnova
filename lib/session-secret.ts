/**
 * Secret penandatangan JWT sesi. Aman dipakai di Edge (middleware) maupun Node.
 *
 * Di production, AUTH_SECRET wajib di-set: tanpa itu aplikasi menolak menandatangani /
 * memverifikasi sesi (fail-closed), karena secret bawaan di source code dapat dipakai
 * siapa pun untuk memalsukan cookie sesi.
 */
const DEV_FALLBACK_SECRET = "diagnova-dev-only-insecure-secret";

let cached: Uint8Array | null = null;

export function getSessionSecret(): Uint8Array {
  if (cached) return cached;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET belum di-set (minimal 32 karakter) pada environment production.");
    }
    cached = new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
    return cached;
  }

  cached = new TextEncoder().encode(secret);
  return cached;
}
