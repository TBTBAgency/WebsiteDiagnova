// Test otorisasi server-side untuk /api/admin/* dan /api/lis/*.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { BASE, db, signSession, cookieHeader, loginAdmin, createUser, getRole, uid } from "./helpers.mjs";

const GET_ENDPOINTS = [
  "/api/lis/patients",
  "/api/lis/orders",
  "/api/lis/physicians",
  "/api/lis/catalog",
  "/api/admin/leads",
  "/api/admin/leads/export",
  "/api/admin/overview",
  "/api/admin/users",
  "/api/admin/roles",
  "/api/admin/audit-logs",
  "/api/admin/cms/pages",
  "/api/admin/cms/pages/home/hero",
];

// Endpoint dengan parameter / method lain. Semua harus tertolak sebelum menyentuh data.
const OTHER_ENDPOINTS = [
  ["GET", "/api/admin/leads/some-id"],
  ["PATCH", "/api/admin/leads/some-id"],
  ["POST", "/api/admin/leads/some-id/access"],
  ["POST", "/api/admin/leads/some-id/access/link"],
  ["POST", "/api/admin/leads/some-id/access/extend"],
  ["POST", "/api/admin/leads/some-id/access/revoke"],
  ["POST", "/api/admin/leads/some-id/reject"],
  ["POST", "/api/admin/leads/some-id/complete"],
  ["POST", "/api/admin/users"],
  ["PATCH", "/api/admin/users/some-id"],
  ["DELETE", "/api/admin/users/some-id"],
  ["POST", "/api/admin/users/some-id/restore"],
  ["PUT", "/api/admin/cms/pages/home/hero"],
  ["DELETE", "/api/admin/cms/pages/home/hero"],
  ["POST", "/api/admin/cms/pages/home/reorder"],
  ["POST", "/api/admin/cms/upload"],
  ["POST", "/api/lis/patients"],
  ["POST", "/api/lis/orders"],
  ["GET", "/api/lis/orders/some-id"],
  ["POST", "/api/lis/specimens/SP-X/receive"],
  ["POST", "/api/lis/specimens/SP-X/reject"],
];

const req = (method, path, headers = {}) =>
  fetch(`${BASE}${path}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: method === "GET" ? undefined : "{}",
    redirect: "manual",
  });

let adminToken;
const created = [];

after(async () => {
  await db.user.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

test("setup: login admin asli", async () => {
  adminToken = await loginAdmin();
});

test("tanpa sesi -> 401 di seluruh endpoint sensitif", async () => {
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p)).status, 401, p);
  for (const [m, p] of OTHER_ENDPOINTS) assert.equal((await req(m, p)).status, 401, `${m} ${p}`);
});

test("sesi USER (akun demo) -> 403 di seluruh endpoint sensitif", async () => {
  const demo = await createUser({ roleCode: "USER" });
  created.push(demo.id);
  const h = cookieHeader(await signSession({ userId: demo.id, role: "USER" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 403, p);
  for (const [m, p] of OTHER_ENDPOINTS) assert.equal((await req(m, p, h)).status, 403, `${m} ${p}`);
});

test("klaim role palsu di cookie (DB = role lama Sales Admin) -> 403 dari pengecekan database", async () => {
  const sales = await createUser({ roleName: "Sales Admin" });
  created.push(sales.id);
  const h = cookieHeader(await signSession({ userId: sales.id, role: "ADMIN" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 403, p);
});

test("admin yang dinonaktifkan -> sesi lama 401", async () => {
  const admin = await createUser({ roleCode: "ADMIN", status: "INACTIVE" });
  created.push(admin.id);
  const h = cookieHeader(await signSession({ userId: admin.id, role: "ADMIN" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 401, p);
});

test("user yang sudah dihapus -> sesi lama 401", async () => {
  const admin = await createUser({ roleCode: "ADMIN" });
  const h = cookieHeader(await signSession({ userId: admin.id, role: "ADMIN" }));
  assert.equal((await req("GET", "/api/admin/roles", h)).status, 200, "sebelum dihapus harus 200");
  await db.user.delete({ where: { id: admin.id } });
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 401, p);
});

test("cookie dengan signature salah -> 401", async () => {
  const h = { cookie: "diagnova_session=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU3VwZXIgQWRtaW4ifQ.invalidsig" };
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 401, p);
});

test("admin asli -> 200 di seluruh GET", async () => {
  const h = cookieHeader(adminToken);
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 200, p);
});

test("User Management menolak field role/password (privilege escalation) -> 400, tidak ada user tercipta", async () => {
  const adminRole = await db.role.findUnique({ where: { code: "ADMIN" } });
  const email = `esc-${uid()}@example.com`;
  for (const extra of [{ roleId: adminRole.id }, { password: "secret123" }, { role: "ADMIN" }]) {
    const res = await fetch(`${BASE}/api/admin/users`, {
      method: "POST",
      headers: { "content-type": "application/json", ...cookieHeader(adminToken) },
      body: JSON.stringify({ name: "Escalation", email, ...extra }),
    });
    assert.equal(res.status, 400, JSON.stringify(extra));
  }
  assert.equal(await db.user.count({ where: { email } }), 0, "tidak boleh ada user yang tercipta");
});

test("akun yang dibuat lewat User Management selalu USER tanpa password", async () => {
  const email = `mgmt-${uid()}@example.com`;
  const res = await fetch(`${BASE}/api/admin/users`, {
    method: "POST",
    headers: { "content-type": "application/json", ...cookieHeader(adminToken) },
    body: JSON.stringify({ name: "Klien Demo", email }),
  });
  assert.equal(res.status, 201);
  const u = await db.user.findUnique({ where: { email }, include: { role: true } });
  created.push(u.id);
  assert.equal(u.role.code, "USER");
  assert.equal(u.passwordHash, null);
});

test("login password akun non-admin (role lama) ditolak 403", async () => {
  const password = `pw-${uid()}-${uid()}`;
  const legacy = await createUser({ roleName: "Sales Admin" });
  created.push(legacy.id);
  await db.user.update({ where: { id: legacy.id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: legacy.email, password }),
  });
  assert.equal(res.status, 403);
});

test("sesi non-admin membuka halaman /admin -> redirect login + cookie dihapus", async () => {
  const demo = await createUser({ roleCode: "USER" });
  created.push(demo.id);
  const h = cookieHeader(await signSession({ userId: demo.id, role: "USER" }));
  for (const p of ["/admin/dashboard", "/admin/leads", "/admin/orders", "/admin/users", "/admin/cms"]) {
    const res = await req("GET", p, h);
    assert.equal(res.status, 307, p);
    assert.match(res.headers.get("location") || "", /\/admin\/login/, p);
    assert.match((res.headers.getSetCookie?.() ?? []).join(";"), /diagnova_session=;/, p);
  }
});

test("halaman publik tetap 200 tanpa login", async () => {
  for (const p of ["/", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo", "/admin/login"]) {
    assert.equal((await req("GET", p)).status, 200, p);
  }
});

test("error 500 tidak membocorkan detail Prisma (POST users dengan payload rusak)", async () => {
  const res = await fetch(`${BASE}/api/admin/users`, {
    method: "POST",
    headers: { "content-type": "application/json", ...cookieHeader(adminToken) },
    body: "{not-json",
  });
  const body = await res.text();
  assert.ok(res.status >= 400);
  assert.doesNotMatch(body, /prisma|invalid `|at \w+ \(|Unexpected token/i);
});
