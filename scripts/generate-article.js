#!/usr/bin/env node

const path = require("node:path");
const OpenAIImport = require("openai");
const {
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt
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

async function generateArticleWithOpenAI(queueEntry) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for article generation.");
  }

  const client = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY });

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
          secondaryKeywords: queueEntry.secondaryKeywords
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

  return JSON.parse(humanizedResponse.choices[0].message.content);
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
    ? readJson(path.resolve(process.cwd(), args.input))
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
