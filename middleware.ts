import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { isAdminRole } from "@/lib/roles";
import { getSessionSecret } from "@/lib/session-secret";
import { getAdminLoginPath, getEffectiveAdminLoginPath, isAdminAreaPath } from "@/lib/admin-route";

const SESSION_COOKIE_NAME = "diagnova_session";
const NO_INDEX = "noindex, nofollow, noarchive";

/** 404 yang identik dengan halaman tidak dikenal (rewrite ke path yang tidak ada). */
function notFound(request: NextRequest): NextResponse {
  const response = NextResponse.rewrite(new URL("/_halaman-tidak-ditemukan", request.url));
  response.headers.set("X-Robots-Tag", NO_INDEX);
  return response;
}

function noIndex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", NO_INDEX);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

async function readSession(request: NextRequest): Promise<Record<string, any> | null> {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;
  try {
    // getSessionSecret() melempar error di production bila AUTH_SECRET kosong -> sesi dianggap tidak ada
    const { payload } = await jwtVerify(sessionCookie, getSessionSecret());
    return payload as Record<string, any>;
  } catch {
    return null;
  }
}

/**
 * Lapisan pertama otorisasi (Edge). Hanya memeriksa JWT.
 * Setiap route handler admin/LIS tetap memverifikasi ulang status & role ke database
 * melalui `requireAdmin()` di lib/authz.ts.
 *
 * Area admin disembunyikan: selain ADMIN, seluruh /admin/* menghasilkan 404 biasa dan halaman login
 * hanya tersedia di path rahasia ADMIN_LOGIN_PATH (lihat lib/admin-route.ts).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---- Halaman login admin lewat path rahasia (ADMIN_LOGIN_PATH) ----
  const secretLoginPath = getAdminLoginPath();
  if (secretLoginPath && pathname === secretLoginPath) {
    const session = await readSession(request);
    if (session && isAdminRole(session.role)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return noIndex(NextResponse.rewrite(new URL("/admin/login", request.url)));
  }

  // ---- Area /admin: hanya ADMIN yang tahu area ini ada; selain itu 404 biasa ----
  if (isAdminAreaPath(pathname)) {
    const session = await readSession(request);
    const isAdmin = !!session && isAdminRole(session.role);

    if (pathname === "/admin/login") {
      // Diakses langsung: hanya berlaku bila path rahasia tidak dikonfigurasi (development)
      if (getEffectiveAdminLoginPath() !== "/admin/login") return notFound(request);
      if (isAdmin) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      return noIndex(NextResponse.next());
    }

    // Anonim, akun demo, sesi kedaluwarsa/palsu -> 404 (tanpa redirect ke login, tanpa petunjuk)
    if (!isAdmin) return notFound(request);

    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return noIndex(NextResponse.next());
  }

  // ---- API admin & LIS: tolak lebih awal dengan JSON ----
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/lis")) {
    const session = await readSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }
    if (!isAdminRole(session.role)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Endpoint ini khusus administrator." },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Semua halaman kecuali aset statis: path login rahasia berasal dari env sehingga tidak dapat
  // dicantumkan di matcher statis. Rute publik keluar lebih awal tanpa verifikasi JWT.
  matcher: ["/((?!_next/static|_next/image|images/|favicon.ico).*)"],
};
