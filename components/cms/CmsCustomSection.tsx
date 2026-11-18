"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { isSafeCmsUrl, type CustomSectionContent } from "@/lib/cms-layout";

const pick = (id?: string, en?: string, lang: "ID" | "EN" = "ID") => {
  const primary = lang === "ID" ? id : en;
  const secondary = lang === "ID" ? en : id;
  return (primary && primary.trim()) || (secondary && secondary.trim()) || "";
};

/**
 * Section kustom yang ditambahkan admin melalui CMS (badge, judul, deskripsi, gambar, CTA).
 * Semua teks dirender sebagai teks biasa; URL divalidasi (tanpa javascript:).
 */
export function CmsCustomSection({ id, content }: { id: string; content: CustomSectionContent }) {
  const { language } = useLanguage();
  const badge = pick(content.badgeId, content.badgeEn, language);
  const title = pick(content.titleId, content.titleEn, language);
  const subtitle = pick(content.subtitleId, content.subtitleEn, language);
  const ctaText = pick(content.ctaTextId, content.ctaTextEn, language);
  const ctaUrl = content.ctaUrl && isSafeCmsUrl(content.ctaUrl) ? content.ctaUrl.trim() : "";
  const imageUrl = content.imageUrl && isSafeCmsUrl(content.imageUrl) ? content.imageUrl.trim() : "";

  if (!title && !subtitle && !imageUrl) return null;

  return (
    <section
      id={id}
      data-cms-custom-section={id}
      className="scroll-mt-28 w-full bg-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/60"
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10 w-full">
        <div className={imageUrl ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center" : "max-w-3xl"}>
          <div className={imageUrl ? "lg:col-span-6" : ""}>
            {badge && (
              <div className="mb-4">
                <SectionBadge variant="blue">{badge}</SectionBadge>
              </div>
            )}
            {title && (
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.18] tracking-tight text-slate-900 whitespace-pre-line">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 whitespace-pre-line">
                {subtitle}
              </p>
            )}
            {ctaText && ctaUrl && (
              <Link
                href={ctaUrl}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0073FC] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#005fd1] transition-colors"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          {imageUrl && (
            <div className="lg:col-span-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={content.imageAlt || title || ""}
                loading="lazy"
                className="w-full h-auto rounded-[28px] border border-slate-200/80 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
