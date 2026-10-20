import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/models/audit.model";
import { getCurrentSession } from "@/lib/auth-session";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    const logs = await getAuditLogs({ limit: 100 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Data audit trail berhasil dimuat.",
        data: logs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Audit log API error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat jejak audit." },
      { status: 500 }
    );
  }
}
