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
    "Learn how to improve your style in 30 days with practical upgrades in fit, shoes, grooming, and wardrobe basics.",
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
            How to Improve Your Style in 30 Days
          </h1>
<p className="text-white/70 mt-4">
  Want to know how you actually score in style? 
</p>

<a
  href="/assessment"
  className="inline-block mt-4 bg-orange-400 text-black px-5 py-3 rounded-xl font-semibold"
>
  Take the Free StyleScore →
</a>



          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men do not need a complete wardrobe reset. They need better
            decisions. Improving your style is not about becoming fashionable
            overnight or buying twenty new things. It is about fixing the
            highest-impact problems first and building a cleaner, sharper, more
            consistent look over time.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            If your style currently feels average, repetitive, or unfinished,
            the good news is that visible improvement can happen quickly.
            Thirty days is enough time to look more intentional, more polished,
            and more confident — if you focus on the right categories.
          </p>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-semibold text-white">
            Know exactly what to fix first
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/70">
            Take the StyleScore assessment and identify your weakest areas
            across fit, wardrobe, shoes, grooming, and occasion dressing.
          </p>
          <a
            href="/assessment"
            className="premium-glow mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_24px_rgba(251,146,60,0.4)]"
          >
            Get My Style Score
          </a>
        </div>

        <article className="mt-12 space-y-10">
          <Section
            title="Why most men struggle with style"
            text={[
              "The biggest reason most men struggle with style is not laziness. It is lack of structure. They know they want to look better, but they do not know what matters most. So they try random upgrades: a new shirt here, different shoes there, maybe a better haircut once in a while. Without a clear system, nothing compounds.",
              "Style improvement gets much easier when you stop thinking in terms of fashion trends and start thinking in terms of fundamentals. Good style usually comes down to a few visible areas working together: fit, shoes, grooming, wardrobe clarity, and occasion awareness. If one or two of those areas are weak, the whole look feels average.",
            ]}
          />

          <Section
            title="The 30-day approach to improving your style"
            text={[
              "Trying to change everything at once rarely works. You buy too much, lose focus, and end up with more confusion than before. A better approach is to upgrade your style in layers. In thirty days, you can focus on the categories that matter most and build visible momentum.",
              "This works because style is compounding. Better fit makes your wardrobe look sharper. Better shoes make outfits feel more intentional. Better grooming multiplies everything else. Once these improvements stack, the full result feels much bigger than any single upgrade.",
            ]}
          />

          <p className="leading-8 text-white/70">
            Before guessing what to change, take the{" "}
            <a
              href="/blog/mens-style-test"
              className="underline decoration-orange-300 underline-offset-4 text-orange-300"
            >
              men’s style test
            </a>{" "}
            to see which areas are actually holding you back.
          </p>

          <Section
            title="Week 1: Fix your fit"
            text={[
              "Fit is the fastest style upgrade most men can make. Even basic clothes look more expensive when they fit properly. On the other hand, oversized shirts, sloppy sleeves, wide pant legs, and poor length ruin the overall impression immediately.",
              "This first week should be about auditing your current clothes honestly. Which shirts sit well at the shoulders? Which pants stack too much? Which pieces make you look broader, shorter, or less structured than you want? Once you identify the worst offenders, stop wearing them by default.",
            ]}
          />

          <ListSection
            title="What to do during fit week"
            items={[
              "Remove obviously oversized or shapeless pieces from regular rotation",
              "Check shoulder fit on shirts and jackets",
              "Make sure your pants have a cleaner leg line",
              "Avoid excessive trouser length or bunching",
              "Prioritize clothing that follows your body rather than hiding it",
            ]}
          />

          <Section
            title="Why fit matters more than trendiness"
            text={[
              "A well-fitted plain outfit will beat a trend-heavy but badly fitted outfit almost every time. Fit gives structure. It makes you look more intentional, more mature, and more attractive without asking for flashy choices.",
              "That is why so many men who look good seem to do very little. Often, they are simply wearing clothes that fit them correctly.",
            ]}
          />

          <Section
            title="Week 2: Upgrade your shoes"
            text={[
              "Shoes are one of the most ignored parts of men’s style, but they are also one of the most visible. A decent outfit with weak shoes still feels unfinished. Better shoes often create a bigger upgrade than buying more tops.",
              "Most men rely too heavily on running shoes or old casual sneakers. That does not mean you need a large shoe collection. You just need a few stronger options that suit the situations you actually live in.",
            ]}
          />

          <ListSection
            title="What to do during shoe week"
            items={[
              "Replace visibly worn-out sneakers",
              "Get one clean pair of white minimal sneakers",
              "Add one versatile dress-better option like loafers or simple leather shoes",
              "Keep your shoes clean every week",
              "Match your footwear more intentionally to your outfit and occasion",
            ]}
          />

          <p className="leading-8 text-white/70">
            If footwear is one of your weak spots, start with our guide to{" "}
            <a
              href="/blog/best-white-sneakers-men"
              className="underline decoration-orange-300 underline-offset-4 text-orange-300"
            >
              the best white sneakers for men
            </a>{" "}
            for one of the easiest style upgrades you can make.
          </p>

          <Section
            title="Week 3: Improve grooming"
            text={[
              "You can wear better clothes and still look average if grooming is weak. Hair, beard, skin, nails, and overall finish communicate discipline and polish. Grooming is not about vanity. It is about looking cared for.",
              "This week should be about creating a baseline routine that is simple enough to maintain. You do not need an elaborate system. You need consistency. The goal is to remove the neglected look that quietly lowers your overall presentation.",
            ]}
          />

          <ListSection
            title="What to do during grooming week"
            items={[
              "Get a clean, current haircut that suits your face shape",
              "Trim and define your beard or shave more cleanly",
              "Use a simple skincare routine for cleaner skin texture",
              "Keep nails clean and trimmed",
              "Add a subtle fragrance or deodorant routine that feels intentional",
            ]}
          />

          <Section
            title="Grooming multiplies everything else"
            text={[
              "Think of grooming as a multiplier. Good grooming makes average outfits look better. Weak grooming makes decent outfits feel forgettable. That is why this category creates such strong visual return with relatively little effort.",
            ]}
          />

          <Section
            title="Week 4: Build a cleaner wardrobe"
            text={[
              "Once fit, shoes, and grooming improve, the final step is cleaning up your wardrobe logic. Many men have enough clothes but no real system. Their closet is full of random items that do not combine well, which leads to repetitive outfits that still feel unconvincing.",
              "A strong wardrobe is not large. It is coherent. The best basics are versatile, neutral, and easy to repeat. Once your core items start working together, style becomes easier and faster.",
            ]}
          />

          <ListSection
            title="What to do during wardrobe week"
            items={[
              "Focus on neutral color basics first",
              "Reduce loud logos and distracting graphics",
              "Choose pieces that work across multiple outfits",
              "Build 2–3 reliable outfit formulas you can repeat",
              "Buy fewer, stronger items instead of many random ones",
            ]}
          />

          <Section
            title="Common mistakes to avoid during a 30-day style reset"
            text={[
              "The most common mistake is trying to solve style with shopping alone. Buying more pieces without fixing fit, shoes, or grooming usually adds clutter rather than improvement.",
              "Another common mistake is becoming too trend-driven. A style reset should make you look more polished, not more experimental. Focus on clean, reliable upgrades first. You can add personality later once the foundation is strong.",
            ]}
          />

          <ListSection
            title="Avoid these traps"
            items={[
              "Buying too many clothes at once",
              "Ignoring fit while chasing new pieces",
              "Keeping worn shoes in regular rotation",
              "Treating grooming like an afterthought",
              "Trying to copy someone else’s exact style instead of improving your own base",
            ]}
          />

          <Section
            title="What real style improvement actually looks like"
            text={[
              "Improving your style does not mean you suddenly look like a runway model. It means your appearance starts feeling cleaner, sharper, and more consistent. People notice that your clothes suit you better. Your shoes look more intentional. Your grooming looks more controlled. The full picture feels stronger.",
              "That is what makes style improvement powerful. It changes how you are perceived at work, socially, and in your own mirror. Better style often creates better confidence because you stop second-guessing how you look.",
            ]}
          />

          <Section
            title="Final takeaway"
            text={[
              "You do not need more fashion information. You need a stronger upgrade sequence. In 30 days, most men can make real visible progress by focusing on fit first, shoes second, grooming third, and wardrobe clarity fourth.",
              "That is why a diagnostic tool matters. Once you know your weakest categories, improving your style stops being abstract. It becomes practical. And practical style is what actually changes lives.",
            ]}
          />

          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5 text-white/70">
              <div>
                <h3 className="font-semibold text-white">
                  Can I really improve my style in 30 days?
                </h3>
                <p className="mt-1 leading-7">
                  Yes. Most men can make visible progress in 30 days by fixing
                  fit, improving shoes, strengthening grooming, and organizing
                  their wardrobe better.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  What should I fix first to look better?
                </h3>
                <p className="mt-1 leading-7">
                  Fit is usually the best first move, followed by shoes and
                  grooming. Those three categories create the fastest visible
                  improvement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Do I need a lot of money to improve my style?
                </h3>
                <p className="mt-1 leading-7">
                  No. Better fit, cleaner shoes, and stronger grooming habits
                  often matter more than expensive clothes.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  What if I don’t know where my style is weak?
                </h3>
                <p className="mt-1 leading-7">
                  That is exactly why a score-based assessment helps. It gives
                  you a clearer view of your weakest categories so you can
                  improve with direction instead of guessing.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-14 rounded-[1.75rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Start your style upgrade today
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
            Get your StyleScore and see exactly what to improve first instead of
            guessing your way through style.
          </p>
          <a
            href="/assessment"
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
