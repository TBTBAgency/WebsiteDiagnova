import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth-session";
import { isAdminRole } from "@/lib/roles";
import type { AuditActor } from "@/lib/models/audit.model";
import { ApiResponse, AuthSessionPayload } from "@/types";

export interface AdminContext {
  session: AuthSessionPayload;
  actor: AuditActor & { userId: string };
}

export type AdminGuardResult =
  | ({ ok: true } & AdminContext)
  | { ok: false; response: NextResponse<ApiResponse> };

function deny(status: 401 | 403, message: string): AdminGuardResult {
  return {
    ok: false,
    response: NextResponse.json<ApiResponse>(
      { success: false, message },
      { status, headers: { "Cache-Control": "no-store" } }
    ),
  };
}

/**
 * Guard server-side untuk seluruh endpoint admin & LIS.
 *
 * JWT saja tidak dipercaya: status akun, soft delete, dan KODE role dibaca ulang dari database pada
 * setiap request, sehingga akun yang dinonaktifkan/dihapus atau diturunkan role-nya langsung
 * kehilangan akses walaupun cookie sesinya belum kedaluwarsa.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return deny(401, "Akses ditolak. Silakan login terlebih dahulu.");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, status: true, deletedAt: true, role: { select: { name: true, code: true } } },
  });

  if (!user || user.status !== "ACTIVE" || user.deletedAt) {
    return deny(401, "Sesi tidak valid atau akun telah dinonaktifkan.");
  }

  if (!isAdminRole(user.role?.code)) {
    return deny(403, "Akses ditolak. Endpoint ini khusus administrator.");
  }

  return {
    ok: true,
    session: { userId: user.id, name: user.name, email: user.email, role: "ADMIN", roleName: user.role?.name ?? null },
    actor: { type: "ADMIN", userId: user.id, email: user.email, role: user.role?.name ?? "ADMIN" },
  };
}
