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
import { getCmsHomepageContent, type CmsHomepageData } from "@/lib/models/cms.model";

export const metadata: Metadata = {
  title: "Diagnova — AI-Powered Laboratory Intelligence Platform",
  description:
    "Solusi manajemen laboratorium medis end-to-end yang menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Klinis Modern.",
};

// Revalidate page cache every 60 seconds (also on-demand revalidation on CMS save)
export const revalidate = 60;

export default async function HomePage() {
  // undefined = DB tidak tersedia -> komponen memakai konten statis bawaan
  // null      = section disembunyikan / dihapus di CMS -> tidak dirender
  let cms: CmsHomepageData = {};
  try {
    cms = await getCmsHomepageContent();
  } catch (err) {
    console.error("Gagal memuat data CMS, beralih ke konten default statis:", err);
  }
  const show = (v: unknown) => v !== null;

  return (
    <>
      {show(cms.hero) && <Hero initialData={cms.hero ?? undefined} />}
      {show(cms.trustedBy) && <TrustedByBar initialData={cms.trustedBy ?? undefined} />}
      {show(cms.about) && <AboutSection initialData={cms.about ?? undefined} />}
      {show(cms.comparison) && <ComparisonSection initialData={cms.comparison ?? undefined} />}
      {show(cms.workflow) && <WorkflowSection initialData={cms.workflow ?? undefined} />}
      {show(cms.infrastructure) && <InfrastructureSection initialData={cms.infrastructure ?? undefined} />}
      {show(cms.testimonials) && <TestimonialsSection initialData={cms.testimonials ?? undefined} />}
      <FAQSection content={cms.faq as any} />
      {show(cms.cta) && <CTABanner initialData={cms.cta ?? undefined} bgClassName="bg-[#F9F9F9]" topColor="#F9F9F9" />}
    </>
  );
}
