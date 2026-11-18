/**
 * Menyelaraskan teks hero (badge/title/subtitle) halaman publik non-homepage di CMS
 * dengan copy bawaan situs (prisma/seed-data/page-heroes.json).
 *
 * AMAN: hanya menyentuh section page_* yang BELUM PERNAH disunting admin
 * (kolom updated_by masih kosong). extraContent tidak diubah. Section yang belum
 * ada akan dibuat. Gunakan --dry-run untuk melihat rencana tanpa menulis.
 *
 *   node --env-file=.env scripts/sync_page_hero_defaults.js --dry-run
 *   node --env-file=.env scripts/sync_page_hero_defaults.js
 */
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const defaults = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "prisma", "seed-data", "page-heroes.json"), "utf8")
  );

  for (const [sectionKey, hero] of Object.entries(defaults)) {
    const existing = await prisma.cmsSection.findUnique({ where: { sectionKey } });

    if (!existing) {
      console.log(`[CREATE] ${sectionKey}`);
      if (!dryRun) {
        await prisma.cmsSection.create({ data: { sectionKey, ...hero, extraContent: {}, isPublished: true } });
      }
      continue;
    }

    if (existing.updatedBy) {
      console.log(`[SKIP]   ${sectionKey} (sudah disunting admin: ${existing.updatedBy})`);
      continue;
    }

    if (Object.entries(hero).every(([field, value]) => existing[field] === value)) {
      console.log(`[OK]     ${sectionKey} (sudah sesuai bawaan)`);
      continue;
    }
    console.log(`[UPDATE] ${sectionKey}: "${existing.titleId}" -> "${hero.titleId.replace(/\n/g, " ")}"`);
    if (!dryRun) {
      await prisma.cmsSection.update({ where: { sectionKey }, data: hero });
    }
  }

  if (dryRun) console.log("\nDry run: tidak ada perubahan yang ditulis.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
