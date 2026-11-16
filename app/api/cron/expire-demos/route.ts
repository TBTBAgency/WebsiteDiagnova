import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { expireDemoLeads } from "@/lib/demo-access";
import { recordAuditLog } from "@/lib/models/audit.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean | null {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return null; // fitur nonaktif bila secret belum dikonfigurasi

  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Job terjadwal: lead "Jadwal Demo" yang masa demonya berakhir -> "Selesai".
 *
 * Panggil berkala (mis. tiap 15 menit) dengan header `Authorization: Bearer <CRON_SECRET>`.
 * GET disediakan untuk penjadwal yang hanya mendukung GET (mis. Vercel Cron).
 * Idempoten: aman dipanggil berulang atau bersamaan.
 */
async function handle(request: NextRequest) {
  const auth = isAuthorized(request);
  if (auth === null) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Job expiry belum dikonfigurasi (CRON_SECRET)." },
      { status: 503 }
    );
  }
  if (!auth) {
    return NextResponse.json<ApiResponse>({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const expired = await expireDemoLeads();
    if (expired > 0) {
      await recordAuditLog({
        action: "DEMO_EXPIRED_BATCH",
        entity: "leads",
        newValue: { expired },
      });
    }
    return NextResponse.json<ApiResponse>({
      success: true,
      message: `${expired} permohonan demo ditandai Selesai.`,
      data: { expired },
    });
  } catch (error) {
    console.error("expire-demos job error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Job expiry gagal dijalankan." },
      { status: 500 }
    );
  }
}

export const GET = handle;
export const POST = handle;
