// Utilitas murni editor CMS (client). Jangan mengimpor lib/models / Prisma dari sini.
import type { ApiResponse } from "@/types";

export type Json = unknown;
export type JsonObject = Record<string, unknown>;
export type LocalizedValue = { id: string; en: string };

export interface CmsSectionSummary {
  pageKey: string;
  sectionKey: string;
  label: string;
  sortOrder: number;
  exists: boolean;
  isPublished: boolean;
  deletedAt: string | null;
  version: number;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface CmsPageSummary {
  key: string;
  label: string;
  sections: CmsSectionSummary[];
}

export interface CmsSectionDetail extends Omit<CmsSectionSummary, "sortOrder"> {
  content: JsonObject;
  defaults: JsonObject;
}

/** Field meta item array (tidak dirender sebagai input biasa). */
export const ITEM_META_KEYS = new Set(["id", "hidden", "deletedAt"]);

export function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** LocalizedText: objek yang hanya berisi `id` dan `en` bertipe string. */
export function isLocalized(value: unknown): value is LocalizedValue {
  if (!isPlainObject(value)) return false;
  const keys = Object.keys(value);
  return keys.length === 2 && typeof value.id === "string" && typeof value.en === "string";
}

const IMAGE_KEY = /image|logo|avatar|photo|src|watermark/i;
const NOT_IMAGE_KEY = /(alt|href|title|label|caption|text|name|width|height|size|filled)$/i;
/** Field gambar: nama mengandung image/logo/avatar/photo/src (kecuali alt, href, dsb.). */
export function isImageKey(key: string): boolean {
  return IMAGE_KEY.test(key) && !NOT_IMAGE_KEY.test(key);
}

/** Field tautan: href / url / *Href / *Url (divalidasi server). */
export function isUrlKey(key: string): boolean {
  return /(href|url)$/i.test(key);
}

export function isIconKey(key: string): boolean {
  return /icon/i.test(key);
}

/** Field "token" (nama ikon, aksen, varian) — disalin dari acuan saat menambah item agar tidak kosong. */
const TOKEN_KEY = /(icon|accent|variant|color|colour|tone|theme|style)/i;

const SAFE_URL = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i;
export function isSafeUrl(value: string): boolean {
  return value === "" || SAFE_URL.test(value.trim());
}

/** "logoUrl" / "trusted_by" -> "Logo Url" / "Trusted By". */
export function humanize(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function isLongText(value: string): boolean {
  return value.length > 80 || value.includes("\n");
}

/** Judul kartu item: title/name/label/question/heading (teks ID), selain itu id. */
export function itemTitle(item: unknown, fallback: string): string {
  if (!isPlainObject(item)) return fallback;
  for (const key of ["title", "name", "label", "question", "heading"]) {
    const v = item[key];
    if (typeof v === "string" && v.trim()) return v;
    if (isLocalized(v) && (v.id.trim() || v.en.trim())) return v.id.trim() || v.en.trim();
  }
  return typeof item.id === "string" && item.id ? item.id : fallback;
}

export function randomSuffix(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

/** ID item baru yang unik di dalam array. */
export function newItemId(key: string, existing: unknown[]): string {
  const base = (key || "item").replace(/[^a-zA-Z0-9_-]+/g, "-").toLowerCase() || "item";
  const used = new Set(existing.map((x) => (isPlainObject(x) ? x.id : undefined)));
  let id = `${base}-${randomSuffix()}`;
  while (used.has(id)) id = `${base}-${randomSuffix()}`;
  return id;
}

/** Salinan bentuk `shape` dengan nilai kosong (teks "", angka 0, boolean false, array []). */
export function emptyLike(shape: unknown, key = ""): unknown {
  if (Array.isArray(shape)) return [];
  if (isLocalized(shape)) return { id: "", en: "" };
  if (isPlainObject(shape)) {
    const out: JsonObject = {};
    for (const [k, v] of Object.entries(shape)) {
      if (k === "hidden" || k === "deletedAt") continue;
      out[k] = emptyLike(v, k);
    }
    return out;
  }
  if (typeof shape === "string") return TOKEN_KEY.test(key) ? shape : "";
  if (typeof shape === "number") return 0;
  if (typeof shape === "boolean") return false;
  return null;
}

/** Acuan bentuk item array: item pertama default, atau item pertama yang ada. */
export function arrayItemTemplate(value: unknown[], template: unknown): unknown {
  if (Array.isArray(template) && template.length > 0) return template[0];
  return value.find((x) => x !== null && x !== undefined);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return (
    d.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

/** Path publik halaman untuk tautan "Lihat halaman". */
export function publicPathFor(pageKey: string): string {
  return pageKey === "home" || pageKey === "global" ? "/" : `/${pageKey}`;
}

export interface CmsFetchResult<T> {
  ok: boolean;
  status: number;
  body: ApiResponse<T> | null;
}

/** fetch JSON API admin; 401 -> redirect ke halaman login. */
export async function cmsFetch<T = unknown>(url: string, init?: RequestInit): Promise<CmsFetchResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", ...init });
  } catch {
    return { ok: false, status: 0, body: { success: false, message: "Tidak dapat terhubung ke server. Periksa koneksi Anda." } };
  }
  if (res.status === 401) {
    window.location.href = "/"; // sesi habis: path login tidak diungkap
    return { ok: false, status: 401, body: { success: false, message: "Sesi berakhir. Silakan login kembali." } };
  }
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  return { ok: res.ok && !!body?.success, status: res.status, body };
}

export function jsonInit(method: string, payload?: unknown): RequestInit {
  return {
    method,
    headers: payload === undefined ? undefined : { "Content-Type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  };
}
