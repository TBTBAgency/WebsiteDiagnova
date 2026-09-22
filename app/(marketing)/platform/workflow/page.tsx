import React from "react";
import { Metadata } from "next";
import { QrCode, Filter, Cpu, CheckCheck } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "End-to-End Workflow — Alur Kerja Laboratorium Terpadu",
  description:
    "Pelajari 4 tahap alur kerja spesimen medis dari penerimaan sampel hingga verifikasi dokter di Diagnova LIS.",
};

const steps = [
  {
    step: "01",
    title: "Penerimaan & Registrasi Barcode",
    desc: "Spesimen diterima, diverifikasi dengan data order SIMRS, dan ditempeli label barcode 2D unik. Mengurangi risiko tertukarnya tabung.",
    icon: <QrCode className="h-6 w-6 text-nova-blue" />,
  },
  {
    step: "02",
    title: "Sentrifugasi & Worklist Otomatis",
    desc: "Setelah preparasi, worklist langsung didistribusikan secara digital ke instrumen analyzer yang dituju tanpa ketik ulang.",
    icon: <Filter className="h-6 w-6 text-diagnova-blue" />,
  },
  {
    step: "03",
    title: "Analisis Mesin & Host Query",
    desc: "Instrumen membaca barcode tabung, menarik daftar tes otomatis, dan mengirimkan kembali hasil raw data ke Diagnova.",
    icon: <Cpu className="h-6 w-6 text-nova-blue" />,
  },
  {
    step: "04",
    title: "Auto-Verification & Validasi Dokter",
    desc: "Hasil normal lolos otomatis dengan rule-engine kustom. Nilai kritis dan delta check mencurigakan langsung diarahkan ke dokter.",
    icon: <CheckCheck className="h-6 w-6 text-emerald-600" />,
  },
];

export default function PlatformWorkflowPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Platform Workflow</SectionBadge>
          <h1 className="font-display text-4xl font-extrabold text-white">
            End-to-End Laboratory Workflow
          </h1>
          <p className="text-slate-200">
            Alur kerja yang mulus dan terstandardisasi dari saat spesimen tiba di loket hingga rilis ke rekam medis pasien.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-diagnova-blue text-white font-bold text-xs font-display">
                  {s.step}
                </span>
                <div className="p-2 rounded-lg bg-diagnova-ice">{s.icon}</div>
              </div>
              <h3 className="font-display text-lg font-bold text-diagnova-navy">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button href="/request-demo" variant="primary" size="lg">
            Request Demo Workflow
          </Button>
        </div>
      </section>
    </div>
  );
}
