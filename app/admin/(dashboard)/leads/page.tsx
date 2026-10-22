"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Eye,
  Phone,
  Mail,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  PhoneCall,
  MessageSquare,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { DemoRequestRecord, InstitutionType, LeadStatus } from "@/types";
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
  LeadStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: "Baru",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  contacted: {
    label: "Dihubungi",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  scheduled: {
    label: "Jadwal Demo",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  completed: {
    label: "Selesai",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
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
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [institutionFilter, setInstitutionFilter] = useState<InstitutionType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail Modal & Action states
  const [selectedLead, setSelectedLead] = useState<DemoRequestRecord | null>(null);
  const [modalStatus, setModalStatus] = useState<LeadStatus>("new");
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (institutionFilter !== "all") params.set("institutionType", institutionFilter);
      if (searchTerm.trim() !== "") params.set("search", searchTerm.trim());
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
  }, [statusFilter, institutionFilter, searchTerm, currentPage]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenDetail = (lead: DemoRequestRecord) => {
    setSelectedLead(lead);
    setModalStatus(lead.status);
    setStatusUpdateNote("");
    setNewNoteContent("");
    setActionSuccessMessage("");
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
          note: statusUpdateNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setSelectedLead(data.data);
        setActionSuccessMessage(`Status berhasil diubah menjadi ${modalStatus.toUpperCase()}`);
        setStatusUpdateNote("");
        fetchLeads(); // Refresh table
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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteContent.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNoteContent.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const refreshed = await fetch(`/api/admin/leads/${selectedLead.id}`).then((r) =>
          r.json()
        );
        if (refreshed.data) {
          setSelectedLead(refreshed.data);
        }
        setNewNoteContent("");
        setActionSuccessMessage("Catatan tindak lanjut berhasil disimpan.");
        fetchLeads();
      } else {
        alert(data.message || "Gagal menambahkan catatan");
      }
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsAddingNote(false);
    }
  };

  const formatWaUrl = (phone: string, name: string, institution: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);
    const message = encodeURIComponent(
      `Halo ${name} dari ${institution},\n\nTerima kasih telah mengajukan permohonan demo Diagnova LIS Platform melalui website. Saya dari tim spesialis Diagnova ingin mengonfirmasi jadwal presentasi & diskusi teknis.`
    );
    return `https://wa.me/${clean}?text=${message}`;
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
              Fase 1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola setiap calon klien, jadwalkan presentasi LIS, dan catat riwayat tindak lanjut sales.
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

      {/* KPI Cards Row */}
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
          title="Leads Baru"
          value={metrics.new}
          subtitle="Perlu segera dihubungi"
          icon={AlertCircle}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
          badge={{ text: "Baru", variant: "default" }}
        />
        <MetricCard
          title="Dihubungi"
          value={metrics.contacted}
          subtitle="Sedang komunikasi"
          icon={PhoneCall}
          iconBg="bg-amber-50"
          iconColor="text-[#E5A23B]"
          badge={{ text: "Follow-up", variant: "warning" }}
        />
        <MetricCard
          title="Jadwal Demo"
          value={metrics.scheduled}
          subtitle="Siap presentasi LIS"
          icon={CalendarCheck}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{ text: "Presentasi", variant: "purple" }}
        />
        <MetricCard
          title="Selesai"
          value={metrics.completed}
          subtitle="Telah didemokan"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{ text: "Selesai", variant: "success" }}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "new", "contacted", "scheduled", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "all" ? "Semua Status" : statusBadgeStyles[st].label}
            </button>
          ))}
        </div>

        {/* Institution Type Dropdown */}
        <div className="w-full md:w-56 shrink-0">
          <select
            value={institutionFilter}
            onChange={(e) => {
              setInstitutionFilter(e.target.value as InstitutionType | "all");
              setCurrentPage(1);
            }}
            aria-label="Filter berdasarkan jenis institusi"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:border-blue-500 focus:bg-white focus:outline-hidden"
          >
            <option value="all">Semua Tipe Institusi</option>
            <option value="hospital">Rumah Sakit</option>
            <option value="clinical-lab">Laboratorium Klinis</option>
            <option value="pathology-center">Pusat Patologi</option>
            <option value="microbiology-center">Pusat Mikrobiologi</option>
            <option value="blood-bank">Bank Darah</option>
            <option value="other">Lainnya</option>
          </select>
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
                <th className="py-3 px-4">Tipe Institusi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
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
                      Coba ganti filter atau kirim permohonan uji coba dari form Request Demo di website.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const badge = statusBadgeStyles[lead.status];
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

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                          {institutionLabels[lead.institutionType] || lead.institutionType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type={lead.status} />
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

      {/* DETAIL & ACTION MODAL DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in duration-200">
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
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              {actionSuccessMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Contact & Institution Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                    Kontak Langsung
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800 font-mono font-semibold">{selectedLead.phone}</span>
                    <a
                      href={formatWaUrl(
                        selectedLead.phone,
                        selectedLead.name,
                        selectedLead.institution
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[11px] font-semibold text-white transition-colors"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Chat WhatsApp</span>
                    </a>
                  </div>
                  <div className="pt-1">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Mail className="h-3 w-3" />
                      <span>{selectedLead.email}</span>
                    </a>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                    Informasi Fasilitas
                  </span>
                  <div className="text-slate-800 font-semibold">
                    {institutionLabels[selectedLead.institutionType] || selectedLead.institutionType}
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1 pt-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>
                      Diajukan:{" "}
                      {new Date(selectedLead.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes dari Pemohon */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider mb-1">
                  Kebutuhan & Catatan Pemohon:
                </span>
                <p className="text-slate-700 italic">
                  {selectedLead.notes ? `"${selectedLead.notes}"` : "Tidak ada catatan khusus yang disertakan."}
                </p>
              </div>

              {/* UPDATE STATUS FORM */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Perbarui Status Lead</span>
                </h4>
                <form onSubmit={handleUpdateStatus} className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["new", "contacted", "scheduled", "completed"] as const).map((st) => (
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

                  <div>
                    <input
                      type="text"
                      value={statusUpdateNote}
                      onChange={(e) => setStatusUpdateNote(e.target.value)}
                      placeholder="Catatan perubahan (opsional, mis. 'Demo disepakati tgl 20 Okt')"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingStatus}
                    className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isUpdatingStatus ? "Menyimpan Perubahan..." : "Simpan Status Baru"}</span>
                  </button>
                </form>
              </div>

              {/* FOLLOW-UP NOTES HISTORY */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                  <span>Riwayat Tindak Lanjut Tim Sales</span>
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Tulis catatan tindak lanjut baru..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteContent.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors disabled:opacity-40 shrink-0 flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    <span>Catat</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedLead.notesHistory && selectedLead.notesHistory.length > 0 ? (
                    selectedLead.notesHistory.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-800">
                            {note.authorName || "Sales Specialist"}
                          </span>
                          <span>
                            {new Date(note.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-slate-700">{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400">
                      Belum ada catatan tindak lanjut pada lead ini.
                    </div>
                  )}
                </div>
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
