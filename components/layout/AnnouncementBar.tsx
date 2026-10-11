"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalItem {
  id: string;
  label: string;
  targetId: string;
  href?: string;
}

interface AnnouncementBarProps {
  language?: "ID" | "EN";
}

export function AnnouncementBar({ language = "EN" }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user previously closed it in this session
    const isDismissed = sessionStorage.getItem("diagnova_goal_bar_dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    } else {
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
    }
  }, []);

  // Dynamically update CSS custom property so Hero padding adjusts with zero shift
  useEffect(() => {
    if (!isVisible || !barRef.current) return;

    const updateHeight = () => {
      if (barRef.current) {
        const height = barRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--announcement-bar-height",
          `${height}px`
        );
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(barRef.current);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--announcement-bar-height", "0px");
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("diagnova_goal_bar_dismissed", "true");
    document.documentElement.style.setProperty("--announcement-bar-height", "0px");
  };

  const handleGoalClick = (targetId: string, href?: string) => {
    if (pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    if (href) {
      router.push(href);
    } else {
      router.push(`/#${targetId}`);
    }
  };

  const goals: GoalItem[] =
    language === "ID"
      ? [
          {
            id: "demo",
            label: "Request Demo",
            targetId: "cta-banner",
            href: "/request-demo",
          },
          {
            id: "workflow",
            label: "Lihat Workflow Lab",
            targetId: "workflow",
          },
          {
            id: "analyzers",
            label: "Koneksi 500+ Alat",
            targetId: "infrastructure",
          },
          {
            id: "satusehat",
            label: "Integrasi SATUSEHAT",
            targetId: "infrastructure",
          },
          {
            id: "comparison",
            label: "Kenapa Diagnova",
            targetId: "comparison",
          },
        ]
      : [
          {
            id: "demo",
            label: "Request a Demo",
            targetId: "cta-banner",
            href: "/request-demo",
          },
          {
            id: "workflow",
            label: "Explore Lab Workflow",
            targetId: "workflow",
          },
          {
            id: "analyzers",
            label: "500+ Analyzers",
            targetId: "infrastructure",
          },
          {
            id: "satusehat",
            label: "SATUSEHAT Bridging",
            targetId: "infrastructure",
          },
          {
            id: "comparison",
            label: "Why Choose Diagnova",
            targetId: "comparison",
          },
        ];

  if (!isVisible) return null;

  return (
    <aside
      ref={barRef}
      aria-label="Interactive Goal Navigator"
      className={cn(
        "relative w-full bg-[#2764B8] text-white transition-all duration-300 ease-in-out z-50 overflow-hidden",
        "border-b border-[#1E5299]/60 shadow-sm select-none"
      )}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-4 relative pr-8 lg:pr-10">
          {/* Prompt Headline */}
          <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto shrink-0">
            <p className="text-xs sm:text-[13px] font-normal text-white/95 text-center lg:text-left tracking-normal leading-tight">
              {language === "ID"
                ? "Pilih kebutuhan laboratorium Anda untuk memulai. Saya ingin..."
                : "Select your laboratory goal to get started. I want to..."}
            </p>
          </div>

          {/* Interactive Goal Pills (Tailored to Diagnova's Core Solutions) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => handleGoalClick(goal.targetId, goal.href)}
                className={cn(
                  "inline-flex items-center justify-center px-3 sm:px-3.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-wider",
                  "bg-white/20 hover:bg-white text-white hover:text-[#2764B8] border border-white/30",
                  "transition-all duration-200 ease-out cursor-pointer active:scale-95 shadow-sm hover:shadow"
                )}
              >
                {goal.label}
              </button>
            ))}
          </div>

          {/* Close / Dismiss Button (Circular pill with X icon matching reference image) */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close goal navigator"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/30 text-white transition-colors duration-200 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
