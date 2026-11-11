"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  Zap,
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function SolutionsPage() {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<"micro" | "blood">("micro");
  const [deploymentMode, setDeploymentMode] = useState<"cloud" | "onprem">("cloud");

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
          CORE FACILITY SHOWCASE (MATCHING EXACT USER MOCKUP SPEC)
          3 Cards Top, 2 Cards Bottom, Authentic Micro-UIs, Precise Copy
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
          {/* Section Header (Left-aligned with SectionBadge like other sections) */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Mengapa Diagnova?" : "Why Diagnova?"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Dirancang untuk Membuat Kerja Laboratorium Lebih Mudah</>
              ) : (
                <>Designed to Make Laboratory Work Effortless</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Pengalaman diagnostik yang lebih lancar dan cerdas, mulai dari bridging SIMRS dua arah hingga rangkuman klinis Nova AI."
                : "Experience a smoother, smarter way to run clinical workflows from HIS bridging to Nova AI summaries."}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5-CARD ARCHITECTURE (UNIFIED 2-ROW GRID)
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-7">
            {/* ROW 1: 3 EQUAL VERTICAL CARDS (Hospital, Clinical/MCU, Pathology) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {/* Card 1: Central Hospital Laboratory */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Soft Peach/Orange Canvas with 3 Floating Status Pills */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FFF5ED] via-[#FFF9F5] to-white border border-orange-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-5 shadow-2xs">
                  {/* Floating Pill 1: Automated HIS & EMR Bridging */}
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                    <div className="h-6 w-6 rounded-lg bg-[#FFEFE6] text-amber-600 flex items-center justify-center shrink-0">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">Automated HIS &amp; EMR Bridging</span>
                  </div>

                  {/* Floating Pill 2: ER & ICU Panic Alerts < 25m */}
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                    <div className="h-6 w-6 rounded-lg bg-[#FEECEB] text-rose-500 flex items-center justify-center shrink-0">
                      <AlertTriangle className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">ER &amp; ICU Panic Alerts &lt; 25m</span>
                  </div>

                  {/* Floating Pill 3: Bedside Phlebotomy Barcode */}
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                    <div className="h-6 w-6 rounded-lg bg-[#FEF6E6] text-amber-500 flex items-center justify-center shrink-0">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">Bedside Phlebotomy Barcode</span>
                  </div>
                </div>

                {/* Bottom Content: Clean Title + Subtitle */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID" ? "Laboratorium Rumah Sakit Sentral" : "Central Hospital Laboratory"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Menghubungkan operasional laboratorium sentral dengan IGD dan ICU, meniadakan kesalahan entri data manual."
                    : "Unifies central lab operations with ER and ICU, eliminating manual transcription errors."}
                </p>
              </div>

              {/* Card 2: Clinical & Reference Labs */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Soft Cyan/Blue Canvas with Corporate MCU Intake Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EFF8FF] via-[#F6FAFF] to-white border border-blue-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Batch Ingested
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-700">PT Telkom (450 Pax)</span>
                  </div>

                  {/* Corporate MCU Roster Box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Corporate MCU Roster</h4>
                    <p className="text-[10px] font-mono text-slate-500">450 Barcode Terbit • 0.4s / Peserta</p>
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
                      <span className="text-[10px] text-slate-500 font-medium">+447 Lainnya</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2764B8]">
                      <Send className="h-3 w-3" />
                      WhatsApp PDF
                    </span>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID" ? "Lab Klinik & Rujukan" : "Clinical & Reference Labs"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Penanganan spesimen bervolume harian tinggi dengan check-in cepat dan pengiriman PDF WhatsApp otomatis."
                    : "High daily volume handling with rapid check-in and automated encrypted WhatsApp delivery."}
                </p>
              </div>

              {/* Card 3: Anatomical Pathology */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Soft Mint/Green Canvas with 5-Step Pipeline & Action Buttons */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#EDFAF2] via-[#F5FCF7] to-white border border-emerald-100/80 h-[215px] flex flex-col justify-between mb-5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Alur Kaset &amp; Slide</span>
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
                    <span className="text-slate-500">#PA-24-0982 (Biopsi)</span>
                    <span className="text-slate-700 font-bold">ICD-O 8500/3</span>
                  </div>

                  {/* 2 Bottom Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                      Arsip Blok
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg bg-[#0F172A] text-[10px] font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors"
                    >
                      Validasi Sp.PA
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Pelacakan barcode mikro 2D pada kaset dan slide kaca untuk eliminasi mutlak spesimen tertukar."
                    : "2D micro-barcode tracking across cassettes and glass slides for zero specimen mix-ups."}
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                ROW 2: 2 BALANCED CARDS (Microbiology Stewardship & Nova AI)
                ══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
              {/* Card 4: Microbiology Stewardship & Blood Bank (Wide 7-col) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Workstation Telemetry & AST Sensitivity Table */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F6F9FD] via-[#FAFBFD] to-white border border-slate-200/90 mb-5 space-y-3.5 shadow-2xs">
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
                        Kultur Mikrobiologi PPRA
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
                        Bank Darah (BDRS)
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
                        <span className="text-[10px] text-slate-400 font-mono block">Isolat Kuman</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono truncate block mt-0.5">
                          S. aureus (18h)
                        </span>
                        <span className="text-[10px] font-mono text-[#2764B8] font-semibold block mt-0.5">
                          VITEK-2 Ingested
                        </span>
                      </div>
                      <div className="px-2.5 py-1">
                        <span className="text-[10px] text-slate-400 font-mono block">Sensitivitas Utama</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5">
                          Vancomycin (S)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          MIC &le; 0.5 &micro;g/mL
                        </span>
                      </div>
                      <div className="px-2.5 py-1">
                        <span className="text-[10px] text-red-500 font-mono block font-bold">Resistensi Terdeteksi</span>
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
                        <span className="text-[10px] text-slate-400 font-mono block">Uji Silang Serasi</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono truncate block mt-0.5">
                          Mayor &amp; Minor (OK)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          #ID-0892 &times; Ny. Mariam
                        </span>
                      </div>
                      <div className="px-2.5 py-1">
                        <span className="text-[10px] text-slate-400 font-mono block">Suhu Kulkas BDRS</span>
                        <span className="font-bold text-[#2764B8] text-xs sm:text-sm font-mono block mt-0.5">
                          3.8&deg;C (Aman)
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          Rentang 2&deg;C - 6&deg;C
                        </span>
                      </div>
                      <div className="px-2.5 py-1">
                        <span className="text-[10px] text-slate-400 font-mono block">Rotasi FEFO Stok</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block mt-0.5">
                          Sisa 24 Hari
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
                      Cari riwayat kultur kuman atau pola resistensi antibiogram...
                    </span>
                    <button
                      type="button"
                      className="px-3.5 py-1 rounded-full bg-[#FF5A1F] hover:bg-[#E04B14] text-white font-bold text-[10px] shadow-2xs transition-colors shrink-0"
                    >
                      Enter
                    </button>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID"
                    ? "Mikrobiologi PPRA & Bank Darah"
                    : "Microbiology Stewardship & Blood Bank"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Kendali penuh pelaporan antibiogram PPRA sesuai standar CLSI dan jaminan nol inkompatibilitas transfusi darah."
                    : "Complete command for CLSI-compliant stewardship antibiograms and 100% zero-mismatch blood transfusions."}
                </p>
              </div>

              {/* Card 5: Nova AI Clinical Summaries (Compact 5-col) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_24px_rgba(31,45,93,0.04)] hover:shadow-md transition-all duration-300 flex flex-col group">
                {/* Top Visual Stage: Nova AI Clinical Narrative Summary */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] via-[#F8FAFD] to-white border border-slate-200/90 mb-5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#2764B8]" />
                      Summary Nova AI
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      Delta Check
                    </span>
                  </div>

                  {/* 3 Narrative Summary Cards */}
                  <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-normal">
                    <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                      Terdeteksi lonjakan biomarker serum Kreatinin (+115% vs baseline 3 bulan lalu).
                    </p>
                    <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                      Rekomendasi DPJP: Lakukan evaluasi Acute Kidney Injury (AKI) sebelum memulai peresepan nefrotoksik.
                    </p>
                    <p className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-emerald-800 font-medium">
                      Otorisasi Klinis: Keputusan diagnostik dan tindakan medis 100% di tangan dokter spesialis.
                    </p>
                  </div>
                </div>

                {/* Bottom Content */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors tracking-tight">
                  {language === "ID" ? "Rangkuman Klinis Nova AI" : "Nova AI Clinical Summaries"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Otomatis menangkap pergeseran data biomarker kritis dan menyajikan narasi medis instan untuk DPJP."
                    : "Automatically flags longitudinal shifts and delivers instant clinical narratives for attending doctors."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FACILITY FIT MATRIX (GALILEO-STYLE BLUE POD & FLOATING CARDS)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] pt-14 pb-28 sm:pb-36 border-t border-slate-200/60 overflow-visible">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full relative">
          {/* Blue Framed Container Pod */}
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#1C4382] via-[#245DAA] to-[#2B6EC6] pt-14 sm:pt-16 pb-36 sm:pb-44 lg:pb-52 px-6 sm:px-10 lg:px-14 shadow-[0_20px_50px_rgba(28,67,130,0.28)] overflow-hidden">
            {/* Background Subtle Dot Matrix Pattern (Galileo Style) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* Ambient Radial Luminous Glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(255,255,255,0.18),transparent)]" />

            {/* Layered Stepped Glass Pillars Architectural Silhouette */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:flex justify-center items-end gap-6 lg:gap-8 max-w-[1240px] mx-auto px-6">
              <div className="w-1/3 h-[78%] rounded-t-[32px] sm:rounded-t-[38px] bg-gradient-to-t from-white/10 via-white/15 to-white/20 border-t border-x border-white/20 backdrop-blur-xs" />
              <div className="w-1/3 h-[90%] rounded-t-[36px] sm:rounded-t-[44px] bg-gradient-to-t from-white/15 via-white/20 to-white/25 border-t border-x border-white/25 backdrop-blur-xs" />
              <div className="w-1/3 h-[78%] rounded-t-[32px] sm:rounded-t-[38px] bg-gradient-to-t from-white/10 via-white/15 to-white/20 border-t border-x border-white/20 backdrop-blur-xs" />
            </div>

            {/* Header: Centered White Title, Subtitle, and Galileo White Capsule Switcher */}
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.15]">
                {language === "ID"
                  ? "Solusi Tepat untuk Setiap Skala Faskes"
                  : "Tailored Architectures for Every Facility Scale"}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed max-w-2xl mx-auto">
                {language === "ID"
                  ? "Pilih konfigurasi yang dirancang khusus untuk kebutuhan dan kapasitas instansi Anda. Tanpa biaya tersembunyi, fokus pada efisiensi kerja klinis."
                  : "Choose an architecture engineered for your institution's specific tier. No bloatware, focused purely on clinical speed and compliance."}
              </p>

              {/* Galileo-style White Pill Switcher with Active Blue Button */}
              <div className="inline-flex items-center p-1 rounded-full bg-white shadow-md mt-7">
                <button
                  type="button"
                  onClick={() => setDeploymentMode("cloud")}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                    deploymentMode === "cloud"
                      ? "bg-[#2764B8] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Cloud Enterprise
                </button>
                <button
                  type="button"
                  onClick={() => setDeploymentMode("onprem")}
                  className={cn(
                    "px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
                    deploymentMode === "onprem"
                      ? "bg-[#2764B8] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  On-Premise Server
                </button>
              </div>
            </div>
          </div>

          {/* 3 Floating White Cards (Overlapping bottom boundary of blue pod) */}
          <div className="relative z-20 -mt-28 sm:-mt-36 lg:-mt-44 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1240px] mx-auto items-stretch px-4 sm:px-6">
            {/* Card 1: Tier 1 - Hospital Systems */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-100 p-7 sm:p-8 shadow-[0_20px_45px_rgba(15,23,42,0.14)] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                {/* Plan Header */}
                <span className="text-sm font-bold text-slate-800 block">
                  {language === "ID" ? "Rumah Sakit Sentral" : "Hospital Central"}
                </span>

                {/* Price / Scale Headline */}
                <div>
                  <div className="flex items-baseline">
                    <span className="font-display text-3xl sm:text-[34px] font-extrabold text-slate-900 tracking-tight">
                      Tier 1
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-2">
                      {language === "ID" ? "RS Tipe A / B / C" : "Type A / B / C"}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#2764B8] block mt-1">
                    {deploymentMode === "cloud"
                      ? "Private Cloud LIS + HL7 Bridge"
                      : "Internal Local Hospital Server"}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Integrasi penuh SIMRS dua arah, panel CITO IGD berkecepatan tinggi, dan bridging otomatis ke rekam medis pasien."
                    : "Full bidirectional HIS bridging, rapid emergency ER CITO panel alerts, and instant patient EMR synchronization."}
                </p>

                {/* Feature List with Galileo-style Green Checks */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span className="font-semibold text-slate-900">{language === "ID" ? "Bridging SIMRS & SatuSehat Kemenkes" : "Bidirectional HIS & SatuSehat Kemenkes"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Panic Value Alert IGD & ICU < 25m" : "Panic Value Alert to ER & ICU < 25m"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Validasi Barcode Flebotomi Bedside" : "Bedside Phlebotomy Barcode Validation"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Kepatuhan Akreditasi KARS & JCI" : "Full KARS & JCI Audit Compliance"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Interfacing 500+ Mesin Analyzer Otomatis" : "Automated Interfacing with 500+ Analyzers"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Outline Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="block w-full py-3 rounded-full border-2 border-[#2764B8] hover:bg-[#2764B8]/5 text-[#2764B8] text-xs font-bold text-center transition-all shadow-2xs"
                >
                  {language === "ID" ? "Konsultasi Solusi RS" : "Consult Hospital Setup"}
                </Link>
              </div>
            </div>

            {/* Card 2: Tier 2 - Clinical & Reference Labs (FEATURED CENTER HIGHLIGHT) */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border-2 border-blue-200 p-7 sm:p-8 shadow-[0_25px_55px_rgba(15,23,42,0.18)] flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 relative z-20">
              <div className="space-y-4">
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    {language === "ID" ? "Lab Klinik & MCU" : "Clinical & MCU Labs"}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    POPULAR
                  </span>
                </div>

                {/* Price / Scale Headline */}
                <div>
                  <div className="flex items-baseline">
                    <span className="font-display text-3xl sm:text-[34px] font-extrabold text-slate-900 tracking-tight">
                      Tier 2
                    </span>
                    <span className="text-xs text-[#2764B8] font-bold ml-2">
                      {language === "ID" ? "Lab Mandiri & MCU" : "Independent & MCU"}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#2764B8] block mt-1">
                    {deploymentMode === "cloud"
                      ? "High-Throughput Cloud Engine"
                      : "Outpatient Dedicated Server"}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Dioptimalkan untuk throughput spesimen massal harian, registrasi barcode 30 detik, dan pengiriman otomatis WhatsApp PDF."
                    : "Optimized for high-volume daily check-in, 30s rapid barcode labeling, and instant encrypted WhatsApp delivery."}
                </p>

                {/* Feature List with Galileo-style Green Checks */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span className="font-semibold text-slate-900">{language === "ID" ? "Mesin Batch MCU Korporat 1-Klik" : "1-Click Corporate MCU Batch Engine"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Cetak Barcode Tabung 0.4s / Label" : "0.4s / Tube Rapid Barcode Printing"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Kirim Hasil WhatsApp PDF Terenkripsi" : "Encrypted WhatsApp PDF Delivery"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Gateway Billing B2B Jejaring Rujukan" : "B2B Referral Billing Gateway"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Portal Hasil Pasien Paperless Mandiri" : "Self-Service Paperless Patient Portal"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Filled Blue Button (Highlight like Galileo) */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="block w-full py-3.5 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white text-xs font-bold text-center shadow-[0_4px_16px_rgba(39,100,184,0.35)] transition-all active:scale-[0.98]"
                >
                  {language === "ID" ? "Pilih Solusi Lab Klinik" : "Choose Clinical Lab Setup"}
                </Link>
              </div>
            </div>

            {/* Card 3: Tier 3 - Specialist Diagnostics */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-100 p-7 sm:p-8 shadow-[0_20px_45px_rgba(15,23,42,0.14)] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                {/* Plan Header */}
                <span className="text-sm font-bold text-slate-800 block">
                  {language === "ID" ? "Diagnostik Spesialis" : "Specialist Diagnostics"}
                </span>

                {/* Price / Scale Headline */}
                <div>
                  <div className="flex items-baseline">
                    <span className="font-display text-3xl sm:text-[34px] font-extrabold text-slate-900 tracking-tight">
                      Tier 3
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-2">
                      {language === "ID" ? "Spesialis PA & Mikro" : "Pathology & Micro Suite"}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#2764B8] block mt-1">
                    {deploymentMode === "cloud"
                      ? "Accredited Subspecialty Suite"
                      : "Standalone Specimen Workstation"}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Dirancang mendalam untuk instalasi patologi anatomi jaringan, mikrobiologi kultur CLSI, dan bank darah rumah sakit (BDRS)."
                    : "Engineered for anatomical pathology tissue tracking, CLSI microbiology cultures, and hospital blood banks."}
                </p>

                {/* Feature List with Galileo-style Green Checks */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Pelacakan 2D Kaset Jaringan & Slide" : "2D Tracking for Tissue Cassettes & Slides"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Template Baku ICD-O-3 & Bethesda" : "Standardized ICD-O-3 & Bethesda Templates"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Pembangkit Peta Antibiogram CLSI" : "Automated CLSI Antibiogram Generator"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Uji Silang Serasi Digital ISBT-128" : "Digital ISBT-128 Cross-Match Engine"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                    <Check className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                    <span>{language === "ID" ? "Telemetri Rantai Dingin 24/7 (2°C-6°C)" : "24/7 Cold Chain Telemetry (2°C-6°C)"}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Outline Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="block w-full py-3 rounded-full border-2 border-[#2764B8] hover:bg-[#2764B8]/5 text-[#2764B8] text-xs font-bold text-center transition-all shadow-2xs"
                >
                  {language === "ID" ? "Konsultasi Solusi Spesialis" : "Consult Specialist Setup"}
                </Link>
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
