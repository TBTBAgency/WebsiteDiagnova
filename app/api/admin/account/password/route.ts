import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getClientInfo, requireAdmin } from "@/lib/auth-guard";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/models/audit.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(128),
});

/** Kode error stabil agar UI bisa menampilkan pesan dalam bahasa yang dipilih admin. */
type ErrorCode = "INVALID_INPUT" | "TOO_SHORT" | "SAME_AS_OLD" | "WRONG_CURRENT" | "RATE_LIMITED" | "NOT_FOUND" | "SERVER_ERROR";

function fail(code: ErrorCode, message: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json<ApiResponse>({ success: false, message, errors: { code: [code] } }, { status, headers });
}

/**
 * POST /api/admin/account/password
 * Admin yang sedang login mengganti kata sandinya sendiri.
 * Body: { currentPassword, newPassword }. Kata sandi tidak pernah dicatat di log/audit.
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const userId = guard.session.userId;
    const { ipAddress, userAgent } = getClientInfo(request.headers);

    const rateKey = `change-password:${userId}`;
    const rate = checkRateLimit(rateKey, MAX_ATTEMPTS, WINDOW_MS);
    if (!rate.allowed) {
      return fail(
        "RATE_LIMITED",
        `Terlalu banyak percobaan. Silakan coba lagi dalam ${Math.ceil(rate.retryAfterSeconds / 60)} menit.`,
        429,
        { "Retry-After": String(rate.retryAfterSeconds) }
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const tooShort = typeof body?.newPassword === "string" && body.newPassword.length < 12;
      return tooShort
        ? fail("TOO_SHORT", "Kata sandi baru minimal 12 karakter.", 400)
        : fail("INVALID_INPUT", "Data tidak valid.", 400);
    }
    const { currentPassword, newPassword } = parsed.data;

    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, passwordHash: true } });
    if (!user?.passwordHash) return fail("NOT_FOUND", "Akun tidak ditemukan.", 404);

    const currentOk = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!currentOk) {
      await recordAuditLog({
        userId,
        action: "PASSWORD_CHANGE_FAILED",
        entity: "User",
        recordId: userId,
        ipAddress,
        userAgent,
      });
      return fail("WRONG_CURRENT", "Kata sandi saat ini salah.", 400);
    }
    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      return fail("SAME_AS_OLD", "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.user.update({ where: { id: userId }, data: { passwordHash } });
    resetRateLimit(rateKey);

    await recordAuditLog({
      userId,
      action: "PASSWORD_CHANGED",
      entity: "User",
      recordId: userId,
      ipAddress,
      userAgent,
    });

    return NextResponse.json<ApiResponse>({ success: true, message: "Kata sandi berhasil diganti." });
  } catch (error) {
    console.error("Change password error:", error instanceof Error ? error.message : error);
    return fail("SERVER_ERROR", "Terjadi kesalahan saat mengganti kata sandi.", 500);
  }
}
