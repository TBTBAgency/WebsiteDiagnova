import React from "react";
import { Metadata } from "next";
import { Zap, Clock, ShieldCheck } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "100% Automation & Interfacing — Otomasi Laboratorium",
  description:
    "Direct analyzer interfacing bidireksional dan auto-verification memangkas Turnaround Time (TAT) hingga 70%.",
};

export default function PlatformAutomationPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Automation Core</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            100% Otomatisasi &amp; Direct Analyzer Interfacing
          </h1>
          <p className="text-slate-200">
            Mengeliminasi entri data manual dan mempercepat hasil diagnosis darurat bagi klinisi.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nova-blue/20 text-diagnova-blue font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">Pangkas TAT 70%</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Hasil analyzer langsung masuk ke LIS tanpa proses pengetikan manual oleh staf analis.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">Zero Human Error</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Validasi barcode tabung dan parsing data raw menjamin tidak ada nilai yang tertukar.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-diagnova-light text-diagnova-blue font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-diagnova-navy">Auto-Verification</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Hasil dalam batas normal diverifikasi otomatis berdasarkan rule-engine kustom RS.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button href="/request-demo" variant="primary" size="lg">
            Konsultasikan Otomasi Laboratorium
          </Button>
        </div>
      </section>
    </div>
  );
}
