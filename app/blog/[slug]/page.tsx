import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, buildBlogMetadata } from "../_components/article-page";
import {
  getPublishedGeneratedArticle,
  getPublishedGeneratedArticleSlugs,
} from "../_lib/generated-articles";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublishedGeneratedArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedGeneratedArticle(slug);

  if (!article) {
    return {};
  }

  return buildBlogMetadata(article);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const article = getPublishedGeneratedArticle(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
