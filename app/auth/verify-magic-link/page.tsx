import type { Metadata } from "next";
import { MagicLinkConsent } from "./MagicLinkConsent";

export const metadata: Metadata = {
  title: "Akses Demo Diagnova",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/**
 * Halaman tujuan magic link.
 *
 * Sengaja TIDAK melakukan apa pun di server saat GET: crawler preview (WhatsApp, pemindai email)
 * yang membuka tautan tidak dapat mengonsumsi token. Token dibaca di browser dari fragment URL
 * dan baru dikonsumsi lewat POST /api/auth/magic-link/consume ketika pengguna menekan tombol.
 */
export default function VerifyMagicLinkPage() {
  return <MagicLinkConsent />;
}
