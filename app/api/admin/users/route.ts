import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientInfo } from "@/lib/auth-guard";
import { recordAuditLog } from "@/lib/models/audit.model";
import { getAllUsers, createUser } from "@/lib/models/user.model";
import { createUserSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Mengambil daftar seluruh pengguna dengan role USER.
 * Sesuai arsitektur Diagnova: Akun ADMIN tidak pernah dikembalikan ke antarmuka Manajemen Pengguna.
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    // Server-side filter: Hanya role USER
    const users = await getAllUsers("USER");

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Daftar pengguna (USER) berhasil dimuat.",
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
 * Menambahkan user baru.
 * Sesuai arsitektur Diagnova: Pembuatan akun dari Manajemen Pengguna selalu menetapkan role USER.
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

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

    // Cari role USER di database
    const userRole = await db.role.findFirst({
      where: { name: "USER" },
    });

    if (!userRole) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Sistem error: Role USER tidak ditemukan di database." },
        { status: 500 }
      );
    }

    // Force role USER - abaikan atau override input apapun dari client
    const newUser = await createUser({
      name: validation.data.name,
      email: validation.data.email,
      institution: validation.data.institution,
      jobTitle: validation.data.jobTitle,
      phone: validation.data.phone,
      roleId: userRole.id,
      status: validation.data.status,
      demoDurationDays: validation.data.demoDurationDays,
    });

    await recordAuditLog({
      userId: session.userId,
      action: "USER_CREATED",
      entity: "User",
      recordId: newUser.id,
      newValue: { email: newUser.email, role: newUser.roleName, status: newUser.status },
      ...getClientInfo(request.headers),
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Pengguna baru (USER) berhasil ditambahkan.",
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
      { success: false, message: "Gagal menambahkan pengguna baru." },
      { status: 500 }
    );
  }
}
