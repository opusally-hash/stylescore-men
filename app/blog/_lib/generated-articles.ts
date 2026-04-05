import fs from "node:fs";
import path from "node:path";
import type { BlogArticle } from "./short-men-articles";

export type GeneratedBlogArticle = BlogArticle & {
  author: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  internalLinks: string[];
  externalLinks: string[];
  wordCount: number;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  status: "draft" | "published";
};

const generatedArticlesDir = path.join(
  process.cwd(),
  "content",
  "generated-articles"
);

function readGeneratedArticleFiles() {
  if (!fs.existsSync(generatedArticlesDir)) {
    return [];
  }

  return fs
    .readdirSync(generatedArticlesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(generatedArticlesDir, entry.name));
}

function readGeneratedArticle(filePath: string): GeneratedBlogArticle | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as GeneratedBlogArticle;
  } catch {
    return null;
  }
}

function isPublished(article: GeneratedBlogArticle) {
  const today = new Date().toISOString().slice(0, 10);
  return article.status === "published" && article.publishedAt <= today;
}

export function getPublishedGeneratedArticles() {
  return readGeneratedArticleFiles()
    .map(readGeneratedArticle)
    .filter((article): article is GeneratedBlogArticle => article !== null)
    .filter(isPublished)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function getPublishedGeneratedArticle(slug: string) {
  return getPublishedGeneratedArticles().find((article) => article.slug === slug);
}

export function getPublishedGeneratedArticleSlugs() {
  return getPublishedGeneratedArticles().map((article) => article.slug);
}

export function getPublishedGeneratedArticleCards() {
  return getPublishedGeneratedArticles().map((article) => ({
    slug: article.slug,
    title: article.heading,
    description: article.cardDescription,
    publishedAt: article.publishedAt,
    readingTime: article.readingTime,
  }));
}
