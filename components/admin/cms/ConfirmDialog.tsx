"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Dialog konfirmasi (pengganti window.confirm) dengan gaya modal admin. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-confirm-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                tone === "danger" ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-blue-50 border-blue-100 text-[#087BEE]"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 id="cms-confirm-title" className="text-sm font-bold text-slate-900">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-xs leading-relaxed text-slate-600">{message}</div>
        <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 ${
              tone === "danger" ? "bg-rose-600 hover:bg-rose-700" : "bg-[#087BEE] hover:bg-blue-600"
            }`}
          >
            {busy ? "Memproses..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
