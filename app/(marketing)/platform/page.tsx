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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function PlatformPage() {
  const { language } = useLanguage();

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

          {/* 3 Bento Cards with Top Visual Stage (Ref: Modern SaaS Micro-UI Architecture) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Pangkas TAT & Zero Rekeying */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage (Micro-UI Mockup) */}
              <div className="h-44 sm:h-48 w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] to-[#F1F6FC] border border-blue-100/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                {/* Subtle Grid Accent */}
                <div
                  className="absolute inset-0 opacity-[0.4] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#2764B8 0.75px, transparent 0.75px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* Ambient Soft Glow */}
                <div className="absolute w-28 h-28 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />

                {/* Floating Visual: Connection Handshake & Instant TAT Meter */}
                <div className="relative z-10 w-full max-w-[280px] space-y-3">
                  {/* Two Connected Instruments */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-[11px] font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-[#2764B8]" />
                      <span>Sysmex XN</span>
                    </div>

                    {/* Animated Connection Dots */}
                    <div className="flex-1 flex items-center justify-center gap-1 px-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="h-1 w-6 bg-gradient-to-r from-blue-300 to-[#2764B8] rounded-full" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2764B8]" />
                    </div>

                    <div className="bg-[#2764B8] px-2.5 py-1.5 rounded-xl shadow-xs text-[11px] font-semibold text-white flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-blue-200" />
                      <span>LIS Host</span>
                    </div>
                  </div>

                  {/* Stopwatch TAT Reduction Pill */}
                  <div className="bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-blue-100/90 shadow-2xs flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2764B8]" />
                      <span className="line-through text-slate-400 text-[11px] font-mono">8 min manual</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      0.04s Ingested
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Content (Crisp, High Contrast, No AI Slop) */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
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
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage (Micro-UI Mockup) */}
              <div className="h-44 sm:h-48 w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] to-[#F1F6FC] border border-blue-100/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                <div
                  className="absolute inset-0 opacity-[0.4] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#2764B8 0.75px, transparent 0.75px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="absolute w-28 h-28 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

                {/* Floating Visual: Dual-Branching Decision Node */}
                <div className="relative z-10 w-full max-w-[280px] space-y-2.5">
                  {/* Central Inbound Specimen */}
                  <div className="mx-auto w-fit bg-white/95 px-3 py-1 rounded-full border border-slate-200/90 shadow-2xs text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Specimen #DX-889</span>
                  </div>

                  {/* Branching Split Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/95 p-2 rounded-xl border border-emerald-200/80 shadow-2xs text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Auto-Release</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">85% Normal SOP</span>
                    </div>

                    <div className="bg-white/95 p-2 rounded-xl border border-blue-200/80 shadow-2xs text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#2764B8]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Doctor Triage</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">15% Critical Risk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
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
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage (Micro-UI Mockup) */}
              <div className="h-44 sm:h-48 w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] to-[#F1F6FC] border border-blue-100/70 relative flex items-center justify-center p-4 overflow-hidden mb-6">
                <div
                  className="absolute inset-0 opacity-[0.4] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(#2764B8 0.75px, transparent 0.75px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="absolute w-28 h-28 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />

                {/* Floating Visual: Edge Buffer Storage Box & Live Toggle */}
                <div className="relative z-10 w-full max-w-[280px] space-y-2.5">
                  {/* Status Toggle Header */}
                  <div className="bg-white/95 px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-[#2764B8]" />
                      Edge Gateway
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      72H Retention Safe
                    </span>
                  </div>

                  {/* Packet Resync Badge */}
                  <div className="bg-white/95 p-2 rounded-xl border border-blue-100/90 shadow-2xs flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span>Pending: 0 Packets</span>
                    <span className="text-[#2764B8] font-bold">Zero Data Loss</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
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
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Context & Accreditation Details (Original Style) */}
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

            {/* Right Column: Modern Desktop Workstation Showcase with Floating Accent Card (Aligned Flush Right with Precision Width) */}
            <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex justify-end pb-8 sm:pb-10 lg:pb-0 w-full">
              {/* Subtle ambient glow behind monitor */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-[36px] blur-2xl pointer-events-none" />

              {/* Monitor Chassis Container (Flush to Right Edge with Precision Responsive Width) */}
              <div className="relative z-10 w-full ml-auto max-w-full sm:max-w-[640px] lg:max-w-[660px] xl:max-w-[710px] 2xl:max-w-[740px]">
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

          {/* 3 LigoLab-Style Intelligence Cards with Isometric Vector Art */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: TAT Real-Time & Bottleneck Heatmap */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Isometric Illustration Stage (LigoLab Aesthetic) */}
              <div className="h-48 sm:h-52 w-full rounded-2xl bg-gradient-to-b from-white to-[#F6FAFE] border border-blue-50/80 relative flex items-center justify-center p-3 overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                <svg
                  viewBox="0 0 280 170"
                  className="w-full h-full max-w-[240px] select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Background Radial Aura */}
                  <circle cx="140" cy="85" r="70" fill="#EBF3FB" fillOpacity="0.7" />

                  {/* Isometric Monitor Screen */}
                  <g transform="translate(45, 20)">
                    {/* Monitor Stand Base & Stem */}
                    <path d="M75 110 L95 100 L115 110 L95 120 Z" fill="#E2EDF9" stroke="#2764B8" strokeWidth="1.5" />
                    <path d="M92 90 L98 87 L98 105 L92 108 Z" fill="#CBDDF5" stroke="#2764B8" strokeWidth="1.5" />

                    {/* Monitor Back Housing */}
                    <path
                      d="M30 45 L110 5 L160 30 L80 70 Z"
                      fill="#F4F8FD"
                      stroke="#2764B8"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    {/* Screen Bezel Front Face */}
                    <path
                      d="M35 48 L105 13 L155 38 L85 73 Z"
                      fill="#FFFFFF"
                      stroke="#2764B8"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    {/* Screen Display Content (Heatmap Bars) */}
                    <path d="M50 48 L80 33 L100 43 L70 58 Z" fill="#EBF3FB" />
                    <line x1="55" y1="46" x2="75" y2="36" stroke="#2764B8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="60" y1="52" x2="85" y2="40" stroke="#0073FC" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="70" y1="58" x2="95" y2="46" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

                    {/* Floating Document with Verified Checkmark */}
                    <g transform="translate(-15, 20)">
                      <path
                        d="M20 30 L55 12 L85 27 L50 45 Z"
                        fill="#FFFFFF"
                        stroke="#2764B8"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      <line x1="32" y1="28" x2="60" y2="15" stroke="#94BBE9" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="35" y1="34" x2="65" y2="20" stroke="#94BBE9" strokeWidth="1.5" strokeLinecap="round" />
                      {/* Checkmark Badge */}
                      <circle cx="52" cy="30" r="9" fill="#0073FC" stroke="#FFFFFF" strokeWidth="1.5" />
                      <path
                        d="M48 30 L51 33 L56 27"
                        stroke="#FFFFFF"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>

                    {/* Floating Mini Graph Window (Right) */}
                    <g transform="translate(100, 30)">
                      <path
                        d="M10 25 L40 10 L65 22 L35 37 Z"
                        fill="#FFFFFF"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 25 Q28 15 35 22 T50 18"
                        stroke="#0073FC"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx="50" cy="18" r="2" fill="#0073FC" />
                    </g>

                    {/* Isometric Magnifying Glass */}
                    <g transform="translate(65, 45)">
                      <ellipse
                        cx="22"
                        cy="18"
                        rx="12"
                        ry="10"
                        fill="#FFFFFF"
                        fillOpacity="0.8"
                        stroke="#0073FC"
                        strokeWidth="2"
                      />
                      <path d="M30 25 L44 38" stroke="#2764B8" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="22" cy="18" r="4" fill="#38BDF8" fillOpacity="0.4" />
                    </g>
                  </g>
                </svg>
              </div>

              {/* Bottom Content (LigoLab Typography & Layout Standard) */}
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "TAT Real-Time & Bottleneck Heatmap" : "TAT Real-Time & Bottleneck Heatmap"}
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Diagnova menghubungkan setiap alur pemeriksaan untuk memantau durasi sampel per shift secara live, mengeliminasi antrean sebelum mempengaruhi waktu tunggu pasien."
                    : "Diagnova monitors specimen velocity across shifts in real time, exposing bottlenecks and ensuring tight turnaround times across all departments."}
                </p>
              </div>
            </div>

            {/* Card 2: Analyzer Load & Reagent Tracking */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Isometric Illustration Stage (LigoLab Aesthetic: Monitor + Gear + Clock) */}
              <div className="h-48 sm:h-52 w-full rounded-2xl bg-gradient-to-b from-white to-[#F6FAFE] border border-blue-50/80 relative flex items-center justify-center p-3 overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                <svg
                  viewBox="0 0 280 170"
                  className="w-full h-full max-w-[240px] select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="140" cy="85" r="70" fill="#EBF3FB" fillOpacity="0.7" />

                  <g transform="translate(45, 18)">
                    {/* Background Server Monitor Panel */}
                    <path
                      d="M30 45 L110 5 L160 30 L80 70 Z"
                      fill="#F4F8FD"
                      stroke="#2764B8"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M35 48 L105 13 L155 38 L85 73 Z"
                      fill="#FFFFFF"
                      stroke="#2764B8"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />

                    {/* Stand */}
                    <path d="M75 110 L95 100 L115 110 L95 120 Z" fill="#E2EDF9" stroke="#2764B8" strokeWidth="1.5" />
                    <path d="M92 90 L98 87 L98 105 L92 108 Z" fill="#CBDDF5" stroke="#2764B8" strokeWidth="1.5" />

                    {/* Prominent Isometric Blue Gear (Ciri Khas LigoLab) */}
                    <g transform="translate(60, 22)">
                      {/* Outer Gear Teeth Outline */}
                      <path
                        d="M30 8 L36 9 L38 14 L44 18 L49 16 L53 20 L51 26 L54 32 L60 34 L60 40 L54 42 L51 48 L53 54 L49 58 L44 56 L38 60 L36 65 L30 66 L28 61 L22 57 L17 59 L13 55 L15 49 L12 43 L6 41 L6 35 L12 33 L15 27 L13 21 L17 17 L22 19 L28 15 Z"
                        fill="#0073FC"
                        stroke="#1F2D5D"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      {/* Inner Gear Core Hole */}
                      <ellipse cx="33" cy="37" rx="10" ry="8" fill="#FFFFFF" stroke="#1F2D5D" strokeWidth="1.75" />
                    </g>

                    {/* Isometric Stopwatch Timer (Left) */}
                    <g transform="translate(5, 38)">
                      <ellipse cx="20" cy="25" rx="14" ry="12" fill="#FFFFFF" stroke="#2764B8" strokeWidth="1.75" />
                      {/* Top Pin */}
                      <path d="M18 13 L22 13 L22 9 L18 9 Z" fill="#2764B8" />
                      {/* Clock Hand */}
                      <path d="M20 25 L20 18" stroke="#0073FC" strokeWidth="2" strokeLinecap="round" />
                      <path d="M20 25 L25 28" stroke="#0073FC" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="20" cy="25" r="2" fill="#1F2D5D" />
                    </g>

                    {/* Floating Document Sheets (Right) */}
                    <g transform="translate(108, 25)">
                      <path
                        d="M10 25 L35 12 L55 22 L30 35 Z"
                        fill="#FFFFFF"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <line x1="18" y1="23" x2="38" y2="13" stroke="#94BBE9" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="22" y1="28" x2="42" y2="18" stroke="#94BBE9" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  </g>
                </svg>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Beban Instrumen & Utilisasi Reagen" : "Analyzer Load & Reagent Tracking"}
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Diagnova dapat dikonfigurasi secara leluasa untuk menghitung volume tes per reagen, mengotomatisasi rotasi instrumen, dan memastikan nol pemborosan operasional."
                    : "Infinitely configurable rules automatically distribute workload across analyzers, track reagent consumption, and eliminate wastage entirely."}
                </p>
              </div>
            </div>

            {/* Card 3: Nova AI Clinical Delta Check */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Isometric Illustration Stage (LigoLab Aesthetic: Database Cylinder + Test Tubes + Monitor) */}
              <div className="h-48 sm:h-52 w-full rounded-2xl bg-gradient-to-b from-white to-[#F6FAFE] border border-blue-50/80 relative flex items-center justify-center p-3 overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                <svg
                  viewBox="0 0 280 170"
                  className="w-full h-full max-w-[240px] select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="140" cy="85" r="70" fill="#EBF3FB" fillOpacity="0.7" />

                  <g transform="translate(40, 16)">
                    {/* Multi-Tiered Database Disks Cylinder (Center-Left) */}
                    <g transform="translate(50, 42)">
                      {/* Tier 3 (Bottom) */}
                      <path
                        d="M0 40 C0 32 30 32 30 32 C30 32 60 32 60 40 L60 52 C60 60 30 60 30 60 C30 60 0 60 0 52 Z"
                        fill="#CBDDF5"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                      />
                      <ellipse cx="30" cy="40" rx="30" ry="8" fill="#EBF3FB" stroke="#2764B8" strokeWidth="1.5" />

                      {/* Tier 2 (Middle) */}
                      <path
                        d="M0 22 C0 14 30 14 30 14 C30 14 60 14 60 22 L60 34 C60 42 30 42 30 42 C30 42 0 42 0 34 Z"
                        fill="#CBDDF5"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                      />
                      <ellipse cx="30" cy="22" rx="30" ry="8" fill="#EBF3FB" stroke="#2764B8" strokeWidth="1.5" />

                      {/* Tier 1 (Top) */}
                      <path
                        d="M0 4 C0 -4 30 -4 30 -4 C30 -4 60 -4 60 4 L60 16 C60 24 30 24 30 24 C30 24 0 24 0 16 Z"
                        fill="#CBDDF5"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                      />
                      <ellipse cx="30" cy="4" rx="30" ry="8" fill="#FFFFFF" stroke="#0073FC" strokeWidth="1.75" />
                    </g>

                    {/* Right Monitor Screen */}
                    <g transform="translate(65, 10)">
                      <path
                        d="M30 45 L95 12 L135 32 L70 65 Z"
                        fill="#FFFFFF"
                        stroke="#2764B8"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                      />
                      {/* Flask Glyph on Screen */}
                      <path
                        d="M80 32 L85 32 L87 38 L78 44 L92 44 L83 38 L85 32"
                        stroke="#0073FC"
                        strokeWidth="1.75"
                        strokeLinejoin="round"
                        fill="#EBF3FB"
                      />
                      <circle cx="85" cy="41" r="1.5" fill="#0073FC" />
                    </g>

                    {/* Left Test Tubes & Specimen Rack */}
                    <g transform="translate(18, 55)">
                      {/* Document Page Backing */}
                      <path
                        d="M0 20 L24 8 L42 17 L18 29 Z"
                        fill="#FFFFFF"
                        stroke="#2764B8"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      {/* Mini Tube 1 */}
                      <rect
                        x="10"
                        y="0"
                        width="6"
                        height="18"
                        rx="3"
                        fill="#EBF3FB"
                        stroke="#0073FC"
                        strokeWidth="1.25"
                      />
                      <path d="M10 9 L16 9 L16 15 C16 16.5 14.5 18 13 18 C11.5 18 10 16.5 10 15 Z" fill="#0073FC" />

                      {/* Mini Tube 2 */}
                      <rect
                        x="20"
                        y="4"
                        width="6"
                        height="18"
                        rx="3"
                        fill="#EBF3FB"
                        stroke="#2764B8"
                        strokeWidth="1.25"
                      />
                      <path d="M20 13 L26 13 L26 19 C26 20.5 24.5 22 23 22 C21.5 22 20 20.5 20 19 Z" fill="#38BDF8" />

                      {/* Mini Gear Acent */}
                      <g transform="translate(-5, 20)">
                        <circle cx="10" cy="10" r="8" fill="#0073FC" stroke="#1F2D5D" strokeWidth="1.5" />
                        <circle cx="10" cy="10" r="3" fill="#FFFFFF" />
                      </g>
                    </g>
                  </g>
                </svg>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Nova AI Clinical Delta Check" : "Nova AI Clinical Delta Check"}
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Nova AI menyatukan database riwayat pasien untuk menghitung deviasi longitudinal, membunyikan alarm kritis secara otomatis, dengan otoritas diagnosis mutlak pada dokter."
                    : "Nova AI leverages unified database intelligence to run longitudinal delta-checks, reducing human error while keeping pathologists in total command."}
                </p>
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
