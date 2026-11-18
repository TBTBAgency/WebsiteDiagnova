"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Bahasa antarmuka panel admin (Indonesia / English).
 *
 * Terpisah dari bahasa website publik (kunci localStorage berbeda) supaya admin bisa memakai
 * bahasa Inggris tanpa mengubah bahasa yang dilihat pengunjung di browser yang sama.
 * Hanya label UI admin yang diterjemahkan; isi konten CMS dan data pemohon tidak diubah.
 */
export type AdminLang = "ID" | "EN";

const STORAGE_KEY = "diagnova_admin_language";

/** Fungsi terjemahan inline: t("Teks Indonesia", "English text"). */
export type AdminT = (_id: string, _en: string) => string;

interface AdminLanguageContextValue {
  lang: AdminLang;
  setLang: (_lang: AdminLang) => void;
  t: AdminT;
  /** Locale untuk toLocaleString / Intl: "id-ID" atau "en-US". */
  locale: string;
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(null);

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>("ID");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "ID" || saved === "EN") setLangState(saved);
    } catch {
      // localStorage tidak tersedia (mode privat, dll.): tetap bahasa Indonesia
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "EN" ? "en" : "id";
  }, [lang]);

  const setLang = useCallback((next: AdminLang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // abaikan
    }
  }, []);

  const value = useMemo<AdminLanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (id, en) => (lang === "EN" ? en : id),
      locale: lang === "EN" ? "en-US" : "id-ID",
    }),
    [lang, setLang]
  );

  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>;
}

const FALLBACK: AdminLanguageContextValue = {
  lang: "ID",
  setLang: () => {},
  t: (id) => id,
  locale: "id-ID",
};

/** Hook bahasa admin. Di luar provider jatuh ke bahasa Indonesia (tidak melempar error). */
export function useAdminLang(): AdminLanguageContextValue {
  return useContext(AdminLanguageContext) ?? FALLBACK;
}

/** Tombol pilih bahasa ID / EN dengan gaya sliding pill + bendera seperti Navbar utama. */
export function AdminLanguageToggle({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { lang, setLang, t } = useAdminLang();
  return (
    <div
      role="group"
      aria-label={t("Bahasa antarmuka", "Interface language")}
      data-testid="admin-lang-toggle"
      className={cn(
        "relative inline-flex items-center rounded-full p-0.5 select-none",
        tone === "dark" ? "bg-white/10" : "border border-[#D5E5F7] bg-[#E8F1FC]",
        className
      )}
    >
      {/* Smooth Sliding Pill Indicator with Border Outline */}
      <div
        className={cn(
          "pointer-events-none absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full border shadow-sm transition-transform duration-300 ease-in-out",
          tone === "dark" ? "border-white/40 bg-white" : "border-[#C5DAF5] bg-white",
          lang === "ID" ? "left-0.5 translate-x-0" : "left-0.5 translate-x-full"
        )}
      />

      {/* ID Option */}
      <button
        type="button"
        onClick={() => setLang("ID")}
        aria-pressed={lang === "ID"}
        data-testid="admin-lang-ID"
        title="Bahasa Indonesia"
        className={cn(
          "relative z-10 flex min-w-[60px] cursor-pointer items-center justify-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FF2]/40",
          lang === "ID"
            ? "font-semibold text-[#0E234B]"
            : tone === "dark"
              ? "font-normal text-white/80 hover:text-white"
              : "font-normal text-slate-600 hover:text-[#0E234B]"
        )}
      >
        <span>ID</span>
        <span className="inline-flex h-4 w-4 overflow-hidden rounded-full border border-slate-200" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <rect width="24" height="12" fill="#E11D48" />
            <rect y="12" width="24" height="12" fill="#FFFFFF" />
          </svg>
        </span>
      </button>

      {/* EN Option */}
      <button
        type="button"
        onClick={() => setLang("EN")}
        aria-pressed={lang === "EN"}
        data-testid="admin-lang-EN"
        title="English"
        className={cn(
          "relative z-10 flex min-w-[60px] cursor-pointer items-center justify-center gap-1.5 px-3 py-1.5 text-xs transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6FF2]/40",
          lang === "EN"
            ? "font-semibold text-[#0E234B]"
            : tone === "dark"
              ? "font-normal text-white/80 hover:text-white"
              : "font-normal text-slate-600 hover:text-[#0E234B]"
        )}
      >
        <span>EN</span>
        <span className="inline-flex h-4 w-4 overflow-hidden rounded-full border border-slate-200" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <rect width="24" height="24" fill="#1E3A8A" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M0 0L24 24M24 0L0 24" stroke="#DC2626" strokeWidth="2" />
            <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M12 0V24M0 12H24" stroke="#DC2626" strokeWidth="3.5" />
          </svg>
        </span>
      </button>
    </div>
  );
}
