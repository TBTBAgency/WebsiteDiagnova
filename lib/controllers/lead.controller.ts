import { NextRequest, NextResponse } from "next/server";
import {
  getLeadsWithPagination,
  getLeadById,
  updateLeadStatus,
  getLeadMetrics,
  approveLead,
  rejectLead,
  STATUS_LABELS,
} from "@/lib/models/lead.model";
import {
  updateLeadStatusSchema,
  approveLeadSchema,
  rejectLeadSchema,
} from "@/lib/validations";
import { requireAdmin } from "@/lib/auth-guard";
import { sendApprovalNotificationEmail } from "@/lib/email";
import { ApiResponse, InstitutionType, LeadApprovalStatus, LeadFilterQuery } from "@/types";

/**
 * Controller untuk mengambil daftar leads dengan filter, pagination, dan metrik
 */
export async function getLeadsController(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const { searchParams } = new URL(request.url);

    const rawStatus = searchParams.get("status");
    let statusFilter: number | "all" = "all";
    if (rawStatus && rawStatus !== "all") {
      const parsed = parseInt(rawStatus, 10);
      if (!isNaN(parsed)) statusFilter = parsed;
    }

    const rawApproval = searchParams.get("approvalStatus");
    const approvalStatusFilter: LeadApprovalStatus | "all" =
      rawApproval && ["PENDING", "APPROVED", "REJECTED"].includes(rawApproval)
        ? (rawApproval as LeadApprovalStatus)
        : "all";

    const query: LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" } = {
      status: statusFilter,
      approvalStatus: approvalStatusFilter,
      institutionType:
        (searchParams.get("institutionType") as InstitutionType | "all") || "all",
      search: searchParams.get("search") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
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
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
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
 * Controller untuk menyetujui permohonan demo, menyiapkan akun demo, dan membuat Magic Link
 */
export async function approveLeadController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const body = await request.json().catch(() => ({}));
    const validation = approveLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data approval tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { confirmedDemoDate, durationDays } = validation.data;

    const result = await approveLead(id, {
      confirmedDemoDate: confirmedDemoDate || null,
      durationDays: durationDays || 7,
      approvedBy: session.name || "Admin Diagnova",
    });

    // Kirim email notifikasi persetujuan ke pemohon (non-blocking)
    try {
      await sendApprovalNotificationEmail(result.lead, result.magicLinkUrl);
    } catch (e) {
      console.error("Gagal mengirim email notifikasi approval:", e);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Permohonan demo berhasil disetujui untuk ${durationDays} hari. Magic Link telah aktif.`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("approveLeadController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message || "Gagal menyetujui permohonan demo." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk menolak permohonan demo dengan alasan penolakan
 */
export async function rejectLeadController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const body = await request.json().catch(() => ({}));
    const validation = rejectLeadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Alasan penolakan wajib disertakan.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updatedLead = await rejectLead(id, {
      rejectionReason: validation.data.rejectionReason,
      rejectedBy: session.name || "Admin Diagnova",
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Permohonan demo telah ditolak.",
        data: updatedLead,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("rejectLeadController error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message || "Gagal menolak permohonan demo." },
      { status: 500 }
    );
  }
}

/**
 * Controller untuk memperbarui status CRM lead (Baru, Dihubungi, Jadwal Demo, Selesai)
 */
export async function updateLeadStatusController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
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

    const { status, voucherDays, demoDate } = validation.data;
    const updatedLead = await updateLeadStatus(id, status, voucherDays || 3, demoDate);
    const label = STATUS_LABELS[status] || `Status ${status}`;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Status permohonan demo berhasil diubah menjadi ${label}.`,
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
 * Controller untuk mengekspor data leads ke format CSV
 */
export async function exportLeadsCsvController(): Promise<NextResponse> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;
    const { leads } = await getLeadsWithPagination({ limit: 1000 });

    // Escape CSV + cegah formula injection (=, +, -, @, tab, CR) saat dibuka di Excel/Sheets
    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const neutralized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
      const escaped = neutralized.replace(/"/g, '""');
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
      "Status CRM",
      "Status Approval",
      "Jadwal Diajukan",
      "Jadwal Dikonfirmasi",
      "Voucher Demo",
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
      escapeCsv(STATUS_LABELS[l.status] || String(l.status)),
      escapeCsv(l.approvalStatus),
      escapeCsv(l.requestedDemoDate ? new Date(l.requestedDemoDate).toLocaleString("id-ID") : "-"),
      escapeCsv(l.confirmedDemoDate ? new Date(l.confirmedDemoDate).toLocaleString("id-ID") : "-"),
      escapeCsv(l.voucherCode ? `${l.voucherCode} (Berlaku s/d ${l.voucherExpiry ? new Date(l.voucherExpiry).toLocaleDateString("id-ID") : "-"})` : "-"),
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
