import { NextRequest, NextResponse } from "next/server";
import { consumeMagicLink, ConsumeFailureCode } from "@/lib/magic-link";
import { setSessionCookie } from "@/lib/auth-session";
import { recordAuditLog } from "@/lib/models/audit.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const FAILURES: Record<ConsumeFailureCode, { status: number; message: string; redirectUrl?: string }> = {
  INVALID: {
    status: 400,
    message: "Tautan akses tidak valid. Pastikan Anda membuka tautan terbaru yang dikirim tim Diagnova.",
  },
  USED: {
    status: 409,
    message: "Tautan ini sudah pernah digunakan. Setiap tautan hanya berlaku satu kali; silakan minta tautan baru kepada tim Diagnova.",
  },
  EXPIRED: {
    status: 410,
    message: "Tautan ini sudah kedaluwarsa. Silakan minta tautan baru kepada tim Diagnova.",
  },
  ACCOUNT_INACTIVE: {
    status: 403,
    message: "Akun demo Anda sedang dinonaktifkan. Silakan hubungi tim Diagnova.",
  },
  DEMO_EXPIRED: {
    status: 410,
    message: "Masa akses demo Anda telah berakhir.",
    redirectUrl: "/demo-expired",
  },
};

/**
 * POST /api/auth/magic-link/consume  { token }
 *
 * Satu-satunya titik konsumsi magic link. Hanya POST (tindakan sengaja pengguna);
 * GET ke halaman tautan tidak pernah mengubah data. Token tidak pernah dicatat ke log.
 */
export async function POST(request: NextRequest) {
  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
  const userAgent = request.headers.get("user-agent");

  let token: unknown;
  try {
    token = (await request.json())?.token;
  } catch {
    token = undefined;
  }

  try {
    const result = await consumeMagicLink(token, { ipAddress, userAgent });

    if (!result.success) {
      const failure = FAILURES[result.code];
      await recordAuditLog({
        userId: result.userId ?? null,
        action: "MAGIC_LINK_REJECTED",
        entity: "demo_magic_links",
        recordId: result.leadId ?? null,
        newValue: { reason: result.code },
        ipAddress,
        userAgent,
      });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: failure.message,
          data: { code: result.code, redirectUrl: failure.redirectUrl ?? null },
        },
        { status: failure.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    await setSessionCookie(result.session, { notAfter: result.demoExpiresAt });

    await recordAuditLog({
      userId: result.session.userId,
      action: result.firstLogin ? "DEMO_FIRST_LOGIN" : "MAGIC_LINK_LOGIN",
      entity: "leads",
      recordId: result.leadId,
      newValue: { demoExpiresAt: result.demoExpiresAt.toISOString() },
      ipAddress,
      userAgent,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Autentikasi berhasil.",
        data: { redirectUrl: "/demo", demoExpiresAt: result.demoExpiresAt.toISOString() },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    // Token mentah tidak pernah diteruskan ke query (hanya hash-nya), jadi aman dicatat apa adanya.
    console.error("Magic link consume error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Terjadi kesalahan saat memverifikasi tautan. Silakan coba lagi." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
