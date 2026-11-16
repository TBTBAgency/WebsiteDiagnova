import { db } from "@/lib/db";
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
 * Mengambil daftar seluruh user untuk tabel User Management
 */
export async function getAllUsers(): Promise<SafeUser[]> {
  const users = await db.user.findMany({
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
    roleName: u.role?.name || "User",
    role: u.role?.name || "User",
    status: u.status ?? 1,
    createdAt: u.createdAt.toISOString(),
  }));
}

/**
 * Membuat user baru dengan enkripsi password menggunakan bcrypt
 */
export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  institution?: string;
  jobTitle?: string;
  phone?: string;
  roleId?: string;
  status?: number;
}): Promise<SafeUser> {
  // Tanpa password default: akun tanpa password tidak dapat login via password (hanya magic link)
  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;

  // Jika roleId tidak diberikan, cari role default
  let roleId = data.roleId;
  if (!roleId) {
    const defaultRole = await db.role.findFirst({
      where: { name: "Sales Admin" },
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
    roleName: user.role?.name || "User",
    role: user.role?.name || "User",
    status: user.status ?? 1,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Verifikasi password user
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
