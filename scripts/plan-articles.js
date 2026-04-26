#!/usr/bin/env node

/**
 * Analyzes existing content coverage and uses Claude to identify gaps,
 * then populates keywords.json with a diverse, non-repetitive article queue.
 *
 * Usage:
 *   node scripts/plan-articles.js [--dry-run] [--count 20]
 */

const fs = require("node:fs");
const path = require("node:path");
const { loadKeywordsConfig, saveKeywordsConfig, parseArgs } = require("./lib/publishing-helpers");

const rootDir = path.resolve(__dirname, "..");
const generatedArticlesDir = path.join(rootDir, "content", "generated-articles");
const appBlogDir = path.join(rootDir, "app", "blog");
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

function getApiKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
}

function getModel() {
  return process.env.ANTHROPIC_MODEL || process.env.CLAUDE_MODEL || "claude-sonnet-4-5";
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getGeneratedArticles() {
  if (!fs.existsSync(generatedArticlesDir)) return [];
  return fs
    .readdirSync(generatedArticlesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const article = readJson(path.join(generatedArticlesDir, f));
      return {
        slug: article.slug,
        title: article.title,
        primaryKeyword: article.primary_keyword,
        cluster: article.cluster,
        secondaryKeywords: article.secondary_keywords || []
      };
    });
}

function getLegacyArticleSlugs() {
  if (!fs.existsSync(appBlogDir)) return [];
  return fs
    .readdirSync(appBlogDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "[slug]" && d.name !== "_components" && d.name !== "_lib")
    .map((d) => d.name);
}

function getQueuedKeywords(config) {
  return config.queue.map((entry) => ({
    keyword: entry.keyword,
    slug: entry.slug,
    cluster: entry.cluster,
    status: entry.status
  }));
}

function getLastScheduledDate(config) {
  const dates = config.queue
    .map((e) => e.scheduledFor)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1] || new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function callClaude(prompt) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set.");

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 8000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Claude API error: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const text = (payload.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Claude did not return a JSON array.");
  return JSON.parse(text.slice(start, end + 1));
}

function buildGapAnalysisPrompt({ generatedArticles, legacySlugs, queuedKeywords, requestedCount }) {
  const published = [
    ...generatedArticles.map((a) => `- [${a.cluster}] "${a.primaryKeyword}" (${a.slug})`),
    ...legacySlugs.map((s) => `- [legacy] ${s}`)
  ].join("\n");

  const queued = queuedKeywords
    .filter((k) => k.status !== "published")
    .map((k) => `- [${k.cluster}] "${k.keyword}"`)
    .join("\n");

  return `You are the content strategist for StyleScore, a men's style platform targeting men aged 20-50 who want to dress better but don't want to become fashion obsessives.

Editorial voice: direct, practical, no-bullshit. Like a sharp friend who understands real clothes.

## WHAT ALREADY EXISTS (do not duplicate or closely overlap)
${published}

## ALREADY QUEUED (do not duplicate)
${queued || "none"}

## YOUR TASK

Think from first principles. Forget the existing list for a moment. Ask: what are ALL the things men aged 20-50 search for when they want to dress better? Then find the ones not covered above.

Consider every dimension of men's style needs:

**Audience segments** — students, first-job men, professionals, dads, men re-entering dating, men who just lost weight, men moving cities, men attending their first formal event, men who work from home, men who travel for work, men who lift

**Garment categories** — shirts, trousers, jeans, suits, outerwear (coats, jackets), knitwear, T-shirts, polos, shorts, swimwear, underwear, socks, accessories (belts, watches, bags, sunglasses, hats, ties, pocket squares)

**Occasions** — job interview, wedding guest, funeral, graduation, first date, work from home, black tie, casual Friday, weekend brunch, travel, gym, outdoor events, holiday parties, beach, summer BBQ

**Style problems** — clothes that don't fit, looking sloppy despite spending money, dressing age-appropriately, transitioning between dress codes, looking overdressed or underdressed, shopping confusion, wardrobe that doesn't work together

**Body types** — slim/lean, athletic/muscular, tall, overweight/larger, barrel chest, long torso, short legs (not just short overall)

**Budget tiers** — budget shopping, fast fashion traps, investment pieces, thrift/secondhand, cost-per-wear thinking

**Fabric and care** — how to wash, iron, store, repair common garments; wool, cotton, linen, synthetic blends; pilling, fading, shrinking; dry cleaning myths

**Seasonal and climate** — winter layering, summer heat, transitional weather, dressing for rain, cold-weather formality

**Grooming adjacents** — haircut styles, beard styles, skincare for men who hate skincare, fragrance basics, nail care

**Color and styling** — pattern mixing, navy vs black, when to wear white, how to wear bold colors, neutral wardrobes

**Shopping and wardrobe building** — capsule wardrobe by lifestyle, where to shop at each budget, how to thrift, when to invest vs save, wardrobe audits, selling old clothes

**Cultural and lifestyle** — streetwear to smart casual transition, dressing professionally in a casual industry, remote-work style, travel packing light, style for different climates

Now return exactly ${requestedCount} article ideas that fill real gaps across this full landscape. Requirements:

1. Cover at least 8 different clusters — spread wide, no cluster should have more than 3 entries
2. Include a mix of high-volume beginner topics AND specific niche topics with clear intent
3. Every keyword must target a real search phrase a man would actually type
4. No topic should closely overlap with anything already published or queued
5. Prioritize topics where the StyleScore voice (direct, practical) has a clear advantage over generic magazine content

Use these clusters (or invent a new one if it genuinely fits better):
short-men-style | age-specific | occasion-dressing | footwear | grooming | color-coordination | common-style-problems | fit-proportion | wardrobe | body-type | accessories | seasonal | fabric-care | lifestyle | budget | outerwear | knitwear

Return ONLY a valid JSON array. No markdown, no explanation. Each object must have:
{
  "keyword": "exact search phrase (lowercase, natural)",
  "slug": "url-slug-version",
  "priority": <number 60-89>,
  "cluster": "cluster-name",
  "articleFormat": "one of: how-to guide | listicle | buying guide | fit guide | comparison | outfit guide | style guide | measurement guide | occasion guide | care guide",
  "secondaryKeywords": ["3 related phrases"]
}

Order by priority descending. Assign higher priority to topics with broader search appeal.`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = Boolean(args["dry-run"]);
  const requestedCount = parseInt(args.count || "20", 10);

  const config = loadKeywordsConfig();
  const generatedArticles = getGeneratedArticles();
  const legacySlugs = getLegacyArticleSlugs();
  const queuedKeywords = getQueuedKeywords(config);

  console.error(`Analyzing ${generatedArticles.length} generated articles, ${legacySlugs.length} legacy articles, ${queuedKeywords.filter(k => k.status !== "published").length} queued...`);

  const prompt = buildGapAnalysisPrompt({
    generatedArticles,
    legacySlugs,
    queuedKeywords,
    requestedCount
  });

  console.error("Calling Claude to identify content gaps...");
  const newArticles = await callClaude(prompt);

  // Deduplicate against existing slugs
  const existingSlugs = new Set([
    ...config.queue.map((e) => e.slug),
    ...legacySlugs
  ]);

  const unique = newArticles.filter((a) => !existingSlugs.has(a.slug));

  if (unique.length < newArticles.length) {
    console.error(`Filtered ${newArticles.length - unique.length} duplicate slugs.`);
  }

  // Schedule articles 2 days apart starting after the last queued date
  const lastDate = getLastScheduledDate(config);
  const scheduled = unique.map((article, i) => ({
    keyword: article.keyword,
    slug: article.slug,
    priority: article.priority,
    status: "draft",
    cluster: article.cluster,
    articleFormat: article.articleFormat,
    secondaryKeywords: article.secondaryKeywords || [],
    scheduledFor: addDays(lastDate, (i + 1) * 2)
  }));

  if (dryRun) {
    console.log(JSON.stringify(scheduled, null, 2));
    console.error(`\nDry run: ${scheduled.length} articles would be added.`);
    return;
  }

  config.queue.push(...scheduled);
  saveKeywordsConfig(config);

  console.log(JSON.stringify({ added: scheduled.length, articles: scheduled.map((a) => a.keyword) }, null, 2));
  console.error(`\nAdded ${scheduled.length} articles to the queue.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
