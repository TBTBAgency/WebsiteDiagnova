import React from "react";
import NovaAIPageClient from "./NovaAIPageClient";
import { getInnerPageCmsData } from "@/lib/models/cms-layout.model";

// ISR: hero, tata letak section (urutan/aktif/teks header/section kustom) dan CTA diambil dari CMS;
// disegarkan tiap 60 detik dan saat admin menyimpan CMS. Gagal memuat => teks & urutan bawaan.
export const revalidate = 60;

export default async function NovaAIPage() {
  const { cmsHero, layout, cta } = await getInnerPageCmsData("nova_ai");
  return <NovaAIPageClient cmsHero={cmsHero} layout={layout} cta={cta} />;
}
