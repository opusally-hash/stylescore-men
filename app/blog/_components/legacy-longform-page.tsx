import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { BlogRelatedLinks } from "./blog-related-links";
import { LegacyBlogFaq, LegacyBlogTopCta } from "./legacy-blog-extras";
import {
  LegacyBlogStructuredData,
  type LegacyBlogSeoEntry,
} from "./legacy-blog-seo";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export type LegacyLongformSection = {
  title: string;
  blocks: ReactNode[];
};

type LegacyLongformCta = {
  title: string;
  body: string;
  buttonLabel?: string;
};

export function LegacyLongformPage({
  seo,
  heading,
  intro,
  sections,
  middleCta,
  bottomCta,
  includeFaq = true,
}: {
  seo: LegacyBlogSeoEntry;
  heading: string;
  intro: ReactNode[];
  sections: LegacyLongformSection[];
  middleCta?: LegacyLongformCta & { insertAfterSection: number };
  bottomCta: LegacyLongformCta;
  includeFaq?: boolean;
}) {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <LegacyBlogStructuredData entry={seo} />
      <BackgroundGlow />

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
            className={`mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            {heading}
          </h1>

          <p className="mt-4 text-sm text-white/45">
            By StyleScore • Updated April 5, 2026
          </p>

          <div className="mt-6 max-w-3xl space-y-4">
            {intro.map((paragraph, index) => (
              <p
                key={`intro-${index}`}
                className={index === 0 ? "text-lg leading-8 text-white/70" : "leading-8 text-white/70"}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <LegacyBlogTopCta />
          </div>

          <div className="mt-10 space-y-10">
            {sections.map((section, sectionIndex) => (
              <SectionGroup
                key={section.title}
                section={section}
                middleCta={
                  middleCta && middleCta.insertAfterSection === sectionIndex
                    ? middleCta
                    : undefined
                }
              />
            ))}

            <CtaCard
              title={bottomCta.title}
              body={bottomCta.body}
              buttonLabel={bottomCta.buttonLabel ?? "Start the StyleScore assessment"}
            />

            <BlogRelatedLinks slug={seo.slug} />

            {includeFaq ? <LegacyBlogFaq /> : null}
          </div>
        </article>
      </div>
    </main>
  );
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

function SectionGroup({
  section,
  middleCta,
}: {
  section: LegacyLongformSection;
  middleCta?: LegacyLongformCta;
}) {
  return (
    <>
      <section>
        <h2 className="text-3xl font-semibold text-white">{section.title}</h2>
        <div className="mt-4 space-y-4">
          {section.blocks.map((block, blockIndex) =>
            typeof block === "string" ? (
              <p key={blockIndex} className="leading-8 text-white/72">
                {block}
              </p>
            ) : (
              <div key={blockIndex} className="text-white/72">
                {block}
              </div>
            )
          )}
        </div>
      </section>

      {middleCta ? (
        <CtaCard
          title={middleCta.title}
          body={middleCta.body}
          buttonLabel={middleCta.buttonLabel ?? "Get Your StyleScore"}
        />
      ) : null}
    </>
  );
}

function CtaCard({
  title,
  body,
  buttonLabel,
}: {
  title: string;
  body: string;
  buttonLabel: string;
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-4 leading-8 text-white/72">{body}</p>
      <a
        href="/assessment"
        className="mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300"
      >
        {buttonLabel}
      </a>
    </section>
  );
}
