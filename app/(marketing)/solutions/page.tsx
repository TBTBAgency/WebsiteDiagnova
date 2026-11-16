import { getPageContent } from "@/lib/cms/page-content";
import { solutionsPage } from "@/content/pages/solutions";
import { SolutionsPageView } from "./SolutionsPageView";

export const revalidate = 60;

export default async function SolutionsPage() {
  const content = await getPageContent(solutionsPage);
  return <SolutionsPageView content={content} />;
}
