import { NextRequest, NextResponse } from "next/server";
import { demoRequestSchema } from "@/lib/validations";
import { saveLead } from "@/lib/leads";
import { sendNotificationEmail } from "@/lib/email";
import { ApiResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    // Save lead record (mock / in-memory or database)
    const savedRecord = await saveLead(leadData);

    // Trigger notification email to sales team (mock / email provider)
    await sendNotificationEmail(savedRecord);

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
