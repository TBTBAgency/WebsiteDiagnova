"use client";

import React from "react";
import { Zap, Network, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionBadge } from "@/components/ui/SectionBadge";

interface InfrastructureCard {
  id: string;
  title: string;
  description: string;
  iconName: "automation" | "integration" | "ai";
}

const infrastructureCardsID: InfrastructureCard[] = [
  {
    id: "automation",
    title: "Otomatisasi 100%",
    description:
      "Identifikasi kode batang yang ketat dan koneksi alat dua arah memangkas Turnaround Time (TAT) hingga 70% dengan mengeliminasi entri data manual.",
    iconName: "automation",
  },
  {
    id: "integration",
    title: "Integrasi Tanpa Hambatan",
    description:
      "Terhubung secara asli dengan SIMRS, RME, dan siap SATUSEHAT. Kompatibel secara universal dengan lebih dari 500 instrumen medis.",
    iconName: "integration",
  },
  {
    id: "nova-ai",
    title: "Asisten Nova AI",
    description:
      "Nova AI mendeteksi pola, memberikan peringatan dini, dan menyederhanakan angka diagnostik kompleks. Keputusan medis tetap 100% di tangan dokter.",
    iconName: "ai",
  },
];

const infrastructureCardsEN: InfrastructureCard[] = [
  {
    id: "automation",
    title: "100% Automation",
    description:
      "Strict barcode identification and direct analyzer interfacing cut Turnaround Time (TAT) by up to 70% by eliminating manual data entry.",
    iconName: "automation",
  },
  {
    id: "integration",
    title: "Seamless Integration",
    description:
      "Natively bridges with HIS, EMR, and is SATUSEHAT ready. Universally compatible with over 500 medical instruments.",
    iconName: "integration",
  },
  {
    id: "nova-ai",
    title: "Nova AI Assistant",
    description:
      "Nova AI detects patterns, provides early warnings, and simplifies complex numbers. Treatment decisions remain 100% with the doctor.",
    iconName: "ai",
  },
];

function getCardIcon(iconName: InfrastructureCard["iconName"], className = "h-5 w-5") {
  switch (iconName) {
    case "automation":
      return <Zap className={className} />;
    case "integration":
      return <Network className={className} />;
    case "ai":
      return <Sparkles className={className} />;
  }
}

export interface InfrastructureSectionProps {
  initialData?: {
    section?: any;
  } | null;
}

export function InfrastructureSection({ initialData }: InfrastructureSectionProps = {}) {
  const { language } = useLanguage();
  const baseCards = language === "ID" ? infrastructureCardsID : infrastructureCardsEN;

  const dynamicCards: InfrastructureCard[] | null = initialData?.section?.extraContent?.cards?.map((cmsCard: any, idx: number) => {
    const fallback = baseCards[idx] || baseCards[0];
    return {
      ...fallback,
      title: (language === "ID" ? cmsCard.titleId : cmsCard.titleEn) || fallback.title,
      description: (language === "ID" ? cmsCard.descriptionId : cmsCard.descriptionEn) || fallback.description,
    };
  });

  const infrastructureCards: InfrastructureCard[] = dynamicCards && dynamicCards.length === 3 ? dynamicCards : baseCards;

  const sectionBadge =
    (language === "ID" ? initialData?.section?.badgeId : initialData?.section?.badgeEn) ||
    (language === "ID" ? "Infrastruktur" : "Infrastructure");

  const sectionTitle =
    (language === "ID" ? initialData?.section?.titleId : initialData?.section?.titleEn) ||
    (language === "ID" ? "Infrastruktur Cerdas untuk Operasional Tanpa Hambatan" : "Intelligent Infrastructure for Seamless Operations");

  const sectionSubtitle =
    (language === "ID" ? initialData?.section?.subtitleId : initialData?.section?.subtitleEn) ||
    (language === "ID"
      ? "Fondasi sistem laboratorium modern yang dirancang untuk kecepatan tinggi, akurasi klinis, dan skalabilitas jangka panjang."
      : "A modern laboratory foundation engineered for high-throughput speed, clinical accuracy, and long-term scalability.");

  return (
    <section
      className="relative w-full bg-[#F9F9F9] py-16 sm:py-20 lg:py-24"
      id="infrastructure"
      aria-label="Infrastructure Section"
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start lg:items-center">
          {/* ═══ LEFT COLUMN: Badge, Headline & Supporting Copy ═══ */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-3.5 sm:mb-4">
              <SectionBadge variant="blue">
                {sectionBadge}
              </SectionBadge>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold leading-[1.18] sm:leading-[1.22] tracking-tight text-slate-900">
              {sectionTitle}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg font-light">
              {sectionSubtitle}
            </p>
          </div>

          {/* ═══ RIGHT COLUMN: 3 Clean Stacked Infrastructure Cards ═══ */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
            {infrastructureCards.map((card, idx) => (
              <div
                key={card.id}
                className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/85 p-5 sm:p-6 lg:p-7 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2764B8]/35 hover:shadow-[0_14px_34px_-14px_rgba(39,100,184,0.18)]"
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  {/* Icon Badge */}
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#EEF5FF] text-[#2764B8] transition-colors duration-300 group-hover:bg-[#2764B8] group-hover:text-white">
                    {getCardIcon(card.iconName, "h-5 w-5")}
                  </div>

                  {/* Card Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1.5 sm:mb-2">
                      <h3 className="font-semibold text-base sm:text-lg leading-snug tracking-tight text-slate-900">
                        {card.title}
                      </h3>
                      <span className="text-xs font-semibold tabular-nums text-slate-300 transition-colors duration-300 group-hover:text-[#2764B8]/60">
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
