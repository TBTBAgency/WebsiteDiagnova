"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  Network,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Server,
  FileText,
  Lock,
  BarChart3,
  TrendingUp,
  Cpu,
  ChevronRight,
  Check,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function PlatformPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Standardized PageHero (Clean Medical SaaS)
          ══════════════════════════════════════════════════════════════ */}
      <PageHero
        badge={language === "ID" ? "Platform Diagnova" : "Diagnova Platform"}
        title={
          language === "ID" ? (
            <>
              Platform Terpadu Pengelolaan{" "}
              <br className="hidden sm:inline" />
              Alur Kerja Laboratorium Modern
            </>
          ) : (
            <>
              One Connected Platform to Manage{" "}
              <br className="hidden sm:inline" />
              Modern Laboratory Workflows
            </>
          )
        }
        subtitle={
          language === "ID"
            ? "Menghubungkan instrumen analyzer, analis medis, dokter patologi, dan SIMRS/RME ke dalam satu alur kerja digital yang presisi, bebas salah sampel, dan terpantau secara real-time."
            : "Connecting medical analyzers, laboratory analysts, pathologists, and hospital HIS/EMR into a unified digital pipeline that is precise, error-free, and monitored in real-time."
        }
        primaryCta={{
          text: language === "ID" ? "Jadwalkan Demo Platform" : "Schedule Platform Demo",
          href: "/request-demo",
        }}
        secondaryCta={{
          text: language === "ID" ? "Pelajari Alur Kerja" : "Explore Workflow",
          href: "#workflow",
        }}
        metrics={[
          {
            value: "-70%",
            label: language === "ID" ? "Pangkas TAT" : "Cut Turnaround Time",
            sub: language === "ID" ? "Dari order ke klinisi" : "Order to clinician",
          },
          {
            value: "100%",
            label: language === "ID" ? "Otomasi Interfacing" : "Direct Interfacing",
            sub: language === "ID" ? "Eliminasi entri manual" : "Zero manual entry",
          },
          {
            value: "0 Error",
            label: language === "ID" ? "Salah Sampel" : "Sample Mix-ups",
            sub: language === "ID" ? "Verifikasi barcode 2D" : "2D barcode check",
          },
          {
            value: "ISO 15189",
            label: language === "ID" ? "Kepatuhan Audit" : "Audit Compliance",
            sub: language === "ID" ? "KARS & JCI compliant" : "KARS & JCI compliant",
          },
        ]}
      />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: #workflow - Alur Kerja 4 Tahap
          (Menggunakan komponen asli Home Page yang rapi & interaktif)
          ══════════════════════════════════════════════════════════════ */}
      <div id="workflow" className="scroll-mt-28">
        <WorkflowSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #automation - 100% Otomatisasi & Interfacing
          (Alternating background: #F9F9F9, Card rounded-3xl)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="automation"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Otomatisasi 100%" : "100% Automation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Interfacing Dua Arah dengan 500+ Instrumen Medis
                </>
              ) : (
                <>
                  Direct Bidirectional Interfacing with 500+ Medical Analyzers
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Mengeliminasi entri data manual sepenuhnya. Diagnova berkomunikasi langsung dua arah dengan instrumen laboratorium melalui protokol HL7 dan ASTM standar internasional."
                : "Completely eliminate manual data entry. Diagnova establishes native two-way communication with any laboratory instrument brand via industry-standard HL7 and ASTM protocols."}
            </p>
          </div>

          {/* 3 Large Characteristic Cards (Matching Comparison/Infrastructure Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Pangkas TAT Hingga 70%" : "Cut Turnaround Time by 70%"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Hasil uji hematologi, kimia darah, dan urin langsung terkirim begitu mesin selesai beroperasi tanpa antrean ketik manual oleh analis."
                    : "Hematology, biochemistry, and urinalysis results stream directly to physician screens upon analyzer completion with zero manual typing."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Bebas antrean ketik analis" : "No typing backlog during peak shifts"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Notifikasi nilai kritis otomatis" : "Real-time critical value alerts"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Auto-Verification Engine" : "Auto-Verification Engine"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Rule engine fleksibel sesuai SOP RS. Spesimen dengan nilai normal dan lolos uji delta-check diverifikasi otomatis sehingga dokter fokus pada kasus darurat."
                    : "Flexible rule engine matching your hospital SOPs. Samples within normal limits and passing delta checks verify automatically, freeing doctors for complex cases."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Konfigurasi delta-check RS" : "Hospital-specific delta checks"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Pemisahan kasus abnormal instan" : "Instant abnormal sample triage"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Resilient Edge Buffer" : "Resilient Edge Buffer"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Koneksi jaringan terganggu? Diagnova Gateway menyimpan data analyzer di buffer edge lokal dan menyinkronkan seluruh paket data begitu jaringan pulih."
                    : "Network instability? Diagnova's edge gateway locally buffers analyzer transmissions and resyncs all data packets upon reconnection with zero data loss."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Toleransi offline hingga 72 jam" : "Offline resilience up to 72 hours"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Uptime operasional lab 99,9%" : "99.9% laboratory operational uptime"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: #reporting - Digital Audit Trail & Medical Reporting
          (Clean Healthcare White Background, Real Medical Specimen Card)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="reporting"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Context & Accreditation Details */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="mb-4">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kepatuhan & Akreditasi" : "Compliance & Accreditation"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
                {language === "ID" ? (
                  <>
                    Jejak Audit Digital Permanen,
                    <br />
                    Standar KARS &amp; ISO 15189
                  </>
                ) : (
                  <>
                    Permanent Digital Audit Trail,
                    <br />
                    KARS &amp; ISO 15189 Ready
                  </>
                )}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
                {language === "ID"
                  ? "Transparansi penuh untuk setiap tindakan laboratorium. Setiap perubahan hasil, kalibrasi alat, dan approval dokter tercatat permanen dengan cap waktu (timestamp) hingga milidetik."
                  : "Absolute transparency for every clinical action. Every result change, instrument calibration, and physician sign-off is permanently recorded with millisecond-level timestamps."}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[20px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#2764B8] font-bold text-sm">
                    <Lock className="h-4 w-4" />
                    <span>{language === "ID" ? "Log Anti-Manipulasi" : "Tamper-Proof Logs"}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Catatan historis tidak dapat diedit atau dihapus, memenuhi persyaratan akreditasi KARS & JCI."
                      : "Historical entries cannot be altered or purged, satisfying KARS & JCI accreditation criteria."}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#2764B8] font-bold text-sm">
                    <FileCheck2 className="h-4 w-4" />
                    <span>{language === "ID" ? "E-Sign Dokter Bersertifikat" : "Certified E-Signatures"}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {language === "ID"
                      ? "Tanda tangan digital dokter Sp.PK dengan QR verifikasi keaslian langsung pada lembar hasil."
                      : "Certified pathologist e-signatures with instant QR-code verification on patient reports."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Clinical Specimen Timeline Card (Bukan Terminal Hitam) */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-7 shadow-xs">
                {/* Specimen Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {language === "ID" ? "Rekam Jejak Spesimen" : "Specimen Audit Log"}
                    </span>
                    <h4 className="font-display text-base font-bold text-slate-900 mt-0.5">
                      #DX-98214 — Darah Lengkap &amp; Kimia Klinik
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{language === "ID" ? "Terverifikasi" : "Verified"}</span>
                  </span>
                </div>

                {/* Clean Medical Timeline Steps */}
                <div className="space-y-4">
                  <div className="relative pl-6 border-l-2 border-[#2764B8]">
                    <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#2764B8] ring-4 ring-blue-50" />
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                      <span>08:14:22 WIB</span>
                      <span className="font-semibold text-[#2764B8]">Dr. dr. Handoko, Sp.PK</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900">
                      {language === "ID"
                        ? "Validasi E-Sign & Rilis Otomatis ke RME SIMRS"
                        : "E-Signature Validated & Auto-Released to HIS EMR"}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                      {language === "ID"
                        ? "Kriptografi: SHA-256 Valid • Tersertifikasi BSrE BSSN & Kemenkes"
                        : "Cryptography: SHA-256 Valid • Certified by BSrE & MoH"}
                    </p>
                  </div>

                  <div className="relative pl-6 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-400" />
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                      <span>08:11:05 WIB</span>
                      <span className="font-medium text-slate-700">Sysmex XN-1000 Interface</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">
                      {language === "ID"
                        ? "Nilai Analyzer Diterima: Hb 14.2 g/dL, Leuko 7.400 /uL (Pass QC)"
                        : "Analyzer Values Ingested: Hb 14.2 g/dL, WBC 7,400 /uL (Pass QC)"}
                    </p>
                  </div>

                  <div className="relative pl-6 border-l-2 border-slate-200">
                    <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-400" />
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                      <span>08:02:18 WIB</span>
                      <span className="font-medium text-slate-700">Siti N., A.Md.AK (Analis Lab)</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">
                      {language === "ID"
                        ? "Barcode Dipindai & Masuk Antrean Sentrifugasi Rack #B-04"
                        : "Barcode Scanned & Assigned to Centrifuge Rack #B-04"}
                    </p>
                  </div>

                  <div className="relative pl-6">
                    <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-slate-400" />
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-0.5">
                      <span>07:55:00 WIB</span>
                      <span className="font-medium text-slate-700">Bridging SIMRS IGD</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800">
                      {language === "ID"
                        ? "Order Masuk dari dr. Jaga IGD (Pasien: Bpk. Suryadi / RM-44912)"
                        : "Inbound Order from ER (Patient: Mr. Suryadi / MRN-44912)"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Standar: Permenkes 24/2022 &amp; HL7 FHIR</span>
                  <span className="font-semibold text-[#2764B8]">SATUSEHAT Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: #analytics - Nova AI & Analitik Operasional
          (Alternating background: #F9F9F9)
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="analytics"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="mb-10 sm:mb-14">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Nova AI & Analitik" : "Nova AI & Analytics"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>
                  Wawasan Operasional &amp; Asisten Klinis Nova AI
                </>
              ) : (
                <>
                  Operational Insights &amp; Nova AI Clinical Intelligence
                </>
              )}
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 font-normal">
              {language === "ID"
                ? "Mengubah jutaan titik data pemeriksaan laboratorium menjadi wawasan strategis. Memantau utilisasi instrumen, efisiensi reagen, dan membantu dokter mendeteksi lonjakan biomarker kritis."
                : "Transforming millions of laboratory data points into actionable intelligence. Monitor analyzer utilization, reagent efficiency, and empower clinicians with rapid anomaly detection."}
            </p>
          </div>

          {/* 3 Intelligence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "TAT Real-Time & Bottleneck Heatmap" : "TAT Real-Time & Bottleneck Heatmap"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Pantau durasi sampel per departemen (IGD, Rawat Inap, Rawat Jalan). Kenali secara visual tahap yang menyebabkan penundaan sebelum mengganggu alur pelayanan pasien."
                    : "Monitor specimen turnaround across ER, Inpatient, and Clinics. Pinpoint bottlenecks before they impact patient care."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Monitoring Live Per Shift" : "Live Shift Monitoring"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Beban Instrumen & Utilisasi Reagen" : "Analyzer Load & Reagent Tracking"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Kalkulasi otomatis jumlah tes per reagen, masa kadaluarsa, dan distribusi beban kerja antar mesin agar throughput laboratorium beroperasi maksimal tanpa reagen terbuang."
                    : "Automatic tracking of tests per reagent cartridge, expiry dates, and load distribution across machines to maximize throughput with zero wastage."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Zero Reagent Wastage" : "Zero Reagent Wastage"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.12)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center mb-6 shadow-xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5">
                  {language === "ID" ? "Nova AI Clinical Delta Check" : "Nova AI Clinical Delta Check"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {language === "ID"
                    ? "Nova AI mendeteksi lonjakan nilai abnormal terhadap riwayat lampau pasien, menyajikan peringatan dini, dan merangkum narasi medis. Keputusan akhir tetap 100% pada dokter."
                    : "Nova AI detects abnormal biomarker spikes against past patient history, offering early alerts while leaving 100% of clinical decisions with physicians."}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "AI Membantu, Dokter Memutuskan" : "AI Assists, Doctors Decide"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION: Seamlessly connects to Footer
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
