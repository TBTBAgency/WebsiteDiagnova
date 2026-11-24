"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Users,
  Search,
  Eye,
  RefreshCw,
  Download,
  Building2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  CalendarClock,
  PhoneCall,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Copy,
  Check,
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Link as LinkIcon,
  KeyRound,
  Hourglass,
  Ban,
  History,
  ClipboardCheck,
  TriangleAlert,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ApiResponse, DemoAccessRecord, DemoRequestRecord, InstitutionType, LeadStatus } from "@/types";
import {
  LEAD_STAGES,
  LEAD_STAGE_LABELS,
  DEMO_DURATION_OPTIONS,
  DEMO_ACCESS_STATE_LABELS,
  DEFAULT_DEMO_DURATION_DAYS,
} from "@/lib/demo-constants";
import type { DemoAccessState, DemoDurationDays, MagicLinkState } from "@/lib/demo-constants";
import { MetricCard } from "@/components/admin/MetricCard";
import { StatusBadge } from "@/components/admin/StatusBadge";

/* ------------------------------------------------------------------ */
/* Tipe lokal                                                          */
/* ------------------------------------------------------------------ */

interface LeadMetrics {
  total: number;
  contacted: number;
  scheduled: number;
  completed: number;
  upcomingThisMonth: number;
  awaitingCompletion: number;
}

interface LeadListResponse {
  leads: DemoRequestRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  metrics: LeadMetrics;
}

/** Respons aksi akses (beri akses, tautan baru, perpanjang). */
interface AccessIssueResponse {
  lead: DemoRequestRecord;
  magicLinkUrl: string | null;
  expiresAt: string | null;
}

type ActionKind = "grant" | "link" | "extend" | "revoke" | "schedule" | "reject" | "complete";

interface MagicLinkResult {
  title: string;
  url: string;
  expiresAt: string | null;
  lead: DemoRequestRecord;
}

type ApiResult<T> = { ok: true; data: T; message: string } | { ok: false; message: string };

/* ------------------------------------------------------------------ */
/* Konstanta tampilan                                                  */
/* ------------------------------------------------------------------ */

const PAGE_LIMIT = 10;
const TZ = "Asia/Jakarta";
const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000; // WIB = UTC+7 (tanpa DST)
const OPEN_ACCESS_STATES: DemoAccessState[] = ["ACTIVE", "QUEUED", "PENDING_ACTIVATION"];

const EMPTY_METRICS: LeadMetrics = {
  total: 0,
  contacted: 0,
  scheduled: 0,
  completed: 0,
  upcomingThisMonth: 0,
  awaitingCompletion: 0,
};

const institutionLabels: Record<InstitutionType, string> = {
  hospital: "Rumah Sakit",
  "clinical-lab": "Laboratorium Klinis",
  "pathology-center": "Pusat Patologi",
  "microbiology-center": "Pusat Mikrobiologi",
  "blood-bank": "Bank Darah",
  other: "Lainnya",
};

const accessStateStyles: Record<DemoAccessState, string> = {
  PENDING_ACTIVATION: "bg-sky-50 text-sky-700 border-sky-200",
  QUEUED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
};

const magicLinkStateLabels: Record<MagicLinkState, string> = {
  ACTIVE: "Belum dipakai",
  USED: "Sudah digunakan",
  EXPIRED: "Kedaluwarsa",
  REVOKED: "Dicabut",
};

const magicLinkStateStyles: Record<MagicLinkState, string> = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-200",
  USED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  REVOKED: "bg-rose-50 text-rose-700 border-rose-200",
};

/* ------------------------------------------------------------------ */
/* Helper                                                              */
/* ------------------------------------------------------------------ */

function isValidDate(value?: string | null): value is string {
  return Boolean(value) && !isNaN(new Date(value as string).getTime());
}

/** "16 Nov 2026, 14.30 WIB" */
function formatDateTime(value?: string | null): string {
  if (!isValidDate(value)) return "-";
  return (
    new Date(value).toLocaleString("id-ID", {
      timeZone: TZ,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

/** "Senin, 16 November 2026 pukul 14.30 WIB" */
function formatDateTimeLong(value?: string | null): string {
  if (!isValidDate(value)) return "-";
  return (
    new Date(value).toLocaleString("id-ID", {
      timeZone: TZ,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB"
  );
}

function formatDateOnly(value?: string | null): string {
  if (!isValidDate(value)) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    timeZone: TZ,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeOnly(value?: string | null): string {
  if (!isValidDate(value)) return "";
  return (
    new Date(value).toLocaleTimeString("id-ID", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }) + " WIB"
  );
}

/** ISO -> nilai input datetime-local dalam WIB ("YYYY-MM-DDTHH:mm"). */
function isoToJakartaInput(value?: string | null): string {
  if (!isValidDate(value)) return "";
  return new Date(new Date(value).getTime() + JAKARTA_OFFSET_MS).toISOString().slice(0, 16);
}

/** Nilai input datetime-local (dibaca sebagai WIB) -> ISO UTC. */
function jakartaInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(`${value}:00+07:00`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function toWaNumber(phone: string): string {
  let clean = (phone || "").replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) clean = "62" + clean.slice(1);
  return clean;
}

function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(message)}`;
}

/** Pesan WhatsApp untuk kontak biasa (tidak mengubah status apa pun). */
function buildContactMessage(lead: DemoRequestRecord): string {
  const confirmed = lead.confirmedDemoDate;
  const target = confirmed || lead.requestedDemoDate;
  const jadwal = target
    ? `${formatDateTimeLong(target)}${confirmed ? " (terkonfirmasi)" : " (diajukan)"}`
    : "Menunggu konfirmasi kesesuaian jadwal Anda";
  const instType = institutionLabels[lead.institutionType] || lead.institutionType;

  return [
    `Halo ${lead.name} dari ${lead.institution},`,
    "",
    "Terima kasih telah mengajukan permohonan demo Diagnova LIS Platform.",
    "Saya dari tim spesialis Diagnova ingin mengonfirmasi jadwal presentasi demo Anda.",
    "",
    "*Rincian Permohonan:*",
    `- Jadwal: ${jadwal}`,
    `- Institusi: ${lead.institution} (${instType})`,
    `- Nama Pemohon: ${lead.name} (${lead.jobTitle})`,
    "",
    "Mohon konfirmasi apakah waktu tersebut sudah sesuai dengan agenda tim laboratorium Anda. Terima kasih!",
    "",
    "Salam hangat,",
    "*Tim Spesialis Diagnova LIS*",
    "https://diagnova.id",
  ].join("\n");
}

/** Pesan WhatsApp berisi magic link (sekali pakai, 24 jam). */
function buildMagicLinkMessage(result: MagicLinkResult): string {
  const { lead, url, expiresAt } = result;
  const access = pickDisplayAccess(lead);
  let accessInfo = "";
  if (access?.state === "ACTIVE" && access.expiresAt) {
    accessInfo = `Akses demo Anda aktif hingga ${formatDateTimeLong(access.expiresAt)}.`;
  } else if (access?.state === "PENDING_ACTIVATION") {
    accessInfo = `Masa akses demo ${access.durationDays} hari dihitung sejak Anda pertama kali login.`;
  }

  return [
    `Halo ${lead.name} dari ${lead.institution},`,
    "",
    "Akses demo Diagnova LIS Platform untuk Anda telah disiapkan.",
    "",
    "*Tautan masuk langsung (tanpa password):*",
    url,
    "",
    `_Catatan: tautan berlaku 24 jam${expiresAt ? ` (hingga ${formatDateTime(expiresAt)})` : ""} dan hanya dapat digunakan 1 kali._`,
    accessInfo,
    "",
    "Salam hangat,",
    "*Tim Spesialis Diagnova LIS*",
  ]
    .filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""))
    .join("\n");
}

/** Periode yang paling relevan untuk ditampilkan: yang sedang aktif, lalu currentAccess, lalu periode terakhir. */
function pickDisplayAccess(lead: DemoRequestRecord): DemoAccessRecord | null {
  const accesses = lead.accesses ?? [];
  return accesses.find((a) => a.state === "ACTIVE") ?? lead.currentAccess ?? accesses[0] ?? null;
}

function describeAccessTiming(access: DemoAccessRecord): string {
  switch (access.state) {
    case "ACTIVE":
      return `Berlaku s.d. ${formatDateTime(access.expiresAt)}`;
    case "QUEUED":
      return `Mulai ${formatDateTime(access.activatedAt)}`;
    case "PENDING_ACTIVATION":
      return `${access.durationDays} hari sejak login pertama`;
    case "EXPIRED":
      return `Berakhir ${formatDateTime(access.expiresAt)}`;
    case "REVOKED":
      return `Dicabut ${formatDateTime(access.revokedAt)}`;
    default:
      return "";
  }
}

/** Alasan aksi tidak tersedia (null = aksi dapat dijalankan). Mengikuti aturan workflow di server. */
function getActionBlockers(lead: DemoRequestRecord): Record<ActionKind, string | null> {
  const rejected = lead.approvalStatus === "REJECTED";
  const completed = lead.status === "COMPLETED";
  const accesses = lead.accesses ?? [];
  const hasOpen = accesses.some((a) => OPEN_ACCESS_STATES.includes(a.state));

  // Ujung rantai perpanjangan: periode tidak dicabut yang belum diperpanjang oleh periode lain.
  const extendedIds = new Set(accesses.map((a) => a.extendsAccessId).filter(Boolean) as string[]);
  const chainEnd = accesses
    .filter((a) => a.state !== "REVOKED" && !extendedIds.has(a.id))
    .sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime())[0];

  const REJECTED_MSG = "Permohonan sudah ditolak.";
  const COMPLETED_MSG = "Demo sudah dikonfirmasi selesai.";

  return {
    grant: rejected
      ? REJECTED_MSG
      : completed
      ? COMPLETED_MSG
      : hasOpen
      ? "Masih ada akses yang berjalan / menunggu aktivasi. Gunakan Buat Tautan Baru atau Perpanjang Akses."
      : null,
    link: rejected ? REJECTED_MSG : !hasOpen ? "Tidak ada akses demo yang masih berlaku." : null,
    extend: rejected
      ? REJECTED_MSG
      : completed
      ? COMPLETED_MSG
      : !chainEnd
      ? "Belum ada akses demo yang dapat diperpanjang."
      : !chainEnd.activatedAt
      ? "Akses belum diaktifkan pemohon (belum login)."
      : null,
    revoke: !hasOpen ? "Tidak ada akses demo yang perlu dicabut." : null,
    schedule: null,
    reject: rejected
      ? "Permohonan sudah ditolak."
      : lead.status !== "CONTACTED"
      ? "Hanya untuk lead berstatus Dihubungi (belum pernah login demo)."
      : null,
    complete:
      lead.status === "COMPLETED"
        ? "Demo sudah ditandai selesai."
        : lead.status !== "SCHEDULED"
        ? "Pemohon belum pernah login demo (status masih Dihubungi)."
        : null,
  };
}

/** Fetch ke API admin. 401 -> redirect ke halaman login. Pesan error API diteruskan apa adanya. */
async function apiRequest<T>(url: string, init?: { method?: string; body?: unknown }): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: init?.method ?? "GET",
      headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    if (res.status === 401) {
      window.location.href = "/"; // sesi habis: path login tidak diungkap
      return { ok: false, message: "Sesi Anda telah berakhir. Silakan login kembali." };
    }
    const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
    if (res.ok && json?.success) {
      return { ok: true, data: json.data as T, message: json.message };
    }
    return { ok: false, message: json?.message || `Permintaan gagal (HTTP ${res.status}).` };
  } catch (err) {
    console.error("API request error:", err);
    return { ok: false, message: "Terjadi kesalahan jaringan. Periksa koneksi lalu coba lagi." };
  }
}

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

function AccessStateBadge({ state }: { state: DemoAccessState }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${accessStateStyles[state]}`}
    >
      <KeyRound className="h-2.5 w-2.5" />
      <span>{DEMO_ACCESS_STATE_LABELS[state]}</span>
    </span>
  );
}

function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <StatusBadge type={status} label={LEAD_STAGE_LABELS[status] ?? status} />;
}

function AccessEndedIndicator({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 font-semibold ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <Hourglass className="h-3 w-3 shrink-0" />
      <span>Akses berakhir — menunggu konfirmasi selesai</span>
    </span>
  );
}

function RejectedIndicator({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-semibold ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      }`}
    >
      <ShieldX className="h-3 w-3 shrink-0" />
      <span>Ditolak</span>
    </span>
  );
}

function InfoField({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 ${className}`}>
      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{label}</span>
      </span>
      <div className="font-semibold text-slate-900">{children}</div>
    </div>
  );
}

function DurationPicker({
  value,
  onChange,
}: {
  value: DemoDurationDays;
  onChange: (days: DemoDurationDays) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DEMO_DURATION_OPTIONS.map((days) => (
        <button
          key={days}
          type="button"
          onClick={() => onChange(days)}
          className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
            value === days
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
        >
          {days} Hari{days === DEFAULT_DEMO_DURATION_DAYS ? " (Standar)" : ""}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Konfigurasi aksi                                                    */
/* ------------------------------------------------------------------ */

const ACTION_CONFIG: Record<
  ActionKind,
  {
    label: string;
    icon: LucideIcon;
    buttonClass: string;
    dialogTitle: string;
    confirmLabel: string;
    confirmClass: string;
  }
> = {
  grant: {
    label: "Beri Akses Demo",
    icon: ShieldCheck,
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600",
    dialogTitle: "Beri Akses Demo",
    confirmLabel: "Beri Akses & Buat Tautan",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  link: {
    label: "Buat Tautan Baru",
    icon: LinkIcon,
    buttonClass: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
    dialogTitle: "Buat Tautan Login Baru",
    confirmLabel: "Buat Tautan Baru",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  extend: {
    label: "Perpanjang Akses",
    icon: Hourglass,
    buttonClass: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
    dialogTitle: "Perpanjang Akses Demo",
    confirmLabel: "Perpanjang Akses",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  revoke: {
    label: "Cabut Akses",
    icon: Ban,
    buttonClass: "bg-white hover:bg-rose-50 text-rose-700 border-rose-200",
    dialogTitle: "Cabut Akses Demo",
    confirmLabel: "Ya, Cabut Akses",
    confirmClass: "bg-rose-600 hover:bg-rose-700 text-white",
  },
  schedule: {
    label: "Ubah Jadwal Presentasi",
    icon: CalendarClock,
    buttonClass: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
    dialogTitle: "Ubah Jadwal Presentasi",
    confirmLabel: "Simpan Jadwal",
    confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  reject: {
    label: "Tolak Permohonan",
    icon: ShieldAlert,
    buttonClass: "bg-white hover:bg-rose-50 text-rose-700 border-rose-200",
    dialogTitle: "Tolak Permohonan Demo",
    confirmLabel: "Konfirmasi Tolak",
    confirmClass: "bg-rose-600 hover:bg-rose-700 text-white",
  },
  complete: {
    label: "Tandai Demo Selesai",
    icon: ClipboardCheck,
    buttonClass: "bg-slate-900 hover:bg-slate-800 text-white border-slate-900",
    dialogTitle: "Tandai Demo Selesai",
    confirmLabel: "Ya, Tandai Selesai",
    confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
};

const ACTION_ORDER: ActionKind[] = ["grant", "link", "extend", "revoke", "schedule", "reject", "complete"];

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<DemoRequestRecord[]>([]);
  const [metrics, setMetrics] = useState<LeadMetrics>(EMPTY_METRICS);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState("");

  // Filter & paginasi
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [onlyRejected, setOnlyRejected] = useState(false);
  const [institutionFilter, setInstitutionFilter] = useState<InstitutionType | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  // Detail
  const [selectedLead, setSelectedLead] = useState<DemoRequestRecord | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailMessage, setDetailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const detailRequestId = useRef(0);

  // Dialog aksi
  const [activeAction, setActiveAction] = useState<ActionKind | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationDays, setDurationDays] = useState<DemoDurationDays>(DEFAULT_DEMO_DURATION_DAYS);
  const [scheduleInput, setScheduleInput] = useState("");
  const [clearSchedule, setClearSchedule] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [completionNote, setCompletionNote] = useState("");

  // Magic link sekali tampil
  const [magicLink, setMagicLink] = useState<MagicLinkResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filterParams = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (onlyRejected) params.set("approvalStatus", "REJECTED");
    if (institutionFilter !== "all") params.set("institutionType", institutionFilter);
    if (searchTerm) params.set("search", searchTerm);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    return params;
  }, [statusFilter, onlyRejected, institutionFilter, searchTerm, startDate, endDate]);

  const exportHref = useMemo(() => {
    const qs = filterParams.toString();
    return `/api/admin/leads/export${qs ? `?${qs}` : ""}`;
  }, [filterParams]);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams(filterParams);
    params.set("page", String(currentPage));
    params.set("limit", String(PAGE_LIMIT));

    const result = await apiRequest<LeadListResponse>(`/api/admin/leads?${params.toString()}`);
    if (result.ok) {
      setLeads(result.data.leads || []);
      setMetrics({ ...EMPTY_METRICS, ...(result.data.metrics || {}) });
      setTotalPages(Math.max(1, result.data.totalPages || 1));
      setTotalRows(result.data.total || 0);
      setListError("");
    } else {
      setListError(result.message);
    }
    setIsLoading(false);
  }, [filterParams, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /* ---------------- Detail ---------------- */

  const handleOpenDetail = async (lead: DemoRequestRecord) => {
    const reqId = ++detailRequestId.current;
    setSelectedLead(lead);
    setDetailMessage(null);
    setIsDetailLoading(true);
    const result = await apiRequest<DemoRequestRecord>(`/api/admin/leads/${lead.id}`);
    if (reqId !== detailRequestId.current) return;
    if (result.ok && result.data) {
      setSelectedLead(result.data);
    } else if (!result.ok) {
      setDetailMessage({ type: "error", text: result.message });
    }
    setIsDetailLoading(false);
  };

  const handleCloseDetail = () => {
    detailRequestId.current++;
    setSelectedLead(null);
    setDetailMessage(null);
    setActiveAction(null);
    setIsDetailLoading(false);
  };

  /* ---------------- Aksi ---------------- */

  const openAction = (kind: ActionKind) => {
    if (!selectedLead) return;
    setDialogError("");
    setIsSubmitting(false);
    const display = pickDisplayAccess(selectedLead);
    const defaultDuration = (DEMO_DURATION_OPTIONS as readonly number[]).includes(display?.durationDays ?? 0)
      ? (display!.durationDays as DemoDurationDays)
      : DEFAULT_DEMO_DURATION_DAYS;
    setDurationDays(defaultDuration);
    setScheduleInput(isoToJakartaInput(selectedLead.confirmedDemoDate || selectedLead.requestedDemoDate));
    setClearSchedule(false);
    setRejectionReason("");
    setCompletionNote("");
    setActiveAction(kind);
  };

  const closeAction = () => {
    if (isSubmitting) return;
    setActiveAction(null);
    setDialogError("");
  };

  const submitAction = async () => {
    if (!selectedLead || !activeAction) return;
    const id = selectedLead.id;
    let url = "";
    let body: unknown = undefined;
    let method = "POST";

    switch (activeAction) {
      case "grant": {
        const confirmed = jakartaInputToIso(scheduleInput);
        body = confirmed ? { durationDays, confirmedDemoDate: confirmed } : { durationDays };
        url = `/api/admin/leads/${id}/access`;
        break;
      }
      case "link":
        url = `/api/admin/leads/${id}/access/link`;
        break;
      case "extend":
        url = `/api/admin/leads/${id}/access/extend`;
        body = { durationDays };
        break;
      case "revoke":
        url = `/api/admin/leads/${id}/access/revoke`;
        break;
      case "schedule": {
        const iso = clearSchedule ? null : jakartaInputToIso(scheduleInput);
        if (!clearSchedule && !iso) {
          setDialogError("Pilih tanggal & jam presentasi, atau centang opsi kosongkan jadwal.");
          return;
        }
        url = `/api/admin/leads/${id}`;
        method = "PATCH";
        body = { confirmedDemoDate: iso };
        break;
      }
      case "reject": {
        const reason = rejectionReason.trim();
        if (reason.length < 2) {
          setDialogError("Alasan penolakan wajib diisi (minimal 2 karakter).");
          return;
        }
        url = `/api/admin/leads/${id}/reject`;
        body = { rejectionReason: reason };
        break;
      }
      case "complete": {
        const note = completionNote.trim();
        url = `/api/admin/leads/${id}/complete`;
        body = { note: note ? note : null };
        break;
      }
    }

    setIsSubmitting(true);
    setDialogError("");
    const isAccessIssue = activeAction === "grant" || activeAction === "link" || activeAction === "extend";
    const result = await apiRequest<AccessIssueResponse | DemoRequestRecord>(url, { method, body });
    setIsSubmitting(false);

    if (!result.ok) {
      setDialogError(result.message);
      return;
    }

    let updated: DemoRequestRecord;
    let link: MagicLinkResult | null = null;
    if (isAccessIssue) {
      const data = result.data as AccessIssueResponse;
      updated = data.lead;
      if (data.magicLinkUrl) {
        link = {
          title: ACTION_CONFIG[activeAction].dialogTitle,
          url: data.magicLinkUrl,
          expiresAt: data.expiresAt,
          lead: data.lead,
        };
      }
    } else {
      updated = result.data as DemoRequestRecord;
    }

    if (updated) setSelectedLead(updated);
    setDetailMessage({ type: "success", text: result.message });
    setActiveAction(null);
    if (link) {
      setCopiedLink(false);
      setMagicLink(link);
    }
    fetchLeads();
  };

  const handleCopyMagicLink = async () => {
    if (!magicLink) return;
    try {
      await navigator.clipboard.writeText(magicLink.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard API tidak tersedia (mis. bukan HTTPS): pilih teks agar dapat disalin manual.
      linkInputRef.current?.select();
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setOnlyRejected(false);
    setInstitutionFilter("all");
    setSearchInput("");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const hasActiveFilter =
    statusFilter !== "all" || onlyRejected || institutionFilter !== "all" || searchInput !== "" || startDate !== "" || endDate !== "";

  const blockers = selectedLead ? getActionBlockers(selectedLead) : null;
  const rangeStart = totalRows === 0 ? 0 : (currentPage - 1) * PAGE_LIMIT + 1;
  const rangeEnd = Math.min(currentPage * PAGE_LIMIT, totalRows);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
              Permohonan Demo (Leads CRM)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              {metrics.total} lead
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Status lead berjalan otomatis: Dihubungi saat form masuk, Jadwal Demo saat login demo pertama, dan
            Selesai setelah admin menandai demo selesai.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchLeads()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs disabled:opacity-50"
            title="Muat ulang data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href={exportHref}
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs"
            title="Ekspor CSV sesuai filter yang aktif"
          >
            <Download className="h-3.5 w-3.5 text-white" />
            <span>Ekspor CSV</span>
          </a>
        </div>
      </div>

      {/* Kartu metrik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Dihubungi"
          value={metrics.contacted}
          subtitle="Form masuk, belum login demo"
          icon={PhoneCall}
          iconBg="bg-amber-50"
          iconColor="text-[#E5A23B]"
          badge={{ text: "Tahap 1", variant: "warning" }}
          onClick={() => {
            setStatusFilter("CONTACTED");
            setCurrentPage(1);
          }}
        />
        <MetricCard
          title="Jadwal Demo"
          value={metrics.scheduled}
          subtitle="Sudah login demo"
          icon={CalendarCheck}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={
            metrics.awaitingCompletion > 0
              ? { text: `${metrics.awaitingCompletion} menunggu konfirmasi selesai`, variant: "warning" }
              : { text: "Tahap 2", variant: "purple" }
          }
          onClick={() => {
            setStatusFilter("SCHEDULED");
            setCurrentPage(1);
          }}
        />
        <MetricCard
          title="Selesai"
          value={metrics.completed}
          subtitle="Demo dikonfirmasi selesai"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{ text: "Tahap 3", variant: "success" }}
          onClick={() => {
            setStatusFilter("COMPLETED");
            setCurrentPage(1);
          }}
        />
        <MetricCard
          title="Jadwal Terdekat di Bulan Ini"
          value={metrics.upcomingThisMonth}
          subtitle="Presentasi terkonfirmasi s.d. akhir bulan"
          icon={CalendarClock}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
          badge={{ text: "Bulan ini", variant: "default" }}
        />
      </div>

      {/* Filter */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama, institusi, email, atau no. telepon..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          <select
            value={institutionFilter}
            onChange={(e) => {
              setInstitutionFilter(e.target.value as InstitutionType | "all");
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-hidden"
          >
            <option value="all">Semua jenis institusi</option>
            {(Object.keys(institutionLabels) as InstitutionType[]).map((key) => (
              <option key={key} value={key}>
                {institutionLabels[key]}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyRejected}
              onChange={(e) => {
                setOnlyRejected(e.target.checked);
                setCurrentPage(1);
              }}
              className="h-3.5 w-3.5 accent-rose-600"
            />
            <span className={onlyRejected ? "text-rose-700" : ""}>Tampilkan hanya yang ditolak</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">Status:</span>
            {(["all", ...LEAD_STAGES] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "all" ? "Semua" : LEAD_STAGE_LABELS[st]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200" title="Rentang tanggal masuk">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-slate-700 focus:outline-hidden"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-slate-700 focus:outline-hidden"
              />
            </div>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {listError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{listError}</span>
        </div>
      )}

      {/* Tabel */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Calon Klien & Institusi</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Jadwal Presentasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Akses Demo</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Memuat data leads...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800">Belum ada permohonan demo ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Coba sesuaikan filter status, jenis institusi, tanggal, atau kata kunci pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const schedule = lead.confirmedDemoDate || lead.requestedDemoDate;
                  const isConfirmed = Boolean(lead.confirmedDemoDate);
                  const access = pickDisplayAccess(lead);
                  const isRejected = lead.approvalStatus === "REJECTED";

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-blue-50/20 transition-colors group cursor-pointer ${isLoading ? "opacity-60" : ""}`}
                      onClick={() => handleOpenDetail(lead)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {formatDateOnly(lead.createdAt)}
                        <span className="block text-[10px] text-slate-400">{formatTimeOnly(lead.createdAt)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{lead.jobTitle}</div>
                        <div className="text-[11px] font-medium text-slate-800 mt-0.5">{lead.institution}</div>
                        <span className="block text-[10px] text-slate-400">
                          {institutionLabels[lead.institutionType] || lead.institutionType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {schedule ? (
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                              isConfirmed
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-blue-50/80 text-blue-700 border-blue-200"
                            }`}
                            title={isConfirmed ? "Jadwal terkonfirmasi" : "Jadwal yang diajukan pemohon"}
                          >
                            <Calendar className="h-3 w-3" />
                            <span>{formatDateTime(schedule)}</span>
                            {isConfirmed && (
                              <span className="text-[9px] uppercase font-bold bg-emerald-200 text-emerald-900 px-1 rounded">
                                Fix
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <LeadStatusBadge status={lead.status} />
                          {isRejected && <RejectedIndicator compact />}
                          {lead.accessEnded && <AccessEndedIndicator compact />}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {access ? (
                          <div className="space-y-0.5">
                            <AccessStateBadge state={access.state} />
                            <div className="text-[10px] text-slate-500">{describeAccessTiming(access)}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Belum diberi akses</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(lead);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors shadow-2xs group-hover:border-blue-300 group-hover:text-blue-600"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalRows > 0 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-semibold text-slate-900">{rangeStart}</span>–
              <span className="font-semibold text-slate-900">{rangeEnd}</span> dari{" "}
              <span className="font-semibold text-slate-900">{totalRows}</span> • Halaman{" "}
              <span className="font-semibold text-slate-900">{currentPage}</span> dari{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                title="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                title="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================ DETAIL ============================ */}
      {selectedLead && blockers && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 font-display truncate">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500 truncate">
                    {selectedLead.jobTitle} • {selectedLead.institution}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isDetailLoading && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
                <LeadStatusBadge status={selectedLead.status} />
                {selectedLead.approvalStatus === "REJECTED" && <RejectedIndicator />}
                <button
                  onClick={handleCloseDetail}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Tutup"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {detailMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs ${
                    detailMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
                >
                  {detailMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  )}
                  <span>{detailMessage.text}</span>
                </div>
              )}

              {selectedLead.accessEnded && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <TriangleAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Akses berakhir — menunggu konfirmasi selesai.</strong> Masa akses demo sudah habis, tetapi
                    status lead tetap Jadwal Demo sampai admin menandai demo selesai.
                  </span>
                </div>
              )}

              {selectedLead.approvalStatus === "REJECTED" && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    <span>Permohonan ditolak</span>
                  </div>
                  <p className="text-rose-700">
                    Alasan: <em>&ldquo;{selectedLead.rejectionReason || "Tidak ada alasan tercatat."}&rdquo;</em>
                  </p>
                </div>
              )}

              {/* Data formulir */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Data Formulir Pemohon</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <InfoField label="Nama Lengkap" icon={User}>
                    <span className="text-sm">{selectedLead.name}</span>
                  </InfoField>
                  <InfoField label="Nama Institusi / RS" icon={Building2}>
                    <span className="text-sm">{selectedLead.institution}</span>
                  </InfoField>
                  <InfoField label="Jabatan" icon={Briefcase}>
                    {selectedLead.jobTitle || "-"}
                  </InfoField>
                  <InfoField label="Jenis Institusi">
                    {institutionLabels[selectedLead.institutionType] || selectedLead.institutionType}
                  </InfoField>
                  <InfoField label="Alamat Email" icon={Mail}>
                    <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline block truncate">
                      {selectedLead.email}
                    </a>
                  </InfoField>
                  <InfoField label="No. Telepon / WhatsApp" icon={Phone}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono">{selectedLead.phone}</span>
                      <a
                        href={buildWaUrl(selectedLead.phone, buildContactMessage(selectedLead))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-[10px] font-semibold text-white transition-colors"
                        title="Hubungi via WhatsApp (tidak mengubah status lead)"
                      >
                        <MessageSquare className="h-2.5 w-2.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </InfoField>
                  <InfoField label="Jadwal yang Diajukan Pemohon" icon={Calendar}>
                    {selectedLead.requestedDemoDate ? (
                      formatDateTimeLong(selectedLead.requestedDemoDate)
                    ) : (
                      <span className="text-slate-400 italic font-normal">Tidak menentukan tanggal khusus</span>
                    )}
                  </InfoField>
                  <InfoField label="Tanggal Form Masuk" icon={Clock}>
                    {formatDateTimeLong(selectedLead.createdAt)}
                  </InfoField>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Kebutuhan Khusus & Model Mesin Analyzer (Catatan)
                  </span>
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes ? selectedLead.notes : "Tidak ada catatan khusus yang disertakan pada formulir."}
                  </p>
                </div>
              </div>

              {/* Workflow */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-blue-600" />
                  <span>Alur Workflow</span>
                </h4>

                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    {
                      code: "CONTACTED" as LeadStatus,
                      at: selectedLead.createdAt,
                      hint: "Otomatis saat form tersimpan",
                    },
                    {
                      code: "SCHEDULED" as LeadStatus,
                      at: selectedLead.demoStartedAt,
                      hint: "Otomatis saat login demo pertama",
                    },
                    {
                      code: "COMPLETED" as LeadStatus,
                      at: selectedLead.demoCompletedAt,
                      hint: "Dikonfirmasi admin",
                    },
                  ].map((step, idx) => {
                    const reached = LEAD_STAGES.indexOf(selectedLead.status) >= idx;
                    return (
                      <li
                        key={step.code}
                        className={`p-3 rounded-xl border ${
                          reached ? "bg-blue-50/60 border-blue-200" : "bg-slate-50 border-slate-200 opacity-70"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          {reached ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span>
                            {idx + 1}. {LEAD_STAGE_LABELS[step.code]}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          {step.at ? formatDateTime(step.at) : "-"}
                        </div>
                        <div className="text-[10px] text-slate-400">{step.hint}</div>
                      </li>
                    );
                  })}
                </ol>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <InfoField label="Jadwal Presentasi Terkonfirmasi" icon={CalendarCheck}>
                    {selectedLead.confirmedDemoDate ? (
                      formatDateTimeLong(selectedLead.confirmedDemoDate)
                    ) : (
                      <span className="text-slate-400 italic font-normal">Belum dikonfirmasi</span>
                    )}
                  </InfoField>
                  <InfoField label="Akun Demo (USER)" icon={UserCheck}>
                    {selectedLead.user ? (
                      <span>
                        {selectedLead.user.email}{" "}
                        <span
                          className={`ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                            selectedLead.user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {selectedLead.user.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic font-normal">Belum dibuat (dibuat saat akses diberikan)</span>
                    )}
                  </InfoField>
                </div>

                {selectedLead.status === "COMPLETED" && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                    <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                      <ClipboardCheck className="h-4 w-4 text-emerald-600" />
                      <span>Demo dikonfirmasi selesai</span>
                    </div>
                    <p className="text-emerald-800">
                      {formatDateTimeLong(selectedLead.demoCompletedAt)}
                      {selectedLead.demoCompletedBy
                        ? ` oleh ${selectedLead.demoCompletedBy.name} (${selectedLead.demoCompletedBy.email})`
                        : ""}
                    </p>
                    <p className="text-emerald-800 whitespace-pre-wrap">
                      Catatan:{" "}
                      {selectedLead.demoCompletionNote ? (
                        selectedLead.demoCompletionNote
                      ) : (
                        <em className="text-emerald-700/80">tidak ada</em>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Akses demo */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-blue-600" />
                  <span>Akses Demo & Riwayat Periode</span>
                </h4>

                {(selectedLead.accesses ?? []).length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    Belum ada akses demo yang diberikan. Gunakan <strong>Beri Akses Demo</strong> untuk membuat akun
                    USER dan tautan login pertama.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {(selectedLead.accesses ?? []).map((a, idx) => (
                      <li
                        key={a.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          selectedLead.currentAccess?.id === a.id ? "border-blue-200 bg-blue-50/40" : "border-slate-200 bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              Periode #{(selectedLead.accesses ?? []).length - idx} • {a.durationDays} hari
                            </span>
                            {a.extendsAccessId && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Perpanjangan
                              </span>
                            )}
                          </div>
                          <AccessStateBadge state={a.state} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-slate-600">
                          <span>
                            Diberikan: {formatDateTime(a.grantedAt)}
                            {a.grantedBy ? ` oleh ${a.grantedBy.name}` : ""}
                          </span>
                          <span>Aktif sejak: {a.activatedAt ? formatDateTime(a.activatedAt) : "belum login"}</span>
                          <span>Berakhir: {a.expiresAt ? formatDateTime(a.expiresAt) : "-"}</span>
                          {a.revokedAt && <span className="text-rose-700">Dicabut: {formatDateTime(a.revokedAt)}</span>}
                        </div>
                        {a.latestLink && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/70 text-[11px] text-slate-600">
                            <LinkIcon className="h-3 w-3 text-slate-400" />
                            <span>Tautan terakhir:</span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                                magicLinkStateStyles[a.latestLink.state]
                              }`}
                            >
                              {magicLinkStateLabels[a.latestLink.state]}
                            </span>
                            <span>
                              {a.latestLink.usedAt
                                ? `dipakai ${formatDateTime(a.latestLink.usedAt)}`
                                : a.latestLink.revokedAt
                                ? `dicabut ${formatDateTime(a.latestLink.revokedAt)}`
                                : `berlaku s.d. ${formatDateTime(a.latestLink.expiresAt)}`}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-[10px] text-slate-400">
                  Tautan login hanya ditampilkan satu kali saat dibuat dan tidak disimpan. Gunakan Buat Tautan Baru
                  untuk mengirim ulang; tautan lama yang belum dipakai otomatis dicabut.
                </p>
              </div>

              {/* Aksi */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Aksi Admin</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACTION_ORDER.map((kind) => {
                    const cfg = ACTION_CONFIG[kind];
                    const Icon = cfg.icon;
                    const blocker = blockers[kind];
                    const disabled = Boolean(blocker) || isDetailLoading;
                    return (
                      <div key={kind} className={kind === "complete" ? "sm:col-span-2" : ""}>
                        <button
                          type="button"
                          onClick={() => openAction(kind)}
                          disabled={disabled}
                          title={blocker ?? cfg.label}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed ${cfg.buttonClass}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{cfg.label}</span>
                        </button>
                        {blocker && <p className="text-[10px] text-slate-400 mt-0.5 px-1">{blocker}</p>}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400">
                  Status lead tidak dapat diubah manual. Tombol WhatsApp hanya untuk menghubungi pemohon dan tidak
                  mengubah status apa pun.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={handleCloseDetail}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= DIALOG KONFIRMASI ======================= */}
      {selectedLead && activeAction && (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                {React.createElement(ACTION_CONFIG[activeAction].icon, { className: "h-4 w-4 text-blue-600" })}
                <span>{ACTION_CONFIG[activeAction].dialogTitle}</span>
              </h3>
              <button
                onClick={closeAction}
                disabled={isSubmitting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
                title="Batal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitAction();
              }}
            >
              <div className="p-5 space-y-3.5 text-xs text-slate-700">
                <p className="text-slate-500">
                  Lead: <strong className="text-slate-900">{selectedLead.name}</strong> • {selectedLead.institution}
                </p>

                {activeAction === "grant" && (
                  <>
                    <p className="leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-200/80">
                      Akun USER untuk <strong>{selectedLead.email}</strong> akan dibuat/ditautkan beserta satu periode
                      akses dan tautan login sekali pakai (24 jam). Masa akses dihitung sejak login pertama. Status lead
                      tidak berubah sampai pemohon login.
                    </p>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>Durasi akses demo</span>
                      </label>
                      <DurationPicker value={durationDays} onChange={setDurationDays} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>Jadwal presentasi terkonfirmasi (opsional, WIB)</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        onChange={(e) => setScheduleInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                      <p className="text-[10px] text-slate-400">Biarkan kosong bila jadwal belum dipastikan.</p>
                    </div>
                  </>
                )}

                {activeAction === "link" && (
                  <p className="leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                    Tautan login baru (sekali pakai, berlaku 24 jam) akan dibuat untuk periode akses yang masih berlaku.
                    Tautan lama yang belum dipakai akan <strong>dicabut</strong>.
                  </p>
                )}

                {activeAction === "extend" && (
                  <>
                    <p className="leading-relaxed bg-blue-50/70 p-3 rounded-xl border border-blue-200/80">
                      Perpanjangan membuat periode baru yang menyambung periode terakhir. Bila periode berjalan masih
                      aktif, periode baru dimulai saat periode tersebut berakhir. Bila sudah berakhir, periode baru
                      langsung aktif dan tautan login baru akan dibuat. Status lead tidak berubah.
                    </p>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Hourglass className="h-3.5 w-3.5 text-blue-600" />
                        <span>Durasi perpanjangan</span>
                      </label>
                      <DurationPicker value={durationDays} onChange={setDurationDays} />
                    </div>
                  </>
                )}

                {activeAction === "revoke" && (
                  <p className="leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                    Seluruh periode akses yang belum berakhir (termasuk perpanjangan terjadwal) dan tautan login yang
                    belum dipakai akan <strong>dicabut</strong>. Pemohon tidak dapat login lagi. Status lead tidak
                    berubah. Tindakan ini tidak dapat dibatalkan.
                  </p>
                )}

                {activeAction === "schedule" && (
                  <>
                    <p className="leading-relaxed text-slate-600">
                      Hanya mengubah jadwal presentasi terkonfirmasi. Status lead tidak berubah.
                    </p>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>Tanggal & jam presentasi (WIB)</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        disabled={clearSchedule}
                        onChange={(e) => setScheduleInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden disabled:opacity-50"
                      />
                    </div>
                    {selectedLead.confirmedDemoDate && (
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={clearSchedule}
                          onChange={(e) => setClearSchedule(e.target.checked)}
                          className="h-3.5 w-3.5 accent-rose-600"
                        />
                        <span>Kosongkan jadwal terkonfirmasi</span>
                      </label>
                    )}
                  </>
                )}

                {activeAction === "reject" && (
                  <>
                    <p className="leading-relaxed bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                      Permohonan akan ditandai <strong>ditolak</strong>. Akses yang belum diaktifkan beserta tautannya
                      akan dicabut. Status lead tetap Dihubungi.
                    </p>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800">Alasan penolakan (wajib)</label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Contoh: Bukan staf rumah sakit/lab resmi, atau data kontak tidak valid..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-slate-900 focus:outline-hidden focus:border-rose-500 resize-none"
                      />
                    </div>
                  </>
                )}

                {activeAction === "complete" && (
                  <>
                    <p className="leading-relaxed bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-emerald-900">
                      Konfirmasi bahwa demo telah dilaksanakan. Status lead berubah menjadi <strong>Selesai</strong> dan
                      tidak dapat dikembalikan; akses baru maupun perpanjangan tidak dapat diberikan lagi.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Login demo pertama</span>
                        <span className="font-semibold text-slate-900">{formatDateTime(selectedLead.demoStartedAt)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Jadwal presentasi</span>
                        <span className="font-semibold text-slate-900">{formatDateTime(selectedLead.confirmedDemoDate)}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-800">Catatan penyelesaian (opsional)</label>
                      <textarea
                        value={completionNote}
                        onChange={(e) => setCompletionNote(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Contoh: Presentasi dihadiri kepala lab, minat pada modul interfacing analyzer..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 focus:bg-white resize-none"
                      />
                      <p className="text-[10px] text-slate-400 text-right">{completionNote.length}/1000</p>
                    </div>
                  </>
                )}

                {dialogError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{dialogError}</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAction}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (activeAction === "reject" && rejectionReason.trim().length < 2)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5 ${ACTION_CONFIG[activeAction].confirmClass}`}
                >
                  {isSubmitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Memproses..." : ACTION_CONFIG[activeAction].confirmLabel}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL MAGIC LINK ======================= */}
      {magicLink && (
        <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-blue-600" />
                <span>Tautan Login Demo — {magicLink.title}</span>
              </h3>
              <button
                onClick={() => setMagicLink(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <TriangleAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Tautan ini <strong>hanya ditampilkan sekali</strong> dan tidak disimpan. Tautan berlaku{" "}
                  <strong>24 jam</strong>
                  {magicLink.expiresAt ? ` (hingga ${formatDateTime(magicLink.expiresAt)})` : ""} dan hanya dapat
                  dipakai <strong>satu kali</strong>. Salin atau kirim sekarang sebelum menutup jendela ini.
                </span>
              </div>

              <div className="text-slate-600">
                Untuk: <strong className="text-slate-900">{magicLink.lead.name}</strong> ({magicLink.lead.email})
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={linkInputRef}
                  type="text"
                  readOnly
                  value={magicLink.url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-mono text-slate-700"
                />
                <button
                  type="button"
                  onClick={handleCopyMagicLink}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? "Disalin!" : "Salin"}</span>
                </button>
              </div>

              <a
                href={buildWaUrl(magicLink.lead.phone, buildMagicLinkMessage(magicLink))}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Kirim via WhatsApp ({magicLink.lead.phone})</span>
              </a>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setMagicLink(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                Saya sudah menyalin / mengirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
