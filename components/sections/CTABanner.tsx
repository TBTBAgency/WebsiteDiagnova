"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace("#", "");
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return `${r}, ${g}, ${b}`;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 250;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 251;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 253;
  return `${r}, ${g}, ${b}`;
}

export interface CTABannerProps {
  initialData?: {
    section?: any;
  } | null;
  bgClassName?: string;
  topColor?: string;
}

export function CTABanner({
  initialData,
  bgClassName = "bg-[#FAFBFD]",
  topColor = "#FAFBFD",
}: CTABannerProps = {}) {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const rgb = hexToRgb(topColor);

  const titleText =
    (language === "ID" ? initialData?.section?.titleId : initialData?.section?.titleEn) ||
    (language === "ID" ? "Transformasi Laboratorium Anda Bersama Diagnova" : "Transform Your Laboratory with Diagnova");

  const subtitleText =
    (language === "ID" ? initialData?.section?.subtitleId : initialData?.section?.subtitleEn) ||
    (language === "ID"
      ? "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini."
      : "Bring high reliability, speed, and precision to your healthcare institution today.");

  const buttonText =
    (language === "ID"
      ? initialData?.section?.extraContent?.buttonTextId
      : initialData?.section?.extraContent?.buttonTextEn) ||
    (language === "ID" ? "Minta Demo" : "Request Demo");

  const placeholderText =
    (language === "ID"
      ? initialData?.section?.extraContent?.placeholderId
      : initialData?.section?.extraContent?.placeholderEn) ||
    (language === "ID" ? "Masukkan alamat email Anda" : "Enter your email address");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/request-demo?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push("/request-demo");
    }
  };

  return (
    <section
      id="cta-banner"
      className={cn("relative w-full pt-12 sm:pt-16 lg:pt-20 pb-0 overflow-hidden content-auto", bgClassName)}
    >
      {/* Gradient fade background: topColor seamlessly blending to #3880DB at the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${topColor} 0%, ${topColor} 20%, rgba(${rgb}, 0.85) 40%, rgba(56, 128, 219, 0.12) 70%, rgba(56, 128, 219, 0.28) 100%)`,
        }}
      />

      {/* Background biru footer di bagian bawah dibuat tipis pas di area lengkungan sudut bawah saja */}
      <div className="absolute inset-x-0 bottom-0 h-8 sm:h-10 lg:h-12 bg-[#2568BA] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
        {/* Main Rounded CTA Container */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] bg-gradient-to-br from-[#F0F6FC] via-[#E4EFFA] to-[#CFE2F7] border border-blue-200/60 shadow-[0_14px_40px_-14px_rgba(37,104,186,0.16)] gpu-layer">
          {/* Ambient Glow Orb */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#56ADE2]/20 blur-[80px] pointer-events-none animate-dna-glow" />

          {/* Subtle white gradient fade at top edge */}
          <div className="absolute inset-x-0 top-0 h-24 sm:h-32 lg:h-40 bg-gradient-to-b from-white/90 via-white/35 to-transparent pointer-events-none z-10" />

          <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:min-h-[440px]">
            {/* Left/Top Column: Heading, Subtitle & Email Input Form */}
            <div className="lg:col-span-7 px-6 pt-8 pb-5 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center items-center text-center lg:items-start lg:text-left relative z-20">
              <h2 className="font-display text-[24px] sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.22] mb-3 sm:mb-4">
                {titleText}
              </h2>

              <p className="text-slate-600 text-[13.5px] sm:text-base lg:text-lg leading-relaxed max-w-md lg:max-w-lg mb-6 sm:mb-8 font-normal">
                {subtitleText}
              </p>

              {/* Form: Clean stacked input + full-width button on mobile, unified sleek pill on sm+ */}
              <form
                onSubmit={handleSubmit}
                className="relative flex flex-col sm:flex-row items-stretch sm:items-center sm:bg-white sm:rounded-full sm:p-2 sm:pl-6 sm:shadow-[0_8px_30px_rgba(40,90,165,0.08)] sm:border sm:border-blue-100/90 max-w-md sm:max-w-lg w-full transition-all sm:focus-within:ring-2 sm:focus-within:ring-[#2E68B4]/30 sm:focus-within:border-[#2E68B4] gap-2.5 sm:gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full bg-white sm:bg-transparent rounded-xl sm:rounded-none border border-blue-100/90 sm:border-0 px-4 py-3 sm:px-0 sm:pr-3 sm:py-0 shadow-sm sm:shadow-none text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#2E68B4]/25 sm:focus:ring-0"
                  required
                />
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white font-semibold px-5 sm:px-7 py-3.5 sm:py-3.5 text-sm shrink-0 transition-all duration-200 shadow-md sm:shadow-sm cursor-pointer active:scale-[0.98] hover:shadow-lg hover:shadow-blue-500/25 overflow-hidden"
                >
                  <span className="animate-shine-continuous" />
                  <span className="relative z-10 flex items-center gap-2">
                    {buttonText}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </button>
              </form>
            </div>

            {/* Right/Bottom Column: Official CTA Image anchored flush to bottom-right edge */}
            <div
              id="cta-image-container"
              className="lg:col-span-5 relative w-full lg:h-full lg:min-h-[440px] self-stretch flex items-end justify-end pointer-events-none overflow-hidden pt-2 lg:p-0"
            >
              <div className="relative lg:absolute right-0 bottom-0 w-[94%] sm:w-[78%] lg:w-full lg:max-w-[659px] flex items-end justify-end translate-x-1 z-10">
                <Image
                  src="/images/CTA-image.webp"
                  alt="Diagnova Platform on Laptop"
                  width={1200}
                  height={960}
                  className="w-full h-auto object-contain object-right-bottom select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
