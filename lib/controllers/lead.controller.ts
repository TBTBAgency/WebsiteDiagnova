import { NextRequest, NextResponse } from "next/server";
import {
  getLeadsWithPagination,
  getLeadById,
  updateLeadStatus,
  getLeadMetrics,
  approveLead,
  rejectLead,
  completeLead,
  extendDemoAccess,
  getLeadHistory,
  LeadWorkflowError,
  LEAD_STATUS,
  STATUS_LABELS,
} from "@/lib/models/lead.model";
import {
  updateLeadStatusSchema,
  approveLeadSchema,
  rejectLeadSchema,
  extendDemoAccessSchema,
} from "@/lib/validations";
import { requireAdmin, getClientInfo } from "@/lib/auth-guard";
import { recordAuditLog } from "@/lib/models/audit.model";
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
 * Memetakan error domain workflow ke respons HTTP yang tepat (4xx), selain itu 500.
 */
function workflowErrorResponse(error: unknown, fallbackMessage: string): NextResponse<ApiResponse> {
  if (error instanceof LeadWorkflowError) {
    return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
  }
  console.error(fallbackMessage, error);
  return NextResponse.json<ApiResponse>({ success: false, message: fallbackMessage }, { status: 500 });
}

/**
 * Controller untuk menyetujui permohonan demo, menyiapkan akun demo, dan membuat Magic Link.
 * Status pipeline lead tidak diubah (Jadwal Demo baru terjadi setelah klien login pertama).
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
    const before = await getLeadById(id);

    const result = await approveLead(id, {
      confirmedDemoDate: confirmedDemoDate || null,
      durationDays: durationDays || 7,
      approvedBy: session.name || "Admin Diagnova",
    });

    const { ipAddress, userAgent } = getClientInfo(request.headers);
    await recordAuditLog({
      userId: session.userId,
      action: before?.approvalStatus === "APPROVED" ? "MAGIC_LINK_REISSUED" : "LEAD_APPROVED",
      entity: "Lead",
      recordId: id,
      oldValue: before ? { approvalStatus: before.approvalStatus } : undefined,
      newValue: {
        approvalStatus: "APPROVED",
        durationDays,
        confirmedDemoDate: result.lead.confirmedDemoDate,
        magicLinkExpiresAt: result.expiresAt,
      },
      ipAddress,
      userAgent,
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
        message: `Permohonan demo disetujui (akses ${durationDays} hari sejak login pertama). Magic Link berlaku 24 jam.`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal menyetujui permohonan demo.");
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

    const before = await getLeadById(id);
    const updatedLead = await rejectLead(id, {
      rejectionReason: validation.data.rejectionReason,
      rejectedBy: session.name || "Admin Diagnova",
    });

    const { ipAddress, userAgent } = getClientInfo(request.headers);
    await recordAuditLog({
      userId: session.userId,
      action: "LEAD_REJECTED",
      entity: "Lead",
      recordId: id,
      oldValue: before ? { approvalStatus: before.approvalStatus } : undefined,
      newValue: { approvalStatus: "REJECTED", rejectionReason: validation.data.rejectionReason },
      ipAddress,
      userAgent,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Permohonan demo telah ditolak. Tautan magic link yang belum terpakai telah dinonaktifkan.",
        data: updatedLead,
      },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal menolak permohonan demo.");
  }
}

/**
 * Controller untuk memperbarui jadwal demo dan/atau status lead.
 * Hanya transisi manual yang sah yang diterima (lihat MANUAL_STATUS_TRANSITIONS).
 */
export async function updateLeadStatusController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    const body = await request.json().catch(() => ({}));
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

    const { status, demoDate } = validation.data;
    const result = await updateLeadStatus(id, status ?? null, demoDate);

    if (result.statusChanged) {
      const { ipAddress, userAgent } = getClientInfo(request.headers);
      await recordAuditLog({
        userId: session.userId,
        action: result.lead.status === LEAD_STATUS.COMPLETED ? "LEAD_COMPLETED" : "LEAD_STATUS_CHANGED",
        entity: "Lead",
        recordId: id,
        oldValue: { status: result.previousStatus },
        newValue: { status: result.lead.status, trigger: "ADMIN_MANUAL" },
        ipAddress,
        userAgent,
      });
    }

    const label = STATUS_LABELS[result.lead.status] || `Status ${result.lead.status}`;
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: result.statusChanged
          ? `Status permohonan demo berhasil diubah menjadi ${label}.`
          : "Data permohonan demo berhasil diperbarui.",
        data: result.lead,
      },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal memperbarui status lead.");
  }
}

/**
 * Controller: admin mengonfirmasi demo telah selesai (Jadwal Demo -> Selesai).
 */
export async function completeLeadController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    const updatedLead = await completeLead(id);

    const { ipAddress, userAgent } = getClientInfo(request.headers);
    await recordAuditLog({
      userId: session.userId,
      action: "LEAD_COMPLETED",
      entity: "Lead",
      recordId: id,
      oldValue: { status: LEAD_STATUS.SCHEDULED },
      newValue: { status: LEAD_STATUS.COMPLETED, trigger: "ADMIN_CONFIRMATION" },
      ipAddress,
      userAgent,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Demo telah dikonfirmasi selesai.", data: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal mengonfirmasi penyelesaian demo.");
  }
}

/**
 * Controller: memperpanjang masa aktif akses demo klien.
 */
export async function extendDemoAccessController(
  request: NextRequest,
  id: string
): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;
    const session = guard.session;

    const body = await request.json().catch(() => ({}));
    const validation = extendDemoAccessSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Durasi perpanjangan tidak valid (1-90 hari).",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await extendDemoAccess(id, validation.data.days);

    const { ipAddress, userAgent } = getClientInfo(request.headers);
    await recordAuditLog({
      userId: session.userId,
      action: "DEMO_ACCESS_EXTENDED",
      entity: "Lead",
      recordId: id,
      oldValue: { demoExpiresAt: result.previousExpiresAt },
      newValue: {
        demoExpiresAt: result.newExpiresAt,
        extendedByDays: validation.data.days,
        reason: validation.data.reason || null,
      },
      ipAddress,
      userAgent,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Akses demo diperpanjang ${validation.data.days} hari.`,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal memperpanjang akses demo.");
  }
}

/**
 * Controller: riwayat magic link & audit trail sebuah lead.
 */
export async function getLeadHistoryController(id: string): Promise<NextResponse<ApiResponse>> {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const lead = await getLeadById(id);
    if (!lead) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Data lead tidak ditemukan." },
        { status: 404 }
      );
    }

    const history = await getLeadHistory(id);
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Riwayat lead berhasil dimuat.", data: history },
      { status: 200 }
    );
  } catch (error) {
    return workflowErrorResponse(error, "Gagal memuat riwayat lead.");
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
