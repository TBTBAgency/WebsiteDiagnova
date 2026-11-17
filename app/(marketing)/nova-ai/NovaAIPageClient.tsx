"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Check,
  Activity,
  FileText,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  BadgeCheck,
  BellRing,
  RotateCcw,
  Server,
  Lock,
  FileCheck2,
  Cpu,
  CheckCheck,
  Clock,
  Zap,
  Mic,
  Sparkles,
  ScanText,
  GitBranch,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { makeContentReader } from "@/lib/cms-page-content";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { resolveCmsHero, heroCta, heroMetrics, HERO_DEFAULTS } from "@/lib/cms-hero";
import type { InnerPageCmsProps } from "@/lib/cms-layout";
import { CmsSectionList, CmsSlot, makeSectionText } from "@/components/cms/CmsSectionList";
import { CTABanner } from "@/components/sections/CTABanner";

interface ClinicalProfile {
  id: string;
  tabLabel: string;
  tabLabelEn: string;
  specimenNo: string;
  patientName: string;
  patientAgeGender: string;
  patientAgeGenderEn: string;
  ward: string;
  wardEn: string;
  attendingDoc: string;
  parameterName: string;
  parameterNameEn: string;
  analyteCode: string;
  currentValue: string;
  unit: string;
  refInterval: string;
  statusLabel: string;
  statusLabelEn: string;
  prevValue: string;
  prevTimestamp: string;
  prevTimestampEn: string;
  deltaText: string;
  deltaPercent: string;
  isDeltaDrop: boolean;
  clinicalImpression: string;
  clinicalImpressionEn: string;
  clinicalRecommendation: string;
  clinicalRecommendationEn: string;
  isPanicValue: boolean;
}

/** Ikon yang dapat dipilih admin (field `icon`, lihat lib/cms-content/nova-ai.ts). */
const ICONS: Record<string, LucideIcon> = {
  ScanText,
  GitBranch,
  FileText,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Sparkles,
  Mic,
  Stethoscope,
  Lock,
  Server,
  FileCheck2,
  Cpu,
  Zap,
  Activity,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  CheckCheck,
  Clock,
  AlertTriangle,
};

const iconFor = (name: string, fallback: LucideIcon): LucideIcon => ICONS[name] ?? fallback;

/** Warna label status kapabilitas (field `statusTone`). */
const STATUS_TONE_CLASS: Record<string, string> = {
  primary: "text-[#0073FC]",
  muted: "text-slate-400",
};

// ── Ilustrasi kartu fitur (#how-it-works): bagian desain, dipilih lewat field `visual` ──

type VisualLang = "ID" | "EN";

/** Monitor Frame Visual: H&E vs Virtual Staining. */
function VirtualStainingVisual({
  language,
  virtualStaining,
  setVirtualStaining,
}: {
  language: VisualLang;
  virtualStaining: boolean;
  setVirtualStaining: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="mt-auto flex flex-col items-center">
      <div className="relative w-full max-w-[440px] rounded-2xl border-[3px] border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Top Toggle Bar inside Monitor */}
        <div className="flex items-center justify-center gap-3 py-3.5 px-4 border-b border-slate-100 bg-white">
          <span className={cn("text-xs font-medium", !virtualStaining ? "text-slate-900 font-bold" : "text-slate-400")}>
            H&amp;E
          </span>
          <button
            type="button"
            onClick={() => setVirtualStaining((prev) => !prev)}
            aria-label="Toggle Virtual Staining"
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
            Virtual Staining
          </span>
        </div>

        {/* Histology Slide Canvas */}
        <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#FDF2F8]">
          <svg className="w-full h-full" viewBox="0 0 400 168" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
                fill={
                  virtualStaining
                    ? idx % 4 === 0
                      ? "#B45309"
                      : "#581C87"
                    : "#831843"
                }
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
                Ki-67: 18.4%
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold tracking-wide">
              40x WSI
            </span>
          </div>

          {/* Floating Blue Pill */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0073FC] text-white text-[11px] font-semibold shadow-[0_6px_18px_-4px_rgba(0,115,252,0.55)] whitespace-nowrap">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{language === "ID" ? "Tanpa proses lab basah" : "Without wet lab work"}</span>
          </div>
        </div>
      </div>
      {/* Monitor Stand */}
      <div className="w-16 h-6 bg-gradient-to-b from-slate-200 to-slate-300" />
      <div className="w-28 h-1.5 rounded-full bg-slate-200" />
    </div>
  );
}

/** Monitor Frame Visual: Smart Routing kasus ke dokter. */
function CaseRoutingVisual() {
  return (
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
            {/* Left 3 Cases */}
            <div className="col-span-4 space-y-2">
              <div className="rounded-lg bg-[#0073FC] text-white p-2 shadow-xs">
                <p className="text-[9px] font-bold">CASE #9435</p>
                <p className="text-[8px] text-blue-100">CITO • IGD</p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-white/30">
                  <div className="h-1 w-3/4 rounded-full bg-white" />
                </div>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2">
                <p className="text-[9px] font-bold text-slate-700">CASE #7889</p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                  <div className="h-1 w-1/2 rounded-full bg-[#0073FC]" />
                </div>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2">
                <p className="text-[9px] font-bold text-slate-700">CASE #9102</p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                  <div className="h-1 w-2/3 rounded-full bg-[#0073FC]" />
                </div>
              </div>
            </div>

            {/* Center Smart Distribution Hub */}
            <div className="col-span-3 flex flex-col items-center justify-center">
              <div className="rounded-xl bg-white border border-blue-200/80 px-2.5 py-3 text-center shadow-xs">
                <Cpu className="h-4 w-4 text-[#0073FC] mx-auto mb-1" />
                <span className="text-[8px] font-bold text-slate-600 leading-tight block uppercase">
                  Smart Routing
                </span>
              </div>
            </div>

            {/* Right 3 Pathologists */}
            <div className="col-span-4 space-y-2">
              {[
                { name: "dr. Hendra", load: "32%", w: "w-1/3" },
                { name: "dr. Ratna", load: "28%", w: "w-1/4" },
                { name: "dr. Budi", load: "45%", w: "w-1/2" },
              ].map((doc) => (
                <div key={doc.name} className="rounded-lg bg-white border border-slate-200 p-2">
                  <div className="flex items-center justify-between text-[8px] font-bold text-slate-800">
                    <span>{doc.name}</span>
                    <span className="text-[#0073FC]">{doc.load}</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                    <div className={`h-1 ${doc.w} rounded-full bg-[#0073FC]`} />
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
  );
}

/** Voice Waveform + Autofill Box. */
function VoiceEntryVisual({ language }: { language: VisualLang }) {
  return (
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
            DIAGNOSIS:
          </span>
          <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
            {language === "ID" ? "Anemia Normositik (D64.9)" : "Malignant Melanoma (T4b)"}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {language === "ID" ? "SPESIMEN:" : "SPECIMEN:"}
          </span>
          <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
            {language === "ID" ? "Darah EDTA • Lab Sentral" : "Skin, Left Forearm"}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pre-Signout Input + Tooltip Widget. */
function PresignoutReviewVisual({ language }: { language: VisualLang }) {
  return (
    <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 min-h-[176px] flex flex-col justify-center">
      <div className="rounded-xl bg-white border border-slate-200/90 px-4 py-3 flex items-center justify-between shadow-2xs">
        <span className="text-sm font-medium text-slate-700">Carcino</span>
        <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
      </div>
      <div className="relative mt-2.5 rounded-xl bg-[#0073FC] text-white px-4 py-3 shadow-[0_12px_28px_-8px_rgba(0,115,252,0.55)] flex items-center gap-2.5">
        <span className="absolute -top-1.5 left-6 w-3 h-3 bg-[#0073FC] rotate-45" />
        <Sparkles className="h-4 w-4 text-blue-100 shrink-0" />
        <span className="text-xs sm:text-[13px] font-medium">
          {language === "ID"
            ? "Maksud Anda 'Carcinoma'? Kode ICD-10 diperbarui."
            : "Did you mean 'Carcinoma'? ICD-10 Code updated."}
        </span>
      </div>
    </div>
  );
}

/** Kartu tambahan admin tanpa ilustrasi khusus: panggung netral berisi ikon kartu. */
function IconStageVisual({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 min-h-[176px] flex flex-col items-center justify-center">
      <div className="h-14 w-14 rounded-2xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center ring-4 ring-blue-200/70">
        <Icon className="h-7 w-7 stroke-[1.75]" />
      </div>
    </div>
  );
}

export default function NovaAIPageClient({ cmsHero, layout, cta, content }: InnerPageCmsProps) {
  const { language } = useLanguage();
  const st = makeSectionText(layout, language);
  const c = makeContentReader(content, language);
  const [virtualStaining, setVirtualStaining] = useState<boolean>(true);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const [authorizedProfiles, setAuthorizedProfiles] = useState<Record<string, boolean>>({});
  const [alertDispatched, setAlertDispatched] = useState<Record<string, boolean>>({});

  const profiles: ClinicalProfile[] = [
    {
      id: "hematology-hb",
      tabLabel: "Hematologi: Hemoglobin (Hb)",
      tabLabelEn: "Hematology: Hemoglobin (Hb)",
      specimenNo: "LAB-261109-01",
      patientName: "Tn. Hendra Wijaya",
      patientAgeGender: "54 Th • Laki-laki • RM #0849201",
      patientAgeGenderEn: "54 Y • Male • MRN #0849201",
      ward: "Rawat Inap Bedah (Kamar 304)",
      wardEn: "Inpatient Surgical Ward (Room 304)",
      attendingDoc: "dr. Bambang Sp.B, Subsp.BD",
      parameterName: "Hemoglobin (Hb)",
      parameterNameEn: "Hemoglobin (Hb)",
      analyteCode: "LOINC 718-7",
      currentValue: "8.4",
      unit: "g/dL",
      refInterval: "13.0 - 17.5 g/dL",
      statusLabel: "Deviasi Rendah (Delta Alert)",
      statusLabelEn: "Low Value (Delta Alert)",
      prevValue: "10.5 g/dL",
      prevTimestamp: "3 hari lalu (12 Nov, 08:30)",
      prevTimestampEn: "3 days ago (Nov 12, 08:30)",
      deltaText: "-2.1 g/dL",
      deltaPercent: "-20.0%",
      isDeltaDrop: true,
      clinicalImpression:
        "Anemia normositik normokromik derajat sedang dengan pergeseran delta akut sebesar -20.0% dalam 72 jam terakhir pasca-tindakan bedah.",
      clinicalImpressionEn:
        "Moderate normocytic normochromic anemia presenting with acute -20.0% longitudinal delta deviation over the past 72 hours post-surgery.",
      clinicalRecommendation:
        "Disarankan evaluasi kecurigaan perdarahan tersembunyi (occult bleeding) atau hemodilusi cairan. Siapkan konfirmasi feses darah samar sebelum intervensi lanjut.",
      clinicalRecommendationEn:
        "Recommend evaluating for occult blood loss or fluid hemodilution. Confirm with occult stool blood testing prior to secondary intervention.",
      isPanicValue: false,
    },
    {
      id: "chemistry-creatinine",
      tabLabel: language === "ID" ? "Kimia Darah: Serum Kreatinin" : "Chemistry: Serum Creatinine",
      tabLabelEn: "Chemistry: Serum Creatinine",
      specimenNo: "LAB-261109-02",
      patientName: "Ny. Ratna Suminar",
      patientAgeGender: "62 Th • Perempuan • RM #0912443",
      patientAgeGenderEn: "62 Y • Female • MRN #0912443",
      ward: "ICU / Rawat Intensif (Bed 02)",
      wardEn: "ICU / Intensive Care Unit (Bed 02)",
      attendingDoc: "dr. Cynthia Sp.PD-KGH",
      parameterName: language === "ID" ? "Serum Kreatinin (Enzimatik)" : "Serum Creatinine (Enzymatic)",
      parameterNameEn: "Serum Creatinine (Enzymatic)",
      analyteCode: "LOINC 2160-0",
      currentValue: "2.85",
      unit: "mg/dL",
      refInterval: "0.50 - 1.10 mg/dL",
      statusLabel: "Peningkatan Akut (Risiko AKI)",
      statusLabelEn: "Acute Rise (AKI Risk)",
      prevValue: "1.10 mg/dL",
      prevTimestamp: "2 hari lalu (13 Nov, 14:10)",
      prevTimestampEn: "2 days ago (Nov 13, 14:10)",
      deltaText: "+1.75 mg/dL",
      deltaPercent: "+159.1%",
      isDeltaDrop: false,
      clinicalImpression:
        "Lonjakan serum kreatinin > 100% dari baseline dalam 48 jam memenuhi kriteria KDIGO Stage 2 Acute Kidney Injury (AKI) disertai penurunan eGFR tajam.",
      clinicalImpressionEn:
        "Serum creatinine elevation > 100% from baseline in 48 hours satisfies KDIGO Stage 2 Acute Kidney Injury (AKI) criteria with acute eGFR decline.",
      clinicalRecommendation:
        "Segera tinjau ulang dosis terapi antibiotik/obat nefrotoksik, evaluasi keseimbangan cairan pasien, dan pantau elektrolit kalium serial.",
      clinicalRecommendationEn:
        "Urgent review of nephrotoxic medication and antibiotic dosing, optimize fluid resuscitation, and monitor serial serum potassium.",
      isPanicValue: true,
    },
    {
      id: "metabolic-glucose",
      tabLabel: language === "ID" ? "Metabolik: Glukosa Darah Puasa" : "Metabolic: Fasting Glucose",
      tabLabelEn: "Metabolic: Fasting Glucose",
      specimenNo: "LAB-261109-03",
      patientName: "Tn. Agus Darmawan",
      patientAgeGender: "48 Th • Laki-laki • RM #0771892",
      patientAgeGenderEn: "48 Y • Male • MRN #0771892",
      ward: "Poli Penyakit Dalam (Rawat Jalan)",
      wardEn: "Internal Medicine Outpatient Clinic",
      attendingDoc: "dr. Hendro Sp.PD-KEMD",
      parameterName: language === "ID" ? "Glukosa Darah Puasa (GDP)" : "Fasting Blood Glucose",
      parameterNameEn: "Fasting Blood Glucose",
      analyteCode: "LOINC 1558-6",
      currentValue: "248",
      unit: "mg/dL",
      refInterval: "70 - 100 mg/dL",
      statusLabel: "Hiperglikemia Subakut",
      statusLabelEn: "Subacute Hyperglycemia",
      prevValue: "142 mg/dL",
      prevTimestamp: "3 minggu lalu (24 Okt)",
      prevTimestampEn: "3 weeks ago (Oct 24)",
      deltaText: "+106 mg/dL",
      deltaPercent: "+74.6%",
      isDeltaDrop: false,
      clinicalImpression:
        "Hiperglikemia berat dengan lonjakan nilai +74.6% dari baseline kunjungan terakhir, mengindikasikan dekompensasi kontrol metabolik subakut.",
      clinicalImpressionEn:
        "Severe fasting hyperglycemia with +74.6% elevation from previous encounter baseline, pointing to subacute metabolic decompensation.",
      clinicalRecommendation:
        "Disarankan konfirmasi pemeriksaan HbA1c, skrining glukosuria/ketonuria, dan pertimbangkan intensifikasi regimen terapi antidiabetes.",
      clinicalRecommendationEn:
        "Confirmatory HbA1c testing and urine ketone screening advised; consider therapeutic intensification for glycemic stabilization.",
      isPanicValue: false,
    },
    {
      id: "hemostasis-plt",
      tabLabel: language === "ID" ? "Hemostasis: Trombosit (Serial)" : "Hemostasis: Platelets (Serial)",
      tabLabelEn: "Hemostasis: Platelets (Serial)",
      specimenNo: "LAB-261109-04",
      patientName: "An. Salsabila Putri",
      patientAgeGender: "9 Th • Perempuan • RM #1002341",
      patientAgeGenderEn: "9 Y • Female • MRN #1002341",
      ward: "IGD & Resusitasi Pediatrik",
      wardEn: "Pediatric Emergency & Resuscitation",
      attendingDoc: "dr. Maya Sp.A, Subsp.Hem",
      parameterName: language === "ID" ? "Hitung Trombosit (Platelet)" : "Platelet Count (PLT)",
      parameterNameEn: "Platelet Count (PLT)",
      analyteCode: "LOINC 777-3",
      currentValue: "14.000",
      unit: "/µL",
      refInterval: "150.000 - 450.000 /µL",
      statusLabel: "Nilai Kritis (KARS SKP 2.2)",
      statusLabelEn: "Critical Value (KARS SKP 2.2)",
      prevValue: "88.000 /µL",
      prevTimestamp: "Kemarin sore (14 Nov, 16:20)",
      prevTimestampEn: "Yesterday evening (Nov 14, 16:20)",
      deltaText: "-74.000 /µL",
      deltaPercent: "-84.1%",
      isDeltaDrop: true,
      clinicalImpression:
        "Nilai Kritis Darurat (Trombosit < 20.000/µL): Penurunan drastis 84.1% dalam 18 jam dengan risiko tinggi perdarahan spontan intraserebral/mukosa.",
      clinicalImpressionEn:
        "Emergency Critical Value (PLT < 20,000/µL): Precipitous 84.1% plunge in 18 hours with severe risk of spontaneous internal hemorrhage.",
      clinicalRecommendation:
        "Protokol KARS SKP 2.2: Wajib lapor ke DPJP/Dokter Jaga IGD < 15 menit. Siapkan transfusi konsentrat trombosit (TC) & verifikasi apusan darah tepi.",
      clinicalRecommendationEn:
        "Mandatory KARS SKP 2.2 Protocol: Critical reporting to ER physician < 15 mins. Crossmatch platelet concentrate (TC) & review peripheral blood smear.",
      isPanicValue: true,
    },
  ];

  const currentProfile = profiles[selectedProfileIdx];
  const isAuthorized = authorizedProfiles[currentProfile.id];
  const isAlertSent = alertDispatched[currentProfile.id];

  const handleToggleAuthorize = () => {
    setAuthorizedProfiles((prev) => ({
      ...prev,
      [currentProfile.id]: !prev[currentProfile.id],
    }));
  };

  const handleDispatchAlert = () => {
    setAlertDispatched((prev) => ({
      ...prev,
      [currentProfile.id]: true,
    }));
  };

  const handleResetProfile = () => {
    setAuthorizedProfiles((prev) => ({
      ...prev,
      [currentProfile.id]: false,
    }));
    setAlertDispatched((prev) => ({
      ...prev,
      [currentProfile.id]: false,
    }));
  };

  const workflowPipeline = [
    {
      stepLabel: "01",
      title: language === "ID" ? "Interfacing Dua Arah Analyzer" : "Bi-Directional Analyzer Interfacing",
      protocol: "ASTM E1381 • HL7 v2 / FHIR",
      desc:
        language === "ID"
          ? "Data hasil uji dari 500+ instrumen hematologi, kimia klinis, dan imunologi ditransmisikan secara langsung tanpa entri manual, meniadakan risiko salah ketik."
          : "Direct telemetry ingestion from 500+ hematology, chemistry, and immunoassay instruments with zero manual entry, eliminating transcription errors.",
      icon: Server,
    },
    {
      stepLabel: "02",
      title: language === "ID" ? "Mesin Delta-Check Longitudinal" : "Longitudinal Delta-Check Engine",
      protocol: "Statistical Z-Score • Patient Delta Rules",
      desc:
        language === "ID"
          ? "Sistem membandingkan nilai terkini dengan rekam jejak pemeriksaan pasien terdahulu secara serial, mendeteksi pergeseran anomali akut antar-kunjungan."
          : "Compares current results against historical patient baselines sequentially, catching acute deviations that static reference ranges miss.",
      icon: TrendingUp,
    },
    {
      stepLabel: "03",
      title: language === "ID" ? "Draf Interpretasi & Triage Kritis" : "Clinical Draft & Critical Triage",
      protocol: "KARS SKP 2.2 • LOINC & SNOMED-CT",
      desc:
        language === "ID"
          ? "Menyiapkan draf narasi klinis terstandar dan secara otomatis menyiarkan notifikasi nilai kritis ke WhatsApp dan SIMRS dokter jaga dalam waktu < 15 menit."
          : "Prepares standardized clinical summaries and automatically broadcasts critical panic alerts to attending teams in under 15 minutes.",
      icon: BellRing,
    },
    {
      stepLabel: "04",
      title: language === "ID" ? "Otorisasi Dokter Sp.PK & E-Sign" : "Pathologist Sign-Off & E-Sign",
      protocol: "BSrE Certified • 100% Human Sovereignty",
      desc:
        language === "ID"
          ? "Dokter Spesialis Patologi Klinik meninjau, menyunting, dan membubuhkan tanda tangan digital resmi sebelum hasil dirilis ke SIMRS atau SATUSEHAT."
          : "Certified pathologists review, edit, and digitally sign the finalized report before official dispatch to hospital EMR and SATUSEHAT.",
      icon: FileCheck2,
    },
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PageHero (Enterprise Medical SaaS Aesthetic)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSectionList layout={layout}>
      <CmsSlot id="hero">
      <PageHero
        cms={resolveCmsHero(cmsHero, language)}
        badge={language === "ID" ? "Clinical Decision Support System (CDSS)" : "Clinical Decision Support System (CDSS)"}
        title={
          language === "ID" ? (
            <>
              Otomasi Delta-Check &{" "}
              <br className="hidden sm:inline" />
              Validasi Cerdas Hasil Laboratorium
            </>
          ) : (
            <>
              Automated Delta-Check &{" "}
              <br className="hidden sm:inline" />
              Intelligent Laboratory Validation
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Mempercepat waktu rilis hasil uji (TAT), mendeteksi deviasi biomarker longitudinal antar-kunjungan pasien, dan menyiapkan draf interpretasi klinis—dengan 100% kendali verifikasi di tangan dokter spesialis patologi."
            : "Slashing turnaround time (TAT), flagging longitudinal biomarker deviations across patient visits, and preparing structured clinical drafts—with 100% verification authority retained by certified pathologists."
        }
        primaryCta={heroCta(cmsHero, "primaryCta", HERO_DEFAULTS.nova_ai, language)}
        secondaryCta={heroCta(cmsHero, "secondaryCta", HERO_DEFAULTS.nova_ai, language)}
        metrics={heroMetrics(cmsHero, HERO_DEFAULTS.nova_ai, language)}
      />
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: SYSTEM OF RECORD VS SYSTEM OF ACTION
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="system-of-action">
      <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-y border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("system-of-action", "badge", language === "ID" ? "Paradigma Baru LIS" : "The LIS System of Action")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {st("system-of-action", "title", language === "ID"
                  ? "Dari System of Record Menuju System of Action"
                  : "From System of Record to System of Action")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("system-of-action", "subtitle", language === "ID"
                ? "LIS konvensional berhenti pada pencatatan pasif. Nova AI membaca konteks klinis secara aktif—mengekstrak order, menghitung tren delta, dan menyiapkan draf laporan siap sah."
                : "Traditional LIS stops at passive record-keeping. Nova AI reads clinical context actively—extracting orders, computing delta trends, and preparing sign-off-ready drafts.")}
            </p>
          </div>

          {/* 2-Card Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Traditional LIS */}
            <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-800">
                  {c.text("system-of-action", "legacyTitle")}
                </h3>
                <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-400/80 text-white text-xs font-semibold">
                  <Server className="h-3.5 w-3.5" />
                  <span>{c.text("system-of-action", "legacyBadge")}</span>
                </div>

                <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-600">
                  {c.list("system-of-action", "legacyPoints").map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{c.t(item, "text")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Card: Diagnova Nova AI */}
            <div className="rounded-[28px] bg-white border-2 border-[#0073FC]/25 p-7 sm:p-9 shadow-[0_14px_38px_-12px_rgba(0,115,252,0.16)] flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[#0073FC]">
                  {c.text("system-of-action", "modernTitle")}
                </h3>
                <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0073FC] text-white text-xs font-semibold shadow-[0_4px_14px_-3px_rgba(0,115,252,0.45)]">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{c.text("system-of-action", "modernBadge")}</span>
                </div>

                <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                  {c.list("system-of-action", "modernPoints").map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                      <span>{c.t(item, "text")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: PATHOLOGIST WORKSTATION & AI CAPABILITIES (#workstation-demo)
          (3x2 Flat Card Grid on Pure White Background)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="workstation-demo">
      <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("workstation-demo", "badge", language === "ID" ? "Meja Kerja Patologi Klinik" : "Pathologist Workstation")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {st("workstation-demo", "title", language === "ID"
                  ? "Bagaimana Nova AI Mendukung Otorisasi Dokter"
                  : "How Nova AI Powers Pathologist Sign-Off Workflows")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("workstation-demo", "subtitle", language === "ID"
                ? "Enam kapabilitas agen cerdas yang tertanam langsung di meja kerja dokter Sp.PK—mempercepat validasi tanpa mengurangi otoritas medis."
                : "Six embedded AI capabilities inside the pathologist desk—accelerating sign-off without altering physician authority.")}
            </p>
          </div>

          {/* 3x2 Flat Cards Grid — Horizontal snap-scroll on mobile, grid on md+ */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 sm:gap-6 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
            {c.list("workstation-demo", "capabilities").map((item) => {
              const cap = {
                title: c.t(item, "title"),
                status: c.t(item, "status"),
                statusColor: STATUS_TONE_CLASS[c.v(item, "statusTone")] ?? STATUS_TONE_CLASS.primary,
                desc: c.t(item, "desc"),
              };
              const CapIcon = iconFor(c.v(item, "icon"), ScanText);
              return (
                <div
                  key={item.id}
                  className="w-[84vw] max-w-[330px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[22px] bg-[#F7F9FC] border border-transparent p-6 sm:p-8 flex flex-col gap-5 transition-all duration-200 hover:bg-[#F1F5FA] hover:border-blue-200/70 hover:shadow-[0_10px_28px_-12px_rgba(0,115,252,0.14)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                      <CapIcon className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                        {cap.title}
                      </h3>
                      <span className={cn("text-xs font-medium block mt-0.5", cap.statusColor)}>
                        {cap.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-normal">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4-STAGE LABORATORY PIPELINE (#how-it-works)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="how-it-works">
      <section
        id="how-it-works"
        className="scroll-mt-28 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("how-it-works", "badge", language === "ID" ? "Alur Kerja 4 Tahap" : "4-Stage Clinical Pipeline")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {st("how-it-works", "title", language === "ID"
                  ? "Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien"
                  : "Structured Pipeline Safeguarding Clinical Integrity & Accuracy")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("how-it-works", "subtitle", language === "ID"
                ? "Dari pembacaan instrumen analitik hingga otorisasi digital dokter spesialis, setiap tahap didesain dengan ketertelusuran penuh dan kepatuhan akreditasi rumah sakit."
                : "From direct analyzer telemetry to certified pathologist authorization, every phase is engineered with full audit traceability and hospital accreditation standards.")}
            </p>
          </div>

          {/* 2x2 Symmetrical AI Feature Cards (Matches LigoLab AI Agents Reference) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {c.list("how-it-works", "cards").map((item) => {
              const CardIcon = iconFor(c.v(item, "icon"), Sparkles);
              const points = c
                .t(item, "points")
                .split(/\r?\n/)
                .map((p) => p.trim())
                .filter(Boolean);
              const visual = c.v(item, "visual");
              return (
                <div
                  key={item.id}
                  className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <CardIcon className="h-5 w-5 text-[#0073FC] shrink-0" />
                      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                        {c.t(item, "title")}
                      </h3>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                      {points.map((point, i) => (
                        <li key={`${i}-${point}`} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {visual === "virtual-staining" ? (
                    <VirtualStainingVisual
                      language={language}
                      virtualStaining={virtualStaining}
                      setVirtualStaining={setVirtualStaining}
                    />
                  ) : visual === "case-routing" ? (
                    <CaseRoutingVisual />
                  ) : visual === "voice-entry" ? (
                    <VoiceEntryVisual language={language} />
                  ) : visual === "presignout-review" ? (
                    <PresignoutReviewVisual language={language} />
                  ) : (
                    <IconStageVisual icon={CardIcon} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CLINICAL GOVERNANCE & RESPONSIBILITY MATRIX (#ai-doctor)
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="ai-doctor">
      <section
        id="ai-doctor"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full space-y-10 sm:space-y-12">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {st("ai-doctor", "badge", language === "ID" ? "Tata Kelola Klinis & Keamanan Data" : "Clinical Governance & Security")}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {st("ai-doctor", "title", language === "ID"
                  ? "Kepatuhan & Keamanan untuk Data Klinis Sensitif"
                  : "Compliance & Security Built for Clinical Data")}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {st("ai-doctor", "subtitle", language === "ID"
                ? "Nova AI beroperasi dengan prinsip Human-in-the-Loop mutlak—mempercepat analisis data laboratorium sekaligus menjaga otoritas hukum dokter dan keamanan rekam medis."
                : "Nova AI operates under strict Human-in-the-Loop governance—accelerating lab intelligence while safeguarding physician sovereignty and patient record security.")}
            </p>
          </div>

          {/* Compliance & Governance Banner */}
          <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0073FC] text-[11px] font-bold uppercase tracking-wider border border-blue-200/70">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{c.text("ai-doctor", "governanceBadge")}</span>
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {c.text("ai-doctor", "governanceTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
                  {c.text("ai-doctor", "governanceDesc")}
                </p>
              </div>

              {/* 6 Compliance Badges (Balanced 3x2 Grid) */}
              <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {c.list("ai-doctor", "complianceBadges").map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white border border-slate-200/80 px-3.5 py-3 shadow-2xs flex items-center gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{c.v(item, "code")}</span>
                      <span className="text-[10px] font-medium text-slate-500 block">{c.t(item, "label")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Card Safeguards Grid: Order to Report */}
          <div className="space-y-6 pt-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              {c.text("ai-doctor", "safeguardsTitle")}
            </h3>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible">
              {c.list("ai-doctor", "safeguards").map((entry) => {
                const item = { title: c.t(entry, "title"), desc: c.t(entry, "desc") };
                const ItemIcon = iconFor(c.v(entry, "icon"), ShieldCheck);
                return (
                  <div
                    key={entry.id}
                    className="w-[78vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none rounded-[22px] bg-[#F7F9FC] border border-transparent p-6 sm:p-7 space-y-4 transition-all duration-200 hover:bg-[#F1F5FA] hover:border-blue-200/70 hover:shadow-[0_10px_28px_-12px_rgba(0,115,252,0.14)]"
                  >
                    <div className="h-11 w-11 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
                      <ItemIcon className="h-5 w-5 stroke-[1.75]" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#0073FC]">
              {c.text("ai-doctor", "footnote")}
            </p>
          </div>
        </div>
      </section>
      </CmsSlot>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Standardized Enterprise Banner
          ══════════════════════════════════════════════════════════════ */}
      <CmsSlot id="cta">
      <CTABanner initialData={cta} bgClassName="bg-[#FAFBFD] border-t border-slate-200/60" topColor="#FAFBFD" />
      </CmsSlot>
      </CmsSectionList>
    </div>
  );
}
