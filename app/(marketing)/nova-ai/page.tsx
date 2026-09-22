import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { novaAISampleTranslations, novaAIDisclaimer } from "@/content/nova-ai";

export const metadata: Metadata = {
  title: "Nova AI — Intelligent Laboratory Copilot",
  description:
    "Nova AI: AI assists. Doctors decide. Mengubah data angka laboratorium kompleks menjadi narasi klinis yang ringkas dan actionable.",
};

export default function NovaAIPage() {
  return (
    <div className="pt-28 pb-20">
      {/* Subpage Header */}
      <section className="bg-gradient-to-br from-diagnova-deep via-diagnova-navy to-diagnova-blue py-16 text-white text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <SectionBadge variant="dark">Nova AI Copilot</SectionBadge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
            AI Assists. Doctors Decide.
          </h1>
          <p className="text-base sm:text-lg text-slate-200">
            Nova AI mengubah deretan angka medis rumit menjadi kalimat sederhana yang mudah dipahami,
            mendeteksi anomali tren, dan memberi notifikasi lebih cepat kepada dokter.
          </p>
        </div>
      </section>

      {/* Mandatory Medical Compliance Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm text-amber-900 font-medium text-center">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0" />
          <span>
            <strong>{novaAIDisclaimer.badge}:</strong> {novaAIDisclaimer.text}
          </span>
        </div>
      </div>

      {/* Main Content & Sample Translations Table */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionBadge variant="blue">Demonstrasi Penerjemahan</SectionBadge>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-diagnova-navy">
            Bagaimana Nova AI Menerjemahkan Hasil Lab
          </h2>
          <p className="text-sm text-slate-600">
            Contoh interpretasi terstruktur yang membantu dokter memeriksa kondisi pasien lebih cepat:
          </p>
        </div>

        {/* Translation Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-4">Parameter Pemeriksaan</th>
                  <th className="p-4">Hasil &amp; Nilai Rujukan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Interpretasi Nova AI</th>
                  <th className="p-4">Catatan Klinis (Delta Check)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {novaAISampleTranslations.map((sample, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-diagnova-navy">{sample.parameter}</td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-slate-800">{sample.value}</span>
                      <span className="block text-xs text-slate-400">Ref: {sample.referenceRange}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${sample.rawStatusBadge}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-700 leading-relaxed">{sample.explanation}</td>
                    <td className="p-4 text-xs text-slate-600 leading-relaxed bg-diagnova-ice/20">{sample.clinicalNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Link
            href="/nova-ai/how-it-works"
            className="group rounded-2xl border border-slate-200 p-6 bg-white hover:border-nova-blue hover:shadow-lg transition-all"
          >
            <h3 className="font-display text-lg font-bold text-diagnova-navy group-hover:text-diagnova-blue mb-2">
              4 Tahap Cara Kerja Nova AI →
            </h3>
            <p className="text-xs text-slate-600">
              Pelajari alur: Membaca Pola → Menerjemahkan Angka → Notifikasi Dini → Validasi Dokter.
            </p>
          </Link>

          <Link
            href="/nova-ai/ai-doctor"
            className="group rounded-2xl border border-slate-200 p-6 bg-white hover:border-nova-blue hover:shadow-lg transition-all"
          >
            <h3 className="font-display text-lg font-bold text-diagnova-navy group-hover:text-diagnova-blue mb-2">
              AI + Doctor: Etika &amp; Kolaborasi Klinis →
            </h3>
            <p className="text-xs text-slate-600">
              Penegasan batasan kecerdasan buatan dan sentralitas peran dokter dalam keselamatan pasien.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
