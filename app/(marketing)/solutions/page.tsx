import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Stethoscope, Microscope, FlaskConical, HeartPulse, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { solutionsData } from "@/content/solutions";

export const metadata: Metadata = {
  title: "Solusi Laboratorium Terpadu — Diagnova Solutions",
  description:
    "Different laboratory needs, one connected Diagnova platform. Solusi terdedikasi untuk RS, lab klinik, patologi, mikrobiologi, dan bank darah.",
};

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-6 w-6 text-diagnova-blue" />,
  Stethoscope: <Stethoscope className="h-6 w-6 text-nova-blue" />,
  Microscope: <Microscope className="h-6 w-6 text-diagnova-blue" />,
  FlaskConical: <FlaskConical className="h-6 w-6 text-nova-blue" />,
  HeartPulse: <HeartPulse className="h-6 w-6 text-rose-500" />,
  Sparkles: <Sparkles className="h-6 w-6 text-amber-500" />,
};

export default function SolutionsIndexPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Diagnova Solutions</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Different Laboratory Needs, One Connected Diagnova Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Disesuaikan dengan tantangan unik setiap spesialisasi dan skala fasilitas layanan kesehatan.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((sol) => (
            <Link
              key={sol.slug}
              href={`/solutions/${sol.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:border-nova-blue hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-diagnova-ice">
                  {iconMap[sol.iconName] || <Building2 className="h-6 w-6 text-diagnova-blue" />}
                </div>

                <span className="block text-xs font-semibold text-nova-blue uppercase tracking-wider mb-1">
                  {sol.targetAudience}
                </span>

                <h3 className="font-display text-xl font-bold text-diagnova-navy mb-2 group-hover:text-diagnova-blue transition-colors">
                  {sol.name}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {sol.shortDesc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-diagnova-blue pt-4 border-t border-slate-100">
                <span>Pelajari Solusi</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
