import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "blue" | "white" | "gray";
  className?: string;
  showDot?: boolean;
  withShine?: boolean;
}

export function SectionBadge({
  children,
  variant = "light",
  className,
  showDot = false,
  withShine = false,
}: SectionBadgeProps) {
  const variantStyles = {
    light: "bg-slate-100 text-slate-700 border border-slate-200/60 shadow-xs",
    dark: "bg-white/15 text-white border border-white/25 backdrop-blur-md shadow-xs",
    blue: "bg-[#EBF3FB] text-[#2A5EAA] border border-[#D5E5F7] shadow-2xs",
    white: "bg-white text-diagnova-navy border border-slate-200/80 shadow-xs",
    gray: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const dotColor = {
    light: "bg-slate-500",
    dark: "bg-blue-300",
    blue: "bg-[#2A5EAA]",
    white: "bg-[#2568BA]",
    gray: "bg-slate-400",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold tracking-[0.035em] uppercase transition-all duration-200 select-none overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {withShine && <span className="animate-shine-continuous" />}
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor[variant])} />
      )}
      <span>{children}</span>
    </div>
  );
}
