import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/** Penanda isian yang wajib dilengkapi / diverifikasi pihak berwenang sebelum dipublikasikan final. */
export function Todo({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded bg-amber-100 px-1 text-amber-900 font-medium" data-legal-todo>
      [{children}]
    </mark>
  );
}

/**
 * Kerangka dokumen legal berstatus DRAFT. Banner draft selalu tampil: dokumen ini belum
 * ditinjau/disetujui pihak berwenang dan tidak boleh dianggap final.
 */
export function LegalDocument({
  title,
  version,
  sections,
}: {
  title: string;
  version: string;
  sections: LegalSection[];
}) {
  return (
    <article className="w-full bg-white pt-[calc(110px+var(--announcement-bar-height,0px))] lg:pt-[calc(130px+var(--announcement-bar-height,0px))] pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div
          role="note"
          data-testid="legal-draft-banner"
          className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 flex gap-3"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-bold">DRAFT — belum berlaku / belum disetujui</p>
            <p className="mt-1">
              Dokumen ini adalah rancangan awal untuk ditinjau dan disetujui oleh pihak yang berwenang (manajemen dan
              penasihat hukum). Bagian bertanda <Todo>…</Todo> wajib dilengkapi atau diverifikasi. Isi dokumen belum
              merupakan pernyataan hukum final. English version pending review.
            </p>
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-xs text-slate-500">
          Versi: {version} · Status: DRAFT · Tanggal berlaku: <Todo>ditetapkan setelah persetujuan</Todo>
        </p>

        <nav aria-label="Daftar isi" className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-[#2568BA] hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-slate-700">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32 space-y-3">
              <h2 className="font-display text-xl font-bold text-slate-900">
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>

        <p className="mt-12 text-xs text-slate-500">
          Lihat juga:{" "}
          <Link href="/terms" className="underline">
            Syarat &amp; Ketentuan
          </Link>{" "}
          ·{" "}
          <Link href="/privacy" className="underline">
            Kebijakan Privasi
          </Link>
        </p>
      </div>
    </article>
  );
}
