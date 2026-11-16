import { NextRequest } from "next/server";
import { exportLeadsCsvController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return exportLeadsCsvController(request, guard.actor);
}
