"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface DataPoint {
  date: string;
  label: string;
  leads: number;
  orders: number;
}

interface InteractiveChartProps {
  data: DataPoint[];
  className?: string;
}

export function InteractiveChart({ data, className }: InteractiveChartProps) {
  const [activeSeries, setActiveSeries] = useState<"all" | "leads" | "orders">("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 680;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Nilai maksimum untuk skala Y (minimal 4 untuk visualisasi yang proporsional)
  const maxValue = useMemo(() => {
    let max = 4;
    for (const d of data) {
      if (d.leads > max) max = d.leads;
      if (d.orders > max) max = d.orders;
      if (d.leads + d.orders > max) max = d.leads + d.orders;
    }
    return Math.ceil(max * 1.2);
  }, [data]);

  // Koordinat titik
  const points = useMemo(() => {
    if (!data.length) return [];
    const stepX = (width - paddingX * 2) / Math.max(1, data.length - 1);

    return data.map((d, index) => {
      const x = paddingX + index * stepX;
      const yLeads = height - paddingY - (d.leads / maxValue) * (height - paddingY * 2);
      const yOrders = height - paddingY - (d.orders / maxValue) * (height - paddingY * 2);
      return { x, yLeads, yOrders, ...d };
    });
  }, [data, maxValue, width, height]);

  // Generate smooth cubic bezier SVG path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const leadsPath = useMemo(() => {
    return createSmoothPath(points.map((p) => ({ x: p.x, y: p.yLeads })));
  }, [points]);

  const ordersPath = useMemo(() => {
    return createSmoothPath(points.map((p) => ({ x: p.x, y: p.yOrders })));
  }, [points]);

  const leadsAreaPath = useMemo(() => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${leadsPath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  }, [leadsPath, points, height]);

  const ordersAreaPath = useMemo(() => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${ordersPath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
  }, [ordersPath, points, height]);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Chart Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E8EBEF]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-[#F5F6F8] rounded-xl border border-[#E8EBEF]">
            <button
              type="button"
              onClick={() => setActiveSeries("all")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                activeSeries === "all"
                  ? "bg-white text-[#17191D] shadow-xs font-semibold"
                  : "text-[#747B86] hover:text-[#17191D]"
              )}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries("leads")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                activeSeries === "leads"
                  ? "bg-white text-[#087BEE] shadow-xs font-semibold"
                  : "text-[#747B86] hover:text-[#17191D]"
              )}
            >
              Permohonan Demo
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries("orders")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-lg transition-all",
                activeSeries === "orders"
                  ? "bg-white text-[#16A374] shadow-xs font-semibold"
                  : "text-[#747B86] hover:text-[#17191D]"
              )}
            >
              Lab Orders
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-[#747B86]">
          {(activeSeries === "all" || activeSeries === "leads") && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#087BEE]" />
              <span>Demo Leads</span>
            </div>
          )}
          {(activeSeries === "all" || activeSeries === "orders") && (
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16A374]" />
              <span>Lab Orders</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#087BEE" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#087BEE" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A374" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#16A374" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * (height - paddingY * 2);
            const val = Math.round(pct * maxValue);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E8EBEF"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#747B86"
                  fontWeight="500"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill: Leads */}
          {(activeSeries === "all" || activeSeries === "leads") && (
            <path d={leadsAreaPath} fill="url(#leadsGradient)" />
          )}

          {/* Area Fill: Orders */}
          {(activeSeries === "all" || activeSeries === "orders") && (
            <path d={ordersAreaPath} fill="url(#ordersGradient)" />
          )}

          {/* Line Stroke: Leads */}
          {(activeSeries === "all" || activeSeries === "leads") && (
            <path
              d={leadsPath}
              fill="none"
              stroke="#087BEE"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Line Stroke: Orders */}
          {(activeSeries === "all" || activeSeries === "orders") && (
            <path
              d={ordersPath}
              fill="none"
              stroke="#16A374"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover Column Tracking Lines & Tooltips */}
          {points.map((p, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <g
                key={p.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hit area */}
                <rect
                  x={p.x - (width / points.length) / 2}
                  y={paddingY}
                  width={width / points.length}
                  height={height - paddingY * 2}
                  fill="transparent"
                />

                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingY}
                    x2={p.x}
                    y2={height - paddingY}
                    stroke="#17191D"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.4"
                  />
                )}

                {/* Data point dot: Leads */}
                {(activeSeries === "all" || activeSeries === "leads") && (
                  <circle
                    cx={p.x}
                    cy={p.yLeads}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#087BEE"
                    strokeWidth={isHovered ? "2.5" : "2"}
                    className="transition-all duration-150"
                  />
                )}

                {/* Data point dot: Orders */}
                {(activeSeries === "all" || activeSeries === "orders") && (
                  <circle
                    cx={p.x}
                    cy={p.yOrders}
                    r={isHovered ? 5.5 : 3.5}
                    fill="#FFFFFF"
                    stroke="#16A374"
                    strokeWidth={isHovered ? "2.5" : "2"}
                    className="transition-all duration-150"
                  />
                )}

                {/* X-axis Label (Setiap 2 atau 3 interval agar rapi) */}
                {index % 2 === 0 && (
                  <text
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#747B86"
                    fontWeight="500"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Box */}
        {activePoint && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-full bg-white/95 backdrop-blur-md rounded-xl border border-[#E8EBEF] px-3 py-2 shadow-lg z-20 text-xs min-w-[130px] transition-all duration-100"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(Math.min(activePoint.yLeads, activePoint.yOrders) / height) * 100 - 4}%`,
            }}
          >
            <div className="font-semibold text-[#17191D] pb-1 border-b border-[#E8EBEF] mb-1">
              {activePoint.label}
            </div>
            {(activeSeries === "all" || activeSeries === "leads") && (
              <div className="flex items-center justify-between gap-3 text-[11px] text-[#087BEE]">
                <span>Leads Masuk:</span>
                <span className="font-bold">{activePoint.leads}</span>
              </div>
            )}
            {(activeSeries === "all" || activeSeries === "orders") && (
              <div className="flex items-center justify-between gap-3 text-[11px] text-[#16A374]">
                <span>Lab Orders:</span>
                <span className="font-bold">{activePoint.orders}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
