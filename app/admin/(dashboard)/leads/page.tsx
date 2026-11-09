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

interface LeadMetrics {
  total: number;
  new: number;
  contacted: number;
  scheduled: number;
  completed: number;
}

const statusBadgeStyles: Record<
  number,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  1: {
    label: "Baru",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  2: {
    label: "Dihubungi",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  3: {
    label: "Jadwal Demo",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  4: {
    label: "Selesai",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
};

const approvalBadgeStyles: Record<
  LeadApprovalStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    label: "Menunggu Review",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Disetujui",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: ShieldCheck,
  },
  REJECTED: {
    label: "Ditolak",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: ShieldAlert,
  },
};

const institutionLabels: Record<string, string> = {
  hospital: "Rumah Sakit",
  "clinical-lab": "Laboratorium Klinis",
  "pathology-center": "Pusat Patologi",
  "microbiology-center": "Pusat Mikrobiologi",
  "blood-bank": "Bank Darah",
  other: "Lainnya",
};

export default function AdminLeadsPage() {
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
  const [modalStatus, setModalStatus] = useState<number>(1);
  const [voucherDurationDays, setVoucherDurationDays] = useState<number>(3);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [modalDemoDate, setModalDemoDate] = useState("");

  // Approval Process States
  const [approvalDuration, setApprovalDuration] = useState<number>(7);
  const [approvalConfirmedDate, setApprovalConfirmedDate] = useState<string>("");
  const [isApproving, setIsApproving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [generatedMagicLink, setGeneratedMagicLink] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
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

  const handleOpenDetail = (lead: DemoRequestRecord) => {
    setSelectedLead(lead);
    setModalStatus(lead.status);

    const defaultDate = lead.confirmedDemoDate || lead.requestedDemoDate || lead.demoDate;
    setModalDemoDate(
      defaultDate
        ? new Date(new Date(defaultDate).getTime() - new Date(defaultDate).getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
        : ""
    );
    setApprovalConfirmedDate(
      defaultDate
        ? new Date(new Date(defaultDate).getTime() - new Date(defaultDate).getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
        : ""
    );
    setApprovalDuration(lead.demoDurationDays || 7);
    setVoucherDurationDays(lead.demoDurationDays || 3);
    setActionSuccessMessage("");
    setCopiedVoucher(false);
    setShowRejectForm(false);
    setRejectionReason("");
    setGeneratedMagicLink(lead.magicLinkUrl || "");
    setCopiedLink(false);
  };

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
        setActionSuccessMessage(
          `Permohonan demo berhasil DISETUJUI. Tautan Magic Link akses aktif selama 24 jam.`
        );
        fetchLeads();
      } else {
        alert(json.message || "Gagal menyetujui permohonan");
      }
    } catch (err) {
      console.error("Error approving lead:", err);
      alert("Terjadi kesalahan jaringan.");
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
        setActionSuccessMessage("Permohonan demo telah DITOLAK.");
        fetchLeads();
      } else {
        alert(json.message || "Gagal menolak permohonan");
      }
    } catch (err) {
      console.error("Error rejecting lead:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modalStatus,
          voucherDays: voucherDurationDays,
          demoDate: modalDemoDate ? new Date(modalDemoDate).toISOString() : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setSelectedLead(data.data);
        const statusLabel = statusBadgeStyles[modalStatus]?.label || `Status ${modalStatus}`;
        setActionSuccessMessage(`Status CRM sales berhasil diubah menjadi ${statusLabel}.`);
        fetchLeads();
      } else {
        alert(data.message || "Gagal mengubah status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsUpdatingStatus(false);
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
      message += `🏢 *Institusi:* ${lead.institution} (${institutionLabels[lead.institutionType] || lead.institutionType})\n`;
      message += `👤 *Nama Pemohon:* ${lead.name} (${lead.jobTitle})\n`;
      message += `⏳ *Masa Aktif Akun:* ${lead.demoDurationDays || 7} Hari (sejak tautan pertama dibuka)\n\n`;

      const activeLink = magicLinkUrl || lead.magicLinkUrl || generatedMagicLink;
      if (activeLink) {
        message += `🔗 *Tautan Masuk Langsung (Magic Link Tanpa Password):*\n`;
        message += `${activeLink}\n\n`;
        message += `_Catatan: Tautan berlaku 24 jam dan hanya dapat digunakan 1 kali demi keamanan sistem laboratorium._\n\n`;
      }
    } else {
      message += `Saya dari tim spesialis Diagnova ingin mengonfirmasi jadwal presentasi demo teknis Anda.\n\n`;
      message += `📋 *Rincian Jadwal Pengajuan:*\n`;
      message += `📅 *Waktu yang Diajukan:* ${waktuText}\n`;
      message += `🏢 *Institusi:* ${lead.institution} (${institutionLabels[lead.institutionType] || lead.institutionType})\n`;
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
              Permohonan Demo (Leads CRM)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              LIS Pipeline
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola calon klien laboratorium, review & persetujuan akses demo, dan terbitkan Magic Link login.
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
            href="/api/admin/leads/export"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-white" />
            <span>Ekspor CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Row (Baru, Dihubungi, Jadwal Demo, Selesai) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Total Masuk"
          value={metrics.total}
          subtitle="Seluruh lead tercatat"
          icon={Users}
          iconBg="bg-slate-100"
          iconColor="text-slate-700"
        />
        <MetricCard
          title="Baru"
          value={metrics.new}
          subtitle="Perlu segera dihubungi"
          icon={AlertCircle}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
          badge={{ text: "Tahap 1", variant: "default" }}
        />
        <MetricCard
          title="Dihubungi"
          value={metrics.contacted}
          subtitle="Sedang komunikasi"
          icon={PhoneCall}
          iconBg="bg-amber-50"
          iconColor="text-[#E5A23B]"
          badge={{ text: "Tahap 2", variant: "warning" }}
        />
        <MetricCard
          title="Jadwal Demo"
          value={metrics.scheduled}
          subtitle="Voucher demo aktif"
          icon={CalendarCheck}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{ text: "Tahap 3", variant: "purple" }}
        />
        <MetricCard
          title="Selesai"
          value={metrics.completed}
          subtitle="Telah didemokan"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{ text: "Tahap 4", variant: "success" }}
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
              placeholder="Cari nama, rumah sakit, email, atau no. telepon..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Status Approval Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">Approval:</span>
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
              Semua
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
                <span>{approvalBadgeStyles[ap].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Baris Kedua Filter: Status CRM, Tipe Institusi & Rentang Tanggal */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Status CRM Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">Status CRM:</span>
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
              Semua
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
                {statusBadgeStyles[st].label}
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
                Reset Filter
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
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Calon Klien</th>
                <th className="py-3 px-4">Institusi / Lab</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Jadwal Demo</th>
                <th className="py-3 px-4">Status CRM</th>
                <th className="py-3 px-4">Approval Demo</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Memuat data leads...</span>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800">Belum ada permohonan demo ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Coba sesuaikan filter status, approval, atau kata kunci pencarian.
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
                        {new Date(lead.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(lead.createdAt).toLocaleTimeString("id-ID", {
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
                              {new Date(targetSchedule).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              •{" "}
                              {new Date(targetSchedule).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
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

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type={lead.status} />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${apStyle.bg} ${apStyle.text} ${apStyle.border}`}
                        >
                          <ApIcon className="h-3 w-3" />
                          <span>{apStyle.label}</span>
                        </span>
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

        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Halaman <span className="font-semibold text-slate-900">{currentPage}</span> dari{" "}
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
                  <span>{approvalBadgeStyles[selectedLead.approvalStatus]?.label || selectedLead.approvalStatus}</span>
                </span>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                    <span>Seluruh Informasi Formulir Pemohon</span>
                  </h4>
                  <StatusBadge type={selectedLead.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Nama Lengkap */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Nama Lengkap</span>
                    </span>
                    <p className="font-semibold text-slate-900 text-sm">{selectedLead.name}</p>
                  </div>

                  {/* Nama Institusi / Rumah Sakit */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>Nama Institusi / RS</span>
                    </span>
                    <p className="font-semibold text-slate-900 text-sm">{selectedLead.institution}</p>
                  </div>

                  {/* Jabatan */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      <span>Jabatan</span>
                    </span>
                    <p className="font-semibold text-slate-900">{selectedLead.jobTitle}</p>
                  </div>

                  {/* Jenis Institusi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Jenis Institusi</span>
                    <p className="font-semibold text-slate-900">
                      {institutionLabels[selectedLead.institutionType] || selectedLead.institutionType}
                    </p>
                  </div>

                  {/* Email Resmi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span>Alamat Email</span>
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
                      <span>No. Telepon / WhatsApp</span>
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
                      <span>Jadwal yang Diajukan Calon Klien</span>
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 text-sm">
                        {selectedLead.requestedDemoDate || selectedLead.demoDate ? (
                          new Date(selectedLead.requestedDemoDate || selectedLead.demoDate!).toLocaleString("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }) + " WIB"
                        ) : (
                          <span className="text-slate-400 italic font-normal text-xs">
                            Tidak menentukan tanggal khusus saat mengisi form
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                        Preferensi Pemohon
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kebutuhan Khusus / Notes */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Kebutuhan Khusus & Model Mesin Analyzer (Notes):
                  </span>
                  <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes ? selectedLead.notes : "Tidak ada catatan khusus yang disertakan pada formulir."}
                  </p>
                </div>
              </div>

              {/* SECTION 2: PANEL APPROVAL & PEMBERIAN AKSES DEMO */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Status & Manajemen Approval Akses Demo
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      approvalBadgeStyles[selectedLead.approvalStatus]?.bg
                    } ${approvalBadgeStyles[selectedLead.approvalStatus]?.text} ${
                      approvalBadgeStyles[selectedLead.approvalStatus]?.border
                    }`}
                  >
                    {approvalBadgeStyles[selectedLead.approvalStatus]?.label}
                  </span>
                </div>

                {/* KONDISI 1: PENDING (BELUM APPROVE) */}
                {selectedLead.approvalStatus === "PENDING" && (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 p-3 rounded-xl border border-amber-200/80">
                      Permohonan ini menunggu verifikasi admin. Menyetujui permohonan akan mengaktifkan akun demo dan menghasilkan <strong>Magic Link (passwordless login)</strong> berdurasi 24 jam untuk calon klien.
                    </p>

                    {/* Konfirmasi Jadwal Resmi */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>Konfirmasi Tanggal & Jam Demo Resmi:</span>
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
                        <span>Batas Masa Aktif Demo (sejak akun pertama dibuka):</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { days: 3, label: "3 Hari" },
                          { days: 7, label: "7 Hari (Standard)" },
                          { days: 14, label: "14 Hari" },
                          { days: 30, label: "30 Hari" },
                        ].map((opt) => (
                          <button
                            key={opt.days}
                            type="button"
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
                          <span>{isApproving ? "Memproses Approval..." : "Setujui Permohonan & Buat Magic Link"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRejectForm(true)}
                          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          Tolak Permohonan
                        </button>
                      </div>
                    ) : (
                      /* Form Alasan Penolakan */
                      <form onSubmit={handleReject} className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2.5">
                        <span className="text-xs font-bold text-rose-800 block">Alasan Penolakan Permohonan:</span>
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Contoh: Bukan staf rumah sakit/lab resmi, atau kuota demo penuh..."
                          required
                          className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-slate-900 focus:outline-hidden focus:border-rose-500"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowRejectForm(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={isRejecting || !rejectionReason.trim()}
                            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50"
                          >
                            {isRejecting ? "Menolak..." : "Konfirmasi Tolak"}
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
                          <span>Permohonan Telah Disetujui</span>
                        </span>
                        {selectedLead.approvedAt && (
                          <span className="text-[10px] text-emerald-700 font-normal">
                            Disetujui: {new Date(selectedLead.approvedAt).toLocaleDateString("id-ID")} oleh {selectedLead.approvedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Jadwal resmi:{" "}
                        <strong className="font-semibold">
                          {selectedLead.confirmedDemoDate
                            ? new Date(selectedLead.confirmedDemoDate).toLocaleString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }) + " WIB"
                            : "Menunggu konfirmasi"}
                        </strong>{" "}
                        • Durasi akses demo: <strong>{selectedLead.demoDurationDays || 7} Hari</strong>
                      </p>
                    </div>

                    {/* Kartu Tautan Magic Link */}
                    {(generatedMagicLink || selectedLead.magicLinkUrl) && (
                      <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
                            <span>Tautan Akses Langsung (Magic Link)</span>
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            Sekali Pakai (24 Jam)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={generatedMagicLink || selectedLead.magicLinkUrl || ""}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-mono text-slate-700 select-all"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyMagicLink(generatedMagicLink || selectedLead.magicLinkUrl || "")}
                            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 shadow-xs"
                          >
                            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            <span>{copiedLink ? "Disalin!" : "Salin Link"}</span>
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <a
                            href={formatWaUrl(selectedLead, generatedMagicLink || selectedLead.magicLinkUrl || "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Kirim Magic Link & Rincian via WhatsApp</span>
                          </a>
                          <button
                            type="button"
                            onClick={handleApprove}
                            disabled={isApproving}
                            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                            title="Generate ulang magic link baru jika link sebelumnya kedaluwarsa"
                          >
                            <span>Perbarui Tautan Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* KONDISI 3: REJECTED (DITOLAK) */}
                {selectedLead.approvalStatus === "REJECTED" && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800">
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                      <span>Permohonan Akses Telah Ditolak</span>
                    </div>
                    <p className="text-rose-700">
                      Alasan: <em>&ldquo;{selectedLead.rejectionReason || "Tidak memenuhi syarat akses demo."}&rdquo;</em>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        // Membuka opsi untuk review ulang dan menyetujui
                        setSelectedLead((prev) => (prev ? { ...prev, approvalStatus: "PENDING" } : null));
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 text-[11px] font-semibold transition-colors"
                    >
                      Buka Kembali & Tinjau Ulang Permohonan
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 3: PERBARUI STATUS PIPELINE CRM SALES */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Status Pipeline CRM Sales</span>
                </h4>
                <form onSubmit={handleUpdateStatus} className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {([1, 2, 3, 4] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setModalStatus(st)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                          modalStatus === st
                            ? `${statusBadgeStyles[st].bg} ${statusBadgeStyles[st].border} ${statusBadgeStyles[st].text} ring-2 ring-blue-500/30`
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {statusBadgeStyles[st].label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isUpdatingStatus ? "Menyimpan Status CRM..." : "Simpan Status CRM"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
