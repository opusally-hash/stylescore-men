import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://stylescore.live/sitemap.xml",
    host: "https://stylescore.live",
  };
}
