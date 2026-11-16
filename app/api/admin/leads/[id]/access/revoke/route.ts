import { NextRequest } from "next/server";
import { revokeAccessController } from "@/lib/controllers/lead.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return revokeAccessController(params.id, guard.actor);
}
