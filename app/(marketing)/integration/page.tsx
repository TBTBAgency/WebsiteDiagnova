import React from "react";
import IntegrationPageClient from "./IntegrationPageClient";
import { getCmsPageHero } from "@/lib/models/cms.model";

// ISR: konten hero diambil dari CMS (page_integrations); disegarkan tiap 60 detik dan saat admin menyimpan CMS.
export const revalidate = 60;

export default async function IntegrationPage() {
  let cmsHero = null;
  try {
    cmsHero = await getCmsPageHero("page_integrations");
  } catch (err) {
    console.error("Gagal memuat hero CMS (page_integrations), memakai teks bawaan:", err);
  }
  return <IntegrationPageClient cmsHero={cmsHero} />;
}
