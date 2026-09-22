import React from "react";
import { ArrowRight, CheckCircle2, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionBadge } from "@/components/ui/SectionBadge";

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export function Hero({
  badge = "AI-Powered Laboratory Intelligence Platform",
  title = "From Results to Intelligence",
  subtitle = "Solusi Laboratory Information System (LIS) end-to-end yang menghubungkan instrumen analyzer, staf medis, dokter, dan SIMRS dalam satu ekosistem cerdas.",
  primaryCTA = { label: "Request Live Demo", href: "/request-demo" },
  secondaryCTA = { label: "Jelajahi 5 Modul", href: "/modules" },
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-diagnova-navy pt-32 pb-24 text-white lg:pt-40 lg:pb-32">
      {/* Background Rich Gradient & Radial Glow Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue opacity-95" />
      <div className="absolute -top-32 -right-32 h-[550px] w-[550px] rounded-full bg-nova-blue/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 h-[400px] w-[400px] rounded-full bg-diagnova-blue/30 blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#56ADE2 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Copy & CTAs */}
          <div className="text-center lg:text-left lg:col-span-7 space-y-6">
            <div className="inline-flex">
              <SectionBadge variant="dark" className="border-white/20">
                {badge}
              </SectionBadge>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-nova-blue shrink-0" />
                <span>Interfacing 500+ Mesin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-nova-blue shrink-0" />
                <span>Pangkas TAT s.d. 70%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-nova-blue shrink-0" />
                <span>Siap SATUSEHAT &amp; RME</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                href={primaryCTA.href}
                variant="white"
                size="lg"
                icon={<ArrowRight className="h-4 w-4 text-diagnova-blue" />}
                className="w-full sm:w-auto font-bold shadow-xl shadow-diagnova-navy/40"
              >
                {primaryCTA.label}
              </Button>

              <Button
                href={secondaryCTA.href}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                {secondaryCTA.label}
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive Command Center Dashboard Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl border border-white/20 bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in duration-500">
              {/* Header Card */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Live Lab Status
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>

              {/* Stat Metric Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <span className="block text-[11px] font-medium text-slate-300">
                    Avg. Turnaround Time
                  </span>
                  <span className="font-display text-2xl font-bold text-white">
                    18.4 <span className="text-xs text-nova-light">menit</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold">
                    ↓ 68% vs konvensional
                  </span>
                </div>

                <div className="rounded-xl bg-white/10 p-3">
                  <span className="block text-[11px] font-medium text-slate-300">
                    Auto-Verification Rate
                  </span>
                  <span className="font-display text-2xl font-bold text-nova-light">
                    94.2%
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium">
                    1.420 sampel hari ini
                  </span>
                </div>
              </div>

              {/* Live Sample Alert Notification item */}
              <div className="rounded-xl border border-nova-blue/40 bg-nova-blue/15 p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-nova-light" />
                    Nova AI • Smart Delta Alert
                  </span>
                  <span className="text-[10px] text-nova-light">Baru saja</span>
                </div>
                <p className="text-slate-200 leading-snug">
                  Sampel <strong className="text-white">#LAB-8842 (Ny. Ratna - Rawat Inap)</strong>:
                  Terdeteksi penurunan Hb dari 12.1 ke 8.4 g/dL. Rekomendasi verifikasi DPJP terkirim ke SIMRS.
                </p>
              </div>

              {/* Analyzer Connectivity Strip */}
              <div className="mt-4 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-nova-blue" />
                  Sysmex XN-1000 &amp; Cobas 6000
                </span>
                <span className="text-emerald-400 font-semibold">HL7 Bridged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
