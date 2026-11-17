import React from "react";
import SolutionsPageClient from "./SolutionsPageClient";
import { getCmsPageHero } from "@/lib/models/cms.model";

// ISR: konten hero diambil dari CMS (page_solutions); disegarkan tiap 60 detik dan saat admin menyimpan CMS.
export const revalidate = 60;

export default async function SolutionsPage() {
  let cmsHero = null;
  try {
    cmsHero = await getCmsPageHero("page_solutions");
  } catch (err) {
    console.error("Gagal memuat hero CMS (page_solutions), memakai teks bawaan:", err);
  }
  return <SolutionsPageClient cmsHero={cmsHero} />;
}
