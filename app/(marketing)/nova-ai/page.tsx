"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Check,
  Activity,
  FileText,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  BadgeCheck,
  BellRing,
  RotateCcw,
  Server,
  Lock,
  FileCheck2,
  Cpu,
  CheckCheck,
  Clock,
  Zap,
  Mic,
  Sparkles,
  ScanText,
  GitBranch,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

interface ClinicalProfile {
  id: string;
  tabLabel: string;
  tabLabelEn: string;
  specimenNo: string;
  patientName: string;
  patientAgeGender: string;
  patientAgeGenderEn: string;
  ward: string;
  wardEn: string;
  attendingDoc: string;
  parameterName: string;
  parameterNameEn: string;
  analyteCode: string;
  currentValue: string;
  unit: string;
  refInterval: string;
  statusLabel: string;
  statusLabelEn: string;
  prevValue: string;
  prevTimestamp: string;
  prevTimestampEn: string;
  deltaText: string;
  deltaPercent: string;
  isDeltaDrop: boolean;
  clinicalImpression: string;
  clinicalImpressionEn: string;
  clinicalRecommendation: string;
  clinicalRecommendationEn: string;
  isPanicValue: boolean;
}

export default function NovaAIPage() {
  const { language } = useLanguage();
  const [virtualStaining, setVirtualStaining] = useState<boolean>(true);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const [authorizedProfiles, setAuthorizedProfiles] = useState<Record<string, boolean>>({});
  const [alertDispatched, setAlertDispatched] = useState<Record<string, boolean>>({});

  const profiles: ClinicalProfile[] = [
    {
      id: "hematology-hb",
      tabLabel: "Hematologi: Hemoglobin (Hb)",
      tabLabelEn: "Hematology: Hemoglobin (Hb)",
      specimenNo: "LAB-261109-01",
      patientName: "Tn. Hendra Wijaya",
      patientAgeGender: "54 Th • Laki-laki • RM #0849201",
      patientAgeGenderEn: "54 Y • Male • MRN #0849201",
      ward: "Rawat Inap Bedah (Kamar 304)",
      wardEn: "Inpatient Surgical Ward (Room 304)",
      attendingDoc: "dr. Bambang Sp.B, Subsp.BD",
      parameterName: "Hemoglobin (Hb)",
      parameterNameEn: "Hemoglobin (Hb)",
      analyteCode: "LOINC 718-7",
      currentValue: "8.4",
      unit: "g/dL",
      refInterval: "13.0 - 17.5 g/dL",
      statusLabel: "Deviasi Rendah (Delta Alert)",
      statusLabelEn: "Low Value (Delta Alert)",
      prevValue: "10.5 g/dL",
      prevTimestamp: "3 hari lalu (12 Nov, 08:30)",
      prevTimestampEn: "3 days ago (Nov 12, 08:30)",
      deltaText: "-2.1 g/dL",
      deltaPercent: "-20.0%",
      isDeltaDrop: true,
      clinicalImpression:
        "Anemia normositik normokromik derajat sedang dengan pergeseran delta akut sebesar -20.0% dalam 72 jam terakhir pasca-tindakan bedah.",
      clinicalImpressionEn:
        "Moderate normocytic normochromic anemia presenting with acute -20.0% longitudinal delta deviation over the past 72 hours post-surgery.",
      clinicalRecommendation:
        "Disarankan evaluasi kecurigaan perdarahan tersembunyi (occult bleeding) atau hemodilusi cairan. Siapkan konfirmasi feses darah samar sebelum intervensi lanjut.",
      clinicalRecommendationEn:
        "Recommend evaluating for occult blood loss or fluid hemodilution. Confirm with occult stool blood testing prior to secondary intervention.",
      isPanicValue: false,
    },
    {
      id: "chemistry-creatinine",
      tabLabel: language === "ID" ? "Kimia Darah: Serum Kreatinin" : "Chemistry: Serum Creatinine",
      tabLabelEn: "Chemistry: Serum Creatinine",
      specimenNo: "LAB-261109-02",
      patientName: "Ny. Ratna Suminar",
      patientAgeGender: "62 Th • Perempuan • RM #0912443",
      patientAgeGenderEn: "62 Y • Female • MRN #0912443",
      ward: "ICU / Rawat Intensif (Bed 02)",
      wardEn: "ICU / Intensive Care Unit (Bed 02)",
      attendingDoc: "dr. Cynthia Sp.PD-KGH",
      parameterName: language === "ID" ? "Serum Kreatinin (Enzimatik)" : "Serum Creatinine (Enzymatic)",
      parameterNameEn: "Serum Creatinine (Enzymatic)",
      analyteCode: "LOINC 2160-0",
      currentValue: "2.85",
      unit: "mg/dL",
      refInterval: "0.50 - 1.10 mg/dL",
      statusLabel: "Peningkatan Akut (Risiko AKI)",
      statusLabelEn: "Acute Rise (AKI Risk)",
      prevValue: "1.10 mg/dL",
      prevTimestamp: "2 hari lalu (13 Nov, 14:10)",
      prevTimestampEn: "2 days ago (Nov 13, 14:10)",
      deltaText: "+1.75 mg/dL",
      deltaPercent: "+159.1%",
      isDeltaDrop: false,
      clinicalImpression:
        "Lonjakan serum kreatinin > 100% dari baseline dalam 48 jam memenuhi kriteria KDIGO Stage 2 Acute Kidney Injury (AKI) disertai penurunan eGFR tajam.",
      clinicalImpressionEn:
        "Serum creatinine elevation > 100% from baseline in 48 hours satisfies KDIGO Stage 2 Acute Kidney Injury (AKI) criteria with acute eGFR decline.",
      clinicalRecommendation:
        "Segera tinjau ulang dosis terapi antibiotik/obat nefrotoksik, evaluasi keseimbangan cairan pasien, dan pantau elektrolit kalium serial.",
      clinicalRecommendationEn:
        "Urgent review of nephrotoxic medication and antibiotic dosing, optimize fluid resuscitation, and monitor serial serum potassium.",
      isPanicValue: true,
    },
    {
      id: "metabolic-glucose",
      tabLabel: language === "ID" ? "Metabolik: Glukosa Darah Puasa" : "Metabolic: Fasting Glucose",
      tabLabelEn: "Metabolic: Fasting Glucose",
      specimenNo: "LAB-261109-03",
      patientName: "Tn. Agus Darmawan",
      patientAgeGender: "48 Th • Laki-laki • RM #0771892",
      patientAgeGenderEn: "48 Y • Male • MRN #0771892",
      ward: "Poli Penyakit Dalam (Rawat Jalan)",
      wardEn: "Internal Medicine Outpatient Clinic",
      attendingDoc: "dr. Hendro Sp.PD-KEMD",
      parameterName: language === "ID" ? "Glukosa Darah Puasa (GDP)" : "Fasting Blood Glucose",
      parameterNameEn: "Fasting Blood Glucose",
      analyteCode: "LOINC 1558-6",
      currentValue: "248",
      unit: "mg/dL",
      refInterval: "70 - 100 mg/dL",
      statusLabel: "Hiperglikemia Subakut",
      statusLabelEn: "Subacute Hyperglycemia",
      prevValue: "142 mg/dL",
      prevTimestamp: "3 minggu lalu (24 Okt)",
      prevTimestampEn: "3 weeks ago (Oct 24)",
      deltaText: "+106 mg/dL",
      deltaPercent: "+74.6%",
      isDeltaDrop: false,
      clinicalImpression:
        "Hiperglikemia berat dengan lonjakan nilai +74.6% dari baseline kunjungan terakhir, mengindikasikan dekompensasi kontrol metabolik subakut.",
      clinicalImpressionEn:
        "Severe fasting hyperglycemia with +74.6% elevation from previous encounter baseline, pointing to subacute metabolic decompensation.",
      clinicalRecommendation:
        "Disarankan konfirmasi pemeriksaan HbA1c, skrining glukosuria/ketonuria, dan pertimbangkan intensifikasi regimen terapi antidiabetes.",
      clinicalRecommendationEn:
        "Confirmatory HbA1c testing and urine ketone screening advised; consider therapeutic intensification for glycemic stabilization.",
      isPanicValue: false,
    },
    {
      id: "hemostasis-plt",
      tabLabel: language === "ID" ? "Hemostasis: Trombosit (Serial)" : "Hemostasis: Platelets (Serial)",
      tabLabelEn: "Hemostasis: Platelets (Serial)",
      specimenNo: "LAB-261109-04",
      patientName: "An. Salsabila Putri",
      patientAgeGender: "9 Th • Perempuan • RM #1002341",
      patientAgeGenderEn: "9 Y • Female • MRN #1002341",
      ward: "IGD & Resusitasi Pediatrik",
      wardEn: "Pediatric Emergency & Resuscitation",
      attendingDoc: "dr. Maya Sp.A, Subsp.Hem",
      parameterName: language === "ID" ? "Hitung Trombosit (Platelet)" : "Platelet Count (PLT)",
      parameterNameEn: "Platelet Count (PLT)",
      analyteCode: "LOINC 777-3",
      currentValue: "14.000",
      unit: "/µL",
      refInterval: "150.000 - 450.000 /µL",
      statusLabel: "Nilai Kritis (KARS SKP 2.2)",
      statusLabelEn: "Critical Value (KARS SKP 2.2)",
      prevValue: "88.000 /µL",
      prevTimestamp: "Kemarin sore (14 Nov, 16:20)",
      prevTimestampEn: "Yesterday evening (Nov 14, 16:20)",
      deltaText: "-74.000 /µL",
      deltaPercent: "-84.1%",
      isDeltaDrop: true,
      clinicalImpression:
        "Nilai Kritis Darurat (Trombosit < 20.000/µL): Penurunan drastis 84.1% dalam 18 jam dengan risiko tinggi perdarahan spontan intraserebral/mukosa.",
      clinicalImpressionEn:
        "Emergency Critical Value (PLT < 20,000/µL): Precipitous 84.1% plunge in 18 hours with severe risk of spontaneous internal hemorrhage.",
      clinicalRecommendation:
        "Protokol KARS SKP 2.2: Wajib lapor ke DPJP/Dokter Jaga IGD < 15 menit. Siapkan transfusi konsentrat trombosit (TC) & verifikasi apusan darah tepi.",
      clinicalRecommendationEn:
        "Mandatory KARS SKP 2.2 Protocol: Critical reporting to ER physician < 15 mins. Crossmatch platelet concentrate (TC) & review peripheral blood smear.",
      isPanicValue: true,
    },
  ];

  const currentProfile = profiles[selectedProfileIdx];
  const isAuthorized = authorizedProfiles[currentProfile.id];
  const isAlertSent = alertDispatched[currentProfile.id];

  const handleToggleAuthorize = () => {
    setAuthorizedProfiles((prev) => ({
      ...prev,
      [currentProfile.id]: !prev[currentProfile.id],
    }));
  };

  const handleDispatchAlert = () => {
    setAlertDispatched((prev) => ({
      ...prev,
      [currentProfile.id]: true,
    }));
  };

  const handleResetProfile = () => {
    setAuthorizedProfiles((prev) => ({
      ...prev,
      [currentProfile.id]: false,
    }));
    setAlertDispatched((prev) => ({
      ...prev,
      [currentProfile.id]: false,
    }));
  };

  const workflowPipeline = [
    {
      stepLabel: "01",
      title: language === "ID" ? "Interfacing Dua Arah Analyzer" : "Bi-Directional Analyzer Interfacing",
      protocol: "ASTM E1381 • HL7 v2 / FHIR",
      desc:
        language === "ID"
          ? "Data hasil uji dari 500+ instrumen hematologi, kimia klinis, dan imunologi ditransmisikan secara langsung tanpa entri manual, meniadakan risiko salah ketik."
          : "Direct telemetry ingestion from 500+ hematology, chemistry, and immunoassay instruments with zero manual entry, eliminating transcription errors.",
      icon: Server,
    },
    {
      stepLabel: "02",
      title: language === "ID" ? "Mesin Delta-Check Longitudinal" : "Longitudinal Delta-Check Engine",
      protocol: "Statistical Z-Score • Patient Delta Rules",
      desc:
        language === "ID"
          ? "Sistem membandingkan nilai terkini dengan rekam jejak pemeriksaan pasien terdahulu secara serial, mendeteksi pergeseran anomali akut antar-kunjungan."
          : "Compares current results against historical patient baselines sequentially, catching acute deviations that static reference ranges miss.",
      icon: TrendingUp,
    },
    {
      stepLabel: "03",
      title: language === "ID" ? "Draf Interpretasi & Triage Kritis" : "Clinical Draft & Critical Triage",
      protocol: "KARS SKP 2.2 • LOINC & SNOMED-CT",
      desc:
        language === "ID"
          ? "Menyiapkan draf narasi klinis terstandar dan secara otomatis menyiarkan notifikasi nilai kritis ke WhatsApp dan SIMRS dokter jaga dalam waktu < 15 menit."
          : "Prepares standardized clinical summaries and automatically broadcasts critical panic alerts to attending teams in under 15 minutes.",
      icon: BellRing,
    },
    {
      stepLabel: "04",
      title: language === "ID" ? "Otorisasi Dokter Sp.PK & E-Sign" : "Pathologist Sign-Off & E-Sign",
      protocol: "BSrE Certified • 100% Human Sovereignty",
      desc:
        language === "ID"
          ? "Dokter Spesialis Patologi Klinik meninjau, menyunting, dan membubuhkan tanda tangan digital resmi sebelum hasil dirilis ke SIMRS atau SATUSEHAT."
          : "Certified pathologists review, edit, and digitally sign the finalized report before official dispatch to hospital EMR and SATUSEHAT.",
      icon: FileCheck2,
    },
  ];

  return (
    <div className="w-full bg-white text-slate-900">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PageHero (Enterprise Medical SaaS Aesthetic)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Clinical Decision Support System (CDSS)" : "Clinical Decision Support System (CDSS)"}
        title={
          language === "ID" ? (
            <>
              Otomasi Delta-Check &{" "}
              <br className="hidden sm:inline" />
              Validasi Cerdas Hasil Laboratorium
            </>
          ) : (
            <>
              Automated Delta-Check &{" "}
              <br className="hidden sm:inline" />
              Intelligent Laboratory Validation
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Mempercepat waktu rilis hasil uji (TAT), mendeteksi deviasi biomarker longitudinal antar-kunjungan pasien, dan menyiapkan draf interpretasi klinis—dengan 100% kendali verifikasi di tangan dokter spesialis patologi."
            : "Slashing turnaround time (TAT), flagging longitudinal biomarker deviations across patient visits, and preparing structured clinical drafts—with 100% verification authority retained by certified pathologists."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Nova AI" : "Schedule Nova AI Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Lihat Meja Kerja Patologi" : "Explore Pathologist Desk",
          href: "#workstation-demo",
        }}
        metrics={[
          {
            value: "-70%",
            label: language === "ID" ? "Pangkas Waktu Validasi" : "Turnaround Time (TAT)",
            sub: language === "ID" ? "Auto-verifikasi sampel normal" : "Auto-release normal routine",
          },
          {
            value: language === "ID" ? "< 3 Detik" : "< 3 Sec",
            label: language === "ID" ? "Kalkulasi Delta-Check" : "Delta-Check Speed",
            sub: language === "ID" ? "Komparasi riwayat serial" : "Serial trend comparison",
          },
          {
            value: "100%",
            label: language === "ID" ? "Kendali Dokter Sp.PK" : "Physician Sovereignty",
            sub: language === "ID" ? "Human-in-the-loop mutlak" : "Absolute clinical control",
          },
          {
            value: "KARS & ISO",
            label: language === "ID" ? "Kepatuhan Akreditasi" : "Audit Compliance",
            sub: language === "ID" ? "Standar pelaporan nilai kritis" : "Accredited critical protocol",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          REFINED REGULATORY NOTICE BAR (Subtle & High-Legibility)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] border-y border-slate-200/70 py-3 px-4 sm:px-6">
        <div className="mx-auto max-w-[1560px] flex items-center justify-center gap-2.5 text-xs sm:text-[13px] font-medium text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3FE] text-[#0073FC] text-[11px] font-semibold shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>CDSS</span>
          </span>
          <span className="text-slate-600 leading-relaxed">
            <strong className="text-slate-900 font-semibold">
              {language === "ID" ? "Standar Tata Kelola Klinis:" : "Clinical Governance Standard:"}
            </strong>{" "}
            {language === "ID"
              ? "Beroperasi sesuai UU Kesehatan No. 17/2023 & Permenkes No. 24/2022. Seluruh keputusan diagnosis tetap berada pada kewenangan dokter."
              : "Conforms to national health regulations. All definitive diagnostic and therapeutic decisions remain under attending physician authority."}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: SYSTEM OF RECORD VS SYSTEM OF ACTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-b border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Paradigma Baru LIS" : "The LIS System of Action"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Dari System of Record Menuju System of Action"
                  : "From System of Record to System of Action"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "LIS konvensional berhenti pada pencatatan pasif. Nova AI membaca konteks klinis secara aktif—mengekstrak order, menghitung tren delta, dan menyiapkan draf laporan siap sah."
                : "Traditional LIS stops at passive record-keeping. Nova AI reads clinical context actively—extracting orders, computing delta trends, and preparing sign-off-ready drafts."}
            </p>
          </div>

          {/* 2-Card Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Traditional LIS */}
            <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-800">
                  {language === "ID" ? "LIS Konvensional" : "Traditional LIS"}
                </h3>
                <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-400/80 text-white text-xs font-semibold">
                  <Server className="h-3.5 w-3.5" />
                  <span>{language === "ID" ? "System of Record (Pasif)" : "System of Record"}</span>
                </div>

                <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-600">
                  {[
                    language === "ID" ? "Hanya menyimpan & mengambil data hasil lab" : "Passive data storage & retrieval",
                    language === "ID" ? "Manajemen alur kerja & verifikasi manual" : "Manual workflow & validation management",
                    language === "ID" ? "Penanganan error bersifat reaktif setelah rilis" : "Reactive error handling after sign-out",
                    language === "ID" ? "Pelaporan statis tanpa analisis tren serial" : "Static reporting without longitudinal context",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <XCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Card: Diagnova Nova AI */}
            <div className="rounded-[28px] bg-white border-2 border-[#0073FC]/25 p-7 sm:p-9 shadow-[0_14px_38px_-12px_rgba(0,115,252,0.16)] flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-[#0073FC]">
                  {language === "ID" ? "Diagnova Nova AI" : "Diagnova Modern LIS"}
                </h3>
                <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0073FC] text-white text-xs font-semibold shadow-[0_4px_14px_-3px_rgba(0,115,252,0.45)]">
                  <Zap className="h-3.5 w-3.5" />
                  <span>{language === "ID" ? "System of Action (Aktif)" : "System of Action"}</span>
                </div>

                <ul className="mt-7 space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                  {[
                    language === "ID"
                      ? "Interpretasi & delta-check longitudinal secara real-time"
                      : "Real-time interpretation & longitudinal delta-check",
                    language === "ID"
                      ? "Orkestrasi auto-verifikasi & routing kasus otomatis"
                      : "Automated workflow orchestration & smart case routing",
                    language === "ID"
                      ? "Deteksi dini nilai kritis & inkonsistensi pra-otorisasi"
                      : "Proactive panic triage & pre-signout inconsistency alerts",
                    language === "ID"
                      ? "Draf narasi medis terstruktur siap otorisasi dokter Sp.PK"
                      : "Structured clinical drafts ready for pathologist sign-off",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: PATHOLOGIST WORKSTATION & AI CAPABILITIES (#workstation-demo)
          (3x2 Flat Card Grid on Pure White Background)
          ══════════════════════════════════════════════════════════════ */}
      <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Meja Kerja Patologi Klinik" : "Pathologist Workstation"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Bagaimana Nova AI Mendukung Otorisasi Dokter"
                  : "How Nova AI Powers Pathologist Sign-Off Workflows"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Enam kapabilitas agen cerdas yang tertanam langsung di meja kerja dokter Sp.PK—mempercepat validasi tanpa mengurangi otoritas medis."
                : "Six embedded AI capabilities inside the pathologist desk—accelerating sign-off without altering physician authority."}
            </p>
          </div>

          {/* 3x2 Flat Cards Grid (Matches Reference Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: ScanText,
                title: language === "ID" ? "Analisis & Pencitraan Sel" : "Analysis & Imaging",
                status: language === "ID" ? "Tersedia di Ekosistem" : "Available in the Marketplace",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Pewarnaan virtual berbasis AI, kuantifikasi gambar otomatis, dan pra-skrining cerdas untuk mempercepat tinjauan serta akurasi diagnostik."
                    : "AI-powered virtual staining, automated image quantification, and intelligent pre-screening to accelerate review and enhance diagnostic efficiency.",
              },
              {
                icon: GitBranch,
                title: language === "ID" ? "Optimasi Alur Kerja" : "Workflow Optimization",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Distribusi kasus cerdas yang menyeimbangkan beban kerja dokter patologi serta entri hasil bebas genggam."
                    : "Intelligent case distribution optimizing pathologist workload with hands-free result entry.",
              },
              {
                icon: FileText,
                title: language === "ID" ? "Pemrosesan Order & Spesimen" : "Specimen & Order Processing",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Konversi formulir permintaan kertas menjadi order digital berbasis OCR serta anotasi dan validasi spesimen otomatis."
                    : "OCR conversion of paper requests to digital orders and AI-powered measurement/annotation of specimens.",
              },
              {
                icon: ShieldCheck,
                title: language === "ID" ? "Kualitas & Konsistensi" : "Quality & Consistency",
                status: "In Beta",
                statusColor: "text-slate-400",
                desc:
                  language === "ID"
                    ? "Asisten AI menandai inkonsistensi terminologi dan kode ICD-10 untuk menjamin kejelasan laporan sebelum otorisasi."
                    : "AI assistant flags inconsistencies to ensure clarity and consistency before signing out.",
              },
              {
                icon: TrendingUp,
                title: language === "ID" ? "Delta-Check & Triage Kritis" : "Delta-Check & Critical Triage",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Kalkulasi tren serial otomatis antar-kunjungan pasien dan penyiaran nilai kritis KARS dalam hitungan menit."
                    : "Automated serial trend calculations across visits with instant KARS-compliant critical panic alerts.",
              },
              {
                icon: BarChart3,
                title: language === "ID" ? "Inteligensi & Analitik" : "Intelligence & Analytics",
                status: "Q2 2026",
                statusColor: "text-slate-400",
                desc:
                  language === "ID"
                    ? "Analitik bahasa natural memungkinkan tim menanyakan data operasional dan bottleneck TAT secara percakapan real-time."
                    : "Natural language analytics allow teams to query data conversationally, unlocking real-time operational and financial insights.",
              },
            ].map((cap) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-[22px] bg-[#F7F9FC] p-7 sm:p-8 flex flex-col gap-5 transition-colors hover:bg-[#F1F5FA]"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#E8F1FD] text-[#0073FC] flex items-center justify-center shrink-0">
                      <CapIcon className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                        {cap.title}
                      </h3>
                      <span className={cn("text-xs font-medium block mt-0.5", cap.statusColor)}>
                        {cap.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[14px] text-slate-600 leading-relaxed font-normal">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4-STAGE LABORATORY PIPELINE (#how-it-works)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="scroll-mt-28 w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Alur Kerja 4 Tahap" : "4-Stage Clinical Pipeline"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien"
                  : "Structured Pipeline Safeguarding Clinical Integrity & Accuracy"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Dari pembacaan instrumen analitik hingga otorisasi digital dokter spesialis, setiap tahap didesain dengan ketertelusuran penuh dan kepatuhan akreditasi rumah sakit."
                : "From direct analyzer telemetry to certified pathologist authorization, every phase is engineered with full audit traceability and hospital accreditation standards."}
            </p>
          </div>

          {/* 2x2 Symmetrical AI Feature Cards (Matches LigoLab AI Agents Reference) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CARD 1 (Top Left): AI-Powered Virtual Staining */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Sparkles className="h-5 w-5 text-[#0073FC] shrink-0" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Pewarnaan Virtual Berbasis AI" : "AI-Powered Virtual Staining"}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                  {[
                    language === "ID" ? "Menjaga integritas jaringan biopsi berharga" : "Preserves precious tissue",
                    language === "ID" ? "Mempercepat waktu rilis hasil (TAT)" : "Improves turnaround time (TAT)",
                    language === "ID" ? "Memungkinkan triage kasus darurat lebih cepat" : "Enables rapid case triage",
                    language === "ID" ? "Mengurangi variabilitas preparasi slide" : "Reduces slide preparation variability",
                    language === "ID" ? "Menurunkan beban kerja teknis lab basah" : "Lowers manual labor demands",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Monitor Frame Visual */}
              <div className="mt-auto flex flex-col items-center">
                <div className="relative w-full max-w-[440px] rounded-2xl border-[3px] border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Top Toggle Bar inside Monitor */}
                  <div className="flex items-center justify-center gap-3 py-3.5 px-4 border-b border-slate-100 bg-white">
                    <span className={cn("text-xs font-medium", !virtualStaining ? "text-slate-900 font-bold" : "text-slate-400")}>
                      H&amp;E
                    </span>
                    <button
                      type="button"
                      onClick={() => setVirtualStaining((prev) => !prev)}
                      aria-label="Toggle Virtual Staining"
                      className={cn(
                        "relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer",
                        virtualStaining ? "bg-[#0073FC]" : "bg-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform",
                          virtualStaining ? "translate-x-8" : "translate-x-1"
                        )}
                      />
                    </button>
                    <span className={cn("text-xs font-bold", virtualStaining ? "text-[#0073FC]" : "text-slate-400")}>
                      Virtual Staining
                    </span>
                  </div>

                  {/* Histology Slide Canvas */}
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#FCE7F3]">
                    <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden="true">
                      <rect width="400" height="160" fill={virtualStaining ? "#F5D0FE" : "#FBCFE8"} />
                      <path
                        d="M0 90 C60 40, 120 130, 190 70 C250 20, 320 110, 400 60 L400 160 L0 160 Z"
                        fill={virtualStaining ? "#C084FC" : "#F472B6"}
                        opacity="0.45"
                      />
                      <path
                        d="M0 110 C80 75, 160 140, 240 95 C300 60, 350 120, 400 85 L400 160 L0 160 Z"
                        fill={virtualStaining ? "#7E22CE" : "#BE185D"}
                        opacity="0.32"
                      />
                      {[
                        [45, 55], [92, 82], [138, 48], [185, 92], [230, 58], [280, 78], [332, 46], [368, 95],
                        [68, 118], [120, 108], [164, 125], [218, 112], [265, 128], [315, 105], [355, 122],
                      ].map(([cx, cy], idx) => (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={(idx % 3) + 2.5}
                          fill={virtualStaining ? "#581C87" : "#831843"}
                          opacity="0.55"
                        />
                      ))}
                    </svg>

                    {/* Mini Slide Thumbnail (Left) */}
                    <div className="absolute left-3 top-3 w-12 h-14 rounded-lg bg-white/95 border border-slate-200 shadow-xs p-1 flex flex-col justify-between">
                      <div className="h-8 rounded-sm bg-pink-200/80" />
                      <div className="h-1.5 w-6 bg-slate-300 rounded-full mx-auto" />
                    </div>

                    {/* Floating Blue Pill */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0073FC] text-white text-[11px] font-semibold shadow-[0_6px_18px_-4px_rgba(0,115,252,0.55)] whitespace-nowrap">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{language === "ID" ? "Tanpa proses lab basah" : "Without wet lab work"}</span>
                    </div>
                  </div>
                </div>
                {/* Monitor Stand */}
                <div className="w-16 h-6 bg-gradient-to-b from-slate-200 to-slate-300" />
                <div className="w-28 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* CARD 2 (Top Right): Dynamic Case & Resource Optimization */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <GitBranch className="h-5 w-5 text-[#0073FC] shrink-0" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Optimasi Kasus & Beban Kerja Dinamis" : "Dynamic Case & Resource Optimization"}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                  {[
                    language === "ID" ? "Prioritas kasus berdasarkan TAT, urgensi, & kompleksitas" : "Prioritizes cases based on TAT, payer type, and complexity",
                    language === "ID" ? "Menyeimbangkan beban kerja antar dokter Sp.PK" : "Balances workload across pathologists",
                    language === "ID" ? "Memprediksi bottleneck harian dan mingguan" : "Predicts daily and weekly bottlenecks",
                    language === "ID" ? "Peringatan proaktif saat mendekati ambang batas SLA/TAT" : "Alerts teams as cases approach SLA/TAT thresholds",
                    language === "ID" ? "Rekomendasi penyesuaian staf secara proaktif" : "Suggests staffing adjustments proactively",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Monitor Frame Visual */}
              <div className="mt-auto flex flex-col items-center">
                <div className="w-full max-w-[440px] rounded-2xl border-[3px] border-slate-200 bg-[#F8FAFD] p-3.5 sm:p-4 shadow-sm">
                  <div className="grid grid-cols-11 items-center gap-2">
                    {/* Left 3 Cases */}
                    <div className="col-span-4 space-y-2">
                      <div className="rounded-lg bg-[#0073FC] text-white p-2 shadow-xs">
                        <p className="text-[9px] font-bold">CASE #9435</p>
                        <p className="text-[8px] text-blue-100">CITO • IGD</p>
                        <div className="mt-1.5 h-1 w-full rounded-full bg-white/30">
                          <div className="h-1 w-3/4 rounded-full bg-white" />
                        </div>
                      </div>
                      <div className="rounded-lg bg-white border border-slate-200 p-2">
                        <p className="text-[9px] font-bold text-slate-700">CASE #7889</p>
                        <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                          <div className="h-1 w-1/2 rounded-full bg-[#0073FC]" />
                        </div>
                      </div>
                      <div className="rounded-lg bg-white border border-slate-200 p-2">
                        <p className="text-[9px] font-bold text-slate-700">CASE #9102</p>
                        <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                          <div className="h-1 w-2/3 rounded-full bg-[#0073FC]" />
                        </div>
                      </div>
                    </div>

                    {/* Center Smart Distribution Hub */}
                    <div className="col-span-3 flex flex-col items-center justify-center">
                      <div className="rounded-xl bg-white border border-blue-200/80 px-2 py-3 text-center shadow-xs">
                        <Cpu className="h-4 w-4 text-[#0073FC] mx-auto mb-1" />
                        <span className="text-[8px] font-bold text-slate-600 leading-tight block uppercase">
                          Smart Routing
                        </span>
                      </div>
                    </div>

                    {/* Right 3 Pathologists */}
                    <div className="col-span-4 space-y-2">
                      {[
                        { name: "dr. Hendra", load: "32%", w: "w-1/3" },
                        { name: "dr. Ratna", load: "28%", w: "w-1/4" },
                        { name: "dr. Budi", load: "45%", w: "w-1/2" },
                      ].map((doc) => (
                        <div key={doc.name} className="rounded-lg bg-white border border-slate-200 p-2">
                          <div className="flex items-center justify-between text-[8px] font-bold text-slate-800">
                            <span>{doc.name}</span>
                            <span className="text-[#0073FC]">{doc.load}</span>
                          </div>
                          <div className="mt-1.5 h-1 w-full rounded-full bg-slate-100">
                            <div className={`h-1 ${doc.w} rounded-full bg-[#0073FC]`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Monitor Stand */}
                <div className="w-16 h-6 bg-gradient-to-b from-slate-200 to-slate-300" />
                <div className="w-28 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* CARD 3 (Bottom Left): Hands-Free Result Entry */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Mic className="h-5 w-5 text-[#0073FC] shrink-0" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Entri Hasil Bebas Genggam" : "Hands-Free Result Entry"}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                  {[
                    language === "ID" ? "Dikte klinis speech-to-text bertenaga AI" : "AI-powered speech-to-text",
                    language === "ID" ? "Navigasi sistem berbasis perintah suara (speech-to-operate)" : "Voice-driven system navigation (speech-to-operate)",
                    language === "ID" ? "Pengisian template laporan otomatis sesuai konteks" : "Context-aware template autofill",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Voice Waveform + Autofill Box */}
              <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#E8F1FD] pl-2 pr-5 py-2 border border-blue-200/60">
                    <div className="w-9 h-9 rounded-full bg-[#0073FC] text-white flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(0,115,252,0.45)]">
                      <Mic className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 h-7">
                      {[10, 18, 12, 26, 16, 22, 12, 26, 18, 10, 22, 14, 24, 16, 10].map((h, i) => (
                        <span key={i} className="w-1 rounded-full bg-[#0073FC]" style={{ height: `${h}px` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      DIAGNOSIS:
                    </span>
                    <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
                      {language === "ID" ? "Anemia Normositik (D64.9)" : "Malignant Melanoma (T4b)"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {language === "ID" ? "SPESIMEN:" : "SPECIMEN:"}
                    </span>
                    <div className="rounded-xl bg-white border border-slate-200/80 px-3.5 py-2.5 text-xs font-medium text-slate-800 shadow-2xs">
                      {language === "ID" ? "Darah EDTA • Lab Sentral" : "Skin, Left Forearm"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4 (Bottom Right): Pre-Signout Review & Reporting Support */}
            <div className="rounded-[24px] sm:rounded-[28px] bg-white border border-slate-200/75 p-7 sm:p-9 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <Stethoscope className="h-5 w-5 text-[#0073FC] shrink-0" />
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {language === "ID" ? "Review Pra-Otorisasi & Pelaporan" : "Pre-Signout Review & Reporting Support"}
                  </h3>
                </div>

                <ul className="space-y-2 text-xs sm:text-[13.5px] text-slate-600 mb-7">
                  {[
                    language === "ID" ? "Meningkatkan kejelasan dan keringkasan laporan medis" : "Enhances clarity and conciseness of reports",
                    language === "ID" ? "Menjaga konsistensi terminologi klinis terstandar" : "Promotes consistency in terminology",
                    language === "ID" ? "Menyarankan pemeriksaan lanjutan & diagnosis banding" : "Suggests IHCs and differential diagnoses",
                    language === "ID" ? "Terintegrasi dengan basis pengetahuan klinis terverifikasi" : "Integrates clinical knowledge support tools",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pre-Signout Input + Tooltip Widget */}
              <div className="mt-auto rounded-2xl bg-[#F4F8FC] p-5 sm:p-6 flex flex-col justify-center">
                <div className="rounded-xl bg-white border border-slate-200/90 px-4 py-3 flex items-center justify-between shadow-2xs">
                  <span className="text-sm font-medium text-slate-700">Carcino</span>
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                </div>
                <div className="relative mt-2.5 rounded-xl bg-[#0073FC] text-white px-4 py-3 shadow-[0_12px_28px_-8px_rgba(0,115,252,0.55)] flex items-center gap-2.5">
                  <span className="absolute -top-1.5 left-6 w-3 h-3 bg-[#0073FC] rotate-45" />
                  <Sparkles className="h-4 w-4 text-blue-100 shrink-0" />
                  <span className="text-xs sm:text-[13px] font-medium">
                    {language === "ID"
                      ? "Maksud Anda 'Carcinoma'? Kode ICD-10 diperbarui."
                      : "Did you mean 'Carcinoma'? ICD-10 Code updated."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CLINICAL GOVERNANCE & RESPONSIBILITY MATRIX (#ai-doctor)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="ai-doctor"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full space-y-12 sm:space-y-14">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Tata Kelola Klinis & Akuntabilitas" : "Clinical Governance & Legal Accountability"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Mengapa Dokter Tetap Menjadi Otoritas Klinis Tertinggi?"
                  : "Why Physicians Retain Absolute Medical Authority"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Sistem komputasi mempercepat pemrosesan data, sementara pertimbangan diagnosis holistik dan tanggung jawab hukum mutlak berada di tangan dokter spesialis teregistrasi."
                : "Computational systems accelerate data processing, while holistic diagnostic judgment and full legal accountability remain with licensed medical practitioners."}
            </p>
          </div>

          {/* Side-by-Side Bento Responsibility Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box A: Sistem Nova AI */}
            <div className="rounded-[28px] bg-[#F1F4F8] p-7 sm:p-9 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80">
                  <div className="h-12 w-12 rounded-2xl bg-[#0073FC] text-white flex items-center justify-center shadow-[0_8px_18px_-4px_rgba(0,115,252,0.4)] shrink-0">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {language === "ID" ? "Sistem Nova AI (Decision Support)" : "Nova AI System (Decision Support)"}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {language === "ID" ? "Komputasi Presisi & Deteksi Deviasi" : "High-Speed Computing & Variance Detection"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Memindai ribuan hasil lab serial pasien dalam hitungan milidetik secara konsisten."
                        : "Scans thousands of serial patient laboratory results in milliseconds with zero fatigue."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menghitung deviasi delta-check otomatis terhadap baseline individual pasien terdahulu."
                        : "Automatically calculates longitudinal delta deviations against individual patient baselines."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menyiapkan draf narasi interpretasi terstruktur untuk mempercepat review dokter."
                        : "Drafts structured clinical interpretation notes to accelerate pathologist review time."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#0073FC] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menyiarkan alarm nilai kritis (Panic Values) ke dokter jaga < 15 menit sesuai KARS."
                        : "Dispatches critical panic value alerts to attending physicians in < 15 minutes per KARS."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Batasan Mutlak */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 space-y-1.5 text-xs text-slate-600">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                  {language === "ID" ? "Batasan Regulasi Mutlak" : "Strict Regulatory Limits"}
                </span>
                <p className="text-slate-700 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Nova AI tidak memiliki wewenang hukum untuk menegakkan diagnosis definitif mandiri atau meresepkan terapi obat."
                    : "Nova AI possesses zero legal authority to issue autonomous definitive diagnoses or prescribe therapeutic drugs."}
                </p>
              </div>
            </div>

            {/* Box B: Dokter Spesialis Patologi Klinik & DPJP */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-9 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shrink-0">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {language === "ID" ? "Dokter Sp.PK & DPJP (Otoritas Medis)" : "Pathologist & Attending Physician"}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {language === "ID" ? "Pertimbangan Holistik & Akuntabilitas Hukum" : "Holistic Clinical Judgment & Legal Responsibility"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Mengkorelasikan temuan laboratorium dengan anamnesis dan kondisi fisik riil pasien."
                        : "Correlates laboratory telemetry against patient clinical history and direct physical exam."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menilai, mengedit, atau menolak draf narasi interpretasi yang diajukan sistem."
                        : "Evaluates, modifies, or overrides automated clinical narrative recommendations."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menetapkan diagnosis medis definitif dan merumuskan rencana terapi penanganan."
                        : "Establishes definitive medical diagnoses and prescribes therapeutic treatment plans."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Mengesahkan lembar hasil laboratorium dengan tanda tangan digital resmi (BSrE)."
                        : "Authorizes finalized laboratory reports with accredited cryptographic digital signatures."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Landasan Hukum */}
              <div className="rounded-2xl bg-[#FAFBFD] border border-slate-200/80 p-4 space-y-1.5 text-xs text-slate-600">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                  {language === "ID" ? "Landasan Hukum Republik Indonesia" : "Indonesian Statutory Foundation"}
                </span>
                <p className="text-slate-700 font-normal leading-relaxed">
                  {language === "ID"
                    ? "Berdasarkan UU Kesehatan No. 17/2023, seluruh pertimbangan klinis dan tanggung jawab hukum medis melekat pada dokter yang memiliki STR dan SIP aktif."
                    : "Under Healthcare Law No. 17/2023, all medical decisions and legal responsibilities rest exclusively with certified and registered physicians."}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Regulatory Standards Trust Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 block">UU Kesehatan No. 17/2023</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {language === "ID" ? "Kepastian hukum tanggung jawab medis" : "Legal medical accountability"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 block">Permenkes No. 24/2022</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {language === "ID" ? "Interoperabilitas RME & SATUSEHAT" : "EMR & SATUSEHAT interoperability"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 block">KARS SKP 2.2 & ISO 15189</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {language === "ID" ? "Prosedur baku pelaporan nilai kritis" : "Accredited panic value triage"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Standardized Enterprise Banner
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner bgClassName="bg-[#FAFBFD] border-t border-slate-200/60" topColor="#FAFBFD" />
    </div>
  );
}
