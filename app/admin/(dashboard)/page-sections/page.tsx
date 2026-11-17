"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ExternalLink,
  Info,
  Layers,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { CustomSectionContent, ResolvedSection, SectionDefaults } from "@/lib/cms-layout";
import type { HeroCtaContent, HeroDefaults, HeroExtraContent, HeroMetricContent } from "@/lib/cms-hero";

interface HeroData {
  badgeId: string | null;
  badgeEn: string | null;
  titleId: string | null;
  titleEn: string | null;
  subtitleId: string | null;
  subtitleEn: string | null;
}

interface PageData {
  key: string;
  label: string;
  path: string;
  heroSectionKey: string | null;
  layoutSaved: boolean;
  layoutUpdatedAt: string | null;
  heroUpdatedAt: string | null;
  sections: ResolvedSection[];
  hero: (HeroData & { isPublished: boolean }) | null;
  heroDefaults: HeroDefaults | null;
  heroExtra: HeroExtraContent | null;
}

interface HeroExtraDraft {
  primaryCta: HeroCtaContent | null;
  secondaryCta: HeroCtaContent | null;
  metrics: HeroMetricContent[];
}

const TEXT_FIELDS: { field: "badge" | "title" | "subtitle"; label: string; multiline: boolean }[] = [
  { field: "badge", label: "Badge", multiline: false },
  { field: "title", label: "Judul", multiline: true },
  { field: "subtitle", label: "Deskripsi", multiline: true },
];

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";

function newCustomKey() {
  return `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

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

export default function PageSectionsAdminPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePage, setActivePage] = useState<string>("home");
  const [draft, setDraft] = useState<ResolvedSection[]>([]);
  const [heroDraft, setHeroDraft] = useState<HeroData | null>(null);
  const [heroExtraDraft, setHeroExtraDraft] = useState<HeroExtraDraft | null>(null);
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
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal memuat data.");
      setPages(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!page) return;
    setDraft(page.sections.map((s) => ({ ...s, content: s.content ? { ...s.content } : undefined })));
    setHeroDraft(
      page.hero
        ? { ...page.hero }
        : page.heroSectionKey
          ? { badgeId: null, badgeEn: null, titleId: null, titleEn: null, subtitleId: null, subtitleEn: null }
          : null
    );
    if (page.heroDefaults) {
      const ex = page.heroExtra || {};
      const d = page.heroDefaults;
      setHeroExtraDraft({
        primaryCta: ex.primaryCta === undefined ? { ...d.primaryCta } : ex.primaryCta,
        secondaryCta: ex.secondaryCta === undefined ? { ...d.secondaryCta } : ex.secondaryCta,
        metrics: (Array.isArray(ex.metrics) ? ex.metrics : d.metrics).map((m) => ({ ...m })),
      });
    } else {
      setHeroExtraDraft(null);
    }
    setExpanded(null);
    setDirty(false);
  }, [page]);

  const updateMetric = (index: number, patch: Partial<HeroMetricContent>) =>
    setHeroExtraDraft((h) => (h ? { ...h, metrics: h.metrics.map((m, i) => (i === index ? { ...m, ...patch } : m)) } : h));
  const moveMetric = (index: number, dir: -1 | 1) =>
    setHeroExtraDraft((h) => {
      if (!h) return h;
      const t = index + dir;
      if (t < 0 || t >= h.metrics.length) return h;
      const metrics = [...h.metrics];
      [metrics[index], metrics[t]] = [metrics[t], metrics[index]];
      return { ...h, metrics };
    });

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
      const item: ResolvedSection = {
        key,
        type: "custom",
        isActive: true,
        sortOrder: 0,
        label: "Section Kustom",
        locked: false,
        content: {},
      };
      const next = [...list];
      next.splice(ctaIndex >= 0 ? ctaIndex : next.length, 0, item);
      return next;
    });
    setExpanded(key);
    setDirty(true);
  };

  const removeCustom = (key: string) => {
    if (!window.confirm("Hapus section kustom ini dari halaman? Perubahan berlaku setelah Simpan Tata Letak.")) return;
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
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan.");
      await load();
      flash(`Tata letak halaman ${page.label} disimpan. Website diperbarui.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const saveHero = async () => {
    if (!page || !heroDraft) return;
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
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan hero.");
      await load();
      flash(`Hero halaman ${page.label} disimpan.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan hero.");
    } finally {
      setSaving(false);
    }
  };

  const defaultsText = (d: SectionDefaults | undefined, field: "badge" | "title" | "subtitle") => d?.[field];

  return (
    <div className="space-y-6" data-testid="page-sections-admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" /> Halaman &amp; Section
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Atur urutan, tampilkan/sembunyikan section, ubah teks header section, dan tambahkan section kustom pada setiap
            halaman publik. Konten detail section Homepage tetap diedit di Pusat Konten (CMS).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Muat Ulang
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
              if (dirty && !window.confirm("Ada perubahan yang belum disimpan. Pindah halaman dan buang perubahan?")) return;
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

      {loading && !page && <p className="text-xs text-slate-500">Memuat…</p>}

      {page && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>
              Status: {page.layoutSaved ? "tata letak tersimpan di CMS" : "memakai tata letak bawaan (belum pernah disimpan)"}
            </span>
            <a
              href={page.path}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
            >
              Lihat halaman <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {heroDraft && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3" data-testid="hero-editor">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Hero Halaman ({page.heroSectionKey})</h2>
                <button
                  type="button"
                  onClick={saveHero}
                  disabled={saving}
                  data-testid="save-hero"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" /> Simpan Hero
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Kosongkan kolom untuk memakai teks bawaan halaman. Baris baru pada judul menjadi pemisah baris.</p>
              {TEXT_FIELDS.map(({ field, label, multiline }) => (
                <BilingualField
                  key={field}
                  label={label}
                  multiline={multiline}
                  testId={`hero-${field}`}
                  valueId={heroDraft[`${field}Id` as keyof HeroData] || ""}
                  valueEn={heroDraft[`${field}En` as keyof HeroData] || ""}
                  onChange={(lang, v) => setHeroDraft((h) => (h ? { ...h, [`${field}${lang}`]: v } : h))}
                />
              ))}

              {heroExtraDraft && page.heroDefaults && (
                <div className="space-y-4 pt-3 border-t border-slate-100" data-testid="hero-extra-editor">
                  {(["primaryCta", "secondaryCta"] as const).map((which) => {
                    const cta = heroExtraDraft[which];
                    const label = which === "primaryCta" ? "Tombol Utama" : "Tombol Kedua";
                    return (
                      <div key={which} className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <input
                            type="checkbox"
                            data-testid={`hero-${which}-enabled`}
                            checked={!!cta}
                            onChange={(e) =>
                              setHeroExtraDraft((h) =>
                                h ? { ...h, [which]: e.target.checked ? { ...page.heroDefaults![which] } : null } : h
                              )
                            }
                          />
                          {label} (CTA) ditampilkan
                        </label>
                        {cta && (
                          <>
                            <BilingualField
                              label={`Teks ${label}`}
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
                              <span className="font-semibold text-slate-700">URL {label}</span>
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
                      <p className="text-xs font-semibold text-slate-700">Metrik / Statistik Hero</p>
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
                        <Plus className="h-3 w-3" /> Tambah Metrik
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Angka & klaim pada metrik tampil sebagai fakta produk. Nonaktifkan metrik yang belum terverifikasi.
                    </p>
                    {heroExtraDraft.metrics.length === 0 && (
                      <p className="text-[11px] text-slate-500">Tidak ada metrik — strip metrik tidak ditampilkan di halaman.</p>
                    )}
                    {heroExtraDraft.metrics.map((m, i) => (
                      <div key={m.id} data-testid={`hero-metric-${i}`} className={"rounded-xl border p-3 space-y-2 " + (m.isActive ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/70")}>
                        <div className="flex flex-wrap items-center gap-1 justify-end">
                          <button type="button" aria-label="Naikkan metrik" onClick={() => moveMetric(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30">
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button type="button" aria-label="Turunkan metrik" onClick={() => moveMetric(i, 1)} disabled={i === heroExtraDraft.metrics.length - 1} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30">
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            data-testid={`hero-metric-${i}-toggle`}
                            onClick={() => updateMetric(i, { isActive: !m.isActive })}
                            className={"inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border " + (m.isActive ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-300 text-slate-600")}
                          >
                            {m.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {m.isActive ? "Tampil" : "Disembunyikan"}
                          </button>
                          <button
                            type="button"
                            aria-label="Hapus metrik"
                            onClick={() => setHeroExtraDraft((h) => (h ? { ...h, metrics: h.metrics.filter((_, j) => j !== i) } : h))}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <BilingualField label="Nilai" multiline={false} testId={`hero-metric-${i}-value`} valueId={m.valueId} valueEn={m.valueEn} onChange={(lang, v) => updateMetric(i, { [`value${lang}`]: v })} />
                        <BilingualField label="Label" multiline={false} valueId={m.labelId} valueEn={m.labelEn} onChange={(lang, v) => updateMetric(i, { [`label${lang}`]: v })} />
                        <BilingualField label="Keterangan" multiline={false} valueId={m.subId} valueEn={m.subEn} onChange={(lang, v) => updateMetric(i, { [`sub${lang}`]: v })} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900">Section Halaman {page.label}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addCustom}
                  data-testid="add-custom-section"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Section Kustom
                </button>
                <button
                  type="button"
                  onClick={saveLayout}
                  disabled={saving || !dirty}
                  data-testid="save-layout"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" /> {saving ? "Menyimpan…" : "Simpan Tata Letak"}
                </button>
              </div>
            </div>
            {dirty && <p className="text-[11px] text-amber-700">Perubahan belum disimpan.</p>}

            <ol className="space-y-2">
              {draft.map((s, index) => {
                const isOpen = expanded === s.key;
                const editable = s.type === "custom" || !!s.defaults;
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
                          {s.type === "custom" ? s.content?.titleId || s.content?.titleEn || "Section Kustom (baru)" : s.label}
                          {s.type === "custom" && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">KUSTOM</span>
                          )}
                          {s.content && s.type === "builtin" && Object.values(s.content).some(Boolean) && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">TEKS DIUBAH</span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {s.key}
                          {s.anchor && ` · #${s.anchor}`}
                          {s.note && ` · ${s.note}`}
                        </p>
                        {!s.isActive && s.anchor && (
                          <p className="text-[11px] text-amber-700 flex items-center gap-1">
                            <Info className="h-3 w-3" /> Menu navigasi yang menuju #{s.anchor} akan membuka bagian atas halaman.
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" aria-label="Naikkan" onClick={() => move(index, -1)} disabled={s.locked || index === 0 || draft[index - 1]?.locked}
                          className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50" data-testid={`move-up-${s.key}`}>
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" aria-label="Turunkan" onClick={() => move(index, 1)} disabled={s.locked || index === draft.length - 1}
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
                          {s.isActive ? "Tampil" : "Disembunyikan"}
                        </button>
                        {editable && (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : s.key)}
                            data-testid={`edit-${s.key}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-slate-200 hover:bg-slate-50"
                          >
                            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />} Edit Konten
                          </button>
                        )}
                        {s.type === "custom" && (
                          <button type="button" aria-label="Hapus section" onClick={() => removeCustom(s.key)}
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50" data-testid={`delete-${s.key}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                        {s.type === "builtin" && (
                          <p className="text-[11px] text-slate-500">
                            Kosongkan kolom untuk memakai teks bawaan (ditampilkan sebagai placeholder). Isi visual, kartu, dan data
                            demonstrasi di dalam section ini masih bagian dari desain halaman.
                          </p>
                        )}
                        {TEXT_FIELDS.filter(({ field }) => s.type === "custom" || defaultsText(s.defaults, field)).map(({ field, label, multiline }) => (
                          <BilingualField
                            key={field}
                            label={label}
                            multiline={multiline}
                            testId={`field-${s.key}-${field}`}
                            valueId={(s.content?.[`${field}Id` as keyof CustomSectionContent] as string) || ""}
                            valueEn={(s.content?.[`${field}En` as keyof CustomSectionContent] as string) || ""}
                            placeholderId={defaultsText(s.defaults, field)?.[0]}
                            placeholderEn={defaultsText(s.defaults, field)?.[1]}
                            onChange={(lang, v) => setContent(s.key, `${field}${lang}` as keyof CustomSectionContent, v)}
                          />
                        ))}
                        {s.type === "custom" && (
                          <>
                            <ImageUploader
                              value={s.content?.imageUrl || ""}
                              onChange={(url) => setContent(s.key, "imageUrl", url)}
                              label="Gambar Section (opsional)"
                            />
                            <label className="block space-y-1 text-xs">
                              <span className="font-semibold text-slate-700">Teks alternatif gambar</span>
                              <input className={inputCls} value={s.content?.imageAlt || ""} onChange={(e) => setContent(s.key, "imageAlt", e.target.value)} />
                            </label>
                            <BilingualField
                              label="Teks Tombol CTA"
                              multiline={false}
                              testId={`field-${s.key}-cta`}
                              valueId={s.content?.ctaTextId || ""}
                              valueEn={s.content?.ctaTextEn || ""}
                              onChange={(lang, v) => setContent(s.key, `ctaText${lang}` as keyof CustomSectionContent, v)}
                            />
                            <label className="block space-y-1 text-xs">
                              <span className="font-semibold text-slate-700">URL Tombol CTA</span>
                              <input
                                className={inputCls}
                                data-testid={`field-${s.key}-ctaUrl`}
                                placeholder="/request-demo atau https://…"
                                value={s.content?.ctaUrl || ""}
                                onChange={(e) => setContent(s.key, "ctaUrl", e.target.value)}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
