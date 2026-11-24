// Area admin tersembunyi: /admin/* = 404 bagi selain ADMIN; login hanya lewat path rahasia (ADMIN_LOGIN_PATH).
// Versi branch hotfix/magic-link: role berbasis nama ("Super Admin" = ADMIN, "Demo User" = akun demo).
// Wajib TEST_ADMIN_LOGIN_PATH = nilai ADMIN_LOGIN_PATH server uji (bukan /admin/login).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { BASE, db, uid, signSession, cookieHeader, loginAdmin, createUser, ADMIN_LOGIN_PATH } from "./helpers.mjs";

const created = [];
let adminToken;

before(async () => {
  assert.notEqual(ADMIN_LOGIN_PATH, "/admin/login", "Set TEST_ADMIN_LOGIN_PATH = ADMIN_LOGIN_PATH server (path rahasia)");
  adminToken = await loginAdmin();
});
after(async () => {
  await db.user.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

const get = (path, headers = {}) => fetch(`${BASE}${path}`, { headers, redirect: "manual" });
const ADMIN_PATHS = ["/admin", "/admin/login", "/admin/dashboard", "/admin/leads", "/admin/users", "/admin/cms", "/admin/audit-logs", "/admin/orders", "/admin/tidak-ada"];

/** Path acak dengan bentuk sama (panjang segmen sama), mis. /admin/leads -> /zzzzz/zzzzz. */
const twin = (path) => path.replace(/[A-Za-z0-9-]/g, "z");
/** Halaman 404 Next.js menuliskan segmen URL yang diketik; samakan segmen agar dapat dibandingkan. */
const normalize = (body, path) => path.split("/").filter(Boolean).reduce((b, seg) => b.split(seg).join("z".repeat(seg.length)), body);

test("tanpa sesi: seluruh /admin/* = 404 yang identik dengan halaman tak dikenal berbentuk sama (tanpa redirect, tanpa form login)", async () => {
  for (const p of ADMIN_PATHS) {
    const res = await get(p);
    const ref = await get(twin(p));
    assert.equal(ref.status, 404, `pembanding ${twin(p)}`);
    assert.equal(res.status, 404, p);
    assert.equal(res.headers.get("location"), null, p);
    const body = await res.text();
    assert.doesNotMatch(body, /app\/admin\/login\/page|type="password"|\/api\/auth\/login/, p);
    assert.equal(normalize(body, p), await ref.text(), `${p}: isi 404 harus identik dengan ${twin(p)}`);
  }
  // Garis miring akhir dinormalisasi Next.js untuk semua URL (308), lalu 404 seperti di atas
  const slash = await get("/admin/");
  const slashRef = await get("/zzzzz/");
  assert.equal(slash.status, slashRef.status);
  assert.equal(slash.headers.get("location"), "/admin");
});

test("sesi akun demo / JWT palsu / sesi role lama: /admin/* = 404 dan cookie tidak diubah", async () => {
  const demo = await createUser({ roleName: "Demo User" });
  created.push(demo.id);
  const sessions = [
    cookieHeader(await signSession({ userId: demo.id, role: "Demo User" })),
    cookieHeader(await signSession({ userId: demo.id, role: "Sales Admin" })), // role lama non-admin
    { cookie: "diagnova_session=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4ifQ.tandatangan-palsu" },
  ];
  for (const h of sessions) {
    for (const p of ["/admin", "/admin/dashboard", "/admin/login"]) {
      const res = await get(p, h);
      assert.equal(res.status, 404, `${p} ${h.cookie.slice(0, 40)}`);
      assert.equal((res.headers.getSetCookie?.() ?? []).length, 0, "tidak ada Set-Cookie");
    }
  }
});

test("path rahasia: halaman login tampil 200 + noindex; /admin/login langsung tetap 404", async () => {
  const res = await get(ADMIN_LOGIN_PATH);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("x-robots-tag") || "", /noindex/);
  // Form login dirender di browser (client-side bailout karena useSearchParams); HTML memuat chunk halaman login admin
  assert.match(await res.text(), /app\/admin\/login\/page/);
  assert.equal((await get("/admin/login")).status, 404);
  assert.equal((await get(`${ADMIN_LOGIN_PATH}x`)).status, 404, "variasi path rahasia tidak berlaku");
});

test("ADMIN login: path rahasia -> dashboard; area admin 200 dengan noindex; /admin -> dashboard", async () => {
  const h = cookieHeader(adminToken);
  const atLogin = await get(ADMIN_LOGIN_PATH, h);
  assert.equal(atLogin.status, 307);
  assert.match(atLogin.headers.get("location") || "", /\/admin\/dashboard$/);
  const dash = await get("/admin/dashboard", h);
  assert.equal(dash.status, 200);
  assert.match(dash.headers.get("x-robots-tag") || "", /noindex/);
  assert.match(await dash.text(), /<meta name="robots" content="noindex/);
  const root = await get("/admin", h);
  assert.equal(root.status, 307);
  assert.match(root.headers.get("location") || "", /\/admin\/dashboard$/);
});

test("halaman publik, robots.txt, sitemap: tidak ada tautan ke /admin maupun path rahasia", async () => {
  for (const p of ["/", "/platform", "/request-demo", "/robots.txt", "/sitemap.xml"]) {
    const body = await (await get(p)).text();
    assert.doesNotMatch(body, /href="\/admin|\/admin\/login|Portal Admin/i, p);
    assert.equal(body.includes(ADMIN_LOGIN_PATH), false, `${p} memuat path rahasia`);
  }
});

test("path rahasia tidak ada di bundle JavaScript yang dikirim ke browser", async () => {
  const pages = [await (await get("/")).text(), await (await get(ADMIN_LOGIN_PATH)).text()];
  const scripts = new Set();
  for (const html of pages) for (const m of html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)) scripts.add(m[1]);
  assert.ok(scripts.size > 0);
  for (const s of scripts) {
    const js = await (await get(s)).text();
    assert.equal(js.includes(ADMIN_LOGIN_PATH), false, `bundle ${s} memuat path rahasia`);
  }
});

test("API admin tetap dilindungi (401/403 JSON) — data dijaga server", async () => {
  assert.equal((await get("/api/admin/leads")).status, 401);
  const demo = await createUser({ roleName: "Demo User" });
  created.push(demo.id);
  const h = cookieHeader(await signSession({ userId: demo.id, role: "Demo User" }));
  assert.equal((await get("/api/admin/leads", h)).status, 403);
});
