import { NextRequest } from "next/server";
import {
  getLeadDetailController,
  updateLeadStatusController,
} from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return getLeadDetailController(request, params.id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return updateLeadStatusController(request, params.id);
}
