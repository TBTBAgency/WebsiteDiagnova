"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  HeartPulse,
  PackageCheck,
  Microscope,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Network,
  QrCode,
  Thermometer,
  Boxes,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Clean Medical SaaS dengan Visual Showcase
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-100">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-100/30 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Section Badge */}
            <div className="mb-4 sm:mb-5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Ekosistem Modular Diagnova" : "Diagnova Modular Ecosystem"}
              </SectionBadge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  5 Modul Spesialisasi,{" "}
                  <br className="hidden sm:inline" />
                  Satu Ekosistem Laboratorium Cerdas
                </>
              ) : (
                <>
                  5 Specialized Modules,{" "}
                  <br className="hidden sm:inline" />
                  One Connected Laboratory Intelligence
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl">
              {language === "ID"
                ? "Dikonfigurasi untuk menangani volume harian hematologi, uji silang bank darah, telemetri reagen, patologi anatomi, hingga kultur mikrobiologi tanpa fragmentasi database."
                : "Engineered to handle high-throughput hematology, cold-chain blood banking, reagent telemetry, anatomical pathology, and microbiology within a single unified clinical database."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>{language === "ID" ? "Jadwalkan Demo Modul" : "Schedule Module Demo"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#modules-suite"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Eksplorasi 5 Modul" : "Explore 5 Modules"}</span>
              </a>
            </div>

            {/* 4 Feature Badges Strip */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
              {[
                {
                  value: "ASTM & HL7",
                  label: language === "ID" ? "Interfacing 200+ Analyzer" : "200+ Analyzer Interfacing",
                  sub: language === "ID" ? "Direct bidireksional tanpa middleware" : "Direct bidirectional connection",
                },
                {
                  value: "ISBT 128",
                  label: language === "ID" ? "Keamanan Bank Darah" : "Blood Bank Safety Standard",
                  sub: language === "ID" ? "Validasi ganda crossmatching" : "Dual-check crossmatch protocol",
                },
                {
                  value: "2D Barcode",
                  label: language === "ID" ? "Pelacakan Jaringan PA" : "Pathology Tissue Tracking",
                  sub: language === "ID" ? "Level kaset biopsi & slide kaca" : "Cassette & slide level tracking",
                },
                {
                  value: "CLSI / EUCAST",
                  label: language === "ID" ? "Antibiogram PPRA Rumah Sakit" : "Hospital PPRA Antibiogram",
                  sub: language === "ID" ? "Peta resistensi kuman otomatis" : "Automated pathogen resistance map",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-5 text-left shadow-xs hover:border-blue-200/80 transition-colors"
                >
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#345DAB] tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    {kpi.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{kpi.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE 5-MODULE SUITE: BENTO SHOWCASE BERKARAKTER
          ══════════════════════════════════════════════════════════════ */}
      <section id="modules-suite" className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Spesialisasi Klinis" : "Clinical Specializations"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Arsitektur Khusus Sesuai Karakteristik Setiap Bidang</>
              ) : (
                <>Purpose-Built Architectures for Every Department</>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Bukan form generik. Setiap modul dibangun dengan logika pemeriksaan klinis, aturan validasi, dan integrasi perangkat analyzer yang relevan."
                : "Not generic templates. Every module is crafted around actual clinical workflows, validation rule engines, and native analyzer interfacing."}
            </p>
          </div>

          {/* ══════ MODUL 1: ROUTINE & HEMATOLOGY (HEROIC FLAGSHIP CARD) ══════ */}
          <div
            id="routine-hematology"
            className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F5F8FC] via-white to-[#F2F6FA] border border-slate-200/90 p-8 sm:p-10 lg:p-12 mb-10 shadow-xs hover:border-blue-200/90 transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200/80 text-[#2764B8] flex items-center justify-center shadow-xs">
                    <Activity className="h-7 w-7" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                      {language === "ID" ? "Patologi Klinik & Core Laboratory" : "Clinical Pathology & Core Lab"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                    Routine &amp; Hematology
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-[#345DAB] mb-3">
                    {language === "ID"
                      ? "Throughput Tinggi, Auto-Verification & Delta-Check Tanpa Ketik Ulang"
                      : "High Throughput, Auto-Verification & Delta-Check with Zero Re-typing"}
                  </p>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">
                    {language === "ID"
                      ? "Menangani ribuan tabung sampel darah, urin, dan kimia klinik setiap hari. Order dari SIMRS otomatis berubah menjadi worklist instrumen, hasil ditarik secara bidireksional, dan aturan delta-check memverifikasi hasil normal secara otomatis dalam milidetik."
                      : "Handles thousands of blood, urine, and clinical chemistry tubes daily. HIS orders convert automatically into analyzer worklists, results are pulled bidirectionally, and delta-check rules auto-verify normal runs within milliseconds."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    language === "ID" ? "Interfacing ASTM/HL7 Bidireksional" : "Bidirectional ASTM/HL7 Interfacing",
                    language === "ID" ? "Auto-Verification Rule Engine" : "Configurable Auto-Verification",
                    language === "ID" ? "Delta Check & Critical Panic Alert" : "Delta Check & Panic Alerting",
                    language === "ID" ? "Quality Control Levey-Jennings" : "Levey-Jennings Quality Control",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-white/90 p-3 rounded-xl border border-slate-100 shadow-2xs">
                      <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                  >
                    <span>{language === "ID" ? "Konsultasi Modul Rutin" : "Consult Hematology Module"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-slate-400 font-medium">
                    {language === "ID" ? "TAT Pangkas Hingga 70% • 0 Error Salah Ketik" : "Up to 70% TAT Cut • Zero Manual Error"}
                  </span>
                </div>
              </div>

              {/* Right Column: Visual Telemetry Card */}
              <div className="lg:col-span-5 rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {language === "ID" ? "Alur Verifikasi Otomatis Analyzer" : "Live Analyzer Auto-Verification"}
                    </p>
                    <p className="text-[11px] text-slate-400">Sysmex XN-1000 • Cobas 6000 (ASTM Live)</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block">Hemoglobin (Hb)</span>
                      <span className="text-[10px] text-slate-400">Prev: 14.0 • Delta: +0.2</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">14.2 g/dL</span>
                      <span className="block text-[10px] text-emerald-600 font-bold uppercase">AUTO-VERIFIED</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block">Trombosit (PLT)</span>
                      <span className="text-[10px] text-slate-400">Prev: 240k • Delta: +5k</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">245.000 /uL</span>
                      <span className="block text-[10px] text-emerald-600 font-bold uppercase">AUTO-VERIFIED</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-rose-950 block">Glukosa Darah Sewaktu</span>
                      <span className="text-[10px] text-rose-600 font-sans font-medium">Nilai Kritis Panic Value</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-700">385 mg/dL</span>
                      <span className="block text-[10px] text-rose-600 font-bold uppercase">ALERT WA KE DPJP</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Delta Check Threshold: Aktif</span>
                  <span>QC Westgard: In-Control</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════ ROW 2: BLOOD BANK & INVENTORY (2 BALANCED CARDS) ══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Card 2: Blood Bank Management */}
            <div
              id="blood-bank"
              className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-100 text-[#E11D48] flex items-center justify-center shadow-xs">
                    <HeartPulse className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Bank Darah (BDRS) & UTD" : "Blood Bank & Transfusion"}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                    Blood Bank Management
                  </h3>
                  <p className="text-sm font-semibold text-rose-600 mb-3">
                    {language === "ID"
                      ? "Zero-Tolerance Kesalahan Golongan Darah & Rantai Dingin Terpantau"
                      : "Zero-Tolerance Transfusion Error & Real-Time Cold Storage Telemetry"}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    {language === "ID"
                      ? "Mengintegrasikan pencatatan kantong darah ISBT 128 dari donor hingga tetes terakhir ke pasien. Dilengkapi verifikasi ganda uji silang serasi (crossmatching), peringatan dini masa simpan FEFO, dan log suhu cold-chain 24/7."
                      : "Connects ISBT 128 blood bag lifecycle from donation to recipient transfusion. Features dual-check electronic crossmatching, FEFO expiration alerts, and 24/7 cold-chain telemetry."}
                  </p>
                </div>

                {/* Visual Cold-Chain & Crossmatch Box */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold font-sans">Cold Storage Room #1</span>
                    <span className="text-rose-600 font-bold">4.1°C (Optimal)</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                      <span className="text-slate-800">Kantong PRC #B2409-A (Gol. A+)</span>
                      <span className="text-emerald-600 font-bold">Crossmatch Compatible</span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-rose-100">
                      <span className="text-slate-800">Stok Darah Darurat (Gol. O+)</span>
                      <span className="text-[#345DAB] font-bold">18 Kantong Tersedia</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{language === "ID" ? "Validasi ganda cegah inkompatibilitas ABO/Rh" : "Dual verification eliminates ABO/Rh mismatch"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{language === "ID" ? "Pangkas darah kedaluwarsa terbuang hingga 45%" : "Cuts expired blood wastage by up to 45%"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Modul BDRS" : "Consult Blood Bank"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-slate-400">ISBT 128 Ready</span>
              </div>
            </div>

            {/* Card 3: Inventory & Reagent Intelligence */}
            <div
              id="inventory-reagent"
              className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shadow-xs">
                    <PackageCheck className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-[#0284C7] bg-sky-50 border border-sky-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Logistik & Reagen Medis" : "Reagents & BMHP Logistics"}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                    Inventory &amp; Reagent Intelligence
                  </h3>
                  <p className="text-sm font-semibold text-[#0284C7] mb-3">
                    {language === "ID"
                      ? "Telemetri Stok Otomatis, Zero Stock-Out di Tengah Shift Malam"
                      : "Automated Consumption Telemetry, Zero Stock-Outs During Night Shifts"}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    {language === "ID"
                      ? "Mengurangi stok reagen secara otomatis setiap tes selesai dikerjakan oleh analyzer. Menghitung estimasi sisa pemeriksaan secara akurat, mendeteksi tanggal buka botol (on-board stability), dan menyarankan order pembelian sebelum habis."
                      : "Automatically depletes reagent volumes as tests conclude on analyzers. Estimates remaining test counts, monitors open-vial stability, and suggests timely purchase orders."}
                  </p>
                </div>

                {/* Visual Reagent Telemetry Box */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold font-sans">Cobas Diluent Pack 5L</span>
                    <span className="text-slate-800 font-bold">Sisa 82% (1.420 Tes)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0284C7] h-full rounded-full" style={{ width: "82%" }} />
                  </div>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-sky-100">
                    <span className="text-slate-800 font-sans">Troponin I Cartridge (Alert Min)</span>
                    <span className="text-amber-600 font-bold">14 Tes Tersisa</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <span>{language === "ID" ? "0 kejadian kehabisan reagen di tengah shift kritis" : "Zero mid-shift stockouts during peak operations"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0284C7] shrink-0" />
                    <span>{language === "ID" ? "Efisiensi pengadaan & hemat anggaran reagen 20%" : "Save up to 20% on annual reagent procurement"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Modul Stok" : "Consult Inventory"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-slate-400">Auto-Depletion Engine</span>
              </div>
            </div>
          </div>

          {/* ══════ ROW 3: PATHOLOGY & MICROBIOLOGY (2 ADVANCED CARDS) ══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 4: Anatomical Pathology */}
            <div
              id="pathology"
              className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-[#EBF3FB] border border-blue-100 text-[#345DAB] flex items-center justify-center shadow-xs">
                    <Microscope className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-[#345DAB] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology"}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                    Anatomical Pathology
                  </h3>
                  <p className="text-sm font-semibold text-[#345DAB] mb-3">
                    {language === "ID"
                      ? "Pelacakan Barcode 2D pada Kaset Jaringan, Slide Kaca & Diagnosa ICD-O"
                      : "2D Barcode Cassette Tracking, Glass Slide Archiving & Synoptic Reporting"}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    {language === "ID"
                      ? "Menghilangkan risiko tertukarnya jaringan biopsi pasien. Setiap kaset, blok parafin, dan slide kaca dicetak dengan 2D micro-barcode. Mempermudah dokter Sp.PA menyusun laporan terstandar WHO/Bethesda dan melampirkan foto mikroskopis."
                      : "Eliminates biopsy specimen mix-ups. Every cassette, paraffin block, and glass slide bears a 2D micro-barcode. Empowers pathologists with standardized WHO/Bethesda synoptic reporting and high-res imaging attachments."}
                  </p>
                </div>

                {/* Visual Specimen Tracking Steps */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <span className="font-semibold text-slate-700 block">Biopsy Specimen Workflow #PA-8820:</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-slate-600">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="block font-bold text-emerald-600">1. Grossing</span>
                      <span>Kaset OK</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="block font-bold text-emerald-600">2. Embedding</span>
                      <span>Blok Parafin</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80">
                      <span className="block font-bold text-emerald-600">3. Staining</span>
                      <span>HE Slide</span>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-[#345DAB]">
                      <span className="block font-bold">4. Review</span>
                      <span>Sp.PA Sign</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#345DAB] shrink-0" />
                    <span>{language === "ID" ? "0% risiko spesimen tertukar dengan 2D micro-barcode" : "Zero specimen mix-up via 2D micro-barcode tracking"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#345DAB] shrink-0" />
                    <span>{language === "ID" ? "Pencarian arsip blok parafin/slide kaca < 1 menit" : "Retrieve archival blocks and slides in under 1 minute"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#345DAB] hover:text-[#1E5299] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Modul Patologi" : "Consult Pathology"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-slate-400">ICD-O-3 / Bethesda</span>
              </div>
            </div>

            {/* Card 5: Microbiology & PPRA */}
            <div
              id="microbiology"
              className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-100 text-[#0D9488] flex items-center justify-center shadow-xs">
                    <FlaskConical className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-[#0D9488] bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Mikrobiologi & Komite PPRA" : "Microbiology & Stewardship"}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                    Microbiology &amp; PPRA
                  </h3>
                  <p className="text-sm font-semibold text-[#0D9488] mb-3">
                    {language === "ID"
                      ? "Peta Kuman Antibiogram Otomatis & Kewaspadaan Dini MDRO / ESBL"
                      : "Automated Hospital Antibiogram & Early Warning for MDRO / ESBL Pathogens"}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">
                    {language === "ID"
                      ? "Mengelola masa inkubasi kultur bakteri dan pembacaan uji kepekaan antibiotik (AST). Menghasilkan grafik Antibiogram berkala secara otomatis untuk mendukung program PPRA rumah sakit dan mencegah resistensi antimikroba."
                      : "Tracks culture incubation and Antimicrobial Susceptibility Testing (AST). Generates automated hospital Antibiograms to support antimicrobial stewardship committees (PPRA) and guide precision antibiotic prescribing."}
                  </p>
                </div>

                {/* Visual Antibiogram AST Box */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold font-sans">Isolat: Klebsiella pneumoniae (Sputum)</span>
                    <span className="text-teal-700 font-bold">CLSI 2024</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-white border border-teal-100 flex justify-between">
                      <span className="text-slate-800">Meropenem</span>
                      <span className="text-emerald-600 font-bold">SENSITIVE</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/80 flex justify-between text-rose-900">
                      <span>Ceftriaxone</span>
                      <span className="text-rose-600 font-bold">RESISTANT</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0D9488] shrink-0" />
                    <span>{language === "ID" ? "Pembangkitan Antibiogram kumulatif berkala 1-klik" : "1-click cumulative hospital antibiogram generator"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0D9488] shrink-0" />
                    <span>{language === "ID" ? "Pemenuhan indikator wajib PPRA KARS & Kemenkes" : "Complies 100% with national stewardship mandates"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Modul Mikrobiologi" : "Consult Microbiology"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-slate-400">CLSI / EUCAST Standard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: GLOBAL STANDARDS & INTEROPERABILITY
          (Alternating #F9F9F9 Background)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Standarisasi & Kepatuhan" : "Compliance & Standards"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Interoperabilitas Berstandar Medis Internasional</>
              ) : (
                <>International Healthcare Data Standards</>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Seluruh modul Diagnova berkomunikasi melalui protokol resmi yang diakui secara global dan terverifikasi untuk kepatuhan SATUSEHAT Kemenkes."
                : "Every Diagnova module communicates via internationally recognized protocols verified for seamless hospital integration and regulatory compliance."}
            </p>
          </div>

          {/* 4 Standards Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-5">
                <Network className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                HL7 &amp; FHIR SATUSEHAT
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {language === "ID"
                  ? "Pertukaran order dan hasil laboratorium secara aman dengan SIMRS serta ekosistem SATUSEHAT Kemenkes RI."
                  : "Secure laboratory order and result exchange with hospital EMR and national healthcare health exchange platforms."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-5">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                ASTM E1381 &amp; E1394
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {language === "ID"
                  ? "Koneksi langsung bidireksional ke analyzer Roche, Sysmex, Abbott, Mindray, dan Beckman tanpa biaya middleware terpisah."
                  : "Direct bidirectional interfacing to Roche, Sysmex, Abbott, Mindray, and Beckman analyzers without costly middleware."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-5">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                ISBT 128 Global Standard
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {language === "ID"
                  ? "Nomenklatur dan pelabelan barcode internasional untuk kantong darah, produk transfusi, dan jaringan tubuh."
                  : "Global information standard for labeling medical products of human origin (blood, cells, and tissue)."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-1">
                ISO 15189 &amp; KARS Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {language === "ID"
                  ? "Jejak audit digital permanen, validasi reagen, dan kontrol mutu internal (IQC) siap diuji asesor akreditasi setiap saat."
                  : "Immutable digital audit trails, reagent validation telemetry, and IQC charting ready for accreditation audits anytime."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Consistent with Platform & Solutions
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
