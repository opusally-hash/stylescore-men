import type { Metadata } from "next";

export type LegacyBlogSeoEntry = {
  slug: string;
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
};

export const legacyBlogSeo = {
  "7-signs-dress-well": {
    slug: "7-signs-dress-well",
    title: "7 Signs You Dress Well as a Man (And How to Improve Fast) | StyleScore",
    description:
      "Learn 7 practical signs that show whether you actually dress well as a man, and how to improve the weak spots fast.",
    publishedTime: "2026-03-01T09:00:00.000Z",
  },
  "best-perfumes-for-men": {
    slug: "best-perfumes-for-men",
    title: "Best Perfumes for Men (Smell Better Instantly) | StyleScore",
    description:
      "A simple guide to choosing versatile fragrances for men, applying them correctly, and using scent to improve presence.",
    publishedTime: "2026-03-02T09:00:00.000Z",
  },
  "best-white-sneakers-men": {
    slug: "best-white-sneakers-men",
    title: "Best White Sneakers for Men (Style Upgrade Guide) | StyleScore",
    description:
      "Learn what makes white sneakers worth buying, how to wear them well, and why they are one of the highest-ROI style upgrades.",
    publishedTime: "2026-03-03T09:00:00.000Z",
  },
  "casual-outfits-men": {
    slug: "casual-outfits-men",
    title: "Casual Outfits for Men That Look Effortless | StyleScore",
    description:
      "Easy casual outfit formulas for men that still look intentional, balanced, and put together.",
    publishedTime: "2026-03-04T09:00:00.000Z",
  },
  "Fashion-for-muscular-men": {
    slug: "Fashion-for-muscular-men",
    title: "Best Clothes for Muscular Men | StyleScore",
    description:
      "Learn how muscular men can dress better with cleaner fit, better fabrics, and proportions that flatter instead of fight the build.",
    publishedTime: "2026-03-05T09:00:00.000Z",
  },
  "fashion-for-short-men": {
    slug: "fashion-for-short-men",
    title: "Fashion Tips for Short Men (Look Taller Instantly) | StyleScore",
    description:
      "Practical style tips for shorter men covering fit, proportion, shoe choice, and outfit balance.",
    publishedTime: "2026-03-06T09:00:00.000Z",
  },
  "how-to-dress-better-men": {
    slug: "how-to-dress-better-men",
    title: "How to Dress Better as a Man (Simple Rules That Work) | StyleScore",
    description:
      "A practical guide to dressing better as a man, with clear rules for fit, color, shoes, grooming, and wardrobe decisions.",
    publishedTime: "2026-03-07T09:00:00.000Z",
  },
  "how-to-improve-style": {
    slug: "how-to-improve-style",
    title: "How to Improve Your Style in 30 Days: A Practical Roadmap | StyleScore",
    description:
      "A 30-day men's style roadmap that shows what to fix first so your next upgrade actually changes how you look.",
    publishedTime: "2026-03-08T09:00:00.000Z",
  },
  "How-to-know-if-you-dress-well": {
    slug: "How-to-know-if-you-dress-well",
    title: "How to Know If You Dress Well (Without Asking Anyone) | StyleScore",
    description:
      "Wondering if you dress well? Learn the clearest signs that show whether your style is actually working.",
    publishedTime: "2026-03-09T09:00:00.000Z",
  },
  "Jon-Bernthal-Stylish": {
    slug: "Jon-Bernthal-Stylish",
    title:
      "Why Jon Bernthal Looks Effortlessly Stylish (And What Men Can Learn) | StyleScore",
    description:
      "Break down why Jon Bernthal's style works so well and what men can copy from his repeatable wardrobe choices.",
    publishedTime: "2026-03-10T09:00:00.000Z",
  },
  "mens-grooming-basics": {
    slug: "mens-grooming-basics",
    title: "Men's Grooming Basics (Most Ignored Style Upgrade) | StyleScore",
    description:
      "The grooming basics that sharpen a man's look fastest, from beard upkeep and skin to nails and overall presentation.",
    publishedTime: "2026-03-11T09:00:00.000Z",
  },
  "mens-style-test": {
    slug: "mens-style-test",
    title: "Men's Style Test: Score Your Look in 10 Questions (2026) | StyleScore",
    description:
      "Take a 10-question men's style test and see whether fit, shoes, grooming, wardrobe, or color is hurting your look.",
    publishedTime: "2026-03-12T09:00:00.000Z",
  },
  "mens-wardrobe-essentials": {
    slug: "mens-wardrobe-essentials",
    title: "Essential Wardrobe Items Every Man Should Own | StyleScore",
    description:
      "A clean wardrobe checklist of the essential pieces every man should own to build outfits that actually work together.",
    publishedTime: "2026-03-13T09:00:00.000Z",
  },
  "style-mistakes-men": {
    slug: "style-mistakes-men",
    title: "10 Style Mistakes Most Men Make (And How to Fix Each One) | StyleScore",
    description:
      "Fix the 10 style mistakes that make most men look sloppy, from bad fit and tired shoes to weak grooming.",
    publishedTime: "2026-03-14T09:00:00.000Z",
  },
  "why-men-look-bad-in-clothes": {
    slug: "why-men-look-bad-in-clothes",
    title: "Why Most Men Look Bad in Clothes (And How to Fix It) | StyleScore",
    description:
      "The biggest reasons men look bad in clothes, from poor fit and weak shoes to grooming and wardrobe logic.",
    publishedTime: "2026-03-15T09:00:00.000Z",
  },
} as const satisfies Record<string, LegacyBlogSeoEntry>;

export function buildLegacyBlogMetadata(entry: LegacyBlogSeoEntry): Metadata {
  const url = `https://stylescore.live/blog/${entry.slug}`;

  return {
    title: entry.title,
    description: entry.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url,
      type: "article",
      publishedTime: entry.publishedTime,
      modifiedTime: entry.modifiedTime || entry.publishedTime,
      siteName: "StyleScore",
      images: [
        {
          url: "/og-image-share.png",
          width: 1368,
          height: 768,
          alt: `${entry.title.replace(" | StyleScore", "")} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: ["/og-image-share.png"],
    },
  };
}

export function LegacyBlogStructuredData({
  entry,
}: {
  entry: LegacyBlogSeoEntry;
}) {
  const url = `https://stylescore.live/blog/${entry.slug}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title.replace(" | StyleScore", ""),
    description: entry.description,
    url,
    datePublished: entry.publishedTime,
    dateModified: entry.modifiedTime || entry.publishedTime,
    author: {
      "@type": "Organization",
      name: "StyleScore",
      url: "https://stylescore.live",
    },
    publisher: {
      "@type": "Organization",
      name: "StyleScore",
      url: "https://stylescore.live",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  });
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stylescore.live",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://stylescore.live/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.title.replace(" | StyleScore", ""),
        item: url,
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
    </>
  );
}
