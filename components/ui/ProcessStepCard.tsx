import React from "react";
import { cn } from "@/lib/utils";

interface ProcessStepCardProps {
  number: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  theme?: "dark" | "light";
  className?: string;
}

export function ProcessStepCard({
  number,
  title,
  subtitle,
  description,
  icon,
  theme = "dark",
  className,
}: ProcessStepCardProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5",
        isDark
          ? "border border-white/15 bg-white/10 text-white backdrop-blur-md hover:border-nova-blue/60 hover:bg-white/15 hover:shadow-2xl hover:shadow-nova-blue/20"
          : "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-diagnova-blue/40 hover:shadow-xl",
        className
      )}
    >
      {/* Top Header: Step Number & Icon */}
      <div className="mb-4 flex items-center justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-bold tracking-wider",
            isDark
              ? "bg-nova-blue text-diagnova-navy"
              : "bg-diagnova-blue text-white"
          )}
        >
          {number}
        </span>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isDark ? "bg-white/10 text-nova-light" : "bg-diagnova-light/60 text-diagnova-blue"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <span
          className={cn(
            "mb-1 text-xs font-semibold uppercase tracking-wider",
            isDark ? "text-nova-light/90" : "text-diagnova-blue"
          )}
        >
          {subtitle}
        </span>
      )}

      <h3
        className={cn(
          "mb-2 text-lg font-bold leading-snug",
          isDark ? "text-white" : "text-diagnova-navy"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-slate-200/90" : "text-slate-600"
        )}
      >
        {description}
      </p>
    </div>
  );
}
