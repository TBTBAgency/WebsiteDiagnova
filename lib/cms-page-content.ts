/**
 * Konten section bawaan halaman dalam (Platform, Solusi, Modul, Nova AI, Integrasi).
 *
 * Penyimpanan: TANPA tabel baru. Konten disimpan di baris tata letak halaman yang sudah ada
 *   cms_sections.sectionKey = "layout_<page>"   extraContent.content[<sectionKey>] = SectionContent
 * Selama admin belum menyimpan konten suatu section, halaman memakai konten bawaan
 * (lib/cms-content/<page>.ts) yang identik dengan teks sebelumnya, sehingga tampilan tidak berubah.
 *
 * Setiap section mendeskripsikan kontennya dengan SectionContentDef:
 *   - fields: teks tunggal (judul kecil, label tombol, catatan, ...)
 *   - lists : daftar item yang dapat ditambah / diubah / dihapus / diurutkan / dinonaktifkan
 * Field teks bersifat dwibahasa dan disimpan sebagai `${key}Id` dan `${key}En`.
 *
 * Ilustrasi/mockup visual (mis. angka contoh di dalam gambar antarmuka) adalah bagian desain dan
 * tetap di kode. Item yang terikat ilustrasi memilih ilustrasinya lewat field `select`.
 *
 * Modul ini aman untuk client & server.
 */

import { linksToAdminArea } from "@/lib/admin-route";

export type ContentLang = "ID" | "EN";

export type ContentFieldType = "text" | "textarea" | "url" | "image" | "select";

export interface ContentFieldDef {
  /** Nama dasar field. Field dwibahasa disimpan sebagai `${key}Id` & `${key}En`. */
  key: string;
  label: string;
  type: ContentFieldType;
  /** Default: true untuk text/textarea, false untuk url/image/select. */
  bilingual?: boolean;
  /** Panjang maksimum per bahasa. Default: text 300, textarea 2000, url/image 500. */
  max?: number;
  /** Pilihan untuk type "select" (value disimpan apa adanya). */
  options?: { value: string; label: string }[];
  /** Wajib diisi (untuk field dwibahasa: minimal versi Indonesia). */
  required?: boolean;
  help?: string;
}

export interface ContentListDef {
  key: string;
  label: string;
  /** Sebutan satu item di admin, mis. "Kartu", "Langkah". */
  itemLabel: string;
  fields: ContentFieldDef[];
  maxItems: number;
  minItems?: number;
  /**
   * Jumlah item terikat desain (mis. simpul diagram dengan posisi tetap): admin dapat mengubah
   * teks dan mengaktif/nonaktifkan item, tetapi tidak menambah/menghapus/mengurutkan.
   */
  fixedCount?: boolean;
  /** Field yang dipakai sebagai ringkasan item di admin (default: field pertama). */
  summaryField?: string;
  help?: string;
}

export interface SectionContentDef {
  help?: string;
  fields?: ContentFieldDef[];
  lists?: ContentListDef[];
}

export interface ContentItem {
  id: string;
  isActive: boolean;
  [key: string]: string | boolean;
}

export interface SectionContent {
  fields: Record<string, string>;
  lists: Record<string, ContentItem[]>;
}

export interface PageContentSpec {
  /** sectionKey -> definisi konten (hanya section bawaan yang punya konten di halaman). */
  defs: Record<string, SectionContentDef>;
  /** sectionKey -> konten bawaan (teks persis seperti sebelum CMS). */
  defaults: Record<string, SectionContent>;
}

export type ResolvedPageContent = Record<string, SectionContent>;

export const ITEM_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,47}$/i;

export function isBilingual(f: ContentFieldDef): boolean {
  return f.bilingual ?? (f.type === "text" || f.type === "textarea");
}

/** Nama kunci penyimpanan sebuah field. */
export function storageKeys(f: ContentFieldDef): string[] {
  return isBilingual(f) ? [`${f.key}Id`, `${f.key}En`] : [f.key];
}

export function fieldMax(f: ContentFieldDef): number {
  if (f.max) return f.max;
  if (f.type === "textarea") return 2000;
  if (f.type === "url" || f.type === "image") return 500;
  return 300;
}

/** URL aman: path relatif, anchor, atau http(s), dan bukan ke area admin. (Sama dengan isSafeCmsUrl.) */
export function isSafeContentUrl(url: string): boolean {
  const v = url.trim();
  if (v === "") return true;
  if (v.startsWith("//")) return false;
  if (linksToAdminArea(v)) return false;
  if (v.startsWith("/") || v.startsWith("#")) return true;
  return /^https?:\/\/[^\s]+$/i.test(v);
}

const asString = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

function normalizeValue(f: ContentFieldDef, raw: unknown, fallback: string | undefined): string {
  const s = asString(raw);
  if (f.type === "select") {
    const allowed = (f.options || []).map((o) => o.value);
    if (s !== undefined && allowed.includes(s)) return s;
    if (fallback !== undefined && allowed.includes(fallback)) return fallback;
    return allowed[0] ?? "";
  }
  if (s === undefined) return fallback ?? "";
  const v = s.slice(0, fieldMax(f));
  if ((f.type === "url" || f.type === "image") && !isSafeContentUrl(v)) return fallback ?? "";
  return v;
}

function normalizeItem(list: ContentListDef, raw: unknown, index: number, fallback?: ContentItem): ContentItem {
  const src = isObj(raw) ? raw : {};
  const id = typeof src.id === "string" && ITEM_ID_PATTERN.test(src.id) ? src.id : fallback?.id ?? `item-${index + 1}`;
  const item: ContentItem = { id, isActive: src.isActive !== false };
  for (const f of list.fields) {
    for (const k of storageKeys(f)) {
      item[k] = normalizeValue(f, src[k], asString(fallback?.[k]));
    }
  }
  return item;
}

/**
 * Menggabungkan konten tersimpan dengan konten bawaan:
 * - field: nilai tersimpan (boleh kosong untuk field opsional); bila belum pernah disimpan, nilai bawaan;
 * - list : list tersimpan menggantikan list bawaan seluruhnya (sehingga item dapat dihapus);
 *          list dengan fixedCount selalu berjumlah sama dengan bawaan (dipetakan per posisi).
 * publicOnly: item nonaktif tidak disertakan (tidak terkirim ke browser).
 */
export function resolveSectionContent(
  def: SectionContentDef,
  defaults: SectionContent | undefined,
  stored: unknown,
  publicOnly: boolean
): SectionContent {
  const st = isObj(stored) ? stored : {};
  const stFields = isObj(st.fields) ? st.fields : {};
  const stLists = isObj(st.lists) ? st.lists : {};
  const fields: Record<string, string> = {};
  for (const f of def.fields || []) {
    for (const k of storageKeys(f)) {
      const fb = defaults?.fields?.[k];
      // Nilai tersimpan dipakai apa adanya (termasuk kosong: admin sengaja mengosongkan field
      // opsional). Field wajib divalidasi tidak kosong saat disimpan. Belum disimpan => bawaan.
      const v = asString(stFields[k]);
      fields[k] = v !== undefined ? normalizeValue(f, v, fb) : normalizeValue(f, undefined, fb);
    }
  }
  const lists: Record<string, ContentItem[]> = {};
  for (const list of def.lists || []) {
    const fallbackItems = defaults?.lists?.[list.key] || [];
    const raw = stLists[list.key];
    let items: ContentItem[];
    if (list.fixedCount) {
      const arr = Array.isArray(raw) ? raw : [];
      items = fallbackItems.map((fb, i) => normalizeItem(list, arr[i] ?? fb, i, fb));
    } else if (Array.isArray(raw)) {
      const seen = new Set<string>();
      items = raw.slice(0, list.maxItems).map((r, i) => normalizeItem(list, r, i)).filter((it) => {
        if (seen.has(it.id)) return false;
        seen.add(it.id);
        return true;
      });
    } else {
      items = fallbackItems.map((fb, i) => normalizeItem(list, fb, i, fb));
    }
    lists[list.key] = publicOnly ? items.filter((it) => it.isActive) : items;
  }
  return { fields, lists };
}

export function resolvePageContent(spec: PageContentSpec, storedContent: unknown, publicOnly: boolean): ResolvedPageContent {
  const st = isObj(storedContent) ? storedContent : {};
  const out: ResolvedPageContent = {};
  for (const [sectionKey, def] of Object.entries(spec.defs)) {
    out[sectionKey] = resolveSectionContent(def, spec.defaults[sectionKey], st[sectionKey], publicOnly);
  }
  return out;
}

/**
 * Validasi konten kiriman admin terhadap definisi section. Mengembalikan konten ternormalisasi
 * atau daftar pesan error (berbahasa Indonesia).
 */
export function validateSectionContent(
  def: SectionContentDef,
  defaults: SectionContent | undefined,
  input: unknown
): { ok: true; value: SectionContent } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const src = isObj(input) ? input : {};
  const inFields = isObj(src.fields) ? src.fields : {};
  const inLists = isObj(src.lists) ? src.lists : {};

  const checkValue = (f: ContentFieldDef, key: string, v: unknown, where: string) => {
    if (v === undefined || v === null) return;
    if (typeof v !== "string") return errors.push(`${where}: harus berupa teks.`);
    if (v.length > fieldMax(f)) errors.push(`${where}: maksimal ${fieldMax(f)} karakter.`);
    if ((f.type === "url" || f.type === "image") && !isSafeContentUrl(v)) {
      errors.push(`${where}: URL harus berupa path relatif (/...), anchor (#...), atau http(s)://`);
    }
    if (f.type === "select" && v !== "" && !(f.options || []).some((o) => o.value === v)) {
      errors.push(`${where}: pilihan '${v}' tidak dikenal.`);
    }
  };
  const checkRequired = (f: ContentFieldDef, obj: Record<string, unknown>, where: string) => {
    if (!f.required) return;
    const k = storageKeys(f)[0];
    const v = obj[k];
    if (typeof v !== "string" || v.trim() === "") errors.push(`${where}: wajib diisi${isBilingual(f) ? " (Bahasa Indonesia)" : ""}.`);
  };

  for (const f of def.fields || []) {
    for (const k of storageKeys(f)) checkValue(f, k, inFields[k], `${f.label}${isBilingual(f) ? ` (${k.endsWith("Id") ? "ID" : "EN"})` : ""}`);
    checkRequired(f, inFields, f.label);
  }
  for (const list of def.lists || []) {
    const raw = inLists[list.key];
    if (raw === undefined) continue;
    if (!Array.isArray(raw)) {
      errors.push(`${list.label}: format daftar tidak valid.`);
      continue;
    }
    const expected = defaults?.lists?.[list.key]?.length ?? 0;
    if (list.fixedCount && raw.length !== expected) errors.push(`${list.label}: jumlah item harus tetap ${expected} (terikat desain).`);
    if (raw.length > list.maxItems) errors.push(`${list.label}: maksimal ${list.maxItems} ${list.itemLabel.toLowerCase()}.`);
    if (list.minItems && raw.filter((r) => isObj(r) && r.isActive !== false).length < list.minItems) {
      errors.push(`${list.label}: minimal ${list.minItems} ${list.itemLabel.toLowerCase()} aktif.`);
    }
    const ids = new Set<string>();
    raw.forEach((r, i) => {
      const where = `${list.label} › ${list.itemLabel} ${i + 1}`;
      if (!isObj(r)) return errors.push(`${where}: format tidak valid.`);
      if (typeof r.id !== "string" || !ITEM_ID_PATTERN.test(r.id)) errors.push(`${where}: ID tidak valid.`);
      else if (ids.has(r.id)) errors.push(`${where}: ID '${r.id}' duplikat.`);
      else ids.add(r.id);
      if (r.isActive !== undefined && typeof r.isActive !== "boolean") errors.push(`${where}: status aktif tidak valid.`);
      for (const f of list.fields) {
        for (const k of storageKeys(f)) checkValue(f, k, r[k], `${where} › ${f.label}${isBilingual(f) ? ` (${k.endsWith("Id") ? "ID" : "EN"})` : ""}`);
        checkRequired(f, r, `${where} › ${f.label}`);
      }
    });
  }
  if (errors.length) return { ok: false, errors: errors.slice(0, 20) };

  // Normalisasi: hanya kunci yang didefinisikan yang disimpan.
  const fields: Record<string, string> = {};
  for (const f of def.fields || []) {
    for (const k of storageKeys(f)) {
      const v = inFields[k];
      if (typeof v === "string") fields[k] = v.trim();
    }
  }
  const lists: Record<string, ContentItem[]> = {};
  for (const list of def.lists || []) {
    const raw = inLists[list.key];
    if (!Array.isArray(raw)) continue;
    lists[list.key] = raw.map((r, i) => {
      const item = normalizeItem(list, r, i);
      for (const f of list.fields) {
        for (const k of storageKeys(f)) if (typeof item[k] === "string") item[k] = (item[k] as string).trim();
      }
      return item;
    });
  }
  return { ok: true, value: { fields, lists } };
}

/** Pilih teks bahasa aktif dari objek (field atau item); jatuh ke bahasa lain bila kosong. */
export function pickText(obj: Record<string, unknown> | undefined | null, key: string, lang: ContentLang): string {
  const id = obj?.[`${key}Id`];
  const en = obj?.[`${key}En`];
  const primary = lang === "ID" ? id : en;
  const other = lang === "ID" ? en : id;
  if (typeof primary === "string" && primary !== "") return primary;
  return typeof other === "string" ? other : "";
}

/**
 * Pembaca konten untuk client component halaman:
 *   const c = makeContentReader(content, language);
 *   c.text("automation", "note")          // field dwibahasa section
 *   c.value("automation", "imageUrl")     // field non-dwibahasa (url/image/select)
 *   c.list("automation", "cards")         // item aktif
 *   c.t(item, "title")                    // field dwibahasa item
 *   c.v(item, "visual")                   // field non-dwibahasa item
 */
export function makeContentReader(content: ResolvedPageContent | null | undefined, lang: ContentLang) {
  return {
    text: (section: string, key: string) => pickText(content?.[section]?.fields, key, lang),
    value: (section: string, key: string) => content?.[section]?.fields?.[key] ?? "",
    list: (section: string, key: string): ContentItem[] => content?.[section]?.lists?.[key] ?? [],
    t: (item: ContentItem | undefined | null, key: string) => pickText(item as Record<string, unknown> | undefined, key, lang),
    v: (item: ContentItem | undefined | null, key: string) => {
      const val = item?.[key];
      return typeof val === "string" ? val : "";
    },
  };
}

export type ContentReader = ReturnType<typeof makeContentReader>;
