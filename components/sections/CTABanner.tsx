"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  const [quickEmail, setQuickEmail] = useState("");
  const router = useRouter();

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail) {
      router.push(`/request-demo?email=${encodeURIComponent(quickEmail)}`);
    } else {
      router.push("/request-demo");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-20 lg:py-28 text-white">
      {/* Glow overlays */}
      <div className="absolute top-0 right-10 h-[450px] w-[450px] rounded-full bg-nova-blue/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-[350px] w-[350px] rounded-full bg-diagnova-blue/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Heading, Subtitle & Quick Email Form */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-nova-light backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-nova-blue" />
              Jadwalkan Live Demo Interaktif
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Transformasikan Laboratorium Anda Bersama Diagnova
            </h2>

            <p className="text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Diskusikan kebutuhan integrasi SIMRS, interfacing mesin analyzer, atau konsultasi alur
              kerja bersama tim spesialis LIS Diagnova.
            </p>

            {/* Quick Email Form */}
            <form
              onSubmit={handleQuickSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto lg:mx-0 pt-2"
            >
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="Masukkan email institusi/RS..."
                  className="w-full rounded-full border border-white/25 bg-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-300 backdrop-blur-md focus:border-nova-blue focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-nova-blue/50 transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="white"
                size="md"
                className="w-full sm:w-auto shrink-0 font-bold shadow-lg"
                icon={<ArrowRight className="h-4 w-4 text-diagnova-blue" />}
              >
                Request Demo
              </Button>
            </form>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-nova-blue" />
                Presentasi Disesuaikan Jenis Lab
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-nova-blue" />
                Estimasi Analisis Biaya Gratis
              </span>
            </div>
          </div>

          {/* Right Column: Device Laptop Frame Mockup Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
              {/* Laptop Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="rounded-md bg-white/10 px-3 py-0.5 text-[10px] text-slate-300 font-mono">
                  diagnova.app/command-center
                </div>
                <div className="h-2.5 w-2.5" />
              </div>

              {/* Mockup UI Interface Screen */}
              <div className="space-y-3 rounded-xl bg-diagnova-navy/90 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-nova-blue/20 flex items-center justify-center text-nova-blue font-bold text-[10px]">
                      §D
                    </div>
                    <span className="font-bold text-white text-xs">LIS Command Center</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Active • 5 Analyzers
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Antrean Spesimen</span>
                    <span className="font-bold text-white text-sm">24 Sample</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Auto-Verified</span>
                    <span className="font-bold text-nova-light text-sm">98.5%</span>
                  </div>
                </div>

                <div className="rounded-lg bg-nova-blue/15 border border-nova-blue/30 p-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-white text-[11px] mb-1">
                    <Sparkles className="h-3 w-3 text-nova-light" />
                    <span>Nova AI Insight</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    &ldquo;Semua parameter kimia darah shift ini selesai &lt; 22 menit. Tidak ada deviasi QC Levey-Jennings.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
