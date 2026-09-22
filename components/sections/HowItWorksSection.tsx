import React from "react";
import { QrCode, Filter, Cpu, CheckCheck, ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { ProcessStepCard } from "@/components/ui/ProcessStepCard";
import { Button } from "@/components/ui/Button";

const bloodDropSteps = [
  {
    number: "01",
    subtitle: "Tahap 1: Registrasi",
    title: "Penerimaan & Label Barcode",
    description:
      "Sampel darah diterima dan langsung ditempeli label barcode 2D unik. Sistem Diagnova otomatis mencocokkan identitas pasien dan daftar tes dari SIMRS.",
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    number: "02",
    subtitle: "Tahap 2: Preparasi",
    title: "Pemisahan & Worklist Mesin",
    description:
      "Setelah proses sentrifugasi, worklist sampel langsung terkirim secara digital ke instrumen analyzer yang dituju tanpa perlu input manual staf.",
    icon: <Filter className="h-5 w-5" />,
  },
  {
    number: "03",
    subtitle: "Tahap 3: Analisis",
    title: "Pemeriksaan Mesin Otomatis",
    description:
      "Instrumen analyzer memindai tabung barcode secara otomatis (host query), memproses tes, dan mengirimkan hasil raw data kembali ke Diagnova secara real-time.",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    number: "04",
    subtitle: "Tahap 4: Verifikasi",
    title: "Auto-Verify & Rilis ke Dokter",
    description:
      "Rule engine & Nova AI memeriksa delta check dan nilai kritis. Hasil tervalidasi langsung terkirim ke RME dokter pengirim dan portal pasien.",
    icon: <CheckCheck className="h-5 w-5" />,
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-24 lg:py-32 text-white">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-nova-blue/15 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <SectionBadge variant="dark">Alur Kerja Terpadu</SectionBadge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Perjalanan Setetes Darah di Laboratorium
          </h2>
          <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed">
            Bagaimana Diagnova mengawal setiap spesimen medis dari titik pengambilan hingga
            menjadi keputusan klinis dokter dalam hitungan menit.
          </p>
        </div>

        {/* 4 Step Grid with Centerpiece DNA Helix in Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {bloodDropSteps.map((step) => (
            <ProcessStepCard
              key={step.number}
              number={step.number}
              subtitle={step.subtitle}
              title={step.title}
              description={step.description}
              icon={step.icon}
              theme="dark"
            />
          ))}
        </div>

        {/* Center Visual Summary Callout */}
        <div className="mt-14 rounded-2xl border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-md max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nova-blue text-diagnova-navy font-bold">
              ⚡
            </div>
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-white">
                Turnaround Time (TAT) Terpangkas hingga 70%
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Mengeliminasi 100% potensi human error akibat entri data ketik ulang.
              </p>
            </div>
          </div>

          <Button
            href="/platform/workflow"
            variant="white"
            size="md"
            icon={<ArrowRight className="h-4 w-4 text-diagnova-blue" />}
            className="shrink-0 font-bold"
          >
            Lihat Detail Alur
          </Button>
        </div>
      </div>
    </section>
  );
}
