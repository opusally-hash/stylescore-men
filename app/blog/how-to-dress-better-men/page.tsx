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

const seo = legacyBlogSeo["how-to-dress-better-men"];

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
            How to Dress Better as a Man (Simple Rules That Work)
          </h1>

          <p className="mt-4 text-sm text-white/45">
            By StyleScore • Updated April 5, 2026
          </p>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Most men think dressing better means becoming more fashionable. That is
            the wrong frame. Dressing better usually means looking more intentional,
            cleaner, sharper, and more appropriate in the clothes you already wear
            most often. It is not about building a costume. It is about improving
            the signals your clothes send every day.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-white/70">
            The good news is that the rules that actually matter are simple. The bad
            news is that most men skip them because they look boring from a distance.
            But the boring rules are what make the visible difference. Fit, shoes,
            grooming, color control, and consistency beat randomness every time.
          </p>

          <LegacyBlogTopCta />

          <div className="mt-10 space-y-10">
            <Section
              title="Start with fit before you buy anything new"
              paragraphs={[
                "If your clothes do not fit properly, nothing else can rescue the outfit. Men often try to improve style by changing brands, adding trends, or buying more variety. But if the shirt still hangs off the shoulders, the pants still puddle at the ankle, and the jacket still feels too long, the upgrade never fully lands.",
                "Fit matters because it shapes the entire silhouette. When the body line looks clean, the outfit reads as intentional even when the clothes are simple. When the fit is weak, the outfit reads as accidental even when the pieces are decent. That is why fit is the highest-return rule in menswear.",
                "A better-dressed version of you probably does not need radically different clothing. He needs cleaner shoulders, better sleeve lengths, more controlled trouser breaks, and less extra fabric. Fix those things first and the rest of your wardrobe immediately looks more expensive.",
              ]}
            />

            <Section
              title="Build around simple colors you can repeat"
              paragraphs={[
                "Another reason many men struggle is that their wardrobe is harder to combine than it should be. They buy isolated items instead of combinations. One shirt works with one pair of pants, one jacket works with one shoe, and everything else becomes trial and error. That creates unnecessary friction every morning.",
                "The simplest fix is building around neutral colors you can actually repeat: white, black, charcoal, navy, olive, mid-blue denim, brown, and off-white. Neutrals create a cleaner foundation because they combine easily, reduce visual conflict, and let the outfit feel more deliberate without requiring much creativity.",
                "This does not mean you can never wear color. It means color works better when the base is under control. Men who dress well consistently usually make the core of the outfit easy first, then add variation later.",
              ]}
            />

            <Section
              title="Upgrade your shoes before you chase style details"
              paragraphs={[
                "Shoes carry more visual weight than men expect. They sit at the end of every outfit and quietly confirm whether the rest of the look was thought through. A clean overshirt and strong pants still lose force if the footwear looks tired, too sporty, or disconnected from the occasion.",
                "That is why footwear is one of the fastest ways to dress better. A small rotation of clean white sneakers, one darker casual option, and one sharper pair for elevated settings covers more style ground than most men realize. You do not need a big shoe collection. You need the right categories in presentable condition.",
                "If your current rotation is dominated by old running shoes, fix that before anything else. The change is visible immediately, and it improves casual outfits, work-adjacent outfits, and date-night outfits all at once.",
              ]}
            />

            <InlineCta
              title="Style gets easier when you know your weak category"
              body="A lot of men think they need a full reset when they really only need one stronger category. StyleScore helps you find the category that gives you the fastest return."
            />

            <Section
              title="Treat grooming as part of the outfit"
              paragraphs={[
                "You do not dress better just by improving clothing. You dress better by improving presentation. Grooming is part of presentation. Hair, beard shape, skin, nails, and general upkeep influence whether the clothes look finished or only partially convincing.",
                "This matters because good grooming makes average clothing look stronger, while weak grooming makes decent clothing look incomplete. You do not need a complicated routine, but you do need consistency. Fresh haircut timing, intentional facial hair, and basic skin care are worth more than men think.",
                "If you want the simplest version of this rule, make sure the clothing and the face are sending the same message. Sharp clothes with neglected grooming clash. Clean grooming with weak clothes still helps. The best result is alignment.",
              ]}
            />

            <Section
              title="Dress for the setting, not for your own default"
              paragraphs={[
                "Many men wear some version of the same look everywhere because it is easy. That is understandable, but it caps how good they can look. Dressing better means learning to adjust without overcomplicating. A dinner, work meeting, daytime hangout, and special event do not all ask for the same formula.",
                "The goal is not to be overdressed. The goal is to look like you understood the room. Men who do this well usually dress one small level above the baseline without making it dramatic. That might mean sharper shoes, a cleaner layer, darker trousers, or a more intentional shirt than the average guy around them.",
                "This is one of the easiest ways to stand out positively because so many men underdress by habit. When the room matters, the slight upgrade reads as competence.",
              ]}
            />

            <Section
              title="Stop buying random pieces and start building formulas"
              paragraphs={[
                "A better wardrobe is not just a larger wardrobe. It is a more predictable one. Men dress better when they have repeatable outfit formulas they trust. A formula is not boring. It is efficient. It removes the weak decisions and keeps the combinations that consistently work.",
                "Examples are simple: knit polo plus dark trousers plus leather sneakers. Oxford shirt plus chinos plus loafers. Clean T-shirt plus overshirt plus tapered jeans plus minimal sneakers. Once a few formulas work on your build, style becomes easier because you are no longer reinventing the wheel every morning.",
                "This is also the difference between shopping with intention and shopping emotionally. When you know your formulas, you buy to strengthen them. When you do not, you buy whatever feels appealing for five minutes and then wonder why it never gets worn.",
              ]}
            />

            <Section
              title="Use accessories and layers to sharpen, not to distract"
              paragraphs={[
                "Men often overestimate how much style lives in the extra details. Watches, chains, rings, overshirts, sunglasses, and other extras can absolutely sharpen an outfit, but only after the foundation works. If the fit is off or the shoe choice is weak, accessories rarely save anything.",
                "The best way to use detail is as reinforcement. A clean watch can add polish to a simple outfit. A jacket can structure the silhouette. A chain can add edge if the rest of the look is minimal and controlled. But when details become the main event, the outfit often feels forced.",
                "Better dressing usually looks calmer, not busier. Men who look expensive and composed are often wearing fewer visible ideas at once, not more.",
              ]}
            />

            <Section
              title="Make quality decisions on your highest-rotation items"
              paragraphs={[
                "You do not need every item in the closet to be excellent. You need the pieces you rely on most often to stop hurting you. The shirt you wear twice a week matters more than the jacket you wear once every two months. The sneakers you wear four days a week matter more than the dress shoe you save for rare occasions.",
                "That is why the best style upgrades are usually concentrated. Improve the five or six pieces that carry most of your real-life wardrobe. Once those improve, your whole appearance improves because the average quality of your daily outfits rises.",
                "This approach is also cheaper. Instead of trying to become stylish through constant accumulation, you become sharper through better selection and better replacement timing.",
              ]}
            />

            <Section
              title="The fastest path to dressing better"
              paragraphs={[
                "If you want to dress better quickly, follow the order that actually moves results: fix fit, clean up shoes, stabilize grooming, simplify colors, then make the wardrobe more coherent. That order works because it attacks the most visible problems first.",
                "A lot of style advice gets lost because it gives too many ideas without telling you which one matters most right now. Improvement becomes much easier once the next move is clear. That is the real advantage of assessment-driven advice. It gives you sequence instead of noise.",
                "Once you know which category is weakening your appearance the most, dressing better becomes less emotional and more strategic. That is when style stops feeling confusing.",
              ]}
            />

            <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold text-white">
                Want the quickest way to know what to fix first?
              </h2>
              <p className="mt-4 leading-8 text-white/72">
                Take the StyleScore assessment and let the diagnosis show you
                whether fit, shoes, grooming, wardrobe logic, or occasion dressing
                is the real bottleneck. That is how you stop guessing and start
                improving in the right order.
              </p>
              <p className="mt-4 leading-8 text-white/72">
                Once the weak category is obvious, the rest of the upgrade path gets
                simpler. That is the difference between trying harder and actually
                dressing better.
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
            {paragraph}
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
        Check your StyleScore
      </a>
    </div>
  );
}
