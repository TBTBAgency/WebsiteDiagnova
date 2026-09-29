import React from "react";
import Image from "next/image";
import { SectionBadge } from "@/components/ui/SectionBadge";

export function AboutSection() {
  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: DNA Helix Visual from Figma */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-[360px] aspect-[4/5] sm:aspect-[3/4] flex items-center justify-center">
              <Image
                src="/images/dna-about.jpg"
                alt="Diagnova DNA Helix Molecular Intelligence"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div>
              <SectionBadge variant="light">About</SectionBadge>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#112E65] tracking-tight leading-[1.2]">
              At Diagnova, We Transform Diagnostic
              <br className="hidden sm:inline" /> Data Into Clinical Intelligence,
            </h2>

            <p className="font-display text-xl sm:text-2xl font-bold text-[#345DAB] leading-snug">
              Empowering Laboratories To Make
              <br className="hidden sm:inline" /> Precise Medical Decisions.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl pt-2">
              Kami hadir untuk menghubungkan analis laboratorium, dokter spesialis patologi klinis,
              dan instrumen analyzer dalam satu ekosistem terpadu. Diagnova mengubah data mentah laboratorium
              menjadi kecepatan diagnostik, presisi klinis, dan wawasan medis yang siap ditindaklanjuti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
