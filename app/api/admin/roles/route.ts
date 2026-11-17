import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { getAllRoles } from "@/lib/models/user.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/roles
 * Mengambil daftar roles dari tabel Role
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const roles = await getAllRoles();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Daftar role berhasil dimuat.",
      data: roles,
    });
  } catch (error) {
    console.error("GET roles error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data role." },
      { status: 500 }
    );
  }
}

