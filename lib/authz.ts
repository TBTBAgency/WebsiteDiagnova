import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth-session";
import { isAdminRole } from "@/lib/roles";
import { ApiResponse, AuthSessionPayload } from "@/types";

export type AdminGuardResult =
  | { ok: true; session: AuthSessionPayload }
  | { ok: false; response: NextResponse<ApiResponse> };

function deny(status: 401 | 403, message: string): AdminGuardResult {
  return {
    ok: false,
    response: NextResponse.json<ApiResponse>({ success: false, message }, { status }),
  };
}

/**
 * Guard server-side untuk seluruh endpoint admin & LIS.
 *
 * JWT saja tidak dipercaya: status akun dan role dibaca ulang dari database pada setiap request,
 * sehingga akun yang dinonaktifkan atau diturunkan role-nya langsung kehilangan akses
 * walaupun cookie sesinya belum kedaluwarsa.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return deny(401, "Akses ditolak. Silakan login terlebih dahulu.");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { status: true, role: { select: { name: true } } },
  });

  if (!user || user.status !== 1) {
    return deny(401, "Sesi tidak valid atau akun telah dinonaktifkan.");
  }

  if (!isAdminRole(user.role?.name)) {
    return deny(403, "Akses ditolak. Endpoint ini khusus administrator.");
  }

  return { ok: true, session: { ...session, role: user.role!.name } };
}
