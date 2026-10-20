import React from "react";
import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustedByBar } from "@/components/sections/TrustedByBar";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { InfrastructureSection } from "@/components/sections/InfrastructureSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata: Metadata = {
  title: "Diagnova — AI-Powered Laboratory Intelligence Platform",
  description:
    "Solusi manajemen laboratorium medis end-to-end yang menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Klinis Modern.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trusted By Bar */}
      <TrustedByBar />

      {/* 3. About Diagnova Section */}
      <AboutSection />

      {/* 4. Comparison Section */}
      <ComparisonSection />

      {/* 5. Workflow Section */}
      <WorkflowSection />

      {/* 6. Infrastructure Section */}
      <InfrastructureSection />

      {/* 7. Customer Testimonials Section */}
      <TestimonialsSection />

      {/* 8. Bottom CTA Banner */}
      <CTABanner />
    </>
  );
}
