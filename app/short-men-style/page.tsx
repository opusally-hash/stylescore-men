import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { shortMenArticleCards } from "../blog/_lib/short-men-articles";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const title = "Short Men Style Hub: Fit, Shoes, Outfits, and Proportion Guides";
const description =
  "All StyleScore guides for shorter men in one place: fit, shoes, trousers, weddings, dates, grooming, summer outfits, and proportions.";
const url = "https://stylescore.live/short-men-style";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    siteName: "StyleScore",
    images: [
      {
        url: "/og-image-share.png",
        width: 1368,
        height: 768,
        alt: "Short men style hub preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image-share.png"],
  },
};

export default function ShortMenStyleHubPage() {
  const collectionJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    hasPart: shortMenArticleCards.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `https://stylescore.live/blog/${article.slug}`,
    })),
  });

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: collectionJsonLd }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-90px] h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-140px] top-1/4 h-[28rem] w-[28rem] rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-sky-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <Link
          href="/blog"
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
        >
          Back to Blog
        </Link>

        <section className="mt-12 max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-orange-200/80">
            Short Men Style Hub
          </p>
          <h1
            className={`mt-5 text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl ${displayFont.className}`}
          >
            Better fit, shoes, and proportions for shorter men.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">
            This hub keeps the short-men style guides together so the cluster is
            easier for readers and search engines to understand. Start with fit,
            then move into shoes, trousers, occasions, grooming, and seasonal
            outfits.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/style-quiz"
              className="inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300"
            >
              Take the Men&apos;s Style Quiz
            </Link>
            <a
              href="#guides"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Browse Short-Men Guides
            </a>
          </div>
        </section>

        <section id="guides" className="mt-14 grid gap-5 md:grid-cols-2">
          {shortMenArticleCards.map((article, index) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.06]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/80">
                Guide {index + 1}
              </p>
              <h2 className="mt-4 text-2xl font-semibold leading-snug text-white">
                {article.title}
              </h2>
              <p className="mt-3 leading-7 text-white/65">{article.description}</p>
              <p className="mt-5 text-sm font-semibold text-orange-200 transition group-hover:text-orange-100">
                Read guide
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
