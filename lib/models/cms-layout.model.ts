import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/models/audit.model";
import { getCmsPageHero } from "@/lib/models/cms.model";
import { assertNotStale } from "@/lib/models/site-content.model";
import { HERO_DEFAULTS } from "@/lib/cms-hero-defaults";
import type { HeroExtraContent } from "@/lib/cms-hero";
import {
  CMS_PAGES,
  CUSTOM_KEY_PATTERN,
  CmsPageKey,
  ResolvedSection,
  StoredSection,
  defaultPageLayout,
  getPageDefinition,
  isSafeCmsUrl,
  layoutSectionKey,
  resolvePageLayout,
} from "@/lib/cms-layout";

export class CmsLayoutError extends Error {
  constructor(message: string, public readonly httpStatus: 400 | 404 | 409 = 400) {
    super(message);
    this.name = "CmsLayoutError";
  }
}

/**
 * Versi ringkas untuk halaman publik: hanya data yang dibutuhkan renderer, tanpa teks bawaan /
 * catatan admin dari registry (mengurangi ukuran payload halaman).
 */
function toPublicLayout(sections: ResolvedSection[]): ResolvedSection[] {
  return sections
    // Section kustom yang disembunyikan tidak dikirim sama sekali; section bawaan yang
    // disembunyikan dikirim tanpa konten (hanya agar urutan & visibilitas konsisten).
    .filter((s) => s.isActive || s.type === "builtin")
    .map(({ key, type, isActive, sortOrder, content, locked }) => ({
      key,
      type,
      isActive,
      sortOrder,
      locked,
      label: "",
      ...(content && isActive && { content }),
    }));
}

/** Tata letak halaman untuk website publik. Gagal membaca DB => layout bawaan. */
export async function getPageLayout(page: CmsPageKey): Promise<ResolvedSection[]> {
  try {
    const row = await db.cmsSection.findUnique({ where: { sectionKey: layoutSectionKey(page) } });
    // Layout yang di-unpublish diperlakukan seperti belum ada (tampilan bawaan).
    if (!row || !row.isPublished) return toPublicLayout(defaultPageLayout(page));
    return toPublicLayout(resolvePageLayout(page, row.extraContent));
  } catch (error) {
    console.error(`Gagal memuat tata letak CMS (${page}), memakai bawaan:`, error);
    return toPublicLayout(defaultPageLayout(page));
  }
}

/**
 * Data CMS untuk halaman dalam (platform, solutions, modules, nova_ai, integration):
 * hero halaman, tata letak, dan section CTA bersama (sama dengan CTA homepage).
 * Setiap bagian gagal secara independen ke tampilan bawaan.
 */
export async function getInnerPageCmsData(page: Exclude<CmsPageKey, "home">) {
  const def = getPageDefinition(page)!;
  const [cmsHero, layout, ctaRow] = await Promise.all([
    def.heroSectionKey
      ? getCmsPageHero(def.heroSectionKey).catch((err) => {
          console.error(`Gagal memuat hero CMS (${def.heroSectionKey}), memakai teks bawaan:`, err);
          return null;
        })
      : Promise.resolve(null),
    getPageLayout(page),
    db.cmsSection.findUnique({ where: { sectionKey: "cta" } }).catch((err) => {
      console.error("Gagal memuat CTA CMS, memakai teks bawaan:", err);
      return null;
    }),
  ]);
  return {
    cmsHero,
    layout,
    cta: ctaRow && ctaRow.isPublished ? { section: ctaRow } : null,
  };
}

/** Data untuk editor admin: layout + hero setiap halaman. */
export async function getAllPageLayoutsForAdmin() {
  const keys = [
    ...CMS_PAGES.map((p) => layoutSectionKey(p.key)),
    ...CMS_PAGES.map((p) => p.heroSectionKey).filter((k): k is string => !!k),
  ];
  const rows = await db.cmsSection.findMany({ where: { sectionKey: { in: keys } } });
  const byKey = new Map(rows.map((r) => [r.sectionKey, r]));
  return CMS_PAGES.map((p) => {
    const layoutRow = byKey.get(layoutSectionKey(p.key));
    const heroRow = p.heroSectionKey ? byKey.get(p.heroSectionKey) : undefined;
    return {
      key: p.key,
      label: p.label,
      path: p.path,
      heroSectionKey: p.heroSectionKey,
      layoutSaved: !!layoutRow,
      layoutUpdatedAt: layoutRow?.updatedAt ?? null,
      heroUpdatedAt: heroRow?.updatedAt ?? null,
      sections: resolvePageLayout(p.key, layoutRow?.extraContent ?? null),
      heroDefaults: p.key === "home" ? null : HERO_DEFAULTS[p.key],
      heroExtra: ((heroRow?.extraContent as { hero?: unknown } | null)?.hero ?? null) as HeroExtraContent | null,
      hero: heroRow
        ? {
            badgeId: heroRow.badgeId,
            badgeEn: heroRow.badgeEn,
            titleId: heroRow.titleId,
            titleEn: heroRow.titleEn,
            subtitleId: heroRow.subtitleId,
            subtitleEn: heroRow.subtitleEn,
            isPublished: heroRow.isPublished,
          }
        : null,
    };
  });
}

const text = (max: number) => z.string().max(max, `Maksimal ${max} karakter`).optional();
const url = z
  .string()
  .max(500)
  .refine(isSafeCmsUrl, "URL harus berupa path relatif (/...), anchor (#...), atau http(s)://")
  .optional();

const contentSchema = z
  .object({
    badgeId: text(120),
    badgeEn: text(120),
    titleId: text(300),
    titleEn: text(300),
    subtitleId: text(1500),
    subtitleEn: text(1500),
    imageUrl: url,
    imageAlt: text(200),
    ctaTextId: text(80),
    ctaTextEn: text(80),
    ctaUrl: url,
  })
  .strict();

const sectionSchema = z.object({
  key: z.string().min(1).max(60),
  type: z.enum(["builtin", "custom"]),
  isActive: z.boolean(),
  content: contentSchema.optional(),
});

export const savePageLayoutSchema = z.object({
  page: z.enum(CMS_PAGES.map((p) => p.key) as [CmsPageKey, ...CmsPageKey[]]),
  sections: z.array(sectionSchema).max(40, "Maksimal 40 section per halaman"),
});

const TEXT_FIELDS = ["badgeId", "badgeEn", "titleId", "titleEn", "subtitleId", "subtitleEn"] as const;

function compact<T extends Record<string, unknown>>(obj: T | undefined): Partial<T> | undefined {
  if (!obj) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return Object.keys(out).length ? (out as Partial<T>) : undefined;
}

/**
 * Menyimpan tata letak satu halaman (urutan = urutan array). Section bawaan yang tidak
 * dikenal ditolak; section terkunci selalu aktif & pertama; section kustom wajib punya judul
 * atau deskripsi atau gambar.
 */
export async function savePageLayout(input: unknown, userId?: string) {
  const parsed = savePageLayoutSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new CmsLayoutError(`Data tata letak tidak valid: ${first.path.join(".")} ${first.message}`);
  }
  const { page, sections } = parsed.data;
  const def = getPageDefinition(page)!;
  const builtinKeys = new Map(def.sections.map((s) => [s.key, s]));

  const seen = new Set<string>();
  const stored: StoredSection[] = [];
  sections.forEach((s, index) => {
    if (seen.has(s.key)) throw new CmsLayoutError(`Section '${s.key}' duplikat.`);
    seen.add(s.key);
    if (s.type === "builtin") {
      const sd = builtinKeys.get(s.key);
      if (!sd) throw new CmsLayoutError(`Section '${s.key}' tidak dikenal untuk halaman ${def.label}.`);
      let content = compact(s.content);
      if (content) {
        // Section bawaan hanya boleh menimpa teks header yang memang didukung halaman.
        if (!sd.defaults) throw new CmsLayoutError(`Teks section '${s.key}' tidak dapat diedit dari sini.`);
        content = Object.fromEntries(Object.entries(content).filter(([k]) => (TEXT_FIELDS as readonly string[]).includes(k)));
        if (Object.keys(content).length === 0) content = undefined;
      }
      stored.push({ key: s.key, type: "builtin", isActive: sd.locked ? true : s.isActive, sortOrder: (index + 1) * 10, ...(content && { content }) });
    } else {
      if (!CUSTOM_KEY_PATTERN.test(s.key)) throw new CmsLayoutError(`Kunci section kustom '${s.key}' tidak valid.`);
      const content = compact(s.content) || {};
      if (!content.titleId && !content.titleEn && !content.subtitleId && !content.subtitleEn && !content.imageUrl) {
        throw new CmsLayoutError("Section kustom wajib memiliki judul, deskripsi, atau gambar.");
      }
      if ((content.ctaTextId || content.ctaTextEn) && !content.ctaUrl) {
        throw new CmsLayoutError("Tombol CTA section kustom wajib memiliki URL.");
      }
      stored.push({ key: s.key, type: "custom", isActive: s.isActive, sortOrder: (index + 1) * 10, content });
    }
  });

  // Section bawaan yang tidak dikirim tetap dipertahankan (aktif, di akhir) agar tidak hilang diam-diam.
  for (const sd of def.sections) {
    if (!seen.has(sd.key)) stored.push({ key: sd.key, type: "builtin", isActive: true, sortOrder: (stored.length + 1) * 10 });
  }
  // Section terkunci selalu pertama.
  stored.sort((a, b) => Number(!!builtinKeys.get(b.key)?.locked) - Number(!!builtinKeys.get(a.key)?.locked) || a.sortOrder - b.sortOrder);
  stored.forEach((s, i) => (s.sortOrder = (i + 1) * 10));

  const sectionKey = layoutSectionKey(page);
  const existing = await db.cmsSection.findUnique({ where: { sectionKey } });
  if (!assertNotStale(existing?.updatedAt, (input as { baseUpdatedAt?: unknown })?.baseUpdatedAt)) {
    throw new CmsLayoutError("Tata letak halaman ini telah diubah oleh admin lain. Muat ulang lalu ulangi perubahan.", 409);
  }
  const extraContent = { ...((existing?.extraContent as Record<string, unknown>) || {}), sections: stored } as unknown as Prisma.InputJsonValue;
  const saved = await db.cmsSection.upsert({
    where: { sectionKey },
    update: { extraContent, ...(userId && { updatedBy: userId }) },
    create: { sectionKey, extraContent, isPublished: true, ...(userId && { updatedBy: userId }) },
  });

  await recordAuditLog({
    userId,
    action: existing ? "UPDATE_PAGE_LAYOUT" : "CREATE_PAGE_LAYOUT",
    entity: "cms_sections",
    recordId: sectionKey,
    oldValue: existing ? ({ sections: (existing.extraContent as { sections?: unknown })?.sections ?? null } as Record<string, unknown>) : undefined,
    newValue: { sections: stored } as unknown as Record<string, unknown>,
  });

  return { page, sections: resolvePageLayout(page, saved.extraContent), path: def.path };
}

const heroSchema = z.object({
  page: z.enum(CMS_PAGES.map((p) => p.key) as [CmsPageKey, ...CmsPageKey[]]),
  badgeId: text(120),
  badgeEn: text(120),
  titleId: text(300),
  titleEn: text(300),
  subtitleId: text(1500),
  subtitleEn: text(1500),
  // CTA & metrik hero (opsional). null = CTA disembunyikan; undefined = tidak diubah.
  primaryCta: z.object({ textId: text(80), textEn: text(80), url: z.string().max(500).refine(isSafeCmsUrl, "URL CTA tidak aman") }).nullable().optional(),
  secondaryCta: z.object({ textId: text(80), textEn: text(80), url: z.string().max(500).refine(isSafeCmsUrl, "URL CTA tidak aman") }).nullable().optional(),
  metrics: z
    .array(
      z.object({
        id: z.string().regex(/^[a-zA-Z0-9_-]{1,40}$/),
        valueId: text(40),
        valueEn: text(40),
        labelId: text(80),
        labelEn: text(80),
        subId: text(120),
        subEn: text(120),
        isActive: z.boolean(),
      })
    )
    .max(6, "Maksimal 6 metrik")
    .optional(),
});

/** Menyimpan hero (badge/judul/subjudul + CTA & metrik) halaman dalam di baris page_* yang dipakai halaman publik. */
export async function savePageHero(input: unknown, userId?: string) {
  const parsed = heroSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new CmsLayoutError(`Data hero tidak valid: ${first.path.join(".")} ${first.message}`);
  }
  const { page, ...fields } = parsed.data;
  const def = getPageDefinition(page)!;
  if (!def.heroSectionKey) throw new CmsLayoutError("Hero homepage diedit melalui tab Homepage › Hero.");

  const data = Object.fromEntries(
    TEXT_FIELDS.map((f) => [f, fields[f] !== undefined && fields[f]!.trim() !== "" ? fields[f]!.trim() : null])
  ) as Record<(typeof TEXT_FIELDS)[number], string | null>;

  const existing = await db.cmsSection.findUnique({ where: { sectionKey: def.heroSectionKey } });
  if (!assertNotStale(existing?.updatedAt, (input as { baseUpdatedAt?: unknown })?.baseUpdatedAt)) {
    throw new CmsLayoutError("Hero halaman ini telah diubah oleh admin lain. Muat ulang lalu ulangi perubahan.", 409);
  }
  const prevExtra = (existing?.extraContent && typeof existing.extraContent === "object" ? existing.extraContent : {}) as Record<string, unknown>;
  const prevHero = (prevExtra.hero && typeof prevExtra.hero === "object" ? prevExtra.hero : {}) as Record<string, unknown>;
  const heroPatch: Record<string, unknown> = {};
  if (fields.primaryCta !== undefined) heroPatch.primaryCta = fields.primaryCta;
  if (fields.secondaryCta !== undefined) heroPatch.secondaryCta = fields.secondaryCta;
  if (fields.metrics !== undefined) {
    const ids = new Set<string>();
    for (const m of fields.metrics) {
      if (ids.has(m.id)) throw new CmsLayoutError(`ID metrik '${m.id}' duplikat.`);
      ids.add(m.id);
    }
    heroPatch.metrics = fields.metrics;
  }
  // Key lain di extraContent (mis. items, bannerUrl) dipertahankan.
  const extraContent = (Object.keys(heroPatch).length > 0
    ? { ...prevExtra, hero: { ...prevHero, ...heroPatch } }
    : prevExtra) as Prisma.InputJsonValue;

  const saved = await db.cmsSection.upsert({
    where: { sectionKey: def.heroSectionKey },
    update: { ...data, extraContent, ...(userId && { updatedBy: userId }) },
    create: { sectionKey: def.heroSectionKey, ...data, extraContent, isPublished: true, ...(userId && { updatedBy: userId }) },
  });

  await recordAuditLog({
    userId,
    action: "UPDATE_PAGE_HERO",
    entity: "cms_sections",
    recordId: def.heroSectionKey,
    oldValue: existing ? ({ ...Object.fromEntries(TEXT_FIELDS.map((f) => [f, existing[f]])), hero: prevExtra.hero ?? null } as Record<string, unknown>) : undefined,
    newValue: { ...data, ...(Object.keys(heroPatch).length > 0 && { hero: heroPatch }) },
  });

  return { page, path: def.path, hero: Object.fromEntries(TEXT_FIELDS.map((f) => [f, saved[f]])) };
}
