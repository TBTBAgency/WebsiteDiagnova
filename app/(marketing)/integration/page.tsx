"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  FileText,
  Cpu,
  ShieldCheck,
  Wifi,
  ArrowRight,
  CheckCircle2,
  Check,
  Building2,
  Lock,
  Server,
  Database,
  Radio,
  FileCheck2,
  BadgeCheck,
  ChevronRight,
  Activity,
  Layers,
  ArrowDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function IntegrationPage() {
  const { language } = useLanguage();
  const [selectedIntegration, setSelectedIntegration] = useState<number>(0);

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = integrations.findIndex((item) => item.id === hash);
        if (foundIndex !== -1) {
          setSelectedIntegration(foundIndex);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const integrations = [
    {
      id: "simrs-his",
      icon: Network,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      tabLabel: "SIMRS / HIS",
      targetDept:
        language === "ID"
          ? "Sistem Informasi Rumah Sakit (HIS)"
          : "Hospital Information System (HIS)",
      name: "SIMRS / HIS Bridging",
      tagline:
        language === "ID"
          ? "Bridging Mulus Dua Arah: Order Otomatis & Billing Terintegrasi"
          : "Bidirectional Bridging: Automated Orders & Integrated Billing",
      description:
        language === "ID"
          ? "Diagnova terhubung native dengan vendor SIMRS lokal dan internasional di Indonesia. Order lab dari dokter di poliklinik, rawat inap, atau IGD otomatis ditarik menjadi worklist barcode, dan hasil terverifikasi langsung dikembalikan ke rekam medis SIMRS tanpa entri ulang."
          : "Diagnova connects natively with local and international hospital information systems (HIS). Physician lab orders from clinics, wards, or ER instantly flow into barcode worklists, and validated results post back directly into the patient EMR with zero manual re-entry.",
      highlights: [
        {
          title: language === "ID" ? "Zero Double-Entry" : "Zero Double Entry",
          desc:
            language === "ID"
              ? "Pendaftaran pasien dan pesanan parameter tes otomatis tersinkronisasi tanpa ketik ulang."
              : "Patient demographics and test orders synchronize automatically without redundant re-typing.",
        },
        {
          title: language === "ID" ? "Sinkronisasi Billing Real-Time" : "Real-time Billing Sync",
          desc:
            language === "ID"
              ? "Status pembayaran dan klaim BPJS/Asuransi terkunci otomatis sebelum sampel diproses."
              : "Charge capture and insurance/BPJS status update automatically before specimen processing.",
        },
        {
          title: language === "ID" ? "Dukungan Multi-Unit Faskes" : "Hospital-Wide Support",
          desc:
            language === "ID"
              ? "Menangani antrean order dari Rawat Jalan, Rawat Inap, IGD Cito, ICU, hingga Kamar Operasi."
              : "Handles concurrent order streams from Outpatient, Inpatient wards, Emergency Cito, and ICU.",
        },
      ],
      protocols: ["HL7 v2.x (ORM / ORU)", "RESTful API / JSON", "Webservices / SOAP", "Direct DB Link"],
      metrics: [
        { val: "0 Error", label: language === "ID" ? "Salah Ketik Data Pasien" : "Patient ID Typing Error" },
        { val: language === "ID" ? "< 1 Detik" : "< 1 Sec", label: language === "ID" ? "Latensi Pengiriman Hasil" : "Result Return Latency" },
      ],
      simulationType: "simrs",
      simulationBadge: "Bidirectional HL7 / REST",
    },
    {
      id: "rme",
      icon: FileText,
      color: "#345DAB",
      accentBg: "bg-blue-50 text-[#345DAB] border-blue-200/60",
      tabLabel: language === "ID" ? "Rekam Medis (RME)" : "EMR Integration",
      targetDept:
        language === "ID"
          ? "Kepatuhan Permenkes No. 24/2022"
          : "Permenkes 24/2022 EMR Compliance",
      name: "Rekam Medis Elektronik (RME)",
      tagline:
        language === "ID"
          ? "Data Laboratorium Terstruktur & Grafik Riwayat Longitudinal di Layar RME"
          : "Structured Lab Data & Longitudinal Trend Analytics in Doctor EMR",
      description:
        language === "ID"
          ? "Mendukung penuh amanat Permenkes No. 24 Tahun 2022 tentang Rekam Medis Elektronik. Diagnova menyajikan data hasil tes dan laporan patologi terstruktur, grafik tren biomarker longitudinal, dan penanda panic value seketika di modul dokter DPJP."
          : "Fully aligns with Indonesian Ministry of Health Regulation (Permenkes No. 24/2022). Diagnova delivers structured lab observations, longitudinal biomarker trend visualizations, and instant panic value alerts directly inside the physician's EMR interface.",
      highlights: [
        {
          title: language === "ID" ? "Standar Terminologi LOINC" : "Standardized LOINC Coding",
          desc:
            language === "ID"
              ? "Setiap parameter tes dipetakan ke kode standar nasional untuk integrasi data rekam medis."
              : "Every laboratory parameter is mapped to national LOINC codes for semantic interoperability.",
        },
        {
          title: language === "ID" ? "Grafik Tren Biomarker Pasien" : "Longitudinal Trend Charts",
          desc:
            language === "ID"
              ? "Dokter dapat membandingkan riwayat leukosit, kreatinin, atau HbA1c pasien lintas episode."
              : "Physicians view cross-encounter historical trajectory for biomarkers like HbA1c or creatinine.",
        },
        {
          title: language === "ID" ? "Tanda Tangan Digital Tersertifikasi" : "Certified Digital Signature",
          desc:
            language === "ID"
              ? "Hasil laboratorium disahkan dengan e-signature dan QR code verifikasi keaslian dokumen."
              : "Lab reports are sealed with certified cryptographic e-signatures and QR verification stamps.",
        },
      ],
      protocols: ["FHIR R4 DiagnosticReport", "JSON REST API", "HL7 CDA", "Secure PDF Embed"],
      metrics: [
        { val: "100%", label: language === "ID" ? "Kepatuhan Permenkes 24" : "Permenkes 24 Compliance" },
        { val: language === "ID" ? "Instan" : "Instant", label: language === "ID" ? "Notifikasi Panic Value" : "Panic Alert Dispatch" },
      ],
      simulationType: "rme",
      simulationBadge: "FHIR R4 DiagnosticReport",
    },
    {
      id: "analyzer",
      icon: Cpu,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      tabLabel: "Direct Analyzer",
      targetDept:
        language === "ID"
          ? "500+ Instrumen Laboratorium Teruji"
          : "500+ Tested Medical Analyzers",
      name: "Direct Analyzer Interfacing",
      tagline:
        language === "ID"
          ? "Konektivitas Bidireksional ke Mesin Hematologi, Kimia, Urinalisis & Mikrobiologi"
          : "Bidirectional Interfacing with Hematology, Chemistry & Immunoassay Analyzers",
      description:
        language === "ID"
          ? "Diagnova berkomunikasi langsung dengan lebih dari 500 model analyzer medis dari Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, hingga bioMérieux. Mesin membaca barcode tabung, menarik profil pemeriksaan (Host Query), dan mentransmisikan hasil kembali secara otomatis."
          : "Diagnova interfaces directly with over 500 clinical analyzer models from Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, and bioMérieux. Instruments scan tube barcodes, query test worklists (Host Query), and stream raw results back into Diagnova automatically.",
      highlights: [
        {
          title: language === "ID" ? "Mode Host Query Bidireksional" : "Bidirectional Host Query",
          desc:
            language === "ID"
              ? "Tabung barcode diletakkan di rak instrumen, mesin langsung meminta parameter tes ke server."
              : "Specimen placed on rack; instrument immediately queries server for specific test profiles.",
        },
        {
          title: language === "ID" ? "Validasi QC & Westgard Otomatis" : "Automated QC & Westgard Guard",
          desc:
            language === "ID"
              ? "Memblokir pemrosesan sampel pasien apabila kontrol kualitas harian instrumen belum lolos."
              : "Locks patient run processing if instrument daily quality control checks have not passed.",
        },
        {
          title: language === "ID" ? "Pendeteksian Error & Flagging" : "Raw Flag & Error Ingestion",
          desc:
            language === "ID"
              ? "Menangkap flag analyzer (clot, hemolisis, ikterik, lipemik) untuk kewaspadaan analis lab."
              : "Captures instrument flags (clot, hemolysis, icterus, lipemia) for immediate lab technician review.",
        },
      ],
      protocols: ["ASTM E1381 / E1394", "HL7 v2.3.1 / v2.5", "Serial RS-232", "TCP/IP LAN", "USB"],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Mesin Kompatibel" : "Compatible Analyzers" },
        { val: language === "ID" ? "0 Detik" : "0 Sec", label: language === "ID" ? "Waktu Ketik Hasil" : "Manual Typing Time" },
      ],
      simulationType: "analyzer",
      simulationBadge: "ASTM E1381/E1394 & HL7",
    },
    {
      id: "satusehat",
      icon: ShieldCheck,
      color: "#059669",
      accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      tabLabel: "SATUSEHAT Kemenkes",
      targetDept:
        language === "ID"
          ? "Ekosistem Kesehatan Nasional (Kemenkes RI)"
          : "National Health Ecosystem (MoH Indonesia)",
      name: "SATUSEHAT Interoperabilitas",
      tagline:
        language === "ID"
          ? "Konektivitas HL7 FHIR Siap Pakai untuk Standar Data Kesehatan Nasional"
          : "Turnkey HL7 FHIR Connectivity for National Health Interoperability",
      description:
        language === "ID"
          ? "Fasilitas kesehatan wajib terhubung ke ekosistem SATUSEHAT Kementerian Kesehatan RI. Diagnova mengonversi data pemeriksaan lab lokal menjadi resource HL7 FHIR R4 terstandardisasi (ServiceRequest, Specimen, Observation, DiagnosticReport) lengkap dengan pemetaan LOINC dan SNOMED CT."
          : "Healthcare facilities must connect to Indonesia's SATUSEHAT platform. Diagnova translates local lab orders and results into standard HL7 FHIR R4 resources (ServiceRequest, Specimen, Observation, DiagnosticReport) mapped to LOINC and SNOMED CT ontologies.",
      highlights: [
        {
          title: language === "ID" ? "Validasi IHS Number Pasien" : "IHS Patient ID Verification",
          desc:
            language === "ID"
              ? "Pencocokan NIK pasien dengan nomor IHS (Indonesia Health Services) sebelum pengiriman payload."
              : "Instant NIK validation against Indonesia Health Services (IHS) registry prior to payload dispatch.",
        },
        {
          title: language === "ID" ? "Pemetaan Otomatis LOINC / SNOMED" : "Auto LOINC & SNOMED Mapping",
          desc:
            language === "ID"
              ? "Parameter laboratorium terpetakan presisi sesuai kamus interoperabilitas data Kemenkes."
              : "Lab catalog mapped precisely to Ministry of Health interoperability dictionaries.",
        },
        {
          title: language === "ID" ? "Kepatuhan UU PDP & Enkripsi TLS 1.3" : "PDP Act Compliance & TLS 1.3",
          desc:
            language === "ID"
              ? "Transmisi terenkripsi via API Gateway resmi Kemenkes dengan rekam jejak pengiriman transparan."
              : "Encrypted payload transmission via official MoH API Gateway with complete audit logs.",
        },
      ],
      protocols: ["HL7 FHIR R4", "OAuth 2.0 Kemenkes", "HTTPS TLS 1.3", "RESTful Payload"],
      metrics: [
        { val: "100%", label: language === "ID" ? "Standar HL7 FHIR R4" : "HL7 FHIR R4 Standard" },
        { val: "99.8%", label: language === "ID" ? "Tingkat Keberhasilan Kirim" : "Submission Success Rate" },
      ],
      simulationType: "satusehat",
      simulationBadge: "MoH SATUSEHAT HL7 FHIR",
    },
    {
      id: "connectivity",
      icon: Wifi,
      color: "#2764B8",
      accentBg: "bg-blue-50 text-[#2764B8] border-blue-200/60",
      tabLabel: "Smart Gateway",
      targetDept:
        language === "ID"
          ? "Infrastruktur Jaringan & Edge Resilient"
          : "Network Infrastructure & Edge Resilience",
      name: "Smart Resilient Gateway",
      tagline:
        language === "ID"
          ? "Ketahanan Operasional Tinggi dengan Buffer Offline Edge & Zero Data Loss"
          : "High Operational Resilience with Offline Edge Buffering & Zero Data Loss",
      description:
        language === "ID"
          ? "Koneksi internet atau LAN faskes yang terputus tidak boleh menghentikan pelayanan cito laboratorium. Smart Resilient Gateway Diagnova menyimpan seluruh data analyzer di buffer lokal terenkripsi selama hingga 72 jam, dan otomatis menyinkronkan data kembali saat jaringan pulih."
          : "Internet or LAN disruptions must never halt critical emergency lab services. Diagnova's Smart Resilient Gateway stores all analyzer readings in a secure encrypted local edge buffer for up to 72 hours, auto-synchronizing with zero packet loss the moment connectivity resumes.",
      highlights: [
        {
          title: language === "ID" ? "Buffer Lokal Hingga 72 Jam" : "72-Hour Local Edge Buffer",
          desc:
            language === "ID"
              ? "Hasil analyzer tetap terekam tanpa hambatan meski server pusat atau cloud offline."
              : "Analyzer results continue capturing seamlessly even if central or cloud servers disconnect.",
        },
        {
          title: language === "ID" ? "Prioritas Antrean Sampel Cito" : "Cito Specimen Priority Sync",
          desc:
            language === "ID"
              ? "Saat online kembali, antrean rekonsiliasi memprioritaskan sampel IGD & ICU secara otomatis."
              : "Upon reconnection, sync queue algorithm prioritizes emergency and ICU specimens first.",
        },
        {
          title: language === "ID" ? "Pemantauan Heartbeat 24/7" : "24/7 Heartbeat Telemetry",
          desc:
            language === "ID"
              ? "Dashboard IT memantau status latensi, port serial, dan ketersediaan mesin secara live."
              : "IT telemetry dashboard monitors latency, serial ports, and analyzer ping states in real time.",
        },
      ],
      protocols: ["Edge Local Caching", "Encrypted Tunnel (TLS 1.3 / AES-256)", "Auto-Reconnection Sync"],
      metrics: [
        { val: "99.9%", label: language === "ID" ? "Uptime Operasional Lab" : "Operational Uptime" },
        { val: "0 Byte", label: language === "ID" ? "Data Hilang (Zero Loss)" : "Zero Data Loss" },
      ],
      simulationType: "gateway",
      simulationBadge: "Edge Architecture 99.9% SLA",
    },
  ];

  const current = integrations[selectedIntegration];
  const CurrentIcon = current.icon;

  const architectureLayers = [
    {
      step: "01",
      layerName: language === "ID" ? "Instrumen Analyzer Medis" : "Medical Analyzer Layer",
      subtitle: language === "ID" ? "500+ Model Mesin Laboratorium" : "500+ Lab Analyzer Models",
      desc:
        language === "ID"
          ? "Hematologi, Kimia Klinik, Imunologi, Urinalisis, & Koagulasi terhubung dua arah via protokol ASTM E1381/E1394 dan HL7 v2.x."
          : "Hematology, Chemistry, Immunoassay, and Coagulation analyzers connected bidirectionally via ASTM E1381/E1394 and HL7 v2.x.",
      icon: Cpu,
    },
    {
      step: "02",
      layerName: language === "ID" ? "Smart Resilient Gateway" : "Smart Resilient Gateway",
      subtitle: language === "ID" ? "Edge Buffer & Toleransi Offline 72 Jam" : "Edge Buffer & 72-Hour Offline Tolerance",
      desc:
        language === "ID"
          ? "Menerjemahkan sinyal serial RS-232 / LAN TCP-IP dan mengamankan data lokal saat terjadi gangguan internet atau listrik."
          : "Translates RS-232 serial & TCP/IP streams, safeguarding telemetry in encrypted local storage during network interruptions.",
      icon: Wifi,
    },
    {
      step: "03",
      layerName: language === "ID" ? "Diagnova LIS Core Engine" : "Diagnova LIS Core Engine",
      subtitle: language === "ID" ? "Validasi Delta-Check & Westgard QC" : "Delta-Check & Westgard Quality Control",
      desc:
        language === "ID"
          ? "Memverifikasi kontrol mutu analitik, menghitung variasi delta longitudinal, dan menyusun draf narasi klinis untuk dokter Sp.PK."
          : "Validates analytic quality control, computes longitudinal delta deviations, and prepares clinical drafts for pathologist approval.",
      icon: Server,
    },
    {
      step: "04",
      layerName: language === "ID" ? "SIMRS & RME (Permenkes 24/2022)" : "HIS & EMR Integration",
      subtitle: language === "ID" ? "Penerimaan Order & Billing Real-Time" : "Real-time Order & Billing Ingestion",
      desc:
        language === "ID"
          ? "Order lab dari poliklinik/IGD otomatis diubah menjadi barcode worklist, dan hasil diverifikasi langsung dikembalikan ke rekam medis."
          : "Physician orders instantly populate barcode worklists, while validated results return directly to the hospital EMR.",
      icon: Network,
    },
    {
      step: "05",
      layerName: language === "ID" ? "SATUSEHAT Kemenkes RI" : "National Health (SATUSEHAT)",
      subtitle: language === "ID" ? "Standar Interoperabilitas HL7 FHIR R4" : "HL7 FHIR R4 National Interoperability",
      desc:
        language === "ID"
          ? "Konversi otomatis data pemeriksaan ke resource FHIR terstandar lengkap dengan ontologi LOINC dan SNOMED CT resmi."
          : "Automated transformation of local observations into standardized FHIR resources mapped to LOINC and SNOMED CT ontologies.",
      icon: ShieldCheck,
    },
  ];

  const analyzerBrands = [
    { name: "Roche Diagnostics", category: "Cobas & Elecsys Series", protocols: "ASTM / HL7" },
    { name: "Sysmex Corporation", category: "XN, CS, UF Series", protocols: "ASTM E1394" },
    { name: "Abbott Core Diagnostics", category: "Alinity & Architect", protocols: "HL7 / ASTM" },
    { name: "Siemens Healthineers", category: "Atellica & Dimension", protocols: "HL7 v2.5" },
    { name: "Beckman Coulter", category: "DxH, DxC, Access", protocols: "ASTM / HL7" },
    { name: "Mindray Medical", category: "BC-6000, BS, CL Series", protocols: "HL7 / Serial" },
    { name: "bioMérieux", category: "VITEK 2, VIDAS, BACT/ALERT", protocols: "ASTM / BCI" },
    { name: "Horiba Medical", category: "Yumizen & Pentra Series", protocols: "ASTM E1381" },
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Interoperabilitas Laboratorium" : "Laboratory Interoperability Suite"}
        title={
          language === "ID" ? (
            <>
              Terhubung Mulus dengan{" "}
              <br className="hidden sm:inline" />
              Ekosistem RS & 500+ Mesin Lab
            </>
          ) : (
            <>
              Seamless Connectivity with{" "}
              <br className="hidden sm:inline" />
              Hospital IT & 500+ Medical Analyzers
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Konektivitas siap pakai yang aman dan patuh regulasi: bridging dua arah SIMRS/HIS, RME Permenkes 24/2022, SATUSEHAT Kemenkes, 500+ analyzer otomatis, dan gateway buffer offline."
            : "Turnkey, regulatory-compliant interoperability: bidirectional HIS bridging, EMR Permenkes 24/2022, MoH SATUSEHAT HL7 FHIR, direct 500+ analyzer interfacing, and offline edge buffer."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Konsultasi Integrasi" : "Schedule Integration Consultation",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Eksplorasi 5 Pilar Integrasi" : "Explore 5 Integration Pillars",
          href: "#integration-explorer",
        }}
        metrics={[
          {
            value: language === "ID" ? "500+ Mesin" : "500+ Analyzers",
            label: language === "ID" ? "Analyzer Teruji" : "Supported Analyzers",
            sub: language === "ID" ? "Roche, Sysmex, Abbott, Mindray" : "Roche, Sysmex, Abbott, Mindray",
          },
          {
            value: "HL7 & FHIR",
            label: language === "ID" ? "Standar Kemenkes RI" : "National Health Standard",
            sub: language === "ID" ? "SATUSEHAT & Permenkes 24/2022" : "SATUSEHAT & Permenkes 24/2022",
          },
          {
            value: "0 Double Entry",
            label: language === "ID" ? "Bridging SIMRS Dua Arah" : "Bidirectional HIS Bridging",
            sub: language === "ID" ? "Order & billing otomatis realtime" : "Real-time automatic order & billing",
          },
          {
            value: language === "ID" ? "72 Jam" : "72 Hours",
            label: language === "ID" ? "Buffer Offline Edge" : "Offline Resilient Edge",
            sub: language === "ID" ? "Zero data loss saat jaringan putus" : "Zero data loss during downtime",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: INTERACTIVE INTEGRATION EXPLORER (#integration-explorer)
          ══════════════════════════════════════════════════════════════ */}
      <section id="integration-explorer" className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Arsitektur Interoperabilitas" : "Interoperability Architecture"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID"
                ? "Pilih Jalur Integrasi Sesuai Ekosistem IT Anda"
                : "Select the Integration Path Tailored to Your IT Ecosystem"}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Klik tab di bawah untuk melihat spesifikasi protokol, alur pesan data medis, dan mekanisme keamanan masing-masing integrasi."
                : "Click the tabs below to inspect protocol specs, medical message workflows, and resilience mechanisms for each pillar."}
            </p>
          </div>

          {/* Clean Segmented Tab Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 no-scrollbar mb-8 sm:mb-10">
            {integrations.map((item, idx) => {
              const TabIcon = item.icon;
              const isSelected = selectedIntegration === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedIntegration(idx);
                    window.history.replaceState(null, "", `#${item.id}`);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border",
                    isSelected
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  <TabIcon className={cn("h-4 w-4", isSelected ? "text-white" : "text-[#2764B8]")} />
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Master-Detail Card */}
          <div className="rounded-[28px] sm:rounded-[32px] border border-slate-200 bg-[#FAFBFD] p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Details & Value Proposition */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3FB] text-[#2764B8] border border-blue-200/60">
                      {current.targetDept}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                      Pillar {selectedIntegration + 1} of {integrations.length}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                    {current.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#2764B8] mt-1.5">
                    {current.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed font-normal">
                    {current.description}
                  </p>

                  {/* 3 Core Highlights */}
                  <div className="mt-6 sm:mt-8 space-y-3">
                    {current.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2764B8]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{h.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-normal">{h.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Protocols Badge Strip */}
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">
                      {language === "ID" ? "Protokol Komunikasi:" : "Protocols:"}
                    </span>
                    {current.protocols.map((p, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Direct CTA */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 sm:gap-8">
                    {current.metrics.map((m, idx) => (
                      <div key={idx}>
                        <p className="font-display text-xl sm:text-2xl font-bold text-[#345DAB]">{m.val}</p>
                        <p className="text-xs text-slate-600 font-medium">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                  >
                    <span>{language === "ID" ? "Konsultasikan Integrasi Ini" : "Consult This Integration"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual High-Fidelity Clinical & Technical Monitor */}
              <div className="lg:col-span-5 w-full">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                        {current.simulationBadge}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                      LIVE STATUS
                    </span>
                  </div>

                  {/* Simulation Body based on pillar type */}
                  <div className="mt-5">
                    {current.simulationType === "simrs" && (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-[#F8FBFE] border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 font-semibold mb-1">
                            {language === "ID" ? "Alur Transaksi Data Dua Arah (HIS ⇄ LIS):" : "Bidirectional Data Flow (HIS ⇄ LIS):"}
                          </strong>
                          {language === "ID"
                            ? "Setiap perubahan status pasien di SIMRS seketika disinkronkan ke worklist barcode Diagnova."
                            : "Patient state changes in hospital HIS are instantly synchronized to Diagnova worklists."}
                        </div>

                        <div className="space-y-2.5">
                          {[
                            { code: "ADT^A08", label: language === "ID" ? "Data Pasien & NIK Masuk dari Admisi" : "Patient Admission Demographic Ingested", time: "10:14:02", state: "Sukses" },
                            { code: "ORM^O01", label: language === "ID" ? "Order Tes Dokter IGD Diterima" : "Emergency Physician Lab Order Ingested", time: "10:14:05", state: "Terkunci" },
                            { code: "DFT^P03", label: language === "ID" ? "Validasi Klaim BPJS / Billing Selesai" : "Insurance & Billing Charge Validated", time: "10:14:07", state: "Valid" },
                            { code: "ORU^R01", label: language === "ID" ? "Hasil Terverifikasi Dikirim ke Rekam Medis" : "Verified Result Posted to EMR", time: "10:32:18", state: "Rilis" },
                          ].map((step, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono font-bold text-[#2764B8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 text-[11px]">
                                  {step.code}
                                </span>
                                <span className="text-slate-800 font-medium text-xs">
                                  {step.label}
                                </span>
                              </div>
                              <span className="font-mono text-[11px] text-slate-500 font-normal shrink-0">
                                {step.time}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span>Queue State: 0 Pending • 100% Synced</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulationType === "rme" && (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-[#F8FBFE] border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 font-semibold mb-1">
                            {language === "ID" ? "Resource Rekam Medis Terstruktur (Permenkes 24/2022):" : "Structured EMR Resource (Permenkes 24/2022):"}
                          </strong>
                          {language === "ID"
                            ? "Data hasil lab disajikan lengkap dengan kodifikasi LOINC dan sertifikat tanda tangan elektronik."
                            : "Laboratory observations rendered with LOINC semantic mappings and cryptographic digital signatures."}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Resource:</span>
                            <span className="font-bold text-slate-900 font-mono">DiagnosticReport / Observation</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Pasien & No. RM:</span>
                            <span className="font-bold text-slate-900">Tn. Hendra Wijaya (#0849201)</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Pemeriksaan:</span>
                            <span className="font-bold text-[#2764B8]">LOINC 57021-8 (CBC + Diff Count)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Verifikator Sp.PK:</span>
                            <span className="font-bold text-slate-900">dr. Ratna Sp.PK (SIP Valid)</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span className="flex items-center gap-1.5">
                            <BadgeCheck className="h-4 w-4 text-emerald-600" />
                            <span>E-Sign BSrE: Tervalidasi SHA-256</span>
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-700">Kepatuhan 100%</span>
                        </div>
                      </div>
                    )}

                    {current.simulationType === "analyzer" && (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-[#F8FBFE] border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 font-semibold mb-1">
                            {language === "ID" ? "Monitor Telemetri Instrumen Laboratorium:" : "Laboratory Instrument Telemetry Monitor:"}
                          </strong>
                          {language === "ID"
                            ? "Koneksi Host Query otomatis mengirim worklist saat tabung barcode diletakkan di rak mesin."
                            : "Host Query connection transmits test profiles automatically as tube barcodes hit the rack."}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Instrumen Aktif:</span>
                            <span className="font-bold text-[#2764B8]">Sysmex XN-1000 & Roche Cobas c501</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Barcode Spesimen:</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              #SP-20261030-08819
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Mode Komunikasi:</span>
                            <span className="font-semibold text-slate-900">Bidirectional ASTM E1394 Query</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span>Quality Control: Westgard Rules Lolos</span>
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulationType === "satusehat" && (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-[#F8FBFE] border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 font-semibold mb-1">
                            {language === "ID" ? "Pertukaran Data Nasional SATUSEHAT FHIR:" : "National Health Exchange (SATUSEHAT FHIR):"}
                          </strong>
                          {language === "ID"
                            ? "Payload otomatis tervalidasi dengan NIK pasien dan kamus terminologi data Kemenkes RI."
                            : "Payload automatically validated against patient NIK and official MoH clinical dictionaries."}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Autentikasi Gateway:</span>
                            <span className="font-semibold text-emerald-700">OAuth 2.0 Kemenkes (Valid)</span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">IHS Patient ID:</span>
                            <span className="font-mono font-bold text-slate-900">P-10029482103 (NIK Sesuai)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Ontologi Medis:</span>
                            <span className="font-semibold text-[#2764B8]">LOINC & SNOMED CT Terstandar</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span>Status Transmisi: HTTP 201 Created</span>
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulationType === "gateway" && (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-xl bg-[#F8FBFE] border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 font-semibold mb-1">
                            {language === "ID" ? "Ketahanan Jaringan Edge & Buffer Offline:" : "Edge Network Resilience & Offline Buffering:"}
                          </strong>
                          {language === "ID"
                            ? "Pelayanan darurat Cito tetap berjalan tanpa henti meski koneksi internet faskes terputus."
                            : "Emergency Cito laboratory services proceed unhalted even during internet outages."}
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Mode Gateway Edge:</span>
                            <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                              <Radio className="h-3 w-3 text-emerald-500" /> Operasional Aktif
                            </span>
                          </div>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <span className="text-slate-500">Toleransi Offline:</span>
                            <span className="font-bold text-slate-900">Hingga 72 Jam Penyimpanan Lokal</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Rekonsiliasi Antrean:</span>
                            <span className="font-semibold text-[#2764B8]">Prioritas Otomatis Sampel Cito IGD</span>
                          </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between font-medium">
                          <span>Zero Data Loss Guarantee • Uptime 99.9%</span>
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: END-TO-END 5-LAYER CONNECTIVITY PIPELINE
          (Diagram Arsitektur Alur Data Faskes Terpadu)
          ══════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="w-full py-16 sm:py-20 lg:py-24 bg-[#F8FBFE] border-b border-slate-200">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Peta Arsitektur Terintegrasi" : "Integrated Architecture Map"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID"
                ? "Bagaimana Diagnova Menyatukan Seluruh Alur Data Laboratorium"
                : "How Diagnova Unifies the Complete Laboratory Data Pipeline"}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Dari pembacaan instrumen analitik di meja lab hingga pelaporan rekam medis nasional, setiap layer berkomunikasi tanpa hambatan format atau risiko kehilangan data."
                : "From analytical instrument query to national electronic medical record reporting, every layer communicates seamlessly without format friction or packet loss."}
            </p>
          </div>

          {/* 5-Layer Connected Sequential Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {architectureLayers.map((layer) => {
              const LayerIcon = layer.icon;
              return (
                <div
                  key={layer.step}
                  className="rounded-[28px] bg-white border border-slate-200 p-6 sm:p-7 shadow-xs hover:border-[#2764B8] hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                        <LayerIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-[#2764B8] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/50">
                        Layer {layer.step}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {layer.layerName}
                      </h3>
                      <p className="text-xs font-semibold text-[#2764B8] mt-1">
                        {layer.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2.5">
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{language === "ID" ? "Terintegrasi Native" : "Native Bridge"}</span>
                    <Check className="h-3.5 w-3.5 text-[#2764B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: SUPPORTED GLOBAL ANALYZER BRANDS GRID
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="mb-4 flex justify-center">
              <SectionBadge variant="blue">
                {language === "ID" ? "Kompatibilitas Hardware Universal" : "Universal Hardware Compatibility"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900">
              {language === "ID"
                ? "Kompatibel dengan 500+ Mesin Laboratorium Global"
                : "Compatible with 500+ Global Medical Analyzers"}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Diagnova telah teruji di ratusan rumah sakit dan laboratorium klinik terkemuka dengan dukungan protokol standar internasional (ASTM E1381/E1394, HL7 v2.x, Serial RS-232, dan TCP/IP LAN)."
                : "Diagnova is proven across hundreds of healthcare facilities, supporting international protocols including ASTM E1381/E1394, HL7 v2.x, Serial RS-232, and TCP/IP LAN."}
            </p>
          </div>

          {/* Manufacturers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {analyzerBrands.map((brand, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-[#F8FBFE] p-5 sm:p-6 text-center hover:bg-white hover:border-[#2764B8] hover:shadow-xs transition-all duration-200"
              >
                <div className="flex h-11 w-11 mx-auto items-center justify-center rounded-xl bg-white border border-slate-200 text-[#2764B8] mb-3 shadow-2xs">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  {brand.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  {brand.category}
                </p>
                <span className="inline-block mt-3 rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-[#2764B8]">
                  {brand.protocols}
                </span>
              </div>
            ))}
          </div>

          {/* Custom Driver Guarantee Banner */}
          <div className="mt-10 p-5 rounded-2xl bg-[#F8FBFE] border border-slate-200 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-slate-700 font-normal">
              {language === "ID"
                ? "Mesin lab Anda belum tercantum di atas? Tim teknis kami dapat membangun driver instrumen kustom dalam 3-5 hari kerja tanpa biaya tambahan."
                : "Don't see your specific analyzer model above? Our engineering team builds custom instrument drivers within 3-5 business days at no extra fee."}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE STRIP
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-[#F2F6FA] border-b border-slate-200">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200 p-8 sm:p-10 lg:p-12 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
                  {language === "ID" ? "Kepatuhan Regulasi & Privasi" : "Regulatory & Privacy Compliance"}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {language === "ID"
                    ? "Arsitektur Aman Sesuai Regulasi Kesehatan Nasional"
                    : "Secure Architecture Compliant with National Health Regulations"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Setiap transmisi data dilindungi enkripsi kelas enterprise (TLS 1.3 / AES-256) serta memenuhi amanat UU Perlindungan Data Pribadi (UU PDP) dan standar Kemenkes RI."
                    : "Every data transmission is guarded by enterprise-grade TLS 1.3 / AES-256 encryption, fully aligning with Indonesia's PDP Act and Ministry of Health standards."}
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Permenkes 24/2022",
                    desc: language === "ID" ? "Mandatori Rekam Medis Elektronik Terstruktur" : "Structured Electronic Medical Records",
                    icon: FileCheck2,
                  },
                  {
                    title: "SATUSEHAT FHIR",
                    desc: language === "ID" ? "Interoperabilitas Data Kesehatan Nasional" : "National Health Interoperability",
                    icon: ShieldCheck,
                  },
                  {
                    title: "UU PDP No. 27/2022",
                    desc: language === "ID" ? "Enkripsi End-to-End & Hak Privasi Pasien" : "End-to-End Encryption & Privacy Rights",
                    icon: Lock,
                  },
                ].map((item, idx) => {
                  const ComplianceIcon = item.icon;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-[#F8FBFE] border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 text-[#2764B8] flex items-center justify-center mb-3 shadow-2xs">
                          <ComplianceIcon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">{item.desc}</p>
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
          BOTTOM CTA BANNER
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner bgClassName="bg-[#F9F9F9]" topColor="#F9F9F9" />
    </div>
  );
}
