import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/authz";
import { saveCmsImage, MAX_UPLOAD_BYTES } from "@/lib/uploads";
import { recordAuditLog } from "@/lib/models/audit.model";
import { CmsError } from "@/lib/models/cms.model";
import { cmsFail, cmsOk } from "@/lib/controllers/cms.controller";

export const dynamic = "force-dynamic";

/** Upload gambar CMS (multipart, field "file"). Mengembalikan path publik untuk disimpan di konten. */
export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    const declared = Number(request.headers.get("content-length") || 0);
    if (declared > MAX_UPLOAD_BYTES + 64 * 1024) throw new CmsError("Ukuran file maksimal 5 MB.", 413);

    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!file || typeof file === "string") throw new CmsError("File gambar wajib diunggah (field \"file\").");
    if (file.size > MAX_UPLOAD_BYTES) throw new CmsError("Ukuran file maksimal 5 MB.", 413);

    const buffer = Buffer.from(await file.arrayBuffer());
    let saved;
    try {
      saved = await saveCmsImage(buffer);
    } catch (e) {
      if ((e as Error).message === "UNSUPPORTED_TYPE") throw new CmsError("Format tidak didukung. Gunakan PNG, JPG, WEBP, atau GIF.", 415);
      throw e;
    }

    await recordAuditLog({
      actor: guard.actor,
      action: "CMS_MEDIA_UPLOADED",
      entity: "cms_media",
      recordId: saved.url,
      newValue: { url: saved.url, contentType: saved.contentType, bytes: saved.bytes, originalName: file.name.substring(0, 120) },
    });
    return cmsOk("Gambar berhasil diunggah.", saved, 201);
  } catch (e) {
    return cmsFail(e, "Gagal mengunggah gambar.");
  }
}
