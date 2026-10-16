"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NovaAiPlaceholderPage() {
  return (
    <div className="py-16 text-center max-w-xl mx-auto space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mx-auto text-purple-400 shadow-xl">
        <Sparkles className="h-8 w-8" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-400">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Roadmap Fase 4: Nova AI Clinical Copilot</span>
      </div>
      <h2 className="text-2xl font-bold text-white font-display">
        Nova AI Clinical Decision Support
      </h2>
      <p className="text-sm text-slate-400 leading-relaxed">
        Modul Copilot klinis yang menghasilkan draf interpretasi pola anomali hasil laboratorium dengan sistem persetujuan dokter (Accept / Reject / Edit) dan audit trail versi model AI.
      </p>
      <div className="pt-2">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-diagnova-blue hover:bg-nova-blue text-xs font-semibold text-white transition-colors"
        >
          <span>Kembali ke Manajemen Leads</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
