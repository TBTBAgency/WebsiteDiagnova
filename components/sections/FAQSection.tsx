"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filteredItems = content.items.filter(
    (item) => item.category === activeCategory
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative w-full bg-[#F9F9F9] py-14 sm:py-18 lg:py-22 border-t border-slate-200/60 overflow-hidden content-auto"
      aria-label="Frequently Asked Questions"
    >
      {/* Ambient glow — very subtle */}
      <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-[#56ADE2]/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-[#345DAB]/[0.05] blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">

        {/* ═══ HEADER ═══ */}
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-12 lg:mb-14 transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        >
          <div className="max-w-2xl">
            <div className="mb-3.5 sm:mb-4">
              <SectionBadge variant="blue">{content.sectionBadge}</SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {content.sectionTitle}
            </h2>
          </div>
          <p className="max-w-md text-slate-500 text-xs sm:text-sm lg:text-[15px] font-light leading-relaxed lg:text-right pb-1 shrink-0">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* ═══ 2-COLUMN BODY ═══ */}
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: isVisible ? "120ms" : "0ms" }}
        >
          {/* ── LEFT: CATEGORY TABS ── */}
          <div className="lg:col-span-4 xl:col-span-3">
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
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
                      "px-5 py-2.5 rounded-full text-xs sm:text-[13px] transition-all duration-200 text-left whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#EBF3FB] border border-[#3880DB]/35 text-[#2568BA] font-semibold"
                        : "text-slate-500 hover:text-[#2568BA] hover:bg-white/80 border border-transparent font-normal"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── RIGHT: ACCORDION ── */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="flex flex-col divide-y divide-slate-200/60">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={item.id} className="group">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className={cn(
                        "w-full flex items-start justify-between gap-6 text-left cursor-pointer py-5 sm:py-5.5 transition-colors duration-150",
                        isOpen ? "pb-3 sm:pb-3.5" : ""
                      )}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={cn(
                          "text-sm sm:text-[15px] lg:text-base leading-snug transition-colors duration-150",
                          isOpen
                            ? "font-semibold text-[#1D3F82]"
                            : "font-medium text-slate-700 group-hover:text-[#2568BA]"
                        )}
                      >
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200",
                          isOpen
                            ? "bg-[#EBF3FB] text-[#2568BA]"
                            : "bg-slate-100 text-slate-400 group-hover:bg-[#EBF3FB] group-hover:text-[#2568BA]"
                        )}
                      >
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>

                    {/* Smooth height expand via grid trick — no max-h flash */}
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-slate-500 text-xs sm:text-[13px] lg:text-sm leading-relaxed font-light pb-5 sm:pb-6 pr-10 sm:pr-14">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══ CALLOUT BANNER ═══ */}
        <div
          className={cn(
            "mt-12 sm:mt-16 transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
          style={{ transitionDelay: isVisible ? "240ms" : "0ms" }}
        >
          <div className="rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#EBF3FB] via-[#E4EFF9] to-[#D5E6F7] border border-[#D5E5F7] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_-10px_rgba(40,90,165,0.08)]">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="h-11 w-11 rounded-xl bg-[#2568BA] text-white flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm sm:text-base font-bold text-[#1D3F82]">
                  {content.supportPrompt}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-500 font-light mt-0.5">
                  {language === "ID"
                    ? "Jadwalkan demonstrasi teknis atau konsultasi kebutuhan laboratorium Anda."
                    : "Schedule a technical consultation or request a live interactive demo."}
                </p>
              </div>
            </div>

            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2568BA] hover:bg-[#1D3F82] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] shrink-0"
            >
              <span>{content.supportCta}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
