import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { BlogRelatedLinks } from "./blog-related-links";
import type { BlogArticle } from "../_lib/short-men-articles";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type MarkdownBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export function buildBlogMetadata(article: BlogArticle): Metadata {
  const url = `https://stylescore.live/blog/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: article.author ? [article.author] : undefined,
      siteName: "StyleScore",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export function ArticlePage({ article }: { article: BlogArticle }) {
  const blocks = parseMarkdown(article.content);
  const topCtaIndex = getTopCtaIndex(blocks);
  const middleCtaIndex = getMiddleCtaIndex(blocks, topCtaIndex);
  const url = `https://stylescore.live/blog/${article.slug}`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.heading,
    description: article.description,
    url,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.author ?? "StyleScore Editorial",
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
  const faqJsonLd =
    article.faq && article.faq.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        })
      : null;

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <BackgroundGlow />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLd }}
        />
      ) : null}

      <div className="relative mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <a
          href="/blog"
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
        >
          Back to Blog
        </a>

        <article className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
            StyleScore Blog
          </p>

          <h1
            className={`mt-5 max-w-4xl text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            {article.heading}
          </h1>

          {article.author || article.publishedAt ? (
            <p className="mt-4 text-sm text-white/45">
              {[article.author ?? "StyleScore Editorial", formatDate(article.publishedAt)]
                .filter(Boolean)
                .join(" • ")}
            </p>
          ) : null}

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">
            {article.description}
          </p>

          <div className="mt-8 space-y-4">
            {blocks.map((block, index) => {
              const nodes: ReactNode[] = [];

              if (index === topCtaIndex) {
                nodes.push(
                  <AssessmentCtaCard
                    key="cta-top"
                    eyebrow="Start With Your Baseline"
                    headline="Get your StyleScore before you change a single outfit."
                    body="Take the fast assessment and see which category is helping you most, what is dragging your look down, and what to fix first."
                    buttonLabel="Take the Assessment"
                    tone="dark"
                  />
                );
              }

              if (index === middleCtaIndex) {
                nodes.push(
                  <AssessmentCtaCard
                    key="cta-middle"
                    eyebrow="See Your Blind Spots"
                    headline={article.ctaHeadline}
                    body={article.ctaBody}
                    buttonLabel="Get Your StyleScore"
                    tone="orange"
                  />
                );
              }

              nodes.push(renderBlock(block, index));
              return nodes;
            })}
          </div>

          <AssessmentCtaCard
            eyebrow="Ready For The Personal Version?"
            headline={article.ctaHeadline}
            body={article.ctaBody}
            buttonLabel="Get Your StyleScore ->"
            tone="orange"
            className="mt-12"
          />

          <div className="mt-10">
            <BlogRelatedLinks slug={article.slug} />
          </div>
        </article>
      </div>
    </main>
  );
}

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
      <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
    </div>
  );
}

function AssessmentCtaCard({
  eyebrow,
  headline,
  body,
  buttonLabel,
  tone,
  className = "",
}: {
  eyebrow: string;
  headline: string;
  body: string;
  buttonLabel: string;
  tone: "dark" | "orange";
  className?: string;
}) {
  if (tone === "dark") {
    return (
      <div
        className={`rounded-[1.75rem] border border-orange-300/25 bg-white/5 p-6 shadow-[0_18px_70px_rgba(15,23,42,0.35)] ${className}`.trim()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-300/80">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">{headline}</h2>
        <p className="mt-3 max-w-2xl leading-7 text-white/70">{body}</p>
        <a
          href="/onboarding"
          className="mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300"
        >
          {buttonLabel}
        </a>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[1.75rem] bg-orange-400 p-6 text-center text-black shadow-[0_20px_80px_rgba(251,146,60,0.25)] ${className}`.trim()}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/60">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold">{headline}</h2>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-black/80">{body}</p>
      <a
        href="/onboarding"
        className="mt-5 inline-flex rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-black/90"
      >
        {buttonLabel}
      </a>
    </div>
  );
}

function renderBlock(block: MarkdownBlock, index: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={`h2-${index}`}
          className="pt-4 text-3xl font-semibold text-white"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={`h3-${index}`}
          className="pt-2 text-2xl font-semibold text-white"
        >
          {block.text}
        </h3>
      );
    case "paragraph":
      return (
        <p key={`p-${index}`} className="leading-8 text-white/72">
          {renderInlineMarkdown(block.text)}
        </p>
      );
    case "unordered-list":
      return (
        <ul
          key={`ul-${index}`}
          className="list-disc space-y-2 pl-6 text-white/72"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`ul-item-${index}-${itemIndex}`}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    case "ordered-list":
      return (
        <ol
          key={`ol-${index}`}
          className="list-decimal space-y-2 pl-6 text-white/72"
        >
          {block.items.map((item, itemIndex) => (
            <li key={`ol-item-${index}-${itemIndex}`}>
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div
          key={`table-${index}`}
          className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <table className="w-full min-w-[640px] text-left text-sm text-white/72">
            <thead>
              <tr className="border-b border-white/15">
                {block.headers.map((header, headerIndex) => (
                  <th
                    key={`th-${index}-${headerIndex}`}
                    className="py-3 pr-4 font-semibold text-white"
                  >
                    {renderInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr
                  key={`tr-${index}-${rowIndex}`}
                  className="border-b border-white/10 last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`td-${index}-${rowIndex}-${cellIndex}`}
                      className="py-3 pr-4 align-top"
                    >
                      {renderInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line || line === "---") {
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }

      if (tableLines.length >= 2) {
        const headers = parseTableRow(tableLines[0]);
        const rows = tableLines
          .slice(2)
          .map(parseTableRow)
          .filter((row) => row.length > 0);

        blocks.push({ type: "table", headers, rows });
      }

      continue;
    }

    if (isListLine(line)) {
      const items: string[] = [];

      while (index < lines.length && isListLine(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (isOrderedListLine(line)) {
      const items: string[] = [];

      while (index < lines.length && isOrderedListLine(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "ordered-list", items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length) {
      const nextLine = lines[index].trim();

      if (
        !nextLine ||
        nextLine === "---" ||
        nextLine.startsWith("## ") ||
        nextLine.startsWith("### ") ||
        nextLine.startsWith("|") ||
        isListLine(nextLine) ||
        isOrderedListLine(nextLine)
      ) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        text: paragraphLines.join(" "),
      });
    }
  }

  return blocks;
}

function parseTableRow(line: string) {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function isListLine(line: string) {
  return line.startsWith("- ") || line.startsWith("* ");
}

function isOrderedListLine(line: string) {
  return /^\d+\.\s+/.test(line);
}

function getTopCtaIndex(blocks: MarkdownBlock[]) {
  const firstSectionIndex = blocks.findIndex((block) => block.type === "h2");

  if (firstSectionIndex > 0) {
    return firstSectionIndex;
  }

  return Math.min(2, blocks.length);
}

function getMiddleCtaIndex(blocks: MarkdownBlock[], topCtaIndex: number) {
  if (blocks.length <= 5) {
    return blocks.length;
  }

  const midpoint = Math.ceil(blocks.length / 2);
  const sectionIndex = blocks.findIndex(
    (block, index) => index > topCtaIndex + 1 && index >= midpoint && block.type === "h2"
  );

  if (sectionIndex !== -1) {
    return sectionIndex;
  }

  return Math.min(blocks.length - 1, Math.max(topCtaIndex + 2, midpoint));
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1] && match[2]) {
      nodes.push(
        <strong key={`inline-${match.index}`}>
          {renderLink(match[2], match[1])}
        </strong>
      );
    } else if (match[3] && match[4]) {
      nodes.push(renderLink(match[4], match[3], `inline-${match.index}`));
    } else if (match[5]) {
      nodes.push(
        <strong key={`inline-${match.index}`} className="font-semibold text-white">
          {match[5]}
        </strong>
      );
    } else if (match[6]) {
      nodes.push(
        <em key={`inline-${match.index}`} className="italic">
          {match[6]}
        </em>
      );
    }

    lastIndex = pattern.lastIndex;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderLink(href: string, label: string, key?: string) {
  const cleanLabel = label.replace(/\*/g, "");
  const className =
    "text-orange-300 underline decoration-orange-300 underline-offset-4 transition hover:text-orange-200";

  if (href.startsWith("/")) {
    return (
      <a key={key ?? href} href={href} className={className}>
        {cleanLabel}
      </a>
    );
  }

  return (
    <a
      key={key ?? href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {cleanLabel}
    </a>
  );
}
