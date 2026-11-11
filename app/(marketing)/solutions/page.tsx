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
  Users,
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
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: Window Workstation from v2 */}
              <div className="rounded-[20px] bg-white border border-slate-200/90 shadow-[0_8px_20px_-6px_rgba(39,100,184,0.10)] overflow-hidden mb-5">
                {/* Titlebar */}
                <div className="bg-[#FAFBFD] px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                      #DX-CITO-4491
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SIMRS BRIDGED • HL7
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-3.5 space-y-2.5">
                  {/* Patient & CITO status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">Bpk. Suryadi (54 Th)</span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                          CITO / IGD
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Bed IGD-04 • DPJP: Dr. Handoko</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                      TAT: 14m (&lt;25m)
                    </span>
                  </div>

                  {/* Pipeline Milestone */}
                  <div className="p-2 rounded-lg bg-[#F8FBFE] border border-blue-100/80">
                    <div className="flex items-center justify-between text-[9px] font-mono">
                      <div className="text-center">
                        <span className="block font-bold text-slate-700">Order SIMRS</span>
                        <span className="text-slate-400">07:50</span>
                      </div>
                      <span className="h-0.5 w-5 bg-[#2764B8] rounded-full" />
                      <div className="text-center">
                        <span className="block font-bold text-slate-700">Cobas 6000</span>
                        <span className="text-slate-400">07:58</span>
                      </div>
                      <span className="h-0.5 w-5 bg-red-400 rounded-full" />
                      <div className="text-center">
                        <span className="block font-bold text-red-600">Panic Flag</span>
                        <span className="text-red-500 font-bold">08:04</span>
                      </div>
                    </div>
                  </div>

                  {/* Panic Value Alert */}
                  <div className="p-2.5 rounded-lg bg-red-50/90 border border-red-200/90 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-red-800 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                        Troponin I Kuantitatif
                      </span>
                      <span className="text-[8px] font-mono font-bold text-red-700 bg-red-100 px-1 py-0.5 rounded">
                        NILAI KRITIS
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold font-mono text-red-900">1.84 ng/mL</span>
                      <span className="text-[9px] text-red-600 font-mono">Rujukan &lt; 0.04</span>
                    </div>
                  </div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-[#345DAB] block">&lt; 25 Menit</span>
                      <span className="text-[9px] text-slate-600 font-medium">TAT Cito IGD</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-emerald-600 block">100% Bridging</span>
                      <span className="text-[9px] text-slate-600 font-medium">SIMRS Dua Arah</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content: Clean Title + Subtitle */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                {language === "ID" ? "Laboratorium RS & IGD" : "Hospital Laboratory & ER"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {language === "ID"
                  ? "Sinkronisasi dua arah SIMRS, percepatan TAT hasil CITO darurat, dan notifikasi nilai kritis seketika ke dokter DPJP."
                  : "Bidirectional HIS sync, accelerated emergency stat test turnaround, and automated panic broadcasts to physicians."}
              </p>
            </div>

            {/* Card 2: Clinical & Corporate MCU */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: Window Workstation from v2 */}
              <div className="rounded-[20px] bg-white border border-slate-200/90 shadow-[0_8px_20px_-6px_rgba(39,100,184,0.10)] overflow-hidden mb-5">
                {/* Titlebar */}
                <div className="bg-[#FAFBFD] px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                      BATCH #CORP-8821
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    PT TELKOM (450 PAX)
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-3.5 space-y-2.5">
                  {/* Batch Process Bar */}
                  <div className="p-2.5 rounded-lg bg-[#F8FBFE] border border-blue-100/90 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5">
                        <Users className="h-3 w-3 text-[#2764B8]" />
                        Proses Barcode Massal
                      </span>
                      <span className="font-mono text-emerald-700 font-bold text-[10px]">450 / 450 Siap</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-full" />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                      <span>Label Tabung Barcode Otomatis</span>
                      <span className="text-emerald-700 font-semibold">0.4s / Peserta</span>
                    </div>
                  </div>

                  {/* WhatsApp Dispatch Channel */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 text-[11px] flex items-center gap-1.5">
                        <Send className="h-3 w-3 text-emerald-600" />
                        Pengiriman PDF Terenkripsi
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                        99.6% Terkirim
                      </span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-slate-600">
                      <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
                        <span>WA Gateway Bot</span>
                        <span className="text-slate-900 font-bold">448 Langsung</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span>Portal Hasil Online</span>
                        <span className="text-[#2764B8] font-bold">QR Token Valid</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-[#345DAB] block">30 Detik</span>
                      <span className="text-[9px] text-slate-600 font-medium">Registrasi / Pasien</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-emerald-600 block">100% Digital</span>
                      <span className="text-[9px] text-slate-600 font-medium">Paperless WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                {language === "ID" ? "Lab Klinik & MCU Massal" : "Clinical & Reference Labs"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {language === "ID"
                  ? "Registrasi batch ribuan peserta dalam hitungan detik, cetak label instan, dan pengiriman laporan via WhatsApp."
                  : "High-volume roster intake in seconds, automated tube labeling, and instant encrypted PDF dispatch via WhatsApp."}
              </p>
            </div>

            {/* Card 3: Anatomical Pathology */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_24px_rgba(31,45,93,0.06)] hover:shadow-[0_12px_32px_rgba(31,45,93,0.12)] hover:border-[#2764B8]/40 transition-all duration-300 flex flex-col group">
              {/* Top Visual Stage: Window Workstation from v2 */}
              <div className="rounded-[20px] bg-white border border-slate-200/90 shadow-[0_8px_20px_-6px_rgba(39,100,184,0.10)] overflow-hidden mb-5">
                {/* Titlebar */}
                <div className="bg-[#FAFBFD] px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                      #PA-24-0982 (BIOPSI)
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    2D DATAMATRIX TRACKED
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-3.5 space-y-2.5">
                  {/* Chain of Custody stages */}
                  <div className="p-2.5 rounded-lg bg-[#F8FBFE] border border-blue-100/90 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 text-[11px]">Chain of Custody Jaringan</span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                        Zero Mix-Up
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-mono">
                      <div className="bg-white p-1 rounded-md border border-slate-200 shadow-2xs">
                        <span className="block font-bold text-slate-800">Grossing</span>
                        <span className="text-slate-400">Kaset A1-A4</span>
                      </div>
                      <div className="bg-white p-1 rounded-md border border-slate-200 shadow-2xs">
                        <span className="block font-bold text-slate-800">Microtomy</span>
                        <span className="text-slate-400">4 Slide</span>
                      </div>
                      <div className="bg-emerald-50 p-1 rounded-md border border-emerald-200 shadow-2xs">
                        <span className="block font-bold text-emerald-800">H&amp;E Stain</span>
                        <span className="text-emerald-600 font-bold">Slide OK</span>
                      </div>
                    </div>
                  </div>

                  {/* Synoptic Reporting Card */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">Format Baku ICD-O</span>
                      <span className="text-[9px] font-mono text-[#2764B8] font-bold">ICD-O 8500/3</span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#1F2D5D] line-clamp-1">
                      Invasive Ductal Carcinoma, NST (Grade II)
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                      <span>dr. Ratna, Sp.PA (K)</span>
                      <span className="text-emerald-700 font-bold">Digital Sign-Off</span>
                    </div>
                  </div>

                  {/* Metrics Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-emerald-600 block">Zero Error</span>
                      <span className="text-[9px] text-slate-600 font-medium">Spesimen Tertukar</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                      <span className="text-sm font-bold font-display text-[#345DAB] block">&lt; 1 Menit</span>
                      <span className="text-[9px] text-slate-600 font-medium">Temu Arsip Slide</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <h3 className="font-display text-xl font-bold text-[#1F2D5D] mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
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
                {/* Top Visual Stage: Workstation Window Mockup (v2 Fidelity) */}
                <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs mb-5">
                  {/* Window Titlebar */}
                  <div className="bg-[#FAFBFD] px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                        KULTUR #MB-3312
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      VITEK-2 • CLSI 2024
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    {/* Pathogen Identification */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block font-display">Staphylococcus aureus</span>
                        <span className="text-[10px] text-slate-500 font-mono">Spesimen: Kultur Darah (ICU Bed 02)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-mono">
                        18h Positif
                      </span>
                    </div>

                    {/* Antibiogram Susceptibility (AST) Matrix */}
                    <div className="rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
                      <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase grid grid-cols-12">
                        <span className="col-span-5">Antibiotik</span>
                        <span className="col-span-3 text-right">MIC</span>
                        <span className="col-span-4 text-right">Interpretasi</span>
                      </div>
                      <div className="divide-y divide-slate-100 text-[11px] font-mono">
                        <div className="px-3 py-1 grid grid-cols-12 items-center">
                          <span className="col-span-5 font-bold text-slate-900">Vancomycin</span>
                          <span className="col-span-3 text-right text-slate-600">&le; 0.5</span>
                          <span className="col-span-4 text-right text-emerald-700 font-bold">SENSITIVE (S)</span>
                        </div>
                        <div className="px-3 py-1 grid grid-cols-12 items-center">
                          <span className="col-span-5 font-bold text-slate-900">Meropenem</span>
                          <span className="col-span-3 text-right text-slate-600">&le; 0.25</span>
                          <span className="col-span-4 text-right text-emerald-700 font-bold">SENSITIVE (S)</span>
                        </div>
                        <div className="px-3 py-1 grid grid-cols-12 items-center bg-red-50/50">
                          <span className="col-span-5 font-bold text-red-900">Cefoxitin / Oxa</span>
                          <span className="col-span-3 text-right text-red-700">&ge; 8.0</span>
                          <span className="col-span-4 text-right text-red-700 font-bold">RESISTANT (R)</span>
                        </div>
                      </div>
                    </div>

                    {/* PPRA Alert Banner */}
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
                      <span className="text-amber-900 font-bold flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        Alert MDRO / MRSA Terdeteksi
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-amber-700 font-mono font-semibold">Komite PPRA Notified</span>
                    </div>

                    {/* Metrics Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                        <span className="text-sm font-bold font-display text-[#345DAB] block">2x Cepat</span>
                        <span className="text-[9px] text-slate-600 font-medium">Rekomendasi Terapi</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                        <span className="text-sm font-bold font-display text-emerald-600 block">100% PPRA</span>
                        <span className="text-[9px] text-slate-600 font-medium">Kepatuhan Formularium</span>
                      </div>
                    </div>
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
                {/* Top Visual Stage: Workstation Window Mockup (v2 Fidelity) */}
                <div className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs mb-5">
                  {/* Window Titlebar */}
                  <div className="bg-[#FAFBFD] px-3.5 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                        CROSSMATCH #BDRS-8812
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ISBT-128 VERIFIED
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    {/* Recipient vs Donor Compatibility Grid */}
                    <div className="p-2.5 rounded-xl bg-[#F8FBFE] border border-blue-100/90 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 font-display">Uji Silang Serasi (Crossmatch)</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                          Kompatibel
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-mono">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="text-slate-400 text-[9px] block">Pasien (Resipien)</span>
                          <span className="font-bold text-slate-900 block truncate">Ny. Mariam (B+)</span>
                          <span className="text-emerald-700 text-[9px] font-bold">Mayor: Negatif (OK)</span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="text-slate-400 text-[9px] block">Kantong Donor</span>
                          <span className="font-bold text-slate-900 block truncate">#ID-0892 (B+ / PRC)</span>
                          <span className="text-emerald-700 text-[9px] font-bold">Minor: Negatif (OK)</span>
                        </div>
                      </div>
                    </div>

                    {/* Cold Chain 24/7 Telemetry Strip */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#2764B8]" />
                          Telemetri Rantai Dingin
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-700">3.8°C (Optimal)</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                        <span>Kulkas BDRS Unit #02</span>
                        <span>Rentang: 2.0°C - 6.0°C</span>
                      </div>
                    </div>

                    {/* FEFO Expiry Guard */}
                    <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[10px]">
                      <span className="text-slate-600 font-medium">Rotasi FEFO Stok:</span>
                      <span className="font-bold text-emerald-700 font-mono">Sisa 24 Hari • Siap Rilis</span>
                    </div>

                    {/* Metrics Pill Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                        <span className="text-sm font-bold font-display text-emerald-600 block">Zero Error</span>
                        <span className="text-[9px] text-slate-600 font-medium">Inkompatibilitas</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center shadow-2xs">
                        <span className="text-sm font-bold font-display text-[#345DAB] block">-45%</span>
                        <span className="text-[9px] text-slate-600 font-medium">Darah Expired</span>
                      </div>
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
