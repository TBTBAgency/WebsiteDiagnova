import { NextRequest } from "next/server";
import {
  getOrdersController,
  createOrderController,
} from "@/lib/controllers/lis.controller";

export async function GET(request: NextRequest) {
  return getOrdersController(request);
}

export async function POST(request: NextRequest) {
  return createOrderController(request);
}
