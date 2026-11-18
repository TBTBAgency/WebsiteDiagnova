import React from "react";
import type { Lang, ResolvedSection } from "@/lib/cms-layout";
import { getSectionOverride } from "@/lib/cms-layout";
import { CmsCustomSection } from "./CmsCustomSection";

/**
 * Penanda section bawaan halaman. Tidak merender apa pun selain children-nya;
 * CmsSectionList memakai `id` untuk mengurutkan dan menyembunyikan section.
 * (Tanpa hook, sehingga dapat dipakai di server maupun client component.)
 */
export function CmsSlot({ children }: { id: string; children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Merender section sesuai tata letak CMS: urutan, aktif/nonaktif, dan section kustom.
 * Tanpa layout (mis. database tidak tersedia), children dirender apa adanya.
 */
export function CmsSectionList({
  layout,
  children,
}: {
  layout?: ResolvedSection[] | null;
  children: React.ReactNode;
}) {
  if (!layout || layout.length === 0) return <>{children}</>;

  const slots = new Map<string, React.ReactNode>();
  React.Children.forEach(children, (child) => {
    if (React.isValidElement<{ id: string }>(child) && child.type === CmsSlot) {
      slots.set(child.props.id, child);
    }
  });

  return (
    <>
      {layout
        .filter((s) => s.isActive)
        .map((s) => {
          if (s.type === "custom") {
            return <CmsCustomSection key={s.key} id={s.key} content={s.content || {}} />;
          }
          const slot = slots.get(s.key);
          return slot ? <React.Fragment key={s.key}>{slot}</React.Fragment> : null;
        })}
    </>
  );
}

/** Teks multi-baris dari CMS: "\n" menjadi <br />, tanpa HTML mentah. */
export function CmsMultiline({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Teks konten CMS dengan baris baru: "\n" menjadi <br className={brClassName} />.
 * Dipakai untuk teks yang sebelumnya memakai jeda baris responsif, mis. brClassName="hidden sm:inline".
 */
export function CmsLines({ text, brClassName }: { text: string; brClassName?: string }) {
  const lines = text.split(/\r?\n/);
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br className={brClassName} />}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Membuat fungsi pemilih teks header: memakai override CMS untuk bahasa aktif bila ada,
 * selain itu teks/JSX bawaan halaman (fallback) apa adanya.
 */
export function makeSectionText(layout: ResolvedSection[] | null | undefined, language: Lang) {
  return function sectionText(
    key: string,
    field: "badge" | "title" | "subtitle",
    fallback: React.ReactNode
  ): React.ReactNode {
    const override = getSectionOverride(layout, key, field, language);
    return override !== undefined ? <CmsMultiline text={override} /> : fallback;
  };
}
