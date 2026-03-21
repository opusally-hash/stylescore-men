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
  title: "7 Signs You Dress Well as a Man (And How to Improve Fast) | StyleScore",
  description:
    "Learn the clearest signs that show whether you actually dress well as a man, and how to improve your style fast.",
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

        <article className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
            StyleScore Blog
          </p>

          <h1
            className={`mt-5 max-w-3xl text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            7 Signs You Dress Well as a Man (And How to Improve Fast)
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men do not actually know whether they dress well. They rely on
            instinct, comfort, or the absence of criticism. But style works very
            differently. You can feel comfortable and still look average. You
            can own decent clothes and still lose points because of fit, shoes,
            grooming, or coordination.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            If you want to know whether your style is genuinely strong, there
            are clear signs to look for. And the good news is that if you are
            missing a few of them, your appearance can improve quickly once you
            focus on the right things.
          </p>

          <div className="mt-10 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <h2 className="text-2xl font-semibold text-white">
              Check your StyleScore
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">
              Take the free StyleScore quiz and see how you score across fit,
              wardrobe, shoes, grooming, and occasion styling.
            </p>
            <a
              href="/onboarding"
              className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
            >
              Check Your StyleScore →
            </a>
          </div>

          <section className="mt-12 space-y-10">
            <Section
              title="1. Your clothes fit properly"
              paragraphs={[
                "Fit is the strongest sign that a man dresses well. Even average clothes look better when they fit cleanly. On the other hand, expensive clothes can still look weak if they are too loose, too tight, too long, or badly proportioned.",
                "Well-dressed men usually get this right without drawing attention to it. Shirts sit correctly on the shoulders. Sleeves and lengths feel intentional. Pants do not collapse into heavy bunching at the ankle. The overall silhouette looks clean instead of confused.",
                "If you want the fastest style improvement possible, start here. Fit changes everything because it affects how every single outfit is perceived.",
              ]}
            />

            <Section
              title="2. Your shoes do not weaken the outfit"
              paragraphs={[
                "Many men think style starts with shirts, jackets, or pants. In reality, weak shoes ruin strong outfits more often than people realize. Shoes are one of the easiest ways to tell whether a man is intentional about how he presents himself.",
                "If you dress well, your shoes usually match the tone of your outfit. They are not visibly tired, overly sporty for every setting, or disconnected from the rest of the look. They feel like part of the plan.",
                "This does not mean you need expensive footwear. Clean, versatile, well-chosen shoes outperform random expensive pairs almost every time.",
              ]}
            />

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
              <p className="leading-7 text-white/70">
                Not sure if your shoes are helping or hurting your style?
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-flex rounded-2xl bg-orange-400 px-5 py-3 font-semibold text-black transition hover:bg-orange-300"
              >
                Take the Free Style Test →
              </a>
            </div>

            <Section
              title="3. Your grooming is consistent"
              paragraphs={[
                "A man can wear decent clothing and still look under-finished if grooming is inconsistent. Hair, beard maintenance, hygiene, skin quality, and general upkeep all play a visible role in style.",
                "When a man dresses well, grooming usually supports the outfit instead of fighting it. Hair looks maintained. Facial hair looks intentional rather than neglected. The overall impression is that the person takes care of presentation regularly, not only when forced to.",
                "This matters because grooming multiplies style. It improves everything else you wear.",
              ]}
            />

            <Section
              title="4. Your outfits look intentional"
              paragraphs={[
                "Another strong sign is that your outfits do not feel random. Good style has clarity. That does not mean every outfit is complicated. It means the pieces feel chosen together.",
                "Well-dressed men tend to repeat combinations that make sense. Colors work together. Shoes make sense with the pants. Layers look balanced. Nothing feels accidental or thrown on without thought.",
                "This is one reason neutral wardrobes often work so well. They make intentional dressing easier and more repeatable.",
              ]}
            />

            <Section
              title="5. You dress appropriately for the occasion"
              paragraphs={[
                "Style is not just about what looks good in isolation. It is also about context. A man who dresses well understands when to go sharper, when to stay relaxed, and when to elevate just slightly above average.",
                "Underdressing makes you look unaware. Overdressing can make you look uncomfortable or try-hard. The strongest style usually sits in that sweet spot where you look clearly put together but still natural for the setting.",
                "This is where many men quietly lose points. They wear the same clothing formula everywhere and then wonder why their appearance feels flat.",
              ]}
            />

            <Section
              title="6. You get positive reactions to the details"
              paragraphs={[
                "When men dress well, the feedback they receive is often about small details. Someone may notice their shoes, say a jacket fits well, mention that they look sharp, or comment that they always seem put together.",
                "That kind of feedback matters because it usually means your overall presentation is working. People notice details only when the complete look is doing its job.",
                "You do not need constant compliments to dress well. But if nobody ever notices anything, it is worth checking whether your presentation is too forgettable.",
              ]}
            />

            <Section
              title="7. You feel more clear than confused when getting dressed"
              paragraphs={[
                "One underrated sign of good style is ease. Men with stronger style usually do not feel confused every time they get dressed. They have a cleaner system. Their wardrobe works together better. Their shoe choices make sense. Their grooming is stable. Their go-to outfits are reliable.",
                "This does not mean they never experiment. It means the base is strong enough that daily dressing feels easier, not harder.",
                "If getting dressed feels chaotic, your issue is usually not a lack of clothes. It is a lack of structure.",
              ]}
            />

            <Section
              title="Why many men still look average even with decent clothes"
              paragraphs={[
                "Most men do not look average because they lack money or wardrobe size. They look average because they have weak fundamentals. Poor fit, weak shoes, inconsistent grooming, and random coordination quietly pull the whole appearance down.",
                "This is also why buying more clothes often does not solve the problem. If the foundation is weak, more pieces just create more confusion.",
                "The best improvement path is not to buy everything. It is to fix the categories that matter most first.",
              ]}
            />

            <ListSection
              title="The fastest way to improve your style"
              items={[
                "Fix fit before buying more clothes",
                "Upgrade the shoes you wear most often",
                "Create a simple grooming routine you can actually maintain",
                "Build outfits around versatile neutral basics",
                "Have one reliable look for important occasions",
              ]}
            />

            <Section
              title="How to know for sure"
              paragraphs={[
                "The simplest way to know whether you dress well is to measure it instead of guessing. That is where a structured style test becomes useful. It helps you see whether your style is strong overall or whether one or two weaker categories are lowering the full picture.",
                "That kind of diagnosis is powerful because most men do not need more opinions. They need more clarity.",
              ]}
            />

            <FaqSection />

            <div className="rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
              <h2 className="text-2xl font-semibold text-white">
                Want a clear answer?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
                Take the free StyleScore quiz and see how you actually perform
                across the style fundamentals that matter most.
              </p>
              <a
                href="/onboarding"
                className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
              >
                Get Your StyleScore →
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
      q: "How do I know if I dress well?",
      a: "If your fit, shoes, grooming, coordination, and occasion dressing are consistently strong, you likely dress well.",
    },
    {
      q: "What is the most important part of men’s style?",
      a: "Fit is the most important factor, followed closely by shoes and grooming.",
    },
    {
      q: "Can I improve my style quickly?",
      a: "Yes. Most men see the fastest improvement by fixing fit, upgrading shoes, and becoming more consistent with grooming.",
    },
    {
      q: "Do I need expensive clothes to look good?",
      a: "No. Style usually improves more from fit, clarity, shoes, and grooming than from higher prices.",
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
