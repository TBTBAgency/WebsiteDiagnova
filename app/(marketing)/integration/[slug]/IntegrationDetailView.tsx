"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Network, ShieldCheck, Check } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { CTABanner } from "@/components/sections/CTABanner";
import { useCmsText, visibleItems } from "@/lib/cms/text";
import type { PageContentOf } from "@/lib/cms/types";
import type { integrationPage } from "@/content/pages/integration";
import { toCtaBannerData } from "../IntegrationPageView";

type IntegrationContent = PageContentOf<typeof integrationPage>;
export type IntegrationItemContent = NonNullable<IntegrationContent["integrations"]>["items"][number];

export function IntegrationDetailView({
  content,
  item,
}: {
  content: IntegrationContent;
  item: IntegrationItemContent;
}) {
  const t = useCmsText();
  const labels = content.detailPage;
  const integ = item.detail;
  const name = t(integ.name);

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Subpage Hero Header (Consistent with modern medical enterprise design) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 pb-16 sm:pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
          <Link
            href={`/integration#${item.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] mb-6 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t(labels?.backLabel)}</span>
          </Link>

          <div className="max-w-3xl space-y-3">
            <SectionBadge variant="blue">{t(labels?.badge)}</SectionBadge>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {name}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {t(integ.tagline)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-16 sm:py-20 max-w-[1560px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[24px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                {t(labels?.descriptionTitle)}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                {t(integ.description)}
              </p>
            </div>

            {/* Protocols Supported */}
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Network className="h-5 w-5 text-[#2764B8]" />
                <span>{t(labels?.protocolsTitle)}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {visibleItems(integ.protocols).map((p) => (
                  <span
                    key={p.id}
                    className="rounded-xl border border-blue-200 bg-[#EBF3FB] px-3.5 py-1.5 text-xs font-mono font-bold text-[#2764B8]"
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#2764B8]" />
                <span>{t(labels?.highlightsTitle)}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleItems(integ.highlights).map((h) => (
                  <div key={h.id} className="flex items-start gap-2.5 bg-[#F8FBFE] p-3.5 rounded-xl border border-slate-150">
                    <Check className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{t(h.text)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Capabilities */}
            <div className="rounded-[24px] border border-slate-200/90 bg-[#F8FBFE] p-6 sm:p-8 space-y-3">
              <h3 className="font-display text-base font-bold text-slate-900">
                {t(labels?.capabilitiesTitle)}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                {visibleItems(integ.capabilities).map((c) => (
                  <li key={c.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2764B8] shrink-0" />
                    <span className="font-mono text-slate-700">{t(c.text)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs sticky top-28 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FB] text-[#2764B8]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                {t(labels?.sidebarTitlePrefix)} {name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                {t(labels?.sidebarDesc)}
              </p>
              <Button href={labels?.sidebarCta.href ?? "/request-demo"} variant="primary" size="md" className="w-full">
                {t(labels?.sidebarCta.text)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {content.cta && <CTABanner initialData={toCtaBannerData(content.cta)} bgClassName="bg-white" topColor="#FFFFFF" />}
    </div>
  );
}
