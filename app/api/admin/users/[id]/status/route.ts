import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import { toggleUserStatus, findUserById } from "@/lib/models/user.model";
import { ApiResponse } from "@/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

const updateStatusSchema = z.object({
  status: z.coerce.number().min(0).max(1),
});

/**
 * PATCH /api/admin/users/[id]/status
 * Mengubah status aktif / nonaktif akun ber-role USER (1: Aktif, 0: Nonaktif).
 * Melarang pengubahan status pada akun ADMIN.
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Hanya Administrator yang berhak mengubah status akun." },
        { status: 403 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "ID pengguna tidak valid." },
        { status: 400 }
      );
    }

    // Periksa target akun
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    if (existingUser.roleName === "ADMIN" || existingUser.role === "ADMIN") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Akses ditolak: Akun Administrator dilindungi dan statusnya tidak dapat diubah.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Status tidak valid. Nilai harus 1 (Aktif) atau 0 (Nonaktif)." },
        { status: 400 }
      );
    }

    const updated = await toggleUserStatus(id, validation.data.status);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Status pengguna berhasil diubah menjadi ${validation.data.status === 1 ? "Aktif" : "Nonaktif"}.`,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PATCH user status error:", error);
    const err = error as { message?: string };
    const status = err?.message?.includes("Akses ditolak") ? 403 : 500;
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal mengubah status pengguna." },
      { status }
    );
  }
}

