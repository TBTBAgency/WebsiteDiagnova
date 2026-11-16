import { getPageContent } from "@/lib/cms/page-content";
import { modulesPage } from "@/content/pages/modules";
import { ModulesPageView } from "./ModulesPageView";

export const revalidate = 60;

export default async function ModulesPage() {
  const content = await getPageContent(modulesPage);
  return <ModulesPageView content={content} />;
}
