import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { updateUser, deleteUser, findUserById } from "@/lib/models/user.model";
import { updateUserSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

/**
 * PUT /api/admin/users/[id]
 * Memperbarui data pengguna ber-role USER.
 * Melarang perubahan pada akun ADMIN melalui endpoint ini.
 */
export async function PUT(request: NextRequest, { params }: Params) {
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

    // Periksa apakah target akun adalah ADMIN
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
          message: "Akses ditolak: Akun Administrator dilindungi dan tidak dapat diubah melalui Manajemen Pengguna.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data pembaruan tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await updateUser(id, validation.data);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PUT user error:", error);
    const err = error as { message?: string };
    const status = err?.message?.includes("Akses ditolak") ? 403 : 500;
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal memperbarui data pengguna." },
      { status }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Menghapus akun ber-role USER.
 * Melindungi akun ADMIN agar tidak bisa dihapus.
 */
export async function DELETE(request: NextRequest, { params }: Params) {
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

    // Periksa apakah target akun adalah ADMIN
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
          message: "Akses ditolak: Akun Administrator dilindungi dan tidak dapat dihapus.",
        },
        { status: 403 }
      );
    }

    const deleted = await deleteUser(id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Pengguna berhasil dihapus.",
      data: deleted,
    });
  } catch (error: unknown) {
    console.error("DELETE user error:", error);
    const err = error as { message?: string };
    const status = err?.message?.includes("Akses ditolak") ? 403 : 500;
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal menghapus pengguna." },
      { status }
    );
  }
}

