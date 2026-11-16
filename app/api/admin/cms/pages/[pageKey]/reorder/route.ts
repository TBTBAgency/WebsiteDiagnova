import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/authz";
import { reorderCmsSections, CmsError } from "@/lib/models/cms.model";
import { cmsFail, cmsOk, revalidateCmsPage } from "@/lib/controllers/cms.controller";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { pageKey: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const parsed = z.object({ order: z.array(z.string()).max(50) }).strict().safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new CmsError("Format urutan tidak valid.");
    await reorderCmsSections(params.pageKey, parsed.data.order, guard.actor);
    revalidateCmsPage(params.pageKey);
    return cmsOk("Urutan section disimpan.");
  } catch (e) {
    return cmsFail(e, "Gagal menyimpan urutan.");
  }
}
