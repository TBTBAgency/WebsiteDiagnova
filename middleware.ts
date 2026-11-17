import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret, isAdminRole } from "@/lib/auth-secret";

const SESSION_COOKIE_NAME = "diagnova_session";

async function readSession(request: NextRequest): Promise<Record<string, any> | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, getJwtSecret());
    return payload as Record<string, any>;
  } catch {
    return null;
  }
}

function isDemoExpired(session: Record<string, any> | null): boolean {
  return Boolean(
    session?.demoExpiresAt && Date.now() > new Date(session.demoExpiresAt).getTime()
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  // API admin: lapisan pertama (cek JWT + role). Route handler tetap memverifikasi ulang ke database.
  if (pathname.startsWith("/api/admin")) {
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Sesi tidak valid atau telah berakhir." },
        { status: 401 }
      );
    }
    if (!isAdminRole(session.role)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Hanya Administrator yang dapat mengakses sumber daya ini." },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // 1. Sesi demo yang sudah kedaluwarsa dihapus (kedaluwarsa TIDAK mengubah status lead).
  if (session && isDemoExpired(session)) {
    const response = NextResponse.redirect(new URL("/demo-expired", request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  const isAdmin = session !== null && isAdminRole(session.role);

  // 2. Halaman login: admin yang sudah login langsung ke dashboard.
  if (pathname === "/admin/login") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 3. Selain ADMIN (termasuk role USER / klien demo) tidak boleh masuk area /admin.
  if (!isAdmin) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
