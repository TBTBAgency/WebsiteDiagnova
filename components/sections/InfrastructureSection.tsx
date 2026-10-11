"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface InfrastructureCard {
  id: string;
  title: string;
  description: string;
}

const infrastructureCards: InfrastructureCard[] = [
  {
    id: "automation",
    title: "100% Automation",
    description:
      "Strict Barcode Identification And Direct Analyzer Interfacing Cut Turnaround Time (TAT) By Up To 70% By Eliminating Manual Data Entry.",
  },
  {
    id: "integration",
    title: "Seamless Integration",
    description:
      "Natively Bridges With HIS, EMR, And Is SATUSEHATready. Universally Compatible With Over 500 Medical Instruments.",
  },
  {
    id: "nova-ai",
    title: "Nova AI Assistant",
    description:
      "Nova AI Detects Patterns, Provides Early Warnings, And Simplifies Complex Numbers. Treatment Decisions Remain 100% With The Doctor.",
  },
];

export function InfrastructureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
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
      const cardRect = cardEl.getBoundingClientRect();
      // Target vertical center of card's title (approx 34px from card top)
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

          setScrollProgress(progress);

          // Dot fraction coordinates along the full-height track
          const cH = containerHeight || 450;
          const dot0Frac = (dotTops[0] || 36) / cH;
          const dot1Frac = (dotTops[1] || 196) / cH;
          const dot2Frac = (dotTops[2] || 356) / cH;

          // Map scroll progress to smooth line fill fraction (0 to 1):
          // - 0.00 to 0.14: Fill starts at Dot 0 (Step 1 active)
          // - 0.14 to 0.50: Line fills down from Dot 0 to Dot 1
          // - 0.50 to 0.86: Line fills down from Dot 1 to Dot 2
          // - 0.86 to 1.00: Line finishes spanning the full bottom of Card 3
          let fill = dot0Frac;
          if (progress <= 0.14) {
            fill = dot0Frac;
          } else if (progress <= 0.5) {
            fill = dot0Frac + ((progress - 0.14) / 0.36) * (dot1Frac - dot0Frac);
          } else if (progress <= 0.86) {
            fill = dot1Frac + ((progress - 0.5) / 0.36) * (dot2Frac - dot1Frac);
          } else {
            fill = dot2Frac + ((progress - 0.86) / 0.14) * (1 - dot2Frac);
          }

          const clampedFill = Math.max(0, Math.min(1, fill));
          setLineFillFraction(clampedFill);

          // Synchronized active step switching based on line position:
          const mid01 = (dot0Frac + dot1Frac) / 2;
          const mid12 = (dot1Frac + dot2Frac) / 2;

          if (clampedFill >= mid12) {
            setActiveIndex(2);
          } else if (clampedFill >= mid01) {
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

    // Target progress points for each step
    const targetProgress = index === 0 ? 0.06 : index === 1 ? 0.5 : 0.92;
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
        <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 w-full py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* ═══ LEFT COLUMN: Badge & Headline ═══ */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="mb-4 sm:mb-5">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700">
                  Infrastructure
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold leading-[1.22] sm:leading-[1.25] tracking-tight text-[#2A5298]">
                Intelligent Infrastructure for
                <br />
                Seamless Operations
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
                      transition: "transform 0.12s ease-out",
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
                        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                          isActive
                            ? "ring-4 ring-[#93C5FD]/60 shadow-[0_0_14px_rgba(42,102,204,0.5)] scale-125"
                            : "ring-0 shadow-none scale-100"
                        }`}
                      />

                      {/* Main Dot Body */}
                      <span
                        className={`relative rounded-full transition-all duration-500 ${
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
                className="flex-1 flex flex-col gap-4 sm:gap-5 lg:gap-6"
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
                      className={`relative cursor-pointer transition-all duration-600 ease-out select-text ${
                        isActive
                          ? "drop-shadow-[0_16px_32px_rgba(40,100,201,0.22)] scale-[1.01]"
                          : "hover:scale-[1.005] drop-shadow-[0_4px_16px_rgba(0,0,0,0.02)] scale-100"
                      }`}
                    >
                      <div
                        className="relative overflow-hidden p-6 sm:p-7 lg:p-8 rounded-tl-[22px] sm:rounded-tl-[26px] rounded-br-[22px] sm:rounded-br-[26px]"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))",
                        }}
                      >
                        {/* Inactive Soft Pastel Base Layer */}
                        <div className="absolute inset-0 bg-[#EDF4FC] rounded-tl-[22px] sm:rounded-tl-[26px] rounded-br-[22px] sm:rounded-br-[26px] transition-colors duration-600" />

                        {/* Active Vibrant Gradient Layer: Silky smooth opacity cross-fade */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-[#2864C9] via-[#3577D5] to-[#4EA3ED] rounded-tl-[22px] sm:rounded-tl-[26px] rounded-br-[22px] sm:rounded-br-[26px] transition-opacity duration-600 ease-out ${
                            isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                          }`}
                        />

                        {/* Card Content (z-10 ensures sharp readability above background layers) */}
                        <div className="relative z-10">
                          <h3
                            className={`font-display text-lg sm:text-xl lg:text-[22px] font-bold tracking-tight mb-3.5 sm:mb-4 lg:mb-5 transition-colors duration-500 ${
                              isActive ? "text-white" : "text-[#4F688B]"
                            }`}
                          >
                            {card.title}
                          </h3>
                          <p
                            className={`text-xs sm:text-sm lg:text-[15px] leading-relaxed max-w-xl transition-colors duration-500 ${
                              isActive ? "text-white/95 font-normal" : "text-[#6A819F]"
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
