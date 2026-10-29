"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Stethoscope,
  Microscope,
  FlaskConical,
  HeartPulse,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

export default function SolutionsPage() {
  const { language } = useLanguage();
  const [selectedFacility, setSelectedFacility] = useState<number>(0);

  const facilityOptions = [
    {
      id: "hospital",
      title: language === "ID" ? "Rumah Sakit Umum & Khusus" : "General & Specialty Hospitals",
      desc:
        language === "ID"
          ? "Dirancang untuk instalasi lab sentral, IGD, ICU, dan bangsal rawat inap dengan bridging dua arah ke SIMRS/RME."
          : "Engineered for central laboratory, ER, ICU, and inpatient wards with seamless two-way HIS/EMR bridging.",
      recommendedSolutions: [
        language === "ID" ? "Laboratorium Rumah Sakit (Core LIS)" : "Hospital Laboratory (Core LIS)",
        language === "ID" ? "Bank Darah & Transfusi (BDRS)" : "Blood Bank & Transfusion Safety",
        language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology & Cytology",
        language === "ID" ? "Mikrobiologi Klinis & PPRA" : "Microbiology & Antibiotic Stewardship",
      ],
      keyMetrics: [
        { label: language === "ID" ? "TAT Pasien Darurat IGD" : "ER Panic TAT", val: "< 25 Menit" },
        { label: language === "ID" ? "Bridging SIMRS / RME" : "HIS / EMR Bridging", val: "Bidirectional" },
        { label: language === "ID" ? "Standar Akreditasi" : "Accreditation", val: "KARS & JCI Ready" },
      ],
    },
    {
      id: "clinic",
      title: language === "ID" ? "Laboratorium Klinik & Rujukan" : "Clinical & Reference Labs",
      desc:
        language === "ID"
          ? "Dioptimalkan untuk volume spesimen tinggi, medical check-up (MCU) korporasi, registrasi barcode cepat, dan portal pasien online."
          : "Optimized for high specimen throughput, corporate check-ups (MCU), fast barcode dispatch, and online patient results.",
      recommendedSolutions: [
        language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory",
        language === "ID" ? "Modul Pemeriksaan MCU Massal" : "Mass Corporate MCU Engine",
        language === "ID" ? "Portal Hasil Online & WhatsApp PDF" : "Online Patient Portal & Encrypted PDF",
        language === "ID" ? "Manajemen Billing & B2B Rujukan" : "B2B Outreach & Billing Gateway",
      ],
      keyMetrics: [
        { label: language === "ID" ? "Kecepatan Registrasi" : "Registration Speed", val: "30 Detik/Pasien" },
        { label: language === "ID" ? "Penyampaian Laporan" : "Report Delivery", val: "Otomatis via WA/Web" },
        { label: language === "ID" ? "Efisiensi Kertas" : "Paperless Ratio", val: "100% Digital" },
      ],
    },
    {
      id: "specialist",
      title: language === "ID" ? "Pusat Diagnostik Spesialis" : "Specialized Diagnostic Centers",
      desc:
        language === "ID"
          ? "Solusi khusus untuk laboratorium patologi anatomi jaringan, kultur mikrobiologi sensitivitas tinggi, dan bank darah terisolasi."
          : "Tailored systems for histological tissue tracking, high-sensitivity microbial cultures, and isolated blood banking.",
      recommendedSolutions: [
        language === "ID" ? "Patologi Anatomi & Slide Tracking" : "Anatomical Pathology & Slide Tracking",
        language === "ID" ? "Mikrobiologi & Antibiogram PPRA" : "Microbiology & Antibiogram Matrix",
        language === "ID" ? "Bank Darah & Cold-Chain Guard" : "Blood Bank & Cold-Chain Guard",
        language === "ID" ? "Nova AI Clinical Copilot" : "Nova AI Clinical Copilot",
      ],
      keyMetrics: [
        { label: language === "ID" ? "Pelacakan Kaset & Slide" : "Cassette Tracking", val: "2D Micro-Barcode" },
        { label: language === "ID" ? "Kalkulasi Antibiogram" : "Antibiogram Calculation", val: "Otomatis CLSI/EUCAST" },
        { label: language === "ID" ? "Pencegahan Kadaluarsa" : "Wastage Control", val: "FEFO Alert Zero-Loss" },
      ],
    },
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Sesuai Design Style Platform Page (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-100">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-sky-100/30 blur-[110px] pointer-events-none" />

        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Section Badge */}
            <div className="mb-4 sm:mb-5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Solusi Diagnova" : "Diagnova Solutions"}
              </SectionBadge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Solusi Spesifik Terkonfigurasi untuk{" "}
                  <br className="hidden sm:inline" />
                  Setiap Tantangan Laboratorium
                </>
              ) : (
                <>
                  Purpose-Built Solutions Configured for{" "}
                  <br className="hidden sm:inline" />
                  Every Laboratory Challenge
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl">
              {language === "ID"
                ? "Setiap fasilitas laboratorium memiliki alur kerja, integrasi, dan regulasi spesifik. Diagnova menghadirkan solusi yang dirancang tepat sasaran untuk rumah sakit, lab klinik mandiri, patologi anatomi, mikrobiologi PPRA, dan bank darah."
                : "Every laboratory facility operates with distinct workflow, integration, and regulatory demands. Diagnova delivers tailored architectures engineered specifically for central hospitals, commercial outpatient labs, pathology, microbiology, and blood banks."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>{language === "ID" ? "Jadwalkan Konsultasi Solusi" : "Schedule Solutions Consultation"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#solutions-grid"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Eksplorasi 6 Solusi Inti" : "Explore 6 Core Solutions"}</span>
              </a>
            </div>

            {/* 4 Key Pillars Metric Cards */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
              {[
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
                  value: "6 Sektor",
                  label: language === "ID" ? "Solusi Terdedikasi" : "Specialized Verticals",
                  sub: language === "ID" ? "RS, MCU, PA, BDRS, AI" : "Hospital, Outpatient, Labs",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-5 text-left shadow-xs hover:border-blue-200/80 transition-colors"
                >
                  <p className="font-display text-2xl sm:text-3xl font-bold text-[#345DAB] tracking-tight">
                    {kpi.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    {kpi.label}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: THE 6 CORE SOLUTIONS — TAILORED BENTO SHOWCASE
          (Desain Elegan Berkarakter, Jauh dari Flat AI Template)
          ══════════════════════════════════════════════════════════════ */}
      <section id="solutions-grid" className="scroll-mt-24 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "6 Pilar Solusi" : "6 Core Solutions"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Dikonfigurasi Sesuai Kebutuhan Spesialisasi Anda
                </>
              ) : (
                <>
                  Configured Exactly to Your Specialty Requirements
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Pilih solusi yang paling cocok dengan fasilitas Anda. Masing-masing dirancang dengan antarmuka analyzer yang spesifik, modul pelaporan klinis, dan integrasi sistem rumah sakit."
                : "Select the solution that fits your institutional tier. Each is equipped with specialized analyzer interfaces, clinical reporting modules, and seamless HIS integration."}
            </p>
          </div>

          {/* ═══ ROW 1: TWO FEATURED FLAGSHIP CARDS (RS & CLINIC) ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Card 1: Hospital Laboratory */}
            <div
              id="hospital-laboratory"
              className="scroll-mt-32 relative flex flex-col justify-between rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F5F8FC] to-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:shadow-[0_12px_36px_-6px_rgba(40,90,165,0.14)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200/80 text-[#2764B8] flex items-center justify-center shadow-xs">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Rumah Sakit Sentral & IGD" : "Central Hospital & ER"}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Hospital Laboratory
                </h3>
                <p className="text-sm font-medium text-[#345DAB] mb-4">
                  {language === "ID"
                    ? "Ekosistem LIS Terintegrasi Penuh untuk Rumah Sakit Modern"
                    : "Fully Integrated LIS Ecosystem for Modern Hospitals"}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {language === "ID"
                    ? "Menghubungkan laboratorium sentral, IGD, ICU, dan bangsal rawat inap secara real-time. Order dokter dari SIMRS langsung dikonversi menjadi worklist mesin, dan hasil kritis (panic values) dialirkan ke layar dokter DPJP dalam hitungan menit."
                    : "Connects central labs, emergency rooms, ICUs, and inpatient floors in real-time. HIS physician orders convert immediately into analyzer worklists, and critical panic values alert attending doctors in minutes."}
                </p>

                {/* Core Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200/70 text-xs text-slate-700">
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Bridging Dua Arah SIMRS & RME" : "Bidirectional HIS & EMR Bridging"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Smart Panic Value Alert IGD/ICU" : "Smart Panic Alerts for ER/ICU"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Pelacakan Barcode Samping Bed" : "Bedside Sample Barcode Tracking"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Dashboard TAT Real-time Per Shift" : "Live TAT Monitoring per Shift"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2764B8] hover:text-[#1D3F82] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Solusi RS" : "Consult Hospital Setup"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{language === "ID" ? "Demo RS" : "Hospital Demo"}</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Clinical Laboratory & MCU */}
            <div
              id="clinical-laboratory"
              className="scroll-mt-32 relative flex flex-col justify-between rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F5F8FC] to-white border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:shadow-[0_12px_36px_-6px_rgba(40,90,165,0.14)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200/80 text-[#2764B8] flex items-center justify-center shadow-xs">
                    <Stethoscope className="h-7 w-7 text-[#2A82B8]" />
                  </div>
                  <span className="text-xs font-semibold text-[#2A82B8] bg-sky-50 border border-sky-200/60 px-3 py-1 rounded-full">
                    {language === "ID" ? "Lab Klinik & Rujukan" : "Outpatient & Reference"}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Clinical Laboratory &amp; MCU
                </h3>
                <p className="text-sm font-medium text-[#2A82B8] mb-4">
                  {language === "ID"
                    ? "Throughput Tinggi, Registrasi Massal & Layanan Pasien Digital"
                    : "High Throughput, Mass Registration & Digital Patient Experience"}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {language === "ID"
                    ? "Dirancang untuk menangani ribuan spesimen harian dengan kecepatan maksimal. Mempercepat registrasi Medical Check-Up (MCU) korporasi, pencetakan barcode otomatis, hingga pengiriman hasil lab instan via WhatsApp & portal pasien terenkripsi."
                    : "Engineered for high daily specimen volume. Accelerates corporate check-up (MCU) registration, automated tube labeling, and instant encrypted PDF delivery via WhatsApp and secure patient web portals."}
                </p>

                {/* Core Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200/70 text-xs text-slate-700">
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Modul Pemeriksaan MCU Massal" : "Mass Corporate MCU Engine"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Portal Hasil & WhatsApp Otomatis" : "Patient Portal & WhatsApp Delivery"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Interfacing B2B Klinik Rujukan" : "B2B Reference Network Gateway"}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{language === "ID" ? "Billing & Tarif Korporat Fleksibel" : "Flexible Insurance & Corporate Billing"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2764B8] hover:text-[#1D3F82] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Lab Klinik" : "Consult Clinical Lab Setup"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>{language === "ID" ? "Demo Klinik" : "Clinic Demo"}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ═══ ROW 2: FOUR SPECIALIZED FOCUS CARDS (PATOLOGI, MIKRO, BANK DARAH, NOVA AI) ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 3. Anatomical Pathology */}
            <div
              id="pathology"
              className="scroll-mt-32 flex flex-col justify-between rounded-[28px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2A5EAA] flex items-center justify-center mb-5">
                  <Microscope className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {language === "ID" ? "Patologi Anatomi" : "Anatomical Pathology"}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug">
                  Anatomical Pathology
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                  {language === "ID"
                    ? "Pelacakan spesimen jaringan, kaset biopsi, dan slide kaca berbasis 2D barcode untuk histopatologi & sitologi tanpa risiko tertukar."
                    : "Strict tissue tracking across cassettes, paraffin blocks, and glass slides with 2D micro-barcodes and SNOMED CT reporting."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1D3F82] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Patologi" : "Consult Pathology Setup"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* 4. Microbiology & PPRA */}
            <div
              id="microbiology"
              className="scroll-mt-32 flex flex-col justify-between rounded-[28px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2A5EAA] flex items-center justify-center mb-5">
                  <FlaskConical className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology & Stewardship"}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug">
                  Microbiology &amp; PPRA
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                  {language === "ID"
                    ? "Pencatatan inkubasi kultur bakteri, uji kepekaan antibiotik (AST), pembacaan MIC CLSI/EUCAST, dan kalkulasi antibiogram otomatis."
                    : "Automated incubation tracking, AST interpretation with CLSI/EUCAST standards, and automated hospital antibiogram reporting."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1D3F82] group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Mikrobiologi" : "Consult Microbiology Setup"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* 5. Blood Bank & Transfusion */}
            <div
              id="blood-bank"
              className="scroll-mt-32 flex flex-col justify-between rounded-[28px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank & Safety"}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug">
                  Blood Bank &amp; Transfusion
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                  {language === "ID"
                    ? "Validasi ganda uji silang serasi (crossmatching), kontrol suhu penyimpanan cold-chain, dan rotasi stok FEFO untuk zero wastage."
                    : "Dual-verification crossmatching, strict cold-chain telemetry, and FEFO inventory rotation ensuring zero transfusion errors."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Bank Darah" : "Consult Blood Bank Setup"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* 6. Nova AI Intelligence */}
            <div
              id="nova-ai"
              className="scroll-mt-32 flex flex-col justify-between rounded-[28px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300"
            >
              <div>
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-5">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {language === "ID" ? "Intelijen Klinis AI" : "AI Intelligence"}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 leading-snug">
                  Nova AI Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                  {language === "ID"
                    ? "Mendeteksi pergeseran biomarker delta-check antar-kunjungan, merangkum angka klinis rumit, dan membantu dokter membuat keputusan cepat."
                    : "Detects longitudinal biomarker delta spikes, generates concise clinical summaries, and empowers physicians without replacing them."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 group transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasi Nova AI" : "Consult Nova AI"}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: INTERACTIVE FACILITY SELECTOR (RUMAH SAKIT vs KLINIK)
          (Alternating #F9F9F9 Background, Identik dengan Pola Platform Page)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Kesesuaian Fasilitas" : "Facility Fit Matrix"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Pilih Solusi Tepat Sesuai Skala Institusi Anda
                </>
              ) : (
                <>
                  Find the Exact Match for Your Facility Tier
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Diagnova beradaptasi dengan kapasitas Anda. Lihat paket solusi dan modul yang direkomendasikan berdasarkan tipe fasilitas kesehatan Anda."
                : "Diagnova scales to your institution. Review recommended architectures and modules tailored to your operational tier."}
            </p>
          </div>

          {/* Interactive Tier Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8">
            {facilityOptions.map((opt, idx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedFacility(idx)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs",
                  selectedFacility === idx
                    ? "bg-[#2764B8] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50"
                )}
              >
                {opt.title}
              </button>
            ))}
          </div>

          {/* Selected Tier Presentation Card */}
          <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-sm transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Description & Recommended Solutions */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    {facilityOptions[selectedFacility].title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                    {facilityOptions[selectedFacility].desc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
                    {language === "ID" ? "Modul & Fitur yang Direkomendasikan:" : "Recommended Solution Package:"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {facilityOptions[selectedFacility].recommendedSolutions.map((solName, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs sm:text-sm text-slate-700 font-medium"
                      >
                        <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                        <span>{solName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                  >
                    <span>{language === "ID" ? "Konsultasikan Solusi Ini" : "Discuss This Architecture"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Target Metrics Display */}
              <div className="lg:col-span-5 rounded-[24px] bg-gradient-to-br from-[#F5F8FC] to-white border border-slate-200/80 p-6 sm:p-8 space-y-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === "ID" ? "Tolok Ukur Efisiensi Operasional" : "Operational Efficiency Targets"}
                </span>

                <div className="space-y-4">
                  {facilityOptions[selectedFacility].keyMetrics.map((kpi, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs"
                    >
                      <span className="text-xs sm:text-sm font-medium text-slate-600">
                        {kpi.label}
                      </span>
                      <span className="font-display text-sm sm:text-base font-bold text-[#345DAB]">
                        {kpi.val}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                  {language === "ID"
                    ? "*Target performa disesuaikan dengan volume instrumen dan kesiapan infrastruktur IT laboratorium Anda."
                    : "*Performance benchmarks tailored to your active analyzer inventory and hospital IT network."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Consistent with the entire platform
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
