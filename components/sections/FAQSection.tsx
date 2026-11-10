"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, HelpCircle, MessageSquare } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { faqContentID, faqContentEN, FAQItem } from "@/content/faq";
import { cn } from "@/lib/utils";

export interface FAQSectionProps {
  initialData?: any;
}

export function FAQSection({ initialData }: FAQSectionProps = {}) {
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

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredItems =
    activeCategory === "all"
      ? content.items
      : content.items.filter((item) => item.category === activeCategory || item.category === "all");

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60 overflow-hidden content-auto"
      aria-label="Frequently Asked Questions"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-blue-100/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">
        {/* ═══ SECTION HEADER ═══ */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 lg:mb-14">
          <div className="inline-flex items-center justify-center mb-3.5 sm:mb-4">
            <SectionBadge variant="blue">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#2764B8]" />
                <span>{content.sectionBadge}</span>
              </span>
            </SectionBadge>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
            {content.sectionTitle}
          </h2>
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-500 font-light max-w-2xl mx-auto">
            {content.sectionSubtitle}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-7 sm:mt-8">
            {content.categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(0);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border",
                    isActive
                      ? "bg-[#2764B8] text-white border-[#2764B8] shadow-xs"
                      : "bg-[#F8FBFE] text-slate-600 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ ACCORDION CONTAINER ═══ */}
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-3.5">
          {filteredItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl transition-all duration-200 overflow-hidden border",
                  isOpen
                    ? "bg-white border-[#2764B8]/40 shadow-[0_4px_22px_-6px_rgba(39,100,184,0.12)]"
                    : "bg-[#FAFBFD] border-slate-200/90 hover:border-slate-300 hover:bg-white"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-slate-900 hover:text-[#2764B8] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug pr-2">{item.question}</span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200",
                      isOpen ? "bg-[#EBF3FB] text-[#2764B8]" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180 text-[#2764B8]"
                      )}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100/90 pt-4 animate-in fade-in duration-200">
                    <p className="max-w-3xl">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ═══ SUPPORT / CONSULTATION MINI BANNER ═══ */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-14">
          <div className="rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#F0F6FC] via-[#F5F9FE] to-[#EBF3FB] border border-blue-100/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xs">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-12 w-12 rounded-2xl bg-[#2764B8] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {content.supportPrompt}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
                  {language === "ID"
                    ? "Jadwalkan sesi demonstrasi teknis atau konsultasi spesifikasi faskes Anda."
                    : "Schedule a tailored technical consultation or request a live interactive demo."}
                </p>
              </div>
            </div>

            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] shrink-0"
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
