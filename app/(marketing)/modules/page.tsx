"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  PackageCheck,
  Microscope,
  FlaskConical,
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Database,
  ChevronRight,
  FileText,
  QrCode,
  AlertTriangle,
  Zap,
  Send,
  Search,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-[#FAFBFD] text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Modul Spesialisasi Diagnova" : "Diagnova Modular Suite"}
        title={
          language === "ID" ? (
            <>
              Modul Terkonfigurasi untuk{" "}
              <br className="hidden sm:inline" />
              Setiap Departemen Laboratorium
            </>
          ) : (
            <>
              Configured Modules for{" "}
              <br className="hidden sm:inline" />
              Every Laboratory Department
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Aktifkan modul sesuai kebutuhan faskes Anda atau integrasikan seluruhnya dalam satu ekosistem tanpa silo. Seluruh data pasien, sampel, dan hasil mengalir dalam satu sistem yang aman dan siap akreditasi."
            : "Deploy individual modules on-demand or operate as a unified ecosystem. All patient data, specimen chains, and analyzer results flow seamlessly in a secure, accreditation-ready environment."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Konsultasi Modul" : "Schedule Module Consultation",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Eksplorasi 5 Modul" : "Explore 5 Modules",
          href: "#modules-catalog",
        }}
        metrics={[
          {
            value: language === "ID" ? "5 Modul" : "5 Modules",
            label: language === "ID" ? "Spesialisasi Lengkap" : "Dedicated Modules",
            sub: language === "ID" ? "Rutin, BDRS, Stok, PA, Mikro" : "Hematology, Blood, Reagents, PA",
          },
          {
            value: "100%",
            label: language === "ID" ? "Interfacing Analyzer" : "Analyzer Interfacing",
            sub: language === "ID" ? "ASTM & HL7 bidireksional" : "Direct bidirectional protocol",
          },
          {
            value: "Zero Error",
            label: language === "ID" ? "Salah Identifikasi" : "Zero Sample Mix-ups",
            sub: language === "ID" ? "Barcode 2D & delta-check" : "2D micro-barcode tracking",
          },
          {
            value: "Plug & Play",
            label: language === "ID" ? "Aktivasi Bertahap" : "Modular Deployment",
            sub: language === "ID" ? "Bebas tambah modul on-demand" : "Deploy on-demand per dept",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          CORE MODULES CATALOG (CLEAN 5-CARD ARCHITECTURE)
          Row 1: 3 Cards (Routine, Blood Bank, Reagents)
          Row 2: 2 Cards (Pathology Wide 7-col + Microbiology 5-col)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="modules-catalog"
        className="scroll-mt-24 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Katalog Modul Spesialisasi" : "Specialized Module Catalog"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Arsitektur Modul Klinis Terintegrasi</>
              ) : (
                <>Integrated Clinical Module Architecture</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Setiap modul dirancang khusus untuk alur kerja departemen masing-masing, didukung oleh telemetri instrumen langsung dan kepatuhan akreditasi nasional KARS."
                : "Each module is engineered for department-specific workflows, powered by direct analyzer telemetry and international accreditation compliance."}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              5-CARD ARCHITECTURE (UNIFIED 2-ROW GRID WITH BALANCED GAPS)
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-7">
            {/* ROW 1: 3 EQUAL VERTICAL CARDS (Hematology, Blood Bank, Reagents) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {/* Card 1: Routine & Hematology */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Peach/Orange Canvas with Levey-Jennings QC & Delta Check */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FFF5ED] via-[#FFF9F5] to-white border border-orange-100/80 h-[215px] flex flex-col justify-between mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded shadow-2xs">
                        Sysmex XN • Cobas 6000
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        ASTM Connected
                      </span>
                    </div>

                    {/* Levey-Jennings QC Mini-Status Box */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">Quality Control (Levey-Jennings)</span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">1:2s Valid</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Westgard Rules Checked • 1.240 Tes/Shift</span>
                      </div>
                    </div>

                    {/* Delta Check Anomaly Alert */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[10px] font-mono text-amber-900">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Zap className="h-3 w-3 text-amber-600" />
                        Delta-Check Otomatis
                      </span>
                      <span className="text-amber-700 font-semibold">Trombosit Normal</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === "ID" ? "Patologi Klinik & Rutin" : "Clinical Pathology"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">MOD-01</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    Routine &amp; Hematology
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Otomasi pemeriksaan darah dan kimia klinik volume tinggi dengan interfacing 200+ analyzer dan verifikasi delta-check instan."
                      : "High-throughput blood and clinical chemistry automation with direct 200+ analyzer interfacing and automated delta checks."}
                  </p>
                </div>

                {/* Footer with Impact Metrics & Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-[#345DAB] block">-70% TAT</span>
                    <span className="text-slate-400 text-[10px]">0 Error Ketik</span>
                  </div>
                  <Link
                    href="/modules/routine-hematology"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Detail Modul" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Blood Bank Management */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Sky Blue Canvas with Digital Crossmatching */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#EFF8FF] via-[#F6FAFF] to-white border border-blue-100/80 h-[215px] flex flex-col justify-between mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded shadow-2xs">
                        ISBT 128 Standard
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        Kompatibel
                      </span>
                    </div>

                    {/* Dual-Check Crossmatch Status */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                        <span className="text-slate-400 block">Mayor Crossmatch</span>
                        <span className="text-emerald-700 font-bold text-xs">Negatif (OK)</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                        <span className="text-slate-400 block">Minor Crossmatch</span>
                        <span className="text-emerald-700 font-bold text-xs">Negatif (OK)</span>
                      </div>
                    </div>

                    {/* Cold-Chain Telemetry */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-mono text-slate-600">
                      <span>Suhu BDRS: 3.8°C (2-6°C)</span>
                      <span className="text-emerald-700 font-bold">FEFO: Sisa 24 Hari</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === "ID" ? "Bank Darah (BDRS) & UTD" : "Blood Bank & Safety"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">MOD-02</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    Blood Bank Management
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Verifikasi ganda uji silang serasi digital Mayor/Minor, kontrol suhu rantai dingin 24/7, dan pencegahan transfusi inkompatibel."
                      : "Electronic dual-verification crossmatching, 24/7 cold-chain telemetry, and zero tolerance for transfusion mismatch."}
                  </p>
                </div>

                {/* Footer with Impact Metrics & Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-emerald-600 block">Zero Error</span>
                    <span className="text-slate-400 text-[10px]">-45% Darah Terbuang</span>
                  </div>
                  <Link
                    href="/modules/blood-bank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Detail Modul" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Inventory & Reagent Intelligence */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Mint/Green Canvas with Reagent Telemetry & Depletion */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#EDFAF2] via-[#F5FCF7] to-white border border-emerald-100/80 h-[215px] flex flex-col justify-between mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-slate-700 bg-white border border-slate-100 px-2 py-0.5 rounded shadow-2xs">
                        Smart Reagent Telemetry
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        Stok Aman
                      </span>
                    </div>

                    {/* Test-Driven Depletion Card */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Cobas Reagent Pack #L-902</span>
                        <span className="font-mono text-emerald-700 font-bold text-[11px]">82% Sisa</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[82%]" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Estimasi: 412 Tes Tersisa</span>
                        <span className="text-slate-700 font-semibold">On-Board: 18 Hari</span>
                      </div>
                    </div>

                    {/* Early Threshold Alert Pill */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-mono text-slate-600">
                      <span>Safety Stock Threshold: 15%</span>
                      <span className="text-[#2764B8] font-bold">PO Suggestion Aktif</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === "ID" ? "Logistik & Reagen" : "Logistics & Supply"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">MOD-03</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    Inventory &amp; Reagents
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Pengurangan stok otomatis berbasis jumlah tes mesin, alarm dini sebelum kehabisan di shift malam, dan analisis biaya per tes."
                      : "Real-time test-driven depletion tracking, proactive low-stock alerts before night shifts, and granular cost-per-test analytics."}
                  </p>
                </div>

                {/* Footer with Impact Metrics & Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-[#345DAB] block">0 Stockout</span>
                    <span className="text-slate-400 text-[10px]">20% Hemat Belanja</span>
                  </div>
                  <Link
                    href="/modules/inventory-reagent"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Detail Modul" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ROW 2: 2 BALANCED CARDS (Pathology Wide 7-col + Microbiology 5-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
              {/* Card 4: Anatomical Pathology (Wide 7-col) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: 2D Barcode Tracking & Synoptic Cancer Reporting */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#F6F9FD] via-[#FAFBFD] to-white border border-slate-200/80 mb-6 space-y-3.5">
                    {/* Top Bar with Status and Quick Pills */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-800">
                          {language === "ID" ? "Pelacakan Barcode 2D Kaset & Slide Biopsi" : "2D Barcode Biopsy Tracking"}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        WSI 40x Scanner Ready
                      </span>
                    </div>

                    {/* Specimen Chain Stages */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                        <span className="block font-bold text-slate-800 text-xs">Grossing</span>
                        <span className="text-slate-400 text-[10px]">Kaset A1-A4</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                        <span className="block font-bold text-slate-800 text-xs">Microtomy</span>
                        <span className="text-slate-400 text-[10px]">4 Slide Kaca</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 font-bold">
                        <span className="block text-xs">H&amp;E Stain</span>
                        <span className="text-emerald-600 text-[10px]">Slide Terverifikasi</span>
                      </div>
                    </div>

                    {/* Standardized Cancer Synoptic Staging Bar */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-700">
                        <QrCode className="h-3.5 w-3.5 text-[#2764B8]" />
                        <span>ICD-O-3: 8500/3 (Karsinoma Ductal Invasif)</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Bethesda Ready
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === "ID" ? "Instalasi Patologi Anatomi" : "Anatomical Pathology"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">MOD-04</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    Anatomical Pathology
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Pelacakan spesimen jaringan dari grossing hingga blok parafin dengan barcode mikro 2D anti-tertukar dan template pelaporan standar ICD-O dan Bethesda."
                      : "Strict specimen chain-of-custody across cassettes and slides with 2D micro-barcodes and structured synoptic cancer reporting templates."}
                  </p>
                </div>

                {/* Footer with Impact Metrics & Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-emerald-600 block">Zero Error Tertukar</span>
                    <span className="text-slate-400 text-[10px]">&lt; 1 Menit Temu Arsip Slide</span>
                  </div>
                  <Link
                    href="/modules/pathology"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Detail Modul" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 5: Microbiology & Stewardship (Compact 5-col) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Culture Incubation & AST Antibiogram */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAFBFD] to-white border border-slate-200/80 mb-6 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FlaskConical className="h-3.5 w-3.5 text-[#2764B8]" />
                        {language === "ID" ? "Kultur & Antibiogram CLSI" : "Culture & AST Panel"}
                      </span>
                      <span className="text-[10px] font-mono text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                        VITEK-2 Ingested
                      </span>
                    </div>

                    {/* AST Sensitivity Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-[11px] font-mono">
                      <div className="px-2.5 py-1.5 flex items-center justify-between">
                        <span className="font-bold text-slate-800">Vancomycin (MIC &le; 0.5)</span>
                        <span className="text-emerald-700 font-bold">SENSITIVE (S)</span>
                      </div>
                      <div className="px-2.5 py-1.5 flex items-center justify-between bg-red-50/50">
                        <span className="font-bold text-red-900">Cefoxitin / MRSA</span>
                        <span className="text-red-700 font-bold">RESISTANT (R)</span>
                      </div>
                    </div>

                    {/* MDRO Alert to Hospital PPRA Committee */}
                    <div className="flex items-center justify-between text-[10px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                      <span className="font-bold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        Alert MDRO / MRSA Terdeteksi
                      </span>
                      <span className="font-mono text-amber-700 font-bold">PPRA Sent</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">MOD-05</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    Microbiology &amp; PPRA
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Manajemen biakan kultur multi-hari, integrasi analyzer otomatis, dan pembentukan peta Antibiogram kumulatif berkala sesuai CLSI."
                      : "Culture incubation tracking, automated AST analyzer integration, and instant cumulative Antibiogram generation compliant with CLSI standards."}
                  </p>
                </div>

                {/* Footer with Impact Metrics & Link */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="font-bold text-[#345DAB] block">2x Lebih Cepat</span>
                    <span className="text-slate-400 text-[10px]">100% Kepatuhan PPRA</span>
                  </div>
                  <Link
                    href="/modules/microbiology"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Detail Modul" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ZERO DATA SILOS ARCHITECTURE (UNIFIED PATIENT CONVERGENCE)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="mb-3.5">
                  <SectionBadge variant="blue">
                    {language === "ID" ? "Arsitektur Tanpa Silo" : "Zero Data Silos"}
                  </SectionBadge>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
                  {language === "ID" ? (
                    <>Satu Pasien, Satu Basis Data Laboratorium Terpadu</>
                  ) : (
                    <>Single Patient ID, One Unified Laboratory Database</>
                  )}
                </h2>
                <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                  {language === "ID"
                    ? "Walaupun setiap modul menangani alur kerja departemen yang sangat spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu tanpa duplikasi."
                    : "Even with department-specific workflows, all data converges in a single Diagnova registry. Physicians review routine hematology, transfusion logs, and pathology reports in one seamless patient timeline."}
                </p>
              </div>

              {/* 3 Core Architectural Proof Points */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80">
                  <div className="h-8 w-8 rounded-xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shrink-0 mt-0.5">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === "ID" ? "Single Unified Patient Record" : "Single Patient Medical Record"}
                    </h4>
                    <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                      {language === "ID"
                        ? "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, ICU, dan poliklinik rawat jalan."
                        : "Zero duplicate patient records across central lab, ER, ICU, and outpatient clinics."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80">
                  <div className="h-8 w-8 rounded-xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === "ID" ? "Smart Gateway dengan Offline Buffer" : "Smart Gateway with Offline Buffer"}
                    </h4>
                    <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                      {language === "ID"
                        ? "Satu pintu komunikasi untuk seluruh instrumen dengan buffer data lokal agar tes tidak terhenti saat koneksi drop."
                        : "Unified communication gateway with local offline buffers ensuring uninterrupted laboratory testing."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {language === "ID" ? "Jejak Audit Digital KARS & ISO 15189" : "Immutable Regulatory Audit Trail"}
                    </h4>
                    <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                      {language === "ID"
                        ? "Riwayat waktu verifikasi, tanda tangan elektronik DPJP, dan log instrumen siap diuji asesor akreditasi."
                        : "Automated digital timestamps, electronic signatures, and audit trails ready for KARS and ISO surveys."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Unified Patient Data Convergence Station */}
            <div className="lg:col-span-7 relative">
              <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(31,45,93,0.14)] overflow-hidden">
                {/* Titlebar */}
                <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                      #RM-90822 • Rekam Lab Terpadu
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    5 MODUL SINKRON
                  </span>
                </div>

                {/* Patient Header */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-slate-900">Ny. Aminah Salim (52 Th / P)</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-[#2764B8]">
                          Rawat Inap Bed 302
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">DPJP: dr. Budiarto, Sp.PD-KKV • Penjamin: BPJS</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      ID Pasien Tunggal
                    </span>
                  </div>

                  {/* 4 Connected Module Live Streams */}
                  <div className="space-y-2.5 text-xs font-mono">
                    {/* Stream 1: Routine Hematology */}
                    <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Activity className="h-4 w-4 text-[#2764B8] shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Modul 1: Hematologi Rutin</span>
                          <span className="text-[10px] text-slate-500">Hb: 10.2 g/dL • Leukosit: 11.400 /uL</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Hasil Terbit (14m)
                      </span>
                    </div>

                    {/* Stream 2: Blood Bank BDRS */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <HeartPulse className="h-4 w-4 text-rose-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Modul 2: Bank Darah (BDRS)</span>
                          <span className="text-[10px] text-slate-500">PRC Golongan B+ • 2 Kantong Terverifikasi</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Crossmatch Valid
                      </span>
                    </div>

                    {/* Stream 3: Anatomical Pathology */}
                    <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Microscope className="h-4 w-4 text-[#2764B8] shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Modul 4: Patologi Anatomi</span>
                          <span className="text-[10px] text-slate-500">Biopsi Jaringan #PA-24-0982 • Kaset A1</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Slide Grossing
                      </span>
                    </div>

                    {/* Stream 4: Microbiology */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FlaskConical className="h-4 w-4 text-teal-700 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 block">Modul 5: Mikrobiologi &amp; PPRA</span>
                          <span className="text-[10px] text-slate-500">Kultur Darah BACTEC • Inkubasi Hari ke-2</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Inkubasi Berjalan
                      </span>
                    </div>
                  </div>

                  {/* Console Bottom Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      HL7 v2.5 / FHIR Sinkron Real-Time
                    </span>
                    <span className="text-[#2764B8] font-semibold">UU Kes No. 17/2023 Valid</span>
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
