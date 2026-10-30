"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { cn } from "@/lib/utils";

export interface PageHeroMetric {
  value: string;
  label: string;
  sub: string;
}

export interface PageHeroProps {
  badge: string;
  badgeVariant?: "blue" | "dark" | "light" | "gray" | "white";
  title: React.ReactNode;
  subtitle: string;
  primaryCta?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  metrics: PageHeroMetric[];
  className?: string;
}

export function PageHero({
  badge,
  badgeVariant = "blue",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  metrics,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-white px-3 sm:px-5 lg:px-6 pb-4 sm:pb-6 transition-[padding-top] duration-300 ease-in-out",
        className
      )}
      style={{
        paddingTop: "calc(88px + var(--announcement-bar-height, 0px))",
      }}
    >
      {/* ─── Framed Hero Card with Rounded Corners (Persis Style Home Hero Container) ─── */}
      <div className="relative w-full max-w-[1560px] mx-auto rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white border border-slate-200/90 shadow-xs py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-10">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-blue-100/35 blur-[100px] pointer-events-none z-0" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-blue-50/50 blur-[90px] pointer-events-none z-0" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Section Badge */}
          <div className="mb-4 sm:mb-5">
            <SectionBadge variant={badgeVariant}>{badge}</SectionBadge>
          </div>

          {/* Headline - Standardized font size, line-height & min-height across pages */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-[#345DAB] min-h-[72px] sm:min-h-[114px] lg:min-h-[126px] flex items-center justify-center">
            {title}
          </h1>

          {/* Subtitle - Standardized max-width, typography & line spacing */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl font-light min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
            {subtitle}
          </p>

          {/* CTA Buttons - Standardized height & button styling */}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <span>{primaryCta.text}</span>
                  {primaryCta.icon || <ArrowRight className="h-4 w-4" />}
                </Link>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3 sm:px-7 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-700 transition-colors shadow-xs"
                >
                  <span>{secondaryCta.text}</span>
                </a>
              )}
            </div>
          )}

          {/* Exactly 4 Standardized Metric Cards with uniform height & layout */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
            {metrics.map((kpi, idx) => (
              <div
                key={idx}
                className="rounded-[20px] sm:rounded-[24px] bg-white border border-slate-200/90 p-4 sm:p-5 text-left shadow-xs hover:border-blue-200/80 transition-colors flex flex-col justify-between min-h-[108px] sm:min-h-[118px]"
              >
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#345DAB]">
                    {kpi.value}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                    {kpi.label}
                  </p>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-tight">
                  {kpi.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
