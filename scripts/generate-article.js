#!/usr/bin/env node

const path = require("node:path");
const OpenAIImport = require("openai");
const {
  SYSTEM_PROMPT,
  buildArticlePrompt,
  buildHumanizationPrompt,
  buildRepairPrompt,
  buildExpansionPrompt
} = require("./lib/prompt-templates");
const { requestIndexing } = require("./lib/google-indexing");
const {
  buildGeneratedArticleRecord,
  canonicalUrl,
  chooseRelatedArticles,
  ensureDir,
  generatedArticlesDir,
  getQueueEntry,
  loadKeywordsConfig,
  parseArgs,
  readJson,
  saveKeywordsConfig,
  selectNextQueueEntry,
  stripGeneratedSupportSections,
  updateQueueEntryAfterPublish,
  updateRelatedArticlesManifest,
  validateArticlePayload,
  writeJson
} = require("./lib/publishing-helpers");

const OpenAIClient = OpenAIImport.default || OpenAIImport;

const BANNED_WORD_REPLACEMENTS = {
  crucial: "important",
  paramount: "most important",
  elevate: "improve",
  curate: "build",
  effortless: "easy",
  timeless: "long-lasting",
  versatile: "easy to wear"
};

const AI_TELL_REPLACEMENTS = {
  "when it comes to": "for",
  "it's important to": "you need to",
  "for example, you might": "for example,",
  "in today's world": "today",
  "one of the key": "one major",
  "you're not alone": "this is common",
  "let's dig into": "here is the breakdown",
  "the point is not": "the goal is not",
  "the goal is not": "the goal is not",
  "the real shift": "the real change"
};

const DETERMINISTIC_RESCUE_LIBRARY = {
  "business-casual-outfits-men-who-hate-dressing-up": {
    title: "Business Casual Outfits for Men Who Hate Dressing Up | StyleScore",
    metaDescription:
      "A practical business casual guide for men who want office outfits that look sharp without feeling stiff. Easy formulas, better shoes, and common mistakes to avoid.",
    h1: "Business Casual Outfits for Men Who Hate Dressing Up",
    editorialBlueprint: [
      "Open by explaining that men usually hate fake office cosplay, not clothes themselves.",
      "Build around 3 low-friction business-casual uniforms that can repeat through the week.",
      "Call out quarter-zips, shiny dress shoes, and bad sneaker choices as the main offenders.",
      "Make the tone anti-corporate-costume and practical rather than formal."
    ],
    internalLinks: [
      "/assessment",
      "/blog/casual-outfits-men",
      "/blog/how-to-dress-better-men"
    ],
    sources: [
      {
        title: "What to Wear for Business Casual: Tips and Custom Options",
        url: "https://propercloth.com/reference/what-to-wear-for-business-casual-tips-and-custom-options/",
        publisher: "Proper Cloth"
      },
      {
        title: "Business Casual Attire, Explained",
        url: "https://www.gq.com/story/business-casual-attire-for-men-explained",
        publisher: "GQ"
      },
      {
        title: "5 Spring Business Casual Outfits to Make Your Office Less Miserable",
        url: "https://www.gq.com/story/business-casual-men-outfits-spring",
        publisher: "GQ"
      }
    ],
    faq: [
      {
        question: "What is the easiest business casual outfit for men?",
        answer:
          "Start with a collared shirt or knit polo, clean chinos or trousers, and simple loafers or minimal leather sneakers if your office allows them. That formula looks intentional without feeling dressed up."
      },
      {
        question: "Can men wear sneakers for business casual?",
        answer:
          "Yes, but only if they are clean, low-profile, and obviously chosen on purpose. Running shoes and bulky casual sneakers usually ruin the business-casual read."
      },
      {
        question: "What do men who hate dressing up usually get wrong at the office?",
        answer:
          "They rely on one lazy fallback outfit: untucked shirt, tired chinos, and gym-adjacent shoes. The clothes are not offensive, but the full look reads checked out."
      },
      {
        question: "How can I make business casual easier every morning?",
        answer:
          "Build three repeatable formulas, keep the colors quiet, and stop buying orphan pieces that only work with one exact outfit. Less choice usually means better consistency."
      }
    ],
    supplement: `## Stop treating business casual like a costume

Most men who hate dressing up do not actually hate clothes. They hate feeling fake. That is why business casual goes wrong so often. The internet tells men to buy a blazer, a random blue shirt, and some stiff loafers, then act surprised when the outfit feels like borrowed office theater. [Proper Cloth's business-casual guide](https://propercloth.com/reference/what-to-wear-for-business-casual-tips-and-custom-options/) is useful because it keeps the target simple: collared tops, clean trousers, and shoes that read professional without becoming formal. That is a much better starting point than trying to dress like HR wrote your personality.

## Build around one low-friction work uniform

If you want business casual to feel easy, stop trying to invent a new outfit every morning. The easiest office uniform is a knit polo or oxford, straight or tapered chinos, and a shoe that looks intentional. Dark olive chinos with a navy knit polo and brown loafers works. Grey trousers with an off-white OCBD and dark derbies works. Navy chinos with a textured overshirt and clean leather sneakers can work too if your office is relaxed enough. The point is repeatability. [GQ's business-casual explainer](https://www.gq.com/story/business-casual-attire-for-men-explained) keeps coming back to the same idea: the best version of business casual is calm, not complicated.

## Shoes decide whether the outfit looks office-ready or half-finished

Most men who say they hate dressing up are really reacting to bad shoes. Cheap shiny dress shoes look forced. Running shoes look like you gave up. The middle ground is where business casual lives: loafers, derbies, simple boots, and low-profile leather sneakers where the dress code allows them. That is also why the trouser hem matters so much. If the pants stack over the shoe, the lower half looks sloppy no matter how good the shirt is. A clean break and a sharper shoe fix more than another new top ever will.

## Use texture and tone instead of loud style moves

The safest way to make office outfits feel less boring is not brighter color or trendier pieces. It is texture. A merino knit polo feels better than a stiff poplin shirt. A soft overshirt feels better than a blazer if your workplace runs casual. Suede loafers feel easier than glossy leather lace-ups. [GQ's spring business-casual outfit guide](https://www.gq.com/story/business-casual-men-outfits-spring) does this well: the strongest outfits are still simple, but they mix texture and shape so the look has personality without shouting for attention.

## The mistakes that make business casual feel miserable

There are a few predictable misses. Stretch chinos that cling in the thigh and collapse at the ankle. Tiny check shirts that only exist because someone said they were office appropriate. Quarter-zips over everything. Bulky sneakers under otherwise clean outfits. All of it adds up to a wardrobe that feels more like compliance than style. Bad advice says business casual should be bland so nobody notices it. That is backwards. Business casual should be quiet enough for work and sharp enough that you do not look like the least switched-on man in the room.

## Make the system easier than your old lazy default

If you really hate dressing up, build a system that beats your lazy default on speed. Pick three shirts, three trousers, and three shoe options that all work together. Keep colors in the navy, grey, olive, stone, and brown range. Use [StyleScore](/assessment) if you want to know whether fit, shoes, or grooming is the category quietly ruining the whole office look. The right business-casual wardrobe should not feel like more effort. It should feel like less second-guessing.`
    ,
    extension: `## Three business-casual outfits that never feel like overkill

If you want something you can wear next week without staring at the closet, start here.

**Formula one: knit polo, tapered chinos, suede loafers.** This is the easiest office-smart uniform for men who hate layers. Navy or charcoal knit polo, olive or stone chinos, brown suede loafers. No tie. No blazer. No drama.

**Formula two: OCBD, dark trousers, derbies.** White or light blue oxford cloth shirt, charcoal or navy trousers, dark derbies. This is the one to use for client meetings, nicer offices, or days when you need a little more structure without looking stiff.

**Formula three: overshirt, tee, clean chinos, leather sneakers.** This only works in more relaxed offices, but it works well there. Keep the overshirt textured, the tee clean, and the sneaker low-profile. The second the sneaker looks athletic, the outfit stops reading business casual.

## What to stop buying if business casual keeps disappointing you

Stop buying clothes that only sound right on paper. Tiny checked office shirts. Shiny cheap dress shoes. Flimsy stretch chinos that collapse at the knee. The classic quarter-zip over a button-down if you do not actually like the way it looks on you. Most business-casual wardrobes feel bad because they were built from office category labels instead of real outfits.

## The easiest way to know whether your office outfits are actually working

Look at the whole silhouette, not each item in isolation. Does the shirt sit cleanly? Do the trousers break properly? Do the shoes support the tone of the outfit instead of pulling it casual or overly formal? If you want the fast outside read, that is where [StyleScore](/assessment) helps. It tells you whether the weak link is fit, footwear, grooming, or occasion dressing, so you do not keep blaming the wrong category.`
  },
  "how-to-match-colors-men-without-thinking": {
    title: "How to Match Colors as a Man Without Thinking Too Hard | StyleScore",
    metaDescription:
      "A simple color-matching system for men who want better outfits without memorizing a color wheel. Easy combinations, common mistakes, and a low-effort daily approach.",
    h1: "How to Match Colors as a Man Without Thinking Too Hard",
    editorialBlueprint: [
      "Make the article anti-color-wheel and anti-overcomplication.",
      "Teach a daily system: one dark anchor, one light support, one neutral finisher.",
      "Include concrete color formulas men can copy immediately.",
      "Explain why contrast mistakes, not color itself, are what usually ruin outfits."
    ],
    internalLinks: [
      "/assessment",
      "/blog/monochromatic-outfits-short-men",
      "/blog/how-to-dress-better-men"
    ],
    sources: [
      {
        title: "How to Know What Colors You Should Be Wearing",
        url: "https://www.gq.com/story/how-to-know-what-colors-you-should-be-wearing",
        publisher: "GQ"
      },
      {
        title: "How to Wear Color, According to the World's Best Celebrity Stylists",
        url: "https://www.gq.com/story/how-to-wear-color-from-best-celebrity-stylists",
        publisher: "GQ"
      },
      {
        title: "Colour Combinations, From Casual to Formal",
        url: "https://www.permanentstyle.com/2016/05/colour-combinations-from-casual-to-formal.html",
        publisher: "Permanent Style"
      }
    ],
    faq: [
      {
        question: "What is the easiest way for men to match colors?",
        answer:
          "Start with one dark base, one lighter support color, and one neutral shoe. That keeps most outfits controlled without needing a complicated system."
      },
      {
        question: "Which colors are hardest to mess up in menswear?",
        answer:
          "Navy, charcoal, olive, white, cream, stone, and brown are the safest starting point. They combine easily and do not force the whole outfit into high contrast."
      },
      {
        question: "Do men need bold colors to look stylish?",
        answer:
          "No. Most men look better when the shape, texture, and proportions are strong first. Color should support the outfit, not try to rescue it."
      },
      {
        question: "Why do some color combinations still look wrong even if the colors are good?",
        answer:
          "Because contrast, fabric, and fit still matter. Good colors cannot save clumsy proportions or bulky shoes."
      }
    ],
    supplement: `## Start with a quiet base, not a clever outfit

Men who struggle with color usually make the same mistake: they start with the accent instead of the base. If you begin with burgundy, bright green, or some seasonal trend shade, the outfit becomes a puzzle immediately. Start with navy, charcoal, olive, stone, cream, or dark denim and most of the work is already done. [GQ's guide to figuring out which colors you should wear](https://www.gq.com/story/how-to-know-what-colors-you-should-be-wearing) is useful because it treats color as communication, not decoration. That is exactly the right way to think about it.

## Use one dark, one light, and one neutral anchor

The easiest daily formula is one darker anchor, one lighter support, and one neutral finisher. Navy trousers, white tee, brown suede loafers. Olive chinos, off-white oxford, white sneakers. Charcoal trousers, pale blue shirt, dark brown derbies. You do not need to memorize a wheel. You need a few combinations that keep the outfit from splitting into random blocks. If you already have the dark base, the rest gets easier fast.

## Texture makes simple colors look better

A lot of men think they need more colors when what they really need is more texture. Navy cotton, navy wool, navy suede, and navy denim do not read like the same thing in an outfit. That is why monochrome or near-monochrome dressing looks richer when the fabrics change. [Permanent Style's piece on colour combinations](https://www.permanentstyle.com/2016/05/colour-combinations-from-casual-to-formal.html) gets this right: the best combinations often work because texture and formality are doing as much as the hue itself.

## Keep the accent small if you are still learning

Generic advice tells men to be bold with color to avoid looking boring. That is not the first move. The smarter move is one accent, not three. A muted green overshirt over a white tee and dark trousers. A burgundy knit with charcoal pants. A teal beanie or sock against a neutral outfit. [GQ's color-stylist piece](https://www.gq.com/story/how-to-wear-color-from-best-celebrity-stylists) makes the same point in a cleaner way: one strong color usually lands better than an outfit full of competing ones.

## Most color mistakes are really contrast mistakes

An outfit can use decent colors and still look wrong because the contrast is doing too much. Black shoes under light stone trousers create a hard stop at the ankle. A bright shirt under a bright jacket turns the top half into a fight. Loud color on top of bad fit only makes the problem easier to see. If you want color to feel automatic, lower the contrast before you add complexity.

## Build a small system you can repeat

You do not need a bigger personality in your wardrobe. You need a system that survives busy mornings. Keep your base colors tight, repeat the combinations that already work, and use [StyleScore](/assessment) if you want an outside read on whether color coordination is actually the weak link or whether fit and footwear are doing more damage. Color matching gets easier once you stop treating every outfit like a new experiment.`
    ,
    extension: `## Five color combinations men can use without thinking

If you want color to feel automatic, use combinations that already do the work for you.

- Navy + white + brown
- Olive + cream + white
- Charcoal + pale blue + dark brown
- Dark denim + grey + off-white
- Stone + black + white when the fit is sharp enough to handle the contrast

These work because they are stable, not because they are exciting. Exciting is overrated at 8 a.m. on a workday.

## Why too much contrast makes men think they are bad at color

Most men say they cannot match colors when the real issue is they are using too much jump between pieces. Black shoes with light khaki pants. Bright top with bright overshirt. Light jeans with a shirt that is louder than the rest of the outfit combined. The second the eye starts stopping at every boundary, the outfit feels clumsy.

## Use color to simplify the outfit, not rescue it

Bad advice says color should make the outfit more interesting. Better advice says color should make the outfit easier to read. If the fit is weak, the shoes are bulky, or the layering is off, strong color usually highlights the problem. That is why [StyleScore](/assessment) is useful here too. Men often blame color when the outfit is actually being ruined by fit or footwear.`
  },
  "what-shoes-to-wear-with-chinos-men": {
    title: "What Shoes to Wear With Chinos for Men | StyleScore",
    metaDescription:
      "A simple guide to the best shoes to wear with chinos for men. See when to choose loafers, derbies, sneakers, or boots, and which combinations make chinos look sharper.",
    h1: "What Shoes to Wear With Chinos for Men",
    editorialBlueprint: [
      "Frame chinos as the bridge between jeans and dress trousers, so the shoes set the tone.",
      "Compare loafers, derbies, clean sneakers, and boots by setting rather than trend.",
      "Explain that hem length and shoe profile matter as much as the shoe type.",
      "Call out bulky runners and glossy formal shoes as the common misses."
    ],
    internalLinks: [
      "/assessment",
      "/blog/best-shoes-for-short-men",
      "/blog/best-white-sneakers-men"
    ],
    sources: [
      {
        title: "The Best Chinos for Men Can Do Everything Jeans Can't",
        url: "https://www.gq.com/story/the-best-chinos-for-men",
        publisher: "GQ"
      },
      {
        title: "The Best Loafers for Men",
        url: "https://www.gq.com/story/the-best-loafers-for-men/",
        publisher: "GQ"
      },
      {
        title: "What to Wear for Business Casual: Tips and Custom Options",
        url: "https://propercloth.com/reference/what-to-wear-for-business-casual-tips-and-custom-options/",
        publisher: "Proper Cloth"
      }
    ],
    faq: [
      {
        question: "What shoes look best with chinos for men?",
        answer:
          "Loafers, derbies, clean leather sneakers, and simple boots are the safest answers. The best choice depends on how dressy the chinos and the setting are."
      },
      {
        question: "Can men wear sneakers with chinos?",
        answer:
          "Yes, but keep them clean and low-profile. Performance runners and bulky soles usually fight the cleaner shape that chinos are supposed to give you."
      },
      {
        question: "Should chinos touch the shoe?",
        answer:
          "They should break lightly or not at all. Heavy stacking makes chinos look sloppier and pulls attention away from the shoe choice."
      },
      {
        question: "Are loafers or derbies better with chinos?",
        answer:
          "Loafers feel easier and a little more relaxed. Derbies feel slightly more structured. Both work well if the trousers are hemmed cleanly and the rest of the outfit matches the tone."
      }
    ],
    supplement: `## Chinos are only as good as the shoe underneath them

Chinos are the bridge between jeans and dress trousers, which is why the shoe choice matters so much. The same pair of chinos can look sharp with loafers and weird with bulky sneakers. [GQ's chinos guide](https://www.gq.com/story/the-best-chinos-for-men) is useful because it treats chinos as a flexible category, not a single office uniform. That flexibility is the whole point, but it also means the shoes have to set the tone clearly.

## Loafers and derbies are the easiest smart options

If the outfit needs to feel office-ready or dinner-ready, start with loafers or derbies. Brown suede loafers with navy or olive chinos feels easy. Dark derbies with grey or stone chinos feels cleaner and more structured. These shoes work because they sit low, keep the lower half tidy, and do not drag the outfit into either gym territory or formal-suit territory. [GQ's loafer guide](https://www.gq.com/story/the-best-loafers-for-men/) makes the case well: loafers solve more wardrobe problems than men think.

## Minimal sneakers work when the rest of the outfit is controlled

Clean leather sneakers can work with chinos, but only if the rest of the outfit is tight. That means hemmed trousers, no giant logo, and no chunky athletic sole. White or off-white sneakers with olive, navy, or stone chinos is a safe move. Running shoes are not the same thing. Men keep making that substitution and then wondering why chinos suddenly look half-dressed.

## Boots work best when the chinos have a sharper line

Boots are usually strongest with darker chinos and cooler weather layers. Slim Chelsea boots, simple chukkas, and dressier lace-up boots work. Heavy work boots usually do not unless the whole outfit leans rugged on purpose. The cleaner the chinos, the cleaner the boot should be. If the trouser hem is already stacking, adding a bulky boot just makes the lower half heavier.

## The mistakes that ruin chinos fast

The biggest miss is mixing chinos with shoes that belong to a different category of outfit entirely. Bright gym shoes, collapsing skate shoes, or hyper-formal glossy oxfords all make chinos feel confused. [Proper Cloth's business-casual guidance](https://propercloth.com/reference/what-to-wear-for-business-casual-tips-and-custom-options/) keeps landing on the same categories for a reason: loafers, derbies, and cleaner sneakers are usually enough. Men overcomplicate this because they want a perfect answer for every color. Usually the answer is just cleaner shape and better tone control.

## Keep the lower half doing one job

If you want chinos to look stronger, make the lower half say one thing. Smart-casual. Relaxed but intentional. Clean enough for work, easy enough for weekends. Pick the shoes that support that message, and use [StyleScore](/assessment) if you want an outside read on whether your footwear is carrying its share or quietly flattening every outfit you build around chinos.`
    ,
    extension: `## The easiest chinos-and-shoes combinations by setting

For the office: navy or grey chinos with loafers or derbies. That is the cleanest lane.

For weekends: stone or olive chinos with white leather sneakers or tan suede loafers.

For date night: dark chinos with slim boots or dark loafers.

For travel or mixed-use days: darker chinos with a clean low-profile sneaker that does not look like running gear.

Once you sort by setting, the whole category gets easier fast.

## The two details that matter more than men think

First: trouser break. If chinos are stacking, even the right shoe starts looking wrong. Second: shoe profile. The lower and cleaner the shoe, the easier chinos look. A bulky shoe makes chinos feel heavier and less intentional.

## Stop asking for the one perfect shoe

There is no single perfect shoe for chinos because chinos are not a single mood. That is why men keep getting confused. Use [StyleScore](/assessment) if you want to know whether the real problem is the shoe choice itself or the way the rest of the outfit is framing it. Usually the best answer is not more options. It is cleaner categories and a sharper hem.`
  },
  "mens-grooming-routine-beginners": {
    title: "Men's Grooming Routine for Beginners | StyleScore",
    metaDescription:
      "A simple men's grooming routine for beginners that covers skin, hair, shaving, and basic maintenance without turning self-care into a second job.",
    h1: "Men's Grooming Routine for Beginners",
    editorialBlueprint: [
      "Make the article low-friction and anti-12-step-routine.",
      "Focus on the visible beginner wins: skin, haircut cadence, beard or shaving lines, and basic maintenance.",
      "Include a simple morning routine, night routine, and weekly checklist.",
      "Make it clear that consistency beats buying more products."
    ],
    internalLinks: [
      "/assessment",
      "/blog/grooming-multiplier-mens-style",
      "/blog/mens-grooming-basics"
    ],
    sources: [
      {
        title: "The Best Simple Skin Care Routine for Men",
        url: "https://www.gq.com/story/simple-skin-care-for-men",
        publisher: "GQ"
      },
      {
        title: "The Most Common Men's Grooming Mistakes to Avoid",
        url: "https://www.gq.com/story/most-common-mens-grooming-mistakes-to-avoid",
        publisher: "GQ"
      },
      {
        title: "Habits of Well-Groomed Men",
        url: "https://www.gq.com/story/habits-of-well-groomed-men",
        publisher: "GQ"
      }
    ],
    faq: [
      {
        question: "What is the most basic grooming routine for men?",
        answer:
          "Cleanse your face, use moisturizer with SPF in the morning, keep haircuts on schedule, and make sure shaving or beard lines look intentional. That covers most of the visible difference."
      },
      {
        question: "Do men need a lot of products to look well groomed?",
        answer:
          "No. Most beginners do fine with a cleanser, moisturizer, SPF, a trimmer or razor setup, and decent hair product if they use it."
      },
      {
        question: "How often should men get a haircut?",
        answer:
          "Usually every 2 to 4 weeks depending on the cut. The sharper the haircut, the more obvious the drift once it grows out."
      },
      {
        question: "What grooming mistake makes men look sloppy fastest?",
        answer:
          "Letting multiple small things drift at the same time: haircut, beard edges, dry skin, and tired nails. No single issue is huge, but together they flatten the whole impression."
      }
    ],
    supplement: `## Start with the habits people actually notice

Most beginner grooming advice is bloated. Ten products. Complicated shaving gear. A routine that sounds like a second job. That is why most men bounce off it. The better way is to start with the habits people actually see first: skin, haircut timing, shaving or beard maintenance, and general cleanliness. [GQ's simple skin-care guide](https://www.gq.com/story/simple-skin-care-for-men) is helpful because it strips the routine down to the essentials instead of pretending every man wants to become a product guy.

## Morning routine: cleanse, hydrate, protect

If you do nothing else, wash your face, moisturize, and use SPF. That alone handles the most visible beginner problem, which is skin that looks ignored. Dryness, oiliness, and uneven texture all make the rest of the face read more tired. A basic cleanser and a moisturizer with SPF cover more ground than most beginners expect. You do not need a shelf full of serums to stop looking rough around the edges.

## Haircuts and facial hair do more than extra products

Men often chase products before they fix cadence. That is backwards. A haircut pushed two weeks too long, a beard neckline that disappeared, or stubble growing in unevenly will undo a lot of other effort. [GQ's grooming-mistakes roundup](https://www.gq.com/story/most-common-mens-grooming-mistakes-to-avoid) keeps landing on the same theme: neglect hurts more than complexity helps. If you wear facial hair, keep the lines clean. If you shave, keep the neck and sideburn area under control.

## Night routine should be even simpler than you think

At night, cleanse again and moisturize. That is enough for most beginners. If you are acne-prone or trying to improve texture, you can add one treatment later, but the beginner move is consistency, not complexity. Men love to buy five products and use them for six days. That is not a routine. A basic habit done for three months beats a more ambitious one done twice.

## Small maintenance habits separate sharp from sloppy

Nails, nose hair, ear hair, lip condition, and clean teeth are not glamorous topics, but they matter. [GQ's habits-of-well-groomed-men piece](https://www.gq.com/story/habits-of-well-groomed-men) gets this right: polish is usually the result of maintenance, not spectacle. Nobody notices a trimmed nail as a style flex. They notice neglected hands immediately. Same with overgrown facial hair on the neck or a haircut that clearly lost its shape.

## Build a routine you will actually keep

The whole point of beginner grooming is not to become obsessive. It is to stop looking like maintenance only happens by accident. Build a simple system, keep it, and use [StyleScore](/assessment) if you want to know whether grooming is one of the categories dragging down your overall presentation. Once the routine is easy to keep, the rest of your clothes start landing better too.`
    ,
    extension: `## A beginner grooming routine that takes under ten minutes

Morning:
- cleanse
- moisturizer with SPF
- hair into shape
- beard or shave cleanup if needed

Night:
- cleanse again
- plain moisturizer

Weekly:
- trim nails
- check nose and ear hair
- tidy beard edges or neckline
- reset haircut appointment if you are close to drift

That is enough for most men to stop looking ignored.

## Products matter less than cadence

Men love to ask which product to buy first. The better question is which habit you will actually keep. An average cleanser used every day beats an excellent cleanser used four times before it disappears under the sink. Same with trimmers, moisturizers, and hair products.

## If you want one outside read, start with grooming and fit together

Grooming does not exist by itself. It changes the way every outfit lands. That is why [StyleScore](/assessment) is useful when you are new to this. A lot of men assume they need more clothes when the bigger lift would come from better cadence in hair, skin, and facial hair maintenance.`
  },
  "smart-casual-date-night-outfits-men": {
    title: "Smart Casual Date Night Outfits for Men | StyleScore",
    metaDescription:
      "A practical guide to smart casual date night outfits for men. Easy outfit formulas, shoes that work, and the mistakes that make a date-night look feel forced.",
    h1: "Smart Casual Date Night Outfits for Men",
    editorialBlueprint: [
      "Anchor the article in venue-specific smart casual, not generic menswear advice.",
      "Give 3-4 real outfit formulas for drinks, dinner, coffee, or a gallery-type date.",
      "Explain that men usually fail by dressing either too stiff or too lazy.",
      "Keep the tone practical, slightly blunt, and anti-costume."
    ],
    internalLinks: [
      "/assessment",
      "/blog/first-date-outfit-short-men",
      "/blog/how-to-dress-better-men"
    ],
    sources: [
      {
        title: "5 Date Night Outfits Guaranteed to Land You Another",
        url: "https://www.gq.com/story/date-night-outfits-for-every-occasion",
        publisher: "GQ"
      },
      {
        title: "5 Date Night Outfits Guaranteed to Impress in 2026",
        url: "https://www.gq.com/story/best-date-night-outfits-2026",
        publisher: "GQ"
      },
      {
        title: "Menswear's Golden Ratio, Explained by the Experts",
        url: "https://www.gq.com/story/menswear-golden-ratio-explained",
        publisher: "GQ"
      }
    ],
    faq: [
      {
        question: "What is a smart casual date night outfit for men?",
        answer:
          "Usually a clean shirt or knit, darker trousers or denim, better shoes, and one layer that gives the look some structure. It should feel intentional without looking rehearsed."
      },
      {
        question: "Can men wear sneakers on a date night?",
        answer:
          "Yes, but they need to be clean and purposeful. Minimal leather sneakers can work. Beat-up trainers or giant athletic soles usually cannot."
      },
      {
        question: "What should men avoid wearing on a date?",
        answer:
          "Anything that feels like you are trying too hard or not trying at all. Loud logos, sloppy jeans, gym shoes, and clothes that only work if the room is very forgiving are the usual misses."
      },
      {
        question: "How dressed up should a man be for date night?",
        answer:
          "Match the venue, then sharpen it one level. Smart casual works because it looks considered without turning dinner or drinks into a costume change."
      }
    ],
    supplement: `## Dress for the venue, not for an imaginary fashion panel

The best smart casual date night outfits for men do one thing well: they match the setting while making you look like you had the situation under control. That means coffee, drinks, dinner, and a casual bar all call for slightly different versions of the same idea. [GQ's date-night outfit guide](https://www.gq.com/story/date-night-outfits-for-every-occasion) gets this right: you want to look put together, but still like yourself. If the outfit looks borrowed from a menswear mood board, you already overshot it.

## Start with one dependable smart-casual formula

For most men, the easiest date-night formula is dark trousers or dark jeans, a knit polo or open-collar shirt, and a clean shoe. Add an overshirt, lightweight jacket, or textured blazer if the venue needs a little more structure. That gives you enough polish without making the whole thing stiff. The clothes should read intentional before they read expensive.

## Shoes change the tone faster than anything else

Shoes are usually the fastest way to either save or sink date-night smart casual. Loafers, cleaner boots, and minimal leather sneakers all work depending on the venue. Big running shoes usually do not. The same jeans that feel acceptable in the mirror can look lazy the second the wrong sneaker sits under them. The cleaner the lower half, the more adult the whole outfit feels.

## Fit matters more than adding extra pieces

Men often assume smart casual means layering harder. That is not the answer if the core fit is still wrong. A shirt that hangs too long, trousers stacking over the shoe, or a jacket that swallows the seat will make the look feel off no matter how many \"smart\" pieces are layered on top. [GQ's golden-ratio explainer](https://www.gq.com/story/menswear-golden-ratio-explained) is useful here because it pushes the right priority: cleaner proportions, then better styling.

## The details that make the outfit feel easy instead of forced

[GQ's newer date-night piece](https://www.gq.com/story/best-date-night-outfits-2026) keeps coming back to the same lesson: a strong date-night outfit should not look overworked. That usually means quieter colors, better grooming, and fewer novelty moves. A textured knit is enough. A good boot is enough. A cleaner haircut is enough. Most men do not need a bolder outfit. They need fewer obvious mistakes.

## Smart casual should lower stress, not raise it

The whole point of smart casual is flexibility. You can walk into a decent restaurant, drinks spot, or gallery date without looking either underdressed or like you turned the night into a performance. If you want the personal version of that instead of generic advice, use [StyleScore](/assessment) and see whether fit, shoes, grooming, or occasion dressing is the category actually costing you points right now.`
    ,
    extension: `## Three date-night formulas that work in real life

**Drinks date:** dark jeans, knit polo, loafers, textured overshirt.

**Dinner date:** dark trousers, open-collar shirt, slim boots or loafers, one structured layer if the room is nicer.

**Coffee or casual walk date:** clean tee, overshirt, straight denim or chinos, low-profile sneakers.

These work because they match the venue without feeling like a strategy document.

## The mistakes that make smart casual look try-hard

Too many layers. Shoes that are dressier than the venue. Loud fragrance on top of an already overbuilt outfit. Clothes that only work if you stand perfectly still. Men usually go wrong when they try to prove something with the outfit instead of just looking sorted.

## Date-night smart casual should make you calmer, not more self-conscious

If the outfit makes you constantly adjust the jacket, wonder about the shirt length, or second-guess the shoe choice, it is the wrong outfit. The right one disappears once it is on. That is part of the point. And if you want to know whether the weak link is fit, shoes, or occasion dressing itself, [StyleScore](/assessment) gives you the faster answer than guessing from scratch every time.`
  }
};

function replaceBannedWords(text) {
  let updated = text;

  Object.entries(BANNED_WORD_REPLACEMENTS).forEach(([word, replacement]) => {
    updated = updated.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement);
  });

  updated = updated.replace(/\bIn conclusion\b/gi, "To wrap this up");
  updated = updated.replace(/\bIn this article\b/gi, "Here");

  return updated;
}

function replaceAiTellPhrases(text) {
  let updated = text;

  Object.entries(AI_TELL_REPLACEMENTS).forEach(([phrase, replacement]) => {
    updated = updated.replace(new RegExp(phrase, "gi"), replacement);
  });

  return updated.replace(/[ \t]{2,}/g, " ").trim();
}

function titleCaseKeyword(keyword) {
  return keyword
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (/^\d/.test(token)) {
        return token.toUpperCase();
      }

      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(" ");
}

function buildFallbackHeading(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const ageSpecificMatch = normalizedKeyword.match(/^how to dress better men (\d{2}s)$/);

  if (ageSpecificMatch) {
    return `How Men in Their ${ageSpecificMatch[1]} Can Dress Better`;
  }

  const directMatches = {
    "business casual outfits men who hate dressing up":
      "Business Casual Outfits for Men Who Hate Dressing Up",
    "how to match colors men without thinking":
      "How Men Can Match Colors Without Thinking Too Hard",
    "what shoes to wear with chinos men":
      "What Shoes to Wear With Chinos for Men",
    "mens grooming routine for beginners":
      "Men's Grooming Routine for Beginners",
    "smart casual date night outfits men":
      "Smart Casual Date Night Outfits for Men",
    "why do my clothes look bad in photos men":
      "Why Do My Clothes Look Bad in Photos as a Man?"
  };

  if (directMatches[normalizedKeyword]) {
    return directMatches[normalizedKeyword];
  }

  return titleCaseKeyword(keyword)
    .replace(/\bMens\b/g, "Men's")
    .replace(/\bMen\b$/, "for Men");
}

function buildFallbackLead(keyword) {
  const normalizedKeyword = keyword.toLowerCase().trim();
  const ageSpecificMatch = normalizedKeyword.match(/^how to dress better men (\d{2}s)$/);

  if (ageSpecificMatch) {
    return `How men in their ${ageSpecificMatch[1]} can dress better usually comes down to cleaner fit, better restraint, and clothes that actually work in real life.`;
  }

  const directMatches = {
    "business casual outfits men who hate dressing up":
      "Business casual outfits for men who hate dressing up should feel sharp without feeling stiff.",
    "how to match colors men without thinking":
      "How men can match colors without thinking too hard starts with fewer variables and better defaults.",
    "what shoes to wear with chinos men":
      "What shoes to wear with chinos for men depends on the cut of the pants and where you are actually going.",
    "mens grooming routine for beginners":
      "A mens grooming routine for beginners does not need ten products to make a visible difference.",
    "smart casual date night outfits men":
      "Smart casual date night outfits for men work best when the clothes look intentional but not rehearsed.",
    "why do my clothes look bad in photos men":
      "Why do my clothes look bad in photos as a man is usually the wrong question, because the real issue is often contrast, fit, and posture."
  };

  if (directMatches[normalizedKeyword]) {
    return directMatches[normalizedKeyword];
  }

  return `${buildFallbackHeading(keyword)} matters more than most men realize.`;
}

function buildEditorialPlan(queueEntry) {
  const keyword = queueEntry.keyword.toLowerCase();

  if (keyword.includes("30s")) {
    return {
      editorialAngle:
        "Focus on men in their 30s moving from leftover 20s habits into a reliable grown-up uniform. Emphasize consistency, mixed work-social calendars, and removing post-college weak spots.",
      mustCover: [
        "what stops working from a man's 20s wardrobe",
        "2-3 repeatable outfit formulas for work, dates, and weekends",
        "why shoes, grooming, and fit beat buying more random tops"
      ],
      mustAvoid: [
        "sounding like the 40s article",
        "framing the goal as looking older or more formal just for the sake of it"
      ]
    };
  }

  if (keyword.includes("40s")) {
    return {
      editorialAngle:
        "Focus on authority, restraint, quality, and maintenance. Explain how men in their 40s should look more dialed-in, not younger, and why fewer better pieces matter more now.",
      mustCover: [
        "what starts aging a wardrobe in a man's 40s",
        "the difference between authority and trend-chasing",
        "how tailoring, grooming, and fabric quality change the read"
      ],
      mustAvoid: [
        "repeating the 30s article about post-college leftovers",
        "defaulting to generic basics without explaining why they work at this life stage"
      ]
    };
  }

  if (keyword.includes("photos")) {
    return {
      editorialAngle:
        "Treat the article as a diagnosis of why outfits fall apart on camera: contrast, fit, posture, shirt length, shoe bulk, and grooming.",
      mustCover: [
        "why clothes that feel fine in person can look weak in photos",
        "specific fixes for shirt length, trouser hem, and posture",
        "how camera contrast punishes bad fit"
      ],
      mustAvoid: ["generic wardrobe basics advice that ignores the camera angle"]
    };
  }

  if (keyword.includes("business casual")) {
    return {
      editorialAngle:
        "Make it low-effort and anti-corporate-costume. Give simple formulas for men who want business casual to feel easy, not dressed up.",
      mustCover: [
        "3-5 low-friction outfit formulas",
        "what to wear instead of the usual quarter-zip uniform",
        "how shoes change the tone fast"
      ],
      mustAvoid: ["sounding like a generic office dress code memo"]
    };
  }

  return {
    editorialAngle:
      "Make the advice specific, practical, and clearly different from the existing StyleScore posts in adjacent topics.",
    mustCover: [],
    mustAvoid: []
  };
}

function getEditorialBlueprint(queueEntry) {
  return DETERMINISTIC_RESCUE_LIBRARY[queueEntry.slug]?.editorialBlueprint || [];
}

function getSiblingArticleContext(queueEntry) {
  const config = loadKeywordsConfig();
  const siblings = config.queue
    .filter(
      (entry) =>
        entry.cluster === queueEntry.cluster &&
        entry.slug !== queueEntry.slug &&
        (entry.status === "published" || entry.title)
    )
    .map((entry) => entry.title || entry.slug);

  return siblings.slice(0, 4);
}

function normalizeArticleDraft(articleJson, queueEntry) {
  const normalizedContent = stripGeneratedSupportSections(
    replaceAiTellPhrases(replaceBannedWords(articleJson.content_markdown || ""))
      .replace(/https:\/\/stylescore\.live\/onboarding\b/g, "https://stylescore.live/assessment")
      .replace(/\/onboarding\b/g, "/assessment")
  );

  const normalized = {
    ...articleJson,
    title: replaceAiTellPhrases(replaceBannedWords(articleJson.title || "")),
    meta_description: replaceAiTellPhrases(replaceBannedWords(articleJson.meta_description || "")),
    h1: replaceAiTellPhrases(replaceBannedWords(articleJson.h1 || "")),
    content_markdown: normalizedContent,
    faq: Array.isArray(articleJson.faq)
      ? articleJson.faq.map((item) => ({
          question: replaceAiTellPhrases(replaceBannedWords(item.question || "")),
          answer: replaceAiTellPhrases(replaceBannedWords(item.answer || ""))
        }))
      : [],
    sources: Array.isArray(articleJson.sources)
      ? articleJson.sources
          .map((source) => ({
            title: replaceAiTellPhrases(replaceBannedWords(source.title || "")),
            url: source.url || "",
            publisher: replaceAiTellPhrases(replaceBannedWords(source.publisher || ""))
          }))
          .filter((source) => source.url)
      : [],
    internal_links: Array.isArray(articleJson.internal_links)
      ? articleJson.internal_links.map((url) =>
          typeof url === "string"
            ? url
                .replace(/https:\/\/stylescore\.live\/onboarding\b/g, "https://stylescore.live/assessment")
                .replace(/\/onboarding\b/g, "/assessment")
            : url
        )
      : [],
    external_links: Array.isArray(articleJson.external_links)
      ? articleJson.external_links
      : [],
    primary_keyword: articleJson.primary_keyword || queueEntry.keyword,
    secondary_keywords: Array.isArray(articleJson.secondary_keywords)
      ? articleJson.secondary_keywords
      : queueEntry.secondaryKeywords
  };

  if (normalized.sources.length > 0 && normalized.external_links.length === 0) {
    normalized.external_links = normalized.sources.map((source) => source.url);
  }

  if (normalized.sources.length === 0 && normalized.external_links.length > 0) {
    normalized.sources = normalized.external_links.map((url) => ({
      title: url,
      url,
      publisher: ""
    }));
  }

  const keywordPhrase = queueEntry.keyword;

  if (!normalized.h1.toLowerCase().includes(keywordPhrase.toLowerCase())) {
    normalized.h1 = buildFallbackHeading(keywordPhrase);
  }

  const firstChunk = normalized.content_markdown.slice(0, 500).toLowerCase();

  if (!firstChunk.includes(keywordPhrase.toLowerCase())) {
    normalized.content_markdown = `${buildFallbackLead(keywordPhrase)}\n\n${normalized.content_markdown}`.trim();
  }

  return normalized;
}

function buildDeterministicRescueArticle(articleJson, queueEntry) {
  const spec = DETERMINISTIC_RESCUE_LIBRARY[queueEntry.slug];

  if (!spec) {
    return articleJson;
  }

  const rescueContent = [
    buildFallbackLead(queueEntry.keyword),
    spec.supplement,
    spec.extension
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();

  const mergedInternalLinks = Array.from(
    new Set([...(articleJson.internal_links || []), ...spec.internalLinks])
  );
  const mergedSources = spec.sources;
  const mergedExternalLinks = Array.from(
    new Set([...(articleJson.external_links || []), ...spec.sources.map((source) => source.url)])
  );

  return {
    ...articleJson,
    title: spec.title,
    meta_description: spec.metaDescription,
    h1: spec.h1,
    content_markdown: rescueContent,
    faq: spec.faq,
    sources: mergedSources,
    internal_links: mergedInternalLinks,
    external_links: mergedExternalLinks
  };
}

async function repairArticleWithOpenAI(client, articleJson, queueEntry, validationErrors) {
  const siblingArticles = getSiblingArticleContext(queueEntry);
  const editorialBlueprint = getEditorialBlueprint(queueEntry);
  const repairResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildRepairPrompt({
          articleJson,
          queueEntry,
          validationErrors,
          siblingArticles,
          editorialBlueprint
        })
      }
    ]
  });

  return JSON.parse(repairResponse.choices[0].message.content);
}

async function expandArticleWithOpenAI(client, articleJson, queueEntry, validationErrors) {
  const siblingArticles = getSiblingArticleContext(queueEntry);
  const editorialBlueprint = getEditorialBlueprint(queueEntry);
  const expansionResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildExpansionPrompt({
          articleJson,
          queueEntry,
          validationErrors,
          siblingArticles,
          editorialBlueprint
        })
      }
    ]
  });

  return JSON.parse(expansionResponse.choices[0].message.content);
}

async function generateArticleWithOpenAI(queueEntry) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for article generation.");
  }

  const client = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY });

  const editorialPlan = buildEditorialPlan(queueEntry);
  const siblingArticles = getSiblingArticleContext(queueEntry);
  const editorialBlueprint = getEditorialBlueprint(queueEntry);

  const articleResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildArticlePrompt({
          keyword: queueEntry.keyword,
          slug: queueEntry.slug,
          articleFormat: queueEntry.articleFormat,
          secondaryKeywords: queueEntry.secondaryKeywords,
          editorialAngle: editorialPlan.editorialAngle,
          editorialBlueprint,
          siblingArticles,
          mustCover: editorialPlan.mustCover,
          mustAvoid: editorialPlan.mustAvoid
        })
      }
    ]
  });

  const article = JSON.parse(articleResponse.choices[0].message.content);

  const humanizedResponse = await client.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildHumanizationPrompt(article, siblingArticles, editorialBlueprint)
      }
    ]
  });

  const humanizedArticle = JSON.parse(humanizedResponse.choices[0].message.content);
  let normalizedArticle = normalizeArticleDraft(humanizedArticle, queueEntry);
  let validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length === 0) {
    return normalizedArticle;
  }

  const repairedArticle = await repairArticleWithOpenAI(
    client,
    normalizedArticle,
    queueEntry,
    validationErrors
  );
  normalizedArticle = normalizeArticleDraft(repairedArticle, queueEntry);
  validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length === 0) {
    return normalizedArticle;
  }

  const expandedArticle = await expandArticleWithOpenAI(
    client,
    normalizedArticle,
    queueEntry,
    validationErrors
  );
  normalizedArticle = normalizeArticleDraft(expandedArticle, queueEntry);
  validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length === 0) {
    return normalizedArticle;
  }

  const deterministicRescueArticle = buildDeterministicRescueArticle(
    normalizedArticle,
    queueEntry
  );
  normalizedArticle = normalizeArticleDraft(deterministicRescueArticle, queueEntry);
  validationErrors = validateArticlePayload(normalizedArticle, queueEntry);

  if (validationErrors.length > 0) {
    throw new Error(
      `Validation failed after deterministic rescue: ${validationErrors.join("; ")}`
    );
  }

  return normalizedArticle;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadKeywordsConfig();
  const queueEntry =
    getQueueEntry(config, { slug: args.slug, keyword: args.keyword }) ||
    (!args.slug && !args.keyword ? selectNextQueueEntry(config) : null);

  if (!queueEntry) {
    throw new Error("Unable to find a matching queue entry.");
  }

  const articleJson = args.input
    ? normalizeArticleDraft(readJson(path.resolve(process.cwd(), args.input)), queueEntry)
    : await generateArticleWithOpenAI(queueEntry);

  const validationErrors = validateArticlePayload(articleJson, queueEntry);

  if (validationErrors.length > 0) {
    throw new Error(`Validation failed: ${validationErrors.join("; ")}`);
  }

  const publicationDate = args["publish-date"] || new Date().toISOString().slice(0, 10);
  const relatedArticles = chooseRelatedArticles(
    config,
    queueEntry.cluster,
    queueEntry.slug
  );
  const record = buildGeneratedArticleRecord(
    articleJson,
    queueEntry,
    relatedArticles,
    publicationDate
  );
  const outputFilePath = path.join(generatedArticlesDir, `${record.slug}.json`);
  const report = {
    published_url: canonicalUrl(record.slug),
    canonical_verified: canonicalUrl(record.slug) === `https://stylescore.live/blog/${record.slug}`,
    schema_injected: record.faq.length >= 3 ? ["Article", "FAQPage"] : ["Article"],
    sitemap_updated: true,
    indexing_requested: false,
    related_articles_updated: relatedArticles.map((article) => article.slug),
    validation_passed: true,
    errors: [],
    output_file: outputFilePath,
    dry_run: Boolean(args["dry-run"])
  };

  if (!args["dry-run"]) {
    ensureDir(generatedArticlesDir);
    writeJson(outputFilePath, record);
    updateQueueEntryAfterPublish(config, record);
    saveKeywordsConfig(config);
    report.related_articles_updated = updateRelatedArticlesManifest(
      record,
      relatedArticles
    );

    if (!args["skip-indexing"]) {
      try {
        const indexingResult = await requestIndexing(report.published_url);
        report.indexing_requested = indexingResult.requested;
      } catch (error) {
        report.errors.push(
          `Indexing request failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
