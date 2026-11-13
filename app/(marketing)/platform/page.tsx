"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  TrendingDown,
  FlaskConical,
  Headphones,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function PlatformPage() {
  const { language } = useLanguage();
  const [activeSlaSlot, setActiveSlaSlot] = useState<number>(1);

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
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Otomatisasi 100%" : "100% Automation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
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

          {/* 3 Bento Cards — Horizontal snap-scroll on mobile, 3-column grid on md+ */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
            {/* Card 1: Pangkas TAT & Zero Rekeying */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Live Telemetry Pipeline */}
              <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                <div className="w-full max-w-[300px] rounded-xl bg-white border border-slate-200/90 shadow-sm p-3.5 space-y-3">
                  {/* Instrument -> LIS Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-[#0073FC]" />
                      <span>Sysmex XN</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1 px-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0073FC] animate-pulse" />
                      <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-300 to-[#0073FC] rounded-full" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0073FC]" />
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-[#0073FC] text-[11px] font-semibold text-white flex items-center gap-1">
                      <Zap className="h-3 w-3 text-blue-100" />
                      <span>LIS Host</span>
                    </div>
                  </div>

                  {/* TAT Progress Comparison */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 line-through font-mono">{language === "ID" ? "8 mnt manual" : "8 min manual"}</span>
                      <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                        {language === "ID" ? "0.04d Masuk" : "0.04s Ingested"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[86%] group-hover:w-[96%] transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-[#0073FC] to-emerald-500" />
                    </div>
                  </div>

                  {/* Live Parameter Telemetry Strip */}
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/90 border border-slate-200/60 px-2.5 py-1.5 text-[10px] font-mono text-slate-600">
                    <span>WBC 7.42</span>
                    <span className="text-slate-300">·</span>
                    <span>HGB 14.1</span>
                    <span className="text-slate-300">·</span>
                    <span>PLT 245</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0073FC] transition-colors">
                  {language === "ID" ? "Pangkas TAT Hingga 70%" : "Cut Turnaround Time by 70%"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Hasil uji hematologi, kimia, dan urin mengalir langsung ke layar dokter tanpa antrean ketik manual oleh analis."
                    : "Analyzer telemetry streams directly to clinical screens with zero manual transcription."}
                </p>
              </div>
            </div>

            {/* Card 2: Smart Auto-Verification Engine */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Clinical Rule Decision Tree */}
              <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                <div className="w-full max-w-[300px] flex flex-col items-center">
                  {/* Inbound Specimen Node */}
                  <div className="w-fit bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-xs text-[11px] font-mono font-semibold text-slate-800 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0073FC]" />
                    <span>{language === "ID" ? "Spesimen #DX-889" : "Specimen #DX-889"}</span>
                    <span className="text-[10px] font-sans font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Delta OK
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
                          {language === "ID" ? "Rilis Otomatis" : "Auto-Release"}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-emerald-100 overflow-hidden">
                        <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">{language === "ID" ? "85% SOP Normal" : "85% Normal SOP"}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-blue-200/90 shadow-xs space-y-1.5 transition-transform duration-300 delay-75 group-hover:-translate-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#0073FC]">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {language === "ID" ? "Triase Dokter" : "Doctor Triage"}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-blue-100 overflow-hidden">
                        <div className="h-full w-[25%] rounded-full bg-[#0073FC]" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block">{language === "ID" ? "15% Risiko Kritis" : "15% Critical Risk"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0073FC] transition-colors">
                  {language === "ID" ? "Auto-Verification Engine" : "Auto-Verification Engine"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Rule engine otomatis memverifikasi sampel normal, membebaskan dokter untuk fokus pada kasus anomali kritis."
                    : "Automated rules instantly release normal specimens, keeping physicians focused on critical anomalies."}
                </p>
              </div>
            </div>

            {/* Card 3: Resilient Edge Buffer */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Edge Buffer Health Monitor */}
              <div className="ll-card-stage h-48 sm:h-52 w-full rounded-2xl bg-[#F4F8FD] border border-slate-200/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                <div className="w-full max-w-[300px] rounded-xl bg-white border border-slate-200/90 shadow-sm p-3.5 space-y-3">
                  {/* Status Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-[#0073FC]" />
                      Edge Gateway
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {language === "ID" ? "Retensi 72J Aman" : "72H Retention Safe"}
                    </span>
                  </div>

                  {/* Buffer Channel Sync Bars */}
                  <div className="flex items-end justify-between gap-1.5 h-10 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    {[65, 85, 72, 95, 80, 90, 75, 100].map((h, i) => (
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
                    <span className="text-slate-500">{language === "ID" ? "Antrean: 0 Paket" : "Pending: 0 Packets"}</span>
                    <span className="text-[#0073FC] font-bold">{language === "ID" ? "Nol Data Hilang" : "Zero Data Loss"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#0073FC] transition-colors">
                  {language === "ID" ? "Resilient Edge Buffer" : "Resilient Edge Buffer"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Jaringan RS drop? Buffer lokal mengamankan data analyzer dan menyinkronkan otomatis saat koneksi pulih."
                    : "Hospital network down? Edge buffers store transmissions and auto-resync upon reconnection."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #reporting - Digital Audit Trail & Medical Reporting
          (Dynamic 2-Column Showcase with Real Desktop Workstation + Floating Accent Card)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="reporting"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Context & Accreditation Details (Original Style) */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mb-4">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kepatuhan & Akreditasi" : "Compliance & Accreditation"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
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

              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
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
                          <span>#DX-98214 — Darah Lengkap</span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>SYS-XN: INGESTED</span>
                      </div>
                    </div>

                    {/* Patient & Specimen Info Header */}
                    <div className="p-3.5 sm:p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[#EBF3FB] text-[#2764B8] border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0">
                          DL
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900">
                              Bpk. Suryadi (54 Th / L)
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                              CITO / IGD
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            No. RM: #44912 • DPJP: Dr. dr. Handoko, Sp.PK
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Clock className="h-3 w-3 text-emerald-600" />
                          <span>TAT: 19m (Goal &lt; 60m)</span>
                        </span>
                      </div>
                    </div>

                    {/* Clinical Telemetry Table */}
                    <div className="p-3 sm:p-4 space-y-1.5 bg-white">
                      <div className="rounded-lg border border-slate-200/90 overflow-hidden shadow-2xs">
                        <div className="bg-slate-50/90 px-3.5 py-1.5 border-b border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12">
                          <span className="col-span-5">{language === "ID" ? "Parameter Analit" : "Analyte Parameter"}</span>
                          <span className="col-span-3 text-right">{language === "ID" ? "Hasil Uji" : "Result"}</span>
                          <span className="col-span-2 text-right hidden sm:block">{language === "ID" ? "Nilai Rujukan" : "Ref"}</span>
                          <span className="col-span-4 sm:col-span-2 text-right">Status</span>
                        </div>

                        <div className="divide-y divide-slate-100 text-[11px]">
                          {/* Row 1: Hb */}
                          <div className="px-3.5 py-2 grid grid-cols-12 items-center hover:bg-slate-50/50">
                            <div className="col-span-5">
                              <span className="font-bold text-slate-900 block">Hemoglobin (Hb)</span>
                              <span className="text-[9px] text-slate-400 font-mono">Sysmex XN-1000 • ASTM</span>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                              14.2 <span className="text-[9px] font-normal text-slate-500">g/dL</span>
                            </div>
                            <div className="col-span-2 text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                              13.5 - 17.5
                            </div>
                            <div className="col-span-4 sm:col-span-2 text-right">
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                NORMAL
                              </span>
                            </div>
                          </div>

                          {/* Row 2: WBC */}
                          <div className="px-3.5 py-2 grid grid-cols-12 items-center hover:bg-slate-50/50">
                            <div className="col-span-5">
                              <span className="font-bold text-slate-900 block">Leukosit (WBC)</span>
                              <span className="text-[9px] text-slate-400 font-mono">Sysmex XN-1000 • ASTM</span>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                              7.400 <span className="text-[9px] font-normal text-slate-500">/µL</span>
                            </div>
                            <div className="col-span-2 text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                              4.000 - 10k
                            </div>
                            <div className="col-span-4 sm:col-span-2 text-right">
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                NORMAL
                              </span>
                            </div>
                          </div>

                          {/* Row 3: PLT */}
                          <div className="px-3.5 py-2 grid grid-cols-12 items-center hover:bg-slate-50/50">
                            <div className="col-span-5">
                              <span className="font-bold text-slate-900 block">Trombosit (PLT)</span>
                              <span className="text-[9px] text-slate-400 font-mono">Sysmex XN-1000 • ASTM</span>
                            </div>
                            <div className="col-span-3 text-right font-mono font-bold text-slate-900">
                              245.000 <span className="text-[9px] font-normal text-slate-500">/µL</span>
                            </div>
                            <div className="col-span-2 text-right text-[10px] text-slate-500 font-mono hidden sm:block">
                              150k - 450k
                            </div>
                            <div className="col-span-4 sm:col-span-2 text-right">
                              <span className="inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                NORMAL
                              </span>
                            </div>
                          </div>
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
                            <span className="font-bold text-slate-900 text-xs">Dr. dr. Handoko, Sp.PK</span>
                            <span className="text-[9px] font-mono text-slate-400">08:14 WIB</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            BSrE BSSN Certified (Sah Regulasi)
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#2764B8] border border-blue-200/80 text-[10px] font-semibold shadow-2xs">
                        <QrCode className="h-3 w-3" />
                        <span>SATUSEHAT FHIR</span>
                      </span>
                    </div>

                    {/* Cryptographic Console Footer */}
                    <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3 text-[#2764B8]" />
                        SHA-256: e3b0c44298fc1c... (Anti-Manipulasi)
                      </span>
                      <span className="text-[#2764B8] font-bold">KARS SKP 2.2 Ready</span>
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
                        {language === "ID" ? "Kepatuhan KARS & ISO" : "KARS & ISO Ready"}
                      </h5>
                      <span className="text-[10px] text-blue-100 font-mono">
                        100% Tamper-Proof
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-blue-50/90 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Setiap analit terkunci permanen dengan e-sign dokter berkeabsahan hukum penuh via BSrE BSSN."
                      : "Every analyte is cryptographically locked with legally accredited pathologist signatures via BSrE."}
                  </p>
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
        className="relative scroll-mt-28 w-full bg-[#FAFBFD] border-t border-slate-200/60 py-16 sm:py-20 lg:py-24 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Nova AI & Analitik" : "Nova AI & Analytics"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
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

          {/* 3 LigoLab-Standard Intelligence Cards — Horizontal snap-scroll on mobile, 3-col grid on md+ */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-5 px-5 pb-3 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 lg:gap-8 md:mx-0 md:px-0 md:pb-0 md:overflow-visible">
            {/* Card 1: TAT Real-Time & Bottleneck Detection */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-9 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-start group">
              {/* Header: Icon Badge + Blue Title */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] border border-blue-100/70 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 transition-transform">
                  <Clock className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#2764B8] leading-tight group-hover:text-[#1B4B9C] transition-colors">
                  {language === "ID" ? (
                    <>
                      TAT Real-Time &amp; <br />
                      Deteksi Bottleneck
                    </>
                  ) : (
                    <>
                      Real-Time TAT &amp; <br />
                      Bottleneck Detection
                    </>
                  )}
                </h3>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3.5 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Prediksi waktu tunggu (predictive TAT) otomatis sebelum sampel memasuki antrean analis"
                      : "Predictive turnaround time scoring before specimens enter analyzer queues"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Heatmap operasional live per departemen untuk mendeteksi penumpukan tabung seketika"
                      : "Operational real-time heatmaps to instantly pinpoint departmental specimen bottlenecks"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Pemicu alarm dini sebelum spesimen melewati batas SLA rumah sakit yang disepakati"
                      : "Early alert triggers before specimens breach hospital SLA turnaround thresholds"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Pelacakan kecepatan alur spesimen per shift guna mengoptimalkan alokasi staf laboratorium"
                      : "Specimen velocity tracking across shifts to optimize laboratory staffing allocation"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 2: Analyzer Workload & Reagent Tracking */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-9 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-start group">
              {/* Header: Icon Badge + Blue Title */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] border border-blue-100/70 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 transition-transform">
                  <Cpu className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#2764B8] leading-tight group-hover:text-[#1B4B9C] transition-colors">
                  {language === "ID" ? (
                    <>
                      Beban Instrumen &amp; <br />
                      Utilisasi Reagen
                    </>
                  ) : (
                    <>
                      Analyzer Load &amp; <br />
                      Reagent Tracking
                    </>
                  )}
                </h3>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3.5 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Distribusi otomatis beban kerja sampel antar instrumen medis (dynamic workload balancing)"
                      : "Dynamic workload balancing to distribute specimen tubes across available analyzers"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Pemantauan sisa volume dan laju pemakaian reagen secara real-time untuk mencegah kehabisan"
                      : "Real-time monitoring of reagent volume and consumption rates to prevent stockouts"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Peringatan dini tanggal kedaluwarsa dan nomor lot reagen guna menihilkan pemborosan (zero wastage)"
                      : "Expiration date and lot number alerts to eliminate discarded inventory and operational waste"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Penjadwalan otomatis rotasi instrumen dan QC terencana tanpa mengganggu alur tes aktif"
                      : "Scheduled auto-calibration and QC runs without interrupting live diagnostic workflows"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 3: Nova AI & Clinical Intelligence */}
            <div className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-9 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-start group">
              {/* Header: Icon Badge + Blue Title */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#EBF3FB] border border-blue-100/70 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#2764B8] leading-tight group-hover:text-[#1B4B9C] transition-colors">
                  {language === "ID" ? (
                    <>
                      Nova AI &amp; <br />
                      Clinical Intelligence
                    </>
                  ) : (
                    <>
                      Nova AI &amp; <br />
                      Clinical Intelligence
                    </>
                  )}
                </h3>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-3.5 text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Komparasi deviasi longitudinal (delta-check) otomatis terhadap riwayat pemeriksaan pasien"
                      : "Automated longitudinal delta-checks comparing results against patient historical baselines"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Deteksi anomali klinis seketika saat terjadi lonjakan biomarker kritis sebelum rilis hasil"
                      : "Real-time clinical anomaly detection for critical biomarker shifts prior to result release"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Validasi aturan klinis lintas-parameter untuk mencegah eror dan hasil yang kontradiktif"
                      : "Cross-parameter clinical rule validation to prevent contradictory or implausible findings"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Rekomendasi kontekstual untuk DPJP dengan otoritas dan kendali diagnosis mutlak pada dokter"
                      : "Context-aware clinical recommendations while keeping attending physicians in total command"}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-900 font-bold shrink-0 mt-0.5 select-none">•</span>
                  <span>
                    {language === "ID"
                      ? "Beroperasi dari satu sumber data terpadu (single source of truth) untuk mutu & operasional"
                      : "Operate from a single source of truth across operations, diagnostic quality, and outcomes"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: 24/7 SLA, ROADMAP & MULTI-SITE NETWORK BENTO (Ref 2)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] border-t border-slate-200/70 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl space-y-3">
              <SectionBadge variant="blue">
                {language === "ID" ? "Keandalan Enterprise" : "Enterprise Reliability"}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 tracking-tight leading-[1.15]">
                {language === "ID"
                  ? "Dukungan 24/7, Peta Jalan AI & Jaringan Multi-Unit"
                  : "24/7 Support SLA, AI Roadmap & Multi-Site Network"}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              {language === "ID"
                ? "Dirancang untuk operasional laboratorium rumah sakit yang tidak pernah berhenti—lengkap dengan eskalasi teknis instan dan sinkronisasi lintas cabang."
                : "Engineered for non-stop hospital diagnostics with instant engineering escalation and unified multi-branch synchronization."}
            </p>
          </div>

          {(() => {
            const slaSlots = [
              {
                window: language === "ID" ? "00:00 – 08:00" : "00:00 – 08:00",
                shift: language === "ID" ? "Shift Malam IGD" : "ER Night Shift",
                sla: "< 10 mnt",
                detail:
                  language === "ID"
                    ? "Monitoring proaktif analyzer CITO & antrean HL7 IGD tanpa jeda."
                    : "Proactive CITO analyzer & ER HL7 queue monitoring.",
              },
              {
                window: language === "ID" ? "24 / 7 / 365" : "24 / 7 / 365",
                shift: language === "ID" ? "Prioritas SLA 99.9%" : "99.9% Priority SLA",
                sla: "< 15 mnt",
                detail:
                  language === "ID"
                    ? "Akses langsung ke Clinical Integration Engineer untuk insiden kritis."
                    : "Direct hotline to Clinical Integration Engineers for critical issues.",
              },
              {
                window: language === "ID" ? "08:00 – 20:00" : "08:00 – 20:00",
                shift: language === "ID" ? "Jam Puncak Poliklinik" : "Peak Outpatient",
                sla: "Real-Time",
                detail:
                  language === "ID"
                    ? "Pendampingan on-site & tuning throughput ribuan sampel per jam."
                    : "Live throughput tuning for thousands of outpatient samples/hour.",
              },
            ];
            const currentSlot = slaSlots[activeSlaSlot];

            return (
              <div className="space-y-6">
                {/* Wide Top Bento Card: 24/7/365 Support SLA */}
                <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-9 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-[#EBF3FF] px-3 py-1.5 text-xs font-semibold text-[#0073FC]">
                      <Headphones className="h-4 w-4" />
                      <span>{language === "ID" ? "Pusat Dukungan Klinis" : "Clinical Support Command"}</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-snug">
                      {language === "ID"
                        ? "Akses dukungan teknis berstandar rumah sakit 24/7/365"
                        : "Access hospital-grade technical support 24/7/365"}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {currentSlot.detail}
                    </p>
                    <div className="pt-1 flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        {language === "ID" ? "Respons Target:" : "Target Response:"}{" "}
                        <strong className="text-slate-900">{currentSlot.sla}</strong>
                      </span>
                      <span className="h-3 w-px bg-slate-200" />
                      <span>
                        {language === "ID" ? "Uptime:" : "Uptime:"}{" "}
                        <strong className="text-[#0073FC]">99.95%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Interactive Vertical Wheel / Selector */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-2">
                    <div className="w-full max-w-lg space-y-2.5">
                      {slaSlots.map((slot, idx) => {
                        const isSelected = activeSlaSlot === idx;
                        return (
                          <button
                            key={idx}
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
                                {slot.window}
                              </span>
                              <span className="h-4 w-px bg-slate-200" />
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium",
                                  isSelected ? "text-slate-700" : "text-slate-500"
                                )}
                              >
                                {slot.shift}
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
                              {isSelected
                                ? language === "ID"
                                  ? "Aktif"
                                  : "Active"
                                : slot.sla}
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
                      <svg
                        viewBox="0 0 420 120"
                        className="w-full h-full overflow-visible"
                        aria-hidden="true"
                      >
                        <line x1="20" y1="88" x2="145" y2="54" stroke="#93C5FD" strokeWidth="2" />
                        <line x1="145" y1="54" x2="265" y2="72" stroke="#93C5FD" strokeWidth="2" />
                        <line x1="265" y1="72" x2="395" y2="26" stroke="#0073FC" strokeWidth="2" />
                        <circle cx="20" cy="88" r="5" fill="#0073FC" />
                        <circle cx="145" cy="54" r="6" fill="#0073FC" />
                        <circle cx="265" cy="72" r="5.5" fill="#0073FC" />
                        <circle cx="395" cy="26" r="6.5" fill="#0073FC" />
                      </svg>
                      <div className="absolute top-5 left-12 sm:left-20 rounded-full bg-white border border-slate-200/90 shadow-xs px-3.5 py-1.5 text-xs font-semibold text-slate-800">
                        {language === "ID" ? "Auto-Bridging HL7" : "HL7 Auto-Bridging"}
                      </div>
                      <div className="absolute bottom-5 right-8 sm:right-14 rounded-full bg-white border border-blue-200 shadow-xs px-3.5 py-1.5 text-xs font-semibold text-[#0073FC]">
                        {language === "ID" ? "Otomatisasi Nova AI" : "Nova AI Automations"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {language === "ID"
                          ? "Peta Jalan AI & Otomatisasi LIS"
                          : "LIS Automation & AI Roadmapping"}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {language === "ID"
                          ? "Pembaruan berkala tanpa mengganggu operasional: mulai dari aturan delta-check adaptif hingga analitik utilisasi reagen."
                          : "Non-disruptive platform evolution from adaptive delta-check rules to automated reagent consumption forecasting."}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Right Card: Multi-Site Hospital Network Orbital Ring */}
                  <div className="rounded-[28px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
                    {/* Orbital Network Visual */}
                    <div className="relative h-44 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 p-4 overflow-hidden mb-6 flex items-center justify-center">
                      <div className="relative h-32 w-32 rounded-full border border-dashed border-blue-200 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-white border-2 border-[#0073FC]/30 shadow-sm flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0073FC]">
                            Diagnova
                          </span>
                          <span className="text-[11px] font-semibold text-slate-800">
                            {language === "ID" ? "Hub Pusat" : "Core Hub"}
                          </span>
                        </div>

                        {/* Satellite Nodes */}
                        {[
                          { pos: "-top-3 left-1/2 -translate-x-1/2", label: "IGD" },
                          { pos: "top-1/2 -right-6 sm:-right-8 -translate-y-1/2", label: "PA" },
                          { pos: "-bottom-3 left-1/2 -translate-x-1/2", label: "BDRS" },
                          { pos: "top-1/2 -left-7 sm:-left-10 -translate-y-1/2", label: "SATU" },
                        ].map((node, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "absolute px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs text-[10px] font-bold text-slate-700 flex items-center gap-1",
                              node.pos
                            )}
                          >
                            <Building2 className="h-3 w-3 text-[#0073FC]" />
                            <span>{node.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {language === "ID"
                          ? "Jaringan Multi-Rumah Sakit & Lab Rujukan"
                          : "Multi-Hospital & Reference Lab Network"}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {language === "ID"
                          ? "Hubungkan lab satelit, klinik satelit, dan rumah sakit rujukan dalam satu konsol pemantauan sampel lintas lokasi."
                          : "Unify satellite clinics, inpatient wards, and reference labs inside one cross-site sample tracking console."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner bgClassName="bg-white border-t border-slate-200/60" topColor="#FFFFFF" />
    </div>
  );
}
