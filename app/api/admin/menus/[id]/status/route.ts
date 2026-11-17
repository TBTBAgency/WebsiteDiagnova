import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { toggleMenuStatus } from "@/lib/models/menu.model";
import { ApiResponse } from "@/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

const toggleStatusSchema = z.object({
  isActive: z.boolean(),
});

/**
 * PATCH /api/admin/menus/[id]/status
 * Mengubah status aktif/nonaktif menu (Hanya role ADMIN)
 */
export async function PATCH(request: NextRequest, { params }: Params) {
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
    const validation = toggleStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Nilai status isActive (boolean) wajib disertakan." },
        { status: 400 }
      );
    }

    const updated = await toggleMenuStatus(id, validation.data.isActive, session.userId);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: `Status menu berhasil diubah menjadi ${validation.data.isActive ? "Aktif" : "Nonaktif"}.`,
      data: updated,
    });
  } catch (error: unknown) {
    console.error("PATCH admin menu status error:", error);
    const err = error as { message?: string };
    return NextResponse.json<ApiResponse>(
      { success: false, message: err?.message || "Gagal mengubah status menu." },
      { status: 500 }
    );
  }
}

