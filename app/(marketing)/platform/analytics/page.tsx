import React from "react";
import { Metadata } from "next";
import { Sparkles, BarChart3, TrendingUp } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Analytics & Intelligence — Insight Operasional Lab",
  description:
    "Pemanfaatan insight data lab untuk memantau TAT, beban kerja, dan mendukung fitur Nova AI di Diagnova.",
};

export default function PlatformAnalyticsPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Lab Intelligence</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Analytics &amp; Operational Intelligence
          </h1>
          <p className="text-slate-200">
            Mengubah jutaan titik data laboratorium menjadi wawasan operasional dan klinis yang bernilai tinggi.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-diagnova-ice text-diagnova-blue">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">TAT Real-Time Dashboard</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Pantau waktu tunggu pasien per departemen (IGD, Rawat Inap, Rawat Jalan) secara live.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nova-blue/20 text-diagnova-blue">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">Productivity &amp; Workload</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Keseimbangan beban instrumen dan utilisasi analis lab untuk penjadwalan shift optimal.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">Nova AI Delta Trend</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Deteksi pergeseran biomarker longitudinal antar-kunjungan pasien secara cerdas.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button href="/request-demo" variant="primary" size="lg">
            Eksplorasi Dashboard Analytics
          </Button>
        </div>
      </section>
    </div>
  );
}
