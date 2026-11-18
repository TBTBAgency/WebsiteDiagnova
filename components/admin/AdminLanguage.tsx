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

/** Tombol pilih bahasa ID / EN untuk panel admin. */
export function AdminLanguageToggle({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { lang, setLang, t } = useAdminLang();
  return (
    <div
      role="group"
      aria-label={t("Bahasa antarmuka", "Interface language")}
      data-testid="admin-lang-toggle"
      className={cn(
        "inline-flex items-center rounded-full p-1 text-[11px] font-bold",
        tone === "dark" ? "bg-white/10" : "bg-[#EEF0F3]",
        className
      )}
    >
      {(["ID", "EN"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            data-testid={`admin-lang-${code}`}
            title={code === "ID" ? "Bahasa Indonesia" : "English"}
            className={cn(
              "min-w-[34px] rounded-full px-2.5 py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF]/40",
              active
                ? tone === "dark"
                  ? "bg-white text-[#111318]"
                  : "bg-[#111318] text-white"
                : tone === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-slate-500 hover:text-slate-900"
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
