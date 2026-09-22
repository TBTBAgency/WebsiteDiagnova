import React from "react";
import Link from "next/link";
import { Cpu, Sparkles, ShieldCheck, ArrowRight, Wifi } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

const infraItems = [
  {
    title: "100% Otomatisasi & Direct Analyzer Interfacing",
    badge: "Automation Core",
    description:
      "Terhubung langsung dengan 500+ model instrumen lab via protokol standar industri (HL7 v2/v3, ASTM E1381/E1394). Hasil raw data ditarik seketika tanpa perantara perangkat lunak pihak ketiga yang lambat.",
    icon: <Cpu className="h-5 w-5 text-nova-blue" />,
    link: "/platform/automation",
  },
  {
    title: "Smart Resilient Gateway dengan Offline-Buffer Edge",
    badge: "99.9% Uptime",
    description:
      "Arsitektur edge gateway yang tahan banting. Bila koneksi internet atau LAN terganggu, seluruh transaksi instrumen lab disimpan aman di buffer lokal dan otomatis disinkronisasi saat jaringan pulih.",
    icon: <Wifi className="h-5 w-5 text-diagnova-blue" />,
    link: "/integration/connectivity",
  },
  {
    title: "Nova AI Copilot & Medical Delta Intelligence",
    badge: "Clinical Intelligence",
    description:
      "Meringkas parameter laboratorium kompleks, melacak pergeseran tren longitudinal antar-kunjungan, dan memberikan notifikasi dini nilai kritis dengan kendali 100% di tangan dokter penanggung jawab.",
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
    link: "/nova-ai",
  },
];

export function InfrastructureSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <SectionBadge variant="light">Infrastruktur &amp; Teknologi</SectionBadge>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-diagnova-navy leading-tight">
              Arsitektur Tangguh untuk Operasional Lab Tanpa Henti
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Laboratorium medis tidak boleh mengalami downtime. Diagnova dirancang dengan
              infrastruktur modern berstandar enterprise yang menggabungkan kecepatan pemrosesan lokal
              dengan keandalan cloud modern.
            </p>

            <div className="rounded-2xl border border-diagnova-light/60 bg-diagnova-ice/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-diagnova-blue font-bold text-sm">
                <ShieldCheck className="h-4 w-4 text-nova-blue" />
                <span>Kepatuhan Standar Industri &amp; Regulasi</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Interoperabilitas HL7 FHIR (Kemenkes SATUSEHAT)</li>
                <li>Protokol ASTM E1381/E1394 Analyzer Interfacing</li>
                <li>Standar Rekam Medis Elektronik (Permenkes 24/2022)</li>
                <li>Digital Audit Trail &amp; Kepatuhan ISO 15189</li>
              </ul>
            </div>

            <div>
              <Button
                href="/integration"
                variant="primary"
                size="md"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Lihat Spesifikasi Integrasi
              </Button>
            </div>
          </div>

          {/* Right Column: Timeline & Infrastructure Cards */}
          <div className="lg:col-span-7 relative">
            {/* Vertical Connecting Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-diagnova-blue via-nova-blue to-diagnova-light hidden sm:block" />

            <div className="space-y-6 relative">
              {infraItems.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 sm:pl-16 shadow-sm transition-all duration-300 hover:border-nova-blue/50 hover:shadow-xl"
                >
                  {/* Timeline Node on the line */}
                  <div className="absolute -left-3.5 top-6 hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-white border-2 border-diagnova-blue shadow-md text-diagnova-blue">
                    <span className="h-2 w-2 rounded-full bg-nova-blue" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-diagnova-light/50 px-2.5 py-0.5 text-xs font-semibold text-diagnova-blue">
                      {item.badge}
                    </span>
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-nova-blue hover:text-diagnova-blue group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Pelajari detail</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <h3 className="font-display text-lg font-bold text-diagnova-navy mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
