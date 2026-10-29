"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  Brain,
  ShieldAlert,
  Bot,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function NovaAiPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Main Feature Announcement Card */}
      <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 sm:p-10 shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center mx-auto text-purple-600 shadow-2xs">
          <Sparkles className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700">
          <Bot className="h-3.5 w-3.5" />
          <span>Roadmap Fase 4: Nova AI Clinical Decision Support</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] font-display tracking-tight">
          Nova AI — Intelligent Laboratory Copilot
        </h2>

        <p className="text-xs sm:text-sm text-[#747B86] max-w-2xl mx-auto leading-relaxed">
          Copilot klinis terintegrasi yang membantu merangkum pola abnormalitas diagnostik, korelasi antar-parameter laboratorium, dan rekomendasi konfirmasi spesimen berbasis bukti ilmiah terkini.
        </p>

        {/* Clinical Disclaimer Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 max-w-xl mx-auto text-left flex gap-3 text-xs text-amber-800">
          <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Prinsip Keselamatan Pasien:</span> Nova AI bertindak sebagai asisten pembantu rangkuman. Keputusan klinis dan diagnosis akhir tetap sepenuhnya menjadi wewenang dan tanggung jawab dokter spesialis.
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087BEE] hover:bg-[#0667C7] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <span>Buka Lab Orders</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F6F8] hover:bg-slate-200/80 text-xs font-semibold text-[#17191D] transition-colors"
          >
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Feature Capabilities Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">Rangkuman Pola Anomali</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            Menghubungkan hasil hematologi, kimia darah, dan urin lengkap untuk menyajikan narasi klinis komprehensif.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#087BEE] flex items-center justify-center">
            <Lightbulb className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">Rekomendasi Uji Lanjutan</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            Saran pemeriksaan konfirmasi (Reflex Testing) sesuai pedoman klinis standar perhimpunan patologi.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#16A374] flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">Human-in-the-Loop</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            Dokter memiliki kendali penuh untuk menyetujui (Accept), mengedit, atau menolak interpretasi AI dengan log jejak model.
          </p>
        </div>
      </div>
    </div>
  );
}
