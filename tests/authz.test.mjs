// Test otorisasi server-side untuk /api/admin/* dan /api/lis/*.
import { test, after } from "node:test";
import assert from "node:assert/strict";
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
  "/api/admin/cms/homepage",
];

// Endpoint dengan parameter / method lain. Semua harus tertolak sebelum menyentuh data.
const OTHER_ENDPOINTS = [
  ["GET", "/api/admin/leads/some-id"],
  ["PATCH", "/api/admin/leads/some-id"],
  ["POST", "/api/admin/leads/some-id/approve"],
  ["POST", "/api/admin/leads/some-id/reject"],
  ["POST", "/api/admin/leads/some-id/notes"],
  ["POST", "/api/admin/users"],
  ["PUT", "/api/admin/cms/homepage"],
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

test("sesi Demo User -> 403 di seluruh endpoint sensitif", async () => {
  const demo = await createUser({ roleName: "Demo User" });
  created.push(demo.id);
  const h = cookieHeader(await signSession({ userId: demo.id, role: "Demo User" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 403, p);
  for (const [m, p] of OTHER_ENDPOINTS) assert.equal((await req(m, p, h)).status, 403, `${m} ${p}`);
});

test("klaim role palsu di cookie (DB = Sales Admin) -> 403 dari pengecekan database", async () => {
  const sales = await createUser({ roleName: "Sales Admin" });
  created.push(sales.id);
  const h = cookieHeader(await signSession({ userId: sales.id, role: "Super Admin" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 403, p);
});

test("admin yang dinonaktifkan -> sesi lama 401", async () => {
  const admin = await createUser({ roleName: "Super Admin", status: 0 });
  created.push(admin.id);
  const h = cookieHeader(await signSession({ userId: admin.id, role: "Super Admin" }));
  for (const p of GET_ENDPOINTS) assert.equal((await req("GET", p, h)).status, 401, p);
});

test("user yang sudah dihapus -> sesi lama 401", async () => {
  const admin = await createUser({ roleName: "Super Admin" });
  const h = cookieHeader(await signSession({ userId: admin.id, role: "Super Admin" }));
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

test("User Management menolak pembuatan akun Super Admin (privilege escalation)", async () => {
  const superRole = await getRole("Super Admin");
  const email = `esc-${uid()}@test.local`;
  const res = await fetch(`${BASE}/api/admin/users`, {
    method: "POST",
    headers: { "content-type": "application/json", ...cookieHeader(adminToken) },
    body: JSON.stringify({ name: "Escalation", email, password: "secret123", roleId: superRole.id }),
  });
  assert.equal(res.status, 403);
  assert.equal(await db.user.count({ where: { email } }), 0, "tidak boleh ada user yang tercipta");
});

test("User Management menolak roleId yang tidak ada", async () => {
  const res = await fetch(`${BASE}/api/admin/users`, {
    method: "POST",
    headers: { "content-type": "application/json", ...cookieHeader(adminToken) },
    body: JSON.stringify({ name: "Bad", email: `bad-${uid()}@test.local`, password: "secret123", roleId: "nope" }),
  });
  assert.equal(res.status, 400);
});

test("login password akun non-admin ditolak 403", async () => {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "sales@diagnova.id", password: "Sales2026!" }),
  });
  assert.equal(res.status, 403);
});

test("sesi non-admin membuka halaman /admin -> redirect login + cookie dihapus", async () => {
  const demo = await createUser({ roleName: "Demo User" });
  created.push(demo.id);
  const h = cookieHeader(await signSession({ userId: demo.id, role: "Demo User" }));
  for (const p of ["/admin/dashboard", "/admin/leads", "/admin/orders", "/admin/users", "/admin/cms/homepage"]) {
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
