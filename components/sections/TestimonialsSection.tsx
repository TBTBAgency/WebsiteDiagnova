"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import {
  testimonialsContentID,
  testimonialsContentEN,
} from "@/content/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const { language } = useLanguage();
  const content =
    language === "ID" ? testimonialsContentID : testimonialsContentEN;
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // For mobile button navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardOffset, setCardOffset] = useState(0);

  // Drag scroll state for desktop
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Measure card width + gap for mobile button nav
  const updateCardOffset = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container && container.children[0]) {
      const firstCard = container.children[0] as HTMLElement;
      const gap = window.innerWidth >= 1024 ? 32 : 24;
      setCardOffset(firstCard.offsetWidth + gap);
    }
  }, []);

  useEffect(() => {
    updateCardOffset();
    window.addEventListener("resize", updateCardOffset);
    return () => window.removeEventListener("resize", updateCardOffset);
  }, [updateCardOffset]);

  // Intersection Observer for entrance animation
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop drag-to-scroll handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    container.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = "grab";
        container.style.removeProperty("user-select");
      }
    }
  }, []);

  // Navigation
  const totalItems = content.items.length;
  const maxIndex = Math.max(0, totalItems - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Sync button nav with scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || cardOffset <= 0) return;

    container.scrollTo({
      left: currentIndex * cardOffset,
      behavior: "smooth",
    });
  }, [currentIndex, cardOffset]);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full bg-[#F9F9F9] pt-14 sm:pt-18 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 select-none overflow-x-hidden content-auto"
      aria-label="Customer Testimonials"
    >
      <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 w-full">
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
          <div className="lg:max-w-md xl:max-w-lg">
            <p className="text-sm sm:text-base lg:text-[17px] leading-relaxed text-slate-500">
              {content.sectionSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ SCROLLABLE CARD TRACK ═══ */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 lg:gap-8 items-stretch py-6 -my-6 pl-6 sm:pl-8 lg:pl-[max(2.5rem,calc((100vw-1560px)/2+2.5rem))] pr-6 sm:pr-8 lg:pr-16 overflow-x-auto lg:cursor-grab scroll-smooth snap-x snap-mandatory lg:snap-none scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {content.items.map((item, idx) => (
          <div
            key={item.id}
            className={cn(
              "w-[88vw] sm:w-[620px] lg:w-[680px] xl:w-[740px] shrink-0 snap-start rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border border-slate-200/80 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-[0_8px_28px_-4px_rgba(40,90,165,0.14),0_2px_8px_-2px_rgba(40,90,165,0.08)] hover:-translate-y-1 hover:border-blue-200/60 transition-all duration-300 group flex flex-col justify-between overflow-hidden gpu-layer",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            )}
            style={{
              transitionDelay: isVisible
                ? `${120 + idx * 80}ms`
                : "0ms",
            }}
          >
            <div className="flex flex-col md:flex-row items-stretch justify-between gap-5 sm:gap-6 lg:gap-7 h-full">
              {/* Left side: Quote + Author */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-1 pl-1 sm:pl-2">
                <div>
                  {/* Editorial Double Quote icon */}
                  <div className="mb-3.5 sm:mb-4">
                    <svg
                      className="w-7 h-7 sm:w-8 sm:h-8 text-[#345DAB] fill-current opacity-95"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-slate-700 text-sm sm:text-[15px] lg:text-base leading-relaxed mb-5 sm:mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Author Credentials */}
                <div className="pt-3 sm:pt-4">
                  <h3 className="font-display font-semibold text-diagnova-navy text-sm sm:text-base leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5">
                    {item.role}, {item.organization}
                  </p>
                </div>
              </div>

              {/* Right side: Enlarged Photographic Silhouette (Thin padding to card edge, no hover scale) */}
              <div className="relative w-full md:w-[260px] lg:w-[290px] xl:w-[320px] min-h-[250px] md:min-h-[290px] aspect-[4/5] rounded-xl sm:rounded-2xl lg:rounded-[22px] overflow-hidden bg-gradient-to-br from-[#275EA8] to-[#5AA3E8] shrink-0 shadow-inner">
                <Image
                  src={item.imageSrc}
                  alt={`${item.name} - silhouette`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 290px, 320px"
                  className="object-cover object-center"
                  loading="lazy"
                />
                {/* Subtle soft gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E234B]/20 via-transparent to-white/10" />
              </div>
            </div>
          </div>
        ))}
        {/* Spacer to ensure last card doesn't stick to edge */}
        <div className="shrink-0 w-1 lg:w-4" aria-hidden="true" />
      </div>

      {/* ═══ NAVIGATION BUTTONS ═══ */}
      <div className="mx-auto max-w-[1560px] px-6 sm:px-8 lg:px-10 w-full">
        <div className="flex items-center justify-end gap-2.5 pt-6 sm:pt-8">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-[#EBF3FB] hover:border-[#D5E5F7] hover:text-[#2A5EAA] active:scale-95 transition-all cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-[#EBF3FB] hover:border-[#D5E5F7] hover:text-[#2A5EAA] active:scale-95 transition-all cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
