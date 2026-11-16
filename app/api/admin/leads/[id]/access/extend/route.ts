import { NextRequest } from "next/server";
import { extendAccessController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return extendAccessController(request, params.id, guard.actor);
}
