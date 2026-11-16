import { NextRequest } from "next/server";
import { getLeadDetailController, updateLeadScheduleController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return getLeadDetailController(params.id);
}

/** Hanya jadwal presentasi (confirmedDemoDate). Status Lead tidak dapat diubah di sini. */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return updateLeadScheduleController(request, params.id, guard.actor);
}
