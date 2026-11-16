import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import {
  getLeadsWithPagination,
  getLeadsForExport,
  getLeadById,
  getLeadMetrics,
  grantDemoAccess,
  reissueMagicLink,
  extendDemoAccess,
  revokeDemoAccess,
  rejectLead,
  completeLeadDemo,
  updateLeadSchedule,
  STATUS_LABELS,
  LeadWorkflowError,
  AdminActor,
} from "@/lib/models/lead.model";
import {
  grantAccessSchema,
  extendAccessSchema,
  rejectLeadSchema,
  completeLeadSchema,
  updateLeadScheduleSchema,
} from "@/lib/validations";
import { isLeadStage } from "@/lib/demo-constants";
import { DEMO_ACCESS_STATE_LABELS } from "@/lib/demo-constants";
import { recordAuditLog } from "@/lib/models/audit.model";
import { sendApprovalNotificationEmail } from "@/lib/email";
import { formatJakarta } from "@/lib/time";
import { ApiResponse, InstitutionType, LeadApprovalStatus, LeadFilterQuery, LeadStatus } from "@/types";

const NO_STORE = { "Cache-Control": "no-store" };

function ok(message: string, data: unknown, status = 200) {
  return NextResponse.json<ApiResponse>({ success: true, message, data }, { status, headers: NO_STORE });
}

function fail(message: string, status: number, errors?: Record<string, string[]>) {
  return NextResponse.json<ApiResponse>({ success: false, message, ...(errors ? { errors } : {}) }, { status, headers: NO_STORE });
}

function handleError(error: unknown, fallback: string) {
  if (error instanceof LeadWorkflowError) return fail(error.message, error.httpStatus);
  console.error(fallback, error);
  return fail(fallback, 500);
}

async function parseBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<{ data: T } | { response: NextResponse<ApiResponse> }> {
  const body = await request.json().catch(() => ({}));
  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    const flat = result.error.flatten();
    const unknownKeys = result.error.issues.some((i) => i.code === "unrecognized_keys");
    return {
      response: fail(
        unknownKeys ? "Field tidak diizinkan. Status Lead hanya berubah melalui workflow." : "Data tidak valid.",
        400,
        flat.fieldErrors as Record<string, string[]>
      ),
    };
  }
  return { data: result.data };
}

function parseFilters(request: NextRequest): LeadFilterQuery & { approvalStatus?: LeadApprovalStatus | "all" } {
  const sp = new URL(request.url).searchParams;
  const rawStatus = sp.get("status");
  const rawApproval = sp.get("approvalStatus");
  return {
    status: rawStatus && isLeadStage(rawStatus) ? (rawStatus as LeadStatus) : "all",
    approvalStatus: rawApproval === "REJECTED" || rawApproval === "PENDING" || rawApproval === "APPROVED" ? rawApproval : "all",
    institutionType: (sp.get("institutionType") as InstitutionType | "all") || "all",
    search: sp.get("search") || undefined,
    startDate: sp.get("startDate") || undefined,
    endDate: sp.get("endDate") || undefined,
    page: Number(sp.get("page")) || 1,
    limit: Number(sp.get("limit")) || 10,
  };
}

export async function getLeadsController(request: NextRequest) {
  try {
    const [paginated, metrics] = await Promise.all([getLeadsWithPagination(parseFilters(request)), getLeadMetrics()]);
    return ok("Data leads berhasil dimuat.", { ...paginated, metrics });
  } catch (error) {
    return handleError(error, "Gagal memuat data permohonan demo.");
  }
}

export async function getLeadDetailController(id: string) {
  try {
    const lead = await getLeadById(id);
    return lead ? ok("Detail lead berhasil dimuat.", lead) : fail("Data lead tidak ditemukan.", 404);
  } catch (error) {
    return handleError(error, "Gagal memuat detail lead.");
  }
}

export async function updateLeadScheduleController(request: NextRequest, id: string, actor: AdminActor) {
  const parsed = await parseBody(request, updateLeadScheduleSchema);
  if ("response" in parsed) return parsed.response;
  try {
    return ok("Jadwal demo berhasil diperbarui.", await updateLeadSchedule(id, parsed.data, actor));
  } catch (error) {
    return handleError(error, "Gagal memperbarui jadwal demo.");
  }
}

export async function grantAccessController(request: NextRequest, id: string, actor: AdminActor) {
  const parsed = await parseBody(request, grantAccessSchema);
  if ("response" in parsed) return parsed.response;
  try {
    const result = await grantDemoAccess(id, parsed.data, actor);
    try {
      await sendApprovalNotificationEmail(result.lead, result.magicLinkUrl);
    } catch (e) {
      console.error("Gagal mengirim email notifikasi akses demo:", e);
    }
    return ok(`Akses demo ${parsed.data.durationDays} hari diberikan. Tautan login berlaku 24 jam.`, result);
  } catch (error) {
    return handleError(error, "Gagal memberi akses demo.");
  }
}

export async function reissueLinkController(id: string, actor: AdminActor) {
  try {
    return ok("Tautan baru dibuat. Tautan lama yang belum dipakai sudah dicabut.", await reissueMagicLink(id, actor));
  } catch (error) {
    return handleError(error, "Gagal membuat tautan baru.");
  }
}

export async function extendAccessController(request: NextRequest, id: string, actor: AdminActor) {
  const parsed = await parseBody(request, extendAccessSchema);
  if ("response" in parsed) return parsed.response;
  try {
    const result = await extendDemoAccess(id, parsed.data, actor);
    return ok(
      result.magicLinkUrl
        ? `Akses diperpanjang ${parsed.data.durationDays} hari. Kirim tautan baru agar pemohon dapat login kembali.`
        : `Akses diperpanjang ${parsed.data.durationDays} hari, dimulai saat periode berjalan berakhir.`,
      result
    );
  } catch (error) {
    return handleError(error, "Gagal memperpanjang akses demo.");
  }
}

export async function revokeAccessController(id: string, actor: AdminActor) {
  try {
    return ok("Akses demo dicabut.", await revokeDemoAccess(id, actor));
  } catch (error) {
    return handleError(error, "Gagal mencabut akses demo.");
  }
}

export async function rejectLeadController(request: NextRequest, id: string, actor: AdminActor) {
  const parsed = await parseBody(request, rejectLeadSchema);
  if ("response" in parsed) return parsed.response;
  try {
    return ok("Permohonan demo telah ditolak.", await rejectLead(id, parsed.data, actor));
  } catch (error) {
    return handleError(error, "Gagal menolak permohonan demo.");
  }
}

export async function completeLeadController(request: NextRequest, id: string, actor: AdminActor) {
  const parsed = await parseBody(request, completeLeadSchema);
  if ("response" in parsed) return parsed.response;
  try {
    return ok("Demo ditandai selesai.", await completeLeadDemo(id, parsed.data, actor));
  } catch (error) {
    return handleError(error, "Gagal menandai demo selesai.");
  }
}

const escapeCsv = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") return '""';
  let str = String(value);
  // Cegah CSV/formula injection saat dibuka di spreadsheet
  if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
};

/** Ekspor CSV seluruh lead sesuai filter (tanpa batas 100). Ekspor dicatat di audit log. */
export async function exportLeadsCsvController(request: NextRequest, actor: AdminActor) {
  try {
    const filters = parseFilters(request);
    const leads = await getLeadsForExport(filters);

    const headers = [
      "ID", "Tanggal Masuk (WIB)", "Nama Lengkap", "Institusi / RS", "Jabatan", "Email", "No. Telepon / WA",
      "Jenis Institusi", "Status", "Ditolak", "Jadwal Diajukan", "Jadwal Dikonfirmasi", "Login Demo Pertama",
      "Status Akses", "Akses Berakhir", "Demo Selesai Dikonfirmasi", "Dikonfirmasi Oleh", "Catatan Penyelesaian",
      "Catatan Kebutuhan",
    ];

    const rows = leads.map((l) => [
      escapeCsv(l.id),
      escapeCsv(formatJakarta(l.createdAt)),
      escapeCsv(l.name),
      escapeCsv(l.institution),
      escapeCsv(l.jobTitle),
      escapeCsv(l.email),
      escapeCsv(l.phone),
      escapeCsv(l.institutionType),
      escapeCsv(STATUS_LABELS[l.status]),
      escapeCsv(l.approvalStatus === "REJECTED" ? `Ya: ${l.rejectionReason ?? ""}` : "Tidak"),
      escapeCsv(formatJakarta(l.requestedDemoDate, false)),
      escapeCsv(formatJakarta(l.confirmedDemoDate)),
      escapeCsv(formatJakarta(l.demoStartedAt)),
      escapeCsv(l.currentAccess ? DEMO_ACCESS_STATE_LABELS[l.currentAccess.state] : "-"),
      escapeCsv(formatJakarta(l.currentAccess?.expiresAt)),
      escapeCsv(formatJakarta(l.demoCompletedAt)),
      escapeCsv(l.demoCompletedBy?.name),
      escapeCsv(l.demoCompletionNote),
      escapeCsv(l.notes),
    ]);

    await recordAuditLog({
      actor,
      action: "LEAD_EXPORTED",
      entity: "leads",
      newValue: { rows: leads.length, filters: { ...filters, page: undefined, limit: undefined } },
    });

    const csv = "﻿" + [headers.map(escapeCsv).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="diagnova_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("exportLeadsCsvController error:", error);
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
