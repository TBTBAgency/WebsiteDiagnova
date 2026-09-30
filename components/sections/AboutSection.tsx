"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

      // Extended scroll zone for a gradual and cinematic reveal
      const start = windowHeight * 0.92;
      const end = windowHeight * 0.18;

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
      className="relative w-full bg-white py-20 sm:py-24 lg:py-32 overflow-hidden border-b border-slate-100"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: DNA 3D Visual */}
          <div className="flex justify-center lg:justify-start lg:col-span-5">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] aspect-[4/5] flex items-center justify-center">
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

          {/* Right Column: About Narrative with Gradual Continuous Scroll Reveal */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* Pill Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700">
                About
              </span>
            </div>

            {/* Continuous Smooth Scroll-Driven Text Reveal Headline */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold tracking-tight leading-[1.4] sm:leading-[1.45] mb-8 flex flex-wrap gap-x-[0.28em] gap-y-[0.1em]">
              {headlineWords.map((word, index) => {
                const totalWords = headlineWords.length;
                const step = 1 / totalWords;
                const wordStart = index * step * 0.85; // Slightly condensed timeline so it finishes gracefully
                const windowSize = step * 2.2; // Soft overlapping window for gradual fade

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
                      transition: "color 0.12s ease-out, opacity 0.12s ease-out",
                    }}
                    className="inline-block"
                  >
                    {word}
                  </span>
                );
              })}
            </h2>

            {/* Subtitle / Paragraph Description */}
            <p className="text-sm sm:text-base text-slate-500 font-normal leading-[1.8] sm:leading-[1.85] max-w-2xl">
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
