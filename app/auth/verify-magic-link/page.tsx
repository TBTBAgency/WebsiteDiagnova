import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, AlertTriangle, ArrowRight, Clock, KeyRound } from "lucide-react";
import {
  inspectMagicLink,
  MAGIC_LINK_FAILURE_MESSAGES,
  MagicLinkFailureReason,
} from "@/lib/magic-link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akses Demo Diagnova",
  robots: { index: false, follow: false },
  // Token ada di URL: Referer hanya dikirim ke origin sendiri, tidak ke tautan eksternal
  // (mis. WhatsApp). "no-referrer" tidak dipakai karena membuat browser mengirim Origin: null.
  referrer: "same-origin",
};

interface PageProps {
  searchParams: { token?: string; error?: string };
}

const KNOWN_REASONS = Object.keys(MAGIC_LINK_FAILURE_MESSAGES) as MagicLinkFailureReason[];

function FailureCard({ reason }: { reason: MagicLinkFailureReason }) {
  const isMissing = reason === "missing";
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div
          className={`h-16 w-16 rounded-2xl mx-auto flex items-center justify-center shadow-xs border ${
            isMissing ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
        >
          {isMissing ? <AlertTriangle className="h-8 w-8" /> : <ShieldAlert className="h-8 w-8" />}
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 font-display">
            {isMissing ? "Tautan Tidak Lengkap" : "Tautan Tidak Dapat Digunakan"}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">{MAGIC_LINK_FAILURE_MESSAGES[reason]}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>Ketentuan Keamanan Akses Demo Diagnova:</span>
          </div>
          <ul className="text-slate-500 space-y-1 text-[11px] list-disc list-inside">
            <li>
              Tautan Magic Link harus dibuka pertama kali dalam <strong>24 jam</strong> sejak dibuat.
            </li>
            <li>Setelah aktif, tautan yang sama dapat dipakai untuk masuk kembali sampai masa akses demo berakhir. Hanya tautan terbaru yang berlaku.</li>
            <li>Jika Anda memerlukan tautan baru, silakan hubungi tim sales kami.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href="https://wa.me/6281991070928?text=Halo%20Tim%20Diagnova,%20saya%20memerlukan%20bantuan%20tautan%20akses%20demo."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Hubungi Spesialis via WhatsApp</span>
          </a>
          <Link
            href={isMissing ? "/request-demo" : "/"}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <span>{isMissing ? "Ajukan Demo Baru" : "Kembali ke Beranda"}</span>
            {isMissing && <ArrowRight className="h-4 w-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Halaman tautan magic link. GET hanya MEMERIKSA token (tidak mengonsumsi),
 * sehingga crawler / pratinjau tautan tidak menghabiskan token. Login baru terjadi
 * saat pengguna menekan tombol konfirmasi (form POST ke /api/auth/magic-link).
 */
export default async function VerifyMagicLinkPage({ searchParams }: PageProps) {
  if (searchParams.error) {
    const reason = KNOWN_REASONS.includes(searchParams.error as MagicLinkFailureReason)
      ? (searchParams.error as MagicLinkFailureReason)
      : "invalid";
    return <FailureCard reason={reason} />;
  }

  const token = searchParams.token;
  const status = await inspectMagicLink(token);

  if (!status.valid) {
    return <FailureCard reason={status.reason} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mx-auto flex items-center justify-center shadow-xs">
          <KeyRound className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 font-display">Akses Demo Diagnova</h2>
          {status.returning ? (
            <p className="text-xs text-slate-600 leading-relaxed" data-testid="magic-link-returning">
              Selamat datang kembali, <strong>{status.leadName}</strong> ({status.institution}). Akses demo Anda masih
              aktif
              {status.accessExpiresAt
                ? ` hingga ${new Date(status.accessExpiresAt).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "medium", timeStyle: "short" })} WIB`
                : ""}
              . Tekan tombol di bawah untuk masuk kembali.
            </p>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed" data-testid="magic-link-first">
              Halo <strong>{status.leadName}</strong> ({status.institution}). Tekan tombol di bawah untuk masuk ke
              sesi demo Anda. Setelah aktif, tautan ini dapat dipakai untuk masuk kembali selama masa akses demo.
            </p>
          )}
        </div>

        <form method="POST" action="/api/auth/magic-link" className="pt-2">
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Masuk ke Demo</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[11px] text-slate-400">
          Bukan Anda yang meminta akses ini? Abaikan halaman ini — tidak ada perubahan yang terjadi.
        </p>
      </div>
    </div>
  );
}
