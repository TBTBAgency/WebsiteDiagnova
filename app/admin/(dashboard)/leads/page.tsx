"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  PhoneCall,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Ticket,
  Copy,
  Check,
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { DemoRequestRecord, InstitutionType, LeadApprovalStatus } from "@/types";
import { MetricCard } from "@/components/admin/MetricCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useAdminLang } from "@/components/admin/AdminLanguage";

interface LeadHistory {
  magicLinks: Array<{
    id: string;
    createdAt: string;
    expiresAt: string;
    usedAt: string | null;
    ipAddress: string | null;
  }>;
  events: Array<{
    id: string;
    action: string;
    actor: string;
    oldValue: any;
    newValue: any;
    createdAt: string;
  }>;
}

const historyActionLabels: Record<string, { id: string; en: string }> = {
  LEAD_CREATED: { id: "Permohonan diterima dari formulir", en: "Request received from form" },
  LEAD_APPROVED: { id: "Permohonan disetujui & Magic Link dibuat", en: "Request approved & Magic Link created" },
  MAGIC_LINK_REISSUED: { id: "Magic Link baru diterbitkan", en: "New Magic Link issued" },
  LEAD_REJECTED: { id: "Permohonan ditolak", en: "Request rejected" },
  MAGIC_LINK_CONSUMED: { id: "Klien masuk melalui Magic Link", en: "Client signed in via Magic Link" },
  MAGIC_LINK_FAILED: { id: "Percobaan Magic Link gagal", en: "Magic Link attempt failed" },
  DEMO_ACCESS_ACTIVATED: { id: "Akses demo diaktifkan", en: "Demo access activated" },
  DEMO_ACCESS_EXTENDED: { id: "Akses demo diperpanjang", en: "Demo access extended" },
  LEAD_STATUS_CHANGED: { id: "Status pipeline berubah", en: "Pipeline status changed" },
  LEAD_COMPLETED: { id: "Demo dikonfirmasi selesai", en: "Demo confirmed completed" },
};

const formatDateTime = (value: string | null | undefined, locale: string) =>
  value
    ? new Date(value).toLocaleString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

/** Interval pengecekan status Magic Link (detail terbuka / tabel). */
const MAGIC_LINK_POLL_MS = 5000;
const MAGIC_LINK_LIST_POLL_MS = 15000;

type MagicLinkState = "waiting" | "used" | "none";

/** Status tautan terakhir lead yang sudah disetujui (null bila belum/tidak disetujui). */
function magicLinkState(lead: DemoRequestRecord): MagicLinkState | null {
  if (lead.approvalStatus !== "APPROVED") return null;
  if (lead.magicLinkUsedAt) return "used";
  if (lead.magicLinkExpiry && new Date(lead.magicLinkExpiry) > new Date()) return "waiting";
  return "none";
}

interface LeadMetrics {
  total: number;
  new: number;
  contacted: number;
  scheduled: number;
  completed: number;
}

const statusBadgeStyles: Record<
  number,
  { label: { id: string; en: string }; bg: string; text: string; border: string; dot: string }
> = {
  1: {
    label: { id: "Baru", en: "New" },
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  2: {
    label: { id: "Dihubungi", en: "Contacted" },
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  3: {
    label: { id: "Jadwal Demo", en: "Demo Scheduled" },
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  4: {
    label: { id: "Selesai", en: "Completed" },
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const approvalBadgeStyles: Record<
  LeadApprovalStatus,
  { label: { id: string; en: string }; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: { id: "Menunggu Review", en: "Pending Review" },
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: { id: "Disetujui", en: "Approved" },
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: ShieldCheck,
  },
  REJECTED: {
    label: { id: "Ditolak", en: "Rejected" },
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: ShieldAlert,
  },
};

const institutionLabels: Record<string, { id: string; en: string }> = {
  hospital: { id: "Rumah Sakit", en: "Hospital" },
  "clinical-lab": { id: "Laboratorium Klinis", en: "Clinical Laboratory" },
  "pathology-center": { id: "Pusat Patologi", en: "Pathology Center" },
  "microbiology-center": { id: "Pusat Mikrobiologi", en: "Microbiology Center" },
  "blood-bank": { id: "Bank Darah", en: "Blood Bank" },
  other: { id: "Lainnya", en: "Other" },
};

export default function AdminLeadsPage() {
  const { t, locale } = useAdminLang();
  const fmtDateTime = (value?: string | null) => formatDateTime(value, locale);
  const institutionLabel = (type: string) => {
    const l = institutionLabels[type];
    return l ? t(l.id, l.en) : type;
  };
  const approvalLabel = (status: LeadApprovalStatus) => {
    const l = approvalBadgeStyles[status]?.label;
    return l ? t(l.id, l.en) : status;
  };
  const statusLabel = (st: number) => {
    const l = statusBadgeStyles[st].label;
    return t(l.id, l.en);
  };
  const [leads, setLeads] = useState<DemoRequestRecord[]>([]);
  const [metrics, setMetrics] = useState<LeadMetrics>({
    total: 0,
    new: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [approvalFilter, setApprovalFilter] = useState<LeadApprovalStatus | "all">("all");
  const [institutionFilter, setInstitutionFilter] = useState<InstitutionType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal & Action states
  const [selectedLead, setSelectedLead] = useState<DemoRequestRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Approval Process States
  const [approvalDuration, setApprovalDuration] = useState<number>(7);
  const [approvalConfirmedDate, setApprovalConfirmedDate] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [generatedMagicLink, setGeneratedMagicLink] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [extendDays, setExtendDays] = useState<number>(7);
  const [isExtending, setIsExtending] = useState(false);
  const [leadHistory, setLeadHistory] = useState<LeadHistory | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const fetchLeads = useCallback(async (opts?: { silent?: boolean }) => {
    // Refresh latar (pemantauan Magic Link) tidak menampilkan spinner tabel.
    if (!opts?.silent) setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", String(statusFilter));
      if (approvalFilter !== "all") params.set("approvalStatus", approvalFilter);
      if (institutionFilter !== "all") params.set("institutionType", institutionFilter);
      if (searchTerm.trim() !== "") params.set("search", searchTerm.trim());
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      params.set("page", currentPage.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setLeads(result.data.leads || []);
        setMetrics(
          result.data.metrics || {
            total: 0,
            new: 0,
            contacted: 0,
            scheduled: 0,
            completed: 0,
          }
        );
        setTotalPages(result.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, approvalFilter, institutionFilter, searchTerm, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const fetchHistory = useCallback(async (leadId: string) => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/history`);
      const json = await res.json();
      if (res.ok && json.success) setLeadHistory(json.data);
    } catch (err) {
      console.error("Error fetching lead history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /* Pemantauan Magic Link: admin langsung tahu saat klien masuk.      */
  /* Yang dicatat adalah saat klien menekan tombol masuk di halaman    */
  /* tautan (usedAt), bukan sekadar membuka URL — pratinjau tautan     */
  /* WhatsApp juga "membuka" URL dan akan memberi sinyal palsu.        */
  /* ---------------------------------------------------------------- */
  const waitingSelected = !!selectedLead && magicLinkState(selectedLead) === "waiting";
  const selectedLeadId = selectedLead?.id ?? null;
  const [lastLinkCheck, setLastLinkCheck] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedLeadId || !waitingSelected) return;
    let cancelled = false;
    const check = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`/api/admin/leads/${selectedLeadId}`, { cache: "no-store" });
        const json = await res.json().catch(() => null);
        if (cancelled || !res.ok || !json?.success || !json.data) return;
        const fresh = json.data as DemoRequestRecord;
        setLastLinkCheck(new Date());
        if (fresh.magicLinkUsedAt) {
          setSelectedLead((cur) => (cur && cur.id === fresh.id ? fresh : cur));
          setActionSuccessMessage(
            t(
              `${fresh.name} sudah masuk melalui Magic Link pada ${formatDateTime(fresh.magicLinkUsedAt, locale)}. Status otomatis menjadi Jadwal Demo dan masa aktif demo mulai berjalan.`,
              `${fresh.name} signed in via Magic Link on ${formatDateTime(fresh.magicLinkUsedAt, locale)}. Status automatically changed to Demo Scheduled and the demo access period has started.`
            )
          );
          fetchLeads({ silent: true });
          fetchHistory(fresh.id);
        }
      } catch {
        // Gagal sementara (jaringan): dicoba lagi pada interval berikutnya.
      }
    };
    check();
    const timer = setInterval(check, MAGIC_LINK_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [selectedLeadId, waitingSelected, fetchLeads, fetchHistory, t, locale]);

  // Tabel ikut diperbarui selama masih ada tautan yang menunggu dipakai.
  const anyWaitingInList = leads.some((l) => magicLinkState(l) === "waiting");
  useEffect(() => {
    if (!anyWaitingInList) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") fetchLeads({ silent: true });
    }, MAGIC_LINK_LIST_POLL_MS);
    return () => clearInterval(timer);
  }, [anyWaitingInList, fetchLeads]);

  const handleOpenDetail = (lead: DemoRequestRecord) => {
    setLastLinkCheck(null);
    setSelectedLead(lead);
    setLeadHistory(null);
    fetchHistory(lead.id);
    setExtendDays(7);

    const defaultDate = lead.confirmedDemoDate || lead.requestedDemoDate || lead.demoDate;
    setApprovalConfirmedDate(
      defaultDate
        ? new Date(new Date(defaultDate).getTime() - new Date(defaultDate).getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
        : ""
    );
    // Permohonan yang belum pernah disetujui memakai durasi standar 7 hari; yang sudah
    // disetujui memakai durasi terakhirnya (bila termasuk pilihan yang tersedia).
    const lastDuration = lead.demoDurationDays ?? 0;
    setApprovalDuration(lead.approvalStatus === "APPROVED" && [3, 7, 14, 30].includes(lastDuration) ? lastDuration : 7);
    setActionSuccessMessage("");
    setCopiedVoucher(false);
    setShowRejectForm(false);
    setRejectionReason("");
    setGeneratedMagicLink(lead.magicLinkUrl || "");
    setCopiedLink(false);
  };

  // Deep link dari dashboard: /admin/leads?lead=<id> langsung membuka detail permohonan.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("lead");
    if (!id) return;
    fetch(`/api/admin/leads/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json.data) handleOpenDetail(json.data as DemoRequestRecord);
      })
      .catch(() => {})
      .finally(() => {
        // Bersihkan parameter agar refresh tidak membuka detail lagi.
        const url = new URL(window.location.href);
        url.searchParams.delete("lead");
        window.history.replaceState(null, "", url.pathname + url.search);
      });
    // Hanya saat halaman pertama dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async () => {
    if (!selectedLead) return;
    setIsApproving(true);
    setActionSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmedDemoDate: approvalConfirmedDate ? new Date(approvalConfirmedDate).toISOString() : null,
          durationDays: approvalDuration,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSelectedLead(json.data.lead);
        setGeneratedMagicLink(json.data.magicLinkUrl);
        setActionSuccessMessage(json.message || t("Permohonan demo disetujui. Magic Link harus dibuka pertama kali dalam 24 jam.", "Demo request approved. The Magic Link must be opened for the first time within 24 hours."));
        fetchLeads();
        fetchHistory(selectedLead.id);
      } else {
        alert(json.message || t("Gagal menyetujui permohonan", "Failed to approve request"));
      }
    } catch (err) {
      console.error("Error approving lead:", err);
      alert(t("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !rejectionReason.trim()) return;
    setIsRejecting(true);
    setActionSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSelectedLead(json.data);
        setShowRejectForm(false);
        setActionSuccessMessage(json.message || t("Permohonan demo telah DITOLAK.", "Demo request has been REJECTED."));
        fetchLeads();
        fetchHistory(selectedLead.id);
      } else {
        alert(json.message || t("Gagal menolak permohonan", "Failed to reject request"));
      }
    } catch (err) {
      console.error("Error rejecting lead:", err);
      alert(t("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setIsRejecting(false);
    }
  };

  /** Transisi status manual yang diizinkan backend: Baru -> Dihubungi (data lama). */
  const handleTransitionStatus = async (targetStatus: number) => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    setActionSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setSelectedLead(data.data);
        setActionSuccessMessage(data.message);
        fetchLeads();
        fetchHistory(selectedLead.id);
      } else {
        alert(data.message || t("Gagal mengubah status", "Failed to change status"));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(t("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  /** Admin mengonfirmasi demo benar-benar selesai: Jadwal Demo -> Selesai. */
  const handleCompleteDemo = async () => {
    if (!selectedLead) return;
    if (!window.confirm(t("Konfirmasi bahwa sesi demo untuk permohonan ini benar-benar telah selesai?", "Confirm that the demo session for this request has actually been completed?"))) return;
    setIsUpdatingStatus(true);
    setActionSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/complete`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setSelectedLead(data.data);
        setActionSuccessMessage(data.message);
        fetchLeads();
        fetchHistory(selectedLead.id);
      } else {
        alert(data.message || t("Gagal mengonfirmasi demo selesai", "Failed to confirm demo completion"));
      }
    } catch (err) {
      console.error("Error completing demo:", err);
      alert(t("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  /** Memperpanjang masa aktif akses demo klien. */
  const handleExtendAccess = async () => {
    if (!selectedLead) return;
    setIsExtending(true);
    setActionSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: extendDays }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setSelectedLead(data.data.lead);
        setActionSuccessMessage(
          `${data.message} ${t("Berlaku hingga", "Valid until")} ${fmtDateTime(data.data.newExpiresAt)}.`
        );
        fetchLeads();
        fetchHistory(selectedLead.id);
      } else {
        alert(data.message || t("Gagal memperpanjang akses demo", "Failed to extend demo access"));
      }
    } catch (err) {
      console.error("Error extending access:", err);
      alert(t("Terjadi kesalahan jaringan.", "A network error occurred."));
    } finally {
      setIsExtending(false);
    }
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const handleCopyMagicLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatWaUrl = (lead: DemoRequestRecord, magicLinkUrl?: string) => {
    let clean = lead.phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);

    const targetDate = lead.confirmedDemoDate || lead.requestedDemoDate || lead.demoDate;
    let waktuText = "Menunggu konfirmasi kesesuaian jadwal Anda";
    if (targetDate) {
      try {
        waktuText =
          new Date(targetDate).toLocaleString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB";
      } catch {
        waktuText = String(targetDate);
      }
    }

    let message = `Halo ${lead.name} dari ${lead.institution},\n\n`;
    message += `Terima kasih telah mengajukan permohonan demo Diagnova LIS Platform.\n\n`;

    if (lead.approvalStatus === "APPROVED") {
      message += `🎉 *KABAR BAIK: Permohonan Akses Demo Anda Telah Disetujui!*\n\n`;
      message += `📋 *Rincian Jadwal & Akses Demo:*\n`;
      message += `📅 *Waktu Demo Resmi:* ${waktuText}\n`;
      message += `🏢 *Institusi:* ${lead.institution} (${institutionLabels[lead.institutionType]?.id || lead.institutionType})\n`;
      message += `👤 *Nama Pemohon:* ${lead.name} (${lead.jobTitle})\n`;
      message += `⏳ *Masa Aktif Akun:* ${lead.demoDurationDays || 7} Hari (sejak tautan pertama dibuka)\n\n`;

      const activeLink = magicLinkUrl || generatedMagicLink;
      if (activeLink) {
        message += `🔗 *Tautan Masuk Langsung (Magic Link Tanpa Password):*\n`;
        message += `${activeLink}\n\n`;
        message += `_Catatan: Buka tautan pertama kali dalam 24 jam. Setelah itu, tautan yang sama dapat dipakai untuk masuk kembali selama masa aktif akun._\n\n`;
      }
    } else {
      message += `Saya dari tim spesialis Diagnova ingin mengonfirmasi jadwal presentasi demo teknis Anda.\n\n`;
      message += `📋 *Rincian Jadwal Pengajuan:*\n`;
      message += `📅 *Waktu yang Diajukan:* ${waktuText}\n`;
      message += `🏢 *Institusi:* ${lead.institution} (${institutionLabels[lead.institutionType]?.id || lead.institutionType})\n`;
      message += `👤 *Nama Pemohon:* ${lead.name} (${lead.jobTitle})\n`;
      message += `📞 *Kontak:* ${lead.phone}\n\n`;
    }

    message += `🔬 *Agenda Presentasi & Sesi Interaktif LIS:*\n`;
    message += `1. Penjelasan Alur Pre-Analitik (Barcode & Penerimaan Spesimen)\n`;
    message += `2. Interfacing & Konektivitas Analyzer Otomatis (ASTM/HL7)\n`;
    message += `3. Verifikasi & Validasi Hasil Laboratorium (Post-Analitik)\n`;
    message += `4. Tanya Jawab Kebutuhan Teknis Laboratorium & Penawaran\n\n`;
    message += `Mohon konfirmasi jika waktu tersebut sudah sesuai dengan agenda tim laboratorium Anda. Terima kasih!\n\n`;
    message += `Salam hangat,\n*Tim Spesialis Diagnova LIS*\nhttps://diagnova.id`;

    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setApprovalFilter("all");
    setInstitutionFilter("all");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
              {t("Permohonan Demo (Leads CRM)", "Demo Requests (Leads CRM)")}
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              {t("LIS Pipeline", "LIS Pipeline")}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              "Kelola calon klien laboratorium, review & persetujuan akses demo, dan terbitkan Magic Link login.",
              "Manage laboratory prospects, review & approve demo access, and issue Magic Link logins."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchLeads()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs disabled:opacity-50"
            title={t("Muat ulang data", "Reload data")}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>{t("Refresh", "Refresh")}</span>
          </button>

          <a
            href="/api/admin/leads/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-white" />
            <span>{t("Ekspor CSV", "Export CSV")}</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Row (Baru, Dihubungi, Jadwal Demo, Selesai) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title={t("Total Masuk", "Total Received")}
          value={metrics.total}
          subtitle={t("Seluruh lead tercatat", "All recorded leads")}
          icon={Users}
          iconBg="bg-slate-100"
          iconColor="text-slate-700"
        />
        <MetricCard
          title={t("Baru", "New")}
          value={metrics.new}
          subtitle={t("Perlu segera dihubungi", "Needs follow-up soon")}
          icon={AlertCircle}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
          badge={{ text: t("Tahap 1", "Stage 1"), variant: "default" }}
        />
        <MetricCard
          title={t("Dihubungi", "Contacted")}
          value={metrics.contacted}
          subtitle={t("Sedang komunikasi", "In communication")}
          icon={PhoneCall}
          iconBg="bg-amber-50"
          iconColor="text-[#E5A23B]"
          badge={{ text: t("Tahap 2", "Stage 2"), variant: "warning" }}
        />
        <MetricCard
          title={t("Jadwal Demo", "Demo Scheduled")}
          value={metrics.scheduled}
          subtitle={t("Voucher demo aktif", "Active demo voucher")}
          icon={CalendarCheck}
          iconBg="bg-[#EEF4FF]"
          iconColor="text-[#1B6FF2]"
          badge={{ text: t("Tahap 3", "Stage 3"), variant: "purple" }}
        />
        <MetricCard
          title={t("Selesai", "Completed")}
          value={metrics.completed}
          subtitle={t("Telah didemokan", "Demo delivered")}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{ text: t("Tahap 4", "Stage 4"), variant: "success" }}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Term */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("Cari nama, rumah sakit, email, atau no. telepon...", "Search name, hospital, email, or phone number...")}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Status Approval Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">{t("Approval:", "Approval:")}</span>
            <button
              onClick={() => {
                setApprovalFilter("all");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                approvalFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("Semua", "All")}
            </button>
            {(["PENDING", "APPROVED", "REJECTED"] as const).map((ap) => (
              <button
                key={ap}
                onClick={() => {
                  setApprovalFilter(ap);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  approvalFilter === ap
                    ? `${approvalBadgeStyles[ap].bg} ${approvalBadgeStyles[ap].text} border ${approvalBadgeStyles[ap].border} font-bold shadow-xs`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{approvalLabel(ap)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Baris Kedua Filter: Status CRM, Tipe Institusi & Rentang Tanggal */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status CRM Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">{t("Status CRM:", "CRM Status:")}</span>
            <button
              onClick={() => {
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("Semua", "All")}
            </button>
            {([1, 2, 3, 4] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {statusLabel(st)}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={startDate}
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
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-slate-700 focus:outline-hidden"
              />
            </div>

            {(startDate || endDate || statusFilter !== "all" || approvalFilter !== "all" || searchTerm) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition-colors"
              >
                {t("Reset Filter", "Reset Filters")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t("Tanggal Masuk", "Date Received")}</th>
                <th className="py-3 px-4">{t("Calon Klien", "Prospect")}</th>
                <th className="py-3 px-4">{t("Institusi / Lab", "Institution / Lab")}</th>
                <th className="py-3 px-4">{t("Kontak", "Contact")}</th>
                <th className="py-3 px-4">{t("Jadwal Demo", "Demo Schedule")}</th>
                <th className="py-3 px-4">{t("Status CRM", "CRM Status")}</th>
                <th className="py-3 px-4">{t("Approval Demo", "Demo Approval")}</th>
                <th className="py-3 px-4 text-right">{t("Aksi", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>{t("Memuat data leads...", "Loading leads...")}</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800">{t("Belum ada permohonan demo ditemukan", "No demo requests found")}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t(
                        "Coba sesuaikan filter status, approval, atau kata kunci pencarian.",
                        "Try adjusting the status or approval filters, or the search keywords."
                      )}
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const targetSchedule = lead.confirmedDemoDate || lead.requestedDemoDate || lead.demoDate;
                  const isConfirmed = Boolean(lead.confirmedDemoDate);
                  const apStyle = approvalBadgeStyles[lead.approvalStatus] || approvalBadgeStyles.PENDING;
                  const ApIcon = apStyle.icon;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-blue-50/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(lead)}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleTimeString(locale, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{lead.jobTitle}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {lead.institution}
                        <span className="block text-[10px] text-slate-400">
                          {institutionLabel(lead.institutionType)}
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
                        {targetSchedule ? (
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                              isConfirmed
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-blue-50/80 text-blue-700 border-blue-200"
                            }`}
                          >
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(targetSchedule).toLocaleDateString(locale, {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              •{" "}
                              {new Date(targetSchedule).toLocaleTimeString(locale, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isConfirmed && (
                              <span className="text-[9px] uppercase font-bold bg-emerald-200 text-emerald-900 px-1 rounded">
                                {t("Fix", "Fixed")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type={lead.status} />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${apStyle.bg} ${apStyle.text} ${apStyle.border}`}
                        >
                          <ApIcon className="h-3 w-3" />
                          <span>{t(apStyle.label.id, apStyle.label.en)}</span>
                        </span>
                        {magicLinkState(lead) === "waiting" && (
                          <span data-testid={`lead-link-${lead.id}`} data-state="waiting" className="mt-1 flex items-center gap-1 text-[10px] font-medium text-amber-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                            {t("Link belum dipakai", "Link not used yet")}
                          </span>
                        )}
                        {magicLinkState(lead) === "used" && (
                          <span data-testid={`lead-link-${lead.id}`} data-state="used" className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                            <Check className="h-3 w-3" />
                            {t("Sudah masuk", "Signed in")} {fmtDateTime(lead.magicLinkUsedAt)}
                          </span>
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
                          <span>{t("Detail", "Details")}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              {t("Halaman", "Page")} <span className="font-semibold text-slate-900">{currentPage}</span> {t("dari", "of")}{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {selectedLead.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedLead.jobTitle} • {selectedLead.institution}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    approvalBadgeStyles[selectedLead.approvalStatus]?.bg || "bg-slate-100"
                  } ${approvalBadgeStyles[selectedLead.approvalStatus]?.text || "text-slate-700"} ${
                    approvalBadgeStyles[selectedLead.approvalStatus]?.border || "border-slate-200"
                  }`}
                >
                  <span>{approvalLabel(selectedLead.approvalStatus)}</span>
                </span>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title={t("Tutup", "Close")}
                  aria-label={t("Tutup", "Close")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {actionSuccessMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* SECTION 1: SELURUH INFORMASI FORMULIR PEMOHON */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>{t("Seluruh Informasi Formulir Pemohon", "Full Applicant Form Details")}</span>
                  </h4>
                  <StatusBadge type={selectedLead.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Nama Lengkap */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{t("Nama Lengkap", "Full Name")}</span>
                    </span>
                    <p className="font-semibold text-slate-900 text-sm">{selectedLead.name}</p>
                  </div>

                  {/* Nama Institusi / Rumah Sakit */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{t("Nama Institusi / RS", "Institution / Hospital Name")}</span>
                    </span>
                    <p className="font-semibold text-slate-900 text-sm">{selectedLead.institution}</p>
                  </div>

                  {/* Jabatan */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{t("Jabatan", "Job Title")}</span>
                    </span>
                    <p className="font-semibold text-slate-900">{selectedLead.jobTitle}</p>
                  </div>

                  {/* Jenis Institusi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{t("Jenis Institusi", "Institution Type")}</span>
                    <p className="font-semibold text-slate-900">
                      {institutionLabel(selectedLead.institutionType)}
                    </p>
                  </div>

                  {/* Email Resmi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>{t("Alamat Email", "Email Address")}</span>
                    </span>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="font-semibold text-blue-600 hover:underline block truncate"
                    >
                      {selectedLead.email}
                    </a>
                  </div>

                  {/* Nomor Telepon / WA */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{t("No. Telepon / WhatsApp", "Phone / WhatsApp")}</span>
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 font-mono">{selectedLead.phone}</span>
                      <a
                        href={formatWaUrl(selectedLead, generatedMagicLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-[10px] font-semibold text-white transition-colors"
                      >
                        <MessageSquare className="h-2.5 w-2.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Waktu yang Diajukan Pemohon */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-blue-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{t("Jadwal yang Diajukan Calon Klien", "Schedule Requested by Prospect")}</span>
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm">
                        {selectedLead.requestedDemoDate || selectedLead.demoDate ? (
                          new Date(selectedLead.requestedDemoDate || selectedLead.demoDate!).toLocaleString(locale, {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) + " WIB"
                        ) : (
                          <span className="text-slate-400 italic font-normal text-xs">
                            {t("Tidak menentukan tanggal khusus saat mengisi form", "No specific date chosen when filling in the form")}
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                        {t("Preferensi Pemohon", "Applicant Preference")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kebutuhan Khusus / Notes */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    {t("Kebutuhan Khusus & Model Mesin Analyzer (Notes):", "Special Requirements & Analyzer Models (Notes):")}
                  </span>
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes
                      ? selectedLead.notes
                      : t("Tidak ada catatan khusus yang disertakan pada formulir.", "No special notes were included in the form.")}
                  </p>
                </div>
              </div>

              {/* SECTION 2: PANEL APPROVAL & PEMBERIAN AKSES DEMO */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {t("Status & Manajemen Approval Akses Demo", "Demo Access Approval Status & Management")}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      approvalBadgeStyles[selectedLead.approvalStatus]?.bg
                    } ${approvalBadgeStyles[selectedLead.approvalStatus]?.text} ${
                      approvalBadgeStyles[selectedLead.approvalStatus]?.border
                    }`}
                  >
                    {approvalLabel(selectedLead.approvalStatus)}
                  </span>
                </div>

                {/* KONDISI 1: PENDING (BELUM APPROVE) */}
                {selectedLead.approvalStatus === "PENDING" && (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                      {t(
                        "Permohonan ini menunggu verifikasi admin. Menyetujui permohonan akan mengaktifkan akun demo dan menghasilkan ",
                        "This request is awaiting admin verification. Approving it activates the demo account and generates a "
                      )}
                      <strong>Magic Link (passwordless login)</strong>
                      {t(
                        " untuk calon klien (dibuka pertama kali dalam 24 jam, lalu dapat dipakai masuk kembali selama masa aktif).",
                        " for the prospect (must be opened for the first time within 24 hours, then can be used to sign in again during the active period)."
                      )}
                    </p>

                    {/* Konfirmasi Jadwal Resmi */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>{t("Konfirmasi Tanggal & Jam Demo Resmi:", "Confirm Official Demo Date & Time:")}</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={approvalConfirmedDate}
                        onChange={(e) => setApprovalConfirmedDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    {/* Pilihan Masa Aktif Akun Demo */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-600" />
                        <span>{t("Batas Masa Aktif Demo (sejak akun pertama dibuka):", "Demo Access Period (from first sign-in):")}</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { days: 3, label: t("3 Hari", "3 Days") },
                          { days: 7, label: t("7 Hari (Standard)", "7 Days (Standard)") },
                          { days: 14, label: t("14 Hari", "14 Days") },
                          { days: 30, label: t("1 Bulan", "1 Month") },
                        ].map((opt) => (
                          <button
                            key={opt.days}
                            type="button"
                            data-testid={`approval-duration-${opt.days}`}
                            onClick={() => setApprovalDuration(opt.days)}
                            className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                              approvalDuration === opt.days
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tombol Keputusan: Setujui atau Tolak */}
                    {!showRejectForm ? (
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleApprove}
                          disabled={isApproving}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                        >
                          <ShieldCheck className="h-4 w-4" />
                          <span>
                            {isApproving
                              ? t("Memproses Approval...", "Processing Approval...")
                              : t("Setujui Permohonan & Buat Magic Link", "Approve Request & Create Magic Link")}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRejectForm(true)}
                          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          {t("Tolak Permohonan", "Reject Request")}
                        </button>
                      </div>
                    ) : (
                      /* Form Alasan Penolakan */
                      <form onSubmit={handleReject} className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
                        <span className="text-xs font-bold text-rose-800 block">{t("Alasan Penolakan Permohonan:", "Reason for Rejection:")}</span>
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder={t(
                            "Contoh: Bukan staf rumah sakit/lab resmi, atau kuota demo penuh...",
                            "Example: Not official hospital/lab staff, or demo quota is full..."
                          )}
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowRejectForm(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            {t("Batal", "Cancel")}
                          </button>
                          <button
                            type="submit"
                            disabled={isRejecting || !rejectionReason.trim()}
                            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50"
                          >
                            {isRejecting ? t("Menolak...", "Rejecting...") : t("Konfirmasi Tolak", "Confirm Rejection")}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* KONDISI 2: APPROVED (SUDAH DISETUJUI) */}
                {selectedLead.approvalStatus === "APPROVED" && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between font-semibold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>{t("Permohonan Telah Disetujui", "Request Approved")}</span>
                        </span>
                        {selectedLead.approvedAt && (
                          <span className="text-[10px] text-emerald-700 font-normal">
                            {t("Disetujui:", "Approved:")} {new Date(selectedLead.approvedAt).toLocaleDateString(locale)}{" "}
                            {t("oleh", "by")} {selectedLead.approvedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        {t("Jadwal resmi:", "Official schedule:")}{" "}
                        <strong className="font-semibold">
                          {selectedLead.confirmedDemoDate
                            ? new Date(selectedLead.confirmedDemoDate).toLocaleString(locale, {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }) + " WIB"
                            : t("Menunggu konfirmasi", "Awaiting confirmation")}
                        </strong>{" "}
                        • {t("Durasi akses demo:", "Demo access duration:")}{" "}
                        <strong>
                          {selectedLead.demoDurationDays || 7} {t("Hari", "Days")}
                        </strong>
                      </p>
                    </div>

                    {/* Kartu Tautan Magic Link */}
                    {(
                      <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
                            <span>{t("Tautan Akses Langsung (Magic Link)", "Direct Access Link (Magic Link)")}</span>
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            {t("Buka pertama ≤ 24 jam", "First open ≤ 24 hours")}
                          </span>
                        </div>

                        {/* Status tautan, diperbarui otomatis saat klien masuk */}
                        {magicLinkState(selectedLead) === "used" ? (
                          <div
                            data-testid="magic-link-status"
                            data-state="used"
                            className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] text-emerald-900"
                          >
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            <span>
                              <strong className="font-semibold">{t("Klien sudah masuk", "Client has signed in")}</strong>{" "}
                              {t("melalui tautan pada", "via the link on")} {fmtDateTime(selectedLead.magicLinkUsedAt)}
                              {t(
                                ". Tautan yang sama tetap bisa dipakai klien untuk masuk kembali selama masa aktif demo.",
                                ". The client can keep using the same link to sign in again during the demo period."
                              )}
                            </span>
                          </div>
                        ) : magicLinkState(selectedLead) === "waiting" ? (
                          <div
                            data-testid="magic-link-status"
                            data-state="waiting"
                            className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-900"
                          >
                            <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                            </span>
                            <span>
                              <strong className="font-semibold">{t("Menunggu klien masuk", "Waiting for client to sign in")}</strong>{" "}
                              {t("— tautan belum dipakai dan berlaku hingga", "— the link has not been used yet and is valid until")}{" "}
                              {fmtDateTime(selectedLead.magicLinkExpiry)}
                              {t(". Halaman ini memeriksa otomatis setiap", ". This page checks automatically every")}{" "}
                              {MAGIC_LINK_POLL_MS / 1000}{" "}
                              {t("detik dan langsung berubah saat klien masuk", "seconds and updates as soon as the client signs in")}
                              {lastLinkCheck
                                ? ` (${t("dicek", "checked")} ${lastLinkCheck.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" })})`
                                : ""}
                              .
                            </span>
                          </div>
                        ) : (
                          <div
                            data-testid="magic-link-status"
                            data-state="none"
                            className="rounded-xl border border-slate-200 bg-white p-2.5 text-[11px] text-slate-600"
                          >
                            {t(
                              "Tidak ada tautan aktif. Buat tautan baru untuk dikirim ke klien.",
                              "No active link. Create a new link to send to the client."
                            )}
                          </div>
                        )}
                        {!generatedMagicLink && magicLinkState(selectedLead) === "waiting" && (
                          <p className="text-[11px] text-blue-900/80 leading-relaxed">
                            {t(
                              "Demi keamanan, tautan hanya ditampilkan sekali saat dibuat — buat tautan baru bila perlu dikirim ulang.",
                              "For security, the link is only shown once when created — create a new link if it needs to be resent."
                            )}
                          </p>
                        )}

                        {generatedMagicLink && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={generatedMagicLink}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-mono text-slate-700 select-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyMagicLink(generatedMagicLink)}
                            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                          >
                            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedLink ? t("Disalin!", "Copied!") : t("Salin Link", "Copy Link")}</span>
                          </button>
                        </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          {generatedMagicLink && (
                          <a
                            href={formatWaUrl(selectedLead, generatedMagicLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{t("Kirim Magic Link & Rincian via WhatsApp", "Send Magic Link & Details via WhatsApp")}</span>
                          </a>
                          )}
                          <button
                            type="button"
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                            title={t(
                              "Buat tautan baru. Tautan lama yang belum terpakai otomatis dinonaktifkan.",
                              "Create a new link. Older unused links are automatically deactivated."
                            )}
                          >
                            <span>{isApproving ? t("Membuat Tautan...", "Creating Link...") : t("Buat Tautan Baru", "Create New Link")}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Masa aktif & perpanjangan akses demo */}
                    <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          <span>{t("Masa Aktif Akses Demo", "Demo Access Period")}</span>
                        </span>
                        {selectedLead.user?.demoExpiresAt && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              new Date(selectedLead.user.demoExpiresAt) > new Date()
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {new Date(selectedLead.user.demoExpiresAt) > new Date() ? t("Aktif", "Active") : t("Kedaluwarsa", "Expired")}
                          </span>
                        )}
                      </div>
                      {selectedLead.user?.demoActivatedAt && selectedLead.user?.demoExpiresAt ? (
                        <>
                          <p className="text-[11px] text-slate-600">
                            {t("Diaktifkan", "Activated")} {fmtDateTime(selectedLead.user.demoActivatedAt)} •{" "}
                            {t("Berlaku hingga", "Valid until")} <strong>{fmtDateTime(selectedLead.user.demoExpiresAt)}</strong>
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <select
                              value={extendDays}
                              onChange={(e) => setExtendDays(parseInt(e.target.value, 10))}
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                              aria-label={t("Durasi perpanjangan", "Extension duration")}
                            >
                              {[3, 7, 14, 30].map((d) => (
                                <option key={d} value={d}>
                                  {t(`Perpanjang ${d} hari`, `Extend by ${d} days`)}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={handleExtendAccess}
                              disabled={isExtending}
                              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              {isExtending ? t("Memproses...", "Processing...") : t("Perpanjang Akses", "Extend Access")}
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {t(
                              "Kedaluwarsa akses tidak mengubah status pipeline. Setiap perpanjangan tercatat di riwayat.",
                              "Access expiry does not change the pipeline status. Every extension is recorded in the history."
                            )}
                          </p>
                        </>
                      ) : (
                        <p className="text-[11px] text-slate-500">
                          {t(
                            `Belum aktif — masa aktif ${selectedLead.demoDurationDays || 7} hari dihitung sejak klien pertama kali masuk melalui Magic Link.`,
                            `Not active yet — the ${selectedLead.demoDurationDays || 7}-day access period starts when the client first signs in via the Magic Link.`
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* KONDISI 3: REJECTED (DITOLAK) */}
                {selectedLead.approvalStatus === "REJECTED" && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>{t("Permohonan Akses Telah Ditolak", "Access Request Rejected")}</span>
                    </div>
                    <p className="text-rose-700">
                      {t("Alasan:", "Reason:")}{" "}
                      <em>
                        &ldquo;
                        {selectedLead.rejectionReason ||
                          t("Tidak memenuhi syarat akses demo.", "Does not meet demo access requirements.")}
                        &rdquo;
                      </em>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        // Membuka opsi untuk review ulang dan menyetujui
                        setSelectedLead((prev) => (prev ? { ...prev, approvalStatus: "PENDING" } : null));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 text-[11px] font-semibold transition-colors"
                    >
                      {t("Buka Kembali & Tinjau Ulang Permohonan", "Reopen & Review Request Again")}
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 3: STATUS PIPELINE (DIKENDALIKAN ALUR BISNIS) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>{t("Status Pipeline", "Pipeline Status")}</span>
                </h4>

                <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as const).map((st) => (
                    <li
                      key={st}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center ${
                        selectedLead.status === st
                          ? `${statusBadgeStyles[st].bg} ${statusBadgeStyles[st].border} ${statusBadgeStyles[st].text} ring-2 ring-blue-500/30`
                          : selectedLead.status > st
                          ? "bg-white border-slate-200 text-slate-400 line-through"
                          : "bg-white border-slate-200 text-slate-500"
                      }`}
                    >
                      {statusLabel(st)}
                    </li>
                  ))}
                </ol>

                {selectedLead.status === 1 && (
                  <button
                    type="button"
                    onClick={() => handleTransitionStatus(2)}
                    disabled={isUpdatingStatus}
                    className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {isUpdatingStatus ? t("Menyimpan...", "Saving...") : t("Tandai Dihubungi (data lama)", "Mark as Contacted (legacy data)")}
                  </button>
                )}
                {selectedLead.status === 2 && (
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {t("Status akan berubah otomatis menjadi", "Status will automatically change to")}{" "}
                    <strong>{t("Jadwal Demo", "Demo Scheduled")}</strong>{" "}
                    {t(
                      "setelah klien berhasil masuk pertama kali melalui Magic Link.",
                      "once the client signs in for the first time via the Magic Link."
                    )}
                  </p>
                )}
                {selectedLead.status === 3 && (
                  <button
                    type="button"
                    onClick={handleCompleteDemo}
                    disabled={isUpdatingStatus}
                    className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isUpdatingStatus ? t("Menyimpan...", "Saving...") : t("Konfirmasi Demo Selesai", "Confirm Demo Completed")}</span>
                  </button>
                )}
                {selectedLead.status === 4 && (
                  <p className="text-[11px] text-emerald-700 font-semibold">{t("Demo telah dikonfirmasi selesai.", "Demo has been confirmed as completed.")}</p>
                )}
              </div>

              {/* SECTION 4: RIWAYAT AKSES & AKTIVITAS */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>{t("Riwayat Akses & Aktivitas", "Access & Activity History")}</span>
                </h4>
                {isHistoryLoading && !leadHistory ? (
                  <p className="text-[11px] text-slate-400">{t("Memuat riwayat...", "Loading history...")}</p>
                ) : !leadHistory || (leadHistory.events.length === 0 && leadHistory.magicLinks.length === 0) ? (
                  <p className="text-[11px] text-slate-400">{t("Belum ada riwayat tercatat.", "No history recorded yet.")}</p>
                ) : (
                  <div className="space-y-3">
                    {leadHistory.magicLinks.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Magic Link ({leadHistory.magicLinks.length})
                        </span>
                        <ul className="space-y-1">
                          {leadHistory.magicLinks.map((m) => (
                            <li key={m.id} className="text-[11px] text-slate-600 flex flex-wrap gap-x-2">
                              <span>{t("Dibuat", "Created")} {fmtDateTime(m.createdAt)}</span>
                              <span>•</span>
                              {m.usedAt ? (
                                <span className="text-emerald-700">
                                  {t("Digunakan", "Used")} {fmtDateTime(m.usedAt)}
                                  {m.ipAddress ? ` (IP ${m.ipAddress})` : ""}
                                </span>
                              ) : new Date(m.expiresAt) > new Date() ? (
                                <span className="text-blue-700">{t("Aktif s/d", "Active until")} {fmtDateTime(m.expiresAt)}</span>
                              ) : (
                                <span className="text-slate-400">{t("Tidak berlaku sejak", "Expired since")} {fmtDateTime(m.expiresAt)}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {leadHistory.events.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {t("Aktivitas", "Activity")}
                        </span>
                        <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {leadHistory.events.map((ev) => (
                            <li key={ev.id} className="text-[11px] text-slate-600 border-l-2 border-slate-200 pl-2">
                              <div className="font-semibold text-slate-800">
                                {historyActionLabels[ev.action]
                                  ? t(historyActionLabels[ev.action].id, historyActionLabels[ev.action].en)
                                  : ev.action}
                                {ev.newValue?.status && statusBadgeStyles[ev.newValue.status]
                                  ? ` → ${statusLabel(ev.newValue.status)}`
                                  : ""}
                                {ev.action === "DEMO_ACCESS_EXTENDED" && ev.newValue?.extendedByDays
                                  ? ` (+${ev.newValue.extendedByDays} ${t("hari", "days")})`
                                  : ""}
                              </div>
                              <div className="text-slate-400">
                                {fmtDateTime(ev.createdAt)} • {ev.actor}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                {t("Tutup", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
