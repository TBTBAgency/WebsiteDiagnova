"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, MessageSquare } from "lucide-react";
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
      className="relative w-full bg-white py-20 sm:py-24 lg:py-28 border-t border-slate-200/60 overflow-hidden content-auto"
      aria-label="Frequently Asked Questions"
    >
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 w-full">
        {/* ═══ BADGE: / FAQS ═══ */}
        <div className="mb-4 sm:mb-5">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider text-sky-600 bg-sky-50 border border-sky-200/90 shadow-2xs">
            / {content.sectionBadge}
          </span>
        </div>

        {/* ═══ HEADER ROW: TITLE (LEFT) & SUBTITLE (RIGHT) ═══ */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-12 mb-12 sm:mb-16 pb-2">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight text-slate-900 leading-[1.18]">
            {content.sectionTitle}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-[14px] leading-relaxed font-light max-w-sm sm:max-w-md lg:text-left shrink-0">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* ═══ MAIN 2-COLUMN LAYOUT: CATEGORIES (LEFT) & ACCORDION (RIGHT) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ── LEFT COLUMN: CATEGORIES ── */}
          <div className="lg:col-span-3 xl:col-span-3">
            <div className="flex flex-row lg:flex-col gap-1.5 sm:gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
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
                      "px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 text-left whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#EBF4FD] border border-sky-300 text-sky-700 shadow-2xs font-semibold"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent font-normal"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: ACCORDION LIST ── */}
          <div className="lg:col-span-9 xl:col-span-9">
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx;

                if (isOpen) {
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl sm:rounded-[22px] bg-[#F8FAFC] border border-slate-100/90 p-6 sm:p-7 shadow-2xs transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
                        aria-expanded="true"
                      >
                        <span className="font-semibold text-slate-900 text-sm sm:text-base lg:text-[17px] leading-snug">
                          {item.question}
                        </span>
                        <div className="shrink-0 mt-0.5 text-slate-700 transition-transform duration-200">
                          <Minus className="h-4 w-4" />
                        </div>
                      </button>

                      <div className="text-slate-500 text-xs sm:text-sm lg:text-[15px] leading-relaxed mt-3.5 pr-4 sm:pr-8 font-light animate-in fade-in duration-200">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="rounded-xl transition-colors duration-150 hover:bg-slate-50/70"
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full py-3.5 sm:py-4 px-4 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                      aria-expanded="false"
                    >
                      <span className="text-slate-800 group-hover:text-sky-700 font-medium sm:font-normal text-sm sm:text-base lg:text-[16px] leading-snug transition-colors">
                        {item.question}
                      </span>
                      <div className="shrink-0 text-slate-400 group-hover:text-slate-700 transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ BOTTOM SUPPORT CALLOUT BANNER ═══ */}
        <div className="mt-14 sm:mt-18 pt-6 border-t border-slate-100">
          <div className="rounded-[22px] sm:rounded-[26px] bg-gradient-to-r from-[#F0F6FC] via-[#F6F9FE] to-[#EEF5FC] border border-blue-100/70 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-11 w-11 rounded-2xl bg-[#2764B8] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                  {content.supportPrompt}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-500 font-light mt-0.5">
                  {language === "ID"
                    ? "Jadwalkan sesi demonstrasi langsung atau konsultasi teknis kebutuhan lab Anda."
                    : "Schedule a tailored technical consultation or request a live interactive demo."}
                </p>
              </div>
            </div>

            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] shrink-0"
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
