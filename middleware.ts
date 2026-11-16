import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "diagnova_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "diagnova-super-secret-key-production-change-this-2026-xyz"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya periksa rute yang diawali dengan /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let isValidSession = false;
  let sessionPayload: Record<string, any> | null = null;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, JWT_SECRET);
      sessionPayload = payload as Record<string, any>;
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // 1. Cek masa aktif akses demo jika pengguna memiliki batas waktu demoExpiresAt
  if (isValidSession && sessionPayload?.demoExpiresAt) {
    if (Date.now() > new Date(sessionPayload.demoExpiresAt).getTime()) {
      const response = NextResponse.redirect(new URL("/demo-expired", request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  // 2. Proteksi RBAC Ketat: Role USER DILARANG KERAS mengakses seluruh area /admin/*
  if (isValidSession && sessionPayload?.role === "USER") {
    // Pengguna USER tidak memiliki hak akses ke administrasi Diagnova
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Jika membuka halaman login tapi sudah login sebagai ADMIN, redirect langsung ke /admin/dashboard
  if (pathname === "/admin/login") {
    if (isValidSession && (sessionPayload?.role === "ADMIN" || sessionPayload?.role === "Super Admin")) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 4. Jika membuka rute admin lain tapi belum login atau bukan ADMIN, redirect ke login
  if (!isValidSession || (sessionPayload?.role !== "ADMIN" && sessionPayload?.role !== "Super Admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Jika membuka /admin root, redirect ke /admin/dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
