import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { solutionsData } from "@/content/solutions";
import { modulesData } from "@/content/modules";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

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
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          DETAIL HERO SECTION: Sesuai Design System Home Page
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-14 sm:pb-16 lg:pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Semua Solusi</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div>
              <SectionBadge variant="blue">{solution.targetAudience}</SectionBadge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] font-bold leading-[1.14] tracking-tight text-[#345DAB]">
              {solution.name}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-500 font-light leading-relaxed max-w-3xl">
              {solution.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MAIN DETAILS & ARCHITECTURE
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                Gambaran Solusi &amp; Alur Operasional
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-light">
                {solution.description}
              </p>
            </div>

            {/* Challenges Addressed */}
            <div className="rounded-[28px] border border-rose-100 bg-[#FFF9F9] p-7 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <span>Tantangan Laboratorium yang Diatasi</span>
              </h3>
              <ul className="space-y-3">
                {solution.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Highlights */}
            <div className="rounded-[28px] border border-blue-100 bg-[#F5F8FC] p-7 space-y-4">
              <h3 className="font-display text-lg font-bold text-[#345DAB] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#2764B8]" />
                <span>Fitur Unggulan untuk {solution.name}</span>
              </h3>
              <ul className="space-y-3">
                {solution.solutionHighlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Modules */}
            {relatedModules.length > 0 && (
              <div className="pt-4">
                <h3 className="font-display text-xl font-bold text-slate-900 mb-4 tracking-tight">
                  Modul Diagnova yang Mendukung Solusi Ini
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedModules.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/modules/${m.slug}`}
                      className="group rounded-[20px] border border-slate-200/90 bg-white p-5 hover:border-blue-200/80 hover:shadow-sm transition-all"
                    >
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#345DAB] transition-colors mb-1">
                        {m.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.shortDesc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="rounded-[28px] border border-slate-200/90 bg-[#F9F9F9] p-7 space-y-5 sticky top-28 shadow-xs">
              <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block">
                Konsultasi Spesialis
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                Siap Transformasi Laboratorium Anda?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                Diskusikan simulasi alur kerja, interfacing instrumen, dan estimasi waktu penerapan untuk {solution.name} bersama tim kami.
              </p>
              <div className="pt-2">
                <Link
                  href="/request-demo"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] py-3 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>Minta Demo Interaktif</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
          ══════════════════════════════════════════════════════════════ */}
      <CTABanner />
    </div>
  );
}
