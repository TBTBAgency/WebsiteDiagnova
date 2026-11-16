import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/models/audit.model";
import { requireAdmin } from "@/lib/authz";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/admin/audit-logs?action=&entity=&recordId=&limit= (maks 500, terbaru dulu). Hanya baca. */
export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const sp = new URL(request.url).searchParams;
    const logs = await getAuditLogs({
      action: sp.get("action")?.trim() || undefined,
      entity: sp.get("entity")?.trim() || undefined,
      recordId: sp.get("recordId")?.trim() || undefined,
      limit: Number(sp.get("limit")) || 100,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Data audit trail berhasil dimuat.", data: logs },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Audit log API error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal memuat jejak audit." }, { status: 500 });
  }
}
