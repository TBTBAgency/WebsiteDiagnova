"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

type ViewState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

/** Ambil token dari fragment (#token=...) atau, untuk tautan lama, dari query (?token=...). */
function readTokenFromLocation(): string | null {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const fromHash = hash.get("token");
  if (fromHash) return fromHash;
  return new URLSearchParams(window.location.search).get("token");
}

export function MagicLinkConsent() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<ViewState>({ kind: "loading" });

  useEffect(() => {
    const found = readTokenFromLocation();
    // Hapus token dari address bar & riwayat browser segera setelah dibaca
    window.history.replaceState(null, "", window.location.pathname);
    if (found) {
      setToken(found);
      setState({ kind: "ready" });
    } else {
      setState({ kind: "missing" });
    }
  }, []);

  const handleContinue = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/auth/magic-link/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json?.success) {
        window.location.replace(json.data?.redirectUrl || "/demo");
        return;
      }
      if (json?.data?.redirectUrl) {
        window.location.replace(json.data.redirectUrl);
        return;
      }
      setToken(null);
      setState({
        kind: "error",
        message: json?.message || "Tautan tidak dapat digunakan. Silakan minta tautan baru kepada tim Diagnova.",
      });
    } catch {
      setState({ kind: "error", message: "Gagal terhubung ke server. Periksa koneksi Anda lalu coba lagi." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        {(state.kind === "loading" || state.kind === "ready" || state.kind === "submitting") && (
          <>
            <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-slate-900 font-display">Akses Demo Diagnova</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tekan tombol di bawah untuk masuk ke akun demo Anda. Tautan ini hanya dapat digunakan satu kali.
              </p>
            </div>
            <button
              type="button"
              onClick={handleContinue}
              disabled={state.kind !== "ready"}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              {state.kind === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </>
        )}

        {state.kind === "missing" && (
          <>
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-display">Tautan Tidak Lengkap</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tautan yang Anda buka tidak memuat kode akses. Buka kembali tautan lengkap yang dikirim tim Diagnova.
            </p>
          </>
        )}

        {state.kind === "error" && (
          <>
            <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-display">Tautan Tidak Dapat Digunakan</h1>
            <p className="text-xs text-slate-500 leading-relaxed">{state.message}</p>
          </>
        )}

        {(state.kind === "missing" || state.kind === "error") && (
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            <span>Ajukan Demo Baru</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
