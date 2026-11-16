import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import {
  listDemoUsers,
  createDemoUser,
  updateDemoUser,
  softDeleteDemoUser,
  restoreDemoUser,
  UserManagementError,
} from "@/lib/models/user.model";
import { createUserSchema, updateUserSchema } from "@/lib/validations";
import type { AuditActor } from "@/lib/models/audit.model";
import { ApiResponse } from "@/types";

const NO_STORE = { "Cache-Control": "no-store" };
const ok = (message: string, data: unknown, status = 200) =>
  NextResponse.json<ApiResponse>({ success: true, message, data }, { status, headers: NO_STORE });
const fail = (message: string, status: number, errors?: Record<string, string[]>) =>
  NextResponse.json<ApiResponse>({ success: false, message, ...(errors ? { errors } : {}) }, { status, headers: NO_STORE });

function handle(error: unknown, fallback: string) {
  if (error instanceof UserManagementError) return fail(error.message, error.httpStatus);
  console.error(fallback, error);
  return fail(fallback, 500);
}

async function parse<T>(request: NextRequest, schema: ZodSchema<T>) {
  const body = await request.json().catch(() => null);
  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    return { response: fail("Data pengguna tidak valid. Hanya field akun USER yang dapat diubah.", 400, result.error.flatten().fieldErrors as Record<string, string[]>) };
  }
  return { data: result.data };
}

export async function listUsersController(request: NextRequest) {
  try {
    const includeDeleted = new URL(request.url).searchParams.get("includeDeleted") === "1";
    return ok("Daftar akun USER berhasil dimuat.", await listDemoUsers({ includeDeleted }));
  } catch (e) {
    return handle(e, "Gagal memuat data pengguna.");
  }
}

export async function createUserController(request: NextRequest, actor: AuditActor) {
  const parsed = await parse(request, createUserSchema);
  if ("response" in parsed) return parsed.response;
  try {
    return ok("Akun USER berhasil ditambahkan.", await createDemoUser(parsed.data, actor), 201);
  } catch (e) {
    return handle(e, "Gagal menambahkan pengguna.");
  }
}

export async function updateUserController(request: NextRequest, id: string, actor: AuditActor) {
  const parsed = await parse(request, updateUserSchema);
  if ("response" in parsed) return parsed.response;
  try {
    return ok("Akun USER berhasil diperbarui.", await updateDemoUser(id, parsed.data, actor));
  } catch (e) {
    return handle(e, "Gagal memperbarui pengguna.");
  }
}

export async function deleteUserController(id: string, actor: AuditActor) {
  try {
    return ok("Akun USER dihapus (dapat dipulihkan).", await softDeleteDemoUser(id, actor));
  } catch (e) {
    return handle(e, "Gagal menghapus pengguna.");
  }
}

export async function restoreUserController(id: string, actor: AuditActor) {
  try {
    return ok("Akun USER dipulihkan.", await restoreDemoUser(id, actor));
  } catch (e) {
    return handle(e, "Gagal memulihkan pengguna.");
  }
}
