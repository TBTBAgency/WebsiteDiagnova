"use client";

import React, { useState } from "react";
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
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");

  const modules = [
    {
      id: "routine-hematology",
      icon: Activity,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      targetDept:
        language === "ID"
          ? "Laboratorium Patologi Klinik & Kimia Darah"
          : "Clinical Pathology & Core Hematology",
      name: language === "ID" ? "Routine & Hematology" : "Routine & Hematology",
      tagline:
        language === "ID"
          ? "Kecepatan Tinggi & Akurasi Tanpa Kompromi untuk Volume Harian"
          : "High Throughput & Uncompromised Accuracy for Daily Routine Testing",
      description:
        language === "ID"
          ? "Modul Routine & Hematology dirancang untuk memproses ribuan spesimen darah, urin, dan kimia klinik per hari. Terhubung langsung secara bidireksional dengan analyzer terkemuka, modul ini mengeliminasi entri data manual, memangkas Turnaround Time (TAT) hingga 70%, dan mengaktifkan validasi delta check otomatis."
          : "Engineered to process thousands of blood, urine, and clinical chemistry specimens daily. With direct bidirectional analyzer interfacing, it eliminates manual typing, slashes Turnaround Time (TAT) by up to 70%, and enables automated longitudinal delta checking.",
      features:
        language === "ID"
          ? [
              "Interfacing Bidireksional Analyzer (HL7 / ASTM)",
              "Auto-Verification Engine dengan Aturan Fleksibel",
              "Validasi Delta Check & Notifikasi Nilai Kritis Real-Time",
              "Pelacakan Barcode 2D pada Setiap Tabung Spesimen",
              "Manajemen Worklist Otomatis per Mesin Analyzer",
              "Quality Control Lengkap (Levey-Jennings & Westgard Rules)",
            ]
          : [
              "Bidirectional Analyzer Interfacing (HL7 / ASTM)",
              "Configurable Auto-Verification Rule Engine",
              "Real-time Delta Check & Critical Value Broadcast",
              "2D Barcode Tracking on Every Specimen Tube",
              "Automated Analyzer Worklist Dispatch",
              "Comprehensive Quality Control (Levey-Jennings & Westgard Rules)",
            ],
      benefits:
        language === "ID"
          ? [
              { label: "Pangkas TAT Hasil Lab", val: "Hingga 70%" },
              { label: "Eliminasi Human Error Ketik", val: "99.8%" },
              { label: "Notifikasi Panic Values ke DPJP", val: "< 3 Menit" },
              { label: "Kepatuhan Regulasi", val: "KARS & JCI Ready" },
            ]
          : [
              { label: "TAT Reduction", val: "Up to 70%" },
              { label: "Typing Error Elimination", val: "99.8%" },
              { label: "Panic Value Alert to Doctor", val: "< 3 Mins" },
              { label: "Compliance Standard", val: "KARS & JCI Ready" },
            ],
      uiPreview: {
        title: language === "ID" ? "Panel Verifikasi Otomatis & Delta Check" : "Auto-Verification & Delta Check Panel",
        sub: "Analyzer: Sysmex XN-1000 • Status: Connected (ASTM)",
        items: [
          { test: "Hemoglobin (Hb)", result: "14.2 g/dL", status: "Normal", delta: "+0.2" },
          { test: "Leukosit (WBC)", result: "7.800 /uL", status: "Normal", delta: "-150" },
          { test: "Trombosit (PLT)", result: "245.000 /uL", status: "Normal", delta: "+5.000" },
          { test: "Glukosa Darah Sewaktu", result: "385 mg/dL", status: "PANIC ALERT", delta: "+190", isAlert: true },
        ],
      },
    },
    {
      id: "blood-bank",
      icon: HeartPulse,
      color: "#E11D48",
      accentBg: "bg-rose-50 text-rose-600 border-rose-200/60",
      targetDept:
        language === "ID"
          ? "Unit Transfusi Darah (UTD) & Bank Darah Rumah Sakit (BDRS)"
          : "Blood Transfusion Service & Hospital Blood Bank (BDRS)",
      name: language === "ID" ? "Blood Bank Management" : "Blood Bank Management",
      tagline:
        language === "ID"
          ? "Transfusi Aman dengan Kontrol Ketat Rantai Dingin & Crossmatch"
          : "Safe Transfusion with Cold-Chain Telemetry & Electronic Crossmatching",
      description:
        language === "ID"
          ? "Mengintegrasikan seluruh siklus rantai pasok darah dari penerimaan kantong donor, uji serasi silang (crossmatching), hingga distribusi ke pasien. Dilengkapi validasi barcode ganda untuk mencegah insiden inkompatibilitas ABO/Rh, pemantauan suhu cold-chain real-time, dan manajemen masa simpan FEFO."
          : "Connects the entire blood supply chain from donor bag receipt, compatibility crossmatching, to ward bedside delivery. Features dual-barcode verification against ABO/Rh mismatch, real-time cold-chain temperature telemetry, and FEFO inventory rotation to prevent wastage.",
      features:
        language === "ID"
          ? [
              "Pelacakan Digital Kantong Darah Berbasis Barcode/ISBT 128",
              "Verifikasi Ganda Uji Silang Serasi (Crossmatching)",
              "Alarm Kedaluwarsa Otomatis (Early Warning Expiry)",
              "Manajemen Stok Lengkap (PRC, TC, FFP, Cryoprecipitate)",
              "Validasi Golongan Darah Pasien Terintegrasi SIMRS/RME",
              "Digital Release Form & Jejak Suhu Rantai Dingin Terenkripsi",
            ]
          : [
              "ISBT 128 & Barcode Digital Blood Bag Tracking",
              "Dual-Verification Crossmatching Protocol",
              "Automated Expiration Alert & FEFO Dispensing",
              "Complete Inventory for PRC, Platelets, FFP, and Cryo",
              "HIS/EMR Patient Blood Type Cross-Validation",
              "Digital Release Authorization & Cold-Chain Telemetry",
            ],
      benefits:
        language === "ID"
          ? [
              { label: "Kesalahan Transfusi Pasien", val: "Zero Tolerance" },
              { label: "Penurunan Darah Kedaluwarsa", val: "Pangkas 45%" },
              { label: "Waktu Siap Darah Cito IGD", val: "< 15 Menit" },
              { label: "Audit Traceability Donor-Pasien", val: "100% Digital" },
            ]
          : [
              { label: "Transfusion Mismatch", val: "Zero Tolerance" },
              { label: "Expired Blood Wastage", val: "Cut by 45%" },
              { label: "Stat Blood Prep Time", val: "< 15 Mins" },
              { label: "Donor-to-Patient Traceability", val: "100% Digital" },
            ],
      uiPreview: {
        title: language === "ID" ? "Monitor Kantong Darah & Crossmatch" : "Blood Bag Inventory & Crossmatch Monitor",
        sub: "Unit: BDRS Sentral • Cold Storage: 4.1°C (Optimal)",
        items: [
          { test: "Kantong PRC #B2409-A", result: "Golongan A+ (350 mL)", status: "Crossmatched", delta: "Compatible" },
          { test: "Kantong PRC #B2409-B", result: "Golongan O+ (350 mL)", status: "Ready Stock", delta: "Exp: 28 Hari" },
          { test: "Kantong TC #T1021-X", result: "Golongan B+ (200 mL)", status: "Agitator Active", delta: "Exp: 3 Hari" },
          { test: "Crossmatch Pasien #RM-4491", result: "Mayor (-) / Minor (-)", status: "SAFE TO RELEASE", delta: "Verified", isAlert: false },
        ],
      },
    },
    {
      id: "inventory-reagent",
      icon: PackageCheck,
      color: "#0284C7",
      accentBg: "bg-sky-50 text-sky-600 border-sky-200/60",
      targetDept:
        language === "ID"
          ? "Logistik Laboratorium & Pengadaan Medis"
          : "Laboratory Logistics & Reagent Procurement",
      name: language === "ID" ? "Inventory & Reagent Intelligence" : "Inventory & Reagent Intelligence",
      tagline:
        language === "ID"
          ? "Stok Reagen Selalu Terpantau, Zero Stock-Out di Tengah Shift"
          : "Real-Time Reagent Telemetry, Zero Stock-Outs During Critical Shifts",
      description:
        language === "ID"
          ? "Melacak pemakaian reagen, kalibrator, dan kontrol secara otomatis seiring dengan tes yang dijalankan oleh mesin analyzer. Menghitung estimasi sisa tes secara prediktif, mengirimkan alarm stok menipis sebelum habis, serta memantau tanggal buka (on-board stability) dan nomor lot secara akurat."
          : "Tracks reagents, calibrators, and QC controls consumption dynamically as tests run on analyzers. Predicts remaining test counts, generates safety stock alerts before shortages occur, and manages lot numbers, open-vial stability, and expiration schedules.",
      features:
        language === "ID"
          ? [
              "Kalkulasi Pengurangan Reagen Otomatis per Pemeriksaan",
              "Pelacakan Nomor Lot, Tanggal Buka & On-board Stability",
              "Notifikasi Stok Minimum (Safety Stock Threshold Alerts)",
              "Saran Pemesanan (Purchase Order Suggestion) Otomatis",
              "Analitik Biaya per Pemeriksaan (Cost-per-Test Reporting)",
              "Multi-Lokasi: Gudang Utama, Lab Satelit, & Kulkas Reagen",
            ]
          : [
              "Automated Test-Driven Reagent Depletion Calculation",
              "Lot Number, Open-Vial Date, and Stability Tracking",
              "Proactive Minimum Safety Stock Threshold Alerts",
              "Automated Smart Purchase Order Recommendations",
              "Granular Cost-per-Test Financial Analytics",
              "Multi-Location: Central Storage, Satellites, and Refrigerators",
            ],
      benefits:
        language === "ID"
          ? [
              { label: "Insiden Reagen Habis di Shift", val: "0 Kejadian" },
              { label: "Efisiensi Belanja Reagen", val: "Hemat 20%" },
              { label: "Pemakaian Reagen Expired", val: "0% Tercegah" },
              { label: "Kesiapan Audit BPOM/ISO", val: "Instan 1-Klik" },
            ]
          : [
              { label: "Mid-Shift Stockout Incidents", val: "0 Incidents" },
              { label: "Procurement Savings", val: "Save 20%" },
              { label: "Expired Reagent Use", val: "0% Prevented" },
              { label: "Audit Readiness (BPOM/ISO)", val: "Instant 1-Click" },
            ],
      uiPreview: {
        title: language === "ID" ? "Telemetri Reagen & On-Board Stability" : "Reagent Telemetry & On-Board Stability",
        sub: "Gudang: Central Cold Room • Auto-Depletion Sync: ON",
        items: [
          { test: "Cobas Diluent Pack 5L", result: "Sisa 82%", status: "Optimal", delta: "1.420 Tes" },
          { test: "Hematology Lyse Pack", result: "Sisa 68%", status: "Optimal", delta: "850 Tes" },
          { test: "Troponin I Reagent Cartridge", result: "Sisa 12%", status: "LOW STOCK ALERT", delta: "14 Tes", isAlert: true },
          { test: "QC Level 1 Normal Control", result: "Exp: 45 Hari", status: "Lot Valid", delta: "Lot #QC-992" },
        ],
      },
    },
    {
      id: "pathology",
      icon: Microscope,
      color: "#345DAB",
      accentBg: "bg-blue-50 text-[#345DAB] border-blue-200/60",
      targetDept:
        language === "ID"
          ? "Instalasi Patologi Anatomi & Sitologi"
          : "Anatomical Pathology & Cytopathology",
      name: language === "ID" ? "Anatomical Pathology" : "Anatomical Pathology",
      tagline:
        language === "ID"
          ? "Pelacakan Spesimen Jaringan Ketat dari Makroskopi hingga Hasil Akhir"
          : "Strict Tissue Tracking Across Grossing, Cassettes, and Final Diagnosis",
      description:
        language === "ID"
          ? "Menyederhanakan alur kerja histopatologi, sitologi, FNAB, dan potong beku (frozen section). Melacak setiap kaset jaringan, blok parafin, dan slide kaca menggunakan 2D micro-barcode. Memungkinkan dokter spesialis patologi menyusun laporan terstruktur dengan template diagnosis terstandar (ICD-O / Bethesda) serta melampirkan foto mikroskopis beresolusi tinggi."
          : "Streamlines histopathology, cytology, FNAB, and frozen sections. Micro-tracks every cassette, paraffin block, and glass slide with 2D barcodes. Empowers pathologists to generate standardized synoptic reports (ICD-O / Bethesda) and attach high-resolution microscopic imaging.",
      features:
        language === "ID"
          ? [
              "Pelacakan Barcode 2D pada Kaset Jaringan & Slide Kaca",
              "Template Laporan Terstruktur (Histopatologi, Sitologi, FNAB)",
              "Integrasi Kamera Mikroskop & Whole Slide Imaging (WSI)",
              "Worklist Digital Dokter Spesialis Patologi Anatomi (Sp.PA)",
              "Pengarsipan Digital Blok Parafin & Slide Jangka Panjang",
              "Bridging Diagnosa Kanker ke RME Pasien & Registri Kanker",
            ]
          : [
              "2D Micro-Barcode Tracking for Cassettes & Glass Slides",
              "Structured Synoptic Templates (Biopsy, Cytology, FNAB)",
              "Microscope Camera & Whole Slide Imaging (WSI) Interfacing",
              "Pathologist Diagnostic Worklist & Staging Workflow",
              "Long-Term Paraffin Block & Glass Slide Archive Registry",
              "Cancer Registry & Hospital EMR Diagnostic Bridging",
            ],
      benefits:
        language === "ID"
          ? [
              { label: "Risiko Tertukar Spesimen", val: "0% Tereliminasi" },
              { label: "Standarisasi Format Laporan", val: "100% ICD-O / Bethesda" },
              { label: "Pencarian Arsip Blok/Slide", val: "< 1 Menit" },
              { label: "Kolaborasi Second Opinion", val: "Real-time Tele-PA" },
            ]
          : [
              { label: "Specimen Mix-Up Risk", val: "0% Eliminated" },
              { label: "Synoptic Report Standard", val: "100% ICD-O / Bethesda" },
              { label: "Block & Slide Retrieval", val: "< 1 Min" },
              { label: "Second-Opinion Consult", val: "Live Digital Tele-PA" },
            ],
      uiPreview: {
        title: language === "ID" ? "Pelacakan Kaset Biopsi & Diagnosa Sp.PA" : "Biopsy Cassette Tracking & Pathology Review",
        sub: "Spesimen: Jaringan Mamae Dextra • Barcode: #PA-8820-A1",
        items: [
          { test: "Tahap 1: Grossing Makroskopi", result: "2 Kaset Jaringan", status: "Selesai", delta: "Teknisi A" },
          { test: "Tahap 2: Microtomy & Staining", result: "HE Stain 4um", status: "Selesai", delta: "Teknisi B" },
          { test: "Tahap 3: Review Mikroskop Sp.PA", result: "Invasive Ductal Ca", status: "On-Review", delta: "dr. Sp.PA" },
          { test: "Tahap 4: Pelaporan Terstruktur", result: "Format ICD-O Terisi", status: "READY TO SIGN", delta: "Digital Sign" },
        ],
      },
    },
    {
      id: "microbiology",
      icon: FlaskConical,
      color: "#0D9488",
      accentBg: "bg-teal-50 text-teal-700 border-teal-200/60",
      targetDept:
        language === "ID"
          ? "Laboratorium Mikrobiologi Klinik & Tim PPRA"
          : "Clinical Microbiology & Hospital PPRA Stewardship",
      name: language === "ID" ? "Microbiology & Antibiotic Stewardship" : "Microbiology & Antibiotic Stewardship",
      tagline:
        language === "ID"
          ? "Kultur Bakteri, Uji Resistensi, dan Terapi Antibiotik Rasional"
          : "Bacterial Culture, Resistance Profiling, and Rational Antibiotic Stewardship",
      description:
        language === "ID"
          ? "Mengelola alur inkubasi kultur bakteri, jamur, serta uji kepekaan antibiotik (Antimicrobial Susceptibility Testing / AST). Menyediakan grafik peta kuman (Antibiogram) berkala untuk mendukung Program Pengendalian Resistensi Antimikroba (PPRA) rumah sakit dan mempercepat rekomendasi antibiotik definitif."
          : "Manages bacterial/fungal culture incubation and Antimicrobial Susceptibility Testing (AST). Generates automated periodic hospital Antibiograms to support Antimicrobial Stewardship (PPRA) programs and guide clinicians toward prompt definitive antimicrobial therapy.",
      features:
        language === "ID"
          ? [
              "Pelacakan Masa Inkubasi Kultur & Status Koloni Real-Time",
              "Integrasi Otomatis Mesin Kultur (VITEK, Phoenix, BD BACTEC)",
              "Pencatatan Zona Hambat & Interpretasi CLSI / EUCAST Otomatis",
              "Pembangkitan Antibiogram Kumulatif Berkala Otomatis",
              "Alert Bakteri Multiresisten (MRSA, ESBL, CRE, VRE) ke PPI",
              "Rekomendasi Terapi Antibiotik Rasional Berdasarkan Sensitivitas",
            ]
          : [
              "Culture Incubation Telemetry & Colony Growth Tracking",
              "Direct Interfacing to VITEK, Phoenix, and BD BACTEC",
              "Zone Diameter Measurement & Auto CLSI/EUCAST Interpretation",
              "Cumulative Periodic Antibiogram Matrix Generator",
              "MDRO Early Warning Alerts (MRSA, ESBL, CRE, VRE) to PPI",
              "Evidence-Based Rational Antibiotic Recommendation Engine",
            ],
      benefits:
        language === "ID"
          ? [
              { label: "Waktu Terapi Antibiotik Tepat", val: "2x Lebih Cepat" },
              { label: "Pemenuhan Indikator PPRA", val: "100% Standar Kemenkes" },
              { label: "Deteksi Outbreak Nosokomial", val: "Alert Otomatis" },
              { label: "Penghematan Biaya Antibiotik", val: "Hingga 30%" },
            ]
          : [
              { label: "Definitive Therapy Speed", val: "2x Faster" },
              { label: "Stewardship Compliance", val: "100% Accredited" },
              { label: "Nosocomial Outbreak Detection", val: "Instant Alert" },
              { label: "Antibiotic Cost Reduction", val: "Up to 30%" },
            ],
      uiPreview: {
        title: language === "ID" ? "Peta Sensitivitas Antibiotik (AST Panel)" : "Antimicrobial Susceptibility (AST Panel)",
        sub: "Isolat: Klebsiella pneumoniae • Sumber: Sputum ICU • CLSI 2024",
        items: [
          { test: "Meropenem", result: "MIC <= 0.25 ug/mL", status: "SENSITIVE", delta: "First-Line" },
          { test: "Amikacin", result: "MIC <= 2 ug/mL", status: "SENSITIVE", delta: "Effective" },
          { test: "Ceftriaxone", result: "MIC >= 64 ug/mL", status: "RESISTANT (ESBL)", delta: "Alert", isAlert: true },
          { test: "Ciprofloxacin", result: "MIC >= 4 ug/mL", status: "RESISTANT", delta: "Avoid", isAlert: true },
        ],
      },
    },
  ];

  const filteredModules =
    activeTab === "all" ? modules : modules.filter((m) => m.id === activeTab);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Sesuai Design System Platform & Solutions
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
                {language === "ID" ? "Modul Terintegrasi Diagnova" : "Diagnova Integrated Modules"}
              </SectionBadge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Arsitektur Modular Presisi untuk{" "}
                  <br className="hidden sm:inline" />
                  Operasional Laboratorium Modern
                </>
              ) : (
                <>
                  Precision Modular Architecture for{" "}
                  <br className="hidden sm:inline" />
                  Modern Laboratory Operations
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl">
              {language === "ID"
                ? "Aktifkan modul spesifik yang dibutuhkan fasilitas Anda atau operasikan sebagai satu ekosistem terpadu. Terintegrasi langsung dengan instrumen analyzer, SIMRS/RME, dan sistem kendali mutu laboratorium."
                : "Deploy the exact specialized modules your facility needs or run them as a fully unified ecosystem. Directly interconnected with medical analyzers, hospital HIS/EMR, and laboratory quality control systems."}
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
                href="#modules-list"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Eksplorasi 5 Modul" : "Explore 5 Modules"}</span>
              </a>
            </div>

            {/* 4 Key Pillars Metric Cards */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
              {[
                {
                  value: "5 Modul",
                  label: language === "ID" ? "Spesialisasi Lengkap" : "Complete Verticals",
                  sub: language === "ID" ? "Rutin, BDRS, Stok, PA, Mikro" : "Routine, Blood, Reagent, PA, Micro",
                },
                {
                  value: "100%",
                  label: language === "ID" ? "Interfacing Analyzer" : "Analyzer Interfacing",
                  sub: language === "ID" ? "ASTM & HL7 bidireksional" : "Bidirectional ASTM & HL7",
                },
                {
                  value: "0 Error",
                  label: language === "ID" ? "Salah Identifikasi" : "Specimen Mix-ups",
                  sub: language === "ID" ? "Barcode 2D & delta-check" : "2D barcode & delta check",
                },
                {
                  value: "Plug & Play",
                  label: language === "ID" ? "Aktivasi Fleksibel" : "Modular Scale",
                  sub: language === "ID" ? "Bebas tambah modul bertahap" : "Activate modules on-demand",
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
          QUICK JUMP / FILTER TABS
          ══════════════════════════════════════════════════════════════ */}
      <section className="sticky top-[72px] sm:top-[76px] lg:top-[84px] z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 py-3 shadow-2xs">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                activeTab === "all"
                  ? "bg-[#2764B8] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {language === "ID" ? "Semua Modul (5)" : "All Modules (5)"}
            </button>
            {modules.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                onClick={() => setActiveTab(m.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer",
                  activeTab === m.id
                    ? "bg-[#2764B8] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {m.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          DETAILED SHOWCASE OF 5 CORE MODULES
          ══════════════════════════════════════════════════════════════ */}
      <section id="modules-list" className="w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Spesialisasi Terdedikasi" : "Dedicated Specializations"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Eksplorasi Detail Setiap Modul Laboratorium</>
              ) : (
                <>Deep Dive into Every Laboratory Module</>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Setiap modul dibangun dengan logika klinis spesifik untuk bidangnya, menghilangkan kebutuhan kustomisasi rumit dan mempercepat adopsi tim medis."
                : "Each module is engineered with field-specific clinical logic, eliminating cumbersome manual custom work and ensuring rapid medical staff adoption."}
            </p>
          </div>

          {/* Module Cards List */}
          <div className="space-y-12 sm:space-y-16">
            {filteredModules.map((mod, index) => {
              const IconComponent = mod.icon;
              return (
                <div
                  key={mod.id}
                  id={mod.id}
                  className="scroll-mt-32 rounded-[28px] sm:rounded-[36px] bg-white border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-xs hover:border-blue-200/90 hover:shadow-sm transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Description, Dept, Features */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-14 w-14 rounded-2xl flex items-center justify-center bg-[#EBF3FB] shadow-xs text-[#2764B8]"
                            )}
                          >
                            <IconComponent className="h-7 w-7" />
                          </div>
                          <div>
                            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border inline-block", mod.accentBg)}>
                              {mod.targetDept}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider">
                          MOD-0{index + 1}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                          {mod.name}
                        </h3>
                        <p className="text-sm sm:text-base font-semibold text-[#345DAB] mb-4">
                          {mod.tagline}
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      {/* Technical Features Grid */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
                          {language === "ID" ? "Fitur & Kapabilitas Teknis Utama:" : "Key Technical Capabilities:"}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {mod.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100 p-3 text-xs sm:text-sm text-slate-700 font-medium"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                        <Link
                          href="/request-demo"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                        >
                          <span>{language === "ID" ? "Konsultasikan Modul Ini" : "Consult This Module"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Live Medical UI Simulation & Clinical Impact */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Live Micro-UI Preview Card */}
                      <div className="rounded-[24px] bg-[#F8FBFE] border border-blue-100 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-blue-100/80 pb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {mod.uiPreview.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {mod.uiPreview.sub}
                            </p>
                          </div>
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* Simulation Table Rows */}
                        <div className="space-y-2">
                          {mod.uiPreview.items.map((row, rIdx) => (
                            <div
                              key={rIdx}
                              className={cn(
                                "flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors",
                                row.isAlert
                                  ? "bg-rose-50 border border-rose-200/80 text-rose-900 font-semibold"
                                  : "bg-white border border-slate-100 text-slate-700"
                              )}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-800">{row.test}</span>
                                <span className="text-[10px] text-slate-400">{row.delta}</span>
                              </div>
                              <div className="text-right">
                                <span className={cn("font-bold", row.isAlert ? "text-rose-600" : "text-slate-900")}>
                                  {row.result}
                                </span>
                                <span
                                  className={cn(
                                    "block text-[10px] uppercase font-bold",
                                    row.isAlert ? "text-rose-600" : "text-emerald-600"
                                  )}
                                >
                                  {row.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clinical & Operational Benefits Card */}
                      <div className="rounded-[24px] bg-[#F9F9F9] border border-slate-200/80 p-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-[#2764B8]" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {language === "ID" ? "Tolok Ukur Efisiensi Klinis:" : "Clinical Efficiency Benchmarks:"}
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {mod.benefits.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs"
                            >
                              <span className="font-display text-base font-bold text-[#345DAB] block">
                                {b.val}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 leading-tight block mt-0.5">
                                {b.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: UNIFIED ARCHITECTURE (NO DATA SILOS)
          (Alternating #F9F9F9 Background, Identik dengan Platform Page)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Interkoneksi Sistem" : "System Interconnection"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Arsitektur Terpadu Tanpa Hambatan Data Silo</>
              ) : (
                <>Unified Data Pipeline Without Siloed Fragility</>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500">
              {language === "ID"
                ? "Meskipun modul beroperasi sesuai spesialisasi masing-masing, seluruh data bermuara pada satu basis data terpusat Diagnova. Hasil lab rutin, uji silang darah, dan laporan patologi dapat diakses oleh dokter klinisi dalam satu rekam medis terpadu."
                : "While each module addresses distinct specialized workflows, all data converges in a single centralized Diagnova data layer. Routine tests, blood crossmatches, and pathology reports are instantly accessible within one unified patient record."}
            </p>
          </div>

          {/* 3 Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-8 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                {language === "ID" ? "Single Patient Registry" : "Single Patient Registry"}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {language === "ID"
                  ? "Satu nomor rekam medis (No. RM) terhubung ke seluruh departemen laboratorium. Tidak ada duplikasi registrasi pasien antara rawat jalan, rawat inap, IGD, maupun MCU."
                  : "A single medical record number (MRN) links across every laboratory division. Zero duplicate patient entries across outpatient, inpatient, ER, and corporate check-ups."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-8 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                {language === "ID" ? "Smart Analyzer Gateway" : "Smart Analyzer Gateway"}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {language === "ID"
                  ? "Satu gateway komunikasi untuk puluhan merek instrumen analyzer. Dilengkapi buffer penyimpanan offline lokal jika jaringan internet rumah sakit terganggu sementara."
                  : "One communication gateway managing dozens of medical analyzer brands. Equipped with local edge buffering to ensure zero data loss during network hiccups."}
              </p>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-8 shadow-xs hover:border-blue-200 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                {language === "ID" ? "Audit Trail & KARS Ready" : "Audit Trail & Accreditation"}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {language === "ID"
                  ? "Seluruh aktivitas verifikasi, revisi hasil, dan pengeluaran darah tercatat dalam log audit digital permanen yang tidak dapat dimanipulasi, siap audit ISO 15189."
                  : "Every test validation, result amendment, and blood bag issuance is preserved in an immutable digital audit trail, 100% compliant with ISO 15189 and JCI standards."}
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
