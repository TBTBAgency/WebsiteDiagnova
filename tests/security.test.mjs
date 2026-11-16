// Test Phase 1: hardening autentikasi, CSRF origin check, header keamanan.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { BASE, db, uid, getRoleByCode, signSession, cookieHeader, loginAdmin, ipHeader } from "./helpers.mjs";

const created = [];
after(async () => {
  await db.user.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

async function makeAdmin({ status = "ACTIVE" } = {}) {
  const password = `pw-${uid()}-${uid()}`;
  const role = await getRoleByCode("ADMIN");
  const user = await db.user.create({
    data: {
      name: "Sec Test",
      email: `sec-${uid()}@example.com`,
      passwordHash: await bcrypt.hash(password, 10),
      roleId: role.id,
      status,
    },
  });
  created.push(user.id);
  return { user, password };
}

const login = (email, password, headers = {}) =>
  fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", ...ipHeader(), ...headers },
    body: JSON.stringify({ email, password }),
  });

test("email tidak terdaftar & password salah -> pesan & status identik (tanpa enumerasi)", async () => {
  const { user } = await makeAdmin();
  const a = await login(`nobody-${uid()}@example.com`, "wrong-password-1");
  const b = await login(user.email, "wrong-password-1");
  assert.equal(a.status, 401);
  assert.equal(b.status, 401);
  assert.equal((await a.json()).message, (await b.json()).message);
});

test("akun nonaktif + password salah -> 401 (status akun tidak dibocorkan); password benar -> 403", async () => {
  const { user, password } = await makeAdmin({ status: "INACTIVE" });
  assert.equal((await login(user.email, "wrong-password-2")).status, 401);
  assert.equal((await login(user.email, password)).status, 403);
});

test("5 kegagalan per akun -> percobaan berikutnya 429 walau password benar", async () => {
  const { user, password } = await makeAdmin();
  for (let i = 0; i < 5; i++) assert.equal((await login(user.email, `bad-pass-${i}`)).status, 401);
  const res = await login(user.email, password);
  assert.equal(res.status, 429);
  assert.equal(res.headers.get("set-cookie"), null, "tidak boleh ada sesi");
});

test("20 kegagalan per IP (X-Forwarded-For) -> 429", async () => {
  // IP unik per run (audit log append-only, tidak dibersihkan)
  const ip = `198.18.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250) + 1}`;
  for (let i = 0; i < 20; i++) {
    const r = await login(`ip-${uid()}@example.com`, "x-wrong-pass", { "x-forwarded-for": ip });
    assert.equal(r.status, 401);
  }
  const r = await login(`ip-${uid()}@example.com`, "x-wrong-pass", { "x-forwarded-for": ip });
  assert.equal(r.status, 429);
});

test("POST lintas origin ke API ditolak 403; origin sama tetap diproses", async () => {
  const cross = await login("x@example.com", "whatever-pass", { origin: "https://evil.example" });
  assert.equal(cross.status, 403);
  const host = new URL(BASE).host;
  const same = await login(`same-${uid()}@example.com`, "whatever-pass", { origin: `http://${host}` });
  assert.equal(same.status, 401);
  const crossForm = await fetch(`${BASE}/api/request-demo`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://evil.example" },
    body: "{}",
  });
  assert.equal(crossForm.status, 403);
});

test("header keamanan terpasang di halaman publik & admin", async () => {
  for (const p of ["/", "/admin/login"]) {
    const res = await fetch(`${BASE}${p}`);
    assert.equal(res.headers.get("x-frame-options"), "DENY", p);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff", p);
    assert.match(res.headers.get("content-security-policy") || "", /frame-ancestors 'none'/, p);
  }
});

test("/api/auth/me memverifikasi DB: JWT valid milik akun nonaktif -> 401", async () => {
  const { user } = await makeAdmin({ status: "INACTIVE" });
  const token = await signSession({ userId: user.id, role: "ADMIN" });
  const res = await fetch(`${BASE}/api/auth/me`, { headers: cookieHeader(token) });
  assert.equal(res.status, 401);
});

test("/api/auth/me mengembalikan role dari DB, bukan dari JWT", async () => {
  const { user } = await makeAdmin();
  const token = await signSession({ userId: user.id, role: "Role Palsu" });
  const res = await fetch(`${BASE}/api/auth/me`, { headers: cookieHeader(token) });
  assert.equal(res.status, 200);
  const data = (await res.json()).data;
  assert.equal(data.role, "ADMIN");
  assert.equal(data.roleName, "Super Admin");
});

test("endpoint stub /notes sudah dihapus (404 untuk admin)", async () => {
  const token = await loginAdmin();
  const res = await fetch(`${BASE}/api/admin/leads/x/notes`, {
    method: "POST",
    headers: { "content-type": "application/json", ...cookieHeader(token) },
    body: "{}",
  });
  assert.equal(res.status, 404);
});

// Ditolak oleh trigger append-only (bila DB diakses sebagai pemilik/superuser, mis. lingkungan dev lama)
// atau lebih awal oleh izin tabel (role aplikasi diagnova_app dari prisma/sql/db-roles.sql). Keduanya penolakan DB.
const DENIED = /append-only|permission denied/;

test("audit_logs append-only: UPDATE/DELETE/TRUNCATE ditolak database", async () => {
  const row = await db.auditLog.findFirst({ orderBy: { createdAt: "desc" } });
  assert.ok(row);
  await assert.rejects(db.auditLog.update({ where: { id: row.id }, data: { action: "TAMPERED" } }), DENIED);
  await assert.rejects(db.auditLog.delete({ where: { id: row.id } }), DENIED);
  await assert.rejects(db.$executeRawUnsafe("TRUNCATE audit_logs"), DENIED);
  assert.equal((await db.auditLog.findUnique({ where: { id: row.id } }))?.action, row.action, "baris audit tidak berubah");
});

test("form publik: honeypot terisi -> 400 & tidak tersimpan; 5 permohonan per IP per jam -> 429", async () => {
  const ip = `198.19.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250) + 1}`;
  const body = (extra = {}) => JSON.stringify({
    name: "Rate Test", institution: "RS Uji", jobTitle: "Kepala Lab", email: `rate-${uid()}@example.com`,
    phone: "081234567890", institutionType: "hospital", notes: "", ...extra,
  });
  const post = (b) => fetch(`${BASE}/api/request-demo`, { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: b });
  const bot = await post(body({ website: "http://spam.example" }));
  assert.equal(bot.status, 400);
  const ids = [];
  for (let i = 0; i < 5; i++) {
    const r = await post(body());
    assert.equal(r.status, 201);
    ids.push((await r.json()).data.id);
  }
  assert.equal((await post(body())).status, 429);
  await db.lead.deleteMany({ where: { id: { in: ids } } });
});
