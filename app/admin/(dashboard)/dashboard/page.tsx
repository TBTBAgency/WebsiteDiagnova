"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Download,
  FileText,
  FlaskConical,
  Minus,
  RefreshCw,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getInitials } from "@/components/admin/AdminShell";
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

const INK = "#111318";
const BLUE = "#1F6BFF";
const NAVY = "#123A9C";
const SKY = "#A9C8FF";
const EMPTY = "#E6E8EC";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] focus-visible:ring-offset-2";

/** Pola garis diagonal seperti batang pada desain referensi. */
function striped(base: string, line = "rgba(255,255,255,0.16)"): React.CSSProperties {
  return { backgroundColor: base, backgroundImage: `repeating-linear-gradient(135deg, ${line} 0 5px, transparent 5px 11px)` };
}

const fmt = (n: number) => n.toLocaleString("id-ID");
const sum = (points: TimelinePoint[], key: "leads" | "orders") => points.reduce((acc, p) => acc + (p[key] || 0), 0);
const pct = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

/** Inisial hari (Min, Sen, ...) dari tanggal YYYY-MM-DD. */
function dayInitial(date: string) {
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][d.getDay()];
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
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
        focusRing,
        dark ? "bg-white text-[#111318] hover:bg-[#E9ECF1]" : "border border-[#E4E6EA] text-[#111318] hover:bg-[#F2F3F5]"
      )}
    >
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function Card({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col rounded-[24px] bg-white p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate text-[17px] font-medium leading-snug text-[#111318]">{title}</h2>
        {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

function EmptyState({ icon: Icon, text, dark = false }: { icon: React.ElementType; text: string; dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center",
        dark ? "border-white/20 text-white/70" : "border-[#DDE0E5] bg-[#F7F8FA] text-[#8A8F98]"
      )}
    >
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

const DOT_LEVELS: { label: string; style: React.CSSProperties }[] = [
  { label: "Tidak ada", style: { backgroundColor: EMPTY } },
  { label: "Rendah", style: striped(SKY, "rgba(255,255,255,0.45)") },
  { label: "Sedang", style: striped(BLUE) },
  { label: "Tertinggi", style: striped(INK, "rgba(255,255,255,0.12)") },
];

function ActivityDots({ data }: { data: TimelinePoint[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.leads, d.orders]));
  const level = (v: number) => (v <= 0 ? 0 : Math.min(3, Math.ceil((v / max) * 3)));
  const rows: { key: "leads" | "orders"; label: string; unit: string }[] = [
    { key: "leads", label: "Permohonan", unit: "permohonan demo" },
    { key: "orders", label: "Order lab", unit: "order lab" },
  ];
  const compact = data.length > 7;

  return (
    <div>
      <div
        className="grid items-center gap-x-1.5 gap-y-2.5 sm:gap-x-2.5"
        style={{ gridTemplateColumns: `minmax(64px, 84px) repeat(${data.length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {rows.map((row) => (
          <React.Fragment key={row.key}>
            <span className="truncate text-[12px] text-[#8A8F98]">{row.label}</span>
            {data.map((d) => {
              const v = d[row.key];
              return (
                <span key={d.date} className="flex justify-center">
                  <span
                    title={`${d.label}: ${fmt(v)} ${row.unit}`}
                    className={cn("block aspect-square w-full rounded-full", compact ? "max-w-[26px]" : "max-w-[40px]")}
                    style={DOT_LEVELS[level(v)].style}
                  />
                </span>
              );
            })}
          </React.Fragment>
        ))}
        <span />
        {data.map((d) => (
          <span key={d.date} className="text-center text-[11px] text-[#A3A8B1]">
            {compact ? d.label.split(" ")[0] : dayInitial(d.date)}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#8A8F98]">
        {DOT_LEVELS.map((l, i) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={l.style} aria-hidden="true" />
            {l.label}
            {i === 3 && ` (${fmt(max)}/hari)`}
          </span>
        ))}
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
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div>
      <div className="flex h-[230px] items-end gap-2.5 sm:gap-3.5" aria-hidden="true">
        {stages.map((s) => {
          const h = s.value > 0 ? Math.max(18, (s.value / max) * 100) : 6;
          return (
            <div key={s.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <div
                className="relative w-full max-w-[96px] rounded-[18px] transition-[height] duration-500"
                style={{ height: `${h}%`, ...(s.value > 0 ? s.style : { backgroundColor: EMPTY }) }}
                title={`${s.label}: ${fmt(s.value)} permohonan (${pct(s.value, total)}%)`}
              >
                {/* Batang pendek: label angka di atas batang agar tidak menimpa nama tahap. */}
                <span
                  className={cn(
                    "absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#111318] shadow-sm",
                    h < 24 ? "bottom-full mb-1.5 ring-1 ring-[#E4E6EA]" : "top-2"
                  )}
                >
                  {fmt(s.value)}
                </span>
              </div>
              <span className="mt-2 w-full truncate text-center text-[11px] text-[#8A8F98]">{s.label}</span>
            </div>
          );
        })}
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
/* Konversi: gauge setengah lingkaran bersegmen                        */
/* ================================================================== */

function SegmentGauge({ percent }: { percent: number }) {
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
        const x1 = cx + r1 * Math.cos(ang);
        const y1 = cy - r1 * Math.sin(ang);
        const x2 = cx + r2 * Math.cos(ang);
        const y2 = cy - r2 * Math.sin(ang);
        const on = i < filled;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={on ? mix(filled > 1 ? i / (filled - 1) : 0) : EMPTY}
            strokeWidth="7"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ================================================================== */
/* Kartu hitam: sorotan                                                */
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
  const [index, setIndex] = useState(0);
  const slide = slides[index] ?? slides[0];
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan hari ini"
      className="relative flex min-h-[176px] min-w-0 flex-col justify-between overflow-hidden rounded-[24px] bg-[#111318] p-5 text-white sm:p-6 md:col-span-2"
    >
      {/* Pita mengilap dekoratif */}
      <span
        className="pointer-events-none absolute -right-10 -top-24 h-[260px] w-[360px] rotate-[-18deg] rounded-[60px] opacity-80"
        style={{ background: "linear-gradient(115deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.16) 75%, rgba(255,255,255,0) 90%)" }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-[#1F6BFF]/25 blur-3xl" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0" aria-live="polite">
          <h2 className="text-[13px] font-medium text-white/60">Sorotan Hari Ini · {slide.kicker}</h2>
          <p className="mt-1.5 max-w-[420px] text-[21px] font-medium leading-snug text-white">
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
              aria-label={`Tampilkan info ${i + 1} dari ${slides.length}: ${s.kicker}`}
              aria-current={i === index ? "true" : undefined}
              className={cn("h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white", i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50")}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
        {todayLeads !== null && (
          <span className="inline-flex items-center gap-2 text-[12px] text-white/75">
            <span className="rounded-full bg-[#22C55E]/20 px-2 py-0.5 text-[11px] font-semibold text-[#4ADE80]">+{fmt(todayLeads)}</span>
            permohonan masuk hari ini
          </span>
        )}
        <Link
          href={slide.href}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-[#1F6BFF] py-1.5 pl-4 pr-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1858D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111318]"
        >
          {slide.cta}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
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
      <div className={cn(block, "h-[340px] md:col-span-2 xl:col-span-5")} />
      <div className="grid gap-4 md:col-span-2 xl:col-span-7">
        <div className="h-[176px] animate-pulse rounded-[24px] bg-[#111318]/80" />
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(block, "h-[148px]")} />
          <div className="h-[148px] animate-pulse rounded-[24px] bg-[#111318]/80" />
        </div>
      </div>
      <div className={cn(block, "h-[360px] md:col-span-2 xl:col-span-8")} />
      <div className={cn(block, "h-[360px] md:col-span-2 xl:col-span-4")} />
    </div>
  );
}

/* ================================================================== */
/* Halaman                                                             */
/* ================================================================== */

export default function AdminOverviewDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [period, setPeriod] = useState<7 | 14>(7);

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

  /* ------------------------- Turunan data ------------------------- */
  const timeline = useMemo(() => data?.timeline ?? [], [data]);
  const periodData = useMemo(() => timeline.slice(-period), [timeline, period]);
  const periodLeads = sum(periodData, "leads");
  const periodOrders = sum(periodData, "orders");

  const last7Leads = sum(timeline.slice(-7), "leads");
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

  const leads = data?.summary.leads;
  const leadTotal = leads?.total ?? 0;
  const stages: StageDatum[] = leads
    ? [
        { key: "new", label: "Baru", value: leads.new, style: striped(INK, "rgba(255,255,255,0.12)"), dot: INK },
        { key: "contacted", label: "Dihubungi", value: leads.contacted, style: striped(NAVY), dot: NAVY },
        { key: "scheduled", label: "Jadwal Demo", value: leads.scheduled, style: striped(BLUE), dot: BLUE },
        { key: "completed", label: "Selesai", value: leads.completed, style: striped(SKY, "rgba(255,255,255,0.45)"), dot: SKY },
      ]
    : [];

  const followedUp = leads ? leads.contacted + leads.scheduled + leads.completed : 0;
  const conversions = leads
    ? [
        { label: "Sudah dihubungi", value: followedUp, color: BLUE },
        { label: "Mencapai jadwal demo", value: leads.scheduled + leads.completed, color: "#5B95FF" },
        { label: "Demo selesai", value: leads.completed, color: SKY },
        { label: "Menunggu respon", value: leads.new, color: EMPTY },
      ]
    : [];

  const institutions = useMemo(() => [...(data?.institutionDistribution ?? [])].sort((a, b) => b.count - a.count), [data]);
  const institutionTotal = institutions.reduce((a, b) => a + b.count, 0);
  const institutionMax = Math.max(1, ...institutions.map((i) => i.count));
  const INSTITUTION_STYLES = [striped(BLUE), striped(INK, "rgba(255,255,255,0.12)"), striped(NAVY), striped(SKY, "rgba(255,255,255,0.45)")];

  const todayPoint = timeline.length ? timeline[timeline.length - 1] : null;
  const yesterdayPoint = timeline.length > 1 ? timeline[timeline.length - 2] : null;

  const highlights: Highlight[] = data
    ? [
        {
          kicker: "Menunggu respon",
          value: data.summary.leads.new,
          text: "permohonan demo belum dihubungi tim.",
          emptyText: "Semua permohonan demo sudah ditindaklanjuti.",
          href: "/admin/leads",
          cta: "Tinjau permohonan",
        },
        {
          kicker: "Jadwal demo",
          value: data.summary.leads.scheduled,
          text: "permohonan sudah memiliki jadwal demo.",
          emptyText: "Belum ada permohonan dengan jadwal demo.",
          href: "/admin/leads",
          cta: "Lihat permohonan",
        },
        {
          kicker: "Order CITO",
          value: data.summary.orders.cito,
          text: "order laboratorium berprioritas CITO di LIS.",
          emptyText: "Tidak ada order laboratorium berprioritas CITO.",
          href: "/admin/orders",
          cta: "Buka order lab",
        },
      ]
    : [];

  const toolbarBtn = cn(
    "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-[13px] font-medium text-[#111318] transition-colors hover:bg-[#F7F8FA] disabled:opacity-60",
    focusRing
  );
  const toolbarIcon = cn("inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111318] transition-colors hover:bg-[#F7F8FA] disabled:opacity-60", focusRing);

  return (
    <div className="space-y-6">
      {/* ---------------------------- Judul + toolbar ---------------------------- */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-[28px] font-medium leading-tight tracking-tight text-[#111318] sm:text-[32px]">Ringkasan Dashboard</h1>
          <nav aria-label="Breadcrumb" className="mt-1 text-[12px] text-[#8A8F98]">
            Dashboard <span className="mx-1">›</span> <span className="text-[#5B616B]">Semua Laporan</span>
            {updatedAt && (
              <span className="ml-2" aria-live="polite">
                · Diperbarui {updatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Periode aktivitas" className="inline-flex h-11 items-center rounded-full bg-white p-1">
            {([7, 14] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                aria-pressed={period === p}
                className={cn("h-9 rounded-full px-4 text-[13px] font-medium transition-colors", focusRing, period === p ? "bg-[#111318] text-white" : "text-[#5B616B] hover:text-[#111318]")}
              >
                {p} Hari
              </button>
            ))}
          </div>
          <a href="/api/admin/leads/export" download className={toolbarBtn}>
            Ekspor
          </a>
          <a href="/api/admin/leads/export" download aria-label="Unduh data permohonan (CSV)" title="Unduh data permohonan (CSV)" className={toolbarIcon}>
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
          <button type="button" onClick={fetchOverview} disabled={isLoading} className={toolbarBtn}>
            {isLoading ? "Memuat..." : "Muat Ulang"}
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#1F6BFF]")} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------------------------------- Konten ---------------------------------- */}
      {isLoading && !data ? (
        <>
          <span className="sr-only" role="status">
            Memuat data dashboard...
          </span>
          <DashboardSkeleton />
        </>
      ) : !data ? (
        <div role="alert" className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold text-[#111318]">Data dashboard gagal dimuat</p>
            <p className="mt-1 text-sm text-[#8A8F98]">{error || "Terjadi kesalahan yang tidak diketahui."}</p>
          </div>
          <button type="button" onClick={fetchOverview} className={cn("inline-flex items-center gap-2 rounded-full bg-[#1F6BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1858D6]", focusRing)}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Gagal memuat ulang ({error}). Menampilkan data terakhir.
              </span>
              <button type="button" onClick={fetchOverview} className={cn("rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-rose-200", focusRing)}>
                Coba Lagi
              </button>
            </div>
          )}

          <div className={cn("grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2 xl:grid-cols-12", isLoading && "opacity-60")} aria-busy={isLoading}>
            {/* 1. Aktivitas harian (matriks titik) */}
            <Card
              className="md:col-span-2 xl:col-span-5"
              title="Aktivitas Harian"
              action={
                <>
                  <CircleLink href="/admin/leads" label="Buka permohonan demo" />
                </>
              }
            >
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="font-display text-[34px] font-medium leading-none tracking-tight text-[#111318]">{fmt(periodLeads)}</div>
                  <div className="mt-1.5 text-[12px] text-[#8A8F98]">
                    permohonan demo · {fmt(periodOrders)} order lab dalam {period} hari
                  </div>
                </div>
              </div>
              {periodData.length === 0 ? (
                <EmptyState icon={Users} text="Belum ada data aktivitas untuk ditampilkan." />
              ) : (
                <ActivityDots data={periodData} />
              )}
            </Card>

            {/* 2-4. Blok kanan: sorotan, hari ini, ekspor */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-7">
              <HighlightCard slides={highlights} todayLeads={todayPoint ? todayPoint.leads : null} />

              <section className="flex min-w-0 flex-col justify-between rounded-[24px] bg-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F3F5] text-[#111318]">
                    <Users className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <h2 className="text-[13px] font-medium leading-tight text-[#3B4049]">
                    Permohonan
                    <br />
                    Hari Ini
                  </h2>
                </div>
                <div className="mt-4 font-display text-[34px] font-medium leading-none tracking-tight text-[#111318]">{fmt(todayPoint?.leads ?? 0)}</div>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#EEF0F3] pt-3">
                  <span className="text-[12px] text-[#8A8F98]">
                    Kemarin {fmt(yesterdayPoint?.leads ?? 0)} · 7 hari{" "}
                  </span>
                  <DeltaChip text={deltaText} tone={deltaTone} />
                </div>
              </section>

              <section className="relative flex min-h-[176px] min-w-0 flex-col justify-between overflow-hidden rounded-[24px] bg-[#111318] p-5 text-white sm:p-6">
                <span className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/[0.06]" aria-hidden="true" />
                <div className="relative flex items-center justify-between gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="/api/admin/leads/export"
                      download
                      aria-label="Unduh data permohonan (CSV)"
                      title="Unduh data permohonan (CSV)"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111318] transition-colors hover:bg-[#E9ECF1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </a>
                    <CircleLink href="/admin/leads" label="Buka permohonan demo" dark />
                  </div>
                </div>
                <div className="relative mt-6">
                  <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-white/75">Unduh data permohonan (CSV)</span>
                  <h2 className="mt-2 text-[21px] font-medium leading-tight text-white">Laporan Permohonan</h2>
                </div>
              </section>
            </div>

            {/* 5. Permohonan per tahap (batang bergaris) */}
            <Card
              className="md:col-span-2 xl:col-span-8"
              title="Permohonan per Tahap"
              action={
                <>
                  <span className="hidden rounded-full border border-[#E4E6EA] px-3 py-2 text-[12px] font-medium text-[#3B4049] sm:inline-flex">Semua waktu</span>
                  <CircleLink href="/admin/leads" label="Lihat detail permohonan" />
                </>
              }
            >
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text="Belum ada permohonan demo yang tercatat." />
              ) : (
                <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
                  <div className="flex flex-col">
                    <span className="w-fit rounded-full bg-[#111318] px-3 py-1 text-[11px] font-medium text-white">Total</span>
                    <div className="mt-3 font-display text-[34px] font-medium leading-none tracking-tight text-[#111318]">{fmt(leadTotal)}</div>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#8A8F98]">permohonan demo berdasarkan status saat ini</p>
                    <div className="mt-5">
                      <div className={cn("font-display text-[30px] font-medium leading-none", deltaTone === "down" ? "text-[#B42318]" : "text-[#1F6BFF]")}>{deltaText}</div>
                      <p className="mt-1 text-[12px] text-[#8A8F98]">permohonan 7 hari terakhir dibanding 7 hari sebelumnya</p>
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
            <Card className="md:col-span-2 xl:col-span-4" title="Konversi Pipeline" action={<CircleLink href="/admin/leads" label="Buka permohonan demo" />}>
              {leadTotal === 0 ? (
                <EmptyState icon={Users} text="Konversi akan tampil setelah ada permohonan demo." />
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
                      <div
                        className="font-display text-[34px] font-medium leading-none text-[#111318]"
                        role="img"
                        aria-label={`${pct(followedUp, leadTotal)}% permohonan sudah ditindaklanjuti`}
                      >
                        {pct(followedUp, leadTotal)}%
                      </div>
                      <div className="mt-1 text-[11px] text-[#8A8F98]">sudah ditindaklanjuti</div>
                    </div>
                  </div>
                  <p className="mx-auto mt-3 w-fit rounded-full bg-[#F2F3F5] px-3 py-1.5 text-[11px] text-[#5B616B]">
                    {fmt(followedUp)} dari {fmt(leadTotal)} permohonan sudah dihubungi
                  </p>
                </>
              )}
            </Card>

            {/* 7. Permohonan terbaru */}
            <Card className="xl:col-span-5" title="Permohonan Terbaru" action={<CircleLink href="/admin/leads" label="Lihat semua permohonan" />}>
              {data.recentLeads.length === 0 ? (
                <EmptyState icon={Users} text="Belum ada permohonan demo yang masuk." />
              ) : (
                <ul className="space-y-2">
                  {data.recentLeads.map((lead) => (
                    <li key={lead.id} className="flex items-center gap-3 rounded-2xl bg-[#F7F8FA] px-3 py-2.5">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111318] text-[12px] font-bold text-white">
                        {getInitials(lead.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-[#111318]">{lead.name}</div>
                        <div className="truncate text-[11px] text-[#8A8F98]">{lead.institution || INSTITUTION_NAMES[lead.institutionType] || "-"}</div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusBadge type={lead.status} className="px-2 text-[10px]" />
                        <span className="text-[10px] text-[#8A8F98]">{formatShortDate(lead.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* 8. Order lab terbaru */}
            <Card className="xl:col-span-7" title="Order Lab Terbaru" action={<CircleLink href="/admin/orders" label="Buka order lab" />}>
              {data.recentOrders.length === 0 ? (
                <EmptyState icon={FlaskConical} text="Belum ada order laboratorium yang terdaftar." />
              ) : (
                <ul className="space-y-2">
                  {data.recentOrders.map((order) => {
                    const done = order.specimensCount > 0 && order.receivedSpecimensCount >= order.specimensCount;
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
                            {order.physicianName} · {formatDateTime(order.orderedAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge type={order.priority} className="px-2 text-[10px]" />
                          <span className={cn("text-[10px] font-medium", done ? "text-emerald-700" : "text-[#8A8F98]")}>
                            {order.receivedSpecimensCount}/{order.specimensCount} spesimen diterima
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* 9. Ringkasan LIS */}
            <Card className="xl:col-span-5" title="Ringkasan LIS" action={<CircleLink href="/admin/orders" label="Buka order lab" />}>
              <dl className="grid grid-cols-2 gap-2">
                {[
                  { label: "Total order", value: data.summary.orders.total, dark: true },
                  { label: "Prioritas CITO", value: data.summary.orders.cito, blue: true },
                  { label: "Prioritas mendesak", value: data.summary.orders.urgent },
                  { label: "Prioritas rutin", value: data.summary.orders.routine },
                  { label: "Order selesai", value: data.summary.orders.completed },
                  { label: "Spesimen diterima", value: data.summary.specimens.received },
                  { label: "Spesimen ditolak", value: data.summary.specimens.rejected },
                  { label: "Pengguna aktif", value: data.summary.activeUsers },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={cn("rounded-2xl px-3.5 py-3", row.dark ? "bg-[#111318] text-white" : row.blue ? "text-white" : "bg-[#F7F8FA]")}
                    style={row.blue ? striped(BLUE) : undefined}
                  >
                    <dt className={cn("text-[11px]", row.dark || row.blue ? "text-white/75" : "text-[#8A8F98]")}>{row.label}</dt>
                    <dd className={cn("mt-1 font-display text-[22px] font-medium leading-none", row.dark || row.blue ? "text-white" : "text-[#111318]")}>{fmt(row.value)}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* 10. Profil institusi */}
            <Card className="xl:col-span-7" title="Profil Institusi" action={<CircleLink href="/admin/leads" label="Buka permohonan demo" />}>
              {institutions.length === 0 ? (
                <EmptyState icon={Building2} text="Belum ada data institusi pemohon." />
              ) : (
                <ul className="space-y-3">
                  {institutions.map((inst, i) => (
                    <li key={inst.type} className="grid grid-cols-[minmax(110px,160px)_minmax(0,1fr)_auto] items-center gap-3">
                      <span className="truncate text-[12px] font-medium text-[#3B4049]">{INSTITUTION_NAMES[inst.type] || inst.type}</span>
                      <span className="h-7 w-full overflow-hidden rounded-full bg-[#F2F3F5]" aria-hidden="true">
                        <span className="block h-full rounded-full" style={{ width: `${Math.max(6, (inst.count / institutionMax) * 100)}%`, ...INSTITUTION_STYLES[i % INSTITUTION_STYLES.length] }} />
                      </span>
                      <span className="w-[72px] text-right text-[12px] text-[#8A8F98]">
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
