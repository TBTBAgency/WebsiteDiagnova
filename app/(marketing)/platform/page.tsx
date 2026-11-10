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

            {/* Right Column: Clean Clinical Specimen Card (Ref: High-Contrast Micro-UI Artifact) */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300">
                {/* 1. Top Visual Stage: Certified Cryptographic Specimen Card */}
                <div className="rounded-2xl bg-gradient-to-b from-[#F8FBFE] to-[#F1F6FC] border border-blue-100/70 p-5 sm:p-6 mb-6 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.4] pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#2764B8 0.75px, transparent 0.75px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* Header Badge & Barcode */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-white border border-blue-200/80 shadow-2xs flex items-center justify-center text-[#2764B8]">
                        <QrCode className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2764B8]">#DX-98214</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                            CITO / IGD
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Bpk. Suryadi (54 Th) • RM-44912
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-2xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{language === "ID" ? "E-Sign BSrE Sah" : "BSrE Certified"}</span>
                    </span>
                  </div>

                  {/* Barcode Strip Graphic */}
                  <div className="relative z-10 mt-4 pt-3 border-t border-blue-100/80 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>BARCODE: 98214-IGD-K2EDTA</span>
                    <span className="text-emerald-700 font-semibold font-sans">TAT: 19 Menit (Selesai)</span>
                  </div>
                </div>

                {/* 2. Clean 3-Step Milestone (Ringkas & Terbaca, Tanpa Accordion Rumit) */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {language === "ID" ? "Otorisasi Dokter Sp.PK (E-Sign BSrE Sah)" : "Pathologist Sign-Off (BSrE E-Sign)"}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">08:14 WIB</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Dr. dr. Handoko, Sp.PK • Otomatis bridging ke RME SIMRS &amp; SATUSEHAT
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-[#2764B8] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {language === "ID" ? "Telemetri Sysmex XN-1000 Terserap" : "Analyzer Telemetry Ingested"}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">08:11 WIB</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Hb 14.2 g/dL, Leuko 7.400 /µL, Trombo 245.000 /µL (QC Westgard: Pass)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Server className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {language === "ID" ? "Order Masuk dari SIMRS IGD" : "Inbound Order from HIS"}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">07:55 WIB</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        HL7 v2.5 Ingested • Barcode dicetak &amp; ditempatkan di Rak #B-04
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Tamper-Proof Cryptographic Hash Strip */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <Lock className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span>SHA-256: e3b0c44298fc1c... (Anti-Manipulasi)</span>
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
