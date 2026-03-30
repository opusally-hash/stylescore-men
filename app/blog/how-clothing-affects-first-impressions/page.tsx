import { ArticlePage, buildBlogMetadata } from "../_components/article-page";
import { getShortMenArticle } from "../_lib/short-men-articles";

const article = getShortMenArticle("how-clothing-affects-first-impressions");

export const metadata = buildBlogMetadata(article);

export default function Page() {
  return <ArticlePage article={article} />;
}
