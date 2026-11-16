const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.cmsSection.findMany();
  for (const s of sections) {
    console.log("--------------------------------------------------");
    console.log("Key:", s.sectionKey, "| ID:", s.id, "| Title:", s.titleId);
    console.log("extraContent:", JSON.stringify(s.extraContent, null, 2));
  }

  const slides = await prisma.cmsHeroSlide.findMany();
  console.log("\nHero Slides count:", slides.length);

  const items = await prisma.cmsComparisonItem.findMany();
  console.log("Comparison Items count:", items.length);

  const testimonials = await prisma.cmsTestimonial.findMany();
  console.log("Testimonials count:", testimonials.length);

  const partners = await prisma.cmsPartner.findMany();
  console.log("Partners count:", partners.length);
}

main().finally(() => prisma.$disconnect());

