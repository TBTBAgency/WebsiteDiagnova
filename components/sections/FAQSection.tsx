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

  // Intersection Observer — trigger entrance animations once when section enters viewport
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
      {/* Subtle ambient Diagnova gradient glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-[#56ADE2]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-[#345DAB]/[0.07] blur-[90px] pointer-events-none" />

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="relative z-10 mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10 w-full">

        {/* ═══ SECTION HEADER ═══ */}
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-12 lg:mb-14 transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="max-w-2xl">
            <div className="mb-3.5 sm:mb-4">
              <SectionBadge variant="blue">
                {content.sectionBadge}
              </SectionBadge>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-[#345DAB]">
              {content.sectionTitle}
            </h2>
          </div>

          <p className="max-w-md text-slate-500 text-xs sm:text-sm lg:text-[15px] font-light leading-relaxed lg:text-right pb-1 shrink-0">
            {content.sectionSubtitle}
          </p>
        </div>

        {/* ═══ MAIN 2-COLUMN LAYOUT ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">

          {/* ── LEFT: CATEGORY TABS ── */}
          <div
            className={cn(
              "lg:col-span-4 xl:col-span-3 transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
            style={{ transitionDelay: isVisible ? "150ms" : "0ms" }}
          >
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
              {content.categories.map((cat, catIdx) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenIndex(0);
                    }}
                    style={
                      isVisible
                        ? { transitionDelay: `${200 + catIdx * 60}ms` }
                        : {}
                    }
                    className={cn(
                      "px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 text-left whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#EBF3FB] border border-[#3880DB]/40 text-[#2568BA] font-semibold shadow-xs"
                        : "text-slate-500 hover:text-[#2568BA] hover:bg-white border border-transparent font-medium"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: ACCORDION ── */}
          <div
            className={cn(
              "lg:col-span-8 xl:col-span-9 transition-all duration-700 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: isVisible ? "200ms" : "0ms" }}
          >
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {filteredItems.map((item, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-2xl transition-all duration-300 overflow-hidden",
                      isOpen
                        ? "bg-white border border-[#D5E5F7] shadow-[0_4px_24px_-6px_rgba(40,90,165,0.10)]"
                        : "border-b border-slate-200/70 hover:bg-white/70"
                    )}
                    style={
                      isVisible
                        ? {
                            animationName: "fadeSlideUp",
                            animationDuration: "0.5s",
                            animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                            animationFillMode: "both",
                            animationDelay: `${260 + idx * 70}ms`,
                          }
                        : { opacity: 0 }
                    }
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className={cn(
                        "w-full flex items-start justify-between gap-4 text-left cursor-pointer group",
                        isOpen
                          ? "p-6 sm:p-7"
                          : "py-4 sm:py-4.5 px-4 sm:px-5"
                      )}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={cn(
                          "font-medium text-sm sm:text-base lg:text-[16px] leading-snug transition-colors",
                          isOpen
                            ? "font-semibold font-display text-slate-900 group-hover:text-[#2568BA] lg:text-[17px]"
                            : "text-slate-700 group-hover:text-[#2568BA]"
                        )}
                      >
                        {item.question}
                      </span>
                      <div
                        className={cn(
                          "shrink-0 mt-0.5 transition-all duration-200",
                          isOpen
                            ? "text-[#2568BA]"
                            : "text-slate-400 group-hover:text-[#2568BA]"
                        )}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                    </button>

                    {/* Answer panel — smooth height expand */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-out",
                        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0 border-t border-slate-100/90">
                        <p className="text-slate-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed font-light pt-3.5 pr-4 sm:pr-6">
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

        {/* ═══ BOTTOM SUPPORT CALLOUT BANNER ═══ */}
        <div
          className={cn(
            "mt-12 sm:mt-16 transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: isVisible ? "400ms" : "0ms" }}
        >
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
