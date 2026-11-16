import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { recordAuditLogTx, type AuditActor } from "@/lib/models/audit.model";
import { CMS_DEFINITIONS } from "@/lib/cms/definitions";
import { HOME_COLUMN_SECTIONS } from "@/content/pages/home";
import { isPlainObject, mergeWithDefaults, sanitizePublicContent } from "@/lib/cms/content-utils";
import { validateSectionContent } from "@/lib/cms/validate";
import { CMS_PAGES } from "@/lib/cms/types";

/** Error CMS yang pesannya aman ditampilkan ke admin. */
export class CmsError extends Error {
  constructor(message: string, public readonly httpStatus = 400, public readonly details?: string[]) {
    super(message);
    this.name = "CmsError";
  }
}

type CmsRow = Prisma.CmsSectionGetPayload<{ include: { updatedByUser: { select: { name: true } } } }>;

// ---------------------------------------------------------------------------
// Konversi baris <-> konten editor
// ---------------------------------------------------------------------------

/** Konten editor = JSON extra_content; untuk section Home lama, badge/title/subtitle berasal dari kolom. */
function rowToContent(pageKey: string, row: Pick<CmsRow, "sectionKey" | "badgeId" | "badgeEn" | "titleId" | "titleEn" | "subtitleId" | "subtitleEn" | "extraContent">) {
  const extra = isPlainObject(row.extraContent) ? row.extraContent : {};
  if (pageKey === "home" && HOME_COLUMN_SECTIONS.has(row.sectionKey)) {
    return {
      badge: { id: row.badgeId ?? "", en: row.badgeEn ?? "" },
      title: { id: row.titleId ?? "", en: row.titleEn ?? "" },
      subtitle: { id: row.subtitleId ?? "", en: row.subtitleEn ?? "" },
      ...extra,
    } as Record<string, unknown>;
  }
  return extra as Record<string, unknown>;
}

function contentToColumns(pageKey: string, sectionKey: string, content: Record<string, unknown>) {
  if (pageKey === "home" && HOME_COLUMN_SECTIONS.has(sectionKey)) {
    const { badge, title, subtitle, ...extra } = content as Record<string, { id?: string; en?: string } | unknown>;
    const loc = (v: unknown) => (isPlainObject(v) ? v : {}) as { id?: string; en?: string };
    return {
      badgeId: loc(badge).id ?? null,
      badgeEn: loc(badge).en ?? null,
      titleId: loc(title).id ?? null,
      titleEn: loc(title).en ?? null,
      subtitleId: loc(subtitle).id ?? null,
      subtitleEn: loc(subtitle).en ?? null,
      extraContent: extra as Prisma.InputJsonValue,
    };
  }
  return { extraContent: content as Prisma.InputJsonValue };
}

function getDefinition(pageKey: string, sectionKey?: string) {
  const def = CMS_DEFINITIONS[pageKey];
  if (!def) throw new CmsError("Halaman CMS tidak dikenal.", 404);
  if (sectionKey === undefined) return { def, section: undefined };
  const section = def.sections[sectionKey];
  if (!section) throw new CmsError("Section tidak dikenal untuk halaman ini.", 404);
  return { def, section };
}

// ---------------------------------------------------------------------------
// Publik: Home
// ---------------------------------------------------------------------------

/** Bentuk lama yang dipakai komponen homepage (section = baris kolom, item = baris "tabel anak"). */
export interface CmsHomepageData {
  hero?: { section: any; slides: any[] } | null;
  trustedBy?: { section: any; partners: any[] } | null;
  about?: { section: any } | null;
  comparison?: { section: any; items: any[] } | null;
  workflow?: { section: any } | null;
  infrastructure?: { section: any } | null;
  testimonials?: { section: any; items: any[] } | null;
  cta?: { section: any } | null;
  faq?: Record<string, unknown> | null;
}

const asRows = (items: unknown) =>
  (Array.isArray(items) ? items : []).map((item, index) => ({ ...(item as object), isActive: true, sortOrder: index }));

/**
 * Konten homepage untuk render publik.
 * `null` = section disembunyikan/dihapus di CMS (tidak dirender); `undefined` = DB tidak tersedia (komponen
 * memakai fallback statisnya sendiri).
 */
export async function getCmsHomepageContent(): Promise<CmsHomepageData> {
  const rows = await db.cmsSection.findMany({ where: { pageKey: "home" } });
  const def = CMS_DEFINITIONS.home;
  const byKey = new Map(rows.map((r) => [r.sectionKey, r]));

  const resolve = (key: string) => {
    const row = byKey.get(key);
    const defaults = def.sections[key]?.content ?? {};
    if (!row) return { visible: true, content: sanitizePublicContent(defaults), row: null };
    if (row.deletedAt || !row.isPublished) return { visible: false, content: null, row };
    return { visible: true, content: sanitizePublicContent(mergeWithDefaults(defaults, rowToContent("home", row))), row };
  };

  const sectionShape = (key: string) => {
    const r = resolve(key);
    if (!r.visible || !r.content) return null;
    const c = r.content as Record<string, any>;
    const { badge, title, subtitle, ...extra } = c;
    return {
      content: c,
      section: {
        sectionKey: key,
        badgeId: badge?.id ?? null,
        badgeEn: badge?.en ?? null,
        titleId: title?.id ?? null,
        titleEn: title?.en ?? null,
        subtitleId: subtitle?.id ?? null,
        subtitleEn: subtitle?.en ?? null,
        extraContent: extra,
        isPublished: true,
      },
    };
  };

  const hero = sectionShape("hero");
  const trusted = sectionShape("trusted_by");
  const about = sectionShape("about");
  const comparison = sectionShape("comparison");
  const workflow = sectionShape("workflow");
  const infra = sectionShape("infrastructure");
  const testimonials = sectionShape("testimonials");
  const cta = sectionShape("cta");
  const faq = resolve("faq");

  return {
    hero: hero && { section: hero.section, slides: asRows(hero.content.slides) },
    trustedBy: trusted && { section: trusted.section, partners: asRows(trusted.content.partners) },
    about: about && { section: about.section },
    comparison: comparison && { section: comparison.section, items: asRows(comparison.content.items) },
    workflow: workflow && { section: workflow.section },
    infrastructure: infra && { section: infra.section },
    testimonials: testimonials && { section: testimonials.section, items: asRows(testimonials.content.items) },
    cta: cta && { section: cta.section },
    faq: faq.visible ? (faq.content as Record<string, unknown>) : null,
  };
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

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

export async function listCmsPages(): Promise<{ key: string; label: string; sections: CmsSectionSummary[] }[]> {
  const rows = await db.cmsSection.findMany({ include: { updatedByUser: { select: { name: true } } } });
  return CMS_PAGES.map((page) => {
    const def = CMS_DEFINITIONS[page.key];
    const pageRows = rows.filter((r) => r.pageKey === page.key);
    const defKeys = Object.keys(def?.sections ?? {});
    const sections: CmsSectionSummary[] = defKeys.map((key, index) => {
      const row = pageRows.find((r) => r.sectionKey === key);
      return {
        pageKey: page.key,
        sectionKey: key,
        label: row?.label ?? def.sections[key].label,
        sortOrder: row?.sortOrder ?? (index + 1) * 10,
        exists: !!row,
        isPublished: row?.isPublished ?? true,
        deletedAt: row?.deletedAt?.toISOString() ?? null,
        version: row?.version ?? 0,
        updatedAt: row?.updatedAt.toISOString() ?? null,
        updatedBy: row?.updatedByUser?.name ?? null,
      };
    });
    sections.sort((a, b) => a.sortOrder - b.sortOrder);
    return { key: page.key, label: page.label, sections };
  });
}

export async function getCmsSectionForEdit(pageKey: string, sectionKey: string) {
  const { section } = getDefinition(pageKey, sectionKey);
  const row = await db.cmsSection.findUnique({
    where: { pageKey_sectionKey: { pageKey, sectionKey } },
    include: { updatedByUser: { select: { name: true } } },
  });
  const stored = row ? rowToContent(pageKey, row) : undefined;
  return {
    pageKey,
    sectionKey,
    label: row?.label ?? section!.label,
    exists: !!row,
    isPublished: row?.isPublished ?? true,
    deletedAt: row?.deletedAt?.toISOString() ?? null,
    version: row?.version ?? 0,
    updatedAt: row?.updatedAt.toISOString() ?? null,
    updatedBy: row?.updatedByUser?.name ?? null,
    // Konten lengkap untuk editor (termasuk item hidden/soft-deleted agar dapat dipulihkan)
    content: mergeWithDefaults(section!.content, stored),
    defaults: section!.content,
  };
}

/**
 * Menyimpan konten section dengan optimistic lock (`version`). Baris dibuat bila belum ada (expectedVersion = 0).
 * Audit CMS_SECTION_UPDATED ditulis di transaksi yang sama.
 */
export async function saveCmsSection(
  pageKey: string,
  sectionKey: string,
  input: { content: unknown; expectedVersion: number; isPublished?: boolean },
  actor: AuditActor & { userId: string }
) {
  const { def, section } = getDefinition(pageKey, sectionKey);
  const errors = validateSectionContent(input.content, section!.content);
  if (errors.length > 0) throw new CmsError("Konten tidak valid.", 400, errors);
  const content = input.content as Record<string, unknown>;
  const columns = contentToColumns(pageKey, sectionKey, content);

  await db.$transaction(async (tx) => {
    const existing = await tx.cmsSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } });

    if (!existing) {
      if (input.expectedVersion !== 0) throw new CmsError("Section telah dihapus permanen atau belum dibuat. Muat ulang halaman.", 409);
      const index = Object.keys(def.sections).indexOf(sectionKey);
      await tx.cmsSection.create({
        data: {
          pageKey,
          sectionKey,
          label: section!.label,
          sortOrder: (index + 1) * 10,
          isPublished: input.isPublished ?? true,
          updatedById: actor.userId,
          ...columns,
        },
      });
    } else {
      if (existing.deletedAt) throw new CmsError("Section sedang dihapus. Pulihkan terlebih dahulu.", 409);
      const updated = await tx.cmsSection.updateMany({
        where: { id: existing.id, version: input.expectedVersion },
        data: {
          ...columns,
          ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
          version: { increment: 1 },
          updatedById: actor.userId,
        },
      });
      if (updated.count !== 1) {
        throw new CmsError("Konten sudah diubah admin lain sejak Anda membukanya. Muat ulang untuk melihat versi terbaru.", 409);
      }
    }

    await recordAuditLogTx(tx, {
      actor,
      action: "CMS_SECTION_UPDATED",
      entity: "cms_sections",
      recordId: `${pageKey}/${sectionKey}`,
      oldValue: existing ? { version: existing.version, isPublished: existing.isPublished, content: rowToContent(pageKey, existing) } : null,
      newValue: { version: existing ? existing.version + 1 : 1, isPublished: input.isPublished ?? existing?.isPublished ?? true, content },
    });
  });

  return getCmsSectionForEdit(pageKey, sectionKey);
}

/** Soft delete section: baris tetap ada (dapat dipulihkan), halaman publik tidak merender section ini. */
export async function softDeleteCmsSection(pageKey: string, sectionKey: string, actor: AuditActor & { userId: string }) {
  getDefinition(pageKey, sectionKey);
  await db.$transaction(async (tx) => {
    const row = await tx.cmsSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } });
    if (!row) {
      // Section yang belum pernah disimpan dibuat dulu dari default agar penghapusannya tercatat
      const { section, def } = getDefinition(pageKey, sectionKey);
      await tx.cmsSection.create({
        data: {
          pageKey,
          sectionKey,
          label: section!.label,
          sortOrder: (Object.keys(def.sections).indexOf(sectionKey) + 1) * 10,
          deletedAt: new Date(),
          deletedById: actor.userId,
          updatedById: actor.userId,
          ...contentToColumns(pageKey, sectionKey, section!.content as Record<string, unknown>),
        },
      });
    } else {
      if (row.deletedAt) throw new CmsError("Section sudah dihapus.", 409);
      await tx.cmsSection.update({
        where: { id: row.id },
        data: { deletedAt: new Date(), deletedById: actor.userId, version: { increment: 1 } },
      });
    }
    await recordAuditLogTx(tx, { actor, action: "CMS_SECTION_DELETED", entity: "cms_sections", recordId: `${pageKey}/${sectionKey}` });
  });
}

export async function restoreCmsSection(pageKey: string, sectionKey: string, actor: AuditActor & { userId: string }) {
  getDefinition(pageKey, sectionKey);
  await db.$transaction(async (tx) => {
    const row = await tx.cmsSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } });
    if (!row?.deletedAt) throw new CmsError("Section tidak dalam keadaan terhapus.", 409);
    await tx.cmsSection.update({
      where: { id: row.id },
      data: { deletedAt: null, deletedById: null, version: { increment: 1 }, updatedById: actor.userId },
    });
    await recordAuditLogTx(tx, { actor, action: "CMS_SECTION_RESTORED", entity: "cms_sections", recordId: `${pageKey}/${sectionKey}` });
  });
}

/** Mengurutkan section (urutan tampil di admin; halaman publik memakai tata letak tetap per section). */
export async function reorderCmsSections(pageKey: string, order: string[], actor: AuditActor & { userId: string }) {
  const { def } = getDefinition(pageKey);
  const keys = Object.keys(def.sections);
  if (order.length !== keys.length || !order.every((k) => keys.includes(k)) || new Set(order).size !== order.length) {
    throw new CmsError("Urutan section tidak valid.");
  }
  await db.$transaction(async (tx) => {
    for (let index = 0; index < order.length; index++) {
      const sectionKey = order[index];
      const sortOrder = (index + 1) * 10;
      const row = await tx.cmsSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } });
      if (row) {
        await tx.cmsSection.update({ where: { id: row.id }, data: { sortOrder } });
      } else {
        await tx.cmsSection.create({
          data: {
            pageKey,
            sectionKey,
            label: def.sections[sectionKey].label,
            sortOrder,
            updatedById: actor.userId,
            ...contentToColumns(pageKey, sectionKey, def.sections[sectionKey].content as Record<string, unknown>),
          },
        });
      }
    }
    await recordAuditLogTx(tx, { actor, action: "CMS_SECTIONS_REORDERED", entity: "cms_sections", recordId: pageKey, newValue: { order } });
  });
}
