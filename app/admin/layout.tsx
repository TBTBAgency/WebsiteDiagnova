import type { Metadata } from "next";

// Area admin tidak boleh diindeks mesin pencari (middleware juga mengirim header X-Robots-Tag).
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
