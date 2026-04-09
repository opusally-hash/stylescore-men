const BANNED_WORDS = [
  "crucial",
  "paramount",
  "elevate",
  "curate",
  "effortless",
  "timeless",
  "versatile",
  "in conclusion",
  "in this article"
];

const AI_TELL_PHRASES = [
  "when it comes to",
  "it's important to",
  "for example, you might",
  "in today's world",
  "one of the key"
];

const SYSTEM_PROMPT = `You are the editorial voice of StyleScore, a men's style platform with a direct, practical, no-bullshit tone.

Voice rules:
- Write like a sharp friend who understands real-world menswear
- Use contractions naturally
- Make specific observations instead of vague style advice
- Meet men where they are; assume they want sharper results, not fashion theater
- Give opinions with confidence
- Weave the StyleScore assessment in naturally instead of sounding salesy

Never do these things:
- Never open with a dictionary definition
- Never use the phrases "In conclusion" or "In this article"
- Never use these words: crucial, paramount, elevate, curate, effortless, timeless, versatile
- Avoid filler, passive voice, and robotic summaries

Structure:
1. Hook with a real situation
2. Explain why it matters
3. Build H2 sections that each make one clear point
4. Include one natural internal CTA to the StyleScore funnel
5. End with a 4-6 question FAQ optimized for featured snippets

Humanity requirements:
- Include one line that disagrees with generic style advice
- Include one self-aware line that acknowledges most men do not want to obsess over clothes
- Include at least one concrete detail such as a measurement, price, study result, brand, or scenario
- Vary sentence rhythm with short punchy lines and longer explanatory sentences`;

function buildArticlePrompt({
  keyword,
  slug,
  articleFormat,
  secondaryKeywords,
  editorialAngle,
  mustCover = [],
  mustAvoid = []
}) {
  return `Write a complete SEO-optimized blog article for stylescore.live.

Article brief:
- Primary keyword: ${keyword}
- Secondary keywords: ${secondaryKeywords.join(", ")}
- Article format: ${articleFormat}
- Target word count: 1,100-1,400 words
- Target URL: https://stylescore.live/blog/${slug}
- Audience: men aged 25-45 who want practical style improvement
- Editorial angle: ${editorialAngle || "Make the advice concrete, specific, and clearly different from generic menswear roundup content."}
- Must cover: ${mustCover.length > 0 ? mustCover.join("; ") : "specific outfit formulas, fit calls, and examples that make the advice feel grounded"}
- Must avoid: ${mustAvoid.length > 0 ? mustAvoid.join("; ") : "generic filler, repeated headings, and advice that could fit any article on menswear"}

SEO requirements:
- Primary keyword must appear in the H1, first 100 words, and at least 2 H2s
- The title and H1 should read like a natural editorial headline, not a raw keyword string
- Include at least one natural internal link to /onboarding or /blog/mens-style-test
- Include at least 3 inline external links to real authoritative sources inside the article body
- Do not include a FAQ section, Sources section, or Related Articles section inside content_markdown
- Do not include a section called conclusion
- Avoid AI phrases such as "When it comes to" and "It's important to"
- Add one sentence that pushes back on bad conventional style advice
- Add one self-aware sentence acknowledging most men do not want to spend all day thinking about clothes
- Include at least one concrete detail such as a price, measurement, study result, or named brand
- Make the body materially different from other StyleScore posts on adjacent topics. Do not recycle the same section order, hook, or advice phrasing.

Return only valid JSON with this shape:
{
  "slug": "${slug}",
  "title": "Article title here",
  "meta_description": "Meta description here",
  "h1": "Exact H1 text",
  "content_markdown": "Full article in markdown",
  "faq": [
    { "question": "Question", "answer": "Answer" }
  ],
  "sources": [
    { "title": "Source title", "url": "https://example.com", "publisher": "Publisher name" }
  ],
  "internal_links": ["list of internal URLs used"],
  "external_links": ["list of external URLs used"],
  "word_count": 1250,
  "primary_keyword": "${keyword}",
  "secondary_keywords": ["${secondaryKeywords.join('", "')}"]
}`;
}

function buildHumanizationPrompt(articleJson) {
  return `You are editing an AI-written StyleScore article so it sounds genuinely human.

Tasks:
- Remove AI tells like "When it comes to", "It's important to", and vague filler
- Replace banned words with sharper, more specific language
- Add one moment that pushes back on generic style advice
- Add one moment that acknowledges most men do not want to spend all weekend thinking about clothes
- Vary sentence rhythm with a few short punchy lines and a few longer explanatory ones
- Make sure the article includes at least one concrete detail such as a measurement, price, brand, or study result
- Make sure the body stays within roughly 1,100-1,400 words and does not contain FAQ, Sources, or Related Articles sections
- Keep the same JSON structure

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

function buildRepairPrompt({ articleJson, queueEntry, validationErrors }) {
  return `You are fixing a generated StyleScore article JSON that failed validation.

Validation errors:
- ${validationErrors.join("\n- ")}

Requirements you must satisfy:
- The H1 must clearly contain the primary keyword: ${queueEntry.keyword}
- If the raw keyword sounds awkward, rewrite it into a clean editorial H1 while still covering the main terms naturally
- The first 100 words of content_markdown must include the primary keyword naturally
- Keep content_markdown between 1,000 and 1,500 words
- content_markdown must not contain FAQ, Sources, or Related Articles headings
- Remove every banned word: crucial, paramount, elevate, curate, effortless, timeless, versatile, "In conclusion", "In this article"
- Remove AI tell phrases such as: ${AI_TELL_PHRASES.join(", ")}
- Preserve or add at least one disagreement with generic style advice
- Preserve or add at least one self-aware line that sounds like a real person talking
- Preserve or add at least one concrete detail such as a number, brand, price, or study result
- Preserve or add at least 3 strong source references in the sources array and keep their URLs in external_links
- Keep the same JSON shape
- Preserve the article's overall meaning and format
- Keep FAQ, sources, internal_links, and external_links intact unless you need a small correction to satisfy validation

Return only valid JSON.

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

module.exports = {
  AI_TELL_PHRASES,
  BANNED_WORDS,
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt,
  buildRepairPrompt
};
