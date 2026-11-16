"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  X,
  Mail,
  Phone,
  UserCheck,
  Pencil,
  Power,
  Trash2,
  RotateCcw,
  Info,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import type { UserRecord, ApiResponse } from "@/types";

/** Bentuk data dari GET /api/admin/users (UserRecord + kode role). Didefinisikan lokal agar tidak mengimpor kode server. */
type DemoUser = UserRecord & { roleCode?: string | null };

type ConfirmAction = "activate" | "deactivate" | "delete" | "restore";

const EMPTY_CREATE_FORM = { name: "", email: "", institution: "", jobTitle: "", phone: "" };

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden";

function formatDate(value?: string | null, withTime = false): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return (
    d.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    }) + (withTime ? " WIB" : "")
  );
}

/** Ringkasan periode akses demo terakhir milik USER. */
function AccessPeriod({ user }: { user: DemoUser }) {
  if (!user.demoDurationDays && !user.demoActivatedAt && !user.demoExpiresAt) {
    return <span className="text-slate-400 text-[11px]">Belum ada akses demo</span>;
  }
  const duration = user.demoDurationDays ? `${user.demoDurationDays} hari` : null;
  if (!user.demoActivatedAt) {
    return (
      <div className="text-[11px]">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold">
          Menunggu aktivasi
        </span>
        {duration && <div className="text-slate-500 mt-1">Durasi {duration}</div>}
      </div>
    );
  }
  const expired = user.demoExpiresAt ? new Date(user.demoExpiresAt).getTime() <= Date.now() : false;
  return (
    <div className="text-[11px] space-y-0.5">
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full border font-semibold ${
            expired
              ? "bg-slate-100 border-slate-200 text-slate-600"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {expired ? "Berakhir" : "Berjalan"}
        </span>
        {duration && <span className="text-slate-500">{duration}</span>}
      </div>
      <div className="text-slate-500 font-mono">
        {formatDate(user.demoActivatedAt, true)}
      </div>
      <div className="text-slate-500 font-mono">s.d. {formatDate(user.demoExpiresAt, true)}</div>
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal tambah
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);

  // Modal edit
  const [editTarget, setEditTarget] = useState<DemoUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", institution: "", jobTitle: "", phone: "" });

  // Modal konfirmasi
  const [confirmState, setConfirmState] = useState<{ action: ConfirmAction; user: DemoUser } | null>(null);

  // Status umum modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  /** Menjalankan fetch ke API admin; 401 -> redirect ke halaman login. */
  const callApi = useCallback(
    async <T,>(url: string, init?: RequestInit): Promise<{ ok: boolean; json: ApiResponse<T> | null }> => {
      const res = await fetch(url, init);
      if (res.status === 401) {
        router.replace("/admin/login");
        return { ok: false, json: { success: false, message: "Sesi berakhir. Silakan login kembali." } };
      }
      const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
      return { ok: res.ok && !!json?.success, json };
    },
    [router]
  );

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { ok, json } = await callApi<DemoUser[]>(
        `/api/admin/users${includeDeleted ? "?includeDeleted=1" : ""}`,
        { cache: "no-store" }
      );
      if (ok && json?.data) {
        // Server hanya mengembalikan akun USER; saring ulang sebagai pengaman tampilan.
        setUsers(json.data.filter((u) => u.roleCode !== "ADMIN"));
      } else {
        setLoadError(json?.message || "Gagal memuat data pengguna.");
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setLoadError("Terjadi kesalahan jaringan saat memuat data pengguna.");
    } finally {
      setIsLoading(false);
    }
  }, [callApi, includeDeleted]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const closeModals = () => {
    if (isSubmitting) return;
    setIsAddModalOpen(false);
    setEditTarget(null);
    setConfirmState(null);
    setModalError("");
  };

  const runMutation = async (url: string, init: RequestInit, fallback: string): Promise<boolean> => {
    setIsSubmitting(true);
    setModalError("");
    setSuccessMessage("");
    try {
      const { ok, json } = await callApi(url, init);
      if (ok) {
        setSuccessMessage(json?.message || "Perubahan berhasil disimpan.");
        await fetchUsers();
        return true;
      }
      const fieldErrors = json?.errors
        ? Object.entries(json.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join("; ")
        : "";
      setModalError([json?.message || fallback, fieldErrors].filter(Boolean).join(" — "));
      return false;
    } catch (err) {
      console.error(fallback, err);
      setModalError("Terjadi kesalahan jaringan.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const done = await runMutation(
      "/api/admin/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name.trim(),
          email: createForm.email.trim(),
          institution: createForm.institution.trim(),
          jobTitle: createForm.jobTitle.trim(),
          phone: createForm.phone.trim(),
        }),
      },
      "Gagal menambahkan pengguna."
    );
    if (done) {
      setCreateForm(EMPTY_CREATE_FORM);
      setIsAddModalOpen(false);
    }
  };

  const openEdit = (u: DemoUser) => {
    setEditTarget(u);
    setEditForm({
      name: u.name,
      institution: u.institution || "",
      jobTitle: u.jobTitle || "",
      phone: u.phone || "",
    });
    setModalError("");
    setSuccessMessage("");
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const done = await runMutation(
      `/api/admin/users/${editTarget.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          institution: editForm.institution.trim() || null,
          jobTitle: editForm.jobTitle.trim() || null,
          phone: editForm.phone.trim() || null,
        }),
      },
      "Gagal memperbarui pengguna."
    );
    if (done) setEditTarget(null);
  };

  const handleConfirm = async () => {
    if (!confirmState) return;
    const { action, user } = confirmState;
    let done = false;
    if (action === "activate" || action === "deactivate") {
      done = await runMutation(
        `/api/admin/users/${user.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action === "activate" ? "ACTIVE" : "INACTIVE" }),
        },
        "Gagal mengubah status pengguna."
      );
    } else if (action === "delete") {
      done = await runMutation(`/api/admin/users/${user.id}`, { method: "DELETE" }, "Gagal menghapus pengguna.");
    } else {
      done = await runMutation(
        `/api/admin/users/${user.id}/restore`,
        { method: "POST" },
        "Gagal memulihkan pengguna."
      );
    }
    if (done) setConfirmState(null);
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return [u.name, u.email, u.institution, u.jobTitle, u.phone].some((v) => v && v.toLowerCase().includes(term));
  });

  const confirmCopy: Record<
    ConfirmAction,
    { title: string; body: string; button: string; tone: "blue" | "amber" | "rose" | "emerald" }
  > = {
    activate: {
      title: "Aktifkan akun USER?",
      body: "Akun akan kembali dapat login demo melalui magic link selama masa akses demonya masih berlaku.",
      button: "Aktifkan",
      tone: "emerald",
    },
    deactivate: {
      title: "Nonaktifkan akun USER?",
      body: "Pengguna tidak dapat login demo selama akun nonaktif. Data lead dan riwayat akses tetap tersimpan, dan akun dapat diaktifkan kembali kapan saja.",
      button: "Nonaktifkan",
      tone: "amber",
    },
    delete: {
      title: "Hapus akun USER?",
      body: "Akun akan dihapus secara lunak (soft delete): tidak tampil di daftar dan tidak dapat login, serta tautan magic link yang belum dipakai dicabut. Data lead, riwayat akses, dan jejak audit tetap utuh. Akun dapat dipulihkan melalui opsi “Tampilkan akun terhapus”.",
      button: "Hapus Akun",
      tone: "rose",
    },
    restore: {
      title: "Pulihkan akun USER?",
      body: "Akun akan kembali tampil di daftar dengan status sebelumnya. Untuk memberi akses demo baru, gunakan menu Leads (tautan lama yang dicabut tidak aktif kembali).",
      button: "Pulihkan",
      tone: "blue",
    },
  };

  const toneButton: Record<"blue" | "amber" | "rose" | "emerald", string> = {
    blue: "bg-blue-600 hover:bg-blue-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    rose: "bg-rose-600 hover:bg-rose-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
  };

  const actionBtn =
    "inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* Header & Tombol Tambah Pengguna */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
              Manajemen Pengguna Demo (USER)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              Khusus Akun Demo Klien
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola akun USER (akun demo klien). Akun ADMIN tidak ditampilkan dan tidak dapat diubah dari halaman ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCreateForm(EMPTY_CREATE_FORM);
              setIsAddModalOpen(true);
              setModalError("");
              setSuccessMessage("");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah USER</span>
          </button>
        </div>
      </div>

      {/* Info alur login USER */}
      <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <span>
          Akun USER tidak memakai password. Pengguna login demo melalui <strong>magic link</strong> yang dibuat dan
          dikirim dari menu <strong>Leads</strong> (Beri Akses Demo / Kirim Tautan Baru). Masa akses demo juga diatur dari
          menu Leads.
        </span>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="flex-1">{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-100"
            aria-label="Tutup pesan"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {loadError && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Search Bar & Toggle */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, institusi, jabatan, atau telepon..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none whitespace-nowrap">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Tampilkan akun terhapus</span>
        </label>
      </div>

      {/* TABEL PENGGUNA */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Institusi & Jabatan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Periode Akses Terakhir</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800">Tidak ada akun USER ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {searchTerm
                        ? "Ubah kata kunci pencarian Anda."
                        : "Akun USER biasanya dibuat otomatis dari Leads, atau tambahkan manual lewat tombol “Tambah USER”."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isDeleted = !!u.deletedAt;
                  const isActive = u.status === "ACTIVE";
                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${isDeleted ? "bg-slate-50/70 text-slate-500" : "hover:bg-slate-50/60"}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className={`font-semibold ${isDeleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
                          {u.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{u.institution || "-"}</div>
                        <div className="text-[11px] text-slate-500">{u.jobTitle || "-"}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-start gap-1">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>Aktif</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              <span>Nonaktif</span>
                            </span>
                          )}
                          {isDeleted && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold"
                              title={`Dihapus ${formatDate(u.deletedAt, true)}`}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Terhapus</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-start gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <AccessPeriod user={u} />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {isDeleted ? (
                            <button
                              type="button"
                              onClick={() => {
                                setModalError("");
                                setSuccessMessage("");
                                setConfirmState({ action: "restore", user: u });
                              }}
                              className={`${actionBtn} bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100`}
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>Pulihkan</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => openEdit(u)}
                                className={`${actionBtn} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`}
                              >
                                <Pencil className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalError("");
                                  setSuccessMessage("");
                                  setConfirmState({ action: isActive ? "deactivate" : "activate", user: u });
                                }}
                                className={`${actionBtn} ${
                                  isActive
                                    ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                <Power className="h-3 w-3" />
                                <span>{isActive ? "Nonaktifkan" : "Aktifkan"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalError("");
                                  setSuccessMessage("");
                                  setConfirmState({ action: "delete", user: u });
                                }}
                                className={`${actionBtn} bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100`}
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Hapus</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && users.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-500">
            Menampilkan {filteredUsers.length} dari {users.length} akun USER
            {includeDeleted ? " (termasuk yang terhapus)" : ""}.
          </div>
        )}
      </div>

      {/* MODAL TAMBAH USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Tambah Akun USER</h3>
                  <p className="text-xs text-slate-500">Akun demo klien baru (role USER, status Aktif).</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModals}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">{modalError}</div>
              )}

              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-blue-800">
                <Info className="h-3.5 w-3.5 shrink-0 text-blue-600 mt-0.5" />
                <span>
                  Tidak perlu password maupun pilihan role. USER login melalui magic link yang dikirim dari menu Leads.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={createForm.name}
                    onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nama lengkap pengguna"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={createForm.email}
                    onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="nama@institusi.co.id"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Institusi / RS</label>
                  <input
                    type="text"
                    maxLength={150}
                    value={createForm.institution}
                    onChange={(e) => setCreateForm((p) => ({ ...p, institution: e.target.value }))}
                    placeholder="RS / Lab Mitra"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={createForm.jobTitle}
                    onChange={(e) => setCreateForm((p) => ({ ...p, jobTitle: e.target.value }))}
                    placeholder="Kepala Lab / ATLM / Staf IT"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    maxLength={30}
                    value={createForm.phone}
                    onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="0812 3456 7890"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Akun USER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {editTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">Edit Akun USER</h3>
                  <p className="text-xs text-slate-500">{editTarget.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModals}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">{modalError}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Institusi / RS</label>
                  <input
                    type="text"
                    maxLength={150}
                    value={editForm.institution}
                    onChange={(e) => setEditForm((p) => ({ ...p, institution: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editForm.jobTitle}
                    onChange={(e) => setEditForm((p) => ({ ...p, jobTitle: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    maxLength={30}
                    value={editForm.phone}
                    onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Email tidak dapat diubah. Status akun diatur lewat tombol Aktifkan/Nonaktifkan di tabel.
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      {confirmState && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-9 w-9 rounded-xl border flex items-center justify-center ${
                    confirmState.action === "delete"
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : confirmState.action === "deactivate"
                        ? "bg-amber-50 border-amber-200 text-amber-600"
                        : "bg-blue-50 border-blue-200 text-blue-600"
                  }`}
                >
                  {confirmState.action === "delete" ? (
                    <Trash2 className="h-5 w-5" />
                  ) : confirmState.action === "restore" ? (
                    <RotateCcw className="h-5 w-5" />
                  ) : (
                    <Power className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {confirmCopy[confirmState.action].title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {confirmState.user.name} &middot; {confirmState.user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModals}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">{modalError}</div>
              )}
              <p className="text-xs text-slate-600 leading-relaxed">{confirmCopy[confirmState.action].body}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs ${
                    toneButton[confirmCopy[confirmState.action].tone]
                  }`}
                >
                  {isSubmitting ? "Memproses..." : confirmCopy[confirmState.action].button}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
