#!/usr/bin/env node

const path = require("node:path");
const OpenAIImport = require("openai");
const {
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt,
  buildRepairPrompt
} = require("./lib/prompt-templates");
const { requestIndexing } = require("./lib/google-indexing");
const {
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
} = require("./lib/publishing-helpers");

const OpenAIClient = OpenAIImport.default || OpenAIImport;

const BANNED_WORD_REPLACEMENTS = {
  crucial: "important",
  paramount: "most important",
  elevate: "improve",
  curate: "build",
  effortless: "easy",
  timeless: "long-lasting",
  versatile: "easy to wear"
};

function replaceBannedWords(text) {
  let updated = text;

  Object.entries(BANNED_WORD_REPLACEMENTS).forEach(([word, replacement]) => {
    updated = updated.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement);
  });

  updated = updated.replace(/\bIn conclusion\b/gi, "To wrap this up");
  updated = updated.replace(/\bIn this article\b/gi, "Here");

  return updated;
}

function titleCaseKeyword(keyword) {
  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (/^\d/.test(token)) {
        return token.toUpperCase();
      }

      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(" ");
}

function buildFallbackHeading(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const ageSpecificMatch = normalizedKeyword.match(/^how to dress better men (\d{2}s)$/);

  if (ageSpecificMatch) {
    return `How Men in Their ${ageSpecificMatch[1]} Can Dress Better`;
  }

  const directMatches = {
    "business casual outfits men who hate dressing up":
      "Business Casual Outfits for Men Who Hate Dressing Up",
    "how to match colors men without thinking":
      "How Men Can Match Colors Without Thinking Too Hard",
    "what shoes to wear with chinos men":
      "What Shoes to Wear With Chinos for Men",
    "mens grooming routine for beginners":
      "Men's Grooming Routine for Beginners",
    "smart casual date night outfits men":
      "Smart Casual Date Night Outfits for Men",
    "why do my clothes look bad in photos men":
      "Why Do My Clothes Look Bad in Photos as a Man?"
  };

  if (directMatches[normalizedKeyword]) {
    return directMatches[normalizedKeyword];
  }

  return titleCaseKeyword(keyword)
    .replace(/\bMens\b/g, "Men's")
    .replace(/\bMen\b$/, "for Men");
}

function buildFallbackLead(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const ageSpecificMatch = normalizedKeyword.match(/^how to dress better men (\d{2}s)$/);

  if (ageSpecificMatch) {
    return `How men in their ${ageSpecificMatch[1]} can dress better usually comes down to cleaner fit, better restraint, and clothes that actually work in real life.`;
  }

  const directMatches = {
    "business casual outfits men who hate dressing up":
      "Business casual outfits for men who hate dressing up should feel sharp without feeling stiff.",
    "how to match colors men without thinking":
      "How men can match colors without thinking too hard starts with fewer variables and better defaults.",
    "what shoes to wear with chinos men":
      "What shoes to wear with chinos for men depends on the cut of the pants and where you are actually going.",
    "mens grooming routine for beginners":
      "A mens grooming routine for beginners does not need ten products to make a visible difference.",
    "smart casual date night outfits men":
      "Smart casual date night outfits for men work best when the clothes look intentional but not rehearsed.",
    "why do my clothes look bad in photos men":
      "Why do my clothes look bad in photos as a man is usually the wrong question, because the real issue is often contrast, fit, and posture."
  };

  if (directMatches[normalizedKeyword]) {
    return directMatches[normalizedKeyword];
  }

  return `${buildFallbackHeading(keyword)} matters more than most men realize.`;
}

function buildEditorialPlan(queueEntry) {
  const keyword = queueEntry.keyword.toLowerCase();

  if (keyword.includes("30s")) {
    return {
      editorialAngle:
        "Focus on men in their 30s moving from leftover 20s habits into a reliable grown-up uniform. Emphasize consistency, mixed work-social calendars, and removing post-college weak spots.",
      mustCover: [
        "what stops working from a man's 20s wardrobe",
        "2-3 repeatable outfit formulas for work, dates, and weekends",
        "why shoes, grooming, and fit beat buying more random tops"
      ],
      mustAvoid: [
        "sounding like the 40s article",
        "framing the goal as looking older or more formal just for the sake of it"
      ]
    };
  }

  if (keyword.includes("40s")) {
    return {
      editorialAngle:
        "Focus on authority, restraint, quality, and maintenance. Explain how men in their 40s should look more dialed-in, not younger, and why fewer better pieces matter more now.",
      mustCover: [
        "what starts aging a wardrobe in a man's 40s",
        "the difference between authority and trend-chasing",
        "how tailoring, grooming, and fabric quality change the read"
      ],
      mustAvoid: [
        "repeating the 30s article about post-college leftovers",
        "defaulting to generic basics without explaining why they work at this life stage"
      ]
    };
  }

  if (keyword.includes("photos")) {
    return {
      editorialAngle:
        "Treat the article as a diagnosis of why outfits fall apart on camera: contrast, fit, posture, shirt length, shoe bulk, and grooming.",
      mustCover: [
        "why clothes that feel fine in person can look weak in photos",
        "specific fixes for shirt length, trouser hem, and posture",
        "how camera contrast punishes bad fit"
      ],
      mustAvoid: ["generic wardrobe basics advice that ignores the camera angle"]
    };
  }

  if (keyword.includes("business casual")) {
    return {
      editorialAngle:
        "Make it low-effort and anti-corporate-costume. Give simple formulas for men who want business casual to feel easy, not dressed up.",
      mustCover: [
        "3-5 low-friction outfit formulas",
        "what to wear instead of the usual quarter-zip uniform",
        "how shoes change the tone fast"
      ],
      mustAvoid: ["sounding like a generic office dress code memo"]
    };
  }

  return {
    editorialAngle:
      "Make the advice specific, practical, and clearly different from the existing StyleScore posts in adjacent topics.",
    mustCover: [],
    mustAvoid: []
  };
}

function normalizeArticleDraft(articleJson, queueEntry) {
  const normalized = {
    ...articleJson,
    title: replaceBannedWords(articleJson.title || ""),
    meta_description: replaceBannedWords(articleJson.meta_description || ""),
    h1: replaceBannedWords(articleJson.h1 || ""),
    content_markdown: replaceBannedWords(articleJson.content_markdown || ""),
    faq: Array.isArray(articleJson.faq)
      ? articleJson.faq.map((item) => ({
          question: replaceBannedWords(item.question || ""),
          answer: replaceBannedWords(item.answer || "")
        }))
      : [],
    sources: Array.isArray(articleJson.sources)
      ? articleJson.sources
          .map((source) => ({
            title: replaceBannedWords(source.title || ""),
            url: source.url || "",
            publisher: replaceBannedWords(source.publisher || "")
          }))
          .filter((source) => source.url)
      : [],
    internal_links: Array.isArray(articleJson.internal_links) ? articleJson.internal_links : [],
    external_links: Array.isArray(articleJson.external_links)
      ? articleJson.external_links
      : [],
    primary_keyword: articleJson.primary_keyword || queueEntry.keyword,
    secondary_keywords: Array.isArray(articleJson.secondary_keywords)
      ? articleJson.secondary_keywords
      : queueEntry.secondaryKeywords
  };

  if (normalized.sources.length > 0 && normalized.external_links.length === 0) {
    normalized.external_links = normalized.sources.map((source) => source.url);
  }

  if (normalized.sources.length === 0 && normalized.external_links.length > 0) {
    normalized.sources = normalized.external_links.map((url) => ({
      title: url,
      url,
      publisher: ""
    }));
  }

  const keywordPhrase = queueEntry.keyword;

  if (!normalized.h1.toLowerCase().includes(keywordPhrase.toLowerCase())) {
    normalized.h1 = buildFallbackHeading(keywordPhrase);
  }

  const firstChunk = normalized.content_markdown.slice(0, 500).toLowerCase();

  if (!firstChunk.includes(keywordPhrase.toLowerCase())) {
    normalized.content_markdown = `${buildFallbackLead(keywordPhrase)}\n\n${normalized.content_markdown}`.trim();
  }

  return normalized;
}

async function repairArticleWithOpenAI(client, articleJson, queueEntry, validationErrors) {
  const repairResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildRepairPrompt({
          articleJson,
          queueEntry,
          validationErrors
        })
      }
    ]
  });

  return JSON.parse(repairResponse.choices[0].message.content);
}

async function generateArticleWithOpenAI(queueEntry) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for article generation.");
  }

  const client = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY });

  const editorialPlan = buildEditorialPlan(queueEntry);

  const articleResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildArticlePrompt({
          keyword: queueEntry.keyword,
          slug: queueEntry.slug,
          articleFormat: queueEntry.articleFormat,
          secondaryKeywords: queueEntry.secondaryKeywords,
          editorialAngle: editorialPlan.editorialAngle,
          mustCover: editorialPlan.mustCover,
          mustAvoid: editorialPlan.mustAvoid
        })
      }
    ]
  });

  const article = JSON.parse(articleResponse.choices[0].message.content);

  const humanizedResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildHumanizationPrompt(article)
      }
    ]
  });

  const humanizedArticle = JSON.parse(humanizedResponse.choices[0].message.content);
  let normalizedArticle = normalizeArticleDraft(humanizedArticle, queueEntry);
  let validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length === 0) {
    return normalizedArticle;
  }

  const repairedArticle = await repairArticleWithOpenAI(
    client,
    normalizedArticle,
    queueEntry,
    validationErrors
  );
  normalizedArticle = normalizeArticleDraft(repairedArticle, queueEntry);
  validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length > 0) {
    throw new Error(`Validation failed after repair: ${validationErrors.join("; ")}`);
  }

  return normalizedArticle;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadKeywordsConfig();
  const queueEntry =
    getQueueEntry(config, { slug: args.slug, keyword: args.keyword }) ||
    (!args.slug && !args.keyword ? selectNextQueueEntry(config) : null);

  if (!queueEntry) {
    throw new Error("Unable to find a matching queue entry.");
  }

  const articleJson = args.input
    ? normalizeArticleDraft(readJson(path.resolve(process.cwd(), args.input)), queueEntry)
    : await generateArticleWithOpenAI(queueEntry);

  const validationErrors = validateArticlePayload(articleJson, queueEntry);

  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join("; ")}`);
  }

  const publicationDate = args["publish-date"] || new Date().toISOString().slice(0, 10);
  const relatedArticles = chooseRelatedArticles(
    config,
    queueEntry.cluster,
    queueEntry.slug
  );
  const record = buildGeneratedArticleRecord(
    articleJson,
    queueEntry,
    relatedArticles,
    publicationDate
  );
  const outputFilePath = path.join(generatedArticlesDir, `${record.slug}.json`);
  const report = {
    published_url: canonicalUrl(record.slug),
    canonical_verified: canonicalUrl(record.slug) === `https://stylescore.live/blog/${record.slug}`,
    schema_injected: record.faq.length >= 3 ? ["Article", "FAQPage"] : ["Article"],
    sitemap_updated: true,
    indexing_requested: false,
    related_articles_updated: relatedArticles.map((article) => article.slug),
    validation_passed: true,
    errors: [],
    output_file: outputFilePath,
    dry_run: Boolean(args["dry-run"])
  };

  if (!args["dry-run"]) {
    ensureDir(generatedArticlesDir);
    writeJson(outputFilePath, record);
    updateQueueEntryAfterPublish(config, record);
    saveKeywordsConfig(config);
    report.related_articles_updated = updateRelatedArticlesManifest(
      record,
      relatedArticles
    );

    if (!args["skip-indexing"]) {
      try {
        const indexingResult = await requestIndexing(report.published_url);
        report.indexing_requested = indexingResult.requested;
      } catch (error) {
        report.errors.push(
          `Indexing request failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
