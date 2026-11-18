import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/models/audit.model";
import { Prisma } from "@prisma/client";
import type { CmsPageHero } from "@/lib/cms-hero";
import { isSafeCmsUrl } from "@/lib/cms-layout";

/** Error domain CMS Homepage (pesan aman untuk admin). */
export class CmsHubError extends Error {
  constructor(message: string, public readonly httpStatus: 400 | 404 | 409 = 400) {
    super(message);
    this.name = "CmsHubError";
  }
}

/** Section yang dikelola dari CMS Homepage (menu "CMS Homepage" di admin). */
export const HOMEPAGE_SECTION_KEYS = ["hero", "trusted_by", "about", "comparison", "workflow", "infrastructure", "testimonials", "cta"];

/** Daftar item yang hanya boleh diubah lewat operasi item (bukan lewat simpan section). */
const PROTECTED_ITEM_LISTS: Record<string, string[]> = {
  hero: ["slides"],
  trusted_by: ["partners"],
  comparison: ["items"],
  testimonials: ["items"],
};

/**
 * Menjalankan penulisan CMS Homepage secara berurutan (lintas instance server) dengan
 * advisory lock PostgreSQL. Fungsi simpan item membaca JSON lalu menulis ulang; tanpa
 * serialisasi, dua penyimpanan bersamaan dapat saling menghapus perubahan.
 */
export async function withCmsHubWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  let result!: T;
  await db.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('diagnova:cms-hub'))`;
      result = await fn();
    },
    { timeout: 20_000, maxWait: 20_000 }
  );
  return result;
}

/**
 * Mengambil section CMS; bila belum ada (mis. database baru yang belum di-seed) section
 * kosong dibuat otomatis sehingga penyimpanan item dari admin tidak gagal.
 */
async function getOrCreateSection(sectionKey: string) {
  return db.cmsSection.upsert({
    where: { sectionKey },
    update: {},
    create: { sectionKey, extraContent: {}, isPublished: true },
  });
}

export interface CmsHomepageData {
  hero: {
    section: any;
    slides: any[];
  };
  trustedBy: {
    section: any;
    partners: any[];
  };
  about: {
    section: any;
  };
  comparison: {
    section: any;
    items: any[];
  };
  workflow: {
    section: any;
  };
  infrastructure: {
    section: any;
  };
  testimonials: {
    section: any;
    items: any[];
  };
  cta: {
    section: any;
  };
}

/**
 * Mengambil seluruh data CMS Homepage murni dari JSON CmsSection.extraContent
 * Tanpa query atau ketergantungan pada tabel relasional anak lama
 */
export async function getCmsHomepageContent(options: { publicOnly?: boolean } = {}): Promise<CmsHomepageData> {
  const sections = await db.cmsSection.findMany();

  const sectionMap = new Map<string, (typeof sections)[0]>();
  for (const s of sections) {
    sectionMap.set(s.sectionKey, s);
  }

  const heroSec = sectionMap.get("hero");
  const trustedSec = sectionMap.get("trusted_by");
  const aboutSec = sectionMap.get("about");
  const compSec = sectionMap.get("comparison");
  const workSec = sectionMap.get("workflow");
  const infraSec = sectionMap.get("infrastructure");
  const testiSec = sectionMap.get("testimonials");
  const ctaSec = sectionMap.get("cta");

  // Item diurutkan berdasarkan sortOrder saat dibaca (bukan hanya saat disimpan),
  // sehingga urutan tetap benar walaupun data diubah di luar fungsi simpan.
  // publicOnly: item nonaktif dibuang di server (tidak ikut terkirim ke browser); admin tetap
  // menerima seluruh item.
  const bySortOrder = (list: unknown) =>
    Array.isArray(list)
      ? [...list]
          .filter((x: any) => !options.publicOnly || (x && x.isActive !== false))
          .sort((a: any, b: any) => (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0))
      : [];

  const heroExtra = (heroSec?.extraContent as any) || {};
  const trustedExtra = (trustedSec?.extraContent as any) || {};
  const compExtra = (compSec?.extraContent as any) || {};
  const testiExtra = (testiSec?.extraContent as any) || {};

  return {
    hero: {
      section: heroSec ?? null,
      slides: bySortOrder(heroExtra.slides),
    },
    trustedBy: {
      section: trustedSec ?? null,
      partners: bySortOrder(trustedExtra.partners),
    },
    about: {
      section: aboutSec ?? null,
    },
    comparison: {
      section: compSec ?? null,
      items: bySortOrder(compExtra.items),
    },
    workflow: {
      section: workSec ?? null,
    },
    infrastructure: {
      section: infraSec ?? null,
    },
    testimonials: {
      section: testiSec ?? null,
      items: bySortOrder(testiExtra.items),
    },
    cta: {
      section: ctaSec ?? null,
    },
  };
}

/**
 * Memperbarui metadata dan konten sebuah section CMS
 */
export async function updateCmsSection(
  sectionKey: string,
  data: {
    badgeId?: string | null;
    badgeEn?: string | null;
    titleId?: string | null;
    titleEn?: string | null;
    subtitleId?: string | null;
    subtitleEn?: string | null;
    extraContent?: Record<string, any> | null;
    isPublished?: boolean;
  },
  userId?: string
) {
  // CMS Homepage hanya boleh menyimpan section homepage. Halaman dalam, footer, FAQ, announcement,
  // tata letak, dan navigasi masing-masing punya editor & validasi sendiri (mencegah saling menimpa).
  if (!HOMEPAGE_SECTION_KEYS.includes(sectionKey)) {
    throw new CmsHubError(`Section '${sectionKey}' tidak dikelola dari CMS Homepage.`, 400);
  }

  const existing = await db.cmsSection.findUnique({
    where: { sectionKey },
  });

  if (!existing) {
    throw new CmsHubError(`Section CMS dengan kunci '${sectionKey}' tidak ditemukan.`, 404);
  }

  // extraContent digabung (merge), bukan diganti: daftar item yang punya operasi simpan/hapus sendiri
  // (slide, mitra, komparasi, testimoni) tidak boleh ditimpa oleh salinan form yang mungkin usang.
  let mergedExtra: Prisma.InputJsonValue | undefined;
  if (data.extraContent && typeof data.extraContent === "object") {
    const protectedKeys = PROTECTED_ITEM_LISTS[sectionKey] || [];
    const incoming = Object.fromEntries(Object.entries(data.extraContent).filter(([k]) => !protectedKeys.includes(k)));
    mergedExtra = { ...((existing.extraContent as Record<string, unknown>) || {}), ...incoming } as Prisma.InputJsonValue;
  }

  const updated = await db.cmsSection.update({
    where: { sectionKey },
    data: {
      ...(data.badgeId !== undefined && { badgeId: data.badgeId }),
      ...(data.badgeEn !== undefined && { badgeEn: data.badgeEn }),
      ...(data.titleId !== undefined && { titleId: data.titleId }),
      ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
      ...(data.subtitleId !== undefined && { subtitleId: data.subtitleId }),
      ...(data.subtitleEn !== undefined && { subtitleEn: data.subtitleEn }),
      ...(mergedExtra !== undefined && { extraContent: mergedExtra }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(userId && { updatedBy: userId }),
    },
  });

  await recordAuditLog({
    userId,
    action: "UPDATE_CMS_SECTION",
    entity: "cms_sections",
    recordId: sectionKey,
    oldValue: existing as unknown as Record<string, unknown>,
    newValue: updated as unknown as Record<string, unknown>,
  });

  return updated;
}

/**
 * Simpan atau perbarui Hero Slide langsung di CmsSection.extraContent.slides
 */
export async function saveHeroSlide(
  slide: {
    id?: string;
    sectionId?: string;
    titleId: string;
    titleEn: string;
    subtitleId?: string | null;
    subtitleEn?: string | null;
    badgeId?: string | null;
    badgeEn?: string | null;
    ctaPrimaryTextId?: string | null;
    ctaPrimaryTextEn?: string | null;
    ctaPrimaryUrl?: string | null;
    ctaSecondaryTextId?: string | null;
    ctaSecondaryTextEn?: string | null;
    ctaSecondaryUrl?: string | null;
    imageUrl: string;
    imageAlt?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  const heroSec = await getOrCreateSection("hero");

  const extra = (heroSec.extraContent as any) || {};
  const slides: any[] = Array.isArray(extra.slides) ? [...extra.slides] : [];

  let savedSlide: any;
  if (slide.id) {
    const idx = slides.findIndex((s) => s.id === slide.id);
    if (idx >= 0) {
      savedSlide = {
        ...slides[idx],
        ...slide,
        sortOrder: slide.sortOrder ?? slides[idx].sortOrder ?? 0,
        isActive: slide.isActive ?? slides[idx].isActive ?? true,
      };
      slides[idx] = savedSlide;
    } else {
      savedSlide = {
        ...slide,
        id: slide.id,
        sortOrder: slide.sortOrder ?? slides.length + 1,
        isActive: slide.isActive ?? true,
      };
      slides.push(savedSlide);
    }
  } else {
    const newId = `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    savedSlide = {
      ...slide,
      id: newId,
      sortOrder: slide.sortOrder ?? slides.length + 1,
      isActive: slide.isActive ?? true,
    };
    slides.push(savedSlide);
  }

  slides.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  await db.cmsSection.update({
    where: { sectionKey: "hero" },
    data: {
      extraContent: {
        ...extra,
        slides,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: slide.id ? "UPDATE_HERO_SLIDE_JSON" : "CREATE_HERO_SLIDE_JSON",
    entity: "cms_sections",
    recordId: savedSlide.id,
    newValue: savedSlide,
  });

  return savedSlide;
}

/**
 * Hapus Hero Slide langsung dari CmsSection.extraContent.slides
 */
export async function deleteHeroSlide(slideId: string, userId?: string) {
  const heroSec = await getOrCreateSection("hero");

  const extra = (heroSec.extraContent as any) || {};
  const slides: any[] = Array.isArray(extra.slides) ? [...extra.slides] : [];
  const filtered = slides.filter((s) => s.id !== slideId);

  await db.cmsSection.update({
    where: { sectionKey: "hero" },
    data: {
      extraContent: {
        ...extra,
        slides: filtered,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: "DELETE_HERO_SLIDE_JSON",
    entity: "cms_sections",
    recordId: slideId,
  });

  return { success: true };
}

/**
 * Simpan atau perbarui Partner Logo langsung di CmsSection.extraContent.partners
 */
export async function savePartner(
  partner: {
    id?: string;
    name: string;
    logoUrl: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  const sec = await getOrCreateSection("trusted_by");

  const extra = (sec.extraContent as any) || {};
  const partners: any[] = Array.isArray(extra.partners) ? [...extra.partners] : [];

  let savedPartner: any;
  if (partner.id) {
    const idx = partners.findIndex((p) => p.id === partner.id);
    if (idx >= 0) {
      savedPartner = {
        ...partners[idx],
        ...partner,
        sortOrder: partner.sortOrder ?? partners[idx].sortOrder ?? 0,
        isActive: partner.isActive ?? partners[idx].isActive ?? true,
      };
      partners[idx] = savedPartner;
    } else {
      savedPartner = {
        ...partner,
        id: partner.id,
        sortOrder: partner.sortOrder ?? partners.length + 1,
        isActive: partner.isActive ?? true,
      };
      partners.push(savedPartner);
    }
  } else {
    const newId = `partner-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    savedPartner = {
      ...partner,
      id: newId,
      sortOrder: partner.sortOrder ?? partners.length + 1,
      isActive: partner.isActive ?? true,
    };
    partners.push(savedPartner);
  }

  partners.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  await db.cmsSection.update({
    where: { sectionKey: "trusted_by" },
    data: {
      extraContent: {
        ...extra,
        partners,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: partner.id ? "UPDATE_CMS_PARTNER_JSON" : "CREATE_CMS_PARTNER_JSON",
    entity: "cms_sections",
    recordId: savedPartner.id,
    newValue: savedPartner,
  });

  return savedPartner;
}

/**
 * Hapus Partner Logo langsung dari CmsSection.extraContent.partners
 */
export async function deletePartner(id: string, userId?: string) {
  const sec = await getOrCreateSection("trusted_by");

  const extra = (sec.extraContent as any) || {};
  const partners: any[] = Array.isArray(extra.partners) ? [...extra.partners] : [];
  const filtered = partners.filter((p) => p.id !== id);

  await db.cmsSection.update({
    where: { sectionKey: "trusted_by" },
    data: {
      extraContent: {
        ...extra,
        partners: filtered,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_PARTNER_JSON",
    entity: "cms_sections",
    recordId: id,
  });

  return { success: true };
}

/**
 * Simpan atau perbarui Comparison Item langsung di CmsSection.extraContent.items
 */
export async function saveComparisonItem(
  item: {
    id?: string;
    number: string;
    conventionalTitleId: string;
    conventionalTitleEn: string;
    conventionalDescId?: string | null;
    conventionalDescEn?: string | null;
    diagnovaTitleId: string;
    diagnovaTitleEn: string;
    diagnovaDescId?: string | null;
    diagnovaDescEn?: string | null;
    impactMetric?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  const sec = await getOrCreateSection("comparison");

  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];

  let savedItem: any;
  if (item.id) {
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      savedItem = {
        ...items[idx],
        ...item,
        sortOrder: item.sortOrder ?? items[idx].sortOrder ?? 0,
        isActive: item.isActive ?? items[idx].isActive ?? true,
      };
      items[idx] = savedItem;
    } else {
      savedItem = {
        ...item,
        id: item.id,
        sortOrder: item.sortOrder ?? items.length + 1,
        isActive: item.isActive ?? true,
      };
      items.push(savedItem);
    }
  } else {
    const newId = `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    savedItem = {
      ...item,
      id: newId,
      sortOrder: item.sortOrder ?? items.length + 1,
      isActive: item.isActive ?? true,
    };
    items.push(savedItem);
  }

  items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  await db.cmsSection.update({
    where: { sectionKey: "comparison" },
    data: {
      extraContent: {
        ...extra,
        items,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: item.id ? "UPDATE_COMPARISON_ITEM_JSON" : "CREATE_COMPARISON_ITEM_JSON",
    entity: "cms_sections",
    recordId: savedItem.id,
    newValue: savedItem,
  });

  return savedItem;
}

/**
 * Hapus Comparison Item langsung dari CmsSection.extraContent.items
 */
export async function deleteComparisonItem(id: string, userId?: string) {
  const sec = await getOrCreateSection("comparison");

  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  const filtered = items.filter((i) => i.id !== id);

  await db.cmsSection.update({
    where: { sectionKey: "comparison" },
    data: {
      extraContent: {
        ...extra,
        items: filtered,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: "DELETE_COMPARISON_ITEM_JSON",
    entity: "cms_sections",
    recordId: id,
  });

  return { success: true };
}

/**
 * Simpan atau perbarui Testimonial langsung di CmsSection.extraContent.items
 */
export async function saveTestimonial(
  testimonial: {
    id?: string;
    name: string;
    roleId: string;
    roleEn: string;
    institution: string;
    quoteId: string;
    quoteEn: string;
    avatarUrl?: string | null;
    rating?: number;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  const sec = await getOrCreateSection("testimonials");

  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];

  let savedTesti: any;
  if (testimonial.id) {
    const idx = items.findIndex((t) => t.id === testimonial.id);
    if (idx >= 0) {
      savedTesti = {
        ...items[idx],
        ...testimonial,
        sortOrder: testimonial.sortOrder ?? items[idx].sortOrder ?? 0,
        isActive: testimonial.isActive ?? items[idx].isActive ?? true,
      };
      items[idx] = savedTesti;
    } else {
      savedTesti = {
        ...testimonial,
        id: testimonial.id,
        sortOrder: testimonial.sortOrder ?? items.length + 1,
        isActive: testimonial.isActive ?? true,
      };
      items.push(savedTesti);
    }
  } else {
    const newId = `testi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    savedTesti = {
      ...testimonial,
      id: newId,
      sortOrder: testimonial.sortOrder ?? items.length + 1,
      isActive: testimonial.isActive ?? true,
    };
    items.push(savedTesti);
  }

  items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  await db.cmsSection.update({
    where: { sectionKey: "testimonials" },
    data: {
      extraContent: {
        ...extra,
        items,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: testimonial.id ? "UPDATE_TESTIMONIAL_JSON" : "CREATE_TESTIMONIAL_JSON",
    entity: "cms_sections",
    recordId: savedTesti.id,
    newValue: savedTesti,
  });

  return savedTesti;
}

/**
 * Hapus Testimonial langsung dari CmsSection.extraContent.items
 */
export async function deleteTestimonial(id: string, userId?: string) {
  const sec = await getOrCreateSection("testimonials");

  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  const filtered = items.filter((t) => t.id !== id);

  await db.cmsSection.update({
    where: { sectionKey: "testimonials" },
    data: {
      extraContent: {
        ...extra,
        items: filtered,
      },
    },
  });

  await recordAuditLog({
    userId,
    action: "DELETE_TESTIMONIAL_JSON",
    entity: "cms_sections",
    recordId: id,
  });

  return { success: true };
}

// =============================================================================
// NAVIGASI CMS BERBASIS JSON CmsSection.extraContent.navigation
// =============================================================================

export interface CmsNavSubmenu {
  id: string;
  labelId: string;
  labelEn: string;
  descriptionId?: string;
  descriptionEn?: string;
  url: string;
  sectionKey?: string | null;
  iconName?: string;
  /** Kelas warna Tailwind untuk ikon (mis. "text-rose-500"); opsional. */
  iconColor?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CmsNavMenu {
  id: string;
  labelId: string;
  labelEn: string;
  descriptionId?: string;
  descriptionEn?: string;
  url: string;
  sectionKey?: string | null;
  iconName?: string;
  sortOrder: number;
  isActive: boolean;
  submenus: CmsNavSubmenu[];
}

/**
 * Mengambil seluruh menu navigasi untuk admin editor
 */
export async function getCmsNavigationMenus(): Promise<CmsNavMenu[]> {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "navigation" } });
  const extra = (sec?.extraContent as any) || {};
  if (Array.isArray(extra.menus)) {
    return extra.menus;
  }
  return [];
}

/**
 * Mengambil menu navigasi aktif untuk Navbar publik
 */
export async function getPublicCmsNavigationMenus(): Promise<CmsNavMenu[]> {
  const allMenus = await getCmsNavigationMenus();
  return allMenus
    .filter((m) => m.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((m) => ({
      ...m,
      submenus: (m.submenus || [])
        .filter((s) => s.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }));
}

/** Anchor section beranda yang boleh menjadi target menu (selain URL). */
export const NAV_HOMEPAGE_ANCHORS = ["hero", "workflow", "infrastructure", "about", "comparison", "testimonials", "cta"];

type NavInput = {
  id?: string;
  parentId?: string | null;
  labelId: string;
  labelEn: string;
  descriptionId?: string;
  descriptionEn?: string;
  url: string;
  sectionKey?: string | null;
  iconName?: string;
  sortOrder?: number;
  isActive?: boolean;
};

/** Validasi & normalisasi input menu/submenu dari admin (pesan aman untuk ditampilkan). */
function normalizeNavInput(raw: unknown): NavInput {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, max: number, label: string, required = false) => {
    const s = typeof v === "string" ? v.trim() : "";
    if (required && !s) throw new CmsHubError(`${label} wajib diisi.`, 400);
    if (s.length > max) throw new CmsHubError(`${label} maksimal ${max} karakter.`, 400);
    return s;
  };
  const sectionKey = typeof d.sectionKey === "string" && d.sectionKey.trim() !== "" ? d.sectionKey.trim() : null;
  if (sectionKey && !NAV_HOMEPAGE_ANCHORS.includes(sectionKey)) throw new CmsHubError("Target anchor section tidak dikenal.", 400);
  const url = str(d.url, 300, "URL tujuan");
  if (!sectionKey && !url) throw new CmsHubError("URL tujuan wajib diisi (mis. /platform#automation).", 400);
  if (url && !isSafeCmsUrl(url)) {
    throw new CmsHubError("URL tujuan harus berupa path (/...), anchor (#...), atau http(s)://", 400);
  }
  const sortOrder = Number(d.sortOrder);
  return {
    id: typeof d.id === "string" && d.id.trim() !== "" ? d.id.trim() : undefined,
    parentId: typeof d.parentId === "string" && d.parentId.trim() !== "" ? d.parentId.trim() : null,
    labelId: str(d.labelId, 80, "Label menu (ID)", true),
    labelEn: str(d.labelEn, 80, "Label menu (EN)", true),
    descriptionId: str(d.descriptionId, 200, "Deskripsi (ID)"),
    descriptionEn: str(d.descriptionEn, 200, "Deskripsi (EN)"),
    url,
    sectionKey,
    iconName: str(d.iconName, 40, "Nama ikon") || undefined,
    sortOrder: Number.isFinite(sortOrder) && sortOrder >= 1 ? Math.floor(sortOrder) : undefined,
    isActive: typeof d.isActive === "boolean" ? d.isActive : undefined,
  };
}

/**
 * Menempatkan item pada posisi `order` (1 = paling atas) lalu menomori ulang 1..n.
 * order undefined: item baru di posisi terakhir, item lama tetap di posisinya.
 */
function placeAt<T extends { id: string; sortOrder: number }>(list: T[], item: T, order: number | undefined): T[] {
  const sorted = [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentIdx = sorted.findIndex((x) => x.id === item.id);
  const rest = sorted.filter((x) => x.id !== item.id);
  let idx = order !== undefined ? order - 1 : currentIdx >= 0 ? currentIdx : rest.length;
  idx = Math.max(0, Math.min(rest.length, idx));
  rest.splice(idx, 0, item);
  return rest.map((x, i) => ({ ...x, sortOrder: i + 1 }));
}

/**
 * Menyimpan atau memperbarui menu/submenu navigasi di JSON
 */
export async function saveCmsNavigationMenu(rawInput: unknown, userId?: string) {
  const menuData = normalizeNavInput(rawInput);
  const sec = await getOrCreateSection("navigation");

  const extra = (sec.extraContent as any) || {};
  let menus: CmsNavMenu[] = Array.isArray(extra.menus)
    ? extra.menus.map((m: CmsNavMenu) => ({ ...m, submenus: [...(m.submenus || [])] }))
    : [];

  // Hanya field yang diizinkan yang disalin dari form. `submenus`/`parentId` dari payload TIDAK
  // pernah disalin: form edit membawa salinan submenu lama yang dapat menimpa perubahan lain.
  const fields = {
    labelId: menuData.labelId,
    labelEn: menuData.labelEn,
    descriptionId: menuData.descriptionId || "",
    descriptionEn: menuData.descriptionEn || "",
    url: menuData.url,
    sectionKey: menuData.sectionKey || null,
    ...(menuData.iconName && { iconName: menuData.iconName }),
    ...(menuData.isActive !== undefined && { isActive: menuData.isActive }),
  };

  if (menuData.parentId) {
    // Menambahkan atau mengedit submenu
    const parent = menus.find((m) => m.id === menuData.parentId);
    if (!parent) throw new CmsHubError("Menu induk tidak ditemukan.", 404);
    if (menuData.id && menus.some((m) => m.id === menuData.id)) {
      throw new CmsHubError("Menu utama tidak dapat dipindahkan menjadi submenu.", 400);
    }
    let existing: CmsNavSubmenu | undefined;
    if (menuData.id) {
      existing = menus.flatMap((m) => m.submenus || []).find((s) => s.id === menuData.id);
      // Pindah induk: hapus dari induk lama agar tidak tergandakan.
      for (const m of menus) {
        if (m !== parent) m.submenus = (m.submenus || []).filter((s) => s.id !== menuData.id);
      }
    }
    const item: CmsNavSubmenu = {
      ...(existing || {}),
      id: menuData.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      iconName: existing?.iconName || "Layers",
      isActive: existing?.isActive ?? true,
      ...fields,
      sortOrder: existing?.sortOrder ?? Number.MAX_SAFE_INTEGER,
    } as CmsNavSubmenu;
    const movedFromOtherParent = !!existing && !(parent.submenus || []).some((s) => s.id === item.id);
    parent.submenus = placeAt(parent.submenus || [], item, menuData.sortOrder ?? (movedFromOtherParent ? Number.MAX_SAFE_INTEGER : undefined));
  } else {
    // Menambahkan atau mengedit menu utama
    const existing = menuData.id ? menus.find((m) => m.id === menuData.id) : undefined;
    if (menuData.id && !existing) {
      // Submenu yang dijadikan menu utama: hapus dari induk lamanya.
      for (const m of menus) m.submenus = (m.submenus || []).filter((s) => s.id !== menuData.id);
    }
    const item: CmsNavMenu = {
      ...(existing || {}),
      id: menuData.id || `menu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      iconName: existing?.iconName || "Layers",
      isActive: existing?.isActive ?? true,
      ...fields,
      submenus: existing?.submenus || [],
      sortOrder: existing?.sortOrder ?? Number.MAX_SAFE_INTEGER,
    } as CmsNavMenu;
    menus = placeAt(menus, item, menuData.sortOrder);
  }

  await db.cmsSection.update({
    where: { sectionKey: "navigation" },
    data: {
      extraContent: {
        ...extra,
        menus,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  await recordAuditLog({
    userId,
    action: "SAVE_CMS_NAVIGATION_MENU",
    entity: "cms_sections",
    recordId: "navigation",
    newValue: { id: menuData.id ?? null, parentId: menuData.parentId ?? null, labelId: menuData.labelId, url: menuData.url },
  });

  return { success: true };
}

/**
 * Mengatur ulang urutan menu utama (parentId null) atau submenu satu menu induk.
 * orderedIds harus berisi tepat seluruh id pada level tersebut.
 */
export async function reorderCmsNavigationMenu(parentId: string | null, orderedIds: unknown, userId?: string) {
  if (!Array.isArray(orderedIds) || orderedIds.some((x) => typeof x !== "string")) {
    throw new CmsHubError("Urutan menu tidak valid.", 400);
  }
  const sec = await getOrCreateSection("navigation");
  const extra = (sec.extraContent as any) || {};
  let menus: CmsNavMenu[] = Array.isArray(extra.menus)
    ? extra.menus.map((m: CmsNavMenu) => ({ ...m, submenus: [...(m.submenus || [])] }))
    : [];
  const apply = <T extends { id: string; sortOrder: number }>(list: T[]): T[] => {
    const ids = list.map((x) => x.id);
    if (orderedIds.length !== ids.length || !ids.every((id) => (orderedIds as string[]).includes(id))) {
      throw new CmsHubError("Urutan menu tidak cocok dengan data terbaru. Muat ulang lalu ulangi.", 409);
    }
    return (orderedIds as string[]).map((id, i) => ({ ...list.find((x) => x.id === id)!, sortOrder: i + 1 }));
  };
  if (parentId) {
    const parent = menus.find((m) => m.id === parentId);
    if (!parent) throw new CmsHubError("Menu induk tidak ditemukan.", 404);
    parent.submenus = apply(parent.submenus || []);
  } else {
    menus = apply(menus);
  }
  await db.cmsSection.update({
    where: { sectionKey: "navigation" },
    data: { extraContent: { ...extra, menus } as unknown as Prisma.InputJsonValue },
  });
  await recordAuditLog({
    userId,
    action: "REORDER_CMS_NAVIGATION_MENU",
    entity: "cms_sections",
    recordId: "navigation",
    newValue: { parentId, orderedIds: orderedIds as string[] },
  });
  return { success: true };
}

/**
 * Menghapus menu atau submenu navigasi dari JSON
 */
export async function deleteCmsNavigationMenu(menuId: string, userId?: string) {
  const sec = await getOrCreateSection("navigation");

  const extra = (sec.extraContent as any) || {};
  let menus: CmsNavMenu[] = Array.isArray(extra.menus) ? [...extra.menus] : [];

  // Cek apakah yang dihapus adalah root menu
  const isRoot = menus.some((m) => m.id === menuId);
  const removed = isRoot
    ? menus.find((m) => m.id === menuId)
    : menus.flatMap((m) => m.submenus || []).find((s) => s.id === menuId);
  if (!removed) throw new CmsHubError("Menu tidak ditemukan.", 404);
  if (isRoot) {
    menus = menus.filter((m) => m.id !== menuId).map((m, i) => ({ ...m, sortOrder: i + 1 }));
  } else {
    // Submenu (urutan dinomori ulang agar tetap 1..n)
    menus = menus.map((m) => ({
      ...m,
      submenus: (m.submenus || [])
        .filter((s) => s.id !== menuId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s, i) => ({ ...s, sortOrder: i + 1 })),
    }));
  }

  await db.cmsSection.update({
    where: { sectionKey: "navigation" },
    data: {
      extraContent: {
        ...extra,
        menus,
      } as unknown as Prisma.InputJsonValue,
    },
  });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_NAVIGATION_MENU",
    entity: "cms_sections",
    recordId: menuId,
    // Item yang dihapus dicatat lengkap agar dapat dipulihkan bila perlu.
    oldValue: removed as unknown as Record<string, unknown>,
  });

  return { success: true };
}

/** Bentuk menu yang dikirim ke Navbar publik (tanpa metadata admin). */
export interface PublicNavSubmenu {
  id: string;
  labelId: string;
  labelEn: string;
  descriptionId: string;
  descriptionEn: string;
  url: string;
  sectionKey: string | null;
  iconName: string | null;
  iconColor: string | null;
}
export interface PublicNavMenu extends PublicNavSubmenu {
  submenus: PublicNavSubmenu[];
}

/**
 * Navigasi publik untuk Navbar (dirender di server). null = baris navigasi belum ada / DB gagal
 * (Navbar memakai navigasi bawaan). Menu & submenu nonaktif tidak disertakan.
 */
export async function getPublicNavigation(): Promise<PublicNavMenu[] | null> {
  try {
    const sec = await db.cmsSection.findUnique({ where: { sectionKey: "navigation" } });
    const menus = (sec?.extraContent as { menus?: unknown } | null)?.menus;
    if (!sec || !sec.isPublished || !Array.isArray(menus)) return null;
    const pick = (x: any): PublicNavSubmenu => ({
      id: String(x.id),
      labelId: String(x.labelId ?? ""),
      labelEn: String(x.labelEn ?? ""),
      descriptionId: String(x.descriptionId ?? ""),
      descriptionEn: String(x.descriptionEn ?? ""),
      url: String(x.url ?? ""),
      sectionKey: x.sectionKey || null,
      iconName: x.iconName || null,
      iconColor: x.iconColor || null,
    });
    return (menus as CmsNavMenu[])
      .filter((m) => m && m.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({
        ...pick(m),
        submenus: (m.submenus || []).filter((s) => s && s.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map(pick),
      }));
  } catch (error) {
    console.error("Gagal memuat navigasi CMS, memakai navigasi bawaan:", error);
    return null;
  }
}

/**
 * Mengambil konten section halaman tertentu (e.g. page_platform, page_solutions, dsb)
 */
export async function getCmsSectionByKey(sectionKey: string) {
  return await db.cmsSection.findUnique({
    where: { sectionKey },
  });
}


export interface AllCmsData {
  homepage: CmsHomepageData;
  navigation: CmsNavMenu[];
  platform: any;
  solutions: any;
  modules: any;
  novaAi: any;
  integrations: any;
}

/**
 * Mengambil seluruh data CMS untuk Single-Hub CMS Administrator
 */
export async function getAllCmsContent(): Promise<AllCmsData> {
  const [homepage, navigation, platform, solutions, modules, novaAi, integrations] = await Promise.all([
    getCmsHomepageContent(),
    getCmsNavigationMenus(),
    getCmsSectionByKey("page_platform"),
    getCmsSectionByKey("page_solutions"),
    getCmsSectionByKey("page_modules"),
    getCmsSectionByKey("page_nova_ai"),
    getCmsSectionByKey("page_integrations"),
  ]);

  return {
    homepage,
    navigation,
    platform: platform ? { section: platform, extraContent: platform.extraContent } : null,
    solutions: solutions ? { section: solutions, items: (solutions.extraContent as any)?.items || [] } : null,
    modules: modules ? { section: modules, items: (modules.extraContent as any)?.items || [] } : null,
    novaAi: novaAi ? { section: novaAi, extraContent: novaAi.extraContent } : null,
    integrations: integrations ? { section: integrations, items: (integrations.extraContent as any)?.items || [] } : null,
  };
}

/**
 * Simpan atau perbarui item solusi pada page_solutions
 */
export async function saveSolutionItem(item: any, userId?: string) {
  const sec = await getOrCreateSection("page_solutions");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "solusi-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_solutions" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_SOLUTION_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteSolutionItem(slug: string, userId?: string) {
  const sec = await getOrCreateSection("page_solutions");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_solutions" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_SOLUTION_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}

/**
 * Simpan atau perbarui item modul pada page_modules
 */
export async function saveModuleItem(item: any, userId?: string) {
  const sec = await getOrCreateSection("page_modules");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "modul-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_modules" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_MODULE_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteModuleItem(slug: string, userId?: string) {
  const sec = await getOrCreateSection("page_modules");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_modules" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_MODULE_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}

/**
 * Simpan atau perbarui item integrasi pada page_integrations
 */
export async function saveIntegrationItem(item: any, userId?: string) {
  const sec = await getOrCreateSection("page_integrations");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = Array.isArray(extra.items) ? [...extra.items] : [];
  let saved: any;
  if (item.slug) {
    const idx = items.findIndex((i) => i.slug === item.slug);
    if (idx >= 0) {
      saved = { ...items[idx], ...item };
      items[idx] = saved;
    } else {
      saved = { ...item };
      items.push(saved);
    }
  } else {
    saved = { ...item, slug: "integrasi-" + Date.now() };
    items.push(saved);
  }
  await db.cmsSection.update({
    where: { sectionKey: "page_integrations" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "SAVE_INTEGRATION_ITEM_JSON",
    entity: "cms_sections",
    recordId: saved.slug,
    newValue: saved,
  });
  return saved;
}

export async function deleteIntegrationItem(slug: string, userId?: string) {
  const sec = await getOrCreateSection("page_integrations");
  const extra = (sec.extraContent as any) || {};
  const items: any[] = (extra.items || []).filter((i: any) => i.slug !== slug);
  await db.cmsSection.update({
    where: { sectionKey: "page_integrations" },
    data: { extraContent: { ...extra, items } },
  });
  await recordAuditLog({
    userId,
    action: "DELETE_INTEGRATION_ITEM_JSON",
    entity: "cms_sections",
    recordId: slug,
  });
  return { success: true };
}


import { solutionsData as staticSolutions } from "@/content/solutions";
import { modulesData as staticModules } from "@/content/modules";
import { integrationsData as staticIntegrations } from "@/content/integrations";
import {
  novaAIWorkflowSteps as staticNovaSteps,
  novaAISampleTranslations as staticNovaTranslations,
  novaAIDisclaimer as staticNovaDisclaimer,
} from "@/content/nova-ai";

export async function getSolutionsPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_solutions" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticSolutions,
  };
}

export async function getModulesPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_modules" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticModules,
  };
}

export async function getIntegrationsPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_integrations" } });
  const items = (sec?.extraContent as any)?.items;
  return {
    section: sec,
    items: Array.isArray(items) && items.length > 0 ? items : staticIntegrations,
  };
}

export async function getNovaAiPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_nova_ai" } });
  const extra = (sec?.extraContent as any) || {};
  return {
    section: sec,
    bannerUrl: extra.bannerUrl || "/images/hero-bg-1.webp",
    disclaimer: extra.disclaimer || staticNovaDisclaimer,
    workflowSteps: Array.isArray(extra.workflowSteps) && extra.workflowSteps.length > 0 ? extra.workflowSteps : staticNovaSteps,
    sampleTranslations: Array.isArray(extra.sampleTranslations) && extra.sampleTranslations.length > 0 ? extra.sampleTranslations : staticNovaTranslations,
  };
}

export async function getPlatformPageData() {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey: "page_platform" } });
  const extra = (sec?.extraContent as any) || {};
  return {
    section: sec,
    bannerUrl: extra.bannerUrl || "/images/hero-bg-1.webp",
    submodules: Array.isArray(extra.submodules) ? extra.submodules : [],
  };
}

/**
 * Hero (badge/title/subtitle) untuk halaman publik non-homepage (page_platform, page_solutions, ...).
 * Mengembalikan null bila section tidak ada atau tidak dipublikasikan, sehingga halaman
 * memakai teks bawaannya.
 */
export async function getCmsPageHero(sectionKey: string): Promise<CmsPageHero | null> {
  const sec = await db.cmsSection.findUnique({ where: { sectionKey } });
  if (!sec || !sec.isPublished) return null;
  const heroExtra = (sec.extraContent as any)?.hero;
  return {
    // Metrik nonaktif dibuang di server agar tidak ikut terkirim ke browser.
    heroExtra:
      heroExtra && typeof heroExtra === "object"
        ? {
            ...heroExtra,
            ...(Array.isArray(heroExtra.metrics) && { metrics: heroExtra.metrics.filter((m: any) => m && m.isActive !== false) }),
          }
        : null,
    badgeId: sec.badgeId,
    badgeEn: sec.badgeEn,
    titleId: sec.titleId,
    titleEn: sec.titleEn,
    subtitleId: sec.subtitleId,
    subtitleEn: sec.subtitleEn,
  };
}
