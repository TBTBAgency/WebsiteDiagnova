import React from "react";
import PlatformPageClient from "./PlatformPageClient";
import { getInnerPageCmsData } from "@/lib/models/cms-layout.model";

// ISR: hero, tata letak section (urutan/aktif/teks header/section kustom) dan CTA diambil dari CMS;
// disegarkan tiap 60 detik dan saat admin menyimpan CMS. Gagal memuat => teks & urutan bawaan.
export const revalidate = 60;

export default async function PlatformPage() {
  const { cmsHero, layout, cta } = await getInnerPageCmsData("platform");
  return <PlatformPageClient cmsHero={cmsHero} layout={layout} cta={cta} />;
}
