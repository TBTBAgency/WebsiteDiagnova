import React from "react";
import PlatformPageClient from "./PlatformPageClient";
import { getCmsPageHero } from "@/lib/models/cms.model";

// ISR: konten hero diambil dari CMS (page_platform); disegarkan tiap 60 detik dan saat admin menyimpan CMS.
export const revalidate = 60;

export default async function PlatformPage() {
  let cmsHero = null;
  try {
    cmsHero = await getCmsPageHero("page_platform");
  } catch (err) {
    console.error("Gagal memuat hero CMS (page_platform), memakai teks bawaan:", err);
  }
  return <PlatformPageClient cmsHero={cmsHero} />;
}
