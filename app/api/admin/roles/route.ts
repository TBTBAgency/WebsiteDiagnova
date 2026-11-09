import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { getAllRoles } from "@/lib/models/user.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/roles
 * Mengambil daftar roles dari tabel Role
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

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

