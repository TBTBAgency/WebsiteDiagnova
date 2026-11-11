"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  ArrowRight,
  Check,
  ShieldCheck,
  AlertTriangle,
  Send,
  Zap,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function SolutionsPage() {
  const { language } = useLanguage();

  const facilityTiers = [
    {
      id: "hospital",
      title: language === "ID" ? "Rumah Sakit Umum & Khusus" : "General & Specialty Hospitals",
      desc:
        language === "ID"
          ? "Dirancang untuk instalasi lab sentral, IGD, ICU, dan bangsal rawat inap dengan bridging dua arah ke SIMRS/RME."
          : "Engineered for central laboratories, ER, ICU, and inpatient wards with seamless two-way HIS/EMR bridging.",
      solutionsRecommended: [
        language === "ID" ? "Hospital Laboratory (Core LIS)" : "Hospital Laboratory (Core LIS)",
        language === "ID" ? "Bank Darah & Transfusi (BDRS)" : "Blood Bank & Transfusion Safety",
        language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology & Cytology",
        language === "ID" ? "Mikrobiologi Klinis & PPRA" : "Microbiology & Antibiotic Stewardship",
      ],
      kpi: language === "ID" ? "TAT IGD < 25 Menit • Bridging Dua Arah SIMRS" : "ER TAT < 25 Mins • 100% HIS Bridging",
    },
    {
      id: "clinic",
      title: language === "ID" ? "Laboratorium Klinik & Rujukan" : "Clinical & Reference Labs",
      desc:
        language === "ID"
          ? "Dioptimalkan untuk volume spesimen tinggi, medical check-up (MCU) korporasi, registrasi barcode cepat, dan portal pasien online."
          : "Optimized for high specimen throughput, corporate check-ups (MCU), fast barcode dispatch, and online patient results.",
      solutionsRecommended: [
        language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory",
        language === "ID" ? "Modul Pemeriksaan MCU Massal" : "Mass Corporate MCU Engine",
        language === "ID" ? "Portal Hasil Online & WhatsApp PDF" : "Online Patient Portal & Encrypted PDF",
        language === "ID" ? "Manajemen Billing & B2B Rujukan" : "B2B Outreach & Billing Gateway",
      ],
      kpi: language === "ID" ? "Registrasi 30 Detik • 100% Pengiriman Digital" : "30s Registration • 100% Digital Delivery",
    },
    {
      id: "specialist",
      title: language === "ID" ? "Pusat Diagnostik Spesialis" : "Specialized Diagnostic Centers",
      desc:
        language === "ID"
          ? "Solusi khusus untuk laboratorium patologi anatomi jaringan, kultur mikrobiologi sensitivitas tinggi, dan bank darah mandiri."
          : "Tailored systems for histological tissue tracking, high-sensitivity microbial cultures, and dedicated blood banking.",
      solutionsRecommended: [
        language === "ID" ? "Patologi Anatomi & Slide Tracking" : "Anatomical Pathology & Slide Tracking",
        language === "ID" ? "Mikrobiologi & Antibiogram PPRA" : "Microbiology & Antibiogram Matrix",
        language === "ID" ? "Bank Darah & Cold-Chain Guard" : "Blood Bank & Cold-Chain Guard",
        language === "ID" ? "Nova AI Clinical Copilot" : "Nova AI Clinical Copilot",
      ],
      kpi: language === "ID" ? "Pelacakan 2D Micro-Barcode • Antibiogram CLSI" : "2D Micro-Barcode • Automated Antibiogram",
    },
  ];

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
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
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Konsultasi Solusi" : "Schedule Solutions Consultation",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Eksplorasi Solusi Fasilitas" : "Explore Facility Solutions",
          href: "#facility-solutions",
        }}
        metrics={[
          {
            value: "-60%",
            label: language === "ID" ? "Pangkas Waktu Antre" : "Cut Queue Time",
            sub: language === "ID" ? "Registrasi cepat MCU & RS" : "Fast MCU & Hospital check-in",
          },
          {
            value: "100%",
            label: language === "ID" ? "Bridging SIMRS & RME" : "HIS & EMR Bridging",
            sub: language === "ID" ? "Dua arah & real-time" : "Bidirectional & real-time",
          },
          {
            value: "ISO 15189",
            label: language === "ID" ? "Kesiapan Akreditasi" : "Accreditation Ready",
            sub: language === "ID" ? "KARS, JCI & Kemenkes" : "KARS & JCI compliant",
          },
          {
            value: language === "ID" ? "5 Sektor" : "5 Verticals",
            label: language === "ID" ? "Solusi Terdedikasi" : "Dedicated Modules",
            sub: language === "ID" ? "RS, MCU, PA, Mikro, BDRS" : "Hospital, MCU, PA, Micro, BDRS",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          CORE FACILITY SHOWCASE (THE CLEAN SAASET 5-CARD ARCHITECTURE)
          3 Cards Top, 2 Cards Bottom, Beautiful Micro-UIs, Clear Typography
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="facility-solutions"
        className="relative scroll-mt-24 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        {/* Subtle Ambient Dot Grid Pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-45 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
          style={{
            backgroundImage: "radial-gradient(rgba(52, 93, 171, 0.22) 1.25px, transparent 1.25px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Alur Kerja Diagnostik Terpadu" : "Tailored Diagnostic Architecture"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Dirancang untuk Efisiensi Diagnostik Tanpa Batas</>
              ) : (
                <>Designed to Make Clinical Work Effortless</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Pengalaman diagnostik yang lebih cepat, akurat, dan terstandar untuk setiap instalasi faskes."
                : "Experience a smoother, smarter way to orchestrate clinical orders, automate analyzers, and deliver life-critical results."}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5-CARD ARCHITECTURE (UNIFIED 2-ROW GRID WITH BALANCED GAPS)
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-7">
            {/* ROW 1: 3 EQUAL VERTICAL CARDS (Hospital, Clinical/MCU, Pathology) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {/* Card 1: Hospital Laboratory & ER */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: Diagnova Hospital Workstation Canvas */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F0F6FE] via-[#F8FBFE] to-white border border-blue-200/70 h-[215px] flex flex-col justify-center gap-2.5 mb-5 shadow-2xs">
                {/* Floating Pill 1: SIMRS Dual Sync */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 shadow-[0_2px_8px_rgba(31,45,93,0.05)] text-xs font-semibold text-slate-800">
                  <div className="h-6 w-6 rounded-lg bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-slate-800">SIMRS &amp; RME Dual-Sync</span>
                  <span className="ml-auto text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold shrink-0">
                    HL7 v2.5
                  </span>
                </div>

                {/* Floating Pill 2: ER CITO Panic Alert */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-red-100 shadow-[0_2px_8px_rgba(220,38,38,0.06)] text-xs font-semibold text-slate-800">
                  <div className="h-6 w-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-slate-800">ER CITO Panic Alert</span>
                  <span className="ml-auto text-[10px] font-mono text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 font-bold shrink-0">
                    TAT &lt; 25m
                  </span>
                </div>

                {/* Floating Pill 3: Positive Bedside Barcode */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-blue-100 shadow-[0_2px_8px_rgba(31,45,93,0.05)] text-xs font-semibold text-slate-800">
                  <div className="h-6 w-6 rounded-lg bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate text-slate-800">Bedside Barcode Matching</span>
                  <span className="ml-auto text-[10px] font-mono text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold shrink-0">
                    Zero Error
                  </span>
                </div>
              </div>

              {/* Bottom Content: Clean Title + Subtitle */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-2 group-hover:text-[#2764B8] transition-colors tracking-tight">
                {language === "ID" ? "Laboratorium RS & IGD" : "Hospital Laboratory & ER"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {language === "ID"
                  ? "Sinkronisasi dua arah SIMRS, percepatan TAT hasil CITO darurat, dan notifikasi nilai kritis seketika ke dokter DPJP."
                  : "Bidirectional HIS sync, accelerated emergency stat test turnaround, and automated panic broadcasts to physicians."}
              </p>
            </div>

            {/* Card 2: Clinical & Corporate MCU */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: High-Contrast Corporate MCU Intake Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F2F8FD] via-[#F8FBFE] to-white border border-blue-200/70 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2764B8]">
                    <span className="h-2 w-2 rounded-full bg-[#2764B8] animate-pulse" />
                    {language === "ID" ? "Batch MCU Massal Terjadwal" : "Scheduled Batch MCU"}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    #CORP-8821
                  </span>
                </div>

                {/* Corporate Intake Card Body */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(31,45,93,0.05)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">PT Telkom Indonesia (450 Pax)</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      100% Siap
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2764B8] h-full rounded-full w-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                    <span>Cetak Barcode Tabung</span>
                    <span className="text-[#2764B8] font-bold">0.4 Detik / Label</span>
                  </div>
                </div>

                {/* Dispatch Channel Pill */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-emerald-100 shadow-2xs text-[11px] text-slate-700">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Send className="h-3.5 w-3.5 text-emerald-600" />
                    WhatsApp Encrypted PDF
                  </span>
                  <span className="text-emerald-700 font-bold font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Terkirim Otomatis
                  </span>
                </div>
              </div>

              {/* Bottom Content */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-2 group-hover:text-[#2764B8] transition-colors tracking-tight">
                {language === "ID" ? "Lab Klinik & MCU Massal" : "Clinical & Reference Labs"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {language === "ID"
                  ? "Registrasi batch ribuan peserta dalam hitungan detik, cetak label instan, dan pengiriman laporan via WhatsApp."
                  : "High-volume roster intake in seconds, automated tube labeling, and instant encrypted PDF dispatch via WhatsApp."}
              </p>
            </div>

            {/* Card 3: Anatomical Pathology */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: Clean Medical Mint Canvas with Specimen Workflow Stages */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F0FAF7] via-[#F7FCFA] to-white border border-emerald-200/70 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    #PA-24-0982 (Biopsi)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 font-bold shadow-2xs">
                    Zero Mix-Up
                  </span>
                </div>

                {/* Stage Progress Pills */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="block font-bold text-slate-800">Grossing</span>
                    <span className="text-slate-500 text-[9px]">Kaset 2D</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="block font-bold text-slate-800">Microtomy</span>
                    <span className="text-slate-500 text-[9px]">4 Slide</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-800 font-bold shadow-2xs">
                    <span className="block">H&amp;E Stain</span>
                    <span className="text-emerald-700 text-[9px]">Slide OK</span>
                  </div>
                </div>

                {/* ICD-O Standard Badge */}
                <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-[10px] font-mono shadow-2xs">
                  <span className="text-slate-700 font-semibold">ICD-O-3: 8500/3</span>
                  <span className="text-[#2764B8] font-bold">WSI 40x Scanner</span>
                </div>
              </div>

              {/* Bottom Content */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-2 group-hover:text-[#2764B8] transition-colors tracking-tight">
                {language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {language === "ID"
                  ? "Pelacakan spesimen jaringan dari grossing hingga blok parafin dengan barcode 2D anti-tertukar dan standar ICD-O."
                  : "End-to-end tissue tracking from grossing to paraffin blocks using 2D micro-barcodes and synoptic ICD-O staging."}
              </p>
            </div>
          </div>

            {/* ══════════════════════════════════════════════════════════════
                ROW 2: 2 BALANCED CARDS (Microbiology Wide 7-col + Blood Bank 5-col)
                ══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
              {/* Card 4: Clinical Microbiology & PPRA Stewardship (Wide 7-col) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Workstation Telemetry & AST Sensitivity Table */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F3F7FC] via-[#F8FAFD] to-white border border-slate-200 mb-5 space-y-3 shadow-2xs">
                  {/* Top Bar with Status and Quick Pills */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#1F2D5D]">
                        {language === "ID" ? "Telemetri AST & Kultur Kuman" : "Culture & AST Telemetry"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        VITEK-2 Terhubung
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        BACTEC Aktif
                      </span>
                    </div>
                  </div>

                  {/* 3 Metric Summary Boxes */}
                  <div className="grid grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-mono block">Isolat Kuman</span>
                      <span className="font-bold text-[#1F2D5D] text-xs sm:text-sm font-mono truncate block mt-0.5">
                        S. aureus (Blood)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-mono block">Vancomycin MIC</span>
                      <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5">
                        &le; 0.5 (Sensitif)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 shadow-2xs">
                      <span className="text-[10px] text-red-600 font-mono block font-bold">Alert MDRO</span>
                      <span className="font-bold text-red-700 text-xs sm:text-sm font-mono block mt-0.5">
                        MRSA Terdeteksi
                      </span>
                    </div>
                  </div>

                  {/* Interactive Search Pill Bar */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                    <div className="flex items-center gap-2 text-slate-500 font-normal">
                      <Search className="h-3.5 w-3.5 text-[#2764B8]" />
                      <span className="text-[11px] sm:text-xs">
                        {language === "ID"
                          ? "Peta pola resistensi kuman kumulatif komite PPRA..."
                          : "Generate hospital cumulative antibiogram matrix..."}
                      </span>
                    </div>
                    <span className="px-3.5 py-1 rounded-lg bg-[#2764B8] hover:bg-[#1E5299] text-white font-semibold text-[10px] shadow-2xs transition-colors cursor-pointer">
                      {language === "ID" ? "Buka PPRA" : "View Matrix"}
                    </span>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1F2D5D] mb-2 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID"
                    ? "Mikrobiologi Klinik & Komite PPRA"
                    : "Clinical Microbiology & Antibiotic Stewardship"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Manajemen biakan kultur multi-hari, integrasi analyzer otomatis, dan pembentukan peta Antibiogram kumulatif berkala sesuai standar CLSI / EUCAST."
                    : "Multi-day culture incubation tracking, automated AST analyzer integration, and instant cumulative Antibiogram generation compliant with CLSI standards."}
                </p>
              </div>

              {/* Card 5: Blood Bank & Transfusion Safety BDRS (Compact 5-col) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: High-Contrast Transfusion Safety Protocol */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF5F7] via-[#FFF9FA] to-white border border-rose-200/70 mb-5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                    <span className="text-xs font-bold text-[#1F2D5D] flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                        <HeartPulse className="h-3.5 w-3.5" />
                      </div>
                      {language === "ID" ? "Protokol Bank Darah (BDRS)" : "Blood Bank Protocol"}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      Kompatibel (Aman)
                    </span>
                  </div>

                  {/* Bulleted Points */}
                  <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed font-normal">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Mayor &amp; Minor Crossmatch:</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">Negatif (OK)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                        <span>Suhu Rantai Dingin Kulkas:</span>
                      </div>
                      <span className="font-mono font-bold text-[#2764B8]">3.8°C (2–6°C)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        <span>Rotasi FEFO (ISBT-128):</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800">Sisa 24 Hari</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1F2D5D] mb-2 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID"
                    ? "Bank Darah & Transfusi (BDRS)"
                    : "Blood Bank & Transfusion Safety"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Validasi uji silang serasi ganda digital, telemetri rantai dingin 24/7, dan eliminasi risiko transfusi darah inkompatibel."
                    : "Digital dual-check crossmatching, 24/7 cold-chain telemetry, and zero tolerance for ABO/Rh incompatibility."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FACILITY FIT MATRIX (TIER 1, 2, 3 MATCHING)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Kesesuaian Institusi" : "Institution Matrix"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Pilih Paket Solusi Sesuai Skala Faskes Anda</>
              ) : (
                <>Match Solutions to Your Operational Tier</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Diagnova beradaptasi dengan kapasitas Anda. Lihat paket solusi dan modul yang direkomendasikan berdasarkan tipe fasilitas kesehatan Anda."
                : "Diagnova scales to your institution. Review recommended architectures and modules tailored to your operational tier."}
            </p>
          </div>

          {/* 3 Clean Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {facilityTiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/80 p-7 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-blue-200 text-xs font-semibold text-[#2764B8]">
                    Tier {idx + 1}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {tier.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {tier.desc}
                  </p>

                  <div className="pt-2 border-t border-blue-100/80 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {language === "ID" ? "Paket Rekomendasi:" : "Recommended Package:"}
                    </span>
                    {tier.solutionsRecommended.map((sol, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-100/80">
                  <span className="text-xs font-bold text-[#345DAB] block mb-3">
                    {tier.kpi}
                  </span>
                  <Link
                    href="/request-demo"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 py-2.5 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>{language === "ID" ? "Konsultasi Tier Ini" : "Consult This Tier"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
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
