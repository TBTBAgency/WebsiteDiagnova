"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Clock,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Network,
  QrCode,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [activeDirectoryIndex, setActiveDirectoryIndex] = useState<number>(0);

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = modules.findIndex((m) => m.id === hash);
        if (foundIndex !== -1) {
          setSelectedModule(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const modules = [
    {
      id: "routine-hematology",
      icon: Activity,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      tabLabel: language === "ID" ? "Rutin & Hematologi" : "Routine & Hematology",
      targetDept:
        language === "ID"
          ? "Patologi Klinik & Hematologi"
          : "Clinical Pathology & Hematology",
      name: "Routine & Hematology",
      tagline:
        language === "ID"
          ? "Otomasi Pemeriksaan Darah & Kimia Klinik Bervolume Tinggi"
          : "High-Throughput Blood & Clinical Chemistry Automation",
      description:
        language === "ID"
          ? "Menghubungkan instrumen analyzer hematologi dan kimia klinik secara langsung. Order dokter otomatis berubah menjadi worklist mesin, dan hasil diverifikasi tanpa entri data manual."
          : "Directly connects hematology and clinical chemistry analyzers. Physician orders instantly populate machine worklists, and results are verified with zero manual entry.",
      highlights: [
        {
          title: language === "ID" ? "Interfacing Analyzer ASTM/HL7" : "Bidirectional ASTM/HL7",
          desc: language === "ID" ? "Tarik hasil otomatis dari 200+ jenis analyzer tanpa middleware pihak ketiga." : "Direct result capture from 200+ analyzer models with no extra middleware.",
        },
        {
          title: language === "ID" ? "Pengecekan Delta & Panic Value" : "Delta Check & Panic Alert",
          desc: language === "ID" ? "Mendeteksi lonjakan nilai abnormal antar-kunjungan dan memberi peringatan seketika." : "Flags longitudinal biomarker shifts and alerts physicians in real time.",
        },
        {
          title: language === "ID" ? "Quality Control Levey-Jennings" : "Levey-Jennings QC Rules",
          desc: language === "ID" ? "Pemantauan kontrol kualitas internal dengan Westgard rules otomatis." : "Automated internal quality control charts following Westgard rules.",
        },
      ],
      metrics: [
        { val: "-70%", label: language === "ID" ? "Turnaround Time (TAT)" : "Turnaround Time (TAT)" },
        { val: "0 Error", label: language === "ID" ? "Salah Ketik Nilai" : "Manual Typing Error" },
      ],
      previewDetails: {
        system: "Sysmex XN / Roche Cobas Direct Link",
        status: language === "ID" ? "Worklist Aktif • 1.240 Sampel/Hari" : "Worklist Active • 1,240 Samples/Day",
        badge: "ASTM E1381",
        pills: ["Auto-Verification", "Delta Check", "Westgard QC"],
      },
    },
    {
      id: "blood-bank",
      icon: HeartPulse,
      color: "#E11D48",
      accentBg: "bg-rose-50 text-rose-600 border-rose-200/60",
      tabLabel: language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank (BDRS)",
      targetDept:
        language === "ID"
          ? "Bank Darah Rumah Sakit (BDRS) & UTD"
          : "Hospital Blood Bank & Transfusion Unit",
      name: "Blood Bank Management",
      tagline:
        language === "ID"
          ? "Transfusi Aman dengan Kontrol Rantai Dingin & Uji Silang Serasi"
          : "Safe Transfusion with Cold-Chain Telemetry & Crossmatching",
      description:
        language === "ID"
          ? "Melacak siklus kantong darah dari penerimaan donor hingga transfusi ke pasien. Menghilangkan risiko inkompatibilitas ABO/Rh dengan verifikasi ganda dan memantau masa simpan FEFO."
          : "Tracks blood bags from donation receipt to patient bedside transfusion. Prevents ABO/Rh incompatibility via dual verification and minimizes wastage with FEFO inventory.",
      highlights: [
        {
          title: language === "ID" ? "Verifikasi Uji Silang Serasi" : "Electronic Crossmatching",
          desc: language === "ID" ? "Validasi ganda hasil uji cocok serasi sebelum darah dikeluarkan ke bangsal." : "Dual-verification crossmatching protocol before blood release to wards.",
        },
        {
          title: language === "ID" ? "Pemantauan Rantai Dingin 24/7" : "24/7 Cold-Chain Telemetry",
          desc: language === "ID" ? "Log suhu penyimpanan 2°C - 6°C terpantau otomatis untuk menjaga kualitas darah." : "Automated 2°C - 6°C temperature logging ensuring blood component integrity.",
        },
        {
          title: language === "ID" ? "Pelabelan Standar ISBT 128" : "ISBT 128 Bag Tracking",
          desc: language === "ID" ? "Barcode kantong terstandar internasional, mencegah darah tertukar." : "International barcoding standard for seamless traceability and zero mix-ups.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Inkompatibilitas Darah" : "Transfusion Mismatch" },
        { val: "-45%", label: language === "ID" ? "Darah Kedaluwarsa Terbuang" : "Expired Blood Wastage" },
      ],
      previewDetails: {
        system: "ISBT 128 Blood Inventory Engine",
        status: language === "ID" ? "Cold Storage: 4.1°C (Optimal) • PRC / TC / FFP" : "Cold Storage: 4.1°C (Optimal) • PRC / TC / FFP",
        badge: "ISBT 128",
        pills: ["Crossmatch Mayor/Minor", "FEFO Rotation", "Cold Telemetry"],
      },
    },
    {
      id: "inventory-reagent",
      icon: PackageCheck,
      color: "#0284C7",
      accentBg: "bg-sky-50 text-sky-600 border-sky-200/60",
      tabLabel: language === "ID" ? "Inventaris & Reagen" : "Inventory & Reagent",
      targetDept:
        language === "ID"
          ? "Logistik & Pengadaan Reagen Medis"
          : "Laboratory Logistics & Reagent Supply",
      name: "Inventory & Reagent Intelligence",
      tagline:
        language === "ID"
          ? "Stok Reagen Selalu Terpantau, Tanpa Kehabisan di Tengah Shift"
          : "Real-Time Reagent Telemetry, Zero Mid-Shift Stockouts",
      description:
        language === "ID"
          ? "Mengurangi stok reagen secara otomatis setiap kali instrumen selesai menjalankan tes. Memberikan alarm stok menipis sebelum habis dan melacak tanggal kedaluwarsa secara presisi."
          : "Depletes reagent volumes automatically as tests complete on analyzers. Issues early warnings before shortages occur and tracks lot numbers and open-vial stability.",
      highlights: [
        {
          title: language === "ID" ? "Pengurangan Stok Otomatis" : "Test-Driven Depletion",
          desc: language === "ID" ? "Sisa reagen terpotong proporsional dengan jumlah tes yang dilaporkan mesin." : "Reagent volume auto-deducted directly from reported analyzer test counts.",
        },
        {
          title: language === "ID" ? "Alarm Stok Menipis (Threshold)" : "Low-Stock Early Warning",
          desc: language === "ID" ? "Notifikasi proaktif sebelum stok kritis agar shift malam berjalan lancar." : "Proactive alerts ahead of critical thresholds to protect overnight shifts.",
        },
        {
          title: language === "ID" ? "Kalkulasi Biaya per Tes" : "Cost-per-Test Analytics",
          desc: language === "ID" ? "Analitik biaya bahan habis pakai yang transparan untuk efisiensi anggaran lab." : "Granular operational cost analytics to optimize lab procurement budget.",
        },
      ],
      metrics: [
        { val: language === "ID" ? "0 Kali" : "0 Stockouts", label: language === "ID" ? "Kehabisan Reagen di Shift" : "Mid-Shift Stockout" },
        { val: "20%", label: language === "ID" ? "Penghematan Belanja Reagen" : "Procurement Savings" },
      ],
      previewDetails: {
        system: "Smart Reagent Telemetry & Lot Control",
        status: language === "ID" ? "Kalkulasi Otomatis Aktif • Gudang & Kulkas Satelit" : "Auto-Depletion Active • Central & Satellites",
        badge: "Cost Analytics",
        pills: ["Open-Vial Stability", "Safety Threshold", "PO Suggestion"],
      },
    },
    {
      id: "pathology",
      icon: Microscope,
      color: "#345DAB",
      accentBg: "bg-blue-50 text-[#345DAB] border-blue-200/60",
      tabLabel: language === "ID" ? "Patologi Anatomi" : "Anatomical Pathology",
      targetDept:
        language === "ID"
          ? "Instalasi Patologi Anatomi & Sitologi"
          : "Anatomical Pathology & Cytology",
      name: "Anatomical Pathology",
      tagline:
        language === "ID"
          ? "Pelacakan Barcode 2D pada Kaset Jaringan & Laporan Terstruktur"
          : "2D Barcode Tissue Tracking & Standardized Synoptic Reporting",
      description:
        language === "ID"
          ? "Mencegah tertukarnya spesimen biopsi jaringan dengan barcode mikro 2D pada setiap kaset dan slide kaca. Mendukung dokter spesialis patologi menyusun diagnosa terstandar ICD-O dan Bethesda."
          : "Eliminates tissue mix-ups using 2D micro-barcodes across cassettes and glass slides. Supports pathologists with standardized ICD-O and Bethesda synoptic reporting.",
      highlights: [
        {
          title: language === "ID" ? "Pelacakan Kaset & Slide Kaca" : "Cassette & Slide Barcoding",
          desc: language === "ID" ? "Jejak spesimen mulai dari makroskopi, pemotongan, hingga pengecatan HE." : "Strict specimen chain-of-custody from grossing, microtomy, to HE staining.",
        },
        {
          title: language === "ID" ? "Template ICD-O & Bethesda" : "Structured Synoptic Templates",
          desc: language === "ID" ? "Format pelaporan baku internasional untuk histopatologi dan sitologi." : "Standardized reporting formats for histopathology and fine needle cytology.",
        },
        {
          title: language === "ID" ? "Pencarian Arsip Blok Cepat" : "Instant Archival Retrieval",
          desc: language === "ID" ? "Akses riwayat biopsi pasien sebelumnya dalam hitungan detik untuk perbandingan." : "Instant access to prior biopsy history for comparative diagnostic review.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Spesimen Tertukar" : "Specimen Mix-up" },
        { val: language === "ID" ? "< 1 Menit" : "< 1 Min", label: language === "ID" ? "Pencarian Arsip Blok/Slide" : "Archive Retrieval" },
      ],
      previewDetails: {
        system: "Histopathology & Cytology Workflow Engine",
        status: language === "ID" ? "2D Barcode Tracking • Integrasi Foto Mikroskop" : "2D Barcode Tracking • Digital Imaging Ready",
        badge: "ICD-O / Bethesda",
        pills: ["Grossing Tracking", "Synoptic Reporting", "Block Archive"],
      },
    },
    {
      id: "microbiology",
      icon: FlaskConical,
      color: "#0D9488",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200/60",
      tabLabel: language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology & PPRA",
      targetDept:
        language === "ID"
          ? "Mikrobiologi Klinik & Komite PPRA"
          : "Clinical Microbiology & Stewardship",
      name: "Microbiology & Antibiotic Stewardship",
      tagline:
        language === "ID"
          ? "Kultur Bakteri, Uji Sensitivitas & Peta Antibiogram Rumah Sakit"
          : "Culture Incubation, Susceptibility Testing & Antibiogram Matrix",
      description:
        language === "ID"
          ? "Mengelola inkubasi kultur bakteri, membaca zona hambat antibiotik dengan pedoman CLSI/EUCAST, dan menghasilkan grafik Antibiogram kumulatif berkala untuk mendukung Program PPRA rumah sakit."
          : "Manages bacterial culture incubation, interprets AST panels under CLSI/EUCAST rules, and compiles automated cumulative hospital Antibiograms for antibiotic stewardship.",
      highlights: [
        {
          title: language === "ID" ? "Pembangkit Antibiogram Otomatis" : "Cumulative Antibiogram Engine",
          desc: language === "ID" ? "Peta pola resistensi kuman rumah sakit yang diperbarui secara otomatis." : "Automated pathogen resistance pattern mapping across inpatient wards.",
        },
        {
          title: language === "ID" ? "Peringatan Dini Kuman Resisten" : "MDRO / ESBL Early Alert",
          desc: language === "ID" ? "Peringatan seketika saat terdeteksi kuman multiresisten (MRSA, ESBL, CRE)." : "Instant notification upon detection of multi-drug resistant pathogens.",
        },
        {
          title: language === "ID" ? "Integrasi Mesin Kultur Otomatis" : "Automated Culture Integration",
          desc: language === "ID" ? "Terhubung ke instrumen identifikasi kuman terkemuka (VITEK, BACTEC, Phoenix)." : "Direct interfacing to leading automated ID/AST instruments (VITEK, Phoenix).",
        },
      ],
      metrics: [
        { val: language === "ID" ? "2x Cepat" : "2x Faster", label: language === "ID" ? "Rekomendasi Terapi Tepat" : "Definitive Therapy Speed" },
        { val: "100%", label: language === "ID" ? "Kepatuhan PPRA Kemenkes" : "Stewardship Compliance" },
      ],
      previewDetails: {
        system: "Automated AST & Stewardship Matrix",
        status: language === "ID" ? "Inkubasi Terpantau • Aturan Interpretasi CLSI 2024" : "Incubation Tracked • CLSI 2024 Guidelines",
        badge: "CLSI / EUCAST",
        pills: ["Antibiogram Matrix", "MDRO Alert", "Rational Rx Engine"],
      },
    },
  ];

  const current = modules[selectedModule];
  const CurrentIcon = current.icon;
  const activeDirectoryModule = modules[activeDirectoryIndex];
  const ActiveDirectoryIcon = activeDirectoryModule.icon;

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Modul Terintegrasi Diagnova" : "Diagnova Modular Suite"}
        title={
          language === "ID" ? (
            <>
              Modul Spesialisasi yang{" "}
              <br className="hidden sm:inline" />
              Saling Terhubung Tanpa Hambatan
            </>
          ) : (
            <>
              Connected Modules for{" "}
              <br className="hidden sm:inline" />
              Specialized Laboratory Care
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Aktifkan modul sesuai kebutuhan faskes Anda atau jalankan sebagai satu kesatuan. Seluruh data pasien, sampel, dan hasil mengalir dalam satu sistem yang aman dan siap akreditasi."
            : "Deploy individual modules or run the complete unified suite. All patient data, specimens, and analyzer results converge in a secure, accreditation-ready environment."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Modul" : "Schedule Module Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Eksplorasi 5 Modul" : "Explore 5 Modules",
          href: "#modules-explorer",
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
            value: "0 Error",
            label: language === "ID" ? "Salah Identifikasi" : "Zero Sample Mix-ups",
            sub: language === "ID" ? "Barcode 2D & delta-check" : "2D micro-barcode tracking",
          },
          {
            value: "Plug & Play",
            label: language === "ID" ? "Aktivasi Modular" : "Modular Activation",
            sub: language === "ID" ? "Bebas tambah modul bertahap" : "Deploy on-demand per dept",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE MODULE EXPLORER (FOCUS ON UX & SCANNABILITY)
          ══════════════════════════════════════════════════════════════ */}
      <section id="modules-explorer" className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {language === "ID" ? "Pilih dan Pelajari Setiap Modul" : "Explore Each Module"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              {language === "ID"
                ? "Klik modul di bawah untuk melihat ringkasan fungsi, kapabilitas klinis, dan dampaknya pada operasional laboratorium Anda."
                : "Click any module below to review core capabilities, workflow integrations, and clinical outcomes."}
            </p>
          </div>

          {/* 5 Clean Tab Selector Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              const isActive = selectedModule === idx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModule(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-[#F8FBFE] text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#2764B8]")} />
                  <span>{m.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Master Detail Focus Showcase Card */}
          <div className="rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F5F8FC] via-white to-[#F8FBFE] border border-slate-200/90 p-8 sm:p-10 lg:p-14 shadow-sm transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: Clear Scannable Facts */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  {/* Icon Box Konsisten Diagnova */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                      <CurrentIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                      {current.targetDept}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                    {current.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-[#345DAB]">
                    {current.tagline}
                  </p>
                  <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </div>

                {/* 3 Core Highlights (Easily Scannable) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {language === "ID" ? "Kapabilitas Utama:" : "Core Capabilities:"}
                  </h4>
                  <div className="space-y-2.5">
                    {current.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">
                            {h.title}
                          </p>
                          <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action with continuous shine */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/request-demo"
                    className="group relative inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-7 py-3.5 text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
                  >
                    <span className="animate-shine-continuous" />
                    <span className="relative z-10">{language === "ID" ? "Minta Demo Modul Ini" : "Request Module Demo"}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={`#${current.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-[#2764B8] transition-colors"
                  >
                    {language === "ID" ? "Lihat Posisi di Katalog ↓" : "View in Catalog ↓"}
                  </a>
                </div>
              </div>

              {/* Right Column: Clean High-Fidelity Software Preview Card */}
              <div className="lg:col-span-5 rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">Diagnova LIS Station</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/60 text-[#2764B8] font-bold">
                    {current.previewDetails.badge}
                  </span>
                </div>

                {/* System Status Strip */}
                <div className="p-4 rounded-2xl bg-[#F8FBFE] border border-blue-100/70">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>{language === "ID" ? "STATUS MODUL" : "MODULE STATUS"}</span>
                    <span className="text-emerald-700 font-bold">● Connected</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {current.previewDetails.system}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {current.previewDetails.status}
                  </p>
                </div>

                {/* Impact Metrics (Large, Legible) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {current.metrics.map((m, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                      <span className="font-display text-2xl font-bold text-[#345DAB] block tracking-tight">
                        {m.val}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 block mt-1 leading-snug">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                  {current.previewDetails.pills.map((pill, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200/70 px-3 py-1 rounded-full"
                    >
                      ✓ {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MODULE DIRECTORY: IN-PAGE INFRASTRUCTURE ARCHITECTURE
          (2-Column Layout with Vertical Timeline & Signature Chamfered Cards)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="module-directory"
        className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 scroll-mt-24"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* ═══ LEFT COLUMN: Sticky / Clean Overview + Active Details ═══ */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div>
                <div className="mb-3.5 sm:mb-4">
                  <SectionBadge variant="blue">
                    {language === "ID" ? "Direktori Modul" : "Module Directory"}
                  </SectionBadge>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] font-bold leading-[1.18] tracking-tight text-[#2A5298]">
                  {language === "ID"
                    ? "Daftar Lengkap 5 Modul Spesialisasi Laboratorium"
                    : "Complete Suite of 5 Laboratory Modules"}
                </h2>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Pilih modul di samping untuk melihat kapabilitas teknis, standar interfacing alat, dan jaminan kepatuhan akreditasi rumah sakit."
                    : "Select any module to review technical capabilities, direct instrument interfacing, and accreditation readiness."}
                </p>
              </div>

              {/* Active Module Live Info Box */}
              <div className="p-5 sm:p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {activeDirectoryModule.targetDept}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#2764B8] font-bold border border-blue-200/60">
                    MOD-0{activeDirectoryIndex + 1}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {activeDirectoryModule.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#2764B8] font-medium mt-1">
                    {activeDirectoryModule.tagline}
                  </p>
                </div>

                {/* 2 Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {activeDirectoryModule.metrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/70">
                      <span className="font-display text-lg font-bold text-[#345DAB] block">
                        {m.val}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link to Slug Page */}
                <div className="pt-2">
                  <Link
                    href={`/modules/${activeDirectoryModule.id}`}
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white py-2.5 px-4 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>{language === "ID" ? "Buka Dokumentasi Lengkap" : "View Full Specifications"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT COLUMN: Vertical Timeline + 5 Signature Chamfered Cards ═══ */}
            <div className="lg:col-span-7 relative flex items-stretch gap-4 sm:gap-6 lg:gap-7">
              {/* Vertical Timeline Track */}
              <div className="relative w-6 sm:w-8 flex justify-center flex-shrink-0 self-stretch">
                <div className="absolute top-4 bottom-4 w-[2px] bg-slate-200/90 rounded-full overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-b from-[#2A66CC] to-[#4EA1F0] rounded-full transition-all duration-500"
                    style={{
                      height: `${((activeDirectoryIndex + 1) / modules.length) * 100}%`,
                    }}
                  />
                </div>

                {/* 5 Timeline Dots */}
                {modules.map((m, idx) => {
                  const isActive = activeDirectoryIndex === idx;
                  const isPassed = activeDirectoryIndex >= idx;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveDirectoryIndex(idx)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center focus:outline-none cursor-pointer group"
                      style={{
                        left: "50%",
                        top: `${(idx / (modules.length - 1)) * 92 + 4}%`,
                      }}
                      aria-label={`Pilih ${m.name}`}
                    >
                      {/* Glowing Halo on Active */}
                      <span
                        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                          isActive
                            ? "ring-4 ring-[#93C5FD]/70 shadow-[0_0_16px_rgba(42,102,204,0.6)] scale-125 animate-pulse"
                            : "ring-0 scale-100"
                        }`}
                      />
                      <span
                        className={`relative rounded-full transition-all duration-500 ${
                          isActive
                            ? "h-4 w-4 bg-[#2A66CC] z-20"
                            : isPassed
                            ? "h-3 w-3 bg-[#2A66CC] z-10"
                            : "h-2.5 w-2.5 bg-[#CBD5E1] z-10 group-hover:bg-slate-400"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* 5 Stacked Chamfered Cards */}
              <div className="flex-1 flex flex-col gap-3.5 sm:gap-4 lg:gap-5">
                {modules.map((card, idx) => {
                  const Icon = card.icon;
                  const isActive = activeDirectoryIndex === idx;

                  return (
                    <div
                      key={card.id}
                      id={card.id}
                      onClick={() => setActiveDirectoryIndex(idx)}
                      className={`relative cursor-pointer transition-all duration-500 ease-in-out select-text gpu-layer ${
                        isActive
                          ? "drop-shadow-[0_18px_32px_rgba(46,104,180,0.26)] -translate-y-1"
                          : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                      }`}
                    >
                      <div
                        className="relative overflow-hidden rounded-tl-[24px] sm:rounded-tl-[32px] rounded-br-[24px] sm:rounded-br-[32px]"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
                        }}
                      >
                        {/* Layer 1: Inactive Base Card Background */}
                        <div className="absolute inset-0 bg-white border border-slate-200/90 shadow-sm" />

                        {/* Layer 2: Active Card Blue Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br from-[#275EA8] via-[#2E68B4] to-[#1C478B] transition-opacity duration-500 ease-in-out pointer-events-none ${
                            isActive ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#56ADE2]/25 blur-[50px]" />
                          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#1C478B]/40 blur-[50px]" />
                        </div>

                        {/* Layer 3: Unified Text Content */}
                        <div className="relative z-10 p-5 sm:p-6 lg:p-7">
                          <div className="flex items-center justify-between gap-3 mb-2.5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center rounded-xl p-2 sm:p-2.5 transition-all duration-500 shrink-0 ${
                                  isActive
                                    ? "bg-white/20 text-white shadow-inner"
                                    : "bg-[#275EA8]/10 text-[#275EA8]"
                                }`}
                              >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              </div>
                              <div>
                                <span
                                  className={`text-[10px] font-mono uppercase tracking-wider block transition-colors duration-500 ${
                                    isActive ? "text-blue-200" : "text-slate-400 font-semibold"
                                  }`}
                                >
                                  MOD-0{idx + 1} • {card.targetDept}
                                </span>
                                <h3
                                  className={`font-semibold text-base sm:text-lg leading-snug tracking-tight transition-colors duration-500 ${
                                    isActive ? "text-white" : "text-slate-800"
                                  }`}
                                >
                                  {card.name}
                                </h3>
                              </div>
                            </div>

                            <span
                              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full transition-colors duration-500 shrink-0 ${
                                isActive
                                  ? "bg-white/20 text-white border border-white/20"
                                  : "bg-blue-50 text-[#2764B8] border border-blue-200/60"
                              }`}
                            >
                              {card.metrics[0]?.val}
                            </span>
                          </div>

                          <p
                            className={`text-xs sm:text-sm leading-relaxed transition-colors duration-500 mb-3 ${
                              isActive ? "text-white/90" : "text-slate-600 font-normal"
                            }`}
                          >
                            {card.description}
                          </p>

                          {/* Quick Highlight Pills */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/30">
                            {card.highlights.slice(0, 2).map((h, hIdx) => (
                              <span
                                key={hIdx}
                                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors duration-500 ${
                                  isActive
                                    ? "bg-white/15 text-white/95"
                                    : "bg-slate-50 text-slate-700 border border-slate-200/60"
                                }`}
                              >
                                ✓ {h.title}
                              </span>
                            ))}
                            <Link
                              href={`/modules/${card.id}`}
                              className={`ml-auto text-xs font-semibold inline-flex items-center gap-1 transition-colors duration-500 ${
                                isActive ? "text-blue-100 hover:text-white" : "text-[#2764B8] hover:text-[#1E5299]"
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{language === "ID" ? "Spesifikasi" : "Specs"}</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ARCHITECTURE (UNIFIED DATA, NO SILOS)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Arsitektur Tanpa Silo" : "Zero Data Silos"}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2]">
                {language === "ID" ? (
                  <>Satu Pasien, Satu Basis Data Laboratorium Terpadu</>
                ) : (
                  <>Single Patient ID, One Unified Laboratory Database</>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {language === "ID"
                  ? "Walaupun setiap modul menangani alur kerja spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu."
                  : "Even with department-specific workflows, all data converges in a single Diagnova registry. Physicians review routine hematology, transfusion logs, and pathology reports in one seamless patient timeline."}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-6 rounded-[24px] bg-[#F8FBFE] border border-blue-100/80 space-y-3">
                <Database className="h-6 w-6 text-[#2764B8]" />
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Single Medical Record" : "Single Patient Record"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, dan poliklinik."
                    : "Zero duplicate patient records across central lab, ER, and outpatient clinics."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#F8FBFE] border border-blue-100/80 space-y-3">
                <Cpu className="h-6 w-6 text-[#2764B8]" />
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Smart Gateway" : "Smart Gateway"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Satu pintu komunikasi untuk seluruh instrumen analyzer dengan buffer offline."
                    : "Unified communication gateway with offline buffer for uninterrupted testing."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-[#F8FBFE] border border-blue-100/80 space-y-3">
                <FileCheck2 className="h-6 w-6 text-[#2764B8]" />
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Kepatuhan KARS & ISO" : "Regulatory Compliance"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Jejak audit digital otomatis siap diuji oleh asesor akreditasi setiap saat."
                    : "Immutable digital audit trail ready for KARS, JCI, and ISO 15189 surveys."}
                </p>
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
