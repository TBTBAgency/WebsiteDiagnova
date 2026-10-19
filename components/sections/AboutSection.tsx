"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionBadge } from "@/components/ui/SectionBadge";

const headlineWords = [
  "At",
  "Diagnova,",
  "We",
  "Transform",
  "Diagnostic",
  "Data",
  "Into",
  "Clinical",
  "Intelligence,",
  "Empowering",
  "Laboratories",
  "To",
  "Make",
  "Precise",
  "Medical",
  "Decisions.",
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Substantially extended scroll track for a slower, calmer reveal experience
      const start = windowHeight * 0.95;
      const end = -windowHeight * 0.05; // Finishes smoothly as section crosses upper viewport

      const current = rect.top;
      const rawProgress = (start - current) / (start - end);
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

      setScrollProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: DNA 3D Visual (Order 2 on mobile, Order 1 on desktop) */}
          <div className="flex justify-center lg:justify-start lg:col-span-5 order-2 lg:order-1">
            <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[440px] aspect-[4/5] flex items-center justify-center">
              <Image
                src="/images/dna-about.webp"
                alt="Diagnova DNA Intelligence Structure"
                width={500}
                height={600}
                priority
                className="w-full h-auto object-contain drop-shadow-sm select-none"
              />
            </div>
          </div>

          {/* Right Column: About Narrative (Order 1 on mobile, Order 2 on desktop) */}
          <div className="flex flex-col justify-center lg:col-span-7 order-1 lg:order-2">
            {/* Pill Badge */}
            <div className="mb-4 sm:mb-5">
              <SectionBadge variant="light">About</SectionBadge>
            </div>

            {/* Continuous Smooth Scroll-Driven Text Reveal Headline */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold tracking-tight leading-[1.3] sm:leading-[1.35] mb-6 sm:mb-8 flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]">
              {headlineWords.map((word, index) => {
                const totalWords = headlineWords.length;
                const step = 1 / totalWords;
                const wordStart = index * step * 0.9;
                const windowSize = step * 2.8; // Extended soft overlapping window for a much slower, gradual fade

                const raw = (scrollProgress - wordStart) / windowSize;
                const p = Math.min(Math.max(raw, 0), 1);

                // Smooth RGB interpolation from Slate-300 (203, 213, 225) to Diagnova Blue (52, 93, 171)
                const r = Math.round(203 + (52 - 203) * p);
                const g = Math.round(213 + (93 - 213) * p);
                const b = Math.round(225 + (171 - 225) * p);
                const opacity = (0.35 + 0.65 * p).toFixed(2);

                return (
                  <span
                    key={index}
                    style={{
                      color: `rgb(${r}, ${g}, ${b})`,
                      opacity: Number(opacity),
                      transition: "color 0.2s ease-out, opacity 0.2s ease-out",
                    }}
                    className="inline-block"
                  >
                    {word}
                  </span>
                );
              })}
            </h2>

            {/* Subtitle / Paragraph Description */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-normal leading-relaxed max-w-2xl">
              More Than A Traditional LIS, Diagnova Is An Intelligent Ecosystem
              Connecting People, Instruments, And Workflows. We Help Modern
              Laboratories Move Beyond Managing Data To Delivering Clear,
              Actionable Insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
