import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { restoreUserController } from "@/lib/controllers/user.controller";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return restoreUserController(params.id, guard.actor);
}
