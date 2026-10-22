"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, Clock, User, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AuditLogRecord } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
              ISO 15189 Kepatuhan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#747B86] mt-1">
            Rekam jejak setiap aksi medis, perubahan data spesimen, dan otorisasi sistem yang tidak dapat dimanipulasi.
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

      {/* Audit Log Table Container */}
      <div className="rounded-2xl border border-[#E8EBEF] bg-white overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F6F8]/60 border-b border-[#E8EBEF] text-[#747B86] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Waktu</th>
                <th className="py-3.5 px-5">Aktor / Pengguna</th>
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
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#747B86]">
                    Belum ada rekaman audit log di sistem.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F5F6F8]/40 transition-colors">
                    <td className="py-3.5 px-5 whitespace-nowrap text-[#747B86] font-sans">
                      {new Date(log.createdAt).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#17191D]">
                      {log.userName || (log.userId ? log.userId.slice(0, 10) : "Sistem Internal")}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 font-semibold text-[#087BEE] text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#17191D]">
                      {log.entity} {log.recordId ? `(${log.recordId.slice(0, 8)}...)` : ""}
                    </td>
                    <td className="py-3.5 px-5 max-w-xs truncate text-[#747B86] font-mono text-[10px]">
                      {log.newValue ? JSON.stringify(log.newValue) : "-"}
                    </td>
                    <td className="py-3.5 px-5 text-[#747B86] whitespace-nowrap font-mono text-[11px]">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
