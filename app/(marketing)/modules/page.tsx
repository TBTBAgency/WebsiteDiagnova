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
  AlertTriangle,
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
      <section
        id="modules-directory"
        className="relative overflow-hidden w-full bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white py-18 sm:py-24 lg:py-28 border-t border-slate-200/60"
      >
        {/* Subtle Dot Grid Pattern (Halus & Elegan) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.24] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
          style={{
            backgroundImage: "radial-gradient(#345DAB 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Soft Ambient Radial Glows */}
        <div className="absolute -top-32 right-1/4 w-[600px] h-[350px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-[500px] h-[300px] bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Direktori Modul" : "Module Directory"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Daftar Lengkap 5 Modul Laboratorium</>
              ) : (
                <>Complete Suite of 5 Laboratory Modules</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Daftar spesifikasi ringkas untuk memudahkan peninjauan tim medis dan manajemen rumah sakit."
                : "A concise specifications catalog for streamlined medical and administrative evaluation."}
            </p>
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
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(31,45,93,0.04)] p-7 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-blue-200/90 hover:shadow-[0_14px_40px_rgba(39,100,184,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50/90 border border-blue-100/90 text-[11px] font-mono font-semibold text-[#2764B8] mb-3.5">
                    <Activity className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span>{language === "ID" ? "MODUL 01 • HEMATOLOGI & RUTIN" : "MODULE 01 • HEMATOLOGY & CLINICAL"}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === "ID" ? "Otomasi Alur Kerja Hematologi & Rutin" : "Smart Workflow Automation"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 sm:mb-8">
                    {language === "ID"
                      ? "Interfacing analyzer ASTM/HL7 langsung, validasi otomatis aturan Westgard, dan penarikan hasil tanpa perantara."
                      : "Direct ASTM/HL7 analyzer links, automated Westgard rule verification, and instant zero-middleware capture."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Node Workflow Connector (matching Kresna Card 1) */}
                <div className="relative h-[250px] sm:h-[270px] w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-[#F4F8FD] to-[#EDF4FC] border border-blue-100/80 p-4 sm:p-6 overflow-hidden flex items-center justify-between shadow-[inset_0_1px_3px_rgba(39,100,184,0.03)]">
                  {/* Subtle Grid Dot Canvas */}
                  <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#2764B8 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* SVG Connecting Branching Curves */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" preserveAspectRatio="none">
                    {/* Branch Left -> Top Pill */}
                    <path d="M 64 135 C 110 135, 120 78, 175 78" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                    {/* Branch Left -> Bottom Pill */}
                    <path d="M 64 135 C 110 135, 120 192, 175 192" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                    {/* Branch Top Pill -> Task Card */}
                    <path d="M 320 78 C 350 78, 355 110, 380 110" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                    {/* Branch Bottom Pill -> Task Card */}
                    <path d="M 320 192 C 350 192, 355 160, 380 160" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                  </svg>

                  <div className="flex items-center justify-between w-full max-w-xl gap-2 sm:gap-4 relative z-10">
                    {/* Left Node: Branded Analyzer Hub Box */}
                    <div className="h-13 w-13 sm:h-15 sm:w-15 rounded-2xl bg-gradient-to-br from-[#2764B8] to-[#1E3A8A] text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(39,100,184,0.24)] shrink-0 ring-4 ring-white">
                      <Activity className="h-6 w-6 sm:h-7 sm:w-7" />
                      <span className="text-[9px] font-mono font-bold mt-0.5 tracking-wider">ASTM</span>
                    </div>

                    {/* Connecting Branching Middle Nodes */}
                    <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-4 relative max-w-[210px]">
                      {/* Sub-Node 1: ASTM Direct Link */}
                      <div className="flex items-center justify-between gap-2 p-2.5 sm:px-3 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_14px_rgba(31,45,93,0.06)] text-xs font-semibold text-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="truncate text-[11px] sm:text-xs">Sysmex &amp; Cobas</span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold shrink-0">Live</span>
                      </div>

                      {/* Sub-Node 2: Delta Check Flag */}
                      <div className="flex items-center justify-between gap-2 p-2.5 sm:px-3 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_14px_rgba(31,45,93,0.06)] text-xs font-semibold text-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate text-[11px] sm:text-xs">Westgard &amp; Delta</span>
                        </div>
                        <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold shrink-0">+115%</span>
                      </div>
                    </div>

                    {/* Right Re-converging Task Card */}
                    <div className="w-[190px] sm:w-[225px] rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(31,45,93,0.07)] space-y-2 text-[11px] font-mono shrink-0">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1.5 uppercase tracking-wider">
                        <span>Workflow LIS</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">100% OK</span>
                      </div>
                      <div className="border-l-2 border-[#2764B8] pl-2.5 py-0.5">
                        <span className="font-bold text-slate-900 block truncate">Tarik Hasil ASTM</span>
                        <span className="text-slate-400 text-[10px]">07:50 WIB • 14 Parameter</span>
                      </div>
                      <div className="border-l-2 border-slate-300 pl-2.5 py-0.5">
                        <span className="font-bold text-slate-700 block truncate">Validasi Westgard QC</span>
                        <span className="text-slate-400 text-[10px]">07:54 WIB • L-J Chart Normal</span>
                      </div>
                      <div className="border-l-2 border-emerald-500 pl-2.5 py-0.5">
                        <span className="font-bold text-emerald-700 block truncate">Auto-Masuk SIMRS</span>
                        <span className="text-emerald-600 text-[10px]">07:58 WIB • Terverifikasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Blood Bank - Cold-Chain Telemetry Peek (5 cols) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(31,45,93,0.04)] p-7 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-blue-200/90 hover:shadow-[0_14px_40px_rgba(39,100,184,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50/90 border border-sky-100/90 text-[11px] font-mono font-semibold text-[#2764B8] mb-3.5">
                    <HeartPulse className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span>{language === "ID" ? "MODUL 02 • BANK DARAH & BDRS" : "MODULE 02 • BLOOD BANK"}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === "ID" ? "Telemetri Rantai Dingin & BDRS" : "Cold-Chain & Transfusion Safety"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 sm:mb-8">
                    {language === "ID"
                      ? "Monitoring suhu kulkas darah 24/7 dan uji silang serasi digital Mayor/Minor ISBT-128."
                      : "24/7 blood storage telemetry and digital dual-verification electronic crossmatching."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Forecast-Style App Window Peek (matching Kresna Card 2) */}
                <div className="relative h-[250px] sm:h-[270px] w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-[#F4F8FD] to-[#EDF4FC] border border-blue-100/80 p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-[inset_0_1px_3px_rgba(39,100,184,0.03)]">
                  {/* Window Bar Header */}
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-blue-100/80 pb-2 relative z-10">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Thermometer className="h-3.5 w-3.5 text-[#2764B8]" />
                      BDRS Chiller 01 (PRC)
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      IoT Connected
                    </span>
                  </div>

                  {/* Floating White Stat Card */}
                  <div className="relative z-10 mx-auto w-full max-w-[270px] p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_10px_28px_rgba(31,45,93,0.08)] space-y-1.5 text-center my-auto">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                      Suhu Kulkas BDRS 24/7
                    </span>
                    <div className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1">
                      3.8<span className="text-xl sm:text-2xl text-[#2764B8]">°C</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Rentang Aman (2.0°C – 6.0°C)
                    </span>
                  </div>

                  {/* Soft Background Wave Chart (matching Kresna Card 2's blue wave) */}
                  <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-50 z-0">
                    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="coldWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2764B8" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#2764B8" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Guide Threshold Lines */}
                      <line x1="0" y1="35" x2="400" y2="35" stroke="#93C5FD" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                      <line x1="0" y1="95" x2="400" y2="95" stroke="#93C5FD" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                      <path d="M0,75 Q100,55 200,60 T400,58 L400,120 L0,120 Z" fill="url(#coldWaveGrad)" />
                      <path d="M0,75 Q100,55 200,60 T400,58" fill="none" stroke="#2764B8" strokeWidth="2.5" />
                      {/* Live Data Point */}
                      <circle cx="340" cy="58" r="4.5" fill="#2764B8" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="340" cy="58" r="9" fill="#2764B8" opacity="0.25" className="animate-ping" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Reagents Intelligence (5-col) & 2D Specimen Tracking (7-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Card 3: Inventory & Reagents - Dashboard Usage Bars (5 cols) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(31,45,93,0.04)] p-7 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-blue-200/90 hover:shadow-[0_14px_40px_rgba(39,100,184,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50/90 border border-indigo-100/90 text-[11px] font-mono font-semibold text-[#2764B8] mb-3.5">
                    <PackageCheck className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span>{language === "ID" ? "MODUL 03 • MANAJEMEN REAGEN" : "MODULE 03 • INVENTORY"}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === "ID" ? "Telemetri Reagen & Biaya Tes" : "Reagent & Supply Intelligence"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 sm:mb-8">
                    {language === "ID"
                      ? "Pengurangan stok otomatis berbasis jumlah tes dan peringatan dini sebelum stok menipis."
                      : "Test-driven auto-depletion tracking and proactive safety threshold warnings."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Dashboard Window Peek with Bar Chart (matching Kresna Card 3) */}
                <div className="relative h-[250px] sm:h-[270px] w-full flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-[#F4F8FD] to-[#EDF4FC] border border-blue-100/80 p-4 sm:p-5 shadow-[inset_0_1px_3px_rgba(39,100,184,0.03)] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-blue-100/80 pb-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 ml-1">
                        Reagent On-Board
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-100/90 px-2 py-0.5 rounded-full">
                      Rata-Rata: 82%
                    </span>
                  </div>

                  {/* Warning Threshold Line */}
                  <div className="relative my-auto pt-2 pb-1">
                    <div className="absolute top-[42%] left-0 right-0 border-b border-dashed border-amber-300/90 z-0 flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50/95 px-1.5 py-0.2 rounded border border-amber-200/80 -translate-y-1/2">
                        Batas Minimum (50%)
                      </span>
                      <span className="text-[9px] font-mono text-amber-600 bg-amber-50/95 px-1.5 py-0.2 rounded -translate-y-1/2">
                        Auto-Alert
                      </span>
                    </div>

                    {/* 5 Reagent Usage / Depletion Bars */}
                    <div className="flex items-end justify-between gap-2.5 sm:gap-3 h-28 pt-4 relative z-10">
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-[#2764B8]">84%</span>
                        <div className="w-full bg-gradient-to-t from-[#1F4C8F] to-[#2764B8] rounded-t-lg h-[84%] shadow-xs" />
                        <span className="text-[9px] font-mono text-slate-600 truncate w-full text-center">Diluent</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-[#2764B8]">68%</span>
                        <div className="w-full bg-gradient-to-t from-[#1F4C8F] to-[#2764B8] rounded-t-lg h-[68%] shadow-xs" />
                        <span className="text-[9px] font-mono text-slate-600 truncate w-full text-center">Lyse</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-[#2764B8]">92%</span>
                        <div className="w-full bg-gradient-to-t from-[#1F4C8F] to-[#2764B8] rounded-t-lg h-[92%] shadow-xs" />
                        <span className="text-[9px] font-mono text-slate-600 truncate w-full text-center">Stain</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-amber-600 flex items-center justify-center">
                          42%
                        </span>
                        <div className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg h-[42%] shadow-xs ring-1 ring-amber-300" />
                        <span className="text-[9px] font-mono text-amber-700 font-bold truncate w-full text-center">Clean</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono font-bold text-[#2764B8]">95%</span>
                        <div className="w-full bg-gradient-to-t from-[#1F4C8F] to-[#2764B8] rounded-t-lg h-[95%] shadow-xs" />
                        <span className="text-[9px] font-mono text-slate-600 truncate w-full text-center">Ctrl</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats Footer */}
                  <div className="pt-2 border-t border-blue-100/70 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>18 Katrid Terhubung</span>
                    <span className="text-[#2764B8] font-semibold">Estimasi 420 Tes Lagi</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Anatomical Pathology - Member Nodes & Custody Chain (7 cols) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(31,45,93,0.04)] p-7 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-blue-200/90 hover:shadow-[0_14px_40px_rgba(39,100,184,0.08)]">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50/90 border border-teal-100/90 text-[11px] font-mono font-semibold text-[#2764B8] mb-3.5">
                    <Microscope className="h-3.5 w-3.5 text-[#2764B8]" />
                    <span>{language === "ID" ? "MODUL 04 • PATOLOGI ANATOMI & SITOLOGI" : "MODULE 04 • ANATOMICAL PATHOLOGY"}</span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    {language === "ID" ? "Pelacakan Spesimen Jaringan 2D" : "2D Specimen Chain of Custody"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 sm:mb-8">
                    {language === "ID"
                      ? "Pelacakan kaset dan slide kaca ber-barcode mikro 2D untuk eliminasi risiko spesimen tertukar."
                      : "2D micro-barcode tracking across cassettes and glass slides for zero specimen mix-ups."}
                  </p>
                </div>

                {/* Bottom Visual Stage: Member Nodes & Staging Card (matching Kresna Card 4) */}
                <div className="relative h-[250px] sm:h-[270px] w-full rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-[#F4F8FD] to-[#EDF4FC] border border-blue-100/80 p-4 sm:p-6 overflow-hidden flex items-center justify-between shadow-[inset_0_1px_3px_rgba(39,100,184,0.03)]">
                  {/* Subtle Grid Dot Canvas */}
                  <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                      backgroundImage: "radial-gradient(#2764B8 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* SVG Connector Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" preserveAspectRatio="none">
                    <path d="M 230 100 C 270 100, 275 130, 310 130" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                    <path d="M 230 170 C 270 170, 275 140, 310 140" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="5 4" opacity="0.85" />
                  </svg>

                  <div className="flex items-center justify-between w-full max-w-xl gap-3 sm:gap-6 relative z-10">
                    {/* Left Stack of Specimen Stage Cards */}
                    <div className="space-y-3 flex-1 max-w-[215px]">
                      <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_14px_rgba(31,45,93,0.05)] text-xs">
                        <div className="h-7 w-7 rounded-lg bg-blue-50 text-[#2764B8] flex items-center justify-center shrink-0">
                          <QrCode className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block text-[11px] truncate">Kaset Grossing A1</span>
                          <span className="text-[10px] font-mono text-slate-400">#PA-24-9102 • 2D OK</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_14px_rgba(31,45,93,0.05)] text-xs">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 block text-[11px] truncate">Microtomy 4 Slide</span>
                          <span className="text-[10px] font-mono text-slate-400">Pewarnaan H&amp;E Valid</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Target Synoptic Report Card */}
                    <div className="w-[210px] sm:w-[255px] rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(31,45,93,0.07)] space-y-2.5 shrink-0">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider">SYNOPTIC PA REPORT</span>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200/80">
                          ICD-O-3
                        </span>
                      </div>
                      <div className="text-xs font-mono">
                        <span className="font-bold text-slate-800 block truncate">Karsinoma Ductal</span>
                        <span className="text-[10px] text-slate-500">WSI 40x Scan Digital OK</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-bold text-slate-800">dr. Hendra, Sp.PA</span>
                        </div>
                        <span className="text-[9px] text-[#2764B8] font-bold">TERVERIFIKASI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Microbiology & PPRA Antibiogram - Full 12-col Panoramic Workstation */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(31,45,93,0.04)] p-7 sm:p-9 flex flex-col justify-between group transition-all duration-300 hover:border-blue-200/90 hover:shadow-[0_14px_40px_rgba(39,100,184,0.08)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50/90 border border-emerald-100/90 text-[11px] font-mono font-semibold text-[#2764B8] mb-3.5">
                  <FlaskConical className="h-3.5 w-3.5 text-[#2764B8]" />
                  <span>{language === "ID" ? "MODUL 05 • MIKROBIOLOGI KLINIK & PPRA" : "MODULE 05 • MICROBIOLOGY & STEWARDSHIP"}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                  {language === "ID" ? "Mikrobiologi Klinik & Peta Antibiogram PPRA" : "Microbiology & Cumulative Antibiogram"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6 sm:mb-8 max-w-4xl">
                  {language === "ID"
                    ? "Manajemen biakan kultur multi-hari, integrasi analyzer otomatis VITEK-2, dan pelaporan pola resistensi kumulatif sesuai pedoman CLSI / EUCAST."
                    : "Multi-day culture incubation tracking, automated VITEK-2 AST integration, and automated cumulative antibiograms under CLSI guidelines."}
                </p>
              </div>

              {/* Bottom Visual Stage: 3-Pillar Clean Workstation Console */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-[#F4F8FD] to-[#EDF4FC] border border-blue-100/80 p-4 sm:p-6 shadow-[inset_0_1px_3px_rgba(39,100,184,0.03)] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full relative z-10">
                  {/* Pillar 1: Incubation Vials Monitor */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(31,45,93,0.05)] space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">
                        Inkubasi Kultur Darah
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        BD BACTEC
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                        <span className="text-slate-800 font-bold">Botol Aerob #01</span>
                        <span className="text-emerald-700 font-semibold text-[11px]">(+) Tumbuh @ 18.4 Jam</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <span className="text-slate-700">Botol Anaerob #02</span>
                        <span className="text-slate-500 text-[11px]">Observasi (Hari 2/5)</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-700 font-mono pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400">Isolat Terkonfirmasi:</span>
                      <span className="font-bold text-[#2764B8]">S. aureus</span>
                    </div>
                  </div>

                  {/* Pillar 2: AST Antibiogram Susceptibility Table */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-[0_4px_16px_rgba(31,45,93,0.05)] space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider font-semibold">
                        Uji Sensitivitas AST (CLSI)
                      </span>
                      <span className="text-[9px] font-mono text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded font-bold border border-blue-100">
                        VITEK-2
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded hover:bg-slate-50 transition-colors">
                        <span className="text-slate-800 font-medium">Vancomycin</span>
                        <span className="text-slate-400 text-[10px]">MIC &le; 0.5</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          SENSITIF
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded hover:bg-slate-50 transition-colors">
                        <span className="text-slate-800 font-medium">Cefoxitin Screen</span>
                        <span className="text-slate-400 text-[10px]">MIC &ge; 8</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          RESISTEN (MRSA)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono p-1.5 rounded hover:bg-slate-50 transition-colors">
                        <span className="text-slate-800 font-medium">Linezolid</span>
                        <span className="text-slate-400 text-[10px]">MIC &le; 1</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          SENSITIF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3: Stewardship Alert & Cumulative Map Sync */}
                  <div className="p-4 sm:p-5 rounded-xl bg-amber-50/80 border border-amber-200/90 shadow-[0_4px_16px_rgba(217,119,6,0.06)] space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                        <span className="text-[10px] font-mono text-amber-800 font-bold block uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          Alert PPRA Aktif
                        </span>
                        <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded">
                          MDRO
                        </span>
                      </div>
                      <div className="mt-2.5 space-y-1">
                        <div className="font-bold text-xs sm:text-sm text-amber-950 font-mono">
                          MRSA Positif Kultur Darah
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
                          Notifikasi instan dikirim ke Tim PPRA &amp; DPJP untuk de-eskalasi antibiotik tepat sasaran.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Peta Kuman 2026 Terupdate
                      </span>
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
