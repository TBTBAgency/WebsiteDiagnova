"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  FileText,
  Cpu,
  ShieldCheck,
  Wifi,
  ArrowRight,
  Lock,
  Server,
  FileCheck2,
  BadgeCheck,
  Activity,
  Search,
  Sparkles,
  Play,
  Pause,
  Send,
  Plus,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { CmsRichText, useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { integrationPage } from "@/content/pages/integration";

type IntegrationContent = PageContentOf<typeof integrationPage>;
type CtaContent = NonNullable<IntegrationContent["cta"]>;

const ICONS: Record<string, LucideIcon> = {
  Network,
  FileText,
  Cpu,
  ShieldCheck,
  Wifi,
  Lock,
  Server,
  FileCheck2,
  BadgeCheck,
  Activity,
};

function getIcon(name: string | undefined, fallback: LucideIcon = Network): LucideIcon {
  return (name && ICONS[name]) || fallback;
}

// Geometri konektor diagram (desktop). Slot kiri/kanan diisi berurutan oleh item dengan `side` terkait.
const LEFT_CONNECTORS = [
  { d: "M 392 64 C 430 64, 430 110, 468 110", px: 392, py: 64 },
  { d: "M 392 156 C 430 156, 430 110, 468 110", px: 392, py: 156 },
];
const RIGHT_CONNECTORS = [
  { d: "M 732 110 C 770 110, 770 38, 808 38", px: 808, py: 38 },
  { d: "M 732 110 L 808 110", px: 808, py: 110 },
  { d: "M 732 110 C 770 110, 770 182, 808 182", px: 808, py: 182 },
];
const FALLBACK_CONNECTOR_PATH = "M 732 110 C 770 110, 770 182, 808 182";

/** Props CTABanner (komponen bersama) dari section CMS `cta`. */
export function toCtaBannerData(cta: CtaContent) {
  return {
    section: {
      titleId: cta.title?.id,
      titleEn: cta.title?.en,
      subtitleId: cta.subtitle?.id,
      subtitleEn: cta.subtitle?.en,
      extraContent: {
        buttonTextId: cta.buttonText?.id,
        buttonTextEn: cta.buttonText?.en,
        placeholderId: cta.emailPlaceholder?.id,
        placeholderEn: cta.emailPlaceholder?.en,
      },
    },
  };
}

export function IntegrationPageView({ content }: { content: IntegrationContent }) {
  const t = useCmsText();
  const integrations = visibleItems(content.integrations?.items);
  const integrationCount = integrations.length;
  const validationModes = visibleItems(content.architecture?.validation?.modes);

  const [selectedIntegration, setSelectedIntegration] = useState<number>(0);
  const [autoCycle, setAutoCycle] = useState<boolean>(false);
  const [validationMode, setValidationMode] = useState<string>(validationModes[0]?.id ?? "");
  const [analyzerQuery, setAnalyzerQuery] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  useEffect(() => {
    if (!autoCycle || integrationCount === 0) return;
    const timer = setInterval(() => {
      setSelectedIntegration((prev) => (prev + 1) % integrationCount);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoCycle, integrationCount]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = integrations.findIndex((item) => item.id === hash);
        if (foundIndex !== -1) setSelectedIntegration(foundIndex);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = integrations[selectedIntegration] ?? integrations[0];

  const selectPillar = (idx: number) => {
    setAutoCycle(false);
    setSelectedIntegration(idx);
    window.history.replaceState(null, "", `#${integrations[idx].id}`);
  };

  // Pembagian simpul kiri/kanan diagram (urutan array dipertahankan).
  const leftIndexes: number[] = [];
  const rightIndexes: number[] = [];
  integrations.forEach((item, idx) => {
    if (item.side === "left") leftIndexes.push(idx);
    else rightIndexes.push(idx);
  });
  const connectorLines = [
    ...LEFT_CONNECTORS.slice(0, leftIndexes.length).map((c, slot) => ({ ...c, idx: leftIndexes[slot] })),
    ...RIGHT_CONNECTORS.slice(0, rightIndexes.length).map((c, slot) => ({ ...c, idx: rightIndexes[slot] })),
  ];
  const activeConnectorPath =
    connectorLines.find((line) => line.idx === selectedIntegration)?.d ?? FALLBACK_CONNECTOR_PATH;

  const analyzers = content.analyzers;
  const disciplines = visibleItems(analyzers?.disciplines);
  const disciplineLabel = (key: string) => {
    const found = disciplines.find((d) => d.id === key);
    return found ? t(found.tableLabel) : "";
  };
  const analyzerCatalog = visibleItems(analyzers?.rows).map((row) => ({
    ...row,
    label: disciplineLabel(row.discipline),
  }));

  const filteredAnalyzers = analyzerCatalog.filter((row) => {
    const matchDisc = selectedDiscipline === "all" || row.discipline === selectedDiscipline;
    const q = analyzerQuery.trim().toLowerCase();
    if (!q) return matchDisc;
    return (
      matchDisc &&
      (row.maker.toLowerCase().includes(q) ||
        row.models.toLowerCase().includes(q) ||
        row.protocol.toLowerCase().includes(q) ||
        row.label.toLowerCase().includes(q))
    );
  });

  const hero = content.hero;
  const explorer = content.explorer;
  const architecture = content.architecture;
  const compliance = content.compliance;

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      {hero && (
        <PageHero
          badge={t(hero.badge)}
          title={<CmsRichText text={t(hero.title)} breakClassName="hidden sm:inline" />}
          subtitle={t(hero.subtitle)}
          primaryCta={{
            text: t(hero.primaryCta.text),
            href: hero.primaryCta.href,
          }}
          secondaryCta={{
            text: t(hero.secondaryCta.text),
            href: hero.secondaryCta.href,
          }}
          metrics={visibleItems(hero.metrics).map((m) => ({
            value: t(m.value),
            label: t(m.label),
            sub: t(m.sub),
          }))}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: ATTIO-STYLE CONNECTED NODE CANVAS & WORKFLOW SPLIT (#integration-explorer)
          ══════════════════════════════════════════════════════════════ */}
      {explorer && current && (
        <section
          id="integration-explorer"
          className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-y border-slate-200/70 scroll-mt-20"
        >
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(explorer.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                  {t(explorer.title)}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="max-w-sm text-sm leading-relaxed text-slate-600 font-normal">
                  {t(explorer.description)}
                </p>
                <button
                  type="button"
                  onClick={() => setAutoCycle((prev) => !prev)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0",
                    autoCycle
                      ? "bg-[#0073FC] text-white border-[#0073FC] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {autoCycle ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{autoCycle ? t(explorer.pauseTourLabel) : t(explorer.autoTourLabel)}</span>
                </button>
              </div>
            </div>

            {/* Reference 2: Light Dot-Grid Node Canvas with Crisp Opaque Nodes & Flush Connectors */}
            <div
              className="relative rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-8 mb-10 overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              {/* Soft radial white fade on edges */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(255,255,255,0.85)_100%)]" />

              {/* Desktop Dashed Bezier Connectors (Flush with Card Borders) */}
              <svg
                className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-0"
                viewBox="0 0 1200 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {connectorLines.map((line) => {
                  const isActive = selectedIntegration === line.idx;
                  return (
                    <g key={line.idx}>
                      <path
                        d={line.d}
                        fill="none"
                        stroke={isActive ? "#0073FC" : "#CBD5E1"}
                        strokeWidth={isActive ? "2" : "1.5"}
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx={line.px}
                        cy={line.py}
                        r="3.5"
                        fill={isActive ? "#0073FC" : "#CBD5E1"}
                      />
                    </g>
                  );
                })}
                <circle r="3.5" fill="#0073FC">
                  <animateMotion dur="1.5s" repeatCount="indefinite" path={activeConnectorPath} />
                </circle>
              </svg>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                {/* Left Nodes */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                  {leftIndexes.map((idx) => {
                    const item = integrations[idx];
                    const Icon = getIcon(item.iconName);
                    const active = selectedIntegration === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPillar(idx)}
                        className={cn(
                          "group w-full text-left rounded-2xl px-4 py-3.5 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer bg-white",
                          active
                            ? "border-[#0073FC]/60 ring-4 ring-blue-50 shadow-sm"
                            : "border-slate-200/90 hover:border-slate-300"
                        )}
                      >
                        <div className={cn("flex items-center gap-3 min-w-0 transition-opacity", active ? "opacity-100" : "opacity-65 group-hover:opacity-100")}>
                          <div className="h-9 w-9 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{t(item.tabLabel)}</p>
                            <p className="text-[11px] text-slate-500 truncate">{t(item.shortDesc)}</p>
                          </div>
                        </div>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {active ? t(explorer.activeLabel) : t(explorer.inspectLabel)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Center Double-Ringed Hub Card */}
                <div className="lg:col-span-4 flex justify-center py-2">
                  <div className="w-full max-w-[270px] rounded-2xl bg-white border border-slate-200 ring-4 ring-slate-100/90 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
                          <Server className="h-4 w-4" />
                        </div>
                        <span className="font-display text-sm font-bold text-slate-900">{t(explorer.hub.name)}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t(explorer.hub.liveLabel)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">{t(explorer.hub.stat1Label)}</p>
                        <p className="font-display text-base font-bold text-slate-900 tabular-nums">{explorer.hub.stat1Value}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-medium">{t(explorer.hub.stat2Label)}</p>
                        <p className="font-display text-base font-bold text-emerald-600 tabular-nums">{explorer.hub.stat2Value}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Nodes */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                  {rightIndexes.map((idx) => {
                    const item = integrations[idx];
                    const Icon = getIcon(item.iconName);
                    const active = selectedIntegration === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPillar(idx)}
                        className={cn(
                          "group w-full text-left rounded-2xl px-4 py-3 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer bg-white",
                          active
                            ? "border-[#0073FC]/60 ring-4 ring-blue-50 shadow-sm"
                            : "border-slate-200/90 hover:border-slate-300"
                        )}
                      >
                        <div className={cn("flex items-center gap-3 min-w-0 transition-opacity", active ? "opacity-100" : "opacity-65 group-hover:opacity-100")}>
                          <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{t(item.tabLabel)}</p>
                            <p className="text-[11px] text-slate-500 truncate">{t(item.shortDesc)}</p>
                          </div>
                        </div>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                          {active ? t(explorer.activeLabel) : t(explorer.inspectLabel)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reference 3 & 4: Attio Split Editorial + Vertical Connected Workflow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Editorial + Giant Typographic Metrics */}
              <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#0073FC]">
                    {t(current.tabLabel)}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                    {t(current.name)}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {t(current.tagline)}
                  </p>
                </div>

                {/* Clean Metric Split */}
                <div className="grid grid-cols-2 gap-6 py-5 border-y border-slate-200/80">
                  {visibleItems(current.metrics).map((m) => (
                    <div key={m.id}>
                      <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
                        {m.val}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{t(m.label)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {visibleItems(current.protocols).map((p) => (
                      <span
                        key={p.id}
                        className="rounded-md bg-[#F7F9FC] border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={explorer.consultHref}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0073FC] hover:text-[#005DD1]"
                  >
                    <span>{t(explorer.consultLabel)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right: Attio Vertical Dot-Grid Workflow Cards */}
              <div className="lg:col-span-7">
                <div
                  className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 flex flex-col justify-between"
                  style={{
                    backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-5 border-b border-slate-100">
                    <span className="font-medium text-slate-700">
                      {t(explorer.breadcrumbPrefix)} <strong className="text-slate-900">{t(current.tabLabel)}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-[#0073FC] font-semibold">{t(explorer.pipelineLabel)}</span>
                  </div>

                  <div className="max-w-lg w-full mx-auto">
                    {(() => {
                      const steps = visibleItems(current.workflowSteps);
                      return steps.map((step, i) => (
                        <React.Fragment key={step.id}>
                          <div>
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                {t(step.tag)}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md",
                                  step.status === "Completed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-blue-50 text-[#0073FC]"
                                )}
                              >
                                {step.status === "Completed"
                                  ? t(explorer.statusCompletedLabel)
                                  : t(explorer.statusRunningLabel)}
                              </span>
                            </div>
                            <div
                              className={cn(
                                "rounded-xl bg-white border p-3.5 shadow-2xs transition-colors",
                                step.status === "Completed" ? "border-emerald-300/80" : "border-blue-300"
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs sm:text-sm font-bold text-slate-900">{t(step.title)}</p>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 shrink-0">
                                  {step.chip}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{t(step.desc)}</p>
                            </div>
                          </div>
                          {i < steps.length - 1 && (
                            <div className="flex flex-col items-center py-0.5">
                              <div className="h-3.5 w-px bg-emerald-400" />
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                          )}
                        </React.Fragment>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: GRADEWITHAI-STYLE ARCHITECTURAL HAIRLINE GRID (#architecture)
          ══════════════════════════════════════════════════════════════ */}
      {architecture && (
        <section id="architecture" className="w-full py-16 sm:py-24 bg-white border-b border-slate-200/70">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            {/* Split Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(architecture.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                  {t(architecture.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(architecture.description)}
              </p>
            </div>

            {/* Reference 1: 3x2 Hairline Architectural Grid with Crosshairs (+) & Faded UI Vignettes */}
            <div className="relative border-t border-l border-slate-200/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Cell 1: One-Click Host Query */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <Plus className="h-3.5 w-3.5 text-slate-300 absolute -bottom-[7px] -right-[7px] z-10 bg-white hidden lg:block" />
                <div className="w-full flex flex-col items-center justify-center py-4 relative">
                  <span className="px-4 py-1.5 rounded-lg bg-[#0073FC] text-white text-xs font-semibold shadow-[0_8px_20px_-4px_rgba(0,115,252,0.5)] mb-4">
                    {architecture.hostQuery.chipLabel}
                  </span>
                  <div className="flex items-center gap-3 opacity-45">
                    {visibleItems(architecture.hostQuery.tags).map((tag) => (
                      <div key={tag.id} className="w-12 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-end justify-center pb-2 text-[10px] font-mono font-bold text-slate-500">
                        {tag.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.hostQuery.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.hostQuery.desc)}
                  </p>
                </div>
              </div>

              {/* Cell 2: Scheduled & Cito Sync */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <Plus className="h-3.5 w-3.5 text-slate-300 absolute -bottom-[7px] -right-[7px] z-10 bg-white hidden lg:block" />
                <div className="w-full max-w-[270px] rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs my-2 text-left">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800">{t(architecture.citoPriority.queueTitle)}</span>
                    <span className="px-2 py-0.5 rounded bg-[#0073FC] text-white text-[10px] font-semibold">{t(architecture.citoPriority.syncBadge)}</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-slate-600">
                    {visibleItems(architecture.citoPriority.rows).map((row, i) => (
                      <div
                        key={row.id}
                        className={i === 0 ? "flex items-center justify-between" : "flex items-center justify-between opacity-55"}
                      >
                        <span>{t(row.label)}</span>
                        <span className="font-mono text-slate-400 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.citoPriority.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.citoPriority.desc)}
                  </p>
                </div>
              </div>

              {/* Cell 3: Interactive Validation Approaches (Reference 1: Chill | Strict | + Create New) */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <div className="w-full py-6 flex flex-col items-center">
                  <p className="text-[11px] font-medium text-slate-500 mb-3">
                    {t(architecture.validation.prompt)}
                  </p>
                  <div className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    {validationModes.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setValidationMode(m.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5",
                          validationMode === m.id
                            ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {validationMode === m.id && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                        <span>{t(m.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.validation.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.validation.desc)}
                  </p>
                </div>
              </div>

              {/* Cell 4: Critical Value Highlight (Reference 1: Request Regrade) */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <div className="w-full py-5 relative flex flex-col items-center">
                  <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-slate-800 mb-2">
                    {t(architecture.criticalValue.chipLabel)}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-[230px] select-none">
                    <CmsRichText
                      text={t(architecture.criticalValue.sample)}
                      highlightClassName="bg-[#E8F1FD] text-[#0073FC] font-mono font-bold px-1.5 py-0.5 rounded"
                    />
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.criticalValue.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.criticalValue.desc)}
                  </p>
                </div>
              </div>

              {/* Cell 5: Live Interop Telemetry Chat (Reference 1: Kleo Chat) */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <div className="w-full max-w-[270px] space-y-2 text-left my-2">
                  <div className="ml-auto max-w-[85%] rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-700">
                    {t(architecture.payloadAudit.question)}
                  </div>
                  <div className="mr-auto max-w-[90%] rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700 shadow-2xs">
                    <CmsRichText
                      text={t(architecture.payloadAudit.reply)}
                      highlightClassName="font-semibold text-[#0073FC]"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[11px] text-slate-400">
                    <span>{t(architecture.payloadAudit.inputPlaceholder)}</span>
                    <Send className="h-3 w-3 text-slate-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.payloadAudit.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.payloadAudit.desc)}
                  </p>
                </div>
              </div>

              {/* Cell 6: Tailored LOINC & FHIR Mapper (Reference 1: Tailored Rubric Builder) */}
              <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
                <div className="w-full max-w-[260px] my-2 relative">
                  <div className="flex justify-center mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-[#0073FC]">
                      <Sparkles className="h-3 w-3" /> {t(architecture.loincMapper.chipLabel)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-left text-[11px] space-y-1.5">
                    <div className="grid grid-cols-2 font-bold text-slate-800 pb-1 border-b border-slate-100">
                      <span>{t(architecture.loincMapper.rawColumnLabel)}</span>
                      <span className="text-[#0073FC]">{t(architecture.loincMapper.codeColumnLabel)}</span>
                    </div>
                    {visibleItems(architecture.loincMapper.rows).map((row, i) => (
                      <div
                        key={row.id}
                        className={i === 0 ? "grid grid-cols-2 text-slate-500 font-mono" : "grid grid-cols-2 text-slate-400 font-mono opacity-60"}
                      >
                        <span>{row.raw}</span>
                        <span className={i === 0 ? "text-slate-800" : undefined}>{row.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {t(architecture.loincMapper.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {t(architecture.loincMapper.desc)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ENTERPRISE ANALYZER COMPATIBILITY DIRECTORY
          ══════════════════════════════════════════════════════════════ */}
      {analyzers && (
        <section className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-b border-slate-200/70">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <div className="mb-3.5">
                  <SectionBadge variant="blue">{t(analyzers.badge)}</SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                  {t(analyzers.title)}
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                {t(analyzers.description)}
              </p>
            </div>

            {/* Search & Discipline Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { key: "all", label: t(analyzers.allFilterLabel) },
                  ...disciplines.map((d) => ({ key: d.id, label: t(d.label) })),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedDiscipline(tab.key)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer shrink-0",
                      selectedDiscipline === tab.key
                        ? "bg-[#0073FC] text-white border-[#0073FC]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={analyzerQuery}
                  onChange={(e) => setAnalyzerQuery(e.target.value)}
                  placeholder={t(analyzers.searchPlaceholder)}
                  className="w-full rounded-full bg-white border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0073FC] focus:ring-2 focus:ring-[#0073FC]/15"
                />
              </div>
            </div>

            {/* Enterprise Specification Table */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden">
              {filteredAnalyzers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-[#F7F9FC] text-[11px] font-mono uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-5">{t(analyzers.columns.manufacturer)}</th>
                        <th className="py-3.5 px-5">{t(analyzers.columns.discipline)}</th>
                        <th className="py-3.5 px-5">{t(analyzers.columns.models)}</th>
                        <th className="py-3.5 px-5">{t(analyzers.columns.iface)}</th>
                        <th className="py-3.5 px-5 text-right">{t(analyzers.columns.protocol)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredAnalyzers.map((row) => (
                        <tr key={row.id} className="hover:bg-[#FAFBFD] transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">{row.maker}</td>
                          <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">{row.label}</td>
                          <td className="py-3.5 px-5 font-mono text-xs text-slate-700">{row.models}</td>
                          <td className="py-3.5 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">{row.iface}</td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <span className="inline-block rounded-md bg-[#E8F1FD] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0073FC]">
                              {row.protocol}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {t(analyzers.emptyMessage).split("{query}").join(analyzerQuery)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAnalyzerQuery("");
                      setSelectedDiscipline("all");
                    }}
                    className="px-4 py-2 rounded-full bg-[#E8F1FD] text-[#0073FC] text-xs font-semibold cursor-pointer"
                  >
                    {t(analyzers.resetLabel)}
                  </button>
                </div>
              )}
            </div>

            {/* Custom Driver SLA Strip */}
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
              <p className="text-xs sm:text-sm text-slate-600">
                <strong className="font-semibold text-slate-900">
                  {t(analyzers.slaTitle)}
                </strong>{" "}
                {t(analyzers.slaText)}
              </p>
              <Link
                href={analyzers.slaCta.href}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] shrink-0"
              >
                <span>{t(analyzers.slaCta.text)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE
          ══════════════════════════════════════════════════════════════ */}
      {compliance && (
        <section className="w-full py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
            <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0073FC] text-[11px] font-bold uppercase tracking-wider border border-blue-200/70">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{t(compliance.badge)}</span>
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                    {t(compliance.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                    {t(compliance.description)}
                  </p>
                </div>

                <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {visibleItems(compliance.badges).map((badge) => {
                    const BadgeIcon = getIcon(badge.iconName, ShieldCheck);
                    return (
                      <div
                        key={badge.id}
                        className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs flex items-center gap-2.5"
                      >
                        <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                          <BadgeIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block leading-tight truncate">{badge.code}</span>
                          <span className="text-[10px] font-medium text-slate-500 block truncate">{t(badge.label)}</span>
                        </div>
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
          BOTTOM CTA BANNER
          ══════════════════════════════════════════════════════════════ */}
      {content.cta && (
        <CTABanner initialData={toCtaBannerData(content.cta)} bgClassName="bg-[#FAFBFD]" topColor="#FAFBFD" />
      )}
    </div>
  );
}
