import { getPageContent } from "@/lib/cms/page-content";
import { integrationPage } from "@/content/pages/integration";
import { IntegrationPageView } from "./IntegrationPageView";

export const revalidate = 60;

export default async function IntegrationPage() {
  const content = await getPageContent(integrationPage);
  return <IntegrationPageView content={content} />;
}
