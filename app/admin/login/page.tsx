"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  Info,
  Loader2,
  Lock,
  Mail,
  Share2,
  User,
} from "lucide-react";
import { AdminLanguageToggle, useAdminLang } from "@/components/admin/AdminLanguage";

/** Email terakhir disimpan di browser ini bila "Ingat saya" dicentang (tanpa kata sandi). */
const REMEMBER_KEY = "diagnova_admin_email";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FF2] focus-visible:ring-offset-2";

/** Ilustrasi panel kanan: jendela dashboard Diagnova LIS + ikon modul mengambang (dekoratif, responsif tanpa tabrakan). */
function PanelIllustration() {
  return (
    <div className="relative mx-auto flex w-full max-w-[580px] items-center gap-3.5 pb-8 pt-3 select-none lg:gap-5 xl:gap-6" aria-hidden="true">
      {/* Concentric orbital rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 xl:h-[430px] xl:w-[430px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3B82F6]/30 blur-3xl" />

      {/* Left Column: 3 Glassmorphic LIS Icons with guaranteed responsive gap */}
      <div className="relative z-20 flex shrink-0 flex-col items-center justify-center gap-4 lg:gap-5 xl:gap-6">
        {[
          { Icon: FlaskConical, offsetCls: "translate-x-1.5", delay: "0s" },
          { Icon: FileText, offsetCls: "-translate-x-2", delay: "1.2s" },
          { Icon: Share2, offsetCls: "translate-x-1.5", delay: "2.4s" },
        ].map(({ Icon, offsetCls, delay }, i) => (
          <div key={i} className={offsetCls}>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/35 bg-gradient-to-br from-[#3B82F6]/60 to-[#1D4ED8]/50 shadow-[0_16px_36px_-8px_rgba(4,24,78,0.5)] backdrop-blur-md motion-safe:animate-[gentleFloat_5.5s_ease-in-out_infinite] xl:h-16 xl:w-16"
              style={{ animationDelay: delay }}
            >
              <Icon className="h-6 w-6 text-white drop-shadow-sm xl:h-7 xl:w-7" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Window */}
      <div className="relative z-10 min-w-0 flex-1 rounded-2xl border border-white/65 bg-white p-3.5 shadow-[0_30px_75px_-15px_rgba(4,24,78,0.55)] xl:p-5">
        {/* Top Bar */}
        <div className="mb-3.5 flex items-center justify-between border-b border-slate-100 pb-3">
          <Image src="/images/logo-nav.png" alt="" width={100} height={28} className="h-4 w-auto object-contain" />
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0E56D8]" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF3FF] text-[#0E56D8]">
              <User className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="flex gap-3.5">
          {/* Mini Sidebar */}
          <div className="hidden w-[24%] flex-col gap-1.5 pt-0.5 sm:flex">
            <div className="flex items-center gap-2 rounded-xl bg-[#EEF4FF] px-2.5 py-2 text-[10px] font-bold text-[#0E56D8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0E56D8]" />
              Dashboard
            </div>
            {["Lab Results", "Patients", "Reports", "Settings"].map((label) => (
              <div key={label} className="flex items-center gap-2 px-2.5 py-1.5 text-[9.5px] font-medium text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                {label}
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-3">
            {/* 3 KPI Tiles */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-blue-100/80 bg-[#F4F8FF] p-2.5">
                <span className="block text-[8.5px] font-medium text-slate-500">Total Tests</span>
                <span className="mt-0.5 block text-sm font-bold text-slate-900">3,248</span>
              </div>
              <div className="rounded-xl border border-emerald-100/80 bg-emerald-50/70 p-2.5">
                <span className="block text-[8.5px] font-medium text-slate-500">Completed</span>
                <span className="mt-0.5 block text-sm font-bold text-emerald-700">1,986</span>
              </div>
              <div className="rounded-xl border border-amber-100/80 bg-amber-50/60 p-2.5">
                <span className="block text-[8.5px] font-medium text-slate-500">Pending</span>
                <span className="mt-0.5 block text-sm font-bold text-amber-700">62</span>
              </div>
            </div>

            {/* Chart + Recent Activity Row */}
            <div className="grid grid-cols-12 gap-2.5">
              {/* Area Chart */}
              <div className="col-span-7 flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
                <div className="mb-1 flex items-center justify-between text-[8.5px] font-semibold text-slate-500">
                  <span>Throughput</span>
                  <span className="text-[#0E56D8]">+14.2%</span>
                </div>
                <svg viewBox="0 0 180 74" className="h-[74px] w-full">
                  <defs>
                    <linearGradient id="lg-area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0E56D8" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#0E56D8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="24" x2="180" y2="24" stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="0.7" />
                  <line x1="0" y1="48" x2="180" y2="48" stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="0.7" />
                  <path d="M0 58 L26 45 L52 50 L78 30 L104 35 L130 18 L156 24 L180 12 L180 74 L0 74 Z" fill="url(#lg-area)" />
                  <path d="M0 58 L26 45 L52 50 L78 30 L104 35 L130 18 L156 24 L180 12" fill="none" stroke="#0E56D8" strokeWidth="2.2" strokeLinejoin="round" />
                  <circle cx="156" cy="24" r="6" fill="#0E56D8" fillOpacity="0.2" className="animate-pulse" />
                  <circle cx="156" cy="24" r="3" fill="#0E56D8" />
                </svg>
              </div>

              {/* Recent Activity */}
              <div className="col-span-5 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
                <span className="mb-2.5 block text-[8.5px] font-bold text-slate-700">Recent Activity</span>
                <div className="space-y-2">
                  {["bg-rose-400", "bg-amber-400", "bg-emerald-400"].map((dotCls, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="h-4 w-4 shrink-0 rounded-full bg-[#DCE8FF]" />
                      <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotCls}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Floating System Active Card */}
      <div className="absolute bottom-0 right-4 z-20 flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-[0_22px_48px_-10px_rgba(4,24,78,0.45)] motion-safe:animate-[gentleFloat_6.5s_ease-in-out_infinite]">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0E56D8] shadow-sm ring-4 ring-[#EBF3FF]">
          <Check className="h-5 w-5 stroke-[2.5] text-white" />
        </span>
        <div className="leading-tight">
          <span className="block text-xs font-bold text-slate-900">System Active</span>
          <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All Systems OK
          </span>
        </div>
      </div>
    </div>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useAdminLang();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let saved = "";
    try {
      saved = localStorage.getItem(REMEMBER_KEY) || "";
    } catch {
      /* penyimpanan browser tidak tersedia */
    }
    if (saved) {
      setEmail(saved);
      setRemember(true);
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage(t("Mohon masukkan email dan kata sandi.", "Please enter your email and password."));
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || t("Gagal masuk. Periksa kembali email dan kata sandi Anda.", "Sign-in failed. Please check your email and password."));
        setIsLoading(false);
        return;
      }
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* abaikan */
      }
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error("Login fetch error:", err);
      setErrorMessage(t("Terjadi gangguan jaringan. Silakan coba kembali.", "A network error occurred. Please try again."));
      setIsLoading(false);
    }
  };

  const onPasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  const fieldCls =
    "w-full rounded-xl border border-slate-200/90 bg-white py-3.5 pl-12 pr-4 text-[15px] text-slate-900 placeholder-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all focus:border-[#1B6FF2] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#1B6FF2]/10";

  return (
    <div className="flex min-h-screen w-full bg-white p-3 font-sans text-slate-800 sm:p-4 xl:h-screen xl:overflow-hidden xl:p-5">
      <div className="grid w-full flex-1 overflow-hidden rounded-[28px] border border-[#DCE6F5] shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] lg:grid-cols-2 xl:rounded-[32px]">
        {/* KIRI: soft slate-blue form side seamlessly joined to right panel */}
        <div className="flex flex-col justify-between bg-[#F4F8FD] px-6 py-7 sm:px-12 sm:py-8 lg:px-14 lg:py-10 xl:px-20 xl:py-12">
          <div className="mx-auto flex w-full max-w-[440px] items-center justify-start">
            <AdminLanguageToggle />
          </div>

          <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center">
            <Link href="/" className={`mb-7 inline-flex w-fit rounded-lg transition-opacity hover:opacity-90 ${focusRing}`} aria-label={t("Diagnova — ke website", "Diagnova — go to website")}>
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-9 w-auto object-contain sm:h-10" />
            </Link>

            <h1 className="font-display text-3xl font-bold tracking-tight text-[#0E234B] sm:text-[40px] sm:leading-[1.15]">
              {t("Selamat datang kembali!", "Welcome back!")}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600 sm:text-base">
              {t(
                "Masuk ke akun administrator Anda untuk mengelola konten website dan permohonan demo Diagnova.",
                "Sign in to your administrator account to manage website content and Diagnova demo requests."
              )}
            </p>

            {errorMessage && (
              <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[13px] text-red-700 motion-safe:animate-[adminShake_0.35s_ease-in-out]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="sr-only">
                  {t("Alamat email", "Email address")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("Alamat email", "Email address")}
                    required
                    className={fieldCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  {t("Kata sandi", "Password")}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    ref={passwordRef}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={onPasswordKey}
                    onKeyDown={onPasswordKey}
                    onBlur={() => setCapsLock(false)}
                    placeholder={t("Kata sandi", "Password")}
                    required
                    aria-describedby={capsLock ? "caps-hint" : undefined}
                    className={fieldCls + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
                    aria-label={showPassword ? t("Sembunyikan kata sandi", "Hide password") : t("Tampilkan kata sandi", "Show password")}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {capsLock && (
                  <p id="caps-hint" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-amber-700">
                    <Info className="h-3.5 w-3.5" /> {t("Caps Lock sedang aktif", "Caps Lock is on")}
                  </p>
                )}
              </div>

              {/* Ingat saya + lupa kata sandi */}
              <div className="flex items-center justify-between gap-3 pt-0.5 text-[13px]">
                <label className="inline-flex cursor-pointer select-none items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    data-testid="remember-me"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#1B6FF2]"
                  />
                  {t("Ingat saya", "Remember me")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot((v) => !v)}
                  aria-expanded={showForgot}
                  aria-controls="forgot-help"
                  className={`rounded font-semibold text-[#1B6FF2] hover:underline ${focusRing}`}
                >
                  {t("Lupa kata sandi?", "Forgot password?")}
                </button>
              </div>
              {showForgot && (
                <p id="forgot-help" className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-[13px] leading-relaxed text-slate-600">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B6FF2]" />
                  {t(
                    "Kata sandi admin diatur ulang oleh administrator sistem Diagnova. Hubungi administrator untuk meminta kata sandi baru.",
                    "Admin passwords are reset by the Diagnova system administrator. Contact the administrator to request a new password."
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B6FF2] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-6px_rgba(27,111,242,0.45)] transition-all hover:bg-[#1459D0] active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("Memverifikasi…", "Verifying…")}
                  </>
                ) : (
                  <>
                    {t("Masuk", "Sign in")} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-slate-500">
              {t("Belum punya akun admin?", "Don't have an admin account?")}{" "}
              <span className="font-semibold text-[#1B6FF2]">{t("Hubungi administrator sistem.", "Contact system administrator.")}</span>
            </p>
          </div>

          <div className="mx-auto w-full max-w-[440px]">
            <Link href="/" className={`inline-flex w-fit items-center gap-1.5 rounded text-[13px] font-medium text-slate-500 transition-colors hover:text-[#0E234B] ${focusRing}`}>
              <ArrowLeft className="h-3.5 w-3.5" /> {t("Kembali ke website Diagnova", "Back to Diagnova website")}
            </Link>
          </div>
        </div>

        {/* KANAN: smooth abstract mesh-gradient Diagnova blue brand panel */}
        <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F5BE0] via-[#0B46B5] to-[#072B7A] px-10 py-10 text-white lg:flex xl:px-14 xl:py-12">
          {/* Smooth layered abstract mesh & silk-light gradients (no hard geometric edges) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(96,165,250,0.40),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.32),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(4,22,72,0.72),transparent_65%)]" />
          <div className="pointer-events-none absolute -right-24 top-1/4 h-[380px] w-[520px] -rotate-12 rounded-full bg-[#60A5FA]/20 blur-[110px]" />
          <div className="pointer-events-none absolute -left-24 bottom-1/4 h-[320px] w-[420px] rotate-12 rounded-full bg-[#38BDF8]/15 blur-[110px]" />

          <div className="relative flex flex-1 items-center justify-center">
            <PanelIllustration />
          </div>

          <div className="relative mx-auto w-full max-w-[580px] text-left">
            <h2 className="max-w-lg font-display text-2xl font-bold leading-tight text-white sm:text-[32px] xl:text-[34px]">
              {t("Laboratorium Lebih Cerdas untuk Keputusan Lebih Baik", "Smarter Laboratory for Better Decisions")}
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-blue-100/90 sm:text-base">
              {t(
                "Teknologi mutakhir untuk menyederhanakan alur kerja laboratorium dan menghadirkan hasil yang lebih akurat.",
                "Cutting-edge technology to streamline lab workflows and deliver accurate results faster."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EEF2F8]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
