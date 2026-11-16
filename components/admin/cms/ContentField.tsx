"use client";

// Form rekursif editor CMS: dibangun dari bentuk data `content` (dan `defaults` sebagai acuan tipe).
import React, { createContext, useContext, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Plus,
  Upload,
  Image as ImageIcon,
  Link2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  ITEM_META_KEYS,
  arrayItemTemplate,
  emptyLike,
  humanize,
  isIconKey,
  isImageKey,
  isLocalized,
  isLongText,
  isPlainObject,
  isSafeUrl,
  isUrlKey,
  itemTitle,
  newItemId,
  cmsFetch,
  type JsonObject,
  type LocalizedValue,
} from "./cms-utils";

// ---------------------------------------------------------------------------
// Konteks: konfirmasi (modal) & notifikasi dari halaman induk
// ---------------------------------------------------------------------------

export interface CmsEditorContextValue {
  confirm: (opts: { title: string; message: React.ReactNode; confirmLabel?: string }) => Promise<boolean>;
  notify: (text: string, type: "success" | "error") => void;
  disabled?: boolean;
}

export const CmsEditorContext = createContext<CmsEditorContextValue>({
  confirm: async () => false,
  notify: () => undefined,
});

const useEditor = () => useContext(CmsEditorContext);

// ---------------------------------------------------------------------------
// Gaya bersama
// ---------------------------------------------------------------------------

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#087BEE] disabled:bg-slate-50 disabled:text-slate-500";
const labelCls = "block text-xs font-semibold text-slate-700 mb-1.5";
const iconBtn =
  "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500";

function FieldLabel({ label, fieldKey, extra }: { label: string; fieldKey: string; extra?: React.ReactNode }) {
  if (!label) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={labelCls} title={fieldKey}>
        {label}
      </span>
      {extra}
    </div>
  );
}

/** Textarea yang tampil satu baris untuk teks pendek dan membesar untuk teks panjang / multi-baris. */
function TextBox({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const { disabled } = useEditor();
  const long = isLongText(value);
  const rows = long ? Math.min(10, Math.max(3, value.split("\n").length + Math.floor(value.length / 90))) : 1;
  return (
    <textarea
      value={value}
      rows={rows}
      disabled={disabled}
      aria-label={ariaLabel}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputCls} ${long ? "resize-y leading-relaxed" : "resize-none overflow-hidden whitespace-nowrap"} block`}
    />
  );
}

// ---------------------------------------------------------------------------
// Field primitif
// ---------------------------------------------------------------------------

function LocalizedField({
  fieldKey,
  label,
  value,
  onChange,
}: {
  fieldKey: string;
  label: string;
  value: LocalizedValue;
  onChange: (v: LocalizedValue) => void;
}) {
  return (
    <div>
      <FieldLabel label={label} fieldKey={fieldKey} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(["id", "en"] as const).map((lang) => (
          <div key={lang} className="relative">
            <span className="pointer-events-none absolute -top-2 left-3 z-10 rounded bg-white px-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "id" ? "ID" : "EN"}
            </span>
            <TextBox
              value={value[lang] ?? ""}
              ariaLabel={`${label} (${lang.toUpperCase()})`}
              onChange={(v) => onChange({ ...value, [lang]: v })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StringField({ fieldKey, label, value, onChange }: { fieldKey: string; label: string; value: string; onChange: (v: string) => void }) {
  const { disabled } = useEditor();
  if (isImageKey(fieldKey)) return <ImageField fieldKey={fieldKey} label={label} value={value} onChange={onChange} />;
  if (isUrlKey(fieldKey)) {
    const bad = !isSafeUrl(value);
    return (
      <div>
        <FieldLabel label={label} fieldKey={fieldKey} extra={<Link2 className="h-3.5 w-3.5 text-slate-400 mb-1.5" />} />
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/halaman, #anchor, https://..., mailto: atau tel:"
          className={`${inputCls} ${bad ? "border-amber-300" : ""}`}
        />
        {bad && (
          <p className="mt-1 text-[11px] text-amber-700">
            Format tautan kemungkinan ditolak server. Gunakan path &quot;/...&quot;, &quot;#anchor&quot;, https://, mailto: atau tel:.
          </p>
        )}
      </div>
    );
  }
  return (
    <div>
      <FieldLabel label={label} fieldKey={fieldKey} />
      <TextBox value={value} onChange={onChange} placeholder={isIconKey(fieldKey) ? "Nama ikon lucide, mis. Activity" : undefined} ariaLabel={label} />
    </div>
  );
}

function ImageField({ fieldKey, label, value, onChange }: { fieldKey: string; label: string; value: string; onChange: (v: string) => void }) {
  const { disabled, notify } = useEditor();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const canPreview = value.trim() !== "" && isSafeUrl(value) && !value.startsWith("#") && previewError !== value;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      notify("Format tidak didukung. Gunakan PNG, JPG, WEBP, atau GIF.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify("Ukuran file maksimal 5 MB.", "error");
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await cmsFetch<{ url: string }>("/api/admin/cms/upload", { method: "POST", body: form });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (res.ok && res.body?.data?.url) {
      onChange(res.body.data.url);
      notify("Gambar berhasil diunggah. Simpan section untuk menerapkan.", "success");
    } else if (res.status !== 401) {
      notify(res.body?.message || "Gagal mengunggah gambar.", "error");
    }
  };

  return (
    <div>
      <FieldLabel label={label} fieldKey={fieldKey} extra={<ImageIcon className="h-3.5 w-3.5 text-slate-400 mb-1.5" />} />
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {canPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" onError={() => setPreviewError(value)} />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="text"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/... atau https://..."
            className={inputCls}
          />
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Mengunggah..." : "Upload"}
            </button>
            <span className="text-[10px] text-slate-400">PNG/JPG/WEBP/GIF, maks 5 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({ fieldKey, label, value, onChange }: { fieldKey: string; label: string; value: number; onChange: (v: number) => void }) {
  const { disabled } = useEditor();
  return (
    <div>
      <FieldLabel label={label} fieldKey={fieldKey} />
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className={`${inputCls} max-w-[200px]`}
      />
    </div>
  );
}

function BooleanField({ fieldKey, label, value, onChange }: { fieldKey: string; label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { disabled } = useEditor();
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700" title={fieldKey}>
      <input
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-[#087BEE] focus:ring-blue-500/20"
      />
      {label}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export interface FieldProps {
  fieldKey: string;
  value: unknown;
  template: unknown;
  onChange: (v: unknown) => void;
  depth: number;
  /** Override label; string kosong = tanpa label (mis. baris daftar primitif). */
  label?: string;
}

export function FieldRenderer({ fieldKey, value, template, onChange, depth, label: labelOverride }: FieldProps) {
  const label = labelOverride ?? humanize(fieldKey);
  const missing = value === undefined || value === null;
  const shape = missing ? template : value;

  if (isLocalized(shape)) {
    return <LocalizedField fieldKey={fieldKey} label={label} value={missing ? { id: "", en: "" } : (value as LocalizedValue)} onChange={onChange} />;
  }
  if (Array.isArray(shape)) {
    return <ArrayField fieldKey={fieldKey} label={label} value={missing ? [] : (value as unknown[])} template={template} onChange={onChange} depth={depth} />;
  }
  if (isPlainObject(shape)) {
    return (
      <ObjectGroup fieldKey={fieldKey} label={label} depth={depth}>
        <ObjectFields value={missing ? {} : (value as JsonObject)} template={template} onChange={onChange} depth={depth + 1} />
      </ObjectGroup>
    );
  }
  if (typeof shape === "number") {
    return <NumberField fieldKey={fieldKey} label={label} value={missing ? 0 : (value as number)} onChange={onChange} />;
  }
  if (typeof shape === "boolean") {
    return <BooleanField fieldKey={fieldKey} label={label} value={missing ? false : (value as boolean)} onChange={onChange} />;
  }
  return <StringField fieldKey={fieldKey} label={label} value={typeof value === "string" ? value : ""} onChange={onChange} />;
}

// ---------------------------------------------------------------------------
// Objek
// ---------------------------------------------------------------------------

/** Field-field sebuah objek: urutan key konten, lalu key yang hanya ada di acuan (default). */
export function ObjectFields({
  value,
  template,
  onChange,
  depth,
  skipMeta = false,
}: {
  value: JsonObject;
  template: unknown;
  onChange: (v: JsonObject) => void;
  depth: number;
  skipMeta?: boolean;
}) {
  const tpl = isPlainObject(template) ? template : {};
  const keys = [...Object.keys(value), ...Object.keys(tpl).filter((k) => !(k in value))].filter(
    (k) => !(skipMeta && ITEM_META_KEYS.has(k))
  );
  if (keys.length === 0) return <p className="text-[11px] italic text-slate-400">Tidak ada field.</p>;

  // Field sederhana (boolean) dikelompokkan di bawah agar form lebih rapi
  const isBool = (k: string) => typeof (value[k] ?? tpl[k]) === "boolean";
  const ordered = [...keys.filter((k) => !isBool(k)), ...keys.filter(isBool)];

  return (
    <div className="space-y-4">
      {ordered.map((k) => (
        <FieldRenderer
          key={k}
          fieldKey={k}
          value={value[k]}
          template={tpl[k]}
          depth={depth}
          onChange={(v) => onChange({ ...value, [k]: v })}
        />
      ))}
    </div>
  );
}

function ObjectGroup({ fieldKey, label, depth, children }: { fieldKey: string; label: string; depth: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(depth <= 1);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-bold text-slate-800"
        title={fieldKey}
        aria-expanded={open}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </button>
      {open && <div className="border-t border-slate-200 bg-white rounded-b-xl p-4">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Array
// ---------------------------------------------------------------------------

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

function ArrayField({
  fieldKey,
  label,
  value,
  template,
  onChange,
  depth,
}: {
  fieldKey: string;
  label: string;
  value: unknown[];
  template: unknown;
  onChange: (v: unknown[]) => void;
  depth: number;
}) {
  const itemTpl = arrayItemTemplate(value, template);
  if (isPlainObject(itemTpl) && !isLocalized(itemTpl)) {
    return <ObjectItemList fieldKey={fieldKey} label={label} value={value} itemTpl={itemTpl} onChange={onChange} depth={depth} />;
  }
  return <PrimitiveList fieldKey={fieldKey} label={label} value={value} itemTpl={itemTpl} onChange={onChange} />;
}

function ObjectItemList({
  fieldKey,
  label,
  value,
  itemTpl,
  onChange,
  depth,
}: {
  fieldKey: string;
  label: string;
  value: unknown[];
  itemTpl: JsonObject;
  onChange: (v: unknown[]) => void;
  depth: number;
}) {
  const { disabled, confirm } = useEditor();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  // Key React stabil berdasarkan id item (duplikat diberi akhiran index)
  const seen = new Set<string>();
  const keys = value.map((item, i) => {
    const id = isPlainObject(item) && typeof item.id === "string" && item.id ? item.id : `#${i}`;
    const k = seen.has(id) ? `${id}__${i}` : id;
    seen.add(k);
    return k;
  });

  const toggleOpen = (k: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const updateItem = (index: number, item: unknown) => onChange(value.map((x, i) => (i === index ? item : x)));

  const addItem = () => {
    const item = emptyLike(itemTpl, fieldKey) as JsonObject;
    const id = newItemId(fieldKey, value);
    onChange([...value, { ...item, id }]);
    setOpenIds((prev) => new Set(prev).add(id));
  };

  const deletedCount = value.filter((x) => isPlainObject(x) && !!x.deletedAt).length;
  const hiddenCount = value.filter((x) => isPlainObject(x) && x.hidden === true && !x.deletedAt).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800" title={fieldKey}>
          {label}
          <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            {value.length} item
          </span>
          {hiddenCount > 0 && (
            <span className="rounded-md border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              {hiddenCount} disembunyikan
            </span>
          )}
          {deletedCount > 0 && (
            <span className="rounded-md border border-rose-200/60 bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
              {deletedCount} dihapus
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah item
        </button>
      </div>

      <div className="space-y-2 border-t border-slate-200 p-3">
        {value.length === 0 && <p className="py-2 text-center text-[11px] italic text-slate-400">Belum ada item.</p>}
        {value.map((raw, index) => {
          const item = isPlainObject(raw) ? raw : {};
          const k = keys[index];
          const open = openIds.has(k);
          const deleted = !!item.deletedAt;
          const hidden = item.hidden === true;
          const title = itemTitle(item, `Item ${index + 1}`);

          const setMeta = (patch: JsonObject) => {
            const next: JsonObject = { ...item, ...patch };
            if (patch.deletedAt === null) delete next.deletedAt;
            updateItem(index, next);
          };

          const purge = async () => {
            const ok = await confirm({
              title: "Hapus item permanen?",
              message: (
                <>
                  Item <strong className="text-slate-900">{title}</strong> akan dihapus dari daftar dan tidak dapat dipulihkan setelah
                  section disimpan.
                </>
              ),
              confirmLabel: "Hapus permanen",
            });
            if (ok) onChange(value.filter((_, i) => i !== index));
          };

          return (
            <div
              key={k}
              className={`rounded-xl border ${
                deleted ? "border-dashed border-rose-200 bg-slate-50 opacity-70" : hidden ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggleOpen(k)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-expanded={open}
                >
                  {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400">#{index + 1}</span>
                  <span className={`truncate text-xs font-semibold ${deleted ? "text-slate-500 line-through" : "text-slate-800"}`}>{title}</span>
                  {typeof item.id === "string" && (
                    <span className="hidden sm:inline shrink-0 truncate max-w-[160px] font-mono text-[10px] text-slate-400">{item.id}</span>
                  )}
                  {hidden && !deleted && (
                    <span className="shrink-0 rounded-md border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                      Disembunyikan
                    </span>
                  )}
                  {deleted && (
                    <span className="shrink-0 rounded-md border border-rose-200/60 bg-rose-50 px-1.5 py-0.5 text-[9px] font-semibold text-rose-600">
                      Dihapus
                    </span>
                  )}
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" className={iconBtn} disabled={disabled || index === 0} onClick={() => onChange(move(value, index, index - 1))} title="Naikkan">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    disabled={disabled || index === value.length - 1}
                    onClick={() => onChange(move(value, index, index + 1))}
                    title="Turunkan"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  {deleted ? (
                    <>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setMeta({ deletedAt: null })}
                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Pulihkan
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={purge}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                        Hapus permanen
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={iconBtn}
                        disabled={disabled}
                        onClick={() => setMeta({ hidden: !hidden })}
                        title={hidden ? "Tampilkan item" : "Sembunyikan item"}
                      >
                        {hidden ? <EyeOff className="h-3.5 w-3.5 text-amber-600" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        className={`${iconBtn} hover:!text-rose-600`}
                        disabled={disabled}
                        onClick={() => setMeta({ deletedAt: new Date().toISOString() })}
                        title="Hapus item (dapat dipulihkan)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {open && (
                <div className="border-t border-slate-100 p-4">
                  {deleted && (
                    <p className="mb-3 flex items-center gap-1.5 text-[11px] text-rose-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Item ini dihapus (tidak tampil di website). Klik &quot;Pulihkan&quot; untuk menampilkannya kembali.
                    </p>
                  )}
                  <ObjectFields value={item} template={itemTpl} onChange={(v) => updateItem(index, v)} depth={depth + 1} skipMeta />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Array nilai primitif (atau LocalizedText): daftar input dengan tambah/hapus/urutkan. */
function PrimitiveList({
  fieldKey,
  label,
  value,
  itemTpl,
  onChange,
}: {
  fieldKey: string;
  label: string;
  value: unknown[];
  itemTpl: unknown;
  onChange: (v: unknown[]) => void;
}) {
  const { disabled } = useEditor();
  const blank = itemTpl === undefined ? "" : emptyLike(itemTpl, fieldKey);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800" title={fieldKey}>
          {label}
          <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{value.length}</span>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange([...value, blank])}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah
        </button>
      </div>
      <div className="space-y-2 border-t border-slate-200 bg-white rounded-b-xl p-3">
        {value.length === 0 && <p className="py-2 text-center text-[11px] italic text-slate-400">Belum ada isi.</p>}
        {value.map((entry, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2 w-5 shrink-0 text-right text-[10px] font-semibold text-slate-400">{index + 1}.</span>
            <div className="min-w-0 flex-1">
              <FieldRenderer
                fieldKey={fieldKey}
                label=""
                value={entry}
                template={itemTpl}
                depth={99}
                onChange={(v) => onChange(value.map((x, i) => (i === index ? v : x)))}
              />
            </div>
            <div className="mt-1 flex shrink-0 items-center gap-1">
              <button type="button" className={iconBtn} disabled={disabled || index === 0} onClick={() => onChange(move(value, index, index - 1))} title="Naikkan">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={iconBtn}
                disabled={disabled || index === value.length - 1}
                onClick={() => onChange(move(value, index, index + 1))}
                title="Turunkan"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className={`${iconBtn} hover:!text-rose-600`}
                disabled={disabled}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                title="Hapus"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
