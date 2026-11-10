"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Network,
  Clock,
  Layers,
  FileCheck2,
  AlertTriangle,
  TrendingUp,
  Send,
  QrCode,
  FileText,
  Activity,
  Database,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function SolutionsPage() {
  const { language } = useLanguage();
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [subTab, setSubTab] = useState<"micro" | "blood">("micro");

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = solutionsList.findIndex((s) => s.id === hash);
        if (foundIndex !== -1) {
          setSelectedSolution(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const solutionsList = [
    {
      id: "hospital-laboratory",
      icon: Building2,
      tabLabel: language === "ID" ? "Rumah Sakit Sentral & IGD" : "Hospital Laboratory",
      targetAudience: language === "ID" ? "Rumah Sakit Tipe A, B, C & Khusus" : "Tier A, B, C & Specialty Hospitals",
      name: "Hospital Laboratory",
      tagline:
        language === "ID"
          ? "Ekosistem LIS Terintegrasi Penuh untuk Rumah Sakit Modern"
          : "Fully Integrated LIS Ecosystem for Modern Hospital Infrastructure",
      description:
        language === "ID"
          ? "Menghubungkan laboratorium sentral, IGD, ICU, dan bangsal rawat inap secara real-time. Order dokter dari SIMRS langsung menjadi worklist analyzer, dan panic values dikirim seketika ke layar dokter DPJP."
          : "Unifies central laboratories, ER, ICU, and inpatient wards in real time. HIS physician orders convert seamlessly into analyzer worklists, and panic values stream immediately to attending doctors.",
      highlights: [
        {
          title: language === "ID" ? "Bridging Dua Arah SIMRS & RME" : "Bidirectional HIS & EMR Bridging",
          desc: language === "ID" ? "Order otomatis masuk, hasil lab langsung terkirim ke rekam medis pasien." : "Inbound orders and outbound results sync instantly with hospital EMR.",
        },
        {
          title: language === "ID" ? "Notifikasi Panic Values IGD & ICU" : "Smart Panic Alerts for ER/ICU",
          desc: language === "ID" ? "Peringatan otomatis seketika saat terdeteksi hasil kritis berisiko tinggi." : "Automated urgent broadcast when life-threatening panic values are flagged.",
        },
        {
          title: language === "ID" ? "Pemantauan TAT Real-Time per Shift" : "Live TAT Monitoring per Shift",
          desc: language === "ID" ? "Lacak kepatuhan waktu tunggu hasil darah cito IGD di bawah 25 menit." : "Monitor stat test turnaround compliance to keep ER TAT under 25 minutes.",
        },
      ],
      metrics: [
        { val: language === "ID" ? "< 25 Menit" : "< 25 Mins", label: language === "ID" ? "TAT Hasil Cito IGD" : "Stat ER Panic TAT" },
        { val: "100%", label: language === "ID" ? "Bridging SIMRS & RME" : "Bidirectional HIS Sync" },
      ],
      previewInfo: {
        badge: "Hospital Central",
        focus: language === "ID" ? "Bridging SIMRS + Panic Alert + E-Sign" : "HIS Bridging + Panic Alert + E-Sign",
        tags: ["IGD & ICU Ready", "KARS & JCI", "Bedside Barcode"],
      },
    },
    {
      id: "clinical-laboratory",
      icon: Stethoscope,
      tabLabel: language === "ID" ? "Lab Klinik & MCU" : "Clinical & Reference Labs",
      targetAudience: language === "ID" ? "Laboratorium Klinik Mandiri & Pusat MCU" : "Commercial Outpatient Labs & MCU Centers",
      name: "Clinical Laboratory & MCU",
      tagline:
        language === "ID"
          ? "Throughput Tinggi, Registrasi Cepat & Pengiriman Hasil Digital"
          : "High-Volume Intake, Rapid Registration & Digital Patient Delivery",
      description:
        language === "ID"
          ? "Dirancang untuk menangani ribuan pasien harian dengan cepat. Mempercepat registrasi Medical Check-Up (MCU) massal, pencetakan barcode tabung, dan pengiriman hasil otomatis via WhatsApp & portal online."
          : "Engineered for high daily specimen volume. Accelerates corporate check-up (MCU) registration, automated tube labeling, and instant encrypted PDF delivery via WhatsApp and web portals.",
      highlights: [
        {
          title: language === "ID" ? "Mesin Registrasi MCU Korporat" : "Corporate MCU Batch Engine",
          desc: language === "ID" ? "Import data ratusan karyawan sekaligus dan cetak barcode tabung dalam 1 klik." : "Batch-import employee rosters and generate barcode labels in one click.",
        },
        {
          title: language === "ID" ? "Portal Hasil & WhatsApp Otomatis" : "Instant WhatsApp & Portal PDF",
          desc: language === "ID" ? "Pasien menerima laporan lab terenkripsi langsung di ponsel tanpa antre loket." : "Patients receive secure encrypted PDF reports directly on their mobile phones.",
        },
        {
          title: language === "ID" ? "Gateway Jejaring Rujukan B2B" : "B2B Reference Network Gateway",
          desc: language === "ID" ? "Kelola order rujukan dari klinik mitra dengan billing dan pelaporan terpadu." : "Seamlessly manage outreach sample orders and corporate billing tiers.",
        },
      ],
      metrics: [
        { val: language === "ID" ? "30 Detik" : "30 Sec", label: language === "ID" ? "Waktu Registrasi per Pasien" : "Registration Time per Patient" },
        { val: "100%", label: language === "ID" ? "Paperless Digital Delivery" : "Paperless Delivery" },
      ],
      previewInfo: {
        badge: "Outpatient & MCU",
        focus: language === "ID" ? "Batch MCU + WhatsApp PDF + B2B Billing" : "Batch MCU + WhatsApp PDF + B2B Billing",
        tags: ["Fast Registration", language === "ID" ? "Portal Pasien" : "Patient Portal", "B2B Outreach"],
      },
    },
    {
      id: "pathology",
      icon: Microscope,
      tabLabel: language === "ID" ? "Patologi Anatomi" : "Anatomical Pathology",
      targetAudience: language === "ID" ? "Instalasi Patologi Anatomi & Sitopatologi" : "Pathology Institutes & Histology Labs",
      name: "Anatomical Pathology",
      tagline:
        language === "ID"
          ? "Pelacakan Barcode 2D pada Kaset Jaringan, Slide & Diagnosa Terstandar"
          : "2D Barcode Tissue Tracking Across Cassettes, Slides & Synoptic Staging",
      description:
        language === "ID"
          ? "Melacak spesimen jaringan biopsi pada setiap kaset dan slide kaca menggunakan barcode mikro 2D. Mendukung dokter spesialis patologi menyusun diagnosa kanker terstandar ICD-O dan Bethesda."
          : "Tracks tissue biopsy specimens across cassettes and glass slides with 2D micro-barcodes. Equips pathologists with standardized cancer synoptic templates (ICD-O, Bethesda).",
      highlights: [
        {
          title: language === "ID" ? "Barcode 2D pada Kaset & Slide" : "2D Micro-Barcode Tracking",
          desc: language === "ID" ? "Menghilangkan risiko jaringan tertukar di tahap grossing, pemotongan, atau pengecatan." : "Zero risk of sample mix-up across grossing, embedding, microtomy, and staining.",
        },
        {
          title: language === "ID" ? "Template Terstandar ICD-O" : "Standardized Synoptic Reports",
          desc: language === "ID" ? "Format baku internasional untuk histopatologi, biopsi beku, dan FNAB sitologi." : "Standardized synoptic templates for histopathology, frozen sections, and FNAB.",
        },
        {
          title: language === "ID" ? "Pencarian Arsip Blok Jaringan Cepat" : "Fast Paraffin Block Retrieval",
          desc: language === "ID" ? "Akses riwayat biopsi pasien sebelumnya dalam hitungan detik untuk second opinion." : "Retrieve historical tissue blocks and previous slides in seconds for consults.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Spesimen Tertukar" : "Specimen Mix-ups" },
        { val: language === "ID" ? "< 1 Menit" : "< 1 Min", label: language === "ID" ? "Pencarian Arsip Blok/Slide" : "Archive Retrieval" },
      ],
      previewInfo: {
        badge: "Anatomical Pathology",
        focus: language === "ID" ? "Tracking Kaset 2D + Template ICD-O" : "2D Cassette Tracking + ICD-O Reporting",
        tags: ["Zero Mix-up", "Whole Slide Ready", language === "ID" ? "Arsip Digital" : "Digital Archive"],
      },
    },
    {
      id: "microbiology",
      icon: FlaskConical,
      tabLabel: language === "ID" ? "Mikrobiologi & PPRA" : "Microbiology & Stewardship",
      targetAudience: language === "ID" ? "Lab Mikrobiologi Klinik & Komite PPRA RS" : "Clinical Microbiology & Hospital PPRA Committees",
      name: "Microbiology & Antibiotic Stewardship",
      tagline:
        language === "ID"
          ? "Kultur Kuman, Uji Kepekaan Antibiotik & Matriks Antibiogram PPRA"
          : "Culture Incubation, Susceptibility Testing & Hospital Antibiograms",
      description:
        language === "ID"
          ? "Mengelola inkubasi kultur bakteri, membaca zona hambat antibiotik dengan pedoman CLSI/EUCAST, dan menghasilkan grafik Antibiogram kumulatif berkala untuk mendukung Program PPRA rumah sakit."
          : "Tracks bacterial culture incubation, interprets AST panels under CLSI/EUCAST rules, and compiles automated cumulative hospital Antibiograms to support antimicrobial stewardship.",
      highlights: [
        {
          title: language === "ID" ? "Pembangkit Antibiogram Otomatis" : "Automated Antibiogram Engine",
          desc: language === "ID" ? "Peta pola resistensi kuman rumah sakit yang diperbarui secara otomatis per periode." : "Real-time mapping of bacterial resistance patterns across inpatient wards.",
        },
        {
          title: language === "ID" ? "Peringatan Dini Kuman Resisten (MDRO)" : "MDRO / ESBL Early Warning",
          desc: language === "ID" ? "Peringatan seketika saat terdeteksi bakteri multiresisten (MRSA, ESBL, CRE)." : "Instant notification upon detection of multi-drug resistant hospital pathogens.",
        },
        {
          title: language === "ID" ? "Integrasi Mesin Kultur Otomatis" : "Automated AST Interfacing",
          desc: language === "ID" ? "Terhubung langsung ke mesin VITEK, Phoenix, dan BACTEC tanpa perantara." : "Direct communication with VITEK, Phoenix, and BACTEC automated culture systems.",
        },
      ],
      metrics: [
        { val: language === "ID" ? "2x Cepat" : "2x Faster", label: language === "ID" ? "Rekomendasi Terapi Antibiotik" : "Definitive Therapy Speed" },
        { val: "100%", label: language === "ID" ? "Kepatuhan PPRA Kemenkes" : "Stewardship Compliance" },
      ],
      previewInfo: {
        badge: "Microbiology & PPRA",
        focus: language === "ID" ? "Antibiogram Matriks + Alert MDRO" : "Antibiogram Matrix + MDRO Alerts",
        tags: ["CLSI / EUCAST", "VITEK / Phoenix", language === "ID" ? "Pencegahan Infeksi" : "Infection Control"],
      },
    },
    {
      id: "blood-bank",
      icon: HeartPulse,
      tabLabel: language === "ID" ? "Bank Darah (BDRS)" : "Blood Bank & Safety",
      targetAudience: language === "ID" ? "Bank Darah Rumah Sakit (BDRS) & UTD" : "Hospital Blood Banks (BDRS) & Blood Centers",
      name: "Blood Bank & Transfusion Safety",
      tagline:
        language === "ID"
          ? "Transfusi Aman dengan Kontrol Rantai Dingin & Uji Silang Serasi"
          : "Safe Transfusion with Cold-Chain Telemetry & Electronic Crossmatching",
      description:
        language === "ID"
          ? "Melacak siklus kantong darah dari penerimaan donor hingga transfusi ke pasien. Menghilangkan risiko inkompatibilitas ABO/Rh dengan verifikasi ganda dan memantau masa simpan FEFO."
          : "Tracks blood bags from donation receipt to patient bedside transfusion. Prevents ABO/Rh incompatibility via dual verification and minimizes wastage with FEFO inventory.",
      highlights: [
        {
          title: language === "ID" ? "Verifikasi Ganda Uji Silang Serasi" : "Dual-Check Crossmatching",
          desc: language === "ID" ? "Validasi kecocokan Mayor/Minor secara digital sebelum darah dikeluarkan ke bangsal." : "Digital validation of major/minor compatibility prior to ward release.",
        },
        {
          title: language === "ID" ? "Telemetri Suhu Rantai Dingin 24/7" : "24/7 Cold-Chain Telemetry",
          desc: language === "ID" ? "Log suhu penyimpanan 2°C - 6°C terpantau otomatis untuk menjamin kualitas kantong darah." : "Automated 2°C - 6°C cold-room logging safeguarding blood component viability.",
        },
        {
          title: language === "ID" ? "Rotasi FEFO & Pencegahan Kedaluwarsa" : "FEFO Wastage Prevention",
          desc: language === "ID" ? "Peringatan dini kantong mendekati tanggal kedaluwarsa untuk meminimalkan darah terbuang." : "Proactive alerts for expiring units to drive zero-wastage transfusion operations.",
        },
      ],
      metrics: [
        { val: "Zero Error", label: language === "ID" ? "Inkompatibilitas Darah" : "Transfusion Mismatch" },
        { val: "-45%", label: language === "ID" ? "Darah Kedaluwarsa Terbuang" : "Expired Blood Wastage" },
      ],
      previewInfo: {
        badge: "Blood Banking",
        focus: language === "ID" ? "Crossmatch Validasi + ISBT 128" : "Crossmatch Validation + ISBT 128",
        tags: ["ISBT 128", "Cold-Chain Log", "Zero Wastage"],
      },
    },
    {
      id: "nova-ai",
      icon: Sparkles,
      tabLabel: language === "ID" ? "Nova AI Intelligence" : "Nova AI Copilot",
      targetAudience: language === "ID" ? "Dokter Patologi, Manajemen Lab & Klinisi" : "Pathologists, Lab Directors & Clinicians",
      name: "Nova AI Clinical Copilot",
      tagline:
        language === "ID"
          ? "Deteksi Pergeseran Biomarker Kritis & Rangkuman Klinis Cerdas"
          : "Longitudinal Biomarker Shift Detection & Clinical Summarization",
      description:
        language === "ID"
          ? "Nova AI mendeteksi pergeseran biomarker abnormal antar-kunjungan pasien, menyajikan peringatan dini, dan merangkum angka klinis rumit menjadi narasi ringkas. Dokter tetap memegang kendali 100% atas keputusan medis."
          : "Nova AI detects longitudinal biomarker shifts across patient history, flags early anomalies, and translates complex figures into concise narratives. Physicians maintain 100% diagnostic authority.",
      highlights: [
        {
          title: language === "ID" ? "Deteksi Anomali Delta Check Cerdas" : "Intelligent Delta Shift Detection",
          desc: language === "ID" ? "Mengenali lonjakan tren nilai abnormal yang luput dari pemeriksaan rentang standar." : "Flags subtle trend spikes that fall within standard reference bounds.",
        },
        {
          title: language === "ID" ? "Rangkuman Narasi Medis untuk DPJP" : "Concise Diagnostic Summaries",
          desc: language === "ID" ? "Membantu dokter memahami tren biomarker pasien komorbid tanpa membaca tabel panjang." : "Generates high-yield executive summaries for attending hospital physicians.",
        },
        {
          title: language === "ID" ? "Prinsip AI Beretika & Transparan" : "Clinician-in-the-Loop Ethics",
          desc: language === "ID" ? "AI berperan sebagai asisten pengingat, keputusan diagnostik mutlak di tangan dokter." : "AI acts purely as an assistive copilot; full diagnostic sovereignty remains with doctors.",
        },
      ],
      metrics: [
        { val: "100%", label: language === "ID" ? "Kendali di Tangan Dokter" : "Physician Control" },
        { val: language === "ID" ? "Instan" : "Instant", label: language === "ID" ? "Deteksi Anomali Pasien" : "Anomaly Flagging" },
      ],
      previewInfo: {
        badge: "Nova AI Engine",
        focus: language === "ID" ? "Delta Check + Rangkuman Medis DPJP" : "Delta Check + Physician Summary",
        tags: ["Safe Copilot", "Delta AI", "Zero Black-Box"],
      },
    },
  ];

  const facilityTiers = [
    {
      id: "hospital",
      title: language === "ID" ? "Rumah Sakit Umum & Khusus" : "General & Specialty Hospitals",
      desc:
        language === "ID"
          ? "Dirancang untuk instalasi lab sentral, IGD, ICU, dan bangsal rawat inap dengan bridging dua arah ke SIMRS/RME."
          : "Engineered for central laboratories, ER, ICU, and inpatient wards with seamless two-way HIS/EMR bridging.",
      solutionsRecommended: [
        language === "ID" ? "Hospital Laboratory (Core LIS)" : "Hospital Laboratory (Core LIS)",
        language === "ID" ? "Bank Darah & Transfusi (BDRS)" : "Blood Bank & Transfusion Safety",
        language === "ID" ? "Patologi Anatomi & Sitologi" : "Anatomical Pathology & Cytology",
        language === "ID" ? "Mikrobiologi Klinis & PPRA" : "Microbiology & Antibiotic Stewardship",
      ],
      kpi: language === "ID" ? "TAT IGD < 25 Menit • Bridging Dua Arah SIMRS" : "ER TAT < 25 Mins • 100% HIS Bridging",
    },
    {
      id: "clinic",
      title: language === "ID" ? "Laboratorium Klinik & Rujukan" : "Clinical & Reference Labs",
      desc:
        language === "ID"
          ? "Dioptimalkan untuk volume spesimen tinggi, medical check-up (MCU) korporasi, registrasi barcode cepat, dan portal pasien online."
          : "Optimized for high specimen throughput, corporate check-ups (MCU), fast barcode dispatch, and online patient results.",
      solutionsRecommended: [
        language === "ID" ? "Laboratorium Klinik Mandiri" : "Independent Clinical Laboratory",
        language === "ID" ? "Modul Pemeriksaan MCU Massal" : "Mass Corporate MCU Engine",
        language === "ID" ? "Portal Hasil Online & WhatsApp PDF" : "Online Patient Portal & Encrypted PDF",
        language === "ID" ? "Manajemen Billing & B2B Rujukan" : "B2B Outreach & Billing Gateway",
      ],
      kpi: language === "ID" ? "Registrasi 30 Detik • 100% Pengiriman Digital" : "30s Registration • 100% Digital Delivery",
    },
    {
      id: "specialist",
      title: language === "ID" ? "Pusat Diagnostik Spesialis" : "Specialized Diagnostic Centers",
      desc:
        language === "ID"
          ? "Solusi khusus untuk laboratorium patologi anatomi jaringan, kultur mikrobiologi sensitivitas tinggi, dan bank darah mandiri."
          : "Tailored systems for histological tissue tracking, high-sensitivity microbial cultures, and dedicated blood banking.",
      solutionsRecommended: [
        language === "ID" ? "Patologi Anatomi & Slide Tracking" : "Anatomical Pathology & Slide Tracking",
        language === "ID" ? "Mikrobiologi & Antibiogram PPRA" : "Microbiology & Antibiogram Matrix",
        language === "ID" ? "Bank Darah & Cold-Chain Guard" : "Blood Bank & Cold-Chain Guard",
        language === "ID" ? "Nova AI Clinical Copilot" : "Nova AI Clinical Copilot",
      ],
      kpi: language === "ID" ? "Pelacakan 2D Micro-Barcode • Antibiogram CLSI" : "2D Micro-Barcode • Automated Antibiogram",
    },
  ];

  const currentSol = solutionsList[selectedSolution];
  const CurrentSolIcon = currentSol.icon;

  return (
    <div className="w-full bg-white text-slate-800">
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
          text: language === "ID" ? "Eksplorasi 6 Solusi Inti" : "Explore 6 Core Solutions",
          href: "#solutions-explorer",
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
            value: language === "ID" ? "6 Sektor" : "6 Sectors",
            label: language === "ID" ? "Solusi Terdedikasi" : "Specialized Verticals",
            sub: language === "ID" ? "RS, MCU, PA, BDRS, AI" : "Hospital, Outpatient, Labs",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          INTERACTIVE SOLUTION EXPLORER (VERSUS 2 DENGAN ICON KONSISTEN)
          ══════════════════════════════════════════════════════════════ */}
      <section id="solutions-explorer" className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {language === "ID" ? "Pilih Tipe Fasilitas & Solusi Spesifik" : "Select Facility Tier & Solutions"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              {language === "ID"
                ? "Klik solusi di bawah untuk melihat konfigurasi alur kerja, integrasi SIMRS, dan target performa klinis yang sesuai."
                : "Select any solution below to explore workflow architecture, HIS integrations, and operational target metrics."}
            </p>
          </div>

          {/* 6 Clean Tab Selector Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8 sm:mb-10">
            {solutionsList.map((s, idx) => {
              const Icon = s.icon;
              const isActive = selectedSolution === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSolution(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-[#F8FBFE] text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-[#2764B8]")} />
                  <span>{s.tabLabel}</span>
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
                      <CurrentSolIcon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
                      {currentSol.targetAudience}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                    {currentSol.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-[#345DAB]">
                    {currentSol.tagline}
                  </p>
                  <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {currentSol.description}
                  </p>
                </div>

                {/* 3 Core Highlights (Easily Scannable) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {language === "ID" ? "Kapabilitas Kunci Solusi:" : "Key Architectural Capabilities:"}
                  </h4>
                  <div className="space-y-2.5">
                    {currentSol.highlights.map((h, i) => (
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
                    <span className="relative z-10">{language === "ID" ? "Konsultasikan Solusi Ini" : "Consult This Setup"}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href={`#${currentSol.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-[#2764B8] transition-colors"
                  >
                    {language === "ID" ? "Lihat di Direktori ↓" : "View in Directory ↓"}
                  </a>
                </div>
              </div>

              {/* Right Column: Dynamic Discipline-Specific Micro-UI Stage */}
              <div className="lg:col-span-5 rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/90 shadow-[0_16px_40px_-12px_rgba(39,100,184,0.12)] overflow-hidden transition-all duration-300">
                {/* 1. Hospital Laboratory Stage */}
                {currentSol.id === "hospital-laboratory" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          #DX-CITO-4491
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        SIMRS BRIDGED • HL7
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Patient & CITO Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">Bpk. Suryadi (54 Th)</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                              CITO / IGD
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">Bed IGD-04 • DPJP: Dr. dr. Handoko, Sp.PK</span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-mono">
                          TAT: 14m (&lt;25m)
                        </span>
                      </div>

                      {/* Bridge Flow Pipeline */}
                      <div className="p-2.5 rounded-xl bg-[#F8FBFE] border border-blue-100/80">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <div className="text-center">
                            <span className="block font-bold text-slate-700">SIMRS Order</span>
                            <span className="text-slate-400">07:50 WIB</span>
                          </div>
                          <span className="h-0.5 w-6 bg-[#2764B8] rounded-full" />
                          <div className="text-center">
                            <span className="block font-bold text-slate-700">Cobas 6000</span>
                            <span className="text-slate-400">07:58 WIB</span>
                          </div>
                          <span className="h-0.5 w-6 bg-red-400 rounded-full" />
                          <div className="text-center">
                            <span className="block font-bold text-red-600">Panic Flag</span>
                            <span className="text-red-500 font-bold">08:04 WIB</span>
                          </div>
                        </div>
                      </div>

                      {/* Panic Value Alert Card */}
                      <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                            Troponin I Kuantitatif
                          </span>
                          <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                            NILAI KRITIS
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-base font-bold font-mono text-red-900">1.84 ng/mL</span>
                          <span className="text-[10px] text-red-600 font-mono">Rujukan &lt; 0.04 ng/mL</span>
                        </div>
                        <p className="text-[10px] text-red-700 pt-1 border-t border-red-200/60 leading-tight">
                          Notifikasi instan terkirim otomatis ke layar DPJP IGD &amp; WhatsApp dokter jaga.
                        </p>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">&lt; 25 Menit</span>
                          <span className="text-[10px] text-slate-600 font-medium">TAT Cito Darah IGD</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">100% Bridging</span>
                          <span className="text-[10px] text-slate-600 font-medium">SIMRS Dua Arah</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Clinical Laboratory & MCU Stage */}
                {currentSol.id === "clinical-laboratory" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          BATCH MCU #CORP-8821
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        PT TELKOM (450 PAX)
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Batch Import Progress Box */}
                      <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-[#2764B8]" />
                            Proses Cetak Barcode Massal
                          </span>
                          <span className="font-mono text-emerald-700 font-bold text-[11px]">450 / 450 Siap</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full w-full" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Auto-Generate Barcode Tabung</span>
                          <span className="text-emerald-700 font-semibold">0.4s / Peserta</span>
                        </div>
                      </div>

                      {/* WhatsApp PDF Dispatch Channel */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Send className="h-3.5 w-3.5 text-emerald-600" />
                            Pengiriman PDF Terenkripsi
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            99.6% Terkirim
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] font-mono text-slate-600">
                          <div className="flex items-center justify-between py-1 border-b border-slate-100">
                            <span>WA Gateway Bot</span>
                            <span className="text-slate-900 font-bold">448 Terkirim Langsung</span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span>Portal Hasil Online</span>
                            <span className="text-[#2764B8] font-bold">QR Token Valid</span>
                          </div>
                        </div>
                      </div>

                      {/* B2B Billing Status */}
                      <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Rekap Billing Korporasi:</span>
                        <span className="font-bold text-slate-900 font-mono">Net 30 • Bridged ERP</span>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">30 Detik</span>
                          <span className="text-[10px] text-slate-600 font-medium">Registrasi per Pasien</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">100% Digital</span>
                          <span className="text-[10px] text-slate-600 font-medium">Paperless WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Anatomical Pathology Stage */}
                {currentSol.id === "pathology" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          #PA-24-0982 (BIOPSI)
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        2D DATAMATRIX TRACKED
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* 2D Cassette & Slide Tracking Pipeline */}
                      <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Chain of Custody Jaringan</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                            Zero Mix-Up
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="block font-bold text-slate-800">Grossing</span>
                            <span className="text-slate-400">Kaset A1-A4</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="block font-bold text-slate-800">Microtomy</span>
                            <span className="text-slate-400">4 Slide Kaca</span>
                          </div>
                          <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 shadow-2xs">
                            <span className="block font-bold text-emerald-800">H&amp;E / IHC</span>
                            <span className="text-emerald-600 font-bold">Slide #A1 OK</span>
                          </div>
                        </div>
                      </div>

                      {/* Synoptic Reporting Card */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">Format Baku ICD-O</span>
                          <span className="text-[10px] font-mono text-[#2764B8] font-bold">ICD-O 8500/3</span>
                        </div>
                        <p className="text-xs font-semibold text-[#1F2D5D]">
                          Invasive Ductal Carcinoma, NST (Grade II)
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                          <span>DPJP: dr. Ratna, Sp.PA (K)</span>
                          <span className="text-emerald-700 font-bold">Digital Sign-Off</span>
                        </div>
                      </div>

                      {/* Whole Slide Digital Image Scan */}
                      <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Digital Whole Slide Scan:</span>
                        <span className="font-bold text-[#2764B8] font-mono">40x Zoom Ready</span>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">Zero Error</span>
                          <span className="text-[10px] text-slate-600 font-medium">Spesimen Tertukar</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">&lt; 1 Menit</span>
                          <span className="text-[10px] text-slate-600 font-medium">Temu Arsip Blok/Slide</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Microbiology & PPRA Stage */}
                {currentSol.id === "microbiology" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          KULTUR #MB-3312
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        VITEK-2 • CLSI 2024
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Pathogen Identification */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Staphylococcus aureus</span>
                          <span className="text-[11px] text-slate-500 font-mono">Spesimen: Kultur Darah (ICU Bed 02)</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-mono">
                          18h Positif
                        </span>
                      </div>

                      {/* Antibiogram Susceptibility (AST) Matrix */}
                      <div className="rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs">
                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase grid grid-cols-12">
                          <span className="col-span-5">Antibiotik</span>
                          <span className="col-span-3 text-right">MIC</span>
                          <span className="col-span-4 text-right">Interpretasi</span>
                        </div>
                        <div className="divide-y divide-slate-100 text-[11px] font-mono">
                          <div className="px-3 py-1.5 grid grid-cols-12 items-center">
                            <span className="col-span-5 font-bold text-slate-900">Vancomycin</span>
                            <span className="col-span-3 text-right text-slate-600">&le; 0.5</span>
                            <span className="col-span-4 text-right text-emerald-700 font-bold">SENSITIVE (S)</span>
                          </div>
                          <div className="px-3 py-1.5 grid grid-cols-12 items-center">
                            <span className="col-span-5 font-bold text-slate-900">Meropenem</span>
                            <span className="col-span-3 text-right text-slate-600">&le; 0.25</span>
                            <span className="col-span-4 text-right text-emerald-700 font-bold">SENSITIVE (S)</span>
                          </div>
                          <div className="px-3 py-1.5 grid grid-cols-12 items-center bg-red-50/50">
                            <span className="col-span-5 font-bold text-red-900">Cefoxitin / Oxa</span>
                            <span className="col-span-3 text-right text-red-700">&ge; 8.0</span>
                            <span className="col-span-4 text-right text-red-700 font-bold">RESISTANT (R)</span>
                          </div>
                        </div>
                      </div>

                      {/* PPRA Alert Banner */}
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs">
                        <span className="text-amber-900 font-bold flex items-center gap-1.5 text-[11px]">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          Alert MDRO / MRSA Terdeteksi
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono font-semibold">Komite PPRA Notified</span>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">2x Cepat</span>
                          <span className="text-[10px] text-slate-600 font-medium">Rekomendasi Terapi</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">100% PPRA</span>
                          <span className="text-[10px] text-slate-600 font-medium">Standar CLSI / EUCAST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Blood Bank & Transfusion Stage */}
                {currentSol.id === "blood-bank" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          CROSSMATCH #BDRS-8812
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ISBT-128 VERIFIED
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Recipient vs Donor Compatibility Grid */}
                      <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Uji Silang Serasi (Mayor / Minor)</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                            Kompatibel
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="text-slate-400 text-[10px] block">Pasien (Resipien)</span>
                            <span className="font-bold text-slate-900 block">Ny. Mariam (B+)</span>
                            <span className="text-emerald-700 text-[10px] font-bold">Mayor: Negatif (OK)</span>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="text-slate-400 text-[10px] block">Kantong Donor</span>
                            <span className="font-bold text-slate-900 block">#ID-0892 (B+ / PRC)</span>
                            <span className="text-emerald-700 text-[10px] font-bold">Minor: Negatif (OK)</span>
                          </div>
                        </div>
                      </div>

                      {/* Cold Chain 24/7 Telemetry Strip */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#2764B8]" />
                            Telemetri Rantai Dingin 24/7
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">3.8°C (Optimal)</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Kulkas BDRS Unit #02</span>
                          <span>Batas Aman: 2.0°C - 6.0°C</span>
                        </div>
                      </div>

                      {/* FEFO Expiry Guard */}
                      <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Rotasi FEFO Stok Darah:</span>
                        <span className="font-bold text-emerald-700 font-mono">Sisa 24 Hari • Siap Rilis</span>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">Zero Error</span>
                          <span className="text-[10px] text-slate-600 font-medium">Inkompatibilitas Darah</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">-45%</span>
                          <span className="text-[10px] text-slate-600 font-medium">Darah Expired Terbuang</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Nova AI Clinical Copilot Stage */}
                {currentSol.id === "nova-ai" && (
                  <div>
                    {/* Window Titlebar */}
                    <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                          <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          LONGITUDINAL DELTA CHECK
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        NOVA AI ACTIVE • COPILOT
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      {/* Trendline Delta Shift Box */}
                      <div className="p-3 rounded-xl bg-[#F8FBFE] border border-blue-100/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">Pergeseran Biomarker Kreatinin</span>
                          <span className="text-[10px] font-mono text-red-700 bg-red-100 px-1.5 py-0.5 rounded font-bold">
                            Spike +115%
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="text-slate-400 block">3 Bln Lalu</span>
                            <span className="font-bold text-slate-800">1.1 mg/dL</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                            <span className="text-slate-400 block">1 Bln Lalu</span>
                            <span className="font-bold text-slate-800">1.3 mg/dL</span>
                          </div>
                          <div className="bg-red-50 p-1.5 rounded-lg border border-red-200 shadow-2xs">
                            <span className="text-red-500 font-bold block">Hari Ini</span>
                            <span className="font-bold text-red-700">2.8 mg/dL</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Medical Summary for DPJP */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#2764B8]" />
                            Rangkuman Klinis Nova AI
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Asisten Klinis</span>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          Terdeteksi lonjakan serum kreatinin akut (+115% vs baseline). Disarankan evaluasi Acute Kidney Injury (AKI) sebelum peresepan obat nefrotoksik.
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                          <span>Etika AI: Transparan &amp; Terbuka</span>
                          <span className="text-emerald-700 font-bold">Otorisasi Mutlak di Dokter</span>
                        </div>
                      </div>

                      {/* Clinician in the Loop Tag */}
                      <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">Validasi Dokter DPJP:</span>
                        <span className="font-bold text-[#2764B8] font-mono">100% Keputusan Klinis</span>
                      </div>

                      {/* Metrics Pill Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-emerald-600 block">100%</span>
                          <span className="text-[10px] text-slate-600 font-medium">Kendali di Tangan Dokter</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center shadow-2xs">
                          <span className="text-base font-bold font-display text-[#345DAB] block">Instan</span>
                          <span className="text-[10px] text-slate-600 font-medium">Deteksi Anomali Pasien</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPLETE SOLUTIONS DIRECTORY: MODERN SAASET-STYLE BENTO GRID
          (Row 1: 3 Bento Cards with Pastel Tints | Row 2: 2 Asymmetrical Cards 65%:35%)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header (Centered Clean Typography) */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === "ID" ? "Mengapa Diagnova?" : "Why Diagnova?"}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID"
                ? "Dirancang untuk Efisiensi Mutlak Laboratorium"
                : "Designed to Make Laboratory Work Effortless"}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Alur kerja terintegrasi dari bridging SIMRS, registrasi MCU massal, hingga ringkasan klinis Nova AI."
                : "Experience a smoother, smarter way to run clinical workflows from HIS bridging to Nova AI summaries."}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ROW 1: 3 Bento Cards with Soft Pastel Gradient Backdrops
              ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Card 1: Hospital Laboratory (Warm Sunset / Peach Tint) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: 3 Stacked Floating Glass Pills */}
              <div className="h-56 sm:h-60 w-full rounded-2xl bg-gradient-to-b from-[#FFF2EB] via-[#FFF7F2] to-[#FFFBF8] border border-orange-100/80 relative flex flex-col justify-center gap-2.5 p-4 sm:p-5 overflow-hidden mb-6">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/90 shadow-[0_4px_12px_rgba(251,146,60,0.12)] flex items-center gap-2.5 text-xs font-semibold text-slate-800 transition-transform group-hover:translate-x-1 duration-200">
                  <div className="h-7 w-7 rounded-lg bg-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                    <Building2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{language === "ID" ? "Bridging Otomatis SIMRS & RME" : "Automated HIS & EMR Bridging"}</span>
                </div>

                <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/90 shadow-[0_4px_12px_rgba(251,146,60,0.12)] flex items-center gap-2.5 text-xs font-semibold text-slate-800 transition-transform group-hover:translate-x-1.5 duration-200">
                  <div className="h-7 w-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <span>{language === "ID" ? "Panic Values IGD & ICU < 25m" : "ER & ICU Panic Alerts < 25m"}</span>
                </div>

                <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/90 shadow-[0_4px_12px_rgba(251,146,60,0.12)] flex items-center gap-2.5 text-xs font-semibold text-slate-800 transition-transform group-hover:translate-x-1 duration-200">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <span>{language === "ID" ? "Bedside Barcode Scanner Flebotomi" : "Bedside Phlebotomy Barcode"}</span>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Hospital Laboratory Sentral" : "Central Hospital Laboratory"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Menghubungkan lab sentral dengan IGD, ICU, dan bangsal tanpa risiko antrean ketik manual."
                    : "Unifies central lab operations with ER and ICU, eliminating manual transcription errors."}
                </p>
              </div>
            </div>

            {/* Card 2: Clinical Laboratory & MCU (Soft Ice Blue Tint) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Schedule & Batch Modal */}
              <div className="h-56 sm:h-60 w-full rounded-2xl bg-gradient-to-b from-[#EBF5FE] via-[#F2F8FE] to-[#F8FBFE] border border-blue-100/80 relative flex flex-col justify-center p-4 sm:p-5 overflow-hidden mb-6">
                <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-[0_6px_20px_rgba(39,100,184,0.1)] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Batch Ingested
                    </span>
                    <span className="text-[#2764B8] font-bold">PT Telkom (450 Pax)</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {language === "ID" ? "Registrasi MCU Korporat" : "Corporate MCU Roster"}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      450 Barcode Terbit • 0.4s / Peserta
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <div className="flex -space-x-1.5">
                        <span className="h-5 w-5 rounded-full bg-blue-100 text-[#2764B8] border border-white flex items-center justify-center font-bold text-[8px]">
                          A
                        </span>
                        <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 border border-white flex items-center justify-center font-bold text-[8px]">
                          B
                        </span>
                        <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 border border-white flex items-center justify-center font-bold text-[8px]">
                          C
                        </span>
                      </div>
                      <span className="font-mono text-slate-500">+447 Lainnya</span>
                    </div>
                    <span className="text-[#2764B8] font-semibold flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      WhatsApp PDF
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Clinical Lab & MCU Massal" : "Clinical & Reference Labs"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Throughput tinggi ribuan spesimen harian dengan registrasi kilat dan kirim PDF via WhatsApp."
                    : "High daily volume handling with rapid check-in and automated encrypted WhatsApp delivery."}
                </p>
              </div>
            </div>

            {/* Card 3: Anatomical Pathology (Soft Mint Tint) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-emerald-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Milestone Tracking Widget */}
              <div className="h-56 sm:h-60 w-full rounded-2xl bg-gradient-to-b from-[#EBFDF3] via-[#F2FEF7] to-[#F8FEFA] border border-emerald-100/80 relative flex flex-col justify-center p-4 sm:p-5 overflow-hidden mb-6">
                <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/90 shadow-[0_6px_20px_rgba(16,185,129,0.1)] space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">Alur Kaset &amp; Slide</span>
                    <span className="text-emerald-700 font-mono font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Zero Mix-Up
                    </span>
                  </div>

                  {/* Milestone Stages Indicator */}
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono font-bold">
                    <span className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      G
                    </span>
                    <span className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      E
                    </span>
                    <span className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      M
                    </span>
                    <span className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                      S
                    </span>
                    <span className="h-6 w-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      V
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                    <span>#PA-24-0982 (Biopsi)</span>
                    <span className="text-slate-700 font-semibold">ICD-O 8500/3</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[10px]">
                    <button
                      type="button"
                      className="flex-1 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Arsip Blok
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-1 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                    >
                      Validasi Sp.PA
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Patologi Anatomi Presisi" : "Anatomical Pathology"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Pelacakan kaset dan slide kaca ber-barcode mikro 2D untuk eliminasi risiko sampel tertukar."
                    : "2D micro-barcode tracking across cassettes and glass slides for zero specimen mix-ups."}
                </p>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              ROW 2: 2 Asymmetrical Cards (Wide 65% + Narrow 35%)
              ══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Card 4 (Wide ~65% / lg:col-span-8): Mikrobiologi PPRA & Bank Darah BDRS */}
            <div className="lg:col-span-8 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: Interactive Toolbar, Analytics Boxes & Prompt Input */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] to-[#F1F6FC] border border-slate-200/80 mb-6 space-y-3.5">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-2xs gap-1">
                    <button
                      type="button"
                      onClick={() => setSubTab("micro")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        subTab === "micro"
                          ? "bg-[#2764B8] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Kultur Mikrobiologi PPRA
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab("blood")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        subTab === "blood"
                          ? "bg-[#2764B8] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Bank Darah (BDRS)
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                    ● Real-Time Telemetry
                  </span>
                </div>

                {/* 3 Analytics Cards Grid */}
                {subTab === "micro" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Isolat Kuman</span>
                      <span className="font-bold text-xs text-slate-900 block truncate">S. aureus (18h)</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">VITEK-2 Ingested</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Sensitivitas Utama</span>
                      <span className="font-bold text-xs text-emerald-700 block truncate">Vancomycin (S)</span>
                      <span className="text-[10px] font-mono text-slate-600">MIC &le; 0.5 µg/mL</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-red-200/80 shadow-2xs space-y-1">
                      <span className="text-[10px] text-red-600 font-mono block font-bold">Resistensi Terdeteksi</span>
                      <span className="font-bold text-xs text-red-700 block truncate">Cefoxitin / MRSA (R)</span>
                      <span className="text-[10px] font-mono text-red-600">PPRA Alert Sent</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Resipien Pasien</span>
                      <span className="font-bold text-xs text-slate-900 block truncate">Ny. Mariam (B+)</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">Mayor: Negatif (OK)</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Kantong Donor</span>
                      <span className="font-bold text-xs text-slate-900 block truncate">#ID-0892 (B+ PRC)</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">Minor: Negatif (OK)</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono block">Suhu Kulkas BDRS</span>
                      <span className="font-bold text-xs text-[#2764B8] block truncate">3.8°C (Optimal)</span>
                      <span className="text-[10px] font-mono text-emerald-700 font-semibold">FEFO: Sisa 24 Hari</span>
                    </div>
                  </div>
                )}

                {/* Bottom Search / Prompt Input Bar (Matching Saaset Reference) */}
                <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 truncate text-[11px] font-mono">
                    {subTab === "micro"
                      ? "Cari riwayat kultur kuman atau pola resistensi antibiogram..."
                      : "Cari stok kantong darah BDRS atau nomor uji silang serasi..."}
                  </span>
                  <button
                    type="button"
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white px-3.5 py-1 rounded-full text-xs font-bold transition-colors shrink-0 shadow-2xs"
                  >
                    Enter
                  </button>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors">
                  {language === "ID"
                    ? "Mikrobiologi PPRA & Bank Darah BDRS"
                    : "Microbiology Stewardship & Blood Bank"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Kendali penuh kultur kuman antibiotik terstandar CLSI dan uji silang serasi darah 100% aman tanpa risiko fatal."
                    : "Complete command for CLSI-compliant stewardship antibiograms and 100% zero-mismatch blood transfusions."}
                </p>
              </div>
            </div>

            {/* Card 5 (Narrow ~35% / lg:col-span-4): Rangkuman Klinis Nova AI (Matching Saaset "Summary" Card) */}
            <div className="lg:col-span-4 rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Visual Stage: AI Clinical Narrative Summary */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAFBFD] to-[#F8FAFD] border border-slate-200/80 mb-6 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#2764B8]" />
                    Summary Nova AI
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    Delta Check
                  </span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed font-normal">
                  <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    Terdeteksi lonjakan biomarker serum Kreatinin (+115% vs baseline 3 bulan lalu).
                  </p>
                  <p className="p-2 rounded-lg bg-white border border-slate-100 shadow-2xs">
                    Rekomendasi DPJP: Lakukan evaluasi Acute Kidney Injury (AKI) sebelum memulai peresepan nefrotoksik.
                  </p>
                  <p className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-800 font-medium">
                    Otorisasi Klinis: Keputusan diagnostik dan tindakan medis 100% di tangan dokter spesialis.
                  </p>
                </div>
              </div>

              {/* Bottom Content */}
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-1.5 group-hover:text-[#2764B8] transition-colors">
                  {language === "ID" ? "Rangkuman Klinis Nova AI" : "Nova AI Clinical Summaries"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
          SECTION 2: FACILITY FIT MATRIX (CLEAN & SCANNABLE)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Kesesuaian Institusi" : "Institution Matrix"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Pilih Paket Solusi Sesuai Skala Faskes Anda</>
              ) : (
                <>Match Solutions to Your Operational Tier</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Diagnova beradaptasi dengan kapasitas Anda. Lihat paket solusi dan modul yang direkomendasikan berdasarkan tipe fasilitas kesehatan Anda."
                : "Diagnova scales to your institution. Review recommended architectures and modules tailored to your operational tier."}
            </p>
          </div>

          {/* 3 Clean Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {facilityTiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/80 p-7 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-blue-200 text-xs font-semibold text-[#2764B8]">
                    Tier {idx + 1}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {tier.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                    {tier.desc}
                  </p>

                  <div className="pt-2 border-t border-blue-100/80 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {language === "ID" ? "Paket Rekomendasi:" : "Recommended Package:"}
                    </span>
                    {tier.solutionsRecommended.map((sol, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-100/80">
                  <span className="text-xs font-bold text-[#345DAB] block mb-3">
                    {tier.kpi}
                  </span>
                  <Link
                    href="/request-demo"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 py-2.5 text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>{language === "ID" ? "Konsultasi Tier Ini" : "Consult This Tier"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
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
