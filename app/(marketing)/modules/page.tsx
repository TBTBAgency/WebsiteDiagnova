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
  const [activeCase, setActiveCase] = useState<number>(0);

  const reportCases = [
    {
      id: "pathology",
      label: language === "ID" ? "Patologi" : "Pathology",
      patientSummary:
        language === "ID"
          ? "Hasil pemeriksaan jaringan menunjukkan kondisi jinak (non-kanker). Tidak ditemukan sel ganas, atipia, maupun tanda pertumbuhan abnormal pada sampel yang diperiksa."
          : "Your tissue sample showed benign (non-cancerous) cells. No malignant cells, atypia, or signs of abnormal spread were detected.",
      patientMeaning:
        language === "ID"
          ? "Jaringan kecil yang diangkat bersifat tidak berbahaya. Kondisi jaringan di area pemeriksaan dinyatakan sehat, stabil, dan Anda dapat beraktivitas seperti biasa."
          : "The small tissue growth removed is harmless. Your body is healthy and stable in this area, with no immediate intervention required.",
      patientSteps: [
        language === "ID"
          ? "Jadwalkan kontrol rutin bersama dokter Anda dalam 6 bulan ke depan"
          : "Follow up with your physician in 6 months for routine review",
        language === "ID"
          ? "Tanyakan jadwal skrining berkala yang sesuai dengan riwayat kesehatan Anda"
          : "Ask about a routine screening schedule tailored to your health profile",
      ],
      clinicalHeading: language === "ID" ? "LAPORAN PATOLOGI" : "PATHOLOGY REPORT",
      clinicalFields: [
        {
          label: language === "ID" ? "Spesimen:" : "Specimen:",
          value: language === "ID" ? "Kulit, lengan bawah kiri, eksisi" : "Skin, left forearm, excision",
        },
        {
          label: "Diagnosis:",
          value:
            language === "ID"
              ? "Histiositoma fibrosa jinak (dermatofibroma)"
              : "Benign fibrous histiocytoma (dermatofibroma)",
        },
        {
          label: language === "ID" ? "Batas Sayatan:" : "Margins:",
          value: language === "ID" ? "Bebas jaringan lesi" : "Free of lesional tissue",
        },
        {
          label: language === "ID" ? "Mikroskopis:" : "Microscopic:",
          value:
            language === "ID"
              ? "Proliferasi fibroblas berbentuk gelendong dan histiosit dengan pola storiform pada lapisan dermis."
              : "Proliferation of spindle-shaped fibroblasts and histiocytes in a storiform pattern within the dermis.",
        },
        { label: "ICD-10:", value: "D23.62" },
        { label: "CPT:", value: "88305" },
      ],
    },
    {
      id: "hematology",
      label: language === "ID" ? "Hematologi" : "Hematology",
      patientSummary:
        language === "ID"
          ? "Seluruh parameter darah lengkap dan kadar gula darah rata-rata (HbA1c 5.4%) berada dalam rentang normal dan sehat."
          : "All complete blood count markers and 3-month average glucose (HbA1c 5.4%) are within healthy reference ranges.",
      patientMeaning:
        language === "ID"
          ? "Tidak ditemukan tanda anemia, infeksi aktif, maupun risiko diabetes. Metabolisme dan daya tahan tubuh Anda berada pada kondisi optimal."
          : "No signs of anemia, acute inflammation, or diabetes were found. Your blood health and metabolic baseline are stable.",
      patientSteps: [
        language === "ID"
          ? "Pertahankan pola makan seimbang, rendah gula tambahan, dan hidrasi 2L per hari"
          : "Maintain a balanced diet, limit added sugars, and stay well hydrated daily",
        language === "ID"
          ? "Lakukan pemeriksaan darah rutin tahunan sebagai pemantauan preventif"
          : "Schedule your routine annual wellness blood panel for ongoing prevention",
      ],
      clinicalHeading: language === "ID" ? "LAPORAN HEMATOLOGI & KIMIA" : "HEMATOLOGY & CHEMISTRY REPORT",
      clinicalFields: [
        {
          label: language === "ID" ? "Panel Uji:" : "Test Panel:",
          value: language === "ID" ? "Darah Lengkap (CBC) + HbA1c" : "Complete Blood Count (CBC) + HbA1c",
        },
        {
          label: language === "ID" ? "Hasil Kunci:" : "Key Findings:",
          value: "Hb 13.8 g/dL, WBC 6.9×10³/µL, PLT 265×10³/µL, HbA1c 5.4%",
        },
        {
          label: "Delta Check:",
          value:
            language === "ID"
              ? "Stabil dalam rentang baseline 12 bulan terakhir (-0.1%)"
              : "Stable within 12-month longitudinal baseline (-0.1%)",
        },
        {
          label: language === "ID" ? "Interpretasi:" : "Interpretation:",
          value:
            language === "ID"
              ? "Profil hematologi dan kontrol glikemik dalam batas normal tanpa tanda anemia atau inflamasi akut."
              : "Hematologic profile and glycemic control within normal limits without anemia or acute inflammation.",
        },
        { label: "ICD-10:", value: "Z00.00" },
        { label: "LOINC:", value: "58410-2" },
      ],
    },
    {
      id: "microbiology",
      label: language === "ID" ? "Mikrobiologi" : "Microbiology",
      patientSummary:
        language === "ID"
          ? "Hasil kultur laboratorium tidak menunjukkan adanya pertumbuhan bakteri penyebab infeksi saluran kemih."
          : "Laboratory culture showed no significant growth of bacteria responsible for urinary tract infection.",
      patientMeaning:
        language === "ID"
          ? "Keluhan ringan yang Anda rasakan bukan disebabkan oleh infeksi bakteri, sehingga Anda tidak perlu mengonsumsi antibiotik."
          : "Mild symptoms are not caused by a bacterial infection, meaning antibiotic treatment is not required.",
      patientSteps: [
        language === "ID"
          ? "Perbanyak konsumsi air putih minimal 2 liter per hari untuk menjaga kesehatan saluran kemih"
          : "Increase daily water intake to at least 2 liters to support urinary tract health",
        language === "ID"
          ? "Konsultasikan kembali ke dokter apabila keluhan menetap lebih dari 3 hari"
          : "Consult your doctor again if mild symptoms persist beyond 3 days",
      ],
      clinicalHeading: language === "ID" ? "LAPORAN KULTUR & KEPEKAAN" : "MICROBIOLOGY & AST REPORT",
      clinicalFields: [
        {
          label: language === "ID" ? "Spesimen:" : "Specimen:",
          value: language === "ID" ? "Urin porsi tengah (Midstream), kultur aerob" : "Midstream urine, aerobic culture",
        },
        {
          label: language === "ID" ? "Identifikasi:" : "Organism:",
          value:
            language === "ID"
              ? "Tidak ada pertumbuhan patogen bermakna (< 10³ CFU/mL)"
              : "No significant pathogen growth (< 10³ CFU/mL)",
        },
        {
          label: language === "ID" ? "Pewarnaan Gram:" : "Gram Stain:",
          value:
            language === "ID"
              ? "Sel epitel minimal, leukosit < 2/LPB, bakteri (-)"
              : "Minimal epithelial cells, WBC < 2/HPF, bacteria (-)",
        },
        {
          label: language === "ID" ? "Rekomendasi PPRA:" : "Stewardship:",
          value:
            language === "ID"
              ? "Tidak direkomendasikan terapi antibiotik empiris lanjutan."
              : "No further empiric antibiotic therapy recommended.",
        },
        { label: "ICD-10:", value: "Z03.89" },
        { label: "CPT:", value: "87086" },
      ],
    },
  ];

  const currentReport = reportCases[activeCase];

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
        className="relative scroll-mt-24 w-full bg-white py-12 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-2xl mb-8 sm:mb-12 lg:mb-14">
            <div className="mb-3 sm:mb-3.5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Nova AI • Pelaporan Pasien" : "Nova AI • Patient Reporting"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[38px] font-bold text-slate-900 tracking-tight leading-[1.2]">
              {language === "ID"
                ? "Laporan Pasien Cerdas dengan Validasi Klinis Penuh"
                : "Intelligent Patient Reporting with Full Clinical Oversight"}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              {language === "ID"
                ? "Nova AI menerjemahkan hasil patologi dan laboratorium yang kompleks menjadi ringkasan yang jelas, empatik, dan mudah dipahami pasien—tanpa mengurangi otoritas diagnostik dokter."
                : "Nova AI translates complex laboratory and pathology findings into clear, empathetic patient summaries—while keeping diagnostic authority firmly with the attending physician."}
            </p>
          </div>

          {/* 2-Column LigoLab Architecture: Left 4 Value Rows + Right Dual-Mode Patient Report Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 xl:gap-20 items-center">
            {/* Left Column: 4 Clean Feature Rows with Responsive Icon Badge */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-7 lg:space-y-8">
              {/* Item 1 */}
              <div className="flex items-start gap-3.5 sm:gap-5 lg:gap-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-xl sm:rounded-2xl bg-[#F4F8FD] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#EBF3FE] transition-all">
                  <FileCheck2 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 stroke-[1.6]" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Penjelasan Hasil Lab yang Mudah Dipahami" : "Clear Translation of Complex Findings"}
                  </h3>
                  <ul className="space-y-1 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Mengubah terminologi medis & nilai rujukan teknis menjadi narasi ramah pasien"
                          : "Transforms technical medical terminology into clear, everyday patient language"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menyoroti temuan utama dan indikator kritis secara terstruktur tanpa memicu kecemasan"
                          : "Highlights key findings and critical markers clearly without causing unnecessary anxiety"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3.5 sm:gap-5 lg:gap-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-xl sm:rounded-2xl bg-[#F4F8FD] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#EBF3FE] transition-all">
                  <HeartPulse className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 stroke-[1.6]" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Panduan Pola Hidup Berbasis Bukti" : "Evidence-Based Lifestyle Guidance"}
                  </h3>
                  <ul className="space-y-1 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Memberikan rekomendasi nutrisi, hidrasi, dan kebiasaan harian selaras hasil tes"
                          : "Delivers tailored nutrition, hydration, and daily wellness guidance aligned with results"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Membantu pasien mengambil langkah preventif terarah sebelum jadwal kontrol berikutnya"
                          : "Empowers proactive, preventive health management ahead of follow-up visits"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3.5 sm:gap-5 lg:gap-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-xl sm:rounded-2xl bg-[#F4F8FD] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#EBF3FE] transition-all">
                  <Shuffle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 stroke-[1.6]" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Roadmap Tindak Lanjut Terarah" : "Guided \"Next Steps\" Care Roadmap"}
                  </h3>
                  <ul className="space-y-1 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menentukan waktu ideal untuk konsultasi ulang maupun pemeriksaan berkala bersama dokter"
                          : "Outlines ideal timelines for physician follow-ups and routine monitoring"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menyediakan daftar pertanyaan kunci agar diskusi pasien dengan dokter lebih efektif"
                          : "Suggests focused questions patients can bring to their next consultation"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-3.5 sm:gap-5 lg:gap-6 group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-xl sm:rounded-2xl bg-[#F4F8FD] border border-blue-100/80 flex items-center justify-center shrink-0 text-[#2764B8] group-hover:scale-105 group-hover:bg-[#EBF3FE] transition-all">
                  <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 stroke-[1.6]" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 flex-1 pt-0.5">
                  <h3 className="font-display text-base sm:text-lg lg:text-[19px] font-bold text-slate-900 leading-snug group-hover:text-[#2764B8] transition-colors">
                    {language === "ID" ? "Otorisasi & Kendali Mutlak Dokter (DPJP)" : "Physician-Approved & Clinically Verified"}
                  </h3>
                  <ul className="space-y-1 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Setiap narasi pasien wajib melalui peninjauan dan persetujuan digital dokter Sp.PK / Sp.PA"
                          : "Every patient narrative requires mandatory clinical review and digital sign-off"}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-slate-400 select-none shrink-0">-</span>
                      <span>
                        {language === "ID"
                          ? "Menjamin akurasi diagnostik, etika medis, dan kepatuhan standar akreditasi rumah sakit"
                          : "Ensures medical accuracy, safety guardrails, and alignment with hospital accreditation standards"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic & Responsive Report Card with Specialty & Mode Switcher */}
            <div className="lg:col-span-6 w-full min-w-0">
              <div className="rounded-[22px] sm:rounded-[28px] lg:rounded-[32px] bg-[#FAFBFD] border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-[0_10px_35px_-15px_rgba(15,23,42,0.05)] relative flex flex-col justify-between transition-all duration-300">
                {/* Card Header with Interactive Toggle Button */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display text-base sm:text-lg lg:text-xl font-bold text-slate-900 truncate">
                      AI Patient Report
                    </span>
                  </div>

                  {/* Mode Switcher Button */}
                  <button
                    type="button"
                    onClick={() => setIsClinicalView(!isClinicalView)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0073FC] hover:bg-[#0060D6] text-white font-sans text-[11px] sm:text-xs font-bold tracking-wide shadow-xs hover:shadow-sm transition-all duration-200 active:scale-95 cursor-pointer shrink-0 group"
                  >
                    <ArrowLeftRight className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300", isClinicalView ? "rotate-180" : "rotate-0")} />
                    <span>
                      {isClinicalView
                        ? (language === "ID" ? "TAMPILAN PASIEN" : "PATIENT VIEW")
                        : (language === "ID" ? "TAMPILAN KLINIS" : "CLINICAL VIEW")}
                    </span>
                  </button>
                </div>

                {/* Dynamic Case Switcher Pills (Responsive horizontal scroll / wrap on tiny screens) */}
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-1.5 sm:gap-2",
                    isClinicalView
                      ? "pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-slate-200/75"
                      : "mb-4 sm:mb-5"
                  )}
                >
                  {reportCases.map((item, idx) => {
                    const isActive = activeCase === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveCase(idx)}
                        className={cn(
                          "px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-[#EBF3FE] text-[#1E5299] border border-blue-200/90 shadow-2xs"
                            : "bg-white text-slate-500 border border-slate-200/70 hover:text-slate-800 hover:border-slate-300"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Content Area */}
                <div
                  key={`${currentReport.id}-${isClinicalView ? "clinical" : "patient"}`}
                  className="animate-in fade-in slide-in-from-bottom-1 duration-300"
                >
                  {isClinicalView ? (
                    /* Clinical View: Structured Report matching LigoLab Spec */
                    <div className="space-y-3 sm:space-y-4 pb-1">
                      <p className="text-[11px] sm:text-[13px] font-bold tracking-wider text-slate-400 uppercase">
                        {currentReport.clinicalHeading}
                      </p>

                      <div className="space-y-2.5 sm:space-y-3.5 text-[13px] sm:text-sm lg:text-[15px] leading-relaxed text-slate-700">
                        {currentReport.clinicalFields.map((field, fIdx) => (
                          <p key={fIdx} className="break-words">
                            <span className="font-medium text-[#0073FC]">
                              {field.label}
                            </span>{" "}
                            {field.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Patient View: 3 Stacked Pastel Cards */
                    <div className="space-y-3 sm:space-y-3.5">
                      {/* Card 1: Blue Card - Results Summary */}
                      <div className="rounded-xl sm:rounded-2xl bg-[#EFF6FF] border border-blue-200/80 p-3.5 sm:p-4 lg:p-5 transition-all duration-200 hover:border-blue-300/80">
                        <div className="flex items-center gap-2 text-[#1E40AF] font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-1.5 sm:mb-2">
                          <FileText className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0" />
                          <h4>
                            {language === "ID" ? "Ringkasan Hasil Pemeriksaan" : "Your Results Summary"}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                          {currentReport.patientSummary}
                        </p>
                      </div>

                      {/* Card 2: Green Card - What This Means */}
                      <div className="rounded-xl sm:rounded-2xl bg-[#F0FDF4] border border-emerald-200/80 p-3.5 sm:p-4 lg:p-5 transition-all duration-200 hover:border-emerald-300/80">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-1.5 sm:mb-2">
                          <Info className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-emerald-700 shrink-0" />
                          <h4>
                            {language === "ID" ? "Makna Klinis bagi Anda" : "What This Means for You"}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed font-normal">
                          {currentReport.patientMeaning}
                        </p>
                      </div>

                      {/* Card 3: White Card - Next Steps */}
                      <div className="rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 p-3.5 sm:p-4 lg:p-5 shadow-2xs transition-all duration-200 hover:border-slate-300/90">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-[13.5px] sm:text-sm lg:text-[15px] mb-2">
                          <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#2764B8] shrink-0" />
                          <h4>
                            {language === "ID" ? "Langkah Selanjutnya" : "Next Steps"}
                          </h4>
                        </div>
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13.5px] text-slate-700">
                          {currentReport.patientSteps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start sm:items-center gap-2">
                              <span className="text-slate-800 font-bold shrink-0">✓</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
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
