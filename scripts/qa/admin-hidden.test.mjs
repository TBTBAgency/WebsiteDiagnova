// Area admin tersembunyi: /admin/* = 404 bagi selain ADMIN; login hanya lewat path rahasia
// ADMIN_LOGIN_PATH; halaman publik tidak pernah menautkan ke area admin.
//
// Requirements: server running with ADMIN_LOGIN_PATH set, a LOCAL development database, and
// TEST_ADMIN_LOGIN_PATH = the server's ADMIN_LOGIN_PATH. Rows created/changed are restored.
//   node --env-file=.env scripts/qa/admin-hidden.test.mjs
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}
const LOGIN_PATH = process.env.TEST_ADMIN_LOGIN_PATH || "";
if (!/^\/[A-Za-z0-9_-]{8,64}$/.test(LOGIN_PATH)) {
  console.error("Set TEST_ADMIN_LOGIN_PATH to the server's ADMIN_LOGIN_PATH (secret path, not /admin/login).");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
};
let ipN = 1;
const ip = () => `10.93.${RUN.length}.${ipN++}`;

async function forge(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  return `diagnova_session=${token}`;
}
const get = (path, cookie) =>
  fetch(`${BASE}${path}`, { redirect: "manual", headers: { "x-forwarded-for": ip(), ...(cookie ? { cookie } : {}) } });
async function call(cookie, method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip(), ...(cookie ? { cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
}

const ADMIN_PATHS = ["/admin", "/admin/login", "/admin/dashboard", "/admin/leads", "/admin/users", "/admin/cms", "/admin/menus", "/admin/orders", "/admin/tidak-ada"];
/** Path acak dengan bentuk sama (panjang segmen sama), mis. /admin/leads -> /zzzzz/zzzzz. */
const twin = (path) => path.replace(/[A-Za-z0-9-]/g, "z");
/** Halaman 404 Next.js menuliskan segmen URL yang diketik; samakan segmen agar dapat dibandingkan. */
const normalize = (body, path) => path.split("/").filter(Boolean).reduce((b, seg) => b.split(seg).join("z".repeat(seg.length)), body);

const created = { userIds: [] };
const pre = { footer: undefined };

async function main() {
  pre.footer = await prisma.cmsSection.findUnique({ where: { sectionKey: "footer" } });

  console.log("== 1. Anonymous: /admin/* is an ordinary 404");
  for (const p of ADMIN_PATHS) {
    const res = await get(p);
    const ref = await get(twin(p));
    const body = await res.text();
    const refBody = await ref.text();
    check(`${p} -> 404, no redirect`, res.status === 404 && !res.headers.get("location"), `got ${res.status} ${res.headers.get("location") || ""}`);
    check(`${p} has no login form/chunk`, !/app\/admin\/login\/page|type="password"|\/api\/auth\/login/.test(body));
    check(`${p} body identical to 404 of ${twin(p)}`, ref.status === 404 && normalize(body, p) === refBody);
  }

  console.log("== 2. Non-admin sessions: 404 and cookie untouched");
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });
  const qa = await prisma.user.create({ data: { name: "QA Hidden User", email: `qa-hidden-${RUN}@example.test`, roleId: userRole.id, status: 1 } });
  created.userIds.push(qa.id);
  const sessions = {
    "USER": await forge({ userId: qa.id, name: qa.name, email: qa.email, role: "USER" }),
    "unknown role": await forge({ userId: qa.id, name: qa.name, email: qa.email, role: "Sales Admin" }),
    // Klaim role ADMIN dengan tanda tangan palsu (disusun saat runtime, bukan token sungguhan)
    "forged signature": `diagnova_session=${[{ alg: "HS256" }, { role: "ADMIN" }].map((p) => Buffer.from(JSON.stringify(p)).toString("base64url")).join(".")}.tandatangan-palsu`,
  };
  for (const [label, cookie] of Object.entries(sessions)) {
    for (const p of ["/admin", "/admin/dashboard", "/admin/login", LOGIN_PATH]) {
      const res = await get(p, cookie);
      const expected = p === LOGIN_PATH ? 200 : 404;
      check(`${label}: ${p === LOGIN_PATH ? "secret path" : p} -> ${expected}`, res.status === expected, `got ${res.status}`);
      check(`${label}: ${p === LOGIN_PATH ? "secret path" : p} sets no cookie`, (res.headers.getSetCookie?.() ?? []).length === 0);
    }
  }

  console.log("== 3. Secret login path");
  const login = await get(LOGIN_PATH);
  check("secret path -> 200 + X-Robots-Tag noindex", login.status === 200 && /noindex/.test(login.headers.get("x-robots-tag") || ""), `got ${login.status}`);
  check("secret path serves the admin login page", /app\/admin\/login\/page/.test(await login.text()));
  check("variations of the secret path -> 404", (await get(`${LOGIN_PATH}x`)).status === 404 && (await get(LOGIN_PATH.toUpperCase())).status === 404);

  console.log("== 4. Admin session");
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip() },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (res.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", res.status === 200);
  const atLogin = await get(LOGIN_PATH, admin);
  check("admin at secret path -> 307 /admin/dashboard", atLogin.status === 307 && /\/admin\/dashboard$/.test(atLogin.headers.get("location") || ""));
  const dash = await get("/admin/dashboard", admin);
  const dashBody = await dash.text();
  check("admin /admin/dashboard -> 200 with noindex header + meta", dash.status === 200 && /noindex/.test(dash.headers.get("x-robots-tag") || "") && /<meta name="robots" content="noindex/.test(dashBody), `got ${dash.status}`);
  const root = await get("/admin", admin);
  check("admin /admin -> 307 /admin/dashboard", root.status === 307 && /\/admin\/dashboard$/.test(root.headers.get("location") || ""));
  check("admin: direct /admin/login still 404", (await get("/admin/login", admin)).status === 404);

  console.log("== 5. API still answers 401/403 JSON");
  check("anon /api/admin/leads -> 401", (await get("/api/admin/leads")).status === 401);
  check("USER /api/admin/leads -> 403", (await get("/api/admin/leads", sessions.USER)).status === 403);

  console.log("== 6. Public pages never reveal the admin area");
  for (const p of ["/", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo", "/robots.txt", "/sitemap.xml"]) {
    const r = await get(p);
    const body = await r.text();
    check(`${p} -> 200 without admin links or secret path`, r.status === 200 && !/href="\/admin|\/admin\/login|Portal Admin/i.test(body) && !body.includes(LOGIN_PATH), `got ${r.status}`);
  }
  const scripts = new Set();
  for (const p of ["/", LOGIN_PATH]) for (const m of (await (await get(p)).text()).matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)) scripts.add(m[1]);
  const leaks = [];
  for (const s of scripts) if ((await (await get(s)).text()).includes(LOGIN_PATH)) leaks.push(s);
  check(`secret path absent from ${scripts.size} JS bundles`, scripts.size > 0 && leaks.length === 0, leaks.join(","));

  console.log("== 7. CMS refuses links to the admin area");
  const site = await call(admin, "GET", "/api/admin/cms/site");
  const footer = structuredClone(site.json?.data?.footer?.content);
  check("footer default has no admin link", !!footer && !JSON.stringify(footer).includes("/admin"));
  for (const url of ["/admin/login", "/ADMIN", "/admin?x=1", `https://example.com/admin/dashboard`, LOGIN_PATH]) {
    const r = await call(admin, "PUT", "/api/admin/cms/site", { type: "footer", data: { ...footer, columns: [{ ...footer.columns[0], links: [{ id: "qa-adm", labelId: "QA", labelEn: "QA", url, isActive: true }] }] } });
    check(`footer link ${url === LOGIN_PATH ? "<secret path>" : url} -> 400`, r.status === 400, `got ${r.status}`);
  }
  const parent = (await (await get("/api/menus")).json()).data?.[0];
  if (parent) {
    for (const url of ["/admin/login", LOGIN_PATH]) {
      const r = await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", action: "save", data: { parentId: parent.id, labelId: "QA", labelEn: "QA", url, isActive: true } });
      check(`navigation link ${url === LOGIN_PATH ? "<secret path>" : url} -> 400`, r.status === 400, `got ${r.status}`);
    }
  } else {
    check("navigation menus available for the admin-link check", false, "GET /api/menus returned no menus");
  }
  const publicMenus = JSON.stringify((await (await get("/api/menus")).json()).data || []);
  check("/api/menus has no admin links", !/"\/admin/i.test(publicMenus) && !publicMenus.includes(LOGIN_PATH));

  console.log("== 8. Admin links already stored in the database are not rendered");
  const marker = `QA-FOOT-${RUN}`;
  const stored = {
    ...footer,
    columns: [{ ...footer.columns[0], links: [...footer.columns[0].links, { id: "qa-ok", labelId: marker, labelEn: marker, url: "/platform", isActive: true }, { id: "qa-bad", labelId: `QA-ADM-${RUN}`, labelEn: `QA-ADM-${RUN}`, url: "/admin/login", isActive: true }] }, ...footer.columns.slice(1)],
  };
  await prisma.cmsSection.upsert({
    where: { sectionKey: "footer" },
    create: { sectionKey: "footer", extraContent: stored, isPublished: true },
    update: { extraContent: stored },
  });
  let home = "";
  for (let i = 0; i < 100 && !home.includes(marker); i++) {
    home = await (await get("/")).text();
    if (!home.includes(marker)) await new Promise((r) => setTimeout(r, 800));
  }
  check("stored footer is rendered (marker visible)", home.includes(marker));
  check("stored admin link is dropped from the public footer", home.includes(marker) && !home.includes(`QA-ADM-${RUN}`) && !/href="\/admin/.test(home));
}

async function cleanup() {
  if (pre.footer) {
    const { id, createdAt, updatedAt, ...rest } = pre.footer;
    await prisma.cmsSection.update({ where: { sectionKey: "footer" }, data: rest });
  } else {
    await prisma.cmsSection.deleteMany({ where: { sectionKey: "footer" } });
  }
  await prisma.auditLog.deleteMany({ where: { userId: { in: created.userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: created.userIds } } });
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    try {
      await cleanup();
      const after = await prisma.cmsSection.findUnique({ where: { sectionKey: "footer" } });
      check("footer row restored", JSON.stringify(after?.extraContent ?? null) === JSON.stringify(pre.footer?.extraContent ?? null));
    } catch (e) {
      console.error("cleanup failed", e);
      fail++;
    }
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
