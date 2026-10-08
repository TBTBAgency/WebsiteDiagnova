"use client";

import React, { useEffect, useRef, useState } from "react";

interface ComparisonPoint {
  number: string;
  title: string;
  description: string;
}

const conventionalDrawbacks: ComparisonPoint[] = [
  {
    number: "01",
    title: "Integrasi Terbatas",
    description:
      "Terisolasi dari HMIS/RME, memicu duplikasi input data pasien.",
  },
  {
    number: "02",
    title: "Ketergantungan Input Manual",
    description:
      "Proses registrasi & entry ketik manual; risiko human error & TAT lambat.",
  },
  {
    number: "03",
    title: "Infrastruktur & Koneksi Rentan",
    description:
      "Koneksi analyzer sering terputus, downtime tinggi & terikat tim IT lokal.",
  },
  {
    number: "04",
    title: "Dukungan IT & SDM Lemah",
    description:
      "Support teknis lambat, kompetensi bervariasi & resistensi pengguna.",
  },
  {
    number: "05",
    title: "Audit Trail & Pelaporan Minim",
    description:
      "Riwayat medis tidak lengkap dan pelacakan revisi hasil tidak ketat.",
  },
  {
    number: "06",
    title: "Biaya High-CapEx & Lock-in",
    description:
      "Instalasi awal mahal, kontrak kaku & tidak mendukung alat lama.",
  },
];

const diagnovaAdvantages: ComparisonPoint[] = [
  {
    number: "01",
    title: "Seamless Native Integration",
    description:
      "Bridging otomatis dengan SIMRS, RME & siap terhubung SATUSEHAT.",
  },
  {
    number: "02",
    title: "100% Otomatisasi & Barcode",
    description:
      "Direct analyzer interfacing & auto-verification memangkas TAT 70%.",
  },
  {
    number: "03",
    title: "Smart Gateway Resilient",
    description:
      "Protokol HL7/ASTM dengan Offline-Buffer Mode jamin uptime 99.9%.",
  },
  {
    number: "04",
    title: "SLA Dedicated 24/7 & UX Intuitif",
    description:
      "Pendampingan teknis responsif & interface mudah dipelajari analis.",
  },
  {
    number: "05",
    title: "Full Digital Audit Trail",
    description:
      "Rekam jejak digital transparan untuk setiap perubahan hasil sampel.",
  },
  {
    number: "06",
    title: "Skema Fleksibel & Universal",
    description:
      "Model SaaS terjangkau & kompatibel dengan 500+ instrumen medis.",
  },
];

export function ComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white pt-1 sm:pt-2 lg:pt-3 pb-10 sm:pb-12 lg:pb-14 border-b border-slate-100 flex flex-col justify-center"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 w-full">
        {/* Section Header */}
        <div
          className={`mb-6 sm:mb-8 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <span className="mb-2.5 inline-flex items-center rounded-full bg-slate-100 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-700">
            Comparison
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-bold leading-[1.2] tracking-tight text-[#0E234B]">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#345DAB] to-[#56ADE2] bg-clip-text text-transparent">
              Diagnova
            </span>
            ?
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-500">
            Perbandingan komprehensif antara keterbatasan Laboratory Information System (LIS) konvensional dengan keunggulan ekosistem cerdas Diagnova.
          </p>
        </div>

        {/* 2-Column Comparison Layout with Center VS Emblem */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6 items-stretch">
            {/* Left Card: 6 Kekurangan LIS di Indonesia (Neutral / Conventional) */}
            <div
              className={`relative flex flex-col justify-between rounded-[24px] sm:rounded-[30px] bg-[#F5F7FA] border border-slate-200/90 p-5 sm:p-6 lg:p-7 shadow-sm transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}
            >
              <div>
                {/* Badge */}
                <div className="mb-4 sm:mb-5">
                  <span className="inline-flex items-center rounded-full bg-[#EBF3FB] border border-[#D5E5F7] px-4 py-1.5 text-xs sm:text-sm font-medium text-[#2A5EAA]">
                    6 Kekurangan LIS di Indonesia
                  </span>
                </div>

                {/* Staggered Text Reveal List */}
                <div className="flex flex-col">
                  {conventionalDrawbacks.map((item, index) => (
                    <div
                      key={item.number}
                      className={`flex items-start gap-3.5 sm:gap-4 transition-all duration-500 ease-out ${index !== conventionalDrawbacks.length - 1
                          ? "border-b border-slate-200/90 pb-3 sm:pb-3.5 mb-3 sm:mb-3.5"
                          : "pb-0 mb-0"
                        } ${isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${200 + index * 120}ms`
                          : "0ms",
                      }}
                    >
                      <span className="text-slate-400 font-medium text-xs sm:text-sm w-5 sm:w-6 shrink-0 select-none pt-0.5">
                        {item.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-[15px] leading-snug tracking-tight mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center VS Badge (Mobile) */}
            <div className="flex lg:hidden items-center justify-center -my-2.5 z-10 relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border-2 border-slate-100">
                <span className="font-display text-[11px] font-black tracking-wider text-[#1A4B8C]">
                  VS
                </span>
              </div>
            </div>

            {/* Right Card: 6 Keunggulan Diagnova (Vibrant Diagnova Blue) */}
            <div
              className={`relative flex flex-col justify-between rounded-[24px] sm:rounded-[30px] bg-gradient-to-br from-[#275EA8] via-[#2E68B4] to-[#1C478B] p-5 sm:p-6 lg:p-7 text-white shadow-xl shadow-[#2E68B4]/20 overflow-hidden transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
            >
              {/* Subtle ambient light reflections */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#56ADE2]/25 blur-[60px]" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#1C478B]/40 blur-[60px]" />

              <div className="relative z-10">
                {/* Badge */}
                <div className="mb-4 sm:mb-5">
                  <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm">
                    6 Keunggulan Diagnova
                  </span>
                </div>

                {/* Staggered Text Reveal List */}
                <div className="flex flex-col">
                  {diagnovaAdvantages.map((item, index) => (
                    <div
                      key={item.number}
                      className={`flex items-start gap-3.5 sm:gap-4 transition-all duration-500 ease-out ${index !== diagnovaAdvantages.length - 1
                          ? "border-b border-white/15 pb-3 sm:pb-3.5 mb-3 sm:mb-3.5"
                          : "pb-0 mb-0"
                        } ${isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3"
                        }`}
                      style={{
                        transitionDelay: isVisible
                          ? `${200 + index * 120}ms`
                          : "0ms",
                      }}
                    >
                      <span className="text-white/60 font-medium text-xs sm:text-sm w-5 sm:w-6 shrink-0 select-none pt-0.5">
                        {item.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm sm:text-[15px] leading-snug tracking-tight mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-white/90 leading-snug sm:leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center VS Badge (Desktop) */}
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center pointer-events-none transition-all duration-700 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            style={{ transitionDelay: isVisible ? "350ms" : "0ms" }}
          >
            <div className="flex h-12 w-12 xl:h-14 xl:w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(14,35,75,0.18)] border-[3px] border-white p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#EEF4FB] to-[#D9EAF8] border border-blue-200/60 shadow-inner">
                <span className="font-display text-xs xl:text-sm font-black tracking-wider text-[#1A4B8C]">
                  VS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
