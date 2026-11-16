// Seed CMS seluruh halaman publik: membuat baris cms_sections yang BELUM ada dari default kode.
// Tidak pernah menimpa konten yang sudah ada (aman dijalankan berulang).
// Jalankan: npm run db:seed:cms
import { PrismaClient, Prisma } from "@prisma/client";
import { CMS_DEFINITIONS } from "../lib/cms/definitions";
import { HOME_COLUMN_SECTIONS } from "../content/pages/home";

const prisma = new PrismaClient();

async function main() {
  let created = 0;
  let skipped = 0;
  for (const [pageKey, def] of Object.entries(CMS_DEFINITIONS)) {
    const keys = Object.keys(def.sections);
    for (let i = 0; i < keys.length; i++) {
      const sectionKey = keys[i];
      const exists = await prisma.cmsSection.findUnique({ where: { pageKey_sectionKey: { pageKey, sectionKey } } });
      if (exists) {
        skipped++;
        continue;
      }
      const content = def.sections[sectionKey].content as Record<string, any>;
      const columns =
        pageKey === "home" && HOME_COLUMN_SECTIONS.has(sectionKey)
          ? (() => {
              const { badge, title, subtitle, ...extra } = content;
              return {
                badgeId: badge?.id ?? null, badgeEn: badge?.en ?? null,
                titleId: title?.id ?? null, titleEn: title?.en ?? null,
                subtitleId: subtitle?.id ?? null, subtitleEn: subtitle?.en ?? null,
                extraContent: extra as Prisma.InputJsonValue,
              };
            })()
          : { extraContent: content as Prisma.InputJsonValue };
      await prisma.cmsSection.create({
        data: { pageKey, sectionKey, label: def.sections[sectionKey].label, sortOrder: (i + 1) * 10, ...columns },
      });
      created++;
    }
  }
  console.log(`CMS seed selesai: ${created} section dibuat, ${skipped} sudah ada (tidak diubah).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
