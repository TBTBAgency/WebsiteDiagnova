import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/models/audit.model";
import { Prisma } from "@prisma/client";

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
 * Mengambil seluruh data CMS Homepage untuk render frontend maupun form admin
 */
export async function getCmsHomepageContent(): Promise<CmsHomepageData> {
  const sections = await db.cmsSection.findMany({
    include: {
      heroSlides: {
        orderBy: { sortOrder: "asc" },
      },
      comparisonItems: {
        orderBy: { sortOrder: "asc" },
      },
      testimonials: {
        orderBy: { sortOrder: "asc" },
      },
      partners: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

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

  return {
    hero: {
      section: heroSec ?? null,
      slides: heroSec?.heroSlides ?? [],
    },
    trustedBy: {
      section: trustedSec ?? null,
      partners: trustedSec?.partners ?? [],
    },
    about: {
      section: aboutSec ?? null,
    },
    comparison: {
      section: compSec ?? null,
      items: compSec?.comparisonItems ?? [],
    },
    workflow: {
      section: workSec ?? null,
    },
    infrastructure: {
      section: infraSec ?? null,
    },
    testimonials: {
      section: testiSec ?? null,
      items: testiSec?.testimonials ?? [],
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
  const existing = await db.cmsSection.findUnique({
    where: { sectionKey },
  });

  if (!existing) {
    throw new Error(`Section CMS dengan kunci '${sectionKey}' tidak ditemukan.`);
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
      ...(data.extraContent !== undefined && {
        extraContent: data.extraContent ? (data.extraContent as Prisma.InputJsonValue) : Prisma.JsonNull,
      }),
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
 * Simpan atau perbarui Hero Slide
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
  let heroSectionId = slide.sectionId;
  if (!heroSectionId) {
    const heroSec = await db.cmsSection.findUnique({ where: { sectionKey: "hero" } });
    heroSectionId = heroSec?.id;
  }

  if (slide.id) {
    const existing = await db.cmsHeroSlide.findUnique({ where: { id: slide.id } });
    const updated = await db.cmsHeroSlide.update({
      where: { id: slide.id },
      data: {
        titleId: slide.titleId,
        titleEn: slide.titleEn,
        subtitleId: slide.subtitleId,
        subtitleEn: slide.subtitleEn,
        badgeId: slide.badgeId,
        badgeEn: slide.badgeEn,
        ctaPrimaryTextId: slide.ctaPrimaryTextId,
        ctaPrimaryTextEn: slide.ctaPrimaryTextEn,
        ctaPrimaryUrl: slide.ctaPrimaryUrl,
        ctaSecondaryTextId: slide.ctaSecondaryTextId,
        ctaSecondaryTextEn: slide.ctaSecondaryTextEn,
        ctaSecondaryUrl: slide.ctaSecondaryUrl,
        imageUrl: slide.imageUrl,
        imageAlt: slide.imageAlt,
        sortOrder: slide.sortOrder ?? 0,
        isActive: slide.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "UPDATE_CMS_HERO_SLIDE",
      entity: "cms_hero_slides",
      recordId: slide.id,
      oldValue: existing as unknown as Record<string, unknown>,
      newValue: updated as unknown as Record<string, unknown>,
    });

    return updated;
  } else {
    const created = await db.cmsHeroSlide.create({
      data: {
        sectionId: heroSectionId,
        titleId: slide.titleId,
        titleEn: slide.titleEn,
        subtitleId: slide.subtitleId,
        subtitleEn: slide.subtitleEn,
        badgeId: slide.badgeId,
        badgeEn: slide.badgeEn,
        ctaPrimaryTextId: slide.ctaPrimaryTextId,
        ctaPrimaryTextEn: slide.ctaPrimaryTextEn,
        ctaPrimaryUrl: slide.ctaPrimaryUrl,
        ctaSecondaryTextId: slide.ctaSecondaryTextId,
        ctaSecondaryTextEn: slide.ctaSecondaryTextEn,
        ctaSecondaryUrl: slide.ctaSecondaryUrl,
        imageUrl: slide.imageUrl,
        imageAlt: slide.imageAlt,
        sortOrder: slide.sortOrder ?? 0,
        isActive: slide.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "CREATE_CMS_HERO_SLIDE",
      entity: "cms_hero_slides",
      recordId: created.id,
      newValue: created as unknown as Record<string, unknown>,
    });

    return created;
  }
}

/**
 * Hapus Hero Slide
 */
export async function deleteHeroSlide(slideId: string, userId?: string) {
  const existing = await db.cmsHeroSlide.findUnique({ where: { id: slideId } });
  if (!existing) return null;

  await db.cmsHeroSlide.delete({ where: { id: slideId } });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_HERO_SLIDE",
    entity: "cms_hero_slides",
    recordId: slideId,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return existing;
}

/**
 * Simpan atau perbarui Testimonial
 */
export async function saveTestimonial(
  testimonial: {
    id?: string;
    sectionId?: string;
    name: string;
    roleId: string;
    roleEn?: string | null;
    institution: string;
    quoteId: string;
    quoteEn: string;
    avatarUrl?: string;
    rating?: number;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  let sectionId = testimonial.sectionId;
  if (!sectionId) {
    const sec = await db.cmsSection.findUnique({ where: { sectionKey: "testimonials" } });
    sectionId = sec?.id;
  }

  if (testimonial.id) {
    const existing = await db.cmsTestimonial.findUnique({ where: { id: testimonial.id } });
    const updated = await db.cmsTestimonial.update({
      where: { id: testimonial.id },
      data: {
        name: testimonial.name,
        roleId: testimonial.roleId,
        roleEn: testimonial.roleEn,
        institution: testimonial.institution,
        quoteId: testimonial.quoteId,
        quoteEn: testimonial.quoteEn,
        avatarUrl: testimonial.avatarUrl ?? "/images/testimonial-silhouette-female.jpg",
        rating: testimonial.rating ?? 5,
        sortOrder: testimonial.sortOrder ?? 0,
        isActive: testimonial.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "UPDATE_CMS_TESTIMONIAL",
      entity: "cms_testimonials",
      recordId: testimonial.id,
      oldValue: existing as unknown as Record<string, unknown>,
      newValue: updated as unknown as Record<string, unknown>,
    });

    return updated;
  } else {
    const created = await db.cmsTestimonial.create({
      data: {
        sectionId,
        name: testimonial.name,
        roleId: testimonial.roleId,
        roleEn: testimonial.roleEn,
        institution: testimonial.institution,
        quoteId: testimonial.quoteId,
        quoteEn: testimonial.quoteEn,
        avatarUrl: testimonial.avatarUrl ?? "/images/testimonial-silhouette-female.jpg",
        rating: testimonial.rating ?? 5,
        sortOrder: testimonial.sortOrder ?? 0,
        isActive: testimonial.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "CREATE_CMS_TESTIMONIAL",
      entity: "cms_testimonials",
      recordId: created.id,
      newValue: created as unknown as Record<string, unknown>,
    });

    return created;
  }
}

/**
 * Hapus Testimonial
 */
export async function deleteTestimonial(id: string, userId?: string) {
  const existing = await db.cmsTestimonial.findUnique({ where: { id } });
  if (!existing) return null;

  await db.cmsTestimonial.delete({ where: { id } });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_TESTIMONIAL",
    entity: "cms_testimonials",
    recordId: id,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return existing;
}

/**
 * Simpan atau perbarui Comparison Item
 */
export async function saveComparisonItem(
  item: {
    id?: string;
    sectionId?: string;
    number: string;
    conventionalTitleId: string;
    conventionalTitleEn: string;
    conventionalDescId: string;
    conventionalDescEn: string;
    diagnovaTitleId: string;
    diagnovaTitleEn: string;
    diagnovaDescId: string;
    diagnovaDescEn: string;
    impactMetric: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  let sectionId = item.sectionId;
  if (!sectionId) {
    const sec = await db.cmsSection.findUnique({ where: { sectionKey: "comparison" } });
    sectionId = sec?.id;
  }

  if (item.id) {
    const existing = await db.cmsComparisonItem.findUnique({ where: { id: item.id } });
    const updated = await db.cmsComparisonItem.update({
      where: { id: item.id },
      data: {
        number: item.number,
        conventionalTitleId: item.conventionalTitleId,
        conventionalTitleEn: item.conventionalTitleEn,
        conventionalDescId: item.conventionalDescId,
        conventionalDescEn: item.conventionalDescEn,
        diagnovaTitleId: item.diagnovaTitleId,
        diagnovaTitleEn: item.diagnovaTitleEn,
        diagnovaDescId: item.diagnovaDescId,
        diagnovaDescEn: item.diagnovaDescEn,
        impactMetric: item.impactMetric,
        sortOrder: item.sortOrder ?? 0,
        isActive: item.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "UPDATE_CMS_COMPARISON_ITEM",
      entity: "cms_comparison_items",
      recordId: item.id,
      oldValue: existing as unknown as Record<string, unknown>,
      newValue: updated as unknown as Record<string, unknown>,
    });

    return updated;
  } else {
    const created = await db.cmsComparisonItem.create({
      data: {
        sectionId,
        number: item.number,
        conventionalTitleId: item.conventionalTitleId,
        conventionalTitleEn: item.conventionalTitleEn,
        conventionalDescId: item.conventionalDescId,
        conventionalDescEn: item.conventionalDescEn,
        diagnovaTitleId: item.diagnovaTitleId,
        diagnovaTitleEn: item.diagnovaTitleEn,
        diagnovaDescId: item.diagnovaDescId,
        diagnovaDescEn: item.diagnovaDescEn,
        impactMetric: item.impactMetric,
        sortOrder: item.sortOrder ?? 0,
        isActive: item.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "CREATE_CMS_COMPARISON_ITEM",
      entity: "cms_comparison_items",
      recordId: created.id,
      newValue: created as unknown as Record<string, unknown>,
    });

    return created;
  }
}

/**
 * Hapus Comparison Item
 */
export async function deleteComparisonItem(id: string, userId?: string) {
  const existing = await db.cmsComparisonItem.findUnique({ where: { id } });
  if (!existing) return null;

  await db.cmsComparisonItem.delete({ where: { id } });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_COMPARISON_ITEM",
    entity: "cms_comparison_items",
    recordId: id,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return existing;
}

/**
 * Simpan atau perbarui Partner Logo
 */
export async function savePartner(
  partner: {
    id?: string;
    sectionId?: string;
    name: string;
    logoUrl: string;
    sortOrder?: number;
    isActive?: boolean;
  },
  userId?: string
) {
  let sectionId = partner.sectionId;
  if (!sectionId) {
    const sec = await db.cmsSection.findUnique({ where: { sectionKey: "trusted_by" } });
    sectionId = sec?.id;
  }

  if (partner.id) {
    const existing = await db.cmsPartner.findUnique({ where: { id: partner.id } });
    const updated = await db.cmsPartner.update({
      where: { id: partner.id },
      data: {
        name: partner.name,
        logoUrl: partner.logoUrl,
        sortOrder: partner.sortOrder ?? 0,
        isActive: partner.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "UPDATE_CMS_PARTNER",
      entity: "cms_partners",
      recordId: partner.id,
      oldValue: existing as unknown as Record<string, unknown>,
      newValue: updated as unknown as Record<string, unknown>,
    });

    return updated;
  } else {
    const created = await db.cmsPartner.create({
      data: {
        sectionId,
        name: partner.name,
        logoUrl: partner.logoUrl,
        sortOrder: partner.sortOrder ?? 0,
        isActive: partner.isActive ?? true,
      },
    });

    await recordAuditLog({
      userId,
      action: "CREATE_CMS_PARTNER",
      entity: "cms_partners",
      recordId: created.id,
      newValue: created as unknown as Record<string, unknown>,
    });

    return created;
  }
}

/**
 * Hapus Partner Logo
 */
export async function deletePartner(id: string, userId?: string) {
  const existing = await db.cmsPartner.findUnique({ where: { id } });
  if (!existing) return null;

  await db.cmsPartner.delete({ where: { id } });

  await recordAuditLog({
    userId,
    action: "DELETE_CMS_PARTNER",
    entity: "cms_partners",
    recordId: id,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return existing;
}

