import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { updateUserController, deleteUserController } from "@/lib/controllers/user.controller";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return updateUserController(request, params.id, guard.actor);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return deleteUserController(params.id, guard.actor);
}
