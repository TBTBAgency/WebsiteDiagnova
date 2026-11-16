"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Cpu, ArrowRight } from "lucide-react";
import { useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { modulesPage } from "@/content/pages/modules";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTABanner } from "@/components/sections/CTABanner";

type ModulesContent = PageContentOf<typeof modulesPage>;
export type ModulesListSection = NonNullable<ModulesContent["modules"]>;
export type ModuleEntry = ModulesListSection["items"][number];

interface ModuleDetailViewProps {
  content: { modules: ModulesListSection; cta: ModulesContent["cta"] };
  item: ModuleEntry;
}

export function ModuleDetailView({ content, item: mod }: ModuleDetailViewProps) {
  const t = useCmsText();
  const { modules: detail, cta } = content;
  const name = t(mod.name);
  const withName = (text: string) => text.split("{name}").join(name);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* ══════════════════════════════════════════════════════════════
          DETAIL HERO SECTION: Sesuai Design System Home & Platform Page
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 lg:pt-44 pb-14 sm:pb-16 lg:pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t(detail.backLabel)}</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div>
              <SectionBadge variant="blue">{t(mod.targetDepartment)}</SectionBadge>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[50px] font-bold leading-[1.14] tracking-tight text-slate-900">
              {name}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-500 font-light leading-relaxed max-w-3xl">
              {t(mod.tagline)}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MAIN DETAILS & SPECIFICATIONS
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 max-w-[1560px] mx-auto px-5 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                {t(detail.descriptionHeading)}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-light">
                {t(mod.description)}
              </p>
            </div>

            {/* Key Features */}
            <div className="rounded-[28px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-[#EBF3FB] text-[#2764B8] flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                    {t(detail.featuresHeading)}
                  </h3>
                  <p className="text-xs text-slate-400">{t(detail.featuresSub)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {visibleItems(mod.keyFeatures).map((f) => (
                  <div key={f.id} className="flex items-start gap-3 rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">{t(f.text)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical & Operational Benefits */}
            <div className="rounded-[28px] border border-slate-200/90 bg-gradient-to-br from-[#F5F8FC] to-white p-7 sm:p-9 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                    {t(detail.benefitsHeading)}
                  </h3>
                  <p className="text-xs text-slate-400">{t(detail.benefitsSub)}</p>
                </div>
              </div>

              <ul className="space-y-3.5">
                {visibleItems(mod.clinicalBenefits).map((b) => (
                  <li key={b.id} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span>{t(b.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="rounded-[28px] border border-slate-200/90 bg-[#F9F9F9] p-7 space-y-5 sticky top-28 shadow-xs">
              <span className="text-[11px] font-semibold text-[#2764B8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block">
                {t(detail.ctaBadge)}
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
                {withName(t(detail.ctaTitle))}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {withName(t(detail.ctaDesc))}
              </p>
              <div className="pt-2">
                <Link
                  href={detail.ctaButton?.href || "/request-demo"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] py-3 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98]"
                >
                  <span>{t(detail.ctaButton?.text)}</span>
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
      {cta && (
        <CTABanner
          bgClassName="bg-white"
          topColor="#FFFFFF"
          initialData={{
            section: {
              titleId: cta.title?.id,
              titleEn: cta.title?.en,
              subtitleId: cta.subtitle?.id,
              subtitleEn: cta.subtitle?.en,
              extraContent: {
                buttonTextId: cta.buttonText?.id,
                buttonTextEn: cta.buttonText?.en,
                placeholderId: cta.placeholder?.id,
                placeholderEn: cta.placeholder?.en,
              },
            },
          }}
        />
      )}
    </div>
  );
}
