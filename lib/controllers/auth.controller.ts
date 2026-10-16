import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { findUserByEmail, verifyPassword } from "@/lib/models/user.model";
import { recordAuditLog } from "@/lib/models/audit.model";
import { setSessionCookie, removeSessionCookie, getCurrentSession } from "@/lib/auth-session";
import { ApiResponse, AuthSessionPayload } from "@/types";

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
    const user = await findUserByEmail(email);

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

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
          message: "Email atau password yang Anda masukkan salah.",
        },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Akun Anda sedang dinonaktifkan. Silakan hubungi Super Admin.",
        },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
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
          message: "Email atau password yang Anda masukkan salah.",
        },
        { status: 401 }
      );
    }

    // Buat session payload
    const sessionPayload: AuthSessionPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

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
