import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { resolveUploadPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

/** Menyajikan file upload CMS dari UPLOAD_DIR (di luar public/). Nama file acak & tidak berubah -> cache immutable. */
export async function GET(_request: NextRequest, { params }: { params: { path: string[] } }) {
  const resolved = resolveUploadPath(params.path ?? []);
  if (!resolved) return new NextResponse("Not found", { status: 404 });
  try {
    const data = await fs.readFile(resolved.file);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": resolved.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
