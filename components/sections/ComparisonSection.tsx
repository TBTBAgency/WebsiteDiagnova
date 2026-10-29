"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import {
  comparisonContentID,
  comparisonContentEN,
} from "@/content/comparison";

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  const content = language === "ID" ? comparisonContentID : comparisonContentEN;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="relative w-full overflow-hidden bg-white pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 xl:pb-28 flex flex-col justify-center content-auto"
    >
      <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 w-full">
        {/* Section Header */}
        <div
          className={`mb-10 sm:mb-12 lg:mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-4 sm:mb-5">
            <SectionBadge variant="blue">
              {content.sectionBadge}
            </SectionBadge>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
            {content.sectionTitle}
          </h2>
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* 2-Column Comparison Layout with Center VS Emblem */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-stretch">
            {/* Left Card: Conventional Drawbacks (Neutral) */}
            <div
              className={`relative flex flex-col justify-between transition-all duration-700 ease-out drop-shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] gpu-layer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
            >
              <div
                className="relative flex flex-col justify-between h-full rounded-tl-[28px] sm:rounded-tl-[36px] rounded-br-[28px] sm:rounded-br-[36px] bg-[#F5F7FA] border border-slate-200/90 p-6 sm:p-7 lg:p-8 overflow-hidden transition-colors hover:border-slate-300"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 44px 100%, 0 calc(100% - 44px))",
                }}
              >
                <div>
                  {/* Badge */}
                  <div className="mb-4 sm:mb-5">
                    <span className="inline-flex items-center rounded-full bg-[#EBF3FB] border border-[#D5E5F7] px-4 py-1.5 text-xs sm:text-sm font-medium text-[#2A5EAA]">
                      {content.conventionalBadge}
                    </span>
                  </div>

                  {/* Staggered Text Reveal List */}
                  <div className="flex flex-col">
                    {content.items.map((item, index) => (
                      <div
                        key={item.number}
                        className={`flex items-start gap-3.5 sm:gap-4 transition-all duration-500 ease-out ${
                          index !== content.items.length - 1
                            ? "border-b border-slate-200/90 pb-3.5 sm:pb-4 mb-3.5 sm:mb-4"
                            : "pb-0 mb-0"
                        } ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isVisible
                            ? `${200 + index * 120}ms`
                            : "0ms",
                        }}
                      >
                        <span className="text-slate-400 font-medium text-xs sm:text-sm w-5 sm:w-6 shrink-0 select-none pt-0.5">
                          {item.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-700 text-sm sm:text-base leading-snug tracking-tight mb-1">
                            {item.conventional.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            {item.conventional.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center VS Badge (Mobile) */}
            <div className="flex lg:hidden items-center justify-center -my-3 z-10 relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border-2 border-blue-100 animate-pulse-glow">
                <span className="font-display text-[11px] font-black tracking-wider text-[#1A4B8C]">
                  VS
                </span>
              </div>
            </div>

            {/* Right Card: Diagnova Advantages (Vibrant Diagnova Blue) */}
            <div
              className={`relative flex flex-col justify-between transition-all duration-700 ease-out drop-shadow-[0_20px_32px_rgba(46,104,180,0.22)] hover:-translate-y-1 hover:drop-shadow-[0_25px_40px_rgba(46,104,180,0.35)] gpu-layer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
            >
              <div
                className="relative flex flex-col justify-between h-full rounded-tl-[28px] sm:rounded-tl-[36px] rounded-br-[28px] sm:rounded-br-[36px] bg-gradient-to-br from-[#275EA8] via-[#2E68B4] to-[#1C478B] p-6 sm:p-7 lg:p-8 text-white overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 44px 100%, 0 calc(100% - 44px))",
                }}
              >
                {/* Subtle ambient light reflections with organic pulse */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#56ADE2]/25 blur-[60px] animate-dna-glow" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#1C478B]/40 blur-[60px]" />

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="mb-4 sm:mb-5">
                    <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-white/25 transition-colors">
                      {content.diagnovaBadge}
                    </span>
                  </div>

                  {/* Staggered Text Reveal List */}
                  <div className="flex flex-col">
                    {content.items.map((item, index) => (
                      <div
                        key={item.number}
                        className={`flex items-start gap-3.5 sm:gap-4 transition-all duration-500 ease-out ${
                          index !== content.items.length - 1
                            ? "border-b border-white/15 pb-3.5 sm:pb-4 mb-3.5 sm:mb-4"
                            : "pb-0 mb-0"
                        } ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-3"
                        }`}
                        style={{
                          transitionDelay: isVisible
                            ? `${200 + index * 120}ms`
                            : "0ms",
                        }}
                      >
                        <span className="text-white/60 font-medium text-xs sm:text-sm w-5 sm:w-6 shrink-0 select-none pt-0.5">
                          {item.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base leading-snug tracking-tight mb-1">
                            {item.diagnova.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                            {item.diagnova.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center VS Badge (Desktop) with Pulse Glow */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center pointer-events-none transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ transitionDelay: isVisible ? "350ms" : "0ms" }}
          >
            <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(14,35,75,0.18)] border-[3px] border-white p-1 animate-pulse-glow">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#EEF4FB] to-[#D9EAF8] border border-blue-200/60 shadow-inner">
                <span className="font-display text-xs xl:text-sm font-black tracking-wider text-[#1A4B8C]">
                  VS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
