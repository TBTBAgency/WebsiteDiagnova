import { getPageContent } from "@/lib/cms/page-content";
import { platformPage } from "@/content/pages/platform";
import { PlatformPageView } from "./PlatformPageView";

export const revalidate = 60;

export default async function PlatformPage() {
  const content = await getPageContent(platformPage);
  return <PlatformPageView content={content} />;
}
