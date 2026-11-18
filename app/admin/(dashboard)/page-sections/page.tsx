"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Layers,
  Lock,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { CustomSectionContent, ResolvedSection } from "@/lib/cms-layout";
import { useAdminLang } from "@/components/admin/AdminLanguage";

/**
 * Halaman & Section: STRUKTUR halaman publik — urutan section, tampil/sembunyi, dan section kustom.
 * Isi section bawaan (teks, kartu, daftar, hero) diedit di Pusat Konten (/admin/cms).
 */

interface PageData {
  key: string;
  label: string;
  path: string;
  layoutSaved: boolean;
  layoutUpdatedAt: string | null;
  sections: ResolvedSection[];
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";

const CUSTOM_TEXT_FIELDS: { field: "badge" | "title" | "subtitle"; label: { id: string; en: string }; multiline: boolean }[] = [
  { field: "badge", label: { id: "Badge", en: "Badge" }, multiline: false },
  { field: "title", label: { id: "Judul", en: "Title" }, multiline: true },
  { field: "subtitle", label: { id: "Deskripsi", en: "Description" }, multiline: true },
];

function newCustomKey() {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Tautan ke editor isi section bawaan di Pusat Konten (atau Konten Global untuk FAQ). */
function contentEditorHref(pageKey: string, sectionKey: string): string {
  if (pageKey === "home" && sectionKey === "faq") return "/admin/site-content";
  const tab = pageKey === "home" ? "homepage" : pageKey;
  return `/admin/cms?tab=${tab}&section=${encodeURIComponent(sectionKey)}`;
}

function BilingualField({
  label,
  multiline,
  valueId,
  valueEn,
  onChange,
  testId,
}: {
  label: string;
  multiline: boolean;
  valueId: string;
  valueEn: string;
  onChange: (lang: "Id" | "En", value: string) => void;
  testId?: string;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {(["Id", "En"] as const).map((lang) => (
        <label key={lang} className="space-y-1 text-xs">
          <span className="font-semibold text-slate-700">
            {label} ({lang === "Id" ? "ID" : "EN"})
          </span>
          <Tag
            data-testid={testId ? `${testId}-${lang}` : undefined}
            className={inputCls + (multiline ? " min-h-[70px]" : "")}
            value={lang === "Id" ? valueId : valueEn}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(lang, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}

export default function PageSectionsAdminPage() {
  const { t } = useAdminLang();
  // Ref agar `load` tetap stabil (tidak memuat ulang & membuang draf saat bahasa diganti).
  const tRef = useRef(t);
  tRef.current = t;
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePage, setActivePage] = useState<string>("home");
  const [draft, setDraft] = useState<ResolvedSection[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const page = useMemo(() => pages.find((p) => p.key === activePage), [pages, activePage]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/layout", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || tRef.current("Gagal memuat data.", "Failed to load data."));
      setPages(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : tRef.current("Gagal memuat data.", "Failed to load data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!page) return;
    // Konten section (teks judul section bawaan & isi section kustom) ikut disimpan apa adanya.
    setDraft(page.sections.map((s) => ({ ...s, content: s.content ? { ...s.content } : undefined })));
    setDirty(false);
  }, [page]);

  // Section kustom yang sedang dibuka tetap terbuka setelah simpan; ditutup saat pindah halaman.
  useEffect(() => {
    setExpanded(null);
  }, [activePage]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const update = (key: string, fn: (s: ResolvedSection) => ResolvedSection) => {
    setDraft((list) => list.map((s) => (s.key === key ? fn(s) : s)));
    setDirty(true);
  };

  const move = (index: number, dir: -1 | 1) => {
    setDraft((list) => {
      const target = index + dir;
      if (target < 0 || target >= list.length || list[target].locked || list[index].locked) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  };

  const setContent = (key: string, field: keyof CustomSectionContent, value: string) =>
    update(key, (s) => ({ ...s, content: { ...(s.content || {}), [field]: value } }));

  const addCustom = () => {
    const key = newCustomKey();
    setDraft((list) => {
      const ctaIndex = list.findIndex((s) => s.key === "cta");
      const item: ResolvedSection = { key, type: "custom", isActive: true, sortOrder: 0, label: "Section Kustom", locked: false, content: {} };
      const next = [...list];
      next.splice(ctaIndex >= 0 ? ctaIndex : next.length, 0, item);
      return next;
    });
    setExpanded(key);
    setDirty(true);
  };

  const removeCustom = (key: string) => {
    if (
      !window.confirm(
        t(
          "Hapus section kustom ini dari halaman? Perubahan berlaku setelah Simpan Tata Letak.",
          "Remove this custom section from the page? The change takes effect after Save Layout."
        )
      )
    )
      return;
    setDraft((list) => list.filter((s) => s.key !== key));
    setDirty(true);
  };

  const saveLayout = async () => {
    if (!page) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "layout",
          page: page.key,
          baseUpdatedAt: page.layoutUpdatedAt,
          sections: draft.map((s) => ({ key: s.key, type: s.type, isActive: s.isActive, content: s.content || undefined })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || t("Gagal menyimpan.", "Failed to save."));
      await load();
      flash(
        t(
          `Tata letak halaman ${page.label} disimpan. Website diperbarui.`,
          `Layout for page ${page.label} saved. Website updated.`
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal menyimpan.", "Failed to save."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="page-sections-admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" /> {t("Halaman & Section", "Pages & Sections")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              "Atur urutan section dan tampilkan/sembunyikan section pada setiap halaman publik. Isi section (teks, gambar, kartu) diedit di",
              "Set the section order and show/hide sections on each public page. Section content (text, images, cards) is edited in"
            )}{" "}
            <a href="/admin/cms" className="font-semibold text-blue-600 hover:underline">
              {t("Pusat Konten", "Content Hub")}
            </a>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> {t("Muat Ulang", "Reload")}
        </button>
      </div>

      {success && (
        <div role="status" className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}
      {error && (
        <div role="alert" className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="tablist">
        {pages.map((p) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            data-testid={`page-tab-${p.key}`}
            aria-selected={p.key === activePage}
            onClick={() => {
              if (
                dirty &&
                !window.confirm(
                  t(
                    "Ada perubahan yang belum disimpan. Pindah halaman dan buang perubahan?",
                    "You have unsaved changes. Switch page and discard them?"
                  )
                )
              )
                return;
              setActivePage(p.key);
            }}
            className={
              "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors " +
              (p.key === activePage ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && !page && <p className="text-xs text-slate-500">{t("Memuat…", "Loading…")}</p>}

      {page && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t(`Section Halaman ${page.label}`, `${page.label} Page Sections`)}
              </h2>
              <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                <span>
                  {page.layoutSaved
                    ? t("Tata letak tersimpan di CMS.", "Layout saved in the CMS.")
                    : t("Memakai tata letak bawaan (belum pernah disimpan).", "Using the default layout (never saved).")}
                </span>
                <a href={page.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                  {t("Lihat halaman", "View page")} <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addCustom}
                data-testid="add-custom-section"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50"
              >
                <Plus className="h-3.5 w-3.5" /> {t("Tambah Section Kustom", "Add Custom Section")}
              </button>
              <button
                type="button"
                onClick={saveLayout}
                disabled={saving || !dirty}
                data-testid="save-layout"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> {saving ? t("Menyimpan…", "Saving…") : t("Simpan Tata Letak", "Save Layout")}
              </button>
            </div>
          </div>
          {dirty && (
            <p className="text-[11px] text-amber-700">
              {t("Perubahan urutan / tampilan belum disimpan.", "Order / visibility changes have not been saved.")}
            </p>
          )}

          <ol className="space-y-2">
            {draft.map((s, index) => {
              const isOpen = expanded === s.key;
              return (
                <li
                  key={s.key}
                  data-testid={`section-row-${s.key}`}
                  className={"rounded-xl border p-3 " + (s.isActive ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50/70")}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-6 text-center text-xs font-bold text-slate-400">{index + 1}</span>
                    <div className="flex-1 min-w-[160px]">
                      <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        {s.locked && <Lock className="h-3 w-3 text-slate-400" />}
                        {s.type === "custom"
                          ? s.content?.titleId || s.content?.titleEn || t("Section Kustom (baru)", "Custom Section (new)")
                          : s.label}
                        {s.type === "custom" && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                            {t("KUSTOM", "CUSTOM")}
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {s.key}
                        {s.anchor && ` · #${s.anchor}`}
                      </p>
                      {!s.isActive && s.anchor && (
                        <p className="text-[11px] text-amber-700 flex items-center gap-1">
                          <Info className="h-3 w-3" />{" "}
                          {t(
                            `Menu navigasi yang menuju #${s.anchor} akan membuka bagian atas halaman.`,
                            `Navigation links pointing to #${s.anchor} will open the top of the page.`
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" aria-label={t("Naikkan", "Move up")} onClick={() => move(index, -1)} disabled={s.locked || index === 0 || draft[index - 1]?.locked}
                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50" data-testid={`move-up-${s.key}`}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" aria-label={t("Turunkan", "Move down")} onClick={() => move(index, 1)} disabled={s.locked || index === draft.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50" data-testid={`move-down-${s.key}`}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={s.locked}
                        onClick={() => update(s.key, (x) => ({ ...x, isActive: !x.isActive }))}
                        data-testid={`toggle-${s.key}`}
                        className={
                          "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border disabled:opacity-40 " +
                          (s.isActive ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-300 text-slate-600 bg-white")
                        }
                      >
                        {s.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {s.isActive ? t("Tampil", "Visible") : t("Disembunyikan", "Hidden")}
                      </button>
                      {s.type === "custom" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : s.key)}
                            data-testid={`edit-${s.key}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 hover:bg-slate-50"
                          >
                            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}{" "}
                            {t("Edit Section Kustom", "Edit Custom Section")}
                          </button>
                          <button type="button" aria-label={t("Hapus section", "Delete section")} onClick={() => removeCustom(s.key)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50" data-testid={`delete-${s.key}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <a
                          href={contentEditorHref(page.key, s.key)}
                          data-testid={`edit-content-${s.key}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                          title={t("Edit isi section di Pusat Konten", "Edit section content in the Content Hub")}
                        >
                          <PencilLine className="h-3.5 w-3.5" /> {t("Edit Isi", "Edit Content")}
                        </a>
                      )}
                    </div>
                  </div>

                  {isOpen && s.type === "custom" && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                      {CUSTOM_TEXT_FIELDS.map(({ field, label, multiline }) => (
                        <BilingualField
                          key={field}
                          label={t(label.id, label.en)}
                          multiline={multiline}
                          testId={`field-${s.key}-${field}`}
                          valueId={(s.content?.[`${field}Id` as keyof CustomSectionContent] as string) || ""}
                          valueEn={(s.content?.[`${field}En` as keyof CustomSectionContent] as string) || ""}
                          onChange={(lang, v) => setContent(s.key, `${field}${lang}` as keyof CustomSectionContent, v)}
                        />
                      ))}
                      <ImageUploader value={s.content?.imageUrl || ""} onChange={(url) => setContent(s.key, "imageUrl", url)} label={t("Gambar Section (opsional)", "Section Image (optional)")} />
                      <label className="block space-y-1 text-xs">
                        <span className="font-semibold text-slate-700">{t("Teks alternatif gambar", "Image alt text")}</span>
                        <input className={inputCls} value={s.content?.imageAlt || ""} onChange={(e) => setContent(s.key, "imageAlt", e.target.value)} />
                      </label>
                      <BilingualField
                        label={t("Teks Tombol CTA", "CTA Button Text")}
                        multiline={false}
                        testId={`field-${s.key}-cta`}
                        valueId={s.content?.ctaTextId || ""}
                        valueEn={s.content?.ctaTextEn || ""}
                        onChange={(lang, v) => setContent(s.key, `ctaText${lang}` as keyof CustomSectionContent, v)}
                      />
                      <label className="block space-y-1 text-xs">
                        <span className="font-semibold text-slate-700">{t("URL Tombol CTA", "CTA Button URL")}</span>
                        <input
                          className={inputCls}
                          data-testid={`field-${s.key}-ctaUrl`}
                          placeholder={t("/request-demo atau https://…", "/request-demo or https://…")}
                          value={s.content?.ctaUrl || ""}
                          onChange={(e) => setContent(s.key, "ctaUrl", e.target.value)}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500">
                        {t(
                          "Section kustom disimpan dengan tombol Simpan Tata Letak.",
                          "Custom sections are saved with the Save Layout button."
                        )}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
