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
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Building2,
  Lock,
  RefreshCw,
  Server,
  Database,
  Radio,
  FileCheck2,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
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
        { val: "< 1 Detik", label: language === "ID" ? "Latensi Pengiriman Hasil" : "Result Return Latency" },
      ],
      simulation: {
        type: "simrs",
        flow: [
          { code: "ADT^A08", label: language === "ID" ? "Data Demografi Pasien Masuk" : "Patient Demographic Ingested", time: "10:14:02", ok: true },
          { code: "ORM^O01", label: language === "ID" ? "Order Lab Dokter IGD Diterima" : "Doctor Lab Order Received", time: "10:14:05", ok: true },
          { code: "DFT^P03", label: language === "ID" ? "Posting Billing / Klaim Terkunci" : "Billing Charge Captured", time: "10:14:07", ok: true },
          { code: "ORU^R01", label: language === "ID" ? "Hasil Terverifikasi Masuk SIMRS" : "Verified Result Posted to HIS", time: "10:32:18", ok: true },
        ],
        badge: "Bidirectional HL7 / REST",
      },
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
        { val: "Instan", label: language === "ID" ? "Notifikasi Panic Value" : "Panic Alert Dispatch" },
      ],
      simulation: {
        type: "rme",
        payload: {
          resourceType: "DiagnosticReport",
          id: "diag-rep-20261030-9842",
          status: "final",
          code: { coding: [{ system: "http://loinc.org", code: "57021-8", display: "CBC with Automated Diff" }] },
          subject: { reference: "Patient/ID-772183", display: "Tn. Hendra Wijaya (48 th)" },
          performer: [{ display: "dr. Ratna Sp.PK (SIP. 503/4412/DS/2024)" }],
          digitalSignature: "VERIFIED_CRYPTOGRAPHIC_HASH_SHA256",
          criticalFlag: "NONE (All in safe range)",
        },
        badge: "FHIR R4 DiagnosticReport",
      },
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
        { val: "0 Detik", label: language === "ID" ? "Waktu Ketik Hasil" : "Manual Typing Time" },
      ],
      simulation: {
        type: "analyzer",
        telemetry: {
          analyzer: "Sysmex XN-1000 & Roche Cobas c501",
          status: "ONLINE • QUERY ACTIVE",
          barcode: "SP-20261030-08819",
          testProfile: "CBC + Differential + HbA1c",
          rawCapture: "ASTM 1394 parsed: WBC 7.2 | RBC 4.8 | HGB 14.1 | PLT 248 | HbA1c 5.8%",
          qcStatus: "Westgard Rules Passed (1-2s, 2-2s OK)",
        },
        badge: "ASTM E1381/E1394 & HL7",
      },
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
      simulation: {
        type: "satusehat",
        satusehatState: {
          oauth: "TOKEN_ACQUIRED_VALID_24H",
          ihsPatient: "IHS: P-10029482103 (NIK Verified)",
          organizationId: "Org-100028192 (RSU Diagnova Partner)",
          fhirBundle: "Bundle (type: transaction, 4 entries: ServiceRequest, Specimen, Observation, DiagnosticReport)",
          transmission: "HTTP 201 Created • Response ID: res-satusehat-89211",
        },
        badge: "MoH SATUSEHAT HL7 FHIR",
      },
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
      simulation: {
        type: "gateway",
        edgeStatus: {
          gatewayMode: "LOCAL_EDGE_ACTIVE",
          lanState: "HEALTHY (Ping 1ms)",
          cloudState: "ONLINE (TLS 1.3 Tunnel)",
          bufferedPackets: "0 pending (All synced)",
          offlineTolerance: "Up to 72 hours auto-buffering",
          heartbeat: "Heartbeat OK • Port COM1-COM8 listening",
        },
        badge: "Edge Architecture 99.9% SLA",
      },
    },
  ];

  const current = integrations[selectedIntegration];
  const CurrentIcon = current.icon;

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
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: 4 Metric Cards (Matching Platform, Solutions, Modules)
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Section Badge */}
            <div className="mb-4 sm:mb-5">
              <SectionBadge variant="blue">
                {language === "ID" ? "Interoperabilitas Laboratorium" : "Laboratory Interoperability Suite"}
              </SectionBadge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
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
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl font-light">
              {language === "ID"
                ? "Konektivitas siap pakai yang aman dan patuh regulasi: bridging dua arah SIMRS/HIS, RME Permenkes 24/2022, SATUSEHAT Kemenkes (HL7 FHIR), antarmuka 500+ analyzer otomatis, serta gateway tangguh ber-buffer offline."
                : "Turnkey, regulatory-compliant interoperability: bidirectional HIS bridging, EMR Permenkes 24/2022, MoH SATUSEHAT HL7 FHIR, direct 500+ analyzer interfacing, and resilient offline edge buffering."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>{language === "ID" ? "Jadwalkan Konsultasi Integrasi" : "Schedule Integration Consultation"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#integration-explorer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Eksplorasi 5 Pilar Integrasi" : "Explore 5 Integration Pillars"}</span>
              </a>
            </div>

            {/* Exactly 4 Metric Cards */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
              {[
                {
                  value: "500+ Mesin",
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
                  value: "72 Jam",
                  label: language === "ID" ? "Buffer Offline Edge" : "Offline Resilient Edge",
                  sub: language === "ID" ? "Zero data loss saat jaringan putus" : "Zero data loss during downtime",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className="rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-5 text-left shadow-xs hover:border-blue-200/80 transition-colors"
                >
                  <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#345DAB]">
                    {kpi.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    {kpi.label}
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-tight">
                    {kpi.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: INTERACTIVE INTEGRATION EXPLORER
          ══════════════════════════════════════════════════════════════ */}
      <section id="integration-explorer" className="w-full py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "Arsitektur Interoperabilitas" : "Interoperability Architecture"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#345DAB] mt-2">
              {language === "ID"
                ? "Pilih Jalur Integrasi Sesuai Ekosistem IT Anda"
                : "Select the Integration Path Tailored to Your IT Ecosystem"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-light">
              {language === "ID"
                ? "Klik tab di bawah untuk melihat spesifikasi protokol, alur pesan data medis, dan mekanisme keamanan masing-masing integrasi."
                : "Click the tabs below to inspect protocol specs, medical message workflows, and resilience mechanisms for each pillar."}
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8 sm:mb-10">
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
                    "flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0",
                    isSelected
                      ? "bg-[#2764B8] text-white shadow-sm"
                      : "bg-[#F2F6FA] text-slate-600 hover:bg-[#EBF3FB] hover:text-[#2764B8]"
                  )}
                >
                  <TabIcon className={cn("h-4 w-4", isSelected ? "text-white" : "text-[#2764B8]")} />
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Master-Detail Card */}
          <div className="rounded-[28px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Details & Value Proposition */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", current.accentBg)}>
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
                  <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed font-light">
                    {current.description}
                  </p>

                  {/* 3 Core Highlights */}
                  <div className="mt-6 sm:mt-8 space-y-3.5">
                    {current.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/70">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#2764B8]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{h.title}</p>
                          <p className="text-xs sm:text-[13px] text-slate-500 mt-0.5 leading-relaxed">{h.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Protocols Badge Strip */}
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600 mr-1">
                      {language === "ID" ? "Protokol:" : "Protocols:"}
                    </span>
                    {current.protocols.map((p, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-white border border-slate-200/80 px-2.5 py-1 text-[11px] sm:text-xs font-mono font-medium text-slate-700 shadow-2xs"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Direct CTA */}
                <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 sm:gap-8">
                    {current.metrics.map((m, idx) => (
                      <div key={idx}>
                        <p className="font-display text-xl sm:text-2xl font-bold text-[#345DAB]">{m.val}</p>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium">{m.label}</p>
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

              {/* Right Column: Live Technical Protocol Simulation */}
              <div className="lg:col-span-5 w-full">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-slate-800 tracking-wide uppercase">
                        {current.simulation.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      LIVE STREAM
                    </span>
                  </div>

                  {/* Simulation Body based on pillar type */}
                  <div className="mt-4">
                    {current.simulation.type === "simrs" && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-mono">
                          // HL7 v2 Transaction Log (Bidirectional Sync)
                        </p>
                        {current.simulation.flow?.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono flex items-start justify-between gap-2"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="font-bold text-[#2764B8] bg-blue-100/70 px-1.5 py-0.5 rounded text-[11px]">
                                {item.code}
                              </span>
                              <span className="text-slate-700 text-[11px] sm:text-xs">
                                {item.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-600 shrink-0 font-mono">
                              {item.time}
                            </span>
                          </div>
                        ))}
                        <div className="mt-4 p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-[#2764B8] flex items-center justify-between">
                          <span className="font-semibold">Queue State: 0 Pending • 100% Synced</span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulation.type === "rme" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                          <p className="text-emerald-400 font-semibold">// FHIR R4 Resource Envelope</p>
                          <p className="text-sky-300">
                            &#123; <br />
                            &nbsp;&nbsp;<span className="text-amber-300">&quot;resourceType&quot;</span>: &quot;DiagnosticReport&quot;,<br />
                            &nbsp;&nbsp;<span className="text-amber-300">&quot;id&quot;</span>: &quot;{current.simulation.payload?.id}&quot;,<br />
                            &nbsp;&nbsp;<span className="text-amber-300">&quot;status&quot;</span>: &quot;final&quot;,<br />
                            &nbsp;&nbsp;<span className="text-amber-300">&quot;code&quot;</span>: &#123; &quot;loinc&quot;: &quot;57021-8&quot; &#125;,<br />
                            &nbsp;&nbsp;<span className="text-amber-300">&quot;eSignature&quot;</span>: &quot;VALID_SHA256&quot;<br />
                            &#125;
                          </p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Pasien / RM:</span>
                            <span className="font-semibold text-slate-800">{current.simulation.payload?.subject.display}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Dokter Pemeriksa:</span>
                            <span className="font-semibold text-slate-800">{current.simulation.payload?.performer[0].display}</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-600">
                            <span className="text-[11px]">E-Sign & Validasi:</span>
                            <span className="font-bold flex items-center gap-1">
                              <BadgeCheck className="h-3.5 w-3.5" /> Terverifikasi
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {current.simulation.type === "analyzer" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Active Analyzer:</span>
                            <span className="font-bold text-[#2764B8] text-[11px]">{current.simulation.telemetry?.analyzer}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Barcode Tube:</span>
                            <span className="font-mono bg-white px-2 py-0.5 border rounded text-slate-800 text-[11px]">
                              {current.simulation.telemetry?.barcode}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[11px]">Host Query:</span>
                            <span className="text-emerald-700 font-semibold text-[11px]">
                              {current.simulation.telemetry?.testProfile}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] leading-relaxed">
                          <p className="text-sky-300 font-bold mb-1">// Raw Stream Ingestion</p>
                          <p className="text-slate-300">{current.simulation.telemetry?.rawCapture}</p>
                        </div>

                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-[11px]">
                          <span className="font-semibold">QC Gate: {current.simulation.telemetry?.qcStatus}</span>
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulation.type === "satusehat" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">OAuth 2.0 Token:</span>
                            <span className="text-emerald-600 font-bold">ACQUIRED (24h)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">IHS Patient Mapping:</span>
                            <span className="font-semibold text-slate-800">P-10029482103 (NIK Valid)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Standard Vocab:</span>
                            <span className="bg-blue-100 text-[#2764B8] px-1.5 py-0.5 rounded font-bold">LOINC &amp; SNOMED</span>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] space-y-1">
                          <p className="text-emerald-400 font-bold">// Transmitted FHIR Bundle</p>
                          <p className="text-slate-400">{current.simulation.satusehatState?.fhirBundle}</p>
                          <p className="text-amber-300 mt-2">{current.simulation.satusehatState?.transmission}</p>
                        </div>

                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center justify-between">
                          <span className="font-semibold">MoH SATUSEHAT Gateway: Connected</span>
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    )}

                    {current.simulation.type === "gateway" && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Edge Local Mode:</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <Radio className="h-3 w-3 animate-ping" /> OPERATIONAL
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">LAN Instrument Bus:</span>
                            <span className="text-slate-800 font-semibold">{current.simulation.edgeStatus?.lanState}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Encrypted Cloud Tunnel:</span>
                            <span className="text-slate-800 font-semibold">{current.simulation.edgeStatus?.cloudState}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-[#2764B8] space-y-1">
                          <p className="font-bold">// Offline Resilience Strategy</p>
                          <p className="text-slate-700">Storage Buffer: {current.simulation.edgeStatus?.offlineTolerance}</p>
                          <p className="text-slate-700">Reconciliation: Cito orders synced with top priority</p>
                        </div>

                        <div className="p-2.5 bg-slate-900 text-slate-100 rounded-xl text-[11px] flex items-center justify-between">
                          <span className="font-mono text-emerald-400">{current.simulation.edgeStatus?.heartbeat}</span>
                          <Server className="h-4 w-4 text-slate-400" />
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
          SECTION 2: COMPLETE 5-INTEGRATION DIRECTORY (CATALOG)
          ══════════════════════════════════════════════════════════════ */}
      <section id="catalog" className="w-full py-16 sm:py-24 bg-[#F8FBFE] border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "Katalog Solusi Interoperabilitas" : "Interoperability Catalog"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#345DAB] mt-2">
              {language === "ID"
                ? "5 Pilar Konektivitas Laboratorium Terpadu"
                : "5 Pillars of Unified Laboratory Connectivity"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-light">
              {language === "ID"
                ? "Arsitektur integrasi yang kokoh, terstandardisasi, dan siap diimplementasikan tanpa mengganggu operasional faskes yang sedang berjalan."
                : "Robust, standardized integration architecture designed for seamless deployment without disrupting active hospital workflows."}
            </p>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {integrations.map((integ, index) => {
              const ItemIcon = integ.icon;
              return (
                <div
                  key={integ.id}
                  id={integ.id}
                  className="scroll-mt-32 rounded-[24px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-blue-200/90 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Consistent Icon Box: h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FB] text-[#2764B8]">
                        <ItemIcon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-150">
                        Pillar 0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-[#2764B8] transition-colors">
                      {integ.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#2764B8] mt-1">
                      {integ.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-light">
                      {integ.description}
                    </p>

                    {/* Supported Protocols */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                        {language === "ID" ? "Protokol Komunikasi:" : "Communication Protocols:"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {integ.protocols.map((p, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[11px] font-mono text-slate-600"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights bullet points */}
                    <div className="mt-5 space-y-2">
                      {integ.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#2764B8] shrink-0 mt-0.5" />
                          <span>{h.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Quick Jump to Explorer */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedIntegration(index);
                        const explorerElement = document.getElementById("integration-explorer");
                        if (explorerElement) {
                          explorerElement.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2764B8] hover:text-[#1E5299] transition-colors"
                    >
                      <span>{language === "ID" ? "Buka di Explorer" : "Open in Explorer"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>

                    <Link
                      href="/request-demo"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {language === "ID" ? "Konsultasi" : "Consult"}
                    </Link>
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
      <section className="w-full py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
              {language === "ID" ? "Universal Hardware Interfacing" : "Universal Hardware Interfacing"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#345DAB] mt-2">
              {language === "ID"
                ? "Kompatibel dengan 500+ Mesin Laboratorium Global"
                : "Compatible with 500+ Global Medical Analyzers"}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2 font-light">
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
                className="rounded-2xl border border-slate-200/90 bg-[#F8FBFE] p-5 sm:p-6 text-center hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all duration-200"
              >
                <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-white border border-slate-200 text-[#2764B8] mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  {brand.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {brand.category}
                </p>
                <span className="inline-block mt-3 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#2764B8]">
                  {brand.protocols}
                </span>
              </div>
            ))}
          </div>

          {/* Additional compatibility note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600">
              {language === "ID"
                ? "* Mesin Anda belum tercantum di atas? Tim teknis kami dapat membangun driver instrumen kustom dalam hitungan hari kerja."
                : "* Don't see your specific machine above? Our engineering team builds custom instrument drivers within business days."}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE STRIP
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 bg-[#F2F6FA] border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[24px] bg-white border border-slate-200 p-8 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2764B8]">
                  {language === "ID" ? "Kepatuhan Regulasi & Privasi" : "Regulatory & Privacy Compliance"}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {language === "ID"
                    ? "Arsitektur Aman Sesuai Regulasi Kesehatan Nasional"
                    : "Secure Architecture Compliant with National Health Regulations"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-light">
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
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                      <ComplianceIcon className="h-5 w-5 text-[#2764B8] mb-2" />
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
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
      <CTABanner />
    </div>
  );
}
