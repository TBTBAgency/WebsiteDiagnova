"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Lang, LocalizedText } from "./types";

/** Memilih teks sesuai bahasa. String biasa dikembalikan apa adanya. */
export function pickText(lang: Lang | string, value: LocalizedText | string | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return lang === "EN" ? value.en ?? value.id ?? "" : value.id ?? value.en ?? "";
}

/** Hook: `const t = useCmsText(); t(content.hero.title)`. */
export function useCmsText() {
  const { language } = useLanguage();
  return (value: LocalizedText | string | null | undefined) => pickText(language, value);
}

/** Item yang tampil ke publik: tanpa `hidden` dan tanpa `deletedAt`. Server sudah menyaring; ini lapis kedua. */
export function visibleItems<T>(items: T[] | null | undefined): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    const meta = item as { hidden?: boolean; deletedAt?: string | null };
    return !meta?.hidden && !meta?.deletedAt;
  });
}

interface CmsRichTextProps {
  text: string;
  /** className untuk bagian **highlight** */
  highlightClassName?: string;
  /** className untuk <br> dari "\n"; default "" (selalu patah baris). Pakai "hidden sm:inline" untuk meniru pola lama. */
  breakClassName?: string;
}

/**
 * Merender teks CMS: "\n" -> <br>, **teks** -> <span className={highlightClassName}>.
 * Tidak memakai dangerouslySetInnerHTML (aman dari XSS).
 */
export function CmsRichText({ text, highlightClassName, breakClassName }: CmsRichTextProps) {
  const lines = (text || "").split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {li > 0 && <br className={breakClassName || undefined} />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
            part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
              <span key={pi} className={highlightClassName}>
                {part.slice(2, -2)}
              </span>
            ) : (
              <React.Fragment key={pi}>{part}</React.Fragment>
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
}
