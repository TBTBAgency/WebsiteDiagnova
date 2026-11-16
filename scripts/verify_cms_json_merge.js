const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getCmsHomepageContentTest() {
  const sections = await prisma.cmsSection.findMany();
  const sectionMap = new Map();
  for (const s of sections) {
    sectionMap.set(s.sectionKey, s);
  }

  const heroSec = sectionMap.get("hero");
  const trustedSec = sectionMap.get("trusted_by");
  const compSec = sectionMap.get("comparison");
  const testiSec = sectionMap.get("testimonials");

  const heroExtra = heroSec?.extraContent;
  const trustedExtra = trustedSec?.extraContent;
  const compExtra = compSec?.extraContent;
  const testiExtra = testiSec?.extraContent;

  return {
    hero: {
      section: heroSec || null,
      slides: (heroExtra?.slides && Array.isArray(heroExtra.slides)) ? heroExtra.slides : [],
    },
    trustedBy: {
      section: trustedSec || null,
      partners: (trustedExtra?.partners && Array.isArray(trustedExtra.partners)) ? trustedExtra.partners : [],
    },
    comparison: {
      section: compSec || null,
      items: (compExtra?.items && Array.isArray(compExtra.items)) ? compExtra.items : [],
    },
    testimonials: {
      section: testiSec || null,
      items: (testiExtra?.items && Array.isArray(testiExtra.items)) ? testiExtra.items : [],
    },
  };
}

async function runTests() {
  console.log("================================================================================");
  console.log("   PENGUJIAN RESTRUKTURISASI: CMS MERGE 4 TABEL KE JSON CMS_SECTIONS");
  console.log("================================================================================\n");

  let passed = 0;
  const total = 8;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Verifikasi Hero Slides di extraContent.slides
    // -------------------------------------------------------------------------
    const heroSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "hero" } });
    const heroSlidesTable = await prisma.cmsHeroSlide.findMany({ orderBy: { sortOrder: "asc" } });
    const heroSlidesJson = heroSec?.extraContent?.slides || [];

    const test1 =
      heroSlidesJson.length === 2 &&
      heroSlidesJson.length === heroSlidesTable.length &&
      heroSlidesJson.every((s, idx) => s.id === heroSlidesTable[idx].id && s.titleId === heroSlidesTable[idx].titleId);

    console.log(`[TEST 1] Hero Slides di JSON extraContent (2 slides): ${test1 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Jumlah di JSON: ${heroSlidesJson.length}, Jumlah di tabel: ${heroSlidesTable.length}`);
    console.log(`         ID Stabil: ${heroSlidesJson.map((s) => s.id).join(", ")}`);
    if (test1) passed++;

    // -------------------------------------------------------------------------
    // TEST 2: Verifikasi Trusted By Partners di extraContent.partners
    // -------------------------------------------------------------------------
    const trustedSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "trusted_by" } });
    const partnersTable = await prisma.cmsPartner.findMany({ orderBy: { sortOrder: "asc" } });
    const partnersJson = trustedSec?.extraContent?.partners || [];

    const test2 =
      partnersJson.length === 6 &&
      partnersJson.length === partnersTable.length &&
      partnersJson.every((p, idx) => p.id === partnersTable[idx].id && p.name === partnersTable[idx].name);

    console.log(`\n[TEST 2] Partners di JSON extraContent (6 partners): ${test2 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Jumlah di JSON: ${partnersJson.length}, Jumlah di tabel: ${partnersTable.length}`);
    console.log(`         Nama Mitra: ${partnersJson.map((p) => p.name).join(", ")}`);
    if (test2) passed++;

    // -------------------------------------------------------------------------
    // TEST 3: Verifikasi Comparison Items di extraContent.items & Badge Labels
    // -------------------------------------------------------------------------
    const compSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "comparison" } });
    const compItemsTable = await prisma.cmsComparisonItem.findMany({ orderBy: { sortOrder: "asc" } });
    const compItemsJson = compSec?.extraContent?.items || [];
    const hasBadges =
      compSec?.extraContent?.diagnovaBadgeId &&
      compSec?.extraContent?.diagnovaBadgeEn &&
      compSec?.extraContent?.conventionalBadgeId &&
      compSec?.extraContent?.conventionalBadgeEn;

    const test3 =
      compItemsJson.length === 6 &&
      compItemsJson.length === compItemsTable.length &&
      hasBadges &&
      compItemsJson.every((item, idx) => item.id === compItemsTable[idx].id && item.number === compItemsTable[idx].number);

    console.log(`\n[TEST 3] Comparison Items di JSON (6 items) & Badge Preservation: ${test3 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Jumlah items: ${compItemsJson.length}, Badge Metadata intact: ${!!hasBadges}`);
    console.log(`         Numbers: ${compItemsJson.map((i) => i.number).join(", ")}`);
    if (test3) passed++;

    // -------------------------------------------------------------------------
    // TEST 4: Verifikasi Testimonials di extraContent.items & ReadMore Label
    // -------------------------------------------------------------------------
    const testiSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "testimonials" } });
    const testiTable = await prisma.cmsTestimonial.findMany({ orderBy: { sortOrder: "asc" } });
    const testiJson = testiSec?.extraContent?.items || [];
    const hasReadMore = testiSec?.extraContent?.readMoreLabelId && testiSec?.extraContent?.readMoreLabelEn;

    const test4 =
      testiJson.length === 4 &&
      testiJson.length === testiTable.length &&
      hasReadMore &&
      testiJson.every((t, idx) => t.id === testiTable[idx].id && t.name === testiTable[idx].name);

    console.log(`\n[TEST 4] Testimonials di JSON (4 testimoni) & ReadMore Label: ${test4 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Jumlah testimoni: ${testiJson.length}, ReadMore label intact: ${!!hasReadMore}`);
    console.log(`         Nama Tokoh: ${testiJson.map((t) => t.name).join(", ")}`);
    if (test4) passed++;

    // -------------------------------------------------------------------------
    // TEST 5: Keutuhan Section Non-Tabel Anak (Workflow, Infrastructure, About, CTA)
    // -------------------------------------------------------------------------
    const workflowSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "workflow" } });
    const infraSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "infrastructure" } });
    const aboutSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "about" } });
    const ctaSec = await prisma.cmsSection.findUnique({ where: { sectionKey: "cta" } });

    const workflowStepsCount = workflowSec?.extraContent?.steps?.length || 0;
    const infraCardsCount = infraSec?.extraContent?.cards?.length || 0;
    const aboutImage = aboutSec?.extraContent?.imageUrl;
    const ctaBtn = ctaSec?.extraContent?.buttonTextId;

    const test5 = workflowStepsCount === 4 && infraCardsCount === 3 && !!aboutImage && !!ctaBtn;
    console.log(`\n[TEST 5] Keutuhan Section Non-Tabel Anak: ${test5 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Workflow steps: ${workflowStepsCount}, Infrastructure cards: ${infraCardsCount}`);
    console.log(`         About image: ${aboutImage}, CTA Button: ${ctaBtn}`);
    if (test5) passed++;

    // -------------------------------------------------------------------------
    // TEST 6: getCmsHomepageContent() Membaca Data Lengkap
    // -------------------------------------------------------------------------
    const homepageContent = await getCmsHomepageContentTest();
    const test6 =
      homepageContent.hero.slides.length === 2 &&
      homepageContent.trustedBy.partners.length === 6 &&
      homepageContent.comparison.items.length === 6 &&
      homepageContent.testimonials.items.length === 4;

    console.log(`\n[TEST 6] getCmsHomepageContent() Interface Output: ${test6 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Hero slides: ${homepageContent.hero.slides.length}`);
    console.log(`         TrustedBy partners: ${homepageContent.trustedBy.partners.length}`);
    console.log(`         Comparison items: ${homepageContent.comparison.items.length}`);
    console.log(`         Testimonials items: ${homepageContent.testimonials.items.length}`);
    if (test6) passed++;

    // -------------------------------------------------------------------------
    // TEST 7: Konsistensi ID & SortOrder
    // -------------------------------------------------------------------------
    const heroSortOrderMatch = heroSlidesJson.every((s, idx) => s.sortOrder === idx + 1);
    const partnersSortOrderMatch = partnersJson.every((p, idx) => p.sortOrder === idx + 1);
    const compSortOrderMatch = compItemsJson.every((c, idx) => c.sortOrder === idx + 1);
    const testiSortOrderMatch = testiJson.every((t, idx) => t.sortOrder === idx + 1);

    const test7 = heroSortOrderMatch && partnersSortOrderMatch && compSortOrderMatch && testiSortOrderMatch;
    console.log(`\n[TEST 7] Konsistensi Sort Order & Urutan Tampilan: ${test7 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Hero sortOrder ascending: ${heroSortOrderMatch}`);
    console.log(`         Partners sortOrder ascending: ${partnersSortOrderMatch}`);
    console.log(`         Comparison sortOrder ascending: ${compSortOrderMatch}`);
    console.log(`         Testimonials sortOrder ascending: ${testiSortOrderMatch}`);
    if (test7) passed++;

    // -------------------------------------------------------------------------
    // TEST 8: Keberadaan 4 Tabel Relasional Lama Sebagai Safe Transition
    // -------------------------------------------------------------------------
    const countSlides = await prisma.cmsHeroSlide.count();
    const countComp = await prisma.cmsComparisonItem.count();
    const countTesti = await prisma.cmsTestimonial.count();
    const countPartners = await prisma.cmsPartner.count();

    const test8 = countSlides === 2 && countComp === 6 && countTesti === 4 && countPartners === 6;
    console.log(`\n[TEST 8] Tabel Relasional Lama Tetap Utuh (Sesuai Syarat Tahap): ${test8 ? "LULUS (PASS)" : "GAGAL (FAIL)"}`);
    console.log(`         Hero Slides: ${countSlides}, Comparison: ${countComp}, Testimonials: ${countTesti}, Partners: ${countPartners}`);
    if (test8) passed++;

    console.log("\n================================================================================");
    console.log(`HASIL AKHIR: ${passed}/${total} PENGUJIAN LULUS (${Math.round((passed / total) * 100)}%)`);
    console.log("================================================================================\n");

    if (passed === total) {
      console.log("SELURUH DATA 4 TABEL CMS BERHASIL DILEBUR KE JSON PADA CMS_SECTIONS!");
      process.exit(0);
    } else {
      console.error("ADA PENGUJIAN YANG GAGAL. SILAKAN PERIKSA KEMBALI.");
      process.exit(1);
    }
  } catch (err) {
    console.error("Kesalahan saat menjalankan pengujian:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
