"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Stethoscope,
  TrendingUp,
  Server,
  Lock,
  FileCheck2,
  Cpu,
  Zap,
  Mic,
  Sparkles,
  ScanText,
  GitBranch,
  BarChart3,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCmsText, visibleItems, CmsRichText } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { novaAiPage } from "@/content/pages/nova-ai";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

const ICONS: Record<string, LucideIcon> = {
  ScanText,
  GitBranch,
  FileText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Stethoscope,
  Lock,
  Server,
  FileCheck2,
  Zap,
  Cpu,
  Mic,
  Sparkles,
  CheckCircle2,
};
const FALLBACK_ICON: LucideIcon = Sparkles;
const getIcon = (name: string | undefined): LucideIcon => (name && ICONS[name]) || FALLBACK_ICON;

/** Warna label status kartu kapabilitas (kunci `statusTone` di CMS). */
const STATUS_TONE_CLASS: Record<string, string> = {
  active: "text-[#0073FC]",
  muted: "text-slate-400",
};

/** Lebar progress ilustrasi routing (per indeks, berulang). */
const CASE_PROGRESS_WIDTHS = ["w-3/4", "w-1/2", "w-2/3"];
const DOCTOR_LOAD_WIDTHS = ["w-1/3", "w-1/4", "w-1/2"];

export function NovaAiPageView({ content }: { content: PageContentOf<typeof novaAiPage> }) {
  const t = useCmsText();
  const [virtualStaining, setVirtualStaining] = useState<boolean>(true);

  const { hero, paradigm, workstation, pipeline, virtualStaining: staining, caseRouting, voiceEntry, presignoutReview, governance, cta } =
    content;

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PageHero (Enterprise Medical SaaS Aesthetic)
          ══════════════════════════════════════════════════════════════ */}
      {hero && (
        <PageHero
          badge={t(hero.badge)}
          title={<CmsRichText text={t(hero.title)} breakClassName="hidden sm:inline" />}
          subtitle={t(hero.subtitle)}
          primaryCta={{
            text: t(hero.primaryCtaText),
            href: hero.primaryCtaHref,
          }}
          secondaryCta={{
            text: t(hero.secondaryCtaText),
            href: hero.secondaryCtaHref,
          }}
          metrics={visibleItems(hero.metrics).map((metric) => ({
            value: t(metric.value),
            label: t(metric.label),
            sub: t(metric.sub),
          }))}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: SYSTEM OF RECORD VS SYSTEM OF ACTION
          ══════════════════════════════════════════════════════════════ */}
      {paradigm && (
        <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-y border-slate-200/60">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Split Header (Left-Aligned) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(paradigm.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                  {t(paradigm.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(paradigm.description)}
              </p>
            </div>

            {/* 2-Card Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card: Traditional LIS */}
              <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-9 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-800">{t(paradigm.traditionalTitle)}</h3>
                  <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-400/80 text-white text-xs font-semibold">
                    <Server className="h-3.5 w-3.5" />
                    <span>{t(paradigm.traditionalPill)}</span>
                  </div>

                  <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-600">
                    {visibleItems(paradigm.traditionalItems).map((item) => (
                      <li key={item.id} className="flex items-start gap-2.5">
                        <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{t(item.text)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Card: Diagnova Nova AI */}
              <div className="rounded-[28px] bg-white border-2 border-[#0073FC]/25 p-7 sm:p-9 shadow-[0_14px_38px_-12px_rgba(0,115,252,0.16)] flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#0073FC]">{t(paradigm.novaTitle)}</h3>
                  <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0073FC] text-white text-xs font-semibold shadow-[0_4px_14px_-3px_rgba(0,115,252,0.45)]">
                    <Zap className="h-3.5 w-3.5" />
                    <span>{t(paradigm.novaPill)}</span>
                  </div>

                  <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                    {visibleItems(paradigm.novaItems).map((item) => (
                      <li key={item.id} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                        <span>{t(item.text)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: PATHOLOGIST WORKSTATION & AI CAPABILITIES (#workstation-demo)
          (3x2 Flat Card Grid on Pure White Background)
          ══════════════════════════════════════════════════════════════ */}
      {workstation && (
        <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Split Header (Left-Aligned) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(workstation.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                  {t(workstation.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(workstation.description)}
              </p>
            </div>

            {/* 3x2 Flat Cards Grid — Horizontal snap-scroll on mobile, grid on md+ */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 sm:gap-6 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
              {visibleItems(workstation.items).map((cap) => {
                const CapIcon = getIcon(cap.iconName);
                return (
                  <div
                    key={cap.id}
                    className="w-[84vw] max-w-[330px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[22px] bg-[#F7F9FC] border border-transparent p-6 sm:p-8 flex flex-col gap-5 transition-all duration-200 hover:bg-[#F1F5FA] hover:border-blue-200/70 hover:shadow-[0_10px_28px_-12px_rgba(0,115,252,0.14)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                        <CapIcon className="h-6 w-6 stroke-[1.75]" />
                      </div>
                      <div>
                        <h3 className="font-display text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                          {t(cap.title)}
                        </h3>
                        <span
                          className={cn(
                            "text-xs font-medium block mt-0.5",
                            STATUS_TONE_CLASS[cap.statusTone] ?? STATUS_TONE_CLASS.active
                          )}
                        >
                          {t(cap.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-normal">{t(cap.desc)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4-STAGE LABORATORY PIPELINE (#how-it-works)
          ══════════════════════════════════════════════════════════════ */}
      {pipeline && (
        <section
          id="how-it-works"
          className="scroll-mt-28 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(pipeline.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                  {t(pipeline.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(pipeline.description)}
              </p>
            </div>

            {/* 2x2 Symmetrical AI Feature Cards (Matches LigoLab AI Agents Reference) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1 (Top Left): AI-Powered Virtual Staining */}
              {staining && (
                <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Sparkles className="h-5 w-5 text-[#0073FC] shrink-0" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">{t(staining.title)}</h3>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                      {visibleItems(staining.items).map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{t(item.text)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Monitor Frame Visual */}
                  <div className="mt-auto flex flex-col items-center">
                    <div className="relative w-full max-w-[440px] rounded-2xl border-[3px] border-slate-200 bg-white shadow-sm overflow-hidden">
                      {/* Top Toggle Bar inside Monitor */}
                      <div className="flex items-center justify-center gap-3 py-3.5 px-4 border-b border-slate-100 bg-white">
                        <span
                          className={cn("text-xs font-medium", !virtualStaining ? "text-slate-900 font-bold" : "text-slate-400")}
                        >
                          {t(staining.toggleOffLabel)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setVirtualStaining((prev) => !prev)}
                          aria-label={t(staining.toggleAriaLabel)}
                          className={cn(
                            "relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer",
                            virtualStaining ? "bg-[#0073FC]" : "bg-slate-300"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform",
                              virtualStaining ? "translate-x-8" : "translate-x-1"
                            )}
                          />
                        </button>
                        <span className={cn("text-xs font-bold", virtualStaining ? "text-[#0073FC]" : "text-slate-400")}>
                          {t(staining.toggleOnLabel)}
                        </span>
                      </div>

                      {/* Histology Slide Canvas */}
                      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#FDF2F8]">
                        <svg
                          className="w-full h-full"
                          viewBox="0 0 400 168"
                          preserveAspectRatio="xMidYMid slice"
                          aria-hidden="true"
                        >
                          <rect width="400" height="168" fill={virtualStaining ? "#F5E8FF" : "#FCE7F3"} />
                          {/* Stromal fibers */}
                          <path
                            d="M-10 38 C55 18, 115 62, 185 36 C255 10, 325 58, 410 30"
                            fill="none"
                            stroke={virtualStaining ? "#D8B4FE" : "#F9A8D4"}
                            strokeWidth="12"
                            strokeLinecap="round"
                            opacity="0.55"
                          />
                          <path
                            d="M-10 92 C70 55, 130 128, 210 82 C280 42, 335 112, 410 78"
                            fill="none"
                            stroke={virtualStaining ? "#C084FC" : "#F472B6"}
                            strokeWidth="18"
                            strokeLinecap="round"
                            opacity="0.38"
                          />
                          <path
                            d="M-10 142 C85 112, 165 160, 250 122 C315 95, 360 142, 410 118"
                            fill="none"
                            stroke={virtualStaining ? "#A855F7" : "#EC4899"}
                            strokeWidth="22"
                            strokeLinecap="round"
                            opacity="0.28"
                          />
                          {/* Glandular lumens & cellular clusters */}
                          {[
                            { cx: 118, cy: 62, rx: 32, ry: 20, rot: -12 },
                            { cx: 232, cy: 52, rx: 28, ry: 18, rot: 14 },
                            { cx: 318, cy: 96, rx: 36, ry: 22, rot: -8 },
                            { cx: 172, cy: 118, rx: 30, ry: 17, rot: 9 },
                            { cx: 74, cy: 124, rx: 24, ry: 15, rot: -16 },
                          ].map((gland, idx) => (
                            <g key={idx} transform={`translate(${gland.cx} ${gland.cy}) rotate(${gland.rot})`}>
                              <ellipse
                                cx="0"
                                cy="0"
                                rx={gland.rx}
                                ry={gland.ry}
                                fill={virtualStaining ? "#E9D5FF" : "#FBCFE8"}
                                stroke={virtualStaining ? "#9333EA" : "#DB2777"}
                                strokeWidth="2"
                                opacity="0.72"
                              />
                              <ellipse
                                cx="0"
                                cy="0"
                                rx={gland.rx * 0.48}
                                ry={gland.ry * 0.44}
                                fill="#FFFFFF"
                                opacity="0.85"
                              />
                            </g>
                          ))}
                          {/* Dense cellular nuclei */}
                          {[
                            [44, 34, 2.8], [62, 48, 3.2], [88, 58, 3.5], [104, 42, 2.8], [134, 45, 3.4], [148, 66, 3.1],
                            [115, 82, 2.9], [186, 38, 3.0], [206, 54, 3.6], [222, 34, 2.7], [254, 46, 3.4], [262, 68, 3.1],
                            [286, 84, 3.5], [304, 72, 2.9], [344, 84, 3.4], [356, 108, 3.2], [322, 122, 2.8], [282, 114, 3.0],
                            [142, 114, 3.4], [164, 98, 2.9], [198, 112, 3.3], [182, 136, 2.8], [52, 118, 3.2], [92, 134, 3.0],
                            [242, 134, 3.1], [374, 48, 2.9], [386, 136, 3.3], [28, 78, 2.8], [248, 92, 3.2],
                          ].map(([cx, cy, r], idx) => (
                            <circle
                              key={idx}
                              cx={cx}
                              cy={cy}
                              r={r}
                              fill={virtualStaining ? (idx % 4 === 0 ? "#B45309" : "#581C87") : "#831843"}
                              opacity={virtualStaining && idx % 4 === 0 ? "0.88" : "0.62"}
                            />
                          ))}
                        </svg>

                        {/* Mini Slide Thumbnail (Left) */}
                        <div className="absolute left-3 top-3 w-12 h-14 rounded-lg bg-white/95 border border-slate-200 shadow-xs p-1 flex flex-col justify-between">
                          <div className={`h-8 rounded-sm ${virtualStaining ? "bg-purple-200/80" : "bg-pink-200/80"}`} />
                          <div className="h-1.5 w-6 bg-slate-300 rounded-full mx-auto" />
                        </div>

                        {/* Magnification & Live Stain Badges (Top Right) */}
                        <div className="absolute right-3 top-3 flex items-center gap-1.5">
                          {virtualStaining && (
                            <span className="px-2 py-0.5 rounded-md bg-white/95 border border-purple-200/80 text-[10px] font-bold text-purple-700 shadow-xs">
                              {t(staining.stainBadge)}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold tracking-wide">
                            {t(staining.magnificationBadge)}
                          </span>
                        </div>

                        {/* Floating Blue Pill */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0073FC] text-white text-[11px] font-semibold shadow-[0_6px_18px_-4px_rgba(0,115,252,0.55)] whitespace-nowrap">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{t(staining.pillText)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Monitor Stand */}
                    <div className="w-16 h-6 bg-gradient-to-b from-slate-200 to-slate-300" />
                    <div className="w-28 h-1.5 rounded-full bg-slate-200" />
                  </div>
                </div>
              )}

              {/* CARD 2 (Top Right): Dynamic Case & Resource Optimization */}
              {caseRouting && (
                <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <GitBranch className="h-5 w-5 text-[#0073FC] shrink-0" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">{t(caseRouting.title)}</h3>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                      {visibleItems(caseRouting.items).map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{t(item.text)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Monitor Frame Visual */}
                  <div className="mt-auto flex flex-col items-center">
                    <div className="w-full max-w-[440px] rounded-2xl border-[3px] border-slate-200 bg-[#F8FAFD] p-3.5 sm:p-4 shadow-sm">
                      <div className="relative">
                        {/* SVG Bezier Routing Connectors */}
                        <svg
                          className="pointer-events-none absolute inset-0 w-full h-full"
                          viewBox="0 0 400 180"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          {/* Left Cases -> Center Hub */}
                          <path
                            d="M 140 28 C 166 28, 166 90, 178 90"
                            fill="none"
                            stroke="#0073FC"
                            strokeWidth="1.75"
                            strokeDasharray="4 3"
                            opacity="0.7"
                          />
                          <path
                            d="M 140 90 L 178 90"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            opacity="0.7"
                          />
                          <path
                            d="M 140 152 C 166 152, 166 90, 178 90"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            opacity="0.7"
                          />
                          {/* Center Hub -> Right Pathologists */}
                          <path
                            d="M 222 90 C 234 90, 234 28, 260 28"
                            fill="none"
                            stroke="#0073FC"
                            strokeWidth="1.75"
                            strokeDasharray="4 3"
                            opacity="0.7"
                          />
                          <path
                            d="M 222 90 L 260 90"
                            fill="none"
                            stroke="#0073FC"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            opacity="0.55"
                          />
                          <path
                            d="M 222 90 C 234 90, 234 152, 260 152"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            opacity="0.7"
                          />
                        </svg>

                        <div className="relative z-10 grid grid-cols-11 items-center gap-2">
                          {/* Left 3 Cases (kasus pertama = prioritas/CITO, disorot biru) */}
                          <div className="col-span-4 space-y-2">
                            {visibleItems(caseRouting.cases).map((caseItem, idx) => {
                              const sub = t(caseItem.sub);
                              const width = CASE_PROGRESS_WIDTHS[idx % CASE_PROGRESS_WIDTHS.length];
                              return idx === 0 ? (
                                <div key={caseItem.id} className="rounded-lg bg-[#0073FC] text-white p-2 shadow-xs">
                                  <p className="text-[9px] font-bold">{caseItem.label}</p>
                                  {sub && <p className="text-[8px] text-blue-100">{sub}</p>}
                                  <div className="mt-1.5 h-1 w-full rounded-full bg-white/30">
                                    <div className={`h-1 ${width} rounded-full bg-white`} />
                                  </div>
                                </div>
                              ) : (
                                <div key={caseItem.id} className="rounded-lg bg-white border border-slate-200 p-2">
                                  <p className="text-[9px] font-bold text-slate-700">{caseItem.label}</p>
                                  {sub && <p className="text-[8px] text-slate-500">{sub}</p>}
                                  <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                                    <div className={`h-1 ${width} rounded-full bg-[#0073FC]`} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Center Smart Distribution Hub */}
                          <div className="col-span-3 flex flex-col items-center justify-center">
                            <div className="rounded-xl bg-white border border-blue-200/80 px-2.5 py-3 text-center shadow-xs">
                              <Cpu className="h-4 w-4 text-[#0073FC] mx-auto mb-1" />
                              <span className="text-[8px] font-bold text-slate-600 leading-tight block uppercase">
                                {t(caseRouting.hubLabel)}
                              </span>
                            </div>
                          </div>

                          {/* Right 3 Pathologists */}
                          <div className="col-span-4 space-y-2">
                            {visibleItems(caseRouting.doctors).map((doc, idx) => (
                              <div key={doc.id} className="rounded-lg bg-white border border-slate-200 p-2">
                                <div className="flex items-center justify-between text-[8px] font-bold text-slate-800">
                                  <span>{doc.name}</span>
                                  <span className="text-[#0073FC]">{doc.load}</span>
                                </div>
                                <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                                  <div
                                    className={`h-1 ${DOCTOR_LOAD_WIDTHS[idx % DOCTOR_LOAD_WIDTHS.length]} rounded-full bg-[#0073FC]`}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Monitor Stand */}
                    <div className="w-16 h-6 bg-gradient-to-b from-slate-200 to-slate-300" />
                    <div className="w-28 h-1.5 rounded-full bg-slate-200" />
                  </div>
                </div>
              )}

              {/* CARD 3 (Bottom Left): Hands-Free Result Entry */}
              {voiceEntry && (
                <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Mic className="h-5 w-5 text-[#0073FC] shrink-0" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">{t(voiceEntry.title)}</h3>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                      {visibleItems(voiceEntry.items).map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{t(item.text)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Voice Waveform + Autofill Box */}
                  <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 space-y-4 min-h-[176px] flex flex-col justify-center">
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-3 rounded-full bg-[#E8F1FD] pl-2 pr-5 py-2 border border-blue-200/60">
                        <div className="w-9 h-9 rounded-full bg-[#0073FC] text-white flex items-center justify-center ring-4 ring-blue-200/70 shadow-[0_4px_12px_-2px_rgba(0,115,252,0.45)]">
                          <Mic className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1 h-7">
                          {[10, 18, 12, 26, 16, 22, 12, 26, 18, 10, 22, 14, 24, 16, 10].map((h, i) => (
                            <span key={i} className="w-1 rounded-full bg-[#0073FC]" style={{ height: `${h}px` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {t(voiceEntry.diagnosisLabel)}
                        </span>
                        <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
                          {t(voiceEntry.diagnosisValue)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          {t(voiceEntry.specimenLabel)}
                        </span>
                        <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
                          {t(voiceEntry.specimenValue)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 4 (Bottom Right): Pre-Signout Review & Reporting Support */}
              {presignoutReview && (
                <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Stethoscope className="h-5 w-5 text-[#0073FC] shrink-0" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                        {t(presignoutReview.title)}
                      </h3>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                      {visibleItems(presignoutReview.items).map((item) => (
                        <li key={item.id} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{t(item.text)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pre-Signout Input + Tooltip Widget */}
                  <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 min-h-[176px] flex flex-col justify-center">
                    <div className="rounded-xl bg-white border border-slate-200/90 px-4 py-3 flex items-center justify-between shadow-2xs">
                      <span className="text-sm font-medium text-slate-700">{t(presignoutReview.inputText)}</span>
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                    </div>
                    <div className="relative mt-2.5 rounded-xl bg-[#0073FC] text-white px-4 py-3 shadow-[0_12px_28px_-8px_rgba(0,115,252,0.55)] flex items-center gap-2.5">
                      <span className="absolute -top-1.5 left-6 w-3 h-3 bg-[#0073FC] rotate-45" />
                      <Sparkles className="h-4 w-4 text-blue-100 shrink-0" />
                      <span className="text-xs sm:text-[13px] font-medium">{t(presignoutReview.suggestionText)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CLINICAL GOVERNANCE & RESPONSIBILITY MATRIX (#ai-doctor)
          ══════════════════════════════════════════════════════════════ */}
      {governance && (
        <section
          id="ai-doctor"
          className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full space-y-10 sm:space-y-12">
            {/* Split Header (Left-Aligned) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(governance.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                  {t(governance.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(governance.description)}
              </p>
            </div>

            {/* Compliance & Governance Banner */}
            <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0073FC] text-[11px] font-bold uppercase tracking-wider border border-blue-200/70">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{t(governance.bannerBadge)}</span>
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {t(governance.bannerTitle)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
                    {t(governance.bannerDescription)}
                  </p>
                </div>

                {/* 6 Compliance Badges (Balanced 3x2 Grid) */}
                <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {visibleItems(governance.complianceBadges).map((badge) => (
                    <div
                      key={badge.id}
                      className="rounded-2xl bg-white border border-slate-200/80 px-3.5 py-3 shadow-2xs flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{badge.code}</span>
                        <span className="text-[10px] font-medium text-slate-500 block">{t(badge.label)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Card Safeguards Grid: Order to Report */}
            <div className="space-y-6 pt-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{t(governance.safeguardsTitle)}</h3>

              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible">
                {visibleItems(governance.safeguards).map((item) => {
                  const ItemIcon = getIcon(item.iconName);
                  return (
                    <div
                      key={item.id}
                      className="w-[78vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none rounded-[22px] bg-[#F7F9FC] border border-transparent p-6 sm:p-7 space-y-4 transition-all duration-200 hover:bg-[#F1F5FA] hover:border-blue-200/70 hover:shadow-[0_10px_28px_-12px_rgba(0,115,252,0.14)]"
                    >
                      <div className="h-11 w-11 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
                        <ItemIcon className="h-5 w-5 stroke-[1.75]" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">{t(item.title)}</h4>
                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">{t(item.desc)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs sm:text-sm font-medium text-[#0073FC]">{t(governance.safeguardsFootnote)}</p>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Standardized Enterprise Banner
          ══════════════════════════════════════════════════════════════ */}
      {cta && (
        <CTABanner
          initialData={{
            section: {
              titleId: cta.title.id,
              titleEn: cta.title.en,
              subtitleId: cta.subtitle.id,
              subtitleEn: cta.subtitle.en,
              extraContent: {
                buttonTextId: cta.buttonText.id,
                buttonTextEn: cta.buttonText.en,
                placeholderId: cta.placeholder.id,
                placeholderEn: cta.placeholder.en,
              },
            },
          }}
          bgClassName="bg-[#FAFBFD] border-t border-slate-200/60"
          topColor="#FAFBFD"
        />
      )}
    </div>
  );
}
