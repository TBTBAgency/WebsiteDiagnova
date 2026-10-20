"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  ClipboardList,
  Activity,
  Sparkles,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { AuthSessionPayload } from "@/types";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  {
    name: "Permohonan Demo (Leads)",
    href: "/admin/leads",
    icon: Users,
    badge: "Fase 1",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    name: "Lab Orders (Pre-Analitik)",
    href: "/admin/orders",
    icon: ClipboardList,
    badge: "Fase 2",
    badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200",
  },
  {
    name: "Analitik & Nilai Kritis",
    href: "/admin/analytics-qc",
    icon: Activity,
    badge: "Fase 3",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
  },
  {
    name: "Nova AI Copilot",
    href: "/admin/nova-ai",
    icon: Sparkles,
    badge: "Fase 4",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "Jejak Audit (Audit Log)",
    href: "/admin/audit-logs",
    icon: ShieldAlert,
    badge: "Sistem",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AuthSessionPayload | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Ambil data user aktif dari endpoint /api/auth/me
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCurrentUser(data.data);
        }
      })
      .catch((err) => console.error("Error fetching me:", err));
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Mobile Bar */}
      <header className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-xs">
            <div className="h-full w-full bg-white rounded-[6px] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <span className="font-bold text-slate-900 tracking-tight font-display">DIAGNOVA ADMIN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white shrink-0 justify-between shadow-xs">
          <div>
            {/* Sidebar Brand Header */}
            <div className="p-5 border-b border-slate-100">
              <Link href="/admin/orders" className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <div className="h-full w-full bg-white rounded-[9px] flex items-center justify-center">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-base tracking-tight font-display leading-tight">
                    DIAGNOVA
                  </div>
                  <div className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    Portal Internal LIS
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1.5">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Menu Utama
              </div>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/25"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Actions at Bottom */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70">
            {/* Active User Card */}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <UserCheck className="h-4 w-4" />
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  {currentUser?.name || "Admin Diagnova"}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-medium tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{currentUser?.role?.replace("_", " ") || "Logged In"}</span>
                </div>
              </div>
            </div>

            {/* Quick Links: Website & Logout */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                title="Buka Website Publik"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Web Publik</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
                title="Keluar dari sesi"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm font-display">DIAGNOVA ADMIN</div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md hover:bg-slate-100 text-slate-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium ${
                          isActive ? "bg-blue-600 text-white font-semibold" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isActive ? "bg-white/20 text-white border-white/30" : item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="text-xs text-slate-700 font-medium">{currentUser?.name}</div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
