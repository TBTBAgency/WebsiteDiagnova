"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function CTABanner() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const router = useRouter();

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
      className="relative w-full bg-[#F9F9F9] pt-12 sm:pt-16 lg:pt-20 pb-0 overflow-hidden"
    >
      {/* Gradient fade background: #F9F9F9 at the top seamlessly blending to #3880DB at the bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #F9F9F9 0%, #F9F9F9 20%, rgba(249, 249, 249, 0.85) 40%, rgba(56, 128, 219, 0.12) 70%, rgba(56, 128, 219, 0.28) 100%)",
        }}
      />

      {/* Background biru footer di bagian bawah dibuat tipis pas di area lengkungan sudut bawah saja */}
      <div className="absolute inset-x-0 bottom-0 h-8 sm:h-10 lg:h-12 bg-[#2568BA] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
        {/* Main Rounded CTA Container (Ukuran Asli max-w-7xl, tanpa inline stroke) */}
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] bg-gradient-to-r from-[#EBF3FB] via-[#E4EFF9] to-[#D5E6F7] shadow-[0_10px_40px_-15px_rgba(40,90,165,0.07)]">
          {/* Subtle white gradient fade at top edge */}
          <div className="absolute inset-x-0 top-0 h-24 sm:h-32 lg:h-40 bg-gradient-to-b from-white/90 via-white/35 to-transparent pointer-events-none z-10" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center min-h-[400px] lg:min-h-[440px]">
            {/* Left Column: Heading, Subtitle & Email Input Form (Lapisan Depan z-20) */}
            <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center relative z-20">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-[#275EA8] tracking-tight leading-[1.2] sm:leading-[1.25] mb-3 sm:mb-5">
                {language === "ID" ? (
                  <>
                    Transformasi Laboratorium Anda <br className="hidden sm:inline" />
                    Bersama Diagnova
                  </>
                ) : (
                  <>
                    Transform Your Laboratory <br className="hidden sm:inline" />
                    with Diagnova
                  </>
                )}
              </h2>

              <p className="text-slate-500 text-xs sm:text-base lg:text-lg leading-relaxed max-w-lg mb-6 sm:mb-10">
                {language === "ID"
                  ? "Hadirkan keandalan tinggi, kecepatan analisis, dan presisi klinis bagi institusi kesehatan Anda hari ini."
                  : "Bring high reliability, speed, and precision to your healthcare institution today."}
              </p>

              {/* White Pill Input Container (Adaptive: stacked card on tiny screens, sleek pill on sm+) */}
              <form
                onSubmit={handleSubmit}
                className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl sm:rounded-full p-2 sm:p-2 pl-4 sm:pl-7 shadow-[0_8px_30px_rgba(40,90,165,0.08)] border border-blue-100/90 max-w-lg w-full transition-all focus-within:ring-2 focus-within:ring-[#2E68B4]/20 focus-within:border-[#2E68B4] gap-2.5 sm:gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "ID"
                      ? "Masukkan alamat email Anda"
                      : "Enter your email address"
                  }
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none pr-3 py-1.5 sm:py-0"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2E68B4] hover:bg-[#235899] text-white font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm shrink-0 transition-colors shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <span>{language === "ID" ? "Minta Demo" : "Request Demo"}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Column: Official CTA Image (Responsive & Flexible across mobile, tablet, desktop) */}
            <div
              id="cta-image-container"
              className="lg:col-span-5 relative w-full h-[220px] sm:h-[300px] lg:h-full min-h-[220px] sm:min-h-[300px] lg:min-h-[440px] self-stretch flex items-end justify-center lg:justify-end pointer-events-none overflow-hidden"
            >
              <div className="relative lg:absolute right-0 bottom-0 w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[659px] flex items-end justify-center lg:justify-end translate-x-0 sm:translate-x-0.5 lg:translate-x-1 z-10 px-4 sm:px-0">
                <Image
                  src="/images/CTA-image.webp"
                  alt="Diagnova Platform on Laptop"
                  width={1200}
                  height={960}
                  className="w-full h-auto max-h-[320px] lg:max-h-none object-contain object-bottom select-none pointer-events-none"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
