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
  Zap,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<number>(0);

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
          MODULE DIRECTORY: KRESNA-STYLE HIGH-IMPACT WORKFLOW SHOWCASE
          Text on Top, Floating Micro-UI on Bottom, Asymmetric Grid
          ══════════════════════════════════════════════════════════════ */}
      <section id="modules-directory" className="w-full bg-[#FBFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* 2-Column Header (Matching Kresna Reference Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-12 sm:mb-16">
            <div className="lg:col-span-7 space-y-2.5">
              <span className="font-serif italic text-lg sm:text-xl text-slate-400 block tracking-wide">
                {language === "ID" ? "Katalog & Arsitektur Modul" : "Specialized Module Directory"}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.12]">
                {language === "ID" ? (
                  <>
                    Otomasi Klinis Terpadu.
                    <br />
                    Untuk Seluruh Instalasi Lab.
                  </>
                ) : (
                  <>
                    Unified Clinical Automation.
                    <br />
                    Across Every Laboratory Dept.
                  </>
                )}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
                {language === "ID"
                  ? "Diagnova mengotomasi setiap alur kerja diagnostik dari pre-analitik hingga pasca-analitik — interfacing instrumen langsung, pelacakan spesimen ber-barcode 2D, kontrol rantai dingin darah, hingga deteksi pola kuman kumulatif."
                  : "Diagnova automates repetitive, high-stakes diagnostic workflows from pre-analytical intake to final delivery — direct instrument links, 2D specimen tracking, cold-chain blood banking, and automated cumulative antibiograms."}
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ASYMMETRIC CARD GRID (KRESNA DESIGN ARCHITECTURE)
              Row 1: 7-col + 5-col
              Row 2: 5-col + 7-col
              Row 3: 12-col Full Panoramic
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-8">
            {/* ROW 1: Smart Workflow Automation (7-col) & Cold-Chain Telemetry (5-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Card 1: Routine & Hematology - Node Workflow Tree (7 cols) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-[#F4F5F7] border border-slate-200/70 p-7 sm:p-9 lg:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 shadow-2xs">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    {language === "ID" ? "Otomasi Alur Kerja Hematologi & Rutin" : "Smart Workflow Automation"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-xl">
                    {language === "ID"
                      ? "Interfacing analyzer ASTM/HL7 langsung, validasi otomatis aturan Westgard, dan penarikan hasil instan tanpa perantara middleware pihak ketiga."
                      : "Direct ASTM/HL7 analyzer links, automated Westgard rule verification, and instant zero-middleware specimen capture."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Clean Floating Diagram on Neutral Canvas (Matching Kresna Card 1) */}
                <div className="h-[220px] sm:h-[240px] w-full flex items-center justify-center relative overflow-hidden">
                  <div className="flex items-center justify-between w-full max-w-xl gap-2 sm:gap-4 relative z-10 px-1 sm:px-2">
                    {/* Left Node: Brand Blue Logo Box */}
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#2764B8] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(39,100,184,0.28)] shrink-0 transition-transform group-hover:scale-105 duration-300">
                      <Activity className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>

                    {/* SVG Branching Lines (Connecting Left to Middle Nodes) */}
                    <svg className="hidden sm:block w-12 h-24 shrink-0 overflow-visible text-slate-300" viewBox="0 0 48 96" fill="none">
                      <path d="M0 48 C20 48 20 20 48 20" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M0 48 C20 48 20 76 48 76" stroke="currentColor" strokeWidth="1.5" />
                    </svg>

                    {/* Middle Two Process Nodes */}
                    <div className="flex-1 flex flex-col justify-between gap-3.5 min-w-[150px] sm:min-w-[175px]">
                      {/* Node Top: Analyzer Link */}
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800 transition-all hover:shadow-md">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-50" />
                        <span className="truncate text-[11px] sm:text-xs">Sysmex &amp; Cobas Direct</span>
                      </div>

                      {/* Node Bottom: Delta Check Alert */}
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800 transition-all hover:shadow-md">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 ring-4 ring-amber-50" />
                        <span className="truncate text-[11px] sm:text-xs">Delta-Check (+115% Shift)</span>
                      </div>
                    </div>

                    {/* SVG Converging Line to Right Card */}
                    <svg className="hidden sm:block w-10 h-10 shrink-0 overflow-visible text-slate-300" viewBox="0 0 40 40" fill="none">
                      <path d="M0 20 H40" stroke="currentColor" strokeWidth="1.5" />
                    </svg>

                    {/* Right Target Task Card (matching Kresna's right schedule card) */}
                    <div className="w-[180px] sm:w-[220px] rounded-2xl bg-white border border-slate-200/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-2.5 text-[11px] font-mono shrink-0">
                      <div className="border-l-2 border-[#2764B8] pl-2.5">
                        <span className="font-bold text-slate-900 block truncate text-[11px]">Tarik Hasil ASTM</span>
                        <span className="text-slate-400 text-[10px]">07:50 WIB • 14 Param</span>
                      </div>
                      <div className="border-l-2 border-slate-200 pl-2.5">
                        <span className="font-bold text-slate-700 block truncate text-[11px]">Validasi Westgard QC</span>
                        <span className="text-slate-400 text-[10px]">07:54 WIB • L-J Normal</span>
                      </div>
                      <div className="border-l-2 border-emerald-500 pl-2.5">
                        <span className="font-bold text-emerald-700 block truncate text-[11px]">Masuk ke SIMRS</span>
                        <span className="text-emerald-600 text-[10px]">07:58 WIB • Terbit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Blood Bank - Cold-Chain Telemetry Peek (5 cols) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-[#F4F5F7] border border-slate-200/70 p-7 sm:p-9 lg:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 shadow-2xs">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    {language === "ID" ? "Telemetri Rantai Dingin & BDRS" : "Cold-Chain & Transfusion Safety"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-sm">
                    {language === "ID"
                      ? "Monitoring suhu kulkas darah 24/7 dan uji silang serasi digital Mayor/Minor ISBT-128."
                      : "24/7 blood storage telemetry and digital dual-verification electronic crossmatching."}
                  </p>
                </div>

                {/* Bottom Visual Stage: App Window Peek with Floating Stat & Area Wave Chart (matching Kresna Card 2) */}
                <div className="h-[220px] sm:h-[240px] w-full flex flex-col justify-between relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.05)] pt-3 px-4 pb-0">
                  {/* Top Window Bar (Kresna App Bar) */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <HeartPulse className="h-4 w-4 text-rose-500" />
                      <span>Diagnova BDRS Station</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-slate-200 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-200 inline-block" />
                      <span className="h-2 w-2 rounded-full bg-slate-200 inline-block" />
                    </div>
                  </div>

                  {/* Floating Stat Card with clean shadow */}
                  <div className="relative z-10 mx-auto w-full max-w-[240px] p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_32px_rgba(31,45,93,0.09)] space-y-1 text-center -mt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                      Suhu Kulkas BDRS 24/7
                    </span>
                    <div className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                      3.8°C
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Rentang Aman (2°C - 6°C)
                    </span>
                  </div>

                  {/* Soft Background Wave Chart (matching Kresna Card 2) */}
                  <div className="h-16 w-full -mx-4 overflow-hidden relative">
                    <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="coldWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2764B8" stopOpacity="0.30" />
                          <stop offset="100%" stopColor="#2764B8" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d="M0,45 Q100,35 200,42 T400,38 L400,80 L0,80 Z" fill="url(#coldWaveGrad)" />
                      <path d="M0,45 Q100,35 200,42 T400,38" fill="none" stroke="#2764B8" strokeWidth="2.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Reagents Intelligence (5-col) & 2D Specimen Tracking (7-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Card 3: Inventory & Reagents - Dashboard Usage Bars (5 cols) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-[#F4F5F7] border border-slate-200/70 p-7 sm:p-9 lg:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 shadow-2xs">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    {language === "ID" ? "Telemetri Reagen & Biaya Tes" : "Reagent & Supply Intelligence"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-sm">
                    {language === "ID"
                      ? "Pengurangan stok otomatis berbasis jumlah tes dan peringatan dini sebelum stok menipis."
                      : "Test-driven auto-depletion tracking and proactive safety threshold warnings."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Dashboard Window Peek with Bar Chart (matching Kresna Card 3) */}
                <div className="h-[220px] sm:h-[240px] w-full flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.05)] p-4 sm:p-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <span className="text-xs font-bold text-slate-800 ml-1">Reagent Inventory</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
                      Stok On-Board: 82%
                    </span>
                  </div>

                  <div className="flex items-center gap-4 h-full pt-2">
                    {/* Mini Sidebar Skeleton (matching Kresna Card 3's left sidebar) */}
                    <div className="w-8 flex flex-col gap-1.5 justify-center py-1 border-r border-slate-100 pr-2 shrink-0">
                      <div className="h-3 w-full bg-[#2764B8]/25 rounded" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                      <div className="h-3 w-full bg-slate-100 rounded" />
                    </div>

                    {/* 5 Reagent Usage / Depletion Bars with percentage labels, track backdrops, and rounded caps */}
                    <div className="flex-1 flex items-end justify-between gap-2.5 h-28 relative">
                      {/* Subtle dashed horizontal benchmark line */}
                      <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100 pointer-events-none" />

                      {/* Bar 1 */}
                      <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative z-10">
                        <span className="text-[9px] font-mono font-bold text-slate-700">82%</span>
                        <div className="w-full bg-slate-100 rounded-t-lg h-20 flex flex-col justify-end overflow-hidden">
                          <div className="w-full bg-[#2764B8] rounded-t-lg h-[82%] shadow-2xs transition-all" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">Diluent</span>
                      </div>
                      {/* Bar 2 */}
                      <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative z-10">
                        <span className="text-[9px] font-mono font-bold text-slate-700">65%</span>
                        <div className="w-full bg-slate-100 rounded-t-lg h-20 flex flex-col justify-end overflow-hidden">
                          <div className="w-full bg-[#2764B8] rounded-t-lg h-[65%] shadow-2xs transition-all" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">Lyse</span>
                      </div>
                      {/* Bar 3 */}
                      <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative z-10">
                        <span className="text-[9px] font-mono font-bold text-slate-700">90%</span>
                        <div className="w-full bg-slate-100 rounded-t-lg h-20 flex flex-col justify-end overflow-hidden">
                          <div className="w-full bg-[#2764B8] rounded-t-lg h-[90%] shadow-2xs transition-all" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">Stain</span>
                      </div>
                      {/* Bar 4: Warning Bar in Amber */}
                      <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative z-10">
                        <span className="text-[9px] font-mono font-bold text-amber-700">48%</span>
                        <div className="w-full bg-amber-50 rounded-t-lg h-20 flex flex-col justify-end overflow-hidden">
                          <div className="w-full bg-amber-400 rounded-t-lg h-[48%] shadow-2xs transition-all" />
                        </div>
                        <span className="text-[9px] font-mono text-amber-700 font-bold truncate w-full text-center">Clean</span>
                      </div>
                      {/* Bar 5 */}
                      <div className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative z-10">
                        <span className="text-[9px] font-mono font-bold text-slate-700">94%</span>
                        <div className="w-full bg-slate-100 rounded-t-lg h-20 flex flex-col justify-end overflow-hidden">
                          <div className="w-full bg-[#2764B8] rounded-t-lg h-[94%] shadow-2xs transition-all" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">Ctrl</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Anatomical Pathology - Member Nodes & Custody Chain (7 cols) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-[#F4F5F7] border border-slate-200/70 p-7 sm:p-9 lg:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 shadow-2xs">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                    {language === "ID" ? "Pelacakan Spesimen Jaringan 2D" : "2D Specimen Chain of Custody"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-xl">
                    {language === "ID"
                      ? "Pelacakan kaset dan slide kaca ber-barcode mikro 2D untuk eliminasi risiko spesimen tertukar."
                      : "2D micro-barcode tracking across cassettes and glass slides for zero specimen mix-ups."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Clean Floating Specimen Nodes & Staging Card (matching Kresna Card 4) */}
                <div className="h-[220px] sm:h-[240px] w-full flex items-center justify-center relative overflow-hidden">
                  <div className="flex items-center justify-between w-full max-w-xl gap-3 sm:gap-6 relative z-10 px-1 sm:px-2">
                    {/* Left Stack of Specimen Stage Cards (matching Kumala / Karina cards in Kresna Card 4) */}
                    <div className="space-y-3.5 flex-1 max-w-[210px]">
                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs transition-all hover:shadow-md">
                        <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#2764B8] flex items-center justify-center shrink-0">
                          <Microscope className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-slate-900 block text-[11px] truncate">Grossing Kaset A1</span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">2D DataMatrix ID #PA-2841</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs transition-all hover:shadow-md">
                        <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-bold text-slate-900 block text-[11px] truncate">Microtomy 4 Slide</span>
                          <span className="text-[10px] font-mono text-slate-400 block truncate">Pewarnaan H&amp;E Potong Beku</span>
                        </div>
                      </div>
                    </div>

                    {/* SVG Branching Lines Merging to Right Card */}
                    <svg className="hidden sm:block w-10 h-24 shrink-0 overflow-visible text-slate-300" viewBox="0 0 40 96" fill="none">
                      <path d="M0 20 C20 20 20 48 40 48" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M0 76 C20 76 20 48 40 48" stroke="currentColor" strokeWidth="1.5" />
                    </svg>

                    {/* Right Target Synoptic Report Card (matching Members list card in Kresna Card 4) */}
                    <div className="w-[190px] sm:w-[240px] rounded-2xl bg-white border border-slate-200/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-2.5 shrink-0">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">ICD-O-3 SYNOPTIC</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          Terverifikasi
                        </span>
                      </div>
                      <div className="text-xs font-mono space-y-0.5">
                        <span className="font-bold text-slate-800 block text-[11px] truncate">Invasive Ductal Carcinoma</span>
                        <span className="text-[10px] text-slate-500 block truncate">Grade 2 • Margin Bebas Tumor</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="h-5 w-5 rounded-full bg-blue-100 text-[#2764B8] text-[9px] font-bold flex items-center justify-center shrink-0">
                            DH
                          </span>
                          <span className="truncate font-semibold text-slate-800">dr. Hendra, Sp.PA</span>
                        </div>
                        <span className="text-emerald-600 font-bold shrink-0 ml-1">✓ E-Sign</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Microbiology & PPRA Antibiogram - Full 12-col Panoramic Workstation */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-[#F4F5F7] border border-slate-200/70 p-7 sm:p-9 lg:p-10 flex flex-col justify-between group transition-all duration-300 hover:border-slate-300 shadow-2xs">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1.5">
                  {language === "ID" ? "Mikrobiologi Klinik & Peta Antibiogram PPRA" : "Microbiology & Cumulative Antibiogram"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-2xl">
                  {language === "ID"
                    ? "Manajemen biakan kultur multi-hari, integrasi analyzer otomatis VITEK-2 / BD Phoenix, dan pelaporan pola resistensi kumulatif sesuai pedoman CLSI / EUCAST."
                    : "Multi-day culture incubation tracking, automated VITEK-2 AST integration, and automated cumulative antibiograms under CLSI guidelines."}
                </p>
              </div>

              {/* Bottom Visual Stage: 3-Pillar Clean Workstation Console with App Header */}
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.05)] p-4 sm:p-6 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-[#2764B8]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                      Antibiogram &amp; Infection Stewardship Console
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#2764B8] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full font-semibold">
                      CLSI M100 Ed. 34 Compliant
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                      WHONET Ready
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full pt-1">
                  {/* Pillar 1: Incubation */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 transition-all hover:bg-slate-50">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">
                      Inkubasi Kultur Darah
                    </span>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 font-mono">
                      BD BACTEC FX • Hari ke-2 / 5
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Isolat: S. aureus (Kultur Darah Positif)
                    </div>
                  </div>

                  {/* Pillar 2: AST Panel */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5 transition-all hover:bg-slate-50">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">
                      Sensitivitas AST (VITEK-2)
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700">Vancomycin (MIC &le; 0.5)</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                        SENSITIVE
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700">Cefoxitin / MRSA</span>
                      <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px]">
                        RESISTANT
                      </span>
                    </div>
                  </div>

                  {/* Pillar 3: Stewardship Alert */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 transition-all hover:bg-amber-50">
                    <span className="text-[10px] font-mono text-amber-700 font-bold block uppercase tracking-wider">
                      Alert MDRO Terdeteksi
                    </span>
                    <div className="font-bold text-xs sm:text-sm text-amber-900 font-mono">
                      MRSA Flagged &rarr; Tim PPRA &amp; Farmasi
                    </div>
                    <div className="text-[11px] text-amber-800 font-mono">
                      Peta Antibiogram RS Otomatis Terupdate
                    </div>
                  </div>
                </div>
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
