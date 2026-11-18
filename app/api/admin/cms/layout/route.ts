import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import {
  CmsLayoutError,
  getAllPageLayoutsForAdmin,
  savePageHero,
  savePageLayout,
  savePageSectionContent,
  savePageSection,
} from "@/lib/models/cms-layout.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/cms/layout
 * Tata letak (urutan, aktif/nonaktif, teks header, section kustom) + hero setiap halaman publik.
 */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const pages = await getAllPageLayoutsForAdmin();
    return NextResponse.json<ApiResponse>({ success: true, message: "Tata letak halaman dimuat.", data: pages });
  } catch (error) {
    console.error("GET CMS layout error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal memuat tata letak halaman." }, { status: 500 });
  }
}

/**
 * PUT /api/admin/cms/layout
 * Body: { action: "layout", page, sections: [{ key, type, isActive, content? }] }
 *    or { action: "hero", page, badgeId, badgeEn, titleId, titleEn, subtitleId, subtitleEn }
 *    or { action: "content", page, sectionKey, content: { fields, lists } | null, baseUpdatedAt }
 *    or { action: "section", page, sectionKey, header?: {badge/title/subtitle Id/En}, content?: {...} | null, baseUpdatedAt }
 */
export async function PUT(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, message: "Body JSON tidak valid." }, { status: 400 });
  }

  try {
    let result: { path: string } & Record<string, unknown>;
    if (body?.action === "layout") {
      result = await savePageLayout(body, guard.session.userId);
    } else if (body?.action === "hero") {
      result = await savePageHero(body, guard.session.userId);
    } else if (body?.action === "content") {
      result = await savePageSectionContent(body, guard.session.userId);
    } else if (body?.action === "section") {
      result = await savePageSection(body, guard.session.userId);
    } else {
      return NextResponse.json<ApiResponse>({ success: false, message: "Parameter 'action' harus 'layout', 'hero', 'section', atau 'content'." }, { status: 400 });
    }

    try {
      revalidatePath(result.path);
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: body.action === "hero" ? "Hero halaman disimpan." : body.action === "content" || body.action === "section" ? "Konten section disimpan." : "Tata letak halaman disimpan.",
      data: result,
    });
  } catch (error) {
    if (error instanceof CmsLayoutError) {
      return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
    }
    console.error("PUT CMS layout error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal menyimpan tata letak halaman." }, { status: 500 });
  }
}
