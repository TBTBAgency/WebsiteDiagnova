const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const slides = await prisma.cmsHeroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("=== HERO SLIDES ===");
  console.log(JSON.stringify(slides, null, 2));

  const items = await prisma.cmsComparisonItem.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("\n=== COMPARISON ITEMS ===");
  console.log(JSON.stringify(items, null, 2));

  const testimonials = await prisma.cmsTestimonial.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("\n=== TESTIMONIALS ===");
  console.log(JSON.stringify(testimonials, null, 2));

  const partners = await prisma.cmsPartner.findMany({ orderBy: { sortOrder: "asc" } });
  console.log("\n=== PARTNERS ===");
  console.log(JSON.stringify(partners, null, 2));
}

main().finally(() => prisma.$disconnect());

