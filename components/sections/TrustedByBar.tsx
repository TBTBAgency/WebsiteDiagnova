import React from "react";
import { ShieldCheck, Building, Stethoscope, Microscope, Award } from "lucide-react";

const partners = [
  { name: "Rumah Sakit Umum Daerah (RSUD)", icon: <Building className="h-5 w-5" /> },
  { name: "Laboratorium Klinik Terakreditasi", icon: <Microscope className="h-5 w-5" /> },
  { name: "Pusat Patologi & Sitologi", icon: <Award className="h-5 w-5" /> },
  { name: "Unit Bank Darah & Transfusi", icon: <ShieldCheck className="h-5 w-5" /> },
  { name: "Klinik Utama & Jejaring Rujukan", icon: <Stethoscope className="h-5 w-5" /> },
];

export function TrustedByBar() {
  return (
    <section className="border-b border-slate-100 bg-slate-50/70 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
          Dirancang untuk Memenuhi Standar Rumah Sakit, Klinik, dan Laboratorium Rujukan Modern
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 opacity-75">
          {partners.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-slate-600 grayscale transition-all hover:grayscale-0 hover:text-diagnova-blue"
            >
              <div className="text-diagnova-blue/80">{item.icon}</div>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
