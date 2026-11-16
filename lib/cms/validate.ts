// Validasi konten CMS di server. Bentuk konten harus mengikuti default di kode (definisi halaman),
// sehingga admin tidak dapat menyimpan struktur yang membuat halaman publik rusak.
import { isPlainObject } from "./content-utils";

export const MAX_SECTION_BYTES = 512 * 1024;
export const MAX_STRING_LENGTH = 20_000;
const ITEM_META_KEYS = new Set(["id", "hidden", "deletedAt"]);
const URL_KEY = /(href|url|src)$/i;
const SAFE_URL = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;

function kind(v: unknown): string {
  if (Array.isArray(v)) return "array";
  if (v === null) return "null";
  return typeof v === "object" ? "object" : typeof v;
}

function check(value: unknown, template: unknown, path: string, key: string, errors: string[]) {
  if (errors.length > 50) return;

  if (typeof value === "string") {
    if (value.length > MAX_STRING_LENGTH) errors.push(`${path}: teks terlalu panjang (maks ${MAX_STRING_LENGTH} karakter).`);
    if (URL_KEY.test(key) && value !== "" && !SAFE_URL.test(value.trim())) {
      errors.push(`${path}: URL tidak diizinkan (gunakan path "/...", "#anchor", https://, mailto: atau tel:).`);
    }
  }

  if (template === undefined) return; // tidak ada acuan bentuk (mis. field tambahan item)

  // Teks boleh berupa string atau LocalizedText bila default salah satunya
  const tKind = kind(template);
  const vKind = kind(value);
  const textLike = (k: string) => k === "string" || k === "object";
  const isLocalized = (v: unknown) => isPlainObject(v) && typeof v.id === "string" && typeof v.en === "string";

  if (tKind !== vKind) {
    if (value === null && (tKind === "string" || tKind === "object")) return;
    if (textLike(tKind) && textLike(vKind) && (isLocalized(template) || isLocalized(value) || tKind === "string")) {
      if (vKind === "object" && !isLocalized(value)) errors.push(`${path}: teks dwibahasa harus { id, en }.`);
      return;
    }
    errors.push(`${path}: tipe ${vKind} tidak sesuai (seharusnya ${tKind}).`);
    return;
  }

  if (vKind === "array") {
    const arr = value as unknown[];
    const itemTemplate = (template as unknown[])[0];
    const ids = new Set<string>();
    arr.forEach((item, i) => {
      const p = `${path}[${i}]`;
      if (isPlainObject(item)) {
        if (typeof item.id !== "string" || item.id.trim() === "") errors.push(`${p}: item wajib memiliki id.`);
        else if (ids.has(item.id)) errors.push(`${p}: id "${item.id}" duplikat.`);
        else ids.add(item.id);
        if (item.hidden !== undefined && typeof item.hidden !== "boolean") errors.push(`${p}.hidden harus boolean.`);
        if (item.deletedAt != null && (typeof item.deletedAt !== "string" || isNaN(Date.parse(item.deletedAt)))) {
          errors.push(`${p}.deletedAt harus tanggal ISO.`);
        }
      }
      check(item, itemTemplate, p, key, errors);
    });
    return;
  }

  if (vKind === "object") {
    const obj = value as Record<string, unknown>;
    const tpl = template as Record<string, unknown>;
    const isItem = "id" in obj;
    for (const [k, v] of Object.entries(obj)) {
      if (!(k in tpl) && !(isItem && ITEM_META_KEYS.has(k)) && !isLocalized(tpl)) {
        // Field yang tidak dikenal tidak dirender halaman -> tolak agar admin tidak tertipu
        if (Object.keys(tpl).length > 0) {
          errors.push(`${path}.${k}: field tidak dikenal.`);
          continue;
        }
      }
      check(v, tpl[k], `${path}.${k}`, k, errors);
    }
  }
}

/** Mengembalikan daftar pesan error (kosong = valid). */
export function validateSectionContent(content: unknown, defaults: unknown): string[] {
  const errors: string[] = [];
  if (!isPlainObject(content)) return ["Konten section harus berupa objek."];
  const size = Buffer.byteLength(JSON.stringify(content), "utf8");
  if (size > MAX_SECTION_BYTES) return [`Konten terlalu besar (${Math.round(size / 1024)} KB, maks ${MAX_SECTION_BYTES / 1024} KB).`];
  check(content, defaults, "konten", "", errors);
  return errors;
}
