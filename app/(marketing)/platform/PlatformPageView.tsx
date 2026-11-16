"use client";

import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Server,
  Lock,
  BarChart3,
  Cpu,
  FileCheck2,
  QrCode,
  Activity,
  Headphones,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { CmsRichText, useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { platformPage } from "@/content/pages/platform";

type PlatformContent = PageContentOf<typeof platformPage>;
type AutomationContent = NonNullable<PlatformContent["automation"]>;

/** Ikon yang dapat dipilih dari CMS (`iconName`). Nama tidak dikenal -> Activity. */
const ICONS: Record<string, LucideIcon> = {
  Lock,
  FileCheck2,
  Clock,
  Cpu,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Server,
  Zap,
  QrCode,
  Activity,
  Headphones,
  Building2,
};
const FALLBACK_ICON: LucideIcon = Activity;
const getIcon = (name: string | undefined): LucideIcon => (name && ICONS[name]) || FALLBACK_ICON;

/** Posisi node satelit pada orbit jaringan (urutan: atas, kanan, bawah, kiri). */
const NETWORK_NODE_POSITIONS = [
  "-top-3 left-1/2 -translate-x-1/2",
  "top-1/2 -right-6 sm:-right-8 -translate-y-1/2",
  "-bottom-3 left-1/2 -translate-x-1/2",
  "top-1/2 -left-7 sm:-left-10 -translate-y-1/2",
];

/** Tinggi bar ilustrasi Edge Buffer (visual, bukan konten). */
const EDGE_BUFFER_BARS = [65, 85, 72, 95, 80, 90, 75, 100];

export function PlatformPageView({ content }: { content: PlatformContent }) {
  const t = useCmsText();
  const [activeSlaSlot, setActiveSlaSlot] = useState<number>(1);

  const { hero, workflow, automation, reporting, analytics, reliability, cta } = content;

  // Adapter ke props `initialData` milik komponen bersama (bentuk lama: *Id / *En).
  const workflowInitialData = workflow
    ? {
        section: {
          badgeId: workflow.badge?.id,
          badgeEn: workflow.badge?.en,
          titleId: workflow.title?.id,
          titleEn: workflow.title?.en,
          subtitleId: workflow.subtitle?.id,
          subtitleEn: workflow.subtitle?.en,
          extraContent: {
            steps: visibleItems(workflow.steps).map((step) => ({
              titleId: step.title?.id,
              titleEn: step.title?.en,
              shortTitleId: step.shortTitle?.id,
              shortTitleEn: step.shortTitle?.en,
              descriptionId: step.description?.id,
              descriptionEn: step.description?.en,
            })),
          },
        },
      }
    : null;

  const ctaInitialData = cta
    ? {
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
      }
    : null;

  const slaSlots = reliability ? visibleItems(reliability.support?.slots) : [];
  const currentSlot = slaSlots[activeSlaSlot] ?? slaSlots[0];

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
          primaryCta={
            hero.primaryCta
              ? {
                  text: t(hero.primaryCta.text),
                  href: hero.primaryCta.href,
                }
              : undefined
          }
          secondaryCta={
            hero.secondaryCta
              ? {
                  text: t(hero.secondaryCta.text),
                  href: hero.secondaryCta.href,
                }
              : undefined
          }
          metrics={visibleItems(hero.metrics).map((metric) => ({
            value: metric.value,
            label: t(metric.label),
            sub: t(metric.sub),
          }))}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: #workflow - Alur Kerja 4 Tahap
          (Menggunakan komponen asli Home Page yang rapi & interaktif)
          ══════════════════════════════════════════════════════════════ */}
      {workflow && (
        <div id="workflow" className="scroll-mt-28">
          <WorkflowSection initialData={workflowInitialData} />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #automation - 100% Otomatisasi & Interfacing
          (Alternating background: #F9F9F9, Card rounded-3xl)
          ══════════════════════════════════════════════════════════════ */}
      {automation && (
        <section
          id="automation"
          className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Section Header */}
            <div className="mb-10 sm:mb-14">
              <div className="mb-4">
                <SectionBadge variant="blue">{t(automation.badge)}</SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
                <CmsRichText text={t(automation.title)} />
              </h2>
              <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                {t(automation.subtitle)}
              </p>
            </div>

            {/* 3 Bento Cards — Horizontal snap-scroll on mobile, 3-column grid on md+ */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
              {visibleItems(automation.cards).map((card) => (
                <div
                  key={card.id}
                  className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group"
                >
                  <AutomationVisual visual={card.visual} automation={automation} t={t} />

                  {/* Bottom Content */}
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0073FC] transition-colors">
                      {t(card.title)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">{t(card.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #reporting - Digital Audit Trail & Medical Reporting
          (Dynamic 2-Column Showcase with Real Desktop Workstation + Floating Accent Card)
          ══════════════════════════════════════════════════════════════ */}
      {reporting && (
        <section
          id="reporting"
          className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Context & Accreditation Details (Original Style) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="mb-4">
                  <SectionBadge variant="blue">{t(reporting.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
                  <CmsRichText text={t(reporting.title)} />
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                  {t(reporting.subtitle)}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                  {visibleItems(reporting.features).map((feature) => {
                    const FeatureIcon = getIcon(feature.iconName);
                    return (
                      <div
                        key={feature.id}
                        className="rounded-[20px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-[#2764B8] font-bold text-sm">
                          <FeatureIcon className="h-4 w-4" />
                          <span>{t(feature.title)}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">{t(feature.desc)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Modern Desktop Workstation Showcase with Floating Accent Card (Shifted to the Right, Compact Width) */}
              <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex justify-end pb-8 sm:pb-10 lg:pb-0 w-full">
                {/* Monitor Chassis Container (Precisely Flush to Max Content Right Edge, No Translate Offset) */}
                <div className="relative z-10 w-full ml-auto max-w-[540px] sm:max-w-[580px] lg:max-w-[600px]">
                  {/* 1. Monitor Bezel Frame */}
                  <div className="rounded-[22px] sm:rounded-[26px] bg-slate-900 p-2 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(31,45,93,0.25)] border border-slate-700/80 transition-all duration-300">
                    {/* Subtle top bezel webcam indicator */}
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700 mx-auto mb-1.5 shadow-inner" />

                    {/* 2. Inner Display Screen (Crisp Medical LIS Interface) */}
                    <div className="rounded-xl bg-white overflow-hidden border border-slate-200/60 shadow-inner">
                      {/* Display Titlebar */}
                      <div className="bg-[#FAFBFD] px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-300 inline-block" />
                          </div>
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-800 shadow-2xs">
                            <FileCheck2 className="h-3 w-3 text-[#2764B8]" />
                            <span>{t(reporting.mockup?.orderLabel)}</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold font-mono">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{t(reporting.mockup?.ingestStatus)}</span>
                        </div>
                      </div>

                      {/* Patient & Specimen Info Header */}
                      <div className="p-3.5 sm:p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[#EBF3FB] text-[#2764B8] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0">
                            {t(reporting.mockup?.patientInitials)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900">
                                {t(reporting.mockup?.patientName)}
                              </h4>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                                {t(reporting.mockup?.priorityBadge)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {t(reporting.mockup?.patientMeta)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            <span>{t(reporting.mockup?.tatLabel)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Clinical Telemetry Table */}
                      <div className="p-3 sm:p-4 space-y-1.5 bg-white">
                        <div className="rounded-lg border border-slate-200/90 overflow-hidden shadow-2xs">
                          <div className="bg-slate-50/90 px-3.5 py-1.5 border-b border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12">
                            <span className="col-span-5">{t(reporting.mockup?.headerParameter)}</span>
                            <span className="col-span-3 text-right">{t(reporting.mockup?.headerResult)}</span>
                            <span className="col-span-2 text-right hidden sm:block">
                              {t(reporting.mockup?.headerReference)}
                            </span>
                            <span className="col-span-4 sm:col-span-2 text-right">
                              {t(reporting.mockup?.headerStatus)}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100 text-[11px]">
                            {visibleItems(reporting.mockup?.rows).map((row) => (
                              <div
                                key={row.id}
                                className="px-3.5 py-2 grid grid-cols-12 items-center hover:bg-slate-50/50"
                              >
                                <div className="col-span-5">
                                  <span className="font-bold text-slate-900 block">{row.name}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">{row.source}</span>
                                </div>
                                <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                                  {row.value} <span className="text-[9px] font-normal text-slate-500">{row.unit}</span>
                                </div>
                                <div className="col-span-2 text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                                  {row.range}
                                </div>
                                <div className="col-span-4 sm:col-span-2 text-right">
                                  <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {row.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Doctor Digital E-Signature Strip */}
                      <div className="px-3.5 py-2.5 bg-[#F8FBFE] border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileCheck2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">
                                {t(reporting.mockup?.signerName)}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400">
                                {t(reporting.mockup?.signTime)}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-700 font-semibold block">
                              {t(reporting.mockup?.signCertification)}
                            </span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#2764B8] border border-blue-200/80 text-[10px] font-semibold shadow-2xs">
                          <QrCode className="h-3 w-3" />
                          <span>{t(reporting.mockup?.fhirBadge)}</span>
                        </span>
                      </div>

                      {/* Cryptographic Console Footer */}
                      <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-[#2764B8]" />
                          {t(reporting.mockup?.hashLabel)}
                        </span>
                        <span className="text-[#2764B8] font-bold">{t(reporting.mockup?.complianceLabel)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Sleek Minimalist Hardware Stand Base */}
                  <div className="w-14 h-5 sm:h-6 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-400 mx-auto shadow-inner" />
                  <div className="w-44 sm:w-56 h-2 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-full mx-auto shadow-md" />

                  {/* 4. Overlapping Floating Accent Card (Inspired by Modern LIS Showcase Architecture) */}
                  <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-6 z-20 max-w-[260px] sm:max-w-[290px] bg-[#0073FC] text-white p-4 sm:p-5 rounded-2xl shadow-[0_20px_45px_rgba(0,115,252,0.38)] border border-blue-300/30 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white leading-tight">
                          {t(reporting.floatingCard?.title)}
                        </h5>
                        <span className="text-[10px] text-blue-100 font-mono">
                          {t(reporting.floatingCard?.subtitle)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-blue-50/90 leading-relaxed font-normal">
                      {t(reporting.floatingCard?.desc)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: #analytics - Nova AI & Analitik Operasional
          (Alternating background: #F9F9F9)
          ══════════════════════════════════════════════════════════════ */}
      {analytics && (
        <section
          id="analytics"
          className="relative scroll-mt-28 w-full bg-[#FAFBFD] border-t border-slate-200/60 py-16 sm:py-20 lg:py-24 overflow-hidden"
        >
          <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
            {/* Section Header */}
            <div className="mb-10 sm:mb-14">
              <div className="mb-4">
                <SectionBadge variant="blue">{t(analytics.badge)}</SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
                <CmsRichText text={t(analytics.title)} />
              </h2>
              <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                {t(analytics.subtitle)}
              </p>
            </div>

            {/* 3 LigoLab-Standard Intelligence Cards — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
              {visibleItems(analytics.cards).map((card) => {
                const CardIcon = getIcon(card.iconName);
                return (
                  <div
                    key={card.id}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-9 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-start group"
                  >
                    {/* Header: Icon Badge + Blue Title */}
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] border border-blue-100/70 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 transition-transform">
                        <CardIcon className="h-6 w-6 stroke-[1.8]" />
                      </div>
                      <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#2764B8] leading-tight group-hover:text-[#1B4B9C] transition-colors">
                        <CmsRichText text={t(card.title)} />
                      </h3>
                    </div>

                    {/* Bullet Points */}
                    <ul className="space-y-3.5 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                      {visibleItems(card.bullets).map((bullet) => (
                        <li key={bullet.id} className="flex items-start gap-2.5">
                          <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                          <span>{t(bullet.text)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: 24/7 SLA, ROADMAP & MULTI-SITE NETWORK BENTO (Ref 2)
          ══════════════════════════════════════════════════════════════ */}
      {reliability && (
        <section className="w-full bg-[#FAFBFD] border-t border-slate-200/70 py-16 sm:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-2xl space-y-3">
                <SectionBadge variant="blue">{t(reliability.badge)}</SectionBadge>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                  <CmsRichText text={t(reliability.title)} />
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">{t(reliability.subtitle)}</p>
            </div>

            <div className="space-y-6">
              {/* Wide Top Bento Card: 24/7/365 Support SLA */}
              <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-9 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#EBF3FF] px-3 py-1.5 text-xs font-semibold text-[#0073FC]">
                    <Headphones className="h-4 w-4" />
                    <span>{t(reliability.support?.badge)}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-snug">
                    {t(reliability.support?.title)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t(currentSlot?.detail)}</p>
                  <div className="pt-1 flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      {t(reliability.support?.targetResponseLabel)}{" "}
                      <strong className="text-slate-900">{t(currentSlot?.sla)}</strong>
                    </span>
                    <span className="h-3 w-px bg-slate-200" />
                    <span>
                      {t(reliability.support?.uptimeLabel)}{" "}
                      <strong className="text-[#0073FC]">{t(reliability.support?.uptimeValue)}</strong>
                    </span>
                  </div>
                </div>

                {/* Interactive Vertical Wheel / Selector */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-2">
                  <div className="w-full max-w-lg space-y-2.5">
                    {slaSlots.map((slot, idx) => {
                      const isSelected = currentSlot === slot;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setActiveSlaSlot(idx)}
                          className={cn(
                            "w-full rounded-2xl border px-5 py-3.5 transition-all flex items-center justify-between gap-4 cursor-pointer",
                            isSelected
                              ? "bg-white border-[#0073FC] shadow-md scale-[1.02]"
                              : "bg-slate-50/70 border-slate-200/60 opacity-65 hover:opacity-100"
                          )}
                        >
                          <div className="flex items-center gap-3 sm:gap-5 text-left">
                            <span
                              className={cn(
                                "font-display text-sm sm:text-base font-bold tabular-nums",
                                isSelected ? "text-slate-900" : "text-slate-500"
                              )}
                            >
                              {t(slot.window)}
                            </span>
                            <span className="h-4 w-px bg-slate-200" />
                            <span
                              className={cn(
                                "text-xs sm:text-sm font-medium",
                                isSelected ? "text-slate-700" : "text-slate-500"
                              )}
                            >
                              {t(slot.shift)}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors",
                              isSelected
                                ? "bg-[#0073FC] text-white"
                                : "bg-white border border-slate-200 text-slate-600"
                            )}
                          >
                            {isSelected ? t(reliability.support?.activeLabel) : t(slot.sla)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2 Bottom Bento Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bottom Left Card: Connected LIS & AI Strategy Roadmap */}
                <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                  {/* Milestone Visual */}
                  <div className="relative h-44 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 p-5 overflow-hidden mb-6 flex items-center justify-center">
                    <svg viewBox="0 0 420 120" className="w-full h-full overflow-visible" aria-hidden="true">
                      <line x1="20" y1="88" x2="145" y2="54" stroke="#93C5FD" strokeWidth="2" />
                      <line x1="145" y1="54" x2="265" y2="72" stroke="#93C5FD" strokeWidth="2" />
                      <line x1="265" y1="72" x2="395" y2="26" stroke="#0073FC" strokeWidth="2" />
                      <circle cx="20" cy="88" r="5" fill="#0073FC" />
                      <circle cx="145" cy="54" r="6" fill="#0073FC" />
                      <circle cx="265" cy="72" r="5.5" fill="#0073FC" />
                      <circle cx="395" cy="26" r="6.5" fill="#0073FC" />
                    </svg>
                    <div className="absolute top-5 left-12 sm:left-20 rounded-full bg-white border border-slate-200/90 shadow-xs px-3.5 py-1.5 text-xs font-semibold text-slate-800">
                      {t(reliability.roadmap?.topPill)}
                    </div>
                    <div className="absolute bottom-5 right-8 sm:right-14 rounded-full bg-white border border-blue-200 shadow-xs px-3.5 py-1.5 text-xs font-semibold text-[#0073FC]">
                      {t(reliability.roadmap?.bottomPill)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-slate-900">{t(reliability.roadmap?.title)}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{t(reliability.roadmap?.desc)}</p>
                  </div>
                </div>

                {/* Bottom Right Card: Multi-Site Hospital Network Orbital Ring */}
                <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                  {/* Orbital Network Visual */}
                  <div className="relative h-44 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 p-4 overflow-hidden mb-6 flex items-center justify-center">
                    <div className="relative h-32 w-32 rounded-full border border-dashed border-blue-200 flex items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-white border-2 border-[#0073FC]/30 shadow-sm flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0073FC]">
                          {t(reliability.network?.hubBrand)}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-800">
                          {t(reliability.network?.hubLabel)}
                        </span>
                      </div>

                      {/* Satellite Nodes */}
                      {visibleItems(reliability.network?.nodes).map((node, idx) => (
                        <div
                          key={node.id}
                          className={cn(
                            "absolute px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 flex items-center gap-1",
                            NETWORK_NODE_POSITIONS[idx % NETWORK_NODE_POSITIONS.length]
                          )}
                        >
                          <Building2 className="h-3 w-3 text-[#0073FC]" />
                          <span>{t(node.label)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-slate-900">{t(reliability.network?.title)}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{t(reliability.network?.desc)}</p>
                  </div>
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
          initialData={ctaInitialData}
          bgClassName="bg-white border-t border-slate-200/60"
          topColor="#FFFFFF"
        />
      )}
    </div>
  );
}

/** Ilustrasi bagian atas kartu #automation, dipilih dari `card.visual`. */
function AutomationVisual({
  visual,
  automation,
  t,
}: {
  visual: string;
  automation: AutomationContent;
  t: ReturnType<typeof useCmsText>;
}) {
  if (visual === "autoVerification") {
    const v = automation.autoVerificationVisual;
    return (
      <>
        {/* Top Visual Stage: Clinical Rule Decision Tree */}
        <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
          <div className="w-full max-w-[300px] flex flex-col items-center">
            {/* Inbound Specimen Node */}
            <div className="w-fit bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs text-[11px] font-mono font-semibold text-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0073FC]" />
              <span>{t(v?.specimenLabel)}</span>
              <span className="text-[10px] font-sans font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {t(v?.specimenStatus)}
              </span>
            </div>

            {/* Crisp SVG Branch Connectors */}
            <svg viewBox="0 0 240 28" className="w-56 h-7 overflow-visible" aria-hidden="true">
              <path d="M 120 0 L 120 12 L 56 12 L 56 28" fill="none" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.65" />
              <path d="M 120 0 L 120 12 L 184 12 L 184 28" fill="none" stroke="#0073FC" strokeWidth="1.5" strokeOpacity="0.65" />
            </svg>

            {/* Branching Split Cards */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200/90 shadow-xs space-y-1.5 transition-transform duration-300 group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t(v?.releaseLabel)}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-emerald-100 overflow-hidden">
                  <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">{t(v?.releaseStat)}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-blue-200/90 shadow-xs space-y-1.5 transition-transform duration-300 delay-75 group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0073FC]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {t(v?.triageLabel)}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full w-[25%] rounded-full bg-[#0073FC]" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono block">{t(v?.triageStat)}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (visual === "edgeBuffer") {
    const v = automation.edgeBufferVisual;
    return (
      <>
        {/* Top Visual Stage: Edge Buffer Health Monitor */}
        <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
          <div className="w-full max-w-[300px] rounded-xl bg-white border border-slate-200/90 shadow-sm p-3.5 space-y-3">
            {/* Status Header */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-[#0073FC]" />
                {t(v?.gatewayLabel)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t(v?.retentionLabel)}
              </span>
            </div>

            {/* Buffer Channel Sync Bars */}
            <div className="flex items-end justify-between gap-1.5 h-10 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
              {EDGE_BUFFER_BARS.map((h, i) => (
                <div key={i} className="flex-1 h-full flex items-end">
                  <div
                    className="w-full rounded-sm bg-[#0073FC]/85 origin-bottom transition-transform duration-300 group-hover:scale-y-110"
                    style={{ height: `${h}%`, transitionDelay: `${i * 35}ms` }}
                  />
                </div>
              ))}
            </div>

            {/* Packet Resync Footer */}
            <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
              <span className="text-slate-500">{t(v?.queueLabel)}</span>
              <span className="text-[#0073FC] font-bold">{t(v?.zeroLossLabel)}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default: "telemetry"
  const v = automation.telemetryVisual;
  return (
    <>
      {/* Top Visual Stage: Live Telemetry Pipeline */}
      <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
        <div className="w-full max-w-[300px] rounded-xl bg-white border border-slate-200/90 shadow-sm p-3.5 space-y-3">
          {/* Instrument -> LIS Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono font-semibold text-slate-800 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-[#0073FC]" />
              <span>{t(v?.instrument)}</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 px-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0073FC] animate-pulse" />
              <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-300 to-[#0073FC] rounded-full" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#0073FC]" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-[#0073FC] text-[11px] font-semibold text-white flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-100" />
              <span>{t(v?.host)}</span>
            </div>
          </div>

          {/* TAT Progress Comparison */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 line-through font-mono">{t(v?.manualLabel)}</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                {t(v?.ingestedLabel)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[86%] group-hover:w-[96%] transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-[#0073FC] to-emerald-500" />
            </div>
          </div>

          {/* Live Parameter Telemetry Strip */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50/90 border border-slate-200/60 px-2.5 py-1.5 text-[10px] font-mono text-slate-600">
            {visibleItems(v?.params).map((param, idx) => (
              <React.Fragment key={param.id}>
                {idx > 0 && <span className="text-slate-300">·</span>}
                <span>{t(param.text)}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
