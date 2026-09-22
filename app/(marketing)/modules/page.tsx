import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, HeartPulse, PackageCheck, Microscope, FlaskConical } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { modulesData } from "@/content/modules";

export const metadata: Metadata = {
  title: "Modul Diagnova — Sistem Modular Laboratorium Terpadu",
  description:
    "Sistem modular Diagnova yang fleksibel untuk menangani Routine Hematology, Blood Bank, Inventory Reagent, Pathology, dan Microbiology.",
};

const iconMap: Record<string, React.ReactNode> = {
  Activity: <Activity className="h-6 w-6 text-diagnova-blue" />,
  HeartPulse: <HeartPulse className="h-6 w-6 text-rose-500" />,
  PackageCheck: <PackageCheck className="h-6 w-6 text-nova-blue" />,
  Microscope: <Microscope className="h-6 w-6 text-diagnova-blue" />,
  FlaskConical: <FlaskConical className="h-6 w-6 text-nova-blue" />,
};

export default function ModulesIndexPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Diagnova Modules</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Modular System That Adapts to Your Laboratory Operations
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            5 modul spesialisasi laboratorium yang dapat diaktifkan secara bertahap atau terintegrasi penuh.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modulesData.map((mod) => (
            <Link
              key={mod.slug}
              href={`/modules/${mod.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:border-nova-blue hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-diagnova-ice">
                  {iconMap[mod.iconName] || <Activity className="h-6 w-6 text-diagnova-blue" />}
                </div>

                <span className="block text-xs font-semibold text-diagnova-blue uppercase tracking-wider mb-1">
                  {mod.targetDepartment}
                </span>

                <h3 className="font-display text-xl font-bold text-diagnova-navy mb-2 group-hover:text-diagnova-blue transition-colors">
                  {mod.name}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {mod.shortDesc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-diagnova-blue pt-4 border-t border-slate-100">
                <span>Eksplorasi Modul</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
