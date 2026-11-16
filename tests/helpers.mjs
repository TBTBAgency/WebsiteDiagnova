// Helper bersama untuk test integrasi (node:test, tanpa dependency tambahan).
//
// Wajib di-set:
//   TEST_BASE_URL     URL server yang sedang berjalan, mis. http://localhost:3006
//   DATABASE_URL      database KHUSUS test (nama database harus mengandung "test")
//   AUTH_SECRET       secret yang sama dengan server (untuk mensimulasikan cookie sesi palsu)
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const BASE = (process.env.TEST_BASE_URL || "").replace(/\/+$/, "");
if (!BASE) throw new Error("TEST_BASE_URL wajib di-set");

const dbUrl = process.env.DATABASE_URL || "";
const dbName = new URL(dbUrl).pathname.replace(/^\//, "");
if (!/test/i.test(dbName)) {
  throw new Error(`Menolak menjalankan test pada database "${dbName}" (nama harus mengandung "test")`);
}

export const db = new PrismaClient();

export const uid = () => crypto.randomBytes(6).toString("hex");

// IP klien unik per proses test: Next.js mengisi X-Forwarded-For dari koneksi, sehingga tanpa header ini
// seluruh test berbagi satu IP dan terkena pembatas laju (perilaku produksi yang memang diinginkan).
export const TEST_IP = `10.${crypto.randomInt(1, 250)}.${crypto.randomInt(1, 250)}.${crypto.randomInt(1, 250)}`;
export const ipHeader = (ip = TEST_IP) => ({ "x-forwarded-for": ip });
export const randomIp = () => `10.${crypto.randomInt(1, 250)}.${crypto.randomInt(1, 250)}.${crypto.randomInt(1, 250)}`;
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

// Akun ADMIN khusus test: dibuat/diperbarui di DB test dengan password acak per proses.
// Tidak ada password tetap di repository.
export const TEST_ADMIN_EMAIL = "admin-test@example.com";
const TEST_ADMIN_PASSWORD = crypto.randomBytes(18).toString("base64url");

/** Role berdasarkan KODE (ADMIN/USER). */
export async function getRoleByCode(code) {
  const role = await db.role.findUnique({ where: { code } });
  if (!role) throw new Error(`Role ${code} belum ada (jalankan migration)`);
  return role;
}

/** Role berdasarkan nama (dipakai untuk role lama tanpa kode, mis. "Sales Admin"). */
export async function getRole(name) {
  return db.role.upsert({ where: { name }, update: {}, create: { name, description: `${name} (test)` } });
}

export async function ensureTestAdmin() {
  const role = await getRoleByCode("ADMIN");
  const passwordHash = await bcrypt.hash(TEST_ADMIN_PASSWORD, 10);
  return db.user.upsert({
    where: { email: TEST_ADMIN_EMAIL },
    update: { passwordHash, roleId: role.id, status: "ACTIVE", deletedAt: null },
    create: { name: "Admin Test", email: TEST_ADMIN_EMAIL, passwordHash, roleId: role.id, status: "ACTIVE" },
  });
}

export async function loginAdmin(email = TEST_ADMIN_EMAIL, password = TEST_ADMIN_PASSWORD) {
  if (email === TEST_ADMIN_EMAIL) await ensureTestAdmin();
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", ...ipHeader() },
    body: JSON.stringify({ email, password }),
  });
  const token = sessionFromResponse(res);
  if (res.status !== 200 || !token) throw new Error(`Login admin gagal: ${res.status}`);
  return token;
}

/** Membuat user langsung di DB. roleCode: "ADMIN" | "USER"; roleName untuk role lama. */
export async function createUser({ roleCode, roleName, status = "ACTIVE", ...rest } = {}) {
  const role = roleCode ? await getRoleByCode(roleCode) : roleName ? await getRole(roleName) : null;
  return db.user.create({
    data: {
      name: rest.name ?? `Test ${uid()}`,
      email: rest.email ?? `user-${uid()}@example.com`,
      roleId: role?.id ?? null,
      status,
      passwordHash: rest.passwordHash ?? null,
      deletedAt: rest.deletedAt ?? null,
    },
  });
}

/** Membersihkan data test sesuai urutan FK (audit log append-only tidak dihapus). */
export async function cleanup({ leadIds = [], userIds = [] } = {}) {
  const accessWhere = { OR: [{ leadId: { in: leadIds } }, { userId: { in: userIds } }] };
  await db.demoMagicLink.deleteMany({ where: { demoAccess: accessWhere } });
  await db.demoAccess.deleteMany({ where: { extendsAccessId: { not: null }, ...accessWhere } });
  await db.demoAccess.deleteMany({ where: accessWhere });
  await db.lead.deleteMany({ where: { OR: [{ id: { in: leadIds } }, { userId: { in: userIds } }] } });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
}

export const json = (method, path, token, body) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...ipHeader(), ...(token ? cookieHeader(token) : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
