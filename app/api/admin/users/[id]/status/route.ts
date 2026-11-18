import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientInfo } from "@/lib/auth-guard";
import { isAdminRole } from "@/lib/auth-secret";
import { recordAuditLog } from "@/lib/models/audit.model";
import { toggleUserStatus, findUserById, UserManagementError } from "@/lib/models/user.model";
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
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

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

    if (isAdminRole(existingUser.roleName) || isAdminRole(existingUser.role)) {
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

    await recordAuditLog({
      userId: session.userId,
      action: "USER_STATUS_CHANGED",
      entity: "User",
      recordId: id,
      newValue: { status: validation.data.status },
      ...getClientInfo(request.headers),
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Status pengguna berhasil diubah menjadi ${validation.data.status === 1 ? "Aktif" : "Nonaktif"}.`,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PATCH user status error:", error);
    if (error instanceof UserManagementError) {
      return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
    }
    // Error lain (mis. Prisma) tidak diteruskan ke klien.
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal mengubah status pengguna." }, { status: 500 });
  }
}

