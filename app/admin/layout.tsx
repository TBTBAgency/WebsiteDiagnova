import type { Metadata } from "next";
import { AdminLanguageProvider } from "@/components/admin/AdminLanguage";

// Area admin tidak boleh diindeks mesin pencari (dilengkapi header X-Robots-Tag di middleware).
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminLanguageProvider>{children}</AdminLanguageProvider>;
}
