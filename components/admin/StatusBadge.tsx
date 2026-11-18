"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAdminLang } from "@/components/admin/AdminLanguage";

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
  type: BadgeType | string | number;
  label?: string;
  className?: string;
  showDot?: boolean;
}

const BADGE_MAP: Record<
  string,
  { label: { id: string; en: string }; bg: string; text: string; border: string; dot: string }
> = {
  // Leads (Integer Status: 1 = Baru, 2 = Dihubungi, 3 = Jadwal Demo, 4 = Selesai)
  "1": {
    label: { id: "Baru", en: "New" },
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-600",
  },
  "2": {
    label: { id: "Dihubungi", en: "Contacted" },
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  "3": {
    label: { id: "Jadwal Demo", en: "Demo Scheduled" },
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  "4": {
    label: { id: "Selesai", en: "Completed" },
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  lead_new: {
    label: { id: "Baru", en: "New" },
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-600",
  },
  new: {
    label: { id: "Baru", en: "New" },
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
    dot: "bg-blue-600",
  },
  lead_contacted: {
    label: { id: "Dihubungi", en: "Contacted" },
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  contacted: {
    label: { id: "Dihubungi", en: "Contacted" },
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
  },
  lead_scheduled: {
    label: { id: "Jadwal Demo", en: "Demo Scheduled" },
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  scheduled: {
    label: { id: "Jadwal Demo", en: "Demo Scheduled" },
    bg: "bg-purple-50/80",
    text: "text-purple-700",
    border: "border-purple-200/60",
    dot: "bg-purple-500",
  },
  lead_completed: {
    label: { id: "Selesai", en: "Completed" },
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },
  completed: {
    label: { id: "Selesai", en: "Completed" },
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
  },

  // Priority
  priority_cito: {
    label: { id: "CITO (Urgent)", en: "CITO (Urgent)" },
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500 animate-pulse",
  },
  cito: {
    label: { id: "CITO", en: "CITO" },
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500 animate-pulse",
  },
  priority_urgent: {
    label: { id: "Mendesak", en: "Urgent" },
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  urgent: {
    label: { id: "Mendesak", en: "Urgent" },
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  priority_routine: {
    label: { id: "Rutin", en: "Routine" },
    bg: "bg-slate-100/80",
    text: "text-slate-700",
    border: "border-slate-200/80",
    dot: "bg-slate-400",
  },
  routine: {
    label: { id: "Rutin", en: "Routine" },
    bg: "bg-slate-100/80",
    text: "text-slate-700",
    border: "border-slate-200/80",
    dot: "bg-slate-400",
  },

  // Lab Order Status
  order_ordered: {
    label: { id: "Menunggu Pengambilan", en: "Awaiting Collection" },
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  ordered: {
    label: { id: "Order Masuk", en: "Order Received" },
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  order_specimen_received: {
    label: { id: "Spesimen Diterima di Lab", en: "Specimen Received at Lab" },
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  specimen_received: {
    label: { id: "Spesimen Diterima", en: "Specimen Received" },
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  order_processing: {
    label: { id: "Sedang Dianalisis", en: "Under Analysis" },
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },
  processing: {
    label: { id: "Dianalisis", en: "Analyzing" },
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500",
  },

  // Specimen Status
  collected: {
    label: { id: "Diambil", en: "Collected" },
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  received: {
    label: { id: "Diterima Lab", en: "Received by Lab" },
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: { id: "Ditolak", en: "Rejected" },
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
  const { t } = useAdminLang();
  const key = String(type).toLowerCase();
  const fallbackLabel = label || String(type);
  const config = BADGE_MAP[key] || BADGE_MAP[String(type)] || {
    label: { id: fallbackLabel, en: fallbackLabel },
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  };

  const displayLabel = label || t(config.label.id, config.label.en);

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
