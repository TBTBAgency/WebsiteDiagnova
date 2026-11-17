import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth-session";
import { isAdminRole } from "@/lib/auth-secret";
import { ApiResponse, AuthSessionPayload } from "@/types";

export type AdminGuardResult =
  | { ok: true; session: AuthSessionPayload }
  | { ok: false; response: NextResponse<ApiResponse> };

/**
 * Server-side authorization for admin API routes.
 *
 * The JWT alone is not trusted: the user is re-loaded from the database so that a
 * deactivated, deleted, or demoted account loses access immediately instead of
 * keeping it until the 24h token expires.
 */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getCurrentSession();
  if (!session?.userId) {
    return {
      ok: false,
      response: NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid atau telah berakhir." },
        { status: 401 }
      ),
    };
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, status: true, role: { select: { name: true } } },
  });

  if (!user || user.status !== 1 || !isAdminRole(user.role?.name)) {
    return {
      ok: false,
      response: NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Hanya Administrator yang dapat mengakses sumber daya ini." },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    session: { ...session, name: user.name, email: user.email, role: user.role!.name },
  };
}

/** Extracts the client IP and user agent from request headers for audit logging. */
export function getClientInfo(headers: Headers): { ipAddress: string; userAgent: string } {
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "127.0.0.1";
  const userAgent = (headers.get("user-agent") || "").slice(0, 255);
  return { ipAddress: ipAddress.slice(0, 50), userAgent };
}
