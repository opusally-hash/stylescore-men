import Image from "next/image";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BlogRelatedLinks } from "../_components/blog-related-links";
import {
  buildLegacyBlogMetadata,
  LegacyBlogStructuredData,
  legacyBlogSeo,
} from "../_components/legacy-blog-seo";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const seo = legacyBlogSeo["Jon-Bernthal-Stylish"];

export const metadata = buildLegacyBlogMetadata(seo);

export default function Page() {
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
            Why Jon Bernthal Always Looks Effortlessly Stylish (And What Men Can Learn)
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Jon Bernthal does not look stylish in the way most people expect.
            He is not chasing trends. He is not wearing flashy outfits. And yet,
            he consistently looks sharp, masculine, and put together.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            That is exactly what makes his style worth studying. Because what he
            does is repeatable. It is not about money or fashion knowledge. It is
            about fundamentals that most men ignore.
          </p>

          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10">
            <Image
              src="/amirr-zolfaghari-f_hXDi6xTvE-unsplash.jpg"
              alt="Rugged masculine style inspiration"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">
              Check your StyleScore
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">
              See how you score across fit, shoes, grooming, and coordination.
              Most men are losing points without realizing it.
            </p>
            <a
              href="/style-quiz"
              className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
            >
              Check Your StyleScore -&gt;
            </a>
          </div>

          <section className="mt-12 space-y-10">
            <Section
              title="1. His clothes fit cleanly without trying too hard"
              paragraphs={[
                "The first thing you notice about Jon Bernthal is that nothing looks off. His t-shirts sit correctly on his shoulders. His sleeves are not oversized. His jackets follow his body instead of hanging loosely.",
                "This creates a controlled silhouette. Not tight. Not loose. Just right. And that alone puts him ahead of most men, because poor fit is the biggest reason outfits fail.",
                "Most men try to fix style by buying more clothes. But the real upgrade usually starts with wearing the same clothes better.",
              ]}
            />

            <Section
              title="2. He uses simple colors that always work"
              paragraphs={[
                "You will rarely see Bernthal wearing complicated color combinations. His wardrobe leans heavily on black, white, gray, olive, and muted tones.",
                "These colors naturally work together, which removes the need for overthinking. His outfits feel cohesive because they are built on colors that are hard to mess up.",
                "This is one of the easiest upgrades any man can make. Simpler colors create stronger outfits with less effort.",
              ]}
            />

            <Section
              title="3. His footwear supports the outfit instead of ruining it"
              paragraphs={[
                "One of the most common mistakes men make is wearing the wrong shoes. Even a good outfit can collapse if the footwear feels disconnected.",
                "Bernthal avoids this completely. His shoes are clean, functional, and aligned with the outfit. Whether it is boots or simple sneakers, they never distract from the look.",
                "This is a small detail, but it has a massive impact on how the entire outfit is perceived.",
              ]}
            />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
              <p className="leading-7 text-white/70">
                Not sure if your shoes are helping or hurting your style?
              </p>
              <a
                href="/style-quiz"
                className="mt-4 inline-flex rounded-2xl bg-orange-400 px-5 py-3 font-semibold text-black transition hover:bg-orange-300"
              >
                Take the Free Style Test -&gt;
              </a>
            </div>

            <Section
              title="4. His grooming adds to the overall impact"
              paragraphs={[
                "Bernthal's grooming is a major part of his look. His hair is simple but maintained. His beard is rough but intentional.",
                "This balance creates a rugged appearance without looking careless. It feels natural, but it is clearly controlled.",
                "Most men underestimate grooming. But it often does more for your appearance than adding another piece of clothing.",
              ]}
            />

            <Section
              title="5. He dresses with identity, not trends"
              paragraphs={[
                "One of the biggest reasons Bernthal stands out is that his style feels consistent. He is not chasing trends or trying to reinvent himself with every outfit.",
                "Instead, his clothing reflects who he is. Strong, grounded, and practical. That consistency makes his style feel authentic.",
                "When your style reflects your identity, it automatically looks more confident.",
              ]}
            />

            <Section
              title="What most men get wrong"
              paragraphs={[
                "Most men believe style is about buying better clothes. In reality, the problem is usually a lack of clarity.",
                "They do not know whether their fit is working. They are unsure about shoes. Grooming is inconsistent. Outfits feel random instead of intentional.",
                "That confusion leads to average results, even when the wardrobe itself is not bad.",
              ]}
            />

            <ListSection
              title="The real pattern behind strong style"
              items={[
                "Clothes fit cleanly and consistently",
                "Colors are simple and easy to combine",
                "Shoes support the outfit instead of breaking it",
                "Grooming is stable and intentional",
                "Outfits feel chosen, not random",
              ]}
            />

            <Section
              title="Style is not guesswork"
              paragraphs={[
                "What makes Jon Bernthal's style powerful is not complexity. It is consistency. He follows a repeatable system.",
                "Once you understand that system, style becomes predictable. You stop guessing and start improving with intention.",
                "And that is where most men finally see real progress.",
              ]}
            />

            <Section
              title="How to know where you stand"
              paragraphs={[
                "The fastest way to improve your style is to measure it. Instead of guessing whether you look good, you need clarity on which areas are strong and which are weak.",
                "That clarity changes everything. Because once you know where you are losing points, improvement becomes straightforward.",
              ]}
            />

            <FaqSection />

            <BlogRelatedLinks slug={seo.slug} />

            <div className="rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Want a clear breakdown of your style?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
                Take the free StyleScore quiz and see exactly how you perform
                across the fundamentals that matter most.
              </p>
              <a
                href="/style-quiz"
                className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
              >
                Get Your StyleScore -&gt;
              </a>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

function Section({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-8 text-white/70">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function ListSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <ul className="mt-5 list-disc space-y-3 pl-6 text-white/75">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "Why does Jon Bernthal look stylish without trying?",
      a: "Because he focuses on fundamentals like fit, grooming, and simple colors rather than trends.",
    },
    {
      q: "What is the most important part of his style?",
      a: "Fit and grooming. These two factors carry most of the visual impact.",
    },
    {
      q: "Can I copy this style without spending a lot?",
      a: "Yes. His style is based on fundamentals, not expensive pieces.",
    },
    {
      q: "How can I improve my style quickly?",
      a: "Start with fit, upgrade your shoes, and maintain consistent grooming.",
    },
  ];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  });

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <h2 className="text-2xl font-semibold text-white">
        Frequently Asked Questions
      </h2>
      <div className="mt-5 space-y-5">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h3 className="font-semibold text-white">{faq.q}</h3>
            <p className="mt-2 leading-7 text-white/70">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_32%),radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.10),_transparent_22%),linear-gradient(180deg,_#0a1023_0%,_#050816_52%,_#02040b_100%)]" />
    </div>
  );
}
