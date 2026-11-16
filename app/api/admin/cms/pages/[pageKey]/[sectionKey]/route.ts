import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/authz";
import { getCmsSectionForEdit, saveCmsSection, softDeleteCmsSection, CmsError } from "@/lib/models/cms.model";
import { cmsFail, cmsOk, revalidateCmsPage } from "@/lib/controllers/cms.controller";

export const dynamic = "force-dynamic";
type Params = { params: { pageKey: string; sectionKey: string } };

const saveSchema = z.object({
  content: z.record(z.unknown()),
  version: z.number().int().min(0),
  isPublished: z.boolean().optional(),
}).strict();

export async function GET(_request: NextRequest, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    return cmsOk("Section dimuat.", await getCmsSectionForEdit(params.pageKey, params.sectionKey));
  } catch (e) {
    return cmsFail(e, "Gagal memuat section.");
  }
}

/** Simpan konten section (optimistic lock: kirim `version` yang dibaca). */
export async function PUT(request: NextRequest, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const parsed = saveSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new CmsError("Format permintaan tidak valid.", 400);
    const result = await saveCmsSection(
      params.pageKey,
      params.sectionKey,
      { content: parsed.data.content, expectedVersion: parsed.data.version, isPublished: parsed.data.isPublished },
      guard.actor
    );
    revalidateCmsPage(params.pageKey);
    return cmsOk("Konten berhasil disimpan.", result);
  } catch (e) {
    return cmsFail(e, "Gagal menyimpan konten.");
  }
}

/** Soft delete section (dapat dipulihkan). */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    await softDeleteCmsSection(params.pageKey, params.sectionKey, guard.actor);
    revalidateCmsPage(params.pageKey);
    return cmsOk("Section dihapus (dapat dipulihkan).");
  } catch (e) {
    return cmsFail(e, "Gagal menghapus section.");
  }
}
