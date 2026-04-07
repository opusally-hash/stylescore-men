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
5. End with a 4-6 question FAQ optimized for featured snippets`;

function buildArticlePrompt({
  keyword,
  slug,
  articleFormat,
  secondaryKeywords
}) {
  return `Write a complete SEO-optimized blog article for stylescore.live.

Article brief:
- Primary keyword: ${keyword}
- Secondary keywords: ${secondaryKeywords.join(", ")}
- Article format: ${articleFormat}
- Target word count: 1,500-2,000 words
- Target URL: https://stylescore.live/blog/${slug}
- Audience: men aged 25-45 who want practical style improvement

SEO requirements:
- Primary keyword must appear in the H1, first 100 words, and at least 2 H2s
- Include at least one natural internal link to /onboarding or /blog/mens-style-test
- Include 2-3 external links to real authoritative sources
- End with a 4-6 question FAQ section with 40-60 word answers
- Do not include a section called conclusion

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
  "internal_links": ["list of internal URLs used"],
  "external_links": ["list of external URLs used"],
  "word_count": 1650,
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
- The first 100 words of content_markdown must include the primary keyword naturally
- Remove every banned word: crucial, paramount, elevate, curate, effortless, timeless, versatile, "In conclusion", "In this article"
- Keep the same JSON shape
- Preserve the article's overall meaning and format
- Keep FAQ, internal_links, and external_links intact unless you need a small correction to satisfy validation

Return only valid JSON.

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

module.exports = {
  BANNED_WORDS,
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt,
  buildRepairPrompt
};
