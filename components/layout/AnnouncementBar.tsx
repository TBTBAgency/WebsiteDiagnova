"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goals: GoalItem[] = [
    {
      id: "demo",
      label: "Request a Demo",
      onClick: () => scrollToSection("cta-banner"),
    },
    {
      id: "solutions",
      label: "Review Software Solutions",
      onClick: () => scrollToSection("workflow"),
    },
    {
      id: "testimonials",
      label: "Watch Testimonials",
      onClick: () => scrollToSection("trusted-by"),
    },
    {
      id: "whitepapers",
      label: "White Papers",
      onClick: () => scrollToSection("infrastructure"),
    },
    {
      id: "learn-more",
      label: "Learn More",
      onClick: () => scrollToSection("about"),
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
              Select a goal and we&apos;ll help you to get started. I want to...
            </p>
          </div>

          {/* Interactive Goal Pills (Compact, Sleek, Not Overly Tall) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {goals.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={goal.onClick}
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

          {/* Close / Dismiss Button (Right circular pill with X icon matching reference image) */}
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
