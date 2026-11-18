"use client";

import React from "react";
import {
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Sliders,
} from "lucide-react";
import Link from "next/link";
import { useAdminLang } from "@/components/admin/AdminLanguage";

export default function AnalyticsQcPage() {
  const { t } = useAdminLang();
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Main Feature Announcement Card */}
      <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 sm:p-10 shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-[#E5A23B] shadow-2xs">
          <Activity className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-[#E5A23B]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{t("Roadmap Fase 3: Analitik, Delta Check & Nilai Kritis", "Roadmap Phase 3: Analytics, Delta Check & Critical Values")}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] font-display tracking-tight">
          {t(
            "Worklist Analisis & Validasi Klinis",
            "Analysis Worklist & Clinical Validation"
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#747B86] max-w-2xl mx-auto leading-relaxed">
          {t(
            "Modul ini akan menyediakan antarmuka kerja terpadu bagi analis laboratorium (ATLM) dan dokter spesialis patologi klinik (Sp.PK), dilengkapi otomatisasi Delta Check, verifikasi rentang rujukan, dan notifikasi nilai panik (Panic Value).",
            "This module will provide a unified workspace for medical laboratory technologists (ATLM) and clinical pathologists (Sp.PK), with automated Delta Check, reference range verification, and panic value notifications."
          )}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087BEE] hover:bg-[#0667C7] text-xs font-semibold text-white transition-all shadow-xs"
          >
            <span>{t("Buka Lab Orders Pre-Analitik", "Open Pre-Analytical Lab Orders")}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F6F8] hover:bg-slate-200/80 text-xs font-semibold text-[#17191D] transition-colors"
          >
            <span>{t("Kembali ke Dashboard", "Back to Dashboard")}</span>
          </Link>
        </div>
      </div>

      {/* Feature Capabilities Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-blue-50 text-[#087BEE] flex items-center justify-center">
            <Sliders className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">Delta Check Engine</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            {t(
              "Mendeteksi lonjakan ekstrim hasil tes laboratorium pasien dibandingkan riwayat tes sebelumnya.",
              "Detects extreme shifts in a patient's lab results compared with their previous test history."
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#DC5A5A] flex items-center justify-center">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">Critical Values Alert</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            {t(
              "Sistem peringatan nilai kritis otomatis dengan alur read-back wajib dokter dan rekaman waktu respon.",
              "Automated critical value alerts with a mandatory physician read-back workflow and response time logging."
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs space-y-2">
          <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#16A374] flex items-center justify-center">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[#17191D]">{t("Validasi Berjenjang Sp.PK", "Tiered Sp.PK Validation")}</h4>
          <p className="text-[11px] text-[#747B86] leading-relaxed">
            {t(
              "Otorisasi hasil digital dengan jejak audit tidak dapat diubah sesuai standar akreditasi ISO 15189.",
              "Digital result authorization with an immutable audit trail, in line with ISO 15189 accreditation standards."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
