import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const SAFE_NAME = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|svg)$/;

/**
 * GET /uploads/cms/[filename]
 *
 * `next start` hanya menyajikan file di /public yang sudah ada saat build. Gambar yang
 * diunggah admin setelah build (disimpan ke public/uploads/cms) disajikan oleh route ini.
 * File yang sudah ada saat build tetap disajikan langsung sebagai static file oleh Next.js.
 */
export async function GET(_request: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  if (!SAFE_NAME.test(filename)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const filePath = path.join(process.cwd(), "public", "uploads", "cms", filename);

  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
