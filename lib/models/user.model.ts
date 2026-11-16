import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { RoleRecord, UserRecord } from "@/types";
import { recordAuditLogTx, type AuditActor } from "@/lib/models/audit.model";
import { ROLE_DISPLAY_NAMES } from "@/lib/roles";

export interface SafeUser extends UserRecord {
  roleCode?: "ADMIN" | "USER" | null;
}

export interface UserWithPassword extends SafeUser {
  passwordHash: string;
}

/** Error User Management yang pesannya aman ditampilkan ke admin. */
export class UserManagementError extends Error {
  constructor(message: string, public readonly httpStatus: number = 409) {
    super(message);
    this.name = "UserManagementError";
  }
}

const withRole = { role: true, demoAccesses: { orderBy: { grantedAt: "desc" as const }, take: 1 } } satisfies Prisma.UserInclude;
type UserWithRole = Prisma.UserGetPayload<{ include: typeof withRole }>;

function toSafeUser(u: UserWithRole | Prisma.UserGetPayload<{ include: { role: true } }>): SafeUser {
  const latest = "demoAccesses" in u ? u.demoAccesses[0] : undefined;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    institution: u.institution,
    jobTitle: u.jobTitle,
    phone: u.phone,
    roleId: u.roleId,
    roleName: u.role?.name ?? null,
    roleCode: u.role?.code ?? null,
    role: u.role?.name ?? null,
    status: u.status,
    deletedAt: u.deletedAt?.toISOString() ?? null,
    demoActivatedAt: latest?.activatedAt?.toISOString() ?? null,
    demoExpiresAt: latest?.expiresAt?.toISOString() ?? null,
    demoDurationDays: latest?.durationDays ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

/** Untuk login: termasuk hash password. */
export async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() }, include: { role: true } });
  if (!user) return null;
  return { ...toSafeUser(user), passwordHash: user.passwordHash || "" };
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function getAllRoles(): Promise<RoleRecord[]> {
  const roles = await db.role.findMany({ where: { code: { not: null } }, orderBy: { name: "asc" } });
  return roles.map((r) => ({ id: r.id, name: r.name, code: r.code, description: r.description, createdAt: r.createdAt.toISOString() }));
}

/**
 * Daftar akun untuk User Management: HANYA role USER. Akun ADMIN dan akun role lama
 * (code NULL, menunggu OD-01) tidak pernah dikembalikan.
 */
export async function listDemoUsers(options: { includeDeleted?: boolean } = {}): Promise<SafeUser[]> {
  const users = await db.user.findMany({
    where: { role: { code: "USER" }, ...(options.includeDeleted ? {} : { deletedAt: null }) },
    orderBy: { createdAt: "desc" },
    include: withRole,
  });
  return users.map(toSafeUser);
}

/** Memuat target & memastikan target adalah USER. ADMIN / role lama -> 403 (ditegakkan di server). */
async function loadUserTarget(tx: Prisma.TransactionClient, id: string) {
  const locked = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM users WHERE id = ${id} FOR UPDATE`;
  if (locked.length === 0) throw new UserManagementError("Pengguna tidak ditemukan.", 404);
  const user = await tx.user.findUniqueOrThrow({ where: { id }, include: { role: true } });
  if (user.role?.code === "ADMIN") {
    throw new UserManagementError("Akun ADMIN tidak dapat diubah, dinonaktifkan, atau dihapus melalui User Management.", 403);
  }
  if (user.role?.code !== "USER") {
    throw new UserManagementError("Akun dengan role lama tidak dikelola di User Management (menunggu keputusan OD-01).", 403);
  }
  return user;
}

export async function createDemoUser(
  data: { name: string; email: string; institution?: string; jobTitle?: string; phone?: string },
  actor: AuditActor
): Promise<SafeUser> {
  return db.$transaction(async (tx) => {
    const role = await tx.role.findUnique({ where: { code: "USER" } });
    if (!role) throw new Error("Role USER belum dikonfigurasi.");
    const email = data.email.toLowerCase().trim();
    if (await tx.user.findUnique({ where: { email } })) {
      throw new UserManagementError("Alamat email sudah terdaftar.", 409);
    }
    const user = await tx.user.create({
      data: {
        name: data.name.trim(),
        email,
        institution: data.institution || null,
        jobTitle: data.jobTitle || null,
        phone: data.phone || null,
        roleId: role.id,
        status: "ACTIVE",
        passwordHash: null, // USER login hanya via magic link
      },
      include: withRole,
    });
    await recordAuditLogTx(tx, {
      actor,
      action: "USER_CREATED",
      entity: "users",
      recordId: user.id,
      newValue: { email, role: ROLE_DISPLAY_NAMES.USER, source: "USER_MANAGEMENT" },
    });
    return toSafeUser(user);
  });
}

export async function updateDemoUser(
  id: string,
  data: { name?: string; institution?: string | null; jobTitle?: string | null; phone?: string | null; status?: "ACTIVE" | "INACTIVE" },
  actor: AuditActor
): Promise<SafeUser> {
  return db.$transaction(async (tx) => {
    const before = await loadUserTarget(tx, id);
    if (before.deletedAt) throw new UserManagementError("Akun sudah dihapus. Pulihkan terlebih dahulu.");
    const user = await tx.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.institution !== undefined ? { institution: data.institution || null } : {}),
        ...(data.jobTitle !== undefined ? { jobTitle: data.jobTitle || null } : {}),
        ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
      include: withRole,
    });
    const action =
      data.status && data.status !== before.status ? (data.status === "ACTIVE" ? "USER_ACTIVATED" : "USER_DEACTIVATED") : "USER_UPDATED";
    await recordAuditLogTx(tx, {
      actor,
      action,
      entity: "users",
      recordId: id,
      oldValue: { name: before.name, institution: before.institution, jobTitle: before.jobTitle, phone: before.phone, status: before.status },
      newValue: data as Record<string, unknown>,
    });
    return toSafeUser(user);
  });
}

/** Soft delete (OD-05): relasi lead, akses, dan audit tetap utuh; tautan yang belum dipakai dicabut. */
export async function softDeleteDemoUser(id: string, actor: AuditActor): Promise<SafeUser> {
  const now = new Date();
  return db.$transaction(async (tx) => {
    const before = await loadUserTarget(tx, id);
    if (before.deletedAt) throw new UserManagementError("Akun sudah dihapus.");
    const user = await tx.user.update({ where: { id }, data: { deletedAt: now }, include: withRole });
    const links = await tx.demoMagicLink.updateMany({
      where: { demoAccess: { userId: id }, usedAt: null, revokedAt: null },
      data: { revokedAt: now },
    });
    await recordAuditLogTx(tx, {
      actor,
      action: "USER_DELETED",
      entity: "users",
      recordId: id,
      newValue: { softDelete: true, revokedLinks: links.count },
    });
    return toSafeUser(user);
  });
}

export async function restoreDemoUser(id: string, actor: AuditActor): Promise<SafeUser> {
  return db.$transaction(async (tx) => {
    const before = await loadUserTarget(tx, id);
    if (!before.deletedAt) throw new UserManagementError("Akun tidak dalam keadaan terhapus.");
    const user = await tx.user.update({ where: { id }, data: { deletedAt: null }, include: withRole });
    await recordAuditLogTx(tx, { actor, action: "USER_RESTORED", entity: "users", recordId: id });
    return toSafeUser(user);
  });
}
