import { NextRequest, NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/validations";
import { saveLead } from "@/lib/leads";
import { sendNotificationEmail } from "@/lib/email";
import { ApiResponse } from "@/types";
import { getClientInfo } from "@/lib/auth-guard";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAuditLog } from "@/lib/models/audit.model";

export async function POST(request: NextRequest) {
  try {
    const { ipAddress, userAgent } = getClientInfo(request.headers);
    const rate = checkRateLimit(`request-demo:${ipAddress}`, 5, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Terlalu banyak permohonan dari jaringan Anda. Silakan coba kembali nanti atau hubungi kami via WhatsApp.",
        },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Format data permohonan tidak valid." },
        { status: 400 }
      );
    }

    // Server-side Zod validation
    const validationResult = demoRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Data formulir tidak valid. Mohon periksa kembali input Anda.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data;

    // Save lead record permanently to PostgreSQL
    const savedRecord = await saveLead(leadData);

    await recordAuditLog({
      action: "LEAD_CREATED",
      entity: "Lead",
      recordId: savedRecord.id,
      newValue: { status: savedRecord.status, source: "PUBLIC_REQUEST_DEMO_FORM" },
      ipAddress,
      userAgent,
    });

    // Trigger notification email to sales team (non-blocking failure)
    try {
      await sendNotificationEmail(savedRecord);
    } catch (emailError) {
      console.error("Failed to send notification email, lead still saved:", emailError);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "Terima kasih! Permohonan demo Anda telah diterima. Tim spesialis Diagnova akan segera menghubungi Anda dalam 1x24 jam kerja.",
        data: { id: savedRecord.id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request-demo API:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server. Silakan coba kembali beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}
