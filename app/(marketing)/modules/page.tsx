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
  Search,
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
              5-CARD ARCHITECTURE (MATCHING SOLUTIONS PAGE SAASET DESIGN)
              Row 1: 3 Equal Vertical Cards (Hematology, Reagent, Pathology)
              Row 2: 2 Balanced Cards (Microbiology 7-col + Blood Bank 5-col)
              ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 sm:space-y-7">
            {/* ROW 1: 3 EQUAL VERTICAL CARDS (Hematology, Reagents, Pathology) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              {/* Card 1: Routine Hematology & Chemistry */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Blue Canvas with 3 Floating Status Pills */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#EFF6FF] via-[#F6FAFF] to-white border border-blue-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-6">
                    {/* Floating Pill 1: Analyzer Interfacing */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <Zap className="h-4 w-4 text-[#2764B8] shrink-0" />
                      <span className="truncate">Sysmex &amp; Cobas Interfacing</span>
                      <span className="ml-auto text-[10px] font-mono text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        ASTM / HL7
                      </span>
                    </div>

                    {/* Floating Pill 2: Westgard QC */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Validasi Aturan Westgard QC</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        L-J Normal
                      </span>
                    </div>

                    {/* Floating Pill 3: Auto-Release */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                      <span className="truncate">Auto-Rilis Hasil ke SIMRS</span>
                      <span className="ml-auto text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full font-medium shrink-0">
                        Zero Middleware
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content: Clean Title + Subtitle */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Hematologi & Kimia Klinik" : "Routine Hematology & Chemistry"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Interfacing dua arah ASTM/HL7 langsung dengan analyzer otomatis, validasi Westgard QC real-time, dan penarikan hasil tanpa perantara middleware."
                      : "Direct bidirectional ASTM/HL7 analyzer links, real-time Westgard QC verification, and instant middleware-free result dispatch."}
                  </p>
                </div>

                {/* Tag Pill Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <Activity className="h-3.5 w-3.5 text-[#2764B8]" />
                    Core LIS
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    ASTM &amp; HL7 v2.5
                  </span>
                </div>
              </div>

              {/* Card 2: Reagents & Supplies Telemetry */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Amber Canvas with 3 Floating Status Pills */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF5] via-[#FFF9EB] to-white border border-amber-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-6">
                    {/* Floating Pill 1: Auto Depletion */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <PackageCheck className="h-4 w-4 text-amber-600 shrink-0" />
                      <span className="truncate">Auto-Depletion per Tes</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        Real-time
                      </span>
                    </div>

                    {/* Floating Pill 2: Warning Threshold */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="truncate">Peringatan Batas Stok</span>
                      <span className="ml-auto text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        Batas 50%
                      </span>
                    </div>

                    {/* Floating Pill 3: Expiry Tracking */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Pelacakan Lot &amp; Expiry</span>
                      <span className="ml-auto text-[10px] font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full font-medium shrink-0">
                        FIFO Valid
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Manajemen Reagen & Stok" : "Reagent & Supply Intelligence"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Pengurangan stok otomatis berbasis jumlah tes aktual analyzer, pemantauan masa kedaluwarsa, dan pencegahan reagen habis."
                      : "Test-driven auto-depletion tracking, expiration and lot traceability, and precise real-time cost-per-test margin calculation."}
                  </p>
                </div>

                {/* Tag Pill Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <PackageCheck className="h-3.5 w-3.5 text-[#2764B8]" />
                    Logistik Lab
                  </span>
                  <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    Auto-Depletion
                  </span>
                </div>
              </div>

              {/* Card 3: Anatomical Pathology & Cytology */}
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Soft Mint Canvas with 3 Floating Status Pills */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#EDFAF2] via-[#F5FCF7] to-white border border-emerald-100/80 h-[215px] flex flex-col justify-center gap-2.5 mb-6">
                    {/* Floating Pill 1: 2D Barcode */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <QrCode className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Barcode 2D Kaset Grossing</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        Zero Mix-Up
                      </span>
                    </div>

                    {/* Floating Pill 2: Microtomy */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <Microscope className="h-4 w-4 text-[#2764B8] shrink-0" />
                      <span className="truncate">Pelacakan Slide Microtomy</span>
                      <span className="ml-auto text-[10px] font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full font-medium shrink-0">
                        4 Slide H&amp;E
                      </span>
                    </div>

                    {/* Floating Pill 3: Synoptic Report */}
                    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Laporan Sinoptik ICD-O-3</span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold shrink-0">
                        dr. Hendra, Sp.PA
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology & Cytology"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Pelacakan spesimen jaringan dari grossing hingga blok parafin dengan barcode 2D anti-tertukar dan standar pelaporan sinoptik ICD-O."
                      : "End-to-end tissue tracking from grossing to paraffin blocks using 2D micro-barcodes and synoptic ICD-O staging."}
                  </p>
                </div>

                {/* Tag Pill Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <Microscope className="h-3.5 w-3.5 text-[#2764B8]" />
                    Spesialis PA
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    2D Micro-Barcode
                  </span>
                </div>
              </div>
            </div>

            {/* ROW 2: 2 BALANCED CARDS (Microbiology Wide 7-col + Blood Bank 5-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7">
              {/* Card 4: Clinical Microbiology & PPRA Stewardship (Wide 7-col) */}
              <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Workstation Telemetry & AST Sensitivity Table */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#F6F9FD] via-[#FAFBFD] to-white border border-slate-200/80 mb-6 space-y-3.5 shadow-xs">
                    {/* Top Bar with Status and Quick Pills */}
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-800">
                          {language === "ID" ? "Kultur Kuman & Telemetri AST" : "Culture & AST Telemetry"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          VITEK-2 Connected
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          BACTEC Active
                        </span>
                      </div>
                    </div>

                    {/* 3 Metric Summary Boxes */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                        <span className="text-[10px] text-slate-400 font-mono block">Isolat Kuman</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm font-mono truncate block">
                          S. aureus (Blood)
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                        <span className="text-[10px] text-slate-400 font-mono block">Vancomycin MIC</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm font-mono block">
                          &le; 0.5 (Sensitive)
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/70">
                        <span className="text-[10px] text-red-600 font-mono block font-bold">Alert MDRO</span>
                        <span className="font-bold text-red-800 text-xs sm:text-sm font-mono block">
                          MRSA Terdeteksi
                        </span>
                      </div>
                    </div>

                    {/* PPRA Strip */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs">
                      <div className="flex items-center gap-2 text-slate-500 font-normal truncate">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px] sm:text-xs truncate">
                          {language === "ID"
                            ? "Tersinkronisasi otomatis ke Peta Resistensi Kuman PPRA"
                            : "Auto-synced to hospital cumulative antibiogram"}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2764B8] font-semibold text-[10px] border border-blue-200 shrink-0">
                        PPRA 2026
                      </span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    {language === "ID"
                      ? "Mikrobiologi Klinik & Komite PPRA"
                      : "Clinical Microbiology & PPRA Stewardship"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Manajemen biakan kultur multi-hari, integrasi analyzer otomatis VITEK-2/BACTEC, deteksi dini MDRO, dan pelaporan peta antibiogram kumulatif berkala sesuai pedoman CLSI / EUCAST."
                      : "Multi-day culture incubation tracking, automated VITEK-2/BACTEC integration, automated MDRO flags, and cumulative antibiogram generation compliant with CLSI standards."}
                  </p>
                </div>

                {/* Tag Pill Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <FlaskConical className="h-3.5 w-3.5 text-[#2764B8]" />
                    Mikrobiologi &amp; PPRA
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Standar CLSI / EUCAST
                  </span>
                </div>
              </div>

              {/* Card 5: Blood Bank & Transfusion Safety BDRS (Compact 5-col) */}
              <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {/* Top Visual Stage: Bulleted Transfusion Safety Protocol */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FAFBFD] to-white border border-slate-200/80 mb-6 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <HeartPulse className="h-3.5 w-3.5 text-rose-600" />
                        {language === "ID" ? "Protokol Bank Darah (BDRS)" : "Blood Bank Protocol"}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                        Kompatibel
                      </span>
                    </div>

                    {/* 2 Protocol Status Boxes */}
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-3.5 w-3.5 text-[#2764B8]" />
                          <span className="text-slate-800 font-semibold">Suhu Chiller 24/7</span>
                        </div>
                        <span className="text-slate-900 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                          3.8°C (Aman)
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-slate-800 font-semibold">Uji Silang Serasi</span>
                        </div>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Mayor/Minor OK
                        </span>
                      </div>
                    </div>

                    {/* Bottom ISBT-128 Indicator */}
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-500">
                      <span>Standar ISBT-128</span>
                      <span className="text-emerald-700 font-bold">Zero Reaksi Transfusi</span>
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Bank Darah & Transfusi (BDRS)" : "Blood Bank & Transfusion Safety"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Uji silang serasi digital (crossmatching) Mayor/Minor otomatis, telemetri pemantauan suhu kulkas penyimpanan darah 24/7, dan pelacakan donor ISBT-128."
                      : "Automated digital electronic crossmatching, 24/7 continuous cold-chain blood refrigeration telemetry, and ISBT-128 transfusion compliance."}
                  </p>
                </div>

                {/* Tag Pill Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <HeartPulse className="h-3.5 w-3.5 text-[#2764B8]" />
                    BDRS Terpadu
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    ISBT-128 Ready
                  </span>
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
