import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  badge?: {
    text: string;
    variant?: "default" | "success" | "warning" | "danger" | "purple";
  };
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-[#087BEE]",
  badge,
  onClick,
  className,
}: MetricCardProps) {
  const getBadgeStyle = (variant: string = "default") => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "danger":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/60";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative bg-white rounded-2xl border border-[#E8EBEF] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200",
        onClick ? "cursor-pointer hover:border-slate-300 hover:shadow-md" : "hover:border-slate-300/80",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
            iconBg,
            iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {badge && (
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
              getBadgeStyle(badge.variant)
            )}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight font-display mb-1">
          {value}
        </div>
        <div className="text-xs font-medium text-[#747B86] mb-1.5">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-[#747B86]/80 flex items-center gap-1 font-normal">
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
}
