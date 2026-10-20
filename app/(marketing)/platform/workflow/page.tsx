"use client";

import React from "react";
import Link from "next/link";
import {
  QrCode,
  Filter,
  Cpu,
  CheckCheck,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PlatformWorkflowPage() {
  const { language } = useLanguage();

  const technicalStages = [
    {
      step: "01",
      tag: language === "ID" ? "Pra-Analitik" : "Pre-Analytic",
      title:
        language === "ID"
          ? "Penerimaan & Registrasi Barcode 2D"
          : "Smart Reception & 2D Barcode Registration",
      desc:
        language === "ID"
          ? "Spesimen diterima langsung dari IGD, Rawat Inap, atau Poliklinik, dicocokkan otomatis dengan nomor order SIMRS, dan dicetak label barcode 2D anti-luntur."
          : "Specimens received from ER, Inpatient, or Clinics are matched automatically with HIS order numbers and tagged with high-durability 2D barcodes.",
      metrics: language === "ID" ? "Nol Salah Spesimen" : "Zero Sample Mix-up",
      icon: <QrCode className="h-5 w-5 text-diagnova-blue" />,
    },
    {
      step: "02",
      tag: language === "ID" ? "Preparasi & Distribusi" : "Preparation & Dispatch",
      title:
        language === "ID"
          ? "Sentrifugasi & Worklist Otomatis"
          : "Automated Centrifugation & Worklists",
      desc:
        language === "ID"
          ? "Setelah preparasi centrifuge, worklist pengujian secara otomatis dikirim ke antarmuka mesin hematologi, kimia klinik, atau urin tanpa ketik ulang."
          : "Following sample prep, testing worklists are automatically dispatched to analyzer queues without manual retyping.",
      metrics: language === "ID" ? "100% Paperless" : "100% Paperless",
      icon: <Filter className="h-5 w-5 text-diagnova-blue" />,
    },
    {
      step: "03",
      tag: language === "ID" ? "Analitik Mesin" : "Analytical Engine",
      title:
        language === "ID"
          ? "Analisis Instrumen & Host Query ASTM/HL7"
          : "Host Query & Real-time Analyzer Interfacing",
      desc:
        language === "ID"
          ? "Instrumen membaca barcode tabung, menarik profil pemeriksaan via protokol ASTM/HL7 secara instan, dan mengembalikan data mentah ke server dalam hitungan detik."
          : "Instruments scan tube barcodes, pull test orders via native ASTM/HL7 protocols, and return raw diagnostic values within seconds.",
      metrics: language === "ID" ? "TAT Pangkas 70%" : "70% Faster TAT",
      icon: <Cpu className="h-5 w-5 text-diagnova-blue" />,
    },
    {
      step: "04",
      tag: language === "ID" ? "Pasca-Analitik" : "Post-Analytic",
      title:
        language === "ID"
          ? "Auto-Verification, Delta Check & Rilis RME"
          : "Auto-Verification, Delta Checks & EMR Sync",
      desc:
        language === "ID"
          ? "Hasil normal diverifikasi otomatis oleh rule-engine kustom. Nilai kritis dan deviasi historis (delta check) langsung dialihkan untuk validasi dokter spesialis patologi."
          : "Normal results are auto-verified instantly. Critical values and historical deviations (delta checks) are immediately routed to pathologists for validation.",
      metrics: language === "ID" ? "Tervalidasi Digital" : "Digitally Certified",
      icon: <CheckCheck className="h-5 w-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-[#F9F9F9]">
      {/* ─── Hero Overview Banner ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C478B] via-[#2568BA] to-[#345DAB] text-white py-14 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-white/95 border border-white/25 shadow-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {language === "ID"
                ? "Arsitektur Alur Kerja Laboratorium Modern"
                : "Modern Laboratory Workflow Architecture"}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-4 sm:mb-6">
            {language === "ID"
              ? "Dari Spesimen Mentah Menjadi Keputusan Klinis Presisi"
              : "From Raw Specimen to Precise Clinical Decisions"}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-white/85 font-light leading-relaxed mb-8">
            {language === "ID"
              ? "Standarisasi 4 tahap alur kerja terotomasi penuh yang memangkas waktu tunggu hasil (TAT), membasmi risiko salah identifikasi sampel, dan menyinkronkan data langsung ke SIMRS & SATUSEHAT."
              : "Standardized 4-stage automated workflow cutting Turnaround Time (TAT) by 70%, eliminating specimen mix-up risks, and seamlessly synchronizing with HIS & SATUSEHAT."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#1C478B] px-6 sm:px-7 py-3 text-xs sm:text-sm font-semibold shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
              <span>{language === "ID" ? "Konsultasi Alur Kerja" : "Schedule Workflow Demo"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#interactive-workflow"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white px-6 sm:px-7 py-3 text-xs sm:text-sm font-semibold transition-all active:scale-95 backdrop-blur-md"
            >
              <span>{language === "ID" ? "Eksplorasi Interaktif ↓" : "Explore Interactive Model ↓"}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Interactive Workflow Canvas Section ─── */}
      <div id="interactive-workflow">
        <WorkflowSection />
      </div>

      {/* ─── Deep-Dive 4-Stage Technical Breakdown ─── */}
      <section className="relative py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <span className="inline-flex items-center rounded-full bg-blue-100/80 border border-blue-200 px-3.5 py-1 text-xs font-semibold text-[#2568BA] uppercase tracking-wider mb-3">
              {language === "ID" ? "Spesifikasi Teknis" : "Technical Specifications"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
              {language === "ID"
                ? "Keunggulan Sistem di Setiap Tahapan Pengujian"
                : "System Strengths at Every Stage of Testing"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {technicalStages.map((stage) => (
              <div
                key={stage.step}
                className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {stage.tag}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#2568BA] transition-colors">
                      Phase {stage.step}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug">
                    {stage.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium text-[#2568BA]">
                    {stage.icon}
                    <span>{stage.metrics}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Diagnova Engine</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Card */}
          <div className="mt-12 sm:mt-16 rounded-3xl bg-gradient-to-r from-[#205295] to-[#2C74B3] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">
                {language === "ID"
                  ? "Ingin Mengoptimalkan Alur Kerja Lab Anda?"
                  : "Ready to Optimize Your Laboratory Workflow?"}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed">
                {language === "ID"
                  ? "Diskusikan konfigurasi analyzer dan integrasi SIMRS rumah sakit Anda bersama spesialis solusi klinis Diagnova."
                  : "Discuss analyzer configurations and HIS integration with Diagnova clinical solution specialists."}
              </p>
            </div>

            <Link
              href="/request-demo"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white text-[#205295] font-semibold px-6 sm:px-8 py-3 text-xs sm:text-sm shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
              <span>{language === "ID" ? "Jadwalkan Diskusi" : "Schedule Consultation"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
