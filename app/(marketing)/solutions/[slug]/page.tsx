import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { solutionsData } from "@/content/solutions";
import { modulesData } from "@/content/modules";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return solutionsData.map((solution) => ({
    slug: solution.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const solution = solutionsData.find((s) => s.slug === params.slug);
  if (!solution) return { title: "Solusi Tidak Ditemukan" };

  return {
    title: `${solution.name} — Solusi Diagnova`,
    description: solution.shortDesc,
  };
}

export default function SolutionDetailPage({ params }: Props) {
  const solution = solutionsData.find((s) => s.slug === params.slug);

  if (!solution) {
    notFound();
  }

  const relatedModules = modulesData.filter((m) =>
    solution.includedModules.includes(m.slug)
  );

  return (
    <div className="pt-28 pb-20">
      {/* Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-nova-light hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Semua Solusi</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <SectionBadge variant="dark">{solution.targetAudience}</SectionBadge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
              {solution.name}
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              {solution.tagline}
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
                Gambaran Solusi
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {solution.description}
              </p>
            </div>

            {/* Challenges Addressed */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <span>Tantangan Laboratorium yang Diatasi</span>
              </h3>
              <ul className="space-y-2.5">
                {solution.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Highlights */}
            <div className="rounded-2xl border border-diagnova-light bg-diagnova-ice/30 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-diagnova-navy flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-nova-blue" />
                <span>Fitur Unggulan untuk {solution.name}</span>
              </h3>
              <ul className="space-y-2.5">
                {solution.solutionHighlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-diagnova-blue shrink-0 mt-0.5" />
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Included / Relevant Modules */}
            {relatedModules.length > 0 && (
              <div>
                <h3 className="font-display text-xl font-bold text-diagnova-navy mb-4">
                  Modul Diagnova yang Mendukung Solusi Ini
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedModules.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/modules/${m.slug}`}
                      className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-nova-blue hover:shadow-md transition-all"
                    >
                      <h4 className="font-bold text-sm text-diagnova-navy group-hover:text-diagnova-blue transition-colors mb-1">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{m.shortDesc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 sticky top-28">
              <h3 className="font-display text-lg font-bold text-diagnova-navy">
                Implementasikan untuk {solution.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diskusikan integrasi LIS sesuai skala dan instrumen laboratorium Anda dengan tim spesialis Diagnova.
              </p>
              <Button href="/request-demo" variant="primary" size="md" className="w-full">
                Request Live Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
