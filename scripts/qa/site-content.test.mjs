// Phase 8–10 integration tests: Footer / FAQ / Announcement CMS, hero CTA & metrics, legal pages,
// Magic Link from User Management, user-management integrity & error hygiene.
//
// Every row this test creates is removed and every row it changes is restored at the end
// (footer/faq/announcement rows that did not exist before are deleted again; page_solutions
// hero values are restored; QA users/leads/magic links/audit logs created by the run are deleted).
//
// Requirements: server running and a LOCAL development database.
//   node --env-file=.env scripts/qa/site-content.test.mjs
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
const SITE_KEYS = ["footer", "faq", "announcement"];
const HERO_KEY = "page_solutions";

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
};
let ipN = 1;
const ip = () => `10.91.${RUN.length}.${ipN++}`;

async function forge(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
  return `diagnova_session=${token}`;
}
async function call(cookie, method, path, body) {
  const headers = { "Content-Type": "application/json", "x-forwarded-for": ip() };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* html */
  }
  return { status: res.status, json, text };
}
async function page(path, predicate = () => true, tries = 6) {
  let html = "";
  for (let i = 0; i < tries; i++) {
    html = await (await fetch(`${BASE}${path}`)).text();
    if (predicate(html)) return html;
    await new Promise((r) => setTimeout(r, 800));
  }
  return html;
}
const esc = (s) => s.replace(/&/g, "&amp;");

const pre = { siteRows: [], hero: null };
const created = { userIds: [], leadIds: [] };

async function main() {
  pre.siteRows = await prisma.cmsSection.findMany({ where: { sectionKey: { in: SITE_KEYS } } });
  pre.hero = await prisma.cmsSection.findUnique({ where: { sectionKey: HERO_KEY } });
  const otherBefore = JSON.stringify(
    (await prisma.cmsSection.findMany({ where: { sectionKey: { notIn: [...SITE_KEYS, HERO_KEY] } }, orderBy: { sectionKey: "asc" } })).map(
      ({ sectionKey, badgeId, titleId, subtitleId, extraContent, isPublished }) => ({ sectionKey, badgeId, titleId, subtitleId, extraContent, isPublished })
    )
  );
  pre.otherBefore = otherBefore;

  const login = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip() },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  const admin = (login.headers.get("set-cookie") || "").split(";")[0];
  check("admin login", login.status === 200);
  const userRole = await prisma.role.findFirst({ where: { name: "USER" } });
  const qa = await prisma.user.create({ data: { name: "QA Site User", email: `qa-site-${RUN}@example.test`, roleId: userRole.id, status: 1 } });
  created.userIds.push(qa.id);
  const userCookie = await forge({ userId: qa.id, name: qa.name, email: qa.email, role: "USER" });

  console.log("== 1. Access control");
  for (const [m, p] of [["GET", "/api/admin/cms/site"], ["PUT", "/api/admin/cms/site"], ["GET", `/api/admin/users/${qa.id}/magic-link`], ["POST", `/api/admin/users/${qa.id}/magic-link`], ["POST", `/api/admin/leads/x/notes`]]) {
    const anon = await call(null, m, p, m === "GET" ? undefined : {});
    check(`anon ${m} ${p} -> 401`, anon.status === 401, `got ${anon.status}`);
    const usr = await call(userCookie, m, p, m === "GET" ? undefined : {});
    check(`USER ${m} ${p} -> 403`, usr.status === 403, `got ${usr.status}`);
  }

  console.log("== 2. Defaults (no CMS rows) are served unchanged");
  const g = await call(admin, "GET", "/api/admin/cms/site");
  check("GET site content -> 200", g.status === 200);
  const d = g.json?.data;
  if (pre.siteRows.length === 0) {
    check("defaults: footer 4 columns, faq 18 items / 5 categories, announcement 5 buttons", d.footer.content.columns.length === 4 && d.faq.content.items.length === 18 && d.faq.content.categories.length === 5 && d.announcement.content.items.length === 5);
    check("defaults are flagged as not saved", !d.footer.saved && !d.faq.saved && !d.announcement.saved);
  }
  // Tes sebelumnya (cms-layout) memulihkan data langsung di DB tanpa revalidasi; pada build
  // production halaman ISR baru segar setelah siklus revalidate (60 dtk). Tunggu hingga segar.
  const home0 = await page("/", (h) => h.includes("Untuk apa platform Diagnova LIS ini digunakan?"), 100);
  check("homepage shows default FAQ question", home0.includes("Untuk apa platform Diagnova LIS ini digunakan?"));
  check("homepage shows default announcement prompt", home0.includes("Pilih kebutuhan laboratorium Anda untuk memulai"));
  check("footer links to /terms and /privacy (no more /platform/reporting)", home0.includes('href="/terms"') && home0.includes('href="/privacy"') && !/Kebijakan Privasi<\/a>/.test(home0.split('href="/platform/reporting"')[1] || ""));
  check("footer default links use canonical anchors", home0.includes('href="/platform#workflow"') && !home0.includes('href="/platform/workflow"'));

  console.log("== 3. Legal pages");
  for (const p of ["/terms", "/privacy"]) {
    const r = await fetch(`${BASE}${p}`);
    const html = await r.text();
    check(`${p} -> 200`, r.status === 200, `got ${r.status}`);
    check(`${p} shows DRAFT banner and is noindex`, html.includes('data-testid="legal-draft-banner"') && /<meta name="robots" content="noindex/.test(html));
  }

  console.log("== 4. Validation");
  const footer = structuredClone(d.footer.content);
  const bad = async (name, type, data, expect = 400) => {
    const r = await call(admin, "PUT", "/api/admin/cms/site", { type, data });
    check(name, r.status === expect, `got ${r.status} ${r.json?.message || ""}`);
  };
  await bad("unknown type -> 400", "nope", {});
  await bad("javascript: link -> 400", "footer", { ...footer, columns: [{ ...footer.columns[0], links: [{ id: "x1", labelId: "X", labelEn: "", url: "javascript:alert(1)", isActive: true }] }] });
  await bad("protocol-relative logo -> 400", "footer", { ...footer, logoUrl: "//evil.example/logo.svg" });
  await bad("external logo (next/image) -> 400", "footer", { ...footer, logoUrl: "https://evil.example/logo.svg" });
  await bad("social link must be https -> 400", "footer", { ...footer, social: [{ id: "s1", platform: "X", url: "http://x.example", isActive: true }] });
  await bad("invalid contact email -> 400", "footer", { ...footer, contact: { ...footer.contact, email: "not-an-email" } });
  await bad("duplicate link ids -> 400", "footer", { ...footer, columns: [footer.columns[0], { ...footer.columns[1], links: footer.columns[0].links }] });
  const faq = structuredClone(d.faq.content);
  await bad("FAQ item with unknown category -> 400", "faq", { ...faq, items: [{ ...faq.items[0], category: "ghost" }] });
  await bad("FAQ item without question -> 400", "faq", { ...faq, items: [{ ...faq.items[0], questionId: "" }] });
  const ann = structuredClone(d.announcement.content);
  await bad("announcement end before start -> 400", "announcement", { ...ann, startsAt: "2026-12-02T00:00:00.000Z", endsAt: "2026-12-01T00:00:00.000Z" });
  check("rejected writes created no rows", (await prisma.cmsSection.count({ where: { sectionKey: { in: SITE_KEYS } } })) === pre.siteRows.length);

  console.log("== 5. Footer from CMS");
  const desc = `QA deskripsi perusahaan ${RUN}`;
  const newCol = { id: `col-qa${RUN}`, titleId: `QA Kolom ${RUN}`, titleEn: `QA Column ${RUN}`, isActive: true, links: [
    { id: `lk-qa${RUN}a`, labelId: `QA Tautan Aktif ${RUN}`, labelEn: "QA Active", url: "/request-demo", isActive: true },
    { id: `lk-qa${RUN}b`, labelId: `QA Tautan Mati ${RUN}`, labelEn: "QA Hidden", url: "/request-demo", isActive: false },
  ] };
  const fSave = await call(admin, "PUT", "/api/admin/cms/site", {
    type: "footer",
    baseUpdatedAt: d.footer.updatedAt,
    data: { ...footer, descriptionId: desc, contact: { ...footer.contact, email: "qa@example.test" }, columns: [...footer.columns, newCol] },
  });
  check("save footer -> 200", fSave.status === 200, JSON.stringify(fSave.json));
  const h1 = await page("/platform", (h) => h.includes(desc));
  check("footer description rendered (on every page)", h1.includes(desc));
  check("new link group + active link rendered", h1.includes(`QA Kolom ${RUN}`) && h1.includes(`QA Tautan Aktif ${RUN}`));
  check("inactive footer link hidden", !h1.includes(`QA Tautan Mati ${RUN}`));
  check("contact email rendered as mailto", h1.includes('href="mailto:qa@example.test"'));
  const stale = await call(admin, "PUT", "/api/admin/cms/site", { type: "footer", baseUpdatedAt: d.footer.updatedAt, data: footer });
  check("stale save (another admin saved meanwhile) -> 409", stale.status === 409, `got ${stale.status}`);

  console.log("== 6. FAQ from CMS");
  const q = `QA pertanyaan ${RUN}?`;
  const firstQ = faq.items[0].questionId;
  const faqSave = await call(admin, "PUT", "/api/admin/cms/site", {
    type: "faq",
    data: {
      ...faq,
      items: [
        { id: `faq-qa${RUN}`, category: faq.categories[0].id, questionId: q, questionEn: `QA question ${RUN}?`, answerId: "Jawaban QA.", answerEn: "QA answer.", isActive: true },
        ...faq.items.map((it, i) => (i === 0 ? { ...it, isActive: false } : it)),
      ],
    },
  });
  check("save FAQ -> 200", faqSave.status === 200, JSON.stringify(faqSave.json));
  const h2 = await page("/", (h) => h.includes(q));
  check("new FAQ shown first on homepage", h2.includes(q) && h2.indexOf(q) < h2.indexOf(faq.items[1].questionId));
  check("deactivated FAQ hidden", !h2.includes(firstQ));

  console.log("== 7. Announcement from CMS");
  const prompt = `QA pengumuman ${RUN}`;
  const a1 = await call(admin, "PUT", "/api/admin/cms/site", { type: "announcement", data: { ...ann, promptId: prompt, items: [{ id: `ann-qa${RUN}`, labelId: `QA Tombol ${RUN}`, labelEn: "QA", url: "/request-demo", isActive: true }] } });
  check("save announcement -> 200", a1.status === 200);
  const h3 = await page("/", (h) => h.includes(prompt));
  check("announcement text & button rendered", h3.includes(prompt) && h3.includes(`QA Tombol ${RUN}`));
  await call(admin, "PUT", "/api/admin/cms/site", { type: "announcement", data: { ...ann, promptId: prompt, enabled: false } });
  const h4 = await page("/", (h) => !h.includes(prompt));
  check("disabled announcement not rendered", !h4.includes(prompt) && !h4.includes("Interactive Goal Navigator"));
  await call(admin, "PUT", "/api/admin/cms/site", { type: "announcement", data: { ...ann, promptId: prompt, enabled: true, startsAt: null, endsAt: "2020-01-01T00:00:00.000Z" } });
  const h5 = await page("/", (h) => !h.includes(prompt));
  check("announcement outside its period not rendered", !h5.includes(prompt));

  console.log("== 8. Hero CTA & metrics (/solutions)");
  const pages = (await call(admin, "GET", "/api/admin/cms/layout")).json?.data || [];
  const sol = pages.find((p) => p.key === "solutions");
  check("layout API exposes hero defaults (2 CTAs, 4 metrics)", sol?.heroDefaults?.metrics?.length === 4 && !!sol?.heroDefaults?.primaryCta?.url);
  const ctaText = `QA CTA ${RUN}`;
  const hiddenMetric = sol.heroDefaults.metrics[0];
  const heroSave = await call(admin, "PUT", "/api/admin/cms/layout", {
    action: "hero",
    page: "solutions",
    badgeId: sol.hero?.badgeId || "", badgeEn: sol.hero?.badgeEn || "", titleId: sol.hero?.titleId || "", titleEn: sol.hero?.titleEn || "", subtitleId: sol.hero?.subtitleId || "", subtitleEn: sol.hero?.subtitleEn || "",
    primaryCta: { textId: ctaText, textEn: ctaText, url: "/request-demo" },
    secondaryCta: null,
    metrics: sol.heroDefaults.metrics.map((m, i) => (i === 0 ? { ...m, isActive: false } : m)),
  });
  check("save hero CTA/metrics -> 200", heroSave.status === 200, JSON.stringify(heroSave.json));
  const h6 = await page("/solutions", (h) => h.includes(ctaText));
  check("new primary CTA text rendered", h6.includes(ctaText));
  check("secondary CTA removed", !h6.includes(sol.heroDefaults.secondaryCta.textId));
  check("hidden metric not rendered, others still rendered", !h6.includes(`>${esc(hiddenMetric.labelId)}<`) && h6.includes(esc(sol.heroDefaults.metrics[1].labelId)));
  const keepItems = await prisma.cmsSection.findUnique({ where: { sectionKey: HERO_KEY } });
  check("other extraContent keys of page_solutions kept", !pre.hero || JSON.stringify(keepItems.extraContent?.items ?? null) === JSON.stringify(pre.hero.extraContent?.items ?? null));
  const badMetric = await call(admin, "PUT", "/api/admin/cms/layout", { action: "hero", page: "solutions", primaryCta: { textId: "x", textEn: "x", url: "javascript:1" } });
  check("unsafe CTA URL -> 400", badMetric.status === 400);

  console.log("== 9. Magic Link from User Management");
  const manual = await call(admin, "POST", "/api/admin/users", { name: "QA Manual", email: `qa-manual-${RUN}@example.test` });
  const manualId = manual.json?.data?.id;
  created.userIds.push(manualId);
  const list1 = (await call(admin, "GET", "/api/admin/users")).json?.data || [];
  const mRow = list1.find((u) => u.id === manualId);
  check("manual USER: not eligible (NO_DEMO_REQUEST) with explanation", mRow?.magicLink?.eligible === false && mRow?.magicLink?.code === "NO_DEMO_REQUEST" && mRow.magicLink.reason.length > 20);
  const mPost = await call(admin, "POST", `/api/admin/users/${manualId}/magic-link`);
  check("manual USER: POST magic-link -> 409 (backend-enforced)", mPost.status === 409, `got ${mPost.status}`);
  check("manual USER: no lead and no magic link created", (await prisma.lead.count({ where: { userId: manualId } })) === 0 && (await prisma.demoMagicLink.count({ where: { userId: manualId } })) === 0);
  const unknown = await call(admin, "POST", `/api/admin/users/does-not-exist/magic-link`);
  check("unknown user -> 404", unknown.status === 404, `got ${unknown.status}`);

  const leadEmail = `qa-lead-${RUN}@example.test`;
  const demo = await call(null, "POST", "/api/request-demo", { name: "QA Lead", institution: "RS QA", jobTitle: "Kepala Lab", email: leadEmail, phone: "081234567890", institutionType: "hospital" });
  const leadId = demo.json?.data?.id;
  created.leadIds.push(leadId);
  const appr = await call(admin, "POST", `/api/admin/leads/${leadId}/approve`, { durationDays: 4 });
  check("lead approved via Permohonan Demo", appr.status === 200);
  const leadUser = await prisma.user.findUnique({ where: { email: leadEmail } });
  created.userIds.push(leadUser.id);
  const firstLink = await prisma.demoMagicLink.findFirst({ where: { leadId }, orderBy: { createdAt: "desc" } });
  const list2 = (await call(admin, "GET", "/api/admin/users")).json?.data || [];
  check("approved-lead USER: eligible", list2.find((u) => u.id === leadUser.id)?.magicLink?.eligible === true);
  const before = await prisma.lead.findUnique({ where: { id: leadId } });
  const re = await call(admin, "POST", `/api/admin/users/${leadUser.id}/magic-link`);
  check("approved-lead USER: POST -> 200 with link", re.status === 200 && /\/auth\/verify-magic-link\?token=[a-f0-9]{64}$/.test(re.json?.data?.magicLinkUrl || ""), `got ${re.status}`);
  if (process.env.EXPECT_APP_URL) check("reissued link uses APP_URL origin", new URL(re.json.data.magicLinkUrl).origin === new URL(process.env.EXPECT_APP_URL).origin);
  const after = await prisma.lead.findUnique({ where: { id: leadId } });
  check("pipeline status unchanged by reissue (still Dihubungi)", after.status === before.status && after.status === 2);
  check("demo duration unchanged by reissue", after.demoDurationDays === 4);
  const oldLink = await prisma.demoMagicLink.findUnique({ where: { id: firstLink.id } });
  check("previous unused link invalidated", oldLink.expiresAt <= new Date() && oldLink.usedAt === null);
  check("reissue audited (MAGIC_LINK_REISSUED)", (await prisma.auditLog.count({ where: { recordId: leadId, action: "MAGIC_LINK_REISSUED" } })) >= 1);
  check("users list contains no password / hash / token", !/passwordHash|\$2[aby]\$|token/i.test(JSON.stringify(list2)));

  await call(admin, "PATCH", `/api/admin/users/${leadUser.id}/status`, { status: 0 });
  const inactive = await call(admin, "POST", `/api/admin/users/${leadUser.id}/magic-link`);
  check("inactive USER -> 409", inactive.status === 409);
  await call(admin, "PATCH", `/api/admin/users/${leadUser.id}/status`, { status: 1 });
  await prisma.user.update({ where: { id: leadUser.id }, data: { demoActivatedAt: new Date(Date.now() - 5 * 86400000), demoExpiresAt: new Date(Date.now() - 86400000) } });
  const expired = await call(admin, "POST", `/api/admin/users/${leadUser.id}/magic-link`);
  check("expired demo -> 409 (no useless link)", expired.status === 409 && /berakhir/.test(expired.json?.message || ""));

  console.log("== 10. User-management integrity & error hygiene");
  const delWithHistory = await call(admin, "DELETE", `/api/admin/users/${leadUser.id}`);
  check("deleting USER with demo-request history -> 409", delWithHistory.status === 409, `got ${delWithHistory.status}`);
  check("user and lead link kept", !!(await prisma.user.findUnique({ where: { id: leadUser.id } })) && (await prisma.lead.findUnique({ where: { id: leadId } })).userId === leadUser.id);
  const longName = await call(admin, "PUT", `/api/admin/users/${manualId}`, { name: "x".repeat(500) });
  check("over-long name -> 400 without Prisma internals", longName.status === 400 && !/prisma|value too long/i.test(longName.text), `got ${longName.status}`);
  const dupUpper = await call(admin, "POST", "/api/admin/users", { name: "QA Dup", email: `QA-MANUAL-${RUN}@EXAMPLE.TEST` });
  check("duplicate email (different case) rejected", dupUpper.status === 400);
  const delManual = await call(admin, "DELETE", `/api/admin/users/${manualId}`);
  check("deleting manual USER without history -> 200", delManual.status === 200);
  created.userIds = created.userIds.filter((x) => x !== manualId);
  const lisBig = await call(admin, "GET", "/api/lis/patients?limit=100000");
  check("LIS patients limit capped (<= 100)", lisBig.status === 200 && (lisBig.json?.data?.limit ?? 100) <= 100 && (lisBig.json?.data?.patients?.length ?? lisBig.json?.data?.data?.length ?? 0) <= 100);
  const lisNaN = await call(admin, "GET", "/api/lis/patients?limit=abc&page=-5");
  check("LIS pagination with invalid numbers -> 200 (defaults)", lisNaN.status === 200);
}

async function cleanup() {
  for (const id of created.leadIds.filter(Boolean)) {
    await prisma.auditLog.deleteMany({ where: { recordId: id } });
    await prisma.demoMagicLink.deleteMany({ where: { leadId: id } });
    await prisma.lead.deleteMany({ where: { id } });
  }
  for (const id of created.userIds.filter(Boolean)) {
    await prisma.auditLog.deleteMany({ where: { OR: [{ userId: id }, { recordId: id }] } });
    await prisma.user.deleteMany({ where: { id } });
  }
  for (const key of SITE_KEYS) {
    const p = pre.siteRows.find((r) => r.sectionKey === key);
    if (p) {
      const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = p;
      await prisma.cmsSection.update({ where: { sectionKey: key }, data: { ...rest, extraContent: rest.extraContent ?? undefined } });
    } else {
      await prisma.cmsSection.deleteMany({ where: { sectionKey: key, createdAt: { gte: START } } });
    }
  }
  if (pre.hero) {
    const { badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, extraContent, updatedBy } = pre.hero;
    await prisma.cmsSection.update({ where: { sectionKey: HERO_KEY }, data: { badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, extraContent: extraContent ?? undefined, updatedBy } });
  }
  await prisma.auditLog.deleteMany({ where: { entity: "cms_sections", recordId: { in: [...SITE_KEYS, HERO_KEY] }, createdAt: { gte: START } } });
  await prisma.auditLog.deleteMany({ where: { entity: "User", createdAt: { gte: START }, newValue: { path: ["email"], string_ends_with: "@example.test" } } });
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    try {
      await cleanup();
      check("site content rows restored", (await prisma.cmsSection.count({ where: { sectionKey: { in: SITE_KEYS } } })) === pre.siteRows.length);
      const otherAfter = JSON.stringify(
        (await prisma.cmsSection.findMany({ where: { sectionKey: { notIn: [...SITE_KEYS, HERO_KEY] } }, orderBy: { sectionKey: "asc" } })).map(
          ({ sectionKey, badgeId, titleId, subtitleId, extraContent, isPublished }) => ({ sectionKey, badgeId, titleId, subtitleId, extraContent, isPublished })
        )
      );
      check("all other CMS rows unchanged", otherAfter === pre.otherBefore);
      const heroAfter = await prisma.cmsSection.findUnique({ where: { sectionKey: HERO_KEY } });
      check("page_solutions restored", !pre.hero || JSON.stringify(heroAfter.extraContent) === JSON.stringify(pre.hero.extraContent));
    } catch (e) {
      console.error("cleanup failed", e);
      fail++;
    }
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
