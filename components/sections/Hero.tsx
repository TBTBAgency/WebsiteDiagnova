"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  image: string;
  alt: string;
  title: React.ReactNode;
  objectPosition?: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/hero-bg-1.webp",
    alt: "Diagnova Laboratory Intelligence Specialist",
    title: (
      <>
        From Raw Lab Results To <br className="hidden sm:inline" />
        Clinical Intelligence
      </>
    ),
    objectPosition: "object-bottom",
  },
  {
    id: 2,
    image: "/images/hero-bg-2.webp",
    alt: "Diagnova Seamless Interoperability & Automation",
    title: (
      <>
        Connected Laboratory, <br className="hidden sm:inline" />
        Zero Data Silos
      </>
    ),
    objectPosition: "object-center",
  },
  {
    id: 3,
    image: "/images/hero-bg-3.webp",
    alt: "Nova AI Clinical Decision Support",
    title: (
      <>
        Precision AI Diagnostics, <br className="hidden sm:inline" />
        Empowered Clinicians
      </>
    ),
    objectPosition: "object-center",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setPrevSlide(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setPrevSlide(currentSlide);
    setCurrentSlide(index);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, currentSlide]);

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[580px] pt-[92px] pb-3 sm:pb-4 px-3 sm:px-5 lg:px-6 bg-white flex flex-col"
      aria-label="Diagnova Hero Highlights"
    >
      <style>{`
        @keyframes heroBarProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      {/* Hero Card Container with Rounded Corners - Fits 100% in viewport */}
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden flex items-center bg-[#1A4B8C]">
        {/* Background Images with True Direct Cross-Dissolve (Zero White Flash) */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrevious = index === prevSlide;

          return (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-in-out",
                isActive
                  ? "opacity-100 z-[2]"
                  : isPrevious
                  ? "opacity-100 z-[1]"
                  : "opacity-0 z-0 duration-0"
              )}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
                className={cn(
                  "object-cover",
                  slide.objectPosition || "object-center"
                )}
                sizes="100vw"
              />
            </div>
          );
        })}

        {/* Static Full-Cover Thin White Fade Overlay */}
        <div className="absolute inset-0 bg-white/15 pointer-events-none z-[3]" />

        {/* Soft Contrast Gradient Overlay on Left Side */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A4B8C]/95 via-[#225FA8]/75 to-transparent sm:w-4/5 lg:w-3/4 pointer-events-none z-[4]" />

        {/* Left Hero Content: Static Layout with Only Headline Transitioning - Vertically Centered */}
        <div className="relative z-10 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-6 sm:px-12 lg:px-16 xl:px-20 my-auto text-white flex flex-col justify-center">
          {/* Static Badge */}
          <div>
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-medium text-white border border-white/30 shadow-sm mb-4 sm:mb-6">
              AI-Powered Laboratory Intelligence Platform
            </div>
          </div>

          {/* Locked Grid Container for Headline - 0 Layout Shift */}
          <div className="grid grid-cols-1 grid-rows-1 mb-4 sm:mb-5 min-h-[96px] sm:min-h-[120px] lg:min-h-[145px] xl:min-h-[165px] items-center">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <h1
                  key={slide.id}
                  className={cn(
                    "col-start-1 row-start-1 text-4xl sm:text-5xl lg:text-[52px] xl:text-[62px] font-bold text-white tracking-tight leading-[1.1] font-display transition-all duration-700 ease-out",
                    isActive
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                      : "opacity-0 translate-y-3 scale-[0.99] pointer-events-none"
                  )}
                >
                  {slide.title}
                </h1>
              );
            })}
          </div>

          {/* Static Subtitle - Constant Position (Justified) */}
          <p className="text-sm sm:text-base lg:text-lg text-white/90 font-light leading-relaxed max-w-xl mb-6 sm:mb-8 text-justify">
            Sistem Informasi Laboratorium Generasi Baru Yang Menghubungkan Mesin Medis Secara Otonom Dengan Para Klinisi. Mengubah Data Diagnostik Yang Kompleks Menjadi Keputusan Medis Yang Cepat, Akurat, Dan Transparan.
          </p>

          {/* Static CTA Buttons - Always Schedule Demo & Explore Modules */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 font-semibold px-8 py-3.5 text-sm sm:text-base hover:bg-slate-50 transition-all duration-200 shadow-xl active:scale-[0.98]"
            >
              Schedule Demo
            </Link>

            <Link
              href="/modules"
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 text-sm sm:text-base backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
            >
              Explore Modules
            </Link>
          </div>

          {/* Thin Sleek Progress Bars under Text (GPU-accelerated CSS Keyframe Animation) */}
          <div className="flex items-center gap-2.5 pt-8 sm:pt-10 max-w-[260px] sm:max-w-xs">
            {slides.map((_, index) => {
              const isActive = index === currentSlide;
              const isPassed = index < currentSlide;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Pindah ke slide ${index + 1}`}
                  className="group relative flex-1 py-2 cursor-pointer focus:outline-none"
                >
                  <div className="h-[2px] w-full rounded-full bg-white/25 overflow-hidden transition-colors group-hover:bg-white/45">
                    <div
                      key={`progress-${currentSlide}-${index}`}
                      className="h-full bg-white rounded-full"
                      style={{
                        animation: isActive
                          ? `heroBarProgress ${AUTOPLAY_INTERVAL}ms linear forwards`
                          : "none",
                        width: isPassed ? "100%" : "0%",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
