import { NextRequest, NextResponse } from "next/server";
import { verifyAndConsumeMagicLink } from "@/lib/magic-link";
import { getClientInfo } from "@/lib/auth-guard";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/magic-link
 * Mengonsumsi token magic link. Hanya dipanggil dari tombol konfirmasi pada halaman
 * /auth/verify-magic-link (form POST), sehingga pembukaan tautan oleh crawler /
 * pemindai email (GET) tidak pernah menghabiskan token.
 */
export async function POST(request: NextRequest) {
  const verifyPage = new URL("/auth/verify-magic-link", request.url);

  // Tolak form lintas situs (login CSRF)
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ success: false, message: "Origin tidak diizinkan." }, { status: 403 });
  }

  const { ipAddress, userAgent } = getClientInfo(request.headers);
  const rate = checkRateLimit(`magic-link:${ipAddress}`, 20, 15 * 60 * 1000);
  if (!rate.allowed) {
    verifyPage.searchParams.set("error", "invalid");
    return NextResponse.redirect(verifyPage, 303);
  }

  let token = "";
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    token = typeof body.token === "string" ? body.token : "";
  } else {
    const form = await request.formData().catch(() => null);
    const value = form?.get("token");
    token = typeof value === "string" ? value : "";
  }

  const result = await verifyAndConsumeMagicLink(token, ipAddress, userAgent);

  if (result.success) {
    return NextResponse.redirect(new URL(result.redirectUrl, request.url), 303);
  }

  if (result.reason === "demo_expired") {
    return NextResponse.redirect(new URL("/demo-expired", request.url), 303);
  }

  verifyPage.searchParams.set("error", result.reason);
  return NextResponse.redirect(verifyPage, 303);
}
