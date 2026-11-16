import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { isAdminRole } from "@/lib/roles";
import { getSessionSecret } from "@/lib/session-secret";

const SESSION_COOKIE_NAME = "diagnova_session";

/**
 * Lapisan pertama otorisasi (Edge). Hanya memeriksa JWT.
 * Setiap route handler admin/LIS tetap memverifikasi ulang status & role ke database
 * melalui `requireAdmin()` di lib/authz.ts.
 */
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Proteksi CSRF lapis kedua (selain cookie SameSite=Lax): request yang mengubah data
 * dengan header Origin dari host lain ditolak.
 */
function isCrossOriginMutation(request: NextRequest): boolean {
  if (SAFE_METHODS.has(request.method)) return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") && isCrossOriginMutation(request)) {
    return NextResponse.json(
      { success: false, message: "Permintaan lintas origin ditolak." },
      { status: 403 }
    );
  }

  // API lain (publik/auth) hanya melalui pemeriksaan origin di atas
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin") && !pathname.startsWith("/api/lis")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let sessionPayload: Record<string, any> | null = null;

  if (sessionCookie) {
    try {
      // getSessionSecret() melempar error di production bila AUTH_SECRET kosong -> sesi dianggap tidak ada
      const { payload } = await jwtVerify(sessionCookie, getSessionSecret());
      sessionPayload = payload as Record<string, any>;
    } catch {
      sessionPayload = null;
    }
  }

  const isAdmin = !!sessionPayload && isAdminRole(sessionPayload.role);

  // ---- API admin & LIS: tolak lebih awal dengan JSON ----
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/lis")) {
    if (!sessionPayload) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Endpoint ini khusus administrator." },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // ---- Halaman /admin ----
  // Sesi non-admin (mis. akun demo) tidak boleh membuka area admin mana pun.
  if (sessionPayload && !isAdmin) {
    const isDemoExpired =
      sessionPayload.demoExpiresAt &&
      Date.now() > new Date(sessionPayload.demoExpiresAt).getTime();

    const target = isDemoExpired
      ? new URL("/demo-expired", request.url)
      : new URL("/admin/login?error=forbidden", request.url);

    if (pathname === "/admin/login" && !isDemoExpired) {
      const response = NextResponse.next();
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    const response = NextResponse.redirect(target);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // Jika membuka halaman login tapi sudah login sebagai admin, redirect ke dashboard
  if (pathname === "/admin/login") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Rute admin lain tanpa sesi -> login
  if (!sessionPayload) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
