"use client";

// Editor CMS terpusat untuk seluruh halaman publik. Form dibangun otomatis dari bentuk konten section.
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Globe,
  Save,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Trash2,
  RotateCcw,
  FileText,
  Layers,
  Info,
  Loader2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/admin/cms/ConfirmDialog";
import { CmsEditorContext, ObjectFields, type CmsEditorContextValue } from "@/components/admin/cms/ContentField";
import {
  cmsFetch,
  formatDateTime,
  jsonInit,
  publicPathFor,
  type CmsPageSummary,
  type CmsSectionDetail,
  type CmsSectionSummary,
  type JsonObject,
} from "@/components/admin/cms/cms-utils";

type Toast = { text: string; type: "success" | "error" };
type ConfirmState = {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  resolve: (ok: boolean) => void;
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

function StatusChips({ s }: { s: Pick<CmsSectionSummary, "isPublished" | "deletedAt" | "exists"> }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {s.deletedAt ? (
        <span className="rounded-md border border-rose-200/60 bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold text-rose-600">Dihapus</span>
      ) : s.isPublished ? (
        <span className="rounded-md border border-emerald-200/60 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">Terbit</span>
      ) : (
        <span className="rounded-md border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">Draft</span>
      )}
      {!s.exists && (
        <span className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">Default</span>
      )}
    </div>
  );
}

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPageSummary[] | null>(null);
  const [pagesError, setPagesError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [detail, setDetail] = useState<CmsSectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [draft, setDraft] = useState<JsonObject>({});
  const [draftPublished, setDraftPublished] = useState(true);
  const [baseline, setBaseline] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const [conflict, setConflict] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadSeq = useRef(0);

  const notify = useCallback((text: string, type: Toast["type"]) => {
    setToast({ text, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), type === "error" ? 6000 : 3500);
  }, []);

  const confirm = useCallback(
    (opts: { title: string; message: React.ReactNode; confirmLabel?: string; tone?: "danger" | "primary" }) =>
      new Promise<boolean>((resolve) => setConfirmState({ ...opts, resolve })),
    []
  );

  const closeConfirm = (ok: boolean) => {
    confirmState?.resolve(ok);
    setConfirmState(null);
  };

  const dirty = useMemo(
    () => !!detail && (JSON.stringify(draft) !== baseline || draftPublished !== detail.isPublished),
    [detail, draft, baseline, draftPublished]
  );

  // Peringatan saat meninggalkan halaman dengan perubahan belum disimpan
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // -------------------------------------------------------------------------
  // Data
  // -------------------------------------------------------------------------

  const loadPages = useCallback(async () => {
    const res = await cmsFetch<CmsPageSummary[]>("/api/admin/cms/pages");
    if (res.ok && Array.isArray(res.body?.data)) {
      setPages(res.body!.data!);
      setPagesError(null);
      return res.body!.data!;
    }
    if (res.status !== 401) setPagesError(res.body?.message || "Gagal memuat daftar halaman CMS.");
    return null;
  }, []);

  const applyDetail = useCallback((d: CmsSectionDetail) => {
    const content = clone(d.content ?? {});
    setDetail(d);
    setDraft(content);
    setBaseline(JSON.stringify(content));
    setDraftPublished(d.isPublished);
    setSaveErrors([]);
    setConflict(null);
  }, []);

  const loadSection = useCallback(async (pageKey: string, sectionKey: string) => {
    const seq = ++loadSeq.current;
    setDetailLoading(true);
    setDetailError(null);
    const res = await cmsFetch<CmsSectionDetail>(
      `/api/admin/cms/pages/${encodeURIComponent(pageKey)}/${encodeURIComponent(sectionKey)}`
    );
    if (seq !== loadSeq.current) return; // permintaan lama
    setDetailLoading(false);
    if (res.ok && res.body?.data) {
      applyDetail(res.body.data);
    } else if (res.status !== 401) {
      setDetail(null);
      setDetailError(res.body?.message || "Gagal memuat section.");
    }
  }, [applyDetail]);

  const openSection = useCallback(
    (pageKey: string, sectionKey: string) => {
      setSelectedPage(pageKey);
      setSelectedSection(sectionKey);
      setDetail(null);
      setDetailError(null);
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("page", pageKey);
        if (sectionKey) url.searchParams.set("section", sectionKey);
        else url.searchParams.delete("section");
        window.history.replaceState(null, "", url.toString());
      } catch {
        /* abaikan */
      }
      if (sectionKey) loadSection(pageKey, sectionKey);
      else {
        setDetail(null);
        setDetailError(null);
      }
    },
    [loadSection]
  );

  useEffect(() => {
    (async () => {
      const list = await loadPages();
      if (!list || list.length === 0) return;
      const params = new URLSearchParams(window.location.search);
      const page = list.find((p) => p.key === params.get("page")) ?? list[0];
      const section = page.sections.find((s) => s.sectionKey === params.get("section")) ?? page.sections[0];
      openSection(page.key, section?.sectionKey ?? "");
    })();
  }, [loadPages, openSection]);

  const guardDirty = async (): Promise<boolean> => {
    if (!dirty) return true;
    return confirm({
      title: "Buang perubahan?",
      message: "Perubahan pada section ini belum disimpan dan akan hilang.",
      confirmLabel: "Buang perubahan",
    });
  };

  const handleSelectPage = async (page: CmsPageSummary) => {
    if (page.key === selectedPage) return;
    if (!(await guardDirty())) return;
    openSection(page.key, page.sections[0]?.sectionKey ?? "");
  };

  const handleSelectSection = async (s: CmsSectionSummary) => {
    if (s.pageKey === selectedPage && s.sectionKey === selectedSection) return;
    if (!(await guardDirty())) return;
    openSection(s.pageKey, s.sectionKey);
  };

  // -------------------------------------------------------------------------
  // Aksi section (daftar kiri)
  // -------------------------------------------------------------------------

  const currentPage = pages?.find((p) => p.key === selectedPage) ?? null;

  const handleReorder = async (index: number, dir: -1 | 1) => {
    if (!currentPage) return;
    if (dirty) {
      notify("Simpan atau batalkan perubahan section terlebih dahulu sebelum mengubah urutan.", "error");
      return;
    }
    const keys = currentPage.sections.map((s) => s.sectionKey);
    const to = index + dir;
    if (to < 0 || to >= keys.length) return;
    [keys[index], keys[to]] = [keys[to], keys[index]];
    setBusyKey("__reorder");
    const res = await cmsFetch(`/api/admin/cms/pages/${encodeURIComponent(currentPage.key)}/reorder`, jsonInit("POST", { order: keys }));
    setBusyKey(null);
    if (res.ok) {
      notify(res.body?.message || "Urutan section disimpan.", "success");
      await loadPages();
      // Urutan dapat membuat baris baru (versi berubah) -> muat ulang section aktif
      if (selectedSection) loadSection(currentPage.key, selectedSection);
    } else if (res.status !== 401) {
      notify(res.body?.message || "Gagal menyimpan urutan.", "error");
    }
  };

  const handleDeleteSection = async (s: CmsSectionSummary) => {
    const isCurrent = s.pageKey === selectedPage && s.sectionKey === selectedSection;
    const ok = await confirm({
      title: "Hapus section?",
      message: (
        <>
          Section <strong className="text-slate-900">{s.label}</strong> tidak akan ditampilkan di website. Konten tetap tersimpan dan
          dapat dipulihkan kapan saja.
          {isCurrent && dirty && <span className="mt-2 block font-semibold text-rose-600">Perubahan yang belum disimpan akan hilang.</span>}
        </>
      ),
      confirmLabel: "Hapus section",
    });
    if (!ok) return;
    setBusyKey(s.sectionKey);
    const res = await cmsFetch(
      `/api/admin/cms/pages/${encodeURIComponent(s.pageKey)}/${encodeURIComponent(s.sectionKey)}`,
      jsonInit("DELETE")
    );
    setBusyKey(null);
    if (res.ok) {
      notify(res.body?.message || "Section dihapus.", "success");
      await loadPages();
      if (isCurrent) loadSection(s.pageKey, s.sectionKey);
    } else if (res.status !== 401) {
      notify(res.body?.message || "Gagal menghapus section.", "error");
    }
  };

  const handleRestoreSection = async (s: CmsSectionSummary) => {
    const isCurrent = s.pageKey === selectedPage && s.sectionKey === selectedSection;
    setBusyKey(s.sectionKey);
    const res = await cmsFetch(
      `/api/admin/cms/pages/${encodeURIComponent(s.pageKey)}/${encodeURIComponent(s.sectionKey)}/restore`,
      jsonInit("POST")
    );
    setBusyKey(null);
    if (res.ok) {
      notify(res.body?.message || "Section dipulihkan.", "success");
      await loadPages();
      if (isCurrent) loadSection(s.pageKey, s.sectionKey);
    } else if (res.status !== 401) {
      notify(res.body?.message || "Gagal memulihkan section.", "error");
    }
  };

  // -------------------------------------------------------------------------
  // Toolbar editor
  // -------------------------------------------------------------------------

  const handleSave = async () => {
    if (!detail || saving) return;
    setSaving(true);
    setSaveErrors([]);
    setConflict(null);
    const res = await cmsFetch<CmsSectionDetail>(
      `/api/admin/cms/pages/${encodeURIComponent(detail.pageKey)}/${encodeURIComponent(detail.sectionKey)}`,
      jsonInit("PUT", { content: draft, version: detail.exists ? detail.version : 0, isPublished: draftPublished })
    );
    setSaving(false);
    if (res.ok && res.body?.data) {
      applyDetail(res.body.data);
      notify(res.body.message || "Konten berhasil disimpan.", "success");
      loadPages();
      return;
    }
    if (res.status === 401) return;
    const message = res.body?.message || "Gagal menyimpan konten.";
    if (res.status === 409) {
      setConflict(message);
    } else if (res.status === 400 && res.body?.errors?.content?.length) {
      setSaveErrors(res.body.errors.content);
    }
    notify(message, "error");
  };

  const handleDiscard = async () => {
    if (!detail) return;
    if (dirty) {
      const ok = await confirm({
        title: "Batalkan perubahan?",
        message: "Semua perubahan yang belum disimpan akan dibuang dan konten dimuat ulang dari server.",
        confirmLabel: "Batalkan perubahan",
      });
      if (!ok) return;
    }
    loadSection(detail.pageKey, detail.sectionKey);
  };

  const editorContext: CmsEditorContextValue = useMemo(
    () => ({ confirm, notify, disabled: saving || !!detail?.deletedAt }),
    [confirm, notify, saving, detail?.deletedAt]
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6 pb-20">
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-xl transition-all ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title ?? ""}
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        tone={confirmState?.tone}
        onConfirm={() => closeConfirm(true)}
        onCancel={() => closeConfirm(false)}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#087BEE] border border-blue-100">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">CMS Konten</h1>
            <p className="text-xs text-slate-500">Kelola teks, gambar, tautan, dan status publikasi seluruh halaman publik Diagnova</p>
          </div>
        </div>
        <button
          type="button"
          onClick={async () => {
            await loadPages();
            notify("Daftar halaman diperbarui.", "success");
          }}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
          Muat ulang daftar
        </button>
      </div>

      {pagesError && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{pagesError}</span>
          <button type="button" onClick={loadPages} className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-semibold hover:bg-rose-100">
            Coba lagi
          </button>
        </div>
      )}

      {!pages && !pagesError && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-xs text-slate-500 shadow-xs">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat halaman CMS...
        </div>
      )}

      {pages && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
          {/* ---------------- Kolom kiri: halaman & section ---------------- */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Halaman</div>
              <nav className="space-y-1">
                {pages.map((p) => {
                  const active = p.key === selectedPage;
                  const drafts = p.sections.filter((s) => !s.deletedAt && !s.isPublished).length;
                  const deleted = p.sections.filter((s) => !!s.deletedAt).length;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleSelectPage(p)}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs transition-all ${
                        active ? "bg-[#F0F6FF] font-semibold text-[#087BEE]" : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText className={`h-3.5 w-3.5 shrink-0 ${active ? "text-[#087BEE]" : "text-slate-400"}`} />
                        <span className="truncate">{p.label}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        {drafts > 0 && (
                          <span className="rounded-md border border-amber-200/60 bg-amber-50 px-1 text-[9px] font-semibold text-amber-700" title="Section draft">
                            {drafts}
                          </span>
                        )}
                        {deleted > 0 && (
                          <span className="rounded-md border border-rose-200/60 bg-rose-50 px-1 text-[9px] font-semibold text-rose-600" title="Section dihapus">
                            {deleted}
                          </span>
                        )}
                        <span className="text-[10px] font-medium text-slate-400">{p.sections.length}</span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {currentPage && (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="flex items-center justify-between px-2 pb-2 pt-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Section</span>
                  {busyKey === "__reorder" && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
                </div>
                {currentPage.sections.length === 0 && <p className="px-2 py-3 text-[11px] italic text-slate-400">Halaman ini belum memiliki section.</p>}
                <div className="space-y-1.5">
                  {currentPage.sections.map((s, index) => {
                    const active = s.sectionKey === selectedSection;
                    const busy = busyKey === s.sectionKey || busyKey === "__reorder";
                    return (
                      <div
                        key={s.sectionKey}
                        className={`rounded-xl border transition-all ${
                          active ? "border-blue-200 bg-[#F0F6FF]" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                        } ${s.deletedAt ? "opacity-70" : ""}`}
                      >
                        <button type="button" onClick={() => handleSelectSection(s)} className="block w-full px-3 pt-2.5 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-xs font-semibold ${active ? "text-[#087BEE]" : "text-slate-800"} ${s.deletedAt ? "line-through" : ""}`}
                            >
                              {s.label}
                            </span>
                            <StatusChips s={s} />
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-slate-400">{s.sectionKey}</div>
                          <div className="mt-1 text-[10px] text-slate-500">
                            {s.updatedAt ? (
                              <>
                                {s.updatedBy ?? "—"} · {formatDateTime(s.updatedAt)}
                              </>
                            ) : (
                              "Belum pernah disimpan (konten default)"
                            )}
                          </div>
                        </button>
                        <div className="flex items-center justify-between gap-1 px-2.5 pb-2 pt-1.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={busy || index === 0}
                              onClick={() => handleReorder(index, -1)}
                              title="Naikkan urutan"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 disabled:opacity-40"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={busy || index === currentPage.sections.length - 1}
                              onClick={() => handleReorder(index, 1)}
                              title="Turunkan urutan"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 disabled:opacity-40"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                          </div>
                          {s.deletedAt ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleRestoreSection(s)}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Pulihkan
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleDeleteSection(s)}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 px-2 text-[10px] leading-relaxed text-slate-400">
                  Urutan menentukan susunan section di daftar ini; tata letak halaman publik mengikuti desain masing-masing halaman.
                </p>
              </div>
            )}
          </div>

          {/* ---------------- Kolom kanan: editor ---------------- */}
          <div className="min-w-0 space-y-4">
            {detailError && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{detailError}</span>
                {selectedSection && (
                  <button
                    type="button"
                    onClick={() => loadSection(selectedPage, selectedSection)}
                    className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 font-semibold hover:bg-rose-100"
                  >
                    Coba lagi
                  </button>
                )}
              </div>
            )}

            {!detail && !detailError && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-xs text-slate-500 shadow-xs">
                {detailLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Memuat section...
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4" /> Pilih section untuk mulai mengedit.
                  </>
                )}
              </div>
            )}

            {detail && (
              <>
                {/* Toolbar */}
                <div className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xs backdrop-blur">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-sm font-bold text-slate-900">{detail.label}</h2>
                        <StatusChips s={detail} />
                        {detailLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
                        {dirty && (
                          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Belum disimpan
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        <span className="font-mono">
                          {detail.pageKey}/{detail.sectionKey}
                        </span>{" "}
                        · versi {detail.version}
                        {detail.updatedAt && (
                          <>
                            {" "}
                            · diubah {detail.updatedBy ?? "—"}, {formatDateTime(detail.updatedAt)}
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1" role="group" aria-label="Status publikasi">
                        <button
                          type="button"
                          disabled={saving || !!detail.deletedAt}
                          onClick={() => setDraftPublished(true)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            draftPublished ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Terbitkan
                        </button>
                        <button
                          type="button"
                          disabled={saving || !!detail.deletedAt}
                          onClick={() => setDraftPublished(false)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            !draftPublished ? "bg-white text-amber-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Draft
                        </button>
                      </div>
                      <a
                        href={publicPathFor(detail.pageKey)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                      >
                        Lihat halaman
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                      <button
                        type="button"
                        onClick={handleDiscard}
                        disabled={saving || detailLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                        Batalkan perubahan
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || detailLoading || !dirty || !!detail.deletedAt}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#087BEE] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-xs disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        {saving ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </div>
                  {draftPublished !== detail.isPublished && (
                    <p className="mt-2 text-[11px] text-amber-700">
                      Status akan berubah menjadi <strong>{draftPublished ? "Terbit" : "Draft"}</strong> setelah disimpan.
                      {!draftPublished && " Section draft tidak tampil di website."}
                    </p>
                  )}
                </div>

                {detail.deletedAt && (
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">
                      Section ini dihapus pada {formatDateTime(detail.deletedAt)} dan tidak tampil di website. Pulihkan untuk dapat mengedit.
                    </span>
                    {currentPage?.sections.find((s) => s.sectionKey === detail.sectionKey) && (
                      <button
                        type="button"
                        onClick={() => handleRestoreSection(currentPage.sections.find((s) => s.sectionKey === detail.sectionKey)!)}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Pulihkan section
                      </button>
                    )}
                  </div>
                )}

                {conflict && (
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{conflict} Memuat ulang akan membuang perubahan Anda.</span>
                    <button
                      type="button"
                      onClick={() => loadSection(detail.pageKey, detail.sectionKey)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-semibold hover:bg-amber-100"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Muat ulang versi terbaru
                    </button>
                  </div>
                )}

                {saveErrors.length > 0 && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
                    <div className="mb-2 flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-4 w-4" />
                      Konten tidak valid ({saveErrors.length}):
                    </div>
                    <ul className="list-disc space-y-0.5 pl-6 font-mono text-[11px]">
                      {saveErrors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-[11px] leading-relaxed text-slate-600">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#087BEE]" />
                  <span>
                    Isi teks <strong>ID</strong> dan <strong>EN</strong>. Tekan Enter untuk baris baru (<code className="font-mono">\n</code>), apit teks
                    dengan <code className="font-mono">**dua bintang**</code> untuk highlight. Item yang disembunyikan/dihapus tidak tampil di website dan
                    dapat dipulihkan; perubahan berlaku setelah <strong>Simpan</strong>.
                  </span>
                </div>

                {/* Form */}
                <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs ${detailLoading ? "opacity-60" : ""}`}>
                  <CmsEditorContext.Provider value={editorContext}>
                    <ObjectFields
                      key={`${detail.pageKey}/${detail.sectionKey}`}
                      value={draft}
                      template={detail.defaults}
                      onChange={setDraft}
                      depth={0}
                    />
                  </CmsEditorContext.Provider>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
