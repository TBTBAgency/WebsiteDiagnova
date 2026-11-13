import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollRevealProvider } from "@/components/providers/ScrollRevealProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { NavigationProgress } from "@/components/ui/NavigationProgress";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <ScrollRevealProvider>
          <NavigationProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ScrollRevealProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
