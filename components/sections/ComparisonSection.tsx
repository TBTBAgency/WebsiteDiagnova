import React from "react";
import { ArrowRight, Cpu, Sparkles, Network } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { ComparisonCard, TransformationCard } from "@/components/ui/ComparisonCard";
import { comparisonData } from "@/content/comparison";
import { Button } from "@/components/ui/Button";

export function ComparisonSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50/80 py-20 lg:py-28 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <SectionBadge variant="blue">Perbandingan Sistem</SectionBadge>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-diagnova-navy">
            Mengapa Laboratorium Modern Beralih ke Diagnova?
          </h2>
          <p className="text-base text-slate-600">
            LIS konvensional di Indonesia kerap terisolasi, bergantung pada ketik manual, dan
            rentan downtime. Diagnova menghadirkan standar baru yang terintegrasi, otomatis, dan cerdas.
          </p>
        </div>

        {/* 3 Core Brand Transformation Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <TransformationCard
            from="Disconnected"
            to="Connected"
            description="Mengakhiri isolasi data. Menghubungkan seluruh mesin lab, dokter bangsal, SIMRS, dan SATUSEHAT dalam satu jaringan otomatis."
            icon={<Network className="h-6 w-6 text-nova-light" />}
          />
          <TransformationCard
            from="Manual Entry"
            to="100% Intelligent"
            description="Tanpa entri ketik ulang hasil. Direct analyzer interfacing & auto-verification memangkas waktu tunggu pasien hingga 70%."
            icon={<Cpu className="h-6 w-6 text-nova-light" />}
          />
          <TransformationCard
            from="Raw Data"
            to="Clinical Decision"
            description="Nova AI mengubah deretan angka membingungkan menjadi insight ringkas dan alert dini yang langsung siap dieksekusi dokter."
            icon={<Sparkles className="h-6 w-6 text-nova-light" />}
          />
        </div>

        {/* 6 Point Deep-Dive Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {comparisonData.map((item) => (
            <ComparisonCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            href="/request-demo"
            variant="primary"
            size="lg"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Konsultasikan Migrasi LIS Rumah Sakit Anda
          </Button>
        </div>
      </div>
    </section>
  );
}
