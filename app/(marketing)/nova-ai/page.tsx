import React from "react";
import NovaAIPageClient from "./NovaAIPageClient";
import { getCmsPageHero } from "@/lib/models/cms.model";

// ISR: konten hero diambil dari CMS (page_nova_ai); disegarkan tiap 60 detik dan saat admin menyimpan CMS.
export const revalidate = 60;

export default async function NovaAIPage() {
  let cmsHero = null;
  try {
    cmsHero = await getCmsPageHero("page_nova_ai");
  } catch (err) {
    console.error("Gagal memuat hero CMS (page_nova_ai), memakai teks bawaan:", err);
  }
  return <NovaAIPageClient cmsHero={cmsHero} />;
}
