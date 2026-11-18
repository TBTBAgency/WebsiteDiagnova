"use client";

import React, { Suspense, useEffect, useState } from "react";
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
  Loader2,
  Lock,
  Mail,
  Share2,
  Sparkles,
} from "lucide-react";

/** Pesan panel kanan (berganti otomatis). */
const SLIDES = [
  {
    title: "Laboratorium Lebih Cerdas untuk Keputusan Lebih Baik",
    text: "Menghubungkan orang, spesimen, instrumen, dan informasi dalam satu ekosistem yang cerdas.",
  },
  {
    title: "Satu Portal untuk Konten & Permohonan Demo",
    text: "Kelola website, permohonan demo, dan akses klien Diagnova dari satu tempat yang aman.",
  },
  {
    title: "Setiap Perubahan Tercatat",
    text: "Audit log merekam setiap aksi admin sehingga pengelolaan tetap transparan dan dapat ditelusuri.",
  },
];

/** Ilustrasi panel kanan (dekoratif, tanpa data). */
function PanelIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] aspect-[4/3]" aria-hidden="true">
      {/* orbit */}
      <div className="absolute inset-[6%] rounded-full border border-white/15" />
      <div className="absolute inset-[18%] rounded-full border border-white/10" />

      {/* floating tiles */}
      {[
        { Icon: FlaskConical, cls: "left-[2%] top-[12%]" },
        { Icon: FileText, cls: "left-[-2%] top-[42%]" },
        { Icon: Share2, cls: "left-[6%] top-[70%]" },
      ].map(({ Icon, cls }, i) => (
        <div
          key={i}
          className={`absolute ${cls} h-12 w-12 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-blue-950/20`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      ))}

      {/* mock dashboard window */}
      <div className="absolute right-[2%] top-[14%] w-[74%] rounded-2xl bg-white shadow-2xl shadow-blue-950/30 p-3.5">
        <div className="flex items-center gap-2 mb-3">
          <Image src="/images/logo-nav.png" alt="" width={80} height={22} className="h-3.5 w-auto object-contain" />
          <span className="ml-auto flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </span>
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:flex w-[22%] flex-col gap-1.5 pt-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "bg-blue-500/70 w-full" : "bg-slate-200 w-4/5"}`} />
            ))}
          </div>
          <div className="flex-1 space-y-2.5">
            <div className="grid grid-cols-3 gap-1.5">
              {["bg-blue-50", "bg-emerald-50", "bg-amber-50"].map((bg, i) => (
                <div key={i} className={`rounded-lg ${bg} p-1.5 space-y-1`}>
                  <span className="block h-1 w-2/3 rounded-full bg-slate-300/80" />
                  <span className="block h-2 w-1/2 rounded-full bg-slate-500/70" />
                </div>
              ))}
            </div>
            <svg viewBox="0 0 200 60" className="w-full h-14">
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

      {/* assistant chip */}
      <div className="absolute right-[-2%] bottom-[8%] rounded-2xl bg-white shadow-xl shadow-blue-950/25 px-3 py-2 flex items-center gap-2">
        <span className="h-7 w-7 rounded-xl bg-blue-600 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
        <span className="text-[11px] leading-tight">
          <span className="block font-bold text-slate-900">Nova AI</span>
          <span className="flex gap-0.5 mt-0.5">
            <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
            <span className="h-1 w-1 rounded-full bg-blue-400 animate-pulse [animation-delay:150ms]" />
            <span className="h-1 w-1 rounded-full bg-blue-300 animate-pulse [animation-delay:300ms]" />
          </span>
        </span>
      </div>
    </div>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Mohon masukkan email dan kata sandi.");
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
        setErrorMessage(data.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
        setIsLoading(false);
        return;
      }
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error("Login fetch error:", err);
      setErrorMessage("Terjadi gangguan jaringan. Silakan coba kembali.");
      setIsLoading(false);
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-hidden transition-colors";

  return (
    <div className="min-h-screen bg-[#EEF2F8] p-3 sm:p-5 lg:p-6 flex items-stretch font-sans text-slate-800">
      <div className="mx-auto w-full max-w-[1280px] grid lg:grid-cols-2 rounded-[28px] bg-white shadow-xl shadow-slate-300/40 overflow-hidden">
        {/* LEFT: form */}
        <div className="flex flex-col px-6 py-8 sm:px-12 lg:px-16 xl:px-20">
          <Link href="/" className="inline-flex w-fit hover:opacity-90 transition-opacity" aria-label="Diagnova — ke website">
            <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-9 sm:h-10 w-auto object-contain" />
          </Link>

          <div className="flex-1 flex flex-col justify-center py-10 max-w-[420px] w-full mx-auto lg:mx-0">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-semibold text-blue-700 mb-4">
              <Lock className="h-3 w-3" /> Portal Admin Diagnova
            </span>
            <h1 className="font-display text-3xl sm:text-[34px] font-bold tracking-tight text-[#0F1B3D]">Selamat datang kembali!</h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Masuk ke akun administrator untuk mengelola konten website, permohonan demo, dan pengguna Diagnova.
            </p>

            {errorMessage && (
              <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@diagnova.id"
                    required
                    className={fieldCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    className={fieldCls + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D6FF2] hover:bg-[#165DD0] py-3 px-4 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi…
                  </>
                ) : (
                  <>
                    Masuk <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-slate-500">
              Lupa kata sandi atau belum punya akun admin? Hubungi administrator sistem Diagnova.
            </p>
          </div>

          <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke website Diagnova
          </Link>
        </div>

        {/* RIGHT: brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1D6FF2] via-[#1659D8] to-[#0B3FA8] px-12 py-12 text-white">
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}
          />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative flex-1 flex items-center">
            <PanelIllustration />
          </div>

          <div className="relative">
            <h2 className="font-display text-2xl xl:text-[28px] font-bold leading-tight max-w-md text-white" aria-live="polite">
              {SLIDES[slide].title}
            </h2>
            <p className="mt-3 text-sm text-blue-100/90 max-w-md leading-relaxed">{SLIDES[slide].text}</p>
            <div className="mt-6 flex gap-2" role="tablist" aria-label="Pesan">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  aria-label={`Pesan ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
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
        <div className="min-h-screen bg-[#EEF2F8] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
