const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runCmsMigration() {
  console.log("================================================================================");
  console.log("   MIGRASI DATA CMS KE STRUKTUR JSON PADA CMS_SECTIONS");
  console.log("================================================================================\n");

  try {
    // 1. Ambil data dari 4 tabel anak CMS
    const slides = await prisma.cmsHeroSlide.findMany({ orderBy: { sortOrder: "asc" } });
    const items = await prisma.cmsComparisonItem.findMany({ orderBy: { sortOrder: "asc" } });
    const testimonials = await prisma.cmsTestimonial.findMany({ orderBy: { sortOrder: "asc" } });
    const partners = await prisma.cmsPartner.findMany({ orderBy: { sortOrder: "asc" } });

    console.log(`[INFO] Data lama yang akan dipindahkan ke JSON:`);
    console.log(`       - Hero Slides: ${slides.length} records`);
    console.log(`       - Comparison Items: ${items.length} records`);
    console.log(`       - Testimonials: ${testimonials.length} records`);
    console.log(`       - Partners: ${partners.length} records\n`);

    // 2. Jalankan migrasi ke masing-masing record cms_sections
    await prisma.$transaction(async (tx) => {
      // A. HERO SECTION
      const heroSection = await tx.cmsSection.findUnique({ where: { sectionKey: "hero" } });
      if (heroSection) {
        const existingExtra = (heroSection.extraContent && typeof heroSection.extraContent === "object")
          ? heroSection.extraContent
          : {};

        const cleanSlides = slides.map((s) => ({
          id: s.id,
          titleId: s.titleId,
          titleEn: s.titleEn,
          subtitleId: s.subtitleId,
          subtitleEn: s.subtitleEn,
          badgeId: s.badgeId,
          badgeEn: s.badgeEn,
          ctaPrimaryTextId: s.ctaPrimaryTextId,
          ctaPrimaryTextEn: s.ctaPrimaryTextEn,
          ctaPrimaryUrl: s.ctaPrimaryUrl,
          ctaSecondaryTextId: s.ctaSecondaryTextId,
          ctaSecondaryTextEn: s.ctaSecondaryTextEn,
          ctaSecondaryUrl: s.ctaSecondaryUrl,
          imageUrl: s.imageUrl,
          imageAlt: s.imageAlt,
          sortOrder: s.sortOrder,
          isActive: s.isActive,
        }));

        await tx.cmsSection.update({
          where: { sectionKey: "hero" },
          data: {
            extraContent: {
              ...existingExtra,
              slides: cleanSlides,
            },
          },
        });
        console.log(`[PASS] Hero section diperbarui dengan ${cleanSlides.length} slides.`);
      }

      // B. TRUSTED_BY SECTION
      const trustedSection = await tx.cmsSection.findUnique({ where: { sectionKey: "trusted_by" } });
      if (trustedSection) {
        const existingExtra = (trustedSection.extraContent && typeof trustedSection.extraContent === "object")
          ? trustedSection.extraContent
          : {};

        const cleanPartners = partners.map((p) => ({
          id: p.id,
          name: p.name,
          logoUrl: p.logoUrl,
          sortOrder: p.sortOrder,
          isActive: p.isActive,
        }));

        await tx.cmsSection.update({
          where: { sectionKey: "trusted_by" },
          data: {
            extraContent: {
              ...existingExtra,
              partners: cleanPartners,
            },
          },
        });
        console.log(`[PASS] Trusted By section diperbarui dengan ${cleanPartners.length} partners.`);
      }

      // C. COMPARISON SECTION
      const compSection = await tx.cmsSection.findUnique({ where: { sectionKey: "comparison" } });
      if (compSection) {
        const existingExtra = (compSection.extraContent && typeof compSection.extraContent === "object")
          ? compSection.extraContent
          : {};

        const cleanItems = items.map((i) => ({
          id: i.id,
          number: i.number,
          conventionalTitleId: i.conventionalTitleId,
          conventionalTitleEn: i.conventionalTitleEn,
          conventionalDescId: i.conventionalDescId,
          conventionalDescEn: i.conventionalDescEn,
          diagnovaTitleId: i.diagnovaTitleId,
          diagnovaTitleEn: i.diagnovaTitleEn,
          diagnovaDescId: i.diagnovaDescId,
          diagnovaDescEn: i.diagnovaDescEn,
          impactMetric: i.impactMetric,
          sortOrder: i.sortOrder,
          isActive: i.isActive,
        }));

        await tx.cmsSection.update({
          where: { sectionKey: "comparison" },
          data: {
            extraContent: {
              ...existingExtra,
              items: cleanItems,
            },
          },
        });
        console.log(`[PASS] Comparison section diperbarui dengan ${cleanItems.length} items (metadata badge dipertahankan).`);
      }

      // D. TESTIMONIALS SECTION
      const testiSection = await tx.cmsSection.findUnique({ where: { sectionKey: "testimonials" } });
      if (testiSection) {
        const existingExtra = (testiSection.extraContent && typeof testiSection.extraContent === "object")
          ? testiSection.extraContent
          : {};

        const cleanTestimonials = testimonials.map((t) => ({
          id: t.id,
          name: t.name,
          roleId: t.roleId,
          roleEn: t.roleEn,
          institution: t.institution,
          quoteId: t.quoteId,
          quoteEn: t.quoteEn,
          avatarUrl: t.avatarUrl,
          rating: t.rating,
          sortOrder: t.sortOrder,
          isActive: t.isActive,
        }));

        await tx.cmsSection.update({
          where: { sectionKey: "testimonials" },
          data: {
            extraContent: {
              ...existingExtra,
              items: cleanTestimonials,
            },
          },
        });
        console.log(`[PASS] Testimonials section diperbarui dengan ${cleanTestimonials.length} testimonials (label readMore dipertahankan).`);
      }
    });

    console.log("\n================================================================================");
    console.log("   MIGRASI DATA KE JSON PADA CMS_SECTIONS BERHASIL 100%!");
    console.log("================================================================================\n");
  } catch (error) {
    console.error("Kesalahan migrasi CMS ke JSON:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCmsMigration();

