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
  Check,
  Lock,
  Server,
  FileCheck2,
  BadgeCheck,
  Activity,
  Search,
  Sparkles,
  Play,
  Pause,
  Send,
  Plus,
  Clock,
  ArrowDown,
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
  const [validationMode, setValidationMode] = useState<"auto" | "strict" | "custom">("auto");
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
      name: "SIMRS / HIS Bridging",
      tagline:
        language === "ID"
          ? "Order dokter langsung jadi barcode worklist, hasil & billing sinkron otomatis."
          : "Physician orders instantly become barcode worklists with automated billing sync.",
      protocols: ["HL7 v2.x", "REST JSON", "SOAP / XML"],
      metrics: [
        { val: "0", label: language === "ID" ? "Entri Ulang" : "Re-Entry" },
        { val: "< 250ms", label: language === "ID" ? "Latensi" : "Latency" },
      ],
      workflowSteps: [
        {
          tag: language === "ID" ? "Pemicu" : "Trigger",
          status: "Completed",
          title: language === "ID" ? "Order Poli / IGD Masuk (ORM^O01)" : "ER / Clinic Order Received (ORM^O01)",
          desc: language === "ID" ? "Demografi pasien & parameter tes ditarik otomatis" : "Patient demographics & test orders ingested automatically",
          chip: "SIMRS",
        },
        {
          tag: language === "ID" ? "Proses" : "Process",
          status: "Completed",
          title: language === "ID" ? "Cetak Barcode & Kunci Billing" : "Generate Barcode & Lock Billing",
          desc: language === "ID" ? "Status klaim BPJS/asuransi tervalidasi real-time" : "Insurance & BPJS charge capture validated in real time",
          chip: "DFT^P03",
        },
        {
          tag: language === "ID" ? "Rilis" : "Dispatch",
          status: "Running",
          title: language === "ID" ? "Kirim Hasil Terverifikasi ke EMR" : "Post Verified Result to EMR",
          desc: language === "ID" ? "Laporan masuk ke layar DPJP tanpa ketik ulang" : "Structured report lands directly on physician screen",
          chip: "ORU^R01",
        },
      ],
    },
    {
      id: "rme",
      icon: FileText,
      tabLabel: language === "ID" ? "Rekam Medis (RME)" : "EMR Integration",
      shortDesc: language === "ID" ? "Permenkes 24/2022" : "EMR & Biomarker Trends",
      name: "Rekam Medis Elektronik (RME)",
      tagline:
        language === "ID"
          ? "Data laboratorium terstruktur LOINC lengkap dengan tren biomarker & segel BSrE."
          : "LOINC-structured lab observations with longitudinal biomarker trends & BSrE seal.",
      protocols: ["FHIR R4", "LOINC", "HL7 CDA"],
      metrics: [
        { val: "100%", label: "PMK 24/2022" },
        { val: "< 15m", label: language === "ID" ? "Panic SLA" : "Panic SLA" },
      ],
      workflowSteps: [
        {
          tag: language === "ID" ? "Pemicu" : "Trigger",
          status: "Completed",
          title: language === "ID" ? "Validasi Sp.PK & Segel BSrE" : "Pathologist Sign-Off & BSrE Seal",
          desc: language === "ID" ? "Hasil disahkan dengan tanda tangan elektronik SHA-256" : "Results sealed with accredited cryptographic e-signature",
          chip: "BSrE",
        },
        {
          tag: language === "ID" ? "Proses" : "Process",
          status: "Completed",
          title: language === "ID" ? "Kalkulasi Tren Longitudinal" : "Compute Longitudinal Trends",
          desc: language === "ID" ? "Bandingkan Kreatinin & HbA1c lintas kunjungan" : "Compare Creatinine & HbA1c across encounters",
          chip: "LOINC",
        },
        {
          tag: language === "ID" ? "Rilis" : "Dispatch",
          status: "Running",
          title: language === "ID" ? "Render DiagnosticReport di RME" : "Render DiagnosticReport in EMR",
          desc: language === "ID" ? "Dokter melihat grafik tren & peringatan nilai kritis" : "Physician views trend charts & critical alerts",
          chip: "FHIR R4",
        },
      ],
    },
    {
      id: "analyzer",
      icon: Cpu,
      tabLabel: "Direct Analyzer",
      shortDesc: language === "ID" ? "500+ Mesin Lab" : "500+ Lab Instruments",
      name: "Direct Analyzer Interfacing",
      tagline:
        language === "ID"
          ? "Host Query dua arah untuk 500+ model analyzer dengan gerbang QC Westgard."
          : "Bidirectional Host Query for 500+ analyzers gated by automated Westgard QC.",
      protocols: ["ASTM E1394", "HL7 v2.5", "RS-232 / LAN"],
      metrics: [
        { val: "500+", label: language === "ID" ? "Model Alat" : "Analyzers" },
        { val: "0s", label: language === "ID" ? "Ketik Hasil" : "Manual Entry" },
      ],
      workflowSteps: [
        {
          tag: language === "ID" ? "Pemicu" : "Trigger",
          status: "Completed",
          title: language === "ID" ? "Tabung Barcode Masuk Rak Alat" : "Barcoded Tube Hits Analyzer Rack",
          desc: language === "ID" ? "Sysmex XN-1000 / Cobas c501 melakukan Host Query" : "Sysmex XN-1000 / Cobas c501 initiates Host Query",
          chip: "ASTM",
        },
        {
          tag: language === "ID" ? "Proses" : "Process",
          status: "Completed",
          title: language === "ID" ? "Gerbang Kontrol Kualitas Westgard" : "Westgard Quality Control Gate",
          desc: language === "ID" ? "Memastikan QC harian lolos sebelum baca sampel" : "Ensures daily QC passes before processing specimen",
          chip: "QC PASS",
        },
        {
          tag: language === "ID" ? "Rilis" : "Dispatch",
          status: "Running",
          title: language === "ID" ? "Ingesti Hasil & Flag Otomatis" : "Auto-Ingest Results & Flags",
          desc: language === "ID" ? "Flag clot/hemolisis langsung ditandai di worklist" : "Clot/hemolysis flags surfaced directly in worklist",
          chip: "LIS Core",
        },
      ],
    },
    {
      id: "satusehat",
      icon: ShieldCheck,
      tabLabel: "SATUSEHAT Kemenkes",
      shortDesc: language === "ID" ? "HL7 FHIR R4" : "National HL7 FHIR R4",
      name: "SATUSEHAT Interoperabilitas",
      tagline:
        language === "ID"
          ? "Konversi otomatis resource HL7 FHIR R4 dengan validasi IHS & ontologi LOINC."
          : "Turnkey HL7 FHIR R4 transformation with IHS validation & LOINC mapping.",
      protocols: ["HL7 FHIR R4", "OAuth 2.0", "TLS 1.3"],
      metrics: [
        { val: "99.8%", label: language === "ID" ? "Sukses Kirim" : "Delivery Rate" },
        { val: "FHIR R4", label: language === "ID" ? "Standar" : "Standard" },
      ],
      workflowSteps: [
        {
          tag: language === "ID" ? "Pemicu" : "Trigger",
          status: "Completed",
          title: language === "ID" ? "Validasi NIK ke IHS Number" : "Verify NIK to IHS Patient ID",
          desc: language === "ID" ? "Pencocokan identitas pasien dengan indeks Kemenkes" : "Patient identity matched against MoH registry",
          chip: "OAuth 2.0",
        },
        {
          tag: language === "ID" ? "Proses" : "Process",
          status: "Completed",
          title: language === "ID" ? "Mapping LOINC & SNOMED CT" : "Map LOINC & SNOMED CT",
          desc: language === "ID" ? "Normalisasi parameter lab ke kamus nasional" : "Normalize lab parameters to national dictionary",
          chip: "Ontology",
        },
        {
          tag: language === "ID" ? "Rilis" : "Dispatch",
          status: "Running",
          title: language === "ID" ? "Kirim Bundle FHIR DiagnosticReport" : "Dispatch FHIR DiagnosticReport",
          desc: language === "ID" ? "Konfirmasi HTTP 201 Created tercatat di audit log" : "HTTP 201 Created logged in immutable audit trail",
          chip: "201 OK",
        },
      ],
    },
    {
      id: "connectivity",
      icon: Wifi,
      tabLabel: "Smart Gateway",
      shortDesc: language === "ID" ? "Buffer Offline 72 Jam" : "72h Offline Buffer",
      name: "Smart Resilient Gateway",
      tagline:
        language === "ID"
          ? "Buffer lokal terenkripsi 72 jam menjaga layanan Cito tetap jalan saat jaringan putus."
          : "72-hour encrypted local buffer keeps Cito lab operations running during outages.",
      protocols: ["Edge Cache", "AES-256", "Cito Sync"],
      metrics: [
        { val: "99.9%", label: "Uptime SLA" },
        { val: "0 Byte", label: language === "ID" ? "Data Hilang" : "Data Loss" },
      ],
      workflowSteps: [
        {
          tag: language === "ID" ? "Pemicu" : "Trigger",
          status: "Completed",
          title: language === "ID" ? "Deteksi Gangguan WAN / Cloud" : "Detect WAN / Cloud Disruption",
          desc: language === "ID" ? "Gateway otomatis beralih ke mode penyimpanan edge" : "Gateway seamlessly switches to local edge buffering",
          chip: "Failover",
        },
        {
          tag: language === "ID" ? "Proses" : "Process",
          status: "Completed",
          title: language === "ID" ? "Enkripsi Lokal Hingga 72 Jam" : "Encrypt Locally up to 72 Hours",
          desc: language === "ID" ? "Pembacaan analyzer tetap terekam tanpa hambatan" : "Analyzer readings continue capturing uninterrupted",
          chip: "AES-256",
        },
        {
          tag: language === "ID" ? "Rilis" : "Dispatch",
          status: "Running",
          title: language === "ID" ? "Rekonsiliasi Prioritas Sampel Cito" : "Reconcile Cito Specimens First",
          desc: language === "ID" ? "Sampel IGD & ICU disinkronkan lebih dulu saat online" : "ER & ICU queues sync first upon reconnection",
          chip: "0% Loss",
        },
      ],
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
          text: language === "ID" ? "Eksplorasi Alur Integrasi" : "Explore Integration Flow",
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
          SECTION 1: ATTIO-STYLE CONNECTED NODE CANVAS & WORKFLOW SPLIT (#integration-explorer)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="integration-explorer"
        className="w-full py-16 sm:py-24 bg-[#FAFBFD] border-y border-slate-200/70 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Arsitektur Interoperabilitas" : "Interoperability Architecture"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Satu Hub Terpadu untuk Seluruh Ekosistem Data Medis"
                  : "One Unified Hub for Your Entire Clinical Data Ecosystem"}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAutoCycle((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                  autoCycle
                    ? "bg-[#0073FC] text-white border-[#0073FC] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                )}
              >
                {autoCycle ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>
                  {autoCycle
                    ? language === "ID" ? "Jeda Tur" : "Pause Tour"
                    : language === "ID" ? "Putar Tur Otomatis" : "Auto-Tour"}
                </span>
              </button>
            </div>
          </div>

          {/* Reference 2: Light Dot-Grid Node Canvas with Faded Surroundings & Double-Ringed Active Hub */}
          <div
            className="relative rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-8 mb-10 overflow-hidden"
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          >
            {/* Soft radial white fade on edges (Attio/Causal style) */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(255,255,255,0.88)_100%)]" />

            {/* Desktop Dashed Bezier Connectors + Port Dots */}
            <svg
              className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-0"
              viewBox="0 0 1200 220"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[
                { idx: 2, d: "M 340 60 C 420 60, 420 110, 480 110", px: 340, py: 60 },
                { idx: 4, d: "M 340 160 C 420 160, 420 110, 480 110", px: 340, py: 160 },
                { idx: 0, d: "M 720 110 C 780 110, 780 38, 860 38", px: 860, py: 38 },
                { idx: 1, d: "M 720 110 L 860 110", px: 860, py: 110 },
                { idx: 3, d: "M 720 110 C 780 110, 780 182, 860 182", px: 860, py: 182 },
              ].map((line) => {
                const isActive = selectedIntegration === line.idx;
                return (
                  <g key={line.idx}>
                    <path
                      d={line.d}
                      fill="none"
                      stroke={isActive ? "#0073FC" : "#CBD5E1"}
                      strokeWidth={isActive ? "2" : "1.5"}
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={line.px}
                      cy={line.py}
                      r="3.5"
                      fill={isActive ? "#0073FC" : "#CBD5E1"}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left Nodes */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
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
                        "w-full text-left rounded-2xl px-4 py-3.5 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer bg-white",
                        active
                          ? "border-[#0073FC]/50 ring-4 ring-blue-50 shadow-sm opacity-100"
                          : "border-slate-200/80 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{item.tabLabel}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.shortDesc}</p>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {active ? "Active" : "Inspect"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Center Double-Ringed Hub Card (Reference 2) */}
              <div className="lg:col-span-4 flex justify-center py-2">
                <div className="w-full max-w-[270px] rounded-2xl bg-white border border-slate-200 ring-4 ring-slate-100/90 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center">
                        <Server className="h-4 w-4" />
                      </div>
                      <span className="font-display text-sm font-bold text-slate-900">Diagnova Hub</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Analyzers</p>
                      <p className="font-display text-base font-bold text-slate-900 tabular-nums">500+</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-medium">Uptime SLA</p>
                      <p className="font-display text-base font-bold text-emerald-600 tabular-nums">99.9%</p>
                    </div>
                  </div>
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
                        "w-full text-left rounded-2xl px-4 py-3 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer bg-white",
                        active
                          ? "border-[#0073FC]/50 ring-4 ring-blue-50 shadow-sm opacity-100"
                          : "border-slate-200/80 opacity-60 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.tabLabel}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.shortDesc}</p>
                        </div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {active ? "Active" : "Inspect"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reference 3 & 4: Attio Split Editorial + Vertical Connected Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Editorial + Giant Typographic Metrics (Reference 4) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                  {current.name}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
                  {current.tagline}
                </p>
              </div>

              {/* Clean Metric Split */}
              <div className="grid grid-cols-2 gap-6 py-5 border-y border-slate-200/80">
                {current.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {m.val}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-1">{m.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {current.protocols.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0073FC] hover:text-[#005DD1]"
                >
                  <span>{language === "ID" ? "Konsultasi" : "Consult"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right: Attio Vertical Dot-Grid Workflow Cards (Reference 3) */}
            <div className="lg:col-span-7">
              <div
                className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7"
                style={{
                  backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
                  <span className="font-medium text-slate-700">
                    Automations / <strong className="text-slate-900">{current.tabLabel}</strong>
                  </span>
                  <span className="font-mono text-[11px] text-[#0073FC] font-semibold">Live Pipeline</span>
                </div>

                <div className="max-w-lg mx-auto space-y-2">
                  {current.workflowSteps.map((step, i) => (
                    <React.Fragment key={step.title}>
                      <div>
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {step.tag}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md",
                              step.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-blue-50 text-[#0073FC]"
                            )}
                          >
                            {step.status === "Completed" ? "✓ Completed" : "● Running"}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "rounded-xl bg-white border p-3.5 shadow-2xs transition-colors",
                            step.status === "Completed" ? "border-emerald-300/80" : "border-blue-300"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</p>
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-600 shrink-0">
                              {step.chip}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{step.desc}</p>
                        </div>
                      </div>
                      {i < current.workflowSteps.length - 1 && (
                        <div className="flex justify-center py-0.5">
                          <ArrowDown className="h-4 w-4 text-emerald-500" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: GRADEWITHAI-STYLE ARCHITECTURAL HAIRLINE GRID (#architecture)
          ══════════════════════════════════════════════════════════════ */}
      <section id="architecture" className="w-full py-16 sm:py-24 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kapabilitas Teknis" : "Engineering Capabilities"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Semua yang Dibutuhkan untuk Integrasi Tanpa Friksi"
                  : "Everything You Need for Frictionless Lab Integration"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Dari Host Query barcode, validasi Westgard QC, pemetaan LOINC, hingga ketahanan jaringan offline—seluruhnya dirancang presisi."
                : "From barcode Host Query and Westgard QC gating to LOINC normalization and offline edge resilience."}
            </p>
          </div>

          {/* Reference 1: 3x2 Hairline Architectural Grid with Crosshairs (+) & Faded UI Vignettes */}
          <div className="relative border-t border-l border-slate-200/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Cell 1: One-Click Host Query */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <Plus className="h-3.5 w-3.5 text-slate-300 absolute -bottom-[7px] -right-[7px] z-10 bg-white hidden lg:block" />
              <div className="w-full flex flex-col items-center justify-center py-4 relative">
                <span className="px-4 py-1.5 rounded-lg bg-[#0073FC] text-white text-xs font-semibold shadow-[0_8px_20px_-4px_rgba(0,115,252,0.5)] mb-4">
                  Host Query
                </span>
                <div className="flex items-center gap-3 opacity-45">
                  {["ASTM", "HL7", "RS232"].map((tag) => (
                    <div key={tag} className="w-12 h-14 rounded-lg border border-slate-200 bg-slate-50 flex items-end justify-center pb-2 text-[10px] font-mono font-bold text-slate-500">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Host Query Satu Sentuhan" : "One-Click Host Query"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Mesin menarik profil tes otomatis begitu barcode tabung terbaca di rak."
                    : "Instruments pull test profiles automatically the moment barcoded tubes enter the rack."}
                </p>
              </div>
            </div>

            {/* Cell 2: Scheduled & Cito Sync */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <Plus className="h-3.5 w-3.5 text-slate-300 absolute -bottom-[7px] -right-[7px] z-10 bg-white hidden lg:block" />
              <div className="w-full max-w-[270px] rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs my-2 text-left">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800">Queue Priority</span>
                  <span className="px-2 py-0.5 rounded bg-[#0073FC] text-white text-[10px] font-semibold">Auto Sync</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>IGD Cito Worklist</span>
                    <span className="font-mono text-slate-400 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 09:45</span>
                  </div>
                  <div className="flex items-center justify-between opacity-55">
                    <span>SATUSEHAT Batch</span>
                    <span className="font-mono text-slate-400 inline-flex items-center gap-1"><Clock className="h-3 w-3" /> 11:00</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Prioritas Antrean Cito" : "Cito Priority Scheduling"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Sampel IGD & ICU selalu diprioritaskan saat sinkronisasi ke SIMRS dan EMR."
                    : "ER and ICU specimens always take priority when syncing to HIS and EMR."}
                </p>
              </div>
            </div>

            {/* Cell 3: Interactive Validation Approaches (Reference 1: Chill | Strict | + Create New) */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <div className="w-full py-6 flex flex-col items-center">
                <p className="text-[11px] font-medium text-slate-500 mb-3">
                  {language === "ID" ? "Pilih Mode Validasi QC" : "Select QC Validation Mode"}
                </p>
                <div className="inline-flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  {[
                    { id: "auto" as const, label: "Auto-Verify" },
                    { id: "strict" as const, label: "Westgard" },
                    { id: "custom" as const, label: "+ Rule" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setValidationMode(m.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5",
                        validationMode === m.id
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      {validationMode === m.id && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Aturan Validasi Fleksibel" : "Configurable Validation Rules"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Atur auto-verifikasi hasil normal atau tahan otomatis jika Westgard QC gagal."
                    : "Configure auto-verification for normal runs or strict Westgard QC holds."}
                </p>
              </div>
            </div>

            {/* Cell 4: Critical Value Highlight (Reference 1: Request Regrade) */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <div className="w-full py-5 relative flex flex-col items-center">
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-[11px] font-semibold text-slate-800 mb-2">
                  ↻ Escalate &lt; 15m
                </span>
                <p className="text-xs text-slate-300 leading-relaxed max-w-[230px] select-none">
                  Serum Potassium{" "}
                  <span className="bg-[#E8F1FD] text-[#0073FC] font-mono font-bold px-1.5 py-0.5 rounded">
                    6.4 mmol/L
                  </span>{" "}
                  exceeds critical threshold
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Deteksi Nilai Kritis Instan" : "Instant Critical Value Flag"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Menyorot hasil kritis secara otomatis dan memicu eskalasi KARS SKP 2.2."
                    : "Highlights critical thresholds automatically and triggers KARS SKP 2.2 alerts."}
                </p>
              </div>
            </div>

            {/* Cell 5: Live Interop Telemetry Chat (Reference 1: Kleo Chat) */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <div className="w-full max-w-[270px] space-y-2 text-left my-2">
                <div className="ml-auto max-w-[85%] rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-700">
                  Status kirim SATUSEHAT #SP-08819?
                </div>
                <div className="mr-auto max-w-[90%] rounded-xl bg-white border border-slate-200 px-3 py-2 text-[11px] text-slate-700 shadow-2xs">
                  <span className="font-semibold text-[#0073FC]">HTTP 201 Created.</span> DiagnosticReport &amp; IHS tervalidasi.
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-[11px] text-slate-400">
                  <span>Cek status payload...</span>
                  <Send className="h-3 w-3 text-slate-500" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Audit Payload Real-Time" : "Real-Time Payload Audit"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Lacak status setiap pengiriman HL7 dan FHIR R4 dalam hitungan detik."
                    : "Track every HL7 and FHIR R4 dispatch status with full auditability."}
                </p>
              </div>
            </div>

            {/* Cell 6: Tailored LOINC & FHIR Mapper (Reference 1: Tailored Rubric Builder) */}
            <div className="relative border-r border-b border-slate-200/80 p-8 sm:p-10 flex flex-col items-center text-center justify-between min-h-[300px]">
              <div className="w-full max-w-[260px] my-2 relative">
                <div className="flex justify-center mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[10px] font-semibold text-[#0073FC]">
                    <Sparkles className="h-3 w-3" /> Mapping FHIR R4
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-left text-[11px] space-y-1.5">
                  <div className="grid grid-cols-2 font-bold text-slate-800 pb-1 border-b border-slate-100">
                    <span>Raw Code</span>
                    <span className="text-[#0073FC]">LOINC</span>
                  </div>
                  <div className="grid grid-cols-2 text-slate-500 font-mono">
                    <span>HGB (Sysmex)</span>
                    <span className="text-slate-800">718-7</span>
                  </div>
                  <div className="grid grid-cols-2 text-slate-400 font-mono opacity-60">
                    <span>CREA (Cobas)</span>
                    <span>2160-0</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {language === "ID" ? "Pemetaan LOINC & SNOMED" : "LOINC & SNOMED Builder"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {language === "ID"
                    ? "Normalisasi otomatis kode mentah alat menjadi kamus standar nasional."
                    : "Automatically normalizes proprietary instrument codes into national ontologies."}
                </p>
              </div>
            </div>
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
