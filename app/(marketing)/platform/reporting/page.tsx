import React from "react";
import { Metadata } from "next";
import { FileText, Lock } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Digital Audit Trail & Reporting — Rekam Jejak Medis",
  description:
    "Full Digital Audit Trail dan rekam jejak digital transparan untuk setiap perubahan hasil sampel di Diagnova.",
};

export default function PlatformReportingPage() {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Compliance &amp; Reporting</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            Full Digital Audit Trail &amp; Pelaporan Terstandar
          </h1>
          <p className="text-slate-200">
            Rekam jejak digital 100% transparan dan akuntabel untuk setiap perubahan status sampel medis.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <h3 className="font-display text-2xl font-bold text-diagnova-navy">
            Standar Akreditasi KARS, JCI &amp; ISO 15189 Ready
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Setiap aksi pengguna — mulai dari registrasi spesimen, hasil awal dari analyzer, perubahan
            nilai koreksi, hingga approval dokter spesialis — tersimpan dalam log audit permanen yang
            tidak dapat dimanipulasi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Lock className="h-5 w-5 text-diagnova-blue shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Immutable Log</h4>
                <p className="text-xs text-slate-600">Timestamp waktu akurat per milidetik dan ID pengguna.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <FileText className="h-5 w-5 text-nova-blue shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">E-Sign Dokter</h4>
                <p className="text-xs text-slate-600">Tanda tangan digital tersertifikasi pada lembar hasil.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button href="/request-demo" variant="primary" size="lg">
            Jadwalkan Demo Pelaporan
          </Button>
        </div>
      </section>
    </div>
  );
}
