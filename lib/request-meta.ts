import type { NextRequest } from "next/server";

/**
 * Metadata klien untuk audit & pembatasan laju.
 * Catatan: X-Forwarded-For hanya dapat dipercaya bila aplikasi berjalan di belakang reverse proxy
 * yang menimpa header tersebut (lihat dokumentasi deployment).
 */
export function getClientIp(request: NextRequest | Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip")?.trim() || null;
  return ip ? ip.substring(0, 50) : null;
}

export function getUserAgent(request: NextRequest | Request): string | null {
  const ua = request.headers.get("user-agent");
  return ua ? ua.substring(0, 255) : null;
}
