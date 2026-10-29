"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  Activity,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Plus,
  ArrowRight,
  Calendar,
  Building2,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
} from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import { InteractiveChart } from "@/components/admin/InteractiveChart";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

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
  timeline: {
    date: string;
    label: string;
    leads: number;
    orders: number;
  }[];
  institutionDistribution: {
    type: string;
    count: number;
  }[];
  recentLeads: {
    id: string;
    name: string;
    institution: string;
    jobTitle: string;
    email: string;
    phone: string;
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
  recentAuditLogs: {
    id: string;
    action: string;
    entity: string;
    userName: string;
    createdAt: string;
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

export default function AdminOverviewDashboard() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"leads" | "orders">("leads");

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to load overview data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Welcome Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[11px] font-semibold text-[#087BEE] mb-2 shadow-2xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>{todayStr}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight font-display">
            Dashboard Diagnova LIS
          </h2>
          <p className="text-xs sm:text-sm text-[#747B86] mt-1 max-w-2xl leading-relaxed">
            Pusat kendali eksekutif untuk memantau permohonan demo rumah sakit, antrean order spesimen klinis, dan integritas sistem laboratorium.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={fetchOverview}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8EBEF] hover:bg-[#F5F6F8] text-xs font-semibold text-[#17191D] transition-colors shadow-2xs disabled:opacity-50"
            title="Muat ulang metrik"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin text-[#087BEE]")} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087BEE] hover:bg-[#0667C7] text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Order Lab Baru</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Overview (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Permohonan Demo (Leads)"
          value={data?.summary.leads.total ?? 0}
          subtitle={`${data?.summary.leads.new ?? 0} prospek baru menunggu respon`}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-[#087BEE]"
          badge={{
            text: (data?.summary.leads.new ?? 0) > 0 ? "Perlu Respon" : "Terkendali",
            variant: (data?.summary.leads.new ?? 0) > 0 ? "warning" : "success",
          }}
        />

        <MetricCard
          title="Lab Orders Pre-Analitik"
          value={data?.summary.orders.total ?? 0}
          subtitle={`${data?.summary.orders.received ?? 0} spesimen diterima di meja lab`}
          icon={ClipboardList}
          iconBg="bg-emerald-50"
          iconColor="text-[#16A374]"
          badge={{
            text: "LIS Aktif",
            variant: "success",
          }}
        />

        <MetricCard
          title="Order CITO / STAT"
          value={data?.summary.orders.cito ?? 0}
          subtitle="Prioritas gawat darurat (TAT 60 menit)"
          icon={AlertTriangle}
          iconBg="bg-rose-50"
          iconColor="text-[#DC5A5A]"
          badge={{
            text: (data?.summary.orders.cito ?? 0) > 0 ? "Perhatian Khusus" : "Aman",
            variant: (data?.summary.orders.cito ?? 0) > 0 ? "danger" : "default",
          }}
        />

        <MetricCard
          title="Pengguna Sistem Terotorisasi"
          value={data?.summary.activeUsers ?? 0}
          subtitle="Akses berbasis peran (RBAC & ISO 15189)"
          icon={ShieldCheck}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          badge={{
            text: "Terverifikasi",
            variant: "purple",
          }}
        />
      </div>

      {/* 3. Primary Analytics & Secondary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Container (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EBEF] p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8EBEF]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#17191D] font-display">
                Tren Aktivitas & Volume Lab (14 Hari Terakhir)
              </h3>
              <p className="text-xs text-[#747B86] mt-0.5">
                Visualisasi terpadu antara permohonan demo masuk dan pendaftaran order tes LIS.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-[#747B86] bg-[#F5F6F8] px-2.5 py-1 rounded-full border border-[#E8EBEF] shrink-0 self-start sm:self-auto">
              Realtime Database Sync
            </span>
          </div>

          <InteractiveChart data={data?.timeline || []} />
        </div>

        {/* Secondary Insights: Distribution & Health (1 Col) */}
        <div className="bg-white rounded-2xl border border-[#E8EBEF] p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EBEF] mb-4">
              <h3 className="text-sm sm:text-base font-bold text-[#17191D] font-display">
                Status Alur Kerja
              </h3>
              <span className="text-[10px] font-semibold text-[#087BEE] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Ringkasan
              </span>
            </div>

            {/* Status Leads Progress Bars */}
            <div className="space-y-3.5">
              <div className="text-xs font-semibold text-[#17191D] flex items-center justify-between">
                <span>Tahapan Permohonan Demo</span>
                <span className="text-[#747B86] font-normal">
                  Total: {data?.summary.leads.total || 0}
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: "Prospek Baru",
                    count: data?.summary.leads.new || 0,
                    color: "bg-[#087BEE]",
                    total: data?.summary.leads.total || 1,
                  },
                  {
                    label: "Sedang Dihubungi",
                    count: data?.summary.leads.contacted || 0,
                    color: "bg-[#E5A23B]",
                    total: data?.summary.leads.total || 1,
                  },
                  {
                    label: "Jadwal Demo",
                    count: data?.summary.leads.scheduled || 0,
                    color: "bg-purple-500",
                    total: data?.summary.leads.total || 1,
                  },
                  {
                    label: "Demo Selesai",
                    count: data?.summary.leads.completed || 0,
                    color: "bg-[#16A374]",
                    total: data?.summary.leads.total || 1,
                  },
                ].map((item) => {
                  const pct =
                    item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                  return (
                    <div key={item.label} className="text-xs">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#747B86]">{item.label}</span>
                        <span className="font-semibold text-[#17191D]">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#F5F6F8] rounded-full overflow-hidden border border-[#E8EBEF]/60">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", item.color)}
                          style={{ width: `${Math.max(item.count > 0 ? 8 : 0, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profil Institusi Pemohon */}
            <div className="pt-4 mt-4 border-t border-[#E8EBEF]">
              <div className="text-xs font-semibold text-[#17191D] mb-2.5">
                Profil Institusi Peminat
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.institutionDistribution && data.institutionDistribution.length > 0 ? (
                  data.institutionDistribution.map((inst) => (
                    <span
                      key={inst.type}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5F6F8] border border-[#E8EBEF] text-[11px] font-medium text-[#17191D]"
                    >
                      <Building2 className="h-3 w-3 text-[#747B86]" />
                      <span>{INSTITUTION_NAMES[inst.type] || inst.type}</span>
                      <span className="h-4 px-1 rounded bg-white text-[10px] font-bold text-[#087BEE] border border-blue-100 flex items-center justify-center">
                        {inst.count}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#747B86] italic">
                    Belum ada data institusi terdaftar.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EBEF]">
            <Link
              href="/admin/leads"
              className="inline-flex items-center justify-between w-full p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-50 text-[#087BEE] text-xs font-semibold transition-colors"
            >
              <span>Buka Manajemen Permohonan Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity or Actionable Records */}
      <div className="bg-white rounded-2xl border border-[#E8EBEF] shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        {/* Table Header & Tab Switcher */}
        <div className="p-5 sm:p-6 border-b border-[#E8EBEF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#17191D] font-display">
              Aktivitas Terkini (Live Feed)
            </h3>
            <p className="text-xs text-[#747B86] mt-0.5">
              Daftar entri data terbaru yang tercatat di database PostgreSQL Diagnova.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F5F6F8] rounded-xl border border-[#E8EBEF] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                activeTab === "leads"
                  ? "bg-white text-[#087BEE] shadow-2xs font-semibold"
                  : "text-[#747B86] hover:text-[#17191D]"
              )}
            >
              Permohonan Demo ({data?.recentLeads.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                activeTab === "orders"
                  ? "bg-white text-[#087BEE] shadow-2xs font-semibold"
                  : "text-[#747B86] hover:text-[#17191D]"
              )}
            >
              Lab Orders ({data?.recentOrders.length || 0})
            </button>
          </div>
        </div>

        {/* Content Tab 1: Recent Leads */}
        {activeTab === "leads" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F6F8]/60 border-b border-[#E8EBEF] text-[#747B86] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Pemohon & Instansi</th>
                  <th className="px-5 py-3.5">Tipe Institusi</th>
                  <th className="px-5 py-3.5">Kontak</th>
                  <th className="px-5 py-3.5">Tanggal Masuk</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBEF]">
                {data?.recentLeads && data.recentLeads.length > 0 ? (
                  data.recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F5F6F8]/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#17191D]">{lead.name}</div>
                        <div className="text-[11px] text-[#747B86]">
                          {lead.jobTitle} • {lead.institution}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-[#17191D]">
                          <Building2 className="h-3.5 w-3.5 text-[#747B86]" />
                          <span>{INSTITUTION_NAMES[lead.institutionType] || lead.institutionType}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#747B86]">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#747B86]">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#747B86]">
                        {new Date(lead.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge type={lead.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href="/admin/leads"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8EBEF] hover:bg-white text-xs font-semibold text-[#087BEE] transition-colors shadow-2xs"
                        >
                          <span>Kelola</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#747B86]">
                      Belum ada data permohonan demo yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Content Tab 2: Recent Lab Orders */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F6F8]/60 border-b border-[#E8EBEF] text-[#747B86] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Nomor Order</th>
                  <th className="px-5 py-3.5">Pasien & Rekam Medis</th>
                  <th className="px-5 py-3.5">Dokter Pengirim</th>
                  <th className="px-5 py-3.5">Prioritas</th>
                  <th className="px-5 py-3.5">Spesimen Diterima</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EBEF]">
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F5F6F8]/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-semibold text-[#087BEE]">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#17191D]">{order.patientName}</div>
                        <div className="text-[11px] font-mono text-[#747B86]">{order.patientMrn}</div>
                      </td>
                      <td className="px-5 py-4 text-[#747B86]">{order.physicianName}</td>
                      <td className="px-5 py-4">
                        <StatusBadge type={order.priority} />
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#17191D]">
                          <span className="h-2 w-2 rounded-full bg-[#16A374]" />
                          <span>
                            {order.receivedSpecimensCount} dari {order.specimensCount} tabung
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8EBEF] hover:bg-white text-xs font-semibold text-[#087BEE] transition-colors shadow-2xs"
                        >
                          <span>Buka Order</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[#747B86]">
                      Belum ada order laboratorium yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Quick Actions & ISO 15189 System Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/orders"
          className="p-4 rounded-2xl bg-white border border-[#E8EBEF] hover:border-blue-300 hover:shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#087BEE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17191D]">Order Lab Pre-Analitik</div>
              <div className="text-[11px] text-[#747B86]">Daftarkan pasien & cetak barcode tabung</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#087BEE] transition-colors" />
        </Link>

        <Link
          href="/admin/audit-logs"
          className="p-4 rounded-2xl bg-white border border-[#E8EBEF] hover:border-emerald-300 hover:shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#16A374] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17191D]">Jejak Audit ISO 15189</div>
              <div className="text-[11px] text-[#747B86]">Audit trail integritas spesimen & otorisasi</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#16A374] transition-colors" />
        </Link>

        <a
          href="/api/admin/leads/export"
          download
          className="p-4 rounded-2xl bg-white border border-[#E8EBEF] hover:border-purple-300 hover:shadow-sm transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#17191D]">Ekspor Prospek (.CSV)</div>
              <div className="text-[11px] text-[#747B86]">Unduh laporan permohonan demo lengkap</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
        </a>
      </div>
    </div>
  );
}
