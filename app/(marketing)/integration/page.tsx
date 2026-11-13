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
  Activity,
  QrCode,
  Search,
  RefreshCw,
  WifiOff,
  Play,
  Pause,
  Terminal,
  Clock,
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
  const [traceSampleIdx, setTraceSampleIdx] = useState<number>(0);
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
      targetDept: language === "ID" ? "Hospital Information System" : "Hospital Information System",
      name: "SIMRS / HIS Bridging",
      tagline:
        language === "ID"
          ? "Sinkronisasi Order, Barcode Worklist & Billing Real-Time"
          : "Real-Time Order, Barcode Worklist & Billing Synchronization",
      description:
        language === "ID"
          ? "Terhubung native dengan vendor SIMRS lokal maupun internasional. Order dokter dari poliklinik, rawat inap, dan IGD langsung membentuk antrean barcode tanpa entri ulang."
          : "Connects natively with local and international HIS platforms. Physician orders from clinics, wards, and ER automatically generate barcode worklists with zero re-entry.",
      highlights: [
        language === "ID" ? "Zero double-entry demografi pasien & parameter tes" : "Zero double-entry for patient demographics & test orders",
        language === "ID" ? "Kunci billing & verifikasi klaim BPJS secara real-time" : "Real-time billing & BPJS/insurance charge capture",
        language === "ID" ? "Mendukung alur Poli, Ranap, IGD Cito, hingga ICU" : "Supports Outpatient, Inpatient, ER Cito, and ICU",
      ],
      protocols: ["HL7 v2.x (ORM / ORU)", "RESTful JSON", "SOAP / XML", "Direct DB Link"],
      metrics: [
        { val: "0", label: language === "ID" ? "Entri Ulang Manual" : "Manual Re-Entry" },
        { val: "< 250ms", label: language === "ID" ? "Latensi Pertukaran" : "Round-Trip Latency" },
      ],
      simulationType: "simrs",
      simulationBadge: "HL7 v2.x / REST BRIDGE",
    },
    {
      id: "rme",
      icon: FileText,
      tabLabel: language === "ID" ? "Rekam Medis (RME)" : "EMR Integration",
      shortDesc: language === "ID" ? "Permenkes 24/2022" : "EMR & Biomarker Trends",
      targetDept: language === "ID" ? "Kepatuhan Permenkes 24/2022" : "Permenkes 24/2022 EMR",
      name: "Rekam Medis Elektronik (RME)",
      tagline:
        language === "ID"
          ? "Hasil Terstruktur, Tren Biomarker & Segel Digital BSrE"
          : "Structured Observations, Longitudinal Trends & Digital Seal",
      description:
        language === "ID"
          ? "Menyajikan hasil laboratorium terstruktur berbasis LOINC langsung di layar DPJP lengkap dengan grafik riwayat biomarker lintas kunjungan dan tanda tangan elektronik."
          : "Delivers LOINC-coded laboratory observations directly inside the physician's EMR with cross-encounter biomarker trend charts and cryptographic sign-off.",
      highlights: [
        language === "ID" ? "Pemetaan terminologi standar LOINC & SNOMED CT" : "Standardized LOINC & SNOMED CT terminology mapping",
        language === "ID" ? "Grafik tren biomarker serial lintas episode rawat" : "Cross-encounter longitudinal biomarker trend charts",
        language === "ID" ? "Tanda tangan elektronik tersertifikasi BSrE & QR" : "BSrE certified digital signature & QR verification",
      ],
      protocols: ["FHIR R4 DiagnosticReport", "REST JSON API", "HL7 CDA", "Signed PDF"],
      metrics: [
        { val: "100%", label: language === "ID" ? "Kepatuhan PMK 24" : "PMK 24 Compliant" },
        { val: "< 15m", label: language === "ID" ? "SLA Nilai Kritis" : "Critical Panic SLA" },
      ],
      simulationType: "rme",
      simulationBadge: "FHIR R4 DIAGNOSTICREPORT",
    },
    {
      id: "analyzer",
      icon: Cpu,
      tabLabel: "Direct Analyzer",
      shortDesc: language === "ID" ? "500+ Mesin Lab" : "500+ Lab Instruments",
      targetDept: language === "ID" ? "500+ Instrumen Teruji" : "500+ Tested Analyzers",
      name: "Direct Analyzer Interfacing",
      tagline:
        language === "ID"
          ? "Host Query Bidireksional & Validasi QC Westgard Otomatis"
          : "Bidirectional Host Query & Automated Westgard QC Gate",
      description:
        language === "ID"
          ? "Komunikasi langsung dengan mesin hematologi, kimia klinik, imunologi, dan mikrobiologi. Pembacaan barcode otomatis menarik profil tes dan memblokir rilis bila QC gagal."
          : "Direct interfacing with hematology, chemistry, immunoassay, and microbiology analyzers. Barcode scans pull test profiles automatically and gate runs on Westgard QC.",
      highlights: [
        language === "ID" ? "Host Query bidireksional langsung dari rak sampel" : "Bidirectional Host Query directly from specimen racks",
        language === "ID" ? "Gerbang validasi QC Westgard sebelum rilis hasil" : "Automated Westgard QC gate prior to result release",
        language === "ID" ? "Ingesti flag instrumen (clot, hemolisis, lipemik)" : "Raw instrument flag ingestion (clot, hemolysis, lipemia)",
      ],
      protocols: ["ASTM E1381 / E1394", "HL7 v2.3.1 / v2.5", "RS-232 Serial", "TCP/IP LAN"],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Analyzer" : "Analyzer Models" },
        { val: "0s", label: language === "ID" ? "Waktu Ketik Hasil" : "Manual Typing Time" },
      ],
      simulationType: "analyzer",
      simulationBadge: "ASTM E1394 / HL7 QUERY",
    },
    {
      id: "satusehat",
      icon: ShieldCheck,
      tabLabel: "SATUSEHAT Kemenkes",
      shortDesc: language === "ID" ? "HL7 FHIR R4" : "National HL7 FHIR R4",
      targetDept: language === "ID" ? "Kementerian Kesehatan RI" : "Ministry of Health RI",
      name: "SATUSEHAT Interoperabilitas",
      tagline:
        language === "ID"
          ? "Konversi Otomatis Resource HL7 FHIR R4 Siap Kirim"
          : "Turnkey HL7 FHIR R4 Resource Transformation & Dispatch",
      description:
        language === "ID"
          ? "Mengonversi order dan hasil lab lokal menjadi resource FHIR R4 terstandar lengkap dengan validasi NIK ke IHS Number dan pemetaan kamus LOINC/SNOMED Kemenkes."
          : "Transforms local lab orders and results into standard FHIR R4 resources with automated NIK-to-IHS validation and Ministry of Health LOINC/SNOMED mapping.",
      highlights: [
        language === "ID" ? "Validasi NIK pasien ke IHS Number sebelum transmisi" : "NIK-to-IHS patient ID verification prior to dispatch",
        language === "ID" ? "Pemetaan kamus LOINC & SNOMED CT terotomasi" : "Automated LOINC & SNOMED CT dictionary mapping",
        language === "ID" ? "Gateway OAuth 2.0 Kemenkes dengan log audit penuh" : "Official OAuth 2.0 MoH gateway with full audit logs",
      ],
      protocols: ["HL7 FHIR R4", "OAuth 2.0 Kemenkes", "TLS 1.3", "JSON Payload"],
      metrics: [
        { val: "99.8%", label: language === "ID" ? "Sukses Transmisi" : "Delivery Success" },
        { val: "FHIR R4", label: language === "ID" ? "Standar Nasional" : "National Standard" },
      ],
      simulationType: "satusehat",
      simulationBadge: "SATUSEHAT FHIR R4 GATEWAY",
    },
    {
      id: "connectivity",
      icon: Wifi,
      tabLabel: "Smart Gateway",
      shortDesc: language === "ID" ? "Buffer Offline 72 Jam" : "72h Offline Buffer",
      targetDept: language === "ID" ? "Edge Resilience" : "Edge Resilience",
      name: "Smart Resilient Gateway",
      tagline:
        language === "ID"
          ? "Operasional Lab Tanpa Henti dengan Buffer Lokal 72 Jam"
          : "Uninterrupted Lab Operations with 72-Hour Encrypted Edge Buffer",
      description:
        language === "ID"
          ? "Gangguan internet atau LAN tidak menghentikan layanan IGD Cito. Gateway menyimpan seluruh pembacaan analyzer di buffer lokal terenkripsi hingga 72 jam."
          : "Network outages never halt emergency Cito diagnostics. The edge gateway buffers encrypted analyzer telemetry locally for up to 72 hours with zero packet loss.",
      highlights: [
        language === "ID" ? "Penyimpanan buffer lokal terenkripsi AES-256 hingga 72 jam" : "AES-256 encrypted local buffer for up to 72 hours",
        language === "ID" ? "Rekonsiliasi prioritas sampel Cito IGD & ICU otomatis" : "Automatic Cito ER & ICU priority queue reconciliation",
        language === "ID" ? "Telemetri heartbeat port serial & status mesin 24/7" : "24/7 serial port & analyzer heartbeat monitoring",
      ],
      protocols: ["Edge Local Cache", "TLS 1.3 / AES-256", "Cito Priority Sync"],
      metrics: [
        { val: "99.9%", label: language === "ID" ? "Uptime SLA" : "Uptime SLA" },
        { val: "0 Byte", label: language === "ID" ? "Data Hilang" : "Data Loss" },
      ],
      simulationType: "gateway",
      simulationBadge: "EDGE RESILIENCE ENGINE",
    },
  ];

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIndex = integrations.findIndex((item) => item.id === hash);
        if (foundIndex !== -1) setSelectedIntegration(foundIndex);
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

  const traceSamples = [
    {
      id: "IGD CITO • #9435",
      patient: "Tn. Agus Pratama • Kalium (K+)",
      stages: [
        { step: "01", title: "Barcode Rack", detail: "Cobas c501 Host Query", time: "00:00.12s" },
        { step: "02", title: "Westgard QC", detail: "1-2s Control PASS", time: "00:00.19s" },
        { step: "03", title: "FHIR & LOINC", detail: "LOINC 2823-3 • 6.4 mmol/L", time: "00:00.28s" },
        { step: "04", title: "Panic Escalation", detail: "DPJP Alerted + BSrE Seal", time: "00:01.40s" },
      ],
    },
    {
      id: "POLI DALAM • #7889",
      patient: "Ny. Sari Dewi • HbA1c + CBC",
      stages: [
        { step: "01", title: "Barcode Rack", detail: "Sysmex XN-1000 Query", time: "00:00.09s" },
        { step: "02", title: "Westgard QC", detail: "Daily QC Verified", time: "00:00.15s" },
        { step: "03", title: "FHIR & LOINC", detail: "LOINC 4548-4 • 6.2%", time: "00:00.24s" },
        { step: "04", title: "EMR & SATUSEHAT", detail: "HTTP 201 Created", time: "00:00.82s" },
      ],
    },
  ];

  const analyzerCatalog = [
    { discipline: "hematology", label: language === "ID" ? "Hematologi & Koagulasi" : "Hematology & Coag", maker: "Sysmex", models: "XN-1000, XN-550, CS-2500, UF-4000", iface: "TCP/IP LAN", protocol: "ASTM E1394" },
    { discipline: "hematology", label: language === "ID" ? "Hematologi & Koagulasi" : "Hematology & Coag", maker: "Mindray", models: "BC-6000, BC-5380, CX-6000", iface: "TCP/IP / RS-232", protocol: "HL7 v2.5" },
    { discipline: "hematology", label: language === "ID" ? "Hematologi & Koagulasi" : "Hematology & Coag", maker: "Horiba Medical", models: "Yumizen H550, Pentra XLR", iface: "TCP/IP LAN", protocol: "ASTM E1381" },
    { discipline: "chemistry", label: language === "ID" ? "Kimia Klinik & Imuno" : "Chemistry & Immuno", maker: "Roche Diagnostics", models: "Cobas c501, e411, Pure, Pro", iface: "TCP/IP LAN", protocol: "ASTM / HL7" },
    { discipline: "chemistry", label: language === "ID" ? "Kimia Klinik & Imuno" : "Chemistry & Immuno", maker: "Abbott Core", models: "Alinity ci, Architect i1000SR", iface: "TCP/IP / Serial", protocol: "ASTM E1381" },
    { discipline: "chemistry", label: language === "ID" ? "Kimia Klinik & Imuno" : "Chemistry & Immuno", maker: "Siemens Healthineers", models: "Atellica CH/IM, Dimension EXL", iface: "TCP/IP LAN", protocol: "HL7 v2.5" },
    { discipline: "microbiology", label: language === "ID" ? "Mikrobiologi & Urin" : "Microbiology & Urine", maker: "bioMérieux", models: "VITEK 2, VIDAS, BACT/ALERT", iface: "TCP/IP / BCI", protocol: "ASTM / BCI" },
    { discipline: "microbiology", label: language === "ID" ? "Mikrobiologi & Urin" : "Microbiology & Urine", maker: "Beckman Coulter", models: "DxU Iris, MicroScan WalkAway", iface: "TCP/IP LAN", protocol: "HL7 v2.x" },
    { discipline: "molecular", label: language === "ID" ? "Molekuler & Patologi" : "Molecular & Pathology", maker: "Roche / Cepheid", models: "Cobas 6800, GeneXpert", iface: "HTTPS / LAN", protocol: "HL7 FHIR / ASTM" },
    { discipline: "molecular", label: language === "ID" ? "Molekuler & Patologi" : "Molecular & Pathology", maker: "Thermo / Qiagen", models: "QuantStudio, QIAcube HT", iface: "REST / CSV", protocol: "JSON / HL7" },
  ];

  const filteredAnalyzers = analyzerCatalog.filter((row) => {
    const matchDisc = selectedDiscipline === "all" || row.discipline === selectedDiscipline;
    const q = analyzerQuery.trim().toLowerCase();
    if (!q) return matchDisc;
    return (
      matchDisc &&
      (row.maker.toLowerCase().includes(q) ||
        row.models.toLowerCase().includes(q) ||
        row.protocol.toLowerCase().includes(q) ||
        row.label.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
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
          text: language === "ID" ? "Eksplorasi Arsitektur Live" : "Explore Live Architecture",
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
          SECTION 1: INTERACTIVE ARCHITECTURE WORKBENCH (#integration-explorer)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="integration-explorer"
        className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-y border-slate-200/70 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header + Auto-Tour Control */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Arsitektur Interoperabilitas Live" : "Live Interoperability Workbench"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis"
                  : "One Unified Hub for Your Entire Clinical Data Ecosystem"}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="max-w-sm text-sm leading-relaxed text-slate-600 font-normal">
                {language === "ID"
                  ? "Pilih simpul integrasi untuk menguji alur protokol, payload, dan telemetri langsung."
                  : "Select an integration node to inspect live protocol flows, payloads, and telemetry."}
              </p>
              <button
                type="button"
                onClick={() => setAutoCycle((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shrink-0",
                  autoCycle
                    ? "bg-[#0073FC] text-white border-[#0073FC] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                )}
              >
                {autoCycle ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>
                  {autoCycle
                    ? language === "ID" ? "Jeda Tur" : "Pause Tour"
                    : language === "ID" ? "Tur Otomatis" : "Auto-Tour"}
                </span>
              </button>
            </div>
          </div>

          {/* Architectural Topology Strip (Dot-Grid Canvas — Zero Nested Box Clutter) */}
          <div
            className="relative rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 mb-8 overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Desktop SVG Signal Lines */}
            <svg
              className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full"
              viewBox="0 0 1200 200"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 350 54 C 430 54, 430 100, 490 100"
                fill="none"
                stroke={selectedIntegration === 2 ? "#0073FC" : "#CBD5E1"}
                strokeWidth={selectedIntegration === 2 ? "2.5" : "1.5"}
                strokeDasharray={selectedIntegration === 2 ? "none" : "4 4"}
              />
              <path
                d="M 350 146 C 430 146, 430 100, 490 100"
                fill="none"
                stroke={selectedIntegration === 4 ? "#0073FC" : "#CBD5E1"}
                strokeWidth={selectedIntegration === 4 ? "2.5" : "1.5"}
                strokeDasharray={selectedIntegration === 4 ? "none" : "4 4"}
              />
              <path
                d="M 710 100 C 770 100, 770 36, 850 36"
                fill="none"
                stroke={selectedIntegration === 0 ? "#0073FC" : "#CBD5E1"}
                strokeWidth={selectedIntegration === 0 ? "2.5" : "1.5"}
                strokeDasharray={selectedIntegration === 0 ? "none" : "4 4"}
              />
              <path
                d="M 710 100 L 850 100"
                fill="none"
                stroke={selectedIntegration === 1 ? "#0073FC" : "#CBD5E1"}
                strokeWidth={selectedIntegration === 1 ? "2.5" : "1.5"}
                strokeDasharray={selectedIntegration === 1 ? "none" : "4 4"}
              />
              <path
                d="M 710 100 C 770 100, 770 164, 850 164"
                fill="none"
                stroke={selectedIntegration === 3 ? "#0073FC" : "#CBD5E1"}
                strokeWidth={selectedIntegration === 3 ? "2.5" : "1.5"}
                strokeDasharray={selectedIntegration === 3 ? "none" : "4 4"}
              />
              <circle r="4.5" fill="#0073FC">
                <animateMotion
                  dur="1.5s"
                  repeatCount="indefinite"
                  path={
                    selectedIntegration === 2
                      ? "M 350 54 C 430 54, 430 100, 490 100"
                      : selectedIntegration === 4
                      ? "M 350 146 C 430 146, 430 100, 490 100"
                      : selectedIntegration === 0
                      ? "M 710 100 C 770 100, 770 36, 850 36"
                      : selectedIntegration === 1
                      ? "M 710 100 L 850 100"
                      : "M 710 100 C 770 100, 770 164, 850 164"
                  }
                />
              </circle>
            </svg>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Left Nodes */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
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
                        "w-full text-left rounded-xl px-4 py-3 border transition-all duration-150 flex items-center gap-3 cursor-pointer",
                        active
                          ? "bg-[#0073FC] text-white border-[#0073FC] shadow-[0_8px_20px_-6px_rgba(0,115,252,0.55)]"
                          : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-white" : "text-[#0073FC]")} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold truncate">{item.tabLabel}</p>
                        <p className={cn("text-[11px] truncate", active ? "text-blue-100" : "text-slate-500")}>
                          {item.shortDesc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Center Hub */}
              <div className="lg:col-span-4 flex justify-center py-1">
                <div className="w-full max-w-[230px] rounded-2xl bg-[#0B1120] text-white px-5 py-4 text-center border border-slate-800 shadow-lg">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Interop Engine</span>
                  </div>
                  <p className="font-display text-sm sm:text-base font-bold">Diagnova Core Hub</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">ASTM • HL7 • FHIR R4</p>
                </div>
              </div>

              {/* Right Nodes */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
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
                        "w-full text-left rounded-xl px-4 py-2.5 border transition-all duration-150 flex items-center gap-3 cursor-pointer",
                        active
                          ? "bg-[#0073FC] text-white border-[#0073FC] shadow-[0_8px_20px_-6px_rgba(0,115,252,0.55)]"
                          : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-white" : "text-[#0073FC]")} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold truncate">{item.tabLabel}</p>
                        <p className={cn("text-[11px] truncate", active ? "text-blue-100" : "text-slate-500")}>
                          {item.shortDesc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unified Split Workbench: Left Editorial Spec + Right Dark Telemetry Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">
            {/* Left Editorial Specification (Clean, zero nested boxes) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0073FC] mb-2">
                  {current.targetDept}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                  {current.name}
                </h3>
                <p className="text-sm sm:text-base font-medium text-slate-700 mt-1.5">
                  {current.tagline}
                </p>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed font-normal">
                  {current.description}
                </p>
              </div>

              <ul className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                {current.highlights.map((text) => (
                  <li key={text} className="py-3 flex items-start gap-3 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-[#0073FC] mt-0.5 shrink-0 stroke-[2.5]" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2">
                {current.protocols.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-mono font-medium text-slate-700"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                <div className="flex items-center gap-8">
                  {current.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display text-3xl font-bold tracking-tight tabular-nums text-slate-900">
                        {m.val}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] transition-colors"
                >
                  <span>{language === "ID" ? "Konsultasikan Integrasi" : "Consult Integration"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Stripe-Grade Dark Telemetry Console */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-[#0B1120] text-slate-100 border border-slate-800 shadow-[0_24px_48px_-16px_rgba(15,23,42,0.35)] overflow-hidden">
                {/* Terminal Chrome Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F172A] border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="h-4 w-4 text-[#60A5FA]" />
                    <span className="font-mono text-xs font-semibold text-slate-200 tracking-wide">
                      {current.simulationBadge}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  {/* 1. SIMRS / HIS */}
                  {current.simulationType === "simrs" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                        <span>{language === "ID" ? "Klik pesan HL7 untuk inspeksi frame:" : "Click HL7 message to inspect frame:"}</span>
                        <span className="font-mono text-emerald-400">0 Pending</span>
                      </div>
                      {[
                        { code: "ORM^O01", dir: "HIS → LIS", label: language === "ID" ? "Order Poli/IGD otomatis jadi worklist" : "ER/Clinic order → barcode worklist", ms: "140ms", payload: "MSH|^~\\&|SIMRS|IGD|DIAGNOVA|LIS||ORM^O01\nPID|1||0849201||WIJAYA^HENDRA||19840512|M\nOBR|1||ORD-9435|CBC^Complete Blood Count" },
                        { code: "DFT^P03", dir: "LIS → HIS", label: language === "ID" ? "Kunci billing & klaim BPJS real-time" : "Real-time BPJS / billing charge sync", ms: "95ms", payload: "MSH|^~\\&|DIAGNOVA|LIS|SIMRS|BILL||DFT^P03\nFT1|1||20261114||CG|CBC-PANEL|BPJS-INA-CBG" },
                        { code: "ORU^R01", dir: "LIS → EMR", label: language === "ID" ? "Hasil tervalidasi masuk ke layar dokter" : "Verified result posted to physician EMR", ms: "210ms", payload: "MSH|^~\\&|DIAGNOVA|LIS|SIMRS|EMR||ORU^R01\nOBX|1|NM|718-7^HGB^LN||13.8|g/dL|13.0-17.0|N|||F" },
                      ].map((row, idx) => (
                        <button
                          key={row.code}
                          type="button"
                          onClick={() => setSimrsStep(idx)}
                          className={cn(
                            "w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer",
                            simrsStep === idx
                              ? "bg-slate-900/90 border-[#0073FC]"
                              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#0073FC]/20 text-[#60A5FA] shrink-0">
                                {row.code}
                              </span>
                              <span className="text-xs font-medium text-slate-200 truncate">{row.label}</span>
                            </div>
                            <span className="font-mono text-[11px] text-emerald-400 shrink-0">{row.ms}</span>
                          </div>
                          {simrsStep === idx && (
                            <pre className="mt-3 pt-3 border-t border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {row.payload}
                            </pre>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 2. RME Biomarker Trend */}
                  {current.simulationType === "rme" && (() => {
                    const bioMap = {
                      creatinine: {
                        loinc: "LOINC 2160-0 • Serum Creatinine (mg/dL)",
                        badge: "1.8 mg/dL (High)",
                        badgeCls: "bg-amber-500/15 text-amber-300 border-amber-500/30",
                        points: "40,68 135,56 230,44 325,20",
                        pts: [
                          { x: 40, y: 68, val: "1.0", date: "Jan" },
                          { x: 135, y: 56, val: "1.2", date: "Apr" },
                          { x: 230, y: 44, val: "1.4", date: "Jul" },
                          { x: 325, y: 20, val: "1.8", date: "Nov" },
                        ],
                      },
                      hba1c: {
                        loinc: "LOINC 4548-4 • Hemoglobin A1c (%)",
                        badge: "6.2% (Controlled)",
                        badgeCls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                        points: "40,20 135,34 230,48 325,62",
                        pts: [
                          { x: 40, y: 20, val: "8.4", date: "Jan" },
                          { x: 135, y: 34, val: "7.6", date: "Apr" },
                          { x: 230, y: 48, val: "6.9", date: "Jul" },
                          { x: 325, y: 62, val: "6.2", date: "Nov" },
                        ],
                      },
                      hemoglobin: {
                        loinc: "LOINC 718-7 • Hemoglobin (g/dL)",
                        badge: "13.8 g/dL (Normal)",
                        badgeCls: "bg-blue-500/15 text-blue-300 border-blue-500/30",
                        points: "40,60 135,50 230,36 325,30",
                        pts: [
                          { x: 40, y: 60, val: "11.2", date: "Jan" },
                          { x: 135, y: 50, val: "12.0", date: "Apr" },
                          { x: 230, y: 36, val: "13.4", date: "Jul" },
                          { x: 325, y: 30, val: "13.8", date: "Nov" },
                        ],
                      },
                    }[selectedBiomarker];

                    return (
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {(["creatinine", "hba1c", "hemoglobin"] as const).map((key) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setSelectedBiomarker(key)}
                                className={cn(
                                  "px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer capitalize",
                                  selectedBiomarker === key
                                    ? "bg-[#0073FC] text-white border-[#0073FC]"
                                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                                )}
                              >
                                {key === "hba1c" ? "HbA1c" : key}
                              </button>
                            ))}
                          </div>
                          <span className={cn("px-2.5 py-0.5 rounded-md border text-[11px] font-mono font-semibold", bioMap.badgeCls)}>
                            {bioMap.badge}
                          </span>
                        </div>

                        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">Tn. Hendra Wijaya • #RM-0849201</span>
                            <span className="font-mono text-[11px] text-slate-400">{bioMap.loinc}</span>
                          </div>
                          <svg className="w-full h-28" viewBox="0 0 365 96" aria-hidden="true">
                            {[24, 48, 72].map((y) => (
                              <line key={y} x1="20" y1={y} x2="345" y2={y} stroke="#1E293B" strokeWidth="1" />
                            ))}
                            <polyline
                              fill="none"
                              stroke="#3B82F6"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={bioMap.points}
                            />
                            {bioMap.pts.map((pt) => (
                              <g key={pt.date}>
                                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#0073FC" stroke="#0B1120" strokeWidth="2" />
                                <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="#F8FAFC">
                                  {pt.val}
                                </text>
                                <text x={pt.x} y="90" textAnchor="middle" fontSize="9" fill="#64748B">
                                  {pt.date}
                                </text>
                              </g>
                            ))}
                          </svg>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400">
                            <QrCode className="h-3.5 w-3.5" /> BSrE SHA-256 Verified
                          </span>
                          <span>dr. Ratna Sp.PK</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. Direct Analyzer */}
                  {current.simulationType === "analyzer" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">
                          {language === "ID" ? "Aliran Host Query Instrumen" : "Instrument Host Query Stream"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHostQueryIdx((prev) => (prev + 1) % 3)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3 text-[#60A5FA]" />
                          <span>{language === "ID" ? "Scan Tabung Berikutnya" : "Scan Next Tube"}</span>
                        </button>
                      </div>
                      {[
                        { machine: "Sysmex XN-1000", proto: "ASTM E1394 • TCP/IP", sample: "#SP-08819", cmd: "Q|1|^SP-08819||ALL||||||||O", qc: "Westgard 1-2s PASS" },
                        { machine: "Roche Cobas c501", proto: "HL7 v2.5 • LAN", sample: "#SP-08820", cmd: "QRD|20261114|R|I|Q8820|||1^RD|SP-08820", qc: "Westgard 1-2s PASS" },
                        { machine: "Abbott Alinity i", proto: "ASTM E1381 • RS-232", sample: "#SP-08821", cmd: "P|1||0849201||WIJAYA^H|TSH+FT4", qc: "Host Query OK" },
                      ].map((inst, idx) => (
                        <div
                          key={inst.machine}
                          onClick={() => setHostQueryIdx(idx)}
                          className={cn(
                            "rounded-xl border p-3.5 transition-all cursor-pointer",
                            hostQueryIdx === idx
                              ? "bg-slate-900/90 border-[#0073FC]"
                              : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-slate-100">{inst.machine}</p>
                              <p className="text-[11px] font-mono text-slate-400">{inst.proto} • {inst.sample}</p>
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-emerald-400">
                              {hostQueryIdx === idx ? "ACTIVE ✓" : inst.qc}
                            </span>
                          </div>
                          {hostQueryIdx === idx && (
                            <p className="mt-2 pt-2 border-t border-slate-800 font-mono text-[11px] text-[#60A5FA] truncate">
                              {inst.cmd}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. SATUSEHAT FHIR */}
                  {current.simulationType === "satusehat" && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(["DiagnosticReport", "ServiceRequest", "Observation"] as const).map((res) => (
                          <button
                            key={res}
                            type="button"
                            onClick={() => setFhirResource(res)}
                            className={cn(
                              "px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border transition-colors cursor-pointer",
                              fhirResource === res
                                ? "bg-[#0073FC] text-white border-[#0073FC]"
                                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                            )}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                      <pre className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
                        {fhirResource === "DiagnosticReport"
                          ? `POST /fhir-r4/v1/DiagnosticReport  [201 Created]\n{\n  "resourceType": "DiagnosticReport",\n  "status": "final",\n  "code": { "coding": [{ "system": "http://loinc.org", "code": "57021-8" }] },\n  "subject": { "reference": "Patient/P10029482103" },\n  "performer": [{ "reference": "Practitioner/N10009182" }]\n}`
                          : fhirResource === "ServiceRequest"
                          ? `POST /fhir-r4/v1/ServiceRequest  [201 Created]\n{\n  "resourceType": "ServiceRequest",\n  "intent": "order",\n  "priority": "stat",\n  "subject": { "reference": "Patient/P10029482103" },\n  "requester": { "reference": "Practitioner/N10009182" }\n}`
                          : `POST /fhir-r4/v1/Observation  [201 Created]\n{\n  "resourceType": "Observation",\n  "status": "final",\n  "code": { "coding": [{ "system": "http://loinc.org", "code": "718-7" }] },\n  "valueQuantity": { "value": 13.8, "unit": "g/dL" }\n}`}
                      </pre>
                    </div>
                  )}

                  {/* 5. Smart Gateway */}
                  {current.simulationType === "gateway" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {language === "ID" ? "Uji Ketahanan Jaringan Edge:" : "Test Edge Network Resilience:"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGatewayOffline((prev) => !prev)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold border transition-colors cursor-pointer",
                            gatewayOffline
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                          )}
                        >
                          {gatewayOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                          <span>{gatewayOffline ? "WAN OFFLINE (BUFFERING)" : "WAN ONLINE (SYNCED)"}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5">
                          <p className="font-mono text-lg font-bold text-white">{gatewayOffline ? "142" : "72h"}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {gatewayOffline ? "Buffered Results" : "Offline Capacity"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5">
                          <p className="font-mono text-lg font-bold text-[#60A5FA]">CITO 1st</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Priority Reconnect</p>
                        </div>
                        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5">
                          <p className="font-mono text-lg font-bold text-emerald-400">0 Byte</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Packet Loss</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-4 py-3 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="inline-flex items-center gap-2">
                          <Radio className={cn("h-3.5 w-3.5", gatewayOffline ? "text-amber-400 animate-pulse" : "text-emerald-400")} />
                          {gatewayOffline ? "AES-256 SQLite Edge Queue Active" : "Heartbeat Telemetry: 14ms RTT"}
                        </span>
                        <span className="text-emerald-400">99.9% SLA</span>
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
          SECTION 2: END-TO-END SPECIMEN TRACE & ENGINEERING PILLARS (#architecture)
          ══════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="w-full py-16 sm:py-24 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 space-y-12">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Alur Data End-to-End" : "End-to-End Data Lifecycle"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Jejak Data Milidetik dari Rak Analyzer hingga Layar Dokter"
                  : "Millisecond Traceability from Analyzer Rack to Physician Screen"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {traceSamples.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setTraceSampleIdx(idx)}
                  className={cn(
                    "px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                    traceSampleIdx === idx
                      ? "bg-[#0073FC] text-white border-[#0073FC]"
                      : "bg-[#FAFBFD] text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Stage Connected Execution Timeline (No nested box clutter) */}
          <div className="rounded-2xl border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <Activity className="h-4 w-4 text-[#0073FC]" />
                <span className="text-sm font-bold text-slate-900">{traceSamples[traceSampleIdx].patient}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-700 font-semibold">
                <Clock className="h-3.5 w-3.5" />
                {language === "ID" ? "Total Waktu Proses: < 1.5 Detik" : "End-to-End Pipeline: < 1.5s"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {traceSamples[traceSampleIdx].stages.map((st) => (
                <div key={st.step} className="relative pl-4 border-l-2 border-[#0073FC]">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-[#0073FC]">STAGE {st.step}</span>
                    <span className="text-slate-500">{st.time}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs font-mono text-slate-600 mt-1">{st.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Clean Editorial Engineering Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
            {[
              {
                stat: "Westgard 1-2s",
                title: language === "ID" ? "Gerbang Kontrol Kualitas Otomatis" : "Automated Quality Control Gate",
                desc:
                  language === "ID"
                    ? "Setiap pembacaan sampel pasien otomatis ditahan apabila kalibrasi dan QC harian instrumen belum lolos aturan Westgard."
                    : "Patient specimen runs are automatically gated if daily instrument calibration and Westgard QC rules have not passed.",
              },
              {
                stat: "LOINC & FHIR",
                title: language === "ID" ? "Normalisasi Terminologi Medis" : "Semantic Terminology Normalization",
                desc:
                  language === "ID"
                    ? "Kode internal berbagai merek alat diseragamkan otomatis ke LOINC dan SNOMED CT untuk pertukaran RME & SATUSEHAT."
                    : "Proprietary instrument codes normalize automatically into LOINC and SNOMED CT ontologies for EMR & national exchange.",
              },
              {
                stat: "< 15 Menit",
                title: language === "ID" ? "Eskalasi Nilai Kritis & BSrE" : "Panic Escalation & BSrE Sign-Off",
                desc:
                  language === "ID"
                    ? "Hasil kritis memicu notifikasi berjenjang sesuai standar KARS SKP 2.2 dengan stempel tanda tangan digital tersertifikasi."
                    : "Critical values trigger tiered KARS SKP 2.2 escalation alerts paired with accredited cryptographic digital signatures.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="pt-5 border-t border-slate-200 space-y-2.5">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#0073FC]">
                  {pillar.stat}
                </p>
                <h3 className="font-display text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: ENTERPRISE ANALYZER COMPATIBILITY DIRECTORY
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-b border-slate-200/70">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Direktori 500+ Analyzer" : "500+ Analyzer Directory"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Matriks Kompatibilitas Instrumen Laboratorium"
                  : "Laboratory Instrument Compatibility Matrix"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Cari merek atau seri mesin laboratorium Anda untuk melihat antarmuka fisik dan protokol yang didukung native."
                : "Search your analyzer brand or series to inspect natively supported physical interfaces and protocols."}
            </p>
          </div>

          {/* Search & Discipline Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                      ? "bg-[#0073FC] text-white border-[#0073FC]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={analyzerQuery}
                onChange={(e) => setAnalyzerQuery(e.target.value)}
                placeholder={language === "ID" ? "Cari merek / seri (mis. Cobas, XN)..." : "Search brand / series (e.g. Cobas, XN)..."}
                className="w-full rounded-full bg-white border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0073FC] focus:ring-2 focus:ring-[#0073FC]/15"
              />
            </div>
          </div>

          {/* Enterprise Specification Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden">
            {filteredAnalyzers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-[#F7F9FC] text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-5">{language === "ID" ? "Pabrikan" : "Manufacturer"}</th>
                      <th className="py-3.5 px-5">{language === "ID" ? "Divisi" : "Discipline"}</th>
                      <th className="py-3.5 px-5">{language === "ID" ? "Seri & Model Teruji" : "Supported Series"}</th>
                      <th className="py-3.5 px-5">{language === "ID" ? "Antarmuka" : "Interface"}</th>
                      <th className="py-3.5 px-5 text-right">{language === "ID" ? "Protokol" : "Protocol"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredAnalyzers.map((row) => (
                      <tr key={`${row.maker}-${row.models}`} className="hover:bg-[#FAFBFD] transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">{row.maker}</td>
                        <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">{row.label}</td>
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-700">{row.models}</td>
                        <td className="py-3.5 px-5 font-mono text-xs text-slate-500 whitespace-nowrap">{row.iface}</td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <span className="inline-block rounded-md bg-[#E8F1FD] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0073FC]">
                            {row.protocol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm font-semibold text-slate-800">
                  {language === "ID"
                    ? `Model "${analyzerQuery}" belum tampil di ringkasan.`
                    : `Model "${analyzerQuery}" is not listed in the summary.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAnalyzerQuery("");
                    setSelectedDiscipline("all");
                  }}
                  className="px-4 py-2 rounded-full bg-[#E8F1FD] text-[#0073FC] text-xs font-semibold cursor-pointer"
                >
                  {language === "ID" ? "Reset Filter" : "Reset Filter"}
                </button>
              </div>
            )}
          </div>

          {/* Custom Driver SLA Strip */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="font-semibold text-slate-900">
                {language === "ID" ? "Driver Kustom 3–5 Hari Kerja:" : "3–5 Day Custom Driver SLA:"}
              </strong>{" "}
              {language === "ID"
                ? "Tim engineering kami membangun konektor ASTM/HL7 baru tanpa biaya tambahan."
                : "Our engineering team builds new ASTM/HL7 instrument drivers at no extra fee."}
            </p>
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0073FC] hover:text-[#005DD1] shrink-0"
            >
              <span>{language === "ID" ? "Ajukan Cek Mesin" : "Request Compatibility Check"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: REGULATORY & SECURITY COMPLIANCE
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-10 lg:p-12">
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
