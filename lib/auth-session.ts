import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthSessionPayload } from "@/types";

const SESSION_COOKIE_NAME = "diagnova_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "diagnova-super-secret-key-production-change-this-2026-xyz"
);

const SESSION_DURATION_HOURS = 24;

/**
 * Membuat JWT token untuk sesi pengguna
 */
export async function signSessionToken(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_HOURS}h`)
    .sign(JWT_SECRET);
}

/**
 * Memverifikasi JWT token sesi
 */
export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Menyimpan sesi login ke dalam HTTP-Only Cookie yang aman
 */
export async function setSessionCookie(payload: AuthSessionPayload): Promise<void> {
  const token = await signSessionToken(payload);
  const cookieStore = cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
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
