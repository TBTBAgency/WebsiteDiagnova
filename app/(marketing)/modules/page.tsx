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
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  BadgeCheck,
  FileText,
  BarChart2,
  FolderGit2,
  ArrowLeftRight,
  UserCheck,
  Info,
  Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function ModulesPage() {
  const { language } = useLanguage();
  const [isClinicalView, setIsClinicalView] = useState<boolean>(false);

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
      name: language === "ID" ? "Hematologi & Kimia Klinik" : "Routine & Hematology",
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
      name: language === "ID" ? "Manajemen Bank Darah (BDRS)" : "Blood Bank Management",
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
      name: language === "ID" ? "Inventaris & Reagen Pintar" : "Inventory & Reagent Intelligence",
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
      name: language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology",
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
      name: language === "ID" ? "Mikrobiologi & PPRA Kemenkes" : "Microbiology & Antibiotic Stewardship",
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
    },
  ];

  // Directory Catalog Items: 5 Core Modules + 1 Custom Specialty Gateway = Perfectly Balanced 3x2 Grid (6 Cards)
  const directoryItems = [
    ...modules,
    {
      id: "custom-gateway",
      icon: Cpu,
      color: "#1E5299",
      accentBg: "bg-blue-50 text-[#1E5299] border-blue-200/60",
      tabLabel: language === "ID" ? "Kustomisasi & Gateway" : "Custom Gateway",
      targetDept:
        language === "ID"
          ? "Lab Khusus, Genomik & Rujukan"
          : "Specialized, Molecular & Reference Labs",
      name: language === "ID" ? "Gateway & Alur Kerja Khusus" : "Custom Gateway & Specialty LIS",
      tagline:
        language === "ID"
          ? "Integrasi Khusus untuk Instrumen Molekuler, PCR & Alur Mandiri"
          : "Proprietary Bridging for Molecular Instruments & Custom Diagnostics",
      description:
        language === "ID"
          ? "Memiliki instrumen khusus (PCR, sequencing, flow cytometry) atau alur kerja proprietary? Tim engineer Diagnova menyediakan parser HL7/ASTM kustom dan integrasi tanpa batasan vendor."
          : "Operating proprietary equipment (PCR, NGS sequencing, flow cytometry)? Diagnova engineers craft custom ASTM/HL7/JSON parsers tailored directly to your institution's protocol.",
      highlights: [
        {
          title: language === "ID" ? "Parser HL7 / ASTM / JSON Khusus" : "Custom HL7/ASTM/JSON Parsers",
          desc: language === "ID" ? "Dukungan parser instrumen unik tanpa batasan tipe analyzer." : "Universal parsing engine supporting non-standard analyzer data formats.",
        },
        {
          title: language === "ID" ? "SLA Penerapan 14 Hari Kerja" : "14-Day Deployment SLA",
          desc: language === "ID" ? "Implementasi cepat didampingi spesialis interfacing medis berpengalaman." : "Expedited integration driven by experienced clinical interfacing engineers.",
        },
        {
          title: language === "ID" ? "Satu Rekam Medis Pasien Terpadu" : "Unified Single EMR Record",
          desc: language === "ID" ? "Seluruh hasil instrumen khusus otomatis masuk ke satu timeline pasien." : "All specialized diagnostic outputs converge into one patient medical history.",
        },
      ],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Alat Didukung" : "Analyzers Supported" },
        { val: "100%", label: language === "ID" ? "Kepemilikan Data RS" : "Hospital Data Ownership" },
      ],
    },
  ];

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
          INTERACTIVE STATION (MATCHING USER LIGOLAB SPEC: 4 VALUE ROWS + AI PATIENT & CLINICAL VIEW)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="modules-explorer"
        className="relative scroll-mt-24 w-full bg-white py-16 sm:py-20 lg:py-24 overflow-hidden"
      >
        {/* Ambient Smooth Orbs Background (Pure Soft Diffusion) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/ambient-platform-orbs.webp?v=pure')",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          {/* Subtle Ambient Dot Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: "radial-gradient(rgba(52, 93, 171, 0.18) 1.25px, transparent 1.25px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-12 sm:mb-16">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Workstation Interaktif" : "Interactive Station"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
              {language === "ID"
                ? "Laporan Pasien Cerdas & Narasi Klinis Terpercaya"
                : "Intelligent Patient Reporting & Clinical Trust"}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {language === "ID"
                ? "Menjembatani temuan laboratorium yang kompleks menjadi wawasan yang mudah dipahami pasien, dengan kendali dan persetujuan penuh di tangan dokter penanggung jawab."
                : "Transforming complex laboratory findings into clear, patient-friendly insights while keeping physicians in total diagnostic command."}
            </p>
          </div>

          {/* 2-Column LigoLab Architecture: Left 4 Value Rows + Right Dual-Mode Patient Report Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: 4 Clean Feature Rows with Icon Badge */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7">
              {/* Item 1 */}
              <div className="flex items-start gap-4 sm:gap-5 group">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#EFF6FF] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#E5F0FF] transition-all shadow-2xs">
                  <FileCheck2 className="h-6 w-6 stroke-[1.8]" />
                </div>
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Pemahaman Jelas atas Temuan Kunci" : "Clear Understanding of Key Findings"}
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menerjemahkan terminologi medis menjadi penjelasan yang mudah dipahami"
                          : "Converts medical terminology into easy-to-understand explanations"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menyoroti hasil pemeriksaan paling penting beserta maknanya bagi pasien"
                          : "Highlights the most important results and what they mean"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4 sm:gap-5 group">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#EFF6FF] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#E5F0FF] transition-all shadow-2xs">
                  <HeartPulse className="h-6 w-6 stroke-[1.8]" />
                </div>
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Rekomendasi Pola Hidup yang Aplikatif" : "Actionable Lifestyle Recommendations"}
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menyajikan panduan kebugaran berbasis bukti (evidence-based) selaras hasil uji"
                          : "Provides general, evidence-based wellness guidance aligned with results"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Mendorong manajemen kesehatan yang proaktif dan preventif secara terarah"
                          : "Encourages proactive health management"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-4 sm:gap-5 group">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#EFF6FF] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#E5F0FF] transition-all shadow-2xs">
                  <Shuffle className="h-6 w-6 stroke-[1.8]" />
                </div>
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Panduan Roadmap \"Langkah Selanjutnya\"" : "Guided \"Next Steps\" Roadmap"}
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Merinci jadwal waktu tepat untuk konsultasi lanjutan dengan dokter spesialis"
                          : "Outlines when to follow up with a physician"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menyarankan daftar pertanyaan penting yang dapat diajukan kepada dokter"
                          : "Suggests appropriate questions patients may ask their provider"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-4 sm:gap-5 group">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#EFF6FF] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#E5F0FF] transition-all shadow-2xs">
                  <UserCheck className="h-6 w-6 stroke-[1.8]" />
                </div>
                <div className="space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Tervalidasi & Diawasi Dokter Spesialis" : "Doctor-Approved and Trustworthy"}
                  </h3>
                  <ul className="space-y-1 text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menjaga pengawasan dan validasi klinis mutlak dari dokter spesialis patologi"
                          : "Maintains clinical oversight and approval"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Memastikan penjelasan medis akurat, bertanggung jawab, dan sesuai standar profesi"
                          : "Ensures explanations remain accurate, responsible, and aligned with professional standards"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Report Card with Interactive Mode Switcher */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[34px] bg-white border border-slate-200/90 p-5 sm:p-7 shadow-[0_12px_40px_-15px_rgba(15,23,42,0.06)] relative flex flex-col justify-between">
                {/* Card Header with Interactive Toggle Button */}
                <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-base sm:text-lg font-bold text-slate-900">
                      {isClinicalView
                        ? (language === "ID" ? "Tampilan Klinis Dokter" : "Clinical Pathologist View")
                        : "AI Patient Report"}
                    </span>
                  </div>

                  {/* Mode Switcher Button */}
                  <button
                    type="button"
                    onClick={() => setIsClinicalView(!isClinicalView)}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0073FC] hover:bg-[#0060D6] text-white text-[11px] sm:text-xs font-bold font-mono tracking-wider shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowLeftRight className="h-3 w-3" />
                    <span>{isClinicalView ? (language === "ID" ? "TAMPILAN PASIEN" : "PATIENT VIEW") : (language === "ID" ? "TAMPILAN KLINIS" : "CLINICAL VIEW")}</span>
                  </button>
                </div>

                {/* 3 Stacked Cards (Matching Exact LigoLab Palette & Structure) */}
                <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-5">
                  {/* Card 1: Blue Card - Results Summary */}
                  <div className="rounded-2xl bg-[#EFF6FF] border border-blue-200/80 p-4 sm:p-5 transition-all">
                    <div className="flex items-center gap-2 text-[#1E40AF] font-bold text-sm sm:text-[15px] mb-2">
                      <FileText className="h-4.5 w-4.5" />
                      <h4>
                        {isClinicalView
                          ? (language === "ID" ? "Temuan Histopatologi & Morfometrik" : "Histopathology & Microscopic Evaluation")
                          : (language === "ID" ? "Ringkasan Hasil Anda" : "Your Results Summary")}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                      {isClinicalView
                        ? (language === "ID"
                            ? "Biopsi jaringan menunjukkan epitel skuamosa hiperplastik tanpa atipia sitologis atau invasi stroma. Indeks mitosis < 1/10 HPF. Batas sayatan bedah bebas sel tumor (> 2mm)."
                            : "Tissue biopsy demonstrates hyperplastic squamous epithelium without cytological atypia or invasive stromal breach. Mitotic index < 1/10 HPF. Surgical margins clear (> 2mm).")
                        : (language === "ID"
                            ? "Sampel jaringan Anda menunjukkan sel-sel jinak (non-kanker). Ini adalah hasil yang sangat baik dan menandakan tidak ditemukan adanya sel ganas."
                            : "Your tissue sample showed benign (non-cancerous) cells. This is a good result that means no cancer was detected.")}
                    </p>
                  </div>

                  {/* Card 2: Green Card - What This Means */}
                  <div className="rounded-2xl bg-[#F0FDF4] border border-emerald-200/80 p-4 sm:p-5 transition-all">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-[15px] mb-2">
                      <Info className="h-4.5 w-4.5 text-emerald-700" />
                      <h4>
                        {isClinicalView
                          ? (language === "ID" ? "Korelasi Diagnostik & Standar ICD-O-3" : "Diagnostic Classification & ICD-O-3")
                          : (language === "ID" ? "Makna Hasil Pemeriksaan" : "What This Means")}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                      {isClinicalView
                        ? (language === "ID"
                            ? "Klasifikasi SNOMED: M-7200/0 (Alterasi fibrokistik jinak). Tidak teridentifikasi penanda displasia tingkat tinggi. Korelasi longitudinal delta biomarker stabil."
                            : "SNOMED code M-7200/0 (Benign fibrocystic alteration). No high-grade dysplasia detected. Correlation with longitudinal delta-check confirms stable metabolic baseline.")
                        : (language === "ID"
                            ? "Pertumbuhan kecil jaringan yang diangkat tidak berbahaya. Tubuh Anda dalam kondisi sehat dan normal pada area pemeriksaan ini."
                            : "The small growth that was removed is not harmful. Your body is healthy in this area.")}
                    </p>
                  </div>

                  {/* Card 3: White Card - Next Steps */}
                  <div className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-2xs transition-all">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-[15px] mb-2.5">
                      <Sparkles className="h-4.5 w-4.5 text-[#2764B8]" />
                      <h4>
                        {isClinicalView
                          ? (language === "ID" ? "Rekomendasi DPJP & Verifikasi Digital" : "Pathologist Sign-off & Follow-up Protocol")
                          : (language === "ID" ? "Langkah Selanjutnya" : "Next Steps")}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-700">
                      {isClinicalView ? (
                        <>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>
                              {language === "ID"
                                ? "Jadwal USG / Mammografi pengawasan rutin pada interval 6 bulan"
                                : "Surveillance ultrasound/mammography at standard 6-month interval"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>
                              {language === "ID"
                                ? "Tanda tangan digital terverifikasi: dr. Rahadian, Sp.PA (STR Aktif ✓)"
                                : "Digital verification complete: dr. Rahadian, Sp.PA (Active License ✓)"}
                            </span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-slate-800 font-bold shrink-0">✓</span>
                            <span>
                              {language === "ID"
                                ? "Lakukan konsultasi tindak lanjut dengan dokter Anda dalam 6 bulan"
                                : "Follow up with your doctor in 6 months"}
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-slate-800 font-bold shrink-0">✓</span>
                            <span>
                              {language === "ID"
                                ? "Tanyakan mengenai jadwal skrining pemeriksaan rutin"
                                : "Ask about routine screening schedule"}
                            </span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPLETE MODULE DIRECTORY (BALANCED 6-CARD 3x2 GRID)
          5 Core Modules + 1 Custom Specialty Gateway = ZERO EMPTY SLOTS
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Katalog Modul Lengkap" : "Complete Module Catalog"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID" ? (
                <>Arsitektur 5 Modul Inti &amp; Gateway Khusus</>
              ) : (
                <>5 Core Clinical Modules &amp; Specialty Gateway</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Daftar spesifikasi ringkas dan cakupan alur kerja untuk memudahkan evaluasi tim medis, kepala laboratorium, dan manajemen rumah sakit."
                : "A structured overview designed for effortless evaluation by laboratory directors, medical specialists, and hospital IT leadership."}
            </p>
          </div>

          {/* Symmetrical 3x2 Grid (6 Cards Total) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {directoryItems.map((m, idx) => {
              const Icon = m.icon;
              const isCustom = m.id === "custom-gateway";

              return (
                <div
                  key={m.id}
                  id={m.id}
                  className={cn(
                    "scroll-mt-32 rounded-[28px] p-7 transition-all duration-200 flex flex-col justify-between border",
                    isCustom
                      ? "bg-gradient-to-br from-[#F5F9FF] to-[#EBF3FB] border-[#2466CB]/40 shadow-xs hover:border-[#2466CB]"
                      : "bg-white border-slate-200/90 shadow-xs hover:border-[#2466CB]/60 hover:shadow-sm"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shadow-2xs border",
                        isCustom
                          ? "bg-[#2466CB] text-white border-[#2466CB]"
                          : "bg-[#EBF3FB] text-[#2466CB] border-blue-100"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={cn(
                        "text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border",
                        isCustom
                          ? "bg-[#2466CB] text-white border-[#2466CB]"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        MOD-0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#1E5299] bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {m.targetDept}
                      </span>
                      <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                        {m.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-3">
                        {m.description}
                      </p>
                    </div>

                    {/* Quick Highlights */}
                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                      {m.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#2466CB] shrink-0" />
                          <span className="font-medium line-clamp-1">{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2466CB]">
                      {isCustom ? (language === "ID" ? "Kustomisasi Bebas" : "Tailored Architecture") : m.tabLabel}
                    </span>

                    <Link
                      href={isCustom ? "/request-demo?module=custom" : `/request-demo?module=${m.id}`}
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                        isCustom
                          ? "bg-[#2466CB] text-white hover:bg-[#1E5299]"
                          : "text-slate-700 hover:text-[#2466CB] hover:bg-slate-50"
                      )}
                    >
                      <span>{isCustom ? (language === "ID" ? "Konsultasi" : "Consult") : "Demo"}</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ARCHITECTURE (UNIFIED DATA, NO SILOS)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Arsitektur Tanpa Silo" : "Zero Data Silos"}
              </SectionBadge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
                {language === "ID" ? (
                  <>Satu Pasien, Satu Basis Data Laboratorium Terpadu</>
                ) : (
                  <>Single Patient ID, One Unified Laboratory Database</>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {language === "ID"
                  ? "Walaupun setiap modul menangani alur kerja spesifik, seluruh data bermuara pada satu pusat data Diagnova. Dokter dapat melihat hasil darah rutin, riwayat transfusi, dan laporan patologi dalam satu rekam medis terpadu tanpa fragmentasi sistem."
                  : "Even with department-specific workflows, all clinical data converges into Diagnova's unified clinical registry. Physicians review routine hematology, blood bank logs, and pathology reports in one seamless patient timeline."}
              </p>
              <div className="pt-2">
                <Link
                  href="/platform"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2466CB] hover:text-[#1E5299] transition-colors"
                >
                  <span>{language === "ID" ? "Pelajari Arsitektur Platform Diagnova" : "Explore Diagnova Platform Architecture"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <Database className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Single Medical Record" : "Single Patient Record"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Eliminasi duplikasi data pasien antar instalasi lab sentral, IGD, poliklinik, dan BDRS."
                    : "Zero duplicate records across central lab, ER, outpatient wards, and transfusion units."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <Cpu className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Smart Gateway Buffer" : "Smart Gateway Buffer"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Satu pintu komunikasi untuk seluruh instrumen analyzer dengan buffer offline aman saat jaringan down."
                    : "Universal gateway for all analyzers equipped with resilient offline buffering during network blips."}
                </p>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF3FB] text-[#2466CB] flex items-center justify-center border border-blue-100">
                  <FileCheck2 className="h-5.5 w-5.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {language === "ID" ? "Kepatuhan KARS & ISO" : "Regulatory Compliance"}
                </h4>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Jejak audit digital otomatis siap diuji oleh asesor akreditasi KARS, JCI, dan ISO 15189 setiap saat."
                    : "Immutable digital audit trail ready for KARS, JCI, and ISO 15189 surveys anytime."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner bgClassName="bg-[#FAFBFD]" topColor="#FAFBFD" />
    </div>
  );
}
