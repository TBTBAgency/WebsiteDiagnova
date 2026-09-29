import React from "react";
import { Check, X } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";

const traditionalFlaws = [
  "Input data manual & ketik ulang hasil lab rentan human error",
  "Sistem terisolasi tanpa direct interfacing ke mesin analyzer",
  "Hanya mencatat data mentah tanpa validasi delta check cerdas",
  "Risiko downtime tinggi & tidak memiliki offline buffer lokal",
  "Turnaround Time (TAT) lambat & membebani antrean pasien",
];

const diagnovaStrengths = [
  "100% Otomatisasi & direct analyzer interfacing ke 500+ mesin",
  "Seamless native integration dengan SIMRS, RME & SATUSEHAT",
  "Nova AI Clinical Intelligence untuk deteksi nilai kritis dini",
  "Smart Resilient Edge Buffer menjamin 99.9% ketersediaan sistem",
  "Pangkas Turnaround Time hingga 70% secara konsisten",
];

export function ComparisonSection() {
  return (
    <section className="relative bg-white py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
          <SectionBadge variant="light">Comparison</SectionBadge>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#112E65] tracking-tight">
            Why Upgrade to Diagnova?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We resolve the fundamental flaws of traditional Laboratory Information Systems to deliver speed, accuracy, and reliability.
          </p>
        </div>

        {/* 2-Column Side-by-Side Comparison Cards matching Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Left Card: Traditional LIS */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#EAF3FA] p-6 sm:p-8 border border-blue-100 transition-all duration-200">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Conventional System
                </span>
                <h3 className="font-display text-2xl font-bold text-[#112E65]">
                  Traditional LIS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Sistem konvensional yang kaku dan memperlambat operasional lab.
                </p>
              </div>

              {/* Flaws List */}
              <ul className="space-y-3.5 pt-2">
                {traditionalFlaws.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Card: Diagnova */}
          <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#2959AA] via-[#2F65BD] to-[#1E488F] p-6 sm:p-8 text-white shadow-xl shadow-[#204E9B]/15 border border-blue-400/30 transition-all duration-200">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#97CFEE] block mb-1">
                  Next-Gen Intelligence
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  Diagnova Platform
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Ekosistem terintegrasi dengan otomatisasi penuh dan Nova AI.
                </p>
              </div>

              {/* Strengths List */}
              <ul className="space-y-3.5 pt-2">
                {diagnovaStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[#CAE2F1]">
                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
