"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  QrCode,
  Cpu,
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: "qrcode" | "cpu" | "activity" | "check";
  // Desktop coordinates & metrics
  cardLeft: string;
  cardTop: string;
  cardWidthPx: number;
  lineHeightPx: number;
  lineOffsetPx: number;
  dnaPercentX: number; // position on DNA (0 to 100%) for mobile/spotlight
}

const workflowStepsID: WorkflowStep[] = [
  {
    id: "step-1",
    number: "01",
    title: "Penerimaan & Pelabelan Cerdas",
    shortTitle: "Penerimaan Barcode",
    description:
      "Setiap tabung spesimen menerima barcode unik, memastikan tidak ada sampel tertukar di laboratorium.",
    iconName: "qrcode",
    cardLeft: "0%",
    cardTop: "2%",
    cardWidthPx: 330,
    lineHeightPx: 175,
    lineOffsetPx: 155,
    dnaPercentX: 10,
  },
  {
    id: "step-2",
    number: "02",
    title: "Verifikasi Otomatis",
    shortTitle: "Otomasi Analyzer",
    description:
      "Setelah diproses analyzer, Diagnova menyimpan seluruh angka hasil uji secara langsung tanpa ketik ulang manual.",
    iconName: "cpu",
    cardLeft: "26%",
    cardTop: "16%",
    cardWidthPx: 330,
    lineHeightPx: 290,
    lineOffsetPx: 155,
    dnaPercentX: 36,
  },
  {
    id: "step-3",
    number: "03",
    title: "Deteksi Dini & Pengecekan Delta",
    shortTitle: "Delta Check",
    description:
      "Jika terdeteksi nilai kritis atau deviasi drastis, sistem otomatis memicu peringatan seketika bagi dokter dan analis.",
    iconName: "activity",
    cardLeft: "53%",
    cardTop: "20%",
    cardWidthPx: 340,
    lineHeightPx: 280,
    lineOffsetPx: 160,
    dnaPercentX: 64,
  },
  {
    id: "step-4",
    number: "04",
    title: "Hasil Akurat Siap Rilis",
    shortTitle: "Validasi & Rilis",
    description:
      "Hasil laboratorium yang telah tervalidasi langsung terkirim ke dokter dan tersinkronisasi mulus ke RME rumah sakit.",
    iconName: "check",
    cardLeft: "calc(100% - 330px)",
    cardTop: "3%",
    cardWidthPx: 330,
    lineHeightPx: 250,
    lineOffsetPx: 155,
    dnaPercentX: 90,
  },
];

const workflowStepsEN: WorkflowStep[] = [
  {
    id: "step-1",
    number: "01",
    title: "Smart Reception & Labeling",
    shortTitle: "Smart Reception",
    description:
      "Each sample tube receives a unique barcode, ensuring no specimens are mixed up in the laboratory.",
    iconName: "qrcode",
    cardLeft: "0%",
    cardTop: "2%",
    cardWidthPx: 330,
    lineHeightPx: 175,
    lineOffsetPx: 155,
    dnaPercentX: 10,
  },
  {
    id: "step-2",
    number: "02",
    title: "Auto-Verification",
    shortTitle: "Auto-Verification",
    description:
      "After instrument processing, Diagnova saves all test results in real-time without the need for manual retyping.",
    iconName: "cpu",
    cardLeft: "26%",
    cardTop: "16%",
    cardWidthPx: 330,
    lineHeightPx: 290,
    lineOffsetPx: 155,
    dnaPercentX: 36,
  },
  {
    id: "step-3",
    number: "03",
    title: "Early Detection & Delta Checks",
    shortTitle: "Delta Checks",
    description:
      "If abnormal numbers are detected, the system automatically triggers an alert so analysts and doctors can act quickly.",
    iconName: "activity",
    cardLeft: "53%",
    cardTop: "20%",
    cardWidthPx: 340,
    lineHeightPx: 280,
    lineOffsetPx: 160,
    dnaPercentX: 64,
  },
  {
    id: "step-4",
    number: "04",
    title: "Accurate Results Ready",
    shortTitle: "Results Release",
    description:
      "Validated laboratory results are instantly delivered to the doctor and seamlessly integrated with the hospital's EMR.",
    iconName: "check",
    cardLeft: "calc(100% - 330px)",
    cardTop: "3%",
    cardWidthPx: 330,
    lineHeightPx: 250,
    lineOffsetPx: 155,
    dnaPercentX: 90,
  },
];

function getStepIcon(name: WorkflowStep["iconName"], className = "h-4 w-4") {
  switch (name) {
    case "qrcode":
      return <QrCode className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "check":
      return <CheckCircle2 className={className} />;
  }
}

export function WorkflowSection() {
  const { language } = useLanguage();
  const workflowSteps = language === "ID" ? workflowStepsID : workflowStepsEN;

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Active step for responsive slider/stepper (on medium/mobile screens)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showAllStagesMobile, setShowAllStagesMobile] = useState<boolean>(false);

  // Scroll detection for header and initial reveals with rAF throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (sectionRect.top <= windowHeight * 0.88) {
            setIsHeaderVisible(true);
          }

          if (canvasRef.current) {
            const cRect = canvasRef.current.getBoundingClientRect();
            const s1 = cRect.top <= windowHeight * 0.8;
            const s2 = cRect.top <= windowHeight * 0.68;
            const s3 = cRect.top <= windowHeight * 0.54;
            const s4 = cRect.top <= windowHeight * 0.4;

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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-play stepper on mobile/tablet when in view and playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % workflowSteps.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, workflowSteps.length]);

  const activeStep = workflowSteps[currentStepIndex];

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="relative w-full overflow-hidden text-white select-none pt-14 sm:pt-20 lg:pt-24 xl:pt-28 pb-14 sm:pb-20 lg:pb-24 xl:pb-28 content-auto"
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
        @keyframes wfPulseGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.4);
          }
        }
        @keyframes wfShimmerSweep {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          40% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>

      {/* ─── BACKGROUND: Linear Gradient matching brand aesthetic ─── */}
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

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
        {/* Header row: Badge, Headline, Subtitle */}
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16 xl:mb-20 transition-all duration-700 ease-out",
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          {/* Left: Badge + Headline */}
          <div className="max-w-xl lg:max-w-2xl">
            <div className="mb-3.5 sm:mb-4">
              <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm">
                {language === "ID" ? "Alur Kerja" : "How It Works"}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-white tracking-tight leading-[1.18] sm:leading-[1.22]">
              {language === "ID" ? (
                <>
                  Bagaimana Diagnova Memandu{" "}
                  <br className="hidden sm:inline" />
                  Setiap Tetes Sampel
                </>
              ) : (
                <>
                  How Diagnova Guides a <br className="hidden sm:inline" />
                  Drop of Blood
                </>
              )}
            </h2>
          </div>

          {/* Right: Subtitle */}
          <p className="max-w-xs sm:max-w-sm text-white/85 text-xs sm:text-sm lg:text-[15px] font-light leading-relaxed text-left lg:pt-8">
            {language === "ID"
              ? "Pantau perjalanan spesimen laboratorium dengan transparansi penuh, dari registrasi hingga rilis hasil."
              : "Monitor the specimen's journey with full visibility, from sample collection to physician release."}
          </p>
        </div>

        {/* ═══ 1. DESKTOP INTERACTIVE CANVAS VIEWPORT (≥ 1024px / lg) ═══ */}
        <div
          ref={canvasRef}
          className="relative hidden lg:block w-full"
          style={
            {
              height: "calc(100vw * 860 / 1728)",
              minHeight: "780px",
              "--dna-offset": "clamp(3.5rem, 6vw, 6.5rem)",
            } as React.CSSProperties
          }
        >
          {/* ── DNA HELIX: Full bleed, object-contain object-bottom ── */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 pointer-events-none overflow-visible transition-opacity duration-1000",
              isHeaderVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              height: "calc(100vw * 860 / 1728)",
              minHeight: "780px",
              transform: "translateY(var(--dna-offset))",
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
                loading="lazy"
                className="object-contain object-bottom pointer-events-none select-none gpu-layer"
                sizes="100vw"
              />
            </div>
          </div>

          {/* ── 4 FLUID LIQUID GLASS CARDS (Calibrated DNA-anchored positions) ── */}
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
                    "relative h-[138px] rounded-2xl p-4.5 sm:p-5 backdrop-blur-xl border transition-all duration-300 ease-out cursor-pointer select-none flex flex-col justify-between overflow-hidden gpu-layer",
                    hovered
                      ? "bg-white/[0.24] border-white/50 shadow-[0_8px_25px_rgba(255,255,255,0.2)] -translate-y-1"
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

                  {/* Header: Title & Icon on Left, Step Number on Right */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-white/15 text-white/90">
                        {getStepIcon(step.iconName, "h-3.5 w-3.5")}
                      </div>
                      <h3 className="font-semibold text-white text-[14.5px] xl:text-[15px] leading-snug tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <span className="shrink-0 font-sans font-medium text-xs xl:text-[13px] text-white/70 tracking-normal select-none pt-0.5">
                      {step.number}
                    </span>
                  </div>

                  {/* Description: Clean left-aligned copy */}
                  <p className="text-[12.5px] xl:text-[13px] text-white/80 font-light leading-[1.6] text-left">
                    {step.description}
                  </p>
                </div>

                {/* Delicate 1px Vertical Connector Line (Grows Up once from Dot to Card) */}
                <div
                  className="absolute pointer-events-none origin-bottom"
                  style={{
                    left: `${step.lineOffsetPx}px`,
                    top: "138px",
                    width: "1px",
                    height: `calc(${step.lineHeightPx}px + var(--dna-offset))`,
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

                {/* Minimalist Pin Dot on DNA Node */}
                <div
                  className="absolute pointer-events-none flex items-center justify-center"
                  style={{
                    left: `${step.lineOffsetPx - 4}px`,
                    top: `calc(${138 + step.lineHeightPx - 4}px + var(--dna-offset))`,
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

        {/* ═══ 2. MOBILE & TABLET VIEWPORT (< 1024px / lg) ═══ */}
        <div className="block lg:hidden w-full">
          {/* Quick Segmented Number Pill Switcher */}
          <div className="flex items-center justify-between gap-1.5 mb-4 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            {workflowSteps.map((step, idx) => {
              const isActive = currentStepIndex === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "flex-1 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer text-center",
                    isActive
                      ? "bg-white text-[#2568BA] shadow-sm font-bold scale-[1.03]"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  <span>{step.number}</span>
                </button>
              );
            })}
          </div>

          {/* DNA Graphic Spotlight Visual */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden my-[clamp(0.75rem,2.5vw,1.5rem)] border border-white/20 bg-white/[0.05] backdrop-blur-md">
            <Image
              src="/images/dna-workflow.webp"
              alt="Diagnova DNA Workflow"
              fill
              className="object-contain object-bottom pointer-events-none translate-y-[5%] scale-[1.02]"
              sizes="100vw"
            />

            {/* Glowing Active Step Bead on Mobile Visual */}
            <div
              className="absolute bottom-[30%] -translate-x-1/2 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center"
              style={{ left: `${activeStep.dnaPercentX}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-6 h-6 rounded-full bg-white/40 animate-ping" />
                <span className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_white]" />
              </div>
            </div>
          </div>

          {/* Active Liquid Glass Card Showcase with Prev/Next Controls */}
          <div className="relative rounded-2xl backdrop-blur-xl border border-white/30 bg-white/[0.20] p-5 shadow-lg mb-4 transition-all">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-[#2568BA]">
                  {getStepIcon(activeStep.iconName, "h-4 w-4")}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-white/75">
                    {language === "ID" ? "Tahap" : "Stage"} {activeStep.number}
                  </span>
                  <h3 className="font-semibold text-white text-[15px] leading-tight">
                    {activeStep.title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/90 font-light leading-relaxed mb-4">
              {activeStep.description}
            </p>

            {/* Interactive Stage Controls (Prev, Auto-play toggle, Next) */}
            <div className="flex items-center justify-between pt-3 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(
                    (prev) =>
                      (prev - 1 + workflowSteps.length) % workflowSteps.length
                  );
                  setIsPlaying(false);
                }}
                className="flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white bg-white/10 px-3 py-1.5 rounded-full active:scale-95"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{language === "ID" ? "Sebelumnya" : "Prev"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 text-[11px] text-white/80 bg-white/10 px-2.5 py-1 rounded-full"
                title={isPlaying ? "Jeda Otomatis" : "Putar Otomatis"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3 w-3" />
                    <span>Auto</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentStepIndex(
                    (prev) => (prev + 1) % workflowSteps.length
                  );
                  setIsPlaying(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-[#2568BA] bg-white px-3 py-1.5 rounded-full shadow-sm active:scale-95"
              >
                <span>{language === "ID" ? "Berikutnya" : "Next"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Optional: View All Stages Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowAllStagesMobile(!showAllStagesMobile)}
              className="text-xs text-white/80 hover:text-white underline underline-offset-4 cursor-pointer py-1"
            >
              {showAllStagesMobile
                ? language === "ID"
                  ? "Sembunyikan Daftar Penuh"
                  : "Hide Full List"
                : language === "ID"
                ? "Lihat Semua 4 Tahapan Sekaligus ↓"
                : "View All 4 Stages Below ↓"}
            </button>

            {/* Expandable Connected Vertical Timeline */}
            {showAllStagesMobile && (
              <div className="relative pl-6 mt-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="absolute left-[11px] top-4 bottom-4 w-[1.5px] bg-gradient-to-b from-white/70 via-white/35 to-white/15 rounded-full" />
                <div className="space-y-3">
                  {workflowSteps.map((step) => (
                    <div key={step.id} className="relative">
                      <div className="absolute -left-[18px] top-4 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-white/60 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                      </div>
                      <div className="rounded-xl backdrop-blur-xl border border-white/20 bg-white/[0.12] p-3.5 text-white">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-xs text-white">
                            {step.title}
                          </h4>
                          <span className="font-mono text-[10px] text-white/70">
                            {step.number}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/80 font-light leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
