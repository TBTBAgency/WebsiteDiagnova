"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
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
  statusType: "warning" | "critical" | "normal";
  gaugePercent: number; // 0 - 100% position on reference range bar
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
      statusLabel: "Rendah • Delta Alert",
      statusLabelEn: "Low • Delta Alert",
      statusType: "warning",
      gaugePercent: 20,
      prevValue: "10.5 g/dL",
      prevTimestamp: "3 hari lalu (12 Nov, 08:30)",
      prevTimestampEn: "3 days ago (Nov 12, 08:30)",
      deltaText: "-2.1 g/dL",
      deltaPercent: "-20.0%",
      isDeltaDrop: true,
      clinicalImpression:
        "Anemia normositik normokromik derajat sedang dengan pergeseran delta akut sebesar -20.0% dalam 72 jam terakhir pasca-operasi.",
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
      statusLabel: "Tinggi • Risiko AKI",
      statusLabelEn: "Critical • AKI Risk",
      statusType: "critical",
      gaugePercent: 88,
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
      statusLabel: "Tinggi • Hiperglikemia",
      statusLabelEn: "High • Hyperglycemia",
      statusType: "warning",
      gaugePercent: 86,
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
      tabLabel: language === "ID" ? "Hemostasis: Trombosit (Kritis)" : "Hemostasis: Platelets (Panic)",
      tabLabelEn: "Hemostasis: Platelets (Panic)",
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
      statusLabel: "NILAI KRITIS (PANIC)",
      statusLabelEn: "CRITICAL PANIC VALUE",
      statusType: "critical",
      gaugePercent: 6,
      prevValue: "88.000 /µL",
      prevTimestamp: "Kemarin sore (14 Nov, 16:20)",
      prevTimestampEn: "Yesterday evening (Nov 14, 16:20)",
      deltaText: "-74.000 /µL",
      deltaPercent: "-84.1%",
      isDeltaDrop: true,
      clinicalImpression:
        "NILAI KRITIS DARURAT (Trombosit < 20.000/µL): Penurunan drastis 84.1% dalam 18 jam dengan risiko tinggi perdarahan spontan intraserebral/mukosa.",
      clinicalImpressionEn:
        "EMERGENCY CRITICAL PANIC VALUE (PLT < 20,000/µL): Precipitous 84.1% plunge in 18 hours with severe risk of spontaneous internal hemorrhage.",
      clinicalRecommendation:
        "PROTOKOL KARS SKP 2.2: Wajib lapor ke DPJP/Dokter Jaga IGD < 15 menit. Siapkan transfusi konsentrat trombosit (TC) & verifikasi apusan darah tepi.",
      clinicalRecommendationEn:
        "MANDATORY KARS SKP 2.2 PROTOCOL: Critical reporting to ER physician < 15 mins. Crossmatch platelet concentrate (TC) & review peripheral blood smear.",
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
      stepLabel: "Tahap 01",
      stepLabelEn: "Phase 01",
      title: language === "ID" ? "Interfacing Dua Arah Analyzer" : "Bi-Directional Analyzer Interfacing",
      protocol: "ASTM E1381 • HL7 v2 / FHIR",
      desc:
        language === "ID"
          ? "Data hasil uji dari 500+ instrumen hematologi, kimia klinis, dan imunologi ditransmisikan secara langsung tanpa entri data manual, meniadakan risiko salah ketik."
          : "Direct telemetry ingestion from 500+ hematology, chemistry, and immunoassay instruments with zero manual entry, eliminating transcription errors.",
      icon: Server,
    },
    {
      stepLabel: "Tahap 02",
      stepLabelEn: "Phase 02",
      title: language === "ID" ? "Mesin Delta-Check Longitudinal" : "Longitudinal Delta-Check Engine",
      protocol: "Statistical Z-Score • Patient Delta Rules",
      desc:
        language === "ID"
          ? "Sistem membandingkan nilai terkini dengan rekam jejak pemeriksaan pasien terdahulu secara serial, mendeteksi pergeseran anomali akut antar-kunjungan."
          : "Compares current results against historical patient baselines sequentially, catching acute deviations that static reference ranges miss.",
      icon: TrendingUp,
    },
    {
      stepLabel: "Tahap 03",
      stepLabelEn: "Phase 03",
      title: language === "ID" ? "Draf Interpretasi & Triage Panic Value" : "Clinical Draft & Panic Value Triage",
      protocol: "KARS SKP 2.2 • LOINC & SNOMED-CT",
      desc:
        language === "ID"
          ? "Menyiapkan draf narasi klinis terstandar dan secara otomatis menyiarkan alert nilai kritis ke WhatsApp dan SIMRS dokter jaga dalam waktu < 15 menit."
          : "Prepares standardized clinical summaries and automatically broadcasts critical panic alerts to attending teams in under 15 minutes.",
      icon: BellRing,
    },
    {
      stepLabel: "Tahap 04",
      stepLabelEn: "Phase 04",
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
            sub: language === "ID" ? "Standar pelaporan nilai kritis" : "Accredited panic protocol",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          HIGH-CONTRAST REGULATORY NOTICE BAR (Crisp & Clean)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-slate-900 text-white py-3.5 px-4 sm:px-6 border-b border-slate-800">
        <div className="mx-auto max-w-[1560px] flex items-center justify-center gap-3 text-xs sm:text-sm font-medium text-center">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-slate-200">
            <strong className="text-white font-bold">
              {language === "ID" ? "Standar Tata Kelola Klinis:" : "Clinical Governance Standard:"}
            </strong>{" "}
            {language === "ID"
              ? "Nova AI beroperasi sebagai Sistem Pendukung Keputusan Klinis (CDSS) sesuai UU Kesehatan No. 17/2023 dan Permenkes No. 24/2022. Seluruh penetapan diagnosis dan terapi berada pada kewenangan hukum dokter yang merawat."
              : "Nova AI operates as a certified Clinical Decision Support System (CDSS) conforming to national health regulations. All definitive diagnostic and therapeutic decisions remain strictly under attending physician authority."}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: CLINICAL PATHOLOGY WORKSTATION (#workstation-demo)
          (High-Contrast, Crisp, Professional Medical SaaS Interface)
          ══════════════════════════════════════════════════════════════ */}
      <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Simulasi Meja Kerja Patologi Klinik" : "Pathologist Workstation Simulation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-950">
              {language === "ID" ? (
                <>Bagaimana Nova AI Mendukung Otorisasi Dokter</>
              ) : (
                <>How Nova AI Powers Pathologist Sign-Off Workflows</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-700 font-normal">
              {language === "ID"
                ? "Pilih profil spesimen klinis di bawah untuk melihat bagaimana Nova AI menghitung variasi delta-check longitudinal, menandai nilai kritis, dan menyiapkan draf narasi medis yang siap disahkan dokter."
                : "Select a clinical specimen profile below to inspect how Nova AI calculates longitudinal delta-checks, flags panic values, and prepares clinical report impressions ready for pathologist authorization."}
            </p>
          </div>

          {/* 4 High-Contrast Specialty Tabs */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8">
            {profiles.map((p, idx) => {
              const isActive = selectedProfileIdx === idx;
              const isDone = authorizedProfiles[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfileIdx(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#1E5299] text-white border-[#1E5299] shadow-sm"
                      : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100 hover:text-slate-950 hover:border-slate-400"
                  )}
                >
                  <Activity className={cn("h-4 w-4", isActive ? "text-white" : "text-[#1E5299]")} />
                  <span>{language === "ID" ? p.tabLabel : p.tabLabelEn}</span>
                  {p.isPanicValue && (
                    <span
                      className={cn(
                        "text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        isActive ? "bg-rose-500 text-white" : "bg-rose-600 text-white"
                      )}
                    >
                      Panic
                    </span>
                  )}
                  {isDone && (
                    <CheckCheck className={cn("h-4 w-4", isActive ? "text-emerald-300" : "text-emerald-700")} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Master Clinical Pathology Workstation Card */}
          <div className="rounded-[28px] sm:rounded-[32px] border-2 border-slate-300 bg-white shadow-sm overflow-hidden">
            {/* Header: Patient & Specimen Medical Context (High Contrast) */}
            <div className="bg-slate-100 border-b-2 border-slate-300 px-6 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-600 block uppercase">No. Spesimen</span>
                  <span className="font-mono font-black text-[#1E5299] text-sm">{currentProfile.specimenNo}</span>
                </div>
                <div className="h-6 w-[2px] bg-slate-300 hidden sm:block" />
                <div>
                  <span className="font-bold text-slate-950 text-sm block">{currentProfile.patientName}</span>
                  <span className="text-slate-700 text-xs font-medium">
                    {language === "ID" ? currentProfile.patientAgeGender : currentProfile.patientAgeGenderEn}
                  </span>
                </div>
                <div className="h-6 w-[2px] bg-slate-300 hidden md:block" />
                <div className="hidden md:block">
                  <span className="text-slate-600 text-xs font-bold block">{language === "ID" ? "Ruangan Rawat" : "Ward"}</span>
                  <span className="text-slate-900 text-xs font-bold">
                    {language === "ID" ? currentProfile.ward : currentProfile.wardEn}
                  </span>
                </div>
                <div className="h-6 w-[2px] bg-slate-300 hidden lg:block" />
                <div className="hidden lg:block">
                  <span className="text-slate-600 text-xs font-bold block">{language === "ID" ? "Dokter Pengirim (DPJP)" : "Attending DPJP"}</span>
                  <span className="text-slate-900 text-xs font-bold">{currentProfile.attendingDoc}</span>
                </div>
              </div>

              {/* Status Verification Badge */}
              <div className="flex items-center gap-2">
                {isAuthorized ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-2xs">
                    <BadgeCheck className="h-4 w-4 text-emerald-200" />
                    <span>{language === "ID" ? "Disahkan Dokter Sp.PK (E-Sign Valid)" : "Authorized by Pathologist (E-Sign)"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    <span>{language === "ID" ? "Menunggu Review Dokter Sp.PK" : "Pending Pathologist Review"}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Body: Split View (Data Analit vs Draf Catatan Patologi) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-slate-300 items-stretch">
              {/* Kolom Kiri: Parameter, Nilai & Reference Range Display */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono">
                      {currentProfile.analyteCode}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-2xs",
                        currentProfile.statusType === "critical"
                          ? "bg-rose-600"
                          : "bg-amber-600"
                      )}
                    >
                      {language === "ID" ? currentProfile.statusLabel : currentProfile.statusLabelEn}
                    </span>
                  </div>

                  {/* Nilai Pengujian Utama */}
                  <div className="mt-5 space-y-1">
                    <h3 className="text-xl font-bold text-slate-950">
                      {language === "ID" ? currentProfile.parameterName : currentProfile.parameterNameEn}
                    </h3>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="font-mono text-5xl font-black text-[#1E5299] tracking-tight">
                        {currentProfile.currentValue}
                      </span>
                      <span className="text-base font-bold text-slate-700 font-mono">
                        {currentProfile.unit}
                      </span>
                    </div>
                  </div>

                  {/* High-Contrast Reference Range Comparison Block */}
                  <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">{language === "ID" ? "Rentang Rujukan Normal:" : "Normal Reference Range:"}</span>
                      <span className="font-mono text-slate-950 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {currentProfile.refInterval}
                      </span>
                    </div>

                    {/* Clean High-Contrast Range Track */}
                    <div className="space-y-1.5">
                      <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                        {/* Target normal zone highlighted */}
                        <div className="absolute inset-y-0 left-[25%] right-[25%] bg-slate-400" />
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>{language === "ID" ? "Bawah" : "Low"}</span>
                        <span className="text-slate-900">{language === "ID" ? "Rentang Acuan Sehat" : "Healthy Reference"}</span>
                        <span>{language === "ID" ? "Atas" : "High"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Komparasi Delta-Check Riwayat Serial (High-Contrast White Card) */}
                <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="flex items-center gap-1.5 text-[#1E5299]">
                      <TrendingUp className="h-4 w-4 text-[#1E5299]" />
                      {language === "ID" ? "Kalkulasi Variasi Delta-Check:" : "Longitudinal Delta Variance:"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-700">
                      {language === "ID" ? currentProfile.prevTimestamp : currentProfile.prevTimestampEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs text-slate-800 font-medium">
                      {language === "ID" ? "Baseline Sebelumnya:" : "Prior Baseline:"}{" "}
                      <strong className="font-mono text-slate-950 text-sm">{currentProfile.prevValue}</strong>
                    </div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-black font-mono px-3 py-1 rounded-lg text-white shadow-2xs",
                        currentProfile.isDeltaDrop
                          ? "bg-rose-700"
                          : "bg-amber-700"
                      )}
                    >
                      {currentProfile.isDeltaDrop ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                      <span>{currentProfile.deltaText} ({currentProfile.deltaPercent})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Draf Interpretasi Patologi & Tombol Verifikasi Dokter */}
              <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-300">
                    <div className="flex items-center gap-2 text-[#1E5299]">
                      <Stethoscope className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                        {language === "ID" ? "Draf Hasil Verifikasi Patologi Klinik" : "Pathology Clinical Interpretation Draft"}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                      CDSS ENGINE v2.4
                    </span>
                  </div>

                  {/* Kesan Klinis Patologi */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-black text-slate-950 uppercase tracking-wider block">
                      {language === "ID" ? "1. Kesan Patologi (Clinical Impression):" : "1. Clinical Impression:"}
                    </span>
                    <p className="text-sm text-slate-900 leading-relaxed font-medium">
                      &ldquo;{language === "ID" ? currentProfile.clinicalImpression : currentProfile.clinicalImpressionEn}&rdquo;
                    </p>
                  </div>

                  {/* Rekomendasi Korelasi Klinis */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-black text-[#1E5299] uppercase tracking-wider block">
                      {language === "ID" ? "2. Rekomendasi Korelasi Tambahan:" : "2. Correlative Recommendation:"}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      {language === "ID" ? currentProfile.clinicalRecommendation : currentProfile.clinicalRecommendationEn}
                    </p>
                  </div>

                  {/* Status Alert Terkirim (Jika dipicu) */}
                  {isAlertSent && (
                    <div className="p-4 rounded-xl bg-rose-700 text-white text-xs font-bold flex items-center gap-3 shadow-xs animate-fadeIn">
                      <BellRing className="h-5 w-5 text-rose-200 shrink-0" />
                      <span>
                        {language === "ID"
                          ? `Alert Nilai Kritis telah disiarkan ke WhatsApp & SIMRS ${currentProfile.attendingDoc} (Protokol KARS SKP 2.2).`
                          : `Emergency critical alert dispatched to ${currentProfile.attendingDoc}'s EMR and mobile (KARS SKP 2.2 Compliant).`}
                      </span>
                    </div>
                  )}

                  {/* Status E-Sign Berhasil (Jika diverifikasi) */}
                  {isAuthorized && (
                    <div className="p-4 rounded-xl bg-emerald-800 text-white text-xs flex items-center gap-3 shadow-xs animate-fadeIn">
                      <BadgeCheck className="h-5 w-5 text-emerald-300 shrink-0" />
                      <div>
                        <strong className="block text-sm">{language === "ID" ? "Laporan Laboratorium Resmi Disahkan" : "Official Laboratory Report Authorized"}</strong>
                        <div className="text-emerald-100 text-xs mt-0.5">
                          {language === "ID"
                            ? "Ditandatangani secara elektronik oleh dr. Sp.PK • Tersertifikasi BSrE & Rilis ke SIMRS"
                            : "Digitally signed by Attending Clinical Pathologist • BSrE Certified & Released to EMR"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Dokter (High Contrast Solid Buttons) */}
                <div className="pt-4 border-t-2 border-slate-300 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleAuthorize}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-[0.98]",
                        isAuthorized
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400"
                          : "bg-[#1E5299] hover:bg-[#153B6F] text-white"
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
                          "inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer active:scale-[0.98]",
                          isAlertSent
                            ? "bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed"
                            : "bg-rose-600 text-white border-rose-700 hover:bg-rose-700 shadow-xs"
                        )}
                      >
                        <BellRing className="h-4 w-4" />
                        <span>
                          {isAlertSent
                            ? language === "ID" ? "Alert Terkirim" : "Alert Sent"
                            : language === "ID" ? "Kirim Panic Alert" : "Send Panic Alert"}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleResetProfile}
                      title={language === "ID" ? "Atur Ulang Status" : "Reset Status"}
                      className="p-3.5 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 text-center font-medium">
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
          (High-Contrast, Crisp Card Borders & Bold Typography)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="scroll-mt-28 w-full bg-slate-50 py-16 sm:py-20 lg:py-24 border-t-2 border-slate-200"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Alur Kerja 4 Tahap" : "4-Stage Clinical Pipeline"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-950">
              {language === "ID" ? (
                <>Alur Kerja Terstruktur yang Menjamin Presisi & Keselamatan Pasien</>
              ) : (
                <>Structured Pipeline Safeguarding Clinical Integrity & Accuracy</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-700 font-normal">
              {language === "ID"
                ? "Dari pembacaan instrumen analitik hingga otorisasi digital dokter spesialis, setiap tahap didesain dengan ketertelusuran penuh dan kepatuhan akreditasi rumah sakit."
                : "From direct analyzer telemetry to certified pathologist authorization, every phase is engineered with full audit traceability and hospital accreditation standards."}
            </p>
          </div>

          {/* 4 Connected Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowPipeline.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[28px] bg-white border-2 border-slate-200 p-7 shadow-xs hover:border-[#1E5299] hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#1E5299] flex items-center justify-center shadow-xs">
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#1E5299] bg-blue-100 px-3 py-1 rounded-full inline-block mb-2 font-mono">
                        {language === "ID" ? item.stepLabel : item.stepLabelEn}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-950 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-700 font-normal leading-relaxed mt-2.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-200 flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                    <span>{item.protocol}</span>
                    <Check className="h-4 w-4 text-[#1E5299]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: CLINICAL GOVERNANCE & RESPONSIBILITY MATRIX (#ai-doctor)
          (High Contrast Split View & Sharp Borders)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="ai-doctor"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t-2 border-slate-200 overflow-hidden"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full space-y-12 sm:space-y-16">
          {/* Section Header */}
          <div className="max-w-3xl">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Tata Kelola Klinis & Akuntabilitas" : "Clinical Governance & Legal Accountability"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-950">
              {language === "ID" ? (
                <>Mengapa Dokter Tetap Menjadi Otoritas Klinis Tertinggi?</>
              ) : (
                <>Why Physicians Retain Absolute Medical Authority</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-700 font-normal">
              {language === "ID"
                ? "Dalam tata kelola klinis modern, sistem komputasi mempercepat pemrosesan data, sementara pertimbangan diagnosis holistik dan tanggung jawab hukum mutlak berada di tangan dokter spesialis teregistrasi."
                : "In modern clinical governance, computational systems accelerate data processing, while holistic diagnostic judgment and full legal accountability remain with licensed medical practitioners."}
            </p>
          </div>

          {/* Side-by-Side Responsibility Matrix (High Contrast Cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box A: Sistem Nova AI */}
            <div className="rounded-[28px] bg-white border-2 border-slate-300 p-7 sm:p-9 space-y-6 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b-2 border-slate-200">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-[#1E5299] flex items-center justify-center shadow-xs">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950">
                    {language === "ID" ? "Sistem Nova AI (Decision Support)" : "Nova AI System (Decision Support)"}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {language === "ID" ? "Komputasi Presisi & Deteksi Deviasi" : "High-Speed Computing & Variance Detection"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E5299] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Memindai ribuan hasil lab serial pasien dalam hitungan milidetik secara konsisten."
                      : "Scans thousands of serial patient laboratory results in milliseconds with zero fatigue."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E5299] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menghitung deviasi delta-check otomatis terhadap baseline individual pasien terdahulu."
                      : "Automatically calculates longitudinal delta deviations against individual patient baselines."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E5299] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menyiapkan draf narasi interpretasi terstruktur untuk mempercepat review dokter."
                      : "Drafts structured clinical interpretation notes to accelerate pathologist review time."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#1E5299] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menyiarkan alarm nilai kritis (Panic Values) ke dokter jaga < 15 menit sesuai KARS."
                      : "Dispatches critical panic value alerts to attending physicians in < 15 minutes per KARS."}
                  </span>
                </div>
              </div>

              {/* Batasan Mutlak */}
              <div className="pt-4 border-t-2 border-slate-200 space-y-2 text-xs text-slate-800">
                <span className="font-black text-slate-900 uppercase tracking-wider block">
                  {language === "ID" ? "Batasan Regulasi Mutlak:" : "Strict Regulatory Limits:"}
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {language === "ID"
                    ? "Nova AI tidak memiliki wewenang hukum untuk menegakkan diagnosis definitif mandiri atau meresepkan terapi obat."
                    : "Nova AI possesses zero legal authority to issue autonomous definitive diagnoses or prescribe therapeutic drugs."}
                </p>
              </div>
            </div>

            {/* Box B: Dokter Spesialis Patologi Klinik & DPJP */}
            <div className="rounded-[28px] bg-white border-2 border-slate-300 p-7 sm:p-9 space-y-6 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b-2 border-slate-200">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-950">
                    {language === "ID" ? "Dokter Sp.PK & DPJP (Otoritas Medis)" : "Pathologist & Attending Physician"}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold">
                    {language === "ID" ? "Pertimbangan Holistik & Akuntabilitas Hukum" : "Holistic Clinical Judgment & Legal Responsibility"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-800">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Mengkorelasikan temuan laboratorium dengan anamnesis dan kondisi fisik riil pasien."
                      : "Correlates laboratory telemetry against patient clinical history and direct physical exam."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menilai, mengedit, atau menolak draf narasi interpretasi yang diajukan sistem."
                      : "Evaluates, modifies, or overrides automated clinical narrative recommendations."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menetapkan diagnosis medis definitif dan merumuskan rencana terapi penanganan."
                      : "Establishes definitive medical diagnoses and prescribes therapeutic treatment plans."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Mengesahkan lembar hasil laboratorium dengan tanda tangan digital resmi (BSrE)."
                      : "Authorizes finalized laboratory reports with accredited cryptographic digital signatures."}
                  </span>
                </div>
              </div>

              {/* Landasan Hukum */}
              <div className="pt-4 border-t-2 border-slate-200 space-y-2 text-xs text-slate-800">
                <span className="font-black text-slate-900 uppercase tracking-wider block">
                  {language === "ID" ? "Landasan Hukum Republik Indonesia:" : "Indonesian Statutory Foundation:"}
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {language === "ID"
                    ? "Berdasarkan UU Kesehatan No. 17/2023, seluruh pertimbangan klinis dan tanggung jawab hukum medis melekat pada dokter yang memiliki STR dan SIP aktif."
                    : "Under Healthcare Law No. 17/2023, all medical decisions and legal responsibilities rest exclusively with certified and registered physicians."}
                </p>
              </div>
            </div>
          </div>

          {/* 3 High-Contrast Regulatory Trust Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#1E5299] shrink-0" />
              <div>
                <span className="font-black text-xs text-slate-950 block">UU Kesehatan No. 17/2023</span>
                <span className="text-xs text-slate-700 font-medium">
                  {language === "ID" ? "Kepastian hukum tanggung jawab medis" : "Legal medical accountability"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#1E5299] shrink-0" />
              <div>
                <span className="font-black text-xs text-slate-950 block">Permenkes No. 24/2022</span>
                <span className="text-xs text-slate-700 font-medium">
                  {language === "ID" ? "Interoperabilitas RME & SATUSEHAT" : "EMR & SATUSEHAT interoperability"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border-2 border-slate-300 shadow-xs flex items-center gap-3">
              <Activity className="h-6 w-6 text-[#1E5299] shrink-0" />
              <div>
                <span className="font-black text-xs text-slate-950 block">KARS SKP 2.2 & ISO 15189</span>
                <span className="text-xs text-slate-700 font-medium">
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
      <CTABanner />
    </div>
  );
}
