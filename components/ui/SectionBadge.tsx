import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "blue" | "white" | "gray";
  className?: string;
}

export function SectionBadge({
  children,
  variant = "light",
  className,
}: SectionBadgeProps) {
  const variantStyles = {
    light:
      "bg-[#EAF3FA] text-[#1D3F82] border-blue-100",
    dark: "bg-white/15 text-white border-white/25 backdrop-blur-md",
    blue: "bg-[#345DAB]/10 text-[#345DAB] border-[#345DAB]/20",
    white: "bg-white text-[#1D3F82] border-slate-200 shadow-xs",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-[11px] font-semibold tracking-wide uppercase transition-all duration-200 select-none",
        variantStyles[variant],
        className
      )}
    >
      <span>{children}</span>
    </div>
  );
}
