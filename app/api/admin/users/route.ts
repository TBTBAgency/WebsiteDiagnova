import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { listUsersController, createUserController } from "@/lib/controllers/user.controller";

export const dynamic = "force-dynamic";

/** User Management: hanya akun USER (ADMIN tidak pernah ditampilkan). */
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return listUsersController(request);
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return createUserController(request, guard.actor);
}
