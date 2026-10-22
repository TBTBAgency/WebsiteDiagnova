"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Activity,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { AuthSessionPayload } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "blue" | "emerald" | "amber" | "purple" | "rose";
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Permohonan Demo",
    href: "/admin/leads",
    icon: Users,
    badge: "Leads",
    badgeVariant: "blue",
  },
  {
    name: "Lab Orders",
    href: "/admin/orders",
    icon: ClipboardList,
    badge: "Pre-Analitik",
    badgeVariant: "emerald",
  },
  {
    name: "Analitik & QC",
    href: "/admin/analytics-qc",
    icon: Activity,
    badge: "Fase 3",
    badgeVariant: "amber",
  },
  {
    name: "Nova AI Copilot",
    href: "/admin/nova-ai",
    icon: Sparkles,
    badge: "Copilot",
    badgeVariant: "purple",
  },
  {
    name: "Jejak Audit",
    href: "/admin/audit-logs",
    icon: ShieldCheck,
    badge: "ISO 15189",
    badgeVariant: "emerald",
  },
];

interface AdminSidebarProps {
  currentUser: AuthSessionPayload | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebar({
  currentUser,
  onLogout,
  isLoggingOut = false,
  mobileMenuOpen = false,
  setMobileMenuOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const getBadgeStyle = (variant: string = "blue") => {
    switch (variant) {
      case "emerald":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "amber":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      case "rose":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/60";
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E8EBEF]">
          <div className="flex items-center justify-between">
            <BrandLogo variant="dark" showTagline={false} />
            {setMobileMenuOpen && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#747B86] hover:bg-slate-100 hover:text-[#17191D] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-[#087BEE] flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A374] animate-pulse" />
            <span>Portal Internal LIS</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold text-[#747B86] uppercase tracking-wider">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard" || pathname === "/admin"
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#F0F6FF] text-[#087BEE] font-semibold shadow-xs"
                      : "text-[#747B86] hover:bg-[#F5F6F8] hover:text-[#17191D]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-[#087BEE]" : "text-[#747B86] group-hover:text-[#17191D]"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.5 rounded-md border",
                        isActive
                          ? "bg-white text-[#087BEE] border-blue-200/80"
                          : getBadgeStyle(item.badgeVariant)
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Section at Bottom */}
      <div className="p-4 border-t border-[#E8EBEF] bg-[#F5F6F8]/60">
        {/* User Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E8EBEF] shadow-xs mb-3">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#087BEE] shrink-0 font-bold text-xs">
            {currentUser?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-semibold text-[#17191D] truncate">
              {currentUser?.name || "Admin Diagnova"}
            </div>
            <div className="text-[10px] text-[#747B86] uppercase font-medium tracking-wider flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A374]" />
              <span className="truncate">{currentUser?.role?.replace("_", " ") || "Administrator"}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center justify-between text-xs px-1">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[#747B86] hover:text-[#17191D] font-medium transition-colors"
            title="Buka Website Publik Diagnova"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Web Publik</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-medium transition-colors disabled:opacity-50"
            title="Keluar dari sesi admin"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#E8EBEF] bg-white shrink-0 sticky top-0 h-screen z-30 shadow-xs">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
          <div className="w-72 bg-white border-r border-[#E8EBEF] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
}
