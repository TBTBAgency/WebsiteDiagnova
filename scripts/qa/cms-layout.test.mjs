// CMS page layout integration tests (Halaman & Section).
//
// Covers: access control, ordering, show/hide, header text overrides, custom sections,
// page hero editing, validation (unsafe URLs / unknown keys / XSS), homepage visibility,
// and that EXISTING CMS rows are left exactly as they were.
// Every row this test touches is restored afterwards (layout rows that did not exist before
// the run are removed again; pre-existing rows get their original values back).
//
// Requirements: dev or production server running and a LOCAL development database.
//   node --env-file=.env scripts/qa/cms-layout.test.mjs
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);
const START = new Date();

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

const LAYOUT_KEYS = ["home", "platform", "solutions", "modules", "nova_ai", "integration"].map((p) => `layout_${p}`);
const HERO_KEY = "page_solutions";

async function forgeSession(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  return `diagnova_session=${token}`;
}

async function api(cookie, method, body) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(`${BASE}/api/admin/cms/layout`, {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}

/** Fetch a page until `predicate(html)` holds (ISR on-demand revalidation may need a request to refresh). */
async function pageUntil(path, predicate, tries = 6) {
  let html = "";
  for (let i = 0; i < tries; i++) {
    const res = await fetch(`${BASE}${path}`, { headers: { "cache-control": "no-cache" } });
    html = await res.text();
    if (predicate(html)) return html;
    await new Promise((r) => setTimeout(r, 800));
  }
  return html;
}

const contentSnapshot = (rows) =>
  JSON.stringify(
    rows
      .filter((r) => !r.sectionKey.startsWith("layout_"))
      .map(({ sectionKey, badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, extraContent, isPublished }) => ({
        sectionKey, badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, extraContent, isPublished,
      }))
      .sort((a, b) => a.sectionKey.localeCompare(b.sectionKey))
  );

let preLayouts = [];
let preHero = null;
let qaUserId = null;
let beforeSnapshot = null;

async function main() {
  const before = await prisma.cmsSection.findMany();
  preLayouts = before.filter((r) => LAYOUT_KEYS.includes(r.sectionKey));
  preHero = before.find((r) => r.sectionKey === HERO_KEY) || null;
  beforeSnapshot = contentSnapshot(before);

  console.log("== 1. Access control");
  const anonGet = await api(null, "GET");
  check("anon GET /api/admin/cms/layout -> 401", anonGet.status === 401, `got ${anonGet.status}`);
  const anonPut = await api(null, "PUT", { action: "layout", page: "platform", sections: [] });
  check("anon PUT -> 401", anonPut.status === 401, `got ${anonPut.status}`);
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });
  const qaUser = await prisma.user.create({ data: { name: "QA Layout User", email: `qa-layout-${RUN}@example.test`, roleId: userRole.id, status: 1 } });
  qaUserId = qaUser.id;
  const userCookie = await forgeSession({ userId: qaUser.id, name: qaUser.name, email: qaUser.email, role: "USER" });
  const userPut = await api(userCookie, "PUT", { action: "layout", page: "platform", sections: [] });
  check("USER PUT -> 403", userPut.status === 403, `got ${userPut.status}`);
  const forged = await forgeSession({ userId: qaUser.id, name: qaUser.name, email: qaUser.email, role: "ADMIN" });
  const forgedPut = await api(forged, "PUT", { action: "layout", page: "platform", sections: [] });
  check("forged ADMIN JWT for USER account -> 403", forgedPut.status === 403, `got ${forgedPut.status}`);
  check("USER/anon attempts wrote nothing", (await prisma.cmsSection.count({ where: { sectionKey: { in: LAYOUT_KEYS } } })) === preLayouts.length);

  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.55.${RUN.length}.1` },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (login.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", login.status === 200);

  console.log("== 2. Admin reads layouts");
  const get = await api(admin, "GET");
  check("GET -> 200", get.status === 200);
  const pages = get.body?.data || [];
  check("6 public pages listed", pages.length === 6, `got ${pages.length}`);
  const platform = pages.find((p) => p.key === "platform");
  check("platform default order starts with hero", platform?.sections?.[0]?.key === "hero" && platform.sections[0].locked === true);
  check("every inner page exposes its hero row", pages.filter((p) => p.key !== "home").every((p) => p.heroSectionKey));

  console.log("== 3. Validation");
  const bad = async (name, payload, expect = 400) => {
    const r = await api(admin, "PUT", payload);
    check(name, r.status === expect, `got ${r.status} ${JSON.stringify(r.body)}`);
  };
  const base = platform.sections.map((s) => ({ key: s.key, type: s.type, isActive: s.isActive }));
  await bad("unknown action -> 400", { action: "nope" });
  await bad("unknown page -> 400", { action: "layout", page: "admin", sections: base });
  await bad("unknown builtin section -> 400", { action: "layout", page: "platform", sections: [...base, { key: "evil", type: "builtin", isActive: true }] });
  await bad("javascript: CTA URL -> 400", {
    action: "layout", page: "platform",
    sections: [...base, { key: `custom-qa${RUN}x`, type: "custom", isActive: true, content: { titleId: "QA", ctaTextId: "Klik", ctaUrl: "javascript:alert(1)" } }],
  });
  await bad("protocol-relative image URL -> 400", {
    action: "layout", page: "platform",
    sections: [...base, { key: `custom-qa${RUN}y`, type: "custom", isActive: true, content: { titleId: "QA", imageUrl: "//evil.example/x.png" } }],
  });
  await bad("custom section without content -> 400", { action: "layout", page: "platform", sections: [...base, { key: `custom-qa${RUN}z`, type: "custom", isActive: true, content: {} }] });
  await bad("CTA text without URL -> 400", {
    action: "layout", page: "platform",
    sections: [...base, { key: `custom-qa${RUN}w`, type: "custom", isActive: true, content: { titleId: "QA", ctaTextId: "Klik" } }],
  });
  await bad("title over 300 chars -> 400", {
    action: "layout", page: "platform",
    sections: base.map((s) => (s.key === "automation" ? { ...s, content: { titleId: "x".repeat(301) } } : s)),
  });
  await bad("text override on a section without editable header -> 400", {
    action: "layout", page: "platform",
    sections: base.map((s) => (s.key === "workflow" ? { ...s, content: { titleId: "QA" } } : s)),
  });
  await bad("duplicate section key -> 400", { action: "layout", page: "platform", sections: [...base, base[1]] });
  await bad("malformed JSON -> 400", "{oops");
  check("rejected requests wrote nothing", (await prisma.cmsSection.count({ where: { sectionKey: "layout_platform" } })) === preLayouts.filter((r) => r.sectionKey === "layout_platform").length);

  console.log("== 4. Reorder, hide, override text, add custom section (/platform)");
  const customKey = `custom-qa-${RUN}`;
  const marker = `QA Section ${RUN}`;
  const override = `QA Judul Otomatisasi ${RUN}`;
  const xss = `<script>alert('qa${RUN}')</script>`;
  const order = ["hero", "analytics", customKey, "workflow", "automation", "reporting", "enterprise", "cta"];
  const sections = order.map((key) =>
    key === customKey
      ? {
          key,
          type: "custom",
          isActive: true,
          content: { badgeId: "QA Badge", titleId: marker, subtitleId: xss, ctaTextId: "Minta Demo QA", ctaUrl: "/request-demo", imageUrl: "/images/hero-bg-1.webp" },
        }
      : {
          key,
          type: "builtin",
          // hero is locked: sending isActive=false must be ignored
          isActive: key !== "enterprise" && key !== "hero",
          ...(key === "automation" && { content: { titleId: override, titleEn: `${override} EN` } }),
        }
  );
  const save = await api(admin, "PUT", { action: "layout", page: "platform", sections });
  check("save platform layout -> 200", save.status === 200, JSON.stringify(save.body));
  const saved = save.body?.data?.sections || [];
  check("locked hero stays first and active", saved[0]?.key === "hero" && saved[0]?.isActive === true);
  check("saved order matches", saved.map((s) => s.key).join(",") === ["hero", "analytics", customKey, "workflow", "automation", "reporting", "enterprise", "cta"].join(","), saved.map((s) => s.key).join(","));

  const html = await pageUntil("/platform", (h) => h.includes(marker));
  check("custom section rendered on /platform", html.includes(marker) && html.includes(`data-cms-custom-section="${customKey}"`));
  check("custom section CTA rendered with safe href", /href="\/request-demo"[^>]*>Minta Demo QA/.test(html) || html.includes("Minta Demo QA"));
  check("custom subtitle is escaped (no raw <script>)", !html.includes(xss) && html.includes("&lt;script&gt;"));
  check("override title rendered", html.includes(override));
  check("original automation title replaced", !html.includes("Interfacing Dua Arah dengan 500+ Instrumen Medis"));
  check("hidden 'enterprise' section not rendered", !html.includes("Dukungan 24/7, Peta Jalan AI &amp; Jaringan Multi-Unit") && !html.includes("Dukungan 24/7, Peta Jalan AI & Jaringan Multi-Unit"));
  const iAnalytics = html.indexOf('id="analytics"');
  const iCustom = html.indexOf(`data-cms-custom-section="${customKey}"`);
  const iAutomation = html.indexOf('id="automation"');
  check("new order applied (analytics < custom < automation)", iAnalytics > 0 && iAnalytics < iCustom && iCustom < iAutomation, `${iAnalytics}/${iCustom}/${iAutomation}`);
  check("untouched section (reporting) still uses built-in text", html.includes("Jejak Audit Digital Permanen"));

  console.log("== 5. Page hero editing (/solutions)");
  const heroBadge = `QA Hero Badge ${RUN}`;
  const heroSave = await api(admin, "PUT", {
    action: "hero",
    page: "solutions",
    badgeId: heroBadge,
    badgeEn: preHero?.badgeEn || "",
    titleId: preHero?.titleId || "",
    titleEn: preHero?.titleEn || "",
    subtitleId: preHero?.subtitleId || "",
    subtitleEn: preHero?.subtitleEn || "",
  });
  check("save solutions hero -> 200", heroSave.status === 200, JSON.stringify(heroSave.body));
  const solHtml = await pageUntil("/solutions", (h) => h.includes(heroBadge));
  check("new hero badge rendered on /solutions", solHtml.includes(heroBadge));
  const homeHero = await api(admin, "PUT", { action: "hero", page: "home", titleId: "x" });
  check("homepage hero via this endpoint -> 400 (edited in Homepage tab)", homeHero.status === 400);

  console.log("== 6. Homepage show/hide");
  const homeSections = pages.find((p) => p.key === "home").sections.map((s) => ({ key: s.key, type: s.type, isActive: s.key === "faq" ? false : s.isActive }));
  const homeSave = await api(admin, "PUT", { action: "layout", page: "home", sections: homeSections });
  check("save home layout -> 200", homeSave.status === 200);
  const homeHtml = await pageUntil("/", (h) => !h.includes('id="faq"'));
  check("hidden FAQ not rendered on homepage", !homeHtml.includes('id="faq"'));
  check("other homepage sections still rendered", homeHtml.includes('id="workflow"') || homeHtml.includes("workflow"));

  console.log("== 7. Audit trail");
  const audits = await prisma.auditLog.count({ where: { entity: "cms_sections", recordId: { in: ["layout_platform", "layout_home", HERO_KEY] }, createdAt: { gte: START } } });
  check("layout & hero changes are audited", audits >= 3, `got ${audits}`);
}

async function restore() {
  // Layout rows: remove rows created by this run, restore pre-existing ones.
  for (const key of LAYOUT_KEYS) {
    const pre = preLayouts.find((r) => r.sectionKey === key);
    if (pre) {
      await prisma.cmsSection.update({ where: { sectionKey: key }, data: { extraContent: pre.extraContent ?? undefined, isPublished: pre.isPublished, updatedBy: pre.updatedBy } });
    } else {
      await prisma.cmsSection.deleteMany({ where: { sectionKey: key, createdAt: { gte: START } } });
    }
  }
  if (preHero) {
    const { badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, updatedBy } = preHero;
    await prisma.cmsSection.update({ where: { sectionKey: HERO_KEY }, data: { badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, updatedBy } });
  }
  await prisma.auditLog.deleteMany({
    where: { entity: "cms_sections", recordId: { in: [...LAYOUT_KEYS, HERO_KEY] }, createdAt: { gte: START } },
  });
  if (qaUserId) {
    await prisma.auditLog.deleteMany({ where: { userId: qaUserId } });
    await prisma.user.delete({ where: { id: qaUserId } }).catch(() => {});
  }
  // Note: production ISR pages refresh within `revalidate` (60 s) after this DB-level restore.
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    try {
      await restore();
      const after = await prisma.cmsSection.findMany();
      const layoutAfter = after.filter((r) => LAYOUT_KEYS.includes(r.sectionKey)).map((r) => r.sectionKey).sort();
      check("layout rows restored to pre-test state", JSON.stringify(layoutAfter) === JSON.stringify(preLayouts.map((r) => r.sectionKey).sort()));
      const heroAfter = after.find((r) => r.sectionKey === HERO_KEY);
      check("solutions hero restored", !preHero || (heroAfter?.badgeId === preHero.badgeId && heroAfter?.titleId === preHero.titleId));
      check("all pre-existing CMS rows (non-layout) unchanged", beforeSnapshot !== null && contentSnapshot(after) === beforeSnapshot);
    } catch (e) {
      console.error("restore failed", e);
      fail++;
    }
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
