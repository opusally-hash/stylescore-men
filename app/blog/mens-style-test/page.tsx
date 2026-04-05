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

const seo = legacyBlogSeo["mens-style-test"];

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
          ← Back to Blog
        </a>

        <article className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
            StyleScore Blog
          </p>

          <h1
            className={`mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            Men&apos;s Style Quiz: Find Your Style Score Online
          </h1>
           <p className="text-white/70 mt-4">
  Want to know how you actually score in style? 
</p>

<a
  href="/onboarding"
  className="inline-block mt-4 bg-orange-400 text-black px-5 py-3 rounded-xl font-semibold"
>
  Take the Free StyleScore →
</a>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men do not actually know how strong their style is. They may
            feel decent in what they wear, but that is very different from
            knowing whether their fit, shoes, grooming, and wardrobe choices are
            really working together. That is why a men&apos;s style quiz is so
            useful. It turns style from a vague feeling into something more
            measurable.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            A good style quiz does not just flatter you. It shows where your
            appearance is strong, where it is average, and where you are
            quietly losing points. That clarity is powerful because most men do
            not need more fashion information. They need a better diagnosis.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">
              Take the free StyleScore quiz
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">
              Get your score across fit, wardrobe, shoes, grooming, color
              coordination, and occasion styling in just a couple of minutes.
            </p>
            <a
              href="/onboarding"
              className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
            >
              Start the Style Quiz
            </a>
          </div>

          <section className="mt-12 space-y-10">
            <Section
              title="What is a men’s style quiz?"
              paragraphs={[
                "A men’s style quiz is a structured way to evaluate how well you dress across the areas that matter most. Instead of relying on random feedback, compliments, or your own assumptions, a good quiz looks at practical style fundamentals. These usually include how your clothes fit, whether your shoes support the rest of your outfit, how intentional your grooming is, and whether your overall presentation feels coordinated.",
                "That matters because most men do not have a single massive problem. They have several smaller weak areas that add up. One man may have good clothes but weak shoes. Another may look fine casually but dress poorly for occasions. Someone else may have decent wardrobe basics but poor grooming consistency. A style quiz helps identify those weaker categories clearly.",
              ]}
            />

            <Section
              title="Why most men misjudge their style"
              paragraphs={[
                "Most men judge style from inside their habits. If you wear the same kinds of outfits every week, you stop noticing what is not working. Loose shirts start feeling normal. Worn sneakers stop standing out. A weak haircut routine becomes invisible because it is familiar.",
                "Another reason is that men often reduce style to clothes only. In reality, appearance is built from multiple categories working together. Clothes, shoes, grooming, fit, and occasion awareness all combine to create the final impression. When one of those pieces is weak, the full look drops.",
              ]}
            />

            <ListSection
              title="The most common reasons men score lower than they expect"
              items={[
                "Clothes fit poorly even if the pieces are decent",
                "Shoes are too sporty, too worn, or mismatched",
                "Grooming is inconsistent",
                "Wardrobe feels random instead of cohesive",
                "Color combinations are safe but unintentional",
                "There is no separate plan for dressing better on important occasions",
              ]}
            />

            <Section
              title="What a good style score should measure"
              paragraphs={[
                "A good men’s style quiz should not care about how trendy you are. It should care about whether your appearance looks deliberate, clean, and well put together. That is why StyleScore focuses on categories that actually change how a man looks in real life.",
                "The first is fit and proportion. This is almost always the biggest factor. If your clothes fit your shoulders, chest, waist, and legs properly, everything looks better. Then comes wardrobe foundation, which is about whether your clothes work together easily. Shoes matter because they are more visible than most men realize. Grooming matters because it multiplies the effect of everything else. Color coordination and occasion dressing show whether your style feels random or intentional.",
              ]}
            />

            <ListSection
              title="Core areas inside the quiz"
              items={[
                "Fit & Proportion",
                "Wardrobe Foundations",
                "Color Coordination",
                "Shoes & Footwear",
                "Grooming",
                "Occasion Styling",
              ]}
            />

            <Section
              title="What is a good style score?"
              paragraphs={[
                "A good style score is not about perfection. It is about whether your appearance feels balanced and intentional. In practical terms, a score above 80 usually suggests strong style awareness. That means you have a good handle on fit, shoes, grooming, and presentation.",
                "A score between 60 and 80 means you are doing fine, but there are visible areas to improve. This is where many men fall. The good news is that this range responds quickly to smart upgrades. A score below 60 often means one or two basics are dragging the full look down, but it also means improvement can be fast and obvious.",
              ]}
            />

            <Section
              title="Why style quizzes are useful even if you already care about fashion"
              paragraphs={[
                "Some men assume a style quiz is only for beginners. That is not true. Even men who already care about fashion can have blind spots. You may know brands, silhouettes, and trends, but still be weak in shoes or grooming. Or you may dress well in one context and underperform in another.",
                "A style quiz is useful because it creates structure. It forces you to look at your style category by category instead of relying on your general feeling. That makes it easier to see what is already working and what deserves attention first.",
              ]}
            />

            <Section
              title="How to use your quiz result properly"
              paragraphs={[
                "The biggest mistake after taking a men’s style quiz is trying to fix everything at once. Do not do that. The smarter move is to focus on the weakest one or two categories first. That is where your style score is being dragged down most.",
                "For example, if your weakest area is shoes, buying more shirts will not solve the main issue. If your grooming is weak, better trousers will only help so much. If your fit is off, even good wardrobe pieces will still underperform. The best improvement path is targeted, not random.",
              ]}
            />

            <ListSection
              title="The smartest way to improve after taking the quiz"
              items={[
                "Fix the weakest category first",
                "Prioritize fit before trendiness",
                "Upgrade shoes before expanding wardrobe",
                "Create a simple grooming routine you can maintain",
                "Build a small set of reliable outfits instead of buying randomly",
              ]}
            />

            <Section
              title="Why StyleScore is different from generic quizzes"
              paragraphs={[
                "Many online style quizzes are entertainment-only. They tell you that you are classic, casual, edgy, or minimal and leave it there. That can be fun, but it does not tell you what to fix. StyleScore is more useful because it is diagnostic.",
                "Instead of giving you a vague identity label, it shows where you are strong and where you are weak. It gives you a score, a breakdown, and a direction. That makes it much easier to improve. You are not just learning who you are. You are learning what to do next.",
              ]}
            />

            <p className="leading-8 text-white/70">
              If you want a more detailed improvement path after taking the quiz,
              read{" "}
              <a
                href="/blog/how-to-improve-style"
                className="underline decoration-orange-300 underline-offset-4 text-orange-300"
              >
                how to improve your style in 30 days
              </a>
              .
            </p>

            <p className="leading-8 text-white/70">
              And if you want a broader breakdown of how your current style
              stacks up, check our{" "}
              <a
                href="/blog/mens-style-test"
                className="underline decoration-orange-300 underline-offset-4 text-orange-300"
              >
                free men’s style test
              </a>{" "}
              as well.
            </p>

            <Section
              title="Final takeaway"
              paragraphs={[
                "A men’s style quiz is valuable because it turns style into something measurable. Once you know your score, your strong categories, and your weak points, you stop guessing. And when you stop guessing, your style improves faster.",
                "You do not need a perfect wardrobe to look better. You need better fit, sharper shoes, cleaner grooming, and more intentional choices. A good quiz helps you see exactly where to begin.",
              ]}
            />

            <FaqSection />

            <BlogRelatedLinks slug={seo.slug} />

            <div className="rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Ready to see your style score?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
                Take the free quiz and find out what is helping your appearance
                and what is holding it back.
              </p>
              <a
                href="/onboarding"
                className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
              >
                Take the Quiz Now
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
      q: "Is this men’s style quiz free?",
      a: "Yes. The StyleScore quiz is free and takes only a couple of minutes.",
    },
    {
      q: "What does the quiz actually measure?",
      a: "It measures practical style categories like fit, wardrobe, shoes, grooming, color coordination, and occasion dressing.",
    },
    {
      q: "Do I need expensive clothes to get a high score?",
      a: "No. Strong style usually comes more from fit, grooming, shoes, and consistency than from price.",
    },
    {
      q: "Can I improve my score quickly?",
      a: "Yes. Most men can improve their score fairly quickly by fixing fit, upgrading shoes, and improving grooming first.",
    },
  ];

  return (
    <section>
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
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}

 
<section className="mt-16">
  <h2 className="text-2xl font-semibold mb-6">
    Frequently Asked Questions
  </h2>

  <div className="space-y-6 text-white/70">

    <div>
      <h3 className="font-semibold">Is this men&apos;s style test free?</h3>
      <p>Yes, the StyleScore test is completely free and takes less than 2 minutes.</p>
    </div>

    <div>
      <h3 className="font-semibold">How accurate is the StyleScore?</h3>
      <p>The score is based on key style fundamentals like fit, grooming, and coordination, making it a practical and realistic assessment.</p>
    </div>

    <div>
      <h3 className="font-semibold">Can I improve my style quickly?</h3>
      <p>Yes. Most users see noticeable improvement by focusing on fit, shoes, and grooming first.</p>
    </div>

    <div>
      <h3 className="font-semibold">Do I need expensive clothes to look good?</h3>
      <p>No. Style is more about fit, cleanliness, and coordination than price.</p>
    </div>

  </div>
</section>

