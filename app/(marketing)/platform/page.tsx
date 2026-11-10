"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Network,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Server,
  FileText,
  Lock,
  BarChart3,
  TrendingUp,
  Cpu,
  ChevronRight,
  Check,
  AlertCircle,
  FileCheck2,
  QrCode,
  Activity,
  Layers,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function PlatformPage() {
  const { language } = useLanguage();
  const [activeAuditStep, setActiveAuditStep] = useState<number>(0);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Platform Diagnova" : "Diagnova Platform"}
        title={
          language === "ID" ? (
            <>
              Platform Terpadu Pengelolaan{" "}
              <br className="hidden sm:inline" />
              Alur Kerja Laboratorium Modern
            </>
          ) : (
            <>
              One Connected Platform to Manage{" "}
              <br className="hidden sm:inline" />
              Modern Laboratory Workflows
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Menghubungkan instrumen analyzer, analis medis, dokter patologi, dan SIMRS/RME ke dalam satu alur kerja digital yang presisi, bebas salah sampel, dan terpantau secara real-time."
            : "Connecting medical analyzers, laboratory analysts, pathologists, and hospital HIS/EMR into a unified digital pipeline that is precise, error-free, and monitored in real-time."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Platform" : "Schedule Platform Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Pelajari Alur Kerja" : "Explore Workflow",
          href: "#workflow",
        }}
        metrics={[
          {
            value: "-70%",
            label: language === "ID" ? "Pangkas TAT" : "Cut Turnaround Time",
            sub: language === "ID" ? "Dari order ke klinisi" : "Order to clinician",
          },
          {
            value: "100%",
            label: language === "ID" ? "Otomasi Interfacing" : "Direct Interfacing",
            sub: language === "ID" ? "Eliminasi entri manual" : "Zero manual entry",
          },
          {
            value: "0 Error",
            label: language === "ID" ? "Salah Sampel" : "Sample Mix-ups",
            sub: language === "ID" ? "Verifikasi barcode 2D" : "2D barcode check",
          },
          {
            value: "ISO 15189",
            label: language === "ID" ? "Kepatuhan Audit" : "Audit Compliance",
            sub: language === "ID" ? "KARS & JCI compliant" : "KARS & JCI compliant",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: #workflow - Alur Kerja 4 Tahap
          (Menggunakan komponen asli Home Page yang rapi & interaktif)
          ══════════════════════════════════════════════════════════════ */}
      <div id="workflow" className="scroll-mt-28">
        <WorkflowSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #automation - 100% Otomatisasi & Interfacing
          (Alternating background: #F9F9F9, Card rounded-3xl)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="automation"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Otomatisasi 100%" : "100% Automation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Interfacing Dua Arah dengan 500+ Instrumen Medis
                </>
              ) : (
                <>
                  Direct Bidirectional Interfacing with 500+ Medical Analyzers
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Mengeliminasi entri data manual sepenuhnya. Diagnova berkomunikasi langsung dua arah dengan instrumen laboratorium melalui protokol HL7 dan ASTM standar internasional."
                : "Completely eliminate manual data entry. Diagnova establishes native two-way communication with any laboratory instrument brand via industry-standard HL7 and ASTM protocols."}
            </p>
          </div>

          {/* 3 Large Characteristic Cards (Matching Comparison/Infrastructure Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Pangkas TAT Hingga 70%" : "Cut Turnaround Time by 70%"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Hasil uji hematologi, kimia darah, dan urin langsung terkirim begitu mesin selesai beroperasi tanpa antrean ketik manual oleh analis."
                    : "Hematology, biochemistry, and urinalysis results stream directly to physician screens upon analyzer completion with zero manual typing."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Bebas antrean ketik analis" : "No typing backlog during peak shifts"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Notifikasi nilai kritis otomatis" : "Real-time critical value alerts"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Auto-Verification Engine" : "Auto-Verification Engine"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Rule engine fleksibel sesuai SOP RS. Spesimen dengan nilai normal dan lolos uji delta-check diverifikasi otomatis sehingga dokter fokus pada kasus darurat."
                    : "Flexible rule engine matching your hospital SOPs. Samples within normal limits and passing delta checks verify automatically, freeing doctors for complex cases."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Konfigurasi delta-check RS" : "Hospital-specific delta checks"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Pemisahan kasus abnormal instan" : "Instant abnormal sample triage"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Resilient Edge Buffer" : "Resilient Edge Buffer"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Koneksi jaringan terganggu? Diagnova Gateway menyimpan data analyzer di buffer edge lokal dan menyinkronkan seluruh paket data begitu jaringan pulih."
                    : "Network instability? Diagnova's edge gateway locally buffers analyzer transmissions and resyncs all data packets upon reconnection with zero data loss."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Toleransi offline hingga 72 jam" : "Offline resilience up to 72 hours"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Uptime operasional lab 99,9%" : "99.9% laboratory operational uptime"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: #reporting - Digital Audit Trail & Medical Reporting
          (Clean Healthcare White Background, Real Medical Specimen Card)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="reporting"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Context & Accreditation Details */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mb-4">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kepatuhan & Akreditasi" : "Compliance & Accreditation"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
                {language === "ID" ? (
                  <>
                    Jejak Audit Digital Permanen,
                    <br />
                    Standar KARS &amp; ISO 15189
                  </>
                ) : (
                  <>
                    Permanent Digital Audit Trail,
                    <br />
                    KARS &amp; ISO 15189 Ready
                  </>
                )}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                {language === "ID"
                  ? "Transparansi penuh untuk setiap tindakan laboratorium. Setiap perubahan hasil, kalibrasi alat, dan approval dokter tercatat permanen dengan cap waktu (timestamp) hingga milidetik."
                  : "Absolute transparency for every clinical action. Every result change, instrument calibration, and physician sign-off is permanently recorded with millisecond-level timestamps."}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[20px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#2764B8] font-bold text-sm">
                    <Lock className="h-4 w-4" />
                    <span>{language === "ID" ? "Log Anti-Manipulasi" : "Tamper-Proof Logs"}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Catatan historis tidak dapat diedit atau dihapus, memenuhi persyaratan akreditasi KARS & JCI."
                      : "Historical entries cannot be altered or purged, satisfying KARS & JCI accreditation criteria."}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#2764B8] font-bold text-sm">
                    <FileCheck2 className="h-4 w-4" />
                    <span>{language === "ID" ? "E-Sign Dokter Bersertifikat" : "Certified E-Signatures"}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Tanda tangan digital dokter Sp.PK dengan QR verifikasi keaslian langsung pada lembar hasil."
                      : "Certified pathologist e-signatures with instant QR-code verification on patient reports."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Clinical Specimen Timeline Card (Bukan Terminal Hitam) */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-sm overflow-hidden">
                {/* 1. Realistic Specimen Tube & Barcode Header Strip */}
                <div className="bg-[#FAFBFD] border-b border-slate-200/80 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Visual Vacutainer & Patient Identity */}
                    <div className="flex items-center gap-3.5">
                      {/* CSS/SVG Rendered Vacutainer Tube (Lavender K2-EDTA) */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="w-5 h-14 rounded-b-full border border-slate-300 bg-gradient-to-b from-transparent via-red-900/80 to-red-950 p-[2px] shadow-2xs relative overflow-hidden">
                          {/* Tube Cap (Lavender EDTA) */}
                          <div className="absolute top-0 inset-x-0 h-3 bg-purple-600 rounded-xs border-b border-purple-800" />
                          {/* Blood Meniscus Line */}
                          <div className="absolute bottom-1 inset-x-0.5 h-7 bg-gradient-to-t from-red-950 to-red-800 rounded-b-full opacity-90" />
                          {/* Tube Measurement Graduations */}
                          <div className="absolute top-5 right-0.5 w-1.5 h-[1px] bg-white/40" />
                          <div className="absolute top-7 right-0.5 w-2 h-[1px] bg-white/40" />
                          <div className="absolute top-9 right-0.5 w-1.5 h-[1px] bg-white/40" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2764B8] tracking-tight bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                            #DX-98214
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                            CITO / IGD
                          </span>
                        </div>
                        <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 mt-1">
                          Bpk. Suryadi (54 Th / L)
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                          <span>RM-44912</span>
                          <span>•</span>
                          <span>K2-EDTA (3.0 mL)</span>
                          <span>•</span>
                          <span>TAT: 19 Min</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification Status Pill */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{language === "ID" ? "E-Sign Sah BSrE" : "BSrE E-Sign Valid"}</span>
                      </span>
                      <span className="block text-[10px] font-mono text-slate-400 mt-1">
                        ISO 15189 Compliant
                      </span>
                    </div>
                  </div>

                  {/* Visual Barcode 2D Graphic */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      {/* Barcode Lines Graphic */}
                      <div className="h-4 flex items-center gap-[2px] opacity-75">
                        <span className="w-[1.5px] h-3.5 bg-slate-800" />
                        <span className="w-[3px] h-3.5 bg-slate-800" />
                        <span className="w-[1px] h-3.5 bg-slate-800" />
                        <span className="w-[2px] h-3.5 bg-slate-800" />
                        <span className="w-[1px] h-3.5 bg-slate-800" />
                        <span className="w-[3px] h-3.5 bg-slate-800" />
                        <span className="w-[1px] h-3.5 bg-slate-800" />
                        <span className="w-[2px] h-3.5 bg-slate-800" />
                        <span className="w-[1.5px] h-3.5 bg-slate-800" />
                        <span className="w-[2.5px] h-3.5 bg-slate-800" />
                        <span className="w-[1px] h-3.5 bg-slate-800" />
                        <span className="w-[3px] h-3.5 bg-slate-800" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">2D-BARCODE: 98214-IGD-CITO-K2</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {language === "ID" ? "Target TAT Terpenuhi" : "TAT Target Met"}
                    </span>
                  </div>
                </div>

                {/* 2. Interactive Medical Lifecycle Timeline */}
                <div className="p-5 sm:p-6 space-y-3 bg-white">
                  {/* Step 0: E-Sign & Validation (Active / High Impact) */}
                  <div
                    onClick={() => setActiveAuditStep(0)}
                    className={cn(
                      "rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left",
                      activeAuditStep === 0
                        ? "bg-[#F8FBFE] border-[#2764B8]/40 shadow-xs ring-1 ring-[#2764B8]/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <FileCheck2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">08:14:22 WIB</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {language === "ID" ? "Tahap Akhir" : "Final Stage"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                            {language === "ID"
                              ? "Validasi E-Sign & Rilis Otomatis ke RME SIMRS"
                              : "E-Signature Validated & Auto-Released to HIS EMR"}
                          </p>
                          <p className="text-[11px] text-[#2764B8] font-semibold mt-0.5">
                            Dr. dr. Handoko, Sp.PK • SIP: 446/182/SIP-DS/2023
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
                          activeAuditStep === 0 && "rotate-180 text-[#2764B8]"
                        )}
                      />
                    </div>

                    {/* Expanded Detail Panel when Selected */}
                    {activeAuditStep === 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-100/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100/90 flex items-center gap-2">
                          <QrCode className="h-6 w-6 text-[#2764B8] shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-[10px] text-slate-500 font-medium block">Sertifikat BSrE BSSN</span>
                            <span className="font-mono text-[10px] text-slate-800 font-bold truncate block">
                              ID: 8821-BSSN-MOH-VALID
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-blue-100/90 flex items-center gap-2">
                          <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 font-medium block">Bridging SATUSEHAT</span>
                            <span className="text-[10px] font-bold text-emerald-700 block">
                              FHIR DiagnosticReport Sent
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 1: Analyzer Telemetry */}
                  <div
                    onClick={() => setActiveAuditStep(1)}
                    className={cn(
                      "rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left",
                      activeAuditStep === 1
                        ? "bg-[#F8FBFE] border-[#2764B8]/40 shadow-xs ring-1 ring-[#2764B8]/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-blue-100 text-[#2764B8] flex items-center justify-center shrink-0 mt-0.5">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">08:11:05 WIB</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#2764B8] border border-blue-200/60">
                              Sysmex XN-1000
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                            {language === "ID"
                              ? "Telemetri Hasil Analyzer Terserap (Zero Rekeying)"
                              : "Analyzer Values Ingested Directly via ASTM"}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            TCP/IP Bidirectional Host Query • QC Westgard: Pass
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
                          activeAuditStep === 1 && "rotate-180 text-[#2764B8]"
                        )}
                      />
                    </div>

                    {/* Ingested Lab Values when clicked */}
                    {activeAuditStep === 1 && (
                      <div className="mt-3 pt-3 border-t border-blue-100/80">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Hemoglobin</span>
                            <span className="font-mono text-xs font-bold text-slate-900">14.2 g/dL</span>
                            <span className="text-[9px] text-emerald-600 block">Normal</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Leukosit (WBC)</span>
                            <span className="font-mono text-xs font-bold text-slate-900">7.400 /µL</span>
                            <span className="text-[9px] text-emerald-600 block">Normal</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Trombosit</span>
                            <span className="font-mono text-xs font-bold text-slate-900">245.000 /µL</span>
                            <span className="text-[9px] text-emerald-600 block">Normal</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Phlebotomy & Centrifuge Scanning */}
                  <div
                    onClick={() => setActiveAuditStep(2)}
                    className={cn(
                      "rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left",
                      activeAuditStep === 2
                        ? "bg-[#F8FBFE] border-[#2764B8]/40 shadow-xs ring-1 ring-[#2764B8]/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">08:02:18 WIB</span>
                            <span className="text-[11px] font-medium text-slate-600">Siti N., A.Md.AK</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                            {language === "ID"
                              ? "Barcode Dipindai & Masuk Rak Sentrifus #B-04"
                              : "Barcode Scanned & Assigned to Centrifuge Rack #B-04"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
                          activeAuditStep === 2 && "rotate-180 text-[#2764B8]"
                        )}
                      />
                    </div>
                  </div>

                  {/* Step 3: Inbound Bridging from SIMRS */}
                  <div
                    onClick={() => setActiveAuditStep(3)}
                    className={cn(
                      "rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-left",
                      activeAuditStep === 3
                        ? "bg-[#F8FBFE] border-[#2764B8]/40 shadow-xs ring-1 ring-[#2764B8]/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Server className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-500">07:55:00 WIB</span>
                            <span className="text-[11px] font-medium text-slate-600">Bridging SIMRS IGD</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                            {language === "ID"
                              ? "Order Masuk dari dr. Jaga IGD (Prioritas CITO)"
                              : "Inbound Order from ER (CITO Priority)"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
                          activeAuditStep === 3 && "rotate-180 text-[#2764B8]"
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Tamper-Proof Cryptographic Hash Footer */}
                <div className="bg-[#FAFBFD] px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                    <Lock className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span className="truncate max-w-[240px] sm:max-w-[320px]">
                      SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    KARS SKP 2.2 Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: #analytics - Nova AI & Analitik Operasional
          (Alternating background: #F9F9F9)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="analytics"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Nova AI & Analitik" : "Nova AI & Analytics"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Wawasan Operasional &amp; Asisten Klinis Nova AI
                </>
              ) : (
                <>
                  Operational Insights &amp; Nova AI Clinical Intelligence
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Mengubah jutaan titik data pemeriksaan laboratorium menjadi wawasan strategis. Memantau utilisasi instrumen, efisiensi reagen, dan membantu dokter mendeteksi lonjakan biomarker kritis."
                : "Transforming millions of laboratory data points into actionable intelligence. Monitor analyzer utilization, reagent efficiency, and empower clinicians with rapid anomaly detection."}
            </p>
          </div>

          {/* 3 Intelligence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "TAT Real-Time & Bottleneck Heatmap" : "TAT Real-Time & Bottleneck Heatmap"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Pantau durasi sampel per departemen (IGD, Rawat Inap, Rawat Jalan). Kenali secara visual tahap yang menyebabkan penundaan sebelum mengganggu alur pelayanan pasien."
                    : "Monitor specimen turnaround across ER, Inpatient, and Clinics. Pinpoint bottlenecks before they impact patient care."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Monitoring Live Per Shift" : "Live Shift Monitoring"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Beban Instrumen & Utilisasi Reagen" : "Analyzer Load & Reagent Tracking"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Kalkulasi otomatis jumlah tes per reagen, masa kadaluarsa, dan distribusi beban kerja antar mesin agar throughput laboratorium beroperasi maksimal tanpa reagen terbuang."
                    : "Automatic tracking of tests per reagent cartridge, expiry dates, and load distribution across machines to maximize throughput with zero wastage."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Zero Reagent Wastage" : "Zero Reagent Wastage"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Nova AI Clinical Delta Check" : "Nova AI Clinical Delta Check"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Nova AI mendeteksi lonjakan nilai abnormal terhadap riwayat lampau pasien, menyajikan peringatan dini, dan merangkum narasi medis. Keputusan akhir tetap 100% pada dokter."
                    : "Nova AI detects abnormal biomarker spikes against past patient history, offering early alerts while leaving 100% of clinical decisions with physicians."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "AI Membantu, Dokter Memutuskan" : "AI Assists, Doctors Decide"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
