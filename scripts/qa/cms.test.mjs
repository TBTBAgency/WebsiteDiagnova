// CMS & dynamic navigation integration tests: admin edits must reach the public site.
//
// Requirements: dev server running (`npm run dev`) and a LOCAL development database that
// has been seeded (prisma/seed-cms.ts + scripts/sync_page_hero_defaults.js).
// Every change made here is restored at the end.
//   node --env-file=.env scripts/qa/cms.test.mjs
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);

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

const snapshots = [];
async function snapshot(sectionKey) {
  const row = await prisma.cmsSection.findUnique({ where: { sectionKey } });
  snapshots.push(row);
  return row;
}

async function cmsPut(cookie, payload) {
  const res = await fetch(`${BASE}/api/admin/cms/homepage`, {
    method: "PUT",
    headers: { cookie, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

const page = async (path) => (await fetch(`${BASE}${path}`, { cache: "no-store" })).text();

async function main() {
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "10.66.0.1" },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (login.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", login.status === 200);

  console.log("== Inner pages read their hero from CMS");
  const heroPages = [
    ["/platform", "page_platform"],
    ["/solutions", "page_solutions"],
    ["/modules", "page_modules"],
    ["/nova-ai", "page_nova_ai"],
    ["/integration", "page_integrations"],
  ];
  for (const [path, key] of heroPages) {
    await snapshot(key);
    const marker = `QA Badge ${key} ${RUN}`;
    const r = await cmsPut(admin, { type: "section", sectionKey: key, data: { badgeId: marker } });
    check(`PUT ${key} badge -> 200`, r.status === 200, JSON.stringify(r.body));
    const html = await page(path);
    check(`${path} shows the CMS badge`, html.includes(marker));
  }

  console.log("== Homepage section edit");
  await snapshot("about");
  const aboutMarker = `QA About Title ${RUN}`;
  const ra = await cmsPut(admin, { type: "section", sectionKey: "about", data: { titleId: aboutMarker } });
  check("PUT about title -> 200", ra.status === 200);
  check("/ shows the CMS about title", (await page("/")).includes(aboutMarker));

  console.log("== Dynamic navigation");
  await snapshot("navigation");
  const navLabel = `QA Menu ${RUN}`;
  const rn = await cmsPut(admin, {
    type: "navigation",
    data: { labelId: navLabel, labelEn: navLabel, url: "/request-demo", isActive: true, sortOrder: 99 },
  });
  check("create menu -> 200", rn.status === 200, JSON.stringify(rn.body));
  const menus = await (await fetch(`${BASE}/api/menus`)).json();
  check("new menu appears in public /api/menus", JSON.stringify(menus.data).includes(navLabel));
  const created = (menus.data || []).find((m) => m.labelId === navLabel);
  const rd = await cmsPut(admin, { type: "navigation", action: "delete", data: { id: created?.id } });
  check("delete menu -> 200", rd.status === 200, JSON.stringify(rd.body));
  const menus2 = await (await fetch(`${BASE}/api/menus`)).json();
  check("deleted menu no longer public", !JSON.stringify(menus2.data).includes(navLabel));
  check("seeded navigation still has 5 top-level menus", (menus2.data || []).length === 5, `got ${(menus2.data || []).length}`);

  console.log("== Access control");
  const anon = await fetch(`${BASE}/api/admin/cms/homepage`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "section", sectionKey: "about", data: { titleId: "x" } }),
  });
  check("anonymous CMS PUT -> 401", anon.status === 401, `got ${anon.status}`);
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    // Restore every touched section exactly as it was
    for (const row of snapshots) {
      if (!row) continue;
      const { id, createdAt, updatedAt, ...data } = row;
      await prisma.cmsSection.update({ where: { id }, data: { ...data, extraContent: data.extraContent ?? undefined } });
    }
    await prisma.auditLog.deleteMany({ where: { entity: "cms_sections", newValue: { string_contains: RUN } } }).catch(() => {});
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
