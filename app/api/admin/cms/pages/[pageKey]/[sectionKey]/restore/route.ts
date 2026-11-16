import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { restoreCmsSection } from "@/lib/models/cms.model";
import { cmsFail, cmsOk, revalidateCmsPage } from "@/lib/controllers/cms.controller";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest, { params }: { params: { pageKey: string; sectionKey: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await restoreCmsSection(params.pageKey, params.sectionKey, guard.actor);
    revalidateCmsPage(params.pageKey);
    return cmsOk("Section dipulihkan.");
  } catch (e) {
    return cmsFail(e, "Gagal memulihkan section.");
  }
}
