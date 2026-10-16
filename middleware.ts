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

  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, JWT_SECRET);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Jika membuka halaman login tapi sudah login, redirect langsung ke /admin/leads
  if (pathname === "/admin/login") {
    if (isValidSession) {
      return NextResponse.redirect(new URL("/admin/leads", request.url));
    }
    return NextResponse.next();
  }

  // Jika membuka rute admin lain tapi belum login, redirect ke login
  if (!isValidSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika membuka /admin root, redirect ke /admin/leads
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/leads", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
