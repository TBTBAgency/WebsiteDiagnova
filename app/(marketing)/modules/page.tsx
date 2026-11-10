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
  Database,
  ChevronRight,
  QrCode,
  AlertTriangle,
  Zap,
  Server,
  Layers,
  Sparkles,
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
        const foundIndex = modulesList.findIndex((m) => m.id === hash);
        if (foundIndex !== -1) {
          setSelectedModule(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const modulesList = [
    {
      id: "routine-hematology",
      slug: "routine-hematology",
      icon: Activity,
      tag: language === "ID" ? "Patologi Klinik" : "Clinical Pathology",
      tabLabel: language === "ID" ? "Hematologi & Rutin" : "Routine & Hematology",
      protocolBadge: "ASTM E1381 / HL7",
      name: "Routine & Hematology",
      tagline:
        language === "ID"
          ? "Otomasi Pemeriksaan Darah & Kimia Klinik Bervolume Tinggi"
          : "High-Throughput Blood & Clinical Chemistry Automation",
      description:
        language === "ID"
          ? "Menghubungkan instrumen analyzer hematologi dan kimia klinik secara langsung. Order dokter otomatis berubah menjadi worklist mesin, dan hasil diverifikasi tanpa entri data manual."
          : "Directly connects hematology and clinical chemistry analyzers. Physician orders instantly populate machine worklists, and results are verified with zero manual entry.",
      instruments: "Sysmex XN Series • Roche Cobas 6000/8000 • Abbott Architect",
      highlights: [
        {
          title: language === "ID" ? "Interfacing Direct Analyzer" : "Direct Analyzer Interfacing",
          desc: language === "ID" ? "Tarik hasil otomatis dari 200+ jenis analyzer tanpa middleware pihak ketiga." : "Direct result capture from 200+ analyzer models with zero extra middleware.",
        },
        {
          title: language === "ID" ? "Pengecekan Delta & Panic Value" : "Delta Check & Panic Alert",
          desc: language === "ID" ? "Mendeteksi pergeseran biomarker abnormal antar-kunjungan dan peringatan instan ke DPJP." : "Flags longitudinal biomarker shifts and broadcasts critical alerts to doctors.",
        },
        {
          title: language === "ID" ? "QC Levey-Jennings & Westgard" : "Levey-Jennings & Westgard QC",
          desc: language === "ID" ? "Pemantauan kontrol kualitas internal otomatis dengan aturan Westgard 1:2s / 1:3s." : "Automated internal quality control charts following standard Westgard rules.",
        },
      ],
      metrics: [
        { val: "-70%", label: language === "ID" ? "Turnaround Time (TAT)" : "Turnaround Time" },
        { val: "Zero Error", label: language === "ID" ? "Salah Ketik Nilai" : "Typing Errors" },
      ],
      preview: {
        badge: "QC Levey-Jennings • Normal",
        stageTitle: "Sysmex XN-1000 & Cobas 6000 Worklist",
        stageSub: language === "ID" ? "1.240 Sampel Hari Ini • 100% Terverifikasi" : "1,240 Daily Samples • 100% Verified",
        telemetryItems: [
          { label: "Instrumen Utama", val: "Sysmex XN-1000 (ASTM)", status: "Online" },
          { label: "Kontrol Kualitas", val: "Westgard 1:2s Valid", status: "Pass" },
          { label: "Delta-Check Shift", val: "Trombosit: Normal (240k)", status: "OK" },
        ],
      },
    },
    {
      id: "blood-bank",
      slug: "blood-bank",
      icon: HeartPulse,
      tag: language === "ID" ? "Bank Darah & BDRS" : "Blood Bank & Transfusion",
      tabLabel: language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank (BDRS)",
      protocolBadge: "ISBT 128 Compliant",
      name: "Blood Bank Management",
      tagline:
        language === "ID"
          ? "Transfusi Aman dengan Kontrol Rantai Dingin & Uji Silang Serasi"
          : "Safe Transfusion with Cold-Chain Telemetry & Crossmatching",
      description:
        language === "ID"
          ? "Melacak siklus kantong darah dari penerimaan donor hingga transfusi ke pasien. Menghilangkan risiko inkompatibilitas ABO/Rh dengan verifikasi ganda dan memantau masa simpan FEFO."
          : "Tracks blood bags from donation receipt to patient bedside transfusion. Prevents ABO/Rh incompatibility via dual verification and minimizes wastage with FEFO inventory.",
      instruments: "Ortho Vision • Grifols Wadiana • Standar Label ISBT 128",
      highlights: [
        {
          title: language === "ID" ? "Verifikasi Ganda Uji Silang Serasi" : "Electronic Crossmatching",
          desc: language === "ID" ? "Validasi digital kecocokan Mayor/Minor sebelum darah dikeluarkan ke bangsal." : "Digital dual-verification crossmatching protocol prior to ward release.",
        },
        {
          title: language === "ID" ? "Pemantauan Rantai Dingin 24/7" : "24/7 Cold-Chain Telemetry",
          desc: language === "ID" ? "Log suhu penyimpanan 2°C - 6°C terpantau otomatis untuk menjaga kualitas darah." : "Automated 2°C - 6°C cold-room logging safeguarding blood component integrity.",
        },
        {
          title: language === "ID" ? "Rotasi FEFO & Barcode ISBT 128" : "FEFO Inventory & ISBT 128",
          desc: language === "ID" ? "Peringatan dini kantong mendekati kedaluwarsa untuk meminimalkan darah terbuang." : "Proactive expiry alerts to drive zero-wastage transfusion operations.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Inkompatibilitas Darah" : "Transfusion Mismatch" },
        { val: "-45%", label: language === "ID" ? "Darah Kedaluwarsa Terbuang" : "Expired Blood Wastage" },
      ],
      preview: {
        badge: "Cold Storage: 3.8°C • Optimal",
        stageTitle: "PRC Golongan B+ • #ID-0892 Validasi",
        stageSub: language === "ID" ? "Mayor & Minor: Negatif • Kompatibel Transfusi" : "Major & Minor: Negative • Safe for Release",
        telemetryItems: [
          { label: "Uji Mayor Crossmatch", val: "Negatif (Kompatibel)", status: "Pass" },
          { label: "Uji Minor Crossmatch", val: "Negatif (Kompatibel)", status: "Pass" },
          { label: "Suhu Kulkas BDRS", val: "3.8°C (Rentang 2°C - 6°C)", status: "Normal" },
        ],
      },
    },
    {
      id: "inventory-reagent",
      slug: "inventory-reagent",
      icon: PackageCheck,
      tag: language === "ID" ? "Logistik Laboratorium" : "Lab Logistics & Supply",
      tabLabel: language === "ID" ? "Inventaris & Reagen" : "Inventory & Reagent",
      protocolBadge: "Test-Driven Depletion",
      name: "Inventory & Reagent Intelligence",
      tagline:
        language === "ID"
          ? "Stok Reagen Selalu Terpantau, Zero Stock-Out di Tengah Shift"
          : "Real-Time Reagent Telemetry, Zero Mid-Shift Stockouts",
      description:
        language === "ID"
          ? "Mengurangi stok reagen secara otomatis setiap kali instrumen selesai menjalankan tes. Memberikan alarm stok menipis sebelum habis dan melacak tanggal kedaluwarsa secara presisi."
          : "Depletes reagent volumes automatically as tests complete on analyzers. Issues early warnings before shortages occur and tracks lot numbers and open-vial stability.",
      instruments: "Integrasi Telemetri Instrumen Analyzer & Multi-Gudang Satelit",
      highlights: [
        {
          title: language === "ID" ? "Pengurangan Stok Berbasis Tes" : "Test-Driven Auto Depletion",
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
        { val: "0 Stockout", label: language === "ID" ? "Kehabisan di Tengah Shift" : "Mid-Shift Shortages" },
        { val: "20%", label: language === "ID" ? "Penghematan Belanja Reagen" : "Procurement Savings" },
      ],
      preview: {
        badge: "On-Board Stability: 18 Hari",
        stageTitle: "Cobas Reagent Pack #L-902 Telemetry",
        stageSub: language === "ID" ? "82% Kapasitas • 412 Tes Tersisa di Instrumen" : "82% Capacity • 412 Tests Remaining",
        telemetryItems: [
          { label: "Volume Reagen Aktif", val: "82% (412 Tes Sisa)", status: "OK" },
          { label: "Batas Kritis (Threshold)", val: "Safety Stock: 15%", status: "Aman" },
          { label: "Rekomendasi Pengadaan", val: "Purchase Order Terjadwal", status: "Active" },
        ],
      },
    },
    {
      id: "pathology",
      slug: "pathology",
      icon: Microscope,
      tag: language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology",
      tabLabel: language === "ID" ? "Patologi Anatomi" : "Anatomical Pathology",
      protocolBadge: "ICD-O-3 & Bethesda",
      name: "Anatomical Pathology",
      tagline:
        language === "ID"
          ? "Pelacakan Barcode 2D pada Kaset Jaringan & Laporan Terstruktur"
          : "2D Barcode Tissue Tracking & Standardized Synoptic Reporting",
      description:
        language === "ID"
          ? "Mencegah tertukarnya spesimen biopsi jaringan dengan barcode mikro 2D pada setiap kaset dan slide kaca. Mendukung dokter spesialis patologi menyusun diagnosa terstandar ICD-O dan Bethesda."
          : "Eliminates tissue mix-ups using 2D micro-barcodes across cassettes and glass slides. Supports pathologists with standardized ICD-O and Bethesda synoptic reporting.",
      instruments: "Leica Biosystems • Sakura Tissue Processor • Hamamatsu WSI",
      highlights: [
        {
          title: language === "ID" ? "Pelacakan Barcode 2D Kaset & Slide" : "2D Micro-Barcode Tracking",
          desc: language === "ID" ? "Jejak spesimen mulai dari grossing, pemotongan mikrotom, hingga pengecatan H&E." : "Strict chain-of-custody from grossing, microtomy, to HE staining.",
        },
        {
          title: language === "ID" ? "Template ICD-O & Bethesda" : "Standardized Synoptic Reports",
          desc: language === "ID" ? "Format pelaporan baku internasional untuk histopatologi dan sitologi FNAB." : "Standardized reporting formats for histopathology and fine needle cytology.",
        },
        {
          title: language === "ID" ? "Pencarian Arsip Blok Cepat" : "Fast Paraffin Block Retrieval",
          desc: language === "ID" ? "Akses riwayat biopsi pasien sebelumnya dalam hitungan detik untuk perbandingan." : "Instant access to historical tissue blocks for comparative diagnostic consults.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Spesimen Tertukar" : "Specimen Mix-ups" },
        { val: "< 1 Menit", label: language === "ID" ? "Temu Arsip Slide/Blok" : "Archive Retrieval" },
      ],
      preview: {
        badge: "Barcode 2D • Chain of Custody",
        stageTitle: "#PA-24-0982 (Biopsi Mammae Sinistra)",
        stageSub: language === "ID" ? "Grossing Selesai • 4 Slide H&E Terbit" : "Grossing Complete • 4 H&E Slides Stained",
        telemetryItems: [
          { label: "Kaset Parafin (2D)", val: "Kaset A1-A4 Terverifikasi", status: "Pass" },
          { label: "Slide Mikrotom", val: "4 Slide H&E Terbit", status: "Pass" },
          { label: "Diagnosa Terstandar", val: "ICD-O-3 8500/3 (Karsinoma)", status: "Ready" },
        ],
      },
    },
    {
      id: "microbiology",
      slug: "microbiology",
      icon: FlaskConical,
      tag: language === "ID" ? "Mikrobiologi & Tim PPRA" : "Clinical Microbiology",
      tabLabel: language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology & PPRA",
      protocolBadge: "CLSI / EUCAST 2024",
      name: "Microbiology & Antibiotic Stewardship",
      tagline:
        language === "ID"
          ? "Kultur Bakteri, Uji Sensitivitas & Peta Antibiogram Rumah Sakit"
          : "Culture Incubation, Susceptibility Testing & Antibiogram Matrix",
      description:
        language === "ID"
          ? "Mengelola inkubasi kultur bakteri, membaca zona hambat antibiotik dengan pedoman CLSI/EUCAST, dan menghasilkan grafik Antibiogram kumulatif berkala untuk mendukung Program PPRA rumah sakit."
          : "Manages bacterial culture incubation, interprets AST panels under CLSI/EUCAST rules, and compiles automated cumulative hospital Antibiograms for antibiotic stewardship.",
      instruments: "bioMérieux VITEK 2 • BD BACTEC • BD Phoenix • MicroScan",
      highlights: [
        {
          title: language === "ID" ? "Peta Antibiogram Otomatis" : "Cumulative Antibiogram Engine",
          desc: language === "ID" ? "Peta pola resistensi kuman rumah sakit yang diperbarui secara otomatis per periode." : "Automated pathogen resistance pattern mapping across inpatient wards.",
        },
        {
          title: language === "ID" ? "Peringatan Dini Kuman Resisten (MDRO)" : "MDRO / ESBL Early Alert",
          desc: language === "ID" ? "Peringatan seketika saat terdeteksi kuman multiresisten (MRSA, ESBL, CRE)." : "Instant notification upon detection of multi-drug resistant pathogens.",
        },
        {
          title: language === "ID" ? "Integrasi Mesin Kultur Otomatis" : "Direct Culture Interfacing",
          desc: language === "ID" ? "Terhubung langsung ke mesin VITEK 2, BD BACTEC, dan Phoenix tanpa perantara." : "Direct communication with VITEK 2, BACTEC, and Phoenix culture systems.",
        },
      ],
      metrics: [
        { val: "2x Cepat", label: language === "ID" ? "Rekomendasi Terapi Antibiotik" : "Definitive Therapy" },
        { val: "100%", label: language === "ID" ? "Kepatuhan PPRA Kemenkes" : "Stewardship Compliance" },
      ],
      preview: {
        badge: "VITEK-2 Ingested • CLSI 2024",
        stageTitle: "S. aureus (Blood Culture) • AST Panel",
        stageSub: language === "ID" ? "Inkubasi Hari ke-2 Selesai • MDRO Flagged" : "Day 2 Incubation Complete • MDRO Flagged",
        telemetryItems: [
          { label: "Vancomycin (MIC <= 0.5)", val: "SENSITIVE (S)", status: "Pass" },
          { label: "Cefoxitin / MRSA", val: "RESISTANT (R) — Flagged", status: "Alert" },
          { label: "Notifikasi Komite PPRA", val: "Broadcast Otomatis Terkirim", status: "Sent" },
        ],
      },
    },
  ];

  const currentMod = modulesList[selectedModule];
  const CurrentIcon = currentMod.icon;

  const analyzerCategories = [
    {
      category: language === "ID" ? "Hematologi & Kimia Klinik" : "Hematology & Chemistry",
      desc: language === "ID" ? "Interfacing ASTM E1381/E1394 & HL7 bidireksional" : "Bidirectional ASTM E1381/E1394 & HL7 protocols",
      brands: [
        { name: "Sysmex", models: "XN-550/1000/2000, XS, XN-L Series" },
        { name: "Roche Diagnostics", models: "Cobas 6000, 8000, pro c503/e801" },
        { name: "Abbott", models: "Architect c4000/ci8200, Alinity ci-series" },
        { name: "Mindray", models: "BC-6800Plus, BS-800M, CAL 8000" },
        { name: "Siemens Healthineers", models: "Atellica Solution, ADVIA 2120i" },
      ],
    },
    {
      category: language === "ID" ? "Mikrobiologi & Kultur Darah" : "Microbiology & Blood Culture",
      desc: language === "ID" ? "Integrasi ID/AST otomatis & pembacaan inkubasi" : "Automated ID/AST interfacing & incubation tracking",
      brands: [
        { name: "bioMérieux", models: "VITEK 2, BACT/ALERT 3D, VIRTUO" },
        { name: "Becton Dickinson (BD)", models: "BD BACTEC FX, BD Phoenix M50" },
        { name: "Beckman Coulter", models: "MicroScan WalkAway plus System" },
      ],
    },
    {
      category: language === "ID" ? "Bank Darah & Patologi Anatomi" : "Blood Bank & Pathology",
      desc: language === "ID" ? "Validasi uji silang serasi & scanner slide WSI" : "Crossmatch automation & whole-slide digital scanning",
      brands: [
        { name: "Ortho Clinical Diagnostics", models: "Ortho Vision, Vision Max" },
        { name: "Grifols", models: "Wadiana, Erytra Auto-analyzer" },
        { name: "Leica Biosystems", models: "HistoCore Tissue Processor, Aperio WSI" },
        { name: "Sakura Finetek", models: "Tissue-Tek VIP 6 AI, AutoWrite 2D" },
      ],
    },
  ];

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
          text: language === "ID" ? "Eksplorasi Pusat Kendali" : "Explore Control Station",
          href: "#modules-station",
        }}
        metrics={[
          {
            value: language === "ID" ? "5 Modul" : "5 Modules",
            label: language === "ID" ? "Spesialisasi Penuh" : "Dedicated Modules",
            sub: language === "ID" ? "Rutin, BDRS, Stok, PA, Mikro" : "Hematology, Blood, Reagents, PA",
          },
          {
            value: "500+",
            label: language === "ID" ? "Alat Terhubung" : "Analyzers Supported",
            sub: language === "ID" ? "ASTM & HL7 native" : "Zero middleware needed",
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
          SECTION 1: SPLIT-SCREEN LIVE DIAGNOSTIC WORKSTATION
          (Interactive Left Module Navigator + Live Right Console Screen)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="modules-station"
        className="scroll-mt-24 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Pusat Kendali Spesialisasi" : "Specialized Control Console"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Alur Kerja Teruji untuk Setiap Departemen</>
              ) : (
                <>Battle-Tested Workflows for Every Clinical Department</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Pilih modul di sebelah kiri untuk melihat telemetri instrumen langsung, alur validasi hasil klinis, dan target performa operasional di monitor kerja."
                : "Select any module on the left to explore live instrument telemetry, clinical validation flows, and operational KPIs on the live workstation."}
            </p>
          </div>

          {/* Split-Screen Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: 5 Interactive Module Rows (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {modulesList.map((m, idx) => {
                const Icon = m.icon;
                const isActive = selectedModule === idx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModule(idx)}
                    className={cn(
                      "w-full text-left p-4 sm:p-5 rounded-[22px] transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 border",
                      isActive
                        ? "bg-white border-[#2764B8] shadow-[0_8px_24px_rgba(39,100,184,0.12)] ring-1 ring-[#2764B8]"
                        : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                          isActive
                            ? "bg-[#2764B8] text-white shadow-xs"
                            : "bg-[#F0F5FA] text-[#2764B8]"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                            MOD-0{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium truncate">
                            {m.protocolBadge}
                          </span>
                        </div>
                        <h4 className={cn("text-sm sm:text-base font-bold truncate", isActive ? "text-[#2764B8]" : "text-slate-900")}>
                          {m.tabLabel}
                        </h4>
                        <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
                          {m.tag}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-[#2764B8] animate-pulse" />
                      )}
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isActive ? "text-[#2764B8] translate-x-0.5" : "text-slate-300"
                        )}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Live Workstation Screen (7 cols) */}
            <div className="lg:col-span-7 sticky top-28">
              <div className="rounded-[26px] bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(31,45,93,0.12)] overflow-hidden">
                {/* Window Titlebar */}
                <div className="bg-[#FAFBFD] px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded shadow-2xs">
                      Diagnova Live Station — {currentMod.name}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE INTERFACED
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-7 space-y-6">
                  {/* Module Header Strip */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full font-mono">
                        {currentMod.tag}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {currentMod.protocolBadge}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                      {currentMod.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm font-semibold text-[#345DAB]">
                      {currentMod.tagline}
                    </p>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {currentMod.description}
                    </p>
                  </div>

                  {/* Telemetry Stage Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#F8FBFE] via-white to-[#F8FBFE] border border-blue-100/90 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100/60">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {currentMod.preview.stageTitle}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {currentMod.preview.stageSub}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#2764B8] bg-white border border-blue-200 px-2.5 py-1 rounded-lg shadow-2xs">
                        {currentMod.preview.badge}
                      </span>
                    </div>

                    {/* 3 Telemetry Data Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      {currentMod.preview.telemetryItems.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                          <span className="text-[10px] text-slate-400 block truncate">{item.label}</span>
                          <span className="font-bold text-slate-800 text-xs block mt-0.5 truncate">{item.val}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">● {item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Core Highlights */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      {language === "ID" ? "Kapabilitas Arsitektur Klinis:" : "Core Architectural Capabilities:"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {currentMod.highlights.map((h, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                            <span className="truncate">{h.title}</span>
                          </h5>
                          <p className="text-[11px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                            {h.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Impact Metrics & Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {currentMod.metrics.map((m, i) => (
                        <div key={i}>
                          <span className="font-display text-lg sm:text-xl font-bold text-[#345DAB] block leading-tight">
                            {m.val}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/modules/${currentMod.slug}`}
                        className="text-xs font-semibold text-slate-700 hover:text-[#2764B8] transition-colors"
                      >
                        {language === "ID" ? "Buka Spesifikasi Lengkap →" : "View Full Specs →"}
                      </Link>
                      <Link
                        href="/request-demo"
                        className="group inline-flex items-center gap-1.5 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-5 py-2.5 text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <span>{language === "ID" ? "Konsultasi Modul Ini" : "Consult Module"}</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 500+ ANALYZER DIRECT INTERFACING DIRECTORY
          (High Technical Credibility for Lab Directors & Hospital IT)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="analyzer-compatibility"
        className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-14">
            <div className="mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Ekosistem Interfacing 500+ Alat" : "Direct Instrument Ecosystem"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Terhubung Langsung ke 500+ Instrumen Medis Tanpa Middleware</>
              ) : (
                <>Direct Interfacing to 500+ Medical Analyzers Without Middleware</>
              )}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Diagnova berkomunikasi secara native melalui protokol ASTM E1381/E1394 dan HL7 v2.5 / FHIR, menghemat biaya lisensi middleware pihak ketiga hingga ratusan juta rupiah per tahun."
                : "Diagnova communicates natively via ASTM E1381/E1394 and HL7 v2.5 / FHIR protocols, eliminating recurring third-party middleware licensing costs entirely."}
            </p>
          </div>

          {/* 3 Manufacturer Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mb-12">
            {analyzerCategories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/80 p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2764B8] bg-white border border-blue-200 px-3 py-1 rounded-full">
                      Kategori {idx + 1}
                    </span>
                    <Server className="h-4 w-4 text-[#2764B8]" />
                  </div>

                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {cat.category}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    {cat.desc}
                  </p>

                  <div className="pt-2 border-t border-blue-100/80 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      {language === "ID" ? "Merek & Seri Didukung:" : "Supported Manufacturers:"}
                    </span>
                    {cat.brands.map((b, bIdx) => (
                      <div key={bIdx} className="p-2.5 rounded-xl bg-white border border-slate-200/70 text-xs">
                        <span className="font-bold text-slate-900 block">{b.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block mt-0.5">{b.models}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-100/80 flex items-center justify-between text-[11px] font-mono text-emerald-700 font-bold">
                  <span>● 100% Native Bidirectional</span>
                  <span className="text-slate-400 font-normal">Plug &amp; Play</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Technical Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-[#F0F6FC] via-white to-[#F0F6FC] border border-blue-100/80">
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-white text-[#2764B8] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Zero Middleware Fee</h4>
                <p className="text-[11px] text-slate-600 font-normal mt-0.5 leading-relaxed">
                  {language === "ID" ? "Hemat Rp 50jt - 150jt lisensi middleware per laboratorium." : "Save millions annually by bypassing proprietary middleware."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-white text-[#2764B8] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Offline Buffer Safety</h4>
                <p className="text-[11px] text-slate-600 font-normal mt-0.5 leading-relaxed">
                  {language === "ID" ? "Hasil tes tetap tersimpan di memori lokal saat server SIMRS terputus." : "Local buffer ensures no test data is lost during network dropouts."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-white text-[#2764B8] flex items-center justify-center shrink-0 shadow-2xs border border-blue-100">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Bidirectional Worklist</h4>
                <p className="text-[11px] text-slate-600 font-normal mt-0.5 leading-relaxed">
                  {language === "ID" ? "Order dokter langsung mengisi worklist analyzer secara otomatis." : "Physician orders populate analyzer trays automatically without manual entry."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ZERO DATA SILOS (PATIENT RECORD CONVERGENCE)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="zero-silos"
        className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
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
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
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

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
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

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
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
