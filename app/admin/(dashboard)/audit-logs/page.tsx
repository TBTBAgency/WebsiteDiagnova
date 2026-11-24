"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, AlertTriangle, ArrowRight } from "lucide-react";
import type { AuditLogRecord, ApiResponse } from "@/types";
import { cn } from "@/lib/utils";

const ACTOR_TYPE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  USER: "User Demo",
  SYSTEM: "Sistem",
  ANONYMOUS: "Anonim",
};

const ACTOR_TYPE_STYLES: Record<string, string> = {
  ADMIN: "bg-blue-50 border-blue-200/80 text-[#087BEE]",
  USER: "bg-emerald-50 border-emerald-200/80 text-[#16A374]",
  SYSTEM: "bg-violet-50 border-violet-200/80 text-violet-700",
  ANONYMOUS: "bg-[#F5F6F8] border-[#E8EBEF] text-[#747B86]",
};

/** Label ringkas untuk kode aksi yang umum; kode tetap ditampilkan agar dapat ditelusuri. */
const ACTION_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: "Login berhasil",
  LOGIN_FAILED: "Login gagal",
  LOGIN_DENIED_INACTIVE: "Login ditolak (akun nonaktif)",
  LOGIN_DENIED_ROLE: "Login ditolak (role)",
  LOGIN_RATE_LIMITED: "Login dibatasi (rate limit)",
  LOGOUT: "Logout",
  LEAD_CREATED: "Lead baru",
  LEAD_EXPORTED: "Ekspor lead",
  LEAD_REJECTED: "Lead ditolak",
  LEAD_SCHEDULE_UPDATED: "Jadwal demo diubah",
  LEAD_STATUS_CHANGED: "Status lead berubah",
  DEMO_ACCESS_GRANTED: "Akses demo diberikan",
  DEMO_ACCESS_EXTENDED: "Akses demo diperpanjang",
  DEMO_ACCESS_REVOKED: "Akses demo dicabut",
  DEMO_LOGIN_SUCCEEDED: "Login demo berhasil",
  DEMO_LOGIN_FAILED: "Login demo gagal",
  MAGIC_LINK_ISSUED: "Magic link dibuat",
  USER_CREATED: "Akun USER dibuat",
  USER_UPDATED: "Akun USER diubah",
  USER_ACTIVATED: "Akun USER diaktifkan",
  USER_DEACTIVATED: "Akun USER dinonaktifkan",
  USER_DELETED: "Akun USER dihapus",
  USER_RESTORED: "Akun USER dipulihkan",
  CMS_SECTION_UPDATED: "Konten CMS diubah",
  CMS_SECTION_DELETED: "Konten CMS dihapus",
  CMS_SECTION_RESTORED: "Konten CMS dipulihkan",
  CMS_SECTIONS_REORDERED: "Urutan CMS diubah",
  CMS_MEDIA_UPLOADED: "Media CMS diunggah",
};

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return (
    d.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB"
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "(kosong)";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Menampilkan old/new value sebagai daftar field yang mudah dibaca. */
function ChangeDetails({
  oldValue,
  newValue,
}: {
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
}) {
  const oldObj = oldValue && typeof oldValue === "object" ? oldValue : null;
  const newObj = newValue && typeof newValue === "object" ? newValue : null;
  if (!oldObj && !newObj) return <span className="text-[#747B86]">-</span>;

  // Bila ada newValue, tampilkan field yang tercantum di newValue (perubahan); jika tidak, tampilkan oldValue.
  const keys = newObj ? Object.keys(newObj) : Object.keys(oldObj ?? {});
  if (keys.length === 0) return <span className="text-[#747B86]">-</span>;

  return (
    <ul className="space-y-0.5">
      {keys.map((key) => {
        const hasOld = !!oldObj && key in oldObj;
        const hasNew = !!newObj && key in newObj;
        const oldText = hasOld ? formatValue(oldObj![key]) : null;
        const newText = hasNew ? formatValue(newObj![key]) : null;
        const unchanged = hasOld && hasNew && oldText === newText;
        return (
          <li key={key} className="flex flex-wrap items-center gap-1 break-all">
            <span className="font-semibold text-[#17191D]">{key}:</span>
            {hasOld && hasNew && !unchanged ? (
              <>
                <span className="text-rose-600 line-through">{oldText}</span>
                <ArrowRight className="h-3 w-3 text-[#747B86] shrink-0" />
                <span className="text-[#16A374]">{newText}</span>
              </>
            ) : (
              <span className="text-[#17191D]">{newText ?? oldText}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/admin/audit-logs", { cache: "no-store" });
      if (res.status === 401) {
        window.location.replace("/"); // sesi habis: kembali ke beranda (path login tidak diungkap)
        return;
      }
      const json = (await res.json().catch(() => null)) as ApiResponse<AuditLogRecord[]> | null;
      if (res.ok && json?.success && json.data) {
        setLogs(json.data);
      } else {
        setLoadError(json?.message || "Gagal memuat jejak audit.");
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setLoadError("Terjadi kesalahan jaringan saat memuat jejak audit.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const actionOptions = useMemo(() => Array.from(new Set(logs.map((l) => l.action))).sort(), [logs]);

  const filteredLogs = useMemo(() => {
    const term = actionFilter.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter(
      (l) => l.action.toLowerCase().includes(term) || (ACTION_LABELS[l.action] ?? "").toLowerCase().includes(term)
    );
  }, [logs, actionFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8EBEF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17191D] font-display">
              Jejak Audit Sistem (Audit Trail)
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#16A374]">
              Hanya Baca
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#747B86] mt-1">
            Rekam jejak aksi admin, login, akses demo, dan perubahan data. Identitas pelaku disimpan sebagai snapshot
            sehingga tetap terbaca walau akun berubah atau dihapus. Menampilkan 100 entri terbaru.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8EBEF] hover:bg-[#F5F6F8] text-xs font-semibold text-[#17191D] transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin text-[#087BEE]")} />
            <span>Refresh Log</span>
          </button>
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Filter aksi */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E8EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#747B86]" />
          <input
            type="text"
            list="audit-action-options"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="Filter berdasarkan aksi (mis. USER_DELETED, login, akses demo)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F5F6F8] border border-[#E8EBEF] text-xs sm:text-sm text-[#17191D] placeholder-[#747B86] focus:border-[#087BEE] focus:bg-white focus:outline-hidden transition-colors"
          />
          <datalist id="audit-action-options">
            {actionOptions.map((a) => (
              <option key={a} value={a}>
                {ACTION_LABELS[a] ?? a}
              </option>
            ))}
          </datalist>
        </div>
        {actionFilter && (
          <button
            type="button"
            onClick={() => setActionFilter("")}
            className="px-3 py-2 rounded-xl bg-[#F5F6F8] hover:bg-[#E8EBEF] text-xs font-semibold text-[#17191D] transition-colors whitespace-nowrap"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Audit Log Table Container */}
      <div className="rounded-2xl border border-[#E8EBEF] bg-white overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F8]/60 border-b border-[#E8EBEF] text-[#747B86] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Waktu</th>
                <th className="py-3.5 px-5">Aktor</th>
                <th className="py-3.5 px-5">Aksi</th>
                <th className="py-3.5 px-5">Entitas & Target</th>
                <th className="py-3.5 px-5">Detail Perubahan</th>
                <th className="py-3.5 px-5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EBEF] text-[#17191D]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#747B86]">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#087BEE] mb-2" />
                    <span>Memuat log audit...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#747B86]">
                    {logs.length === 0
                      ? "Belum ada rekaman audit log di sistem."
                      : "Tidak ada log yang cocok dengan filter aksi."}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actorType = log.actorType ?? (log.userId ? null : "ANONYMOUS");
                  const actorName =
                    log.userName ||
                    log.actorEmail ||
                    (actorType ? ACTOR_TYPE_LABELS[actorType] ?? actorType : null) ||
                    (log.userId ? log.userId.slice(0, 10) : "Tidak diketahui");
                  return (
                    <tr key={log.id} className="hover:bg-[#F5F6F8]/40 transition-colors align-top">
                      <td className="py-3.5 px-5 whitespace-nowrap text-[#747B86] font-sans">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="py-3.5 px-5 min-w-[180px]">
                        <div className="font-semibold text-[#17191D]">{actorName}</div>
                        {log.actorEmail && log.actorEmail !== actorName && (
                          <div className="text-[11px] text-[#747B86] break-all">{log.actorEmail}</div>
                        )}
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {actorType && (
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded-md border text-[10px] font-semibold",
                                ACTOR_TYPE_STYLES[actorType] ?? ACTOR_TYPE_STYLES.ANONYMOUS
                              )}
                            >
                              {ACTOR_TYPE_LABELS[actorType] ?? actorType}
                            </span>
                          )}
                          {log.actorRole && (
                            <span className="px-1.5 py-0.5 rounded-md border border-[#E8EBEF] bg-[#F5F6F8] text-[10px] font-semibold text-[#747B86]">
                              Role: {log.actorRole}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 font-semibold text-[#087BEE] text-[11px] whitespace-nowrap">
                          {log.action}
                        </span>
                        {ACTION_LABELS[log.action] && (
                          <div className="text-[11px] text-[#747B86] mt-1">{ACTION_LABELS[log.action]}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-[#17191D]">
                        <div>{log.entity}</div>
                        {log.recordId && (
                          <div className="text-[10px] text-[#747B86] font-mono" title={log.recordId}>
                            {log.recordId.slice(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 min-w-[220px] max-w-sm text-[11px] font-mono">
                        <ChangeDetails oldValue={log.oldValue} newValue={log.newValue} />
                      </td>
                      <td className="py-3.5 px-5 text-[#747B86] whitespace-nowrap font-mono text-[11px]">
                        {log.ipAddress || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && logs.length > 0 && (
          <div className="px-5 py-2.5 border-t border-[#E8EBEF] text-[11px] text-[#747B86]">
            Menampilkan {filteredLogs.length} dari {logs.length} entri.
          </div>
        )}
      </div>
    </div>
  );
}
