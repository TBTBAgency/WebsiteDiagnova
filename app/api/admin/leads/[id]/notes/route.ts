import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * Endpoint lama (fitur catatan lead sudah dihapus). Tetap dipertahankan untuk kompatibilitas,
 * tetapi kini juga memeriksa otorisasi ADMIN di handler (bukan hanya middleware).
 */
export async function POST() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return NextResponse.json({ success: true, message: "Lead notes telah dieliminasi." });
}
