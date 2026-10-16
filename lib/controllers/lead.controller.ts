import { NextRequest, NextResponse } from "next/server";
import {
  getLeadsWithPagination,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  getLeadMetrics,
} from "@/lib/models/lead.model";
import { updateLeadStatusSchema, addLeadNoteSchema } from "@/lib/validations";
import { getCurrentSession } from "@/lib/auth-session";
import { ApiResponse, InstitutionType, LeadFilterQuery, LeadStatus } from "@/types";

/**
 * Controller untuk mengambil daftar leads dengan filter, pagination, dan metrik
 */
export async function getLeadsController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak. Sesi tidak valid." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const query: LeadFilterQuery = {
      status: (searchParams.get("status") as LeadStatus | "all") || "all",
      institutionType:
        (searchParams.get("institutionType") as InstitutionType | "all") || "all",
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10,
    };

    const [paginatedData, metrics] = await Promise.all([
      getLeadsWithPagination(query),
      getLeadMetrics(),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Data leads berhasil dimuat.",
        data: {
          ...paginatedData,
          metrics,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getLeadsController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat data permohonan demo." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mengambil detail lead tunggal
 */
export async function getLeadDetailController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Data lead tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Detail lead berhasil dimuat.",
        data: lead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getLeadDetailController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memuat detail lead." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk memperbarui status lead & menambahkan catatan
 */
export async function updateLeadStatusController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateLeadStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data pembaruan status tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, note } = validation.data;
    const updatedLead = await updateLeadStatus(id, status, session.userId, note);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Status permohonan demo berhasil diubah menjadi ${status.toUpperCase()}.`,
        data: updatedLead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("updateLeadStatusController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal memperbarui status lead." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk menambahkan catatan tindak lanjut sales pada lead
 */
export async function addLeadNoteController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Akses ditolak." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = addLeadNoteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Isi catatan tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const note = await addLeadNote(id, validation.data.content, session.userId);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Catatan tindak lanjut berhasil ditambahkan.",
        data: note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("addLeadNoteController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Gagal menambahkan catatan." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk mengekspor data leads ke format CSV
 */
export async function exportLeadsCsvController(): Promise<NextResponse> {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { leads } = await getLeadsWithPagination({ limit: 1000 });

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const headers = [
      "ID",
      "Tanggal Masuk",
      "Nama Lengkap",
      "Institusi / RS",
      "Jabatan",
      "Email",
      "No. Telepon / WA",
      "Jenis Institusi",
      "Status",
      "Catatan Kebutuhan",
    ];

    const rows = leads.map((l) => [
      escapeCsv(l.id),
      escapeCsv(new Date(l.createdAt).toLocaleString("id-ID")),
      escapeCsv(l.name),
      escapeCsv(l.institution),
      escapeCsv(l.jobTitle),
      escapeCsv(l.email),
      escapeCsv(l.phone),
      escapeCsv(l.institutionType),
      escapeCsv(l.status.toUpperCase()),
      escapeCsv(l.notes),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="diagnova_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("exportLeadsCsvController error:", error);
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
