"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PartnerItem {
  id: string;
  name: string;
  icon: "crest" | "hospital" | "network" | "lab" | "dna" | "shield";
}

const partners: PartnerItem[] = [
  { id: "1", name: "Department of\nNational Health", icon: "crest" },
  { id: "2", name: "Central General\nHospital Network", icon: "hospital" },
  { id: "3", name: "National Clinical\nDiagnostic Labs", icon: "lab" },
  { id: "4", name: "SATUSEHAT\nHealth Ecosystem", icon: "network" },
  { id: "5", name: "Bio-Intelligence\nResearch Center", icon: "dna" },
  { id: "6", name: "Metropolitan\nMedical Center", icon: "hospital" },
  { id: "7", name: "National Clinical\nAccreditation Board", icon: "shield" },
  { id: "8", name: "Regional Referral\nLaboratory", icon: "lab" },
];

function PartnerIcon({ icon }: { icon: PartnerItem["icon"] }) {
  switch (icon) {
    case "crest":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <path
            d="M12 2L4 5V11C4 16.5 7.5 21.2 12 22C16.5 21.2 20 11V5L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 7V17M8 12H16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "hospital":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <path
            d="M3 21H21M5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21M9 8H15M9 12H15M9 16H15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "lab":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <path
            d="M9 3H15M10 3V8L4.5 18.5C3.8 19.8 4.7 21 6 21H18C19.3 21 20.2 19.8 19.5 18.5L14 8V3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 15H17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "network":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.5 6.5L10 10M17.5 6.5L14 10M6.5 17.5L10 14M17.5 17.5L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "dna":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <path
            d="M2 15C5.5 15 8.5 8 12 8C15.5 8 18.5 15 22 15M2 9C5.5 9 8.5 16 12 16C15.5 16 18.5 9 22 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M6 10.5V13.5M10 8.5V15.5M14 8.5V15.5M18 10.5V13.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-slate-400 group-hover:text-diagnova-blue transition-colors duration-200"
        >
          <path
            d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function TrustedByBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || !trackRef.current) {
        return;
      }

      // Continuous, seamless horizontal marquee animation
      // Track has 2 identical sets of items; moving by -50% creates a seamless loop
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      tweenRef.current.resume();
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-white py-6 sm:py-8 lg:py-10 border-b border-slate-100 overflow-hidden select-none"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
          DIPERCAYA OLEH
        </p>
      </div>

      {/* Marquee Wrapper with Edge Fade Masking */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Fade Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 lg:w-36 bg-gradient-to-r from-white via-white/80 to-transparent" />

        {/* Right Fade Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 lg:w-36 bg-gradient-to-l from-white via-white/80 to-transparent" />

        {/* Continuous Horizontal Track (2 duplicated sets for seamless loop) */}
        <div
          ref={trackRef}
          className="flex w-max items-center whitespace-nowrap will-change-transform"
        >
          {/* Set 1 */}
          <div className="flex items-center gap-10 sm:gap-14 lg:gap-20 pr-10 sm:pr-14 lg:pr-20">
            {partners.map((item, idx) => (
              <div
                key={`set1-${item.id}-${idx}`}
                className="group flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-default shrink-0"
              >
                <div className="flex h-7 w-7 items-center justify-center shrink-0">
                  <PartnerIcon icon={item.icon} />
                </div>
                <span className="text-left text-[11px] sm:text-xs font-semibold tracking-tight text-slate-600 group-hover:text-diagnova-navy whitespace-pre-line leading-snug transition-colors duration-200">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Set 2 (Duplicate for seamless infinite wrap) */}
          <div className="flex items-center gap-10 sm:gap-14 lg:gap-20 pr-10 sm:pr-14 lg:pr-20" aria-hidden="true">
            {partners.map((item, idx) => (
              <div
                key={`set2-${item.id}-${idx}`}
                className="group flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-default shrink-0"
              >
                <div className="flex h-7 w-7 items-center justify-center shrink-0">
                  <PartnerIcon icon={item.icon} />
                </div>
                <span className="text-left text-[11px] sm:text-xs font-semibold tracking-tight text-slate-600 group-hover:text-diagnova-navy whitespace-pre-line leading-snug transition-colors duration-200">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
