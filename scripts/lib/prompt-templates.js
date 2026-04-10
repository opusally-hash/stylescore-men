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
  "one of the key",
  "you're not alone",
  "let's dig into",
  "the point is not",
  "the goal is not",
  "the real shift"
];

const SYSTEM_PROMPT = `You are the editorial voice of StyleScore, a men's style platform with a direct, practical, no-bullshit tone.

Voice rules:
- Write like a sharp friend who understands real-world menswear
- Use contractions naturally
- Make specific observations instead of vague style advice
- Meet men where they are; assume they want sharper results, not fashion theater
- Give opinions with confidence
- Weave the StyleScore assessment in naturally instead of sounding salesy
- Make the article sound like it could only belong to this exact keyword and this exact audience

Never do these things:
- Never open with a dictionary definition
- Never use the phrases "In conclusion" or "In this article"
- Never use these words: crucial, paramount, elevate, curate, effortless, timeless, versatile
- Avoid filler, passive voice, and robotic summaries
- Never pad an article with generic advice that could be pasted into a different menswear post unchanged

Structure:
1. Hook with a real situation
2. Explain why it matters
3. Build 5-7 H2 sections that each make one clear point
4. Back specific claims with named sources, measurements, or concrete examples
5. Include one natural internal CTA to the StyleScore funnel
6. End with a 4-6 question FAQ optimized for featured snippets

Humanity requirements:
- Include one line that disagrees with generic style advice
- Include one self-aware line that acknowledges most men do not want to obsess over clothes
- Include at least one concrete detail such as a measurement, price, study result, brand, or scenario
- Vary sentence rhythm with short punchy lines and longer explanatory sentences
- FAQ answers should be concise and should not repeat body copy verbatim`;

function buildArticlePrompt({
  keyword,
  slug,
  articleFormat,
  secondaryKeywords,
  editorialAngle,
  siblingArticles = [],
  mustCover = [],
  mustAvoid = []
}) {
  return `Write a complete SEO-optimized blog article for stylescore.live.

Article brief:
- Primary keyword: ${keyword}
- Secondary keywords: ${secondaryKeywords.join(", ")}
- Article format: ${articleFormat}
- Target word count: 1,200-1,450 words
- Target URL: https://stylescore.live/blog/${slug}
- Audience: men aged 25-45 who want practical style improvement
- Editorial angle: ${editorialAngle || "Make the advice concrete, specific, and clearly different from generic menswear roundup content."}
- Existing related posts in this cluster you must not echo: ${siblingArticles.length > 0 ? siblingArticles.join("; ") : "none yet"}
- Must cover: ${mustCover.length > 0 ? mustCover.join("; ") : "specific outfit formulas, fit calls, and examples that make the advice feel grounded"}
- Must avoid: ${mustAvoid.length > 0 ? mustAvoid.join("; ") : "generic filler, repeated headings, and advice that could fit any article on menswear"}

SEO requirements:
- Primary keyword must appear in the H1, first 100 words, and at least 2 H2s
- The title and H1 should read like a natural editorial headline, not a raw keyword string
- Include at least one natural internal link to /assessment or a relevant /blog article
- Include at least 3 inline external links to real authoritative sources inside the article body
- Include 3-5 source references in the sources array and make sure they match the links actually used in the body
- Do not include a FAQ section, Sources section, or Related Articles section inside content_markdown
- Do not include a section called conclusion
- Avoid AI phrases such as "When it comes to" and "It's important to"
- Add one sentence that pushes back on bad conventional style advice
- Add one self-aware sentence acknowledging most men do not want to spend all day thinking about clothes
- Include at least one concrete detail such as a price, measurement, study result, or named brand
- Make the body materially different from other StyleScore posts on adjacent topics. Do not recycle the same section order, hook, or advice phrasing.
- Build at least 5 H2 sections.
- FAQ items must be 4-6 total, answer the keyword directly, and be phrased differently from the body.
- If a paragraph could fit another StyleScore article by swapping a few nouns, rewrite it until it feels specific.

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

function buildHumanizationPrompt(articleJson, siblingArticles = []) {
  return `You are editing an AI-written StyleScore article so it sounds genuinely human.

Tasks:
- Remove AI tells like "When it comes to", "It's important to", and vague filler
- Replace banned words with sharper, more specific language
- Add one moment that pushes back on generic style advice
- Add one moment that acknowledges most men do not want to spend all weekend thinking about clothes
- Vary sentence rhythm with a few short punchy lines and a few longer explanatory ones
- Make sure the article includes at least one concrete detail such as a measurement, price, brand, or study result
- Make sure the body stays within roughly 1,200-1,450 words and does not contain FAQ, Sources, or Related Articles sections
- Make the article feel distinct from these sibling posts: ${siblingArticles.length > 0 ? siblingArticles.join("; ") : "none yet"}
- Rewrite any paragraph that sounds like generic menswear filler or could be pasted into another age/style article unchanged
- Make sure FAQ answers are concise and not copies of body paragraphs
- Keep the same JSON structure

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

function buildRepairPrompt({ articleJson, queueEntry, validationErrors, siblingArticles = [] }) {
  return `You are fixing a generated StyleScore article JSON that failed validation.

Validation errors:
- ${validationErrors.join("\n- ")}

Requirements you must satisfy:
- The H1 must clearly contain the primary keyword: ${queueEntry.keyword}
- If the raw keyword sounds awkward, rewrite it into a clean editorial H1 while still covering the main terms naturally
- The first 100 words of content_markdown must include the primary keyword naturally
- Keep content_markdown between 1,100 and 1,500 words
- content_markdown must not contain FAQ, Sources, or Related Articles headings or embedded Q&A blocks
- Remove every banned word: crucial, paramount, elevate, curate, effortless, timeless, versatile, "In conclusion", "In this article"
- Remove AI tell phrases such as: ${AI_TELL_PHRASES.join(", ")}
- Preserve or add at least one disagreement with generic style advice
- Preserve or add at least one self-aware line that sounds like a real person talking
- Preserve or add at least one concrete detail such as a number, brand, price, or study result
- Preserve or add at least 3 strong source references in the sources array and keep their URLs in external_links
- Make the article clearly different from these sibling posts: ${siblingArticles.length > 0 ? siblingArticles.join("; ") : "none yet"}
- Preserve or add at least 5 real H2 sections in the article body
- FAQ answers must stay concise and should not copy the wording of body paragraphs
- Keep the same JSON shape
- Preserve the article's overall meaning and format
- Keep FAQ, sources, internal_links, and external_links intact unless you need a small correction to satisfy validation

Return only valid JSON.

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

function buildExpansionPrompt({ articleJson, queueEntry, validationErrors, siblingArticles = [] }) {
  return `You are doing a final rescue pass on a StyleScore article JSON that is still too weak to publish.

Current failures:
- ${validationErrors.join("\n- ")}

Your job:
- Expand the article into a complete publishable draft, not a light revision
- Keep the same topic and keyword: ${queueEntry.keyword}
- Make sure content_markdown ends between 1,150 and 1,450 words
- Add enough real H2 sections so the article has at least 5
- Add at least one natural inline internal link to /assessment or a strongly relevant /blog page
- Add 4-6 FAQ items if the article currently has too few
- Add or preserve 3-5 real source references and make sure at least 3 of them appear as inline links in the body
- Remove any embedded FAQ/source/related-articles sections from content_markdown
- Make the article clearly different from these sibling posts: ${siblingArticles.length > 0 ? siblingArticles.join("; ") : "none yet"}
- Keep the tone direct, specific, and human
- Do not summarize. Fully rewrite weak sections if needed.

Return only valid JSON in the same shape.

Article JSON:
${JSON.stringify(articleJson, null, 2)}`;
}

module.exports = {
  AI_TELL_PHRASES,
  BANNED_WORDS,
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt,
  buildRepairPrompt,
  buildExpansionPrompt
};
