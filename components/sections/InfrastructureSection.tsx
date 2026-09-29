import React from "react";
import { SectionBadge } from "@/components/ui/SectionBadge";

const infraItems = [
  {
    title: "100% Automation",
    description:
      "Direct Analyzer Interfacing and Direct Analyzer Interfacing Auto-Verification Memangkas TAT Hingga 70% Tanpa Input Manual.",
    active: true,
  },
  {
    title: "Seamless Integration",
    description:
      "Native bridging dengan 500+ instrumen lab, SIMRS/HIS, Rekam Medis Elektronik (Permenkes 24/2022), dan SATUSEHAT Kemenkes.",
    active: false,
  },
  {
    title: "Nova AI Assistant",
    description:
      "Nova AI Clinical Platform Provides Early Warning and Critical Value Detection to Support Treatment Decisions by DPJP with 100% Control.",
    active: false,
  },
];

export function InfrastructureSection() {
  return (
    <section className="relative bg-white py-16 sm:py-24 overflow-hidden border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Headline & Label */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div>
              <SectionBadge variant="light">Infrastructure</SectionBadge>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#112E65] tracking-tight leading-[1.2]">
              Intelligent Infrastructure for
              <br />
              Seamless Operations
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md pt-2">
              Arsitektur tangguh berstandar enterprise yang menggabungkan kecepatan konektivitas analyzer lokal
              dengan keandalan integrasi data nasional.
            </p>
          </div>

          {/* Right Column: 3 Vertical Cards Timeline matching Figma */}
          <div className="lg:col-span-7 space-y-4">
            {infraItems.map((item, idx) => {
              if (item.active) {
                return (
                  <div
                    key={idx}
                    className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#2B5DA8] to-[#244F90] p-6 text-white shadow-md shadow-[#2B5DA8]/15 transition-transform duration-200"
                  >
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="rounded-xl sm:rounded-2xl bg-[#EAF3FA] p-6 text-[#112E65] border border-blue-100/80 transition-transform duration-200 hover:bg-[#E3EFF8]"
                >
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#112E65] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
