const fs = require("node:fs");
const path = require("node:path");
const { AI_TELL_PHRASES, BANNED_WORDS } = require("./prompt-templates");

const rootDir = path.resolve(__dirname, "..", "..");
const keywordsPath = path.join(rootDir, "keywords.json");
const relatedArticlesPath = path.join(rootDir, "content", "related-articles.json");
const generatedArticlesDir = path.join(rootDir, "content", "generated-articles");

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const nextValue = argv[index + 1];

    if (!nextValue || nextValue.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = nextValue;
    index += 1;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function loadKeywordsConfig() {
  return readJson(keywordsPath);
}

function saveKeywordsConfig(config) {
  writeJson(keywordsPath, config);
}

function getQueueEntry(config, { keyword, slug }) {
  return config.queue.find((entry) => {
    if (slug && entry.slug === slug) {
      return true;
    }

    if (keyword && entry.keyword === keyword) {
      return true;
    }

    return false;
  });
}

function selectNextQueueEntry(config) {
  const today = new Date().toISOString().slice(0, 10);
  const publishedTodayCount = countPublishedArticlesForDate(today);

  if (publishedTodayCount >= 2) {
    return undefined;
  }

  return [...config.queue]
    .filter((entry) => entry.status !== "published" && entry.scheduledFor <= today)
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.scheduledFor.localeCompare(right.scheduledFor);
    })[0];
}

function countPublishedArticlesForDate(date) {
  if (!fs.existsSync(generatedArticlesDir)) {
    return 0;
  }

  return fs
    .readdirSync(generatedArticlesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => {
      try {
        return readJson(path.join(generatedArticlesDir, entry.name));
      } catch {
        return null;
      }
    })
    .filter((article) => article && article.status === "published" && article.publishedAt === date)
    .length;
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return stripMarkdown(text)
    .toLowerCase()
    .match(/[a-z0-9']+/g) || [];
}

function hasKeywordCoverage(text, keyword) {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "for",
    "how",
    "in",
    "of",
    "the",
    "to",
    "with",
    "your"
  ]);
  const keywordTokens = tokenize(keyword).filter((token) => !stopWords.has(token));
  const textTokens = new Set(tokenize(text));
  const synonymMap = {
    man: ["men"],
    men: ["man"]
  };

  return keywordTokens.every((token) => {
    if (textTokens.has(token)) {
      return true;
    }

    const singularToken = token.endsWith("s") ? token.slice(0, -1) : `${token}s`;

    if (textTokens.has(singularToken)) {
      return true;
    }

    return (synonymMap[token] || []).some((candidate) => textTokens.has(candidate));
  });
}

function findBannedWords(text) {
  const lowerText = stripMarkdown(text).toLowerCase();

  return BANNED_WORDS.filter((word) => {
    if (word.includes(" ")) {
      return lowerText.includes(word);
    }

    return new RegExp(`\\b${word}\\b`, "i").test(lowerText);
  });
}

function findAiTellPhrases(text) {
  const lowerText = stripMarkdown(text).toLowerCase();
  return AI_TELL_PHRASES.filter((phrase) => lowerText.includes(phrase));
}

function splitSentences(text) {
  return stripMarkdown(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function hasShortSentence(text) {
  return splitSentences(text).some((sentence) => tokenize(sentence).length > 0 && tokenize(sentence).length <= 7);
}

function hasLongSentence(text) {
  return splitSentences(text).some((sentence) => tokenize(sentence).length >= 25);
}

function hasConcreteDetail(text) {
  return /\b\d+\b/.test(text) || /\b(GQ|Reddit|Nike|Levi's|Uniqlo|Zara|J\.Crew|Princeton|Hertfordshire)\b/i.test(text);
}

function countWords(markdown) {
  const plainText = stripMarkdown(markdown);

  if (!plainText) {
    return 0;
  }

  return plainText.split(/\s+/).filter(Boolean).length;
}

function firstSentence(text) {
  const match = text.match(/(.+?[.!?])(\s|$)/);
  return match ? match[1].trim() : text.trim();
}

function canonicalUrl(slug) {
  return `https://stylescore.live/blog/${slug}`;
}

function ensureFaqSection(contentMarkdown, faq) {
  if (!faq || faq.length === 0) {
    return contentMarkdown.trim();
  }

  if (contentMarkdown.includes("## Frequently Asked Questions")) {
    return contentMarkdown.trim();
  }

  const faqMarkdown = [
    "## Frequently Asked Questions",
    "",
    ...faq.flatMap((item) => [`### ${item.question}`, "", item.answer, ""])
  ].join("\n");

  return `${contentMarkdown.trim()}\n\n---\n\n${faqMarkdown.trim()}`;
}

function ensureOnboardingLink(contentMarkdown) {
  if (
    contentMarkdown.includes("](/onboarding)") ||
    contentMarkdown.includes("](/blog/mens-style-test)")
  ) {
    return contentMarkdown.trim();
  }

  return `${contentMarkdown.trim()}\n\nIf you want the personal version of this instead of the generic advice, take the [StyleScore assessment](/onboarding) and see which category is actually holding your look back.`;
}

function ensureRelatedLinksSection(contentMarkdown, relatedArticles) {
  if (!relatedArticles || relatedArticles.length === 0) {
    return contentMarkdown.trim();
  }

  if (contentMarkdown.includes("## Related Articles")) {
    return contentMarkdown.trim();
  }

  const lines = [
    "## Related Articles",
    "",
    ...relatedArticles.map((article) => `- [${article.title}](${article.href})`)
  ];

  return `${contentMarkdown.trim()}\n\n${lines.join("\n")}`;
}

function validateArticlePayload(article, queueEntry) {
  const errors = [];
  const primaryKeyword = (article.primary_keyword || queueEntry.keyword || "").toLowerCase();
  const contentMarkdown = article.content_markdown || "";
  const wordCount = article.word_count || countWords(contentMarkdown);
  const firstChunk = stripMarkdown(contentMarkdown).slice(0, 600).toLowerCase();
  const h1 = article.h1 || "";
  const internalLinks = Array.isArray(article.internal_links) ? article.internal_links : [];
  const externalLinks = Array.isArray(article.external_links) ? article.external_links : [];
  const faq = Array.isArray(article.faq) ? article.faq : [];
  const bannedInContent = findBannedWords(contentMarkdown);
  const aiTells = findAiTellPhrases(contentMarkdown);

  if (wordCount < 800) {
    errors.push(`Word count too low: ${wordCount}`);
  }

  if (!hasKeywordCoverage(h1, primaryKeyword)) {
    errors.push("Primary keyword missing from H1");
  }

  if (!hasKeywordCoverage(firstChunk, primaryKeyword)) {
    errors.push("Primary keyword missing from first 100 words");
  }

  if (faq.length < 4) {
    errors.push(`Not enough FAQ items: ${faq.length}`);
  }

  if (internalLinks.length < 1) {
    errors.push("Missing required internal link");
  }

  if (externalLinks.length < 2) {
    errors.push("Need at least 2 external links");
  }

  if (bannedInContent.length > 0) {
    errors.push(`Banned words present: ${bannedInContent.join(", ")}`);
  }

  if (aiTells.length > 0) {
    errors.push(`AI tell phrases present: ${aiTells.join(", ")}`);
  }

  if (!hasShortSentence(contentMarkdown)) {
    errors.push("Need at least one short punchy sentence");
  }

  if (!hasLongSentence(contentMarkdown)) {
    errors.push("Need at least one longer explanatory sentence");
  }

  if (!hasConcreteDetail(contentMarkdown)) {
    errors.push("Need at least one concrete detail such as a number, brand, or study");
  }

  return errors;
}

function deriveCategory(cluster) {
  return cluster
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildCtaHeadline(cluster) {
  const headlineMap = {
    "fit-proportion": "Find out whether your fit is costing you points.",
    footwear: "See whether your shoe choices are helping or hurting.",
    grooming: "Find out whether grooming is doing enough heavy lifting.",
    wardrobe: "See whether your wardrobe foundations are actually strong enough.",
    "color-coordination": "Get clear on whether your outfit coordination is working.",
    "occasion-dressing": "See whether you're dressing right for the room.",
    "body-type": "Find out whether your build is being styled well or wasted.",
    "style-self-assessment": "Get the objective version of your style, not the guess.",
    "common-style-problems": "Find the one category dragging your whole look down.",
    "age-specific": "See which style category matters most for your current stage."
  };

  return headlineMap[cluster] || "Get the personal version of this advice.";
}

function buildCtaBody(cluster) {
  const category = deriveCategory(cluster).toLowerCase();
  return `Take the free StyleScore assessment and see how your ${category} choices stack up across fit, shoes, grooming, wardrobe, color coordination, and occasion dressing.`;
}

function ensureStyleScoreSuffix(title) {
  return title.endsWith(" | StyleScore") ? title : `${title} | StyleScore`;
}

function chooseRelatedArticles(config, cluster, currentSlug, limit = 3) {
  const clusterArticles = config.clusters[cluster] || [];
  const candidates = clusterArticles
    .filter((article) => article.slug !== currentSlug)
    .sort((left, right) => {
      if (left.role !== right.role) {
        return left.role === "pillar" ? -1 : 1;
      }

      return (right.publishedAt || "").localeCompare(left.publishedAt || "");
    });

  const selected = candidates.slice(0, limit);

  if (selected.length >= limit) {
    return selected;
  }

  const fallbackArticles = (config.clusters["style-self-assessment"] || []).filter(
    (article) =>
      article.slug !== currentSlug &&
      !selected.some((selectedArticle) => selectedArticle.slug === article.slug)
  );

  return [...selected, ...fallbackArticles.slice(0, limit - selected.length)];
}

function buildGeneratedArticleRecord(article, queueEntry, relatedArticles, publicationDate) {
  const contentWithSupportSections = ensureRelatedLinksSection(
    ensureFaqSection(ensureOnboardingLink(article.content_markdown), article.faq),
    relatedArticles
  );
  const normalizedTitle = ensureStyleScoreSuffix(article.title);
  const description = article.meta_description.trim();
  const internalLinks = new Set(article.internal_links || []);
  const externalLinks = new Set(article.external_links || []);

  internalLinks.add("/onboarding");
  relatedArticles.forEach((relatedArticle) => internalLinks.add(relatedArticle.href));

  return {
    slug: queueEntry.slug,
    title: normalizedTitle,
    heading: article.h1.trim(),
    description,
    cardDescription: firstSentence(description),
    ctaHeadline: buildCtaHeadline(queueEntry.cluster),
    ctaBody: buildCtaBody(queueEntry.cluster),
    content: contentWithSupportSections,
    author: "StyleScore Editorial",
    category: deriveCategory(queueEntry.cluster),
    publishedAt: publicationDate,
    updatedAt: publicationDate,
    readingTime: `${Math.max(4, Math.round((article.word_count || countWords(contentWithSupportSections)) / 200))} min read`,
    primaryKeyword: article.primary_keyword || queueEntry.keyword,
    secondaryKeywords: article.secondary_keywords || queueEntry.secondaryKeywords || [],
    internalLinks: [...internalLinks],
    externalLinks: [...externalLinks],
    wordCount: countWords(contentWithSupportSections),
    faq: article.faq,
    status: "published"
  };
}

function updateQueueEntryAfterPublish(config, record) {
  const queueEntry = getQueueEntry(config, { slug: record.slug });

  if (queueEntry) {
    queueEntry.status = "published";
    queueEntry.publishedAt = record.publishedAt;
    queueEntry.updatedAt = record.updatedAt;
    queueEntry.title = record.title;
  }

  const clusterArticles = config.clusters[queueEntry.cluster] || [];
  const alreadyPresent = clusterArticles.some((article) => article.slug === record.slug);

  if (!alreadyPresent) {
    clusterArticles.unshift({
      slug: record.slug,
      title: record.heading,
      href: `/blog/${record.slug}`,
      description: record.cardDescription,
      role: "supporting",
      publishedAt: record.publishedAt
    });
    config.clusters[queueEntry.cluster] = clusterArticles;
  }
}

function updateRelatedArticlesManifest(record, relatedArticles) {
  ensureDir(path.dirname(relatedArticlesPath));

  const manifest = fs.existsSync(relatedArticlesPath)
    ? readJson(relatedArticlesPath)
    : { links: {} };

  manifest.links[record.slug] = relatedArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
    href: article.href,
    description: article.description
  }));

  const currentArticleReference = {
    slug: record.slug,
    title: record.heading,
    href: `/blog/${record.slug}`,
    description: record.cardDescription
  };

  relatedArticles.forEach((article) => {
    const existing = manifest.links[article.slug] || [];
    const deduped = [currentArticleReference, ...existing].filter(
      (item, index, collection) =>
        collection.findIndex((candidate) => candidate.slug === item.slug) === index
    );
    manifest.links[article.slug] = deduped.slice(0, 3);
  });

  writeJson(relatedArticlesPath, manifest);
  return relatedArticles.map((article) => article.slug);
}

module.exports = {
  buildGeneratedArticleRecord,
  canonicalUrl,
  chooseRelatedArticles,
  ensureDir,
  generatedArticlesDir,
  getQueueEntry,
  loadKeywordsConfig,
  parseArgs,
  readJson,
  saveKeywordsConfig,
  selectNextQueueEntry,
  updateQueueEntryAfterPublish,
  updateRelatedArticlesManifest,
  validateArticlePayload,
  writeJson
};
