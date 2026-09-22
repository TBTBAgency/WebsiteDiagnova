import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Diagnova — AI-Powered Laboratory Intelligence Platform",
    template: "%s | Diagnova",
  },
  description:
    "Solusi Laboratory Information System (LIS) end-to-end yang menjamin akurasi data, efisiensi operasional, dan kecepatan penyampaian hasil analisis klinis bagi Rumah Sakit & Laboratorium Modern.",
  keywords: [
    "Laboratory Information System",
    "LIS Rumah Sakit",
    "Diagnova LIS",
    "Nova AI",
    "Sistem Informasi Laboratorium",
    "Interfacing Analyzer HL7 ASTM",
    "SATUSEHAT Kemenkes",
    "Rekam Medis Elektronik RME",
  ],
  authors: [{ name: "Diagnova Team", url: "https://diagnova.id" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://diagnova.id",
    title: "Diagnova — AI-Powered Laboratory Intelligence Platform",
    description:
      "Solusi LIS end-to-end dengan Nova AI, 100% direct analyzer interfacing, dan integrasi SIMRS/RME/SATUSEHAT.",
    siteName: "Diagnova",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col font-sans bg-white text-slate-800">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
