import { db } from "@/lib/db";
import { UserRecord, UserRole, UserStatus } from "@/types";
import { UserRole as PrismaUserRole, UserStatus as PrismaUserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

export const prismaRoleToUserRole: Record<PrismaUserRole, UserRole> = {
  [PrismaUserRole.SUPER_ADMIN]: "super_admin",
  [PrismaUserRole.SALES_ADMIN]: "sales_admin",
  [PrismaUserRole.LAB_STAFF]: "lab_staff",
  [PrismaUserRole.PATHOLOGIST]: "pathologist",
};

export const userRoleToPrismaRole: Record<UserRole, PrismaUserRole> = {
  super_admin: PrismaUserRole.SUPER_ADMIN,
  sales_admin: PrismaUserRole.SALES_ADMIN,
  lab_staff: PrismaUserRole.LAB_STAFF,
  pathologist: PrismaUserRole.PATHOLOGIST,
};

export const prismaStatusToUserStatus: Record<PrismaUserStatus, UserStatus> = {
  [PrismaUserStatus.ACTIVE]: "active",
  [PrismaUserStatus.INACTIVE]: "inactive",
};

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
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
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: prismaRoleToUserRole[user.role] ?? "sales_admin",
    status: prismaStatusToUserStatus[user.status] ?? "active",
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Mencari user berdasarkan ID (aman, tanpa password hash)
 */
export async function findUserById(id: string): Promise<SafeUser | null> {
  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: prismaRoleToUserRole[user.role] ?? "sales_admin",
    status: prismaStatusToUserStatus[user.status] ?? "active",
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Membuat user baru dengan enkripsi password menggunakan bcrypt
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}): Promise<SafeUser> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const prismaRole = data.role ? userRoleToPrismaRole[data.role] : PrismaUserRole.SALES_ADMIN;
  const prismaStatus = data.status === "inactive" ? PrismaUserStatus.INACTIVE : PrismaUserStatus.ACTIVE;

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: prismaRole,
      status: prismaStatus,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: prismaRoleToUserRole[user.role],
    status: prismaStatusToUserStatus[user.status],
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Verifikasi password user
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Menjamin adanya akun Super Admin default (jika belum ada)
 * Email: admin@diagnova.id
 * Password Default: Diagnova2026!
 */
export async function ensureDefaultAdmin(): Promise<SafeUser> {
  const defaultEmail = "admin@diagnova.id";
  const existing = await findUserByEmail(defaultEmail);
  if (existing) {
    return existing;
  }

  return createUser({
    name: "Diagnova Super Admin",
    email: defaultEmail,
    password: "Diagnova2026!",
    role: "super_admin",
    status: "active",
  });
}
