import { NextRequest } from "next/server";
import { reissueLinkController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return reissueLinkController(params.id, guard.actor);
}
