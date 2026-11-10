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
  Stethoscope,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  BadgeCheck,
  BellRing,
  Sparkles,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";

interface SampleCase {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "low" | "normal" | "high" | "critical";
  statusText: string;
  statusTextEn: string;
  statusBadgeClass: string;
  gaugePercent: number; // 0 to 100% position on the visual bar
  // Delta check history
  prevValue: string;
  prevTime: string;
  prevTimeEn: string;
  deltaText: string;
  isDeltaAlert: boolean;
  isDeltaDrop: boolean;
  // Nova AI Outputs
  physicianNote: string;
  physicianNoteEn: string;
  patientExplanation: string;
  patientExplanationEn: string;
  recommendedAction: string;
  recommendedActionEn: string;
  isPanicValue: boolean;
}

export default function NovaAIPage() {
  const { language } = useLanguage();
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  const sampleCases: SampleCase[] = [
    {
      id: "hb",
      name: "Hemoglobin (Hb)",
      nameEn: "Hemoglobin (Hb)",
      category: "Darah Lengkap",
      categoryEn: "Complete Blood Count",
      value: "8.4",
      unit: "g/dL",
      referenceRange: "12.0 - 16.0 g/dL",
      status: "low",
      statusText: "Rendah • Anemia",
      statusTextEn: "Low • Anemia",
      statusBadgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      gaugePercent: 22,
      prevValue: "10.5 g/dL",
      prevTime: "3 hari lalu",
      prevTimeEn: "3 days ago",
      deltaText: "-2.1 g/dL (-20%)",
      isDeltaAlert: true,
      isDeltaDrop: true,
      physicianNote:
        "Penurunan akut Hb sebesar 20% dalam 72 jam terdeteksi (Delta Check Alert). Disarankan evaluasi kemungkinan perdarahan aktif tersembunyi atau defisiensi besi sebelum tindakan invasif.",
      physicianNoteEn:
        "Acute 20% Hb decline detected within 72 hours (Delta Check Alert). Suggest evaluating for occult blood loss or acute iron deficiency prior to invasive procedures.",
      patientExplanation:
        "Kadar sel darah merah pembawa oksigen berada di bawah batas normal. Tubuh mungkin merasa lebih cepat lemas, lelah, atau pusing.",
      patientExplanationEn:
        "Oxygen-carrying red blood cell levels are below normal. Patients may feel tired, fatigued, or lightheaded.",
      recommendedAction:
        "Konfirmasi feses darah samar & laporkan ke Dokter DPJP.",
      recommendedActionEn:
        "Confirm with occult stool blood check & notify attending physician.",
      isPanicValue: false,
    },
    {
      id: "gdp",
      name: language === "ID" ? "Glukosa Darah Puasa (GDP)" : "Fasting Blood Glucose",
      nameEn: "Fasting Blood Glucose",
      category: "Panel Diabetes",
      categoryEn: "Diabetes Panel",
      value: "186",
      unit: "mg/dL",
      referenceRange: "70 - 100 mg/dL",
      status: "high",
      statusText: "Tinggi • Hiperglikemia",
      statusTextEn: "High • Hyperglycemia",
      statusBadgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      gaugePercent: 86,
      prevValue: "178 mg/dL",
      prevTime: "2 minggu lalu",
      prevTimeEn: "2 weeks ago",
      deltaText: "+8 mg/dL (+4.5%)",
      isDeltaAlert: false,
      isDeltaDrop: false,
      physicianNote:
        "Konsisten tinggi pada 2 kunjungan berturut-turut. Disarankan konfirmasi pemeriksaan HbA1c untuk evaluasi kontrol glikemik jangka panjang.",
      physicianNoteEn:
        "Consistently elevated across past 2 encounters. Confirmatory HbA1c testing advised for long-term glycemic management evaluation.",
      patientExplanation:
        "Kadar gula darah puasa berada di atas batas sehat, menandakan tubuh memerlukan penyesuaian pola makan dan konsultasi dokter berkala.",
      patientExplanationEn:
        "Fasting blood sugar level is above healthy boundaries, indicating that dietary adjustments and medical follow-up are warranted.",
      recommendedAction:
        "Jadwalkan tes HbA1c konfirmasi & evaluasi pola diet.",
      recommendedActionEn:
        "Schedule confirmatory HbA1c test & review dietary intake.",
      isPanicValue: false,
    },
    {
      id: "leuko",
      name: language === "ID" ? "Leukosit (Sel Darah Putih)" : "White Blood Cells (WBC)",
      nameEn: "White Blood Cells (WBC)",
      category: "Deteksi Infeksi",
      categoryEn: "Infection Screening",
      value: "14.800",
      unit: "/µL",
      referenceRange: "4.000 - 10.000 /µL",
      status: "high",
      statusText: "Tinggi • Leukositosis",
      statusTextEn: "High • Leukocytosis",
      statusBadgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      gaugePercent: 88,
      prevValue: "8.200 /µL",
      prevTime: "Kemarin",
      prevTimeEn: "Yesterday",
      deltaText: "+6.600 /µL (+80.4%)",
      isDeltaAlert: true,
      isDeltaDrop: false,
      physicianNote:
        "Lonjakan signifikan sel darah putih dalam 24 jam dengan pergeseran ke kiri (shift to the left). Pertimbangkan evaluasi fokus infeksi bakteri atau peradangan aktif.",
      physicianNoteEn:
        "Significant white blood cell surge in 24 hours with left-shift. Suggest clinical workup for acute bacterial infection or active inflammation.",
      patientExplanation:
        "Jumlah sel darah putih meningkat, menandakan sistem imun tubuh sedang aktif bekerja merespons kemungkinan infeksi atau radang.",
      patientExplanationEn:
        "White blood cell count is elevated, showing the body's immune system is actively responding to potential infection or inflammation.",
      recommendedAction:
        "Evaluasi hitung jenis leukosit & tanda infeksi fisik.",
      recommendedActionEn:
        "Evaluate leukocyte differential & examine physical infection focus.",
      isPanicValue: false,
    },
    {
      id: "plt",
      name: language === "ID" ? "Trombosit (Platelet)" : "Platelets (PLT)",
      nameEn: "Platelets (PLT)",
      category: "Nilai Kritis Darurat",
      categoryEn: "Emergency Critical Alert",
      value: "18.000",
      unit: "/µL",
      referenceRange: "150.000 - 450.000 /µL",
      status: "critical",
      statusText: "NILAI KRITIS (Panic Value)",
      statusTextEn: "CRITICAL PANIC VALUE",
      statusBadgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
      gaugePercent: 8,
      prevValue: "110.000 /µL",
      prevTime: "Kemarin sore",
      prevTimeEn: "Yesterday evening",
      deltaText: "-92.000 /µL (-83.6%)",
      isDeltaAlert: true,
      isDeltaDrop: true,
      physicianNote:
        "NILAI KRITIS DARURAT (Trombosit < 20.000/µL). Risiko tinggi perdarahan spontan. Protokol KARS SKP 2.2: Wajib lapor ke DPJP/IGD dalam waktu < 15 menit.",
      physicianNoteEn:
        "EMERGENCY PANIC VALUE (Platelets < 20,000/µL). High spontaneous bleeding risk. Mandatory KARS SKP 2.2 protocol: alert attending/ER in < 15 minutes.",
      patientExplanation:
        "Kadar keping darah pembeku sangat rendah di bawah batas aman. Diperlukan perhatian dokter segera untuk mencegah komplikasi perdarahan.",
      patientExplanationEn:
        "Platelet count is critically low below safe limits. Immediate medical intervention is essential to prevent bleeding complications.",
      recommendedAction:
        "🚨 Kirim notifikasi darurat langsung ke dokter DPJP / IGD.",
      recommendedActionEn:
        "🚨 Dispatch immediate critical alert to attending physician / ER.",
      isPanicValue: true,
    },
  ];

  const currentCase = sampleCases[selectedCaseIdx];

  const workflowSteps = [
    {
      phase: language === "ID" ? "Amati Pola" : "Observe Patterns",
      title: language === "ID" ? "Membaca Riwayat Pasien" : "Read Patient History",
      description:
        language === "ID"
          ? "Nova AI membandingkan hasil tes terkini dengan rekam jejak pemeriksaan sebelumnya secara longitudinal, bukan sekadar melihat batas normal umum."
          : "Nova AI compares current test results with historical patient data over time, rather than evaluating general population boundaries in isolation.",
      icon: Eye,
    },
    {
      phase: language === "ID" ? "Terjemahkan Data" : "Translate Data",
      title: language === "ID" ? "Merangkum Narasi Klinis" : "Synthesize Clinical Narrative",
      description:
        language === "ID"
          ? "Mengubah deretan angka desimal rumit menjadi rangkuman bahasa medis yang ringkas untuk dokter dan penjelasan yang ramah untuk pasien."
          : "Translates dense decimal series into structured summaries for clinicians and clear explanations for patients.",
      icon: BrainCircuit,
    },
    {
      phase: language === "ID" ? "Peringatan Cepat" : "Early Warning",
      title: language === "ID" ? "Deteksi Nilai Kritis Seketika" : "Instant Panic Value Alert",
      description:
        language === "ID"
          ? "Secara otomatis memicu alarm notifikasi darurat atas nilai kritis (Panic Values) langsung ke dokter jaga agar pasien segera ditangani."
          : "Automatically triggers emergency alerts for critical panic values directly to attending doctors for immediate clinical response.",
      icon: Zap,
    },
    {
      phase: language === "ID" ? "Validasi Dokter" : "Physician Validation",
      title: language === "ID" ? "100% Keputusan di Tangan Dokter" : "100% Physician Sovereignty",
      description:
        language === "ID"
          ? "Seluruh rangkuman diserahkan kepada dokter untuk diperiksa dan disahkan. Nova AI tidak pernah membuat diagnosis atau resep obat mandiri."
          : "Every summary is submitted to attending physicians for review and e-signature. Nova AI never diagnoses or prescribes autonomously.",
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: PageHero
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Asisten Laboratorium Cerdas" : "Intelligent Laboratory Copilot"}
        title={
          language === "ID" ? (
            <>
              AI Membantu Analisis.{" "}
              <br className="hidden sm:inline" />
              Dokter Menentukan Keputusan.
            </>
          ) : (
            <>
              AI Assists Analysis.{" "}
              <br className="hidden sm:inline" />
              Doctors Make the Decisions.
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Nova AI mengubah angka hasil laboratorium yang rumit menjadi narasi ringkas, mendeteksi pergeseran pola delta-check, dan mempercepat respon dokter tanpa menggantikan sentuhan medis manusia."
            : "Nova AI translates complex laboratory data into concise narratives, spots longitudinal delta-check shifts, and speeds up doctor response without replacing human clinical oversight."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Nova AI" : "Schedule Nova AI Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Lihat Contoh Terjemahan" : "See Translation Demo",
          href: "#demo-translation",
        }}
        metrics={[
          {
            value: "100%",
            label: language === "ID" ? "Kendali di Dokter" : "Physician Control",
            sub: language === "ID" ? "Human-in-the-loop mutlak" : "Absolute clinical sovereignty",
          },
          {
            value: language === "ID" ? "< 3 Detik" : "< 3 Sec",
            label: language === "ID" ? "Deteksi Anomali" : "Anomaly Detection",
            sub: language === "ID" ? "Pengecekan riwayat otomatis" : "Automated historical delta check",
          },
          {
            value: "Etis & Transparan",
            label: language === "ID" ? "Standar Medis" : "Medical Ethics",
            sub: language === "ID" ? "Bukan black-box mandiri" : "Explainable clinical logic",
          },
          {
            value: "KARS & JCI",
            label: language === "ID" ? "Kepatuhan Regulasi" : "Regulatory Compliance",
            sub: language === "ID" ? "Standar pelaporan nilai kritis" : "Official panic value reporting",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          NOTICE / REGULATORY ETHICS BANNER (Clean & Clear)
          ══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-amber-50/70 border-b border-amber-200/70 py-3.5 px-4 sm:px-6">
        <div className="mx-auto max-w-[1560px] flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-900 font-medium text-center">
          <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700 shrink-0" />
          <span>
            <strong className="font-bold">
              {language === "ID" ? "Prinsip Etika Medis Diagnova:" : "Diagnova Medical Ethics Principle:"}
            </strong>{" "}
            {language === "ID"
              ? "Nova AI hanya bertugas membantu merangkum pola data dan mendeteksi anomali. Keputusan diagnosis definitif dan terapi pengobatan tetap 100% berada pada dokter yang merawat."
              : "Nova AI solely assists in summarizing trends and detecting anomalies. Definitive diagnosis and treatment decisions remain 100% under attending physician authority."}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: INTERACTIVE BEFORE & AFTER SHOWCASE (#demo-translation)
          (Desain Bersih, Elegan, dan Mudah Dipahami dalam 3 Detik)
          ══════════════════════════════════════════════════════════════ */}
      <section id="demo-translation" className="scroll-mt-32 w-full bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Simulasi Terjemahan Cerdas" : "Intelligent Translation Demo"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Cara Nova AI Mengubah Angka Menjadi Narasi Jelas</>
              ) : (
                <>How Nova AI Turns Complex Numbers Into Clear Narratives</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Pilih parameter pemeriksaan di bawah untuk melihat bagaimana data laboratorium mentah diterjemahkan secara otomatis menjadi catatan medis bagi dokter dan penjelasan mudah bagi pasien."
                : "Select a test parameter below to see how raw lab results are automatically translated into clinical notes for doctors and clear explanations for patients."}
            </p>
          </div>

          {/* 4 Clean Selector Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-3 mb-8">
            {sampleCases.map((c, idx) => {
              const isActive = selectedCaseIdx === idx;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-sm"
                      : "bg-[#F8FBFE] text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Activity className={cn("h-4 w-4", isActive ? "text-white" : "text-[#2764B8]")} />
                  <span>{language === "ID" ? c.name : c.nameEn}</span>
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
                </button>
              );
            })}
          </div>

          {/* Clean Side-by-Side Comparison: Data Mentah vs Olahan Nova AI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* ─── KARTU KIRI: Data Laboratorium (Visual & Jelas) ─── */}
            <div className="lg:col-span-5 rounded-[28px] sm:rounded-[32px] bg-[#F8FBFE] border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Header Kartu */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {language === "ID" ? "Hasil Uji Laboratorium" : "Raw Laboratory Result"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {language === "ID" ? currentCase.category : currentCase.categoryEn}
                  </span>
                </div>

                {/* Nama Parameter & Nilai Utama */}
                <div className="mt-5 space-y-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    {language === "ID" ? currentCase.name : currentCase.nameEn}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-4xl sm:text-5xl font-extrabold text-[#345DAB] tracking-tight">
                      {currentCase.value}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-500">
                      {currentCase.unit}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-block text-xs font-semibold px-3 py-1 rounded-full border",
                        currentCase.statusBadgeClass
                      )}
                    >
                      {language === "ID" ? currentCase.statusText : currentCase.statusTextEn}
                    </span>
                    <span className="text-xs text-slate-400">
                      (Ref: {currentCase.referenceRange})
                    </span>
                  </div>
                </div>

                {/* Visual Gauge Bar: Menunjukkan posisi nilai secara intuitif */}
                <div className="mt-7 pt-5 border-t border-slate-200/80 space-y-2">
                  <div className="flex justify-between text-[11px] font-medium text-slate-400">
                    <span>{language === "ID" ? "Rendah" : "Low"}</span>
                    <span className="text-emerald-700 font-semibold">{language === "ID" ? "Rentang Normal" : "Normal Range"}</span>
                    <span>{language === "ID" ? "Tinggi" : "High"}</span>
                  </div>
                  <div className="relative h-2.5 w-full rounded-full bg-slate-200 overflow-hidden flex">
                    <div className="w-1/4 bg-amber-200" />
                    <div className="w-2/4 bg-emerald-200" />
                    <div className="w-1/4 bg-rose-200" />
                  </div>
                  {/* Gauge Pointer Pin */}
                  <div className="relative w-full h-4">
                    <div
                      className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                      style={{ left: `${currentCase.gaugePercent}%` }}
                    >
                      <span className="h-2 w-2 rounded-full bg-[#2764B8] ring-2 ring-white shadow-xs" />
                      <span className="text-[10px] font-bold text-[#2764B8] font-mono mt-0.5">
                        {currentCase.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Komparasi Riwayat Pasien (Delta-Check) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-[#2764B8]" />
                    {language === "ID" ? "Komparasi Riwayat Lampau (Delta Check):" : "Historical Delta Check:"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-light">
                    {language === "ID" ? currentCase.prevTime : currentCase.prevTimeEn}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500">
                    {language === "ID" ? "Hasil Sebelumnya:" : "Previous:"}{" "}
                    <strong className="text-slate-800 font-mono">{currentCase.prevValue}</strong>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-blue-50 text-[#2764B8]">
                    {currentCase.isDeltaDrop ? (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    ) : (
                      <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                    )}
                    <span>{currentCase.deltaText}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── KARTU KANAN: Hasil Rangkuman Cerdas Nova AI ─── */}
            <div className="lg:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white border border-blue-200/80 p-6 sm:p-9 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Header Kartu Kanan */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-[#2764B8]">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === "ID" ? "Interpretasi & Narasi Nova AI" : "Nova AI Structured Narrative"}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {language === "ID" ? "✓ Siap Diverifikasi" : "✓ Ready for Doctor Review"}
                  </span>
                </div>

                {/* 1. Catatan Medis untuk Dokter */}
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#345DAB] uppercase tracking-wider">
                    <Stethoscope className="h-4 w-4 text-[#2764B8]" />
                    <span>{language === "ID" ? "Catatan untuk Dokter Penanggung Jawab:" : "Clinical Note for Attending Physician:"}</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                    &ldquo;{language === "ID" ? currentCase.physicianNote : currentCase.physicianNoteEn}&rdquo;
                  </p>
                </div>

                {/* 2. Penjelasan Bahasa Awam untuk Pasien */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>{language === "ID" ? "Penjelasan Bahasa Jelas untuk Pasien:" : "Clear Plain-Language for Patients:"}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {language === "ID" ? currentCase.patientExplanation : currentCase.patientExplanationEn}
                  </p>
                </div>

                {/* 3. Rekomendasi Tindak Lanjut */}
                <div className="flex items-start gap-2.5 text-xs text-slate-600 pt-1">
                  <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">
                      {language === "ID" ? "Saran Tindak Lanjut: " : "Actionable Suggestion: "}
                    </strong>
                    <span>
                      {language === "ID" ? currentCase.recommendedAction : currentCase.recommendedActionEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Bawah */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-sm font-semibold shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>{language === "ID" ? "Coba Demo dengan Data Laboratorium Anda" : "Test Demo with Your Lab Data"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="text-xs font-semibold text-slate-600 hover:text-[#2764B8] transition-colors"
                >
                  {language === "ID" ? "Pelajari 4 Tahap Alur Kerja ↓" : "Explore 4-Stage Workflow ↓"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: 4 TAHAP CARA KERJA (#how-it-works)
          (Bersih, Luas, Tanpa Angka yang Membingungkan)
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
                {language === "ID" ? "Alur 4 Tahap" : "4-Stage Workflow"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Alur Kerja Terstruktur yang Menjamin Keselamatan Pasien</>
              ) : (
                <>Structured Pipeline Safeguarding Clinical Integrity</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Bagaimana Nova AI memproses data laboratorium dari instrumen analyzer hingga verifikasi dokter akhir secara transparan dan bertanggung jawab."
                : "How Nova AI processes telemetry from raw analyzer outputs to final physician verification with transparency and accountability."}
            </p>
          </div>

          {/* 4 Clean Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((ws) => {
              const IconComponent = ws.icon;
              return (
                <div
                  key={ws.phase}
                  className="rounded-[28px] bg-white border border-slate-200/90 p-7 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center shadow-xs">
                      <IconComponent className="h-6 w-6" />
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

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{language === "ID" ? "Terintegrasi Penuh" : "Fully Integrated"}</span>
                    <Check className="h-3.5 w-3.5 text-[#2764B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: AI + DOKTER: ETIKA & KOLABORASI (#ai-doctor)
          (Visual Bersih, Human-in-the-Loop, Jelas Pembagian Perannya)
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
                {language === "ID" ? "Etika Medis & Kolaborasi" : "Medical Ethics & Collaboration"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Mengapa Dokter Tetap Menjadi Pengambil Keputusan Tertinggi?</>
              ) : (
                <>Why Physicians Retain Ultimate Medical Authority</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Algoritma AI memiliki keunggulan luar biasa dalam memproses jutaan titik data secara cepat. Namun, pertimbangan klinis holistik—termasuk kondisi fisik pasien, riwayat gejala, dan konteks medis—hanya dapat dievaluasi secara utuh oleh dokter manusia."
                : "While AI excels at scanning longitudinal trends and spotting delta deviations instantly, holistic clinical judgment requires human medical expertise and direct patient context."}
            </p>
          </div>

          {/* Two Clean Distinct Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Peran Nova AI */}
            <div className="rounded-[28px] bg-[#F8FBFE] border border-blue-100/90 p-7 sm:p-9 space-y-6 shadow-2xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-blue-100/80">
                <div className="h-12 w-12 rounded-2xl bg-white border border-blue-200/70 text-[#2764B8] flex items-center justify-center shadow-xs">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {language === "ID" ? "Peran Nova AI (Asisten Analitis)" : "Role of Nova AI (Analytical Copilot)"}
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    {language === "ID" ? "Kecepatan Komputasi & Deteksi Dini" : "High-Speed Computing & Pattern Detection"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Memindai data biomarker dan riwayat tes lampau dalam hitungan milidetik."
                      : "Scans biomarker readings and longitudinal patient timelines in milliseconds."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Mendeteksi lonjakan anomali delta-check sebelum timbul komplikasi klinis."
                      : "Detects acute delta-check deviations before complications escalate."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Merangkum angka desimal rumit menjadi draf narasi siap baca untuk dokter."
                      : "Synthesizes dense telemetry tables into concise executive summaries for physicians."}
                  </span>
                </div>
              </div>

              {/* Batasan Mutlak */}
              <div className="pt-4 border-t border-blue-100/80 space-y-2 text-xs text-slate-600">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">
                  {language === "ID" ? "Batasan Etis:" : "Strict Guardrails:"}
                </span>
                <p className="italic">
                  {language === "ID"
                    ? "Nova AI tidak pernah mendiagnosis secara mandiri atau meresepkan obat."
                    : "Nova AI never issues autonomous diagnoses or writes prescriptions."}
                </p>
              </div>
            </div>

            {/* Peran Dokter */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-9 space-y-6 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {language === "ID" ? "Peran Dokter (Otoritas Mutlak)" : "Role of Physician (Clinical Authority)"}
                  </h3>
                  <p className="text-xs text-slate-500 font-light">
                    {language === "ID" ? "Keputusan Medis, Diagnosis & Terapi" : "Clinical Judgment, Diagnosis & Therapy"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Mengevaluasi keabsahan temuan AI dengan kondisi fisik riil pasien."
                      : "Evaluates AI findings against direct patient examination and clinical history."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Menentukan diagnosis definitif dan merumuskan rencana terapi pengobatan."
                      : "Establishes definitive diagnoses and prescribes comprehensive treatment plans."}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {language === "ID"
                      ? "Mengesahkan lembar hasil laboratorium dengan tanda tangan digital resmi."
                      : "Authorizes final patient reports with legal digital signatures."}
                  </span>
                </div>
              </div>

              {/* Tanggung Jawab Hukum */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">
                  {language === "ID" ? "Akuntabilitas Hukum:" : "Legal Accountability:"}
                </span>
                <p>
                  {language === "ID"
                    ? "Tanggung jawab hukum atas keputusan klinis tetap 100% berada pada dokter penanggung jawab."
                    : "Legal responsibility for medical decisions rests 100% with attending clinical practitioners."}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Simple Regulatory Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2764B8] shrink-0" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">UU Kesehatan No. 17/2023</span>
                <span className="text-[11px] text-slate-500 font-light">
                  {language === "ID" ? "Kepastian hukum tenaga medis" : "Medical practitioner accountability"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2764B8] shrink-0" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">Permenkes No. 24/2022</span>
                <span className="text-[11px] text-slate-500 font-light">
                  {language === "ID" ? "Standar RME & SATUSEHAT" : "EMR & SATUSEHAT compliance"}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FBFE] border border-blue-100/80 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#2764B8] shrink-0" />
              <div>
                <span className="font-bold text-xs text-slate-900 block">KARS & JCI</span>
                <span className="text-[11px] text-slate-500 font-light">
                  {language === "ID" ? "Pelaporan nilai kritis resmi" : "Accredited panic value protocol"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
