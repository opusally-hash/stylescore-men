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
  const shortMenCount = Math.ceil(requestedCount / 2);
  const generalCount = requestedCount - shortMenCount;

  const published = [
    ...generatedArticles.map((a) => `- [${a.cluster}] "${a.primaryKeyword}" (${a.slug})`),
    ...legacySlugs.map((s) => `- [legacy] ${s}`)
  ].join("\n");

  const queued = queuedKeywords
    .filter((k) => k.status !== "published")
    .map((k) => `- [${k.cluster}] "${k.keyword}"`)
    .join("\n");

  return `You are the content strategist for StyleScore, a men's style platform. StyleScore's core audience is shorter men (5'4–5'8) but it covers all men's style topics. The site's voice is direct, practical, no-bullshit.

## WHAT ALREADY EXISTS (do not duplicate or closely overlap)
${published}

## ALREADY QUEUED (do not duplicate)
${queued || "none"}

---

## YOUR TASK

Return exactly ${requestedCount} article ideas split as follows:
- **${shortMenCount} articles** with cluster "short-men-style"
- **${generalCount} articles** across all other clusters

---

### PART 1: ${shortMenCount} SHORT-MEN-STYLE ARTICLES

Short men (5'4–5'8) have a massive underserved content need. Go beyond garment-by-garment guides. Think about every dimension of a shorter man's style life:

**Height-specific guides**
- 5'4, 5'5, 5'6, 5'7, 5'8 — each height has subtly different fit challenges
- Short men with specific builds: slim, stocky, barrel chest, athletic/muscular, lean

**Garments not yet covered**
- Coats and overcoats (a short man in a long coat is a different problem from a suit)
- Leather jackets and bomber jackets (jacket length is critical)
- Button-down shirts (shirt tail length, sleeve length)
- Knitwear and sweaters (hem length, bulk)
- Shorts (length, rise, proportion)
- Polos (body length, collar proportion)
- Swimwear (trunk length, waistband placement)
- Chinos specifically (not just inseam — cut, rise, taper)
- T-shirts (hem length, shoulder width)
- Boots specifically (shaft height, heel, toe box)

**Occasions not yet covered**
- Winter/layering (how short men layer without adding bulk)
- Spring/transitional outfits
- Casual weekend outfits (not occasion-specific)
- Date night (not black tie — casual/smart casual)
- Job interview for short men
- Vacation and travel outfits
- Wedding guest (not as groom — as guest)
- Gym-to-out (not gym physique style — transitional)
- Holiday party

**Styling concepts not yet covered**
- How short men should wear oversized/relaxed clothing (it's trending)
- Vertical stripe and pattern rules (do they actually work?)
- Short men monochrome (already exists as legacy — angle it differently)
- Color blocking for short men
- Layering rules (what to layer and what makes the silhouette heavier)
- How short men should wear accessories (belt width, bag size, watch size)

**Shopping and practical**
- Best brands that cut for shorter men without petite labelling
- Alteration guide: what to alter first, what's not worth it
- Short men capsule wardrobe on a budget
- How to shop online as a short man (size charts, what measurements matter)

**Age-height intersection**
- Short men in their 20s (different challenges from 30s)
- Short men in their 40s (authority vs proportion tension)
- Short men re-entering dating

Each short-men article must have a clearly different angle from the others and from what's already published. Do NOT suggest "X for short men" if it's just a version of something already covered with a different noun.

---

### PART 2: ${generalCount} GENERAL ARTICLES

Think from the full universe of what men aged 20-50 search for. Cover gaps across:

**Garments** — knitwear, coats, outerwear, T-shirts, polos, shorts, swimwear
**Occasions** — cocktail, graduation, work from home, beach, holiday party, casual Friday
**Body types** — slim/lean, overweight, tall, barrel chest, broad shoulders, long torso
**Budget** — thrifting, investment pieces, cost-per-wear, fast fashion traps
**Fabric/care** — ironing, washing wool, storing suits, pilling prevention
**Grooming** — beard styles, skincare for men who hate skincare, haircut by face shape
**Shopping** — building a capsule wardrobe, wardrobe audit, where to shop at each budget
**Styling** — pattern mixing, how to wear bold colors, navy vs black, blazer with jeans
**Lifestyle** — work from home style, travel packing, gym-to-office, streetwear transition

No cluster should have more than 2 entries in this section.

---

Return ONLY a valid JSON array of exactly ${requestedCount} objects. No markdown, no explanation.

Each object must have:
{
  "keyword": "exact search phrase (lowercase, natural)",
  "slug": "url-slug-version",
  "priority": <number 60-89, higher = broader appeal>,
  "cluster": "short-men-style for part 1, appropriate cluster for part 2",
  "articleFormat": "how-to guide | listicle | buying guide | fit guide | comparison | outfit guide | style guide | measurement guide | occasion guide | care guide",
  "secondaryKeywords": ["3 related phrases"]
}

List the ${shortMenCount} short-men articles first, then the ${generalCount} general articles. Order each group by priority descending.`;
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
    scheduledFor: addDays(lastDate, i + 1)
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
