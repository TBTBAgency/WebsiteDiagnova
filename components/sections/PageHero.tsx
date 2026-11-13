"use client";

import React, { useState } from "react";
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
  const [activeMetric, setActiveMetric] = useState<number | null>(null);

  return (
    <section
      className={cn(
        // Exact same outer dimensions as Home Hero: full viewport 100dvh, flex flex-col, same padding
        "relative w-full h-[100dvh] min-h-[700px] lg:min-h-[760px] pb-3 sm:pb-4 px-4 sm:px-5 lg:px-6 bg-white flex flex-col transition-[padding-top] duration-300 ease-in-out",
        className
      )}
      style={{
        paddingTop: "calc(88px + var(--announcement-bar-height, 0px))",
      }}
    >
      {/* ─── Framed Hero Card with Exact Same Dimensions & Rounded Corners as Home Hero ─── */}
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] lg:rounded-[36px] overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white border border-slate-200/90 shadow-xs flex items-center justify-center p-6 sm:p-8 lg:p-12">
        {/* Subtle Ambient Soft Glow */}
        <div className="absolute -top-32 right-1/4 w-[480px] h-[480px] rounded-full bg-blue-100/35 blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-32 left-1/4 w-[420px] h-[420px] rounded-full bg-blue-50/50 blur-[100px] pointer-events-none z-0" />

        {/* Centered Content Wrapper: Perfectly balanced vertically with ample breathing room on top & bottom */}
        <div className="relative z-10 w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 my-auto flex flex-col items-center justify-center text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
            {/* Section Badge */}
            <div className="mb-4 sm:mb-6 animate-ll-hero" style={{ animationDelay: "0ms" }}>
              <SectionBadge variant={badgeVariant}>{badge}</SectionBadge>
            </div>

            {/* Headline - Standardized font size & line-height */}
            <h1
              className="font-display text-3xl sm:text-5xl lg:text-[52px] xl:text-[54px] font-bold leading-[1.14] sm:leading-[1.16] tracking-tight text-slate-900 min-h-[72px] sm:min-h-[114px] lg:min-h-[126px] flex items-center justify-center animate-ll-hero"
              style={{ animationDelay: "80ms" }}
            >
              {title}
            </h1>

            {/* Subtitle - Generous breathing room, standardized typography */}
            <p
              className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-500 max-w-2xl font-light min-h-[48px] sm:min-h-[56px] flex items-center justify-center animate-ll-hero"
              style={{ animationDelay: "160ms" }}
            >
              {subtitle}
            </p>

            {/* CTA Buttons */}
            {(primaryCta || secondaryCta) && (
              <div
                className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-ll-hero"
                style={{ animationDelay: "240ms" }}
              >
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#2764B8] hover:bg-[#1E5299] px-7 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-sm transition-all duration-200 active:scale-[0.98] overflow-hidden"
                  >
                    <span className="animate-shine-continuous" />
                    <span className="relative z-10">{primaryCta.text}</span>
                    <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                      {primaryCta.icon || <ArrowRight className="h-4 w-4" />}
                    </span>
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

            {/* Exactly 4 Dynamic Interactive Hero Metric Cards */}
            <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full max-w-4xl">
              {metrics.map((kpi, idx) => {
                const isActive = activeMetric === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onMouseEnter={() => setActiveMetric(idx)}
                    onMouseLeave={() => setActiveMetric(null)}
                    onClick={() => setActiveMetric(isActive ? null : idx)}
                    className={cn(
                      "group relative overflow-hidden rounded-[22px] sm:rounded-[26px] bg-white/95 backdrop-blur-xs border p-4 sm:p-5 text-left transition-all duration-300 ease-out flex flex-col justify-between min-h-[126px] sm:min-h-[140px] animate-ll-hero cursor-pointer",
                      isActive
                        ? "-translate-y-1.5 border-[#0073FC]/45 shadow-[0_16px_34px_-12px_rgba(0,115,252,0.18)]"
                        : "border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.05)] hover:-translate-y-1.5 hover:border-[#0073FC]/40 hover:shadow-[0_16px_34px_-12px_rgba(0,115,252,0.16)]"
                    )}
                    style={{ animationDelay: `${300 + idx * 70}ms` }}
                  >
                    {/* Animated Top Accent Sweep */}
                    <span
                      className={cn(
                        "absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#0073FC] to-[#38BDF8] transition-all duration-300 ease-out",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />

                    {/* Soft Ambient Hover Glow */}
                    <span
                      className={cn(
                        "pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#0073FC]/10 blur-2xl transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    />

                    <div className="relative z-10 w-full">
                      {/* Top Index + Live Pulse Indicator */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 group-hover:text-[#0073FC] transition-colors">
                          0{idx + 1}
                        </span>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all duration-300",
                            isActive
                              ? "bg-[#0073FC] scale-125"
                              : "bg-blue-300/80 group-hover:bg-[#0073FC] group-hover:scale-125"
                          )}
                        />
                      </div>

                      <p
                        className={cn(
                          "font-display text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-200",
                          isActive ? "text-[#0073FC]" : "text-slate-900 group-hover:text-[#0073FC]"
                        )}
                      >
                        {kpi.value}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1 leading-snug">
                        {kpi.label}
                      </p>
                    </div>

                    <div className="relative z-10 w-full mt-2.5">
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-tight">
                        {kpi.sub}
                      </p>
                      {/* Interactive Progress Spark */}
                      <div className="mt-2.5 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r from-[#0073FC] to-[#38BDF8] transition-all duration-500 ease-out",
                            isActive ? "w-full" : "w-1/2 group-hover:w-full"
                          )}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
