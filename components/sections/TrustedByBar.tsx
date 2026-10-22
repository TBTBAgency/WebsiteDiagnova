"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

// Repeat trust logos to create an infinite, seamless scrolling marquee loop
const logos = Array.from({ length: 8 });

export function TrustedByBar() {
  const { language } = useLanguage();
  const marqueeRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (marqueeRef.current && typeof marqueeRef.current.getAnimations === "function") {
      const anims = marqueeRef.current.getAnimations();
      anims.forEach((anim) => {
        anim.playbackRate = 0.25; // Bergerak pelan (25% kecepatan) saat kena kursor
      });
    }
  };

  const handleMouseLeave = () => {
    if (marqueeRef.current && typeof marqueeRef.current.getAnimations === "function") {
      const anims = marqueeRef.current.getAnimations();
      anims.forEach((anim) => {
        anim.playbackRate = 1; // Kembali ke kecepatan normal saat kursor keluar
      });
    }
  };

  return (
    <section className="relative w-full bg-white py-10 sm:py-12 lg:py-14 overflow-hidden">
      <style>{`
        @keyframes marqueeTrust {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-trust {
          display: flex;
          width: max-content;
          animation: marqueeTrust 28s linear infinite;
        }
      `}</style>

      {/* Centered Heading Label */}
      <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 text-center mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-400">
          {language === "ID" ? "DIPERCAYA OLEH" : "TRUSTED BY"}
        </p>
      </div>

      {/* Marquee Container with Left & Right Soft Fade Masks (Contained Max Width) */}
      <div
        className="relative mx-auto max-w-5xl sm:max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Fade Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Right Fade Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-28 md:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Scrolling Track with duplicated items for infinite seamless scroll */}
        <div
          ref={marqueeRef}
          className="animate-marquee-trust flex items-center gap-10 sm:gap-14 md:gap-18"
        >
          {[...logos, ...logos].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-center shrink-0 grayscale opacity-85 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src="/images/trust-logo.svg"
                alt="Partner Trust Logo"
                width={220}
                height={64}
                className="h-11 sm:h-12 md:h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
