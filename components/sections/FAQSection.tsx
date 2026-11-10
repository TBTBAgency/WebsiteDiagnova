"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, MessageSquare } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { faqContentID, faqContentEN } from "@/content/faq";
import { cn } from "@/lib/utils";

export interface FAQSectionProps {
  initialData?: any;
}

export function FAQSection({ initialData: _initialData }: FAQSectionProps = {}) {
  const { language } = useLanguage();
  const defaultContent = language === "ID" ? faqContentID : faqContentEN;

  const content = {
    sectionBadge: defaultContent.sectionBadge,
    sectionTitle: defaultContent.sectionTitle,
    sectionSubtitle: defaultContent.sectionSubtitle,
    supportPrompt: defaultContent.supportPrompt,
    supportCta: defaultContent.supportCta,
    categories: defaultContent.categories,
    items: defaultContent.items,
  };

  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredItems = content.items.filter(
    (item) => item.category === activeCategory
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-white py-14 sm:py-18 lg:py-22 border-t border-slate-200/60 overflow-hidden content-auto"
      aria-label="Frequently Asked Questions"
    >
      {/* Subtle ambient Diagnova gradient glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#56ADE2]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#345DAB]/08 blur-[90px] pointer-events-none" />

      {/* ─── MAIN CONTENT CONTAINER (PASKAN DENGAN CONTAINER DIAGNOVA max-w-[1560px]) ─── */}
      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
        {/* ═══ SECTION HEADER ROW: BADGE + TITLE (LEFT) & SUBTITLE (RIGHT) ═══ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-12 lg:mb-14">
          <div className="max-w-2xl">
            <div className="mb-3.5 sm:mb-4">
              <SectionBadge variant="blue" className="gap-1.5 px-3.5 py-1">
                <span className="font-semibold text-xs tracking-wider text-[#2A5EAA]">
                  / {content.sectionBadge}
                </span>
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {content.sectionTitle}
            </h2>
          </div>

          <p className="max-w-md text-slate-500 text-xs sm:text-sm lg:text-[15px] font-light leading-relaxed text-left lg:text-right pb-1 shrink-0">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* ═══ MAIN 2-COLUMN LAYOUT: CATEGORIES (LEFT) & ACCORDION (RIGHT) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
          {/* ── LEFT COLUMN: VERTICAL CATEGORY TABS ── */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              {content.categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenIndex(0); // open first question of newly selected category
                    }}
                    className={cn(
                      "px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 text-left whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#EBF3FB] border border-[#3880DB]/40 text-[#2568BA] font-semibold shadow-xs"
                        : "text-slate-500 hover:text-[#2568BA] hover:bg-slate-200/50 border border-transparent font-medium"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: ACCORDION LIST ── */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx;

                if (isOpen) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl sm:rounded-[22px] bg-[#EBF3FB] border border-[#D5E5F7] p-6 sm:p-7 shadow-[0_4px_24px_-6px_rgba(40,90,165,0.10)] transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
                        aria-expanded="true"
                      >
                        <span className="font-display font-semibold text-slate-900 group-hover:text-[#2568BA] text-sm sm:text-base lg:text-[17px] leading-snug transition-colors">
                          {item.question}
                        </span>
                        <div className="shrink-0 mt-0.5 text-[#2568BA] transition-transform duration-200">
                          <Minus className="h-4 w-4" />
                        </div>
                      </button>

                      <div className="text-slate-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed mt-3.5 pr-4 sm:pr-8 font-light border-t border-slate-100/90 pt-3.5 animate-in fade-in duration-200">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="border-b border-slate-200/80 rounded-xl transition-colors duration-150 hover:bg-slate-50"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full py-4 sm:py-4.5 px-4 sm:px-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                      aria-expanded="false"
                    >
                      <span className="text-slate-700 group-hover:text-[#2568BA] font-medium text-sm sm:text-base lg:text-[16px] leading-snug transition-colors">
                        {item.question}
                      </span>
                      <div className="shrink-0 text-slate-400 group-hover:text-[#2568BA] transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM SUPPORT CALLOUT BANNER (SESUAI STYLE DIAGNOVA GRADIENT) ═══ */}
        <div className="mt-12 sm:mt-16">
          <div className="rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#EBF3FB] via-[#E4EFF9] to-[#D5E6F7] border border-[#D5E5F7] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_-10px_rgba(40,90,165,0.08)]">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-12 w-12 rounded-2xl bg-[#2568BA] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-base sm:text-lg font-bold text-[#1D3F82]">
                  {content.supportPrompt}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-light mt-0.5">
                  {language === "ID"
                    ? "Jadwalkan sesi demonstrasi langsung atau konsultasi teknis kebutuhan laboratorium Anda."
                    : "Schedule a tailored technical consultation or request a live interactive demo."}
                </p>
              </div>
            </div>

            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2568BA] hover:bg-[#1D3F82] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] shrink-0"
            >
              <span>{content.supportCta}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
