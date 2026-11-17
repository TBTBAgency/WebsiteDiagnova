import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { findUserByEmail, verifyPassword } from "@/lib/models/user.model";
import { recordAuditLog } from "@/lib/models/audit.model";
import { setSessionCookie, removeSessionCookie, getCurrentSession } from "@/lib/auth-session";
import { ApiResponse, AuthSessionPayload } from "@/types";
import { isAdminRole } from "@/lib/auth-secret";
import { getClientInfo } from "@/lib/auth-guard";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS_MESSAGE = "Email atau password yang Anda masukkan salah.";

/**
 * Controller untuk menangani proses login pengguna
 */
export async function loginController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data login tidak valid",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const { ipAddress: clientIp, userAgent } = getClientInfo(request.headers);

    // Batasi percobaan login per IP + email untuk mencegah brute force
    const rateKey = `login:${clientIp}:${email.toLowerCase().trim()}`;
    const rate = checkRateLimit(rateKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
    if (!rate.allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: `Terlalu banyak percobaan login. Silakan coba lagi dalam ${Math.ceil(rate.retryAfterSeconds / 60)} menit.`,
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      // Catat percobaan login gagal (tanpa memberi tahu apakah email terdaftar)
      await recordAuditLog({
        action: "LOGIN_FAILED",
        entity: "User",
        oldValue: { attemptedEmail: email },
        ipAddress: clientIp,
        userAgent,
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: INVALID_CREDENTIALS_MESSAGE,
        },
        { status: 401 }
      );
    }

    const isMatch = user.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
    if (!isMatch) {
      await recordAuditLog({
        userId: user.id,
        action: "LOGIN_FAILED",
        entity: "User",
        recordId: user.id,
        ipAddress: clientIp,
        userAgent,
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: INVALID_CREDENTIALS_MESSAGE,
        },
        { status: 401 }
      );
    }

    if (user.status !== 1) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Akun Anda sedang dinonaktifkan. Silakan hubungi Administrator.",
        },
        { status: 403 }
      );
    }

    // Login password hanya untuk Administrator. Klien demo masuk melalui Magic Link.
    const roleName = typeof user.role === "string" ? user.role : user.roleName || "";
    if (!isAdminRole(roleName)) {
      await recordAuditLog({
        userId: user.id,
        action: "LOGIN_DENIED_NON_ADMIN",
        entity: "User",
        recordId: user.id,
        ipAddress: clientIp,
        userAgent,
      });
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Akun ini tidak memiliki akses ke panel administrasi. Klien demo masuk melalui tautan Magic Link.",
        },
        { status: 403 }
      );
    }

    resetRateLimit(rateKey);

    // Buat session payload
    const sessionPayload: AuthSessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
    };

    await setSessionCookie(sessionPayload);

    // Catat audit login sukses
    await recordAuditLog({
      userId: user.id,
      action: "LOGIN_SUCCESS",
      entity: "User",
      recordId: user.id,
      ipAddress: clientIp,
      userAgent,
    });

    return NextResponse.json<ApiResponse<AuthSessionPayload>>(
      {
        success: true,
        message: "Login berhasil! Selamat datang kembali.",
        data: sessionPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login controller error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server.",
      },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk menangani proses logout pengguna
 */
export async function logoutController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    const { ipAddress: clientIp, userAgent } = getClientInfo(request.headers);

    if (session) {
      await recordAuditLog({
        userId: session.userId,
        action: "LOGOUT",
        entity: "User",
        recordId: session.userId,
        ipAddress: clientIp,
        userAgent,
      });
    }

    await removeSessionCookie();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logout berhasil.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout controller error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Terjadi kesalahan saat logout.",
      },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mengambil informasi sesi aktif pengguna
 */
export async function getMeController(): Promise<NextResponse<ApiResponse>> {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Sesi tidak ditemukan atau telah kedaluwarsa.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json<ApiResponse<AuthSessionPayload>>(
    {
      success: true,
      message: "Sesi valid.",
      data: session,
    },
    { status: 200 }
  );
}
