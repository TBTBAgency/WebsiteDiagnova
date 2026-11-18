import React from "react";
import ModulesPageClient from "./ModulesPageClient";
import { getInnerPageCmsData } from "@/lib/models/cms-layout.model";

// ISR: hero, tata letak section (urutan/aktif/teks header/section kustom) dan CTA diambil dari CMS;
// disegarkan tiap 60 detik dan saat admin menyimpan CMS. Gagal memuat => teks & urutan bawaan.
export const revalidate = 60;

export default async function ModulesPage() {
  const { cmsHero, layout, cta, content, workflow } = await getInnerPageCmsData("modules");
  return <ModulesPageClient cmsHero={cmsHero} layout={layout} cta={cta} content={content} workflow={workflow} />;
}
