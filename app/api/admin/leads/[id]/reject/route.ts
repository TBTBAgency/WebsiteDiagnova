import { NextRequest } from "next/server";
import { rejectLeadController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return rejectLeadController(request, params.id);
}
