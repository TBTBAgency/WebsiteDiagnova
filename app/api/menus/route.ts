import { NextResponse } from "next/server";
import { getPublicCmsNavigationMenus } from "@/lib/models/cms.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/menus
 * Mengambil menu navigasi website publik yang aktif dari CmsSection.extraContent.navigation
 */
export async function GET() {
  try {
    const menus = await getPublicCmsNavigationMenus();
    // Berikan properti children dan submenus untuk kompatibilitas penuh
    const mapped = menus.map((m) => ({
      ...m,
      children: m.submenus,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Menu navigasi publik CMS berhasil dimuat.",
      data: mapped,
    });
  } catch (error) {
    console.error("GET public menus error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat menu navigasi." },
      { status: 500 }
    );
  }
}
