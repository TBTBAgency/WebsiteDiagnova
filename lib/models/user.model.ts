import { db } from "@/lib/db";
import { isAdminRole } from "@/lib/auth-secret";
import { RoleRecord, UserRecord } from "@/types";
import bcrypt from "bcryptjs";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  institution?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  role?: RoleRecord | string | null;
  status: number; // 1: Aktif, 0: Nonaktif
  demoDurationDays?: number | null;
  demoActivatedAt?: string | null;
  demoExpiresAt?: string | null;
  createdAt: string;
}

export interface UserWithPassword extends SafeUser {
  passwordHash: string;
}

/**
 * Mencari user berdasarkan email (termasuk password hash untuk verifikasi login)
 */
export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { role: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    institution: user.institution,
    jobTitle: user.jobTitle,
    phone: user.phone,
    roleId: user.roleId,
    roleName: user.role?.name || "User",
    role: user.role?.name || "User",
    passwordHash: user.passwordHash || "",
    status: user.status ?? 1,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Mencari user berdasarkan ID (aman, tanpa password hash)
 */
export async function findUserById(id: string): Promise<SafeUser | null> {
  const user = await db.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    institution: user.institution,
    jobTitle: user.jobTitle,
    phone: user.phone,
    roleId: user.roleId,
    roleName: user.role?.name || "User",
    role: user.role?.name || "User",
    status: user.status ?? 1,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Mengambil semua roles dari tabel Role
 */
export async function getAllRoles(): Promise<RoleRecord[]> {
  const roles = await db.role.findMany({
    orderBy: { name: "asc" },
  });
  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Mengambil daftar pengguna berdasarkan role (default: hanya role USER)
 * Akun ADMIN tidak pernah dikembalikan ke antarmuka Manajemen Pengguna.
 */
export async function getAllUsers(roleFilter: string = "USER"): Promise<SafeUser[]> {
  const users = await db.user.findMany({
    where: {
      role: {
        name: roleFilter,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { role: true },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    institution: u.institution,
    jobTitle: u.jobTitle,
    phone: u.phone,
    roleId: u.roleId,
    roleName: u.role?.name || "USER",
    role: u.role?.name || "USER",
    status: u.status ?? 1,
    demoDurationDays: u.demoDurationDays ?? null,
    demoActivatedAt: u.demoActivatedAt ? u.demoActivatedAt.toISOString() : null,
    demoExpiresAt: u.demoExpiresAt ? u.demoExpiresAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));
}

/**
 * Update akun USER (hanya boleh jika role pengguna adalah USER)
 * Melindungi akun ADMIN dari modifikasi melalui endpoint ini.
 */
export async function updateUser(
  id: string,
  data: {
    name?: string;
    institution?: string | null;
    jobTitle?: string | null;
    phone?: string | null;
    status?: number;
    demoDurationDays?: number | null;
  }
): Promise<SafeUser> {
  const target = await db.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!target) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // PROTEKSI KETAT: Dilarang mengubah akun ADMIN melalui modul Manajemen Pengguna
  if (isAdminRole(target.role?.name)) {
    throw new Error("Akses ditolak: Akun Administrator dilindungi dari modifikasi Manajemen Pengguna.");
  }

  const updated = await db.user.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.demoDurationDays !== undefined && { demoDurationDays: data.demoDurationDays }),
    },
    include: { role: true },
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    institution: updated.institution,
    jobTitle: updated.jobTitle,
    phone: updated.phone,
    roleId: updated.roleId,
    roleName: updated.role?.name || "USER",
    role: updated.role?.name || "USER",
    status: updated.status ?? 1,
    demoDurationDays: updated.demoDurationDays ?? null,
    demoActivatedAt: updated.demoActivatedAt ? updated.demoActivatedAt.toISOString() : null,
    demoExpiresAt: updated.demoExpiresAt ? updated.demoExpiresAt.toISOString() : null,
    createdAt: updated.createdAt.toISOString(),
  };
}

/**
 * Toggle status akun USER (1: Aktif, 0: Nonaktif/Suspended)
 * Melindungi akun ADMIN dari penonaktifan melalui endpoint ini.
 */
export async function toggleUserStatus(id: string, newStatus: number): Promise<SafeUser> {
  return updateUser(id, { status: newStatus });
}

/**
 * Menghapus akun USER
 * Melindungi akun ADMIN dari penghapusan melalui modul ini.
 */
export async function deleteUser(id: string): Promise<SafeUser> {
  const target = await db.user.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!target) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // PROTEKSI KETAT: Dilarang menghapus akun ADMIN
  if (isAdminRole(target.role?.name)) {
    throw new Error("Akses ditolak: Akun Administrator dilindungi dari penghapusan.");
  }

  const deleted = await db.user.delete({
    where: { id },
    include: { role: true },
  });

  return {
    id: deleted.id,
    name: deleted.name,
    email: deleted.email,
    institution: deleted.institution,
    jobTitle: deleted.jobTitle,
    phone: deleted.phone,
    roleId: deleted.roleId,
    roleName: deleted.role?.name || "USER",
    role: deleted.role?.name || "USER",
    status: deleted.status ?? 0,
    demoDurationDays: deleted.demoDurationDays ?? null,
    demoActivatedAt: deleted.demoActivatedAt ? deleted.demoActivatedAt.toISOString() : null,
    demoExpiresAt: deleted.demoExpiresAt ? deleted.demoExpiresAt.toISOString() : null,
    createdAt: deleted.createdAt.toISOString(),
  };
}

/**
 * Membuat user baru dengan enkripsi password menggunakan bcrypt
 */
export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  institution?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  roleId?: string | null;
  status?: number;
  demoDurationDays?: number | null;
}): Promise<SafeUser> {
  // Tanpa password => passwordHash null, sehingga akun tidak bisa login dengan password
  // (klien demo masuk lewat Magic Link). Tidak ada lagi password default yang dapat ditebak.
  let passwordHash: string | null = null;
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash(data.password, salt);
  }

  // Jika roleId tidak diberikan, default ke role USER
  let roleId = data.roleId;
  if (!roleId) {
    const defaultRole = await db.role.findFirst({
      where: { name: "USER" },
    });
    roleId = defaultRole?.id;
  }

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      institution: data.institution || null,
      jobTitle: data.jobTitle || null,
      phone: data.phone || null,
      roleId: roleId || null,
      status: data.status !== undefined ? data.status : 1,
      demoDurationDays: data.demoDurationDays ?? 7,
    },
    include: { role: true },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    institution: user.institution,
    jobTitle: user.jobTitle,
    phone: user.phone,
    roleId: user.roleId,
    roleName: user.role?.name || "USER",
    role: user.role?.name || "USER",
    status: user.status ?? 1,
    demoDurationDays: user.demoDurationDays ?? null,
    demoActivatedAt: user.demoActivatedAt ? user.demoActivatedAt.toISOString() : null,
    demoExpiresAt: user.demoExpiresAt ? user.demoExpiresAt.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Verifikasi password user
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
