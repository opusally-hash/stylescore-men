import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getPublishedGeneratedArticleCards } from "./_lib/generated-articles";
import { shortMenArticleCards } from "./_lib/short-men-articles";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const existingArticles = [
  {
    title: "Take the Ultimate Men's Style Test",
    description: "Discover your style score and how to improve it.",
    href: "/blog/mens-style-test",
  },
  {
    title: "Why Jon Bernthal Looks Effortlessly Stylish (And What Men Can Learn)",
    description: "See the fundamentals behind one of the most repeatable menswear looks.",
    href: "/blog/Jon-Bernthal-Stylish",
  },
  {
    title: "How to Improve Your Style in 30 Days",
    description: "A practical guide to upgrading your appearance.",
    href: "/blog/how-to-improve-style",
  },
  {
    title: "How to Know If You Dress Well",
    description: "Learn the clearest signs that show where your style actually stands.",
    href: "/blog/How-to-know-if-you-dress-well",
  },
  {
    title: "7 Signs You Dress Well as a Man (And How to Improve Fast)",
    description: "Practical signs that separate a sharp look from an average one.",
    href: "/blog/7-signs-dress-well",
  },
  {
    title: "10 Style Mistakes Most Men Make",
    description: "Avoid these common fashion mistakes instantly.",
    href: "/blog/style-mistakes-men",
  },
  {
    title: "Best White Sneakers for Men",
    description: "One of the easiest upgrades for a cleaner, sharper look.",
    href: "/blog/best-white-sneakers-men",
  },
  {
    title: "Men's Grooming Basics",
    description: "The most ignored style upgrade for men.",
    href: "/blog/mens-grooming-basics",
  },
  {
    title: "How to Dress Better as a Man",
    description: "Simple rules that instantly improve appearance.",
    href: "/blog/how-to-dress-better-men",
  },
  {
    title: "Best Perfumes for Men",
    description: "Smell better and improve presence instantly.",
    href: "/blog/best-perfumes-for-men",
  },
  {
    title: "Essential Wardrobe Items Every Man Should Own",
    description: "Build a stronger wardrobe foundation.",
    href: "/blog/mens-wardrobe-essentials",
  },
  {
    title: "Fashion Tips for Short Men",
    description: "Look taller instantly with smarter style choices.",
    href: "/blog/fashion-for-short-men",
  },
  {
    title: "Best Clothes for Muscular Men",
    description: "Stop hiding your physique with the wrong clothes.",
    href: "/blog/Fashion-for-muscular-men",
  },
  {
    title: "Why Most Men Look Bad in Clothes",
    description: "The biggest reasons men look sloppy - and how to fix them.",
    href: "/blog/why-men-look-bad-in-clothes",
  },
  {
    title: "Casual Outfits for Men That Look Effortless",
    description: "Easy outfit formulas that still look intentional.",
    href: "/blog/casual-outfits-men",
  },
];

export default function BlogPage() {
  const generatedArticleCards = getPublishedGeneratedArticleCards();

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-80px] h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-[-120px] top-1/4 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-10 shadow-[0_24px_100px_rgba(15,23,42,0.45)] lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-300/80">
              StyleScore Journal
            </p>
            <h1
              className={`mt-5 text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
            >
              Practical style guides for men who want sharper results, not fluff.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
              Read the breakdowns, steal the outfit rules, and then take the 2-minute
              assessment to see what is helping your look and what is quietly dragging it down.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              10 new field guides for shorter men
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Real fit, footwear, and grooming advice
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              Built to lead into your StyleScore
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/onboarding"
              className="inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300"
            >
              Get Your StyleScore
            </a>
            <a
              href="#featured-guides"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Featured Guides
            </a>
          </div>
        </section>

        <section id="featured-guides" className="mt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
                Featured Series
              </p>
              <h2
                className={`mt-3 text-3xl leading-tight text-white sm:text-4xl ${displayFont.className}`}
              >
                New guides built around shorter frames, sharper proportions, and better first impressions.
              </h2>
            </div>
            <p className="max-w-xl text-white/60">
              These are the strongest entry points if you want fast wins in fit, shoes, grooming, and outfit structure.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {shortMenArticleCards.map((article, index) => (
              <a
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 transition duration-200 hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
                    Guide {index + 1}
                  </span>
                  <span className="text-sm text-white/35 transition group-hover:text-white/50">
                    Read article
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold leading-snug text-white">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {article.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16">
          {generatedArticleCards.length > 0 ? (
            <div className="mb-16">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
                    Freshly Published
                  </p>
                  <h2
                    className={`mt-3 text-3xl leading-tight text-white sm:text-4xl ${displayFont.className}`}
                  >
                    Recent additions to the StyleScore journal.
                  </h2>
                </div>
                <p className="max-w-xl text-white/60">
                  New guides on fit, wardrobe upgrades, and everyday dressing land here first.
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {generatedArticleCards.map((article) => (
                  <a
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200/80">
                      <span>{article.publishedAt}</span>
                      <span>{article.readingTime}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold leading-snug text-white">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/60">
                      {article.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
                More StyleScore Reads
              </p>
              <h2
                className={`mt-3 text-3xl leading-tight text-white sm:text-4xl ${displayFont.className}`}
              >
                Core articles on style mistakes, wardrobe upgrades, grooming, and better everyday dressing.
              </h2>
            </div>
            <p className="max-w-xl text-white/60">
              The archive keeps the fundamentals in one place if you want to keep going after the featured series.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {existingArticles.map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <h3 className="text-xl font-semibold leading-snug text-white">
                  {article.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  {article.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-orange-400 px-6 py-8 text-black shadow-[0_24px_100px_rgba(251,146,60,0.22)] lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-black/60">
                Fastest Next Step
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight">
                Stop guessing which upgrade matters most. Get your StyleScore and see it in order.
              </h2>
              <p className="mt-3 text-base leading-7 text-black/75">
                The assessment turns all of this advice into a personal diagnosis, category scores, and a sharper upgrade path.
              </p>
            </div>
            <a
              href="/onboarding"
              className="inline-flex rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-black/90"
            >
              Take the 2-Minute Assessment
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
