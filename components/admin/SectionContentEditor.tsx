"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Eye, EyeOff, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  isBilingual,
  pickText,
  type ContentFieldDef,
  type ContentItem,
  type ContentListDef,
  type SectionContent,
  type SectionContentDef,
} from "@/lib/cms-page-content";

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";

function clone(v: SectionContent): SectionContent {
  return JSON.parse(JSON.stringify(v));
}

function newItemId() {
  return `n-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function emptyItem(list: ContentListDef): ContentItem {
  const item: ContentItem = { id: newItemId(), isActive: true };
  for (const f of list.fields) {
    if (isBilingual(f)) {
      item[`${f.key}Id`] = "";
      item[`${f.key}En`] = "";
    } else if (f.type === "select") {
      const opts = f.options || [];
      item[f.key] = (opts.find((o) => o.value === "none") ?? opts[0])?.value ?? "";
    } else {
      item[f.key] = "";
    }
  }
  return item;
}

function FieldInput({
  field,
  obj,
  onChange,
  testId,
}: {
  field: ContentFieldDef;
  obj: Record<string, unknown>;
  onChange: (key: string, value: string) => void;
  testId: string;
}) {
  const label = `${field.label}${field.required ? " *" : ""}`;
  if (isBilingual(field)) {
    const Tag = field.type === "textarea" ? "textarea" : "input";
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(["Id", "En"] as const).map((lang) => (
            <label key={lang} className="space-y-1 text-xs">
              <span className="font-semibold text-slate-700">
                {label} ({lang === "Id" ? "ID" : "EN"})
              </span>
              <Tag
                data-testid={`${testId}-${lang}`}
                className={inputCls + (field.type === "textarea" ? " min-h-[70px]" : "")}
                value={(obj[`${field.key}${lang}`] as string) ?? ""}
                maxLength={field.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(`${field.key}${lang}`, e.target.value)}
              />
            </label>
          ))}
        </div>
        {field.help && <p className="text-[11px] text-slate-500">{field.help}</p>}
      </div>
    );
  }
  if (field.type === "image") {
    return (
      <div data-testid={testId}>
        <ImageUploader value={(obj[field.key] as string) ?? ""} onChange={(url) => onChange(field.key, url)} label={label} />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <label className="block space-y-1 text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <select data-testid={testId} className={inputCls} value={(obj[field.key] as string) ?? ""} onChange={(e) => onChange(field.key, e.target.value)}>
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help && <span className="block text-[11px] text-slate-500">{field.help}</span>}
      </label>
    );
  }
  return (
    <label className="block space-y-1 text-xs">
      <span className="font-semibold text-slate-700">{label}</span>
      <input
        data-testid={testId}
        className={inputCls}
        value={(obj[field.key] as string) ?? ""}
        maxLength={field.max}
        placeholder={field.type === "url" ? "/request-demo, #anchor, atau https://…" : ""}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {field.help && <span className="block text-[11px] text-slate-500">{field.help}</span>}
    </label>
  );
}

/**
 * Editor konten section bawaan halaman dalam: field tunggal + daftar item
 * (tambah, ubah, hapus, urutkan, tampilkan/sembunyikan). Disimpan per section.
 */
export function SectionContentEditor({
  page,
  sectionKey,
  def,
  value,
  customized,
  baseUpdatedAt,
  disabledReason,
  onSaved,
}: {
  page: string;
  sectionKey: string;
  def: SectionContentDef;
  value: SectionContent;
  customized: boolean;
  baseUpdatedAt: string | null;
  disabledReason?: string;
  onSaved: (message: string) => Promise<void> | void;
}) {
  const [draft, setDraft] = useState<SectionContent>(() => clone(value));
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(clone(value));
    setDirty(false);
  }, [value]);

  const setField = (key: string, v: string) => {
    setDraft((d) => ({ ...d, fields: { ...d.fields, [key]: v } }));
    setDirty(true);
  };
  const setList = (listKey: string, fn: (items: ContentItem[]) => ContentItem[]) => {
    setDraft((d) => ({ ...d, lists: { ...d.lists, [listKey]: fn(d.lists[listKey] || []) } }));
    setDirty(true);
  };

  const submit = async (content: SectionContent | null) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/cms/layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "content", page, sectionKey, content, baseUpdatedAt }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Gagal menyimpan konten.");
      setDirty(false);
      await onSaved(content === null ? "Konten section dikembalikan ke bawaan." : "Konten section disimpan. Website diperbarui.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan konten.");
    } finally {
      setSaving(false);
    }
  };

  const summary = (list: ContentListDef, item: ContentItem, i: number) => {
    const f = list.fields.find((x) => x.key === list.summaryField) ?? list.fields[0];
    const text = f ? (isBilingual(f) ? pickText(item, f.key, "ID") : String(item[f.key] ?? "")) : "";
    return text.trim() || `${list.itemLabel} ${i + 1} (kosong)`;
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3 space-y-4" data-testid={`content-editor-${sectionKey}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-slate-900">Isi Section</p>
          <p className="text-[11px] text-slate-500">
            {customized ? "Memakai konten dari CMS." : "Belum diubah — menampilkan konten bawaan."} {def.help}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving || !customized || !!disabledReason}
            data-testid={`content-reset-${sectionKey}`}
            onClick={() => window.confirm("Kembalikan isi section ini ke konten bawaan? Perubahan CMS untuk section ini akan diganti.") && submit(null)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-white disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Kembalikan Bawaan
          </button>
          <button
            type="button"
            disabled={saving || !dirty || !!disabledReason}
            data-testid={`content-save-${sectionKey}`}
            onClick={() => submit(draft)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Menyimpan…" : "Simpan Isi Section"}
          </button>
        </div>
      </div>
      {disabledReason && <p className="text-[11px] text-amber-700">{disabledReason}</p>}
      {dirty && !disabledReason && <p className="text-[11px] text-amber-700">Isi section belum disimpan.</p>}
      {error && (
        <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg p-2" data-testid={`content-error-${sectionKey}`}>
          {error}
        </p>
      )}

      {(def.fields || []).map((f) => (
        <FieldInput key={f.key} field={f} obj={draft.fields} onChange={setField} testId={`content-field-${sectionKey}-${f.key}`} />
      ))}

      {(def.lists || []).map((list) => {
        const items = draft.lists[list.key] || [];
        const canAdd = !list.fixedCount && items.length < list.maxItems;
        return (
          <div key={list.key} className="space-y-2" data-testid={`content-list-${sectionKey}-${list.key}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {list.label}{" "}
                  <span className="font-normal text-slate-500">
                    ({items.length}
                    {list.fixedCount ? ", jumlah tetap" : ` / maks. ${list.maxItems}`})
                  </span>
                </p>
                {(list.help || list.fixedCount) && (
                  <p className="text-[11px] text-slate-500">
                    {list.help}
                    {list.fixedCount && " Jumlah item terikat desain diagram; item dapat diubah atau disembunyikan."}
                  </p>
                )}
              </div>
              {!list.fixedCount && (
                <button
                  type="button"
                  disabled={!canAdd}
                  data-testid={`content-add-${sectionKey}-${list.key}`}
                  onClick={() => {
                    const item = emptyItem(list);
                    setList(list.key, (xs) => [...xs, item]);
                    setOpenItem(`${list.key}:${item.id}`);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-700 text-[11px] font-semibold hover:bg-blue-50 disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah {list.itemLabel}
                </button>
              )}
            </div>
            <ol className="space-y-1.5">
              {items.map((item, i) => {
                const key = `${list.key}:${item.id}`;
                const open = openItem === key;
                return (
                  <li
                    key={item.id}
                    data-testid={`content-item-${sectionKey}-${list.key}-${i}`}
                    className={"rounded-lg border p-2 " + (item.isActive ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50")}
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="w-5 text-center text-[11px] font-bold text-slate-400">{i + 1}</span>
                      <button type="button" onClick={() => setOpenItem(open ? null : key)} className="flex-1 min-w-[140px] text-left text-xs font-semibold text-slate-800 flex items-center gap-1">
                        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                        <span className="truncate">{summary(list, item, i)}</span>
                      </button>
                      {!list.fixedCount && (
                        <>
                          <button type="button" aria-label="Naikkan" disabled={i === 0} onClick={() => setList(list.key, (xs) => { const n = [...xs]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}
                            className="p-1 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50" data-testid={`content-up-${sectionKey}-${list.key}-${i}`}>
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button type="button" aria-label="Turunkan" disabled={i === items.length - 1} onClick={() => setList(list.key, (xs) => { const n = [...xs]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n; })}
                            className="p-1 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50" data-testid={`content-down-${sectionKey}-${list.key}-${i}`}>
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        data-testid={`content-toggle-${sectionKey}-${list.key}-${i}`}
                        onClick={() => setList(list.key, (xs) => xs.map((x, j) => (j === i ? { ...x, isActive: !x.isActive } : x)))}
                        className={"inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold border " + (item.isActive ? "border-emerald-200 text-emerald-700 bg-emerald-50" : "border-slate-300 text-slate-600 bg-white")}
                      >
                        {item.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {item.isActive ? "Tampil" : "Disembunyikan"}
                      </button>
                      {!list.fixedCount && (
                        <button
                          type="button"
                          aria-label="Hapus item"
                          data-testid={`content-delete-${sectionKey}-${list.key}-${i}`}
                          onClick={() => window.confirm(`Hapus ${list.itemLabel.toLowerCase()} ini? Perubahan berlaku setelah Simpan Isi Section.`) && setList(list.key, (xs) => xs.filter((_, j) => j !== i))}
                          className="p-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {open && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-2">
                        {list.fields.map((f) => (
                          <FieldInput
                            key={f.key}
                            field={f}
                            obj={item}
                            testId={`content-item-field-${sectionKey}-${list.key}-${i}-${f.key}`}
                            onChange={(k, v) => setList(list.key, (xs) => xs.map((x, j) => (j === i ? { ...x, [k]: v } : x)))}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
