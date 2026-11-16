import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthSessionPayload } from "@/types";
import { getSessionSecret } from "@/lib/session-secret";

const SESSION_COOKIE_NAME = "diagnova_session";

export const SESSION_DURATION_HOURS = 24;

/**
 * Membuat JWT token untuk sesi pengguna
 */
export async function signSessionToken(
  payload: AuthSessionPayload,
  maxAgeSeconds: number = SESSION_DURATION_HOURS * 60 * 60
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${Math.max(1, Math.floor(maxAgeSeconds))}s`)
    .sign(getSessionSecret());
}

/**
 * Memverifikasi JWT token sesi
 */
export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return payload as unknown as AuthSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Menyimpan sesi login ke dalam HTTP-Only Cookie yang aman
 */
export async function setSessionCookie(
  payload: AuthSessionPayload,
  options: { notAfter?: Date } = {}
): Promise<void> {
  // Sesi tidak pernah berlaku lebih lama dari 24 jam maupun dari batas `notAfter` (mis. akhir masa demo)
  let maxAgeSeconds = SESSION_DURATION_HOURS * 60 * 60;
  if (options.notAfter) {
    const remaining = Math.floor((options.notAfter.getTime() - Date.now()) / 1000);
    maxAgeSeconds = Math.max(1, Math.min(maxAgeSeconds, remaining));
  }

  const token = await signSessionToken(payload, maxAgeSeconds);
  setSessionCookieToken(token, maxAgeSeconds);
}

/**
 * Menyetel cookie sesi dari token yang SUDAH ditandatangani (mis. di dalam transaksi login demo).
 */
export function setSessionCookieToken(token: string, maxAgeSeconds: number): void {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

/**
 * Mengambil informasi sesi aktif dari cookie browser
 */
export async function getCurrentSession(): Promise<AuthSessionPayload | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

/**
 * Menghapus sesi login saat logout
 */
export async function removeSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
