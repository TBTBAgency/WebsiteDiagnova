import React from "react";
import IntegrationPageClient from "./IntegrationPageClient";
import { getInnerPageCmsData } from "@/lib/models/cms-layout.model";

// ISR: hero, tata letak section (urutan/aktif/teks header/section kustom) dan CTA diambil dari CMS;
// disegarkan tiap 60 detik dan saat admin menyimpan CMS. Gagal memuat => teks & urutan bawaan.
export const revalidate = 60;

export default async function IntegrationPage() {
  const { cmsHero, layout, cta } = await getInnerPageCmsData("integration");
  return <IntegrationPageClient cmsHero={cmsHero} layout={layout} cta={cta} />;
}
