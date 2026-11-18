"use client";

import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
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

function greetingFor(hour: number) {
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
}

/* ------------------------------------------------------------------ */
/* Navigasi: pil di header = kelompok, sidebar = halaman per kelompok  */
/* ------------------------------------------------------------------ */

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  key: string;
  /** Nama pil di header. */
  name: string;
  /** Judul kelompok di sidebar. */
  heading: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    key: "dashboard",
    name: "Dashboard",
    heading: "Utama",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Permohonan Demo", href: "/admin/leads", icon: Users },
    ],
  },
  {
    key: "content",
    name: "Konten Website",
    heading: "Konten Website",
    items: [
      { name: "Pusat Konten", href: "/admin/cms", icon: Globe },
      { name: "Halaman & Section", href: "/admin/page-sections", icon: Layers },
      { name: "Konten Global", href: "/admin/site-content", icon: Globe2 },
    ],
  },
  {
    key: "system",
    name: "Sistem",
    heading: "Sistem",
    items: [
      { name: "Pengguna", href: "/admin/users", icon: UserCheck },
      { name: "Audit Log", href: "/admin/audit-logs", icon: ClipboardList },
    ],
  },
];

/** Pil header: Permohonan Demo dipisah dari Dashboard agar bisa diakses satu klik. */
const HEADER_PILLS: { name: string; href: string; match: string[] }[] = [
  { name: "Dashboard", href: "/admin/dashboard", match: ["/admin/dashboard"] },
  { name: "Permohonan Demo", href: "/admin/leads", match: ["/admin/leads"] },
  { name: "Konten Website", href: "/admin/cms", match: ["/admin/cms", "/admin/page-sections", "/admin/site-content"] },
  { name: "Sistem", href: "/admin/users", match: ["/admin/users", "/admin/audit-logs"] },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Menutup panel saat klik di luar elemen atau tombol Escape ditekan. */
function useDismiss(open: boolean, close: () => void, containerRef: React.RefObject<HTMLElement>, triggerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && containerRef.current && !containerRef.current.contains(target)) close();
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

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/* ------------------------------------------------------------------ */
/* Sidebar (dipakai di desktop dan di laci menu mobile)                */
/* ------------------------------------------------------------------ */

function SidebarContent({ pathname, firstName, onNavigate }: { pathname: string; firstName: string | null; onNavigate?: () => void }) {
  const [greeting, setGreeting] = useState<string | null>(null);
  // Jam lokal hanya dihitung di browser (menghindari hydration mismatch).
  useEffect(() => setGreeting(greetingFor(new Date().getHours())), []);

  return (
    <div className="flex h-full flex-col">
      <div className="px-1">
        <h2 className="font-display text-[28px] font-bold leading-[1.1] tracking-tight text-[#111318]">
          {greeting ?? "Selamat datang"},
          <br />
          {firstName ? `${firstName}!` : "Admin!"}
        </h2>
        <p className="mt-2 text-[13px] text-[#8A8F98]">Ringkasan pengelolaan website Diagnova</p>
      </div>

      <nav aria-label="Navigasi admin" className="mt-7 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A3A8B1]">{group.heading}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors",
                        focusRing,
                        active ? "bg-[#111318] text-white shadow-[0_8px_20px_rgba(17,19,24,0.18)]" : "text-[#3B4049] hover:bg-[#F2F3F5] hover:text-[#111318]"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.name}</span>
                      {active && <ChevronDown className="h-4 w-4 -rotate-90 opacity-80" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Kartu biru di bawah sidebar: pratinjau website publik */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn("group relative mt-8 block overflow-hidden rounded-[24px] bg-[#1F6BFF] p-5 text-white lg:mt-auto", focusRing)}
      >
        <Image
          src="/images/hero-scientist.jpg"
          alt=""
          fill
          sizes="240px"
          className="object-cover object-[78%_50%] opacity-90 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-[#1F6BFF] via-[#1F6BFF]/80 to-transparent" aria-hidden="true" />
        <span className="relative block">
          <span className="block font-display text-[20px] font-bold leading-tight">
            Lihat
            <br />
            website
          </span>
          <span className="mt-1 block text-[11px] text-white/80">Cek perubahan konten</span>
          <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#111318] py-1.5 pl-4 pr-1.5 text-[11px] font-semibold">
            Buka website
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </span>
        </span>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Kerangka admin                                                      */
/* ------------------------------------------------------------------ */

interface AdminShellProps {
  currentUser: AuthSessionPayload | null;
  onLogout: () => void;
  isLoggingOut?: boolean;
  children: React.ReactNode;
}

export function AdminShell({ currentUser, onLogout, isLoggingOut = false, children }: AdminShellProps) {
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const userWrapRef = useRef<HTMLDivElement>(null);
  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();
  const userPanelId = useId();

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeUser = useCallback(() => setUserOpen(false), []);
  useDismiss(userOpen, closeUser, userWrapRef, userTriggerRef);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Tutup semua panel saat berpindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const displayName = currentUser?.name || "Admin Diagnova";
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || null;
  const initials = getInitials(currentUser?.name);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#DCDFE4] font-sans text-[#111318] selection:bg-[#CFE0FF] selection:text-[#1F6BFF] lg:p-4 2xl:p-6">
      <div className="mx-auto min-h-screen max-w-[1680px] bg-white lg:min-h-[calc(100vh-2rem)] lg:rounded-[32px] lg:shadow-[0_20px_60px_rgba(17,19,24,0.08)] 2xl:min-h-[calc(100vh-3rem)]">
        {/* ------------------------------ Header ------------------------------ */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur lg:rounded-t-[32px]">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-0 lg:px-6">
            <Link href="/admin/dashboard" className={cn("flex shrink-0 items-center gap-2 rounded-full pr-1", focusRing)} aria-label="Diagnova Admin - ke Dashboard">
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-8 w-auto object-contain" />
            </Link>

            <div className="flex min-w-0 flex-1 items-center gap-3 lg:pl-6">
              <nav aria-label="Bagian admin" className="hidden min-w-0 lg:block">
                <ul className="flex items-center gap-2">
                  {HEADER_PILLS.map((pill) => {
                    const active = pill.match.some((m) => isNavActive(pathname, m));
                    return (
                      <li key={pill.href}>
                        <Link
                          href={pill.href}
                          aria-current={active ? "true" : undefined}
                          className={cn(
                            "inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors",
                            focusRing,
                            active ? "bg-[#1F6BFF] text-white shadow-[0_8px_18px_rgba(31,107,255,0.3)]" : "bg-[#F2F3F5] text-[#5B616B] hover:bg-[#E8EAED] hover:text-[#111318]"
                          )}
                        >
                          {pill.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Lihat Website"
                  aria-label="Lihat Website (tab baru)"
                  className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E6EA] text-[#5B616B] transition-colors hover:bg-[#F2F3F5] hover:text-[#111318]", focusRing)}
                >
                  <ExternalLink className="h-[17px] w-[17px]" aria-hidden="true" />
                </a>

                {/* Avatar, nama & menu akun */}
                <div ref={userWrapRef} className="relative">
                  <button
                    ref={userTriggerRef}
                    type="button"
                    onClick={() => setUserOpen((v) => !v)}
                    aria-expanded={userOpen}
                    aria-controls={userPanelId}
                    aria-label={`Menu akun ${displayName}`}
                    className={cn("flex items-center gap-3 rounded-full p-0.5 text-left transition-colors hover:bg-[#F2F3F5] sm:pr-3", focusRing)}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1F6BFF] to-[#5AA2FF] text-[13px] font-bold text-white">
                      {initials}
                    </span>
                    <span className="hidden min-w-0 max-w-[180px] sm:block">
                      <span className="block truncate text-[13px] font-semibold text-[#111318]">{displayName}</span>
                      <span className="block truncate text-[11px] text-[#8A8F98]">{currentUser?.email || formatRole(currentUser?.role)}</span>
                    </span>
                  </button>

                  {userOpen && (
                    <div
                      id={userPanelId}
                      className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-[20px] bg-white p-2 text-sm shadow-[0_18px_50px_rgba(17,19,24,0.16)] ring-1 ring-[#E4E6EA]"
                    >
                      <div className="rounded-2xl bg-[#F5F6F8] p-3">
                        <div className="truncate font-semibold text-[#111318]">{displayName}</div>
                        {currentUser?.email && <div className="truncate text-xs text-[#8A8F98]">{currentUser.email}</div>}
                        <div className="mt-1.5 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1F6BFF] ring-1 ring-[#D6E4FF]">
                          {formatRole(currentUser?.role)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserOpen(false);
                          onLogout();
                        }}
                        disabled={isLoggingOut}
                        className={cn("mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50", focusRing)}
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tombol menu (< lg) */}
                <button
                  ref={mobileTriggerRef}
                  type="button"
                  onClick={() => {
                    setMobileOpen((v) => !v);
                    setUserOpen(false);
                  }}
                  aria-expanded={mobileOpen}
                  aria-controls={drawerId}
                  aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                  className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111318] text-white transition-colors hover:bg-[#2A2D33] lg:hidden", focusRing)}
                >
                  {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------- Sidebar + konten ------------------------- */}
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:pb-6">
          <aside className="hidden lg:sticky lg:top-[76px] lg:block lg:h-[calc(100vh-76px-2.5rem)] lg:self-start lg:overflow-y-auto lg:pb-2 lg:pt-4 scrollbar-none">
            <SidebarContent pathname={pathname} firstName={firstName} />
          </aside>

          <main className="min-w-0 bg-[#EEF0F3] px-3 pb-10 pt-5 sm:px-5 lg:rounded-[28px] lg:px-7 lg:pt-7">
            <div className="mx-auto min-w-0 max-w-[1400px]">{children}</div>
          </main>
        </div>
      </div>

      {/* Laci menu (< lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup menu navigasi" tabIndex={-1} onClick={closeMobile} className="absolute inset-0 bg-[#111318]/40 backdrop-blur-[2px]" />
          <div
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi admin"
            className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto rounded-r-[28px] bg-white p-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} className="h-8 w-auto object-contain" />
              <button type="button" onClick={closeMobile} aria-label="Tutup menu" className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F3F5]", focusRing)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent pathname={pathname} firstName={firstName} onNavigate={closeMobile} />
          </div>
        </div>
      )}
    </div>
  );
}
