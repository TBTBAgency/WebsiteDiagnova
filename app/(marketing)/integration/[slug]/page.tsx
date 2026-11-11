import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Network, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { integrationsData } from "@/content/integrations";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";
import { CTABanner } from "@/components/sections/CTABanner";

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
    title: `${integ.name} — Integrasi Diagnova LIS`,
    description: integ.shortDesc,
  };
}

export default function IntegrationDetailPage({ params }: Props) {
  const integ = integrationsData.find((i) => i.slug === params.slug);

  if (!integ) {
    notFound();
  }

  return (
    <div className="w-full bg-white text-slate-800">
      {/* Subpage Hero Header (Consistent with modern medical enterprise design) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2F6FA] via-[#F8FBFE] to-white pt-36 sm:pt-40 pb-16 sm:pb-20 border-b border-slate-100">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
          <Link
            href={`/integration#${integ.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2764B8] hover:text-[#1E5299] mb-6 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Kembali ke Halaman Integrasi</span>
          </Link>

          <div className="max-w-3xl space-y-3">
            <SectionBadge variant="blue">Spesifikasi Arsitektur &amp; Protokol</SectionBadge>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#345DAB]">
              {integ.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {integ.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="py-16 sm:py-20 max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[24px] border border-slate-200/90 bg-[#FAFBFD] p-6 sm:p-8">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Deskripsi &amp; Alur Operasional
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                {integ.description}
              </p>
            </div>

            {/* Protocols Supported */}
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <Network className="h-5 w-5 text-[#2764B8]" />
                <span>Protokol &amp; Standar Komunikasi</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {integ.protocols.map((p, i) => (
                  <span
                    key={i}
                    className="rounded-xl border border-blue-200 bg-[#EBF3FB] px-3.5 py-1.5 text-xs font-mono font-bold text-[#2764B8]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#2764B8]" />
                <span>Keunggulan &amp; Kapabilitas Utama</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integ.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-[#F8FBFE] p-3.5 rounded-xl border border-slate-150">
                    <Check className="h-4 w-4 text-[#2764B8] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Capabilities */}
            <div className="rounded-[24px] border border-slate-200/90 bg-[#F8FBFE] p-6 sm:p-8 space-y-3">
              <h3 className="font-display text-base font-bold text-slate-900">
                Spesifikasi Pesan &amp; Format Data
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                {integ.capabilities.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2764B8] shrink-0" />
                    <span className="font-mono text-slate-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar CTA Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[24px] border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs sticky top-28 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF3FB] text-[#2764B8]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Konsultasikan Bridging {integ.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Tim teknis Diagnova siap mendampingi pengujian interfacing, penyiapan mapping LOINC, dan konfigurasi gateway instrumen RS Anda.
              </p>
              <Button href="/request-demo" variant="primary" size="md" className="w-full">
                Jadwalkan Konsultasi Teknis
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTABanner bgClassName="bg-white" topColor="#FFFFFF" />
    </div>
  );
}
