import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readCmsImage } from "@/lib/cms-image-storage";

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
 * Menyajikan gambar yang diunggah admin setelah build:
 * - di Vercel dari Vercel Blob (store private),
 * - di lokal dari public/uploads/cms (`next start` hanya menyajikan file /public yang sudah ada saat build).
 * File yang sudah ada di repo saat build tetap disajikan langsung sebagai static file oleh Next.js.
 */
export async function GET(_request: NextRequest, { params }: { params: { filename: string } }) {
  const filename = params.filename;
  if (!SAFE_NAME.test(filename)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const data = await readCmsImage(filename);
  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
    },
  });
}
