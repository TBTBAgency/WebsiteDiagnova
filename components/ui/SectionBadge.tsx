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
    light:
      "bg-diagnova-light/60 text-diagnova-blue border-diagnova-light/80 shadow-sm",
    dark: "bg-white/10 text-nova-light border-white/20 backdrop-blur-md",
    blue: "bg-diagnova-blue/10 text-diagnova-blue border-diagnova-blue/20",
    white: "bg-white text-diagnova-navy border-white shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-wider uppercase transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-nova-blue animate-pulse" />
      <span>{children}</span>
    </div>
  );
}
