"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  Eye,
  BrainCircuit,
  Zap,
  UserCheck,
  ShieldAlert,
  Activity,
  FileText,
  Clock,
  Lock,
  Stethoscope,
  TrendingUp,
  AlertTriangle,
  BadgeCheck,
  BellRing,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Database,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { novaAIDisclaimer } from "@/content/nova-ai";

interface LabParameter {
  name: string;
  code: string;
  value: string;
  unit: string;
  reference: string;
  baseline: string;
  baselineTime: string;
  baselineTimeEn: string;
  delta: string;
  deltaPercent: string;
  status: "normal" | "warning" | "critical";
  statusLabel: string;
  statusLabelEn: string;
}

interface ClinicalCase {
  id: string;
  category: string;
  categoryEn: string;
  specimenId: string;
  patientName: string;
  patientDemographics: string;
  patientDemographicsEn: string;
  department: string;
  departmentEn: string;
  physician: string;
  analyzer: string;
  testTime: string;
  testTimeEn: string;
  parameters: LabParameter[];
  deltaFinding: string;
  deltaFindingEn: string;
  clinicalNarrative: string;
  clinicalNarrativeEn: string;
  recommendedAction: string;
  recommendedActionEn: string;
  isPanicValue: boolean;
}

export default function NovaAIPage() {
  const { language } = useLanguage();
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [verifiedCases, setVerifiedCases] = useState<Record<string, boolean>>({});
  const [alertSentCases, setAlertSentCases] = useState<Record<string, boolean>>({});

  const clinicalCases: ClinicalCase[] = [
    {
      id: "cbc-anemia",
      category: "Hematologi",
      categoryEn: "Hematology",
      specimenId: "HEM-2026-9481",
      patientName: "Tn. Hendra Wijaya",
      patientDemographics: "54 Th • Laki-laki • RM: #0849201",
      patientDemographicsEn: "54 Y • Male • MRN: #0849201",
      department: "Rawat Inap Bedah (Kamar 304B)",
      departmentEn: "Inpatient Surgical Ward (Room 304B)",
      physician: "dr. Bambang Sp.B, Subsp.BD",
      analyzer: "Sysmex XN-1000 Automated Hematology",
      testTime: "Hari ini, 08:42 WIB",
      testTimeEn: "Today, 08:42 WIB",
      parameters: [
        {
          name: "Hemoglobin (Hb)",
          code: "LOINC 718-7",
          value: "8.4",
          unit: "g/dL",
          reference: "13.0 - 17.5",
          baseline: "10.5",
          baselineTime: "3 hari lalu",
          baselineTimeEn: "3 days ago",
          delta: "-2.1",
          deltaPercent: "-20.0%",
          status: "warning",
          statusLabel: "Rendah (Delta Alert)",
          statusLabelEn: "Low (Delta Alert)",
        },
        {
          name: "Hematokrit (Ht)",
          code: "LOINC 4544-3",
          value: "25.8",
          unit: "%",
          reference: "40.0 - 52.0",
          baseline: "32.1",
          baselineTime: "3 hari lalu",
          baselineTimeEn: "3 days ago",
          delta: "-6.3",
          deltaPercent: "-19.6%",
          status: "warning",
          statusLabel: "Rendah",
          statusLabelEn: "Low",
        },
        {
          name: "Leukosit (WBC)",
          code: "LOINC 6690-2",
          value: "11.200",
          unit: "/µL",
          reference: "4.500 - 11.000",
          baseline: "9.400",
          baselineTime: "3 hari lalu",
          baselineTimeEn: "3 days ago",
          delta: "+1.800",
          deltaPercent: "+19.1%",
          status: "normal",
          statusLabel: "Normal-Batas Atas",
          statusLabelEn: "Normal-Upper",
        },
        {
          name: "Trombosit (PLT)",
          code: "LOINC 777-3",
          value: "245.000",
          unit: "/µL",
          reference: "150.000 - 450.000",
          baseline: "238.000",
          baselineTime: "3 hari lalu",
          baselineTimeEn: "3 days ago",
          delta: "+7.000",
          deltaPercent: "+2.9%",
          status: "normal",
          statusLabel: "Normal",
          statusLabelEn: "Normal",
        },
      ],
      deltaFinding:
        "Penurunan Hb akut > 20% dalam 72 jam terdeteksi (Delta Check Alert). Deviasi melampaui batas variabilitas analitis wajar instrumen.",
      deltaFindingEn:
        "Acute Hb decline > 20% in 72h flagged (Delta Check Alert). Deviation significantly exceeds baseline analytical variability.",
      clinicalNarrative:
        "Anemia normositik normokromik dengan pergeseran delta akut pasca-tindakan. Disarankan konfirmasi adanya perdarahan internal aktif tersembunyi atau hemodilusi cairan.",
      clinicalNarrativeEn:
        "Normocytic normochromic anemia presenting with acute post-procedure delta shift. Recommend ruling out occult gastrointestinal blood loss or fluid hemodilution.",
      recommendedAction:
        "Evaluasi feses lengkap, pantau tanda vital ketat, dan pertimbangkan transfusi PRC bila Hb < 8.0 g/dL.",
      recommendedActionEn:
        "Evaluate occult stool blood, maintain tight hemodynamic monitoring, and consider PRC transfusion if Hb drops < 8.0 g/dL.",
      isPanicValue: false,
    },
    {
      id: "renal-aki",
      category: "Kimia Klinik",
      categoryEn: "Clinical Chemistry",
      specimenId: "CHM-2026-4421",
      patientName: "Ny. Ratna Suminar",
      patientDemographics: "62 Th • Perempuan • RM: #0912443",
      patientDemographicsEn: "62 Y • Female • MRN: #0912443",
      department: "ICU / Rawat Intensif (Bed 02)",
      departmentEn: "ICU / Intensive Care Unit (Bed 02)",
      physician: "dr. Cynthia Sp.PD-KGH",
      analyzer: "Roche Cobas 6000 c501 Chemistry",
      testTime: "Hari ini, 09:15 WIB",
      testTimeEn: "Today, 09:15 WIB",
      parameters: [
        {
          name: "Serum Kreatinin",
          code: "LOINC 2160-0",
          value: "2.85",
          unit: "mg/dL",
          reference: "0.50 - 1.10",
          baseline: "1.10",
          baselineTime: "2 hari lalu",
          baselineTimeEn: "2 days ago",
          delta: "+1.75",
          deltaPercent: "+159.1%",
          status: "critical",
          statusLabel: "Tinggi - Risiko AKI",
          statusLabelEn: "Critical - AKI Risk",
        },
        {
          name: "Ureum / BUN",
          code: "LOINC 3094-0",
          value: "78",
          unit: "mg/dL",
          reference: "15 - 45",
          baseline: "34",
          baselineTime: "2 hari lalu",
          baselineTimeEn: "2 days ago",
          delta: "+44",
          deltaPercent: "+129.4%",
          status: "critical",
          statusLabel: "Azotemia",
          statusLabelEn: "Azotemia",
        },
        {
          name: "eGFR (CKD-EPI)",
          code: "LOINC 33914-3",
          value: "18",
          unit: "mL/min/1.73m²",
          reference: "> 60",
          baseline: "58",
          baselineTime: "2 hari lalu",
          baselineTimeEn: "2 days ago",
          delta: "-40",
          deltaPercent: "-69.0%",
          status: "critical",
          statusLabel: "Penurunan Akut",
          statusLabelEn: "Acute Decline",
        },
        {
          name: "Kalium Serum (K+)",
          code: "LOINC 2823-3",
          value: "5.1",
          unit: "mEq/L",
          reference: "3.5 - 5.1",
          baseline: "4.2",
          baselineTime: "2 hari lalu",
          baselineTimeEn: "2 days ago",
          delta: "+0.9",
          deltaPercent: "+21.4%",
          status: "warning",
          statusLabel: "Batas Atas",
          statusLabelEn: "Borderline High",
        },
      ],
      deltaFinding:
        "Peningkatan serum kreatinin > 100% dari baseline dalam 48 jam memenuhi kriteria KDIGO Stage 2 Acute Kidney Injury (AKI).",
      deltaFindingEn:
        "Serum creatinine elevation > 100% from baseline in 48h satisfies KDIGO Stage 2 Acute Kidney Injury (AKI) diagnostic threshold.",
      clinicalNarrative:
        "Insufisiensi ginjal akut (AKI) tipe prerenal vs renal aktif disertai retensi nitrogen bermakna. Waspada akumulasi metabolit toksik dan gangguan elektrolit sekunder.",
      clinicalNarrativeEn:
        "Acute kidney injury (KDIGO 2) with pronounced azotemia. Strongly indicative of prerenal hypoperfusion vs acute parenchymal insult.",
      recommendedAction:
        "Tinjau ulang dosis obat nefrotoksik/antibiotik, optimasi status hidrasi, dan monitor kalium serial secara berkala.",
      recommendedActionEn:
        "Review nephrotoxic medications and antibiotic dosing, optimize fluid resuscitation, and monitor serial serum potassium.",
      isPanicValue: true,
    },
    {
      id: "diabetes-hyper",
      category: "Metabolik",
      categoryEn: "Metabolic Panel",
      specimenId: "CHM-2026-6730",
      patientName: "Tn. Agus Darmawan",
      patientDemographics: "48 Th • Laki-laki • RM: #0771892",
      patientDemographicsEn: "48 Y • Male • MRN: #0771892",
      department: "Poli Penyakit Dalam (Rawat Jalan)",
      departmentEn: "Internal Medicine Outpatient Clinic",
      physician: "dr. Hendro Sp.PD-KEMD",
      analyzer: "Beckman Coulter AU5800 Analyzer",
      testTime: "Hari ini, 10:05 WIB",
      testTimeEn: "Today, 10:05 WIB",
      parameters: [
        {
          name: "Glukosa Darah Puasa (GDP)",
          code: "LOINC 1558-6",
          value: "248",
          unit: "mg/dL",
          reference: "70 - 100",
          baseline: "142",
          baselineTime: "1 bulan lalu",
          baselineTimeEn: "1 month ago",
          delta: "+106",
          deltaPercent: "+74.6%",
          status: "warning",
          statusLabel: "Hiperglikemia Tinggi",
          statusLabelEn: "Marked Hyperglycemia",
        },
        {
          name: "HbA1c Terstandar",
          code: "LOINC 4548-4",
          value: "9.8",
          unit: "%",
          reference: "< 5.7",
          baseline: "7.6",
          baselineTime: "3 bulan lalu",
          baselineTimeEn: "3 months ago",
          delta: "+2.2",
          deltaPercent: "+28.9%",
          status: "critical",
          statusLabel: "Tidak Terkontrol",
          statusLabelEn: "Uncontrolled",
        },
        {
          name: "Glukosa Urin Kualitatif",
          code: "LOINC 2349-9",
          value: "+++ (Positif 3)",
          unit: "derajat",
          reference: "Negatif",
          baseline: "+ (Positif 1)",
          baselineTime: "1 bulan lalu",
          baselineTimeEn: "1 month ago",
          delta: "+2 tingkat",
          deltaPercent: "Naik",
          status: "warning",
          statusLabel: "Glukosuria Berat",
          statusLabelEn: "Glucosuria +3",
        },
        {
          name: "Keton Urin",
          code: "LOINC 2514-8",
          value: "Negatif",
          unit: "kualitatif",
          reference: "Negatif",
          baseline: "Negatif",
          baselineTime: "1 bulan lalu",
          baselineTimeEn: "1 month ago",
          delta: "0",
          deltaPercent: "Stabil",
          status: "normal",
          statusLabel: "Normal (Non-KAD)",
          statusLabelEn: "Normal (Non-DKA)",
        },
      ],
      deltaFinding:
        "Lonjakan GDP sebesar +74.6% disertai HbA1c 9.8% menunjukkan dekompensasi glikemik subakut yang membutuhkan penyesuaian terapi.",
      deltaFindingEn:
        "Fasting glucose elevation of +74.6% with HbA1c at 9.8% indicates marked subacute glycemic decompensation requiring therapeutic escalation.",
      clinicalNarrative:
        "Diabetes Melitus Tipe 2 tidak terkontrol dengan glukosuria bermakna. Hasil keton negatif menyingkirkan komplikasi ketoasidosis diabetikum (KAD) saat ini.",
      clinicalNarrativeEn:
        "Uncontrolled Type 2 Diabetes Mellitus with prominent glucosuria. Negative urine ketones presently exclude diabetic ketoacidosis.",
      recommendedAction:
        "Pertimbangkan intensifikasi terapi insulin basal atau kombinasi OAD, evaluasi kepatuhan diet, dan jadwalkan kontrol ulang 4 minggu.",
      recommendedActionEn:
        "Consider treatment escalation (basal insulin or dual oral therapy), reinforce dietary adherence, and schedule follow-up in 4 weeks.",
      isPanicValue: false,
    },
    {
      id: "plt-panic",
      category: "Hemostasis / Kritis",
      categoryEn: "Hemostasis / Critical",
      specimenId: "HEM-2026-0042",
      patientName: "An. Salsabila Putri",
      patientDemographics: "9 Th • Perempuan • RM: #1002341",
      patientDemographicsEn: "9 Y • Female • MRN: #1002341",
      department: "IGD & Resusitasi Pediatrik",
      departmentEn: "Pediatric Emergency & Resuscitation",
      physician: "dr. Maya Sp.A, Subsp.Hem",
      analyzer: "Sysmex XN-550 Automated Analyzer",
      testTime: "Hari ini, 10:28 WIB",
      testTimeEn: "Today, 10:28 WIB",
      parameters: [
        {
          name: "Trombosit (Platelet)",
          code: "LOINC 777-3",
          value: "14.000",
          unit: "/µL",
          reference: "150.000 - 450.000",
          baseline: "88.000",
          baselineTime: "Kemarin sore",
          baselineTimeEn: "Yesterday evening",
          delta: "-74.000",
          deltaPercent: "-84.1%",
          status: "critical",
          statusLabel: "NILAI KRITIS (PANIC)",
          statusLabelEn: "CRITICAL PANIC VALUE",
        },
        {
          name: "Hemoglobin (Hb)",
          code: "LOINC 718-7",
          value: "11.8",
          unit: "g/dL",
          reference: "11.5 - 15.5",
          baseline: "12.0",
          baselineTime: "Kemarin sore",
          baselineTimeEn: "Yesterday evening",
          delta: "-0.2",
          deltaPercent: "-1.7%",
          status: "normal",
          statusLabel: "Normal",
          statusLabelEn: "Normal",
        },
        {
          name: "Hematokrit (Ht)",
          code: "LOINC 4544-3",
          value: "35.4",
          unit: "%",
          reference: "34.0 - 44.0",
          baseline: "36.0",
          baselineTime: "Kemarin sore",
          baselineTimeEn: "Yesterday evening",
          delta: "-0.6",
          deltaPercent: "-1.7%",
          status: "normal",
          statusLabel: "Normal",
          statusLabelEn: "Normal",
        },
        {
          name: "Leukosit (WBC)",
          code: "LOINC 6690-2",
          value: "3.200",
          unit: "/µL",
          reference: "4.500 - 13.500",
          baseline: "4.100",
          baselineTime: "Kemarin sore",
          baselineTimeEn: "Yesterday evening",
          delta: "-900",
          deltaPercent: "-22.0%",
          status: "warning",
          statusLabel: "Leukopenia Ringan",
          statusLabelEn: "Mild Leukopenia",
        },
      ],
      deltaFinding:
        "NILAI KRITIS DARURAT (Panic Value PLT < 20.000/µL): Penurunan tajam 84% dalam 18 jam. Wajib pelaporan darurat KARS SKP 2.2 dalam waktu < 15 menit ke DPJP.",
      deltaFindingEn:
        "CRITICAL EMERGENCY PANIC VALUE (PLT < 20,000/µL): Precipitous 84% plunge in 18h. Mandatory KARS SKP 2.2 panic notification < 15 mins to ER DPJP.",
      clinicalNarrative:
        "Trombositopenia berat akut curiga Dengue Shock Syndrome (DSS) fase kritis atau ITP akut. Pasien berisiko tinggi mengalami spontaneous bleeding dan kebocoran plasma.",
      clinicalNarrativeEn:
        "Severe acute thrombocytopenia concerning for Dengue Hemorrhagic Fever critical phase or acute ITP. Critical risk of spontaneous intracranial/internal hemorrhage.",
      recommendedAction:
        "SEGERA HUBUNGI DPJP IGD. Siapkan crossmatch konsentrat trombosit (TC) darurat dan lakukan verifikasi apusan darah tepi (ADT) konfirmasi.",
      recommendedActionEn:
        "DISPATCH IMMEDIATE CRITICAL ALERT TO ER PHYSICIAN. Prepare emergency platelet concentrate crossmatch and confirm with peripheral blood smear review.",
      isPanicValue: true,
    },
  ];

  const currentCase = clinicalCases[selectedCaseIdx];
  const isCurrentVerified = verifiedCases[currentCase.id];
  const isCurrentAlertSent = alertSentCases[currentCase.id];

  const handleVerify = () => {
    setVerifiedCases((prev) => ({
      ...prev,
      [currentCase.id]: !prev[currentCase.id],
    }));
  };

  const handleSendAlert = () => {
    setAlertSentCases((prev) => ({
      ...prev,
      [currentCase.id]: true,
    }));
  };

  const handleReset = () => {
    setVerifiedCases((prev) => ({
      ...prev,
      [currentCase.id]: false,
    }));
    setAlertSentCases((prev) => ({
      ...prev,
      [currentCase.id]: false,
    }));
  };

  const workflowSteps = [
    {
      step: "01",
      phase: language === "ID" ? "Ingesti Data & Interfacing" : "Ingestion & Interfacing",
      title: language === "ID" ? "Koneksi Dua Arah Instrumen Analyzer" : "Bi-Directional Analyzer Ingestion",
      specs: "ASTM E1381 • HL7 v2 / FHIR",
      description:
        language === "ID"
          ? "Nova AI menerima hasil uji langsung dari instrumen hematologi, kimia klinik, dan imunologi secara real-time tanpa campur tangan pengetikan manual, mengeliminasi risiko salah input sampel."
          : "Nova AI captures raw results directly from hematology, chemistry, and immunoassay instruments in real time without manual rekeying, eliminating transcription error risks.",
      icon: Database,
    },
    {
      step: "02",
      phase: language === "ID" ? "Kalkulasi Delta-Check" : "Delta-Check Engine",
      title: language === "ID" ? "Analisis Deviasi Riwayat Longitudinal" : "Longitudinal Historical Variance",
      specs: "Statistical Z-Score • Patient Delta Rules",
      description:
        language === "ID"
          ? "Sistem membandingkan nilai terkini dengan rekam jejak pemeriksaan pasien terdahulu secara serial, mendeteksi anomali tren akut yang terlewatkan bila hanya melihat batas acuan populasi umum."
          : "The engine compares current readings against the patient's individual historical baselines, spotting acute longitudinal deviations that boundary ranges alone frequently miss.",
      icon: TrendingUp,
    },
    {
      step: "03",
      phase: language === "ID" ? "Sintesis & Triage Darurat" : "Synthesis & Emergency Triage",
      title: language === "ID" ? "Draf Narasi Klinis & Alert Nilai Kritis" : "Clinical Narrative & Panic Alert",
      specs: "KARS SKP 2.2 • LOINC & SNOMED-CT",
      description:
        language === "ID"
          ? "Menghasilkan draf interpretasi berbobot medis dan secara instan memicu eskalasi nilai kritis (Panic Values) ke WhatsApp / SIMRS dokter jaga dan DPJP dalam waktu kurang dari 15 menit."
          : "Synthesizes structured clinical briefings and immediately triggers critical panic value alerts to attending physicians via WhatsApp and hospital EMR in under 15 minutes.",
      icon: Zap,
    },
    {
      step: "04",
      phase: language === "ID" ? "Validasi Dokter Sp.PK" : "Pathologist Sign-Off",
      title: language === "ID" ? "Otorisasi Mutlak & Tanda Tangan Digital" : "Absolute Authority & Cryptographic E-Sign",
      specs: "100% Human-in-the-Loop • BSrE Compliant",
      description:
        language === "ID"
          ? "Dokter Penanggung Jawab mengevaluasi, mengedit, dan menandatangani lembar hasil secara digital. Nova AI tidak pernah merilis diagnosis mandiri tanpa persetujuan dokter."
          : "Attending Pathologists evaluate, adjust, and digitally sign the finalized report. Nova AI never releases autonomous diagnoses or prescriptions without physician approval.",
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PageHero (Standardized Clinical SaaS Aesthetic)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Clinical Decision Support System (CDSS)" : "Clinical Decision Support System (CDSS)"}
        title={
          language === "ID" ? (
            <>
              Asisten Analitis Laboratorium.{" "}
              <br className="hidden sm:inline" />
              Keputusan Diagnostik Mutlak di Tangan Dokter.
            </>
          ) : (
            <>
              Intelligent Laboratory Decision Support.{" "}
              <br className="hidden sm:inline" />
              Diagnostic Authority Strictly with Physicians.
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Nova AI mengotomasi kalkulasi delta-check, mendeteksi deviasi biomarker longitudinal dari ratusan instrumen analyzer, dan menyusun draf narasi klinis terstandar—mempercepat turnaround time validasi tanpa pernah menggantikan pertimbangan medis manusia."
            : "Nova AI automates longitudinal delta-checks, flags acute biomarker deviations across 500+ clinical analyzers, and drafts standardized clinical narratives—accelerating physician verification while preserving human oversight."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Nova AI" : "Schedule Nova AI Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Lihat Simulasi Workstation" : "Explore Workstation Simulation",
          href: "#demo-translation",
        }}
        metrics={[
          {
            value: "100%",
            label: language === "ID" ? "Kendali Dokter Sp.PK" : "Physician In Command",
            sub: language === "ID" ? "Human-in-the-loop mutlak" : "Absolute clinical sovereignty",
          },
          {
            value: language === "ID" ? "< 3 Detik" : "< 3 Sec",
            label: language === "ID" ? "Kalkulasi Delta-Check" : "Delta-Check Engine",
            sub: language === "ID" ? "Analisis tren serial otomatis" : "Automated serial trend",
          },
          {
            value: "ISO 15189",
            label: language === "ID" ? "Standar Mutu Lab" : "Lab Quality Standard",
            sub: language === "ID" ? "Audit trail rekam medis utuh" : "Complete audit trail",
          },
          {
            value: "KARS & JCI",
            label: language === "ID" ? "Kepatuhan Regulasi" : "Accreditation Compliant",
            sub: language === "ID" ? "Protokol nilai kritis resmi" : "Standard critical value triage",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          NOTICE / REGULATORY ETHICS BANNER
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-amber-50/70 border-b border-amber-200/70 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-[1560px] flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-900 font-medium text-center">
          <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700 shrink-0" />
          <span>
            <strong className="font-bold">
              {language === "ID" ? "Pemberitahuan Etika & Regulasi Medis Resmi:" : "Medical Ethics & Regulatory Compliance Notice:"}
            </strong>{" "}
            {language === "ID"
              ? "Sesuai UU Kesehatan No. 17/2023 dan Permenkes No. 24/2022, Nova AI berfungsi sebagai sistem pendukung keputusan klinis (CDSS). Nova AI tidak melakukan diagnosis otonom maupun peresepan obat mandiri."
              : "In accordance with medical governance and health IT regulations, Nova AI serves exclusively as a Clinical Decision Support System (CDSS) and never issues autonomous diagnoses or prescriptions."}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: AUTHENTIC LIS PATHOLOGIST WORKSTATION SIMULATION
          ══════════════════════════════════════════════════════════════ */}
      <section id="demo-translation" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Simulasi Workstation LIS" : "LIS Workstation Simulation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Bagaimana Nova AI Bekerja di Meja Validasi Dokter</>
              ) : (
                <>How Nova AI Operates on the Physician Validation Desk</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Pilih kasus spesimen di bawah untuk melihat bagaimana Nova AI menghitung varians delta-check riwayat pasien, menandai status risiko, dan menyusun draf narasi klinis yang siap disahkan oleh dokter patologi."
                : "Select a clinical specimen case below to inspect how Nova AI calculates patient historical delta-checks, highlights physiological risks, and drafts clinical notes ready for pathologist authorization."}
            </p>
          </div>

          {/* 4 Interactive Specialty Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8">
            {clinicalCases.map((c, idx) => {
              const isActive = selectedCaseIdx === idx;
              const isVerified = verifiedCases[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-[#F8FBFE] text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Activity className={cn("h-4 w-4", isActive ? "text-white" : "text-[#2764B8]")} />
                  <span>{language === "ID" ? c.category : c.categoryEn}</span>
                  {c.isPanicValue && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                        isActive ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-700"
                      )}
                    >
                      Panic
                    </span>
                  )}
                  {isVerified && (
                    <BadgeCheck className={cn("h-4 w-4", isActive ? "text-emerald-300" : "text-emerald-600")} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Clinical LIS Terminal Card */}
          <div className="rounded-[24px] sm:rounded-[32px] border border-slate-200/90 bg-white shadow-sm overflow-hidden">
            {/* LIS Workstation Patient Header Banner */}
            <div className="bg-[#F8FBFE] border-b border-slate-200/80 px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">Specimen:</span>
                  <span className="font-mono font-bold text-[#2764B8] bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    #{currentCase.specimenId}
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
                <div>
                  <span className="font-bold text-slate-900">{currentCase.patientName}</span>
                  <span className="text-slate-500 text-xs ml-2">
                    ({language === "ID" ? currentCase.patientDemographics : currentCase.patientDemographicsEn})
                  </span>
                </div>
                <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
                <div className="text-slate-600 text-xs hidden md:block">
                  <span className="text-slate-400">{language === "ID" ? "Ruang:" : "Ward:"}</span>{" "}
                  <span className="font-medium text-slate-700">
                    {language === "ID" ? currentCase.department : currentCase.departmentEn}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isCurrentVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>{language === "ID" ? "Telah Disahkan Sp.PK" : "Authorized by Pathologist"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/70">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>{language === "ID" ? "Menunggu Validasi Dokter" : "Pending Physician Review"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Split Content: Laboratory Results Table + Nova AI Clinical Copilot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
              {/* Left Column (7 cols): Realistic Laboratory Parameter Results Table */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === "ID" ? "Hasil Pengujian Instrumen & Delta-Check" : "Instrument Results & Delta-Check"}
                    </h3>
                    <p className="text-xs text-slate-500 font-light mt-0.5">
                      {language === "ID" ? "Instrumen:" : "Analyzer:"} {currentCase.analyzer} • {language === "ID" ? currentCase.testTime : currentCase.testTimeEn}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    ASTM E1381 Verified
                  </span>
                </div>

                {/* Structured Parameter Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <th className="py-3 px-4">{language === "ID" ? "Pemeriksaan" : "Parameter"}</th>
                          <th className="py-3 px-3 text-right">{language === "ID" ? "Hasil Terkini" : "Current"}</th>
                          <th className="py-3 px-3 text-center">{language === "ID" ? "Nilai Rujukan" : "Ref Interval"}</th>
                          <th className="py-3 px-3 text-right">{language === "ID" ? "Riwayat Baseline" : "Prior Baseline"}</th>
                          <th className="py-3 px-3 text-right">{language === "ID" ? "Varians Delta" : "Delta Shift"}</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentCase.parameters.map((p) => {
                          const isCrit = p.status === "critical";
                          const isWarn = p.status === "warning";
                          return (
                            <tr
                              key={p.code}
                              className={cn(
                                "hover:bg-slate-50/80 transition-colors",
                                isCrit && "bg-rose-50/30",
                                isWarn && "bg-amber-50/20"
                              )}
                            >
                              <td className="py-3 px-4 font-medium text-slate-900">
                                <div>{p.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{p.code}</div>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                                <span className={cn(isCrit ? "text-rose-600" : isWarn ? "text-amber-700" : "text-slate-800")}>
                                  {p.value}
                                </span>{" "}
                                <span className="text-[11px] font-normal text-slate-400">{p.unit}</span>
                              </td>
                              <td className="py-3 px-3 text-center text-slate-500 font-mono text-[11px]">
                                {p.reference}
                              </td>
                              <td className="py-3 px-3 text-right text-slate-600 font-mono">
                                <div>{p.baseline} {p.unit}</div>
                                <div className="text-[10px] text-slate-400">
                                  {language === "ID" ? p.baselineTime : p.baselineTimeEn}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold">
                                <span
                                  className={cn(
                                    "px-1.5 py-0.5 rounded text-[11px]",
                                    isCrit
                                      ? "bg-rose-100 text-rose-700"
                                      : isWarn
                                      ? "bg-amber-100 text-amber-800"
                                      : "text-slate-600"
                                  )}
                                >
                                  {p.delta} ({p.deltaPercent})
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={cn(
                                    "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                    isCrit
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : isWarn
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  )}
                                >
                                  {language === "ID" ? p.statusLabel : p.statusLabelEn}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sub-note on Clinical Pathologist Verification */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    {language === "ID" ? "Dokter Pengirim (DPJP):" : "Attending Physician:"}{" "}
                    <strong className="text-slate-700">{currentCase.physician}</strong>
                  </span>
                  <span>
                    {language === "ID" ? "Algoritma: Delta Z-Score Multi-Point" : "Engine: Multi-Point Delta Z-Score"}
                  </span>
                </div>
              </div>

              {/* Right Column (5 cols): Nova AI Decision Support Drawer */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FBFDFE] flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Assistant Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2 text-[#2764B8]">
                      <BrainCircuit className="h-5 w-5" />
                      <span className="font-bold text-sm tracking-tight">Nova AI Decision Support</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      v2.4 CDS ENGINE
                    </span>
                  </div>

                  {/* 1. Delta Finding Box */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                      <TrendingUp className="h-4 w-4 text-[#2764B8]" />
                      <span>{language === "ID" ? "Temuan Delta-Check Otomatis:" : "Automated Delta-Check Finding:"}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {language === "ID" ? currentCase.deltaFinding : currentCase.deltaFindingEn}
                    </p>
                  </div>

                  {/* 2. Structured Narrative Draft */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#345DAB] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        {language === "ID" ? "Draf Catatan Klinis untuk Dokter:" : "Draft Clinical Note for Physician:"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-light">
                        {language === "ID" ? "(Dapat diedit dokter)" : "(Physician editable)"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-light">
                      &ldquo;{language === "ID" ? currentCase.clinicalNarrative : currentCase.clinicalNarrativeEn}&rdquo;
                    </p>
                    <div className="pt-1 text-[11px] text-slate-500 font-medium">
                      <strong>{language === "ID" ? "Rekomendasi Lanjutan:" : "Follow-up Recommendation:"}</strong>{" "}
                      {language === "ID" ? currentCase.recommendedAction : currentCase.recommendedActionEn}
                    </div>
                  </div>

                  {/* 3. Panic Alert Notification Status (If triggered) */}
                  {isCurrentAlertSent && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2.5 animate-fadeIn">
                      <BellRing className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>
                        {language === "ID"
                          ? `Alert Nilai Kritis terkirim ke WhatsApp & SIMRS ${currentCase.physician} (KARS SKP 2.2 Compliant).`
                          : `Panic alert broadcasted to ${currentCase.physician}'s EMR & mobile (KARS SKP 2.2 Compliant).`}
                      </span>
                    </div>
                  )}

                  {/* 4. Verification Stamp (If verified) */}
                  {isCurrentVerified && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5 animate-fadeIn">
                      <BadgeCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong>{language === "ID" ? "Hasil Terverifikasi Resmi" : "Officially Authorized"}</strong>
                        <div className="text-[11px] text-emerald-700">
                          {language === "ID"
                            ? "Disahkan oleh dr. H. Santoso, Sp.PK • Tanda Tangan Digital SHA-256 Valid"
                            : "Validated by Dr. H. Santoso, Clinical Pathologist • Valid SHA-256 Digital Signature"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tactile Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleVerify}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98]",
                        isCurrentVerified
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          : "bg-[#2764B8] hover:bg-[#1E5299] text-white"
                      )}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      <span>
                        {isCurrentVerified
                          ? language === "ID" ? "Batalkan Pengesahan" : "Revoke Approval"
                          : language === "ID" ? "Sahkan Hasil & E-Sign" : "Approve & E-Sign"}
                      </span>
                    </button>

                    {currentCase.isPanicValue && (
                      <button
                        type="button"
                        onClick={handleSendAlert}
                        disabled={isCurrentAlertSent}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer active:scale-[0.98]",
                          isCurrentAlertSent
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        )}
                      >
                        <BellRing className="h-4 w-4" />
                        <span>
                          {isCurrentAlertSent
                            ? language === "ID" ? "Alert Terkirim" : "Alert Sent"
                            : language === "ID" ? "Kirim Panic Alert" : "Send Panic Alert"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleReset}
                      title={language === "ID" ? "Atur Ulang Simulasi" : "Reset Simulation"}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center font-light">
                    {language === "ID"
                      ? "Klik tombol di atas untuk menguji simulasi alur otorisasi dokter dan eskalasi nilai kritis."
                      : "Interact with the controls above to test the physician authorization and panic escalation workflow."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4 TAHAP ALUR KERJA KLINIS (#how-it-works)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Alur Kerja 4 Tahap" : "4-Stage Clinical Pipeline"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien</>
              ) : (
                <>Structured Clinical Pipeline Safeguarding Diagnostic Precision</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Dari transmisi instrumen analyzer hingga otorisasi digital dokter, setiap tahapan dirancang dengan transparansi, ketertelusuran penuh, dan kepatuhan akreditasi rumah sakit."
                : "From raw analyzer ingestion to final pathologist authorization, every step is engineered for transparency, full audit traceability, and strict accreditation compliance."}
            </p>
          </div>

          {/* Sequential Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws) => {
              const IconComponent = ws.icon;
              return (
                <div
                  key={ws.step}
                  className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-sm font-bold text-slate-400">
                        {ws.step}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
                        {ws.phase}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                        {ws.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed mt-2.5">
                        {ws.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <span className="font-mono text-[10px] text-slate-400">{ws.specs}</span>
                    <Check className="h-3.5 w-3.5 text-[#2764B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: AI + DOKTER: MATRIKS TANGGUNG JAWAB & ETIKA (#ai-doctor)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="ai-doctor"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="max-w-3xl">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Etika Medis & Akuntabilitas Hukum" : "Medical Ethics & Clinical Accountability"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Mengapa Dokter Tetap Menjadi Otoritas Klinis Tertinggi?</>
              ) : (
                <>Why Physicians Retain Non-Negotiable Medical Sovereignty</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Dalam tata kelola klinis modern, AI berperan mempercepat pemrosesan data, sementara pertimbangan diagnosis holistik dan tanggung jawab hukum mutlak berada di tangan dokter penanggung jawab."
                : "In modern clinical governance, AI accelerates computation, while holistic diagnostic judgment and full legal accountability rest strictly with certified human physicians."}
            </p>
          </div>

          {/* Balanced Responsibility Matrix (Nova AI vs Physician) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column A: Role of Nova AI */}
            <div className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/90 p-7 sm:p-9 space-y-6 shadow-2xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-blue-100/80">
                <div className="h-12 w-12 rounded-2xl bg-white border border-blue-200/70 text-[#2764B8] flex items-center justify-center shadow-xs">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {language === "ID" ? "Sistem Nova AI (Decision Support)" : "Nova AI System (Decision Support)"}
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    {language === "ID" ? "Komputasi Cepat & Deteksi Deviasi Pola" : "High-Speed Computing & Pattern Detection"}
                  </p>
                </div>
              </div>

              {/* What Nova AI Does */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#2764B8] uppercase tracking-wider block">
                  {language === "ID" ? "Tugas & Kapabilitas Algoritmik:" : "Algorithmic Scope & Capabilities:"}
                </span>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Memindai ribuan hasil lab dan riwayat serial pasien dalam hitungan milidetik."
                        : "Scans thousands of lab values and historical patient timelines in milliseconds."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menghitung lonjakan delta-check melebihi variabilitas biologis wajar secara otomatis."
                        : "Calculates acute delta-check deviations exceeding routine biological variability."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menyiapkan draf kalimat narasi klinis untuk ditelaah dan diverifikasi dokter."
                        : "Drafts concise clinical summaries for physician evaluation and adjustment."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Mengirimkan eskalasi nilai kritis darurat (Panic Alert) ke DPJP sesuai SOP KARS."
                        : "Dispatches automated emergency panic value alerts to attending teams per accreditation SOPs."}
                    </span>
                  </div>
                </div>
              </div>

              {/* What Nova AI NEVER Does (Ethical Guardrails) */}
              <div className="pt-4 border-t border-blue-100/80 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {language === "ID" ? "Batasan Etis Mutlak (Non-Negotiable):" : "Strict Ethical Guardrails:"}
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 text-rose-700">
                    <span className="text-sm font-bold">✕</span>
                    <span>{language === "ID" ? "Tidak pernah menegakkan diagnosis medis definitif" : "Never issues definitive medical diagnoses"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-700">
                    <span className="text-sm font-bold">✕</span>
                    <span>{language === "ID" ? "Tidak dapat meresepkan terapi atau obat mandiri" : "Never prescribes drugs or clinical therapy"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-700">
                    <span className="text-sm font-bold">✕</span>
                    <span>{language === "ID" ? "Hasil tidak dapat dirilis tanpa tanda tangan digital dokter" : "Reports cannot be released without physician e-signature"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column B: Role of Attending Physician / Pathologist */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-9 space-y-6 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {language === "ID" ? "Dokter Sp.PK & DPJP (Otoritas Penuh)" : "Pathologist & Attending Doctor"}
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    {language === "ID" ? "Pertimbangan Klinis Holistik & Tanggung Jawab Hukum" : "Holistic Clinical Judgment & Legal Responsibility"}
                  </p>
                </div>
              </div>

              {/* Physician Authority */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  {language === "ID" ? "Wewenang & Tanggung Jawab Klinis:" : "Clinical Scope & Legal Authority:"}
                </span>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Mengevaluasi kesesuaian hasil laboratorium dengan anamnesis dan pemeriksaan fisik pasien."
                        : "Correlates laboratory telemetry against direct patient physical exam and clinical history."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menetapkan diagnosis definitif serta merumuskan rencana penatalaksanaan terapi."
                        : "Establishes definitive medical diagnoses and prescribes therapeutic plans."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menyetujui, mengedit, atau menolak draf narasi klinis yang dihasilkan sistem."
                        : "Approves, amends, or overrides automated clinical narrative suggestions."}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {language === "ID"
                        ? "Menandatangani secara digital sebagai penanggung jawab hukum sesuai UU Kesehatan."
                        : "Authorizes reports with cryptographic digital signatures as legally accountable practitioner."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal Mandate */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {language === "ID" ? "Landasan Hukum & Regulasi:" : "Statutory Governance:"}
                </span>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {language === "ID"
                    ? "Berdasarkan UU Kesehatan No. 17/2023, seluruh tindakan medis dan penegakan diagnosis merupakan hak prerogatif tenaga medis bersertifikat Surat Tanda Registrasi (STR) aktif."
                    : "Under healthcare statutory acts, all definitive diagnostic decisions and treatment orders remain the exclusive prerogative of licensed medical practitioners."}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Regulatory Compliance Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#345DAB]">
                <ShieldCheck className="h-4 w-4 text-[#2764B8]" />
                <span>UU Kesehatan No. 17/2023</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {language === "ID"
                  ? "Menjamin akuntabilitas profesi tenaga medis dan kepastian hukum dalam penggunaan teknologi kesehatan di fasilitas pelayanan kesehatan."
                  : "Ensures healthcare professional accountability and legal clarity regarding health technologies in clinical facilities."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#345DAB]">
                <Lock className="h-4 w-4 text-[#2764B8]" />
                <span>Permenkes No. 24/2022</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {language === "ID"
                  ? "Kepatuhan penuh pada interoperabilitas Rekam Medis Elektronik (RME), keamanan data pasien, dan integrasi SATUSEHAT."
                  : "Strict conformity to national Electronic Medical Record interoperability, patient privacy, and SATUSEHAT ecosystem."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#345DAB]">
                <Activity className="h-4 w-4 text-[#2764B8]" />
                <span>KARS SKP 2.2 & ISO 15189</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {language === "ID"
                  ? "Standar baku pelaporan nilai kritis laboratorium < 15 menit dan audit trail forensik digital yang tak dapat diubah."
                  : "Accredited panic value triage protocols (< 15 mins) and tamper-evident digital audit logging for clinical laboratories."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Standardized Enterprise Banner
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
