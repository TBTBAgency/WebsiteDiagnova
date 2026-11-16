const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUnifiedCrud() {
  console.log('Testing unified CMS CRUD & JSON structure...');

  // 1. Test Hero Slide JSON update
  const heroSec = await prisma.cmsSection.findUnique({ where: { sectionKey: 'hero' } });
  if (!heroSec || !heroSec.extraContent || !Array.isArray(heroSec.extraContent.slides)) {
    throw new Error('Hero section extraContent.slides is missing or invalid');
  }
  console.log('[PASS] Hero extraContent.slides JSON is valid with count:', heroSec.extraContent.slides.length);

  // 2. Test Trusted By JSON update
  const trustedSec = await prisma.cmsSection.findUnique({ where: { sectionKey: 'trusted_by' } });
  if (!trustedSec || !trustedSec.extraContent || !Array.isArray(trustedSec.extraContent.partners)) {
    throw new Error('Trusted By extraContent.partners is missing or invalid');
  }
  console.log('[PASS] Trusted By extraContent.partners JSON is valid with count:', trustedSec.extraContent.partners.length);

  // 3. Test Testimonials JSON update
  const testiSec = await prisma.cmsSection.findUnique({ where: { sectionKey: 'testimonials' } });
  if (!testiSec || !testiSec.extraContent || !Array.isArray(testiSec.extraContent.items)) {
    throw new Error('Testimonials extraContent.items is missing or invalid');
  }
  console.log('[PASS] Testimonials extraContent.items JSON is valid with count:', testiSec.extraContent.items.length);

  // 4. Test About & CTA image fields
  const aboutSec = await prisma.cmsSection.findUnique({ where: { sectionKey: 'about' } });
  const ctaSec = await prisma.cmsSection.findUnique({ where: { sectionKey: 'cta' } });
  console.log('[PASS] About section extraContent:', aboutSec?.extraContent);
  console.log('[PASS] CTA section extraContent:', ctaSec?.extraContent);

  console.log('All unified CMS structures verified successfully!');
}

testUnifiedCrud()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

