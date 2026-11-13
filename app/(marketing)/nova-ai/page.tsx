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
  Clock,
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
          SECTION 1: CLINICAL PATHOLOGY WORKSTATION (#workstation-demo)
          ══════════════════════════════════════════════════════════════ */}
      <section id="workstation-demo" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
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
            {/* BENTO 1 (Wide Left - 7 cols): Interfacing Dua Arah Analyzer */}
            <div className="lg:col-span-7 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Interfacing Dua Arah Analyzer" : "Bi-Directional Analyzer Interfacing"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Data hasil uji dari 500+ instrumen ditransmisikan langsung tanpa entri manual."
                    : "Direct telemetry ingestion from 500+ instruments with zero manual entry."}
                </p>
              </div>

              {/* Visual: Workflow Node Flow */}
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                {/* Left Core Hub Node */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-[#0073FC] text-white shadow-[0_8px_20px_-4px_rgba(0,115,252,0.45)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Server className="h-7 w-7 stroke-[2]" />
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
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {language === "ID" ? "ASTM E1381 & HL7 v2" : "ASTM E1381 & HL7 v2"}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">Sysmex XN-1000 • Cobas c501</p>
                    </div>
                  </div>

                  {/* Center Branch (Telemetry Summary Card) */}
                  <div className="rounded-xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Auto-QC Westgard" : "Auto-QC Westgard"}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        In-Control ✓
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Parser Bi-Directional" : "Bi-Directional Parser"}
                      </span>
                      <span className="text-[11px] text-slate-400">&lt; 200ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
                      <span className="font-semibold text-slate-800">
                        {language === "ID" ? "Zero Manual Entry" : "Zero Manual Entry"}
                      </span>
                      <span className="text-[10px] font-semibold text-[#0073FC]">100% Valid</span>
                    </div>
                  </div>

                  {/* Bottom Branch */}
                  <div className="rounded-xl bg-white border border-slate-200/80 px-4 py-3 shadow-xs flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {language === "ID" ? "Normalisasi LOINC & FHIR R4" : "LOINC & FHIR R4 Normalization"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO 2 (Narrow Right - 5 cols): Mesin Delta-Check Longitudinal */}
            <div className="lg:col-span-5 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Mesin Delta-Check Longitudinal" : "Longitudinal Delta-Check Engine"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Deteksi deviasi biomarker serial antar-kunjungan secara real-time."
                    : "Real-time serial biomarker deviation detection across patient visits."}
                </p>
              </div>

              {/* Visual: App Window + Floating KPI Card */}
              <div className="relative mt-auto pt-4">
                {/* Background Mockup Frame */}
                <div className="ml-6 sm:ml-10 rounded-tl-2xl bg-white border-t border-l border-slate-200/90 shadow-sm pt-4 px-5 pb-6">
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-md bg-[#0073FC] flex items-center justify-center text-white text-[9px] font-bold">
                        N
                      </span>
                      <span className="text-xs font-bold text-slate-800">Nova CDSS Engine</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Z-Score</span>
                  </div>

                  {/* Subtle Area Chart SVG */}
                  <svg className="w-full h-24 text-[#0073FC]" viewBox="0 0 240 80" fill="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="novaDeltaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0073FC" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#0073FC" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="240" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="45" x2="240" y2="45" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="70" x2="240" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                    <path
                      d="M0 64 L48 52 L96 58 L150 28 L195 34 L240 12 L240 80 L0 80 Z"
                      fill="url(#novaDeltaGrad)"
                    />
                    <path
                      d="M0 64 L48 52 L96 58 L150 28 L195 34 L240 12"
                      stroke="#0073FC"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Floating KPI Card */}
                <div className="absolute top-16 left-0 w-[64%] sm:w-[60%] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-[0_14px_30px_-10px_rgba(15,23,42,0.12)] group-hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-[11px] font-medium text-slate-500">
                    {language === "ID" ? "Kecepatan Kalkulasi Delta" : "Delta-Check Latency"}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      &lt; 3 Detik
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">▲</span>
                  </div>
                  <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <span>✓ {language === "ID" ? "Anomali Serial Terdeteksi" : "Serial Shift Flagged"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO 3 (Narrow Left - 5 cols): Draf Interpretasi & Triage Kritis */}
            <div className="lg:col-span-5 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Draf Interpretasi & Triage Kritis" : "Clinical Draft & Critical Triage"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "Narasi klinis terstandar & alarm nilai kritis < 15 menit."
                    : "Standardized clinical drafts & panic value alerts < 15 mins."}
                </p>
              </div>

              {/* Visual: Mini Dashboard Bar Chart Frame */}
              <div className="mt-auto rounded-t-2xl bg-white border-t border-x border-slate-200/90 shadow-sm p-4 sm:p-5 pb-5 sm:pb-6">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#EBF3FE] text-[#0073FC] flex items-center justify-center">
                      <BellRing className="h-3 w-3" />
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {language === "ID" ? "Triage Nilai Kritis KARS" : "KARS Critical Triage"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EBF3FE] text-[#0073FC]">
                    SLA &lt; 15m
                  </span>
                </div>

                {/* Vertical Bar Chart */}
                <div className="grid grid-cols-5 gap-3 items-end h-28 pt-2">
                  {[
                    { label: "Hb", h: "h-16" },
                    { label: "PLT", h: "h-12" },
                    { label: "K+", h: "h-20" },
                    { label: "Cr", h: "h-10" },
                    { label: "Glc", h: "h-22" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full flex-1 flex items-end bg-slate-100/80 rounded-t-lg overflow-hidden">
                        <div
                          className={`w-full ${bar.h} rounded-t-lg bg-[#0073FC] group-hover:brightness-110 transition-all duration-300`}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* BENTO 4 (Wide Right - 7 cols): Otorisasi Dokter Sp.PK & E-Sign BSrE */}
            <div className="lg:col-span-7 rounded-[28px] bg-[#F1F4F8] p-7 sm:p-8 flex flex-col justify-between overflow-hidden group">
              <div className="mb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {language === "ID" ? "Otorisasi Dokter Sp.PK & E-Sign BSrE" : "Pathologist Sign-Off & BSrE E-Sign"}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
                  {language === "ID"
                    ? "100% kendali verifikasi medis dengan tanda tangan digital resmi."
                    : "100% physician verification sovereignty with certified digital signatures."}
                </p>
              </div>

              {/* Visual: Connected Multi-Step Sign-Off Flow */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 py-2 my-auto">
                {/* Left 2 Floating Verification Cards */}
                <div className="w-full sm:w-[42%] space-y-3">
                  <div className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-1.5 group-hover:-translate-x-0.5 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#EBF3FE] text-[#2764B8] flex items-center justify-center shrink-0">
                        <Stethoscope className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {language === "ID" ? "Review Narasi Klinis" : "Clinical Narrative Review"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {language === "ID" ? "Sunting & Validasi dr. Sp.PK" : "Edit & Verify by Pathologist"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-200/80 p-3.5 shadow-xs space-y-1.5 group-hover:-translate-x-0.5 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {language === "ID" ? "Korelasi Anamnesis" : "Clinical Correlation"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {language === "ID" ? "100% Otoritas Medis DPJP" : "100% Attending Authority"}
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

                {/* Right Unified Sign-Off Card */}
                <div className="w-full sm:w-[46%] rounded-2xl bg-white border border-slate-200/80 p-4 shadow-sm space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === "ID" ? "Otorisasi & Rilis Resmi" : "Official Sign-Off"}
                  </p>

                  {[
                    {
                      icon: BadgeCheck,
                      title: language === "ID" ? "Tanda Tangan BSrE" : "BSrE Digital E-Sign",
                      tag: "Valid",
                    },
                    {
                      icon: FileCheck2,
                      title: language === "ID" ? "Rilis ke SIMRS" : "EMR Release",
                      tag: "Auto",
                    },
                    {
                      icon: Server,
                      title: language === "ID" ? "Kirim SATUSEHAT" : "SATUSEHAT Sync",
                      tag: "FHIR R4",
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
