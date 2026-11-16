import { getCatalogController } from "@/lib/controllers/lis.controller";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  return getCatalogController();
}
