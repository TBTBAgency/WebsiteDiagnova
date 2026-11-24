// Area admin tersembunyi: konten publik CMS tidak boleh menautkan ke /admin (tanpa DB).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSectionContent } from "../../lib/cms/validate";
import { sanitizePublicContent } from "../../lib/cms/content-utils";

const tpl = { links: [{ id: "a", label: { id: "x", en: "x" }, href: "/platform" }] };
const withHref = (href: string) => ({ links: [{ id: "a", label: { id: "x", en: "x" }, href }] });

test("validator CMS menolak tautan ke area admin", () => {
  for (const href of ["/admin/login", "/admin", "/ADMIN/dashboard", "/admin?x=1", "/admin#a"]) {
    assert.ok(validateSectionContent(withHref(href), tpl).some((e) => /area admin/.test(e)), href);
  }
});

test("validator CMS tidak salah menolak tautan yang mirip", () => {
  for (const href of ["/platform", "/administrasi-lab", "/admins-guide", "https://contoh.example/admin"]) {
    assert.ok(!validateSectionContent(withHref(href), tpl).some((e) => /area admin/.test(e)), href);
  }
});

test("loader publik menyaring tautan admin yang sudah tersimpan di DB", () => {
  const stored = { columns: [{ id: "c", links: [{ id: "1", href: "/platform" }, { id: "2", href: "/admin/login" }, { id: "3", href: "/admin" }] }] };
  const pub = sanitizePublicContent(stored) as { columns: { links: { id: string }[] }[] };
  assert.deepEqual(pub.columns[0].links.map((l) => l.id), ["1"]);
});
