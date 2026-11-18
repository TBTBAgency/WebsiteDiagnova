"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardList,
  Download,
  FlaskConical,
  Globe,
  Minus,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getInitials, useAdminSession } from "@/components/admin/AdminTopNav";
import { cn } from "@/lib/utils";

/* ================================================================== */
/* Tipe data (bentuk respons /api/admin/overview)                      */
/* ================================================================== */

interface TimelinePoint {
  date: string;
  label: string;
  leads: number;
  orders: number;
}

interface OverviewData {
  summary: {
    leads: {
      total: number;
      new: number;
      contacted: number;
      scheduled: number;
      completed: number;
    };
    orders: {
      total: number;
      cito: number;
      urgent: number;
      routine: number;
      received: number;
      completed: number;
    };
    specimens: {
      total: number;
      collected: number;
      received: number;
      rejected: number;
    };
    activeUsers: number;
  };
  timeline: TimelinePoint[];
  institutionDistribution: {
    type: string;
    count: number;
  }[];
  recentLeads: {
    id: string;
    name: string;
    institution: string;
    jobTitle: string;
    institutionType: string;
    status: string;
    createdAt: string;
  }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    patientName: string;
    patientMrn: string;
    physicianName: string;
    priority: string;
    status: string;
    orderedAt: string;
    itemsCount: number;
    specimensCount: number;
    receivedSpecimensCount: number;
  }[];
}

const INSTITUTION_NAMES: Record<string, string> = {
  hospital: "Rumah Sakit",
  "clinical-lab": "Laboratorium Klinis",
  "pathology-center": "Pusat Patologi",
  "microbiology-center": "Pusat Mikrobiologi",
  "blood-bank": "Bank Darah",
  other: "Lainnya",
};

/* ================================================================== */
/* Token visual                                                        */
/* ================================================================== */

const BLUE = "#2F6FED";
const BLUE_DARK = "#1D4FC4";
const BLUE_SOFT = "#BFD3FA";
const GREEN = "#16A374";
const INK = "#1E2A3B";
const MUTED = "#6B7585";
const GRID = "#E9EDF3";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED] focus-visible:ring-offset-2";

const fmt = (n: number) => n.toLocaleString("id-ID");

function sum(points: TimelinePoint[], key: "leads" | "orders") {
  return points.reduce((acc, p) => acc + (p[key] || 0), 0);
}

function pct(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function greetingFor(hour: number) {
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Skala sumbu Y bilangan bulat: 4 interval dengan maksimum minimal 4. */
function niceScale(maxValue: number) {
  const step = Math.max(1, Math.ceil(maxValue / 4));
  return { max: step * 4, ticks: [0, step, step * 2, step * 3, step * 4] };
}

/** Kurva monoton (Fritsch–Carlson): mulus tanpa overshoot di bawah nol. */
function monotonePath(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (n === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    m[i] = dx[i] === 0 ? 0 : (pts[i + 1].y - pts[i].y) / dx[i];
  }
  const t: number[] = new Array(n).fill(0);
  t[0] = m[0];
  t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      t[i] = tau * a * m[i];
      t[i + 1] = tau * b * m[i];
    }
  }

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i].x + h} ${pts[i].y + t[i] * h}, ${pts[i + 1].x - h} ${
      pts[i + 1].y - t[i + 1] * h
    }, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

/* ================================================================== */
/* Hook utilitas grafik                                                */
/* ================================================================== */

function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === "number") setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}

/** Indeks aktif untuk hover + navigasi keyboard (panah kiri/kanan). */
function useActiveIndex(count: number) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    setActive((a) => (a !== null && a >= count ? null : a));
  }, [count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!count) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((i) => (i === null ? 0 : Math.min(count - 1, i + 1)));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((i) => (i === null ? count - 1 : Math.max(0, i - 1)));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(count - 1);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  return {
    active,
    setActive,
    focusProps: {
      tabIndex: 0,
      onKeyDown,
      onFocus: () => setActive((a) => (a === null && count > 0 ? count - 1 : a)),
      onBlur: () => setActive(null),
    },
  };
}

function svgId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "");
}

/* ================================================================== */
/* Komponen dasar                                                      */
/* ================================================================== */

function Card({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-[24px] bg-white p-5 shadow-[0_6px_24px_rgba(30,42,59,0.05)] ring-1 ring-[#E4E8EF]/80 sm:p-6",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold leading-snug text-[#1E2A3B] sm:text-base">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-[#6B7585]">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-[#DDE3EC] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E2A3B] transition-colors hover:border-[#2F6FED] hover:text-[#2F6FED]",
        focusRing
      )}
    >
      {children}
    </Link>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#DDE3EC] bg-[#F8F9FB] px-4 py-8 text-center">
      <Icon className="h-5 w-5 text-[#9AA3B2]" aria-hidden="true" />
      <p className="max-w-[240px] text-xs text-[#6B7585]">{text}</p>
    </div>
  );
}

function ChartTooltip({
  x,
  y,
  width,
  children,
}: {
  x: number;
  y: number;
  width: number;
  children: React.ReactNode;
}) {
  const half = 72;
  const left = Math.min(Math.max(x, half), Math.max(half, width - half));
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-xl bg-[#1E2A3B] px-3 py-2 text-xs text-white shadow-lg"
      style={{ left, top: Math.max(0, y - 10) }}
    >
      {children}
    </div>
  );
}

function SrTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  // Dibungkus div: elemen <table> mengabaikan lebar 1px dari `sr-only` dan bisa melebarkan halaman di layar kecil.
  return (
    <div className="sr-only">
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

/* ================================================================== */
/* Grafik: aktivitas harian (garis)                                    */
/* ================================================================== */

function ActivityLineChart({ data }: { data: TimelinePoint[] }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const { active, setActive, focusProps } = useActiveIndex(data.length);
  const gradId = svgId(`lead-area-${useId()}`);

  const H = 230;
  const padL = 30;
  const padR = 10;
  const padT = 14;
  const padB = 28;
  const plotW = Math.max(0, width - padL - padR);
  const plotH = H - padT - padB;
  const n = data.length;
  const stepX = n > 1 ? plotW / (n - 1) : 0;

  const { max, ticks } = niceScale(Math.max(0, ...data.map((d) => Math.max(d.leads, d.orders))));
  const xAt = (i: number) => (n > 1 ? padL + i * stepX : padL + plotW / 2);
  const yAt = (v: number) => padT + plotH * (1 - v / max);

  const leadPts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.leads) }));
  const orderPts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.orders) }));
  const leadPath = monotonePath(leadPts);
  const orderPath = monotonePath(orderPts);
  const baseY = padT + plotH;
  const areaPath =
    n > 1 ? `${leadPath} L ${xAt(n - 1)} ${baseY} L ${xAt(0)} ${baseY} Z` : "";

  const labelEvery = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(plotW / 58))));

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!n) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = n > 1 ? Math.round((x - padL) / stepX) : 0;
    setActive(Math.min(n - 1, Math.max(0, idx)));
  };

  const activePoint = active !== null ? data[active] : null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7585]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded-full" style={{ background: BLUE }} aria-hidden="true" />
          Permohonan demo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[3px] w-4 rounded-full" style={{ background: GREEN }} aria-hidden="true" />
          Order lab
        </span>
      </div>
      <div
        ref={ref}
        {...focusProps}
        aria-label="Grafik aktivitas harian. Gunakan tombol panah kiri dan kanan untuk melihat nilai per hari."
        className={cn("relative w-full select-none rounded-xl", focusRing)}
        style={{ height: H }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={H}
            className="block touch-pan-y"
            onPointerMove={handleMove}
            onPointerDown={handleMove}
            onPointerLeave={() => setActive(null)}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BLUE} stopOpacity="0.22" />
                <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={yAt(t)}
                  y2={yAt(t)}
                  stroke={GRID}
                  strokeDasharray={t === 0 ? undefined : "3 4"}
                />
                <text x={padL - 8} y={yAt(t) + 3.5} textAnchor="end" fontSize="10" fill={MUTED}>
                  {t}
                </text>
              </g>
            ))}

            {data.map((d, i) =>
              i % labelEvery === 0 ? (
                <text
                  key={d.date}
                  x={xAt(i)}
                  y={H - 8}
                  textAnchor={n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "middle"}
                  fontSize="10"
                  fill={MUTED}
                >
                  {d.label}
                </text>
              ) : null
            )}

            {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
            <path d={orderPath} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={leadPath} fill="none" stroke={BLUE} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />

            {active !== null && activePoint && (
              <g>
                <line
                  x1={xAt(active)}
                  x2={xAt(active)}
                  y1={padT}
                  y2={baseY}
                  stroke={INK}
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                />
                <circle cx={xAt(active)} cy={yAt(activePoint.orders)} r="4.5" fill={GREEN} stroke="#fff" strokeWidth="2" />
                <circle cx={xAt(active)} cy={yAt(activePoint.leads)} r="4.5" fill={BLUE} stroke="#fff" strokeWidth="2" />
              </g>
            )}
          </svg>
        )}

        {active !== null && activePoint && (
          <ChartTooltip
            x={xAt(active)}
            y={Math.min(yAt(activePoint.leads), yAt(activePoint.orders))}
            width={width}
          >
            <div className="mb-1 text-[11px] text-white/70">{activePoint.label}</div>
            <div className="flex items-center gap-2">
              <span className="h-[3px] w-3 rounded-full" style={{ background: "#7FA8F5" }} />
              <span className="font-bold">{fmt(activePoint.leads)}</span>
              <span className="text-white/70">permohonan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[3px] w-3 rounded-full" style={{ background: "#5FD3A8" }} />
              <span className="font-bold">{fmt(activePoint.orders)}</span>
              <span className="text-white/70">order lab</span>
            </div>
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption="Aktivitas harian permohonan demo dan order lab"
        headers={["Tanggal", "Permohonan demo", "Order lab"]}
        rows={data.map((d) => [d.label, d.leads, d.orders])}
      />
    </div>
  );
}

/* ================================================================== */
/* Grafik: tren 7 hari (area bertingkat)                               */
/* ================================================================== */

function TrendStepChart({ data, splitAt }: { data: TimelinePoint[]; splitAt: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const { active, setActive, focusProps } = useActiveIndex(data.length);

  const H = 112;
  const padT = 12;
  const padB = 22;
  const plotH = H - padT - padB;
  const n = data.length;
  const bw = n > 0 ? width / n : 0;
  const maxV = Math.max(1, ...data.map((d) => d.leads));
  const yAt = (v: number) => padT + plotH * (1 - v / maxV);
  const baseY = padT + plotH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${i * bw} ${yAt(d.leads)} L ${(i + 1) * bw} ${yAt(d.leads)}`)
    .join(" ");

  const areaFor = (from: number, to: number) => {
    if (to <= from) return "";
    let d = `M ${from * bw} ${baseY}`;
    for (let i = from; i < to; i++) {
      d += ` L ${i * bw} ${yAt(data[i].leads)} L ${(i + 1) * bw} ${yAt(data[i].leads)}`;
    }
    return `${d} L ${to * bw} ${baseY} Z`;
  };

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!n || !bw) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = Math.floor((e.clientX - rect.left) / bw);
    setActive(Math.min(n - 1, Math.max(0, idx)));
  };

  const activePoint = active !== null ? data[active] : null;

  return (
    <div>
      <div
        ref={ref}
        {...focusProps}
        aria-label="Grafik permohonan harian 14 hari. Gunakan tombol panah untuk melihat nilai per hari."
        className={cn("relative w-full select-none rounded-lg", focusRing)}
        style={{ height: H }}
      >
        {width > 0 && (
          <svg
            width={width}
            height={H}
            className="block touch-pan-y"
            onPointerMove={handleMove}
            onPointerDown={handleMove}
            onPointerLeave={() => setActive(null)}
            aria-hidden="true"
          >
            <path d={areaFor(0, splitAt)} fill={BLUE} fillOpacity="0.1" />
            <path d={areaFor(splitAt, n)} fill={BLUE} fillOpacity="0.24" />
            <path d={linePath} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
            <line x1={0} x2={width} y1={baseY} y2={baseY} stroke={GRID} />
            {splitAt > 0 && splitAt < n && (
              <line
                x1={splitAt * bw}
                x2={splitAt * bw}
                y1={padT - 6}
                y2={baseY}
                stroke={INK}
                strokeOpacity="0.3"
                strokeDasharray="3 3"
              />
            )}
            {active !== null && (
              <rect
                x={active * bw + 1}
                y={padT}
                width={Math.max(0, bw - 2)}
                height={plotH}
                fill={INK}
                fillOpacity="0.06"
                rx="3"
              />
            )}
            <text x={2} y={H - 6} fontSize="10" fill={MUTED}>
              7 hari sebelumnya
            </text>
            <text x={width - 2} y={H - 6} fontSize="10" fill={MUTED} textAnchor="end">
              7 hari terakhir
            </text>
          </svg>
        )}
        {active !== null && activePoint && (
          <ChartTooltip x={active * bw + bw / 2} y={yAt(activePoint.leads)} width={width}>
            <span className="font-bold">{fmt(activePoint.leads)}</span>{" "}
            <span className="text-white/70">permohonan · {activePoint.label}</span>
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption="Permohonan demo per hari"
        headers={["Tanggal", "Permohonan"]}
        rows={data.map((d) => [d.label, d.leads])}
      />
    </div>
  );
}

/* ================================================================== */
/* Grafik: batang tahapan pipeline dengan garis rata-rata              */
/* ================================================================== */

interface StageDatum {
  key: string;
  label: string;
  value: number;
}

function PipelineBarChart({ stages, total }: { stages: StageDatum[]; total: number }) {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const { active, setActive, focusProps } = useActiveIndex(stages.length);

  const H = 240;
  const padL = 30;
  const padR = 6;
  const padT = 22;
  const padB = 30;
  const plotW = Math.max(0, width - padL - padR);
  const plotH = H - padT - padB;
  const n = stages.length;
  const band = n > 0 ? plotW / n : 0;
  const barW = Math.min(64, band * 0.56);
  const { max, ticks } = niceScale(Math.max(0, ...stages.map((s) => s.value)));
  const yAt = (v: number) => padT + plotH * (1 - v / max);
  const baseY = padT + plotH;
  const avg = n > 0 ? stages.reduce((a, s) => a + s.value, 0) / n : 0;
  const avgLabel = avg.toLocaleString("id-ID", { maximumFractionDigits: 1 });

  const barPath = (x: number, y: number, w: number, h: number) => {
    const r = Math.min(8, w / 2, h);
    return `M ${x} ${y + h} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${
      x + w
    } ${y + r} L ${x + w} ${y + h} Z`;
  };

  const activeStage = active !== null ? stages[active] : null;

  return (
    <div>
      <div
        ref={ref}
        {...focusProps}
        aria-label="Grafik jumlah permohonan per tahap. Gunakan tombol panah untuk melihat nilai tiap tahap."
        className={cn("relative w-full select-none rounded-xl", focusRing)}
        style={{ height: H }}
        onPointerLeave={() => setActive(null)}
      >
        {width > 0 && (
          <svg width={width} height={H} className="block" aria-hidden="true">
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={padL}
                  x2={width - padR}
                  y1={yAt(t)}
                  y2={yAt(t)}
                  stroke={GRID}
                  strokeDasharray={t === 0 ? undefined : "3 4"}
                />
                <text x={padL - 8} y={yAt(t) + 3.5} textAnchor="end" fontSize="10" fill={MUTED}>
                  {t}
                </text>
              </g>
            ))}

            {stages.map((s, i) => {
              const cx = padL + band * i + band / 2;
              const x = cx - barW / 2;
              const y = yAt(s.value);
              const h = baseY - y;
              const isActive = active === i;
              const dimmed = active !== null && !isActive;
              return (
                <g
                  key={s.key}
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={() => setActive(i)}
                  className="cursor-default"
                >
                  <rect x={padL + band * i} y={padT} width={band} height={plotH + padB} fill="transparent" />
                  {h > 0 ? (
                    <path
                      d={barPath(x, y, barW, h)}
                      fill={isActive ? BLUE_DARK : dimmed ? BLUE_SOFT : BLUE}
                      className="transition-colors duration-150"
                    />
                  ) : (
                    <line x1={x} x2={x + barW} y1={baseY} y2={baseY} stroke={BLUE_SOFT} strokeWidth="3" strokeLinecap="round" />
                  )}
                  <text x={cx} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="600" fill={INK}>
                    {fmt(s.value)}
                  </text>
                  <text x={cx} y={H - 9} textAnchor="middle" fontSize="11" fill={MUTED}>
                    {s.label}
                  </text>
                </g>
              );
            })}

            {/* Garis rata-rata */}
            <line
              x1={padL}
              x2={width - padR}
              y1={yAt(avg)}
              y2={yAt(avg)}
              stroke={INK}
              strokeOpacity="0.55"
              strokeDasharray="5 5"
              pointerEvents="none"
            />
            <text
              x={width - padR}
              y={yAt(avg) - 6}
              textAnchor="end"
              fontSize="10"
              fontWeight="600"
              fill={INK}
              pointerEvents="none"
            >
              Rata-rata {avgLabel}
            </text>
          </svg>
        )}

        {active !== null && activeStage && (
          <ChartTooltip x={padL + band * active + band / 2} y={yAt(activeStage.value) - 14} width={width}>
            <div className="text-[11px] text-white/70">{activeStage.label}</div>
            <div>
              <span className="font-bold">{fmt(activeStage.value)}</span>{" "}
              <span className="text-white/70">permohonan · {pct(activeStage.value, total)}%</span>
            </div>
          </ChartTooltip>
        )}
      </div>
      <SrTable
        caption="Jumlah permohonan demo per tahap"
        headers={["Tahap", "Jumlah", "Persentase"]}
        rows={stages.map((s) => [s.label, s.value, `${pct(s.value, total)}%`])}
      />
    </div>
  );
}

/* ================================================================== */
/* Kartu sorotan (biru)                                                */
/* ================================================================== */

interface Highlight {
  kicker: string;
  value: number;
  text: string;
  emptyText: string;
  href: string;
  cta: string;
}

function HighlightCard({ slides, todayLeads, todayLabel }: { slides: Highlight[]; todayLeads: number | null; todayLabel: string | null }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Info hari ini"
      className="relative flex min-w-0 flex-col overflow-hidden rounded-[24px] bg-gradient-to-br from-[#2F6FED] via-[#2A62D6] to-[#1D3F82] p-5 text-white shadow-[0_14px_34px_rgba(47,111,237,0.32)] sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-[#56ADE2]/25"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3">
        <h2 className="text-[15px] font-bold leading-snug text-white sm:text-base">Sorotan Hari Ini</h2>
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold ring-1 ring-white/25">
          Info hari ini
        </span>
      </div>

      {todayLeads !== null && (
        <p className="relative mt-1 text-xs text-white/75">
          {todayLeads > 0
            ? `${fmt(todayLeads)} permohonan masuk hari ini${todayLabel ? ` (${todayLabel})` : ""}.`
            : `Belum ada permohonan masuk hari ini${todayLabel ? ` (${todayLabel})` : ""}.`}
        </p>
      )}

      <div className="relative mt-6 flex-1" aria-live="polite">
        <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{slide.kicker}</div>
        <div className="mt-1 font-display text-5xl font-bold tracking-tight">{fmt(slide.value)}</div>
        <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-white/85">
          {slide.value > 0 ? slide.text : slide.emptyText}
        </p>
      </div>

      <Link
        href={slide.href}
        className="relative mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1D3F82] transition-colors hover:bg-[#EEF3FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A62D6]"
      >
        {slide.cta}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>

      <div className="relative mt-5 flex gap-2">
        {slides.map((s, i) => (
          <button
            key={s.kicker}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Tampilkan info ${i + 1} dari ${slides.length}: ${s.kicker}`}
            aria-current={i === index ? "true" : undefined}
            className="group flex-1 py-2 focus-visible:outline-none"
          >
            <span
              className={cn(
                "block h-1 rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-[#2A62D6]",
                i === index ? "bg-white" : "bg-white/30 group-hover:bg-white/50"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/* Skeleton & error                                                    */
/* ================================================================== */

function DashboardSkeleton() {
  const block = "animate-pulse rounded-[24px] bg-white ring-1 ring-[#E4E8EF]/80";
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
      <div className={cn(block, "h-[340px] md:col-span-2")} />
      <div className="h-[340px] animate-pulse rounded-[24px] bg-[#2F6FED]/25" />
      <div className={cn(block, "h-[340px]")} />
      <div className={cn(block, "h-[340px] md:col-span-2")} />
      <div className={cn(block, "h-[340px]")} />
      <div className={cn(block, "h-[340px]")} />
    </div>
  );
}

/* ================================================================== */
/* Halaman                                                             */
/* ================================================================== */

export default function AdminOverviewDashboard() {
  const currentUser = useAdminSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [period, setPeriod] = useState<7 | 14>(14);
  const [now, setNow] = useState<Date | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && json.data) {
        setData(json.data as OverviewData);
        setUpdatedAt(new Date());
      } else {
        setError(json?.message || "Gagal memuat data dashboard.");
      }
    } catch (err) {
      console.error("Failed to load overview data:", err);
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Waktu lokal hanya dihitung di browser (menghindari hydration mismatch)
  useEffect(() => {
    setNow(new Date());
  }, []);

  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || null;
  const greeting = now ? greetingFor(now.getHours()) : "Selamat datang";
  const todayStr = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "";

  /* ------------------------- Turunan data ------------------------- */
  const timeline = useMemo(() => data?.timeline ?? [], [data]);
  const periodData = useMemo(() => timeline.slice(-period), [timeline, period]);
  const periodLeads = sum(periodData, "leads");
  const periodOrders = sum(periodData, "orders");

  const last7 = timeline.slice(-7);
  const prev7 = timeline.length > 7 ? timeline.slice(-14, -7) : [];
  const last7Leads = sum(last7, "leads");
  const prev7Leads = sum(prev7, "leads");
  const trendData = timeline.slice(-14);
  const trendSplit = Math.max(0, trendData.length - 7);

  let deltaText = "0%";
  let deltaTone: "up" | "down" | "flat" = "flat";
  if (prev7Leads === 0 && last7Leads > 0) {
    deltaText = "Baru";
    deltaTone = "up";
  } else if (prev7Leads > 0) {
    const d = Math.round(((last7Leads - prev7Leads) / prev7Leads) * 100);
    deltaText = `${d > 0 ? "+" : ""}${d}%`;
    deltaTone = d > 0 ? "up" : d < 0 ? "down" : "flat";
  }

  const leads = data?.summary.leads;
  const leadTotal = leads?.total ?? 0;
  const stages: StageDatum[] = leads
    ? [
        { key: "new", label: "Baru", value: leads.new },
        { key: "contacted", label: "Dihubungi", value: leads.contacted },
        { key: "scheduled", label: "Jadwal Demo", value: leads.scheduled },
        { key: "completed", label: "Selesai", value: leads.completed },
      ]
    : [];

  const conversions = leads
    ? [
        {
          label: "Sudah dihubungi",
          hint: "Dihubungi, jadwal demo, atau selesai",
          value: leads.contacted + leads.scheduled + leads.completed,
          color: BLUE,
        },
        {
          label: "Mencapai jadwal demo",
          hint: "Jadwal demo atau selesai",
          value: leads.scheduled + leads.completed,
          color: "#5B8DF2",
        },
        {
          label: "Demo selesai",
          hint: "Status selesai",
          value: leads.completed,
          color: GREEN,
        },
        {
          label: "Menunggu respon",
          hint: "Status baru, belum dihubungi",
          value: leads.new,
          color: "#E5A23B",
        },
      ]
    : [];

  const institutions = useMemo(
    () => [...(data?.institutionDistribution ?? [])].sort((a, b) => b.count - a.count),
    [data]
  );
  const institutionTotal = institutions.reduce((a, b) => a + b.count, 0);
  const institutionMax = Math.max(1, ...institutions.map((i) => i.count));

  const todayPoint = timeline.length ? timeline[timeline.length - 1] : null;

  const highlights: Highlight[] = data
    ? [
        {
          kicker: "Menunggu respon",
          value: data.summary.leads.new,
          text: "permohonan demo berstatus baru dan belum dihubungi tim.",
          emptyText: "Semua permohonan demo sudah ditindaklanjuti.",
          href: "/admin/leads",
          cta: "Tinjau permohonan",
        },
        {
          kicker: "Jadwal demo aktif",
          value: data.summary.leads.scheduled,
          text: "permohonan sudah memiliki jadwal demo.",
          emptyText: "Belum ada permohonan dengan jadwal demo.",
          href: "/admin/leads",
          cta: "Lihat permohonan",
        },
        {
          kicker: "Order CITO",
          value: data.summary.orders.cito,
          text: "order laboratorium berprioritas CITO tercatat di LIS.",
          emptyText: "Tidak ada order laboratorium berprioritas CITO.",
          href: "/admin/orders",
          cta: "Buka order lab",
        },
      ]
    : [];

  const chip = cn(
    "inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#1E2A3B] shadow-[0_2px_10px_rgba(30,42,59,0.04)] ring-1 ring-[#E4E8EF] transition-colors hover:text-[#2F6FED] hover:ring-[#C9D7F6] disabled:opacity-60",
    focusRing
  );

  return (
    <div className="space-y-6">
      {/* ---------------------------- Sapaan ---------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {todayStr && <p className="text-sm font-medium text-[#6B7585]">{todayStr}</p>}
          <h1 className="mt-1 font-display text-[28px] font-bold leading-tight tracking-tight sm:text-4xl">
            <span className="text-[#1D3F82]">
              {greeting}
              {firstName ? "," : "!"}
            </span>
            {firstName && <span className="text-[#2F6FED]"> {firstName}!</span>}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[#6B7585]">
            Ringkasan permohonan demo, aktivitas LIS, dan profil institusi pemohon Diagnova.
          </p>
        </div>
        <Link
          href="/admin/leads"
          className={cn(
            "inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,111,237,0.32)] transition-colors hover:bg-[#1D4FC4]",
            focusRing
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Permohonan Demo
        </Link>
      </div>

      {/* ---------------------------- Toolbar --------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <a href="/api/admin/leads/export" download className={chip}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Unduh Data Leads
          </a>
          <button type="button" onClick={fetchOverview} disabled={isLoading} className={chip}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#2F6FED]")} aria-hidden="true" />
            {isLoading ? "Memuat..." : "Muat Ulang"}
          </button>
          {updatedAt && (
            <span className="px-1 text-xs text-[#6B7585]" aria-live="polite">
              Diperbarui{" "}
              {updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/leads" className={chip}>
            <Users className="h-4 w-4" aria-hidden="true" />
            Kelola Leads
          </Link>
          <Link href="/admin/orders" className={chip}>
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Order Lab
          </Link>
          <Link href="/admin/cms" className={chip}>
            <Globe className="h-4 w-4" aria-hidden="true" />
            Pusat Konten
          </Link>
        </div>
      </div>

      {/* --------------------------- Konten ----------------------------- */}
      {isLoading && !data ? (
        <>
          <span className="sr-only" role="status">
            Memuat data dashboard...
          </span>
          <DashboardSkeleton />
        </>
      ) : !data ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center ring-1 ring-[#E4E8EF]"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-[#1E2A3B]">Data dashboard gagal dimuat</p>
            <p className="mt-1 text-sm text-[#6B7585]">{error || "Terjadi kesalahan yang tidak diketahui."}</p>
          </div>
          <button
            type="button"
            onClick={fetchOverview}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4FC4]",
              focusRing
            )}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200"
            >
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Gagal memuat ulang ({error}). Menampilkan data terakhir.
              </span>
              <button
                type="button"
                onClick={fetchOverview}
                className={cn("rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-rose-200", focusRing)}
              >
                Coba Lagi
              </button>
            </div>
          )}

          <div
            className={cn(
              "grid grid-cols-1 gap-4 transition-opacity sm:gap-5 md:grid-cols-2 xl:grid-cols-4",
              isLoading && "opacity-60"
            )}
            aria-busy={isLoading}
          >
            {/* 1. Aktivitas harian */}
            <Card
              className="md:col-span-2"
              title="Aktivitas Harian"
              subtitle={`${fmt(periodLeads)} permohonan demo · ${fmt(periodOrders)} order lab dalam ${period} hari terakhir`}
              action={
                <div
                  role="group"
                  aria-label="Periode grafik"
                  className="inline-flex rounded-full bg-[#F1F3F7] p-1"
                >
                  {([7, 14] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      aria-pressed={period === p}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                        focusRing,
                        period === p ? "bg-white text-[#1E2A3B] shadow-sm" : "text-[#6B7585] hover:text-[#1E2A3B]"
                      )}
                    >
                      {p} hari
                    </button>
                  ))}
                </div>
              }
            >
              {periodData.length === 0 ? (
                <EmptyState icon={Users} text="Belum ada data aktivitas untuk ditampilkan." />
              ) : periodLeads + periodOrders === 0 ? (
                <EmptyState
                  icon={Users}
                  text={`Belum ada permohonan demo maupun order lab dalam ${period} hari terakhir.`}
                />
              ) : (
                <ActivityLineChart data={periodData} />
              )}
            </Card>

            {/* 2. Sorotan hari ini */}
            <HighlightCard
              slides={highlights}
              todayLeads={todayPoint ? todayPoint.leads : null}
              todayLabel={todayPoint?.label ?? null}
            />

            {/* 3. Tren 7 hari */}
            <Card
              title="Tren Permohonan"
              subtitle="7 hari terakhir dibanding 7 hari sebelumnya"
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-4xl font-bold tracking-tight text-[#1E2A3B]">
                    {fmt(last7Leads)}
                  </div>
                  <div className="mt-1 text-xs text-[#6B7585]">
                    permohonan · sebelumnya {fmt(prev7Leads)}
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                    deltaTone === "up" && "bg-emerald-50 text-emerald-700",
                    deltaTone === "down" && "bg-rose-50 text-rose-700",
                    deltaTone === "flat" && "bg-slate-100 text-slate-600"
                  )}
                  title="Perubahan dibanding 7 hari sebelumnya"
                >
                  {deltaTone === "up" && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  {deltaTone === "down" && <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  {deltaTone === "flat" && <Minus className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span className="sr-only">Perubahan: </span>
                  {deltaText}
                </span>
              </div>
              <div className="mt-auto pt-6">
                {last7Leads + prev7Leads === 0 ? (
                  <EmptyState icon={Users} text="Belum ada permohonan dalam 14 hari terakhir." />
                ) : (
                  <TrendStepChart data={trendData} splitAt={trendSplit} />
                )}
              </div>
            </Card>

            {/* 4. Permohonan per tahap */}
            <Card
              className="md:col-span-2"
              title="Permohonan per Tahap"
              subtitle={`Total ${fmt(leadTotal)} permohonan demo berdasarkan status saat ini`}
              action={<PillLink href="/admin/leads">Lihat Detail</PillLink>}
            >
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text="Belum ada permohonan demo yang tercatat." />
              ) : (
                <PipelineBarChart stages={stages} total={leadTotal} />
              )}
            </Card>

            {/* 5. Konversi pipeline */}
            <Card title="Konversi Pipeline" subtitle="Persentase permohonan yang telah mencapai tiap tahap">
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text="Konversi akan tampil setelah ada permohonan demo." />
              ) : (
                <ul className="space-y-4">
                  {conversions.map((c) => {
                    const p = pct(c.value, leadTotal);
                    return (
                      <li key={c.label}>
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold text-[#1E2A3B]">{c.label}</div>
                            <div className="truncate text-[11px] text-[#6B7585]">{c.hint}</div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-sm font-bold text-[#1E2A3B]">{p}%</div>
                            <div className="text-[11px] text-[#6B7585]">
                              {fmt(c.value)}/{fmt(leadTotal)}
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#EEF1F5]"
                          role="progressbar"
                          aria-label={c.label}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={p}
                        >
                          <div
                            className="h-full rounded-full transition-[width] duration-500"
                            style={{ width: `${p}%`, background: c.color }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* 6. Permohonan terbaru */}
            <Card title="Permohonan Terbaru" action={<PillLink href="/admin/leads">Lihat Semua</PillLink>}>
              {data.recentLeads.length === 0 ? (
                <EmptyState icon={Users} text="Belum ada permohonan demo yang masuk." />
              ) : (
                <ul className="-mx-2 divide-y divide-[#EEF1F5]">
                  {data.recentLeads.map((lead) => (
                    <li key={lead.id} className="flex items-center gap-3 px-2 py-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF3FD] text-[13px] font-bold text-[#2F6FED]">
                        {getInitials(lead.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-[#1E2A3B]">{lead.name}</div>
                        <div className="truncate text-[11px] text-[#6B7585]">
                          {lead.institution || INSTITUTION_NAMES[lead.institutionType] || "-"}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusBadge type={lead.status} className="px-2 text-[10px]" />
                        <span className="text-[10px] text-[#6B7585]">{formatShortDate(lead.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* 7. Order lab terbaru */}
            <Card
              className="md:col-span-2"
              title="Order Lab Terbaru"
              subtitle="Diurutkan berdasarkan prioritas, lalu waktu order"
              action={<PillLink href="/admin/orders">Buka Order</PillLink>}
            >
              {data.recentOrders.length === 0 ? (
                <EmptyState icon={FlaskConical} text="Belum ada order laboratorium yang terdaftar." />
              ) : (
                <ul className="-mx-2 divide-y divide-[#EEF1F5]">
                  {data.recentOrders.map((order) => {
                    const done = order.specimensCount > 0 && order.receivedSpecimensCount >= order.specimensCount;
                    return (
                      <li
                        key={order.id}
                        className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-2 py-3"
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F7] text-[#4B5565]">
                          <FlaskConical className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                            <span className="truncate text-[13px] font-semibold text-[#1E2A3B]">
                              {order.patientName}
                            </span>
                            <span className="font-mono text-[11px] text-[#2F6FED]">{order.orderNumber}</span>
                          </div>
                          <div className="truncate text-[11px] text-[#6B7585]">
                            {order.physicianName} · {formatDateTime(order.orderedAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge type={order.priority} className="px-2 text-[10px]" />
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              done ? "text-emerald-700" : "text-[#6B7585]"
                            )}
                          >
                            {order.receivedSpecimensCount}/{order.specimensCount} spesimen diterima
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* 8. Ringkasan LIS (label/nilai) */}
            <Card title="Ringkasan LIS" subtitle="Total seluruh order & spesimen">
              <dl className="divide-y divide-[#EEF1F5]">
                {[
                  { label: "Total order", value: data.summary.orders.total },
                  { label: "Prioritas CITO", value: data.summary.orders.cito },
                  { label: "Prioritas mendesak", value: data.summary.orders.urgent },
                  { label: "Prioritas rutin", value: data.summary.orders.routine },
                  { label: "Order selesai", value: data.summary.orders.completed },
                  { label: "Spesimen diterima lab", value: data.summary.specimens.received },
                  { label: "Spesimen ditolak", value: data.summary.specimens.rejected },
                  { label: "Pengguna aktif", value: data.summary.activeUsers },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-3 py-2.5">
                    <dt className="text-xs text-[#6B7585]">{row.label}</dt>
                    <dd className="text-sm font-bold text-[#1E2A3B]">{fmt(row.value)}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* 9. Profil institusi */}
            <Card title="Profil Institusi" subtitle="Jenis institusi seluruh pemohon demo">
              {institutions.length === 0 ? (
                <EmptyState icon={Building2} text="Belum ada data institusi pemohon." />
              ) : (
                <ul className="space-y-3.5">
                  {institutions.map((inst) => (
                    <li key={inst.type}>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="truncate font-medium text-[#1E2A3B]">
                          {INSTITUTION_NAMES[inst.type] || inst.type}
                        </span>
                        <span className="shrink-0 text-[#6B7585]">
                          <span className="font-bold text-[#1E2A3B]">{fmt(inst.count)}</span> ·{" "}
                          {pct(inst.count, institutionTotal)}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#EEF1F5]" aria-hidden="true">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(inst.count / institutionMax) * 100}%`, background: BLUE }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
