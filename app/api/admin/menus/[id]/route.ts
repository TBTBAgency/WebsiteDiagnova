import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { updateMenu, deleteMenu } from "@/lib/models/menu.model";
import { ApiResponse } from "@/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

const updateMenuSchema = z.object({
  labelId: z.string().min(1, "Label Bahasa Indonesia wajib diisi").optional(),
  labelEn: z.string().min(1, "Label Bahasa Inggris wajib diisi").optional(),
  url: z.string().optional().nullable(),
  sectionId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  iconName: z.string().optional().nullable(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

/**
 * PUT /api/admin/menus/[id]
 * Memperbarui data menu (Hanya role ADMIN)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const { id } = params;
    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "ID menu tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = updateMenuSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data pembaruan menu tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updated = await updateMenu(id, validation.data, session.userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Menu berhasil diperbarui.",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PUT admin menu error:", error);
    const err = error as { message?: string };
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal memperbarui menu." },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/menus/[id]
 * Menghapus menu (Soft delete) (Hanya role ADMIN)
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const { id } = params;
    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "ID menu tidak valid." },
        { status: 400 }
      );
    }

    const deleted = await deleteMenu(id, session.userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Menu berhasil dihapus.",
      data: deleted,
    });
  } catch (error: unknown) {
    console.error("DELETE admin menu error:", error);
    const err = error as { message?: string };
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal menghapus menu." },
      { status: 400 }
    );
  }
}

