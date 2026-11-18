import { z } from "zod";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/models/audit.model";
import { isSafeCmsUrl } from "@/lib/cms-layout";
import {
  AnnouncementContent,
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_FOOTER,
  FaqContent,
  FooterContent,
  resolveAnnouncement,
  resolveFooter,
} from "@/lib/site-content";
import { DEFAULT_FAQ, resolveFaq } from "@/lib/site-content-faq";

export const SITE_CONTENT_KEYS = { footer: "footer", faq: "faq", announcement: "announcement" } as const;
export type SiteContentType = keyof typeof SITE_CONTENT_KEYS;

export class SiteContentError extends Error {
  constructor(message: string, public readonly httpStatus: 400 | 409 = 400) {
    super(message);
    this.name = "SiteContentError";
  }
}

/**
 * Optimistic locking: klien mengirim updatedAt baris saat data dimuat (null = baris belum ada).
 * Bila baris telah diubah admin lain sejak itu, simpan ditolak (409) agar tidak saling menimpa.
 * Field tidak dikirim (undefined) = tanpa pemeriksaan (kompatibilitas klien lama).
 */
export function assertNotStale(existingUpdatedAt: Date | null | undefined, baseUpdatedAt: unknown): boolean {
  if (baseUpdatedAt === undefined) return true;
  const current = existingUpdatedAt ? existingUpdatedAt.toISOString() : null;
  return current === (baseUpdatedAt ?? null);
}


// Versi publik: item nonaktif dibuang DI SERVER, sehingga tidak ikut terkirim di payload
// halaman (konten tersembunyi tidak dapat dibaca dari page source).
function publicFooter(f: FooterContent): FooterContent {
  return {
    ...f,
    columns: f.columns.filter((c) => c.isActive).map((c) => ({ ...c, links: c.links.filter((l) => l.isActive) })),
    social: f.social.filter((s) => s.isActive),
  };
}
function publicFaq(f: FaqContent): FaqContent {
  return { ...f, items: f.items.filter((i) => i.isActive) };
}
function publicAnnouncement(a: AnnouncementContent): AnnouncementContent {
  return { ...a, items: a.items.filter((i) => i.isActive) };
}

/** Footer untuk website publik (gagal baca DB => bawaan). */
export async function getFooterContent(): Promise<FooterContent> {
  try {
    const row = await db.cmsSection.findUnique({ where: { sectionKey: SITE_CONTENT_KEYS.footer } });
    return publicFooter(row ? resolveFooter(row.extraContent) : DEFAULT_FOOTER);
  } catch (error) {
    console.error("Gagal memuat footer CMS, memakai bawaan:", error);
    return DEFAULT_FOOTER;
  }
}

/** Announcement untuk website publik (gagal baca DB => bawaan). */
export async function getAnnouncementContent(): Promise<AnnouncementContent> {
  try {
    const row = await db.cmsSection.findUnique({ where: { sectionKey: SITE_CONTENT_KEYS.announcement } });
    return publicAnnouncement(row ? resolveAnnouncement(row.extraContent) : DEFAULT_ANNOUNCEMENT);
  } catch (error) {
    console.error("Gagal memuat announcement CMS, memakai bawaan:", error);
    return DEFAULT_ANNOUNCEMENT;
  }
}

/** FAQ untuk website publik (gagal baca DB => bawaan). */
export async function getFaqContent(): Promise<FaqContent> {
  try {
    const row = await db.cmsSection.findUnique({ where: { sectionKey: SITE_CONTENT_KEYS.faq } });
    return publicFaq(resolveFaq(row));
  } catch (error) {
    console.error("Gagal memuat FAQ CMS, memakai bawaan:", error);
    return DEFAULT_FAQ;
  }
}

export async function getSiteContentForAdmin() {
  const rows = await db.cmsSection.findMany({ where: { sectionKey: { in: Object.values(SITE_CONTENT_KEYS) } } });
  const byKey = new Map(rows.map((r) => [r.sectionKey, r]));
  return {
    footer: { saved: byKey.has("footer"), updatedAt: byKey.get("footer")?.updatedAt ?? null, content: resolveFooter(byKey.get("footer")?.extraContent ?? null) },
    faq: { saved: byKey.has("faq"), updatedAt: byKey.get("faq")?.updatedAt ?? null, content: resolveFaq(byKey.get("faq") ?? null) },
    announcement: { saved: byKey.has("announcement"), updatedAt: byKey.get("announcement")?.updatedAt ?? null, content: resolveAnnouncement(byKey.get("announcement")?.extraContent ?? null) },
  };
}

// --- Validasi -----------------------------------------------------------------

const t = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,60}$/, "ID tidak valid");
const safeUrl = (required: boolean) =>
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => (required ? v !== "" : true), "URL wajib diisi")
    .refine(isSafeCmsUrl, "URL harus berupa path relatif (/...), anchor (#...), atau http(s)://");
const linkSchema = z.object({ id, labelId: t(80), labelEn: t(80), url: safeUrl(true), isActive: z.boolean() }).refine(
  (l) => l.labelId !== "" || l.labelEn !== "",
  "Label tautan wajib diisi (ID atau EN)"
);

const footerSchema = z.object({
  // Logo dirender dengan next/image: hanya file lokal / hasil upload (path relatif).
  logoUrl: z.string().trim().max(300).regex(/^(\/(?!\/)[^\s]*)?$/,"Logo harus berupa path lokal (/images/... atau hasil upload /uploads/...)"),
  descriptionId: t(600),
  descriptionEn: t(600),
  copyrightId: t(200),
  copyrightEn: t(200),
  contact: z.object({
    email: z.union([z.literal(""), z.string().trim().email("Email kontak tidak valid").max(200)]),
    phone: t(40).regex(/^[0-9+\-\s()]*$/, "Nomor telepon hanya boleh angka dan + - ( ) spasi"),
    whatsapp: t(40).regex(/^[0-9+\-\s()]*$/, "Nomor WhatsApp hanya boleh angka dan + - ( ) spasi"),
    addressId: t(300),
    addressEn: t(300),
  }),
  columns: z
    .array(
      z.object({ id, titleId: t(60), titleEn: t(60), isActive: z.boolean(), links: z.array(linkSchema).max(20, "Maksimal 20 tautan per kolom") })
    )
    .max(6, "Maksimal 6 kolom tautan"),
  social: z
    .array(
      z.object({
        id,
        platform: t(40).min(1, "Nama platform wajib diisi"),
        url: z.string().trim().max(300).regex(/^https:\/\/[^\s]+$/i, "URL media sosial harus https://"),
        isActive: z.boolean(),
      })
    )
    .max(10),
  legal: z.object({ showTerms: z.boolean(), showPrivacy: z.boolean() }),
});

const faqSchema = z.object({
  badgeId: t(60),
  badgeEn: t(60),
  titleId: t(200),
  titleEn: t(200),
  subtitleId: t(600),
  subtitleEn: t(600),
  supportPromptId: t(200),
  supportPromptEn: t(200),
  supportCtaId: t(60),
  supportCtaEn: t(60),
  supportCtaUrl: safeUrl(true),
  categories: z.array(z.object({ id, labelId: t(60).min(1, "Label kategori (ID) wajib"), labelEn: t(60) })).min(1, "Minimal 1 kategori").max(12),
  items: z
    .array(
      z.object({
        id,
        category: id,
        questionId: t(300).min(1, "Pertanyaan (ID) wajib diisi"),
        questionEn: t(300),
        answerId: t(3000).min(1, "Jawaban (ID) wajib diisi"),
        answerEn: t(3000),
        isActive: z.boolean(),
      })
    )
    .max(100),
});

const announcementSchema = z.object({
  enabled: z.boolean(),
  promptId: t(200),
  promptEn: t(200),
  startsAt: z.string().datetime({ offset: true }).nullable().or(z.literal("").transform(() => null)),
  endsAt: z.string().datetime({ offset: true }).nullable().or(z.literal("").transform(() => null)),
  items: z.array(linkSchema).max(8, "Maksimal 8 tombol"),
});

function uniqueIds(list: { id: string }[], what: string) {
  const seen = new Set<string>();
  for (const x of list) {
    if (seen.has(x.id)) throw new SiteContentError(`ID ${what} '${x.id}' duplikat.`);
    seen.add(x.id);
  }
}

function firstIssue(error: z.ZodError) {
  const i = error.issues[0];
  return `${i.path.join(".")}: ${i.message}`;
}

/** Menyimpan Footer / FAQ / Announcement. Baris dibuat bila belum ada. */
export async function saveSiteContent(type: unknown, data: unknown, userId?: string, baseUpdatedAt?: unknown) {
  if (type !== "footer" && type !== "faq" && type !== "announcement") {
    throw new SiteContentError("Tipe konten harus 'footer', 'faq', atau 'announcement'.");
  }
  const sectionKey = SITE_CONTENT_KEYS[type];
  let rowData: Prisma.CmsSectionUncheckedCreateInput;

  if (type === "footer") {
    const p = footerSchema.safeParse(data);
    if (!p.success) throw new SiteContentError(`Footer tidak valid — ${firstIssue(p.error)}`);
    uniqueIds(p.data.columns, "kolom");
    uniqueIds(p.data.columns.flatMap((c) => c.links), "tautan");
    uniqueIds(p.data.social, "media sosial");
    rowData = { sectionKey, extraContent: p.data as unknown as Prisma.InputJsonValue };
  } else if (type === "faq") {
    const p = faqSchema.safeParse(data);
    if (!p.success) throw new SiteContentError(`FAQ tidak valid — ${firstIssue(p.error)}`);
    uniqueIds(p.data.categories, "kategori");
    uniqueIds(p.data.items, "FAQ");
    const cats = new Set(p.data.categories.map((c) => c.id));
    const orphan = p.data.items.find((i) => !cats.has(i.category));
    if (orphan) throw new SiteContentError(`FAQ '${orphan.questionId.slice(0, 40)}' memakai kategori yang tidak ada.`);
    const { badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, ...extra } = p.data;
    rowData = { sectionKey, badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn, extraContent: extra as unknown as Prisma.InputJsonValue };
  } else {
    const p = announcementSchema.safeParse(data);
    if (!p.success) throw new SiteContentError(`Announcement tidak valid — ${firstIssue(p.error)}`);
    uniqueIds(p.data.items, "tombol");
    if (p.data.startsAt && p.data.endsAt && new Date(p.data.startsAt) >= new Date(p.data.endsAt)) {
      throw new SiteContentError("Periode tampil tidak valid: tanggal selesai harus setelah tanggal mulai.");
    }
    rowData = { sectionKey, extraContent: p.data as unknown as Prisma.InputJsonValue };
  }

  const existing = await db.cmsSection.findUnique({ where: { sectionKey } });
  if (!assertNotStale(existing?.updatedAt, baseUpdatedAt)) {
    throw new SiteContentError("Konten ini telah diubah oleh admin lain sejak Anda membukanya. Muat ulang lalu ulangi perubahan.", 409);
  }
  const { sectionKey: _k, ...update } = rowData;
  const saved = await db.cmsSection.upsert({
    where: { sectionKey },
    update: { ...update, ...(userId && { updatedBy: userId }) },
    create: { ...rowData, isPublished: true, ...(userId && { updatedBy: userId }) },
  });

  await recordAuditLog({
    userId,
    action: existing ? "UPDATE_SITE_CONTENT" : "CREATE_SITE_CONTENT",
    entity: "cms_sections",
    recordId: sectionKey,
    oldValue: existing ? ({ extraContent: existing.extraContent, titleId: existing.titleId } as Record<string, unknown>) : undefined,
    newValue: { extraContent: saved.extraContent, titleId: saved.titleId } as Record<string, unknown>,
  });

  return { type, saved: true };
}
