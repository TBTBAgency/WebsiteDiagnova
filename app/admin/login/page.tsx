"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";

/** Pesan panel kanan (berganti otomatis). */
const SLIDES = [
  {
    title: "Laboratorium lebih cerdas untuk keputusan lebih baik",
    text: "Menghubungkan orang, spesimen, instrumen, dan informasi dalam satu ekosistem yang cerdas.",
  },
  {
    title: "Satu portal untuk konten & permohonan demo",
    text: "Kelola website, permohonan demo, dan akses klien Diagnova dari satu tempat yang aman.",
  },
  {
    title: "Setiap perubahan tercatat",
    text: "Audit log merekam setiap aksi admin sehingga pengelolaan tetap transparan dan dapat ditelusuri.",
  },
];

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] focus-visible:ring-offset-2";

/** Panel kanan: foto + pesan bergilir. */
function BrandPanel({ slide, setSlide }: { slide: number; setSlide: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <div className="relative hidden overflow-hidden rounded-[32px] bg-[#1F6BFF] lg:block">
      <Image
        src="/images/hero-scientist.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover object-[72%_50%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2E86] via-[#1F6BFF]/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1F6BFF]/70 via-transparent to-transparent" aria-hidden="true" />

      {/* Pesan bergilir */}
      <div className="absolute inset-x-0 bottom-0 p-10">
        <h2 className="max-w-md font-display text-[30px] font-semibold leading-[1.15] tracking-tight text-white" aria-live="polite">
          {SLIDES[slide].title}
        </h2>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/80">{SLIDES[slide].text}</p>
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Pesan">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Pesan ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${i === slide ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
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
  const [capsLock, setCapsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [slide, setSlide] = useState(0);
  const [year, setYear] = useState<number | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
    emailRef.current?.focus();
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

  const onPasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  const fieldCls =
    "h-[52px] w-full rounded-2xl border border-transparent bg-[#F3F4F6] pl-12 pr-4 text-[14px] text-[#111318] placeholder-[#9AA0A9] transition-colors focus:border-[#1F6BFF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F6BFF]/10 aria-[invalid=true]:border-[#F04438]/60";

  return (
    <div className="grid min-h-screen bg-white font-sans text-[#111318] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:p-4">
      {/* KIRI: form */}
      <div className="flex min-w-0 flex-col px-6 py-6 sm:px-12 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className={`inline-flex rounded-full transition-opacity hover:opacity-90 ${focusRing}`} aria-label="Diagnova — ke website">
            <Image src="/images/logo-nav.png" alt="Diagnova" width={240} height={66} priority className="h-9 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 rounded-full border border-[#E4E6EA] px-4 py-2 text-[12px] font-medium text-[#3B4049] transition-colors hover:bg-[#F3F4F6] ${focusRing}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke website
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F3F4F6] py-1 pl-1 pr-3 text-[11px] font-semibold text-[#3B4049]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111318] text-white">
              <Lock className="h-3 w-3" />
            </span>
            Portal Admin Diagnova
          </span>
          <h1 className="mt-5 font-display text-[34px] font-semibold leading-[1.1] tracking-tight text-[#111318] sm:text-[40px]">
            Selamat datang
            <br />
            kembali!
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[#8A8F98]">
            Masuk ke akun administrator untuk mengelola konten website, permohonan demo, dan pengguna Diagnova.
          </p>

          {errorMessage && (
            <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-2xl border border-[#FECDCA] bg-[#FEF3F2] p-3.5 text-[13px] text-[#B42318] motion-safe:animate-[adminShake_0.35s_ease-in-out]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-[12px] font-semibold text-[#3B4049]">
                Alamat email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9AA0A9]" />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@diagnova.id"
                  required
                  aria-invalid={!!errorMessage && !email}
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[12px] font-semibold text-[#3B4049]">
                Kata sandi
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9AA0A9]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={onPasswordKey}
                  onKeyDown={onPasswordKey}
                  onBlur={() => setCapsLock(false)}
                  placeholder="Masukkan kata sandi"
                  required
                  aria-invalid={!!errorMessage && !password}
                  aria-describedby={capsLock ? "caps-hint" : undefined}
                  className={fieldCls + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#9AA0A9] transition-colors hover:bg-[#E8EAED] hover:text-[#3B4049] ${focusRing}`}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {capsLock && (
                <p id="caps-hint" className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#B45309]">
                  <Info className="h-3.5 w-3.5" /> Caps Lock sedang aktif
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`group mt-3 flex h-[56px] w-full items-center justify-between rounded-full bg-[#111318] pl-7 pr-2 text-[14px] font-semibold text-white shadow-[0_12px_30px_rgba(17,19,24,0.22)] transition-all hover:bg-[#23262D] active:scale-[0.99] disabled:opacity-70 ${focusRing}`}
            >
              <span>{isLoading ? "Memverifikasi…" : "Masuk ke Dashboard"}</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1F6BFF] transition-transform group-hover:translate-x-0.5">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[#F7F8FA] p-3.5 text-[12px] leading-relaxed text-[#5B616B]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#9AA0A9]" />
            <span>Lupa kata sandi atau belum punya akun admin? Hubungi administrator sistem Diagnova.</span>
          </div>
        </div>

        <p className="text-[11px] text-[#9AA0A9]">
          {year ? `© ${year} ` : ""}Diagnova · Akses khusus administrator. Klien demo masuk melalui Magic Link.
        </p>
      </div>

      {/* KANAN: panel brand */}
      <BrandPanel slide={slide} setSlide={setSlide} />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F6BFF]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
