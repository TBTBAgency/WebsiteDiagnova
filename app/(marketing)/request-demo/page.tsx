import { getPageContent } from "@/lib/cms/page-content";
import { requestDemoPage } from "@/content/pages/request-demo";
import { RequestDemoPageView } from "./RequestDemoPageView";

export const revalidate = 60;

export default async function RequestDemoPage() {
  const content = await getPageContent(requestDemoPage);
  return <RequestDemoPageView content={content} />;
}
