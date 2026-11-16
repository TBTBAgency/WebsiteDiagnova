import { getPageContent } from "@/lib/cms/page-content";
import { novaAiPage } from "@/content/pages/nova-ai";
import { NovaAiPageView } from "./NovaAiPageView";

export const revalidate = 60;

export default async function NovaAIPage() {
  const content = await getPageContent(novaAiPage);
  return <NovaAiPageView content={content} />;
}
