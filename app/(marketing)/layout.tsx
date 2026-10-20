import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}

