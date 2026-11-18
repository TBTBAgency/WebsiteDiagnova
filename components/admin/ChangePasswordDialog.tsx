"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import { useAdminLang } from "@/components/admin/AdminLanguage";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 12;

type Field = "current" | "next" | "confirm";

/** Dialog "Ganti kata sandi" untuk admin yang sedang login. */
export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useAdminLang();
  const titleId = useId();
  const firstRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<Record<Field, string>>({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues({ current: "", next: "", confirm: "" });
    setShow(false);
    setError("");
    setDone(false);
    const timer = setTimeout(() => firstRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const tooShort = values.next.length > 0 && values.next.length < MIN_LENGTH;
  const mismatch = values.confirm.length > 0 && values.confirm !== values.next;
  const sameAsOld = values.next.length > 0 && values.next === values.current;
  const canSubmit = !busy && values.current && values.next.length >= MIN_LENGTH && values.confirm === values.next && !sameAsOld;

  const messageFor = (code: string | undefined, fallback: string) => {
    switch (code) {
      case "WRONG_CURRENT":
        return t("Kata sandi saat ini salah.", "Your current password is incorrect.");
      case "TOO_SHORT":
        return t(`Kata sandi baru minimal ${MIN_LENGTH} karakter.`, `The new password must be at least ${MIN_LENGTH} characters.`);
      case "SAME_AS_OLD":
        return t("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.", "The new password must be different from the current one.");
      case "RATE_LIMITED":
        return t("Terlalu banyak percobaan. Coba lagi dalam 15 menit.", "Too many attempts. Please try again in 15 minutes.");
      default:
        return fallback || t("Gagal mengganti kata sandi.", "Failed to change the password.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: values.current, newPassword: values.next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setError(messageFor(json?.errors?.code?.[0], json?.message));
        return;
      }
      setValues({ current: "", next: "", confirm: "" });
      setDone(true);
    } catch {
      setError(t("Terjadi gangguan jaringan. Silakan coba kembali.", "A network error occurred. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const field = (key: Field, label: string, autoComplete: string, hint?: React.ReactNode, invalid?: boolean) => (
    <div>
      <label htmlFor={`cp-${key}`} className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
      </label>
      <input
        ref={key === "current" ? firstRef : undefined}
        id={`cp-${key}`}
        data-testid={`change-password-${key}`}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={values[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-4",
          invalid ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:border-[#1B6FF2] focus:ring-[#1B6FF2]/10"
        )}
      />
      {hint}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button type="button" aria-label={t("Tutup", "Close")} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-[#0E234B]/40 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="change-password-dialog"
        className="relative w-full max-w-md rounded-[24px] border border-[#DCE6F5] bg-white p-6 shadow-[0_24px_60px_rgba(14,35,75,0.25)]"
      >
        <div className="mb-5 flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1B6FF2]">
            <KeyRound className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-lg font-bold text-[#0E234B]">
              {t("Ganti kata sandi", "Change password")}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {t("Berlaku untuk akun admin yang sedang login.", "Applies to the admin account you are signed in with.")}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("Tutup", "Close")} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {done ? (
          <div className="space-y-4">
            <p role="status" data-testid="change-password-success" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {t(
                "Kata sandi berhasil diganti. Gunakan kata sandi baru saat login berikutnya.",
                "Password changed. Use the new password the next time you sign in."
              )}
            </p>
            <button type="button" onClick={onClose} className="w-full rounded-xl bg-[#0E234B] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#153670]">
              {t("Selesai", "Done")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            {field("current", t("Kata sandi saat ini", "Current password"), "current-password")}
            {field(
              "next",
              t("Kata sandi baru", "New password"),
              "new-password",
              <p className={cn("mt-1 text-[11px]", tooShort || sameAsOld ? "text-rose-600" : "text-slate-400")}>
                {sameAsOld
                  ? t("Harus berbeda dari kata sandi saat ini.", "Must be different from the current password.")
                  : values.next.length >= MIN_LENGTH
                    ? t(`✓ Minimal ${MIN_LENGTH} karakter`, `✓ At least ${MIN_LENGTH} characters`)
                    : t(`Minimal ${MIN_LENGTH} karakter (${values.next.length}/${MIN_LENGTH})`, `At least ${MIN_LENGTH} characters (${values.next.length}/${MIN_LENGTH})`)}
              </p>,
              tooShort || sameAsOld
            )}
            {field(
              "confirm",
              t("Ulangi kata sandi baru", "Repeat new password"),
              "new-password",
              mismatch ? <p className="mt-1 text-[11px] text-rose-600">{t("Kata sandi tidak sama.", "Passwords do not match.")}</p> : null,
              mismatch
            )}
            <label className="inline-flex cursor-pointer select-none items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-4 w-4 accent-[#1B6FF2]" />
              {show ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
              {t("Tampilkan kata sandi", "Show passwords")}
            </label>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                {t("Batal", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                data-testid="change-password-submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1B6FF2] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-[#1459D0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {t("Simpan", "Save")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
