import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { getAllAdminMenus, createMenu } from "@/lib/models/menu.model";
import { ApiResponse } from "@/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const menuSchema = z.object({
  labelId: z.string().min(1, "Label Bahasa Indonesia wajib diisi"),
  labelEn: z.string().min(1, "Label Bahasa Inggris wajib diisi"),
  url: z.string().optional().nullable(),
  sectionId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  sortOrder: z.coerce.number().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

/**
 * GET /api/admin/menus
 * Mengambil seluruh menu untuk dashboard admin (Hanya role ADMIN)
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const menus = await getAllAdminMenus();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Daftar menu berhasil dimuat.",
      data: menus,
    });
  } catch (error) {
    console.error("GET admin menus error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat daftar menu." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/menus
 * Menambahkan menu baru (Hanya role ADMIN)
 */
export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const body = await request.json();
    const validation = menuSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data menu tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newMenu = await createMenu(validation.data, session.userId);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Menu baru berhasil ditambahkan.",
        data: newMenu,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST admin menu error:", error);
    const err = error as { message?: string };
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal menambahkan menu baru." },
      { status: 400 }
    );
  }
}

