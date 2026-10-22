import { getPhysiciansController } from "@/lib/controllers/lis.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getPhysiciansController();
}
