// Integration test: server PRODUCTION yang APP_URL-nya salah (localhost / kosong) harus MENOLAK
// approval (HTTP 503) tanpa membuat Magic Link dan tanpa mengubah lead.
//
// Jalankan HANYA terhadap build production lokal yang sengaja dikonfigurasi salah, mis.:
//   APP_URL=http://localhost:3000 NODE_ENV=production npx next start   (tanpa ALLOW_LOCALHOST_APP_URL)
//   node --env-file=.env scripts/qa/magic-link-misconfig.test.mjs
import { PrismaClient } from "@prisma/client";

if (!/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
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

let leadId = null;
try {
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "10.66.0.1" },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (login.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", login.status === 200);

  const demo = await fetch(`${BASE}/api/request-demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "10.66.0.2" },
    body: JSON.stringify({
      name: "QA Misconfig",
      institution: "QA Lab",
      jobTitle: "QA",
      email: `qa-misconfig-${RUN}@example.test`,
      phone: "081200000000",
      institutionType: "clinical-lab",
    }),
  });
  leadId = (await demo.json())?.data?.id;
  check("demo request created", demo.status === 201 && !!leadId, `got ${demo.status}`);

  const before = await prisma.lead.findUnique({ where: { id: leadId } });
  const ap = await fetch(`${BASE}/api/admin/leads/${leadId}/approve`, {
    method: "POST",
    headers: { cookie: admin, "Content-Type": "application/json" },
    body: JSON.stringify({ durationDays: 7 }),
  });
  const body = await ap.json().catch(() => null);
  check("approve with localhost APP_URL in production -> 503", ap.status === 503, `got ${ap.status} ${JSON.stringify(body)}`);
  check("response contains no magic link", !body?.data?.magicLinkUrl && !/verify-magic-link|localhost/.test(JSON.stringify(body)));
  check("no DemoMagicLink row created", (await prisma.demoMagicLink.count({ where: { leadId } })) === 0);
  const after = await prisma.lead.findUnique({ where: { id: leadId } });
  check("lead approval status unchanged", after.approvalStatus === before.approvalStatus && after.status === before.status);
  check("no USER account created for the lead", (await prisma.user.count({ where: { email: before.email } })) === 0);
} catch (e) {
  console.error(e);
  fail++;
} finally {
  if (leadId) {
    await prisma.auditLog.deleteMany({ where: { recordId: leadId } });
    await prisma.lead.deleteMany({ where: { id: leadId } });
  }
  console.log(`\nResult: ${pass} passed, ${fail} failed`);
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
}
