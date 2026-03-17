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
  title: "How to Improve Your Style in 30 Days | StyleScore",
  description:
    "Learn how to improve your style in 30 days with simple upgrades in fit, shoes, grooming, and wardrobe basics.",
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
          className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 hover:bg-white/10"
        >
          ← Back to Blog
        </a>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">
            StyleScore Blog
          </p>

          <h1
            className={`mt-5 text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl ${displayFont.className}`}
          >
            How to Improve Your Style in 30 Days
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/70">
            Most men don’t need more clothes. They need better decisions.
            Improving your style is not about becoming fashionable overnight.
            It is about fixing the highest impact mistakes and building a
            cleaner, sharper, more consistent look step by step.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-6">
          <h2 className="text-2xl font-semibold">
            Know exactly what to fix first
          </h2>
          <p className="mt-3 text-white/70">
            Take the StyleScore assessment and identify your weakest areas
            across fit, shoes, grooming, and wardrobe.
          </p>
          <a
            href="/onboarding"
            className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black hover:bg-orange-300"
          >
            Get My Style Score
          </a>
        </div>

        <article className="mt-12 space-y-10">
          <Section
            title="Why most men struggle with style"
            text={[
              "The biggest reason men struggle with style is not lack of effort. It is lack of clarity. Most men don’t know what matters most, so they try random things that don’t move the needle.",
              "You might buy new clothes, try a different haircut, or follow trends online, but without a clear structure, nothing sticks. Real style improvement comes from focusing on the fundamentals in the right order.",
            ]}
          />

          <Section
            title="The 30-day approach to improving your style"
            text={[
              "Instead of trying to change everything at once, break your style upgrade into focused improvements. Each week should target one high-impact area.",
              "This approach works because style is compounding. Small improvements in fit, shoes, and grooming combine to create a major visible upgrade.",
            ]}
          />

          <ListSection
            title="Week 1: Fix your fit"
            items={[
              "Stop wearing oversized or baggy clothes",
              "Check shoulder fit on shirts and jackets",
              "Make sure pants have a clean taper",
              "Avoid excessive length or stacking",
              "Choose clothes that follow your body shape",
            ]}
          />

          <Section
            title="Why fit matters the most"
            text={[
              "Fit is the single biggest upgrade you can make. Even basic clothes look premium when they fit well. Poor fit, on the other hand, makes expensive clothes look cheap.",
              "If you only fix one thing in your style, fix fit first. It gives immediate visible results.",
            ]}
          />

          <ListSection
            title="Week 2: Upgrade your shoes"
            items={[
              "Replace worn-out sneakers",
              "Get a clean pair of white sneakers",
              "Add one versatile formal shoe",
              "Avoid overly sporty shoes for daily wear",
              "Keep your shoes clean at all times",
            ]}
          />

          <Section
            title="Shoes are a silent signal"
            text={[
              "Most men underestimate how much shoes affect perception. People notice them more than you think. Clean, minimal, well-matched footwear instantly elevates your look.",
            ]}
          />

          <ListSection
            title="Week 3: Improve grooming"
            items={[
              "Get a clean, consistent haircut",
              "Trim or shape your beard regularly",
              "Maintain basic skincare",
              "Keep nails clean and trimmed",
              "Use a subtle fragrance",
            ]}
          />

          <Section
            title="Grooming multiplies everything"
            text={[
              "You can wear great clothes, but poor grooming will still drag your appearance down. Grooming is not about vanity. It is about looking sharp and put together.",
            ]}
          />

          <ListSection
            title="Week 4: Build a clean wardrobe"
            items={[
              "Add neutral color basics",
              "Avoid loud logos and graphics",
              "Choose versatile pieces",
              "Build repeatable outfits",
              "Focus on quality over quantity",
            ]}
          />

          <Section
            title="Stop buying random clothes"
            text={[
              "Most men have a wardrobe full of items but nothing to wear. That happens when you buy without a system. A strong wardrobe is built intentionally, not randomly.",
            ]}
          />

          <Section
            title="Common mistakes to avoid"
            text={[
              "Trying to follow every trend",
              "Ignoring shoes and grooming",
              "Buying too many clothes at once",
              "Focusing only on comfort",
              "Not understanding fit",
            ]}
          />

          <Section
            title="Final takeaway"
            text={[
              "Improving your style is not complicated. It just requires focus. If you fix fit, upgrade your shoes, improve grooming, and build a cleaner wardrobe, your entire appearance changes.",
              "You don’t need more effort. You need better direction.",
            ]}
          />
        </article>

        {/* Final CTA */}
        <div className="mt-14 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-6 text-center">
          <h2 className="text-2xl font-semibold">
            Start your style upgrade today
          </h2>
          <p className="mt-3 text-white/70">
            Get your StyleScore and see exactly what to improve first.
          </p>
          <a
            href="/onboarding"
            className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black hover:bg-orange-300"
          >
            Take the StyleScore Test
          </a>
        </div>
      </div>
    </main>
  );
}

/* Components */

function Section({ title, text }: { title: string; text: string[] }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold">{title}</h2>
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
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-white/70">
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_32%),linear-gradient(180deg,_#0a1023_0%,_#050816_52%,_#02040b_100%)]" />
    </div>
  );
}