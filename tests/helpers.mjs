// Helper bersama untuk test integrasi (node:test, tanpa dependency tambahan).
//
// Wajib di-set:
//   TEST_BASE_URL     URL server yang sedang berjalan, mis. http://localhost:3006
//   DATABASE_URL      database KHUSUS test (nama database harus mengandung "test")
//   AUTH_SECRET       secret yang sama dengan server (untuk mensimulasikan cookie sesi palsu)
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import crypto from "node:crypto";

export const BASE = (process.env.TEST_BASE_URL || "").replace(/\/+$/, "");
if (!BASE) throw new Error("TEST_BASE_URL wajib di-set");

const dbUrl = process.env.DATABASE_URL || "";
const dbName = new URL(dbUrl).pathname.replace(/^\//, "");
if (!/test/i.test(dbName)) {
  throw new Error(`Menolak menjalankan test pada database "${dbName}" (nama harus mengandung "test")`);
}

export const db = new PrismaClient();

export const uid = () => crypto.randomBytes(6).toString("hex");

// Path login admin yang berlaku di server uji (sama dengan ADMIN_LOGIN_PATH server). Default development: /admin/login.
export const ADMIN_LOGIN_PATH = process.env.TEST_ADMIN_LOGIN_PATH || "/admin/login";
export const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

export async function signSession(payload) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET wajib di-set untuk test");
  return new SignJWT({ name: "test", email: "test@test.local", ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));
}

export function cookieHeader(token) {
  return { cookie: `diagnova_session=${token}` };
}

/** Ambil nilai cookie sesi dari response (Set-Cookie). */
export function sessionFromResponse(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const c of raw) {
    const m = c.match(/^diagnova_session=([^;]*)/);
    if (m && m[1]) return m[1];
  }
  return null;
}

export async function loginAdmin(email = "admin@diagnova.id", password = "Diagnova2026!") {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const token = sessionFromResponse(res);
  if (res.status !== 200 || !token) throw new Error(`Login admin gagal: ${res.status}`);
  return token;
}

export async function getRole(name) {
  const role = await db.role.upsert({
    where: { name },
    update: {},
    create: { name, description: `${name} (test)` },
  });
  return role;
}

/** Membuat user langsung di DB untuk skenario test. */
export async function createUser({ roleName, status = 1, ...rest } = {}) {
  const role = roleName ? await getRole(roleName) : null;
  return db.user.create({
    data: {
      name: rest.name ?? `Test ${uid()}`,
      email: rest.email ?? `user-${uid()}@test.local`,
      roleId: role?.id ?? null,
      status,
      demoActivatedAt: rest.demoActivatedAt ?? null,
      demoExpiresAt: rest.demoExpiresAt ?? null,
      demoDurationDays: rest.demoDurationDays ?? null,
    },
  });
}
