import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Platform Overview — One Connected Laboratory Platform",
  description:
    "Diagnova menghubungkan seluruh mesin lab, petugas medis, dokter, dan sistem SIMRS/RME dalam satu platform digital terpadu.",
};

const subPlatformLinks = [
  {
    title: "Workflow End-to-End",
    desc: "Alur kerja 4 tahap dari spesimen masuk hingga rilis hasil ke dokter.",
    href: "/platform/workflow",
    icon: <Activity className="h-6 w-6 text-diagnova-blue" />,
  },
  {
    title: "100% Automation & Barcode",
    desc: "Direct analyzer interfacing & auto-verification memangkas TAT hingga 70%.",
    href: "/platform/automation",
    icon: <Cpu className="h-6 w-6 text-nova-blue" />,
  },
  {
    title: "Digital Audit Trail & Reporting",
    desc: "Rekam jejak digital transparan untuk setiap perubahan hasil sampel.",
    href: "/platform/reporting",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
  },
  {
    title: "Analytics & Intelligence",
    desc: "Insight produktivitas, beban kerja, dan integrasi Nova AI Copilot.",
    href: "/platform/analytics",
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
  },
];

export default function PlatformOverviewPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Hero Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <SectionBadge variant="dark">Diagnova Platform</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            One Platform to Manage the Entire Laboratory Workflow
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Diagnova bertindak sebagai buku catatan super pintar dan command center terpadu yang
            menghubungkan instrumen lab dengan dokter secara real-time.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {subPlatformLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="group rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-nova-blue hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-diagnova-ice">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-diagnova-navy mb-2 group-hover:text-diagnova-blue transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-diagnova-blue">
                <span>Pelajari lebih lanjut</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Value Callout Banner */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="font-display text-2xl font-bold text-diagnova-navy">
            Ingin Melihat Diagnova Beroperasi Secara Langsung?
          </h3>
          <p className="text-sm text-slate-600">
            Tim kami siap mendemonstrasikan simulasi alur kerja spesimen, interfacing mesin lab, dan bridging SIMRS.
          </p>
          <div className="pt-2">
            <Button href="/request-demo" variant="primary" size="md">
              Jadwalkan Demo Platform
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
