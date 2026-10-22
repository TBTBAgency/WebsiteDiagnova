import { getCatalogController } from "@/lib/controllers/lis.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getCatalogController();
}
