import React from "react";
import { Metadata } from "next";
import { ShieldCheck, UserCheck, CheckCircle2 } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { novaAIDisclaimer } from "@/content/nova-ai";

export const metadata: Metadata = {
  title: "AI + Doctor — Etika & Kolaborasi Klinis Diagnova",
  description:
    "AI assists. Doctors decide. Mengapa kecerdasan buatan Diagnova dirancang untuk memperkuat dokter, bukan menggantikannya.",
};

export default function NovaAIDoctorPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Clinical Ethics</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            AI Assists. Doctors Decide.
          </h1>
          <p className="text-slate-200">
            Filosofi etika kedokteran di balik perancangan Nova AI: menempatkan dokter sebagai pengambil keputusan tertinggi.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border-2 border-diagnova-blue/20 bg-diagnova-ice/30 p-8 space-y-4">
          <div className="flex items-center gap-2 text-diagnova-blue font-bold text-base">
            <ShieldCheck className="h-6 w-6 text-nova-blue" />
            <span>Pernyataan Etika &amp; Kepatuhan Medis Diagnova</span>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            &ldquo;{novaAIDisclaimer.text}&rdquo;
          </p>
        </div>

        <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
          <h2 className="font-display text-2xl font-bold text-diagnova-navy">
            Mengapa Pendekatan Human-in-the-Loop Sangat Penting?
          </h2>
          <p>
            Laboratorium medis menangani keputusan kritis mengenai hidup dan kesehatan pasien.
            Algoritma AI memiliki keunggulan luar biasa dalam memproses jutaan titik data secara cepat,
            mengenali anomali delta check, dan menyaring nilai kritis.
          </p>
          <p>
            Namun, pertimbangan klinis holistik — termasuk riwayat fisik pasien, anamnesis dokter,
            dan konteks penyakit khusus — hanya dapat dievaluasi secara utuh oleh Dokter Spesialis Patologi
            Klinik dan Dokter Penanggung Jawab Pelayanan (DPJP).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h4 className="font-bold text-diagnova-navy flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Peran Nova AI
              </h4>
              <p className="text-xs text-slate-600">
                Membaca tren, mengelompokkan data, mendeteksi nilai ekstrim, dan merangkum dalam bahasa jelas.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2">
              <h4 className="font-bold text-diagnova-navy flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-diagnova-blue" />
                Peran Dokter
              </h4>
              <p className="text-xs text-slate-600">
                Memverifikasi keabsahan klinis, menentukan diagnosis definitif, dan menetapkan terapi pengobatan.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <Button href="/request-demo" variant="primary" size="lg">
            Diskusikan Standar Kepatuhan Medis
          </Button>
        </div>
      </section>
    </div>
  );
}
