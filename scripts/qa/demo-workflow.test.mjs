// Demo request workflow integration tests (business rules in docs/AUDIT_REPORT.md, Phase 3).
//
// Requirements: dev server running (`npm run dev`) and a LOCAL development database.
// Creates and deletes temporary QA records (emails *@example.test).
//   node --env-file=.env scripts/qa/demo-workflow.test.mjs
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);
let ipCounter = 1;
const nextIp = () => `10.77.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`;

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

async function adminLogin() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": nextIp() },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  return (res.headers.get("set-cookie") || "").split(";")[0];
}

async function submitDemo(email, extra = {}, ip = nextIp()) {
  const res = await fetch(`${BASE}/api/request-demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({
      name: "QA Klien",
      institution: "RS QA",
      jobTitle: "Kepala Lab",
      email,
      phone: "081234567890",
      institutionType: "hospital",
      ...extra,
    }),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function adminCall(cookie, method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { cookie, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

async function openLink(url, ua = "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)") {
  // Selalu buka path + query yang sama di server yang sedang diuji, walaupun tautan
  // memakai domain publik (APP_URL) — tes tidak pernah memanggil domain eksternal.
  const u = new URL(url);
  const res = await fetch(`${BASE}${u.pathname}${u.search}`, { headers: { "user-agent": ua }, redirect: "manual" });
  return { status: res.status, html: await res.text() };
}

async function consume(token, { origin, ip = nextIp() } = {}) {
  const headers = { "Content-Type": "application/x-www-form-urlencoded", "x-forwarded-for": ip };
  if (origin) headers.origin = origin;
  const res = await fetch(`${BASE}/api/auth/magic-link`, {
    method: "POST",
    headers,
    body: new URLSearchParams({ token }).toString(),
    redirect: "manual",
  });
  return {
    status: res.status,
    location: res.headers.get("location") || "",
    cookie: (res.headers.get("set-cookie") || "").split(";")[0],
  };
}

const tokenOf = (url) => new URL(url).searchParams.get("token");
// Tujuan setelah login (lib/demo-access.ts): DEMO_ACCESS_URL atau URL demo sementara bawaan.
const DEMO_URL = new URL(process.env.DEMO_ACCESS_URL || "https://website-diagnova.vercel.app/").toString();
const leadStatus = async (id) => (await prisma.lead.findUnique({ where: { id } })).status;
const countAudit = (recordId, action) => prisma.auditLog.count({ where: { entity: "Lead", recordId, action } });

const createdLeadIds = [];

async function main() {
  const admin = await adminLogin();
  check("admin login", admin.startsWith("diagnova_session="));

  console.log("== 1. Form submission -> Dihubungi");
  const emailA = `qa-a-${RUN}@example.test`;
  const sub = await submitDemo(emailA, { requestedDemoDate: new Date(Date.now() + 86400000).toISOString() });
  check("POST /api/request-demo -> 201", sub.status === 201, JSON.stringify(sub.body));
  const leadA = sub.body?.data?.id;
  createdLeadIds.push(leadA);
  check("new lead status = 2 (Dihubungi)", (await leadStatus(leadA)) === 2);
  check("LEAD_CREATED audit recorded", (await countAudit(leadA, "LEAD_CREATED")) === 1);

  const badDate = await submitDemo(`qa-bad-${RUN}@example.test`, { requestedDemoDate: "bukan-tanggal" });
  check("invalid date -> 400 (not 500)", badDate.status === 400, `got ${badDate.status}`);

  console.log("== 2. Approval does not change status");
  const ap = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/approve`, { durationDays: 7 });
  check("approve -> 200", ap.status === 200, JSON.stringify(ap.body));
  check("status still 2 after approval", (await leadStatus(leadA)) === 2);
  const linkA = ap.body?.data?.magicLinkUrl;
  const tokenA = tokenOf(linkA);
  check("magic link URL returned once on approval", /^[a-f0-9]{64}$/.test(tokenA || ""));
  const linkUrl = new URL(linkA);
  check("magic link points to /auth/verify-magic-link", linkUrl.pathname === "/auth/verify-magic-link");
  if (process.env.EXPECT_APP_URL) {
    check(
      `magic link uses configured APP_URL origin (${process.env.EXPECT_APP_URL})`,
      linkUrl.origin === new URL(process.env.EXPECT_APP_URL).origin,
      `got origin ${linkUrl.origin}`
    );
    if (!/localhost|127\.0\.0\.1/.test(process.env.EXPECT_APP_URL)) {
      check("magic link is not localhost", !/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(linkUrl.hostname));
    }
  }
  const detail = await adminCall(admin, "GET", `/api/admin/leads/${leadA}`);
  check("lead detail does not expose token or hash", !JSON.stringify(detail.body).includes(tokenA) && detail.body?.data?.magicLinkUrl === null);

  console.log("== 3. Crawler GET does not consume token");
  const g1 = await openLink(linkA);
  const g2 = await openLink(linkA, "Slackbot-LinkExpanding 1.0");
  check("GET verify page -> 200 with confirm button", g1.status === 200 && g1.html.includes("Masuk ke Demo"));
  check("second GET still shows confirm button", g2.html.includes("Masuk ke Demo"));
  const linkRow = await prisma.demoMagicLink.findFirst({ where: { leadId: leadA }, orderBy: { createdAt: "desc" } });
  check("token not consumed by GET (usedAt null)", linkRow.usedAt === null);
  check("status unchanged by GET", (await leadStatus(leadA)) === 2);
  check("verify page is noindex", /<meta name="robots" content="noindex/.test(g1.html));

  console.log("== 4. Failed login does not change status");
  const bad = await consume("f".repeat(64));
  check("unknown token -> redirect with error=invalid", bad.status === 303 && bad.location.includes("error=invalid"), bad.location);
  const xsite = await consume(tokenA, { origin: "https://evil.example" });
  check("cross-origin POST -> 403", xsite.status === 403, `got ${xsite.status}`);
  const nullOrigin = await consume(tokenA, { origin: "null" });
  check("Origin: null without Sec-Fetch-Site -> 403 (no crash)", nullOrigin.status === 403, `got ${nullOrigin.status}`);
  const crossFetch = await fetch(`${BASE}/api/auth/magic-link`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", origin: "null", "sec-fetch-site": "cross-site" },
    body: new URLSearchParams({ token: tokenA }).toString(),
    redirect: "manual",
  });
  check("Origin: null + Sec-Fetch-Site: cross-site -> 403", crossFetch.status === 403, `got ${crossFetch.status}`);
  check("status unchanged after failures", (await leadStatus(leadA)) === 2);

  console.log("== 5. First successful login -> Jadwal Demo");
  const ok = await consume(tokenA, { origin: BASE });
  check(`valid token -> 303 to demo destination (${DEMO_URL})`, ok.status === 303 && ok.location === DEMO_URL, ok.location);
  check("session cookie set", ok.cookie.startsWith("diagnova_session="));
  check("status 2 -> 3 after first login", (await leadStatus(leadA)) === 3);
  const userA = await prisma.user.findUnique({ where: { email: emailA }, include: { role: true } });
  check("USER account created & activated", userA?.role?.name === "USER" && !!userA.demoActivatedAt && !!userA.demoExpiresAt);
  const days = Math.round((userA.demoExpiresAt - userA.demoActivatedAt) / 86400000);
  check("demo duration = approved 7 days", days === 7, `got ${days}`);
  const usedLinkA = await prisma.demoMagicLink.findFirst({ where: { leadId: leadA }, orderBy: { createdAt: "desc" } });
  check("activated link stays valid until end of access period", +usedLinkA.expiresAt === +userA.demoExpiresAt);
  check("link valid beyond the 24h first-use window", usedLinkA.expiresAt - usedLinkA.createdAt > 25 * 3600 * 1000);

  console.log("== 6. Re-login with the same link during the access period");
  const g3 = await openLink(linkA);
  check("verify page for an active link offers re-login", g3.status === 200 && g3.html.includes("magic-link-returning") && g3.html.includes("Masuk ke Demo"));
  const relogin = await consume(tokenA, { origin: BASE });
  check("re-login with same link -> 303 to demo destination", relogin.status === 303 && relogin.location === DEMO_URL, relogin.location);
  check("re-login sets a session cookie", relogin.cookie.startsWith("diagnova_session="));
  check("MAGIC_LINK_RELOGIN audit recorded", (await countAudit(leadA, "MAGIC_LINK_RELOGIN")) === 1);
  const userA2 = await prisma.user.findUnique({ where: { email: emailA } });
  check("re-login does not change the access period", +userA2.demoExpiresAt === +userA.demoExpiresAt && +userA2.demoActivatedAt === +userA.demoActivatedAt);
  check("status stays 3 after re-login", (await leadStatus(leadA)) === 3);

  const ap2 = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/approve`, { durationDays: 7 });
  const tokenA2 = tokenOf(ap2.body?.data?.magicLinkUrl);
  const revokedOld = await consume(tokenA);
  check("issuing a new link revokes the previous (activated) link", revokedOld.location.includes("error=link_expired"), revokedOld.location);
  const ap3 = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/approve`, { durationDays: 7 });
  const tokenA3 = tokenOf(ap3.body?.data?.magicLinkUrl);
  const superseded = await consume(tokenA2);
  check("older unused link superseded by newer one", superseded.location.includes("error=link_expired"), superseded.location);
  const second = await consume(tokenA3);
  check("login with the new link succeeds", second.status === 303 && second.cookie.startsWith("diagnova_session="));
  check("status stays 3 after repeated login", (await leadStatus(leadA)) === 3);
  check("only one automatic status transition recorded", (await countAudit(leadA, "LEAD_STATUS_CHANGED")) === 1);

  console.log("== 7. Concurrent first use: token consumed once, status changes once");
  const ap4 = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/approve`, { durationDays: 7 });
  const tokenA4 = tokenOf(ap4.body?.data?.magicLinkUrl);
  const consumedBefore = await countAudit(leadA, "MAGIC_LINK_CONSUMED");
  const results = await Promise.all([consume(tokenA4), consume(tokenA4), consume(tokenA4)]);
  const wins = results.filter((r) => r.cookie.startsWith("diagnova_session=")).length;
  check("at least one of 3 parallel requests signs in, none errors with 5xx", wins >= 1 && results.every((r) => r.status === 303), `wins=${wins}`);
  check("token consumed exactly once", (await countAudit(leadA, "MAGIC_LINK_CONSUMED")) - consumedBefore === 1);
  check("still only one automatic status transition", (await countAudit(leadA, "LEAD_STATUS_CHANGED")) === 1);

  console.log("== 8. Controlled status changes");
  const back = await adminCall(admin, "PATCH", `/api/admin/leads/${leadA}`, { status: 2 });
  check("manual 3 -> 2 rejected (409)", back.status === 409, `got ${back.status}`);
  const done = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/complete`);
  check("complete 3 -> 4 (200)", done.status === 200 && (await leadStatus(leadA)) === 4, JSON.stringify(done.body));
  const again = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/complete`);
  check("complete twice -> 409", again.status === 409);
  const reopen = await adminCall(admin, "PATCH", `/api/admin/leads/${leadA}`, { status: 3 });
  check("manual 4 -> 3 rejected (409)", reopen.status === 409);

  console.log("== 9. Extension history");
  const before = (await prisma.user.findUnique({ where: { email: emailA } })).demoExpiresAt;
  const ext = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/extend`, { days: 5 });
  const after = (await prisma.user.findUnique({ where: { email: emailA } })).demoExpiresAt;
  check("extend -> 200", ext.status === 200, JSON.stringify(ext.body));
  check("expiry extended by exactly 5 days", Math.round((after - before) / 86400000) === 5);
  check("DEMO_ACCESS_EXTENDED audit recorded", (await countAudit(leadA, "DEMO_ACCESS_EXTENDED")) === 1);
  const activeLink = await prisma.demoMagicLink.findFirst({ where: { leadId: leadA, usedAt: { not: null } }, orderBy: { createdAt: "desc" } });
  check("active link is extended together with the access period", +activeLink.expiresAt === +after);
  const reloginAfterExt = await consume(tokenA4);
  check("re-login still works after extension", reloginAfterExt.location === DEMO_URL, reloginAfterExt.location);
  const badExt = await adminCall(admin, "POST", `/api/admin/leads/${leadA}/extend`, { days: 0 });
  check("extend with 0 days -> 400", badExt.status === 400);

  console.log("== 10. Expiry does not mean completed");
  const emailB = `qa-b-${RUN}@example.test`;
  const leadB = (await submitDemo(emailB)).body?.data?.id;
  createdLeadIds.push(leadB);
  const apB = await adminCall(admin, "POST", `/api/admin/leads/${leadB}/approve`, { durationDays: 3 });
  const tokenB = tokenOf(apB.body?.data?.magicLinkUrl);
  const loginB = await consume(tokenB);
  check("lead B first login -> status 3", (await leadStatus(leadB)) === 3);
  await prisma.user.update({ where: { email: emailB }, data: { demoExpiresAt: new Date(Date.now() - 60000) } });
  const reloginExpired = await consume(tokenB);
  check("re-login after access ended -> /demo-expired", reloginExpired.location.endsWith("/demo-expired") && !reloginExpired.cookie, reloginExpired.location);
  const gExpired = await openLink(apB.body?.data?.magicLinkUrl);
  check("verify page after access ended shows no login button", !gExpired.html.includes("Masuk ke Demo"));
  const apB2 = await adminCall(admin, "POST", `/api/admin/leads/${leadB}/approve`, { durationDays: 3 });
  const expired = await consume(tokenOf(apB2.body?.data?.magicLinkUrl));
  check("login after demo expiry -> /demo-expired", expired.location.endsWith("/demo-expired"), expired.location);
  check("status stays 3 (not Selesai) after expiry", (await leadStatus(leadB)) === 3);
  check("expired demo client cannot reach admin APIs", (await fetch(`${BASE}/api/admin/leads`, { headers: { cookie: loginB.cookie } })).status === 403);

  console.log("== 11. Rejection & privilege escalation guards");
  const emailC = `qa-c-${RUN}@example.test`;
  const leadC = (await submitDemo(emailC)).body?.data?.id;
  createdLeadIds.push(leadC);
  const apC = await adminCall(admin, "POST", `/api/admin/leads/${leadC}/approve`, { durationDays: 7 });
  await adminCall(admin, "POST", `/api/admin/leads/${leadC}/reject`, { rejectionReason: "QA reject" });
  const afterReject = await consume(tokenOf(apC.body?.data?.magicLinkUrl));
  check("link unusable after rejection", afterReject.location.includes("error="), afterReject.location);
  check("rejected lead status unchanged (2)", (await leadStatus(leadC)) === 2);

  const emailD = `qa-d-${RUN}@example.test`;
  const leadD = (await submitDemo(emailD)).body?.data?.id;
  createdLeadIds.push(leadD);
  const tokenD = tokenOf((await adminCall(admin, "POST", `/api/admin/leads/${leadD}/approve`, { durationDays: 7 })).body?.data?.magicLinkUrl);
  check("lead D first login ok", (await consume(tokenD)).location === DEMO_URL);
  const userD = await prisma.user.findUnique({ where: { email: emailD } });
  await prisma.user.update({ where: { id: userD.id }, data: { status: 0 } });
  check("re-login refused while the account is deactivated", (await consume(tokenD)).location.includes("error=account_inactive"));
  await prisma.user.update({ where: { id: userD.id }, data: { status: 1 } });
  check("re-login works again after reactivation", (await consume(tokenD)).location === DEMO_URL);
  await adminCall(admin, "POST", `/api/admin/leads/${leadD}/reject`, { rejectionReason: "QA reject after activation" });
  check("re-login refused after rejection (activated link revoked)", (await consume(tokenD)).location.includes("error="));
  check("lead D status unchanged by rejection (3)", (await leadStatus(leadD)) === 3);

  console.log("== 11b. Duration options 3 / 7 / 14 days / 1 month");
  for (const d of [3, 7, 14, 30]) {
    const em = `qa-dur${d}-${RUN}@example.test`;
    const lid = (await submitDemo(em)).body?.data?.id;
    createdLeadIds.push(lid);
    check(`new lead default duration is 7 days (${d})`, (await prisma.lead.findUnique({ where: { id: lid } })).demoDurationDays === 7);
    const tk = tokenOf((await adminCall(admin, "POST", `/api/admin/leads/${lid}/approve`, { durationDays: d })).body?.data?.magicLinkUrl);
    await consume(tk);
    const u = await prisma.user.findUnique({ where: { email: em } });
    const got = Math.round((u.demoExpiresAt - u.demoActivatedAt) / 86400000);
    check(`approved ${d} days -> access period ${d} days`, got === d, `got ${got}`);
  }

  const leadAdmin = (await submitDemo("admin@diagnova.id")).body?.data?.id;
  createdLeadIds.push(leadAdmin);
  const apAdmin = await adminCall(admin, "POST", `/api/admin/leads/${leadAdmin}/approve`, { durationDays: 7 });
  check("approve for an ADMIN email -> 409 (no magic link)", apAdmin.status === 409, `got ${apAdmin.status}`);
  check("no magic link created for ADMIN email", (await prisma.demoMagicLink.count({ where: { leadId: leadAdmin } })) === 0);

  console.log("== 12. History endpoint");
  const hist = await adminCall(admin, "GET", `/api/admin/leads/${leadA}/history`);
  const actions = (hist.body?.data?.events || []).map((e) => e.action);
  check("history lists magic links", (hist.body?.data?.magicLinks || []).length >= 4);
  for (const a of ["LEAD_CREATED", "LEAD_APPROVED", "MAGIC_LINK_CONSUMED", "LEAD_STATUS_CHANGED", "LEAD_COMPLETED", "DEMO_ACCESS_EXTENDED"]) {
    check(`history contains ${a}`, actions.includes(a));
  }

  console.log("== 13. Public form rate limit");
  const ip = nextIp();
  let lastStatus = 0;
  for (let i = 0; i < 6; i++) {
    const r = await submitDemo(`qa-rl-${i}-${RUN}@example.test`, {}, ip);
    if (r.body?.data?.id) createdLeadIds.push(r.body.data.id);
    lastStatus = r.status;
  }
  check("6th submission from same IP within 1h -> 429", lastStatus === 429, `got ${lastStatus}`);
}

async function cleanup() {
  const ids = createdLeadIds.filter(Boolean);
  const leads = await prisma.lead.findMany({ where: { id: { in: ids } }, select: { userId: true } });
  // Hanya akun QA (@example.test) — JANGAN pernah menghapus audit log milik akun nyata
  // (mis. lead uji eskalasi memakai email admin; dulu userId admin ikut terhapus di sini).
  const userIds = (
    await prisma.user.findMany({
      where: { id: { in: leads.map((l) => l.userId).filter(Boolean) }, email: { endsWith: "@example.test" } },
      select: { id: true },
    })
  ).map((u) => u.id);
  await prisma.auditLog.deleteMany({ where: { OR: [{ recordId: { in: ids } }, { userId: { in: userIds } }] } });
  await prisma.lead.deleteMany({ where: { id: { in: ids } } }); // cascades demo_magic_links
  await prisma.user.deleteMany({ where: { id: { in: userIds }, email: { endsWith: "@example.test" } } });
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    await cleanup();
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
