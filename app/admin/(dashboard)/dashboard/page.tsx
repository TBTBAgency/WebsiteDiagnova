"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Download,
  FileText,
  FlaskConical,
  Minus,
  RefreshCw,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getInitials } from "@/components/admin/AdminShell";
import { useAdminLang, type AdminT } from "@/components/admin/AdminLanguage";
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
    leads: { total: number; new: number; contacted: number; scheduled: number; completed: number };
    orders: { total: number; cito: number; urgent: number; routine: number; received: number; completed: number };
    specimens: { total: number; collected: number; received: number; rejected: number };
    activeUsers: number;
  };
  timeline: TimelinePoint[];
  institutionDistribution: { type: string; count: number }[];
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

const INSTITUTION_NAMES: Record<string, { id: string; en: string }> = {
  hospital: { id: "Rumah Sakit", en: "Hospital" },
  "clinical-lab": { id: "Laboratorium Klinis", en: "Clinical Laboratory" },
  "pathology-center": { id: "Pusat Patologi", en: "Pathology Center" },
  "microbiology-center": { id: "Pusat Mikrobiologi", en: "Microbiology Center" },
  "blood-bank": { id: "Bank Darah", en: "Blood Bank" },
  other: { id: "Lainnya", en: "Other" },
};

function institutionName(type: string, t: AdminT): string | undefined {
  const n = INSTITUTION_NAMES[type];
  return n ? t(n.id, n.en) : undefined;
}

/** Dashboard diperbarui otomatis selama tab terbuka. */
const AUTO_REFRESH_MS = 60_000;

/* ================================================================== */
/* Token visual                                                        */
/* ================================================================== */

const INK = "#0E234B";
const BLUE = "#1B6FF2";
const NAVY = "#0E56D8";
const SKY = "#93C5FD";
const EMPTY = "#E2E8F0";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FF2] focus-visible:ring-offset-2";

/** Pola garis diagonal seperti batang pada desain referensi. */
function striped(base: string, line = "rgba(255,255,255,0.16)"): React.CSSProperties {
  return { backgroundColor: base, backgroundImage: `repeating-linear-gradient(135deg, ${line} 0 5px, transparent 5px 11px)` };
}
const STYLE_INK = striped(INK, "rgba(255,255,255,0.12)");
const STYLE_BLUE = striped(BLUE);
const STYLE_NAVY = striped(NAVY);
const STYLE_SKY = striped(SKY, "rgba(255,255,255,0.45)");

const fmtNum = (n: number, locale: string) => n.toLocaleString(locale);
const sum = (points: TimelinePoint[], key: "leads" | "orders") => points.reduce((acc, p) => acc + (p[key] || 0), 0);
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

function formatShortDate(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

function formatDateTime(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAY_LONG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LONG_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOf = (date: string) => new Date(`${date}T12:00:00`).getDay();
const dayShort = (date: string, t: AdminT) => t(DAY_SHORT[dayOf(date)], DAY_SHORT_EN[dayOf(date)]);
const dayLong = (date: string, t: AdminT) => t(DAY_LONG[dayOf(date)], DAY_LONG_EN[dayOf(date)]);

/**
 * Label tanggal titik timeline. Label dari API sudah berformat id-ID ("18 Nov");
 * untuk bahasa lain diformat ulang dari `date` (YYYY-MM-DD) sesuai locale.
 */
function pointLabel(p: TimelinePoint, t: AdminT, locale: string) {
  const d = new Date(`${p.date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return p.label;
  return t(p.label, d.toLocaleDateString(locale, { day: "numeric", month: "short" }));
}

/** Label sumbu ringkas (hanya tanggal) untuk periode panjang. */
function pointDayNumber(p: TimelinePoint, t: AdminT) {
  const d = new Date(`${p.date}T12:00:00`);
  return t(p.label.split(" ")[0], Number.isNaN(d.getTime()) ? p.label : String(d.getDate()));
}

/* ================================================================== */
/* Hook animasi (menghormati prefers-reduced-motion)                   */
/* ================================================================== */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** true satu frame setelah mount: dipakai untuk transisi "tumbuh". */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

/** Angka yang menghitung naik ke nilai baru. */
function CountUp({ value, className }: { value: number; className?: string }) {
  const { locale } = useAdminLang();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    if (reduced) {
      setShown(value);
      from.current = value;
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 700);
      const eased = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  return <span className={cn("tabular-nums", className)}>{fmtNum(shown, locale)}</span>;
}

/* ================================================================== */
/* Komponen dasar                                                      */
/* ================================================================== */

function CircleLink({ href, label, dark = false }: { href: string; label: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:-translate-y-0.5",
        focusRing,
        dark ? "bg-white text-[#0E234B] hover:bg-[#EEF4FF]" : "border border-[#DCE6F5] text-[#0E234B] hover:border-[#0E234B] hover:bg-[#0E234B] hover:text-white"
      )}
    >
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function Card({
  title,
  subtitle,
  action,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-[24px] border border-[#DCE6F5]/85 bg-white p-5 shadow-[0_6px_24px_-12px_rgba(14,35,75,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(14,35,75,0.11)] motion-safe:animate-[fadeSlideUp_0.45s_ease-out_both] sm:p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display truncate text-[16px] font-semibold leading-snug text-[#0E234B] sm:text-[17px]">{title}</h2>
          {subtitle && <p className="mt-0.5 truncate text-[12px] text-slate-500">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#DDE0E5] bg-[#F7F8FA] px-4 py-8 text-center text-[#8A8F98]">
      <Icon className="h-5 w-5" aria-hidden="true" />
      <p className="max-w-[240px] text-xs">{text}</p>
    </div>
  );
}

function SrTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: (string | number)[][] }) {
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

/** Tooltip gelap yang muncul saat elemen induk `group` di-hover. */
function HoverTip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-xl bg-[#111318] px-2.5 py-1.5 text-[11px] text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100",
        className
      )}
    >
      {children}
    </span>
  );
}

function DeltaChip({ text, tone, className }: { text: string; tone: "up" | "down" | "flat"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tone === "up" && "bg-[#E3F7EC] text-[#15803D]",
        tone === "down" && "bg-[#FDECEC] text-[#B42318]",
        tone === "flat" && "bg-[#EEF0F3] text-[#5B616B]",
        className
      )}
    >
      {tone === "up" && <ArrowUpRight className="h-3 w-3" aria-hidden="true" />}
      {tone === "down" && <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {tone === "flat" && <Minus className="h-3 w-3" aria-hidden="true" />}
      {text}
    </span>
  );
}

/* ================================================================== */
/* Aktivitas harian: matriks titik (hari × jenis aktivitas)            */
/* ================================================================== */

const DOT_LEVELS: { label: { id: string; en: string }; style: React.CSSProperties }[] = [
  { label: { id: "Tidak ada", en: "None" }, style: { backgroundColor: EMPTY } },
  { label: { id: "Rendah", en: "Low" }, style: STYLE_SKY },
  { label: { id: "Sedang", en: "Medium" }, style: STYLE_BLUE },
  { label: { id: "Tertinggi", en: "Highest" }, style: STYLE_INK },
];

function ActivityDots({ data }: { data: TimelinePoint[] }) {
  const { t, locale } = useAdminLang();
  const fmt = (n: number) => fmtNum(n, locale);
  const mounted = useMounted();
  const max = Math.max(1, ...data.flatMap((d) => [d.leads, d.orders]));
  const level = (v: number) => (v <= 0 ? 0 : Math.min(3, Math.ceil((v / max) * 3)));
  const rows: { key: "leads" | "orders"; label: string; unit: string }[] = [
    { key: "leads", label: t("Permohonan", "Requests"), unit: t("permohonan", "requests") },
    { key: "orders", label: t("Order lab", "Lab orders"), unit: t("order lab", "lab orders") },
  ];
  const compact = data.length > 7;
  const today = data.length - 1;

  return (
    <div>
      <div
        className="grid items-center gap-x-1.5 gap-y-2.5 sm:gap-x-2.5"
        style={{ gridTemplateColumns: `minmax(64px, 84px) repeat(${data.length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {rows.map((row, r) => (
          <React.Fragment key={row.key}>
            <span className="truncate text-[12px] text-[#8A8F98]">{row.label}</span>
            {data.map((d, i) => {
              const v = d[row.key];
              return (
                <span key={d.date} className="group relative flex justify-center">
                  <span
                    className={cn(
                      "block aspect-square w-full rounded-full transition-all duration-500 ease-out group-hover:scale-110",
                      compact ? "max-w-[26px]" : "max-w-[40px]",
                      i === today && "ring-2 ring-[#1F6BFF]/25 ring-offset-2",
                      mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    )}
                    style={{ ...DOT_LEVELS[level(v)].style, transitionDelay: `${(r * data.length + i) * 25}ms` }}
                  />
                  <HoverTip>
                    {dayLong(d.date, t)}, {pointLabel(d, t, locale)} · <strong className="font-semibold">{fmt(v)}</strong> {row.unit}
                  </HoverTip>
                </span>
              );
            })}
          </React.Fragment>
        ))}
        <span />
        {data.map((d, i) => (
          <span
            key={d.date}
            title={i === today ? t("Hari ini", "Today") : undefined}
            className={cn("truncate text-center text-[11px]", i === today ? "font-semibold text-[#1F6BFF]" : "text-[#A3A8B1]")}
          >
            {compact ? pointDayNumber(d, t) : dayShort(d.date, t)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#8A8F98]">
        {DOT_LEVELS.map((l, i) => (
          <span key={l.label.id} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={l.style} aria-hidden="true" />
            {t(l.label.id, l.label.en)}
            {i === 3 && ` (${fmt(max)}/${t("hari", "day")})`}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 font-medium text-[#1F6BFF]">
          <span className="h-2.5 w-2.5 rounded-full ring-2 ring-[#1F6BFF]/40" aria-hidden="true" />
          {t("Hari ini", "Today")}
        </span>
      </div>
      <SrTable
        caption={t("Aktivitas harian permohonan demo dan order lab", "Daily activity of demo requests and lab orders")}
        headers={[t("Tanggal", "Date"), t("Permohonan demo", "Demo requests"), t("Order lab", "Lab orders")]}
        rows={data.map((d) => [pointLabel(d, t, locale), d.leads, d.orders])}
      />
    </div>
  );
}

/* ================================================================== */
/* Permohonan per tahap: batang bergaris                               */
/* ================================================================== */

interface StageDatum {
  key: string;
  label: string;
  value: number;
  style: React.CSSProperties;
  dot: string;
}

function StageBars({ stages, total }: { stages: StageDatum[]; total: number }) {
  const { t, locale } = useAdminLang();
  const fmt = (n: number) => fmtNum(n, locale);
  const mounted = useMounted();
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div>
      <div className="flex h-[240px] items-end gap-2.5 sm:gap-3.5" aria-hidden="true">
        {stages.map((s, i) => {
          const h = s.value > 0 ? Math.max(18, (s.value / max) * 100) : 6;
          return (
            <div key={s.key} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <div
                className="relative w-full max-w-[96px] rounded-[18px] transition-[height,filter] duration-700 ease-out group-hover:brightness-110"
                style={{
                  height: mounted ? `${h}%` : "6%",
                  transitionDelay: `${i * 90}ms`,
                  ...(s.value > 0 ? s.style : { backgroundColor: EMPTY }),
                }}
              >
                {/* Batang pendek: label angka di atas batang agar tidak menimpa nama tahap. */}
                <span
                  className={cn(
                    "absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#111318] shadow-sm",
                    h < 24 ? "bottom-full mb-1.5 ring-1 ring-[#E4E6EA]" : "top-2"
                  )}
                >
                  {s.value > 0 && <ArrowUpRight className="h-3 w-3" />}
                  {fmt(s.value)}
                </span>
                <HoverTip className="mb-9">
                  {s.label} · {fmt(s.value)} {t("permohonan", "requests")} ({pct(s.value, total)}%)
                </HoverTip>
              </div>
              <span className="mt-2 w-full truncate text-center text-[11px] text-[#8A8F98]">{s.label}</span>
            </div>
          );
        })}
      </div>
      <SrTable
        caption={t("Jumlah permohonan demo per tahap", "Number of demo requests per stage")}
        headers={[t("Tahap", "Stage"), t("Jumlah", "Count"), t("Persentase", "Percentage")]}
        rows={stages.map((s) => [s.label, s.value, `${pct(s.value, total)}%`])}
      />
    </div>
  );
}

/* ================================================================== */
/* Konversi: gauge setengah lingkaran bersegmen                        */
/* ================================================================== */

function SegmentGauge({ percent }: { percent: number }) {
  const mounted = useMounted();
  const N = 22;
  const filled = Math.round((percent / 100) * N);
  const cx = 130;
  const cy = 128;
  const r1 = 78;
  const r2 = 116;
  const mix = (t: number) => {
    // Biru tua -> biru muda di sepanjang bagian yang terisi.
    const a = [0x1f, 0x6b, 0xff];
    const b = [0x8d, 0xb8, 0xff];
    return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
  };
  return (
    <svg viewBox="0 0 260 140" className="mx-auto block w-full max-w-[300px]" aria-hidden="true">
      {Array.from({ length: N }, (_, i) => {
        const ang = Math.PI - (i / (N - 1)) * Math.PI;
        const on = i < filled;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(ang)}
            y1={cy - r1 * Math.sin(ang)}
            x2={cx + r2 * Math.cos(ang)}
            y2={cy - r2 * Math.sin(ang)}
            stroke={on ? mix(filled > 1 ? i / (filled - 1) : 0) : EMPTY}
            strokeWidth="7"
            strokeLinecap="round"
            style={{ opacity: mounted || !on ? 1 : 0.15, transition: "opacity 300ms ease-out", transitionDelay: `${i * 35}ms` }}
          />
        );
      })}
    </svg>
  );
}

/* ================================================================== */
/* Kartu hitam: sorotan (bergilir otomatis, berhenti saat di-hover)   */
/* ================================================================== */

interface Highlight {
  kicker: string;
  value: number;
  text: string;
  emptyText: string;
  href: string;
  cta: string;
}

function HighlightCard({ slides, todayLeads }: { slides: Highlight[]; todayLeads: number | null }) {
  const { t, locale } = useAdminLang();
  const fmt = (n: number) => fmtNum(n, locale);
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused, reduced, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("Sorotan hari ini", "Today's highlights")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative flex min-h-[176px] min-w-0 flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0E234B] via-[#133A7A] to-[#0E56D8] p-5 text-white shadow-[0_16px_38px_-12px_rgba(14,35,75,0.35)] transition-all duration-300 hover:-translate-y-0.5 motion-safe:animate-[fadeSlideUp_0.45s_ease-out_both] sm:col-span-2 sm:p-6"
    >
      {/* Smooth ambient Diagnova glow orbs */}
      <span
        className="pointer-events-none absolute -right-10 -top-24 h-[260px] w-[360px] rotate-[-18deg] rounded-[60px] opacity-75"
        style={{ background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.20) 45%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.14) 75%, rgba(255,255,255,0) 90%)" }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#56ADE2]/25 blur-3xl" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div key={index} className="min-w-0 motion-safe:animate-[fadeSlideUp_0.45s_ease-out]" aria-live="polite">
          <h2 className="text-[13px] font-medium text-blue-100/80">{t("Sorotan Hari Ini", "Today's Highlights")} · {slide.kicker}</h2>
          <p className="font-display mt-1.5 max-w-[440px] text-[20px] font-semibold leading-snug text-white sm:text-[21px]">
            {slide.value > 0 ? (
              <>
                <span className="font-bold">{fmt(slide.value)}</span> {slide.text}
              </>
            ) : (
              slide.emptyText
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 pt-1">
          {slides.map((s, i) => (
            <button
              key={s.kicker}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t(`Tampilkan info ${i + 1} dari ${slides.length}: ${s.kicker}`, `Show item ${i + 1} of ${slides.length}: ${s.kicker}`)}
              aria-current={i === index ? "true" : undefined}
              className={cn("h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white", i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50")}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        {todayLeads !== null && (
          <span className="inline-flex items-center gap-2 text-[12px] text-blue-100/85">
            <span className="rounded-full bg-[#22C55E]/20 px-2 py-0.5 text-[11px] font-semibold text-[#4ADE80]">+{fmt(todayLeads)}</span>
            {t("permohonan masuk hari ini", "requests received today")}
          </span>
        )}
        <Link
          href={slide.href}
          className="group ml-auto inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 text-[13px] font-semibold text-[#0E234B] shadow-sm transition-all hover:bg-[#EEF4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {slide.cta}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F1FC] text-[#0E56D8] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ================================================================== */
/* Skeleton                                                            */
/* ================================================================== */

function DashboardSkeleton() {
  const block = "animate-pulse rounded-[24px] bg-white";
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12" aria-hidden="true">
      <div className={cn(block, "h-[420px] md:col-span-2 xl:col-span-5")} />
      <div className="grid gap-4 md:col-span-2 xl:col-span-7">
        <div className="h-[176px] animate-pulse rounded-[24px] bg-[#0E234B]/15" />
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(block, "h-[228px]")} />
          <div className="h-[228px] animate-pulse rounded-[24px] bg-[#111318]/80" />
        </div>
      </div>
      <div className={cn(block, "h-[380px] md:col-span-2 xl:col-span-8")} />
      <div className={cn(block, "h-[380px] md:col-span-2 xl:col-span-4")} />
    </div>
  );
}

/* ================================================================== */
/* Halaman                                                             */
/* ================================================================== */

export default function AdminOverviewDashboard() {
  const { t, locale } = useAdminLang();
  const fmt = (n: number) => fmtNum(n, locale);
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Pesan server disimpan apa adanya; fallback klien disimpan sebagai jenis agar ikut bahasa aktif.
  const [errorState, setErrorState] = useState<{ kind: "load" | "network"; message?: string } | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [period, setPeriod] = useState<7 | 14>(7);
  const [todayStr, setTodayStr] = useState("");

  const error = errorState
    ? errorState.message ||
      (errorState.kind === "network"
        ? t("Tidak dapat terhubung ke server. Periksa koneksi Anda.", "Cannot connect to the server. Check your connection.")
        : t("Gagal memuat data dashboard.", "Failed to load dashboard data."))
    : null;

  const fetchOverview = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setIsLoading(true);
    setErrorState(null);
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success && json.data) {
        setData(json.data as OverviewData);
        setUpdatedAt(new Date());
      } else {
        setErrorState({ kind: "load", message: json?.message || undefined });
      }
    } catch (err) {
      console.error("Failed to load overview data:", err);
      setErrorState({ kind: "network" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    // Tanggal lokal hanya dihitung di browser (menghindari hydration mismatch).
    setTodayStr(new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
  }, [locale]);

  // Refresh otomatis di latar selama tab terlihat.
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") fetchOverview({ silent: true });
    }, AUTO_REFRESH_MS);
    return () => clearInterval(t);
  }, [fetchOverview]);

  /* ------------------------- Turunan data ------------------------- */
  const timeline = useMemo(() => data?.timeline ?? [], [data]);
  const periodData = useMemo(() => timeline.slice(-period), [timeline, period]);
  const periodLeads = sum(periodData, "leads");
  const periodOrders = sum(periodData, "orders");
  const busiest = periodData.reduce<TimelinePoint | null>((best, p) => (p.leads + p.orders > (best ? best.leads + best.orders : 0) ? p : best), null);
  const avgPerDay = periodData.length ? periodLeads / periodData.length : 0;

  const last7 = timeline.slice(-7);
  const last7Leads = sum(last7, "leads");
  const prev7Leads = timeline.length > 7 ? sum(timeline.slice(-14, -7), "leads") : 0;
  let deltaText = "0%";
  let deltaTone: "up" | "down" | "flat" = "flat";
  if (prev7Leads === 0 && last7Leads > 0) {
    // 7 hari sebelumnya nol: persentase tidak terdefinisi, tampilkan selisih jumlahnya.
    deltaText = `+${fmt(last7Leads)}`;
    deltaTone = "up";
  } else if (prev7Leads > 0) {
    const d = Math.round(((last7Leads - prev7Leads) / prev7Leads) * 100);
    deltaText = `${d > 0 ? "+" : ""}${d}%`;
    deltaTone = d > 0 ? "up" : d < 0 ? "down" : "flat";
  }
  const sparkMax = Math.max(1, ...last7.map((p) => p.leads));

  const leads = data?.summary.leads;
  const leadTotal = leads?.total ?? 0;
  const stages: StageDatum[] = leads
    ? [
        { key: "new", label: t("Baru", "New"), value: leads.new, style: STYLE_INK, dot: INK },
        { key: "contacted", label: t("Dihubungi", "Contacted"), value: leads.contacted, style: STYLE_NAVY, dot: NAVY },
        { key: "scheduled", label: t("Jadwal Demo", "Demo Scheduled"), value: leads.scheduled, style: STYLE_BLUE, dot: BLUE },
        { key: "completed", label: t("Selesai", "Completed"), value: leads.completed, style: STYLE_SKY, dot: SKY },
      ]
    : [];

  const followedUp = leads ? leads.contacted + leads.scheduled + leads.completed : 0;
  const conversions = leads
    ? [
        { label: t("Sudah dihubungi", "Contacted"), value: followedUp, color: BLUE },
        { label: t("Mencapai jadwal demo", "Reached demo scheduling"), value: leads.scheduled + leads.completed, color: "#5B95FF" },
        { label: t("Demo selesai", "Demo completed"), value: leads.completed, color: SKY },
        { label: t("Menunggu respon", "Awaiting response"), value: leads.new, color: EMPTY },
      ]
    : [];

  const institutions = useMemo(() => [...(data?.institutionDistribution ?? [])].sort((a, b) => b.count - a.count), [data]);
  const institutionTotal = institutions.reduce((a, b) => a + b.count, 0);
  const institutionMax = Math.max(1, ...institutions.map((i) => i.count));
  const INSTITUTION_STYLES = [STYLE_BLUE, STYLE_INK, STYLE_NAVY, STYLE_SKY];

  const todayPoint = timeline.length ? timeline[timeline.length - 1] : null;
  const yesterdayPoint = timeline.length > 1 ? timeline[timeline.length - 2] : null;

  const highlights: Highlight[] = data
    ? [
        {
          kicker: t("Menunggu respon", "Awaiting response"),
          value: data.summary.leads.new,
          text: t("permohonan demo belum dihubungi tim.", "demo requests not yet contacted by the team."),
          emptyText: t("Semua permohonan demo sudah ditindaklanjuti.", "All demo requests have been followed up."),
          href: "/admin/leads",
          cta: t("Tinjau permohonan", "Review requests"),
        },
        {
          kicker: t("Jadwal demo", "Demo schedule"),
          value: data.summary.leads.scheduled,
          text: t("permohonan sudah memiliki jadwal demo.", "requests already have a demo scheduled."),
          emptyText: t("Belum ada permohonan dengan jadwal demo.", "No requests with a demo scheduled yet."),
          href: "/admin/leads",
          cta: t("Lihat permohonan", "View requests"),
        },
        {
          kicker: t("Order CITO", "CITO Orders"),
          value: data.summary.orders.cito,
          text: t("order laboratorium berprioritas CITO di LIS.", "CITO-priority lab orders in the LIS."),
          emptyText: t("Tidak ada order laboratorium berprioritas CITO.", "No CITO-priority lab orders."),
          href: "/admin/orders",
          cta: t("Buka order lab", "Open lab orders"),
        },
      ]
    : [];

  const toolbarBtn = cn(
    "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-[#DCE6F5] bg-white px-5 text-[13px] font-medium text-[#0E234B] shadow-xs transition-colors hover:bg-[#EEF4FF] disabled:opacity-60",
    focusRing
  );
  const toolbarIcon = cn("inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#DCE6F5] bg-white text-[#0E234B] shadow-xs transition-colors hover:bg-[#EEF4FF] disabled:opacity-60", focusRing);

  return (
    <div className="space-y-6">
      {/* ---------------------------- Judul + toolbar ---------------------------- */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight text-[#0E234B] sm:text-[32px]">{t("Ringkasan Dashboard", "Dashboard Overview")}</h1>
          <nav aria-label="Breadcrumb" className="mt-1 flex flex-wrap items-center gap-x-1 text-[12px] text-slate-500">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="font-medium text-[#0E234B]">{t("Semua Laporan", "All Reports")}</span>
            {todayStr && <span className="ml-1 hidden sm:inline">· {todayStr}</span>}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {updatedAt && (
            <span className="mr-1 inline-flex items-center gap-1.5 text-[12px] text-[#8A8F98]" aria-live="polite">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              {t("Diperbarui", "Updated")} {updatedAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <div role="group" aria-label={t("Periode aktivitas", "Activity period")} className="inline-flex h-11 items-center rounded-full bg-white p-1">
            {([7, 14] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={cn("h-9 rounded-full px-4 text-[13px] font-medium transition-colors", focusRing, period === p ? "bg-[#111318] text-white" : "text-[#5B616B] hover:text-[#111318]")}
              >
                {p} {t("Hari", "Days")}
              </button>
            ))}
          </div>
          <a href="/api/admin/leads/export" download className={toolbarBtn}>
            {t("Ekspor", "Export")}
          </a>
          <a
            href="/api/admin/leads/export"
            download
            aria-label={t("Unduh data permohonan (CSV)", "Download request data (CSV)")}
            title={t("Unduh data permohonan (CSV)", "Download request data (CSV)")}
            className={toolbarIcon}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={() => fetchOverview()} disabled={isLoading} className={toolbarBtn}>
            {isLoading ? t("Memuat...", "Loading...") : t("Muat Ulang", "Refresh")}
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#1F6BFF]")} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------------------------------- Konten ---------------------------------- */}
      {isLoading && !data ? (
        <>
          <span className="sr-only" role="status">
            {t("Memuat data dashboard...", "Loading dashboard data...")}
          </span>
          <DashboardSkeleton />
        </>
      ) : !data ? (
        <div role="alert" className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-[#111318]">{t("Data dashboard gagal dimuat", "Dashboard data failed to load")}</p>
            <p className="mt-1 text-sm text-[#8A8F98]">{error || t("Terjadi kesalahan yang tidak diketahui.", "An unknown error occurred.")}</p>
          </div>
          <button type="button" onClick={() => fetchOverview()} className={cn("inline-flex items-center gap-2 rounded-full bg-[#1F6BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1858D6]", focusRing)}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t("Coba Lagi", "Try Again")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t(`Gagal memuat ulang (${error}). Menampilkan data terakhir.`, `Refresh failed (${error}). Showing the last loaded data.`)}
              </span>
              <button type="button" onClick={() => fetchOverview()} className={cn("rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-rose-200", focusRing)}>
                {t("Coba Lagi", "Try Again")}
              </button>
            </div>
          )}

          <div className={cn("grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-12", isLoading && "opacity-60")} aria-busy={isLoading}>
            {/* 1. Aktivitas harian (matriks titik) */}
            <Card
              className="md:col-span-2 xl:col-span-5"
              title={t("Aktivitas Harian", "Daily Activity")}
              subtitle={t(`${period} hari terakhir`, `Last ${period} days`)}
              action={<CircleLink href="/admin/leads" label={t("Buka permohonan demo", "Open demo requests")} />}
            >
              <div className="mb-5">
                <div className="font-display text-[38px] font-bold leading-none tracking-tight text-[#0E234B]">
                  <CountUp value={periodLeads} />
                </div>
                <div className="mt-1.5 text-[12px] text-slate-500">
                  {t(`permohonan demo masuk dalam ${period} hari`, `demo requests received in ${period} days`)}
                </div>
              </div>
              {periodData.length === 0 ? (
                <EmptyState icon={Users} text={t("Belum ada data aktivitas untuk ditampilkan.", "No activity data to display yet.")} />
              ) : (
                <ActivityDots data={periodData} />
              )}
              <dl className="mt-auto grid grid-cols-3 gap-2 pt-5">
                {[
                  { label: t("Order lab", "Lab orders"), value: fmt(periodOrders) },
                  { label: t("Rata-rata/hari", "Avg/day"), value: avgPerDay.toLocaleString(locale, { maximumFractionDigits: 1 }) },
                  { label: t("Hari tersibuk", "Busiest day"), value: busiest ? `${dayShort(busiest.date, t)}, ${pointLabel(busiest, t, locale)}` : "-" },
                ].map((s) => (
                  <div key={s.label} className="min-w-0 rounded-2xl bg-[#F7F8FA] px-3 py-2.5">
                    <dt className="truncate text-[11px] text-[#8A8F98]">{s.label}</dt>
                    <dd className="mt-0.5 truncate text-[14px] font-semibold text-[#111318]">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* 2-4. Blok kanan: sorotan, hari ini, ekspor */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-7">
              <HighlightCard slides={highlights} todayLeads={todayPoint ? todayPoint.leads : null} />

              <section className="flex min-w-0 flex-col justify-between rounded-[24px] border border-[#DCE6F5]/85 bg-white p-5 shadow-[0_6px_24px_-12px_rgba(14,35,75,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(14,35,75,0.11)] motion-safe:animate-[fadeSlideUp_0.45s_ease-out_both] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF4FF] text-[#1B6FF2]">
                      <Users className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <h2 className="font-display text-[13px] font-semibold leading-tight text-[#0E234B]">
                      {t("Permohonan", "Requests")}
                      <br />
                      {t("Hari Ini", "Today")}
                    </h2>
                  </div>
                  <DeltaChip text={deltaText} tone={deltaTone} />
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="font-display text-[38px] font-bold leading-none tracking-tight text-[#0E234B]">
                    <CountUp value={todayPoint?.leads ?? 0} />
                  </div>
                  {/* Sparkline 7 hari (hari ini paling kanan) */}
                  <div className="flex h-12 items-end gap-1" aria-hidden="true">
                    {last7.map((p, i) => (
                      <span key={p.date} className="group relative flex h-full items-end">
                        <span
                          className="block w-2.5 rounded-full transition-all"
                          style={{
                            height: `${p.leads > 0 ? Math.max(18, (p.leads / sparkMax) * 100) : 12}%`,
                            ...(p.leads === 0 ? { backgroundColor: EMPTY } : i === last7.length - 1 ? STYLE_BLUE : STYLE_INK),
                          }}
                        />
                        <HoverTip>
                          {pointLabel(p, t, locale)} · {fmt(p.leads)}
                        </HoverTip>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 border-t border-[#EEF0F3] pt-3 text-[12px] text-[#8A8F98]">
                  {t("Kemarin", "Yesterday")} <span className="font-semibold text-[#111318]">{fmt(yesterdayPoint?.leads ?? 0)}</span> ·{" "}
                  {t("7 hari", "7 days")}{" "}
                  <span className="font-semibold text-[#111318]">{fmt(last7Leads)}</span>
                </div>
              </section>

              <section className="relative flex min-h-[176px] min-w-0 flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0E234B] via-[#153670] to-[#0A1A38] p-5 text-white shadow-[0_14px_34px_-12px_rgba(14,35,75,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-12px_rgba(14,35,75,0.42)] motion-safe:animate-[fadeSlideUp_0.45s_ease-out_both] sm:p-6">
                <span className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/[0.06]" aria-hidden="true" />
                <span className="pointer-events-none absolute -bottom-28 right-10 h-40 w-40 rounded-full bg-[#1B6FF2]/30 blur-2xl" aria-hidden="true" />
                <div className="relative flex items-center justify-between gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="/api/admin/leads/export"
                      download
                      aria-label={t("Unduh data permohonan (CSV)", "Download request data (CSV)")}
                      title={t("Unduh data permohonan (CSV)", "Download request data (CSV)")}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0E234B] transition-all hover:-translate-y-0.5 hover:bg-[#EEF4FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <CircleLink href="/admin/leads" label={t("Buka permohonan demo", "Open demo requests")} dark />
                  </div>
                </div>
                <div className="relative mt-6">
                  <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium text-blue-100">
                    {fmt(leadTotal)} {t("permohonan", leadTotal === 1 ? "request" : "requests")} · CSV
                  </span>
                  <h2 className="mt-2 font-display text-[21px] font-semibold leading-tight text-white">{t("Laporan Permohonan", "Requests Report")}</h2>
                </div>
              </section>
            </div>

            {/* 5. Permohonan per tahap (batang bergaris) */}
            <Card
              className="md:col-span-2 xl:col-span-8"
              title={t("Permohonan per Tahap", "Requests by Stage")}
              subtitle={t("Berdasarkan status pipeline saat ini", "Based on current pipeline status")}
              action={
                <>
                  <span className="hidden rounded-full border border-[#E4E6EA] px-3 py-2 text-[12px] font-medium text-[#3B4049] sm:inline-flex">
                    {t("Semua waktu", "All time")}
                  </span>
                  <CircleLink href="/admin/leads" label={t("Lihat detail permohonan", "View request details")} />
                </>
              }
            >
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text={t("Belum ada permohonan demo yang tercatat.", "No demo requests recorded yet.")} />
              ) : (
                <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
                  <div className="flex flex-col">
                    <span className="w-fit rounded-full bg-[#0E234B] px-3 py-1 text-[11px] font-medium text-white">Total</span>
                    <div className="mt-3 font-display text-[38px] font-bold leading-none tracking-tight text-[#0E234B]">
                      <CountUp value={leadTotal} />
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{t("permohonan demo sejak awal", "demo requests since the start")}</p>
                    <div className="mt-5">
                      <div className={cn("font-display text-[30px] font-bold leading-none", deltaTone === "down" ? "text-[#B42318]" : "text-[#1B6FF2]")}>{deltaText}</div>
                      <p className="mt-1 text-[12px] text-[#8A8F98]">
                        {t("permohonan 7 hari terakhir dibanding 7 hari sebelumnya", "requests in the last 7 days vs. the previous 7 days")}
                      </p>
                    </div>
                    <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-5 text-[11px] text-[#8A8F98]">
                      {stages.map((s) => (
                        <li key={s.key} className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.dot }} aria-hidden="true" />
                          {s.label} · {pct(s.value, leadTotal)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                  <StageBars stages={stages} total={leadTotal} />
                </div>
              )}
            </Card>

            {/* 6. Konversi pipeline (gauge) */}
            <Card
              className="md:col-span-2 xl:col-span-4"
              title={t("Konversi Pipeline", "Pipeline Conversion")}
              subtitle={t("Dari seluruh permohonan", "Across all requests")}
              action={<CircleLink href="/admin/leads" label={t("Buka permohonan demo", "Open demo requests")} />}
            >
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text={t("Konversi akan tampil setelah ada permohonan demo.", "Conversion will appear once there are demo requests.")} />
              ) : (
                <>
                  <ul className="mb-2 space-y-1.5 text-[11px] text-[#8A8F98]">
                    {conversions.map((c) => (
                      <li key={c.label} className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} aria-hidden="true" />
                          {c.label}
                        </span>
                        <span className="font-semibold text-[#111318]">
                          {pct(c.value, leadTotal)}% <span className="font-normal text-[#A3A8B1]">({fmt(c.value)})</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative mt-auto">
                    <SegmentGauge percent={pct(followedUp, leadTotal)} />
                    <div className="absolute inset-x-0 bottom-1 text-center">
                      <div className="font-display text-[34px] font-medium leading-none text-[#111318]" role="img"
                        aria-label={t(
                          `${pct(followedUp, leadTotal)}% permohonan sudah ditindaklanjuti`,
                          `${pct(followedUp, leadTotal)}% of requests followed up`
                        )}
                      >
                        <CountUp value={pct(followedUp, leadTotal)} />%
                      </div>
                      <div className="mt-1 text-[11px] text-[#8A8F98]">{t("sudah ditindaklanjuti", "followed up")}</div>
                    </div>
                  </div>
                  <p className="mx-auto mt-3 w-fit rounded-full bg-[#F2F3F5] px-3 py-1.5 text-[11px] text-[#5B616B]">
                    {t(
                      `${fmt(followedUp)} dari ${fmt(leadTotal)} permohonan sudah dihubungi`,
                      `${fmt(followedUp)} of ${fmt(leadTotal)} requests contacted`
                    )}
                  </p>
                </>
              )}
            </Card>

            {/* 7. Permohonan terbaru — klik untuk membuka detailnya */}
            <Card
              className="xl:col-span-5"
              title={t("Permohonan Terbaru", "Latest Requests")}
              subtitle={t("Klik untuk membuka detail", "Click to open details")}
              action={<CircleLink href="/admin/leads" label={t("Lihat semua permohonan", "View all requests")} />}
            >
              {data.recentLeads.length === 0 ? (
                <EmptyState icon={Users} text={t("Belum ada permohonan demo yang masuk.", "No demo requests received yet.")} />
              ) : (
                <ul className="space-y-2">
                  {data.recentLeads.map((lead) => (
                    <li key={lead.id}>
                      <Link
                        href={`/admin/leads?lead=${encodeURIComponent(lead.id)}`}
                        className={cn("group flex items-center gap-3 rounded-2xl bg-[#F7F8FA] px-3 py-2.5 transition-colors hover:bg-[#EEF0F3]", focusRing)}
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111318] text-[12px] font-bold text-white">
                          {getInitials(lead.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold text-[#111318]">{lead.name}</span>
                          <span className="block truncate text-[11px] text-[#8A8F98]">{lead.institution || institutionName(lead.institutionType, t) || "-"}</span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-1">
                          <StatusBadge type={lead.status} className="px-2 text-[10px]" />
                          <span className="text-[10px] text-[#8A8F98]">{formatShortDate(lead.createdAt, locale)}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-[#A3A8B1] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* 8. Order lab terbaru */}
            <Card
              className="xl:col-span-7"
              title={t("Order Lab Terbaru", "Latest Lab Orders")}
              subtitle={t("Diurutkan berdasarkan prioritas, lalu waktu order", "Sorted by priority, then order time")}
              action={<CircleLink href="/admin/orders" label={t("Buka order lab", "Open lab orders")} />}
            >
              {data.recentOrders.length === 0 ? (
                <EmptyState icon={FlaskConical} text={t("Belum ada order laboratorium yang terdaftar.", "No lab orders registered yet.")} />
              ) : (
                <ul className="space-y-2">
                  {data.recentOrders.map((order) => {
                    const done = order.specimensCount > 0 && order.receivedSpecimensCount >= order.specimensCount;
                    const progress = order.specimensCount > 0 ? (order.receivedSpecimensCount / order.specimensCount) * 100 : 0;
                    return (
                      <li key={order.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-2xl bg-[#F7F8FA] px-3 py-2.5">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1F6BFF] text-white">
                          <FlaskConical className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                            <span className="truncate text-[13px] font-semibold text-[#111318]">{order.patientName}</span>
                            <span className="font-mono text-[11px] text-[#1F6BFF]">{order.orderNumber}</span>
                          </div>
                          <div className="truncate text-[11px] text-[#8A8F98]">
                            {order.physicianName} · {formatDateTime(order.orderedAt, locale)}
                          </div>
                        </div>
                        <div className="flex w-[132px] flex-col items-end gap-1">
                          <StatusBadge type={order.priority} className="px-2 text-[10px]" />
                          <span className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E8EC]" aria-hidden="true">
                            <span className="block h-full rounded-full" style={{ width: `${progress}%`, ...(done ? { backgroundColor: "#16A34A" } : STYLE_BLUE) }} />
                          </span>
                          <span className={cn("text-[10px] font-medium", done ? "text-emerald-700" : "text-[#8A8F98]")}>
                            {order.receivedSpecimensCount}/{order.specimensCount} {t("spesimen diterima", "specimens received")}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* 9. Ringkasan LIS */}
            <Card
              className="md:col-span-2 xl:col-span-7"
              title={t("Ringkasan LIS", "LIS Summary")}
              subtitle={t("Total seluruh order & spesimen", "Totals for all orders & specimens")}
              action={<CircleLink href="/admin/orders" label={t("Buka order lab", "Open lab orders")} />}
            >
              <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { label: t("Total order", "Total orders"), value: data.summary.orders.total, tone: "dark" },
                  { label: t("Prioritas CITO", "CITO priority"), value: data.summary.orders.cito, tone: "blue" },
                  { label: t("Prioritas mendesak", "Urgent priority"), value: data.summary.orders.urgent },
                  { label: t("Prioritas rutin", "Routine priority"), value: data.summary.orders.routine },
                  { label: t("Order selesai", "Completed orders"), value: data.summary.orders.completed },
                  { label: t("Spesimen diterima", "Specimens received"), value: data.summary.specimens.received },
                  { label: t("Spesimen ditolak", "Specimens rejected"), value: data.summary.specimens.rejected },
                  { label: t("Pengguna aktif", "Active users"), value: data.summary.activeUsers },
                ].map((row) => {
                  const strong = row.tone === "dark" || row.tone === "blue";
                  return (
                    <div
                      key={row.label}
                      className={cn("rounded-2xl px-3.5 py-3 transition-transform hover:-translate-y-0.5", row.tone === "dark" ? "bg-[#111318]" : row.tone === "blue" ? "" : "bg-[#F7F8FA]")}
                      style={row.tone === "blue" ? STYLE_BLUE : undefined}
                    >
                      <dt className={cn("text-[11px]", strong ? "text-white/75" : "text-[#8A8F98]")}>{row.label}</dt>
                      <dd className={cn("mt-1 font-display text-[22px] font-medium leading-none", strong ? "text-white" : "text-[#111318]")}>
                        <CountUp value={row.value} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Card>

            {/* 10. Profil institusi */}
            <Card
              className="md:col-span-2 xl:col-span-5"
              title={t("Profil Institusi", "Institution Profile")}
              subtitle={t("Jenis institusi seluruh pemohon demo", "Institution types of all demo applicants")}
              action={<CircleLink href="/admin/leads" label={t("Buka permohonan demo", "Open demo requests")} />}
            >
              {institutions.length === 0 ? (
                <EmptyState icon={Building2} text={t("Belum ada data institusi pemohon.", "No applicant institution data yet.")} />
              ) : (
                <ul className="space-y-3">
                  {institutions.map((inst, i) => (
                    <li key={inst.type} className="group grid grid-cols-[minmax(100px,140px)_minmax(0,1fr)_auto] items-center gap-3">
                      <span className="truncate text-[12px] font-medium text-[#3B4049]">{institutionName(inst.type, t) || inst.type}</span>
                      <span className="h-7 w-full overflow-hidden rounded-full bg-[#F2F3F5]" aria-hidden="true">
                        <span
                          className="block h-full rounded-full transition-[filter] group-hover:brightness-110"
                          style={{ width: `${Math.max(6, (inst.count / institutionMax) * 100)}%`, ...INSTITUTION_STYLES[i % INSTITUTION_STYLES.length] }}
                        />
                      </span>
                      <span className="w-[64px] text-right text-[12px] text-[#8A8F98]">
                        <span className="font-semibold text-[#111318]">{fmt(inst.count)}</span> · {pct(inst.count, institutionTotal)}%
                      </span>
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
