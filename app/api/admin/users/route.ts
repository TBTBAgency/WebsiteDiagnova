import { NextRequest, NextResponse } from "next/server";
import { publicErrorMessage } from "@/lib/errors";
import { requireAdmin } from "@/lib/authz";
import { isAdminRole } from "@/lib/roles";
import { db } from "@/lib/db";
import { getAllUsers, createUser } from "@/lib/models/user.model";
import { createUserSchema } from "@/lib/validations";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Mengambil daftar seluruh pengguna
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const users = await getAllUsers();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Daftar pengguna berhasil dimuat.",
      data: users,
    });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data pengguna." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Menambahkan user baru
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data user tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Role target wajib ada dan tidak boleh role administrator (dicek di server, bukan dari UI)
    const targetRole = await db.role.findUnique({
      where: { id: validation.data.roleId },
      select: { name: true },
    });
    if (!targetRole) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Role tidak ditemukan." },
        { status: 400 }
      );
    }
    if (isAdminRole(targetRole.name)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akun administrator tidak dapat dibuat melalui User Management." },
        { status: 403 }
      );
    }

    const newUser = await createUser(validation.data);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Pengguna baru berhasil ditambahkan.",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST user error:", error);
    const err = error as { code?: string; message?: string };
    if (err?.code === "P2002") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Alamat email sudah terdaftar." },
        { status: 400 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: false, message: publicErrorMessage(error, "Gagal menambahkan pengguna baru.") },
      { status: 500 }
    );
  }
}

