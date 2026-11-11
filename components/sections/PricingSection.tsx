"use client";

import React from "react";
import {
  Zap,
  Flame,
  Info,
  ArrowLeftRight,
  Monitor,
  Globe,
  Mic,
  Phone,
  BarChart3,
  MessageSquare,
  Video,
  Share2,
  RefreshCw,
  LucideIcon,
} from "lucide-react";

interface PlanFeature {
  icon: LucideIcon;
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  description: string;
  price: number;
  badgeText: string;
  badgeStyle: {
    bg: string;
    border: string;
    text: string;
  };
  featureLabel: string;
  features: PlanFeature[];
}

const plans: PricingPlan[] = [
  {
    id: "core",
    name: "Core",
    icon: Zap,
    iconColor: "text-[#2563EB] fill-[#2563EB]",
    description: "All the essential tools your teams need to operate a best-in-class.",
    price: 19,
    badgeText: "Ideal for startups & small companies",
    badgeStyle: {
      bg: "bg-[#EFF6FF]",
      border: "border-[#BFDBFE]",
      text: "text-[#1E40AF]",
    },
    featureLabel: "Core includes:",
    features: [
      { icon: ArrowLeftRight, text: "Blended inbound/outbound" },
      { icon: Monitor, text: "Agent desktop plus" },
      { icon: Globe, text: "Geo redundancy" },
      { icon: Mic, text: "Call recording" },
      { icon: Phone, text: "Business phone service" },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    icon: Flame,
    iconColor: "text-[#9333EA] fill-[#9333EA]",
    description: "Deliver an exceptional customer experience across various channels.",
    price: 34,
    badgeText: "Ideal for enterprise companies",
    badgeStyle: {
      bg: "bg-[#FAF5FF]",
      border: "border-[#E9D5FF]",
      text: "text-[#6B21A8]",
    },
    featureLabel: "Everything in Core, plus:",
    features: [
      { icon: BarChart3, text: "Advanced reporting" },
      { icon: MessageSquare, text: "24/7 chat support" },
      { icon: Video, text: "Video meetings" },
      { icon: Share2, text: "Screenshare & file share" },
      { icon: RefreshCw, text: "Call routing" },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="w-full min-h-screen bg-[#F4F4F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans antialiased text-slate-900">
      <div className="w-full max-w-[864px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-end justify-center">
          {plans.map((plan) => (
            <div key={plan.id} className="relative group flex flex-col pt-9 w-full max-w-[420px] mx-auto">
              {/* Floating Pill Badge (Slides/fades in on hover & focus-within; always visible on touch/mobile) */}
              <div
                className={`absolute top-0 left-0 right-0 h-8 rounded-full border ${plan.badgeStyle.bg} ${plan.badgeStyle.border} ${plan.badgeStyle.text} text-[11.5px] font-semibold tracking-wide flex items-center justify-center pointer-events-none transition-all duration-200 ease-out opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 max-md:opacity-100 max-md:translate-y-0 shadow-2xs`}
              >
                {plan.badgeText}
              </div>

              {/* Card Container */}
              <div className="w-full bg-white border border-[#ECECEC] rounded-[24px] p-[28px] flex flex-col justify-between transition-all duration-200 ease-out group-hover:ring-2 group-hover:ring-[#E0E7FF] group-focus-within:ring-2 group-focus-within:ring-[#E0E7FF] group-hover:border-[#C7D2FE] group-focus-within:border-[#C7D2FE]">
                <div>
                  {/* 1. Header row: icon + plan name */}
                  <div className="flex items-center gap-2">
                    <plan.icon className={`h-[18px] w-[18px] shrink-0 ${plan.iconColor}`} aria-hidden="true" />
                    <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight leading-none">
                      {plan.name}
                    </h3>
                  </div>

                  {/* 2. One-sentence description */}
                  <p className="mt-2 text-[13px] text-[#4B5563] leading-relaxed min-h-[38px]">
                    {plan.description}
                  </p>

                  {/* 3. Thin divider line */}
                  <div className="my-5 border-t border-[#ECECEC]" />

                  {/* 4. Price section */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-[44px] font-bold text-slate-900 tracking-tight leading-none">
                      ${plan.price}
                    </span>
                    <span className="text-[13px] text-[#6B7280] font-normal ml-0.5">
                      /user/mo
                    </span>
                    <button
                      type="button"
                      aria-label={`Pricing details for ${plan.name} plan`}
                      className="inline-flex items-center justify-center text-[#6B7280] hover:text-slate-900 ml-1 rounded-full p-0.5 transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#1E2A8A]"
                    >
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* 5. Full-width CTA button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full h-12 rounded-full border border-[#D1D5DB] bg-white text-slate-900 text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ease-out group-hover:bg-[#1E2A8A] group-hover:text-white group-hover:border-[#1E2A8A] group-focus-within:bg-[#1E2A8A] group-focus-within:text-white group-focus-within:border-[#1E2A8A] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E2A8A] active:scale-[0.99] cursor-pointer"
                    >
                      <span>Talk to an expert</span>
                      <MessageSquare
                        className="h-4 w-4 fill-white text-white opacity-0 -translate-x-1 w-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:w-4 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-focus-within:w-4 transition-all duration-200 ease-out shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* 6. Thin divider line */}
                  <div className="my-5 border-t border-[#ECECEC]" />

                  {/* 7. Feature list */}
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 mb-3.5">
                      {plan.featureLabel}
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-[13px] text-[#4B5563]">
                          <feature.icon
                            className="h-4 w-4 text-[#6B7280] shrink-0 stroke-[1.75]"
                            aria-hidden="true"
                          />
                          <span>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

