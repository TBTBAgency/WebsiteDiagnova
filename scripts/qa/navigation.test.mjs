// Pengelolaan submenu navigasi (CMS Homepage › Navigasi Website) untuk kelima kelompok menu:
// tambah, ubah nama & URL, ubah urutan, sembunyikan/tampilkan, hapus, validasi, dan tampil di
// navigasi publik (dirender server di layout). Baris navigasi dikembalikan persis seperti semula.
//   node --env-file=.env scripts/qa/navigation.test.mjs
import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production" || !/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || "")) {
  console.error("Refusing to run: QA tests may only run against a local development database.");
  process.exit(2);
}

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();
const RUN = Date.now().toString(36).slice(-5);
const GROUPS = [
  ["Platform", "/platform"],
  ["Solusi", "/solutions"],
  ["Modul", "/modules"],
  ["Nova AI", "/nova-ai"],
  ["Integrasi", "/integration"],
];

let pass = 0;
let fail = 0;
const check = (name, cond, extra = "") => {
  cond ? pass++ : fail++;
  console.log(`  ${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`);
};
let ipN = 1;
const ip = () => `10.94.${RUN.length}.${(ipN++ % 250) + 1}`;

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip() },
    body: JSON.stringify({ email: "admin@diagnova.id", password: process.env.SEED_ADMIN_PASSWORD || "Diagnova2026!" }),
  });
  return (res.headers.get("set-cookie") || "").split(";")[0];
}
async function nav(admin, action, data) {
  const res = await fetch(`${BASE}/api/admin/cms/homepage`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie: admin, "x-forwarded-for": ip() },
    body: JSON.stringify({ type: "navigation", action, data }),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}
const stored = async () => (await prisma.cmsSection.findUnique({ where: { sectionKey: "navigation" } }))?.extraContent?.menus || [];
/** HTML halaman publik (navbar dirender server); diulang sampai predicate terpenuhi (ISR). */
async function publicHtml(path, predicate) {
  let html = "";
  for (let i = 0; i < 50; i++) {
    html = await (await fetch(`${BASE}${path}`)).text();
    if (predicate(html)) return html;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return html;
}
/** Teks seperti di page source: "&" ter-escape di payload React (\u0026) atau HTML (&amp;). */
const inPage = (html, text) => [text, text.replace(/&/g, "\\u0026"), text.replace(/&/g, "&amp;")].some((v) => html.includes(v));
/** Bagian payload navbar milik satu kelompok menu (mulai dari id kelompok). */
const groupSlice = (html, groupId) => {
  // Data navbar ada di payload React sebagai initialMenus; id kelompok diikuti tanda kutip (escape),
  // supaya tidak tertukar dengan id submenu yang berawalan sama (mis. nav-platform-1).
  const start = html.indexOf("initialMenus");
  const i = start < 0 ? -1 : html.indexOf(`${groupId}\\"`, start);
  return i < 0 ? "" : html.slice(i, i + 6000);
};
const publicMenus = async () => (await (await fetch(`${BASE}/api/menus`)).json()).data || [];

let snapshot = null;

async function main() {
  snapshot = await prisma.cmsSection.findUnique({ where: { sectionKey: "navigation" } });
  const admin = await login();
  check("admin login", admin.startsWith("diagnova_session="));
  check("navigation API requires login", (await fetch(`${BASE}/api/admin/cms/homepage`, { method: "PUT", body: "{}" })).status === 401);

  const initial = await stored();
  for (const [label] of GROUPS) {
    const g = initial.find((m) => m.labelId === label);
    check(`${label}: group exists with submenus as initial data`, !!g && (g.submenus || []).length >= 3, `found ${(g?.submenus || []).length}`);
  }
  const home = await publicHtml("/", () => true);
  const allSubs = initial.flatMap((m) => (m.isActive ? (m.submenus || []).filter((s) => s.isActive) : []));
  check("public navbar is rendered from CMS on the server (every active submenu label in the page)", allSubs.every((s) => inPage(home, s.labelId)), allSubs.filter((s) => !inPage(home, s.labelId)).map((s) => s.labelId).join(","));

  for (const [label, path] of GROUPS) {
    console.log(`== ${label}`);
    const tag = label.replace(/\s/g, "").slice(0, 3).toUpperCase();
    const before = (await stored()).find((m) => m.labelId === label);
    const groupId = before.id;
    const origFirst = before.submenus[0];
    const add = `QANav${tag}${RUN}`;
    const addEn = `QANavEn${tag}${RUN}`;

    // 1. Tambah
    const r1 = await nav(admin, "save", { parentId: groupId, labelId: add, labelEn: addEn, url: `${path}#qa-${RUN}`, isActive: true });
    check(`${label}: add submenu -> 200`, r1.status === 200, JSON.stringify(r1.json));
    let g = (await stored()).find((m) => m.id === groupId);
    const added = g.submenus.find((s) => s.labelId === add);
    check(`${label}: new submenu stored under its parent, placed last`, !!added && g.submenus[g.submenus.length - 1].id === added?.id);
    check(`${label}: sort order renumbered 1..n`, g.submenus.every((s, i) => s.sortOrder === i + 1));
    let html = await publicHtml("/", (h) => h.includes(add));
    check(`${label}: new submenu appears in the public navigation`, html.includes(add));

    // 2. Ubah nama & URL
    const renamed = `QARen${tag}${RUN}`;
    const r2 = await nav(admin, "save", { ...added, parentId: groupId, labelId: renamed, labelEn: `QARenEn${tag}${RUN}`, url: `${path}#qa2-${RUN}` });
    check(`${label}: edit name & URL -> 200`, r2.status === 200, JSON.stringify(r2.json));
    g = (await stored()).find((m) => m.id === groupId);
    const edited = g.submenus.find((s) => s.id === added.id);
    check(`${label}: name and URL updated, same item, still last`, edited?.labelId === renamed && edited?.url === `${path}#qa2-${RUN}` && g.submenus[g.submenus.length - 1].id === added.id);
    html = await publicHtml("/", (h) => h.includes(renamed) && !h.includes(add));
    check(`${label}: public navigation shows the new name and URL`, html.includes(renamed) && html.includes(`${path}#qa2-${RUN}`) && !html.includes(add));

    // 3. Ubah urutan (submenu baru ke posisi pertama)
    const order = [added.id, ...g.submenus.filter((s) => s.id !== added.id).map((s) => s.id)];
    const r3 = await nav(admin, "reorder", { parentId: groupId, orderedIds: order });
    check(`${label}: reorder -> 200`, r3.status === 200, JSON.stringify(r3.json));
    let pubGroup = null;
    for (let i = 0; i < 20; i++) {
      pubGroup = (await publicMenus()).find((m) => m.id === groupId);
      if (pubGroup?.submenus?.[0]?.id === added.id) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    check(`${label}: public order follows the CMS (moved item first, previous first second)`, pubGroup?.submenus?.[0]?.id === added.id && pubGroup?.submenus?.[1]?.id === origFirst.id);
    const ordered = (h) => {
      const s = groupSlice(h, groupId);
      return s.indexOf(renamed) > -1 && s.indexOf(origFirst.id) > -1 && s.indexOf(renamed) < s.indexOf(origFirst.id);
    };
    html = await publicHtml("/", ordered);
    check(`${label}: server-rendered navigation uses the new order`, ordered(html));
    // Edit lewat form dengan nomor urutan: pindah ke posisi 2.
    const r3b = await nav(admin, "save", { ...edited, parentId: groupId, labelId: renamed, url: `${path}#qa2-${RUN}`, sortOrder: 2 });
    g = (await stored()).find((m) => m.id === groupId);
    check(`${label}: setting 'Urutan' = 2 in the form puts the item at position 2`, r3b.status === 200 && g.submenus[1].id === added.id && g.submenus[0].id === origFirst.id);

    // 4. Sembunyikan & tampilkan
    const r4 = await nav(admin, "save", { ...g.submenus[1], parentId: groupId, isActive: false });
    check(`${label}: hide -> 200`, r4.status === 200);
    html = await publicHtml("/", (h) => !h.includes(renamed));
    check(`${label}: hidden submenu is not in the public page (not even in the page payload)`, !html.includes(renamed));
    g = (await stored()).find((m) => m.id === groupId);
    check(`${label}: hidden submenu keeps its data and position in the CMS`, g.submenus[1]?.id === added.id && g.submenus[1]?.isActive === false && g.submenus[1]?.labelId === renamed);
    const editHidden = await nav(admin, "save", { id: added.id, parentId: groupId, labelId: renamed, labelEn: "x", url: `${path}#qa2-${RUN}` });
    g = (await stored()).find((m) => m.id === groupId);
    check(`${label}: editing a hidden submenu without the flag keeps it hidden`, editHidden.status === 200 && g.submenus.find((s) => s.id === added.id)?.isActive === false);
    const r5 = await nav(admin, "save", { ...g.submenus.find((s) => s.id === added.id), parentId: groupId, isActive: true });
    check(`${label}: show again -> 200`, r5.status === 200);
    html = await publicHtml("/", (h) => h.includes(renamed));
    check(`${label}: shown submenu is back in the public navigation`, html.includes(renamed));

    // 5. Hapus
    const r6 = await nav(admin, "delete", { id: added.id });
    check(`${label}: delete -> 200`, r6.status === 200);
    g = (await stored()).find((m) => m.id === groupId);
    check(`${label}: deleted submenu removed; other submenus intact and renumbered`, !g.submenus.some((s) => s.id === added.id) && g.submenus.length === before.submenus.length && g.submenus.every((s, i) => s.sortOrder === i + 1 && s.id === before.submenus[i].id));
    html = await publicHtml("/", (h) => !h.includes(renamed));
    check(`${label}: deleted submenu no longer in the public navigation`, !html.includes(renamed));
  }

  console.log("== Validation & integrity");
  const menus = await stored();
  const plat = menus.find((m) => m.labelId === "Platform");
  check("javascript: URL -> 400", (await nav(admin, "save", { parentId: plat.id, labelId: "x", labelEn: "x", url: "javascript:alert(1)" })).status === 400);
  check("protocol-relative //host URL -> 400", (await nav(admin, "save", { parentId: plat.id, labelId: "x", labelEn: "x", url: "//evil.example" })).status === 400);
  check("empty label -> 400", (await nav(admin, "save", { parentId: plat.id, labelId: " ", labelEn: "x", url: "/platform" })).status === 400);
  check("no URL and no section -> 400", (await nav(admin, "save", { parentId: plat.id, labelId: "x", labelEn: "x", url: "" })).status === 400);
  check("unknown section anchor -> 400", (await nav(admin, "save", { parentId: plat.id, labelId: "x", labelEn: "x", url: "", sectionKey: "nope" })).status === 400);
  check("unknown parent -> 404", (await nav(admin, "save", { parentId: "missing", labelId: "x", labelEn: "x", url: "/platform" })).status === 404);
  check("reorder with an incomplete list -> 409 (nothing changed)", (await nav(admin, "reorder", { parentId: plat.id, orderedIds: [plat.submenus[0].id] })).status === 409);
  check("delete unknown menu -> 404", (await nav(admin, "delete", { id: "missing" })).status === 404);
  const after = await stored();
  check("rejected requests changed nothing", JSON.stringify(after) === JSON.stringify(menus));
  check("all five groups back to their initial submenus (names, URLs, order)", GROUPS.every(([label]) => {
    const a = after.find((m) => m.labelId === label);
    const b = initial.find((m) => m.labelId === label);
    return JSON.stringify((a.submenus || []).map((s) => [s.id, s.labelId, s.url, s.isActive])) === JSON.stringify((b.submenus || []).map((s) => [s.id, s.labelId, s.url, s.isActive]));
  }));
}

main()
  .catch((e) => {
    console.error(e);
    fail++;
  })
  .finally(async () => {
    if (snapshot) {
      await prisma.cmsSection.update({ where: { sectionKey: "navigation" }, data: { extraContent: snapshot.extraContent, isPublished: snapshot.isPublished } });
      const now = await prisma.cmsSection.findUnique({ where: { sectionKey: "navigation" } });
      check("navigation row restored exactly", JSON.stringify(now.extraContent) === JSON.stringify(snapshot.extraContent));
    }
    console.log(`\nResult: ${pass} passed, ${fail} failed`);
    await prisma.$disconnect();
    process.exit(fail ? 1 : 0);
  });
