// Test Phase 1: hardening autentikasi, CSRF origin check, header keamanan.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { BASE, db, uid, getRole, signSession, cookieHeader, loginAdmin } from "./helpers.mjs";

const created = [];
after(async () => {
  await db.auditLog.deleteMany({ where: { recordId: { in: created } } });
  await db.user.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

async function makeAdmin({ status = 1 } = {}) {
  const password = `pw-${uid()}-${uid()}`;
  const role = await getRole("Super Admin");
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
    headers: { "content-type": "application/json", ...headers },
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
  const { user, password } = await makeAdmin({ status: 0 });
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
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
  await db.auditLog.deleteMany({ where: { ipAddress: ip } });
  for (let i = 0; i < 20; i++) {
    const r = await login(`ip-${uid()}@example.com`, "x-wrong-pass", { "x-forwarded-for": ip });
    assert.equal(r.status, 401);
  }
  const r = await login(`ip-${uid()}@example.com`, "x-wrong-pass", { "x-forwarded-for": ip });
  assert.equal(r.status, 429);
  await db.auditLog.deleteMany({ where: { ipAddress: ip } });
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
  const { user } = await makeAdmin({ status: 0 });
  const token = await signSession({ userId: user.id, role: "Super Admin" });
  const res = await fetch(`${BASE}/api/auth/me`, { headers: cookieHeader(token) });
  assert.equal(res.status, 401);
});

test("/api/auth/me mengembalikan role dari DB, bukan dari JWT", async () => {
  const { user } = await makeAdmin();
  const token = await signSession({ userId: user.id, role: "Role Palsu" });
  const res = await fetch(`${BASE}/api/auth/me`, { headers: cookieHeader(token) });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).data.role, "Super Admin");
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
