// CMS seluruh halaman: konten section bawaan halaman dalam (Halaman & Section › Isi Section),
// tampil di website publik, validasi, penyimpanan yang tidak saling menimpa, dan CMS Homepage.
//
// Semua baris CMS yang diubah dikembalikan persis seperti semula di akhir tes (baris yang belum
// ada sebelumnya dihapus lagi). Jalankan hanya terhadap database LOKAL (sebaiknya klon sementara).
//   node --env-file=.env scripts/qa/cms-pages.test.mjs
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36);
const START = new Date();
const PAGE_PATHS = { platform: "/platform", solutions: "/solutions", modules: "/modules", nova_ai: "/nova-ai", integration: "/integration" };
const TOUCHED_KEYS = ["layout_platform", "layout_solutions", "layout_modules", "layout_nova_ai", "layout_integration", "hero", "trusted_by", "navigation"];

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
};
let ipN = 1;
const ip = () => `10.93.${RUN.length}.${(ipN++ % 250) + 1}`;

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip() },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  return (res.headers.get("set-cookie") || "").split(";")[0];
}
async function call(cookie, method, path, body) {
  const headers = { "Content-Type": "application/json", "x-forwarded-for": ip() };
  if (cookie) headers.cookie = cookie;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}
/** Halaman publik; diulang sampai predicate terpenuhi (ISR/revalidasi) — maks. ~75 detik. */
async function publicHtml(path, predicate = () => true) {
  let html = "";
  for (let i = 0; i < 50; i++) {
    html = await (await fetch(`${BASE}${path}`, { headers: { "cache-control": "no-cache" } })).text();
    if (predicate(html)) return html;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return html;
}
const visibleText = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
const isBi = (f) => f.bilingual ?? (f.type === "text" || f.type === "textarea");
const firstTextField = (fields) => fields.find((f) => isBi(f));

function newItem(list, marker) {
  const item = { id: `qa-${RUN}-${Math.random().toString(36).slice(2, 6)}`, isActive: true };
  for (const f of list.fields) {
    if (isBi(f)) {
      item[`${f.key}Id`] = f.required ? marker : "";
      item[`${f.key}En`] = "";
    } else if (f.type === "select") {
      const opts = f.options || [];
      item[f.key] = (opts.find((o) => o.value === "none") ?? opts[0])?.value ?? "";
    } else {
      item[f.key] = f.required ? (f.type === "url" ? "/request-demo" : "QA") : "";
    }
  }
  const tf = firstTextField(list.fields);
  if (tf) item[`${tf.key}Id`] = marker;
  return item;
}

async function getPages(admin) {
  const r = await call(admin, "GET", "/api/admin/cms/layout");
  return r.json?.data || [];
}
async function saveContent(admin, page, sectionKey, content, baseUpdatedAt) {
  return call(admin, "PUT", "/api/admin/cms/layout", { action: "content", page, sectionKey, content, baseUpdatedAt });
}

const snapshot = new Map();

async function main() {
  for (const r of await prisma.cmsSection.findMany({ where: { sectionKey: { in: TOUCHED_KEYS } } })) snapshot.set(r.sectionKey, r);

  const admin = await login();
  check("admin login", admin.startsWith("diagnova_session="));
  check("content API requires login", (await call(null, "PUT", "/api/admin/cms/layout", { action: "content" })).status === 401);

  let pages = await getPages(admin);
  const inner = pages.filter((p) => p.key !== "home");
  check("5 inner pages expose section content definitions", inner.length === 5 && inner.every((p) => p.contentDefs && Object.keys(p.contentDefs).length >= 4));

  console.log("== 1. CRUD per section, reflected on the public website");
  let sectionCount = 0;
  let visibleCount = 0;
  for (const p of inner) {
    const path = PAGE_PATHS[p.key];
    for (const [sectionKey, def] of Object.entries(p.contentDefs)) {
      sectionCount++;
      pages = await getPages(admin);
      const pg = pages.find((x) => x.key === p.key);
      const value = JSON.parse(JSON.stringify(pg.content[sectionKey]));
      // Penanda pendek (<= 9 karakter) agar muat di field berbatas pendek (mis. angka 20 karakter).
      const tag = `${RUN.slice(-4)}${sectionCount.toString(36)}`;
      const M = { edit: `QE${tag}`, add: `QA${tag}`, hidden: `QH${tag}`, field: `QF${tag}` };
      const list = (def.lists || [])[0];
      const fieldDef = (def.fields || []).find((f) => isBi(f));
      if (fieldDef) value.fields[`${fieldDef.key}Id`] = M.field;
      let added = null;
      if (list) {
        const items = value.lists[list.key];
        const tf = firstTextField(list.fields);
        if (tf && items[0]) items[0][`${tf.key}Id`] = M.edit;
        if (tf && items[1]) {
          items[1][`${tf.key}Id`] = M.hidden;
          items[1].isActive = false;
        }
        if (!list.fixedCount && items.length < list.maxItems) {
          added = newItem(list, M.add);
          items.push(added);
        }
      }
      const s1 = await saveContent(admin, p.key, sectionKey, value, pg.layoutUpdatedAt);
      check(`${p.key}/${sectionKey}: save -> 200`, s1.status === 200, JSON.stringify(s1.json).slice(0, 300));
      const expectMarkers = [list && firstTextField(list.fields) ? M.edit : null, added ? M.add : null, fieldDef ? M.field : null].filter(Boolean);
      const html = await publicHtml(path, (h) => expectMarkers.every((m) => h.includes(m)));
      check(`${p.key}/${sectionKey}: edited/added content appears on ${path}`, expectMarkers.every((m) => html.includes(m)), expectMarkers.filter((m) => !html.includes(m)).join(","));
      if (expectMarkers.some((m) => visibleText(html).includes(m))) visibleCount++;
      if (list && value.lists[list.key][1]) check(`${p.key}/${sectionKey}: hidden item not in page source`, !html.includes(M.hidden));

      if (added) {
        const v2 = JSON.parse(JSON.stringify(s1.json.data.content));
        v2.lists[list.key] = v2.lists[list.key].filter((it) => it.id !== added.id);
        const items = v2.lists[list.key];
        if (items.length > 1) items.push(items.shift()); // reorder: first item moved to the end
        const s2 = await saveContent(admin, p.key, sectionKey, v2, s1.json.data.updatedAt);
        check(`${p.key}/${sectionKey}: delete + reorder -> 200`, s2.status === 200, JSON.stringify(s2.json).slice(0, 200));
        const ids = (s2.json?.data?.content?.lists?.[list.key] || []).map((it) => it.id);
        check(`${p.key}/${sectionKey}: deleted item gone, order saved`, !ids.includes(added.id) && (items.length < 2 || ids[ids.length - 1] === items[items.length - 1].id));
        const h2 = await publicHtml(path, (h) => !h.includes(M.add));
        check(`${p.key}/${sectionKey}: deleted item no longer on public page`, !h2.includes(M.add));
      }

      pages = await getPages(admin);
      const fresh = pages.find((x) => x.key === p.key);
      const reset = await saveContent(admin, p.key, sectionKey, null, fresh.layoutUpdatedAt);
      check(`${p.key}/${sectionKey}: reset to defaults -> 200`, reset.status === 200);
      const h3 = await publicHtml(path, (h) => !expectMarkers.some((m) => h.includes(m)));
      check(`${p.key}/${sectionKey}: defaults restored on public page`, !expectMarkers.some((m) => h3.includes(m)));
    }
  }
  check(`all ${sectionCount} sections covered (>= 20)`, sectionCount >= 20);
  console.log(`  INFO  sections whose edited text is visible in the initial render: ${visibleCount}/${sectionCount} (others are in tabs / interactive panels, verified in the page payload)`);

  console.log("== 2. Validation");
  pages = await getPages(admin);
  const pick = (pred) => {
    for (const p of pages.filter((x) => x.key !== "home")) for (const [k, d] of Object.entries(p.contentDefs)) if (pred(d)) return { p, k, d };
    return null;
  };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const urlCase = pick((d) => (d.fields || []).some((f) => f.type === "url") || (d.lists || []).some((l) => l.fields.some((f) => f.type === "url")));
  if (urlCase) {
    const v = clone(urlCase.p.content[urlCase.k]);
    const ff = (urlCase.d.fields || []).find((f) => f.type === "url");
    if (ff) v.fields[ff.key] = "javascript:alert(1)";
    else {
      const l = urlCase.d.lists.find((l) => l.fields.some((f) => f.type === "url"));
      v.lists[l.key][0][l.fields.find((f) => f.type === "url").key] = "javascript:alert(1)";
    }
    check("javascript: URL -> 400", (await saveContent(admin, urlCase.p.key, urlCase.k, v, urlCase.p.layoutUpdatedAt)).status === 400);
  }
  const selCase = pick((d) => (d.lists || []).some((l) => l.fields.some((f) => f.type === "select")));
  if (selCase) {
    const v = clone(selCase.p.content[selCase.k]);
    const l = selCase.d.lists.find((l) => l.fields.some((f) => f.type === "select"));
    v.lists[l.key][0][l.fields.find((f) => f.type === "select").key] = "bogus-option";
    check("unknown select option -> 400", (await saveContent(admin, selCase.p.key, selCase.k, v, selCase.p.layoutUpdatedAt)).status === 400);
  }
  const maxCase = pick((d) => (d.lists || []).some((l) => !l.fixedCount));
  if (maxCase) {
    const v = clone(maxCase.p.content[maxCase.k]);
    const l = maxCase.d.lists.find((l) => !l.fixedCount);
    while (v.lists[l.key].length <= l.maxItems) v.lists[l.key].push(newItem(l, `QM${RUN.slice(-4)}`));
    check(`more than maxItems (${l.maxItems}) -> 400`, (await saveContent(admin, maxCase.p.key, maxCase.k, v, maxCase.p.layoutUpdatedAt)).status === 400);
    const v2 = clone(maxCase.p.content[maxCase.k]);
    if (v2.lists[l.key].length >= 2) {
      v2.lists[l.key][1].id = v2.lists[l.key][0].id;
      check("duplicate item ids -> 400", (await saveContent(admin, maxCase.p.key, maxCase.k, v2, maxCase.p.layoutUpdatedAt)).status === 400);
    }
  }
  const fixedCase = pick((d) => (d.lists || []).some((l) => l.fixedCount));
  if (fixedCase) {
    const v = clone(fixedCase.p.content[fixedCase.k]);
    const l = fixedCase.d.lists.find((l) => l.fixedCount);
    v.lists[l.key].pop();
    check("removing an item from a fixed-count list -> 400", (await saveContent(admin, fixedCase.p.key, fixedCase.k, v, fixedCase.p.layoutUpdatedAt)).status === 400);
  }
  const reqCase = pick((d) => (d.lists || []).some((l) => l.fields.some((f) => f.required && isBi(f))));
  if (reqCase) {
    const v = clone(reqCase.p.content[reqCase.k]);
    const l = reqCase.d.lists.find((l) => l.fields.some((f) => f.required && isBi(f)));
    v.lists[l.key][0][`${l.fields.find((f) => f.required && isBi(f)).key}Id`] = "";
    check("empty required field -> 400", (await saveContent(admin, reqCase.p.key, reqCase.k, v, reqCase.p.layoutUpdatedAt)).status === 400);
  }
  check("unknown section -> 400", (await saveContent(admin, "platform", "does-not-exist", {}, null)).status === 400);
  check("unknown page -> 400", (await saveContent(admin, "home", "hero", {}, null)).status === 400);
  const rejectedLeft = await prisma.cmsSection.findMany({ where: { sectionKey: { startsWith: "layout_" } } });
  check("rejected saves stored nothing", !JSON.stringify(rejectedLeft).includes(`QM${RUN.slice(-4)}`));

  console.log("== 3. Saves do not overwrite each other");
  pages = await getPages(admin);
  const pl = pages.find((x) => x.key === "platform");
  const [kA, kB] = Object.keys(pl.contentDefs);
  const base = pl.layoutUpdatedAt;
  const sA = await saveContent(admin, "platform", kA, pl.content[kA], base);
  check("save with current base -> 200", sA.status === 200);
  const stale = await saveContent(admin, "platform", kB, pl.content[kB], base);
  check("save with stale base (other admin saved first) -> 409", stale.status === 409, `got ${stale.status}`);
  const staleLayout = await call(admin, "PUT", "/api/admin/cms/layout", {
    action: "layout", page: "platform", baseUpdatedAt: base,
    sections: pl.sections.map((s) => ({ key: s.key, type: s.type, isActive: s.isActive })),
  });
  check("layout save with stale base after content save -> 409", staleLayout.status === 409, `got ${staleLayout.status}`);
  pages = await getPages(admin);
  const pl2 = pages.find((x) => x.key === "platform");
  const [r1, r2] = await Promise.all([
    saveContent(admin, "platform", kA, pl2.content[kA], pl2.layoutUpdatedAt),
    saveContent(admin, "platform", kB, pl2.content[kB], pl2.layoutUpdatedAt),
  ]);
  check("two simultaneous saves with the same base -> exactly one 200 and one 409", [r1.status, r2.status].sort().join(",") === "200,409", `${r1.status},${r2.status}`);
  pages = await getPages(admin);
  const pl3 = pages.find((x) => x.key === "platform");
  const freshLayout = await call(admin, "PUT", "/api/admin/cms/layout", {
    action: "layout", page: "platform", baseUpdatedAt: pl3.layoutUpdatedAt,
    sections: pl3.sections.map((s) => ({ key: s.key, type: s.type, isActive: s.isActive })),
  });
  check("layout save with fresh base -> 200", freshLayout.status === 200);
  pages = await getPages(admin);
  check("saving the layout keeps saved section content", pages.find((x) => x.key === "platform").contentCustomized.includes(kA));

  console.log("== 4. CMS Homepage (hub) guards");
  const heroRow = await prisma.cmsSection.findUnique({ where: { sectionKey: "hero" } });
  const slidesBefore = JSON.stringify(heroRow?.extraContent?.slides ?? null);
  const hubSec = await call(admin, "PUT", "/api/admin/cms/homepage", {
    type: "section", sectionKey: "hero",
    data: { titleId: heroRow?.titleId ?? null, extraContent: { ...(heroRow?.extraContent || {}), slides: [] } },
  });
  check("hub section save -> 200", hubSec.status === 200, JSON.stringify(hubSec.json));
  const heroAfter = await prisma.cmsSection.findUnique({ where: { sectionKey: "hero" } });
  check("section save cannot wipe slides (item list protected)", JSON.stringify(heroAfter?.extraContent?.slides ?? null) === slidesBefore);
  check("hub cannot write other screens' rows (footer) -> 400", (await call(admin, "PUT", "/api/admin/cms/homepage", { type: "section", sectionKey: "footer", data: { extraContent: {} } })).status === 400);
  check("hub cannot write inner-page rows (page_platform) -> 400", (await call(admin, "PUT", "/api/admin/cms/homepage", { type: "section", sectionKey: "page_platform", data: { titleId: "x" } })).status === 400);
  check("legacy solution_item path disabled -> 410", (await call(admin, "PUT", "/api/admin/cms/homepage", { type: "solution_item", data: { slug: "x" } })).status === 410);
  check("legacy /api/admin/menus API removed", (await call(admin, "GET", "/api/admin/menus")).status === 404);

  const partnerIds = [];
  const saves = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      call(admin, "PUT", "/api/admin/cms/homepage", { type: "partner", data: { name: `QAP${RUN}${i}`, logoUrl: "/logo.png", isActive: true } })
    )
  );
  check("5 simultaneous partner saves -> all 200", saves.every((s) => s.status === 200), saves.map((s) => s.status).join(","));
  const partners = (await prisma.cmsSection.findUnique({ where: { sectionKey: "trusted_by" } }))?.extraContent?.partners || [];
  const mine = partners.filter((x) => String(x.name || "").startsWith(`QAP${RUN}`));
  mine.forEach((x) => partnerIds.push(x.id));
  check("all 5 simultaneous partners stored (no lost update)", mine.length === 5, `stored ${mine.length}`);
  const dels = await Promise.all(partnerIds.map((id) => call(admin, "PUT", "/api/admin/cms/homepage", { type: "partner", action: "delete", data: { id } })));
  check("5 simultaneous deletes -> all 200", dels.every((s) => s.status === 200));
  const left = ((await prisma.cmsSection.findUnique({ where: { sectionKey: "trusted_by" } }))?.extraContent?.partners || []).filter((x) => String(x.name || "").startsWith(`QAP${RUN}`));
  check("all simultaneous deletes applied", left.length === 0, `left ${left.length}`);

  const rootA = await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", data: { labelId: `QANAVA${RUN}`, labelEn: "A", url: "/", isActive: false } });
  const rootB = await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", data: { labelId: `QANAVB${RUN}`, labelEn: "B", url: "/", isActive: false } });
  const nav = () => prisma.cmsSection.findUnique({ where: { sectionKey: "navigation" } }).then((r) => r?.extraContent?.menus || []);
  let menus = await nav();
  const a = menus.find((m) => m.labelId === `QANAVA${RUN}`);
  const b = menus.find((m) => m.labelId === `QANAVB${RUN}`);
  check("two test root menus created", rootA.status === 200 && rootB.status === 200 && !!a && !!b);
  await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", data: { parentId: a.id, labelId: `QASUB${RUN}`, labelEn: "S", url: "/", isActive: true } });
  menus = await nav();
  const sub = menus.find((m) => m.id === a.id).submenus.find((s) => s.labelId === `QASUB${RUN}`);
  const editRoot = await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", data: { ...a, labelId: `QANAVA${RUN}x`, submenus: [] } });
  menus = await nav();
  check("editing a root menu with a stale (empty) submenu copy keeps its submenus", editRoot.status === 200 && menus.find((m) => m.id === a.id).submenus.some((s) => s.id === sub.id));
  await call(admin, "PUT", "/api/admin/cms/homepage", { type: "navigation", data: { ...sub, parentId: b.id } });
  menus = await nav();
  const copies = menus.flatMap((m) => m.submenus || []).filter((s) => s.id === sub.id);
  check("moving a submenu to another parent leaves exactly one copy", copies.length === 1 && menus.find((m) => m.id === b.id).submenus.some((s) => s.id === sub.id));
}

async function restore() {
  for (const key of TOUCHED_KEYS) {
    const before = snapshot.get(key);
    if (before) {
      const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = before;
      await prisma.cmsSection.update({ where: { sectionKey: key }, data: { ...rest, extraContent: rest.extraContent ?? undefined } });
    } else {
      await prisma.cmsSection.deleteMany({ where: { sectionKey: key, createdAt: { gte: START } } });
    }
  }
  const after = await prisma.cmsSection.findMany({ where: { sectionKey: { in: TOUCHED_KEYS } } });
  const same = after.length === snapshot.size && after.every((r) => {
    const b = snapshot.get(r.sectionKey);
    return b && JSON.stringify(b.extraContent) === JSON.stringify(r.extraContent) && b.titleId === r.titleId && b.isPublished === r.isPublished;
  });
  check("CMS rows restored exactly", same);
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    await restore().catch((e) => {
      console.error("restore failed", e);
      fail++;
    });
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
