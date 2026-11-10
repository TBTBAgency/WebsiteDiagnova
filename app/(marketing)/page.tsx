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
import { getCmsHomepageContent } from "@/lib/models/cms.model";

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

  return (
    <>
      {/* 1. Hero Section */}
      <Hero initialData={cmsData?.hero} />

      {/* 2. Trusted By Bar */}
      <TrustedByBar initialData={cmsData?.trustedBy} />

      {/* 3. About Diagnova Section */}
      <AboutSection initialData={cmsData?.about} />

      {/* 4. Comparison Section */}
      <ComparisonSection initialData={cmsData?.comparison} />

      {/* 5. Workflow Section */}
      <WorkflowSection initialData={cmsData?.workflow} />

      {/* 6. Infrastructure Section */}
      <InfrastructureSection initialData={cmsData?.infrastructure} />

      {/* 7. Customer Testimonials Section */}
      <TestimonialsSection initialData={cmsData?.testimonials} />

      {/* 8. Frequently Asked Questions (FAQ) Section */}
      <FAQSection />

      {/* 9. Bottom CTA Banner */}
      <CTABanner initialData={cmsData?.cta} />
    </>
  );
}
