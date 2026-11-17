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
  saveSolutionItem,
  deleteSolutionItem,
  saveModuleItem,
  deleteModuleItem,
  saveIntegrationItem,
  deleteIntegrationItem,
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

    const body = await request.json();
    const { type, sectionKey, action = "save", data } = body;

    let result: any = null;

    if (type === "section") {
      if (!sectionKey) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "Parameter 'sectionKey' wajib disertakan." },
          { status: 400 }
        );
      }
      result = await updateCmsSection(sectionKey, data, session.userId);
    } else if (type === "hero_slide") {
      if (action === "delete") {
        result = await deleteHeroSlide(data.id, session.userId);
      } else {
        result = await saveHeroSlide(data, session.userId);
      }
    } else if (type === "comparison_item") {
      if (action === "delete") {
        result = await deleteComparisonItem(data.id, session.userId);
      } else {
        result = await saveComparisonItem(data, session.userId);
      }
    } else if (type === "testimonial") {
      if (action === "delete") {
        result = await deleteTestimonial(data.id, session.userId);
      } else {
        result = await saveTestimonial(data, session.userId);
      }
    } else if (type === "partner") {
      if (action === "delete") {
        result = await deletePartner(data.id, session.userId);
      } else {
        result = await savePartner(data, session.userId);
      }
    } else if (type === "navigation") {
      if (action === "delete") {
        result = await deleteCmsNavigationMenu(data.id, session.userId);
      } else {
        result = await saveCmsNavigationMenu(data, session.userId);
      }
    } else if (type === "solution_item") {
      if (action === "delete") {
        result = await deleteSolutionItem(data.slug, session.userId);
      } else {
        result = await saveSolutionItem(data, session.userId);
      }
    } else if (type === "module_item") {
      if (action === "delete") {
        result = await deleteModuleItem(data.slug, session.userId);
      } else {
        result = await saveModuleItem(data, session.userId);
      }
    } else if (type === "integration_item") {
      if (action === "delete") {
        result = await deleteIntegrationItem(data.slug, session.userId);
      } else {
        result = await saveIntegrationItem(data, session.userId);
      }
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, message: `Tipe update '${type}' tidak dikenali.` },
        { status: 400 }
      );
    }

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
    const domain = safeDomainMessage(error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: domain || "Gagal menyimpan perubahan konten." },
      { status: domain ? 400 : 500 }
    );
  }
}
