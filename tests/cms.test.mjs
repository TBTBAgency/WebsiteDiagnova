// CMS pusat: seluruh halaman publik, optimistic lock, validasi, soft delete section & item, upload.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { BASE, db, uid, loginAdmin, json, cookieHeader } from "./helpers.mjs";

let admin;
const restore = [];
before(async () => {
  admin = await loginAdmin();
});
after(async () => {
  for (const fn of restore.reverse()) await fn();
  await db.$disconnect();
});

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const load = async (page, section) => (await (await json("GET", `/api/admin/cms/pages/${page}/${section}`, admin)).json()).data;
const save = (page, section, body) => json("PUT", `/api/admin/cms/pages/${page}/${section}`, admin, body);
const html = async (path) => (await fetch(`${BASE}${path}`)).text();

/** Simpan keadaan awal section dan kembalikan setelah test. */
async function snapshot(page, section) {
  const s = await load(page, section);
  restore.push(async () => {
    const cur = await load(page, section);
    if (cur.deletedAt) await json("POST", `/api/admin/cms/pages/${page}/${section}/restore`, admin);
    const fresh = await load(page, section);
    await save(page, section, { content: s.content, version: fresh.version, isPublished: s.isPublished });
  });
  return s;
}

test("daftar halaman mencakup seluruh halaman publik + global", async () => {
  const body = await (await json("GET", "/api/admin/cms/pages", admin)).json();
  const keys = body.data.map((p) => p.key);
  for (const k of ["global", "home", "platform", "solutions", "modules", "nova-ai", "integration", "request-demo"]) {
    assert.ok(keys.includes(k), k);
  }
  assert.ok(body.data.find((p) => p.key === "global").sections.some((s) => s.sectionKey === "navigation"));
});

test("simpan konten -> tampil di halaman publik (revalidasi on-demand) + audit; versi lama -> 409", async () => {
  const s = await snapshot("platform", "hero");
  const marker = `UJI-CMS-${uid()}`;
  const content = { ...s.content, badge: { ...s.content.badge, id: marker } };
  const res = await save("platform", "hero", { content, version: s.version });
  assert.equal(res.status, 200, (await res.clone().json()).message);
  assert.match(await html("/platform"), new RegExp(marker));
  assert.equal((await save("platform", "hero", { content, version: s.version })).status, 409, "optimistic lock");
  assert.ok((await db.auditLog.count({ where: { action: "CMS_SECTION_UPDATED", recordId: "platform/hero" } })) >= 1);
});

test("validasi: tipe salah, field asing, dan URL berbahaya ditolak 400", async () => {
  const s = await load("platform", "hero");
  const bad = [
    { ...s.content, badge: 123 },
    { ...s.content, unknownField: "x" },
    { ...s.content, primaryCta: { ...s.content.primaryCta, href: "javascript:alert(1)" } },
  ];
  for (const content of bad) {
    const res = await save("platform", "hero", { content, version: s.version });
    assert.equal(res.status, 400, JSON.stringify(content).slice(0, 80));
    assert.ok((await res.json()).errors?.content?.length > 0);
  }
});

test("item soft delete tidak terkirim ke publik; editor tetap melihatnya untuk dipulihkan", async () => {
  const s = await snapshot("home", "faq");
  const [first, ...rest] = s.content.items;
  const q = escapeRe(first.question.id.slice(0, 30));
  assert.match(await html("/"), new RegExp(q));
  const content = { ...s.content, items: [{ ...first, deletedAt: new Date().toISOString() }, ...rest] };
  assert.equal((await save("home", "faq", { content, version: s.version })).status, 200);
  assert.doesNotMatch(await html("/"), new RegExp(q));
  const edit = await load("home", "faq");
  assert.ok(edit.content.items.find((i) => i.id === first.id)?.deletedAt);
});

test("section soft delete -> hilang dari publik; restore -> kembali", async () => {
  const s = await snapshot("home", "testimonials");
  const marker = escapeRe(s.content.items?.[0]?.name ?? "");
  assert.ok(marker);
  assert.match(await html("/"), new RegExp(marker));
  assert.equal((await json("DELETE", "/api/admin/cms/pages/home/testimonials", admin)).status, 200);
  assert.doesNotMatch(await html("/"), new RegExp(marker));
  assert.equal((await json("POST", "/api/admin/cms/pages/home/testimonials/restore", admin)).status, 200);
  assert.match(await html("/"), new RegExp(marker));
});

test("upload: PNG valid tersimpan di luar public/ & tersaji; non-gambar, SVG, traversal, anonim ditolak", async () => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const up = (buf, name, type, headers = cookieHeader(admin)) => {
    const fd = new FormData();
    fd.append("file", new Blob([buf], { type }), name);
    return fetch(`${BASE}/api/admin/cms/upload`, { method: "POST", headers, body: fd });
  };
  const ok = await up(png, "pixel.png", "image/png");
  assert.equal(ok.status, 201);
  const url = (await ok.json()).data.url;
  assert.match(url, /^\/uploads\/cms\/\d{4}\/\d{2}\/[a-f0-9]{24}\.png$/);
  const served = await fetch(`${BASE}${url}`);
  assert.equal(served.status, 200);
  assert.equal(served.headers.get("content-type"), "image/png");
  assert.equal((await up(Buffer.from("<svg onload=alert(1)>"), "x.svg", "image/svg+xml")).status, 415);
  assert.equal((await up(Buffer.from("hello"), "x.png", "image/png")).status, 415, "tipe dicek dari isi file");
  assert.equal((await fetch(`${BASE}/uploads/..%2F..%2F.env`)).status, 404);
  assert.equal((await fetch(`${BASE}/uploads/cms/x.env`)).status, 404);
  assert.equal((await up(png, "a.png", "image/png", {})).status, 401);
});

test("seluruh halaman publik & detail tetap 200 dengan konten CMS", async () => {
  for (const p of [
    "/", "/platform", "/solutions", "/modules", "/nova-ai", "/integration", "/request-demo", "/sitemap.xml",
  ]) {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
    assert.equal(res.status, 200, p);
  }
  // Catatan: slug bawaan halaman detail (mis. /modules/blood-bank) dialihkan ke anchor oleh next.config.mjs
  // (perilaku lama, tidak diubah). Halaman detail tetap dirender untuk slug lain, termasuk item baru dari CMS.
  assert.equal((await fetch(`${BASE}/modules/blood-bank`, { redirect: "manual" })).status, 307);
  assert.equal((await fetch(`${BASE}/modules/tidak-ada`)).status, 404);
});
