import React from "react";
import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustedByBar } from "@/components/sections/TrustedByBar";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { InfrastructureSection } from "@/components/sections/InfrastructureSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { CmsSectionList, CmsSlot } from "@/components/cms/CmsSectionList";
import { getCmsHomepageContent } from "@/lib/models/cms.model";
import { getPageLayout } from "@/lib/models/cms-layout.model";

export const metadata: Metadata = {
  title: "Diagnova — AI-Powered Laboratory Intelligence Platform",
  description:
    "Solusi manajemen laboratorium medis end-to-end yang menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Klinis Modern.",
};

// Revalidate page cache every 60 seconds (also on-demand revalidation on CMS save)
export const revalidate = 60;

export default async function HomePage() {
  let cmsData = null;
  try {
    cmsData = await getCmsHomepageContent();
  } catch (err) {
    console.error("Gagal memuat data CMS, beralih ke konten default statis:", err);
  }

  // Urutan & visibilitas dari CMS (layout_home). Section yang baris CmsSection-nya
  // berstatus isPublished=false juga disembunyikan.
  const unpublished = new Set(
    Object.entries({
      trusted_by: cmsData?.trustedBy.section,
      about: cmsData?.about.section,
      comparison: cmsData?.comparison.section,
      workflow: cmsData?.workflow.section,
      infrastructure: cmsData?.infrastructure.section,
      testimonials: cmsData?.testimonials.section,
      cta: cmsData?.cta.section,
    })
      .filter(([, section]) => section && section.isPublished === false)
      .map(([key]) => key)
  );
  const layout = (await getPageLayout("home")).map((s) =>
    unpublished.has(s.key) ? { ...s, isActive: false } : s
  );

  return (
    <CmsSectionList layout={layout}>
      <CmsSlot id="hero">
        <Hero initialData={cmsData?.hero} />
      </CmsSlot>
      <CmsSlot id="trusted_by">
        <TrustedByBar initialData={cmsData?.trustedBy} />
      </CmsSlot>
      <CmsSlot id="about">
        <AboutSection initialData={cmsData?.about} />
      </CmsSlot>
      <CmsSlot id="comparison">
        <ComparisonSection initialData={cmsData?.comparison} />
      </CmsSlot>
      <CmsSlot id="workflow">
        <WorkflowSection initialData={cmsData?.workflow} />
      </CmsSlot>
      <CmsSlot id="infrastructure">
        <InfrastructureSection initialData={cmsData?.infrastructure} />
      </CmsSlot>
      <CmsSlot id="testimonials">
        <TestimonialsSection initialData={cmsData?.testimonials} />
      </CmsSlot>
      <CmsSlot id="faq">
        <FAQSection />
      </CmsSlot>
      <CmsSlot id="cta">
        <CTABanner initialData={cmsData?.cta} bgClassName="bg-[#F9F9F9]" topColor="#F9F9F9" />
      </CmsSlot>
    </CmsSectionList>
  );
}
