const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function audit() {
  console.log('====================================================');
  console.log('   CHECKPOINT A: AUDIT KONDISI AKTUAL PROYEK');
  console.log('====================================================\n');

  // 1. Audit Tabel di Database
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log('1. TABEL DI DATABASE (public schema):');
  tables.forEach(t => console.log('   -', t.table_name));

  // 2. Row Counts
  console.log('\n2. JUMLAH DATA TABEL CMS & NAVIGASI:');
  const countCmsSections = await prisma.cmsSection.count();
  console.log('   - cms_sections:', countCmsSections);

  try {
    const countSlides = await prisma.cmsHeroSlide.count();
    console.log('   - cms_hero_slides (old):', countSlides);
  } catch (e) {
    console.log('   - cms_hero_slides: tidak ditemukan / error', e.message);
  }

  try {
    const countPartners = await prisma.cmsPartner.count();
    console.log('   - cms_partners (old):', countPartners);
  } catch (e) {
    console.log('   - cms_partners: tidak ditemukan / error', e.message);
  }

  try {
    const countComparisons = await prisma.cmsComparisonItem.count();
    console.log('   - cms_comparison_items (old):', countComparisons);
  } catch (e) {
    console.log('   - cms_comparison_items: tidak ditemukan / error', e.message);
  }

  try {
    const countTestimonials = await prisma.cmsTestimonial.count();
    console.log('   - cms_testimonials (old):', countTestimonials);
  } catch (e) {
    console.log('   - cms_testimonials: tidak ditemukan / error', e.message);
  }

  try {
    const countMenus = await prisma.menu.count();
    console.log('   - menus:', countMenus);
  } catch (e) {
    console.log('   - menus: tidak ditemukan / error', e.message);
  }

  try {
    const countMedia = await prisma.media.count();
    console.log('   - media:', countMedia);
  } catch (e) {
    console.log('   - media: tidak ditemukan / error', e.message);
  }

  // 3. Cek Isi CmsSection
  console.log('\n3. KONTEN SECTIONS PADA cms_sections:');
  const sections = await prisma.cmsSection.findMany({ orderBy: { createdAt: 'asc' } });
  for (const s of sections) {
    const extra = s.extraContent || {};
    const keys = Object.keys(extra);
    let details = '';
    if (extra.slides) details += ` slides:${extra.slides.length}`;
    if (extra.partners) details += ` partners:${extra.partners.length}`;
    if (extra.items) details += ` items:${extra.items.length}`;
    if (extra.steps) details += ` steps:${extra.steps.length}`;
    if (extra.cards) details += ` cards:${extra.cards.length}`;
    if (extra.imageUrl) details += ` imageUrl:${extra.imageUrl}`;
    console.log(`   * [${s.sectionKey}] id: ${s.id} | titleId: "${s.titleId || ''}" | extraKeys: [${keys.join(', ')}] | ${details}`);
  }

  // 4. Verifikasi Kelengkapan JSON vs Relational Old
  console.log('\n4. PERBANDINGAN DATA RELASIONAL VS DATA JSON:');
  const heroSec = sections.find(s => s.sectionKey === 'hero');
  const oldSlides = await prisma.cmsHeroSlide.findMany();
  console.log(`   - Slides: old relational = ${oldSlides.length}, JSON extraContent = ${heroSec?.extraContent?.slides?.length || 0}`);

  const trustedSec = sections.find(s => s.sectionKey === 'trusted_by');
  const oldPartners = await prisma.cmsPartner.findMany();
  console.log(`   - Partners: old relational = ${oldPartners.length}, JSON extraContent = ${trustedSec?.extraContent?.partners?.length || 0}`);

  const compSec = sections.find(s => s.sectionKey === 'comparison');
  const oldComp = await prisma.cmsComparisonItem.findMany();
  console.log(`   - Comparisons: old relational = ${oldComp.length}, JSON extraContent = ${compSec?.extraContent?.items?.length || 0}`);

  const testiSec = sections.find(s => s.sectionKey === 'testimonials');
  const oldTesti = await prisma.cmsTestimonial.findMany();
  console.log(`   - Testimonials: old relational = ${oldTesti.length}, JSON extraContent = ${testiSec?.extraContent?.items?.length || 0}`);

  // 5. Audit Halaman Publik yang Ada di Repository
  console.log('\n5. DAFTAR HALAMAN PUBLIK WEBSITE:');
  function findPages(dir, base = '') {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        if (!item.name.startsWith('(') && item.name !== 'admin' && item.name !== 'api') {
          results.push(...findPages(path.join(dir, item.name), path.join(base, item.name)));
        } else if (item.name.startsWith('(')) {
          results.push(...findPages(path.join(dir, item.name), base));
        }
      } else if (item.name === 'page.tsx' || item.name === 'page.jsx') {
        results.push(base || '/');
      }
    }
    return results;
  }
  const appDir = path.join(process.cwd(), 'app');
  const publicPages = findPages(appDir);
  console.log('   Halaman publik ditemukan:', publicPages);

}

audit()
  .catch(err => {
    console.error('Audit Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
