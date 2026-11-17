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
  Check,
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
  ArrowDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { resolveCmsHero, heroCta, heroMetrics, HERO_DEFAULTS } from "@/lib/cms-hero";
import type { InnerPageCmsProps } from "@/lib/cms-layout";
import { CmsSectionList, CmsSlot, makeSectionText } from "@/components/cms/CmsSectionList";
import { CTABanner } from "@/components/sections/CTABanner";
import { makeContentReader } from "@/lib/cms-page-content";

/** Ikon yang dapat dipilih admin (lihat ICON_OPTIONS di lib/cms-content/integration.ts). */
const ICONS: Record<string, LucideIcon> = {
  Network,
  FileText,
  Cpu,
  ShieldCheck,
  Wifi,
  Server,
  Lock,
  FileCheck2,
  BadgeCheck,
  Activity,
  Clock,
  Sparkles,
  Send,
  Search,
};
const iconFor = (name: string, fallback: LucideIcon): LucideIcon => ICONS[name] ?? fallback;

/**
 * Geometri diagram hub (desain): posisi setiap simpul ditentukan oleh ID simpul (daftar `nodes`
 * berjumlah tetap). Urutan di bawah = urutan render garis penghubung.
 */
const HUB_CONNECTORS: { nodeId: string; d: string; px: number; py: number }[] = [
  { nodeId: "analyzer", d: "M 392 64 C 430 64, 430 110, 468 110", px: 392, py: 64 },
  { nodeId: "connectivity", d: "M 392 156 C 430 156, 430 110, 468 110", px: 392, py: 156 },
  { nodeId: "simrs-his", d: "M 732 110 C 770 110, 770 38, 808 38", px: 808, py: 38 },
  { nodeId: "rme", d: "M 732 110 L 808 110", px: 808, py: 110 },
  { nodeId: "satusehat", d: "M 732 110 C 770 110, 770 182, 808 182", px: 808, py: 182 },
];
const LEFT_NODE_IDS = ["analyzer", "connectivity"];
const RIGHT_NODE_IDS = ["simrs-his", "rme", "satusehat"];

/* ── Ilustrasi kartu kapabilitas (desain) ───────────────────────────────── */

function HostQueryVisual() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-4 relative">
      <span className="px-4 py-1.5 rounded-lg bg-[#0073FC] text-white text-xs font-semibold shadow-[0_8px_20px_-4px_rgba(0,115,252,0.5)] mb-4">
        Host Query
      </span>
      <div className="flex items-center gap-3 opacity-45">
        {["ASTM", "HL7", "RS232"].map((tag) => (
          <div key={tag} className="w-12 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-end justify-center pb-2 text-[10px] font-mono font-bold text-slate-500">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

function CitoQueueVisual() {
  return (
    <div className="w-full max-w-[270px] rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs my-2 text-left">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-800">Queue Priority</span>
        <span className="px-2 py-0.5 rounded bg-[#0073FC] text-white text-[10px] font-semibold">Auto Sync</span>
      </div>
      <div className="space-y-2 text-[11px] text-slate-600">
        <div className="flex items-center justify-between">
          <span>IGD Cito Worklist</span>
          <span className="font-mono text-slate-400 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 09:45</span>
        </div>
        <div className="flex items-center justify-between opacity-55">
          <span>SATUSEHAT Batch</span>
          <span className="font-mono text-slate-400 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 11:00</span>
        </div>
      </div>
    </div>
  );
}

type ValidationMode = "auto" | "strict" | "custom";

function ValidationModesVisual({
  prompt,
  mode,
  onChange,
}: {
  prompt: string;
  mode: ValidationMode;
  onChange: (m: ValidationMode) => void;
}) {
  return (
    <div className="w-full py-6 flex flex-col items-center">
      <p className="text-[11px] font-medium text-slate-500 mb-3">
        {prompt}
      </p>
      <div className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
        {[
          { id: "auto" as const, label: "Auto-Verify" },
          { id: "strict" as const, label: "Westgard" },
          { id: "custom" as const, label: "+ Rule" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5",
              mode === m.id
                ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {mode === m.id && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CriticalValueVisual() {
  return (
    <div className="w-full py-5 relative flex flex-col items-center">
      <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-slate-800 mb-2">
        ↻ Escalate &lt; 15m
      </span>
      <p className="text-xs text-slate-300 leading-relaxed max-w-[230px] select-none">
        Serum Potassium{" "}
        <span className="bg-[#E8F1FD] text-[#0073FC] font-mono font-bold px-1.5 py-0.5 rounded">
          6.4 mmol/L
        </span>{" "}
        exceeds critical threshold
      </p>
    </div>
  );
}

function PayloadChatVisual() {
  return (
    <div className="w-full max-w-[270px] space-y-2 text-left my-2">
      <div className="ml-auto max-w-[85%] rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-700">
        Status kirim SATUSEHAT #SP-08819?
      </div>
      <div className="mr-auto max-w-[90%] rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700 shadow-2xs">
        <span className="font-semibold text-[#0073FC]">HTTP 201 Created.</span> DiagnosticReport &amp; IHS tervalidasi.
      </div>
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[11px] text-slate-400">
        <span>Cek status payload...</span>
        <Send className="h-3 w-3 text-slate-500" />
      </div>
    </div>
  );
}

function LoincMapperVisual() {
  return (
    <div className="w-full max-w-[260px] my-2 relative">
      <div className="flex justify-center mb-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-[#0073FC]">
          <Sparkles className="h-3 w-3" /> Mapping FHIR R4
        </span>
      </div>
      <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-left text-[11px] space-y-1.5">
        <div className="grid grid-cols-2 font-bold text-slate-800 pb-1 border-b border-slate-100">
          <span>Raw Code</span>
          <span className="text-[#0073FC]">LOINC</span>
        </div>
        <div className="grid grid-cols-2 text-slate-500 font-mono">
          <span>HGB (Sysmex)</span>
          <span className="text-slate-800">718-7</span>
        </div>
        <div className="grid grid-cols-2 text-slate-400 font-mono opacity-60">
          <span>CREA (Cobas)</span>
          <span>2160-0</span>
        </div>
      </div>
    </div>
  );
}

/** Panggung netral untuk kartu tambahan admin (ilustrasi = "none"). */
function IconStageVisual({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="w-full py-6 flex flex-col items-center">
      <div className="h-12 w-12 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

export default function IntegrationPageClient({ cmsHero, layout, cta, content }: InnerPageCmsProps) {
  const { language } = useLanguage();
  const st = makeSectionText(layout, language);
  const c = makeContentReader(content, language);
  const [selectedIntegration, setSelectedIntegration] = useState<number>(0);
  const [autoCycle, setAutoCycle] = useState<boolean>(false);
  const [validationMode, setValidationMode] = useState<ValidationMode>("auto");
  const [analyzerQuery, setAnalyzerQuery] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  const integrations = c.list("integration-explorer", "nodes");
  const allSteps = c.list("integration-explorer", "steps");
  const nodeCount = integrations.length;

  useEffect(() => {
    if (!autoCycle || nodeCount === 0) return;
    const timer = setInterval(() => {
      setSelectedIntegration((prev) => (prev + 1) % nodeCount);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoCycle, nodeCount]);

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

  const selectedIdx = nodeCount > 0 ? Math.min(Math.max(selectedIntegration, 0), nodeCount - 1) : -1;
  const current = selectedIdx >= 0 ? integrations[selectedIdx] : undefined;
  const currentProtocols = current
    ? c.v(current, "protocols").split(/\r?\n/).map((p) => p.trim()).filter(Boolean)
    : [];
  const currentMetrics = current
    ? [1, 2]
        .map((n) => ({ val: c.v(current, `metric${n}Value`), label: c.t(current, `metric${n}Label`) }))
        .filter((m) => m.val !== "" || m.label !== "")
    : [];
  const currentSteps = current ? allSteps.filter((s) => c.v(s, "node") === current.id) : [];
  const nodeIndexes = (ids: string[]) =>
    ids.map((id) => integrations.findIndex((n) => n.id === id)).filter((i) => i !== -1);
  const connectors = HUB_CONNECTORS.filter((line) => integrations.some((n) => n.id === line.nodeId));
  const activePath =
    HUB_CONNECTORS.find((line) => line.nodeId === current?.id)?.d ?? HUB_CONNECTORS[HUB_CONNECTORS.length - 1].d;

  const selectPillar = (idx: number) => {
    setAutoCycle(false);
    setSelectedIntegration(idx);
    window.history.replaceState(null, "", `#${integrations[idx].id}`);
  };

  const activeLabel = c.text("integration-explorer", "activeLabel");
  const inspectLabel = c.text("integration-explorer", "inspectLabel");
  const statusCompleted = c.text("integration-explorer", "statusCompleted");
  const statusRunning = c.text("integration-explorer", "statusRunning");

  const capabilities = c.list("architecture", "capabilities");
  const capabilityCount = capabilities.length;
  const lastRowStart = Math.floor(Math.max(capabilityCount - 1, 0) / 3) * 3;
  const renderCapabilityVisual = (item: (typeof capabilities)[number]) => {
    switch (c.v(item, "visual")) {
      case "host-query":
        return <HostQueryVisual />;
      case "cito-queue":
        return <CitoQueueVisual />;
      case "validation-modes":
        return (
          <ValidationModesVisual
            prompt={c.text("architecture", "validationPrompt")}
            mode={validationMode}
            onChange={setValidationMode}
          />
        );
      case "critical-value":
        return <CriticalValueVisual />;
      case "payload-chat":
        return <PayloadChatVisual />;
      case "loinc-mapper":
        return <LoincMapperVisual />;
      default:
        return <IconStageVisual icon={iconFor(c.v(item, "icon"), Sparkles)} />;
    }
  };

  const analyzerCatalog = c.list("analyzer-directory", "analyzers").map((item) => ({
    id: item.id,
    discipline: c.v(item, "category"),
    label: c.t(item, "disciplineLabel"),
    maker: c.v(item, "maker"),
    models: c.v(item, "models"),
    iface: c.v(item, "iface"),
    protocol: c.v(item, "protocol"),
  }));
  const disciplineTabs = [
    { id: "__all", key: "all", label: c.text("analyzer-directory", "allLabel") },
    ...c.list("analyzer-directory", "disciplines").map((item) => ({
      id: item.id,
      key: c.v(item, "category"),
      label: c.t(item, "label"),
    })),
  ];

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

  const complianceBadges = c.list("compliance", "badges");

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      <CmsSectionList layout={layout}>
      <CmsSlot id="hero">
      <PageHero
        cms={resolveCmsHero(cmsHero, language)}
        badge={language === "ID" ? "Interoperabilitas Laboratorium" : "Laboratory Interoperability Suite"}
        title={
          language === "ID" ? (
            <>
              Terhubung Mulus dengan{" "}
              <br className="hidden sm:inline" />
              Ekosistem RS & 500+ Mesin Lab
            </>
          ) : (
            <>
              Seamless Connectivity with{" "}
              <br className="hidden sm:inline" />
              Hospital IT & 500+ Medical Analyzers
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Konektivitas siap pakai yang aman dan patuh regulasi: bridging dua arah SIMRS/HIS, RME Permenkes 24/2022, SATUSEHAT Kemenkes, 500+ analyzer otomatis, dan gateway buffer offline."
            : "Turnkey, regulatory-compliant interoperability: bidirectional HIS bridging, EMR Permenkes 24/2022, MoH SATUSEHAT HL7 FHIR, direct 500+ analyzer interfacing, and offline edge buffer."
        }
        primaryCta={heroCta(cmsHero, "primaryCta", HERO_DEFAULTS.integration, language)}
        secondaryCta={heroCta(cmsHero, "secondaryCta", HERO_DEFAULTS.integration, language)}
        metrics={heroMetrics(cmsHero, HERO_DEFAULTS.integration, language)}
      />
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: ATTIO-STYLE CONNECTED NODE CANVAS & WORKFLOW SPLIT (#integration-explorer)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="integration-explorer">
      <section
        id="integration-explorer"
        className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-y border-slate-200/70 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("integration-explorer", "badge", language === "ID" ? "Arsitektur Interoperabilitas" : "Interoperability Architecture")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {st("integration-explorer", "title", language === "ID"
                  ? "Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis"
                  : "One Unified Hub for Your Entire Clinical Data Ecosystem")}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 font-normal">
                {st("integration-explorer", "subtitle", language === "ID"
                  ? "Klik simpul mana saja pada diagram untuk memeriksa alur otomatisasi dan protokolnya."
                  : "Select any node on the diagram to inspect its live automation flow and protocols.")}
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
                <span>
                  {autoCycle
                    ? c.text("integration-explorer", "pauseTourLabel")
                    : c.text("integration-explorer", "autoTourLabel")}
                </span>
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
              {connectors.map((line) => {
                const isActive = current?.id === line.nodeId;
                return (
                  <g key={line.nodeId}>
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
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={activePath}
                />
              </circle>
            </svg>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left Nodes */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {nodeIndexes(LEFT_NODE_IDS).map((idx) => {
                  const item = integrations[idx];
                  const Icon = iconFor(c.v(item, "icon"), Network);
                  const active = selectedIdx === idx;
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
                          <p className="text-sm font-bold text-slate-900 truncate">{c.t(item, "tabLabel")}</p>
                          <p className="text-[11px] text-slate-500 truncate">{c.t(item, "shortDesc")}</p>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {active ? activeLabel : inspectLabel}
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
                      <span className="font-display text-sm font-bold text-slate-900">{c.value("integration-explorer", "hubName")}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {c.text("integration-explorer", "hubStatus")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">{c.text("integration-explorer", "hubStat1Label")}</p>
                      <p className="font-display text-base font-bold text-slate-900 tabular-nums">{c.value("integration-explorer", "hubStat1Value")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium">{c.text("integration-explorer", "hubStat2Label")}</p>
                      <p className="font-display text-base font-bold text-emerald-600 tabular-nums">{c.value("integration-explorer", "hubStat2Value")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Nodes */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                {nodeIndexes(RIGHT_NODE_IDS).map((idx) => {
                  const item = integrations[idx];
                  const Icon = iconFor(c.v(item, "icon"), Network);
                  const active = selectedIdx === idx;
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
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{c.t(item, "tabLabel")}</p>
                          <p className="text-[11px] text-slate-500 truncate">{c.t(item, "shortDesc")}</p>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {active ? activeLabel : inspectLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reference 3 & 4: Attio Split Editorial + Vertical Connected Workflow */}
          {current && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Editorial + Giant Typographic Metrics */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#0073FC]">
                  {c.t(current, "tabLabel")}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                  {c.t(current, "name")}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {c.t(current, "tagline")}
                </p>
              </div>

              {/* Clean Metric Split */}
              <div className="grid grid-cols-2 gap-6 py-5 border-y border-slate-200/80">
                {currentMetrics.map((m, i) => (
                  <div key={i}>
                    <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {m.val}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {currentProtocols.map((p, i) => (
                    <span
                      key={`${i}-${p}`}
                      className="rounded-md bg-[#F7F9FC] border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <Link
                  href={c.value("integration-explorer", "ctaUrl") || "/request-demo"}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0073FC] hover:text-[#005DD1]"
                >
                  <span>{c.text("integration-explorer", "ctaLabel")}</span>
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
                    {c.text("integration-explorer", "pipelineLabel")} <strong className="text-slate-900">{c.t(current, "tabLabel")}</strong>
                  </span>
                  <span className="font-mono text-[11px] text-[#0073FC] font-semibold">{c.text("integration-explorer", "pipelineStatus")}</span>
                </div>

                <div className="max-w-lg w-full mx-auto">
                  {currentSteps.map((step, i) => {
                    const completed = c.v(step, "status") === "completed";
                    return (
                    <React.Fragment key={step.id}>
                      <div>
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {c.t(step, "tag")}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md",
                              completed
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-[#0073FC]"
                            )}
                          >
                            {completed ? statusCompleted : statusRunning}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "rounded-xl bg-white border p-3.5 shadow-2xs transition-colors",
                            completed ? "border-emerald-300/80" : "border-blue-300"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-bold text-slate-900">{c.t(step, "title")}</p>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 shrink-0">
                              {c.v(step, "chip")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{c.t(step, "desc")}</p>
                        </div>
                      </div>
                      {i < currentSteps.length - 1 && (
                        <div className="flex flex-col items-center py-0.5">
                          <div className="h-3.5 w-px bg-emerald-400" />
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                      )}
                    </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: GRADEWITHAI-STYLE ARCHITECTURAL HAIRLINE GRID (#architecture)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="architecture">
      <section id="architecture" className="w-full py-16 sm:py-24 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("architecture", "badge", language === "ID" ? "Kapabilitas Teknis" : "Engineering Capabilities")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {st("architecture", "title", language === "ID"
                  ? "Semua yang Dibutuhkan untuk Integrasi Tanpa Friksi"
                  : "Everything You Need for Frictionless Lab Integration")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("architecture", "subtitle", language === "ID"
                ? "Dari Host Query barcode, validasi Westgard QC, pemetaan LOINC, hingga ketahanan jaringan offline—seluruhnya dirancang presisi."
                : "From barcode Host Query and Westgard QC gating to LOINC normalization and offline edge resilience.")}
            </p>
          </div>

          {/* Reference 1: 3x2 Hairline Architectural Grid with Crosshairs (+) & Faded UI Vignettes */}
          <div className="relative border-t border-l border-slate-200/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item, i) => (
              <div
                key={item.id}
                className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]"
              >
                {/* Crosshair (+) on interior grid intersections (lg: 3 columns) */}
                {i % 3 !== 2 && i < lastRowStart && (
                  <Plus className="h-3.5 w-3.5 text-slate-300 absolute -bottom-[7px] -right-[7px] z-10 bg-white hidden lg:block" />
                )}
                {renderCapabilityVisual(item)}
                <div className="mt-4">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {c.t(item, "title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    {c.t(item, "desc")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ENTERPRISE ANALYZER COMPATIBILITY DIRECTORY
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="analyzer-directory">
      <section className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-b border-slate-200/70">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("analyzer-directory", "badge", language === "ID" ? "Direktori 500+ Analyzer" : "500+ Analyzer Directory")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {st("analyzer-directory", "title", language === "ID"
                  ? "Matriks Kompatibilitas Instrumen Laboratorium"
                  : "Laboratory Instrument Compatibility Matrix")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("analyzer-directory", "subtitle", language === "ID"
                ? "Cari merek atau seri mesin laboratorium Anda untuk melihat antarmuka fisik dan protokol yang didukung native."
                : "Search your analyzer brand or series to inspect natively supported physical interfaces and protocols.")}
            </p>
          </div>

          {/* Search & Discipline Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {disciplineTabs.map((tab) => (
                <button
                  key={tab.id}
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
                placeholder={c.text("analyzer-directory", "searchPlaceholder")}
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
                      <th className="py-3.5 px-5">{c.text("analyzer-directory", "colManufacturer")}</th>
                      <th className="py-3.5 px-5">{c.text("analyzer-directory", "colDiscipline")}</th>
                      <th className="py-3.5 px-5">{c.text("analyzer-directory", "colSeries")}</th>
                      <th className="py-3.5 px-5">{c.text("analyzer-directory", "colInterface")}</th>
                      <th className="py-3.5 px-5 text-right">{c.text("analyzer-directory", "colProtocol")}</th>
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
                  {c.text("analyzer-directory", "emptyText").split("{query}").join(analyzerQuery)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAnalyzerQuery("");
                    setSelectedDiscipline("all");
                  }}
                  className="px-4 py-2 rounded-full bg-[#E8F1FD] text-[#0073FC] text-xs font-semibold cursor-pointer"
                >
                  {c.text("analyzer-directory", "resetLabel")}
                </button>
              </div>
            )}
          </div>

          {/* Custom Driver SLA Strip */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="font-semibold text-slate-900">
                {c.text("analyzer-directory", "slaTitle")}
              </strong>{" "}
              {c.text("analyzer-directory", "slaText")}
            </p>
            <Link
              href={c.value("analyzer-directory", "slaCtaUrl") || "/request-demo"}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] shrink-0"
            >
              <span>{c.text("analyzer-directory", "slaCtaLabel")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="compliance">
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0073FC] text-[11px] font-bold uppercase tracking-wider border border-blue-200/70">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{st("compliance", "badge", language === "ID" ? "Kepatuhan Regulasi & Privasi" : "Regulatory & Privacy Compliance")}</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {st("compliance", "title", language === "ID"
                    ? "Arsitektur Interoperabilitas Sesuai Regulasi Kesehatan Nasional"
                    : "Interoperability Architecture Built for National Health Compliance")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                  {st("compliance", "subtitle", language === "ID"
                    ? "Setiap pertukaran data dilindungi enkripsi TLS 1.3 / AES-256 serta memenuhi amanat Permenkes 24/2022, standar SATUSEHAT Kemenkes RI, dan UU Perlindungan Data Pribadi."
                    : "Every data exchange is guarded by TLS 1.3 / AES-256 encryption, fully aligning with Permenkes 24/2022, MoH SATUSEHAT FHIR, and Indonesia's PDP Act.")}
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {complianceBadges.map((badge) => {
                  const BadgeIcon = iconFor(c.v(badge, "icon"), ShieldCheck);
                  return (
                    <div
                      key={badge.id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs flex items-center gap-2.5"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                        <BadgeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block leading-tight truncate">{c.v(badge, "code")}</span>
                        <span className="text-[10px] font-medium text-slate-500 block truncate">{c.t(badge, "label")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA BANNER
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="cta">
      <CTABanner initialData={cta} bgClassName="bg-[#FAFBFD]" topColor="#FAFBFD" />
      </CmsSlot>
      </CmsSectionList>
    </div>
  );
}
