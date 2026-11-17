import React from "react";
import ModulesPageClient from "./ModulesPageClient";
import { getCmsPageHero } from "@/lib/models/cms.model";

// ISR: konten hero diambil dari CMS (page_modules); disegarkan tiap 60 detik dan saat admin menyimpan CMS.
export const revalidate = 60;

export default async function ModulesPage() {
  let cmsHero = null;
  try {
    cmsHero = await getCmsPageHero("page_modules");
  } catch (err) {
    console.error("Gagal memuat hero CMS (page_modules), memakai teks bawaan:", err);
  }
  return <ModulesPageClient cmsHero={cmsHero} />;
}
