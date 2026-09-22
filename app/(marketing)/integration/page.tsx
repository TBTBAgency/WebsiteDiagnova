import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Network, FileText, Cpu, ShieldCheck, Wifi } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { integrationsData } from "@/content/integrations";

export const metadata: Metadata = {
  title: "Integrasi Ekosistem Laboratorium — Diagnova Integration",
  description:
    "Hubungkan Diagnova dengan sistem rumah sakit (SIMRS/HIS), Rekam Medis Elektronik (RME), 500+ mesin analyzer, dan SATUSEHAT Kemenkes RI.",
};

const iconMap: Record<string, React.ReactNode> = {
  Network: <Network className="h-6 w-6 text-diagnova-blue" />,
  FileText: <FileText className="h-6 w-6 text-nova-blue" />,
  Cpu: <Cpu className="h-6 w-6 text-diagnova-blue" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
  Wifi: <Wifi className="h-6 w-6 text-nova-blue" />,
};

export default function IntegrationIndexPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Seamless Connectivity</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Connect Diagnova with the Systems You Already Use
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Kompatibilitas universal dengan protokol standar industri kesehatan (HL7, ASTM, FHIR).
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {integrationsData.map((integ) => (
            <Link
              key={integ.slug}
              href={`/integration/${integ.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:border-nova-blue hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-diagnova-ice">
                  {iconMap[integ.iconName] || <Network className="h-6 w-6 text-diagnova-blue" />}
                </div>

                <h3 className="font-display text-xl font-bold text-diagnova-navy mb-2 group-hover:text-diagnova-blue transition-colors">
                  {integ.name}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {integ.shortDesc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {integ.protocols.slice(0, 2).map((p, i) => (
                    <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-diagnova-blue pt-4 border-t border-slate-100">
                <span>Spesifikasi Integrasi</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
