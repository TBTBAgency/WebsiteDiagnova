import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";
import {
  getCmsHomepageContent,
  updateCmsSection,
  saveHeroSlide,
  deleteHeroSlide,
  saveComparisonItem,
  deleteComparisonItem,
  saveTestimonial,
  deleteTestimonial,
  savePartner,
  deletePartner,
} from "@/lib/models/cms.model";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/cms/homepage
 * Mengambil seluruh data CMS homepage untuk admin editor
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Hanya Super Admin yang berhak mengelola CMS
    if (session.role !== "Super Admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Fitur CMS khusus untuk Super Admin." },
        { status: 403 }
      );
    }

    const data = await getCmsHomepageContent();

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Data CMS homepage berhasil dimuat.",
      data,
    });
  } catch (error) {
    console.error("GET CMS Homepage Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data CMS homepage." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/homepage
 * Memperbarui konten section, slide, testimonial, komparasi, atau mitra
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    if (session.role !== "Super Admin") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Pengubahan CMS hanya diizinkan bagi Super Admin." },
        { status: 403 }
      );
    }

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
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, message: `Tipe update '${type}' tidak dikenali.` },
        { status: 400 }
      );
    }

    // Revalidate marketing homepage path agar perubahan langsung tampil
    try {
      revalidatePath("/");
    } catch (e) {
      console.warn("revalidatePath warning:", e);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Konten homepage berhasil disimpan dan diperbarui.",
      data: result,
    });
  } catch (error: any) {
    console.error("PUT CMS Homepage Error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message || "Gagal menyimpan perubahan konten." },
      { status: 500 }
    );
  }
}

