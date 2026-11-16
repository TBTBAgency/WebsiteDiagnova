// Utilitas konten CMS murni (tanpa I/O). Dipakai server (render publik, API) dan editor admin.

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Menggabungkan konten tersimpan dengan default kode.
 * - Objek digabung rekursif (field baru di default tetap muncul untuk konten lama).
 * - Array dan nilai primitif dari konten tersimpan menggantikan default.
 */
export function mergeWithDefaults<T>(defaults: T, stored: unknown): T {
  if (!isPlainObject(defaults) || !isPlainObject(stored)) {
    return (stored === undefined || stored === null ? defaults : (stored as T));
  }
  const result: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(stored)) {
    if (value === undefined) continue;
    const base = (defaults as Record<string, unknown>)[key];
    result[key] = isPlainObject(base) && isPlainObject(value) ? mergeWithDefaults(base, value) : value;
  }
  return result as T;
}

/** Menghapus item array yang `hidden` atau ber-`deletedAt` (rekursif) — untuk konten publik. */
export function sanitizePublicContent<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => !(isPlainObject(item) && (item.hidden === true || !!item.deletedAt)))
      .map((item) => sanitizePublicContent(item)) as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = sanitizePublicContent(v);
    return out as T;
  }
  return value;
}
