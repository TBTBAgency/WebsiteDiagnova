"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  Zap,
  Flame,
  Send,
  Check,
  Search,
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
  ArrowUpRight,
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
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { resolveCmsHero, heroCta, heroMetrics, HERO_DEFAULTS } from "@/lib/cms-hero";
import type { InnerPageCmsProps } from "@/lib/cms-layout";
import { CmsSectionList, CmsSlot, makeSectionText } from "@/components/cms/CmsSectionList";
import { CTABanner } from "@/components/sections/CTABanner";
import { makeContentReader, type ContentItem, type ContentLang, type ContentReader } from "@/lib/cms-page-content";

/** Ikon yang dapat dipilih admin (nama → komponen). */
const ICONS: Record<string, LucideIcon> = {
  Building2,
  AlertTriangle,
  AlertCircle,
  Zap,
  Flame,
  Send,
  Check,
  CheckCircle2,
  Search,
  Sparkles,
  ShieldCheck,
  Layers,
  Thermometer,
  FlaskConical,
  Microscope,
  Network,
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
  ArrowUpRight,
  Monitor,
  MapPin,
  Mic,
  Phone,
  BarChart3,
  Video,
  Share2,
  RefreshCw,
  Clock,
  TrendingUp,
};
const iconOf = (name: string, fallback: LucideIcon): LucideIcon => ICONS[name] ?? fallback;

/** Ikon tier yang tampil terisi (fill) — desain bawaan untuk ikon berbentuk solid. */
const FILLED_TIER_ICONS = new Set(["Zap", "Flame"]);

/** Kelas grid Gantt (literal agar terdeteksi Tailwind). */
const GANTT_COL_START: Record<number, string> = {
  1: "md:col-start-1",
  2: "md:col-start-2",
  3: "md:col-start-3",
  4: "md:col-start-4",
};
const GANTT_COL_SPAN: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
};

type SubTab = "micro" | "blood";

/* ══════════════════════════════════════════════════════════════
   FACILITY CARD ILLUSTRATIONS (design: mock-UI micro-copy stays in code)
   ══════════════════════════════════════════════════════════════ */

/* Top Visual Stage: Soft Peach/Orange Canvas with 3 Floating Status Pills */
function HospitalStage({ language }: { language: ContentLang }) {
  return (
    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF5ED] via-[#FFF9F5] to-white border border-orange-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-5 shadow-2xs">
      {/* Floating Pill 1: Automated HIS & EMR Bridging */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
        <div className="h-6 w-6 rounded-lg bg-[#FFEFE6] text-amber-600 flex items-center justify-center shrink-0">
          <Building2 className="h-3.5 w-3.5" />
        </div>
        <span className="truncate">{language === "ID" ? "Bridging SIMRS & RME Otomatis" : "Automated HIS & EMR Bridging"}</span>
      </div>

      {/* Floating Pill 2: ER & ICU Panic Alerts < 25m */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
        <div className="h-6 w-6 rounded-lg bg-[#FEECEB] text-rose-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-3.5 w-3.5" />
        </div>
        <span className="truncate">{language === "ID" ? "Notifikasi Kritis IGD & ICU < 25m" : "ER & ICU Panic Alerts < 25m"}</span>
      </div>

      {/* Floating Pill 3: Bedside Phlebotomy Barcode */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
        <div className="h-6 w-6 rounded-lg bg-[#FEF6E6] text-amber-500 flex items-center justify-center shrink-0">
          <Zap className="h-3.5 w-3.5" />
        </div>
        <span className="truncate">{language === "ID" ? "Barcode Flebotomi Bedside" : "Bedside Phlebotomy Barcode"}</span>
      </div>
    </div>
  );
}

/* Top Visual Stage: Soft Cyan/Blue Canvas with Corporate MCU Intake Box */
function ClinicalStage({ language }: { language: ContentLang }) {
  return (
    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EFF8FF] via-[#F6FAFF] to-white border border-blue-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {language === "ID" ? "Batch Diterima" : "Batch Ingested"}
        </span>
        <span className="text-[11px] font-mono font-bold text-slate-700">PT Telkom (450 Pax)</span>
      </div>

      {/* Corporate MCU Roster Box */}
      <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-1">
        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{language === "ID" ? "Roster MCU Korporat" : "Corporate MCU Roster"}</h4>
        <p className="text-[10px] font-mono text-slate-500">{language === "ID" ? "450 Barcode Terbit • 0.4s / Peserta" : "450 Barcodes Issued • 0.4s / Patient"}</p>
      </div>

      {/* Bottom Avatar Initials + WhatsApp Delivery */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            <span className="h-5 w-5 rounded-full bg-blue-100 text-[#2764B8] border border-white flex items-center justify-center text-[9px] font-bold">
              A
            </span>
            <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 border border-white flex items-center justify-center text-[9px] font-bold">
              B
            </span>
            <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 border border-white flex items-center justify-center text-[9px] font-bold">
              C
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{language === "ID" ? "+447 Lainnya" : "+447 Others"}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2764B8]">
          <Send className="h-3 w-3" />
          WhatsApp PDF
        </span>
      </div>
    </div>
  );
}

/* Top Visual Stage: Soft Mint/Green Canvas with 5-Step Pipeline & Action Buttons */
function PathologyStage({ language }: { language: ContentLang }) {
  return (
    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EDFAF2] via-[#F5FCF7] to-white border border-emerald-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800">{language === "ID" ? "Alur Kaset & Slide" : "Cassette & Slide Flow"}</span>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
          Zero Mix-Up
        </span>
      </div>

      {/* 5-Step Progress Boxes [ G ] [ E ] [ M ] [ S ] [ ✓ ] */}
      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-2xs">
          G
        </div>
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-2xs">
          E
        </div>
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-2xs">
          M
        </div>
        <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold shadow-2xs">
          S
        </div>
        <div className="bg-emerald-600 text-white p-1.5 rounded-lg font-bold shadow-2xs flex items-center justify-center">
          <Check className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Sample ID & ICD-O Standard */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-500">{language === "ID" ? "#PA-24-0982 (Biopsi)" : "#PA-24-0982 (Biopsy)"}</span>
        <span className="text-slate-700 font-bold">ICD-O 8500/3</span>
      </div>

      {/* 2 Bottom Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
        >
          {language === "ID" ? "Arsip Blok" : "Block Archive"}
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded-lg bg-[#0F172A] text-[10px] font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors"
        >
          {language === "ID" ? "Validasi Sp.PA" : "Pathologist Sign-Off"}
        </button>
      </div>
    </div>
  );
}

/* Top Visual Stage: Workstation Telemetry & AST Sensitivity Table */
function MicrobiologyStage({
  language,
  activeSubTab,
  setActiveSubTab,
}: {
  language: ContentLang;
  activeSubTab: SubTab;
  setActiveSubTab: (tab: SubTab) => void;
}) {
  return (
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
            {language === "ID" ? "Kultur Mikrobiologi PPRA" : "ASP Microbiology Culture"}
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
            {language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank"}
          </button>
        </div>

        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-Time Telemetry
        </span>
      </div>

      {activeSubTab === "micro" ? (
        /* 3 Telemetry Columns (Microbiology Mode) */
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white rounded-xl border border-slate-200/80 p-2 text-xs">
          <div className="px-2 py-1">
            <span className="text-[10px] text-slate-400 font-mono block">{language === "ID" ? "Isolat Kuman" : "Pathogen Isolate"}</span>
            <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono truncate block mt-0.5">
              S. aureus (18h)
            </span>
            <span className="text-[10px] font-mono text-[#2764B8] font-semibold block mt-0.5">
              VITEK-2 Ingested
            </span>
          </div>
          <div className="px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-mono block">{language === "ID" ? "Sensitivitas Utama" : "Primary Susceptibility"}</span>
            <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5">
              Vancomycin (S)
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
              MIC &le; 0.5 &micro;g/mL
            </span>
          </div>
          <div className="px-2.5 py-1">
            <span className="text-[10px] text-red-500 font-mono block font-bold">{language === "ID" ? "Resistensi Terdeteksi" : "Resistance Detected"}</span>
            <span className="font-bold text-red-700 text-xs sm:text-sm font-mono block mt-0.5">
              Cefoxitin / MRSA (R)
            </span>
            <span className="text-[10px] font-mono text-red-600 font-semibold block mt-0.5">
              PPRA Alert Sent
            </span>
          </div>
        </div>
      ) : (
        /* 3 Telemetry Columns (Blood Bank Mode) */
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-white rounded-xl border border-slate-200/80 p-2 text-xs">
          <div className="px-2 py-1">
            <span className="text-[10px] text-slate-400 font-mono block">{language === "ID" ? "Uji Silang Serasi" : "Cross-Match Test"}</span>
            <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono truncate block mt-0.5">
              {language === "ID" ? "Mayor & Minor (OK)" : "Major & Minor (OK)"}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
              {language === "ID" ? "#ID-0892 × Ny. Mariam" : "#ID-0892 × Mrs. Mariam"}
            </span>
          </div>
          <div className="px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-mono block">{language === "ID" ? "Suhu Kulkas BDRS" : "Blood Fridge Temp"}</span>
            <span className="font-bold text-[#2764B8] text-xs sm:text-sm font-mono block mt-0.5">
              {language === "ID" ? "3.8°C (Aman)" : "3.8°C (Safe)"}
            </span>
            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
              {language === "ID" ? "Rentang 2°C - 6°C" : "Range 2°C - 6°C"}
            </span>
          </div>
          <div className="px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-mono block">{language === "ID" ? "Rotasi FEFO Stok" : "FEFO Stock Rotation"}</span>
            <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5">
              {language === "ID" ? "Sisa 24 Hari" : "24 Days Left"}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold block mt-0.5">
              ISBT-128 Verified
            </span>
          </div>
        </div>
      )}

      {/* Interactive Search Pill Bar */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
        <span className="text-[11px] text-slate-400 font-normal px-1 truncate">
          {language === "ID"
            ? "Cari riwayat kultur kuman atau pola resistensi antibiogram..."
            : "Search pathogen culture history or antibiogram resistance patterns..."}
        </span>
        <button
          type="button"
          className="px-3.5 py-1 rounded-full bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-[10px] shadow-2xs transition-colors shrink-0"
        >
          Enter
        </button>
      </div>
    </div>
  );
}

/* Top Visual Stage: Nova AI Clinical Narrative Summary */
function NovaAiStage({ language }: { language: ContentLang }) {
  return (
    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] via-[#F8FAFD] to-white border border-slate-200/90 mb-5 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#2764B8]" />
          {language === "ID" ? "Ringkasan Nova AI" : "Nova AI Summary"}
        </span>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
          Delta Check
        </span>
      </div>

      {/* 3 Narrative Summary Cards */}
      <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-normal">
        <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
          {language === "ID"
            ? "Terdeteksi lonjakan biomarker serum Kreatinin (+115% vs baseline 3 bulan lalu)."
            : "Detected serum Creatinine biomarker surge (+115% vs 3-month baseline)."}
        </p>
        <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
          {language === "ID"
            ? "Rekomendasi DPJP: Lakukan evaluasi Acute Kidney Injury (AKI) sebelum memulai peresepan nefrotoksik."
            : "Attending Recommendation: Evaluate for Acute Kidney Injury (AKI) before initiating nephrotoxic prescriptions."}
        </p>
        <p className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800 font-medium">
          {language === "ID"
            ? "Otorisasi Klinis: Keputusan diagnostik dan tindakan medis 100% di tangan dokter spesialis."
            : "Clinical Authorization: Diagnostic decisions and medical actions remain 100% with the specialist."}
        </p>
      </div>
    </div>
  );
}

/* Neutral stage for admin-added cards without a bespoke illustration */
function IconStage({ icon }: { icon: LucideIcon }) {
  const Icon = icon;
  return (
    <div className="ll-card-stage p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F6F9FD] via-[#FAFBFD] to-white border border-slate-200/90 h-[215px] flex items-center justify-center mb-5 shadow-2xs">
      <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#2764B8] flex items-center justify-center">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

const FACILITY_CARD_SHELL: Record<string, string> = {
  compact:
    "scroll-mt-32 w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group",
  wide: "scroll-mt-32 lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group",
  narrow:
    "scroll-mt-32 lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group",
};

function FacilityCard({
  item,
  c,
  language,
  activeSubTab,
  setActiveSubTab,
}: {
  item: ContentItem;
  c: ContentReader;
  language: ContentLang;
  activeSubTab: SubTab;
  setActiveSubTab: (tab: SubTab) => void;
}) {
  const visual = c.v(item, "visual");
  const shell = FACILITY_CARD_SHELL[c.v(item, "layout")] ?? FACILITY_CARD_SHELL.compact;
  return (
    <div id={item.id} className={shell}>
      {visual === "hospital" ? (
        <HospitalStage language={language} />
      ) : visual === "clinical" ? (
        <ClinicalStage language={language} />
      ) : visual === "pathology" ? (
        <PathologyStage language={language} />
      ) : visual === "microbiology" ? (
        <MicrobiologyStage language={language} activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
      ) : visual === "nova-ai" ? (
        <NovaAiStage language={language} />
      ) : (
        <IconStage icon={iconOf(c.v(item, "icon"), Building2)} />
      )}

      {/* Bottom Content: Clean Title + Subtitle */}
      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
        {c.t(item, "title")}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
        {c.t(item, "description")}
      </p>
    </div>
  );
}

export default function SolutionsPageClient({ cmsHero, layout, cta, content }: InnerPageCmsProps) {
  const { language } = useLanguage();
  const st = makeSectionText(layout, language);
  const c = makeContentReader(content, language);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("micro");

  // Deep-link dari navigasi: /solutions#blood-bank membuka tab Bank Darah pada kartu Mikrobiologi
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "blood-bank" || hash === "microbiology") {
        setActiveSubTab(hash === "blood-bank" ? "blood" : "micro");
        document.getElementById("microbiology")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  const [deploymentMode, setDeploymentMode] = useState<"cloud" | "onprem">("cloud");
  const [activeEfficiencyPhase, setActiveEfficiencyPhase] = useState<string>("analytic");
  const [activeGanttWeek, setActiveGanttWeek] = useState<number>(0);

  // Facility cards: baris atas (compact) & baris bawah (wide/narrow)
  const facilityCards = c.list("facility-solutions", "cards");
  const isBottomCard = (item: ContentItem) => {
    const l = c.v(item, "layout");
    return l === "wide" || l === "narrow";
  };
  const topFacilityCards = facilityCards.filter((item) => !isBottomCard(item));
  const bottomFacilityCards = facilityCards.filter(isBottomCard);

  // Tiers & fitur per tier
  const tiers = c.list("tiers", "tiers");
  const tierFeatures = c.list("tiers", "features");

  // Efficiency phases (default terpilih: "analytic"; bila tidak ada, tahap pertama)
  const efficiencyPhases = c.list("efficiency", "phases");
  const phaseData =
    efficiencyPhases.find((p) => p.id === activeEfficiencyPhase) ?? efficiencyPhases[0];
  const comparisonRows = c.list("efficiency", "rows");

  // Rollout phases (indeks terpilih dijaga tetap valid)
  const ganttPhases = c.list("rollout", "phases");
  const activeGanttIdx = Math.max(0, Math.min(activeGanttWeek, ganttPhases.length - 1));

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSectionList layout={layout}>
      <CmsSlot id="hero">
      <PageHero
        cms={resolveCmsHero(cmsHero, language)}
        badge={language === "ID" ? "Solusi Diagnova" : "Diagnova Solutions"}
        title={
          language === "ID" ? (
            <>
              Solusi Terkonfigurasi untuk{" "}
              <br className="hidden sm:inline" />
              Setiap Skala Fasilitas Kesehatan
            </>
          ) : (
            <>
              Configured Architectures for{" "}
              <br className="hidden sm:inline" />
              Every Healthcare Institution Tier
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Dari rumah sakit sentral dengan IGD bertekanan tinggi hingga jejaring lab klinik mandiri. Diagnova menghadirkan solusi yang dirancang sesuai regulasi dan alur kerja spesifik Anda."
            : "From high-acuity hospital networks to high-throughput clinical check-up laboratories. Diagnova delivers tailored architectures engineered for your specific clinical workflows."
        }
        primaryCta={heroCta(cmsHero, "primaryCta", HERO_DEFAULTS.solutions, language)}
        secondaryCta={heroCta(cmsHero, "secondaryCta", HERO_DEFAULTS.solutions, language)}
        metrics={heroMetrics(cmsHero, HERO_DEFAULTS.solutions, language)}
      />
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          CORE FACILITY SHOWCASE (MATCHING EXACT USER MOCKUP SPEC)
          3 Cards Top, 2 Cards Bottom, Authentic Micro-UIs, Precise Copy
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="facility-solutions">
      <section
        id="facility-solutions"
        className="relative scroll-mt-24 w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Section Header (Left-aligned with SectionBadge like other sections) */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {st("facility-solutions", "badge", language === "ID" ? "Mengapa Diagnova?" : "Why Diagnova?")}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {st("facility-solutions", "title", language === "ID" ? (
                <>Dirancang untuk Membuat Kerja Laboratorium Lebih Mudah</>
              ) : (
                <>Designed to Make Laboratory Work Effortless</>
              ))}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {st("facility-solutions", "subtitle", language === "ID"
                ? "Pengalaman diagnostik yang lebih lancar dan cerdas, mulai dari bridging SIMRS dua arah hingga rangkuman klinis Nova AI."
                : "Experience a smoother, smarter way to run clinical workflows from HIS bridging to Nova AI summaries.")}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5-CARD ARCHITECTURE (UNIFIED 2-ROW GRID)
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-7">
            {/* ROW 1: EQUAL VERTICAL CARDS — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
            {topFacilityCards.length > 0 && (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 sm:gap-7 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
                {topFacilityCards.map((item) => (
                  <FacilityCard
                    key={item.id}
                    item={item}
                    c={c}
                    language={language}
                    activeSubTab={activeSubTab}
                    setActiveSubTab={setActiveSubTab}
                  />
                ))}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                ROW 2: BALANCED CARDS (wide 7-col / compact 5-col)
                ══════════════════════════════════════════════════════════════ */}
            {bottomFacilityCards.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
                {bottomFacilityCards.map((item) => (
                  <FacilityCard
                    key={item.id}
                    item={item}
                    c={c}
                    language={language}
                    activeSubTab={activeSubTab}
                    setActiveSubTab={setActiveSubTab}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          FACILITY FIT MATRIX (ONE-SCREEN VIEWPORT SCALE - ZERO OVERFLOW)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="tiers">
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
                {st("tiers", "title", language === "ID"
                  ? "Solusi Tepat untuk Setiap Skala Faskes"
                  : "Tailored Architectures for Every Facility Scale")}
              </h2>
              <p className="mt-2.5 text-xs sm:text-[14px] text-blue-100/90 font-normal leading-relaxed max-w-xl mx-auto">
                {st("tiers", "subtitle", language === "ID"
                  ? "Pilih konfigurasi yang dirancang khusus untuk kebutuhan dan kapasitas instansi Anda. Tanpa biaya tersembunyi, fokus pada efisiensi kerja klinis."
                  : "Choose an architecture engineered for your institution's specific tier. No bloatware, focused purely on clinical speed and compliance.")}
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
                  {c.text("tiers", "cloudLabel")}
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
                  {c.text("tiers", "onpremLabel")}
                </button>
              </div>
            </div>
          </div>

          {/* 3 Floating White Cards — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
          <div className="relative z-20 -mt-16 sm:-mt-24 lg:-mt-28 flex overflow-x-auto snap-x snap-mandatory gap-3.5 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 lg:gap-4.5 md:max-w-[1240px] md:mx-auto md:px-6 md:pb-0 md:overflow-visible items-stretch">
            {tiers.map((tier) => {
              const iconName = c.v(tier, "icon");
              const TierIcon = iconOf(iconName, Zap);
              const label = c.t(tier, "label");
              const features = tierFeatures.filter((f) => c.v(f, "tier") === tier.id);
              return (
                <div key={tier.id} className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none relative p-[36px_6px_6px] rounded-[28px] transition-colors duration-200 hover:bg-[#EBF3FB] focus-within:bg-[#EBF3FB] group/plan">
                  {/* Top Tag */}
                  <div className="absolute top-0 left-0 right-0 h-[36px] flex items-center justify-center text-[12.5px] font-medium text-[#1E54A8] opacity-0 translate-y-1 transition-all duration-200 group-hover/plan:opacity-100 group-hover/plan:translate-y-0 group-focus-within/plan:opacity-100 group-focus-within/plan:translate-y-0 pointer-events-none">
                    {c.t(tier, "tag")}
                  </div>

                  {/* Main Card Body */}
                  <div className="bg-white border border-[#ECECEA] rounded-[24px] p-6 sm:p-7 h-full flex flex-col justify-between">
                    <div>
                      {/* Top Icon & Title */}
                      <div className="flex items-center gap-2 text-[17px] sm:text-[18px] font-semibold text-slate-900">
                        <TierIcon
                          className={
                            FILLED_TIER_ICONS.has(iconName)
                              ? "h-[18px] w-[18px] text-[#2466CB] fill-[#2466CB] shrink-0"
                              : "h-[18px] w-[18px] text-[#2466CB] shrink-0"
                          }
                        />
                        <h3 className="text-[17px] sm:text-[18px] font-semibold text-slate-900 tracking-tight m-0">
                          {c.t(tier, "name")}
                        </h3>
                      </div>

                      {/* Subtitle */}
                      <p className="mt-2 text-[12.5px] sm:text-[13px] leading-relaxed text-slate-500 max-w-[32ch] line-clamp-2">
                        {c.t(tier, "description")}
                      </p>

                      {/* Divider 1 */}
                      <hr className="border-0 border-t border-[#ECECEA] my-4" />

                      {/* Price */}
                      <div className="flex items-baseline gap-1">
                        <strong className="text-4xl sm:text-[40px] font-bold text-slate-900 tracking-tight leading-none">
                          {label}
                        </strong>
                        <span className="text-[12px] text-slate-500 font-normal">
                          / {c.t(tier, "unit")}
                        </span>
                        <button
                          type="button"
                          aria-label={`Informasi lisensi ${label}`}
                          title={deploymentMode === "cloud" ? c.t(tier, "cloudNote") : c.t(tier, "onpremNote")}
                          className="inline-flex cursor-help text-slate-400 hover:text-slate-600 transition-colors ml-0.5"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={c.v(tier, "ctaUrl") || "/request-demo"}
                        className="mt-4 w-full h-11.5 sm:h-12 rounded-full border border-slate-200 bg-white text-slate-800 font-semibold text-[13.5px] flex items-center justify-center gap-2 transition-all duration-200 group-hover/plan:bg-[#2764B8] group-hover/plan:border-[#2764B8] group-hover/plan:text-white group-focus-within/plan:bg-[#2764B8] group-focus-within/plan:border-[#2764B8] group-focus-within/plan:text-white active:scale-[0.98]"
                      >
                        <span>{c.t(tier, "ctaLabel")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/plan:translate-x-1 shrink-0" />
                      </Link>

                      {/* Divider 2 */}
                      <hr className="border-0 border-t border-[#ECECEA] my-4" />

                      {/* Feature List Header */}
                      <p className="text-[12px] sm:text-[12.5px] font-semibold text-slate-900 mb-2.5">
                        {c.t(tier, "featuresTitle")}
                      </p>

                      {/* Feature List */}
                      <ul className="list-none m-0 p-0 grid gap-2.5">
                        {features.map((feature) => {
                          const FeatureIcon = iconOf(c.v(feature, "icon"), Check);
                          return (
                            <li key={feature.id} className="flex items-center gap-2.5 text-[12.5px] sm:text-[13px] text-slate-600 truncate py-0.5">
                              <FeatureIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{c.t(feature, "text")}</span>
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
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: EFFICIENCY TRAJECTORY & MANUAL VS DIAGNOVA EDGE
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="efficiency">
      <section className="w-full bg-white border-t border-slate-200/70 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl space-y-3">
              <SectionBadge variant="blue">
                {st("efficiency", "badge", language === "ID" ? "Dampak Terukur" : "Measurable Impact")}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                {st("efficiency", "title", language === "ID"
                  ? "Transformasi Efisiensi Operasional Laboratorium"
                  : "Transforming Laboratory Operational Efficiency")}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              {st("efficiency", "subtitle", language === "ID"
                ? "Bandingkan alur kerja manual berbasis entri ulang dengan otomatisasi end-to-end Diagnova di setiap tahapan pemeriksaan."
                : "Compare manual re-entry bottlenecks against end-to-end Diagnova automation across every diagnostic stage.")}
            </p>
          </div>

          {/* 12-Col Asymmetric Grid: Left Curve (7) + Right Comparison (5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left 7 Cols: Rising Efficiency Trajectory (Ref 1) */}
            {phaseData && (
                <div className="lg:col-span-7 rounded-[28px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                  {/* Top Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0073FC]">
                        {c.text("efficiency", "trajectoryLabel")}
                      </span>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-[#0073FC]" />
                        <span>
                          TAT: <strong className="text-slate-900">{c.t(phaseData, "tat")}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex flex-nowrap overflow-x-auto max-w-full scrollbar-hide rounded-full bg-white border border-slate-200 p-1">
                      {efficiencyPhases.map((phase) => (
                        <button
                          key={phase.id}
                          type="button"
                          onClick={() => setActiveEfficiencyPhase(phase.id)}
                          className={cn(
                            "shrink-0 whitespace-nowrap px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer",
                            phaseData.id === phase.id
                              ? "bg-[#0073FC] text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          )}
                        >
                          {c.t(phase, "label")}
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
                          {c.text("efficiency", "beforeLabel")}
                        </div>
                        <div className="font-display text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                          {c.v(phaseData, "before")}
                        </div>
                        <p className="mt-1.5 text-xs sm:text-[13px] text-slate-500 max-w-[26ch] leading-relaxed">
                          {c.t(phaseData, "beforeSub")}
                        </p>
                      </div>

                      {/* Post-Implementation Metric */}
                      <div className="text-right flex flex-col items-end">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EBF3FF] border border-blue-200 text-[11px] font-semibold text-[#0073FC] mb-2">
                          <TrendingUp className="h-3 w-3" />
                          {c.text("efficiency", "afterLabel")}
                        </div>
                        <div className="font-display text-4xl sm:text-5xl font-bold text-[#0073FC] tracking-tight">
                          {c.v(phaseData, "after")}
                        </div>
                        <p className="mt-1.5 text-xs sm:text-[13px] text-slate-600 max-w-[28ch] leading-relaxed">
                          {c.t(phaseData, "afterSub")}
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
            )}

            {/* Right 5 Cols: Manual vs Diagnova Enterprise Edge */}
            <div className="lg:col-span-5 rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {c.text("efficiency", "comparisonLabel")}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                      {c.text("efficiency", "comparisonTitle")}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#EBF3FF] text-[#0073FC] text-[11px] font-semibold">
                    {c.text("efficiency", "comparisonBadge")}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {comparisonRows.map((row) => (
                    <div key={row.id} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="text-xs font-semibold text-slate-900 mb-2">{c.t(row, "title")}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-[12px]">
                        <div className="rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-slate-500">
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                            {c.text("efficiency", "manualLabel")}
                          </span>
                          {c.t(row, "manual")}
                        </div>
                        <div className="rounded-xl bg-[#F4F8FF] border border-blue-200/80 px-3 py-2 text-slate-800">
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#0073FC] mb-0.5">
                            {c.text("efficiency", "diagnovaLabel")}
                          </span>
                          {c.t(row, "diagnova")}
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
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: 4-WEEK GO-LIVE GANTT TIMELINE (Ref 5/6)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="rollout">
      <section className="w-full bg-[#F7F9FC] border-t border-slate-200/70 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl space-y-3">
              <SectionBadge variant="blue">
                {st("rollout", "badge", language === "ID" ? "Implementasi Terstruktur" : "Structured Rollout")}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                {st("rollout", "title", language === "ID"
                  ? "Dari Audit Awal Hingga Go-Live dalam 4 Minggu"
                  : "From Initial Audit to 24/7 Go-Live in 4 Weeks")}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              {st("rollout", "subtitle", language === "ID"
                ? "Metodologi deployment tanpa mengganggu layanan pasien aktif, lengkap dengan tim engineer khusus."
                : "Zero-downtime deployment methodology led by dedicated clinical integration engineers.")}
            </p>
          </div>

          {ganttPhases.length > 0 && (() => {
            const selected = ganttPhases[activeGanttIdx];

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
                        activeGanttIdx === idx
                          ? "bg-[#0073FC] text-white"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {c.t(p, "week")}
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
                        activeGanttIdx === idx
                          ? "bg-[#EBF3FF] text-[#0073FC]"
                          : "hover:bg-slate-50 text-slate-500"
                      )}
                    >
                      <span>{c.t(p, "week")}</span>
                      <span className="text-[10px] font-medium opacity-80">0{idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Gantt Track Rows */}
                <div className="space-y-3.5 relative">
                  {ganttPhases.map((phase, idx) => {
                    const isActive = activeGanttIdx === idx;
                    const start = Math.min(4, Math.max(1, Number(c.v(phase, "start")) || 1));
                    const span = Math.min(5 - start, Math.max(1, Number(c.v(phase, "span")) || 1));
                    return (
                      <div key={phase.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        <button
                          type="button"
                          onClick={() => setActiveGanttWeek(idx)}
                          className={cn(
                            GANTT_COL_START[start],
                            GANTT_COL_SPAN[span],
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
                              {c.t(phase, "week")}
                            </span>
                            <span className="block text-sm font-bold truncate mt-0.5">{c.t(phase, "title")}</span>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-white border border-slate-200 text-slate-600"
                            )}
                          >
                            {c.t(phase, "tag")}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Active Phase Detail Strip */}
                <div className="mt-7 pt-6 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#0073FC]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        {c.t(selected, "week")} — {c.t(selected, "title")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{c.t(selected, "deliverables")}</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 px-4 py-3 text-xs">
                    <span className="block text-slate-400 font-medium">
                      {c.text("rollout", "ownerLabel")}
                    </span>
                    <span className="block text-slate-900 font-semibold mt-0.5">{c.t(selected, "owner")}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="cta">
      <CTABanner initialData={cta} bgClassName="bg-white border-t border-slate-200/60" topColor="#FFFFFF" />
      </CmsSlot>
      </CmsSectionList>
    </div>
  );
}
