"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/orders";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuickFill = (type: "super_admin" | "sales_admin") => {
    if (type === "super_admin") {
      setEmail("admin@diagnova.id");
      setPassword("Diagnova2026!");
    } else {
      setEmail("sales@diagnova.id");
      setPassword("Sales2026!");
    }
    setErrorMessage("");
  };

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

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-[128px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-xl shadow-slate-200/50">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <Link href="/" className="mb-4 inline-block hover:opacity-90 transition-opacity">
              <div className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none font-display">
                    DIAGNOVA
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-blue-600 font-bold">
                    Laboratory Intelligence
                  </span>
                </div>
              </div>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Portal Internal LIS & Admin</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-display">Masuk ke Sistem</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Autentikasi terenkripsi untuk Analis Laboratorium, Dokter Sp.PK, dan Admin.
            </p>
          </div>

          {/* Quick Demo Fill Box */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold mb-2">
              <span>Akun Demo Bawaan:</span>
              <span className="text-[10px] text-blue-600 font-bold">Klik untuk isi</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("super_admin")}
                className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors text-left flex flex-col shadow-2xs"
              >
                <span className="text-slate-900 font-bold">Super Admin</span>
                <span className="text-[10px] text-slate-400 font-mono">admin@diagnova.id</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("sales_admin")}
                className="py-2 px-2.5 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors text-left flex flex-col shadow-2xs"
              >
                <span className="text-slate-900 font-bold">Sales Admin</span>
                <span className="text-[10px] text-slate-400 font-mono">sales@diagnova.id</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@diagnova.id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors inline-flex items-center gap-1"
            >
              ← Kembali ke Website Diagnova
            </Link>
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
