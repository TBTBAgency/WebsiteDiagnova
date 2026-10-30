"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Eye,
  BrainCircuit,
  Zap,
  UserCheck,
  ShieldAlert,
  ChevronRight,
  Activity,
  FileText,
  Clock,
  HeartPulse,
  Lock,
  Layers,
  HelpCircle,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { novaAISampleTranslations, novaAIDisclaimer } from "@/content/nova-ai";

export default function NovaAIPage() {
  const { language } = useLanguage();
  const [selectedSample, setSelectedSample] = useState<number>(0);

  const workflowSteps = [
    {
      step: "01",
      phase: language === "ID" ? "Amati Pola" : "Observe",
      title: language === "ID" ? "Membaca Pola & Riwayat Lampau" : "Read Patterns & Past History",
      subtitle: language === "ID" ? "Analisis Longitudinal Delta-Check" : "Longitudinal Delta-Check Analysis",
      description:
        language === "ID"
          ? "Nova AI membaca data biomarker saat ini dan membandingkannya dengan riwayat tes pasien sebelumnya secara longitudinal, bukan sekadar melihat batas rentang populasi umum."
          : "Nova AI inspects current biomarker readings against historical patient tests longitudinally, rather than evaluating reference boundaries in isolation.",
      icon: Eye,
      tag: language === "ID" ? "Input Data Analyzer" : "Analyzer Data Ingestion",
    },
    {
      step: "02",
      phase: language === "ID" ? "Terjemahkan" : "Understand",
      title: language === "ID" ? "Menerjemahkan Angka Kompleks" : "Translate Complex Data",
      subtitle: language === "ID" ? "Narasi Klinis Bersih & Terstruktur" : "Structured Clinical Narratives",
      description:
        language === "ID"
          ? "Mengubah deretan angka desimal dan singkatan parameter rumit menjadi rangkuman bahasa klinis yang ringkas, menyoroti deviasi penting yang perlu diperhatikan dokter."
          : "Translates decimal series and technical parameter acronyms into high-yield summaries, spotlighting deviations that warrant immediate physician review.",
      icon: BrainCircuit,
      tag: language === "ID" ? "Natural Language Clinical" : "Natural Language Clinical",
    },
    {
      step: "03",
      phase: language === "ID" ? "Peringatan Dini" : "Assist",
      title: language === "ID" ? "Notifikasi & Deteksi Nilai Kritis" : "Early Warning & Panic Value Alert",
      subtitle: language === "ID" ? "Alert Prioritas ke DPJP & IGD" : "Priority Broadcast to ER & Doctors",
      description:
        language === "ID"
          ? "Memberikan alarm otomatis seketika atas nilai kritis (Panic Values) dan pergeseran tren yang signifikan agar dokter jaga atau klinisi dapat merespons tanpa penundaan."
          : "Triggers instant alerts for critical panic values and abrupt shifts so attending physicians and ER teams can intervene without turnaround lag.",
      icon: Zap,
      tag: language === "ID" ? "Respon Darurat Cepat" : "Instant Emergency Response",
    },
    {
      step: "04",
      phase: language === "ID" ? "Validasi Dokter" : "Decide",
      title: language === "ID" ? "100% Kendali di Tangan Dokter" : "100% Physician Sovereignty",
      subtitle: language === "ID" ? "Human-in-the-Loop Tanpa Black-Box" : "Human-in-the-Loop Principle",
      description:
        language === "ID"
          ? "Nova AI tidak pernah meresepkan obat atau mendiagnosis secara otonom. Seluruh rangkuman dan catatan diserahkan kepada Dokter Penanggung Jawab untuk diverifikasi dan ditandatangani."
          : "Nova AI never issues autonomous diagnoses or prescriptions. Every suggestion and insight is submitted to attending physicians for clinical approval and verified e-signature.",
      icon: UserCheck,
      tag: language === "ID" ? "Etika Medis Mutlak" : "Strict Medical Ethics",
    },
  ];

  const currentSampleData = novaAISampleTranslations[selectedSample];

  // Clinical simulation parameters detail
  const simulationDetails = [
    {
      id: "hb",
      name: "Hemoglobin (Hb)",
      unit: "g/dL",
      val: "8.4",
      prevVal: "10.5",
      delta: "-2.1",
      deltaPercent: "-20%",
      status: "Rendah (Anemia)",
      isCritical: false,
      isWarning: true,
      timeframe: "3 hari lalu",
    },
    {
      id: "gdp",
      name: "Glukosa Darah Puasa",
      unit: "mg/dL",
      val: "186",
      prevVal: "178",
      delta: "+8",
      deltaPercent: "+4.5%",
      status: "Tinggi (Hiperglikemia)",
      isCritical: false,
      isWarning: true,
      timeframe: "2 minggu lalu",
    },
    {
      id: "leuko",
      name: "Leukosit (WBC)",
      unit: "/µL",
      val: "14.800",
      prevVal: "8.200",
      delta: "+6.600",
      deltaPercent: "+80.4%",
      status: "Tinggi (Leukositosis)",
      isCritical: true,
      isWarning: false,
      timeframe: "Kemarin",
    },
    {
      id: "plt",
      name: "Trombosit (Platelet)",
      unit: "/µL",
      val: "245.000",
      prevVal: "240.000",
      delta: "+5.000",
      deltaPercent: "+2.1%",
      status: "Normal & Aman",
      isCritical: false,
      isWarning: false,
      timeframe: "1 bulan lalu",
    },
  ];

  const curSim = simulationDetails[selectedSample];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Asisten Laboratorium Cerdas" : "Intelligent Laboratory Copilot"}
        title={
          language === "ID" ? (
            <>
              AI Membantu Analisis.{" "}
              <br className="hidden sm:inline" />
              Dokter Menentukan Keputusan.
            </>
          ) : (
            <>
              AI Assists Clinical Analysis.{" "}
              <br className="hidden sm:inline" />
              Doctors Make the Decisions.
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Nova AI mengubah deretan angka hasil uji laboratorium yang kompleks menjadi narasi klinis ringkas, mendeteksi anomali pola delta-check, dan mempercepat respons dokter tanpa menggantikan peran manusia."
            : "Nova AI transforms complex laboratory telemetry into concise, actionable clinical narratives, flags longitudinal delta-check anomalies, and accelerates physician response without ever replacing human oversight."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Nova AI" : "Schedule Nova AI Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Lihat Contoh Analisis" : "View Clinical Demo",
          href: "#demo-translation",
        }}
        metrics={[
          {
            value: "100%",
            label: language === "ID" ? "Kendali di Dokter" : "Physician Control",
            sub: language === "ID" ? "Human-in-the-loop mutlak" : "Absolute clinical sovereignty",
          },
          {
            value: "< 3 Detik",
            label: language === "ID" ? "Deteksi Anomali" : "Anomaly Detection",
            sub: language === "ID" ? "Pengecekan lonjakan delta" : "Instant delta check flag",
          },
          {
            value: "0 Black-Box",
            label: language === "ID" ? "AI Transparan & Etis" : "Transparent AI",
            sub: language === "ID" ? "Alasan logis dapat dilacak" : "Traceable clinical logic",
          },
          {
            value: "ISO & KARS",
            label: language === "ID" ? "Kepatuhan Medis" : "Medical Compliance",
            sub: language === "ID" ? "Standar etika Permenkes" : "Ministry of Health aligned",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          NOTICE / ETHICAL BANNER: Kepatuhan Etika Medis Resmi
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FEF9EE] border-b border-amber-200/70 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-[1560px] flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-900 font-medium text-center">
          <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700 shrink-0" />
          <span>
            <strong className="font-bold">{novaAIDisclaimer.badge}:</strong>{" "}
            {language === "ID" ? novaAIDisclaimer.text : "Nova AI assists in pattern summarization and anomaly detection only. Diagnostic and treatment decisions remain 100% under attending physician authority."}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: INTERACTIVE CLINICAL TRANSLATION (UX FOCUS)
          ══════════════════════════════════════════════════════════════ */}
      <section id="demo-translation" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Simulasi Terjemahan Klinis" : "Clinical Translation Simulation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Cara Nova AI Mengubah Angka Menjadi Narasi Medis</>
              ) : (
                <>How Nova AI Translates Complex Lab Telemetry</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Pilih parameter di bawah untuk melihat bagaimana Nova AI membandingkan data dengan riwayat sebelumnya, menyoroti risiko klinis, dan menyajikan catatan bagi dokter."
                : "Select a parameter below to explore how Nova AI compares readings against past history, highlights clinical risks, and generates physician briefing notes."}
            </p>
          </div>

          {/* 4 Interactive Sample Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10">
            {novaAISampleTranslations.map((sample, idx) => {
              const isActive = selectedSample === idx;
              return (
                <button
                  key={sample.parameter}
                  type="button"
                  onClick={() => setSelectedSample(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-[#F8FBFE] text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Activity className={cn("h-4 w-4", isActive ? "text-white" : "text-[#2764B8]")} />
                  <span>{sample.parameter}</span>
                </button>
              );
            })}
          </div>

          {/* Focused Master Showcase Card */}
          <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F5F8FC] via-white to-[#F8FBFE] border border-slate-200/90 p-8 sm:p-10 lg:p-14 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: Clinical Translation & Delta-Check Breakdown */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-xs font-semibold text-[#2764B8] mb-3">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{language === "ID" ? "Interpretasi AI Terstruktur" : "Structured AI Interpretation"}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                    {currentSampleData.parameter}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#345DAB]">
                      {currentSampleData.value}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      (Ref: {currentSampleData.referenceRange})
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                        currentSampleData.rawStatusBadge
                      )}
                    >
                      {currentSampleData.status}
                    </span>
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === "ID" ? "Terjemahan Bahasa Klinis Jelas:" : "Clinical Plain-Language Translation:"}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {currentSampleData.explanation}
                  </p>
                </div>

                {/* Delta-Check Clinical Flag Card */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2764B8]">
                    <TrendingUp className="h-4 w-4" />
                    <span>{language === "ID" ? "Peringatan Delta Check & Catatan Klinis:" : "Delta-Check Flag & Physician Brief:"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                    {currentSampleData.clinicalNote}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                  >
                    <span>{language === "ID" ? "Coba Simulasi Data Rumah Sakit Anda" : "Test Simulation With Your Lab Data"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="text-xs font-semibold text-slate-600 hover:text-[#2764B8] transition-colors"
                  >
                    {language === "ID" ? "Pelajari 4 Tahap Alur Kerja ↓" : "Explore 4-Stage Workflow ↓"}
                  </a>
                </div>
              </div>

              {/* Right Column: Clean Visual Simulation Card */}
              <div className="lg:col-span-5 rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="ml-2 text-xs font-semibold text-slate-700">Nova AI Delta Engine</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                    LIVE VERIFIED
                  </span>
                </div>

                {/* Patient Delta Trend Visualizer */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Komparasi Riwayat Pasien</span>
                    <span className="text-[11px] text-slate-400 font-light">RM: #44912</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Sebelumnya ({curSim.timeframe})</span>
                        <span className="font-mono font-bold text-slate-700">{curSim.prevVal} {curSim.unit}</span>
                      </div>
                      <span className="text-slate-300 text-sm">➔</span>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Hasil Terkini</span>
                        <span className="font-mono font-bold text-[#345DAB]">{curSim.val} {curSim.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs">
                      <span className="text-slate-600 font-medium">Pergeseran Delta:</span>
                      <span className={cn("font-bold font-mono", curSim.isCritical ? "text-rose-600" : curSim.isWarning ? "text-amber-700" : "text-emerald-600")}>
                        {curSim.delta} ({curSim.deltaPercent})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scannable Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-blue-100/70">
                    <span className="font-display text-2xl font-bold text-[#345DAB] block tracking-tight">
                      &lt; 3 Detik
                    </span>
                    <span className="text-xs font-medium text-slate-600 block mt-1 leading-snug">
                      {language === "ID" ? "Waktu Inferensi" : "Inference Time"}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-blue-100/70">
                    <span className="font-display text-2xl font-bold text-emerald-600 block tracking-tight">
                      100%
                    </span>
                    <span className="text-xs font-medium text-slate-600 block mt-1 leading-snug">
                      {language === "ID" ? "Validasi Dokter" : "Doctor Approval"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    ✓ Delta Check Alert
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    ✓ E-Signature Gate
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    ✓ HL7 / FHIR Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4 TAHAP CARA KERJA (#how-it-works)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Alur 4 Tahap" : "4-Stage Workflow"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Alur Kerja Terstruktur yang Menjamin Keselamatan Pasien</>
              ) : (
                <>Structured Pipeline Safeguarding Clinical Integrity</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Bagaimana Nova AI memproses data laboratorium dari instrumen analyzer hingga verifikasi dokter akhir secara transparan dan terukur."
                : "How Nova AI processes telemetry from raw analyzer outputs to final physician verification with transparency."}
            </p>
          </div>

          {/* 4 Clean Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws) => {
              const IconComponent = ws.icon;
              return (
                <div
                  key={ws.step}
                  className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Consistent Icon Container */}
                      <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-400">
                        {ws.step}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {ws.phase}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                        {ws.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mt-2">
                        {ws.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{ws.tag}</span>
                    <Check className="h-3.5 w-3.5 text-[#2764B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: AI + DOKTER: ETIKA & KOLABORASI (#ai-doctor)
          (Dengan visual ilustrasi DNA & Medical Intelligence)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="ai-doctor"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Philosophical & Ethical Stance with Visual Glow */}
            <div className="lg:col-span-6 space-y-6">
              <div className="mb-1">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Etika Medis & Kolaborasi" : "Medical Ethics & Collaboration"}
                </SectionBadge>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
                {language === "ID" ? (
                  <>
                    Mengapa Pendekatan Human-in-the-Loop Sangat Krusial?
                  </>
                ) : (
                  <>
                    Why the Human-in-the-Loop Principle is Non-Negotiable
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
                {language === "ID"
                  ? "Laboratorium medis menangani keputusan kritis mengenai kesehatan pasien. Algoritma AI memiliki keunggulan luar biasa dalam memproses jutaan titik data secara cepat dan mengenali deviasi delta-check. Namun, pertimbangan klinis holistik — termasuk riwayat fisik, keluhan pasien, dan konteks komorbiditas — hanya dapat dievaluasi secara utuh oleh dokter manusia."
                  : "Clinical laboratories handle high-stakes decisions concerning patient care. While AI excels at scanning longitudinal trends and spotting delta deviations instantly, holistic clinical judgment requires human medical expertise."}
              </p>

              <div className="p-5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#345DAB]">
                  <ShieldCheck className="h-5 w-5 text-[#2764B8]" />
                  <span>{language === "ID" ? "Komitmen Kepatuhan Regulasi Kemenkes" : "Ministry of Health Compliance Commitment"}</span>
                </div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {language === "ID"
                    ? "Nova AI dirancang sepenuhnya tunduk pada regulasi rekam medis elektronik Permenkes 24/2022 serta pedoman etika kedokteran KARS dan JCI."
                    : "Nova AI strictly conforms to national EMR mandates (Permenkes 24/2022) and international accreditation ethics (KARS & JCI)."}
                </p>
              </div>

              {/* Quick Summary Pill Strip */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                  ✓ Tanpa Resep Mandiri
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                  ✓ Transparan &amp; Tervalidasi
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80">
                  ✓ Tanggung Jawab Hukum pada Dokter
                </span>
              </div>
            </div>

            {/* Right Column: Comparative Division of Roles (AI vs Dokter) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Role 1: Nova AI */}
              <div className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/90 p-7 sm:p-8 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-white border border-blue-100 text-[#2764B8] flex items-center justify-center shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {language === "ID" ? "Peran Nova AI (Asisten Analitis)" : "Role of Nova AI (Analytical Copilot)"}
                    </h3>
                    <p className="text-xs text-slate-400">Komputasi Cepat &amp; Deteksi Dini Pola</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Memindai jutaan titik data biomarker dan tren lampau dalam milidetik" : "Scans millions of biomarker points and longitudinal histories in milliseconds"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Mendeteksi pergeseran lonjakan delta check sebelum timbul komplikasi" : "Detects subtle longitudinal delta check spikes before complications escalate"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Merangkum angka desimal rumit menjadi narasi ringkas siap baca" : "Synthesizes dense telemetry tables into concise executive summaries"}</span>
                  </div>
                </div>
              </div>

              {/* Role 2: Dokter */}
              <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 space-y-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs border border-emerald-100">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {language === "ID" ? "Peran Dokter (Otoritas Mutlak)" : "Role of Physician (Clinical Authority)"}
                    </h3>
                    <p className="text-xs text-slate-400">Keputusan Medis, Diagnosis &amp; Terapi</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Mengevaluasi keabsahan temuan AI dengan kondisi fisik riil pasien" : "Evaluates AI findings against direct patient examination and clinical history"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Menentukan diagnosis definitif dan merumuskan rencana terapi" : "Establishes definitive diagnoses and prescribes comprehensive treatment"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Mengesahkan lembar hasil laboratorium dengan tanda tangan digital resmi" : "Authorizes final patient reports with legal cryptographic e-signatures"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
