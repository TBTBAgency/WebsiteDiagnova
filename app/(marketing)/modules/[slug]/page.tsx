import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { modulesData } from "@/content/modules";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return modulesData.map((module) => ({
    slug: module.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const mod = modulesData.find((m) => m.slug === params.slug);
  if (!mod) return { title: "Modul Tidak Ditemukan" };

  return {
    title: `${mod.name} — Modul Diagnova`,
    description: mod.shortDesc,
  };
}

export default function ModuleDetailPage({ params }: Props) {
  const mod = modulesData.find((m) => m.slug === params.slug);

  if (!mod) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20">
      {/* Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-nova-light hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Semua Modul</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <SectionBadge variant="dark">{mod.targetDepartment}</SectionBadge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
              {mod.name}
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              {mod.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-diagnova-navy mb-4">
                Deskripsi Modul
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {mod.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-display text-lg font-bold text-diagnova-navy flex items-center gap-2">
                <Cpu className="h-5 w-5 text-nova-blue" />
                <span>Fitur &amp; Kemampuan Teknis Utama</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mod.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3">
                    <CheckCircle2 className="h-4 w-4 text-diagnova-blue shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical & Operational Benefits */}
            <div className="rounded-2xl border border-diagnova-light bg-diagnova-ice/30 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-diagnova-navy flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Manfaat Klinis &amp; Efisiensi Operasional</span>
              </h3>
              <ul className="space-y-3">
                {mod.clinicalBenefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-nova-blue mt-1.5 shrink-0" />
                    <span className="font-medium">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 sticky top-28">
              <h3 className="font-display text-lg font-bold text-diagnova-navy">
                Uji Coba Modul {mod.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jadwalkan presentasi teknis dan integrasi modul ini dengan instrumen laboratorium Anda.
              </p>
              <Button href="/request-demo" variant="primary" size="md" className="w-full">
                Jadwalkan Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
