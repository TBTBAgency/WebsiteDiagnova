import React from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComparisonItem } from "@/types";

interface ComparisonCardProps {
  item: ComparisonItem;
  className?: string;
}

export function ComparisonCard({ item, className }: ComparisonCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-nova-blue/40 hover:shadow-xl",
        className
      )}
    >
      {/* Header Number & Impact Pill */}
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-diagnova-light/60 text-xs font-bold text-diagnova-blue">
          {String(item.id).padStart(2, "0")}
        </span>
        {item.impactMetric && (
          <span className="rounded-full bg-nova-blue/10 px-3 py-1 text-xs font-semibold text-diagnova-blue">
            {item.impactMetric}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Conventional LIS Problem */}
        <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 transition-colors">
          <div className="mb-2 flex items-center gap-2 text-rose-600">
            <XCircle className="h-4 w-4 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              LIS Konvensional
            </span>
          </div>
          <h4 className="mb-1 text-sm font-bold text-slate-800">
            {item.conventional.title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-600">
            {item.conventional.description}
          </p>
        </div>

        {/* Diagnova Solution */}
        <div className="rounded-xl border border-diagnova-light bg-gradient-to-br from-diagnova-ice/60 to-white p-4 transition-all group-hover:border-nova-blue/50">
          <div className="mb-2 flex items-center gap-2 text-diagnova-blue">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-nova-blue" />
            <span className="text-xs font-semibold uppercase tracking-wider text-diagnova-blue">
              Keunggulan Diagnova
            </span>
          </div>
          <h4 className="mb-1 text-sm font-bold text-diagnova-navy">
            {item.diagnova.title}
          </h4>
          <p className="text-xs leading-relaxed text-slate-700">
            {item.diagnova.description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface TransformationCardProps {
  from: string;
  to: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function TransformationCard({
  from,
  to,
  description,
  icon,
  className,
}: TransformationCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-diagnova-navy to-diagnova-blue p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-diagnova-blue/30",
        className
      )}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-nova-light backdrop-blur-md">
        {icon}
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-medium text-white/60 line-through decoration-rose-400/80">
          {from}
        </span>
        <ArrowRight className="h-4 w-4 text-nova-blue" />
        <span className="text-base font-bold text-white tracking-wide">
          {to}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-white/85">{description}</p>
    </div>
  );
}
