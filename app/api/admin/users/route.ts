import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
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
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

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
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

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
      { success: false, message: err?.message || "Gagal menambahkan pengguna baru." },
      { status: 500 }
    );
  }
}

