"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Zap, Network, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface InfrastructureCard {
  id: string;
  title: string;
  description: string;
  iconName: "automation" | "integration" | "ai";
}

const infrastructureCardsID: InfrastructureCard[] = [
  {
    id: "automation",
    title: "Otomatisasi 100%",
    description:
      "Identifikasi kode batang yang ketat dan koneksi alat dua arah memangkas Turnaround Time (TAT) hingga 70% dengan mengeliminasi entri data manual.",
    iconName: "automation",
  },
  {
    id: "integration",
    title: "Integrasi Tanpa Hambatan",
    description:
      "Terhubung secara asli dengan SIMRS, RME, dan siap SATUSEHAT. Kompatibel secara universal dengan lebih dari 500 instrumen medis.",
    iconName: "integration",
  },
  {
    id: "nova-ai",
    title: "Asisten Nova AI",
    description:
      "Nova AI mendeteksi pola, memberikan peringatan dini, dan menyederhanakan angka diagnostik kompleks. Keputusan medis tetap 100% di tangan dokter.",
    iconName: "ai",
  },
];

const infrastructureCardsEN: InfrastructureCard[] = [
  {
    id: "automation",
    title: "100% Automation",
    description:
      "Strict barcode identification and direct analyzer interfacing cut Turnaround Time (TAT) by up to 70% by eliminating manual data entry.",
    iconName: "automation",
  },
  {
    id: "integration",
    title: "Seamless Integration",
    description:
      "Natively bridges with HIS, EMR, and is SATUSEHAT ready. Universally compatible with over 500 medical instruments.",
    iconName: "integration",
  },
  {
    id: "nova-ai",
    title: "Nova AI Assistant",
    description:
      "Nova AI detects patterns, provides early warnings, and simplifies complex numbers. Treatment decisions remain 100% with the doctor.",
    iconName: "ai",
  },
];

function getCardIcon(iconName: InfrastructureCard["iconName"], className = "h-5 w-5") {
  switch (iconName) {
    case "automation":
      return <Zap className={className} />;
    case "integration":
      return <Network className={className} />;
    case "ai":
      return <Sparkles className={className} />;
  }
}

export function InfrastructureSection() {
  const { language } = useLanguage();
  const infrastructureCards =
    language === "ID" ? infrastructureCardsID : infrastructureCardsEN;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lineFillFraction, setLineFillFraction] = useState<number>(0.1);

  // Vertical positions of dots and total height of the 3-card container
  const [containerHeight, setContainerHeight] = useState<number>(450);
  const [dotTops, setDotTops] = useState<number[]>([36, 196, 356]);

  // Recalculate exact height and vertical centers of each card's title
  const updateDotPositions = useCallback(() => {
    if (!cardsContainerRef.current) return;
    const containerRect = cardsContainerRef.current.getBoundingClientRect();
    const newHeight = Math.round(containerRect.height);
    setContainerHeight(newHeight);

    const newTops = cardRefs.current.map((cardEl) => {
      if (!cardEl) return 36;
      const titleRow = cardEl.querySelector(".card-title-row");
      if (titleRow) {
        const tRect = titleRow.getBoundingClientRect();
        return Math.round(tRect.top - containerRect.top + tRect.height / 2);
      }
      const cardRect = cardEl.getBoundingClientRect();
      return Math.round(cardRect.top - containerRect.top + 34);
    });

    if (newTops.length === 3) {
      setDotTops(newTops);
    }
  }, []);

  useEffect(() => {
    updateDotPositions();

    const resizeObserver = new ResizeObserver(() => {
      updateDotPositions();
    });

    if (cardsContainerRef.current) {
      resizeObserver.observe(cardsContainerRef.current);
    }

    window.addEventListener("resize", updateDotPositions);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDotPositions);
    };
  }, [updateDotPositions]);

  // Sticky scroll animation tracking with requestAnimationFrame for 60fps/120fps fluid motion
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionHeight = containerRef.current.offsetHeight;
          const totalScrollable = sectionHeight - windowHeight;

          if (totalScrollable <= 0) {
            ticking = false;
            return;
          }

          // Progress ranges from 0 to 1 as user scrolls through the 300vh track
          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalScrollable;
          const progress = Math.max(0, Math.min(1, rawProgress));

          // Dot fraction coordinates along the full-height track
          const cH = containerHeight || 450;
          const dot0Frac = (dotTops[0] || 36) / cH;
          const dot1Frac = (dotTops[1] || 196) / cH;
          const dot2Frac = (dotTops[2] || 356) / cH;

          // Progressively fill the line track from dot 0 to dot 1, dot 2, and down to 100% (full track height)
          let fill: number;
          if (progress <= 0.33) {
            const seg = progress / 0.33;
            fill = dot0Frac + seg * (dot1Frac - dot0Frac);
          } else if (progress <= 0.67) {
            const seg = (progress - 0.33) / 0.34;
            fill = dot1Frac + seg * (dot2Frac - dot1Frac);
          } else {
            // Smoothly complete all the way down to 1.0 (100% full track)
            const seg = Math.min(1, (progress - 0.67) / 0.23);
            fill = dot2Frac + seg * (1.0 - dot2Frac);
          }

          const clampedFill = Math.max(dot0Frac, Math.min(1.0, fill));
          setLineFillFraction(clampedFill);

          // Evenly partitioned active step switching across the 3 scroll segments
          if (progress >= 0.67) {
            setActiveIndex(2);
          } else if (progress >= 0.33) {
            setActiveIndex(1);
          } else {
            setActiveIndex(0);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerHeight, dotTops]);

  // Smooth scroll helper when clicking on a card or timeline dot
  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerTop = window.scrollY + rect.top;
    const sectionHeight = containerRef.current.offsetHeight;
    const totalScrollable = sectionHeight - window.innerHeight;

    // Step positions: 0.16 -> Step 1, 0.50 -> Step 2, 0.92 -> Step 3 (full line)
    const targetProgress = index === 0 ? 0.16 : index === 1 ? 0.5 : 0.92;
    const targetY = containerTop + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#F9F9F9] select-none"
      style={{ height: "300vh" }}
      id="infrastructure"
      aria-label="Infrastructure Section"
    >
      {/* ─── STICKY VIEWPORT: Pinned in viewport while user scrolls ─── */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 w-full pt-16 sm:pt-20 lg:py-12 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-14 items-center">
            {/* ═══ LEFT COLUMN: Badge & Headline ═══ */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="mb-2.5 sm:mb-4 lg:mb-5">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-slate-700">
                  {language === "ID" ? "Infrastruktur" : "Infrastructure"}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] font-bold leading-[1.2] sm:leading-[1.25] tracking-tight text-[#2A5298]">
                {language === "ID" ? (
                  <>
                    Infrastruktur Cerdas untuk
                    <br className="hidden sm:inline" />{" "}
                    Operasional Tanpa Hambatan
                  </>
                ) : (
                  <>
                    Intelligent Infrastructure for
                    <br className="hidden sm:inline" />{" "}
                    Seamless Operations
                  </>
                )}
              </h2>
            </div>

            {/* ═══ RIGHT COLUMN: Vertical Timeline + 3 Cards ═══ */}
            <div className="lg:col-span-7 relative flex items-stretch gap-5 sm:gap-7 lg:gap-8">
              {/* Vertical Timeline Track: Spans the FULL HEIGHT of the 3 cards container */}
              <div className="relative w-6 sm:w-8 flex justify-center flex-shrink-0 self-stretch">
                {/* Inactive Base Track: Extends from top-0 to bottom-0 along the 3 cards */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-slate-200/90 rounded-full overflow-hidden">
                  {/* Active Gradient Fill Line: Fills down along the full length of the 3 cards */}
                  <div
                    className="w-full h-full bg-gradient-to-b from-[#2A66CC] to-[#4EA1F0] rounded-full will-change-transform"
                    style={{
                      transform: `translateY(-${(1 - lineFillFraction) * 100}%)`,
                      transition: "transform 0.16s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  />
                </div>

                {/* 3 Interactive Timeline Dots aligned to each card's title */}
                {infrastructureCards.map((card, idx) => {
                  const isActive = activeIndex === idx;
                  const isPassed = activeIndex > idx;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => scrollToStep(idx)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none cursor-pointer group"
                      style={{
                        left: "50%",
                        top: `${dotTops[idx]}px`,
                      }}
                      aria-label={`Jump to ${card.title}`}
                    >
                      {/* Outer Glowing Halo on Active Dot */}
                      <span
                        className={`absolute inset-0 rounded-full transition-all duration-500 ease-in-out pointer-events-none ${
                          isActive
                            ? "ring-4 ring-[#93C5FD]/60 shadow-[0_0_14px_rgba(42,102,204,0.5)] scale-125"
                            : "ring-0 shadow-none scale-100"
                        }`}
                      />

                      {/* Main Dot Body */}
                      <span
                        className={`relative rounded-full transition-all duration-500 ease-in-out ${
                          isActive
                            ? "h-4 w-4 bg-[#2A66CC] z-20"
                            : isPassed
                            ? "h-3 w-3 bg-[#2A66CC] z-10"
                            : "h-2.5 w-2.5 bg-[#CBD5E1] z-10 group-hover:bg-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* 3 Stacked Cards */}
              <div
                ref={cardsContainerRef}
                className="flex-1 flex flex-col gap-3 sm:gap-4 lg:gap-6"
              >
                {infrastructureCards.map((card, idx) => {
                  const isActive = activeIndex === idx;

                  return (
                    <div
                      key={card.id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      onClick={() => scrollToStep(idx)}
                      className={`relative cursor-pointer transition-all duration-500 ease-in-out select-text ${
                        isActive
                          ? "drop-shadow-[0_16px_28px_rgba(46,104,180,0.22)]"
                          : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                      }`}
                    >
                      <div
                        className="relative overflow-hidden rounded-tl-[24px] sm:rounded-tl-[36px] rounded-br-[24px] sm:rounded-br-[36px]"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))",
                        }}
                      >
                        {/* Layer 1: Inactive Base Card Background */}
                        <div className="absolute inset-0 bg-[#F5F7FA] border border-slate-200/90 shadow-sm" />

                        {/* Layer 2: Active Card Blue Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-[#275EA8] via-[#2E68B4] to-[#1C478B] transition-opacity duration-500 ease-in-out pointer-events-none ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {/* Subtle ambient light reflections matching Comparison right card */}
                          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#56ADE2]/25 blur-[50px]" />
                          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#1C478B]/40 blur-[50px]" />
                        </div>

                        {/* Layer 3: Unified Single Text Content Layer with Icon */}
                        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                          <div className="card-title-row flex items-center gap-3 sm:gap-3.5 mb-2 sm:mb-3 lg:mb-4">
                            <div
                              className={`flex items-center justify-center rounded-xl p-2 sm:p-2.5 transition-all duration-500 ease-in-out shrink-0 ${
                                isActive
                                  ? "bg-white/20 text-white shadow-inner"
                                  : "bg-[#275EA8]/10 text-[#275EA8]"
                              }`}
                            >
                              {getCardIcon(card.iconName, "h-4 w-4 sm:h-4.5 sm:w-4.5")}
                            </div>
                            <h3
                              className={`font-semibold text-sm sm:text-base lg:text-[17px] leading-snug tracking-tight transition-colors duration-500 ease-in-out ${
                                isActive ? "text-white" : "text-slate-700"
                              }`}
                            >
                              {card.title}
                            </h3>
                          </div>
                          <p
                            className={`text-xs sm:text-sm leading-relaxed max-w-xl transition-colors duration-500 ease-in-out ${
                              isActive ? "text-white/85" : "text-slate-500"
                            }`}
                          >
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
