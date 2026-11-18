import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getClientInfo } from "@/lib/auth-guard";
import { recordAuditLog } from "@/lib/models/audit.model";
import { LeadWorkflowError } from "@/lib/models/lead.model";
import { getMagicLinkEligibility, reissueMagicLinkForUser } from "@/lib/models/user-magic-link.model";
import { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

/** GET /api/admin/users/[id]/magic-link — kelayakan Magic Link akun (tanpa membuat tautan). */
export async function GET(_request: NextRequest, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const eligibility = await getMagicLinkEligibility(params.id);
    return NextResponse.json<ApiResponse>({ success: true, message: eligibility.reason, data: eligibility });
  } catch (error) {
    console.error("GET user magic-link eligibility error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal memeriksa kelayakan Magic Link." }, { status: 500 });
  }
}

/**
 * POST /api/admin/users/[id]/magic-link — terbitkan ulang Magic Link untuk akun USER yang
 * memiliki permohonan demo APPROVED. Ditolak (409) untuk akun manual tanpa permohonan,
 * permohonan pending/ditolak, akun nonaktif, atau masa demo berakhir.
 */
export async function POST(request: NextRequest, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const result = await reissueMagicLinkForUser(params.id, guard.session.name || "Admin Diagnova");
    if (!result.ok) {
      const status = result.eligibility.eligible === false && result.eligibility.code === "NOT_FOUND" ? 404 : 409;
      return NextResponse.json<ApiResponse>(
        { success: false, message: result.eligibility.reason, data: { code: result.eligibility.eligible ? null : result.eligibility.code } },
        { status }
      );
    }
    await recordAuditLog({
      userId: guard.session.userId,
      action: "MAGIC_LINK_REISSUED",
      entity: "Lead",
      recordId: result.leadId,
      newValue: { source: "user-management", targetUserId: params.id, magicLinkExpiresAt: result.expiresAt },
      ...getClientInfo(request.headers),
    });
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Magic Link baru diterbitkan (buka pertama kali dalam 24 jam; dapat dipakai masuk kembali selama masa demo). Tautan lama tidak berlaku lagi.",
      data: { magicLinkUrl: result.magicLinkUrl, expiresAt: result.expiresAt, leadId: result.leadId },
    });
  } catch (error) {
    if (error instanceof LeadWorkflowError) {
      return NextResponse.json<ApiResponse>({ success: false, message: error.message }, { status: error.httpStatus });
    }
    console.error("POST user magic-link error:", error);
    return NextResponse.json<ApiResponse>({ success: false, message: "Gagal menerbitkan Magic Link." }, { status: 500 });
  }
}
