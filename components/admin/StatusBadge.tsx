import React from "react";
import { cn } from "@/lib/utils";

type BadgeType =
  | "lead_new"
  | "lead_contacted"
  | "lead_scheduled"
  | "lead_completed"
  | "priority_cito"
  | "priority_urgent"
  | "priority_routine"
  | "order_ordered"
  | "order_specimen_received"
  | "order_processing"
  | "order_partially_validated"
  | "order_completed"
  | "order_cancelled"
  | "specimen_collected"
  | "specimen_received"
  | "specimen_rejected";

interface StatusBadgeProps {
  type: BadgeType | string;
  label?: string;
  className?: string;
  showDot?: boolean;
}

const BADGE_MAP: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  // Leads
  lead_new: {
    label: "Baru",
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-600",
  },
  new: {
    label: "Baru",
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-600",
  },
  lead_contacted: {
    label: "Dihubungi",
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  contacted: {
    label: "Dihubungi",
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  lead_scheduled: {
    label: "Jadwal Demo",
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  scheduled: {
    label: "Jadwal Demo",
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  lead_completed: {
    label: "Selesai",
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Selesai",
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },

  // Priority
  priority_cito: {
    label: "CITO (Urgent)",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500 animate-pulse",
  },
  cito: {
    label: "CITO",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500 animate-pulse",
  },
  priority_urgent: {
    label: "Mendesak",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  urgent: {
    label: "Mendesak",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  priority_routine: {
    label: "Rutin",
    bg: "bg-slate-100/80",
    text: "text-slate-700",
    border: "border-slate-200/80",
    dot: "bg-slate-400",
  },
  routine: {
    label: "Rutin",
    bg: "bg-slate-100/80",
    text: "text-slate-700",
    border: "border-slate-200/80",
    dot: "bg-slate-400",
  },

  // Lab Order Status
  order_ordered: {
    label: "Menunggu Pengambilan",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  ordered: {
    label: "Order Masuk",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  order_specimen_received: {
    label: "Spesimen Diterima di Lab",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  specimen_received: {
    label: "Spesimen Diterima",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  order_processing: {
    label: "Sedang Dianalisis",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  processing: {
    label: "Dianalisis",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },

  // Specimen Status
  collected: {
    label: "Diambil",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  received: {
    label: "Diterima Lab",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "Ditolak",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

export function StatusBadge({
  type,
  label,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = BADGE_MAP[type.toLowerCase()] || {
    label: label || type,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      )}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}
