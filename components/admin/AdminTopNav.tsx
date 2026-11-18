"use client";

import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  Globe,
  Globe2,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { AuthSessionPayload } from "@/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Session context: dibagikan oleh layout admin ke halaman di dalamnya */
/* ------------------------------------------------------------------ */

export const AdminSessionContext = createContext<AuthSessionPayload | null>(null);

/** Data user yang sedang login (null selama sesi belum dimuat). */
export function useAdminSession() {
  return useContext(AdminSessionContext);
}

/* ------------------------------------------------------------------ */
/* Navigasi                                                            */
/* ------------------------------------------------------------------ */

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Permohonan Demo", href: "/admin/leads", icon: Users },
  { name: "Pengguna", href: "/admin/users", icon: UserCheck },
  { name: "Pusat Konten", href: "/admin/cms", icon: Globe },
  { name: "Halaman & Section", href: "/admin/page-sections", icon: Layers },
  { name: "Konten Global", href: "/admin/site-content", icon: Globe2 },
  { name: "Audit Log", href: "/admin/audit-logs", icon: ClipboardList },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === "/admin/dashboard" || pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getInitials(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${second}`.toUpperCase();
}

function formatRole(role?: string | null) {
  if (!role) return "Administrator";
  const key = role.toLowerCase();
  if (key === "admin") return "Administrator";
  if (key === "user") return "Pengguna";
  return role.replace(/_/g, " ");
}

/** Menutup panel saat klik di luar elemen atau tombol Escape ditekan. */
function useDismiss(
  open: boolean,
  close: () => void,
  containerRef: React.RefObject<HTMLElement>,
  triggerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, containerRef, triggerRef]);
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6FED] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface AdminTopNavProps {
  currentUser: AuthSessionPayload | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

export function AdminTopNav({ currentUser, onLogout, isLoggingOut = false }: AdminTopNavProps) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const userWrapRef = useRef<HTMLDivElement>(null);
  const userTriggerRef = useRef<HTMLButtonElement>(null);

  const mobilePanelId = useId();
  const userPanelId = useId();

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);
  const closeUser = React.useCallback(() => setUserOpen(false), []);

  useDismiss(mobileOpen, closeMobile, headerRef, mobileTriggerRef);
  useDismiss(userOpen, closeUser, userWrapRef, userTriggerRef);

  // Tutup semua panel saat berpindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const displayName = currentUser?.name || "Admin Diagnova";
  const initials = getInitials(currentUser?.name);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 lg:px-8">
      <div ref={headerRef} className="relative mx-auto max-w-[1440px]">
        <div className="flex h-16 items-center gap-3 rounded-[24px] bg-white px-3 shadow-[0_8px_30px_rgba(30,42,59,0.06)] ring-1 ring-[#E4E8EF] sm:px-4">
          {/* Brand */}
          <Link
            href="/admin/dashboard"
            className={cn("flex min-w-0 shrink-0 items-center gap-2 rounded-full pr-1", focusRing)}
            aria-label="Diagnova Admin - ke Dashboard"
          >
            <Image
              src="/images/logo-nav.png"
              alt="Diagnova"
              width={240}
              height={66}
              priority
              className="h-8 w-auto object-contain sm:h-9"
            />
            <span className="hidden rounded-full bg-[#EEF3FD] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#2F6FED] sm:inline-block">
              Admin
            </span>
          </Link>

          {/* Navigasi desktop */}
          <nav aria-label="Navigasi admin" className="hidden min-w-0 flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-1.5">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors 2xl:px-4",
                        focusRing,
                        active
                          ? "bg-[#2F6FED] text-white shadow-[0_6px_16px_rgba(47,111,237,0.28)]"
                          : "bg-[#F1F3F7] text-[#4B5565] hover:bg-[#E6EAF1] hover:text-[#1E2A3B]"
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Aksi kanan */}
          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat Website"
              aria-label="Lihat Website (tab baru)"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F7] text-[#4B5565] transition-colors hover:bg-[#E6EAF1] hover:text-[#1E2A3B]",
                focusRing
              )}
            >
              <ExternalLink className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>

            {/* Avatar & menu pengguna */}
            <div ref={userWrapRef} className="relative">
              <button
                ref={userTriggerRef}
                type="button"
                onClick={() => {
                  setUserOpen((v) => !v);
                  setMobileOpen(false);
                }}
                aria-expanded={userOpen}
                aria-controls={userPanelId}
                aria-label={`Menu akun ${displayName}`}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2F6FED] to-[#56ADE2] text-[13px] font-bold text-white ring-2 ring-white transition-transform hover:scale-[1.03]",
                  focusRing
                )}
              >
                {initials}
              </button>

              {userOpen && (
                <div
                  id={userPanelId}
                  className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-[20px] bg-white p-2 text-sm shadow-[0_18px_50px_rgba(30,42,59,0.16)] ring-1 ring-[#E4E8EF]"
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-[#F6F8FB] p-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2F6FED] text-[13px] font-bold text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-[#1E2A3B]">{displayName}</div>
                      {currentUser?.email && (
                        <div className="truncate text-xs text-[#6B7585]">{currentUser.email}</div>
                      )}
                      <div className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2F6FED] ring-1 ring-[#DCE5F8]">
                        {formatRole(currentUser?.role)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserOpen(false);
                      onLogout();
                    }}
                    disabled={isLoggingOut}
                    className={cn(
                      "mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50",
                      focusRing
                    )}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tombol menu (< xl) */}
            <button
              ref={mobileTriggerRef}
              type="button"
              onClick={() => {
                setMobileOpen((v) => !v);
                setUserOpen(false);
              }}
              aria-expanded={mobileOpen}
              aria-controls={mobilePanelId}
              aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1E2A3B] text-white transition-colors hover:bg-[#2B3A50] xl:hidden",
                focusRing
              )}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Panel navigasi (< xl) */}
        {mobileOpen && (
          <nav
            id={mobilePanelId}
            aria-label="Navigasi admin"
            className="absolute inset-x-0 top-full z-50 mt-2 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-[24px] bg-white p-2 shadow-[0_18px_50px_rgba(30,42,59,0.16)] ring-1 ring-[#E4E8EF] xl:hidden"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-colors",
                        focusRing,
                        active
                          ? "bg-[#2F6FED] text-white"
                          : "text-[#4B5565] hover:bg-[#F1F3F7] hover:text-[#1E2A3B]"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          active ? "bg-white/20" : "bg-[#F1F3F7]"
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
