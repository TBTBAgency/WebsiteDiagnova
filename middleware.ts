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

  // Jika sesi adalah Demo User, periksa masa aktif demo dan proteksi RBAC
  if (isValidSession && sessionPayload?.role === "Demo User") {
    // 1. Cek apakah masa aktif demo telah kedaluwarsa
    if (
      sessionPayload.demoExpiresAt &&
      Date.now() > new Date(sessionPayload.demoExpiresAt).getTime()
    ) {
      const response = NextResponse.redirect(new URL("/demo-expired", request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // 2. Proteksi RBAC: Demo User dilarang membuka Pengguna (Users), CMS, atau Audit Logs
    if (
      pathname.startsWith("/admin/users") ||
      pathname.startsWith("/admin/cms") ||
      pathname.startsWith("/admin/audit-logs")
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Jika membuka halaman login tapi sudah login, redirect langsung ke /admin/dashboard
  if (pathname === "/admin/login") {
    if (isValidSession) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Jika membuka rute admin lain tapi belum login, redirect ke login
  if (!isValidSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika membuka /admin root, redirect ke /admin/dashboard
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
