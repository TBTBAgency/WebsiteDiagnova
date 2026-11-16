import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { loginSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { findUserByEmail, verifyPassword } from "@/lib/models/user.model";
import { recordAuditLog } from "@/lib/models/audit.model";
import { isAdminRole } from "@/lib/roles";
import { setSessionCookie, removeSessionCookie, getCurrentSession } from "@/lib/auth-session";
import { getClientIp, getUserAgent } from "@/lib/request-meta";
import { countRecentAuditEvents, LOGIN_LIMITS } from "@/lib/rate-limit";
import { ApiResponse, AuthSessionPayload } from "@/types";

const INVALID_CREDENTIALS = "Email atau password yang Anda masukkan salah.";
const TOO_MANY_ATTEMPTS =
  "Terlalu banyak percobaan login gagal. Silakan coba lagi dalam 15 menit.";

// Hash acak untuk menyamakan waktu respons saat email tidak terdaftar (mencegah enumerasi akun via timing)
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), 10);

function json(body: ApiResponse, status: number) {
  return NextResponse.json<ApiResponse>(body, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Login ADMIN via email & password.
 * Urutan: validasi → batas laju IP → batas laju akun → verifikasi password → status akun → role.
 * Status akun & role baru diungkapkan setelah password terbukti benar.
 */
export async function loginController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json().catch(() => null);
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return json(
        { success: false, message: "Data login tidak valid", errors: validation.error.flatten().fieldErrors },
        400
      );
    }

    const { email, password } = validation.data;
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    if (ipAddress) {
      const ipFailures = await countRecentAuditEvents({
        actions: ["LOGIN_FAILED"],
        windowMs: LOGIN_LIMITS.windowMs,
        ipAddress,
      });
      if (ipFailures >= LOGIN_LIMITS.maxFailuresPerIp) {
        await recordAuditLog({ action: "LOGIN_RATE_LIMITED", entity: "User", newValue: { scope: "ip" }, ipAddress, userAgent });
        return json({ success: false, message: TOO_MANY_ATTEMPTS }, 429);
      }
    }

    const user = await findUserByEmail(email);

    if (user) {
      const accountFailures = await countRecentAuditEvents({
        actions: ["LOGIN_FAILED"],
        windowMs: LOGIN_LIMITS.windowMs,
        recordId: user.id,
      });
      if (accountFailures >= LOGIN_LIMITS.maxFailuresPerAccount) {
        await recordAuditLog({
          userId: user.id,
          action: "LOGIN_RATE_LIMITED",
          entity: "User",
          recordId: user.id,
          newValue: { scope: "account" },
          ipAddress,
          userAgent,
        });
        return json({ success: false, message: TOO_MANY_ATTEMPTS }, 429);
      }
    }

    let passwordOk = false;
    if (user?.passwordHash) {
      passwordOk = await verifyPassword(password, user.passwordHash);
    } else {
      await bcrypt.compare(password, DUMMY_HASH); // hasil diabaikan; hanya menyamakan waktu respons
    }

    if (!user || !passwordOk) {
      await recordAuditLog({
        userId: user?.id ?? null,
        action: "LOGIN_FAILED",
        entity: "User",
        recordId: user?.id ?? null,
        oldValue: user ? null : { attemptedEmail: email.toLowerCase().trim() },
        ipAddress,
        userAgent,
      });
      return json({ success: false, message: INVALID_CREDENTIALS }, 401);
    }

    if (user.status !== "ACTIVE" || user.deletedAt) {
      await recordAuditLog({ userId: user.id, action: "LOGIN_DENIED_INACTIVE", entity: "User", recordId: user.id, ipAddress, userAgent });
      return json({ success: false, message: "Akun Anda sedang dinonaktifkan. Silakan hubungi administrator." }, 403);
    }

    // Hanya ADMIN yang boleh login ke dashboard via password
    if (!isAdminRole(user.roleCode)) {
      await recordAuditLog({ userId: user.id, action: "LOGIN_DENIED_ROLE", entity: "User", recordId: user.id, ipAddress, userAgent });
      return json({ success: false, message: "Akun ini tidak memiliki akses ke dashboard admin." }, 403);
    }

    const sessionPayload: AuthSessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: "ADMIN",
      roleName: user.roleName ?? null,
    };

    await setSessionCookie(sessionPayload);
    await recordAuditLog({ userId: user.id, action: "LOGIN_SUCCESS", entity: "User", recordId: user.id, ipAddress, userAgent });

    return NextResponse.json<ApiResponse<AuthSessionPayload>>(
      { success: true, message: "Login berhasil! Selamat datang kembali.", data: sessionPayload },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Login controller error:", error);
    return json({ success: false, message: "Terjadi kesalahan internal pada server." }, 500);
  }
}

/**
 * Logout: menghapus cookie sesi. JWT bersifat stateless; akses tetap diputus oleh pemeriksaan DB
 * di setiap request admin (`requireAdmin`) dan halaman demo.
 */
export async function logoutController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    if (session) {
      await recordAuditLog({
        userId: session.userId,
        action: "LOGOUT",
        entity: "User",
        recordId: session.userId,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
      });
    }

    await removeSessionCookie();
    return json({ success: true, message: "Logout berhasil." }, 200);
  } catch (error) {
    console.error("Logout controller error:", error);
    return json({ success: false, message: "Terjadi kesalahan saat logout." }, 500);
  }
}

/**
 * Informasi sesi aktif. Status & role dibaca ulang dari database (bukan hanya dari JWT).
 */
export async function getMeController(): Promise<NextResponse<ApiResponse>> {
  const session = await getCurrentSession();

  if (!session?.userId) {
    return json({ success: false, message: "Sesi tidak ditemukan atau telah kedaluwarsa." }, 401);
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, status: true, deletedAt: true, role: { select: { name: true, code: true } } },
  });

  if (!user || user.status !== "ACTIVE" || user.deletedAt || !user.role?.code) {
    await removeSessionCookie();
    return json({ success: false, message: "Sesi tidak valid atau akun telah dinonaktifkan." }, 401);
  }

  const data: AuthSessionPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role.code,
    roleName: user.role.name,
  };

  return NextResponse.json<ApiResponse<AuthSessionPayload>>(
    { success: true, message: "Sesi valid.", data },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
