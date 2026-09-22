import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Network } from "lucide-react";
import { integrationsData } from "@/content/integrations";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return integrationsData.map((integ) => ({
    slug: integ.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const integ = integrationsData.find((i) => i.slug === params.slug);
  if (!integ) return { title: "Integrasi Tidak Ditemukan" };

  return {
    title: `${integ.name} — Integrasi Diagnova`,
    description: integ.shortDesc,
  };
}

export default function IntegrationDetailPage({ params }: Props) {
  const integ = integrationsData.find((i) => i.slug === params.slug);

  if (!integ) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20">
      {/* Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/integration"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-nova-light hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Semua Integrasi</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <SectionBadge variant="dark">Technical Specification</SectionBadge>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
              {integ.name}
            </h1>
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              {integ.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-diagnova-navy mb-4">
                Arsitektur Integrasi
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {integ.description}
              </p>
            </div>

            {/* Protocols Supported */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="font-display text-lg font-bold text-diagnova-navy flex items-center gap-2">
                <Network className="h-5 w-5 text-diagnova-blue" />
                <span>Protokol &amp; Standar Komunikasi yang Didukung</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {integ.protocols.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-xl border border-diagnova-light bg-diagnova-ice px-3.5 py-1.5 text-xs font-bold text-diagnova-blue"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-2xl border border-diagnova-light bg-diagnova-ice/30 p-6 space-y-4">
              <h3 className="font-display text-lg font-bold text-diagnova-navy flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-nova-blue" />
                <span>Keunggulan &amp; Kapabilitas Utama</span>
              </h3>
              <ul className="space-y-3">
                {integ.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-diagnova-blue shrink-0 mt-0.5" />
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Message Capabilities */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <h3 className="font-display text-base font-bold text-slate-800">
                Spesifikasi Pesan &amp; Format Data
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {integ.capabilities.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-diagnova-blue shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 sticky top-28">
              <h3 className="font-display text-lg font-bold text-diagnova-navy">
                Konsultasikan Bridging {integ.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tim teknis Diagnova siap membantu pengujian bridging dan kompatibilitas sistem instrumen RS Anda.
              </p>
              <Button href="/request-demo" variant="primary" size="md" className="w-full">
                Jadwalkan Konsultasi Integrasi
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
