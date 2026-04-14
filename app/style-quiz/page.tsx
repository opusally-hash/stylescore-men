import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const title = "Men's Style Quiz: Get Your Style Score in 2 Minutes";
const description =
  "Free men's style quiz that scores your fit, wardrobe, shoes, and grooming. Get a personalized diagnosis and know exactly what to upgrade next.";
const url = "https://stylescore.live/style-quiz";

const faqs = [
  {
    question: "How long does the men's style quiz take?",
    answer:
      "The StyleScore quiz takes about 2 minutes and uses 10 focused questions to score the categories that shape your overall look.",
  },
  {
    question: "Is the men's style quiz free?",
    answer:
      "Yes. The quiz and your score are free. An optional $9 upgrade includes a personalized 30-day plan.",
  },
  {
    question: "What does the quiz score?",
    answer:
      "It scores fit and proportion, wardrobe foundations, color coordination, shoes, grooming, and occasion dressing.",
  },
  {
    question: "Is this a fashion quiz for men or a style finder?",
    answer:
      "It works as both: the quiz gives you a score and also helps identify which style category you should fix first.",
  },
  {
    question: "Do I need fashion knowledge to take it?",
    answer:
      "No. The questions are written for regular men who want a practical clothing style quiz, not fashion jargon.",
  },
];

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
        alt: "StyleScore men's style quiz preview",
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

export default function StyleQuizPage() {
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });

  const webPageJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    mainEntity: {
      "@type": "Quiz",
      name: "StyleScore Men's Style Quiz",
      description,
      url,
      provider: {
        "@type": "Organization",
        name: "StyleScore",
        url: "https://stylescore.live",
      },
    },
  });

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: webPageJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJsonLd }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-90px] h-96 w-96 rounded-full bg-orange-300/15 blur-3xl" />
        <div className="absolute right-[-140px] top-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-300/10 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/3 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="text-lg font-bold uppercase tracking-[0.28em] text-white/60"
          >
            StyleScore
          </Link>
          <Link
            href="/blog"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10"
          >
            Blog
          </Link>
        </header>

        <section className="grid min-h-[78vh] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.36em] text-orange-200/80">
              Free men&apos;s style quiz
            </p>
            <h1
              className={`mt-6 max-w-4xl text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl ${displayFont.className}`}
            >
              The Men&apos;s Style Quiz That Tells You What to Fix
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Style advice is useless if you do not know your weak spot. This
              fashion quiz for men scores the parts that actually change how you
              look: fit, wardrobe, color coordination, shoes, grooming, and
              occasion dressing.
            </p>
            <p className="mt-4 max-w-2xl leading-8 text-white/62">
              Think of it as a clothing style quiz and a practical style finder
              in one. You answer 10 quick questions, get your StyleScore, and see
              what to upgrade first instead of guessing from random tips.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center rounded-2xl bg-orange-400 px-7 py-4 text-base font-semibold text-black shadow-[0_0_28px_rgba(251,146,60,0.35)] transition hover:bg-orange-300"
              >
                Start the Free Style Quiz
              </Link>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                See What It Scores
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <QuizStat value="10" label="smart questions" />
              <QuizStat value="6" label="style categories" />
              <QuizStat value="2 min" label="typical time" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/40">
              Question 1 of 10
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              I usually buy tops that...
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "fit me well in the shoulders and chest",
                "fit okay but are a little loose",
                "often feel tight in one area",
                "are mostly chosen for comfort, not fit",
              ].map((item) => (
                <Link
                  key={item}
                  href="/assessment"
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/75"
                >
                  <span className="mr-3 text-orange-300">+</span>
                  {item}
                </Link>
              ))}
            </div>
            <Link
              href="/assessment"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-orange-400 px-6 py-4 font-semibold text-black transition hover:bg-orange-300"
            >
              Start the quiz
            </Link>
          </div>
        </section>

        <section className="grid gap-5 py-8 md:grid-cols-3">
          <FeatureCard
            title="Not a personality quiz"
            text="You will not get a vague label and nothing else. The quiz is built around visible style fundamentals."
          />
          <FeatureCard
            title="Built for real wardrobes"
            text="The questions are about how your clothes, shoes, grooming, and occasion choices work in normal life."
          />
          <FeatureCard
            title="Made to give direction"
            text="The goal is to tell you what to fix next, not overwhelm you with a full fashion lecture."
          />
        </section>

        <section id="faq" className="py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
              Style quiz FAQ
            </p>
            <h2
              className={`mt-3 text-4xl leading-tight text-white ${displayFont.className}`}
            >
              Quick answers before you start.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 leading-8 text-white/68">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function QuizStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/50">{label}</p>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 leading-7 text-white/65">{text}</p>
    </div>
  );
}
