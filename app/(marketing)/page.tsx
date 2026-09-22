import React from "react";
import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TrustedByBar } from "@/components/sections/TrustedByBar";
import { AboutSection } from "@/components/sections/AboutSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { InfrastructureSection } from "@/components/sections/InfrastructureSection";
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

      {/* 4. Comparison Section (Conventional LIS vs Diagnova) */}
      <ComparisonSection />

      {/* 5. How It Works Section ("Perjalanan Setetes Darah") */}
      <HowItWorksSection />

      {/* 6. Infrastructure & Tech Section */}
      <InfrastructureSection />

      {/* 7. Bottom CTA Banner */}
      <CTABanner />
    </>
  );
}
