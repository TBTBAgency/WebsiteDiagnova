import React from "react";
import Link from "next/link";
import { Clock, ShieldX, PhoneCall, ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function DemoExpiredPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <BrandLogo />
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          Ke Website Utama
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-lg mx-auto w-full my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center shadow-xs">
            <Clock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
              Masa Akses Selesai
            </span>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Masa Uji Coba Demo Telah Berakhir
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Terima kasih telah mencoba Diagnova LIS Platform. Periode masa aktif akun demo laboratorium Anda telah mencapai batas durasi yang ditentukan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-left text-xs space-y-2.5">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Langkah Selanjutnya untuk Laboratorium Anda:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dapatkan implementasi penuh Diagnova LIS terintegrasi dengan mesin analyzer otomatis (HL7/ASTM standard), modul barcode pre-analitik, bridging HIS/SIMRS, dan dukungan teknis 24/7.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://wa.me/6281991070928?text=Halo%20Tim%20Diagnova,%20saya%20tertarik%20melanjutkan%20langganan%20dan%20implementasi%20penuh%20Diagnova%20LIS%20Platform."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Hubungi Sales & Konsultasi</span>
            </a>
            <Link
              href="/request-demo"
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ajukan Ulang</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 pt-6">
        © {new Date().getFullYear()} Diagnova LIS Platform. Hak Cipta Dilindungi.
      </div>
    </div>
  );
}

