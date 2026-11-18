// Phase 1 security integration tests (auth, authorization, upload, headers, CSV export).
//
// Requirements: dev server running (`npm run dev`) and a LOCAL development database.
// The script creates and deletes temporary QA records (users/leads with *@example.test).
//   node --env-file=.env scripts/qa/security.test.mjs
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = "admin@diagnova.id";
const ADMIN_PASS = process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!";
const SALES_EMAIL = "sales@diagnova.id";
const SALES_PASS = process.env.SEED_SALES_PASSWORD || "Sales2026!";
const prisma = new PrismaClient();

let pass = 0;
let fail = 0;
function check(name, cond, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

async function login(email, password, ip = "10.0.0.1") {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ email, password }),
  });
  const cookie = (res.headers.get("set-cookie") || "").split(";")[0];
  return { status: res.status, cookie, body: await res.json().catch(() => null) };
}

async function get(path, cookie) {
  return fetch(`${BASE}${path}`, { headers: cookie ? { cookie } : {}, redirect: "manual" });
}

async function forgeSession(payload) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
  return `diagnova_session=${token}`;
}

async function main() {
  console.log("== Unauthenticated access");
  for (const p of ["/api/admin/leads", "/api/admin/overview", "/api/admin/users", "/api/admin/audit-logs", "/api/admin/roles", "/api/admin/leads/export"]) {
    const r = await get(p);
    check(`GET ${p} without session -> 401`, r.status === 401, `got ${r.status}`);
  }

  console.log("== Admin login");
  const admin = await login(ADMIN_EMAIL, ADMIN_PASS);
  check("admin login -> 200", admin.status === 200, `got ${admin.status}`);
  const r1 = await get("/api/admin/leads", admin.cookie);
  check("admin GET /api/admin/leads -> 200", r1.status === 200, `got ${r1.status}`);

  console.log("== USER role session (e.g. magic-link demo client)");
  const demoUser = await prisma.user.upsert({
    where: { email: "qa-demo-user@example.test" },
    update: {},
    create: {
      name: "QA Demo User",
      email: "qa-demo-user@example.test",
      roleId: (await prisma.role.findFirst({ where: { name: "USER" } })).id,
      status: 1,
    },
  });
  const userCookie = await forgeSession({ userId: demoUser.id, name: demoUser.name, email: demoUser.email, role: "USER" });
  for (const p of ["/api/admin/leads", "/api/admin/leads/export", "/api/admin/overview"]) {
    const r = await get(p, userCookie);
    check(`USER GET ${p} -> 403`, r.status === 403, `got ${r.status}`);
  }
  const forgedAdmin = await forgeSession({ userId: demoUser.id, name: demoUser.name, email: demoUser.email, role: "ADMIN" });
  const r2 = await get("/api/admin/leads", forgedAdmin);
  check("JWT claiming ADMIN for a USER account -> 403 (DB re-check)", r2.status === 403, `got ${r2.status}`);
  const approve = await fetch(`${BASE}/api/admin/leads/does-not-exist/approve`, {
    method: "POST",
    headers: { cookie: userCookie, "Content-Type": "application/json" },
    body: "{}",
  });
  check("USER POST approve -> 403", approve.status === 403, `got ${approve.status}`);

  console.log("== Password login restricted to admins");
  await prisma.user.update({
    where: { id: demoUser.id },
    data: { passwordHash: await (await import("bcryptjs")).default.hash("QaUser12345!", 10) },
  });
  const userLogin = await login("qa-demo-user@example.test", "QaUser12345!", "10.0.0.2");
  check("USER password login -> 403", userLogin.status === 403, `got ${userLogin.status}`);
  check("USER password login sets no cookie", !userLogin.cookie.startsWith("diagnova_session="), userLogin.cookie);

  console.log("== Deactivated admin loses access immediately");
  const sales = await login(SALES_EMAIL, SALES_PASS, "10.0.0.3");
  check("sales admin login -> 200", sales.status === 200, `got ${sales.status}`);
  await prisma.user.update({ where: { email: SALES_EMAIL }, data: { status: 0 } });
  const r3 = await get("/api/admin/leads", sales.cookie);
  check("deactivated admin with valid JWT -> 403", r3.status === 403, `got ${r3.status}`);
  await prisma.user.update({ where: { email: SALES_EMAIL }, data: { status: 1 } });

  console.log("== Login rate limiting");
  let last = 0;
  for (let i = 0; i < 6; i++) {
    last = (await login(ADMIN_EMAIL, "wrong-password-xyz", "10.9.9.9")).status;
  }
  check("6th wrong attempt from same IP+email -> 429", last === 429, `got ${last}`);
  const other = await login(ADMIN_EMAIL, ADMIN_PASS, "10.9.9.10");
  check("other IP is not blocked", other.status === 200, `got ${other.status}`);

  console.log("== Upload validation");
  const upload = async (name, type, bytes) => {
    const fd = new FormData();
    fd.append("file", new Blob([bytes], { type }), name);
    const res = await fetch(`${BASE}/api/admin/cms/upload`, { method: "POST", headers: { cookie: admin.cookie }, body: fd });
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  const png = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000154a24f5f0000000049454e44ae426082",
    "hex"
  );
  const okPng = await upload("logo.png", "image/png", png);
  check("valid PNG accepted", okPng.status === 200 && okPng.body?.data?.file?.url?.endsWith(".png"), JSON.stringify(okPng.body));
  const html = await upload("evil.html", "image/png", Buffer.from("<html><script>alert(1)</script></html>"));
  check("HTML disguised as PNG rejected", html.status === 400, `got ${html.status}`);
  const pngNamedHtml = await upload("trick.html", "image/png", png);
  check("real PNG named .html is stored as .png", pngNamedHtml.body?.data?.file?.url?.endsWith(".png"), JSON.stringify(pngNamedHtml.body));
  const svgEvil = await upload("x.svg", "image/svg+xml", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(1)"/></svg>'));
  check("SVG with onclick handler rejected", svgEvil.status === 400, `got ${svgEvil.status}`);
  const svgOk = await upload("ok.svg", "image/svg+xml", Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1"/></svg>'));
  check("clean SVG accepted", svgOk.status === 200, JSON.stringify(svgOk.body));
  const userUpload = await fetch(`${BASE}/api/admin/cms/upload`, { method: "POST", headers: { cookie: userCookie }, body: new FormData() });
  check("USER upload -> 403", userUpload.status === 403, `got ${userUpload.status}`);

  // cleanup uploaded test files
  const fs = await import("fs/promises");
  for (const r of [okPng, pngNamedHtml, svgOk]) {
    const url = r.body?.data?.file?.url;
    if (url) await fs.rm(`public${url}`, { force: true });
  }

  console.log("== Security headers");
  const home = await get("/");
  check("X-Content-Type-Options: nosniff", home.headers.get("x-content-type-options") === "nosniff");
  check("X-Frame-Options: SAMEORIGIN", home.headers.get("x-frame-options") === "SAMEORIGIN");

  console.log("== CSV formula injection");
  const lead = await prisma.lead.create({
    data: { name: "=HYPERLINK(\"http://x\")", institution: "QA", jobTitle: "QA", email: "qa-csv@example.test", phone: "08123456789" },
  });
  const csv = await (await get("/api/admin/leads/export", admin.cookie)).text();
  check("formula cell neutralized with leading quote", csv.includes(`"'=HYPERLINK(""http://x"")"`));
  await prisma.lead.delete({ where: { id: lead.id } });

  // cleanup QA user
  await prisma.auditLog.deleteMany({ where: { userId: demoUser.id } });
  await prisma.user.delete({ where: { id: demoUser.id } });

  console.log(`\nResult: ${pass} passed, ${fail} failed`);
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
