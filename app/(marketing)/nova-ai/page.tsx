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
      <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
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
          SECTION 2: 6-CARD AI CAPABILITIES GRID
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#FAFBFD] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Split Header (Left-Aligned) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Ekosistem Agen AI" : "AI Agent Ecosystem"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.14] tracking-tight text-slate-900">
                {language === "ID"
                  ? "Enam Agen Spesifik untuk Setiap Titik Kritis Lab"
                  : "Six Purpose-Built Agents Across the Lab Lifecycle"}
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Setiap agen bekerja di dalam alur klinis yang sudah ada—mengurangi pekerjaan administratif 30–60% tanpa mengubah otoritas dokter."
                : "Each agent operates inside existing clinical workflows—cutting administrative effort by 30–60% without altering physician authority."}
            </p>
          </div>

          {/* 3x2 Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: ScanText,
                title: language === "ID" ? "Ekstraksi Order OCR & LLM" : "OCR & LLM Order Extraction",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Mengubah formulir permintaan lab cetak atau tulisan tangan menjadi order digital dan menandai ketidaksesuaian jenis tabung."
                    : "Converts paper or handwritten requisitions into digital orders and flags tube or specimen mismatches automatically.",
              },
              {
                icon: Mic,
                title: language === "ID" ? "Dikte Klinis Bebas Genggam" : "Hands-Free Voice Dictation",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Dokter mendiktekan temuan mikroskopis atau kesan klinis secara natural dan sistem langsung mengisi kolom laporan terstruktur."
                    : "Pathologists dictate microscopic findings naturally while Nova AI populates structured report templates hands-free.",
              },
              {
                icon: TrendingUp,
                title: language === "ID" ? "Deteksi Delta-Check Serial" : "Longitudinal Delta-Check",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Membandingkan nilai analit pasien dengan riwayat kunjungan sebelumnya untuk menangkap perburukan klinis yang lolos dari batas statis."
                    : "Compares current analytes against prior patient visits to catch acute shifts missed by static reference intervals.",
              },
              {
                icon: ShieldCheck,
                title: language === "ID" ? "Audit Kualitas Pra-Otorisasi" : "Pre-Signout Quality Audit",
                status: "In Beta",
                statusColor: "text-slate-500",
                desc:
                  language === "ID"
                    ? "Memeriksa konsistensi antara kesan klinis, kode ICD-10, dan kelengkapan parameter sebelum laporan ditandatangani secara digital."
                    : "Verifies consistency between clinical impressions, ICD-10 codes, and required parameters prior to electronic sign-off.",
              },
              {
                icon: GitBranch,
                title: language === "ID" ? "Smart Case Routing" : "Smart Case Routing",
                status: "Live in Production",
                statusColor: "text-[#0073FC]",
                desc:
                  language === "ID"
                    ? "Membagi antrean spesimen kompleks secara otomatis berdasarkan kompetensi sub-spesialis dan kapasitas waktu nyata dokter Sp.PK."
                    : "Distributes complex cases automatically based on subspecialty expertise and real-time pathologist queue capacity.",
              },
              {
                icon: BarChart3,
                title: language === "ID" ? "Analitik Operasional Percakapan" : "Conversational Lab Analytics",
                status: "Q2 2026",
                statusColor: "text-slate-500",
                desc:
                  language === "ID"
                    ? "Ajukan pertanyaan bahasa natural untuk melacak bottleneck TAT, lonjakan sampel IGD, hingga prediksi keterlambatan rilis."
                    : "Query turnaround-time bottlenecks, ER volume surges, and release delay predictions using plain natural language.",
              },
            ].map((cap) => {
              const CapIcon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="rounded-[24px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-[0_6px_20px_-10px_rgba(15,23,42,0.05)] hover:border-blue-200/80 transition-colors flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-11 w-11 rounded-2xl bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                      <CapIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base sm:text-[17px] font-bold text-slate-900 leading-snug">
                        {cap.title}
                      </h3>
                      <span className={cn("text-xs font-semibold block mt-0.5", cap.statusColor)}>
                        {cap.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal">
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CLINICAL PATHOLOGY WORKSTATION (#workstation-demo)
          ══════════════════════════════════════════════════════════════ */}
      <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="max-w-2xl">
              <div className="mb-3.5">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Simulasi Meja Kerja Patologi Klinik" : "Pathologist Workstation Simulation"}
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
                ? "Pilih profil spesimen klinis di bawah untuk melihat kalkulasi delta-check longitudinal, penandaan deviasi, dan draf narasi medis siap sah."
                : "Select a clinical specimen profile below to inspect longitudinal delta-checks, deviation flags, and structured clinical drafts ready for sign-off."}
            </p>
          </div>

          {/* Clean Segmented Tab Buttons */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-7">
            {profiles.map((p, idx) => {
              const isActive = selectedProfileIdx === idx;
              const isDone = authorizedProfiles[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfileIdx(idx)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#0073FC] text-white border-[#0073FC] shadow-[0_4px_14px_-3px_rgba(0,115,252,0.45)]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  )}
                >
                  {p.isPanicValue && !isActive ? (
                    <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                  ) : (
                    <Activity className={cn("h-4 w-4", isActive ? "text-white" : "text-[#0073FC]")} />
                  )}
                  <span>{language === "ID" ? p.tabLabel : p.tabLabelEn}</span>
                  {isDone && (
                    <CheckCheck className={cn("h-4 w-4", isActive ? "text-blue-100" : "text-emerald-600")} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Clinical Pathology Workstation Card */}
          <div className="rounded-[24px] sm:rounded-[30px] border border-slate-200/90 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] overflow-hidden">
            {/* Header: Patient & Specimen Medical Context */}
            <div className="bg-[#FAFBFD] border-b border-slate-200 px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    {language === "ID" ? "No. Spesimen" : "Specimen No."}
                  </span>
                  <span className="font-mono font-bold text-[#0073FC]">{currentProfile.specimenNo}</span>
                </div>
                <div className="h-7 w-[1px] bg-slate-200 hidden sm:block" />
                <div>
                  <span className="font-bold text-slate-900 block">{currentProfile.patientName}</span>
                  <span className="text-slate-500 text-xs font-normal">
                    {language === "ID" ? currentProfile.patientAgeGender : currentProfile.patientAgeGenderEn}
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-slate-200 hidden md:block" />
                <div className="hidden md:block">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    {language === "ID" ? "Ruangan Rawat" : "Ward"}
                  </span>
                  <span className="text-slate-700 text-xs font-medium">
                    {language === "ID" ? currentProfile.ward : currentProfile.wardEn}
                  </span>
                </div>
                <div className="h-7 w-[1px] bg-slate-200 hidden lg:block" />
                <div className="hidden lg:block">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                    {language === "ID" ? "Dokter Pengirim (DPJP)" : "Attending DPJP"}
                  </span>
                  <span className="text-slate-700 text-xs font-medium">{currentProfile.attendingDoc}</span>
                </div>
              </div>

              {/* Status Verification Pill */}
              <div className="flex items-center gap-2">
                {isAuthorized ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    <span>{language === "ID" ? "Disahkan Dokter Sp.PK (E-Sign Valid)" : "Authorized by Pathologist (E-Sign)"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-slate-700 text-xs font-medium border border-slate-200 shadow-2xs">
                    <span className={cn("h-2 w-2 rounded-full", currentProfile.isPanicValue ? "bg-rose-500" : "bg-amber-500")} />
                    <span>{language === "ID" ? "Menunggu Review Dokter Sp.PK" : "Pending Pathologist Review"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Body: Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 items-stretch">
              {/* Left Column: Analyte Telemetry & Delta Comparison */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-5">
                  {/* Analyte Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      {currentProfile.analyteCode}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold px-3 py-1 rounded-full border",
                        currentProfile.isPanicValue
                          ? "bg-rose-50 text-rose-700 border-rose-200/80"
                          : "bg-[#EBF3FE] text-[#0073FC] border-blue-200/60"
                      )}
                    >
                      {language === "ID" ? currentProfile.statusLabel : currentProfile.statusLabelEn}
                    </span>
                  </div>

                  {/* Primary Numeric Readout */}
                  <div className="space-y-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {language === "ID" ? currentProfile.parameterName : currentProfile.parameterNameEn}
                    </h3>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span
                        className={cn(
                          "font-mono text-4xl sm:text-5xl font-bold tracking-tight tabular-nums",
                          currentProfile.isPanicValue ? "text-rose-600" : "text-[#0073FC]"
                        )}
                      >
                        {currentProfile.currentValue}
                      </span>
                      <span className="text-base font-semibold text-slate-500 font-mono">
                        {currentProfile.unit}
                      </span>
                    </div>
                  </div>

                  {/* Visual Reference Range Gauge */}
                  <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-500">
                        {language === "ID" ? "Rentang Rujukan Normal:" : "Normal Reference Range:"}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{currentProfile.refInterval}</span>
                    </div>
                    <div className="relative h-2 w-full rounded-full bg-slate-200/80 overflow-visible">
                      <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/25 rounded-full" />
                      <div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-all duration-300",
                          currentProfile.isPanicValue ? "bg-rose-600" : "bg-[#0073FC]",
                          currentProfile.isDeltaDrop ? "left-[10%]" : "left-[86%]"
                        )}
                      />
                    </div>
                  </div>

                  {/* Longitudinal Delta-Check Card */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5 text-[#0073FC]">
                        <TrendingUp className="h-4 w-4" />
                        {language === "ID" ? "Komparasi Riwayat Pasien:" : "Historical Comparison:"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {language === "ID" ? currentProfile.prevTimestamp : currentProfile.prevTimestampEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 text-xs">
                      <div className="text-slate-600">
                        {language === "ID" ? "Baseline Sebelumnya:" : "Previous Baseline:"}{" "}
                        <strong className="font-mono font-bold text-slate-900">{currentProfile.prevValue}</strong>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 font-mono font-bold px-2.5 py-1 rounded-lg border",
                          currentProfile.isPanicValue
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-900 border-slate-200"
                        )}
                      >
                        {currentProfile.isDeltaDrop ? (
                          <TrendingDown className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingUp className="h-3.5 w-3.5" />
                        )}
                        <span>{currentProfile.deltaText} ({currentProfile.deltaPercent})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-normal flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>{language === "ID" ? "Verifikasi Otomatis Analyzer" : "Analyzer Auto-Verification"}</span>
                  <span className="font-mono font-semibold text-slate-600">ASTM E1381</span>
                </div>
              </div>

              {/* Kolom Kanan: Draf Catatan Interpretasi Patologi (Format Lembar Medis Rapi) */}
              <div className="lg:col-span-7 p-6 sm:p-8 bg-[#FAFBFD] flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Header Panel */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-[#0073FC]">
                      <Stethoscope className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {language === "ID" ? "Draf Hasil Verifikasi Patologi Klinik" : "Pathology Clinical Interpretation Draft"}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      CDSS ENGINE v2.4
                    </span>
                  </div>

                  {/* Format Lembar Catatan Klinis Terpadu */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                    {/* 1. Kesan Patologi */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#0073FC] uppercase tracking-wider block">
                        {language === "ID" ? "1. Kesan Patologi (Clinical Impression)" : "1. Clinical Impression"}
                      </span>
                      <p className="text-sm sm:text-[15px] text-slate-800 leading-relaxed font-normal">
                        &ldquo;{language === "ID" ? currentProfile.clinicalImpression : currentProfile.clinicalImpressionEn}&rdquo;
                      </p>
                    </div>

                    <div className="h-[1px] w-full bg-slate-100" />

                    {/* 2. Rekomendasi Korelasi */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {language === "ID" ? "2. Rekomendasi Korelasi Tambahan" : "2. Correlative Recommendation"}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {language === "ID" ? currentProfile.clinicalRecommendation : currentProfile.clinicalRecommendationEn}
                      </p>
                    </div>
                  </div>

                  {/* Status Notifikasi Terkirim */}
                  {isAlertSent && (
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-800 flex items-center gap-2.5">
                      <BellRing className="h-4 w-4 text-[#0073FC] shrink-0" />
                      <span>
                        {language === "ID"
                          ? `Notifikasi Nilai Kritis telah disiarkan ke WhatsApp & SIMRS ${currentProfile.attendingDoc} (KARS SKP 2.2).`
                          : `Critical value notification dispatched to ${currentProfile.attendingDoc}'s EMR and mobile (KARS SKP 2.2).`}
                      </span>
                    </div>
                  )}

                  {/* Status E-Sign Berhasil */}
                  {isAuthorized && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block font-semibold">
                          {language === "ID" ? "Laporan Laboratorium Resmi Disahkan" : "Official Laboratory Report Authorized"}
                        </strong>
                        <span className="text-emerald-700 text-[11px]">
                          {language === "ID"
                            ? "Ditandatangani secara elektronik oleh dr. Sp.PK • Tersertifikasi BSrE & Rilis ke SIMRS"
                            : "Digitally signed by Attending Clinical Pathologist • BSrE Certified & Released to EMR"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Dokter */}
                <div className="pt-4 border-t border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleAuthorize}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]",
                        isAuthorized
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                          : "bg-[#0073FC] hover:bg-[#0061D6] text-white shadow-[0_4px_14px_-3px_rgba(0,115,252,0.45)]"
                      )}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      <span>
                        {isAuthorized
                          ? language === "ID" ? "Batalkan Pengesahan" : "Revoke Authorization"
                          : language === "ID" ? "Sahkan Hasil & E-Sign" : "Authorize & Digital E-Sign"}
                      </span>
                    </button>

                    {currentProfile.isPanicValue && (
                      <button
                        type="button"
                        onClick={handleDispatchAlert}
                        disabled={isAlertSent}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all border cursor-pointer active:scale-[0.98]",
                          isAlertSent
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <BellRing className="h-4 w-4 text-[#0073FC]" />
                        <span>
                          {isAlertSent
                            ? language === "ID" ? "Notifikasi Terkirim" : "Notification Sent"
                            : language === "ID" ? "Kirim Notifikasi DPJP" : "Notify DPJP"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleResetProfile}
                      title={language === "ID" ? "Atur Ulang Status" : "Reset Status"}
                      className="p-3 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-normal">
                    {language === "ID"
                      ? "Interaksi simulasi: Klik tombol di atas untuk menguji pengesahan E-Sign dokter dan transmisi alert darurat."
                      : "Simulation interactive: Click above to test pathologist e-sign authorization and critical panic alert dispatch."}
                  </p>
                </div>
              </div>
            </div>
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

          {/* 2x2 Asymmetrical Bento Showcase (Matches Modules Page Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* BENTO 1 (Wide Left - 7 cols): Ekstraksi Requisisi OCR + LLM */}
            <div className="lg:col-span-7 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Ekstraksi Requisisi OCR + LLM" : "AI-Powered Requisition Extraction"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Konversi formulir permintaan fisik ke order digital dengan deteksi mismatch otomatis."
                    : "OCR + LLM extraction of paper requisitions with automated specimen mismatch detection."}
                </p>
              </div>

              {/* Visual: Workflow Node Flow */}
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                {/* Left Core Hub Node */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0073FC] text-white shadow-[0_8px_20px_-4px_rgba(0,115,252,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <ScanText className="h-7 w-7 stroke-[2]" />
                </div>

                {/* Connector Lines (Desktop) */}
                <svg
                  className="hidden sm:block w-14 h-[212px] shrink-0 text-slate-300"
                  viewBox="0 0 56 212"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 106 C24 106, 24 27, 56 27" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 106 L56 106" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 106 C24 106, 24 188, 56 188" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                {/* Right Stacked Branch Cards */}
                <div className="w-full sm:w-[320px] space-y-3">
                  {/* Top Branch */}
                  <div className="rounded-xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {language === "ID" ? "Formulir Pengantar RS #409" : "Paper Requisition #409"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {language === "ID" ? "Tulisan Tangan & PDF Terbaca" : "Handwriting & PDF Parsed"}
                      </p>
                    </div>
                  </div>

                  {/* Center Branch */}
                  <div className="rounded-xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Identitas & DPJP" : "Patient & DPJP"}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Cocok ✓
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Panel Pemeriksaan" : "Test Panels"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">CBC + Cr + HbA1c</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Validasi Jenis Tabung" : "Specimen Tube Check"}
                      </span>
                      <span className="text-[10px] font-semibold text-[#0073FC]">EDTA + SST</span>
                    </div>
                  </div>

                  {/* Bottom Branch */}
                  <div className="rounded-xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {language === "ID" ? "Flag Mismatch Pra-Analitik" : "Pre-Analytical Mismatch Flag"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO 2 (Narrow Right - 5 cols): Hands-Free Voice & Delta Engine */}
            <div className="lg:col-span-5 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Entri Hasil Bebas Genggam (Voice AI)" : "Hands-Free Voice Result Entry"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Dikte temuan klinis speech-to-text dengan pengisian template otomatis."
                    : "AI-powered speech-to-text dictation with context-aware template autofill."}
                </p>
              </div>

              {/* Visual: Voice Waveform + Auto-filled Fields (LigoLab Reference) */}
              <div className="mt-auto rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                {/* Mic + Waveform Pill */}
                <div className="flex items-center gap-3 rounded-xl bg-[#F4F8FF] border border-blue-100/80 px-3.5 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0073FC] text-white flex items-center justify-center shrink-0 shadow-[0_4px_12px_-2px_rgba(0,115,252,0.45)]">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 flex-1 justify-center h-6">
                    {[12, 20, 10, 24, 16, 22, 14, 24, 18, 12, 20, 14, 22, 16, 10].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-[#0073FC]/80 group-hover:bg-[#0073FC] transition-colors"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0073FC] shrink-0">LIVE</span>
                </div>

                {/* Auto-filled Diagnosis & Specimen */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === "ID" ? "KESAN KLINIS" : "IMPRESSION"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800 block mt-0.5 truncate">
                      Anemia Normositik
                    </span>
                  </div>
                  <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === "ID" ? "SPESIMEN" : "SPECIMEN"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-800 block mt-0.5 truncate">
                      Darah EDTA • Sentral
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO 3 (Narrow Left - 5 cols): Pre-Signout Review & ICD-10 Consistency */}
            <div className="lg:col-span-5 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Review Pra-Otorisasi & Terminologi" : "Pre-Signout Review & Reporting"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Mendeteksi inkonsistensi istilah medis & pembaruan kode ICD-10/LOINC."
                    : "Flags terminology inconsistencies & auto-updates ICD-10/LOINC codes."}
                </p>
              </div>

              {/* Visual: Pre-Signout Terminology Auto-Correction Widget (LigoLab Reference) */}
              <div className="mt-auto rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-[#FAFBFD] px-3.5 py-2.5">
                  <span className="text-xs font-mono font-medium text-slate-700">Anemia normosi</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {language === "ID" ? "Periksa" : "Check"}
                  </span>
                </div>

                {/* Blue Sparkle Suggestion Pill */}
                <div className="rounded-xl bg-[#0073FC] text-white px-4 py-3 shadow-[0_10px_24px_-8px_rgba(0,115,252,0.5)] flex items-center gap-2.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                  <Sparkles className="h-4 w-4 text-blue-100 shrink-0" />
                  <p className="text-[11px] sm:text-xs font-medium leading-snug">
                    {language === "ID"
                      ? "Maksud Anda 'Anemia Normositik'? Kode ICD-10 D64.9 diperbarui."
                      : "Did you mean 'Normocytic Anemia'? ICD-10 D64.9 updated."}
                  </p>
                </div>
              </div>
            </div>

            {/* BENTO 4 (Wide Right - 7 cols): Smart Case Routing & Beban Kerja Sp.PK */}
            <div className="lg:col-span-7 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Smart Case Routing & Antrean Sp.PK" : "Smart Case Routing & Workload Balance"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Distribusi kasus kompleks berdasarkan sub-spesialisasi dan beban antrean dokter."
                    : "Automated case distribution balanced by subspecialty and real-time pathologist queues."}
                </p>
              </div>

              {/* Visual: Connected Routing Flow */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                {/* Left 2 Input Signal Cards */}
                <div className="w-full sm:w-[42%] space-y-3">
                  <div className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-1.5 group-hover:-translate-x-0.5 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#EBF3FE] text-[#2764B8] flex items-center justify-center shrink-0">
                        <TrendingUp className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {language === "ID" ? "Skor Kompleksitas" : "Case Complexity"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {language === "ID" ? "Delta Akut • Nilai Kritis" : "Acute Delta • Critical Flag"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-1.5 group-hover:-translate-x-0.5 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {language === "ID" ? "Kapasitas Antrean" : "Queue Capacity"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {language === "ID" ? "Target TAT IGD < 30m" : "ER TAT Target < 30m"}
                    </p>
                  </div>
                </div>

                {/* Connector SVG */}
                <svg
                  className="hidden sm:block w-12 h-32 shrink-0 text-slate-300"
                  viewBox="0 0 48 128"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M0 30 C22 30, 22 64, 48 64" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M0 98 C22 98, 22 64, 48 64" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                {/* Right Unified Pathologist Queue Card */}
                <div className="w-full sm:w-[46%] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === "ID" ? "Distribusi Dokter Sp.PK" : "Pathologist Routing"}
                  </p>

                  {[
                    {
                      icon: Stethoscope,
                      title: "dr. Hendra, Sp.PK",
                      tag: "32% Load",
                    },
                    {
                      icon: Stethoscope,
                      title: "dr. Ratna, Sp.PK",
                      tag: "28% Load",
                    },
                    {
                      icon: BadgeCheck,
                      title: language === "ID" ? "Prioritas Kritis IGD" : "ER Critical Fast-Track",
                      tag: "< 15m",
                    },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-center justify-between gap-2 py-1.5 border-t border-slate-100 first:border-t-0 first:pt-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                            <ItemIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#0073FC] bg-[#EBF3FE] px-2 py-0.5 rounded-full shrink-0">
                          {item.tag}
                        </span>
                      </div>
                    );
                  })}
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
