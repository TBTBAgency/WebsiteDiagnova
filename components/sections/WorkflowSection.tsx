"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  description: string;
  // Canvas coordinate placements
  cardLeft: string;
  cardTop: string;
  cardWidthPx: number;
  // Connector line dropping to DNA
  lineHeightPx: number;
  lineOffsetPx: number;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "step-1",
    number: "01",
    title: "Smart Reception & Labeling",
    description:
      "Each Sample Tube Receives A Unique Barcode, Ensuring No Specimens Are Mixed Up In The Laboratory.",
    cardLeft: "0%",
    cardTop: "2%",
    cardWidthPx: 330,
    lineHeightPx: 175,
    lineOffsetPx: 155,
  },
  {
    id: "step-2",
    number: "02",
    title: "Auto-Verification",
    description:
      "After Instrument Processing, Diagnova Saves All Test Results In Real-Time Without The Need For Manual Retyping.",
    cardLeft: "26%",
    cardTop: "16%",
    cardWidthPx: 330,
    lineHeightPx: 290,
    lineOffsetPx: 155,
  },
  {
    id: "step-3",
    number: "03",
    title: "Early Detection & Delta Checks",
    description:
      "If Abnormal Numbers Are Detected, The System Automatically Triggers An Alert So Analysts And Doctors Can Act Quickly.",
    cardLeft: "53%",
    cardTop: "20%",
    cardWidthPx: 340,
    lineHeightPx: 280,
    lineOffsetPx: 160,
  },
  {
    id: "step-4",
    number: "04",
    title: "Accurate Results Ready",
    description:
      "Validated Laboratory Results Are Instantly Delivered To The Doctor And Seamlessly Integrated With The Hospital's EMR.",
    cardLeft: "calc(100% - 330px)",
    cardTop: "3%",
    cardWidthPx: 330,
    lineHeightPx: 250,
    lineOffsetPx: 155,
  },
];

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false]);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Header appears as section enters viewport and stays visible
      if (sectionRect.top <= windowHeight * 0.88) {
        setIsHeaderVisible(true);
      }

      // 4 sequential scroll thresholds linked to scroll depth (once revealed, they stay visible)
      if (canvasRef.current) {
        const cRect = canvasRef.current.getBoundingClientRect();

        const s1 = cRect.top <= windowHeight * 0.80;
        const s2 = cRect.top <= windowHeight * 0.68;
        const s3 = cRect.top <= windowHeight * 0.54;
        const s4 = cRect.top <= windowHeight * 0.40;

        setActiveSteps((prev) => {
          const next0 = prev[0] || s1;
          const next1 = prev[1] || s2;
          const next2 = prev[2] || s3;
          const next3 = prev[3] || s4;

          if (
            prev[0] === next0 &&
            prev[1] === next1 &&
            prev[2] === next2 &&
            prev[3] === next3
          ) {
            return prev;
          }
          return [next0, next1, next2, next3];
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="relative w-full overflow-hidden text-white select-none pt-16 sm:pt-22 lg:pt-28 xl:pt-32 pb-8 sm:pb-10 lg:pb-12 xl:pb-14"
      aria-label="Diagnova Workflow Section"
    >
      <style>{`
        @keyframes wfDotPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          65% {
            transform: scale(1.3);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes wfLineDrawUp {
          0% {
            transform: scaleY(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes wfCardBloom {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.97);
            filter: blur(4px);
          }
          60% {
            opacity: 0.95;
            filter: blur(0.5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes wfShimmerSweep {
          0% {
            transform: translateX(-150%) skewX(-20deg);
            opacity: 0;
          }
          30% {
            opacity: 0.25;
          }
          100% {
            transform: translateX(250%) skewX(-20deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* ─── BACKGROUND: Exact Figma Linear Gradient (#345DAB 0%, #56ADE2 33%, #69C6FF 49%, #F9F9F9 100%) ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              180deg,
              #345DAB 0%,
              #56ADE2 33%,
              #69C6FF 49%,
              #F9F9F9 100%
            )
          `,
        }}
      />

      {/* ─── EXACT NAVBAR GRID CONTAINER: mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 ─── */}
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
        {/* Header row: Left aligned to grid edge, right aligned to grid edge */}
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6 lg:mb-8 transition-all duration-700 ease-out",
            isHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* Left: Badge + Headline */}
          <div className="max-w-xl lg:max-w-2xl">
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-white/95 border border-white/25 shadow-sm">
                How It Works
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-white tracking-tight leading-[1.18] sm:leading-[1.2]">
              How Diagnova Guides a{" "}
              <br className="hidden sm:inline" />
              Drop of Blood
            </h2>
          </div>

          {/* Right: Subtitle (Raised to align with headline) */}
          <p className="max-w-xs sm:max-w-sm text-white/80 text-sm sm:text-[15px] font-light leading-relaxed text-left lg:pt-10">
            Monitor the specimen&apos;s journey with full visibility, from start to finish.
          </p>
        </div>

        {/* ═══ DESKTOP CANVAS (≥ lg) ═══ */}
        <div
          ref={canvasRef}
          className="relative hidden lg:block w-full"
          style={{
            height: "calc(100vw * 860 / 1728)",
            minHeight: "780px",
          }}
        >
          {/* ── DNA HELIX: Full bleed, object-contain object-bottom ── */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 pointer-events-none overflow-visible transition-opacity duration-1000 translate-y-3 lg:translate-y-6",
              isHeaderVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              height: "100%",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                left: "calc(-1 * (50vw - 50%))",
                width: "100vw",
                height: "100%",
              }}
            >
              <Image
                src="/images/dna-workflow.webp"
                alt="Diagnova 3D DNA Workflow"
                fill
                priority
                className="object-contain object-bottom pointer-events-none"
                sizes="100vw"
              />
            </div>
          </div>

          {/* ── 4 REFINED LIQUID GLASS CARDS ── */}
          {workflowSteps.map((step, i) => {
            const isStepActive = activeSteps[i];
            const hovered = hoveredStep === i;
            const dimmed = hoveredStep !== null && !hovered;

            // Sequential timing per step: Dot pops first, line draws up, card blooms
            const dotDelay = 0;
            const lineDelay = 140;
            const cardDelay = 380;

            return (
              <div
                key={step.id}
                className="absolute z-20 group"
                style={{
                  left: step.cardLeft,
                  top: step.cardTop,
                  width: `${step.cardWidthPx}px`,
                }}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Frosted Liquid Glass Card (Explicit 138px height keeps line and DNA dot precisely anchored) */}
                <div
                  className={cn(
                    "relative h-[138px] rounded-2xl p-4.5 sm:p-5 backdrop-blur-xl border transition-all duration-300 ease-out cursor-pointer select-none flex flex-col justify-between overflow-hidden",
                    hovered
                      ? "bg-white/[0.20] border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.06)] -translate-y-0.5"
                      : dimmed
                      ? "bg-white/[0.09] border-white/15 opacity-75"
                      : "bg-white/[0.14] border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  )}
                  style={
                    isStepActive
                      ? {
                          animation: `wfCardBloom 0.52s cubic-bezier(0.16, 1, 0.3, 1) ${cardDelay}ms both`,
                        }
                      : { opacity: 0 }
                  }
                >
                  {/* Subtle top optical glass reflection highlight */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                  {/* Specular Light Sheen sweep upon entry reveal (plays once) */}
                  {isStepActive && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                        animation: `wfShimmerSweep 1.2s cubic-bezier(0.2, 0.8, 0.4, 1) ${cardDelay + 100}ms 1`,
                      }}
                    />
                  )}

                  {/* Header: Title on Left, Step Number on Right */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white text-[14.5px] xl:text-[15px] leading-snug tracking-tight">
                      {step.title}
                    </h3>
                    <span className="shrink-0 font-sans font-medium text-xs xl:text-[13px] text-white/70 tracking-normal select-none pt-0.5">
                      {step.number}
                    </span>
                  </div>

                  {/* Description: Clean left-aligned copy */}
                  <p className="text-[12.5px] xl:text-[13px] text-white/80 font-light leading-[1.6] text-left">
                    {step.description}
                  </p>
                </div>

                {/* Delicate 1px Vertical Connector Line (Grows Up once from Dot to Card, subtle & elegant) */}
                <div
                  className="absolute pointer-events-none origin-bottom"
                  style={{
                    left: `${step.lineOffsetPx}px`,
                    top: "138px",
                    width: "1px",
                    height: `${step.lineHeightPx}px`,
                    background:
                      "linear-gradient(to top, rgba(255,255,255,0.75), rgba(255,255,255,0.3))",
                    boxShadow: hovered
                      ? "0 0 5px rgba(255,255,255,0.7)"
                      : "none",
                    transition: "box-shadow 0.3s ease, background 0.3s ease",
                    transformOrigin: "bottom",
                    ...(isStepActive
                      ? {
                          animation: `wfLineDrawUp 0.44s cubic-bezier(0.22, 1, 0.36, 1) ${lineDelay}ms both`,
                        }
                      : { opacity: 0 }),
                  }}
                />

                {/* Minimalist Pin Dot on DNA Node (Pops First on exact DNA bead, clean & subtle) */}
                <div
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${step.lineOffsetPx - 4}px`,
                    top: `${138 + step.lineHeightPx - 4}px`,
                    width: "8px",
                    height: "8px",
                    ...(isStepActive
                      ? {
                          animation: `wfDotPop 0.36s cubic-bezier(0.34, 1.56, 0.64, 1) ${dotDelay}ms both`,
                        }
                      : { opacity: 0 }),
                  }}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full bg-white transition-all duration-200",
                      hovered
                        ? "opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                        : isStepActive
                        ? "opacity-90 shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                        : "opacity-75"
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ MOBILE & TABLET LAYOUT (< lg) ═══ */}
      <div className="lg:hidden relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 mt-6 pb-16">
        {/* DNA 3D Graphic Strip with Ambient Soft Vignette */}
        <div
          className={cn(
            "relative -mx-6 sm:-mx-8 mb-8 overflow-hidden transition-opacity duration-700 aspect-[1728/858] w-full rounded-2xl",
            isHeaderVisible ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src="/images/dna-workflow.webp"
            alt="Diagnova DNA Workflow"
            fill
            className="object-contain object-center pointer-events-none"
            sizes="100vw"
          />
        </div>

        {/* Connected Vertical Timeline Stepper Pipeline */}
        <div className="relative pl-6 sm:pl-8">
          {/* Vertical subtle timeline backbone */}
          <div className="absolute left-[11px] sm:left-[15px] top-4 bottom-4 w-[1.5px] bg-gradient-to-b from-white/70 via-white/35 to-white/15 rounded-full" />

          {/* Step Items */}
          <div className="space-y-4">
            {workflowSteps.map((step, i) => (
              <div key={step.id} className="relative group">
                {/* Timeline Node Bead on Vertical Backbone */}
                <div className="absolute -left-[18px] sm:-left-[22px] top-4 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                </div>

                {/* Connected Liquid Glass Step Card */}
                <div className="rounded-2xl backdrop-blur-xl border border-white/20 bg-white/[0.14] p-4.5 text-white shadow-sm transition-all duration-300">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-white text-[15px] leading-snug">
                      {step.title}
                    </h3>
                    <span className="shrink-0 font-sans font-medium text-xs text-white/70 tracking-normal select-none pt-0.5">
                      {step.number}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-white/80 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
