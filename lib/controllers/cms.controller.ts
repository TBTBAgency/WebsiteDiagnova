import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CmsError } from "@/lib/models/cms.model";
import { CMS_PAGE_PATHS } from "@/lib/cms/definitions";
import { ApiResponse } from "@/types";

export const NO_STORE = { "Cache-Control": "no-store" };

export const cmsOk = (message: string, data: unknown = null, status = 200) =>
  NextResponse.json<ApiResponse>({ success: true, message, data }, { status, headers: NO_STORE });

export function cmsFail(error: unknown, fallback: string) {
  if (error instanceof CmsError) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message, ...(error.details ? { errors: { content: error.details } } : {}) },
      { status: error.httpStatus, headers: NO_STORE }
    );
  }
  console.error(fallback, error);
  return NextResponse.json<ApiResponse>({ success: false, message: fallback }, { status: 500, headers: NO_STORE });
}

/** Revalidasi ISR halaman publik yang terdampak (on-demand, tanpa menunggu 60 detik). */
export function revalidateCmsPage(pageKey: string) {
  for (const path of CMS_PAGE_PATHS[pageKey] ?? []) {
    if (path.includes("[")) revalidatePath(path, "page");
    else revalidatePath(path);
  }
  if (pageKey === "global") revalidatePath("/", "layout");
}
