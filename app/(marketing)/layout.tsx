import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollRevealProvider } from "@/components/providers/ScrollRevealProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { getAnnouncementContent, getFooterContent } from "@/lib/models/site-content.model";
import { isAnnouncementVisible } from "@/lib/site-content";
import { getPublicNavigation } from "@/lib/models/cms.model";

// Navigasi, Footer & Announcement berasal dari CMS: seluruh halaman publik disegarkan maksimal tiap
// 60 detik, dan segera setelah admin menyimpan (revalidatePath("/", "layout")).
export const revalidate = 60;

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [footer, announcement, navigation] = await Promise.all([getFooterContent(), getAnnouncementContent(), getPublicNavigation()]);

  return (
    <LanguageProvider>
      <SmoothScrollProvider>
        <ScrollRevealProvider>
          <NavigationProgress />
          <Navbar announcement={isAnnouncementVisible(announcement) ? announcement : null} initialMenus={navigation} />
          <main className="flex-1">{children}</main>
          <Footer content={footer} />
        </ScrollRevealProvider>
      </SmoothScrollProvider>
    </LanguageProvider>
  );
}
