import { getMeController } from "@/lib/controllers/auth.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  return getMeController();
}
