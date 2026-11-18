import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-guard";
import { SiteContentError, getSiteContentForAdmin, saveSiteContent } from "@/lib/models/site-content.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/** GET /api/admin/cms/site — Footer, FAQ, dan Announcement (tersimpan atau bawaan). */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    return NextResponse.json<ApiResponse>({ success: true, message: "Konten global dimuat.", data: await getSiteContentForAdmin() });
  } catch (error) {
    console.error("GET site content error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal memuat konten global." }, { status: 500 });
  }
}

/** PUT /api/admin/cms/site — body: { type: "footer" | "faq" | "announcement", data } */
export async function PUT(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let body: { type?: unknown; data?: unknown; baseUpdatedAt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiResponse>({ success: false, message: "Body JSON tidak valid." }, { status: 400 });
  }

  try {
    const result = await saveSiteContent(body?.type, body?.data, guard.session.userId, body?.baseUpdatedAt);
    try {
      // Footer & announcement ada di layout semua halaman publik; FAQ di homepage.
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }
    return NextResponse.json<ApiResponse>({ success: true, message: "Konten disimpan. Website diperbarui.", data: result });
  } catch (error) {
    if (error instanceof SiteContentError) {
      return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
    }
    console.error("PUT site content error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal menyimpan konten." }, { status: 500 });
  }
}
