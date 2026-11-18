"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, ExternalLink, Eye, EyeOff, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { SectionContentEditor } from "@/components/admin/SectionContentEditor";
import { useAdminLang, type AdminT } from "@/components/admin/AdminLanguage";
import type { ResolvedSection } from "@/lib/cms-layout";
import type { HeroCtaContent, HeroDefaults, HeroExtraContent, HeroMetricContent } from "@/lib/cms-hero";
import type { ResolvedPageContent, SectionContentDef } from "@/lib/cms-page-content";

/**
 * Pusat Konten › halaman dalam (Platform, Solusi, Modul, Nova AI, Integrasi): mengedit hero dan
 * isi setiap section bawaan. Urutan & tampil/sembunyi section dikelola di Halaman & Section.
 */

interface HeroData {
  badgeId: string | null;
  badgeEn: string | null;
  titleId: string | null;
  titleEn: string | null;
  subtitleId: string | null;
  subtitleEn: string | null;
}

export interface InnerPageData {
  key: string;
  label: string;
  path: string;
  heroSectionKey: string | null;
  layoutUpdatedAt: string | null;
  heroUpdatedAt: string | null;
  sections: ResolvedSection[];
  hero: (HeroData & { isPublished: boolean }) | null;
  heroDefaults: HeroDefaults | null;
  heroExtra: HeroExtraContent | null;
  contentDefs: Record<string, SectionContentDef> | null;
  content: ResolvedPageContent | null;
  contentCustomized: string[];
}

interface HeroExtraDraft {
  primaryCta: HeroCtaContent | null;
  secondaryCta: HeroCtaContent | null;
  metrics: HeroMetricContent[];
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";

const TEXT_FIELDS: { field: "badge" | "title" | "subtitle"; label: string; labelEn: string; multiline: boolean }[] = [
  { field: "badge", label: "Badge", labelEn: "Badge", multiline: false },
  { field: "title", label: "Judul", labelEn: "Title", multiline: true },
  { field: "subtitle", label: "Deskripsi", labelEn: "Description", multiline: true },
];

function BilingualField({
  label,
  multiline,
  valueId,
  valueEn,
  placeholderId,
  placeholderEn,
  onChange,
  testId,
}: {
  label: string;
  multiline: boolean;
  valueId: string;
  valueEn: string;
  placeholderId?: string;
  placeholderEn?: string;
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
            placeholder={(lang === "Id" ? placeholderId : placeholderEn) || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(lang, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}

/** Label sebuah section halaman dalam di Pusat Konten (hero = "Gambaran <Halaman>"). */
export function innerSectionLabel(pageLabel: string, s: { key: string; label: string }, t?: AdminT) {
  if (s.key !== "hero") return s.label;
  const id = `Gambaran ${pageLabel} (Hero)`;
  return t ? t(id, `${pageLabel} Overview (Hero)`) : id;
}

function HeroEditor({ page, onSaved }: { page: InnerPageData; onSaved: (msg: string) => Promise<void> }) {
  const { t } = useAdminLang();
  const empty: HeroData = { badgeId: null, badgeEn: null, titleId: null, titleEn: null, subtitleId: null, subtitleEn: null };
  const [heroDraft, setHeroDraft] = useState<HeroData>(page.hero ? { ...page.hero } : empty);
  const initExtra = useCallback((): HeroExtraDraft | null => {
    if (!page.heroDefaults) return null;
    const ex = page.heroExtra || {};
    const d = page.heroDefaults;
    return {
      primaryCta: ex.primaryCta === undefined ? { ...d.primaryCta } : ex.primaryCta,
      secondaryCta: ex.secondaryCta === undefined ? { ...d.secondaryCta } : ex.secondaryCta,
      metrics: (Array.isArray(ex.metrics) ? ex.metrics : d.metrics).map((m) => ({ ...m })),
    };
  }, [page]);
  const [heroExtraDraft, setHeroExtraDraft] = useState<HeroExtraDraft | null>(initExtra);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHeroDraft(page.hero ? { ...page.hero } : empty);
    setHeroExtraDraft(initExtra());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const updateMetric = (index: number, patch: Partial<HeroMetricContent>) =>
    setHeroExtraDraft((h) => (h ? { ...h, metrics: h.metrics.map((m, i) => (i === index ? { ...m, ...patch } : m)) } : h));
  const moveMetric = (index: number, dir: -1 | 1) =>
    setHeroExtraDraft((h) => {
      if (!h) return h;
      const target = index + dir;
      if (target < 0 || target >= h.metrics.length) return h;
      const metrics = [...h.metrics];
      [metrics[index], metrics[target]] = [metrics[target], metrics[index]];
      return { ...h, metrics };
    });

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hero",
          page: page.key,
          baseUpdatedAt: page.heroUpdatedAt,
          ...Object.fromEntries(
            Object.entries(heroDraft)
              .filter(([k]) => /^(badge|title|subtitle)(Id|En)$/.test(k))
              .map(([k, v]) => [k, v ?? ""])
          ),
          ...(heroExtraDraft && {
            primaryCta: heroExtraDraft.primaryCta,
            secondaryCta: heroExtraDraft.secondaryCta,
            metrics: heroExtraDraft.metrics,
          }),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || t("Gagal menyimpan hero.", "Failed to save hero."));
      await onSaved(t(`Hero halaman ${page.label} disimpan. Website diperbarui.`, `${page.label} page hero saved. Website updated.`));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal menyimpan hero.", "Failed to save hero."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3" data-testid="hero-editor">
      <div className="sticky top-[76px] z-20 -mx-5 -mt-5 flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border-b border-slate-100 bg-white/95 px-5 py-3 backdrop-blur">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{innerSectionLabel(page.label, { key: "hero", label: "" }, t)}</h3>
          <p className="text-[11px] text-slate-500">
            {t(
              "Kosongkan kolom untuk memakai teks bawaan halaman. Baris baru pada judul menjadi pemisah baris.",
              "Leave a field empty to use the page's default text. A new line in the title becomes a line break."
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          data-testid="save-hero"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#087BEE] text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" /> {saving ? t("Menyimpan…", "Saving…") : t("Simpan Hero", "Save Hero")}
        </button>
      </div>
      {error && <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2">{error}</p>}
      {TEXT_FIELDS.map(({ field, label, labelEn, multiline }) => (
        <BilingualField
          key={field}
          label={t(label, labelEn)}
          multiline={multiline}
          testId={`hero-${field}`}
          valueId={heroDraft[`${field}Id` as keyof HeroData] || ""}
          valueEn={heroDraft[`${field}En` as keyof HeroData] || ""}
          onChange={(lang, v) => setHeroDraft((h) => ({ ...h, [`${field}${lang}`]: v }))}
        />
      ))}

      {heroExtraDraft && page.heroDefaults && (
        <div className="space-y-4 pt-3 border-t border-slate-100" data-testid="hero-extra-editor">
          {(["primaryCta", "secondaryCta"] as const).map((which) => {
            const cta = heroExtraDraft[which];
            const label = which === "primaryCta" ? t("Tombol Utama", "Primary Button") : t("Tombol Kedua", "Secondary Button");
            return (
              <div key={which} className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    data-testid={`hero-${which}-enabled`}
                    checked={!!cta}
                    onChange={(e) =>
                      setHeroExtraDraft((h) => (h ? { ...h, [which]: e.target.checked ? { ...page.heroDefaults![which] } : null } : h))
                    }
                  />
                  {t(`${label} (CTA) ditampilkan`, `Show ${label} (CTA)`)}
                </label>
                {cta && (
                  <>
                    <BilingualField
                      label={t(`Teks ${label}`, `${label} Text`)}
                      multiline={false}
                      testId={`hero-${which}-text`}
                      valueId={cta.textId}
                      valueEn={cta.textEn}
                      placeholderId={page.heroDefaults![which].textId}
                      placeholderEn={page.heroDefaults![which].textEn}
                      onChange={(lang, v) =>
                        setHeroExtraDraft((h) => (h && h[which] ? { ...h, [which]: { ...h[which]!, [`text${lang}`]: v } } : h))
                      }
                    />
                    <label className="block space-y-1 text-xs">
                      <span className="font-semibold text-slate-700">{t(`URL ${label}`, `${label} URL`)}</span>
                      <input
                        className={inputCls}
                        data-testid={`hero-${which}-url`}
                        value={cta.url}
                        placeholder={page.heroDefaults![which].url}
                        onChange={(e) =>
                          setHeroExtraDraft((h) => (h && h[which] ? { ...h, [which]: { ...h[which]!, url: e.target.value } } : h))
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            );
          })}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">{t("Metrik / Statistik Hero", "Hero Metrics / Stats")}</p>
              <button
                type="button"
                data-testid="hero-metric-add"
                disabled={heroExtraDraft.metrics.length >= 6}
                onClick={() =>
                  setHeroExtraDraft((h) =>
                    h
                      ? {
                          ...h,
                          metrics: [
                            ...h.metrics,
                            { id: `m${Date.now().toString(36)}`, valueId: "", valueEn: "", labelId: "", labelEn: "", subId: "", subEn: "", isActive: true },
                          ],
                        }
                      : h
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold disabled:opacity-40"
              >
                <Plus className="h-3 w-3" /> {t("Tambah Metrik", "Add Metric")}
              </button>
            </div>
            <p className="text-[11px] text-amber-700">
              {t(
                "Angka & klaim pada metrik tampil sebagai fakta produk. Nonaktifkan metrik yang belum terverifikasi.",
                "Numbers & claims in metrics appear as product facts. Disable any metric that has not been verified."
              )}
            </p>
            {heroExtraDraft.metrics.length === 0 && (
              <p className="text-[11px] text-slate-500">
                {t("Tidak ada metrik — strip metrik tidak ditampilkan di halaman.", "No metrics — the metrics strip is not shown on the page.")}
              </p>
            )}
            {heroExtraDraft.metrics.map((m, i) => (
              <div key={m.id} data-testid={`hero-metric-${i}`} className={"rounded-xl border p-3 space-y-2 " + (m.isActive ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/70")}>
                <div className="flex flex-wrap items-center gap-1 justify-end">
                  <button type="button" aria-label={t("Naikkan metrik", "Move metric up")} onClick={() => moveMetric(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30">
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button type="button" aria-label={t("Turunkan metrik", "Move metric down")} onClick={() => moveMetric(i, 1)} disabled={i === heroExtraDraft.metrics.length - 1} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30">
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    data-testid={`hero-metric-${i}-toggle`}
                    onClick={() => updateMetric(i, { isActive: !m.isActive })}
                    className={"inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border " + (m.isActive ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-300 text-slate-600")}
                  >
                    {m.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {m.isActive ? t("Tampil", "Visible") : t("Disembunyikan", "Hidden")}
                  </button>
                  <button
                    type="button"
                    aria-label={t("Hapus metrik", "Delete metric")}
                    onClick={() => setHeroExtraDraft((h) => (h ? { ...h, metrics: h.metrics.filter((_, j) => j !== i) } : h))}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <BilingualField label={t("Nilai", "Value")} multiline={false} testId={`hero-metric-${i}-value`} valueId={m.valueId} valueEn={m.valueEn} onChange={(lang, v) => updateMetric(i, { [`value${lang}`]: v })} />
                <BilingualField label="Label" multiline={false} valueId={m.labelId} valueEn={m.labelEn} onChange={(lang, v) => updateMetric(i, { [`label${lang}`]: v })} />
                <BilingualField label={t("Keterangan", "Caption")} multiline={false} valueId={m.subId} valueEn={m.subEn} onChange={(lang, v) => updateMetric(i, { [`sub${lang}`]: v })} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Editor satu section halaman dalam. `sectionKey` = "hero" untuk hero halaman, selain itu kunci
 * section bawaan (lihat CMS_PAGES di lib/cms-layout.ts).
 */
export function InnerPageContentManager({
  pageKey,
  sectionKey,
  focusItem = null,
}: {
  pageKey: string;
  sectionKey: string;
  /** Kartu yang dituju submenu header; `n` berubah tiap klik agar kartu dibuka ulang. */
  focusItem?: { itemId: string; n: number } | null;
}) {
  const { t } = useAdminLang();
  // Ref agar `load` tetap stabil (ganti bahasa tidak memicu muat ulang data).
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  const [pages, setPages] = useState<InnerPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/layout", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || tRef.current("Gagal memuat konten halaman.", "Failed to load page content."));
      setPages(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : tRef.current("Gagal memuat konten halaman.", "Failed to load page content."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const page = useMemo(() => pages.find((p) => p.key === pageKey), [pages, pageKey]);
  const section = page?.sections.find((s) => s.key === sectionKey);

  const onSaved = async (msg: string) => {
    await load();
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  if (loading && !page) return <p className="text-xs text-slate-500">{t("Memuat konten halaman…", "Loading page content…")}</p>;
  if (!page) {
    return (
      <div role="alert" className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" /> {error || t("Halaman tidak ditemukan.", "Page not found.")}
      </div>
    );
  }

  const headerOverride = section?.content && Object.values(section.content).some(Boolean) ? section.content : null;

  return (
    <div className="space-y-4" data-testid={`inner-page-content-${pageKey}-${sectionKey}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            {page.label} › {section ? innerSectionLabel(page.label, section, t) : sectionKey}
          </h2>
          <p className="text-[11px] text-slate-500">
            {t(
              "Isi section diedit di sini. Urutan dan tampil/sembunyi section diatur di",
              "Section content is edited here. Section order and visibility are managed in"
            )}{" "}
            <a href="/admin/page-sections" className="font-semibold text-[#087BEE] hover:underline">
              {t("Halaman & Section", "Pages & Sections")}
            </a>
            .
            {section && !section.isActive && (
              <span className="ml-1 font-semibold text-amber-700">
                {t("Section ini sedang disembunyikan di website.", "This section is currently hidden on the website.")}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`${page.path}${focusItem ? `#${focusItem.itemId}` : section?.anchor ? `#${section.anchor}` : ""}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("Lihat di website", "View on website")} <ExternalLink className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {t("Muat Ulang", "Reload")}
          </button>
        </div>
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

      {sectionKey === "hero" ? (
        <HeroEditor page={page} onSaved={onSaved} />
      ) : section && (page.contentDefs?.[sectionKey] || section.defaults) ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <SectionContentEditor
            page={page.key}
            sectionKey={sectionKey}
            def={page.contentDefs?.[sectionKey] ?? null}
            value={page.content?.[sectionKey] ?? null}
            header={section.defaults ? { defaults: section.defaults, value: headerOverride } : null}
            customized={page.contentCustomized.includes(sectionKey) || !!headerOverride}
            baseUpdatedAt={page.layoutUpdatedAt}
            focusItem={focusItem}
            onSaved={onSaved}
          />
        </div>
      ) : (
        <p className="text-xs text-slate-500">{t("Section ini tidak memiliki konten yang dapat diedit.", "This section has no editable content.")}</p>
      )}
    </div>
  );
}
