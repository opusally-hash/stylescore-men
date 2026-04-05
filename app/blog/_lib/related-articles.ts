import fs from "node:fs";
import path from "node:path";

export type RelatedArticleLink = {
  slug: string;
  title: string;
  href: string;
  description?: string;
};

type RelatedArticlesManifest = {
  links: Record<string, RelatedArticleLink[]>;
};

const relatedArticlesPath = path.join(
  process.cwd(),
  "content",
  "related-articles.json"
);

export function getRelatedArticles(slug: string) {
  if (!fs.existsSync(relatedArticlesPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(relatedArticlesPath, "utf8");
    const parsed = JSON.parse(raw) as RelatedArticlesManifest;
    return parsed.links[slug] ?? [];
  } catch {
    return [];
  }
}
