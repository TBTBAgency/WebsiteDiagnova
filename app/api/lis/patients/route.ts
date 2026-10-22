import { NextRequest } from "next/server";
import {
  getPatientsController,
  createPatientController,
} from "@/lib/controllers/lis.controller";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return getPatientsController(request);
}

export async function POST(request: NextRequest) {
  return createPatientController(request);
}
