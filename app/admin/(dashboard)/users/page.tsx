"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Shield,
  Lock,
  UserCheck,
  Clock,
  Edit3,
  Trash2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Ticket,
  Link2,
  Copy,
} from "lucide-react";
import { SafeUser } from "@/lib/models/user.model";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Notification banners
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modal Tambah User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    institution: "",
    jobTitle: "",
    phone: "",
    status: 1,
    demoDurationDays: 7,
  });

  // Modal Edit User
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    institution: "",
    jobTitle: "",
    phone: "",
    status: 1,
    demoDurationDays: 7,
  });

  // Magic Link (hanya untuk akun dengan permohonan demo yang disetujui; divalidasi backend)
  const [issuingFor, setIssuingFor] = useState<string | null>(null);
  const [magicLinkResult, setMagicLinkResult] = useState<{ url: string; expiresAt: string; user: SafeUser } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleIssueMagicLink = async (u: SafeUser) => {
    if (!window.confirm(`Terbitkan Magic Link baru untuk ${u.name}? Tautan lama yang belum dipakai akan tidak berlaku.`)) return;
    setIssuingFor(u.id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`/api/admin/users/${u.id}/magic-link`, { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setLinkCopied(false);
        setMagicLinkResult({ url: json.data.magicLinkUrl, expiresAt: json.data.expiresAt, user: u });
      } else {
        setErrorMessage(json.message || "Magic Link tidak dapat diterbitkan.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIssuingFor(null);
      fetchUsers();
    }
  };

  const waLinkFor = (u: SafeUser, url: string) => {
    const digits = (u.phone || "").replace(/[^0-9]/g, "").replace(/^0/, "62");
    const text = `Halo ${u.name}, berikut tautan masuk demo Diagnova (buka pertama kali dalam 24 jam; setelah itu tautan yang sama dapat dipakai untuk masuk kembali selama masa demo):\n${url}`;
    return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
  };

  // Modal Hapus User
  const [userToDelete, setUserToDelete] = useState<SafeUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch daftar pengguna (otomatis difilter role USER oleh server)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setUsers(json.data);
      } else {
        setErrorMessage(json.message || "Gagal memuat data pengguna.");
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setErrorMessage("Terjadi kesalahan jaringan saat memuat pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addFormData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage("Pengguna (USER) baru berhasil ditambahkan!");
        setAddFormData({
          name: "",
          email: "",
          institution: "",
          jobTitle: "",
          phone: "",
          status: 1,
          demoDurationDays: 7,
        });
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        setErrorMessage(json.message || "Gagal menambahkan pengguna.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: SafeUser) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      institution: user.institution || "",
      jobTitle: user.jobTitle || "",
      phone: user.phone || "",
      status: user.status ?? 1,
      demoDurationDays: user.demoDurationDays ?? 7,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage(`Data pengguna ${editingUser.name} berhasil diperbarui!`);
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        setErrorMessage(json.message || "Gagal memperbarui data pengguna.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: SafeUser) => {
    const newStatus = user.status === 1 ? 0 : 1;
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage(
          `Status akun ${user.name} berhasil diubah menjadi ${
            newStatus === 1 ? "Aktif" : "Nonaktif"
          }.`
        );
        fetchUsers();
      } else {
        setErrorMessage(json.message || "Gagal mengubah status akun.");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      setErrorMessage("Terjadi kesalahan jaringan saat mengubah status akun.");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage(`Pengguna ${userToDelete.name} berhasil dihapus.`);
        setUserToDelete(null);
        fetchUsers();
      } else {
        setErrorMessage(json.message || "Gagal menghapus pengguna.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setErrorMessage("Terjadi kesalahan jaringan saat menghapus pengguna.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper evaluasi status masa aktif demo
  const getDemoAccessInfo = (u: SafeUser) => {
    if (!u.demoExpiresAt) {
      return {
        label: "Belum Diaktifkan",
        subtext: u.demoDurationDays
          ? `Alokasi voucher: ${u.demoDurationDays} hari`
          : "Belum ada alokasi",
        badgeClass: "bg-slate-100 border-slate-200 text-slate-700",
        dotClass: "bg-slate-400",
      };
    }

    const now = new Date();
    const expiresAt = new Date(u.demoExpiresAt);
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      return {
        label: "Kedaluwarsa",
        subtext: `Berakhir ${expiresAt.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`,
        badgeClass: "bg-rose-50 border-rose-200 text-rose-700",
        dotClass: "bg-rose-500",
      };
    }

    return {
      label: `Aktif (${diffDays} hari tersisa)`,
      subtext: `Hingga ${expiresAt.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`,
      badgeClass: "bg-emerald-50 border-emerald-200 text-emerald-700",
      dotClass: "bg-emerald-500",
    };
  };

  // Search filter (berlaku hanya pada dataset USER)
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.institution && u.institution.toLowerCase().includes(term)) ||
      (u.jobTitle && u.jobTitle.toLowerCase().includes(term)) ||
      (u.phone && u.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-display">
              Manajemen Pengguna (User Management)
            </h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              Role: USER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola akun pengguna website dan pemohon akses demo sistem Diagnova. Akun Administrator dilindungi secara terpisah di luar antarmuka ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAddModalOpen(true);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Pesan Sukses / Pesan Error */}
      {successMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-emerald-600 hover:text-emerald-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-600 hover:text-rose-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pengguna, email, institusi, atau nomor telepon..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
          />
        </div>
      </div>

      {/* TABEL PENGGUNA (USER MANAGEMENT) */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Kontak & Institusi</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Akses Demo</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-600 mb-2" />
                    <span>Memuat data pengguna...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800">Tidak ada pengguna ditemukan</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {searchTerm
                        ? "Coba ubah kata kunci pencarian Anda."
                        : "Tambahkan pengguna baru dengan mengklik tombol Tambah User."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const demoInfo = getDemoAccessInfo(u);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Kolom 1: Pengguna */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold">
                            <Shield className="h-2.5 w-2.5 text-blue-600" />
                            <span>{u.roleName || "USER"}</span>
                          </span>
                        </div>
                      </td>

                      {/* Kolom 2: Kontak & Institusi */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{u.institution || "Belum ditentukan"}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{u.jobTitle || "Pemohon Demo"}</span>
                        </div>
                        {u.phone && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                            <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Kolom 3: Status Akun (1: Aktif, 0: Nonaktif) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {u.status === 1 ? (
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

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === 1 ? "Klik untuk menonaktifkan" : "Klik untuk mengaktifkan"}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            {u.status === 1 ? (
                              <ToggleRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Kolom 4: Akses Demo (Masa berlaku & Voucher) */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${demoInfo.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${demoInfo.dotClass}`} />
                            <span>{demoInfo.label}</span>
                          </span>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span>{demoInfo.subtext}</span>
                          </div>
                          {u.magicLink && !u.magicLink.eligible && (
                            <p data-testid={`magic-link-reason-${u.id}`} className="text-[10.5px] text-amber-700 max-w-[260px] leading-snug">
                              Magic Link: {u.magicLink.reason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Kolom 5: Terdaftar */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                        {new Date(u.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Kolom 6: Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            data-testid={`magic-link-${u.id}`}
                            onClick={() => handleIssueMagicLink(u)}
                            disabled={!u.magicLink?.eligible || issuingFor === u.id}
                            title={u.magicLink?.reason || "Status Magic Link tidak diketahui"}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Link2 className="h-3 w-3" />
                            <span>{issuingFor === u.id ? "Memproses…" : "Magic Link"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL HASIL MAGIC LINK (ditampilkan sekali; tidak disimpan di halaman) */}
      {magicLinkResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl p-5 space-y-4" data-testid="magic-link-modal">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Magic Link untuk {magicLinkResult.user.name}</h3>
                <p className="text-xs text-slate-500">
                  Berlaku hingga {new Date(magicLinkResult.expiresAt).toLocaleString("id-ID")} · dapat dipakai masuk kembali selama masa demo. Tautan hanya ditampilkan sekali.
                </p>
              </div>
              <button type="button" aria-label="Tutup" onClick={() => setMagicLinkResult(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <input readOnly value={magicLinkResult.url} data-testid="magic-link-value" className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono" />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(magicLinkResult.url);
                    setLinkCopied(true);
                  } catch {
                    setLinkCopied(false);
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <Copy className="h-3.5 w-3.5" /> {linkCopied ? "Tersalin" : "Salin"}
              </button>
            </div>
            {waLinkFor(magicLinkResult.user, magicLinkResult.url) ? (
              <a
                href={waLinkFor(magicLinkResult.user, magicLinkResult.url)!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5"
              >
                Kirim via WhatsApp ({magicLinkResult.user.phone})
              </a>
            ) : (
              <p className="text-[11px] text-slate-500">Nomor WhatsApp tidak tersedia — salin tautan dan kirim secara manual.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL PENAMBAHAN USER (HANYA ROLE USER) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Tambah Pengguna (USER)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Akun baru otomatis ditetapkan dengan role USER (Pengguna Demo).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {/* Info Role Protection */}
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <span>
                  Sesuai kebijakan sistem Diagnova, penambahan akun dari modul ini hanya membuat akun ber-role <strong>USER</strong>. Akun Administrator dilindungi dan tidak dapat dibuat dari antarmuka ini.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Nama Lengkap */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) =>
                      setAddFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Contoh: dr. Budi Santoso"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={addFormData.email}
                    onChange={(e) =>
                      setAddFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="dokter@rumahsakit.id"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Akses login klien: tanpa password, melalui Magic Link */}
                <div
                  data-testid="user-access-info"
                  className="sm:col-span-2 p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-2"
                >
                  <Lock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <span>
                    Akun klien <strong>tidak memakai password</strong>. Klien masuk melalui{" "}
                    <strong>Magic Link</strong> yang dibuat ketika permohonan demo dengan email yang sama
                    disetujui di menu <strong>Permohonan Demo</strong>. Login email + password hanya
                    berlaku untuk Administrator.
                  </span>
                </div>

                {/* Institusi / RS */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Institusi / Rumah Sakit</label>
                  <input
                    type="text"
                    value={addFormData.institution}
                    onChange={(e) =>
                      setAddFormData((prev) => ({ ...prev, institution: e.target.value }))
                    }
                    placeholder="RS Mitra Diagnova"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Jabatan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={addFormData.jobTitle}
                    onChange={(e) =>
                      setAddFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                    }
                    placeholder="Kepala Lab / Spesialis Patologi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* No Telepon */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={addFormData.phone}
                    onChange={(e) =>
                      setAddFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="0812 3456 7890"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Alokasi Voucher Demo (Hari) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <Ticket className="h-3 w-3 text-blue-600" />
                    <span>Alokasi Voucher Demo</span>
                  </label>
                  <select
                    value={addFormData.demoDurationDays}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        demoDurationDays: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value={3}>3 Hari (Demo Ringkas)</option>
                    <option value={7}>7 Hari (Standar Evaluasi)</option>
                    <option value={14}>14 Hari (Dua Pekan)</option>
                    <option value={30}>30 Hari (Satu Bulan Penuh)</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    Hanya catatan. Masa akses demo ditentukan oleh durasi yang dipilih saat permohonan demo disetujui.
                  </p>
                </div>

                {/* Status User */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Status Akun *</label>
                  <select
                    value={addFormData.status}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value={1}>1 - Aktif (Dapat mengakses akun)</option>
                    <option value={0}>0 - Nonaktif (Akses ditangguhkan)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Edit3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Edit Pengguna: {editingUser.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Email: {editingUser.email} &bull; Role: USER (Tetap)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Nama Lengkap */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Institusi / RS */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Institusi / Rumah Sakit</label>
                  <input
                    type="text"
                    value={editFormData.institution}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, institution: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Jabatan */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={editFormData.jobTitle}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* No Telepon */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Alokasi Voucher Demo (Hari) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center gap-1">
                    <Ticket className="h-3 w-3 text-blue-600" />
                    <span>Alokasi Voucher Demo</span>
                  </label>
                  <select
                    value={editFormData.demoDurationDays}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        demoDurationDays: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value={3}>3 Hari (Demo Ringkas)</option>
                    <option value={7}>7 Hari (Standar Evaluasi)</option>
                    <option value={14}>14 Hari (Dua Pekan)</option>
                    <option value={30}>30 Hari (Satu Bulan Penuh)</option>
                  </select>
                </div>

                {/* Status Akun */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-700">Status Akun *</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        status: parseInt(e.target.value, 10),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-hidden font-medium"
                  >
                    <option value={1}>1 - Aktif (Dapat mengakses akun)</option>
                    <option value={0}>0 - Nonaktif (Akses ditangguhkan)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
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

      {/* MODAL KONFIRMASI HAPUS */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-6 text-center animate-in fade-in duration-200">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hapus Pengguna</h3>
            <p className="text-xs text-slate-500 mt-1">
              Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> ({userToDelete.email})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-xs"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus Pengguna"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
