import { NextRequest, NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/validations";
import { saveLead } from "@/lib/leads";
import { sendNotificationEmail } from "@/lib/email";
import { getClientIp, getUserAgent } from "@/lib/request-meta";
import { countRecentAuditEvents, LEAD_FORM_LIMITS } from "@/lib/rate-limit";
import { ApiResponse } from "@/types";

const SUCCESS_MESSAGE =
  "Terima kasih! Permohonan demo Anda telah diterima. Tim spesialis Diagnova akan segera menghubungi Anda dalam 1x24 jam kerja.";

/**
 * POST /api/request-demo (publik)
 * Form tervalidasi & tersimpan -> Lead berstatus Dihubungi (dalam satu transaksi dengan audit LEAD_CREATED).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const validation = demoRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data formulir tidak valid. Mohon periksa kembali input Anda.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    if (ipAddress) {
      const recent = await countRecentAuditEvents({
        actions: ["LEAD_CREATED"],
        windowMs: LEAD_FORM_LIMITS.windowMs,
        ipAddress,
      });
      if (recent >= LEAD_FORM_LIMITS.maxPerIp) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "Terlalu banyak permohonan dari jaringan Anda. Silakan coba lagi dalam 1 jam." },
          { status: 429 }
        );
      }
    }

    const { website: _honeypot, ...leadData } = validation.data;
    const savedRecord = await saveLead(leadData, { ipAddress, userAgent });

    try {
      await sendNotificationEmail(savedRecord);
    } catch (emailError) {
      console.error("Failed to send notification email, lead still saved:", emailError);
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: SUCCESS_MESSAGE, data: { id: savedRecord.id } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request-demo API:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Terjadi kesalahan internal pada server. Silakan coba kembali beberapa saat lagi." },
      { status: 500 }
    );
  }
}
