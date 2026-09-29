"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function Hero({
  badge = "AI-Powered Laboratory Intelligence Platform",
  title = "From Results To\nIntelligence",
  subtitle = "Solusi Informasi Laboratorium Cerdas (LIS) yang menghubungkan mesin analyzer, staf medis, dokter, dan SIMRS. Mengubah data mentah laboratorium menjadi keputusan klinis yang cepat, akurat, dan terpercaya.",
  primaryCTA = { label: "Schedule Demo", href: "/request-demo" },
  secondaryCTA = { label: "Explore Modules", href: "/modules" },
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check for user's motion preferences
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(bannerRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        bannerRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-20 sm:pt-24 lg:pt-26 pb-4 sm:pb-6 bg-white overflow-hidden"
    >
      {/* Centered Promotional Banner Container (With Left & Right Whitespace) */}
      <div className="w-[calc(100%-32px)] sm:w-[calc(100%-48px)] lg:w-[calc(100%-64px)] xl:w-[94%] 2xl:w-[95%] max-w-[1800px] mx-auto mt-2 sm:mt-4 mb-4 sm:mb-6">
        <div
          ref={bannerRef}
          className="relative overflow-hidden rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#173B7E] min-h-[480px] sm:min-h-[520px] lg:min-h-[540px] xl:min-h-[580px] flex items-center shadow-2xl shadow-[#173B7E]/15 border border-slate-900/10 ring-1 ring-white/10"
        >
          {/* Background Promotional Visual: Laboratory Scientist & Research */}
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <Image
              src="/images/hero-laboratory.jpg"
              alt="Diagnova Laboratory Scientist & Intelligence Visual"
              fill
              priority
              className="object-cover object-right sm:object-[center_right] lg:object-right"
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 95vw, 1800px"
            />

            {/* Cinematic Gradient Overlays: Deep Diagnova Blue & Navy for Premium Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E234B] via-[#173B7E]/95 sm:via-[#173B7E]/85 to-transparent sm:to-[#173B7E]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E234B]/90 via-transparent to-transparent sm:hidden" />
            
            {/* Subtle Ambient Radial Highlight */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-nova-blue/20 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Foreground Promotional Content */}
          <div className="relative z-10 w-full py-12 sm:py-16 lg:py-20 px-6 sm:px-12 lg:px-16 xl:px-20">
            <div className="max-w-xl lg:max-w-2xl text-left space-y-5 sm:space-y-6">
              {/* Eyebrow Badge */}
              <div className="inline-flex">
                <SectionBadge
                  variant="dark"
                  className="border-white/30 text-white/95 backdrop-blur-md bg-white/10 shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-nova-light mr-1.5" />
                  <span>{badge}</span>
                </SectionBadge>
              </div>

              {/* Main Campaign Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-extrabold text-white tracking-tight leading-[1.1]">
                {title.split("\n").map((line, idx, arr) => (
                  <React.Fragment key={idx}>
                    {idx === arr.length - 1 ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-nova-light">
                        {line}
                      </span>
                    ) : (
                      <>
                        {line}
                        <br />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base lg:text-[17px] text-slate-100/90 leading-relaxed font-normal max-w-xl">
                {subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href={primaryCTA.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#173B7E] shadow-lg shadow-black/10 transition-all duration-200 hover:bg-slate-50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>{primaryCTA.label}</span>
                  <ArrowRight className="h-4 w-4 text-[#173B7E]" />
                </Link>

                <Link
                  href={secondaryCTA.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <span>{secondaryCTA.label}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
