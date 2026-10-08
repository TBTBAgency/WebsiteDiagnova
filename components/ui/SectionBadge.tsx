import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  variant?: "light" | "dark" | "blue" | "white";
  className?: string;
}

export function SectionBadge({
  children,
  variant = "light",
  className,
}: SectionBadgeProps) {
  const variantStyles = {
    light: "bg-slate-100 text-slate-700 border border-slate-200/60 shadow-sm",
    dark: "bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-sm",
    blue: "bg-[#EBF3FB] text-[#2A5EAA] border border-[#D5E5F7]",
    white: "bg-white text-diagnova-navy border border-slate-100 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      <span>{children}</span>
    </div>
  );
}
