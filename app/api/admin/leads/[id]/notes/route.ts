import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authz";

export async function POST() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return NextResponse.json({ success: true, message: "Lead notes telah dieliminasi." });
}
