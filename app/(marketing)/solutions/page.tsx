import React from "react";
import SolutionsPageClient from "./SolutionsPageClient";
import { getInnerPageCmsData } from "@/lib/models/cms-layout.model";

// ISR: hero, tata letak section (urutan/aktif/teks header/section kustom) dan CTA diambil dari CMS;
// disegarkan tiap 60 detik dan saat admin menyimpan CMS. Gagal memuat => teks & urutan bawaan.
export const revalidate = 60;

export default async function SolutionsPage() {
  const { cmsHero, layout, cta, content, workflow } = await getInnerPageCmsData("solutions");
  return <SolutionsPageClient cmsHero={cmsHero} layout={layout} cta={cta} content={content} workflow={workflow} />;
}
