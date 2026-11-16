import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollRevealProvider } from "@/components/providers/ScrollRevealProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { getPageContent } from "@/lib/cms/page-content";
import { globalPage } from "@/content/pages/global";

export const revalidate = 60;

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalContent = await getPageContent(globalPage);

  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <ScrollRevealProvider>
          <NavigationProgress />
          <Navbar content={globalContent.navigation} announcement={globalContent.announcement} />
          <main className="flex-1">{children}</main>
          <Footer content={globalContent.footer} />
        </ScrollRevealProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
