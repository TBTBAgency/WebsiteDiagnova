import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import {
  getAllCmsContent,
  updateCmsSection,
  saveHeroSlide,
  deleteHeroSlide,
  saveComparisonItem,
  deleteComparisonItem,
  saveTestimonial,
  deleteTestimonial,
  savePartner,
  deletePartner,
  saveCmsNavigationMenu,
  deleteCmsNavigationMenu,
  withCmsHubWriteLock,
  CmsHubError,
} from "@/lib/models/cms.model";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types";

/** Pesan aman untuk klien: hanya error domain "tidak ditemukan" yang diteruskan; selain itu generik. */
function safeDomainMessage(error: unknown): string | null {
  return error instanceof Error && /tidak ditemukan/i.test(error.message) && !/prisma|invalid/i.test(error.message)
    ? error.message
    : null;
}


export const dynamic = "force-dynamic";

/**
 * GET /api/admin/cms/homepage
 * Mengambil seluruh data CMS (Homepage, Navigasi, Platform, Solusi, Modul, Nova AI, Integrasi)
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const data = await getAllCmsContent();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Seluruh data CMS berhasil dimuat.",
      data,
    });
  } catch (error) {
    console.error("GET CMS Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data CMS." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/homepage
 * Memperbarui konten section, item, navigasi, atau halaman CMS
 */
export async function PUT(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiResponse>({ success: false, message: "Body JSON tidak valid." }, { status: 400 });
    }
    const { type, sectionKey, action = "save", data } = body || {};

    if (type === "solution_item" || type === "module_item" || type === "integration_item") {
      // Konten halaman dalam kini dikelola di menu Halaman & Section (dan benar-benar tampil di
      // website). Jalur lama ini tidak pernah ditampilkan di website publik dan dinonaktifkan agar
      // tidak ada dua tempat pengeditan.
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Konten halaman Solusi/Modul/Integrasi dikelola di menu Halaman & Section." },
        { status: 410 }
      );
    }
    if (type === "section" && !sectionKey) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Parameter 'sectionKey' wajib disertakan." },
        { status: 400 }
      );
    }
    if (!data || typeof data !== "object") {
      return NextResponse.json<ApiResponse>({ success: false, message: "Parameter 'data' wajib disertakan." }, { status: 400 });
    }

    const handlers: Record<string, () => Promise<any>> = {
      section: () => updateCmsSection(sectionKey, data, session.userId),
      hero_slide: () => (action === "delete" ? deleteHeroSlide(data.id, session.userId) : saveHeroSlide(data, session.userId)),
      comparison_item: () =>
        action === "delete" ? deleteComparisonItem(data.id, session.userId) : saveComparisonItem(data, session.userId),
      testimonial: () => (action === "delete" ? deleteTestimonial(data.id, session.userId) : saveTestimonial(data, session.userId)),
      partner: () => (action === "delete" ? deletePartner(data.id, session.userId) : savePartner(data, session.userId)),
      navigation: () =>
        action === "delete" ? deleteCmsNavigationMenu(data.id, session.userId) : saveCmsNavigationMenu(data, session.userId),
    };
    const handler = handlers[type as string];
    if (!handler) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: `Tipe update '${String(type)}' tidak dikenali.` },
        { status: 400 }
      );
    }

    // Semua penulisan CMS Homepage dijalankan berurutan agar tidak saling menimpa.
    const result = await withCmsHubWriteLock(handler);
    // Revalidate paths agar perubahan langsung tampil
    try {
      revalidatePath("/");
      revalidatePath("/platform");
      revalidatePath("/solutions");
      revalidatePath("/modules");
      revalidatePath("/nova-ai");
      revalidatePath("/integration");
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Konten CMS berhasil disimpan dan diperbarui.",
      data: result,
    });
  } catch (error: any) {
    console.error("PUT CMS Error:", error);
    if (error instanceof CmsHubError) {
      return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
    }
    const domain = safeDomainMessage(error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: domain || "Gagal menyimpan perubahan konten." },
      { status: domain ? 400 : 500 }
    );
  }
}
