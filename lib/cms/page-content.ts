// Loader konten halaman publik (SERVER ONLY — memakai Prisma).
import { db } from "@/lib/db";
import { mergeWithDefaults, sanitizePublicContent } from "./content-utils";
import type { CmsPageDefinition, PageContentOf } from "./types";

/**
 * Mengambil konten satu halaman dari CMS.
 * - Section tanpa baris DB -> konten default dari kode (halaman tetap tampil sebelum seed).
 * - Section yang dihapus (soft delete) atau tidak dipublikasikan -> `null` (komponen tidak merender).
 * - Item `hidden` / `deletedAt` disaring di server sehingga tidak terkirim ke browser.
 * - Bila database tidak dapat diakses, seluruh halaman memakai default (tidak error).
 */
export async function getPageContent<D extends CmsPageDefinition>(definition: D): Promise<PageContentOf<D>> {
  let rows: { sectionKey: string; extraContent: unknown; isPublished: boolean; deletedAt: Date | null }[] = [];
  try {
    rows = await db.cmsSection.findMany({
      where: { pageKey: definition.pageKey },
      select: { sectionKey: true, extraContent: true, isPublished: true, deletedAt: true },
    });
  } catch (error) {
    console.error(`CMS: gagal memuat halaman "${definition.pageKey}", memakai konten default.`, error);
  }

  const byKey = new Map(rows.map((r) => [r.sectionKey, r]));
  const result: Record<string, unknown> = {};

  for (const [key, section] of Object.entries(definition.sections)) {
    const row = byKey.get(key);
    if (!row) {
      result[key] = sanitizePublicContent(section.content);
    } else if (row.deletedAt || !row.isPublished) {
      result[key] = null;
    } else {
      result[key] = sanitizePublicContent(mergeWithDefaults(section.content, row.extraContent));
    }
  }

  return result as PageContentOf<D>;
}
