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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

export default function SolutionsPage() {
  const { language } = useLanguage();
  const [selectedSolution, setSelectedSolution] = useState<number>(0);

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
        { val: "< 25 Menit", label: language === "ID" ? "TAT Hasil Cito IGD" : "Stat ER Panic TAT" },
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
        { val: "30 Detik", label: language === "ID" ? "Waktu Registrasi per Pasien" : "Registration Time per Patient" },
        { val: "100%", label: language === "ID" ? "Paperless Digital Delivery" : "Paperless Delivery" },
      ],
      previewInfo: {
        badge: "Outpatient & MCU",
        focus: language === "ID" ? "Batch MCU + WhatsApp PDF + B2B Billing" : "Batch MCU + WhatsApp PDF + B2B Billing",
        tags: ["Fast Registration", "Portal Pasien", "B2B Outreach"],
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
        { val: "< 1 Menit", label: language === "ID" ? "Pencarian Arsip Blok/Slide" : "Archive Retrieval" },
      ],
      previewInfo: {
        badge: "Anatomical Pathology",
        focus: language === "ID" ? "Tracking Kaset 2D + Template ICD-O" : "2D Cassette Tracking + ICD-O Reporting",
        tags: ["Zero Mix-up", "Whole Slide Ready", "Arsip Digital"],
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
        { val: "2x Cepat", label: language === "ID" ? "Rekomendasi Terapi Antibiotik" : "Definitive Therapy Speed" },
        { val: "100%", label: language === "ID" ? "Kepatuhan PPRA Kemenkes" : "Stewardship Compliance" },
      ],
      previewInfo: {
        badge: "Microbiology & PPRA",
        focus: language === "ID" ? "Antibiogram Matriks + Alert MDRO" : "Antibiogram Matrix + MDRO Alerts",
        tags: ["CLSI / EUCAST", "VITEK / Phoenix", "Pencegahan Infeksi"],
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
        { val: "Instan", label: language === "ID" ? "Deteksi Anomali Pasien" : "Anomaly Flagging" },
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
          HERO SECTION: Sesuai Versi Pertama (Lengkap dengan 4 Metric Cards)
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-100">
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
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl font-light">
              {language === "ID"
                ? "Dari rumah sakit sentral dengan IGD bertekanan tinggi hingga jejaring lab klinik mandiri. Diagnova menghadirkan solusi yang dirancang sesuai regulasi dan alur kerja spesifik Anda."
                : "From high-acuity hospital networks to high-throughput clinical check-up laboratories. Diagnova delivers tailored architectures engineered for your specific clinical workflows."}
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
                href="#solutions-explorer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Eksplorasi 6 Solusi Inti" : "Explore 6 Core Solutions"}</span>
              </a>
            </div>

            {/* 4 Key Metric Cards (Persis Style Versi Pertama) */}
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
          INTERACTIVE SOLUTION EXPLORER (VERSUS 2 DENGAN ICON KONSISTEN)
          ══════════════════════════════════════════════════════════════ */}
      <section id="solutions-explorer" className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-8 sm:mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {language === "ID" ? "Pilih Tipe Fasilitas & Solusi Spesifik" : "Select Facility Tier & Solutions"}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500 font-light">
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
                  <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                    {currentSol.description}
                  </p>
                </div>

                {/* 3 Core Highlights (Easily Scannable) */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === "ID" ? "Kapabilitas Kunci Solusi:" : "Key Architectural Capabilities:"}
                  </h4>
                  <div className="space-y-2.5">
                    {currentSol.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            {h.title}
                          </p>
                          <p className="text-xs text-slate-500 font-light mt-0.5 leading-relaxed">
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                  >
                    <span>{language === "ID" ? "Konsultasikan Solusi Ini" : "Consult This Setup"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`#${currentSol.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-[#2764B8] transition-colors"
                  >
                    {language === "ID" ? "Lihat di Direktori ↓" : "View in Directory ↓"}
                  </a>
                </div>
              </div>

              {/* Right Column: Clean Solution Preview Card */}
              <div className="lg:col-span-5 rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    <span className="ml-2 text-xs font-semibold text-slate-700">Diagnova Setup</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2764B8] font-bold">
                    {currentSol.previewInfo.badge}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-800">
                    {currentSol.name} Architecture
                  </p>
                  <p className="text-[11px] text-slate-500 font-light mt-0.5">
                    {currentSol.previewInfo.focus}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {currentSol.metrics.map((m, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-[#F8FBFE] border border-blue-100/70">
                      <span className="font-display text-2xl font-bold text-[#345DAB] block tracking-tight">
                        {m.val}
                      </span>
                      <span className="text-xs font-medium text-slate-600 block mt-1 leading-snug">
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentSol.previewInfo.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          COMPLETE SOLUTIONS DIRECTORY (ICON KONSISTEN)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Direktori Solusi" : "Solutions Directory"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Daftar Lengkap 6 Solusi Spesialis</>
              ) : (
                <>Complete Suite of 6 Purpose-Built Solutions</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Ringkasan arsitektur terdedikasi untuk mempermudah evaluasi komite medis dan tim manajemen IT."
                : "A concise overview of dedicated configurations for streamlined clinical and IT leadership evaluation."}
            </p>
          </div>

          {/* Clean 6-Card Grid (3 Columns) with Consistent Icon Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutionsList.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.id}
                  id={sol.id}
                  className="scroll-mt-32 rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {/* Icon Box Konsisten Diagnova */}
                      <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        SOL-0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {sol.targetAudience}
                      </span>
                      <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                        {sol.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mt-2 line-clamp-3">
                        {sol.description}
                      </p>
                    </div>

                    {/* Quick Highlights */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                      {sol.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                          <span className="font-medium line-clamp-1">{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSolution(idx);
                        window.scrollTo({ top: 380, behavior: "smooth" });
                      }}
                      className="text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors cursor-pointer"
                    >
                      {language === "ID" ? "Buka di Explorer ↑" : "Open in Explorer ↑"}
                    </button>
                    <Link
                      href="/request-demo"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#2764B8] transition-colors"
                    >
                      <span>Demo</span>
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
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
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
                  <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                    {tier.desc}
                  </p>

                  <div className="pt-2 border-t border-blue-100/80 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
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
