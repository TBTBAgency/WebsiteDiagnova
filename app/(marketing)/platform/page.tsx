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
  Workflow,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { CTABanner } from "@/components/sections/CTABanner";

export default function PlatformPage() {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION: Tenang, Lega, Fokus pada Proposisi Nilai
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-14 sm:pb-18 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Section Badge */}
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Platform Diagnova" : "Diagnova Platform"}
              </SectionBadge>
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold leading-[1.15] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
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
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl font-light">
              {language === "ID"
                ? "Menghubungkan instrumen analyzer, analis medis, dokter patologi, dan SIMRS/RME ke dalam satu alur kerja digital yang presisi, bebas salah sampel, dan terpantau secara real-time."
                : "Connecting medical analyzers, laboratory analysts, pathologists, and hospital HIS/EMR into a unified digital pipeline that is precise, error-free, and monitored in real time."}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>{language === "ID" ? "Jadwalkan Demo Platform" : "Schedule Platform Demo"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
              >
                <span>{language === "ID" ? "Pelajari Alur Kerja" : "Explore Workflow"}</span>
              </a>
            </div>

            {/* Quality Reassurance Pills */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-[#2764B8]" />
                {language === "ID" ? "Pangkas TAT hingga 70%" : "Cut TAT up to 70%"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-[#2764B8]" />
                {language === "ID" ? "Otomasi Interfacing 100%" : "100% Direct Interfacing"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-[#2764B8]" />
                {language === "ID" ? "Zero Salah Sampel" : "Zero Specimen Mix-ups"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-[#2764B8]" />
                {language === "ID" ? "Kepatuhan KARS & ISO 15189" : "KARS & ISO 15189 Compliant"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: #workflow - Alur Kerja 4 Tahap
          ══════════════════════════════════════════════════════════════ */}
      <div id="workflow" className="scroll-mt-28">
        <WorkflowSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: #automation - Otomatisasi & Interfacing Analyzer
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="automation"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Otomatisasi 100%" : "100% Automation"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Interfacing Langsung Dua Arah Tanpa Ketik Ulang</>
              ) : (
                <>Native Two-Way Analyzer Interfacing with Zero Typing</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Mengeliminasi entri data manual sepenuhnya. Diagnova berkomunikasi langsung dua arah dengan instrumen laboratorium melalui protokol HL7 dan ASTM standar internasional."
                : "Eliminates manual typing errors completely. Diagnova establishes native bidirectional communication with laboratory instruments via HL7 and ASTM protocols."}
            </p>
          </div>

          {/* 3 Clear, Informative Pillar Cards with Visual Anchors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Pangkas TAT Hingga 70%" : "Cut Turnaround Time by 70%"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Hasil uji hematologi, kimia darah, dan urin langsung mengalir ke layar klinisi begitu mesin selesai beroperasi, tanpa antrean ketik manual."
                      : "Results stream directly to clinicians upon analyzer completion with zero manual backlog during peak hours."}
                  </p>
                </div>

                {/* Mini Flow Indicator */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Order SIMRS</span>
                  <span className="text-[#2764B8]">➔</span>
                  <span>Mesin Uji</span>
                  <span className="text-[#2764B8]">➔</span>
                  <span className="text-emerald-600 font-bold">Hasil Rilis</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Bebas antrean ketik analis saat shift padat" : "Zero typing backlog during peak shifts"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Notifikasi nilai kritis otomatis ke DPJP" : "Automated critical panic value alerts"}</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Auto-Verification Engine" : "Auto-Verification Engine"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Spesimen dengan nilai normal dan lolos uji delta-check diverifikasi otomatis oleh sistem, sehingga dokter patolog dapat fokus pada kasus abnormal & darurat."
                      : "Normal results passing delta checks verify automatically, freeing pathologists to dedicate attention to abnormal and emergency cases."}
                  </p>
                </div>

                {/* Mini Rule Indicator */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Hasil Normal</span>
                  <span className="text-emerald-600 font-bold">Auto-Release</span>
                  <span className="text-slate-300">•</span>
                  <span>Abnormal</span>
                  <span className="text-amber-600 font-bold">Triage Dokter</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Konfigurasi aturan fleksibel sesuai SOP RS" : "Configurable to your hospital clinical SOPs"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Pengecekan lonjakan biomarker (delta check)" : "Longitudinal delta check validation"}</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <Server className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Resilient Edge Gateway" : "Resilient Edge Gateway"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Jika koneksi internet rumah sakit terganggu, edge gateway menyimpan data analyzer di buffer lokal dan menyinkronkan secara otomatis begitu jaringan pulih."
                      : "If hospital internet fluctuates, edge gateways buffer data locally and resynchronize automatically once connection restores with zero packet loss."}
                  </p>
                </div>

                {/* Mini Resilience Indicator */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Buffer Lokal</span>
                  <span className="text-[#345DAB] font-bold">Hingga 72 Jam</span>
                  <span className="text-slate-300">•</span>
                  <span>Uptime</span>
                  <span className="text-emerald-600 font-bold">99.9%</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Operasional lab tetap berjalan saat offline" : "Continuous testing during network downtime"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#2764B8] shrink-0" />
                  <span>{language === "ID" ? "Jaminan data tidak hilang (zero data loss)" : "Guaranteed zero data loss on reconnect"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: #reporting - Kepatuhan & Jejak Audit Digital
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="reporting"
        className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Context & Accreditation Details */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
              <div className="mb-1">
                <SectionBadge variant="blue">
                  {language === "ID" ? "Kepatuhan & Akreditasi" : "Compliance & Accreditation"}
                </SectionBadge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
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
              <p className="text-sm sm:text-base text-slate-500 font-light leading-relaxed">
                {language === "ID"
                  ? "Transparansi penuh untuk setiap tindakan laboratorium. Setiap perubahan hasil, pengujian ulang, dan persetujuan dokter tercatat permanen dengan cap waktu (timestamp) resmi yang tidak dapat diubah."
                  : "Absolute transparency for every clinical action. Result modifications, re-tests, and pathologist approvals are logged with tamper-proof timestamps."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-[24px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#345DAB] font-bold text-sm">
                    <Lock className="h-4 w-4" />
                    <span>{language === "ID" ? "Log Anti-Manipulasi" : "Tamper-Proof Logs"}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {language === "ID"
                      ? "Catatan historis tersimpan permanen untuk kepatuhan surveior KARS, JCI, dan ISO."
                      : "Historical records are immutable, satisfying KARS, JCI, and ISO survey requirements."}
                  </p>
                </div>

                <div className="rounded-[24px] bg-[#F8FBFE] border border-blue-100/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[#345DAB] font-bold text-sm">
                    <FileCheck2 className="h-4 w-4" />
                    <span>{language === "ID" ? "E-Sign Dokter Bersertifikat" : "Certified E-Signatures"}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {language === "ID"
                      ? "Tanda tangan elektronik dokter Sp.PK dengan QR verifikasi keaslian lembar hasil."
                      : "Certified pathologist e-signatures with instant QR-code report verification."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Specimen Timeline Card */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] sm:rounded-[36px] bg-[#F5F8FC] border border-slate-200/90 p-7 sm:p-9 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {language === "ID" ? "Simulasi Jejak Spesimen" : "Specimen Audit Trail"}
                    </span>
                    <h4 className="font-display text-base font-bold text-slate-900 mt-0.5">
                      #DX-98214 — Darah Lengkap &amp; Kimia Darah
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{language === "ID" ? "Rilis Terverifikasi" : "Verified Release"}</span>
                  </span>
                </div>

                {/* 4 Clean Steps */}
                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>08:14 WIB</span>
                        <span className="font-semibold text-[#2764B8]">dr. Sp.PK</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {language === "ID" ? "Validasi E-Sign & Rilis ke SIMRS / SATUSEHAT" : "E-Sign Validation & Auto-Release to HIS / SATUSEHAT"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-[#2764B8] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>08:11 WIB</span>
                        <span>Sysmex XN-1000 (ASTM)</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {language === "ID" ? "Hasil Analyzer Diterima & Lolos Delta-Check" : "Analyzer Data Ingested & Delta-Check Passed"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>08:02 WIB</span>
                        <span>Analis Medis</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {language === "ID" ? "Pindai Barcode Tabung & Masuk Mesin Sentrifugasi" : "Barcode Scanned & Assigned to Centrifuge"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-3 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>07:55 WIB</span>
                        <span>SIMRS Bridging</span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {language === "ID" ? "Order Pemeriksaan Masuk dari IGD" : "Order Received from Emergency Department"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Permenkes 24/2022 &amp; HL7 FHIR</span>
                  <span className="font-semibold text-slate-700">SATUSEHAT Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: #analytics - Analitik Operasional & Nova AI
          ══════════════════════════════════════════════════════════════ */}
      <section
        id="analytics"
        className="scroll-mt-28 w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
      >
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4">
              <SectionBadge variant="blue">
                {language === "ID" ? "Nova AI & Analitik" : "Nova AI & Analytics"}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-[#345DAB]">
              {language === "ID" ? (
                <>Wawasan Operasional &amp; Asisten Klinis Cerdas</>
              ) : (
                <>Operational Intelligence &amp; Nova AI Assistant</>
              )}
            </h2>
            <p className="mt-3 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 font-light">
              {language === "ID"
                ? "Mengubah ribuan titik data laboratorium menjadi wawasan yang dapat ditindaklanjuti. Memantau utilisasi instrumen, efisiensi reagen, dan membantu dokter mengenali lonjakan nilai kritis lebih awal."
                : "Turns complex laboratory telemetry into actionable intelligence. Monitor analyzer utilization, reagent burn rates, and assist physicians in identifying critical anomalies earlier."}
            </p>
          </div>

          {/* 3 Intelligence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Pemantauan TAT Real-Time" : "Real-Time TAT Monitoring"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Kenali tahap alur kerja yang mengalami penundaan (bottleneck) secara visual sebelum memengaruhi kecepatan pelayanan pasien IGD atau rawat inap."
                      : "Visually pinpoint workflow bottlenecks across ER and inpatient orders before they impact clinical care turnaround."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600">Pasien Darurat IGD</span>
                  <span className="text-emerald-600 font-bold">&lt; 25 Menit (Optimal)</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Dashboard Live Per Shift" : "Live Shift Dashboard"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Beban Instrumen & Utilisasi" : "Analyzer Load & Efficiency"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Distribusi beban kerja otomatis antar-analyzer untuk mencegah penumpukan sampel di satu instrumen dan meminimalkan reagen terbuang."
                      : "Automatic workload balancing across analyzers to prevent instrument queue spikes and eliminate expired reagent wastage."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600">Efisiensi Reagen</span>
                  <span className="text-[#345DAB] font-bold">Zero Reagent Wastage</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Optimasi Utilisasi Mesin" : "Analyzer Optimization"}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-[28px] bg-white border border-slate-200/90 p-7 sm:p-8 shadow-xs hover:border-blue-200/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                    {language === "ID" ? "Nova AI Clinical Copilot" : "Nova AI Clinical Copilot"}
                  </h3>
                  <p className="text-sm text-slate-500 font-light leading-relaxed mt-2">
                    {language === "ID"
                      ? "Mendeteksi lonjakan nilai abnormal terhadap riwayat lampau pasien dan merangkum narasi medis. Keputusan akhir tetap 100% pada dokter."
                      : "Detects longitudinal biomarker shifts against past patient records while leaving 100% of clinical decisions with physicians."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-600">Prinsip AI</span>
                  <span className="text-amber-600 font-bold">AI Membantu, Dokter Memutuskan</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2764B8]">
                <span>{language === "ID" ? "Pelajari Nova AI" : "Explore Nova AI"}</span>
                <ChevronRight className="h-4 w-4" />
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
