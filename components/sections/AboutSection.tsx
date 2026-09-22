import React from "react";
import { ArrowRight, Brain, Cpu, Database } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { DNAHelixVisual } from "@/components/ui/DNAHelixVisual";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: DNA Helix Signature Visual */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative rounded-3xl border border-diagnova-light/50 bg-gradient-to-br from-diagnova-ice via-white to-diagnova-light/20 p-8 shadow-xl shadow-diagnova-blue/5 w-full max-w-md flex flex-col items-center">
              <DNAHelixVisual variant="floating" />
              <div className="mt-4 text-center">
                <span className="font-display text-sm font-bold text-diagnova-navy uppercase tracking-wider block">
                  Diagnosis + Nova
                </span>
                <span className="text-xs text-slate-500">
                  Data → Intelligence → Insight → Decision
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <SectionBadge variant="light">Tentang Diagnova</SectionBadge>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-diagnova-navy leading-tight">
              Satu Platform Terpadu untuk Mengelola Seluruh Alur Kerja Laboratorium Medis
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              <strong>Diagnova</strong> lahir dari kebutuhan mendasar laboratorium medis di Indonesia:
              menghubungkan instrumen analyzer, analis laboratorium, dokter penanggung jawab, dan sistem
              rumah sakit (SIMRS/RME/SATUSEHAT) tanpa celah dan tanpa ketergantungan pada pencatatan manual.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Bukan sekadar sistem pencatat data, Diagnova bertindak sebagai command center cerdas yang
              mengawasi validitas delta check, mendeteksi nilai kritis lebih dini melalui <strong>Nova AI</strong>,
              serta menjamin rekam jejak digital (audit trail) 100% transparan untuk setiap spesimen darah,
              urin, maupun jaringan.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-diagnova-light/60 text-diagnova-blue">
                  <Cpu className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-diagnova-navy mb-1">Direct Interfacing</h4>
                <p className="text-xs text-slate-600">Terhubung langsung ke 500+ analyzer secara otomatis.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-nova-blue/20 text-diagnova-blue">
                  <Brain className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-diagnova-navy mb-1">Nova AI Intelligence</h4>
                <p className="text-xs text-slate-600">Rangkuman hasil lab &amp; deteksi anomali klinis cerdas.</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Database className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-diagnova-navy mb-1">Native SIMRS &amp; RME</h4>
                <p className="text-xs text-slate-600">Bridging tanpa entri ganda, siap SATUSEHAT Kemenkes.</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                href="/platform"
                variant="primary"
                size="md"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Pelajari Arsitektur Platform
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
