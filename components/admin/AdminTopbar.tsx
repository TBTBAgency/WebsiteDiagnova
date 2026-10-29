"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
} from "lucide-react";
import { AuthSessionPayload } from "@/types";
import { cn } from "@/lib/utils";

interface AdminTopbarProps {
  currentUser: AuthSessionPayload | null;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": {
    title: "Ringkasan Eksekutif",
    subtitle: "Ikhtisar operasional, permohonan demo, dan aktivitas LIS",
  },
  "/admin": {
    title: "Ringkasan Eksekutif",
    subtitle: "Ikhtisar operasional, permohonan demo, dan aktivitas LIS",
  },
  "/admin/leads": {
    title: "Permohonan Demo (Leads)",
    subtitle: "Manajemen prospek institusi kesehatan dan jadwal demo LIS",
  },
  "/admin/orders": {
    title: "Lab Orders Pre-Analitik",
    subtitle: "Pendaftaran pesanan tes lab, barcode tabung, dan check-in spesimen",
  },
  "/admin/analytics-qc": {
    title: "Analitik & Nilai Kritis",
    subtitle: "Worklist analisis, delta check, dan pelaporan nilai panik klinis",
  },
  "/admin/nova-ai": {
    title: "Nova AI Clinical Copilot",
    subtitle: "Asisten interpretasi kecerdasan laboratorium berbasis bukti",
  },
  "/admin/audit-logs": {
    title: "Jejak Audit Sistem (Audit Trail)",
    subtitle: "Kepatuhan ISO 15189 dan rekam jejak integritas data medis",
  },
};

export function AdminTopbar({
  currentUser,
  onOpenMobileMenu,
  onLogout,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pageInfo = PAGE_TITLES[pathname] || {
    title: "Admin Diagnova",
    subtitle: "Intelligent Laboratory Information System",
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E8EBEF] px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#747B86] hover:bg-slate-100 hover:text-[#17191D] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-[#747B86] mb-0.5">
              <Link href="/admin/dashboard" className="hover:text-[#087BEE] transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="text-[#17191D] font-semibold">{pageInfo.title}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#17191D] tracking-tight font-display">
              {pageInfo.title}
            </h1>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Search Input (Desktop) */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-3.5 w-3.5 text-[#747B86]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pasien, order, instansi..."
              className="w-48 lg:w-64 pl-8 pr-8 py-1.5 text-xs bg-[#F5F6F8] border border-[#E8EBEF] rounded-xl text-[#17191D] placeholder:text-[#747B86] focus:outline-none focus:border-[#087BEE] focus:bg-white transition-all"
            />
            <span className="absolute right-2.5 text-[10px] font-semibold text-[#747B86] bg-white border border-[#E8EBEF] px-1 rounded shadow-2xs">
              ⌘K
            </span>
          </div>

          {/* Quick Action: New Order */}
          <Link
            href="/admin/orders"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087BEE] hover:bg-[#0667C7] text-white text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Order Lab</span>
          </Link>

          {/* System Status Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A374] animate-pulse" />
            <span>LIS Online (5433)</span>
          </div>

          {/* Notification Button & Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-[#747B86] hover:bg-[#F5F6F8] hover:text-[#17191D] border border-transparent hover:border-[#E8EBEF] transition-all"
              title="Notifikasi Sistem"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#087BEE] ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E8EBEF] shadow-xl p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EBEF]">
                  <div className="font-semibold text-[#17191D]">Pemberitahuan Sistem</div>
                  <span className="text-[10px] font-semibold text-[#087BEE] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    2 Baru
                  </span>
                </div>

                <div className="py-2 space-y-2">
                  <div className="flex gap-2.5 p-2 rounded-xl bg-blue-50/50 border border-blue-100 hover:bg-blue-50 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-[#087BEE] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#17191D]">Permohonan Demo Baru</div>
                      <div className="text-[11px] text-[#747B86] mt-0.5">
                        Prospek dari RSUD baru saja mengajukan permohonan demo Diagnova LIS.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 p-2 rounded-xl bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#17191D]">Order CITO Siap Dianalisis</div>
                      <div className="text-[11px] text-[#747B86] mt-0.5">
                        Tabung spesimen darah EDTA dari IGD telah diterima di meja laboratorium.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8EBEF] text-center">
                  <Link
                    href="/admin/leads"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-[#087BEE] hover:underline"
                  >
                    Tinjau Semua Permohonan →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-[#E8EBEF] hover:bg-[#F5F6F8] transition-all"
            >
              <div className="h-7 w-7 rounded-lg bg-[#087BEE] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#17191D] leading-tight">
                  {currentUser?.name?.split(" ")[0] || "Admin"}
                </div>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8EBEF] shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-2.5 border-b border-[#E8EBEF] mb-2 px-1">
                  <div className="font-semibold text-[#17191D] truncate">
                    {currentUser?.name || "Admin Diagnova"}
                  </div>
                  <div className="text-[11px] text-[#747B86] truncate">
                    {currentUser?.email || "admin@diagnova.id"}
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#747B86] hover:bg-[#F5F6F8] hover:text-[#17191D] transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Website Diagnova</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar dari Sesi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
