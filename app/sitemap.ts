import type { MetadataRoute } from "next";
import { getPublishedGeneratedArticleSlugs } from "./blog/_lib/generated-articles";
import { shortMenArticleSlugs } from "./blog/_lib/short-men-articles";

const baseUrl = "https://stylescore.live";

const existingBlogSlugs = [
  "7-signs-dress-well",
  "best-perfumes-for-men",
  "best-white-sneakers-men",
  "casual-outfits-men",
  "Fashion-for-muscular-men",
  "fashion-for-short-men",
  "how-to-dress-better-men",
  "how-to-improve-style",
  "How-to-know-if-you-dress-well",
  "Jon-Bernthal-Stylish",
  "mens-grooming-basics",
  "mens-style-test",
  "mens-wardrobe-essentials",
  "style-mistakes-men",
  "why-men-look-bad-in-clothes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const generatedBlogSlugs = getPublishedGeneratedArticleSlugs();
  const blogSlugs = Array.from(
    new Set([...existingBlogSlugs, ...shortMenArticleSlugs, ...generatedBlogSlugs])
  );

  return [
    {
      url: baseUrl,
      lastModified,
      priority: 1,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/style-quiz`,
      lastModified,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/short-men-style`,
      lastModified,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      priority: 0.8,
    },
    ...blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      priority: 0.7,
    })),
  ];
}
