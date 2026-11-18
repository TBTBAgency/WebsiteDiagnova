"use client";

import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Globe,
  Globe2,
  KeyRound,
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
import { AdminLanguageToggle, AdminT, useAdminLang } from "@/components/admin/AdminLanguage";
import { ChangePasswordDialog } from "@/components/admin/ChangePasswordDialog";

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

function formatRole(t: AdminT, role?: string | null) {
  if (!role) return "Administrator";
  const key = role.toLowerCase();
  if (key === "admin") return "Administrator";
  if (key === "user") return t("Pengguna", "User");
  return role.replace(/_/g, " ");
}

function greetingFor(t: AdminT, hour: number) {
  if (hour >= 4 && hour < 11) return t("Selamat pagi", "Good morning");
  if (hour >= 11 && hour < 15) return t("Selamat siang", "Good afternoon");
  if (hour >= 15 && hour < 18) return t("Selamat sore", "Good afternoon");
  return t("Selamat malam", "Good evening");
}

/* ------------------------------------------------------------------ */
/* Navigasi: pil di header = kelompok, sidebar = halaman per kelompok  */
/* ------------------------------------------------------------------ */

interface NavItem {
  name: string;
  /** Nama dalam bahasa Inggris. */
  en: string;
  href: string;
  icon: React.ElementType;
}

interface NavGroup {
  key: string;
  /** Nama pil di header. */
  name: string;
  /** Judul kelompok di sidebar. */
  heading: string;
  /** Judul kelompok di sidebar (bahasa Inggris). */
  headingEn: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    key: "dashboard",
    name: "Dashboard",
    heading: "Utama",
    headingEn: "Main",
    items: [
      { name: "Dashboard", en: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Permohonan Demo", en: "Demo Requests", href: "/admin/leads", icon: Users },
    ],
  },
  {
    key: "content",
    name: "Konten Website",
    heading: "Konten Website",
    headingEn: "Website Content",
    items: [
      { name: "Pusat Konten", en: "Content Hub", href: "/admin/cms", icon: Globe },
      { name: "Halaman & Section", en: "Pages & Sections", href: "/admin/page-sections", icon: Layers },
      { name: "Konten Global", en: "Global Content", href: "/admin/site-content", icon: Globe2 },
    ],
  },
  {
    key: "system",
    name: "Sistem",
    heading: "Sistem",
    headingEn: "System",
    items: [
      { name: "Pengguna", en: "Users", href: "/admin/users", icon: UserCheck },
      { name: "Audit Log", en: "Audit Log", href: "/admin/audit-logs", icon: ClipboardList },
    ],
  },
];

/** Pil header: Permohonan Demo dipisah dari Dashboard agar bisa diakses satu klik. */
const HEADER_PILLS: { name: string; en: string; href: string; match: string[] }[] = [
  { name: "Dashboard", en: "Dashboard", href: "/admin/dashboard", match: ["/admin/dashboard"] },
  { name: "Permohonan Demo", en: "Demo Requests", href: "/admin/leads", match: ["/admin/leads"] },
  { name: "Konten Website", en: "Website Content", href: "/admin/cms", match: ["/admin/cms", "/admin/page-sections", "/admin/site-content"] },
  { name: "Sistem", en: "System", href: "/admin/users", match: ["/admin/users", "/admin/audit-logs"] },
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

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FF2] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/* ------------------------------------------------------------------ */
/* Sidebar (dipakai di desktop dan di laci menu mobile)                */
/* ------------------------------------------------------------------ */

function SidebarContent({
  pathname,
  firstName,
  onNavigate,
  onPendingNav,
}: {
  pathname: string;
  firstName: string | null;
  onNavigate?: () => void;
  onPendingNav?: (_href: string) => void;
}) {
  const { t } = useAdminLang();
  const [hour, setHour] = useState<number | null>(null);
  // Jam lokal hanya dihitung di browser (menghindari hydration mismatch).
  useEffect(() => setHour(new Date().getHours()), []);
  const greeting = hour === null ? null : greetingFor(t, hour);

  return (
    <div className="flex h-full flex-col">
      <div className="px-1">
        <h2 className="font-display text-[26px] font-bold leading-[1.12] tracking-tight text-[#0E234B]">
          {greeting ?? t("Selamat datang", "Welcome")},
          <br />
          {firstName ? `${firstName}!` : "Admin!"}
        </h2>
        <p className="mt-2 text-[13px] text-slate-500">{t("Ringkasan pengelolaan website Diagnova", "Diagnova website management overview")}</p>
      </div>

      <nav aria-label={t("Navigasi admin", "Admin navigation")} className="mt-7 space-y-6">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{t(group.heading, group.headingEn)}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        onPendingNav?.(item.href);
                        onNavigate?.();
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all",
                        focusRing,
                        active
                          ? "bg-[#0E234B] text-white shadow-[0_8px_20px_-4px_rgba(14,35,75,0.28)]"
                          : "text-slate-600 hover:bg-[#EEF4FF] hover:text-[#0E234B]"
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{t(item.name, item.en)}</span>
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
      <div className="relative mt-8 block overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0E56D8] via-[#1B6FF2] to-[#07348C] p-5 text-white shadow-[0_14px_30px_-10px_rgba(14,86,216,0.38)] lg:mt-auto">
        <Image
          src="/images/hero-scientist.jpg"
          alt=""
          fill
          sizes="240px"
          className="pointer-events-none object-cover object-[78%_50%] opacity-85"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0E56D8] via-[#1B6FF2]/85 to-transparent" aria-hidden="true" />
        <span className="relative block">
          <span className="block font-display text-[20px] font-bold leading-tight">
            {t("Lihat", "View")}
            <br />
            website
          </span>
          <span className="mt-1 block text-[11px] text-blue-100/90">{t("Cek perubahan konten", "Check your content changes")}</span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group mt-9 inline-flex items-center gap-2 rounded-full bg-[#0E234B] py-1.5 pl-4 pr-1.5 text-[11px] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#153670] hover:shadow-md",
              focusRing
            )}
          >
            {t("Buka website", "Open website")}
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </a>
        </span>
      </div>
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
  const router = useRouter();
  const { t } = useAdminLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const closePassword = useCallback(() => setPasswordOpen(false), []);

  const handlePendingNav = useCallback(
    (href: string) => {
      if (!isNavActive(pathname, href)) {
        setPendingHref(href);
      }
    },
    [pathname]
  );

  const effectivePath = pendingHref || pathname;

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

  // Tutup semua panel & reset pending state saat berpindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
    setPendingHref(null);
  }, [pathname]);

  // Safety timeout jika navigasi dibatalkan atau lambat
  useEffect(() => {
    if (!pendingHref) return;
    const timer = setTimeout(() => setPendingHref(null), 5000);
    return () => clearTimeout(timer);
  }, [pendingHref]);

  // Warm-prefetch seluruh rute admin saat idle agar perpindahan halaman instan
  useEffect(() => {
    const routes = ADMIN_NAV_GROUPS.flatMap((g) => g.items.map((item) => item.href));
    const timer = setTimeout(() => {
      routes.forEach((route) => {
        try {
          router.prefetch(route);
        } catch {
          /* abaikan */
        }
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [router]);

  const displayName = currentUser?.name || "Admin Diagnova";
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || null;
  const initials = getInitials(currentUser?.name);

  return (
    <div className="min-h-screen overflow-x-clip bg-white font-sans text-[#0E234B] selection:bg-[#CFE0FF] selection:text-[#1B6FF2]">
      {/* Lebar penuh: tanpa bingkai/margin luar */}
      <div className="min-h-screen bg-white">
        {/* ------------------------------ Header ------------------------------ */}
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-0 lg:px-6">
            <Link
              href="/admin/dashboard"
              prefetch={true}
              onClick={() => handlePendingNav("/admin/dashboard")}
              className={cn("flex shrink-0 items-center gap-2 rounded-full pr-1", focusRing)}
              aria-label={t("Diagnova Admin - ke Dashboard", "Diagnova Admin - go to Dashboard")}
            >
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-8 w-auto object-contain" />
            </Link>

            <div className="flex min-w-0 flex-1 items-center gap-3 lg:pl-6">
              <nav aria-label={t("Bagian admin", "Admin sections")} className="hidden min-w-0 lg:block">
                <ul className="flex items-center gap-2">
                  {HEADER_PILLS.map((pill) => {
                    const active = pill.match.some((m) => isNavActive(effectivePath, m));
                    return (
                      <li key={pill.href}>
                        <Link
                          href={pill.href}
                          prefetch={true}
                          onClick={() => handlePendingNav(pill.href)}
                          aria-current={active ? "true" : undefined}
                          className={cn(
                            "inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium transition-all",
                            focusRing,
                            active
                              ? "bg-[#1B6FF2] text-white shadow-[0_8px_18px_-4px_rgba(27,111,242,0.35)]"
                              : "bg-[#F4F8FD] text-slate-600 hover:bg-[#E8F0FC] hover:text-[#0E234B]"
                          )}
                        >
                          {t(pill.name, pill.en)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                <AdminLanguageToggle className="hidden sm:inline-flex" />
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t("Lihat Website", "View Website")}
                  aria-label={t("Lihat Website (tab baru)", "View Website (new tab)")}
                  className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/90 text-slate-600 transition-colors hover:bg-[#F4F8FD] hover:text-[#0E234B]", focusRing)}
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
                    aria-label={t(`Menu akun ${displayName}`, `Account menu for ${displayName}`)}
                    className={cn("flex items-center gap-3 rounded-full p-0.5 text-left transition-colors hover:bg-[#F4F8FD] sm:pr-3", focusRing)}
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0E56D8] to-[#56ADE2] text-[13px] font-bold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden min-w-0 max-w-[180px] sm:block">
                      <span className="block truncate text-[13px] font-semibold text-[#0E234B]">{displayName}</span>
                      <span className="block truncate text-[11px] text-slate-500">{currentUser?.email || formatRole(t, currentUser?.role)}</span>
                    </span>
                  </button>

                  {userOpen && (
                    <div
                      id={userPanelId}
                      className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-[20px] bg-white p-2 text-sm shadow-[0_18px_50px_rgba(14,35,75,0.16)] ring-1 ring-[#DCE6F5]"
                    >
                      <div className="rounded-2xl bg-[#F4F8FD] p-3">
                        <div className="truncate font-semibold text-[#0E234B]">{displayName}</div>
                        {currentUser?.email && <div className="truncate text-xs text-slate-500">{currentUser.email}</div>}
                        <div className="mt-1.5 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1B6FF2] ring-1 ring-[#D6E4FF]">
                          {formatRole(t, currentUser?.role)}
                        </div>
                      </div>
                      <button
                        type="button"
                        data-testid="open-change-password"
                        onClick={() => {
                          setUserOpen(false);
                          setPasswordOpen(true);
                        }}
                        className={cn("mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-medium text-[#0E234B] transition-colors hover:bg-[#F4F8FD]", focusRing)}
                      >
                        <KeyRound className="h-4 w-4" aria-hidden="true" />
                        <span>{t("Ganti kata sandi", "Change password")}</span>
                      </button>
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
                        <span>{isLoggingOut ? t("Keluar...", "Logging out...") : "Logout"}</span>
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
                  aria-label={mobileOpen ? t("Tutup menu navigasi", "Close navigation menu") : t("Buka menu navigasi", "Open navigation menu")}
                  className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0E234B] text-white transition-colors hover:bg-[#153670] lg:hidden", focusRing)}
                >
                  {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ------------------------- Sidebar + konten ------------------------- */}
        <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:pb-6">
          <aside className="hidden lg:sticky lg:top-[76px] lg:block lg:h-[calc(100vh-76px-1.5rem)] lg:self-start lg:overflow-y-auto lg:pb-2 lg:pt-4 scrollbar-none">
            <SidebarContent pathname={effectivePath} firstName={firstName} onPendingNav={handlePendingNav} />
          </aside>

          <main className="relative min-w-0 overflow-hidden bg-[#F4F8FD] px-3 pb-10 pt-5 sm:px-5 lg:rounded-[28px] lg:border lg:border-[#DCE6F5]/80 lg:px-7 lg:pt-7">
            {pendingHref && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] overflow-hidden bg-[#DCE6F5]">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#1B6FF2] via-[#56ADE2] to-[#1B6FF2]" />
              </div>
            )}
            <div className="min-w-0">{children}</div>
          </main>
        </div>
      </div>

      {/* Laci menu (< lg) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label={t("Tutup menu navigasi", "Close navigation menu")} tabIndex={-1} onClick={closeMobile} className="absolute inset-0 bg-[#0E234B]/40 backdrop-blur-[2px]" />
          <div
            ref={drawerRef}
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label={t("Menu navigasi admin", "Admin navigation menu")}
            className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col overflow-y-auto rounded-r-[28px] bg-white p-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} className="h-8 w-auto object-contain" />
              <button type="button" onClick={closeMobile} aria-label={t("Tutup menu", "Close menu")} className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F3F5]", focusRing)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <AdminLanguageToggle className="mb-5 self-start sm:hidden" />
            <SidebarContent pathname={effectivePath} firstName={firstName} onNavigate={closeMobile} onPendingNav={handlePendingNav} />
          </div>
        </div>
      )}

      <ChangePasswordDialog open={passwordOpen} onClose={closePassword} />
    </div>
  );
}
