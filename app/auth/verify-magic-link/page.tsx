import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { verifyAndConsumeMagicLink } from "@/lib/magic-link";
import { ShieldAlert, AlertTriangle, ArrowRight, Sparkles, Building2, Clock } from "lucide-react";

interface PageProps {
  searchParams: { token?: string };
}

export default async function VerifyMagicLinkPage({ searchParams }: PageProps) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Tautan Tidak Lengkap</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tautan akses demo yang Anda buka tidak memiliki parameter token verifikasi yang valid.
          </p>
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Ajukan Demo Baru</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const reqHeaders = headers();
  const clientIp = reqHeaders.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const userAgent = reqHeaders.get("user-agent") || "";

  const result = await verifyAndConsumeMagicLink(token, clientIp, userAgent);

  if (result.success && result.redirectUrl) {
    redirect(result.redirectUrl);
  }

  if (result.isExpired) {
    redirect("/demo-expired");
  }

  // Jika gagal validasi (misal token sudah pernah dipakai atau token kedaluwarsa)
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center shadow-xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 font-display">Tautan Tidak Dapat Digunakan</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{result.message}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>Ketentuan Keamanan Akses Demo Diagnova:</span>
          </div>
          <ul className="text-slate-500 space-y-1 text-[11px] list-disc list-inside">
            <li>Tautan Magic Link bersifat <strong>sekali pakai</strong> (single-use).</li>
            <li>Tautan memiliki masa kedaluwarsa 24 jam sejak disetujui admin.</li>
            <li>Jika Anda memerlukan tautan baru, silakan hubungi tim sales kami.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href="https://wa.me/6281991070928?text=Halo%20Tim%20Diagnova,%20saya%20memerlukan%20bantuan%20tautan%20demo%20LIS%20yang%20telah%20kedaluwarsa."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Hubungi Spesialis via WhatsApp</span>
          </a>
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

