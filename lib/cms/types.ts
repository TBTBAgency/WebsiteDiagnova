// Kontrak data CMS untuk seluruh halaman publik. Aman diimpor dari server maupun client.
//
// Konvensi konten (disimpan di cms_sections.extra_content, satu baris per section):
//  - Teks yang tampil ke pengunjung memakai LocalizedText { id, en }.
//  - Teks boleh memuat "\n" (baris baru) dan **teks** (penekanan/highlight); dirender oleh <CmsRichText>.
//  - Setiap item di dalam array (kartu, langkah, menu, FAQ, dsb.) WAJIB punya `id` string yang stabil.
//    Item boleh memiliki `hidden: true` (disembunyikan) atau `deletedAt` (soft delete, dapat dipulihkan).
//    Urutan tampil = urutan array.
//  - Gambar disimpan sebagai path/URL string pada field yang namanya mengandung
//    image / logo / avatar / photo / src (mis. "imageUrl", "logoUrl"). Editor CMS menyediakan upload untuk field ini.
//  - Ikon disimpan sebagai nama string (mis. "Activity") dan dipetakan ke komponen ikon di kode.
//  - Tautan disimpan pada field bernama `href` / `url` / `*Href` / `*Url`.

export type Lang = "ID" | "EN";

export interface LocalizedText {
  id: string;
  en: string;
}

export interface CmsItemMeta {
  id: string;
  hidden?: boolean;
  deletedAt?: string | null;
}

/** Konten satu section: objek JSON bebas yang mengikuti konvensi di atas. */
export type SectionContent = { [key: string]: unknown };

/** Konten halaman: setiap section bernilai `null` bila disembunyikan / dihapus (soft delete) di CMS. */
export type PageContent<T extends Record<string, SectionContent>> = { [K in keyof T]: T[K] | null };

/** Definisi satu section: label untuk admin + konten default (dipakai sebagai seed & fallback). */
export interface CmsSectionDefinition<C extends SectionContent = SectionContent> {
  label: string;
  content: C;
}

/** Definisi halaman: urutan key di `sections` = urutan tampil default. */
export interface CmsPageDefinition {
  pageKey: CmsPageKey;
  sections: Record<string, CmsSectionDefinition>;
}

/** Tipe konten halaman yang diterima komponen view (section `null` = disembunyikan di CMS). */
export type PageContentOf<D extends CmsPageDefinition> = {
  [K in keyof D["sections"]]: D["sections"][K]["content"] | null;
};

/** Daftar halaman yang dikelola CMS (page_key). */
export const CMS_PAGES = [
  { key: "global", label: "Global (Navbar, Footer, Announcement)" },
  { key: "home", label: "Home" },
  { key: "platform", label: "Platform" },
  { key: "solutions", label: "Solutions" },
  { key: "modules", label: "Modules" },
  { key: "nova-ai", label: "Nova AI" },
  { key: "integration", label: "Integration" },
  { key: "request-demo", label: "Request Demo" },
] as const;

export type CmsPageKey = (typeof CMS_PAGES)[number]["key"];
