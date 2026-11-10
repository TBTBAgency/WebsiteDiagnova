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
  let passwordHash = "";
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash(data.password, salt);
  } else {
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash("Diagnova2026!", salt);
  }

  // Jika roleId tidak diberikan, cari role default
  let roleId = data.roleId;
  if (!roleId) {
    const defaultRole = await db.role.findFirst({
      where: { name: "Super Admin" },
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
 * Mencari atau membuat user dari pengajuan lead request demo
 */
export async function findOrCreateUserForLead(data: {
  name: string;
  institution: string;
  jobTitle: string;
  email: string;
  phone: string;
}): Promise<string> {
  const existing = await db.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });

  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        institution: data.institution,
        jobTitle: data.jobTitle,
        phone: data.phone,
      },
    });
    return existing.id;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("LeadDemo2026!", salt);

  const newUser = await db.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      institution: data.institution,
      jobTitle: data.jobTitle,
      phone: data.phone,
      status: 1,
    },
  });

  return newUser.id;
}

/**
 * Verifikasi password user
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Menjamin adanya akun Super Admin default
 */
export async function ensureDefaultAdmin(): Promise<SafeUser> {
  const defaultEmail = "admin@diagnova.id";
  const existing = await findUserByEmail(defaultEmail);
  if (existing) {
    return existing;
  }

  let role = await db.role.findFirst({ where: { name: "Super Admin" } });
  if (!role) {
    role = await db.role.create({
      data: { name: "Super Admin", description: "Akses penuh seluruh sistem" },
    });
  }

  return createUser({
    name: "Diagnova Super Admin",
    email: defaultEmail,
    password: "Diagnova2026!",
    roleId: role.id,
    status: 1,
  });
}
