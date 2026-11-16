import { requireAdmin } from "@/lib/authz";
import { listCmsPages } from "@/lib/models/cms.model";
import { cmsFail, cmsOk } from "@/lib/controllers/cms.controller";

export const dynamic = "force-dynamic";

/** Daftar seluruh halaman & section CMS (termasuk section yang dihapus untuk dipulihkan). */
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  try {
    return cmsOk("Daftar halaman CMS dimuat.", await listCmsPages());
  } catch (e) {
    return cmsFail(e, "Gagal memuat daftar halaman CMS.");
  }
}
