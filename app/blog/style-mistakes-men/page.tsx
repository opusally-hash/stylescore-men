import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  buildLegacyBlogMetadata,
  LegacyBlogStructuredData,
  legacyBlogSeo,
} from "../_components/legacy-blog-seo";
import { LegacyBlogFaq, LegacyBlogTopCta } from "../_components/legacy-blog-extras";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const seo = legacyBlogSeo["style-mistakes-men"];

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
            10 Style Mistakes Most Men Make
          </h1>

          <p className="mt-4 text-sm text-white/45">
            By StyleScore • Updated April 5, 2026
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men do not look bad because they lack money. They look bad because
            they repeat the same handful of style mistakes so often that the whole
            outfit collapses before anyone notices the better parts. A decent shirt
            cannot save the wrong shoes. Good pants cannot carry weak grooming. A
            nice jacket still loses if the fit is off.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            The frustrating part is that most of these mistakes feel normal when
            you are the one getting dressed. That is why they survive so long.
            They do not scream for attention. They quietly lower your overall
            presence. The good news is that they are also fixable, and most of the
            fixes are simpler than men think.
          </p>

          <LegacyBlogTopCta />

          <div className="mt-10 space-y-10">
            <Section
              title="1. Wearing clothes that are too big"
              paragraphs={[
                "Oversized clothing is still the most common style mistake men make. It is usually not about fashion taste. It is about habit. Men buy the size they have always bought, choose comfort over shape, or assume loose clothing is more flattering. In reality, extra fabric makes the body look less intentional, less athletic, and less put together.",
                "A shirt that hangs off the shoulders, sleeves that eat the hands, and pants that stack heavily at the ankle all send the same message: this man is wearing clothes, but he is not managing presentation. The problem is not only aesthetic. Loose clothing blurs the outline of the body and makes even good pieces feel cheaper than they are.",
                "If you only fix one thing in your wardrobe, fix fit first. It does more for your appearance than buying trendier clothes. If you want the fit benchmarks, read [How to Dress Better as a Man](/blog/how-to-dress-better-men) after this.",
              ]}
            />

            <Section
              title="2. Treating shoes like an afterthought"
              paragraphs={[
                "Weak shoes ruin strong outfits constantly. Men spend time choosing a jacket, shirt, or pants, then throw on the same tired running shoes with everything. That breaks the look immediately. Shoes finish the outfit. When they feel lazy, the whole outfit feels lazy.",
                "This is especially visible in settings where everything else is almost acceptable. A clean knit, dark jeans, and the wrong gym sneakers still read as unfinished. On the other hand, simple white sneakers, loafers, clean boots, or minimal casual shoes instantly make the outfit feel more deliberate.",
                "If you want one easy upgrade with a big return, build one clean pair of white sneakers and one darker, slightly sharper option into your rotation. The difference between random footwear and intentional footwear is often the difference between average and sharp.",
              ]}
            />

            <InlineCta
              title="Most men lose points at the bottom of the outfit first"
              body="StyleScore breaks out shoes as a separate category because bad footwear drags down everything else faster than most men realize."
            />

            <Section
              title="3. Keeping worn-out basics too long"
              paragraphs={[
                "A lot of men understand what a good basic looks like, but they keep that item in service months or years after it stopped helping them. T-shirts lose shape. collars curl. jeans fade in awkward places. sneakers yellow. belt edges crack. Men often call these pieces comfortable or broken in, but what they usually are is expired.",
                "There is a huge difference between lived-in and tired. Lived-in means the piece still holds shape and looks intentional. Tired means the piece now weakens the whole outfit. Once a shirt looks twisted, stretched, or permanently collapsed, it is not part of your style anymore. It is just clutter you are still wearing.",
                "The fastest correction is ruthless replacement of the items you wear most often. Replace the three pieces doing the most damage and your overall style score can jump quickly without a complete wardrobe overhaul.",
              ]}
            />

            <Section
              title="4. Ignoring grooming because the outfit feels more important"
              paragraphs={[
                "A strong outfit cannot fully carry weak grooming. Men underestimate this all the time because grooming feels separate from style. It is not separate. It multiplies or degrades every clothing decision you make. Hair, beard lines, skin quality, nails, and general upkeep all influence whether the outfit looks finished.",
                "This mistake is especially expensive because it makes decent clothing look less convincing. Someone can wear clean basics and still come across as underdeveloped if the haircut is overdue, facial hair looks accidental, or overall upkeep feels inconsistent.",
                "If your grooming is irregular, the solution is not to become obsessive. The solution is to build a low-friction routine you can actually keep. Consistency matters more than complexity. That is why [Men's Grooming Basics](/blog/mens-grooming-basics) is one of the most practical places to start.",
              ]}
            />

            <Section
              title="5. Dressing without an outfit logic"
              paragraphs={[
                "A lot of men own enough decent clothes to look good, but they still dress poorly because their wardrobe has no internal logic. Pieces do not work together. Colors fight. dressiness levels clash. A sharp overshirt gets worn over weak pants. A refined loafer gets paired with a sloppy top. Nothing is terrible on its own, but nothing belongs together either.",
                "Style gets easier when your wardrobe starts behaving like a system. Neutrals combine well. silhouettes repeat. shoes match the tone of the outfit. layers feel intentional rather than random. Good style is less about constant creativity and more about repeatable combinations that stay coherent.",
                "If your closet feels like isolated purchases instead of a usable system, you do not need more variety first. You need more compatibility. That usually means better basics, fewer impulse buys, and a clearer idea of what your everyday uniform should be.",
              ]}
            />

            <Section
              title="6. Wearing the wrong amount of formality for the setting"
              paragraphs={[
                "Another common mistake is dressing in a way that ignores the context entirely. Some men underdress by default, using the same outfit formula for coffee, work, dates, dinners, and events that carry more social weight. Others overdress awkwardly and end up looking stiff rather than sharp.",
                "Looking good is not just about buying better clothing. It is about matching the level of the room. A simple overshirt and clean sneakers might be exactly right for one setting and visibly too casual for another. The problem is not the clothes themselves. The problem is the mismatch.",
                "The easiest rule is to dress one small level above the average tone when it matters. Not theatrical. Not peacocking. Just slightly more intentional than the room. That is usually enough to stand out positively.",
              ]}
            />

            <Section
              title="7. Letting comfort become an excuse"
              paragraphs={[
                "Comfort matters, but many men misuse it as a defense against better style. They assume that sharper clothing must feel restrictive, fussy, or impractical. So they default to the softest, loosest, easiest option every time. The result is not comfort with style. It is comfort at the expense of style.",
                "The reality is that modern menswear gives you more than enough room to look sharp without feeling overdressed or trapped. Better fabrics, smarter cuts, and more intentional casual clothing make that trade-off far smaller than men imagine. The issue is not that stylish clothes are uncomfortable. It is that most men never learn what a comfortable but sharp option looks like.",
                "If your wardrobe is built around comfort-first pieces, do not throw it all out. Start replacing the sloppiest versions with cleaner versions that keep the same function. That is how you upgrade without creating resistance.",
              ]}
            />

            <Section
              title="8. Copying trends instead of solving fundamentals"
              paragraphs={[
                "Trend chasing is a quieter mistake, but it causes a lot of unnecessary confusion. Men who feel insecure about their style often jump toward whatever feels fashionable in the moment instead of fixing the foundations that would improve every outfit. They buy trend items before they can manage fit, grooming, basic color harmony, or shoes.",
                "This leads to a strange result: more clothes, but no better style. Trendy pieces on top of weak fundamentals still produce weak outfits. They sometimes make things worse because the attention goes straight to the parts of the look that are not ready for it.",
                "Foundations beat novelty. A man in simple, well-fitted basics will outperform a man in trend pieces that do not fit or coordinate. Build the base first. Add personality second.",
              ]}
            />

            <Section
              title="9. Buying too much before learning what works"
              paragraphs={[
                "Men often try to solve style problems with volume. More shirts. More jackets. More shoes. More options. But if the diagnosis is unclear, more purchases just increase the number of bad decisions available in the closet. That is how wardrobes become crowded while outfits stay weak.",
                "A better approach is to diagnose first, then buy in order. Are you losing points on fit? Fix tailoring and proportions before buying more. Are shoes lagging? Fix footwear before adding more tops. Is grooming the weak link? That may be the true highest-return move even if you would rather shop.",
                "This is one reason assessment-based style advice works better than random inspiration. It gives you a sequence instead of just more ideas. Sequence matters because the wrong upgrade at the wrong time wastes money and leaves the visible problem untouched.",
              ]}
            />

            <Section
              title="10. Never measuring your style honestly"
              paragraphs={[
                "The final mistake is never getting objective about your current baseline. A lot of men think they dress better than they do because their standard is simply whether the outfit feels acceptable. But acceptable is not a useful measurement if the goal is to look more intentional, more competent, or more attractive.",
                "You do not improve style by guessing. You improve it by identifying which categories are already decent and which are dragging the whole presentation down. That is the difference between random effort and strategic effort. The first costs more and accomplishes less.",
                "If you want to stop repeating the same weak patterns, get a real baseline. Once you know whether fit, shoes, wardrobe logic, grooming, or occasion dressing is the actual problem, improvement gets much easier.",
              ]}
            />

            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">
                The fastest way to stop making these mistakes
              </h2>
              <p className="mt-4 leading-8 text-white/72">
                Most men do not need more fashion inspiration. They need a better
                diagnosis. That is why the quickest next step is not another random
                purchase. It is understanding which category is hurting you most
                right now so your next fix actually moves the score.
              </p>
              <p className="mt-4 leading-8 text-white/72">
                Take the StyleScore assessment, get the full free report, and then
                fix the highest-return category first. You will improve faster that
                way than by trying to upgrade everything at once.
              </p>
              <a
                href="/style-quiz"
                className="mt-5 inline-flex rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300"
              >
                Start the StyleScore assessment
              </a>
            </section>

            <LegacyBlogFaq />
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

function Section({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section>
      <h2 className="text-3xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="leading-8 text-white/72">
            {renderInlineLinks(paragraph)}
          </p>
        ))}
      </div>
    </section>
  );
}

function InlineCta({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-orange-400/20 bg-orange-400/10 p-6 text-center">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 leading-7 text-white/75">{body}</p>
      <a
        href="/style-quiz"
        className="mt-4 inline-flex rounded-2xl bg-orange-400 px-5 py-3 font-semibold text-black transition hover:bg-orange-300"
      >
        Get your StyleScore
      </a>
    </div>
  );
}

function renderInlineLinks(text: string) {
  const match = text.match(/\[([^\]]+)\]\(([^)]+)\)/);

  if (!match || match.index === undefined) {
    return text;
  }

  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);

  return (
    <>
      {before}
      <a
        href={match[2]}
        className="text-orange-300 underline decoration-orange-300 underline-offset-4 transition hover:text-orange-200"
      >
        {match[1]}
      </a>
      {after}
    </>
  );
}
