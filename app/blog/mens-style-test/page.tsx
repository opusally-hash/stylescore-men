import { Cormorant_Garamond, Manrope } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Take the Ultimate Men's Style Test (Free) | StyleScore",
  description:
    "Take a free men's style test and discover your StyleScore across fit, wardrobe, shoes, grooming, and occasion dressing.",
};

export default function Page() {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <BackgroundGlow />

      <div className="relative mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <a
          href="/blog"
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
        >
          ← Back to Blog
        </a>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
            StyleScore Blog
          </p>

          <h1
            className={`mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            Take the Ultimate Men&apos;s Style Test (Free)
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men think they dress well — until they actually measure it.
            The truth is, style is not about expensive clothes or chasing every
            trend. It is about fit, coordination, grooming, shoes, and
            consistency. A man wearing simple clothes that fit well will almost
            always look better than someone wearing expensive but poorly fitted
            outfits.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            If you’ve ever wondered why some men look sharp effortlessly while
            others struggle, the answer usually lies in understanding their
            current style level. That is exactly what this men&apos;s style test
            helps you do — it gives you a measurable score and shows you what to
            fix first.
          </p>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-semibold text-white">
            Get Your StyleScore in 2 Minutes
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/70">
            Find out how strong your style really is across fit, wardrobe,
            shoes, grooming, color coordination, and occasion dressing.
          </p>
          <a
            href="/onboarding"
            className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
          >
            Take the Style Test →
          </a>
        </div>

        <article className="mt-12 space-y-10">
          <Section
            title="What is a men’s style test?"
            text={[
              "A men’s style test is a structured way to evaluate how well you dress across the areas that matter most. Instead of relying on guesses, compliments, or vague fashion advice, it measures your style using real fundamentals such as fit, grooming, footwear, coordination, and overall presentation.",
              "Most men do not actually need more clothes. They need better clarity. A style test helps you understand whether your appearance is being lifted or hurt by the small choices you make every day. That is what makes it useful. It turns style from something abstract into something measurable and actionable.",
            ]}
          />

          <Section
            title="Why most men get style wrong"
            text={[
              "Most men struggle with style because they focus on the wrong thing. They think style means buying more clothes, following trends, or spending more money. In reality, style is usually won or lost in a few core areas: how your clothes fit, how clean your shoes look, how sharp your grooming is, and how intentional your outfits feel.",
              "Another big reason men misjudge their own style is familiarity. When you wear the same kinds of outfits every week, you stop noticing what is not working. Loose shirts start to feel normal. Worn-out sneakers stop standing out. Weak grooming feels acceptable because it has become routine.",
            ]}
          />

          <ListSection
            title="The most common mistakes men make"
            items={[
              "They focus only on clothes and ignore grooming",
              "They wear poor-fitting outfits that ruin their shape",
              "They ignore shoes even though people notice them quickly",
              "They have no system for color coordination",
              "They dress randomly without consistency",
            ]}
          />

          <Section
            title="What your StyleScore measures"
            text={[
              "Your StyleScore is built around the categories that define how well you present yourself. This is not just a surface-level personality quiz. It is a practical style assessment that looks at the most visible parts of your appearance.",
              "A weak score in even one area can drag your full look down. That is why the breakdown matters more than the ego boost. The real value is knowing what needs attention first.",
            ]}
          />

          <ListSection
            title="Core categories in the StyleScore"
            items={[
              "Fit & Proportion — do your clothes actually suit your body?",
              "Clothing Selection — are your outfits clean, balanced, and intentional?",
              "Shoes — are you wearing the right footwear for the situation?",
              "Grooming — hair, beard, skin, and overall polish",
              "Fragrance — the finishing detail many men ignore",
            ]}
          />

          <Section
            title="What is a good style score?"
            text={[
              "A score above 80 usually indicates strong style awareness and consistency. These are men who understand fit, grooming, and presentation well. A score between 60 and 80 means you are doing okay, but there are clear improvements available. Most men fall into this range.",
              "A score below 60 suggests that there are major gaps — usually in fit, grooming, shoes, or coordination. The good news is that this is also the range where improvement is often fastest and most visible. When the basics are weak, even a few smart upgrades can create a big transformation.",
            ]}
          />

          <Section
            title="How to improve your style fast"
            text={[
              "Improving your style does not require rebuilding your entire wardrobe in one weekend. In fact, the fastest results usually come from fixing a few high-impact things. Start where people notice first: fit, shoes, and grooming.",
              "Before making random purchases, take the ",
            ]}
          />

          <p className="leading-8 text-white/70">
            Before making random purchases, take the{" "}
            <a
              href="/onboarding"
              className="underline decoration-orange-300 underline-offset-4 text-orange-300"
            >
              StyleScore assessment
            </a>{" "}
            and get exact recommendations based on your current weak spots.
          </p>

          <ListSection
            title="The fastest upgrades most men can make"
            items={[
              "Wear better-fitting clothes — this is the biggest visual upgrade",
              "Upgrade your shoes — clean white sneakers or simple leather shoes go a long way",
              "Fix your grooming routine — haircut, beard line, skincare, nails",
              "Stick to neutral colors like black, white, navy, grey, and olive",
              "Dress more intentionally for the occasion instead of wearing the same thing everywhere",
            ]}
          />

          <p className="leading-8 text-white/70">
            If you want a structured next step after this article, read{" "}
            <a
              href="/blog/how-to-improve-style"
              className="underline decoration-orange-300 underline-offset-4 text-orange-300"
            >
              how to improve your style in 30 days
            </a>{" "}
            for a more step-by-step upgrade plan.
          </p>

          <Section
            title="Why StyleScore is different"
            text={[
              "Most style advice online is vague. It tells everyone to dress better, groom more, or buy basics, but it rarely tells you what is actually wrong with your own presentation. StyleScore is different because it gives you a score, a breakdown, and a direction.",
              "Instead of guessing what to fix, you get a clearer view of where you are already strong and where your appearance is being held back. That makes improvement faster, cheaper, and much more practical.",
            ]}
          />

          <ListSection
            title="What makes the StyleScore useful"
            items={[
              "A clear score out of 100",
              "Category-wise breakdown instead of one vague result",
              "Focus on what to improve first",
              "A practical path instead of generic fashion clichés",
            ]}
          />

          <Section
            title="Final takeaway"
            text={[
              "A men’s style test matters because style is much easier to improve once it becomes measurable. The moment you understand where you stand, you stop guessing. You start making better decisions.",
              "You do not need to become a fashion expert. You just need to know what is helping you, what is hurting you, and what to fix next. That is what StyleScore is designed to do.",
            ]}
          />

          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5 text-white/70">
              <div>
                <h3 className="font-semibold text-white">
                  Is this men&apos;s style test free?
                </h3>
                <p className="mt-1 leading-7">
                  Yes. The StyleScore test is free and takes only a couple of
                  minutes to complete.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  How accurate is the StyleScore?
                </h3>
                <p className="mt-1 leading-7">
                  The score is based on key style fundamentals like fit,
                  grooming, shoes, and coordination, so it is designed to be
                  practical rather than random.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Can I improve my style quickly?
                </h3>
                <p className="mt-1 leading-7">
                  Yes. Most men see the fastest improvements by focusing on fit,
                  shoes, and grooming first.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Do I need expensive clothes to look stylish?
                </h3>
                <p className="mt-1 leading-7">
                  No. Style is more about fit, coordination, and consistency
                  than price.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-14 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Find Your StyleScore Now
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
            Get a clear score, understand your weaknesses, and start improving
            with direction.
          </p>
          <a
            href="/onboarding"
            className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
          >
            Start Free Test →
          </a>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        {text.map((p, i) => (
          <p key={i} className="leading-8 text-white/70">
            {p}
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
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
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
