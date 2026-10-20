import { getCatalogController } from "@/lib/controllers/lis.controller";

export async function GET() {
  return getCatalogController();
}
