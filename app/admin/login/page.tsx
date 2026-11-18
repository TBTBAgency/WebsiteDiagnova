"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  Info,
  Loader2,
  Lock,
  Mail,
  Share2,
  Sparkles,
} from "lucide-react";
import { AdminLanguageToggle, useAdminLang } from "@/components/admin/AdminLanguage";

/** Pesan panel kanan (berganti otomatis). */
const SLIDES = [
  {
    title: "Laboratorium Lebih Cerdas untuk Keputusan Lebih Baik",
    titleEn: "Smarter Laboratory for Better Decisions",
    text: "Menghubungkan orang, spesimen, instrumen, dan informasi dalam satu ekosistem yang cerdas.",
    textEn: "Connecting people, specimens, instruments, and information in one intelligent ecosystem.",
  },
  {
    title: "Satu Portal untuk Konten & Permohonan Demo",
    titleEn: "One Portal for Content & Demo Requests",
    text: "Kelola website, permohonan demo, dan akses klien Diagnova dari satu tempat yang aman.",
    textEn: "Manage the Diagnova website, demo requests, and client access from one secure place.",
  },
  {
    title: "Setiap Perubahan Tercatat",
    titleEn: "Every Change Is Recorded",
    text: "Audit log merekam setiap aksi admin sehingga pengelolaan tetap transparan dan dapat ditelusuri.",
    textEn: "The audit log records every admin action, keeping management transparent and traceable.",
  },
];

/** Email terakhir disimpan di browser ini bila "Ingat saya" dicentang (tanpa kata sandi). */
const REMEMBER_KEY = "diagnova_admin_email";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D6FF2] focus-visible:ring-offset-2";

/** Ilustrasi panel kanan: jendela dashboard + ikon mengambang (dekoratif, tanpa data). */
function PanelIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[480px]" aria-hidden="true">
      {/* orbit */}
      <div className="absolute inset-[6%] rounded-full border border-white/15" />
      <div className="absolute inset-[18%] rounded-full border border-white/10" />

      {/* ikon mengambang */}
      {[
        { Icon: FlaskConical, cls: "left-[2%] top-[12%]", delay: "0s" },
        { Icon: FileText, cls: "left-[-3%] top-[42%]", delay: "1.2s" },
        { Icon: Share2, cls: "left-[6%] top-[70%]", delay: "2.4s" },
      ].map(({ Icon, cls, delay }, i) => (
        <div
          key={i}
          className={`absolute ${cls} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg shadow-blue-950/20 backdrop-blur-sm motion-safe:animate-[gentleFloat_6s_ease-in-out_infinite]`}
          style={{ animationDelay: delay }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      ))}

      {/* jendela dashboard */}
      <div className="absolute right-[2%] top-[14%] w-[74%] rounded-2xl bg-white p-3.5 shadow-2xl shadow-blue-950/30">
        <div className="mb-3 flex items-center gap-2">
          <Image src="/images/logo-nav.png" alt="" width={80} height={22} className="h-3.5 w-auto object-contain" />
          <span className="ml-auto flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </span>
        </div>
        <div className="flex gap-3">
          <div className="hidden w-[22%] flex-col gap-1.5 pt-0.5 sm:flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "w-full bg-blue-500/70" : "w-4/5 bg-slate-200"}`} />
            ))}
          </div>
          <div className="flex-1 space-y-2.5">
            <div className="grid grid-cols-3 gap-1.5">
              {["bg-blue-50", "bg-emerald-50", "bg-amber-50"].map((bg, i) => (
                <div key={i} className={`rounded-lg ${bg} space-y-1 p-1.5`}>
                  <span className="block h-1 w-2/3 rounded-full bg-slate-300/80" />
                  <span className="block h-2 w-1/2 rounded-full bg-slate-500/70" />
                </div>
              ))}
            </div>
            <svg viewBox="0 0 200 60" className="h-14 w-full">
              <defs>
                <linearGradient id="lg-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 46 L25 40 L50 44 L75 28 L100 32 L125 18 L150 24 L175 10 L200 14 L200 60 L0 60 Z" fill="url(#lg-area)" />
              <path d="M0 46 L25 40 L50 44 L75 28 L100 32 L125 18 L150 24 L175 10 L200 14" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div className="space-y-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-md bg-blue-100" />
                  <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
                  <span className="h-1.5 w-6 rounded-full bg-slate-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* chip asisten */}
      <div className="absolute bottom-[8%] right-[-2%] flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-blue-950/25 motion-safe:animate-[gentleFloat_7s_ease-in-out_infinite]">
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
        <span className="text-[11px] leading-tight">
          <span className="block font-bold text-slate-900">Nova AI</span>
          <span className="mt-0.5 flex gap-0.5">
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-500" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-blue-300 [animation-delay:300ms]" />
          </span>
        </span>
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
  const [slide, setSlide] = useState(0);
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
    const timer = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
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
    "w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-[#1D6FF2] focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-[#1D6FF2]/10";

  return (
    <div className="flex min-h-screen items-stretch bg-[#EEF2F8] p-3 font-sans text-slate-800 sm:p-5 lg:p-6">
      <div className="mx-auto grid w-full max-w-[1280px] overflow-hidden rounded-[28px] bg-white shadow-xl shadow-slate-300/40 lg:grid-cols-2">
        {/* KIRI: form */}
        <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className={`inline-flex w-fit rounded-lg transition-opacity hover:opacity-90 ${focusRing}`} aria-label={t("Diagnova — ke website", "Diagnova — go to website")}>
              <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-9 w-auto object-contain sm:h-10" />
            </Link>
            <AdminLanguageToggle />
          </div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10 lg:mx-0">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#0F1B3D] sm:text-[36px]">{t("Selamat datang kembali!", "Welcome back!")}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {t(
                "Masuk ke akun administrator untuk mengelola konten website, permohonan demo, dan pengguna Diagnova.",
                "Sign in to your administrator account to manage Diagnova's website content, demo requests, and users."
              )}
            </p>

            {errorMessage && (
              <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 motion-safe:animate-[adminShake_0.35s_ease-in-out]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t("Alamat email", "Email address")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("nama@diagnova.id", "name@diagnova.id")}
                    required
                    className={fieldCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-slate-700">
                  {t("Kata sandi", "Password")}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
                    placeholder={t("Masukkan kata sandi", "Enter your password")}
                    required
                    aria-describedby={capsLock ? "caps-hint" : undefined}
                    className={fieldCls + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
                    aria-label={showPassword ? t("Sembunyikan kata sandi", "Hide password") : t("Tampilkan kata sandi", "Show password")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {capsLock && (
                  <p id="caps-hint" className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Info className="h-3.5 w-3.5" /> {t("Caps Lock sedang aktif", "Caps Lock is on")}
                  </p>
                )}
              </div>

              {/* Ingat saya + lupa kata sandi */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <label className="inline-flex cursor-pointer select-none items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    data-testid="remember-me"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#1D6FF2]"
                  />
                  {t("Ingat saya", "Remember me")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot((v) => !v)}
                  aria-expanded={showForgot}
                  aria-controls="forgot-help"
                  className={`rounded font-semibold text-[#1D6FF2] hover:underline ${focusRing}`}
                >
                  {t("Lupa kata sandi?", "Forgot password?")}
                </button>
              </div>
              {showForgot && (
                <p id="forgot-help" className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-relaxed text-slate-600">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1D6FF2]" />
                  {t(
                    "Kata sandi admin diatur ulang oleh administrator sistem Diagnova. Hubungi administrator untuk meminta kata sandi baru.",
                    "Admin passwords are reset by the Diagnova system administrator. Contact the administrator to request a new password."
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D6FF2] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-[#165DD0] active:scale-[0.99] disabled:opacity-60"
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

            <p className="mt-6 text-center text-xs text-slate-500">
              {t("Belum punya akun admin?", "Don't have an admin account?")}{" "}
              <span className="font-semibold text-slate-700">{t("Hubungi administrator sistem.", "Contact the system administrator.")}</span>
            </p>
          </div>

          <Link href="/" className={`inline-flex w-fit items-center gap-1.5 rounded text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 ${focusRing}`}>
            <ArrowLeft className="h-3.5 w-3.5" /> {t("Kembali ke website Diagnova", "Back to the Diagnova website")}
          </Link>
        </div>

        {/* KANAN: panel brand */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1D6FF2] via-[#1659D8] to-[#0B3FA8] px-12 py-12 text-white lg:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}
          />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-1 items-center">
            <PanelIllustration />
          </div>

          <div className="relative">
            <h2 key={slide} className="max-w-md font-display text-2xl font-bold leading-tight text-white motion-safe:animate-[fadeSlideUp_0.45s_ease-out] xl:text-[28px]" aria-live="polite">
              {t(SLIDES[slide].title, SLIDES[slide].titleEn)}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100/90">{t(SLIDES[slide].text, SLIDES[slide].textEn)}</p>
            <div className="mt-6 flex gap-2" role="tablist" aria-label={t("Pesan", "Messages")}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={t(`Pesan ${i + 1}`, `Message ${i + 1}`)}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === slide ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
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
