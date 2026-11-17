/**
 * Edge-safe helpers shared by middleware (Edge runtime) and server code (Node runtime).
 * Do not import Node-only modules (crypto, prisma, fs) here.
 */

const DEV_FALLBACK_SECRET = "diagnova-dev-only-secret-do-not-use-in-production";

let cachedSecret: Uint8Array | null = null;

/**
 * Returns the HMAC key used to sign/verify session JWTs.
 * In production AUTH_SECRET is mandatory (min 32 chars); a hardcoded fallback is only
 * allowed outside production so local development keeps working.
 */
export function getJwtSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET wajib diisi (minimal 32 karakter) pada environment production.");
    }
    cachedSecret = new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
    return cachedSecret;
  }

  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}

/** Role names that are allowed into the admin area ("Super Admin" kept for legacy sessions). */
export const ADMIN_ROLE_NAMES = ["ADMIN", "Super Admin"] as const;

export function isAdminRole(role: unknown): boolean {
  return typeof role === "string" && (ADMIN_ROLE_NAMES as readonly string[]).includes(role);
}
