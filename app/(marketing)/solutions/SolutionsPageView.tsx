"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  Zap,
  Flame,
  Send,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Thermometer,
  FlaskConical,
  Microscope,
  Network,
  AlertCircle,
  ScanLine,
  Users,
  Printer,
  CreditCard,
  Laptop,
  QrCode,
  FileText,
  Activity,
  HeartPulse,
  MessageSquare,
  HelpCircle,
  ArrowLeftRight,
  Monitor,
  MapPin,
  Mic,
  Phone,
  BarChart3,
  Video,
  Share2,
  RefreshCw,
  Clock,
  CheckCircle2,
  TrendingUp,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCmsText, visibleItems, CmsRichText } from "@/lib/cms/text";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { toCtaBannerData, type SolutionsPageContent } from "@/content/pages/solutions";

/** Peta nama ikon (disimpan di CMS) -> komponen lucide. */
const ICONS: Record<string, LucideIcon> = {
  Building2,
  AlertTriangle,
  Zap,
  Flame,
  Send,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
  Thermometer,
  FlaskConical,
  Microscope,
  Network,
  AlertCircle,
  ScanLine,
  Users,
  Printer,
  CreditCard,
  Laptop,
  QrCode,
  FileText,
  Activity,
  HeartPulse,
  MessageSquare,
  ArrowLeftRight,
  Monitor,
  MapPin,
  Mic,
  Phone,
  BarChart3,
  Video,
  Share2,
  RefreshCw,
  Clock,
  CheckCircle2,
  TrendingUp,
  Stethoscope,
};

function iconFor(name: string | undefined, fallback: LucideIcon): LucideIcon {
  return (name && ICONS[name]) || fallback;
}

/** Warna chip ikon pada pill kartu RS Sentral (berulang bila item ditambah). */
const PILL_ICON_STYLES = [
  "bg-[#FFEFE6] text-amber-600",
  "bg-[#FEECEB] text-rose-500",
  "bg-[#FEF6E6] text-amber-500",
];

/** Warna avatar inisial pada kartu Lab Klinik (berulang bila item ditambah). */
const AVATAR_STYLES = [
  "bg-blue-100 text-[#2764B8]",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

/** Gaya kolom telemetri per mode (indeks kolom; berulang bila item ditambah). */
const MICRO_COLUMN_STYLES = [
  {
    wrap: "px-2 py-1",
    label: "text-[10px] text-slate-400 font-mono block",
    value: "font-bold text-slate-900 text-xs sm:text-sm font-mono truncate block mt-0.5",
    sub: "text-[10px] font-mono text-[#2764B8] font-semibold block mt-0.5",
  },
  {
    wrap: "px-2.5 py-1",
    label: "text-[10px] text-slate-400 font-mono block",
    value: "font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5",
    sub: "text-[10px] font-mono text-slate-500 block mt-0.5",
  },
  {
    wrap: "px-2.5 py-1",
    label: "text-[10px] text-red-500 font-mono block font-bold",
    value: "font-bold text-red-700 text-xs sm:text-sm font-mono block mt-0.5",
    sub: "text-[10px] font-mono text-red-600 font-semibold block mt-0.5",
  },
];

const BLOOD_COLUMN_STYLES = [
  {
    wrap: "px-2 py-1",
    label: "text-[10px] text-slate-400 font-mono block",
    value: "font-bold text-emerald-700 text-xs sm:text-sm font-mono truncate block mt-0.5",
    sub: "text-[10px] font-mono text-slate-500 block mt-0.5",
  },
  {
    wrap: "px-2.5 py-1",
    label: "text-[10px] text-slate-400 font-mono block",
    value: "font-bold text-[#2764B8] text-xs sm:text-sm font-mono block mt-0.5",
    sub: "text-[10px] font-mono text-slate-500 block mt-0.5",
  },
  {
    wrap: "px-2.5 py-1",
    label: "text-[10px] text-slate-400 font-mono block",
    value: "font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5",
    sub: "text-[10px] font-mono text-emerald-600 font-semibold block mt-0.5",
  },
];

/** Posisi bar Gantt per indeks minggu (fase tambahan memakai posisi terakhir). */
const GANTT_COLUMNS = [
  { colStart: "md:col-start-1", colSpan: "md:col-span-2" },
  { colStart: "md:col-start-2", colSpan: "md:col-span-2" },
  { colStart: "md:col-start-3", colSpan: "md:col-span-2" },
  { colStart: "md:col-start-3", colSpan: "md:col-span-2" },
];

export function SolutionsPageView({ content }: { content: SolutionsPageContent }) {
  const t = useCmsText();
  const [activeSubTab, setActiveSubTab] = useState<"micro" | "blood">("micro");
  const [deploymentMode, setDeploymentMode] = useState<"cloud" | "onprem">("cloud");
  const [activeEfficiencyPhase, setActiveEfficiencyPhase] = useState<string>(
    content.efficiency?.defaultPhaseId ?? "analytic"
  );
  const [activeGanttWeek, setActiveGanttWeek] = useState<number>(0);

  const hero = content.hero;
  const facilities = content.facilities;
  const plans = content.plans;
  const efficiency = content.efficiency;
  const rollout = content.rollout;

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-800">
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
          CORE FACILITY SHOWCASE (MATCHING EXACT USER MOCKUP SPEC)
          3 Cards Top, 2 Cards Bottom, Authentic Micro-UIs, Precise Copy
          ══════════════════════════════════════════════════════════════ */}
      {facilities && (
        <section
          id="facility-solutions"
          className="relative scroll-mt-24 w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
        >
          <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Section Header (Left-aligned with SectionBadge like other sections) */}
            <div className="max-w-3xl mb-10 sm:mb-12">
              <div className="mb-3.5">
                <SectionBadge variant="blue">{t(facilities.badge)}</SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-slate-900">
                <CmsRichText text={t(facilities.title)} />
              </h2>
              <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                {t(facilities.subtitle)}
              </p>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                5-CARD ARCHITECTURE (UNIFIED 2-ROW GRID)
                ══════════════════════════════════════════════════════════════ */}
            <div className="space-y-6 sm:space-y-7">
              {/* ROW 1: 3 EQUAL VERTICAL CARDS — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 sm:gap-7 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
                {/* Card 1: Central Hospital Laboratory */}
                {facilities.hospitalCard && (
                  <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                    {/* Top Visual Stage: Soft Peach/Orange Canvas with 3 Floating Status Pills */}
                    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF5ED] via-[#FFF9F5] to-white border border-orange-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-5 shadow-2xs">
                      {visibleItems(facilities.hospitalCard.pills).map((pill, idx) => {
                        const PillIcon = iconFor(pill.iconName, Building2);
                        return (
                          <div
                            key={pill.id}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800"
                          >
                            <div
                              className={`h-6 w-6 rounded-lg ${PILL_ICON_STYLES[idx % PILL_ICON_STYLES.length]} flex items-center justify-center shrink-0`}
                            >
                              <PillIcon className="h-3.5 w-3.5" />
                            </div>
                            <span className="truncate">{t(pill.text)}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Content: Clean Title + Subtitle */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                      {t(facilities.hospitalCard.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {t(facilities.hospitalCard.desc)}
                    </p>
                  </div>
                )}

                {/* Card 2: Clinical & Reference Labs */}
                {facilities.clinicalCard && (
                  <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                    {/* Top Visual Stage: Soft Cyan/Blue Canvas with Corporate MCU Intake Box */}
                    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EFF8FF] via-[#F6FAFF] to-white border border-blue-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {t(facilities.clinicalCard.statusLabel)}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          {t(facilities.clinicalCard.batchName)}
                        </span>
                      </div>

                      {/* Corporate MCU Roster Box */}
                      <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {t(facilities.clinicalCard.rosterTitle)}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500">{t(facilities.clinicalCard.rosterMeta)}</p>
                      </div>

                      {/* Bottom Avatar Initials + WhatsApp Delivery */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1.5">
                            {visibleItems(facilities.clinicalCard.avatars).map((avatar, idx) => (
                              <span
                                key={avatar.id}
                                className={`h-5 w-5 rounded-full ${AVATAR_STYLES[idx % AVATAR_STYLES.length]} border border-white flex items-center justify-center text-[9px] font-bold`}
                              >
                                {avatar.initial}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {t(facilities.clinicalCard.othersLabel)}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2764B8]">
                          <Send className="h-3 w-3" />
                          {t(facilities.clinicalCard.deliveryLabel)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                      {t(facilities.clinicalCard.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {t(facilities.clinicalCard.desc)}
                    </p>
                  </div>
                )}

                {/* Card 3: Anatomical Pathology */}
                {facilities.pathologyCard && (
                  <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                    {/* Top Visual Stage: Soft Mint/Green Canvas with 5-Step Pipeline & Action Buttons */}
                    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EDFAF2] via-[#F5FCF7] to-white border border-emerald-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{t(facilities.pathologyCard.flowLabel)}</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          {t(facilities.pathologyCard.badge)}
                        </span>
                      </div>

                      {/* 5-Step Progress Boxes [ G ] [ E ] [ M ] [ S ] [ ✓ ] */}
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                        {visibleItems(facilities.pathologyCard.steps).map((step) => (
                          <div
                            key={step.id}
                            className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-2xs"
                          >
                            {step.label}
                          </div>
                        ))}
                        <div className="bg-emerald-600 text-white p-1.5 rounded-lg font-bold shadow-2xs flex items-center justify-center">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Sample ID & ICD-O Standard */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500">{t(facilities.pathologyCard.sampleId)}</span>
                        <span className="text-slate-700 font-bold">{t(facilities.pathologyCard.standardCode)}</span>
                      </div>

                      {/* 2 Bottom Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                        >
                          {t(facilities.pathologyCard.archiveButton)}
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded-lg bg-[#0F172A] text-[10px] font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors"
                        >
                          {t(facilities.pathologyCard.signOffButton)}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                      {t(facilities.pathologyCard.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {t(facilities.pathologyCard.desc)}
                    </p>
                  </div>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  ROW 2: 2 BALANCED CARDS (Microbiology Stewardship & Nova AI)
                  ══════════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
                {/* Card 4: Microbiology Stewardship & Blood Bank (Wide 7-col) */}
                {facilities.microBloodCard && (
                  <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                    {/* Top Visual Stage: Workstation Telemetry & AST Sensitivity Table */}
                    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F6F9FD] via-[#FAFBFD] to-white border border-slate-200/90 mb-5 space-y-3.5 shadow-2xs">
                      {/* Top Bar with Tab Switcher & Status Badge */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200/70">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveSubTab("micro")}
                            className={cn(
                              "px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer",
                              activeSubTab === "micro"
                                ? "bg-[#2764B8] text-white shadow-2xs"
                                : "text-slate-600 hover:text-slate-900 bg-transparent"
                            )}
                          >
                            {t(facilities.microBloodCard.microTab)}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveSubTab("blood")}
                            className={cn(
                              "px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer",
                              activeSubTab === "blood"
                                ? "bg-[#2764B8] text-white shadow-2xs font-semibold"
                                : "text-slate-600 hover:text-slate-900 bg-transparent"
                            )}
                          >
                            {t(facilities.microBloodCard.bloodTab)}
                          </button>
                        </div>

                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {t(facilities.microBloodCard.statusBadge)}
                        </span>
                      </div>

                      {activeSubTab === "micro" ? (
                        /* 3 Telemetry Columns (Microbiology Mode) */
                        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white rounded-xl border border-slate-200/80 p-2 text-xs">
                          {visibleItems(facilities.microBloodCard.microColumns).map((col, idx) => {
                            const s = MICRO_COLUMN_STYLES[idx % MICRO_COLUMN_STYLES.length];
                            return (
                              <div key={col.id} className={s.wrap}>
                                <span className={s.label}>{t(col.label)}</span>
                                <span className={s.value}>{t(col.value)}</span>
                                <span className={s.sub}>{t(col.sub)}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* 3 Telemetry Columns (Blood Bank Mode) */
                        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white rounded-xl border border-slate-200/80 p-2 text-xs">
                          {visibleItems(facilities.microBloodCard.bloodColumns).map((col, idx) => {
                            const s = BLOOD_COLUMN_STYLES[idx % BLOOD_COLUMN_STYLES.length];
                            return (
                              <div key={col.id} className={s.wrap}>
                                <span className={s.label}>{t(col.label)}</span>
                                <span className={s.value}>{t(col.value)}</span>
                                <span className={s.sub}>{t(col.sub)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Interactive Search Pill Bar */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                        <span className="text-[11px] text-slate-400 font-normal px-1 truncate">
                          {t(facilities.microBloodCard.searchPlaceholder)}
                        </span>
                        <button
                          type="button"
                          className="px-3.5 py-1 rounded-full bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-[10px] shadow-2xs transition-colors shrink-0"
                        >
                          {t(facilities.microBloodCard.searchButton)}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                      {t(facilities.microBloodCard.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {t(facilities.microBloodCard.desc)}
                    </p>
                  </div>
                )}

                {/* Card 5: Nova AI Clinical Summaries (Compact 5-col) */}
                {facilities.novaCard && (
                  <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                    {/* Top Visual Stage: Nova AI Clinical Narrative Summary */}
                    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] via-[#F8FAFD] to-white border border-slate-200/90 mb-5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#2764B8]" />
                          {t(facilities.novaCard.headerLabel)}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          {t(facilities.novaCard.badge)}
                        </span>
                      </div>

                      {/* 3 Narrative Summary Cards */}
                      <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-normal">
                        {visibleItems(facilities.novaCard.narratives).map((narrative) => (
                          <p
                            key={narrative.id}
                            className={
                              narrative.highlight
                                ? "p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800 font-medium"
                                : "p-2 rounded-lg bg-white border border-slate-100 shadow-2xs"
                            }
                          >
                            {t(narrative.text)}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Content */}
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                      {t(facilities.novaCard.title)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                      {t(facilities.novaCard.desc)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          FACILITY FIT MATRIX (ONE-SCREEN VIEWPORT SCALE - ZERO OVERFLOW)
          ══════════════════════════════════════════════════════════════ */}
      {plans && (
        <section className="w-full bg-[#FAFBFD] border-t border-slate-200/60 min-h-screen lg:h-screen lg:max-h-[1020px] flex flex-col justify-center py-2 sm:py-3 lg:py-4 overflow-hidden">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full relative">
            {/* Blue Framed Container Pod with Request-Demo Gradient & Orbs */}
            <div className="relative rounded-[30px] sm:rounded-[38px] bg-gradient-to-br from-[#2F77E3] via-[#2466CB] to-[#1A54B0] pt-12 sm:pt-16 lg:pt-20 pb-32 sm:pb-36 lg:pb-40 px-6 sm:px-10 lg:px-14 shadow-[0_20px_50px_-12px_rgba(26,84,176,0.32)] overflow-hidden">
              {/* Ambient Glowing Orbs */}
              <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#60A5FA]/35 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 -right-16 w-80 h-80 rounded-full bg-[#38BDF8]/25 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full bg-[#56ADE2]/30 blur-3xl pointer-events-none" />

              {/* Stepped Glass Pillars Cascading on Left & Right Wings */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:flex justify-between items-end px-2 sm:px-6">
                {/* Left Wing Cascading Stepped Pillars */}
                <div className="flex items-end gap-2 lg:gap-3.5 h-full">
                  <div className="w-14 lg:w-24 xl:w-32 h-[76%] rounded-t-[28px] lg:rounded-t-[34px] bg-gradient-to-t from-white/5 via-white/12 to-white/20 border-t border-r border-white/20 backdrop-blur-xs" />
                  <div className="w-14 lg:w-20 xl:w-28 h-[58%] rounded-t-[24px] lg:rounded-t-[30px] bg-gradient-to-t from-white/8 via-white/15 to-white/22 border-t border-x border-white/20 backdrop-blur-xs" />
                  <div className="w-12 lg:w-16 xl:w-24 h-[42%] rounded-t-[20px] lg:rounded-t-[24px] bg-gradient-to-t from-white/10 via-white/18 to-white/25 border-t border-x border-white/25 backdrop-blur-xs" />
                </div>

                {/* Center Area: Completely clear */}

                {/* Right Wing Cascading Stepped Pillars */}
                <div className="flex items-end gap-2 lg:gap-3.5 h-full">
                  <div className="w-12 lg:w-16 xl:w-24 h-[42%] rounded-t-[20px] lg:rounded-t-[24px] bg-gradient-to-t from-white/10 via-white/18 to-white/25 border-t border-x border-white/25 backdrop-blur-xs" />
                  <div className="w-14 lg:w-20 xl:w-28 h-[58%] rounded-t-[24px] lg:rounded-t-[30px] bg-gradient-to-t from-white/8 via-white/15 to-white/22 border-t border-x border-white/20 backdrop-blur-xs" />
                  <div className="w-14 lg:w-24 xl:w-32 h-[76%] rounded-t-[28px] lg:rounded-t-[34px] bg-gradient-to-t from-white/5 via-white/12 to-white/20 border-t border-l border-white/20 backdrop-blur-xs" />
                </div>
              </div>

              {/* Header: Centered White Title, Subtitle, and Galileo White Capsule Switcher */}
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.16]">
                  <CmsRichText text={t(plans.title)} />
                </h2>
                <p className="mt-2.5 text-xs sm:text-[14px] text-blue-100/90 font-normal leading-relaxed max-w-xl mx-auto">
                  {t(plans.subtitle)}
                </p>

                {/* Galileo-style White Pill Switcher with Active Blue Button */}
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white shadow-sm mt-5">
                  <button
                    type="button"
                    onClick={() => setDeploymentMode("cloud")}
                    className={cn(
                      "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap",
                      deploymentMode === "cloud"
                        ? "bg-[#2466CB] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {t(plans.cloudLabel)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeploymentMode("onprem")}
                    className={cn(
                      "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap",
                      deploymentMode === "onprem"
                        ? "bg-[#2466CB] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {t(plans.onpremLabel)}
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Floating White Cards — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
            <div className="relative z-20 -mt-16 sm:-mt-24 lg:-mt-28 flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 lg:gap-4.5 md:max-w-[1240px] md:mx-auto md:px-6 md:pb-0 md:overflow-visible items-stretch">
              {visibleItems(plans.tiers).map((tier) => {
                const TierIcon = iconFor(tier.iconName, Zap);
                return (
                  <div
                    key={tier.id}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none relative p-[36px_6px_6px] rounded-[28px] transition-colors duration-200 hover:bg-[#EBF3FB] focus-within:bg-[#EBF3FB] group/plan"
                  >
                    {/* Top Tag */}
                    <div className="absolute top-0 left-0 right-0 h-[36px] flex items-center justify-center text-[12.5px] font-medium text-[#1E54A8] opacity-0 translate-y-1 transition-all duration-200 group-hover/plan:opacity-100 group-hover/plan:translate-y-0 group-focus-within/plan:opacity-100 group-focus-within/plan:translate-y-0 pointer-events-none">
                      {t(tier.topTag)}
                    </div>

                    {/* Main Card Body */}
                    <div className="bg-white border border-[#ECECEA] rounded-[24px] p-6 sm:p-7 h-full flex flex-col justify-between">
                      <div>
                        {/* Top Icon & Title */}
                        <div className="flex items-center gap-2 text-[17px] sm:text-[18px] font-semibold text-slate-900">
                          <TierIcon
                            className={
                              tier.iconFilled
                                ? "h-[18px] w-[18px] text-[#2466CB] fill-[#2466CB] shrink-0"
                                : "h-[18px] w-[18px] text-[#2466CB] shrink-0"
                            }
                          />
                          <h3 className="text-[17px] sm:text-[18px] font-semibold text-slate-900 tracking-tight m-0">
                            {t(tier.title)}
                          </h3>
                        </div>

                        {/* Subtitle */}
                        <p className="mt-2 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-500 max-w-[32ch] line-clamp-2">
                          {t(tier.subtitle)}
                        </p>

                        {/* Divider 1 */}
                        <hr className="border-0 border-t border-[#ECECEA] my-4" />

                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                          <strong className="text-4xl sm:text-[40px] font-bold text-slate-900 tracking-tight leading-none">
                            {t(tier.tierLabel)}
                          </strong>
                          <span className="text-[12px] text-slate-500 font-normal">
                            / {t(tier.tierSuffix)}
                          </span>
                          <button
                            type="button"
                            aria-label={tier.infoAriaLabel}
                            title={deploymentMode === "cloud" ? tier.cloudTooltip : tier.onpremTooltip}
                            className="inline-flex cursor-help text-slate-400 hover:text-slate-600 transition-colors ml-0.5"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={tier.ctaHref || "/request-demo"}
                          className="mt-4 w-full h-11.5 sm:h-12 rounded-full border border-slate-200 bg-white text-slate-800 font-semibold text-[13.5px] flex items-center justify-center gap-2 transition-all duration-200 group-hover/plan:bg-[#2764B8] group-hover/plan:border-[#2764B8] group-hover/plan:text-white group-focus-within/plan:bg-[#2764B8] group-focus-within/plan:border-[#2764B8] group-focus-within/plan:text-white active:scale-[0.98]"
                        >
                          <span>{t(tier.ctaText)}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/plan:translate-x-1 shrink-0" />
                        </Link>

                        {/* Divider 2 */}
                        <hr className="border-0 border-t border-[#ECECEA] my-4" />

                        {/* Feature List Header */}
                        <p className="text-[12px] sm:text-[12.5px] font-semibold text-slate-900 mb-2.5">
                          {t(tier.featuresTitle)}
                        </p>

                        {/* Feature List */}
                        <ul className="list-none m-0 p-0 grid gap-2.5">
                          {visibleItems(tier.features).map((feature) => {
                            const FeatureIcon = iconFor(feature.iconName, CheckCircle2);
                            return (
                              <li
                                key={feature.id}
                                className="flex items-center gap-2.5 text-[12.5px] sm:text-[13px] text-slate-600 truncate py-0.5"
                              >
                                <FeatureIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{t(feature.text)}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: EFFICIENCY TRAJECTORY & MANUAL VS DIAGNOVA EDGE
          ══════════════════════════════════════════════════════════════ */}
      {efficiency && (
        <section className="w-full bg-white border-t border-slate-200/70 py-16 sm:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-2xl space-y-3">
                <SectionBadge variant="blue">{t(efficiency.badge)}</SectionBadge>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                  <CmsRichText text={t(efficiency.title)} />
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">{t(efficiency.subtitle)}</p>
            </div>

            {/* 12-Col Asymmetric Grid: Left Curve (7) + Right Comparison (5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Left 7 Cols: Rising Efficiency Trajectory (Ref 1) */}
              {(() => {
                const phases = visibleItems(efficiency.phases);
                const phaseData = phases.find((p) => p.id === activeEfficiencyPhase) ?? phases[0];

                return (
                  <div className="lg:col-span-7 rounded-[28px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Top Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0073FC]">
                          {t(efficiency.trajectoryLabel)}
                        </span>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-[#0073FC]" />
                          <span>
                            {t(efficiency.tatLabel)} <strong className="text-slate-900">{t(phaseData?.tat)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex flex-nowrap overflow-x-auto max-w-full scrollbar-hide rounded-full bg-white border border-slate-200 p-1">
                        {phases.map((phase) => (
                          <button
                            key={phase.id}
                            type="button"
                            onClick={() => setActiveEfficiencyPhase(phase.id)}
                            className={cn(
                              "shrink-0 whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer",
                              phaseData?.id === phase.id
                                ? "bg-[#0073FC] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            )}
                          >
                            {t(phase.label)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rising Curve Visual Canvas */}
                    <div className="relative mt-8 pt-4 pb-2">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10 mb-6">
                        {/* Baseline Metric */}
                        <div className="self-end pt-4 sm:pt-16">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600 mb-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            {t(efficiency.beforeLabel)}
                          </div>
                          <div className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                            {t(phaseData?.before)}
                          </div>
                          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-500 max-w-[26ch] leading-relaxed">
                            {t(phaseData?.beforeSub)}
                          </p>
                        </div>

                        {/* Post-Implementation Metric */}
                        <div className="text-right flex flex-col items-end">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EBF3FF] border border-blue-200 text-[11px] font-semibold text-[#0073FC] mb-2">
                            <TrendingUp className="h-3 w-3" />
                            {t(efficiency.afterLabel)}
                          </div>
                          <div className="font-display text-4xl sm:text-5xl font-bold text-[#0073FC] tracking-tight">
                            {t(phaseData?.after)}
                          </div>
                          <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 max-w-[28ch] leading-relaxed">
                            {t(phaseData?.afterSub)}
                          </p>
                        </div>
                      </div>

                      {/* Smooth Rising SVG Trajectory */}
                      <div className="w-full h-36 sm:h-44 relative">
                        <svg
                          viewBox="0 0 640 160"
                          preserveAspectRatio="none"
                          className="w-full h-full overflow-visible"
                          aria-hidden="true"
                        >
                          <defs>
                            <linearGradient id="diagnovaCurveFill" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#0073FC" stopOpacity="0.06" />
                              <stop offset="60%" stopColor="#0073FC" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#0073FC" stopOpacity="0.34" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M 0 132 L 175 132 C 250 132, 315 24, 395 24 L 640 24 L 640 160 L 0 160 Z"
                            fill="url(#diagnovaCurveFill)"
                          />
                          <path
                            d="M 0 132 L 175 132 C 250 132, 315 24, 395 24 L 640 24"
                            fill="none"
                            stroke="#0073FC"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="90" cy="132" r="5" fill="#FFFFFF" stroke="#64748B" strokeWidth="2.5" />
                          <circle cx="430" cy="24" r="5.5" fill="#FFFFFF" stroke="#0073FC" strokeWidth="3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Right 5 Cols: Manual vs Diagnova Enterprise Edge */}
              <div className="lg:col-span-5 rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {t(efficiency.comparisonLabel)}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                        {t(efficiency.comparisonTitle)}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EBF3FF] text-[#0073FC] text-[11px] font-semibold">
                      {t(efficiency.comparisonBadge)}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {visibleItems(efficiency.rows).map((row) => (
                      <div key={row.id} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="text-xs font-semibold text-slate-900 mb-2">{t(row.title)}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-[12px]">
                          <div className="rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-slate-500">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                              {t(efficiency.manualLabel)}
                            </span>
                            {t(row.manual)}
                          </div>
                          <div className="rounded-xl bg-[#F4F8FF] border border-blue-200/80 px-3 py-2 text-slate-800">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#0073FC] mb-0.5">
                              {t(efficiency.diagnovaLabel)}
                            </span>
                            {t(row.diagnova)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: 4-WEEK GO-LIVE GANTT TIMELINE (Ref 5/6)
          ══════════════════════════════════════════════════════════════ */}
      {rollout && (
        <section className="w-full bg-[#F7F9FC] border-t border-slate-200/70 py-16 sm:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-2xl space-y-3">
                <SectionBadge variant="blue">{t(rollout.badge)}</SectionBadge>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                  <CmsRichText text={t(rollout.title)} />
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">{t(rollout.subtitle)}</p>
            </div>

            {(() => {
              const ganttPhases = visibleItems(rollout.phases).map((phase, idx) => ({
                ...phase,
                ...GANTT_COLUMNS[Math.min(idx, GANTT_COLUMNS.length - 1)],
              }));
              const selected = ganttPhases[activeGanttWeek] ?? ganttPhases[0];

              return (
                <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs">
                  {/* Mobile Week Pill Switcher */}
                  <div className="flex md:hidden items-center gap-2 overflow-x-auto scrollbar-hide pb-3.5 mb-4 border-b border-slate-200/80">
                    {ganttPhases.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveGanttWeek(idx)}
                        className={cn(
                          "shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer",
                          activeGanttWeek === idx
                            ? "bg-[#0073FC] text-white"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {t(p.week)}
                      </button>
                    ))}
                  </div>

                  {/* 4-Column Week Header (Desktop) */}
                  <div className="hidden md:grid grid-cols-4 gap-4 border-b border-slate-200/80 pb-4 mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {ganttPhases.map((p, idx) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActiveGanttWeek(idx)}
                        className={cn(
                          "text-left flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                          activeGanttWeek === idx
                            ? "bg-[#EBF3FF] text-[#0073FC]"
                            : "hover:bg-slate-50 text-slate-500"
                        )}
                      >
                        <span>{t(p.week)}</span>
                        <span className="text-[10px] font-medium opacity-80">0{idx + 1}</span>
                      </button>
                    ))}
                  </div>

                  {/* Gantt Track Rows */}
                  <div className="space-y-3.5 relative">
                    {ganttPhases.map((phase, idx) => {
                      const isActive = activeGanttWeek === idx;
                      return (
                        <div key={phase.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          <button
                            type="button"
                            onClick={() => setActiveGanttWeek(idx)}
                            className={cn(
                              phase.colStart,
                              phase.colSpan,
                              "w-full text-left rounded-2xl border px-4 py-3.5 transition-all flex items-center justify-between gap-4 cursor-pointer",
                              isActive
                                ? "bg-[#0073FC] border-[#0073FC] text-white shadow-sm"
                                : "bg-[#FAFBFD] border-slate-200/90 text-slate-800 hover:border-blue-300"
                            )}
                          >
                            <div className="min-w-0">
                              <span
                                className={cn(
                                  "block text-[11px] font-semibold uppercase tracking-wider",
                                  isActive ? "text-blue-100" : "text-[#0073FC]"
                                )}
                              >
                                {t(phase.week)}
                              </span>
                              <span className="block text-sm font-bold truncate mt-0.5">{t(phase.title)}</span>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-white border border-slate-200 text-slate-600"
                              )}
                            >
                              {t(phase.tag)}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Phase Detail Strip */}
                  {selected && (
                    <div className="mt-7 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-3xl">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#0073FC]">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            {t(selected.week)} — {t(selected.title)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{t(selected.deliverables)}</p>
                      </div>
                      <div className="shrink-0 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 px-4 py-3 text-xs">
                        <span className="block text-slate-400 font-medium">{t(rollout.ownerLabel)}</span>
                        <span className="block text-slate-900 font-semibold mt-0.5">{t(selected.owner)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      {content.cta && (
        <CTABanner
          initialData={toCtaBannerData(content.cta)}
          bgClassName="bg-white border-t border-slate-200/60"
          topColor="#FFFFFF"
        />
      )}
    </div>
  );
}
