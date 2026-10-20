import { getMeController } from "@/lib/controllers/auth.controller";

export async function GET() {
  return getMeController();
}
