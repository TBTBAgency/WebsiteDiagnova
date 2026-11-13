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
  Lock,
  Server,
  Radio,
  FileCheck2,
  BadgeCheck,
  ChevronRight,
  Activity,
  QrCode,
  TestTube2,
  Microscope,
  FlaskConical,
  Dna,
  AlertTriangle,
  HardDrive,
  Play,
  Pause,
  Search,
  RefreshCw,
  WifiOff,
  CheckCheck,
  ArrowDownUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

export default function IntegrationPage() {
  const { language } = useLanguage();
  const [selectedIntegration, setSelectedIntegration] = useState<number>(0);
  const [autoCycle, setAutoCycle] = useState<boolean>(false);
  const [simrsStep, setSimrsStep] = useState<number>(0);
  const [selectedBiomarker, setSelectedBiomarker] = useState<"creatinine" | "hba1c" | "hemoglobin">("creatinine");
  const [hostQueryIdx, setHostQueryIdx] = useState<number>(0);
  const [fhirResource, setFhirResource] = useState<"DiagnosticReport" | "ServiceRequest" | "Observation">("DiagnosticReport");
  const [gatewayOffline, setGatewayOffline] = useState<boolean>(false);
  const [bentoLoincIdx, setBentoLoincIdx] = useState<number>(0);
  const [bentoPanicAck, setBentoPanicAck] = useState<boolean>(false);
  const [analyzerQuery, setAnalyzerQuery] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setSelectedIntegration((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoCycle]);

  const integrations = [
    {
      id: "simrs-his",
      icon: Network,
      tabLabel: "SIMRS / HIS",
      shortDesc: language === "ID" ? "Order & Billing 2 Arah" : "Bidirectional Order & Billing",
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
          ? "Diagnova terhubung native dengan vendor SIMRS lokal dan internasional. Order lab dari poliklinik, rawat inap, atau IGD otomatis menjadi worklist barcode, dan hasil terverifikasi langsung kembali ke rekam medis SIMRS."
          : "Diagnova connects natively with local and international HIS platforms. Physician lab orders from clinics, wards, or ER flow into barcode worklists, and validated results post back directly into the EMR.",
      highlights: [
        language === "ID" ? "Zero double-entry pendaftaran pasien & parameter tes" : "Zero double-entry for patient demographics & test orders",
        language === "ID" ? "Sinkronisasi billing & klaim BPJS/Asuransi real-time" : "Real-time billing & insurance/BPJS charge capture",
        language === "ID" ? "Dukungan antrean multi-unit: Poli, Ranap, IGD Cito, ICU" : "Concurrent multi-unit streams: Outpatient, Ward, ER, ICU",
      ],
      protocols: ["HL7 v2.x (ORM / ORU)", "RESTful API / JSON", "Webservices / SOAP", "Direct DB Link"],
      metrics: [
        { val: "0 Error", label: language === "ID" ? "Salah Ketik Pasien" : "Patient ID Typing Error" },
        { val: language === "ID" ? "< 1 Detik" : "< 1 Sec", label: language === "ID" ? "Latensi Rilis Hasil" : "Result Return Latency" },
      ],
      simulationType: "simrs",
      simulationBadge: "Bidirectional HL7 / REST",
    },
    {
      id: "rme",
      icon: FileText,
      tabLabel: language === "ID" ? "Rekam Medis (RME)" : "EMR Integration",
      shortDesc: language === "ID" ? "Permenkes 24/2022 & Tren" : "EMR & Longitudinal Trends",
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
          ? "Mendukung penuh Permenkes No. 24/2022 tentang Rekam Medis Elektronik. Diagnova menyajikan hasil tes terstruktur, grafik tren biomarker lintas kunjungan, dan penanda panic value seketika di modul dokter DPJP."
          : "Fully aligns with Indonesian Ministry of Health Regulation (Permenkes 24/2022). Delivers structured lab observations, longitudinal biomarker trend charts, and instant panic alerts inside the physician's EMR.",
      highlights: [
        language === "ID" ? "Pemetaan kode terminologi standar LOINC nasional" : "Standardized national LOINC terminology mapping",
        language === "ID" ? "Grafik tren biomarker pasien lintas episode rawat" : "Cross-encounter longitudinal biomarker trend charts",
        language === "ID" ? "Tanda tangan digital tersertifikasi BSrE & QR verifikasi" : "BSrE certified digital signature & QR verification",
      ],
      protocols: ["FHIR R4 DiagnosticReport", "JSON REST API", "HL7 CDA", "Secure PDF Embed"],
      metrics: [
        { val: "100%", label: language === "ID" ? "Kepatuhan PMK 24/2022" : "Permenkes 24 Compliance" },
        { val: language === "ID" ? "Instan" : "Instant", label: language === "ID" ? "Notifikasi Panic Value" : "Panic Alert Dispatch" },
      ],
      simulationType: "rme",
      simulationBadge: "FHIR R4 DiagnosticReport",
    },
    {
      id: "analyzer",
      icon: Cpu,
      tabLabel: "Direct Analyzer",
      shortDesc: language === "ID" ? "500+ Mesin Lab Otomatis" : "500+ Lab Instruments",
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
          ? "Berkomunikasi langsung dengan 500+ model analyzer dari Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, hingga bioMérieux. Mesin membaca barcode tabung, menarik worklist (Host Query), dan mengirim hasil otomatis."
          : "Interfaces directly with 500+ clinical analyzer models from Roche, Abbott, Sysmex, Siemens, Beckman Coulter, Mindray, and bioMérieux via bidirectional Host Query and automated result ingestion.",
      highlights: [
        language === "ID" ? "Mode Host Query bidireksional otomatis dari rak sampel" : "Bidirectional Host Query directly from specimen racks",
        language === "ID" ? "Kunci validasi Westgard QC sebelum sampel pasien diproses" : "Automated Westgard QC gate before patient runs",
        language === "ID" ? "Tangkap flag instrumen (clot, hemolisis, lipemik) seketika" : "Raw flag ingestion (clot, hemolysis, lipemia alerts)",
      ],
      protocols: ["ASTM E1381 / E1394", "HL7 v2.3.1 / v2.5", "Serial RS-232", "TCP/IP LAN"],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Mesin Teruji" : "Compatible Analyzers" },
        { val: language === "ID" ? "0 Detik" : "0 Sec", label: language === "ID" ? "Ketik Manual Hasil" : "Manual Typing Time" },
      ],
      simulationType: "analyzer",
      simulationBadge: "ASTM E1381/E1394 & HL7",
    },
    {
      id: "satusehat",
      icon: ShieldCheck,
      tabLabel: "SATUSEHAT Kemenkes",
      shortDesc: language === "ID" ? "Standar HL7 FHIR R4" : "National HL7 FHIR R4",
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
          ? "Mengonversi data pemeriksaan lab lokal menjadi resource HL7 FHIR R4 terstandardisasi (ServiceRequest, Specimen, Observation, DiagnosticReport) lengkap dengan validasi IHS Number dan ontologi LOINC/SNOMED CT."
          : "Translates local lab orders and results into standardized HL7 FHIR R4 resources (ServiceRequest, Specimen, Observation, DiagnosticReport) with IHS Number validation and LOINC/SNOMED CT mapping.",
      highlights: [
        language === "ID" ? "Validasi NIK pasien ke IHS Number sebelum kirim payload" : "NIK-to-IHS patient ID verification prior to dispatch",
        language === "ID" ? "Pemetaan otomatis katalog lab ke LOINC & SNOMED CT" : "Automated LOINC & SNOMED CT terminology mapping",
        language === "ID" ? "Transmisi terenkripsi OAuth 2.0 Kemenkes & log audit penuh" : "Encrypted OAuth 2.0 MoH gateway with full audit trail",
      ],
      protocols: ["HL7 FHIR R4", "OAuth 2.0 Kemenkes", "HTTPS TLS 1.3", "RESTful Payload"],
      metrics: [
        { val: "100%", label: language === "ID" ? "Standar HL7 FHIR R4" : "HL7 FHIR R4 Standard" },
        { val: "99.8%", label: language === "ID" ? "Tingkat Sukses Kirim" : "Submission Success Rate" },
      ],
      simulationType: "satusehat",
      simulationBadge: "MoH SATUSEHAT HL7 FHIR",
    },
    {
      id: "connectivity",
      icon: Wifi,
      tabLabel: "Smart Gateway",
      shortDesc: language === "ID" ? "Buffer Offline 72 Jam" : "72h Offline Edge Buffer",
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
          ? "Gangguan internet atau LAN tidak boleh menghentikan layanan Cito. Smart Resilient Gateway menyimpan seluruh pembacaan analyzer di buffer lokal terenkripsi hingga 72 jam dan menyinkronkan ulang otomatis saat pulih."
          : "Network outages must never halt critical Cito lab services. Diagnova's Smart Resilient Gateway buffers analyzer readings locally in encrypted storage for up to 72 hours and auto-syncs with zero data loss.",
      highlights: [
        language === "ID" ? "Buffer lokal terenkripsi bertahan hingga 72 jam offline" : "Encrypted local edge buffer sustains up to 72 hours offline",
        language === "ID" ? "Prioritas sinkronisasi otomatis untuk sampel Cito IGD & ICU" : "Cito emergency & ICU specimens prioritized on reconnect",
        language === "ID" ? "Pemantauan heartbeat port serial & latensi mesin 24/7" : "24/7 serial port & analyzer heartbeat telemetry",
      ],
      protocols: ["Edge Local Caching", "TLS 1.3 / AES-256", "Auto-Reconnection Sync"],
      metrics: [
        { val: "99.9%", label: language === "ID" ? "Uptime Operasional" : "Operational Uptime" },
        { val: "0 Byte", label: language === "ID" ? "Data Hilang (Zero Loss)" : "Zero Data Loss" },
      ],
      simulationType: "gateway",
      simulationBadge: "Edge Architecture 99.9% SLA",
    },
  ];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = integrations[selectedIntegration];

  const selectPillar = (idx: number) => {
    setAutoCycle(false);
    setSelectedIntegration(idx);
    window.history.replaceState(null, "", `#${integrations[idx].id}`);
  };

  const modalityCatalog = [
    {
      key: "hematology",
      icon: TestTube2,
      discipline: language === "ID" ? "Hematologi & Koagulasi" : "Hematology & Coagulation",
      protocols: ["ASTM E1394", "HL7 v2.5", "TCP/IP"],
      brands: [
        { maker: "Sysmex", models: "XN-1000, XN-550, CS-2500" },
        { maker: "Mindray", models: "BC-6000, BC-5380, CX-6000" },
        { maker: "Horiba", models: "Yumizen H550, Pentra XLR" },
      ],
    },
    {
      key: "chemistry",
      icon: FlaskConical,
      discipline: language === "ID" ? "Kimia Klinik & Imunologi" : "Clinical Chemistry & Immunoassay",
      protocols: ["ASTM E1381", "HL7 v2.3.1", "RS-232"],
      brands: [
        { maker: "Roche", models: "Cobas c501, e411, Pure" },
        { maker: "Abbott", models: "Alinity ci, Architect i1000SR" },
        { maker: "Siemens", models: "Atellica CH/IM, Dimension EXL" },
      ],
    },
    {
      key: "microbiology",
      icon: Microscope,
      discipline: language === "ID" ? "Mikrobiologi & Urinalisis" : "Microbiology & Urinalysis",
      protocols: ["ASTM / BCI", "HL7 v2.x", "USB / LAN"],
      brands: [
        { maker: "bioMérieux", models: "VITEK 2, VIDAS, BACT/ALERT" },
        { maker: "Beckman Coulter", models: "DxU Iris, MicroScan" },
        { maker: "Sysmex", models: "UF-4000, UF-1500" },
      ],
    },
    {
      key: "molecular",
      icon: Dna,
      discipline: language === "ID" ? "Molekuler & Patologi" : "Molecular & Pathology",
      protocols: ["HL7 FHIR", "CSV / REST", "ASTM"],
      brands: [
        { maker: "Roche / Cepheid", models: "Cobas 6800, GeneXpert" },
        { maker: "Thermo / Qiagen", models: "QuantStudio, QIAcube" },
        { maker: "Digital Pathology", models: "WSI Scanner DICOM / SVS" },
      ],
    },
  ];

  const filteredModalities = modalityCatalog
    .filter((m) => selectedDiscipline === "all" || m.key === selectedDiscipline)
    .map((m) => {
      const q = analyzerQuery.trim().toLowerCase();
      if (!q) return m;
      const matchingBrands = m.brands.filter(
        (b) =>
          b.maker.toLowerCase().includes(q) ||
          b.models.toLowerCase().includes(q) ||
          m.discipline.toLowerCase().includes(q) ||
          m.protocols.some((p) => p.toLowerCase().includes(q))
      );
      return { ...m, brands: matchingBrands };
    })
    .filter((m) => m.brands.length > 0);

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero
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
          text: language === "ID" ? "Eksplorasi Topologi Integrasi" : "Explore Integration Topology",
          href: "#integration-explorer",
        }}
        metrics={[
          {
            value: language === "ID" ? "500+ Mesin" : "500+ Analyzers",
            label: language === "ID" ? "Analyzer Teruji" : "Supported Analyzers",
            sub: "Roche, Sysmex, Abbott, Mindray",
          },
          {
            value: "HL7 & FHIR",
            label: language === "ID" ? "Standar Kemenkes RI" : "National Health Standard",
            sub: "SATUSEHAT & Permenkes 24/2022",
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
          SECTION 1: INTERACTIVE HUB-AND-SPOKE TOPOLOGY & PROTOCOL INSPECTOR
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="integration-explorer"
        className="w-full py-16 sm:py-20 lg:py-24 bg-[#FAFBFD] border-y border-slate-200/60 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Topologi Interoperabilitas Live" : "Live Interoperability Topology"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis"
                  : "One Unified Hub for Your Entire Clinical Data Ecosystem"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Klik simpul pada diagram arsitektur di bawah untuk memeriksa alur protokol, payload data, dan jaminan latensi di setiap titik integrasi."
                : "Select any node in the topology diagram below to inspect protocol flows, payload structures, and latency guarantees."}
            </p>
          </div>

          {/* Interactive Hub-and-Spoke Topology Canvas */}
          <div className="rounded-[28px] bg-white border border-slate-200/80 p-5 sm:p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] mb-8">
            {/* Topology Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">
                  {language === "ID" ? "Klik simpul untuk inspeksi langsung" : "Click any node to inspect live"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAutoCycle((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                  autoCycle
                    ? "bg-[#0073FC] text-white border-[#0073FC] shadow-xs"
                    : "bg-[#F7F9FC] text-slate-700 border-slate-200 hover:border-blue-300"
                )}
              >
                {autoCycle ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>
                  {autoCycle
                    ? language === "ID"
                      ? "Jeda Tur Otomatis"
                      : "Pause Auto-Tour"
                    : language === "ID"
                    ? "Putar Tur Otomatis"
                    : "Play Auto-Tour"}
                </span>
              </button>
            </div>

            {/* Mobile/Tablet Quick Pillar Pills */}
            <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-4 mb-3 no-scrollbar">
              {integrations.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPillar(idx)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer shrink-0",
                    selectedIntegration === idx
                      ? "bg-[#0073FC] text-white border-[#0073FC]"
                      : "bg-[#F7F9FC] text-slate-700 border-slate-200"
                  )}
                >
                  {item.tabLabel}
                </button>
              ))}
            </div>

            <div className="relative">
              {/* Desktop SVG Connector Lines + Animated Data Packet */}
              <svg
                className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full"
                viewBox="0 0 1200 220"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Left Node 0 (Analyzer, index 2) -> Center */}
                <path
                  id="path-analyzer"
                  d="M 355 55 C 435 55, 435 110, 485 110"
                  fill="none"
                  stroke={selectedIntegration === 2 ? "#0073FC" : "#CBD5E1"}
                  strokeWidth={selectedIntegration === 2 ? "2.5" : "1.75"}
                  strokeDasharray={selectedIntegration === 2 ? "none" : "5 4"}
                />
                {/* Left Node 1 (Smart Gateway, index 4) -> Center */}
                <path
                  id="path-gateway"
                  d="M 355 165 C 435 165, 435 110, 485 110"
                  fill="none"
                  stroke={selectedIntegration === 4 ? "#0073FC" : "#CBD5E1"}
                  strokeWidth={selectedIntegration === 4 ? "2.5" : "1.75"}
                  strokeDasharray={selectedIntegration === 4 ? "none" : "5 4"}
                />
                {/* Center -> Right Node 0 (SIMRS, index 0) */}
                <path
                  id="path-simrs"
                  d="M 715 110 C 765 110, 765 36, 845 36"
                  fill="none"
                  stroke={selectedIntegration === 0 ? "#0073FC" : "#CBD5E1"}
                  strokeWidth={selectedIntegration === 0 ? "2.5" : "1.75"}
                  strokeDasharray={selectedIntegration === 0 ? "none" : "5 4"}
                />
                {/* Center -> Right Node 1 (RME, index 1) */}
                <path
                  id="path-rme"
                  d="M 715 110 L 845 110"
                  fill="none"
                  stroke={selectedIntegration === 1 ? "#0073FC" : "#CBD5E1"}
                  strokeWidth={selectedIntegration === 1 ? "2.5" : "1.75"}
                  strokeDasharray={selectedIntegration === 1 ? "none" : "5 4"}
                />
                {/* Center -> Right Node 2 (SATUSEHAT, index 3) */}
                <path
                  id="path-satusehat"
                  d="M 715 110 C 765 110, 765 184, 845 184"
                  fill="none"
                  stroke={selectedIntegration === 3 ? "#0073FC" : "#CBD5E1"}
                  strokeWidth={selectedIntegration === 3 ? "2.5" : "1.75"}
                  strokeDasharray={selectedIntegration === 3 ? "none" : "5 4"}
                />

                {/* Animated Packet Dot on Active Path */}
                <circle r="4.5" fill="#0073FC">
                  <animateMotion
                    dur="1.6s"
                    repeatCount="indefinite"
                    path={
                      selectedIntegration === 2
                        ? "M 355 55 C 435 55, 435 110, 485 110"
                        : selectedIntegration === 4
                        ? "M 355 165 C 435 165, 435 110, 485 110"
                        : selectedIntegration === 0
                        ? "M 715 110 C 765 110, 765 36, 845 36"
                        : selectedIntegration === 1
                        ? "M 715 110 L 845 110"
                        : "M 715 110 C 765 110, 765 184, 845 184"
                    }
                  />
                </circle>
              </svg>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-center">
                {/* Left Column: Lab Floor Inputs (Analyzer + Smart Gateway) */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                  {[2, 4].map((idx) => {
                    const item = integrations[idx];
                    const Icon = item.icon;
                    const active = selectedIntegration === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPillar(idx)}
                        className={cn(
                          "w-full text-left rounded-2xl p-4 border transition-all duration-200 flex items-center gap-3.5 cursor-pointer",
                          active
                            ? "bg-[#0073FC] text-white border-[#0073FC] shadow-[0_10px_24px_-8px_rgba(0,115,252,0.5)]"
                            : "bg-[#F7F9FC] text-slate-900 border-slate-200/70 hover:bg-[#F1F5FA] hover:border-blue-200"
                        )}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            active ? "bg-white/20 text-white" : "bg-[#E8F1FD] text-[#0073FC]"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold leading-tight truncate">{item.tabLabel}</p>
                          <p className={cn("text-xs mt-0.5 truncate", active ? "text-blue-100" : "text-slate-500")}>
                            {item.shortDesc}
                          </p>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400")} />
                      </button>
                    );
                  })}
                </div>

                {/* Mobile/Tablet Vertical Flow Indicator 1 */}
                <div className="flex lg:hidden items-center justify-center py-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1FD] text-[#0073FC] text-[11px] font-semibold">
                    <ArrowDownUp className="h-3 w-3 animate-pulse" />
                    <span>ASTM / RS-232 / Edge</span>
                  </span>
                </div>

                {/* Center Hub: Diagnova Interop Engine */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
                  <div className="w-full max-w-[260px] rounded-[24px] bg-[#0F172A] text-white p-5 text-center shadow-[0_18px_36px_-14px_rgba(15,23,42,0.45)] border border-slate-800">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0073FC]/20 text-[#60A5FA] text-[10px] font-bold uppercase tracking-wider mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CORE ENGINE</span>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-[#0073FC] text-white flex items-center justify-center mx-auto mb-2.5 shadow-[0_6px_18px_-4px_rgba(0,115,252,0.65)]">
                      <Server className="h-5 w-5" />
                    </div>
                    <p className="font-display text-base font-bold">Diagnova Interop Hub</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ASTM • HL7 v2.x • FHIR R4 • TLS 1.3
                    </p>
                  </div>
                </div>

                {/* Mobile/Tablet Vertical Flow Indicator 2 */}
                <div className="flex lg:hidden items-center justify-center py-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1FD] text-[#0073FC] text-[11px] font-semibold">
                    <ArrowDownUp className="h-3 w-3 animate-pulse" />
                    <span>HL7 ORM/ORU • FHIR R4</span>
                  </span>
                </div>

                {/* Right Column: Hospital & National Outputs (SIMRS, RME, SATUSEHAT) */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {[0, 1, 3].map((idx) => {
                    const item = integrations[idx];
                    const Icon = item.icon;
                    const active = selectedIntegration === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectPillar(idx)}
                        className={cn(
                          "w-full text-left rounded-2xl p-3.5 border transition-all duration-200 flex items-center gap-3.5 cursor-pointer",
                          active
                            ? "bg-[#0073FC] text-white border-[#0073FC] shadow-[0_10px_24px_-8px_rgba(0,115,252,0.5)]"
                            : "bg-[#F7F9FC] text-slate-900 border-slate-200/70 hover:bg-[#F1F5FA] hover:border-blue-200"
                        )}
                      >
                        <div
                          className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                            active ? "bg-white/20 text-white" : "bg-[#E8F1FD] text-[#0073FC]"
                          )}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold leading-tight truncate">{item.tabLabel}</p>
                          <p className={cn("text-xs mt-0.5 truncate", active ? "text-blue-100" : "text-slate-500")}>
                            {item.shortDesc}
                          </p>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-slate-400")} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Pillar Visual Inspector */}
          <div className="rounded-[28px] bg-white border border-slate-200/80 p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F1FD] text-[#0073FC]">
                    {current.targetDept}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {current.simulationBadge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                    {current.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#0073FC] mt-1">
                    {current.tagline}
                  </p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                    {current.description}
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {current.highlights.map((text) => (
                    <li key={text} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 stroke-[2.75]" />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {current.protocols.map((p) => (
                    <span
                      key={p}
                      className="rounded-lg bg-[#F7F9FC] border border-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-8">
                    {current.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-2xl font-bold text-[#0073FC]">{m.val}</p>
                        <p className="text-xs text-slate-500 font-medium">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/request-demo"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] transition-colors"
                  >
                    <span>{language === "ID" ? "Konsultasikan Integrasi Ini" : "Consult This Integration"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Right Bespoke Visual Mockup per Pillar */}
              <div className="lg:col-span-6">
                <div className="rounded-[24px] bg-[#F4F8FC] border border-slate-200/75 p-5 sm:p-6">
                  {/* Mockup Top Bar */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        {current.simulationBadge}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0073FC] bg-white px-2.5 py-0.5 rounded-full border border-blue-200/70">
                      LIVE TELEMETRY
                    </span>
                  </div>

                  {/* 1. SIMRS / HIS Visual: Interactive Bidirectional Sequence Flow */}
                  {current.simulationType === "simrs" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-700">
                        <div className={cn("rounded-xl border py-2 px-2 transition-colors", simrsStep === 0 ? "bg-[#0073FC] text-white border-[#0073FC]" : "bg-white border-slate-200/80")}>
                          SIMRS / HIS
                        </div>
                        <div className={cn("rounded-xl border py-2 px-2 transition-colors", simrsStep === 1 ? "bg-[#0073FC] text-white border-[#0073FC]" : "bg-white border-slate-200/80")}>
                          Diagnova LIS
                        </div>
                        <div className={cn("rounded-xl border py-2 px-2 transition-colors", simrsStep === 2 ? "bg-[#0073FC] text-white border-[#0073FC]" : "bg-white border-slate-200/80")}>
                          EMR & Billing
                        </div>
                      </div>
                      {[
                        { code: "ORM^O01", dir: "HIS → LIS", label: language === "ID" ? "Order Poli/IGD otomatis jadi worklist" : "ER/Clinic order → barcode worklist", ms: "140ms", payload: "MSH|^~\\&|SIMRS|IGD|DIAGNOVA|LIS||ORM^O01" },
                        { code: "DFT^P03", dir: "LIS → HIS", label: language === "ID" ? "Kunci billing & klaim BPJS real-time" : "Real-time BPJS / billing charge sync", ms: "95ms", payload: "FT1|1||20261114||CG|CBC-PANEL|BPJS-VALID" },
                        { code: "ORU^R01", dir: "LIS → EMR", label: language === "ID" ? "Hasil tervalidasi masuk ke layar dokter" : "Verified result posted to physician EMR", ms: "210ms", payload: "OBX|1|NM|718-7^HGB^LN||13.8|g/dL|F" },
                      ].map((row, idx) => (
                        <button
                          key={row.code}
                          type="button"
                          onClick={() => setSimrsStep(idx)}
                          className={cn(
                            "w-full text-left rounded-xl border p-3 flex items-center justify-between gap-3 transition-all cursor-pointer",
                            simrsStep === idx
                              ? "bg-white border-[#0073FC] shadow-xs ring-2 ring-[#0073FC]/15"
                              : "bg-white/80 border-slate-200/80 hover:border-blue-200"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#E8F1FD] text-[#0073FC] shrink-0">
                              {row.code}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">{row.label}</p>
                              <p className="text-[10px] text-slate-500 font-mono truncate">{row.payload}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-emerald-600 shrink-0">{row.ms}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 2. RME Visual: Interactive Biomarker Trend Switcher */}
                  {current.simulationType === "rme" && (() => {
                    const bioMap = {
                      creatinine: {
                        label: "Creatinine",
                        loinc: "LOINC 2160-0 • Serum Creatinine (mg/dL)",
                        badge: "1.8 mg/dL ↑",
                        badgeCls: "bg-amber-50 border-amber-200 text-amber-700",
                        points: "30,54 115,46 205,36 290,18",
                        pts: [
                          { x: 30, y: 54, val: "1.0" },
                          { x: 115, y: 46, val: "1.2" },
                          { x: 205, y: 36, val: "1.4" },
                          { x: 290, y: 18, val: "1.8" },
                        ],
                      },
                      hba1c: {
                        label: "HbA1c",
                        loinc: "LOINC 4548-4 • Hemoglobin A1c (%)",
                        badge: "6.2% ↓",
                        badgeCls: "bg-emerald-50 border-emerald-200 text-emerald-700",
                        points: "30,18 115,28 205,40 290,50",
                        pts: [
                          { x: 30, y: 18, val: "8.4" },
                          { x: 115, y: 28, val: "7.6" },
                          { x: 205, y: 40, val: "6.9" },
                          { x: 290, y: 50, val: "6.2" },
                        ],
                      },
                      hemoglobin: {
                        label: "Hemoglobin",
                        loinc: "LOINC 718-7 • Hemoglobin (g/dL)",
                        badge: "13.8 g/dL",
                        badgeCls: "bg-blue-50 border-blue-200 text-[#0073FC]",
                        points: "30,48 115,42 205,30 290,26",
                        pts: [
                          { x: 30, y: 48, val: "11.2" },
                          { x: 115, y: 42, val: "12.0" },
                          { x: 205, y: 30, val: "13.4" },
                          { x: 290, y: 26, val: "13.8" },
                        ],
                      },
                    }[selectedBiomarker];

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                          {(["creatinine", "hba1c", "hemoglobin"] as const).map((key) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedBiomarker(key)}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer capitalize",
                                selectedBiomarker === key
                                  ? "bg-[#0073FC] text-white border-[#0073FC]"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                              )}
                            >
                              {key === "hba1c" ? "HbA1c" : key}
                            </button>
                          ))}
                        </div>
                        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">Tn. Hendra Wijaya • #RM-0849201</p>
                              <p className="text-[11px] text-slate-500 truncate">{bioMap.loinc}</p>
                            </div>
                            <span className={cn("px-2 py-0.5 rounded-full border text-[11px] font-bold shrink-0", bioMap.badgeCls)}>
                              {bioMap.badge}
                            </span>
                          </div>
                          <div className="rounded-xl bg-[#F7F9FC] p-3 border border-slate-200/60">
                            <svg className="w-full h-20" viewBox="0 0 320 72" aria-hidden="true">
                              <line x1="20" y1="24" x2="300" y2="24" stroke="#F59E0B" strokeDasharray="4 3" strokeWidth="1" opacity="0.55" />
                              <polyline
                                fill="none"
                                stroke="#0073FC"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={bioMap.points}
                              />
                              {bioMap.pts.map((pt) => (
                                <g key={pt.x}>
                                  <circle cx={pt.x} cy={pt.y} r="4.5" fill="#0073FC" stroke="#FFFFFF" strokeWidth="2" />
                                  <text x={pt.x} y={pt.y - 8} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1E293B">
                                    {pt.val}
                                  </text>
                                </g>
                              ))}
                            </svg>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                              <QrCode className="h-3.5 w-3.5" /> BSrE SHA-256 Verified
                            </span>
                            <span>dr. Ratna Sp.PK</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. Direct Analyzer Visual: Interactive Host Query Cycler */}
                  {current.simulationType === "analyzer" && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 pb-1">
                        <span className="text-[11px] font-medium text-slate-600">
                          {language === "ID" ? "Klik untuk uji Host Query:" : "Click to test Host Query:"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHostQueryIdx((prev) => (prev + 1) % 3)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-[#0073FC] text-[11px] font-semibold hover:bg-[#E8F1FD] transition-colors cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>{language === "ID" ? "Scan Tabung Berikutnya" : "Scan Next Tube"}</span>
                        </button>
                      </div>
                      {[
                        { machine: "Sysmex XN-1000", proto: "ASTM E1394 • TCP/IP", sample: "#SP-08819", qc: "Westgard PASS" },
                        { machine: "Roche Cobas c501", proto: "HL7 v2.5 • LAN", sample: "#SP-08820", qc: "Westgard PASS" },
                        { machine: "Abbott Alinity i", proto: "ASTM E1381 • RS-232", sample: "#SP-08821", qc: "Host Query OK" },
                      ].map((inst, idx) => (
                        <div
                          key={inst.machine}
                          onClick={() => setHostQueryIdx(idx)}
                          className={cn(
                            "rounded-xl bg-white border p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer",
                            hostQueryIdx === idx
                              ? "border-[#0073FC] ring-2 ring-[#0073FC]/15 shadow-xs"
                              : "border-slate-200/80 hover:border-blue-200"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", hostQueryIdx === idx ? "bg-[#0073FC] text-white" : "bg-[#E8F1FD] text-[#0073FC]")}>
                              <Cpu className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{inst.machine}</p>
                              <p className="text-[11px] text-slate-500 font-mono truncate">{inst.proto} • {inst.sample}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold shrink-0">
                            {hostQueryIdx === idx ? "Query Active ✓" : inst.qc}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. SATUSEHAT Visual: Interactive FHIR R4 Resource Tabs */}
                  {current.simulationType === "satusehat" && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(["DiagnosticReport", "ServiceRequest", "Observation"] as const).map((res) => (
                          <button
                            key={res}
                            type="button"
                            onClick={() => setFhirResource(res)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition-colors cursor-pointer",
                              fhirResource === res
                                ? "bg-[#0073FC] text-white border-[#0073FC]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
                            )}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                      <div className="rounded-xl bg-[#0F172A] text-slate-100 p-4 font-mono text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between text-slate-400 mb-2 pb-2 border-b border-slate-800">
                          <span className="truncate">POST /fhir-r4/v1/{fhirResource}</span>
                          <span className="text-emerald-400 font-bold shrink-0">201 Created</span>
                        </div>
                        {fhirResource === "DiagnosticReport" && (
                          <>
                            <p><span className="text-blue-400">&quot;resourceType&quot;</span>: &quot;DiagnosticReport&quot;,</p>
                            <p><span className="text-blue-400">&quot;subject&quot;</span>: &quot;Patient/P10029482103&quot;,</p>
                            <p><span className="text-blue-400">&quot;code&quot;</span>: &quot;LOINC#57021-8 (CBC)&quot;,</p>
                            <p><span className="text-blue-400">&quot;status&quot;</span>: &quot;final&quot;</p>
                          </>
                        )}
                        {fhirResource === "ServiceRequest" && (
                          <>
                            <p><span className="text-blue-400">&quot;resourceType&quot;</span>: &quot;ServiceRequest&quot;,</p>
                            <p><span className="text-blue-400">&quot;intent&quot;</span>: &quot;order&quot;,</p>
                            <p><span className="text-blue-400">&quot;priority&quot;</span>: &quot;stat (CITO)&quot;,</p>
                            <p><span className="text-blue-400">&quot;requester&quot;</span>: &quot;Practitioner/N10009182&quot;</p>
                          </>
                        )}
                        {fhirResource === "Observation" && (
                          <>
                            <p><span className="text-blue-400">&quot;resourceType&quot;</span>: &quot;Observation&quot;,</p>
                            <p><span className="text-blue-400">&quot;code&quot;</span>: &quot;LOINC#718-7 (Hemoglobin)&quot;,</p>
                            <p><span className="text-blue-400">&quot;valueQuantity&quot;</span>: &quot;13.8 g/dL&quot;,</p>
                            <p><span className="text-blue-400">&quot;interpretation&quot;</span>: &quot;Normal&quot;</p>
                          </>
                        )}
                      </div>
                      <div className="rounded-xl bg-white border border-slate-200/80 p-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">OAuth 2.0 Kemenkes Gateway</span>
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> IHS Validated
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 5. Smart Gateway Visual: Interactive Offline / Online Failover Toggle */}
                  {current.simulationType === "gateway" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-600">
                          {language === "ID" ? "Simulasi Kondisi Jaringan:" : "Simulate Network State:"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGatewayOffline((prev) => !prev)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer",
                            gatewayOffline
                              ? "bg-amber-50 border-amber-300 text-amber-800"
                              : "bg-white border-emerald-200 text-emerald-700"
                          )}
                        >
                          {gatewayOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                          <span>{gatewayOffline ? "WAN Offline (Buffering)" : "WAN Online (Synced)"}</span>
                        </button>
                      </div>
                      <div className="rounded-xl bg-white border border-slate-200/80 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <HardDrive className="h-4 w-4 text-[#0073FC]" /> Edge Buffer Storage
                          </span>
                          <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-full", gatewayOffline ? "text-amber-800 bg-amber-50" : "text-emerald-700 bg-emerald-50")}>
                            {gatewayOffline ? "Local Buffer Active" : "AES-256 Synced"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-lg bg-[#F7F9FC] p-2.5">
                            <p className="text-xs font-bold text-slate-900">{gatewayOffline ? "142 Rows" : "72 Jam"}</p>
                            <p className="text-[10px] text-slate-500">{gatewayOffline ? "Queued Safely" : "Offline Capacity"}</p>
                          </div>
                          <div className="rounded-lg bg-[#E8F1FD] p-2.5">
                            <p className="text-xs font-bold text-[#0073FC]">CITO First</p>
                            <p className="text-[10px] text-slate-600">Priority Sync</p>
                          </div>
                          <div className="rounded-lg bg-[#F7F9FC] p-2.5">
                            <p className="text-xs font-bold text-emerald-700">0 Byte</p>
                            <p className="text-[10px] text-slate-500">Packet Loss</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white border border-slate-200/80 p-3 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                          <Radio className={cn("h-3.5 w-3.5", gatewayOffline ? "text-amber-500 animate-pulse" : "text-emerald-500")} />{" "}
                          {gatewayOffline ? "Edge Recording Active (No Internet Required)" : "Heartbeat Telemetry: Active"}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#0073FC]">99.9% SLA</span>
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
          SECTION 2: 2x2 VISUAL BENTO PIPELINE SHOWCASE (#architecture)
          ══════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="w-full py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Alur Data End-to-End" : "End-to-End Data Lifecycle"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Bagaimana Data Mengalir Tanpa Friksi dari Alat ke Dokter"
                  : "How Data Flows Without Friction from Bench to Physician"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Empat mekanisme inti memastikan setiap sampel barcode, kontrol kualitas Westgard, hingga pelaporan nilai kritis berjalan otomatis dan teraudit."
                : "Four core engineering layers ensure every barcoded specimen, Westgard QC gate, and critical alert flows automatically with full traceability."}
            </p>
          </div>

          {/* 2x2 Visual Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bento 1: Host Query & Westgard QC Gate */}
            <div className="rounded-[28px] bg-[#FAFBFD] border border-slate-200/80 p-7 sm:p-9 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Cpu className="h-5 w-5 text-[#0073FC]" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Host Query Barcode & Gerbang QC Westgard" : "Barcode Host Query & Westgard QC Gate"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "ID"
                    ? "Begitu tabung sampel masuk ke rak analyzer, mesin menarik profil tes secara otomatis dan memblokir rilis jika QC harian belum lolos."
                    : "The moment a barcoded tube enters the analyzer rack, test profiles load automatically and patient runs are gated by daily Westgard QC."}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-[#F7F9FC] border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-800">
                    #SP-08819
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold text-[#0073FC] bg-[#E8F1FD] px-2.5 py-1.5 rounded-lg">
                    CBC + HbA1c
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Westgard 1-2s PASS
                </span>
              </div>
            </div>

            {/* Bento 2: Semantic Mapping (Raw -> LOINC / SNOMED) */}
            <div className="rounded-[28px] bg-[#FAFBFD] border border-slate-200/80 p-7 sm:p-9 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Activity className="h-5 w-5 text-[#0073FC]" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Normalisasi Terminologi LOINC & SNOMED CT" : "Automated LOINC & SNOMED CT Mapping"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "ID"
                    ? "Kode mentah dari berbagai merek alat diseragamkan otomatis menjadi standar HL7 FHIR R4 agar siap dikirim ke RME dan SATUSEHAT."
                    : "Proprietary instrument codes normalize automatically into HL7 FHIR R4 ontologies ready for hospital EMR and national exchange."}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-2.5 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-1.5">
                  {["HGB", "CREA", "GLU", "WBC"].map((code, idx) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setBentoLoincIdx(idx)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer",
                        bentoLoincIdx === idx
                          ? "bg-[#0073FC] text-white border-[#0073FC]"
                          : "bg-[#F7F9FC] text-slate-600 border-slate-200 hover:border-blue-200"
                      )}
                    >
                      {code}
                    </button>
                  ))}
                </div>
                {(() => {
                  const map = [
                    { raw: "HGB (Sysmex XN)", std: "LOINC 718-7 • Hemoglobin [Mass/vol]" },
                    { raw: "CREA (Roche Cobas)", std: "LOINC 2160-0 • Creatinine [Mass/vol]" },
                    { raw: "GLU (Abbott Alinity)", std: "LOINC 2345-7 • Glucose [Mass/vol]" },
                    { raw: "WBC (Mindray BC-6000)", std: "LOINC 6690-2 • Leukocytes [#/vol]" },
                  ][bentoLoincIdx];
                  return (
                    <div className="flex items-center justify-between gap-2 bg-[#F7F9FC] rounded-lg px-3 py-2.5">
                      <span className="text-slate-700 shrink-0">{map.raw}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#0073FC] shrink-0" />
                      <span className="font-bold text-[#0073FC] truncate">{map.std}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Bento 3: 72-Hour Offline Edge Resilience */}
            <div className="rounded-[28px] bg-[#FAFBFD] border border-slate-200/80 p-7 sm:p-9 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Wifi className="h-5 w-5 text-[#0073FC]" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Ketahanan Jaringan & Antrean Prioritas Cito" : "Offline Edge Buffer & Cito Priority Sync"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "ID"
                    ? "Saat koneksi internet terputus, Smart Gateway menampung hasil di penyimpanan lokal terenkripsi hingga 72 jam dengan sinkronisasi Cito lebih dulu."
                    : "During WAN disruptions, Smart Gateway buffers encrypted readings locally for up to 72 hours and reconciles Cito specimens first."}
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold text-slate-700">
                    {language === "ID" ? "Mode Offline: 142 Hasil Tersimpan Aman" : "Offline Mode: 142 Results Buffered"}
                  </span>
                </div>
                <span className="font-bold text-[#0073FC] bg-[#E8F1FD] px-2.5 py-1 rounded-full">0% Loss</span>
              </div>
            </div>

            {/* Bento 4: Instant Panic Value & BSrE Sign-Off */}
            <div className="rounded-[28px] bg-[#FAFBFD] border border-slate-200/80 p-7 sm:p-9 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <ShieldCheck className="h-5 w-5 text-[#0073FC]" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Peringatan Nilai Kritis & Pengesahan BSrE" : "Instant Panic Alerts & BSrE Digital Sign-Off"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {language === "ID"
                    ? "Nilai kritis langsung memicu eskalasi SLA < 15 menit (KARS SKP 2.2) dan laporan final disegel tanda tangan elektronik tersertifikasi."
                    : "Critical values trigger sub-15-minute KARS escalation alerts while final reports are sealed with accredited cryptographic signatures."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setBentoPanicAck((prev) => !prev)}
                className={cn(
                  "w-full text-left rounded-2xl p-4 flex items-center justify-between gap-3 text-xs transition-all cursor-pointer",
                  bentoPanicAck
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-[#0073FC] text-white shadow-[0_10px_24px_-8px_rgba(0,115,252,0.5)] hover:bg-[#0064DB]"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {bentoPanicAck ? (
                    <CheckCheck className="h-4 w-4 text-emerald-100 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-300 shrink-0" />
                  )}
                  <span className="font-semibold truncate">
                    {bentoPanicAck
                      ? language === "ID"
                        ? "Diterima dr. DPJP (01m 42d) • Tercatat di Audit KARS"
                        : "Acknowledged by Physician (01m 42s) • Logged"
                      : language === "ID"
                      ? "K+ 6.4 mmol/L • Klik untuk Simulasi Konfirmasi DPJP"
                      : "K+ 6.4 mmol/L • Click to Simulate Physician Ack"}
                  </span>
                </div>
                <BadgeCheck className="h-4 w-4 text-blue-100 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: HARDWARE & PROTOCOL MATRIX BY LAB DISCIPLINE
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 lg:py-24 bg-[#FAFBFD] border-b border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kompatibilitas 500+ Analyzer" : "500+ Analyzer Compatibility"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Matriks Instrumen Berdasarkan Divisi Laboratorium"
                  : "Instrument Compatibility Across Every Lab Discipline"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Mendukung protokol standar industri ASTM E1381/E1394, HL7 v2.x, Serial RS-232, dan TCP/IP LAN di seluruh lini instrumen medis."
                : "Supports industry-standard ASTM E1381/E1394, HL7 v2.x, Serial RS-232, and TCP/IP LAN across every clinical laboratory modality."}
            </p>
          </div>

          {/* Search & Discipline Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { key: "all", label: language === "ID" ? "Semua Divisi" : "All Disciplines" },
                { key: "hematology", label: language === "ID" ? "Hematologi" : "Hematology" },
                { key: "chemistry", label: language === "ID" ? "Kimia & Imuno" : "Chemistry" },
                { key: "microbiology", label: language === "ID" ? "Mikrobiologi" : "Microbiology" },
                { key: "molecular", label: language === "ID" ? "Molekuler" : "Molecular" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedDiscipline(tab.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer shrink-0",
                    selectedDiscipline === tab.key
                      ? "bg-[#0073FC] text-white border-[#0073FC] shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-slate-900"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={analyzerQuery}
                onChange={(e) => setAnalyzerQuery(e.target.value)}
                placeholder={language === "ID" ? "Cari merek / model (mis. Cobas, XN)..." : "Search brand / model (e.g. Cobas, XN)..."}
                className="w-full rounded-full bg-white border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0073FC] focus:ring-2 focus:ring-[#0073FC]/15 transition-all"
              />
            </div>
          </div>

          {/* Filtered Discipline Cards */}
          {filteredModalities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredModalities.map((mod) => {
                const ModIcon = mod.icon;
                return (
                  <div
                    key={mod.discipline}
                    className="rounded-[24px] bg-white border border-slate-200/80 p-6 sm:p-7 transition-all duration-200 hover:border-blue-200/80 hover:shadow-[0_10px_28px_-12px_rgba(0,115,252,0.14)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
                          <ModIcon className="h-5 w-5 stroke-[1.75]" />
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                          {mod.discipline}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.protocols.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-[#F7F9FC] border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-[#0073FC]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {mod.brands.map((b) => (
                        <div
                          key={b.maker}
                          className="flex items-center justify-between gap-3 rounded-xl bg-[#F7F9FC] px-3.5 py-2.5 text-xs sm:text-[13px]"
                        >
                          <span className="font-bold text-slate-900">{b.maker}</span>
                          <span className="text-slate-600 font-mono text-xs text-right">{b.models}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white border border-slate-200/80 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                {language === "ID"
                  ? `Model "${analyzerQuery}" belum tampil di ringkasan katalog.`
                  : `Model "${analyzerQuery}" is not shown in the summary catalog.`}
              </p>
              <p className="text-xs text-slate-500">
                {language === "ID"
                  ? "Diagnova mendukung 500+ instrumen via ASTM/HL7 dan dapat membangun driver kustom dalam 3–5 hari kerja."
                  : "Diagnova supports 500+ instruments via ASTM/HL7 and builds custom drivers in 3–5 business days."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAnalyzerQuery("");
                  setSelectedDiscipline("all");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8F1FD] text-[#0073FC] text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {language === "ID" ? "Reset Pencarian" : "Reset Search"}
              </button>
            </div>
          )}

          {/* Custom Driver Guarantee Banner */}
          <div className="mt-8 p-5 sm:px-7 rounded-2xl bg-[#F1F4F8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-700 font-normal">
              <strong className="font-semibold text-slate-900">
                {language === "ID" ? "Mesin lab Anda belum tercantum?" : "Don't see your analyzer model?"}
              </strong>{" "}
              {language === "ID"
                ? "Tim engineering kami membangun driver ASTM/HL7 kustom dalam 3–5 hari kerja tanpa biaya tambahan."
                : "Our engineering team builds custom ASTM/HL7 drivers within 3–5 business days at no extra fee."}
            </p>
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] shrink-0 transition-colors"
            >
              <span>{language === "ID" ? "Ajukan Cek Kompatibilitas" : "Request Driver Check"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE BANNER
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[28px] sm:rounded-[32px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0073FC] text-[11px] font-bold uppercase tracking-wider border border-blue-200/70">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{language === "ID" ? "Kepatuhan Regulasi & Privasi" : "Regulatory & Privacy Compliance"}</span>
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {language === "ID"
                    ? "Arsitektur Interoperabilitas Sesuai Regulasi Kesehatan Nasional"
                    : "Interoperability Architecture Built for National Health Compliance"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                  {language === "ID"
                    ? "Setiap pertukaran data dilindungi enkripsi TLS 1.3 / AES-256 serta memenuhi amanat Permenkes 24/2022, standar SATUSEHAT Kemenkes RI, dan UU Perlindungan Data Pribadi."
                    : "Every data exchange is guarded by TLS 1.3 / AES-256 encryption, fully aligning with Permenkes 24/2022, MoH SATUSEHAT FHIR, and Indonesia's PDP Act."}
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { code: "PMK 24/2022", label: language === "ID" ? "RME Terstruktur" : "Structured EMR", icon: FileCheck2 },
                  { code: "SATUSEHAT", label: "HL7 FHIR R4", icon: ShieldCheck },
                  { code: "UU PDP 27/2022", label: language === "ID" ? "Privasi Pasien" : "Patient Privacy", icon: Lock },
                  { code: "KARS SKP 2.2", label: language === "ID" ? "Nilai Kritis < 15m" : "Panic SLA < 15m", icon: Activity },
                  { code: "ISO 15189", label: language === "ID" ? "Mutu Lab Medik" : "Lab Quality", icon: BadgeCheck },
                  { code: "TLS 1.3", label: "AES-256 Encrypted", icon: Server },
                ].map((badge) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <div
                      key={badge.code}
                      className="rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs flex items-center gap-2.5"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                        <BadgeIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block leading-tight truncate">{badge.code}</span>
                        <span className="text-[10px] font-medium text-slate-500 block truncate">{badge.label}</span>
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
      <CTABanner bgClassName="bg-[#FAFBFD]" topColor="#FAFBFD" />
    </div>
  );
}
