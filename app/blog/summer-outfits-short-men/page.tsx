import { ArticlePage, buildBlogMetadata } from "../_components/article-page";
import { getShortMenArticle } from "../_lib/short-men-articles";

const article = getShortMenArticle("summer-outfits-short-men");

export const metadata = buildBlogMetadata(article);

export default function Page() {
  return <ArticlePage article={article} />;
}
