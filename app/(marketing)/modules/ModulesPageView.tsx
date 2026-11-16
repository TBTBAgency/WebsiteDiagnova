"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  PackageCheck,
  Microscope,
  FlaskConical,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Sparkles,
  FileCheck2,
  QrCode,
  Zap,
  FileText,
  ArrowLeftRight,
  UserCheck,
  Info,
  Shuffle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CmsRichText, useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { modulesPage } from "@/content/pages/modules";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

const ICONS: Record<string, LucideIcon> = {
  Activity,
  HeartPulse,
  PackageCheck,
  Microscope,
  FlaskConical,
  Cpu,
  Database,
  FileCheck2,
  Shuffle,
  UserCheck,
  Sparkles,
  Zap,
  QrCode,
  FileText,
  Info,
};

function getIcon(name: string | undefined): LucideIcon {
  return (name && ICONS[name]) || Layers;
}

/** Warna kotak ikon kartu modul spesialis (Bento 4). Kunci tak dikenal -> "blue". */
const SPECIALTY_ACCENTS: Record<string, string> = {
  blue: "bg-[#EBF3FE] text-[#2764B8]",
  teal: "bg-teal-50 text-teal-700",
};

/** Gaya batang bertingkat section Skalabilitas. Kunci tak dikenal -> "base". */
const TIER_STYLES: Record<
  string,
  { card: string; value: string; label: string; desc: string; volume: string; highlight?: boolean }
> = {
  base: {
    card: "rounded-3xl bg-[#F4F6F9] border border-slate-200/80 p-6 flex flex-col justify-between min-h-[140px] sm:h-[210px] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md",
    value: "font-display text-4xl sm:text-[42px] font-bold text-slate-800 tracking-tight leading-none",
    label: "mt-3 text-xs font-semibold text-slate-700",
    desc: "mt-1 text-[11.5px] text-slate-500 leading-relaxed",
    volume: "text-[11px] font-medium text-slate-400",
  },
  mid: {
    card: "rounded-3xl bg-[#EEF2F7] border border-slate-200/90 p-6 flex flex-col justify-between min-h-[155px] sm:h-[285px] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md",
    value: "font-display text-4xl sm:text-[46px] font-bold text-slate-900 tracking-tight leading-none",
    label: "mt-3 text-xs font-semibold text-slate-800",
    desc: "mt-1 text-[11.5px] text-slate-600 leading-relaxed",
    volume: "text-[11px] font-semibold text-slate-500",
  },
  highlight: {
    card: "group rounded-3xl bg-[#0073FC] text-white p-6 flex flex-col justify-between min-h-[200px] sm:h-[365px] relative overflow-hidden shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-600/30",
    value: "font-display text-5xl sm:text-[54px] font-bold text-white tracking-tight leading-none",
    label: "mt-3 text-xs font-semibold text-blue-50",
    desc: "mt-1 text-[11.5px] text-blue-100/90 leading-relaxed",
    volume: "",
    highlight: true,
  },
};

const TIER_BAR_HEIGHTS = [38, 62, 46, 84, 52, 92, 66, 76, 48, 88, 58, 72];

export function ModulesPageView({ content }: { content: PageContentOf<typeof modulesPage> }) {
  const t = useCmsText();
  const [isClinicalView, setIsClinicalView] = useState<boolean>(false);
  const [activeCase, setActiveCase] = useState<number>(0);

  const { hero, reporting, directory, architecture, scalability, cta } = content;

  const reportCases = visibleItems(reporting?.cases);
  const currentReport = reportCases[Math.min(activeCase, reportCases.length - 1)];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      {hero && (
        <PageHero
          badge={t(hero.badge)}
          title={<CmsRichText text={t(hero.title)} breakClassName="hidden sm:inline" />}
          subtitle={t(hero.subtitle)}
          primaryCta={{
            text: t(hero.primaryCta?.text),
            href: hero.primaryCta?.href,
          }}
          secondaryCta={{
            text: t(hero.secondaryCta?.text),
            href: hero.secondaryCta?.href,
          }}
          metrics={visibleItems(hero.metrics).map((m) => ({
            value: t(m.value),
            label: t(m.label),
            sub: t(m.sub),
          }))}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE STATION (MATCHING USER LIGOLAB SPEC: 4 VALUE ROWS + AI PATIENT & CLINICAL VIEW)
          ══════════════════════════════════════════════════════════════ */}
      {reporting && (
        <section
          id="modules-explorer"
          className="relative scroll-mt-24 w-full bg-white py-12 sm:py-16 lg:py-24"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Section Header */}
            <div className="max-w-2xl mb-8 sm:mb-12 lg:mb-14">
              <div className="mb-3 sm:mb-3.5">
                <SectionBadge variant="blue">{t(reporting.badge)}</SectionBadge>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
                {t(reporting.title)}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {t(reporting.subtitle)}
              </p>
            </div>

            {/* 2-Column LigoLab Architecture: Left 4 Value Rows + Right Dual-Mode Patient Report Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-center">
              {/* Left Column: 4 Clean Feature Rows with Responsive Icon Badge */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-7 lg:space-y-8">
                {visibleItems(reporting.features).map((feature) => {
                  const FeatureIcon = getIcon(feature.iconName);
                  return (
                    <div key={feature.id} className="flex items-start gap-3.5 sm:gap-5 lg:gap-6 group">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-xl sm:rounded-2xl bg-[#F4F8FD] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#EBF3FE] transition-all">
                        <FeatureIcon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 stroke-[1.6]" />
                      </div>
                      <div className="space-y-1 sm:space-y-1.5 flex-1 pt-0.5">
                        <h3 className="font-display text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                          {t(feature.title)}
                        </h3>
                        <ul className="space-y-1 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {visibleItems(feature.points).map((point) => (
                            <li key={point.id} className="flex items-start gap-1.5 sm:gap-2">
                              <span className="text-slate-400 select-none shrink-0">-</span>
                              <span>{t(point.text)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Dynamic & Responsive Report Card with Specialty & Mode Switcher */}
              <div className="lg:col-span-6 w-full min-w-0">
                <div className="rounded-[22px] sm:rounded-[28px] lg:rounded-[32px] bg-[#FAFBFD] border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-[0_10px_35px_-15px_rgba(15,23,42,0.05)] relative flex flex-col justify-between transition-all duration-300">
                  {/* Card Header with Interactive Toggle Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-display text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
                        {t(reporting.cardTitle)}
                      </span>
                    </div>

                    {/* Mode Switcher Button */}
                    <button
                      type="button"
                      onClick={() => setIsClinicalView(!isClinicalView)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0073FC] hover:bg-[#0060D6] text-white font-sans text-[11px] sm:text-xs font-bold tracking-wide shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer shrink-0 group"
                    >
                      <ArrowLeftRight className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300", isClinicalView ? "rotate-180" : "rotate-0")} />
                      <span>
                        {isClinicalView ? t(reporting.patientViewLabel) : t(reporting.clinicalViewLabel)}
                      </span>
                    </button>
                  </div>

                  {/* Dynamic Case Switcher Pills (Responsive horizontal scroll / wrap on tiny screens) */}
                  <div
                    className={cn(
                      "flex flex-wrap items-center gap-1.5 sm:gap-2",
                      isClinicalView
                        ? "pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-slate-200/75"
                        : "mb-4 sm:mb-5"
                    )}
                  >
                    {reportCases.map((item, idx) => {
                      const isActive = currentReport === item;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveCase(idx)}
                          className={cn(
                            "px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer",
                            isActive
                              ? "bg-[#EBF3FE] text-[#1E5299] border border-blue-200/90 shadow-2xs"
                              : "bg-white text-slate-500 border border-slate-200/70 hover:text-slate-800 hover:border-slate-300"
                          )}
                        >
                          {t(item.label)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Content Area */}
                  {currentReport && (
                    <div
                      key={`${currentReport.id}-${isClinicalView ? "clinical" : "patient"}`}
                      className="animate-in fade-in slide-in-from-bottom-1 duration-300"
                    >
                      {isClinicalView ? (
                        /* Clinical View: Structured Report matching LigoLab Spec */
                        <div className="space-y-3 sm:space-y-4 pb-1">
                          <p className="text-[11px] sm:text-[13px] font-bold tracking-wider text-slate-400 uppercase">
                            {t(currentReport.clinicalHeading)}
                          </p>

                          <div className="space-y-2.5 sm:space-y-3.5 text-[13px] sm:text-sm lg:text-[15px] leading-relaxed text-slate-700">
                            {visibleItems(currentReport.clinicalFields).map((field) => (
                              <p key={field.id} className="break-words">
                                <span className="font-medium text-[#0073FC]">
                                  {t(field.label)}
                                </span>{" "}
                                {t(field.value)}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Patient View: 3 Stacked Pastel Cards */
                        <div className="space-y-3 sm:space-y-3.5">
                          {/* Card 1: Blue Card - Results Summary */}
                          <div className="rounded-xl sm:rounded-2xl bg-[#EFF6FF] border border-blue-200/80 p-3.5 sm:p-4 lg:p-5 transition-all duration-200 hover:border-blue-300/80">
                            <div className="flex items-center gap-2 text-[#1E40AF] font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-1.5 sm:mb-2">
                              <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                              <h4>{t(reporting.summaryHeading)}</h4>
                            </div>
                            <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                              {t(currentReport.patientSummary)}
                            </p>
                          </div>

                          {/* Card 2: Green Card - What This Means */}
                          <div className="rounded-xl sm:rounded-2xl bg-[#F0FDF4] border border-emerald-200/80 p-3.5 sm:p-4 lg:p-5 transition-all duration-200 hover:border-emerald-300/80">
                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-1.5 sm:mb-2">
                              <Info className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-700 shrink-0" />
                              <h4>{t(reporting.meaningHeading)}</h4>
                            </div>
                            <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                              {t(currentReport.patientMeaning)}
                            </p>
                          </div>

                          {/* Card 3: White Card - Next Steps */}
                          <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 lg:p-5 shadow-2xs transition-all duration-200 hover:border-slate-300/90">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-2">
                              <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#2764B8] shrink-0" />
                              <h4>{t(reporting.stepsHeading)}</h4>
                            </div>
                            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13.5px] text-slate-700">
                              {visibleItems(currentReport.patientSteps).map((step) => (
                                <li key={step.id} className="flex items-start sm:items-center gap-2">
                                  <span className="text-slate-800 font-bold shrink-0">✓</span>
                                  <span>{t(step.text)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          COMPLETE MODULE DIRECTORY (2x2 ASYMMETRICAL BENTO SHOWCASE)
          Matching Reference Architecture: 2-Column Header + 7/5 & 5/7 Bento Grid
          ══════════════════════════════════════════════════════════════ */}
      {directory && (
        <section className="w-full bg-[#FAFBFD] py-14 sm:py-20 lg:py-24 border-t border-slate-200/60">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* 2-Column Split Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end mb-10 sm:mb-14">
              <div className="lg:col-span-6">
                <div className="mb-3 sm:mb-3.5">
                  <SectionBadge variant="blue">{t(directory.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[40px] font-bold leading-[1.16] tracking-tight text-slate-900">
                  <CmsRichText text={t(directory.title)} breakClassName="hidden sm:inline" />
                </h2>
              </div>

              <div className="lg:col-span-6 lg:pb-1">
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl lg:ml-auto">
                  {t(directory.description)}
                </p>
              </div>
            </div>

            {/* 2x2 Asymmetrical Bento Grid — Horizontal snap-scroll on mobile, grid on md+ */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-12 md:gap-5 sm:gap-6 md:mx-0 md:px-0 md:pb-0 md:overflow-visible items-stretch">
              {/* ── BENTO 1 (WIDE - 7 COLS): Routine & Hematology + Analyzer Workflow ── */}
              <div
                id="routine-hematology"
                className="w-[86vw] max-w-[350px] shrink-0 snap-center md:w-auto md:max-w-none scroll-mt-32 lg:col-span-7 rounded-2xl sm:rounded-[28px] bg-[#F1F4F8] border border-slate-200/80 p-5 sm:p-8 flex flex-col justify-between overflow-hidden group hover:border-blue-200/80 transition-all duration-300"
              >
                <div className="mb-6 sm:mb-8">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {t(directory.hematology?.title)}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                    {t(directory.hematology?.desc)}
                  </p>
                </div>

                {/* Visual: Workflow Node Flow */}
                <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                  {/* Left Core Hub Node */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0073FC] text-white shadow-[0_8px_20px_-4px_rgba(0,115,252,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Activity className="h-7 w-7 stroke-[2]" />
                  </div>

                  {/* Connector Lines (Desktop) */}
                  <svg
                    className="hidden sm:block w-14 h-[212px] shrink-0 text-slate-300"
                    viewBox="0 0 56 212"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M0 106 C24 106, 24 27, 56 27" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M0 106 L56 106" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M0 106 C24 106, 24 188, 56 188" stroke="currentColor" strokeWidth="1.5" />
                  </svg>

                  {/* Right Stacked Branch Cards */}
                  <div className="flex-1 w-full max-w-md space-y-2.5 sm:space-y-3">
                    {/* Top Branch */}
                    <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex items-center gap-2.5 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                        <Zap className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {t(directory.hematology?.worklistTitle)}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {t(directory.hematology?.worklistSub)}
                        </p>
                      </div>
                    </div>

                    {/* Middle Branch (Multi-step Validation Card) */}
                    <div className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-900">
                          {t(directory.hematology?.qcLabel)}
                        </span>
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {t(directory.hematology?.qcStatus)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                        <span className="font-semibold text-slate-900">
                          {t(directory.hematology?.deltaLabel)}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {t(directory.hematology?.deltaTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                        <span className="font-semibold text-slate-900">
                          {t(directory.hematology?.releaseLabel)}
                        </span>
                        <span className="text-[10px] font-medium text-[#0073FC]">
                          {t(directory.hematology?.releaseStatus)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Branch */}
                    <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 shadow-2xs flex items-center gap-2.5 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                        <QrCode className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-semibold text-slate-900 truncate">
                        {t(directory.hematology?.barcodeLabel)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── BENTO 2 (NARROW - 5 COLS): Inventory & Reagent Telemetry ── */}
              <div
                id="inventory-reagent"
                className="w-[86vw] max-w-[350px] shrink-0 snap-center md:w-auto md:max-w-none scroll-mt-32 lg:col-span-5 rounded-2xl sm:rounded-[28px] bg-[#F1F4F8] border border-slate-200/80 pt-5 px-5 sm:pt-8 sm:px-8 pb-0 flex flex-col justify-between overflow-hidden group hover:border-blue-200/80 transition-all duration-300"
              >
                <div className="mb-5">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {t(directory.inventory?.title)}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                    {t(directory.inventory?.desc)}
                  </p>
                </div>

                {/* Visual: App Window + Floating KPI Card */}
                <div className="relative mt-auto pt-4">
                  {/* Background Mockup Frame */}
                  <div className="ml-6 sm:ml-10 rounded-tl-2xl bg-white border-t border-l border-slate-200/90 shadow-sm pt-4 px-5 pb-6">
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-md bg-[#0073FC] flex items-center justify-center text-white text-[9px] font-bold">
                          D
                        </span>
                        <span className="text-xs font-bold text-slate-800">{t(directory.inventory?.appName)}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{t(directory.inventory?.appMeta)}</span>
                    </div>

                    {/* Subtle Area Chart SVG */}
                    <svg className="w-full h-24 text-[#0073FC]" viewBox="0 0 240 80" fill="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="reagentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0073FC" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#0073FC" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="20" x2="240" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="45" x2="240" y2="45" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="70" x2="240" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                      <path
                        d="M0 68 L48 56 L96 60 L150 32 L195 38 L240 12 L240 80 L0 80 Z"
                        fill="url(#reagentGrad)"
                      />
                      <path
                        d="M0 68 L48 56 L96 60 L150 32 L195 38 L240 12"
                        stroke="#0073FC"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Floating KPI Card */}
                  <div className="absolute top-16 left-0 w-[64%] sm:w-[60%] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_14px_30px_-10px_rgba(15,23,42,0.12)] group-hover:-translate-y-1 transition-transform duration-300">
                    <p className="text-[11px] font-medium text-slate-500">
                      {t(directory.inventory?.kpiLabel)}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                        {t(directory.inventory?.kpiValue)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">▲</span>
                    </div>
                    <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/70">
                      ✓ {t(directory.inventory?.kpiBadge)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── BENTO 3 (NARROW - 5 COLS): Blood Bank (BDRS) Telemetry ── */}
              <div
                id="blood-bank"
                className="w-[86vw] max-w-[350px] shrink-0 snap-center md:w-auto md:max-w-none scroll-mt-32 lg:col-span-5 rounded-2xl sm:rounded-[28px] bg-[#F1F4F8] border border-slate-200/80 pt-5 px-5 sm:pt-8 sm:px-8 pb-0 flex flex-col justify-between overflow-hidden group hover:border-blue-200/80 transition-all duration-300"
              >
                <div className="mb-6">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {t(directory.bloodBank?.title)}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                    {t(directory.bloodBank?.desc)}
                  </p>
                </div>

                {/* Visual: Mini Dashboard Bar Chart Frame */}
                <div className="mt-auto rounded-t-2xl bg-white border-t border-x border-slate-200/90 shadow-sm p-4 sm:p-5 pb-5 sm:pb-6">
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center">
                        <HeartPulse className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {t(directory.bloodBank?.panelTitle)}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3FE] text-[#1E5299] text-[10px] font-semibold border border-blue-200/70">
                      {t(directory.bloodBank?.tempBadge)}
                    </span>
                  </div>

                  {/* Vertical Bar Chart */}
                  <div className="grid grid-cols-5 gap-3 items-end h-28 pt-2">
                    {visibleItems(directory.bloodBank?.bars).map((bar) => (
                      <div key={bar.id} className="flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full h-full rounded-t-lg bg-slate-100 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-[#0073FC] rounded-t-md transition-all duration-500 group-hover:bg-[#1E5299]"
                            style={{ height: bar.pct }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── BENTO 4 (WIDE - 7 COLS): Pathology, Microbiology & Custom Gateway ── */}
              <div
                id="pathology"
                className="w-[86vw] max-w-[350px] shrink-0 snap-center md:w-auto md:max-w-none scroll-mt-32 lg:col-span-7 rounded-2xl sm:rounded-[28px] bg-[#F1F4F8] border border-slate-200/80 p-5 sm:p-8 flex flex-col justify-between overflow-hidden group hover:border-blue-200/80 transition-all duration-300"
              >
                <div id="microbiology" className="mb-6 sm:mb-8">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {t(directory.specialty?.title)}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                    {t(directory.specialty?.desc)}
                  </p>
                </div>

                {/* Visual: Connected Multi-Specialty Registry */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                  {/* Left 2 Floating Module Cards */}
                  <div className="w-full sm:w-[42%] space-y-3">
                    {visibleItems(directory.specialty?.cards).map((card) => {
                      const CardIcon = getIcon(card.iconName);
                      return (
                        <div
                          key={card.id}
                          className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-1.5 group-hover:-translate-x-0.5 transition-transform duration-300"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                                SPECIALTY_ACCENTS[card.accent] ?? SPECIALTY_ACCENTS.blue
                              )}
                            >
                              <CardIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-bold text-slate-900">{t(card.title)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{t(card.sub)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connector SVG */}
                  <svg
                    className="hidden sm:block w-12 h-32 shrink-0 text-slate-300"
                    viewBox="0 0 48 128"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M0 30 C22 30, 22 64, 48 64" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M0 98 C22 98, 22 64, 48 64" stroke="currentColor" strokeWidth="1.5" />
                  </svg>

                  {/* Right Unified Registry Card */}
                  <div
                    id="custom-gateway"
                    className="w-full sm:w-[46%] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5"
                  >
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {t(directory.specialty?.registryTitle)}
                    </p>

                    {visibleItems(directory.specialty?.registry).map((row) => {
                      const RowIcon = getIcon(row.iconName);
                      return (
                        <div
                          key={row.id}
                          className="flex items-center justify-between gap-2 py-1.5 border-t border-slate-100 first:border-t-0 first:pt-0 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-[#EBF3FE] text-[#2764B8] flex items-center justify-center shrink-0">
                              <RowIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-semibold text-slate-800 truncate">{t(row.title)}</span>
                          </div>
                          <span className="text-[10px] font-medium text-[#0073FC] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                            {t(row.tag)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ARCHITECTURE (UNIFIED DATA, NO SILOS)
          ══════════════════════════════════════════════════════════════ */}
      {architecture && (
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-5 space-y-4">
                <SectionBadge variant="blue">{t(architecture.badge)}</SectionBadge>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
                  {t(architecture.title)}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {t(architecture.description)}
                </p>
                <div className="pt-2">
                  <Link
                    href={architecture.link?.href || "/platform"}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2466CB] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{t(architecture.link?.text)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-5 px-5 pb-2 scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-6 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible">
                {visibleItems(architecture.cards).map((card) => {
                  const CardIcon = getIcon(card.iconName);
                  return (
                    <div
                      key={card.id}
                      className="w-[76vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none p-5 sm:p-6 rounded-[24px] bg-[#FAFBFD] border border-slate-200/80 shadow-2xs space-y-3"
                    >
                      <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                        <CardIcon className="h-5.5 w-5.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{t(card.title)}</h4>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">{t(card.desc)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: STEPPED MODULE PERFORMANCE COMPARISON (Ref 4 Midas)
          ══════════════════════════════════════════════════════════════ */}
      {scalability && (
        <section className="w-full bg-[#F7F9FC] border-t border-slate-200/70 py-16 sm:py-24 overflow-hidden">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            <div className="rounded-[32px] border border-slate-200/90 bg-white p-7 sm:p-10 lg:p-14 shadow-2xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
                {/* Left Editorial Column */}
                <div className="lg:col-span-5 space-y-5 pb-2">
                  <SectionBadge variant="blue">{t(scalability.badge)}</SectionBadge>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 tracking-tight leading-[1.12]">
                    {t(scalability.title)}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
                    {t(scalability.description)}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={scalability.primaryCta?.href || "/request-demo"}
                      className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] overflow-hidden"
                    >
                      <span className="animate-shine-continuous" />
                      <span className="relative z-10">{t(scalability.primaryCta?.text)}</span>
                      <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href={scalability.secondaryCta?.href || "/solutions"}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors shadow-xs"
                    >
                      <span>{t(scalability.secondaryCta?.text)}</span>
                    </Link>
                  </div>
                </div>

                {/* Right 7 Cols: 3 Stepped Escalating Metric Bars (Ref 4) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-end pt-4">
                  {visibleItems(scalability.tiers).map((tier) => {
                    const style = TIER_STYLES[tier.variant] ?? TIER_STYLES.base;
                    return (
                      <div key={tier.id} className={style.card}>
                        <div className={style.highlight ? "relative z-10" : undefined}>
                          <div className={style.value}>{t(tier.value)}</div>
                          <div className={style.label}>{t(tier.label)}</div>
                          <p className={style.desc}>{t(tier.desc)}</p>
                        </div>

                        {style.highlight ? (
                          /* Bottom Vertical Bar Texture (Ref 4) */
                          <div className="relative z-10 pt-6 flex items-end justify-between gap-1.5 h-24 opacity-90" aria-hidden="true">
                            {TIER_BAR_HEIGHTS.map((h, idx) => (
                              <span
                                key={idx}
                                className="w-1.5 rounded-full bg-white/85"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className={style.volume}>{t(tier.volume)}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      {cta && (
        <CTABanner
          bgClassName="bg-white border-t border-slate-200/60"
          topColor="#FFFFFF"
          initialData={{
            section: {
              titleId: cta.title?.id,
              titleEn: cta.title?.en,
              subtitleId: cta.subtitle?.id,
              subtitleEn: cta.subtitle?.en,
              extraContent: {
                buttonTextId: cta.buttonText?.id,
                buttonTextEn: cta.buttonText?.en,
                placeholderId: cta.placeholder?.id,
                placeholderEn: cta.placeholder?.en,
              },
            },
          }}
        />
      )}
    </div>
  );
}
