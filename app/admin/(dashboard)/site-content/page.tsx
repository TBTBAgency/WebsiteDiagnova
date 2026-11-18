"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Globe2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { AnnouncementContent, FaqContent, FooterContent, LinkItem } from "@/lib/site-content";
import { useAdminLang } from "@/components/admin/AdminLanguage";

type Tab = "footer" | "faq" | "announcement";
interface SiteData {
  footer: { saved: boolean; updatedAt: string | null; content: FooterContent };
  faq: { saved: boolean; updatedAt: string | null; content: FaqContent };
  announcement: { saved: boolean; updatedAt: string | null; content: AnnouncementContent };
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";
const btnIcon = "p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30";
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const t = index + dir;
  if (t < 0 || t >= list.length) return list;
  const next = [...list];
  [next[index], next[t]] = [next[t], next[index]];
  return next;
}

function Bi({
  label,
  id,
  en,
  onChange,
  multiline = false,
  testId,
}: {
  label: string;
  id: string;
  en: string;
  onChange: (lang: "Id" | "En", v: string) => void;
  multiline?: boolean;
  testId?: string;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {(["Id", "En"] as const).map((l) => (
        <label key={l} className="space-y-1 text-xs">
          <span className="font-semibold text-slate-700">
            {label} ({l === "Id" ? "ID" : "EN"})
          </span>
          <Tag
            data-testid={testId ? `${testId}-${l}` : undefined}
            className={inputCls + (multiline ? " min-h-[70px]" : "")}
            value={l === "Id" ? id : en}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(l, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}

function ActiveToggle({ active, onToggle, testId }: { active: boolean; onToggle: () => void; testId?: string }) {
  const { t } = useAdminLang();
  return (
    <button
      type="button"
      onClick={onToggle}
      data-testid={testId}
      className={
        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border " +
        (active ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-300 text-slate-600 bg-white")
      }
    >
      {active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />} {active ? t("Tampil", "Visible") : t("Disembunyikan", "Hidden")}
    </button>
  );
}

/** Editor daftar tautan (dipakai kolom footer & tombol announcement). */
function LinkListEditor({ links, onChange, testId }: { links: LinkItem[]; onChange: (l: LinkItem[]) => void; testId: string }) {
  const { t } = useAdminLang();
  const set = (i: number, patch: Partial<LinkItem>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  return (
    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={l.id} data-testid={`${testId}-link-${i}`} className={"rounded-lg border p-2 space-y-2 " + (l.isActive ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50")}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input className={inputCls} placeholder="Label (ID)" value={l.labelId} onChange={(e) => set(i, { labelId: e.target.value })} data-testid={`${testId}-link-${i}-labelId`} />
            <input className={inputCls} placeholder="Label (EN)" value={l.labelEn} onChange={(e) => set(i, { labelEn: e.target.value })} />
            <input className={inputCls} placeholder={t("/halaman, /halaman#anchor, atau https://", "/page, /page#anchor, or https://")} value={l.url} onChange={(e) => set(i, { url: e.target.value })} data-testid={`${testId}-link-${i}-url`} />
          </div>
          <div className="flex items-center gap-1 justify-end">
            <button type="button" aria-label={t("Naikkan", "Move up")} className={btnIcon} disabled={i === 0} onClick={() => onChange(move(links, i, -1))}><ArrowUp className="h-3 w-3" /></button>
            <button type="button" aria-label={t("Turunkan", "Move down")} className={btnIcon} disabled={i === links.length - 1} onClick={() => onChange(move(links, i, 1))}><ArrowDown className="h-3 w-3" /></button>
            <ActiveToggle active={l.isActive} onToggle={() => set(i, { isActive: !l.isActive })} testId={`${testId}-link-${i}-toggle`} />
            <button type="button" aria-label={t("Hapus tautan", "Delete link")} className="p-1.5 rounded-lg border border-red-200 text-red-600" onClick={() => onChange(links.filter((_, j) => j !== i))}><Trash2 className="h-3 w-3" /></button>
          </div>
        </div>
      ))}
      <button
        type="button"
        data-testid={`${testId}-add-link`}
        onClick={() => onChange([...links, { id: newId("link"), labelId: "", labelEn: "", url: "", isActive: true }])}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold"
      >
        <Plus className="h-3 w-3" /> {t("Tambah Tautan", "Add Link")}
      </button>
    </div>
  );
}

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);

export default function SiteContentAdminPage() {
  const { t } = useAdminLang();
  // Ref agar `load` tetap stabil (tidak memuat ulang & membuang perubahan saat bahasa diganti).
  const tRef = useRef(t);
  tRef.current = t;
  const [tab, setTab] = useState<Tab>("footer");
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/site", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || tRef.current("Gagal memuat data.", "Failed to load data."));
      setData(json.data);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : tRef.current("Gagal memuat data.", "Failed to load data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = <K extends Tab>(key: K, fn: (c: SiteData[K]["content"]) => SiteData[K]["content"]) => {
    setData((d) => (d ? { ...d, [key]: { ...d[key], content: fn(d[key].content) } } : d));
    setDirty(true);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/cms/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tab, data: data[tab].content, baseUpdatedAt: data[tab].updatedAt }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || t("Gagal menyimpan.", "Failed to save."));
      await load();
      setSuccess(json.message || t("Tersimpan.", "Saved."));
      setTimeout(() => setSuccess(""), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gagal menyimpan.", "Failed to save."));
    } finally {
      setSaving(false);
    }
  };

  const footer = data?.footer.content;
  const faq = data?.faq.content;
  const ann = data?.announcement.content;

  return (
    <div className="space-y-6" data-testid="site-content-admin">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display flex items-center gap-2">
            <Globe2 className="h-6 w-6 text-blue-600" /> {t("Konten Global", "Global Content")}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t(
              "Footer, FAQ, dan Announcement Bar yang tampil di seluruh website publik.",
              "Footer, FAQ, and Announcement Bar shown across the entire public website."
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> {t("Muat Ulang", "Reload")}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            data-testid="site-save"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? t("Menyimpan…", "Saving…") : t("Simpan", "Save")}
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

      <div className="flex flex-wrap gap-2" role="tablist">
        {(
          [
            ["footer", "Footer"],
            ["faq", "FAQ"],
            ["announcement", "Announcement Bar"],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            data-testid={`site-tab-${k}`}
            onClick={() => {
              if (
                dirty &&
                !window.confirm(
                  t(
                    "Ada perubahan yang belum disimpan. Pindah tab dan buang perubahan?",
                    "You have unsaved changes. Switch tab and discard them?"
                  )
                )
              )
                return;
              if (dirty) load();
              setTab(k);
            }}
            className={
              "px-3.5 py-2 rounded-xl text-xs font-semibold border " +
              (tab === k ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
            }
          >
            {label}
            {data && !data[k].saved && <span className="ml-1 opacity-70">{t("(bawaan)", "(default)")}</span>}
          </button>
        ))}
      </div>
      {dirty && <p className="text-[11px] text-amber-700">{t("Perubahan belum disimpan.", "Changes not saved yet.")}</p>}
      {loading && !data && <p className="text-xs text-slate-500">{t("Memuat…", "Loading…")}</p>}

      {/* ─────────────── FOOTER ─────────────── */}
      {tab === "footer" && footer && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">{t("Identitas & Kontak", "Identity & Contact")}</h2>
            <ImageUploader
              value={footer.logoUrl}
              onChange={(url) => patch("footer", (c) => ({ ...c, logoUrl: url }))}
              label={t("Logo Footer", "Footer Logo")}
              hint={t(
                "Ditampilkan putih (inverted) di atas latar biru. Kosong = logo bawaan.",
                "Shown in white (inverted) on a blue background. Empty = default logo."
              )}
              aspectRatio="banner"
            />
            <Bi label={t("Deskripsi Perusahaan", "Company Description")}multiline id={footer.descriptionId} en={footer.descriptionEn} testId="footer-desc" onChange={(l, v) => patch("footer", (c) => ({ ...c, [`description${l}`]: v }))} />
            <Bi label="Copyright" id={footer.copyrightId} en={footer.copyrightEn} onChange={(l, v) => patch("footer", (c) => ({ ...c, [`copyright${l}`]: v }))} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {(["email", "phone", "whatsapp"] as const).map((f) => (
                <label key={f} className="space-y-1">
                  <span className="font-semibold text-slate-700">{f === "email" ? "Email" : f === "phone" ? t("Telepon", "Phone") : "WhatsApp"}</span>
                  <input
                    className={inputCls}
                    data-testid={`footer-contact-${f}`}
                    value={footer.contact[f]}
                    onChange={(e) => patch("footer", (c) => ({ ...c, contact: { ...c.contact, [f]: e.target.value } }))}
                  />
                </label>
              ))}
            </div>
            <Bi label={t("Alamat", "Address")} multiline id={footer.contact.addressId} en={footer.contact.addressEn} onChange={(l, v) => patch("footer", (c) => ({ ...c, contact: { ...c.contact, [`address${l}`]: v } }))} />
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={footer.legal.showTerms} onChange={(e) => patch("footer", (c) => ({ ...c, legal: { ...c.legal, showTerms: e.target.checked } }))} />
                {t("Tampilkan tautan Syarat & Ketentuan (/terms)", "Show Terms & Conditions link (/terms)")}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={footer.legal.showPrivacy} onChange={(e) => patch("footer", (c) => ({ ...c, legal: { ...c.legal, showPrivacy: e.target.checked } }))} />
                {t("Tampilkan tautan Kebijakan Privasi (/privacy)", "Show Privacy Policy link (/privacy)")}
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{t("Kelompok Tautan", "Link Groups")}</h2>
              <button
                type="button"
                data-testid="footer-add-column"
                disabled={footer.columns.length >= 6}
                onClick={() => patch("footer", (c) => ({ ...c, columns: [...c.columns, { id: newId("col"), titleId: "", titleEn: "", isActive: true, links: [] }] }))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold disabled:opacity-40"
              >
                <Plus className="h-3 w-3" /> {t("Tambah Kelompok", "Add Group")}
              </button>
            </div>
            {footer.columns.map((col, i) => (
              <div key={col.id} data-testid={`footer-col-${i}`} className={"rounded-xl border p-3 space-y-3 " + (col.isActive ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/70")}>
                <div className="flex flex-wrap items-center gap-1 justify-end">
                  <button type="button" aria-label={t("Naikkan kelompok", "Move group up")} className={btnIcon} disabled={i === 0} onClick={() => patch("footer", (c) => ({ ...c, columns: move(c.columns, i, -1) }))}><ArrowUp className="h-3 w-3" /></button>
                  <button type="button" aria-label={t("Turunkan kelompok", "Move group down")} className={btnIcon} disabled={i === footer.columns.length - 1} onClick={() => patch("footer", (c) => ({ ...c, columns: move(c.columns, i, 1) }))}><ArrowDown className="h-3 w-3" /></button>
                  <ActiveToggle active={col.isActive} onToggle={() => patch("footer", (c) => ({ ...c, columns: c.columns.map((x, j) => (j === i ? { ...x, isActive: !x.isActive } : x)) }))} testId={`footer-col-${i}-toggle`} />
                  <button
                    type="button"
                    aria-label={t("Hapus kelompok", "Delete group")}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600"
                    onClick={() => window.confirm(t("Hapus kelompok tautan ini?", "Delete this link group?")) &&patch("footer", (c) => ({ ...c, columns: c.columns.filter((_, j) => j !== i) }))}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <Bi label={t("Judul Kelompok", "Group Title")}id={col.titleId} en={col.titleEn} testId={`footer-col-${i}-title`} onChange={(l, v) => patch("footer", (c) => ({ ...c, columns: c.columns.map((x, j) => (j === i ? { ...x, [`title${l}`]: v } : x)) }))} />
                <LinkListEditor links={col.links} testId={`footer-col-${i}`} onChange={(links) => patch("footer", (c) => ({ ...c, columns: c.columns.map((x, j) => (j === i ? { ...x, links } : x)) }))} />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{t("Media Sosial", "Social Media")}</h2>
              <button
                type="button"
                onClick={() => patch("footer", (c) => ({ ...c, social: [...c.social, { id: newId("social"), platform: "", url: "", isActive: true }] }))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold"
              >
                <Plus className="h-3 w-3" /> {t("Tambah", "Add")}
              </button>
            </div>
            {footer.social.length === 0 && (
              <p className="text-[11px] text-slate-500">
                {t("Belum ada media sosial (tidak ditampilkan).", "No social media yet (not shown).")}
              </p>
            )}
            {footer.social.map((s, i) => (
              <div key={s.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-center">
                <input className={inputCls} placeholder={t("Nama platform, mis. LinkedIn", "Platform name, e.g. LinkedIn")} value={s.platform} onChange={(e) => patch("footer", (c) => ({ ...c, social: c.social.map((x, j) => (j === i ? { ...x, platform: e.target.value } : x)) }))} />
                <input className={inputCls} placeholder="https://…" value={s.url} onChange={(e) => patch("footer", (c) => ({ ...c, social: c.social.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) }))} />
                <div className="flex gap-1">
                  <ActiveToggle active={s.isActive} onToggle={() => patch("footer", (c) => ({ ...c, social: c.social.map((x, j) => (j === i ? { ...x, isActive: !x.isActive } : x)) }))} />
                  <button type="button" aria-label={t("Hapus", "Delete")} className="p-1.5 rounded-lg border border-red-200 text-red-600" onClick={() => patch("footer", (c) => ({ ...c, social: c.social.filter((_, j) => j !== i) }))}><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────── FAQ ─────────────── */}
      {tab === "faq" && faq && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">{t("Header & Ajakan", "Header & Call to Action")}</h2>
            <Bi label="Badge" id={faq.badgeId} en={faq.badgeEn} onChange={(l, v) => patch("faq", (c) => ({ ...c, [`badge${l}`]: v }))} />
            <Bi label={t("Judul", "Title")} id={faq.titleId} en={faq.titleEn} testId="faq-title" onChange={(l, v) => patch("faq", (c) => ({ ...c, [`title${l}`]: v }))} />
            <Bi label={t("Deskripsi", "Description")} multiline id={faq.subtitleId} en={faq.subtitleEn} onChange={(l, v) => patch("faq", (c) => ({ ...c, [`subtitle${l}`]: v }))} />
            <Bi label={t("Teks Ajakan", "Prompt Text")} id={faq.supportPromptId} en={faq.supportPromptEn} onChange={(l, v) => patch("faq", (c) => ({ ...c, [`supportPrompt${l}`]: v }))} />
            <Bi label={t("Teks Tombol", "Button Text")} id={faq.supportCtaId} en={faq.supportCtaEn} onChange={(l, v) => patch("faq", (c) => ({ ...c, [`supportCta${l}`]: v }))} />
            <label className="block space-y-1 text-xs">
              <span className="font-semibold text-slate-700">{t("URL Tombol", "Button URL")}</span>
              <input className={inputCls} value={faq.supportCtaUrl} onChange={(e) => patch("faq", (c) => ({ ...c, supportCtaUrl: e.target.value }))} />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{t("Kategori", "Categories")}</h2>
              <button
                type="button"
                onClick={() => patch("faq", (c) => ({ ...c, categories: [...c.categories, { id: newId("cat"), labelId: "", labelEn: "" }] }))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold"
              >
                <Plus className="h-3 w-3" /> {t("Tambah Kategori", "Add Category")}
              </button>
            </div>
            {faq.categories.map((cat, i) => {
              const used = faq.items.filter((it) => it.category === cat.id).length;
              return (
                <div key={cat.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-center">
                  <input className={inputCls} placeholder="Label (ID)" value={cat.labelId} onChange={(e) => patch("faq", (c) => ({ ...c, categories: c.categories.map((x, j) => (j === i ? { ...x, labelId: e.target.value } : x)) }))} />
                  <input className={inputCls} placeholder="Label (EN)" value={cat.labelEn} onChange={(e) => patch("faq", (c) => ({ ...c, categories: c.categories.map((x, j) => (j === i ? { ...x, labelEn: e.target.value } : x)) }))} />
                  <div className="flex gap-1 items-center">
                    <button type="button" aria-label={t("Naikkan", "Move up")} className={btnIcon} disabled={i === 0} onClick={() => patch("faq", (c) => ({ ...c, categories: move(c.categories, i, -1) }))}><ArrowUp className="h-3 w-3" /></button>
                    <button type="button" aria-label={t("Turunkan", "Move down")} className={btnIcon} disabled={i === faq.categories.length - 1} onClick={() => patch("faq", (c) => ({ ...c, categories: move(c.categories, i, 1) }))}><ArrowDown className="h-3 w-3" /></button>
                    <button
                      type="button"
                      aria-label={t("Hapus kategori", "Delete category")}
                      disabled={used > 0}
                      title={
                        used > 0
                          ? t(
                              `Dipakai ${used} FAQ — pindahkan FAQ terlebih dahulu`,
                              `Used by ${used} ${used === 1 ? "FAQ" : "FAQs"} — move them first`
                            )
                          : t("Hapus kategori", "Delete category")
                      }
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 disabled:opacity-30"
                      onClick={() => patch("faq", (c) => ({ ...c, categories: c.categories.filter((_, j) => j !== i) }))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <span className="text-[11px] text-slate-500 w-14">{used} FAQ</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {t("Pertanyaan", "Questions")} ({faq.items.length})
              </h2>
              <button
                type="button"
                data-testid="faq-add"
                onClick={() => {
                  const id = newId("faq");
                  patch("faq", (c) => ({
                    ...c,
                    items: [...c.items, { id, category: c.categories[0]?.id || "", questionId: "", questionEn: "", answerId: "", answerEn: "", isActive: true }],
                  }));
                  setOpenFaq(id);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold"
              >
                <Plus className="h-3 w-3" /> {t("Tambah Pertanyaan", "Add Question")}
              </button>
            </div>
            {faq.items.map((it, i) => {
              const isOpen = openFaq === it.id;
              const set = (p: Partial<typeof it>) => patch("faq", (c) => ({ ...c, items: c.items.map((x, j) => (j === i ? { ...x, ...p } : x)) }));
              return (
                <div key={it.id} data-testid={`faq-item-${i}`} className={"rounded-xl border p-3 " + (it.isActive ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50/70")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : it.id)} className="flex-1 min-w-[200px] text-left text-xs font-semibold text-slate-800 flex items-center gap-1.5" data-testid={`faq-item-${i}-open`}>
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      {it.questionId || t("(pertanyaan baru)", "(new question)")}
                      <span className="ml-1 text-[10px] font-normal text-slate-500">
                        · {faq.categories.find((c) => c.id === it.category)?.labelId || t("tanpa kategori", "no category")}
                      </span>
                    </button>
                    <button type="button" aria-label={t("Naikkan", "Move up")} className={btnIcon} disabled={i === 0} onClick={() => patch("faq", (c) => ({ ...c, items: move(c.items, i, -1) }))}><ArrowUp className="h-3 w-3" /></button>
                    <button type="button" aria-label={t("Turunkan", "Move down")} className={btnIcon} disabled={i === faq.items.length - 1} onClick={() => patch("faq", (c) => ({ ...c, items: move(c.items, i, 1) }))}><ArrowDown className="h-3 w-3" /></button>
                    <ActiveToggle active={it.isActive} onToggle={() => set({ isActive: !it.isActive })} testId={`faq-item-${i}-toggle`} />
                    <button
                      type="button"
                      aria-label={t("Hapus pertanyaan", "Delete question")}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600"
                      onClick={() =>
                        window.confirm(
                          t(
                            "Hapus pertanyaan ini? (Gunakan 'Disembunyikan' untuk menonaktifkan sementara)",
                            "Delete this question? (Use 'Hidden' to disable it temporarily)"
                          )
                        ) &&patch("faq", (c) => ({ ...c, items: c.items.filter((_, j) => j !== i) }))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {isOpen && (
                    <div className="mt-3 space-y-2">
                      <label className="block space-y-1 text-xs">
                        <span className="font-semibold text-slate-700">{t("Kategori", "Category")}</span>
                        <select className={inputCls} value={it.category} onChange={(e) => set({ category: e.target.value })}>
                          {faq.categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.labelId || c.id}
                            </option>
                          ))}
                        </select>
                      </label>
                      <Bi label={t("Pertanyaan", "Question")} id={it.questionId} en={it.questionEn} testId={`faq-item-${i}-question`} onChange={(l, v) => set({ [`question${l}`]: v })} />
                      <Bi label={t("Jawaban", "Answer")} multiline id={it.answerId} en={it.answerEn} testId={`faq-item-${i}-answer`} onChange={(l, v) => set({ [`answer${l}`]: v })} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────── ANNOUNCEMENT ─────────────── */}
      {tab === "announcement" && ann && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <input type="checkbox" data-testid="ann-enabled" checked={ann.enabled} onChange={(e) => patch("announcement", (c) => ({ ...c, enabled: e.target.checked }))} />
            {t("Tampilkan Announcement Bar di website", "Show Announcement Bar on the website")}
          </label>
          <Bi label={t("Teks Pengumuman", "Announcement Text")}id={ann.promptId} en={ann.promptEn} testId="ann-prompt" onChange={(l, v) => patch("announcement", (c) => ({ ...c, [`prompt${l}`]: v }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <label className="space-y-1">
              <span className="font-semibold text-slate-700">{t("Mulai tampil (opsional)", "Show from (optional)")}</span>
              <input type="datetime-local" className={inputCls} value={toLocalInput(ann.startsAt)} onChange={(e) => patch("announcement", (c) => ({ ...c, startsAt: fromLocalInput(e.target.value) }))} />
            </label>
            <label className="space-y-1">
              <span className="font-semibold text-slate-700">{t("Berhenti tampil (opsional)", "Show until (optional)")}</span>
              <input type="datetime-local" className={inputCls} value={toLocalInput(ann.endsAt)} onChange={(e) => patch("announcement", (c) => ({ ...c, endsAt: fromLocalInput(e.target.value) }))} />
            </label>
          </div>
          <p className="text-[11px] text-slate-500">
            {t(
              "Periode dievaluasi di server; perubahan tampil paling lambat ±60 detik setelah waktu mulai/berakhir.",
              "The period is evaluated on the server; changes appear within about 60 seconds of the start/end time."
            )}
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              {t("Tombol / Tautan (urutan = prioritas tampil)", "Buttons / Links (order = display priority)")}
            </p>
            <LinkListEditor links={ann.items} testId="ann" onChange={(items) => patch("announcement", (c) => ({ ...c, items }))} />
          </div>
        </div>
      )}
    </div>
  );
}
