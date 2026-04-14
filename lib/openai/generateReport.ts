import OpenAI from "openai";
import {
  PREMIUM_REPORT_SYSTEM_PROMPT,
  buildPremiumReportUserPrompt,
} from "@/prompts/premium-report-v2";
import type { ClientProfile } from "@/types/clientProfile";

export type PremiumStyleReport = {
  title: string;
  subtitle: string;
  snapshot: string;
  strengths: string[];
  opportunities: string[];
  topPriorities: string[];
  buyNext: string[];
  bestPlacesToShop: {
    challenge: string;
    whatToShop: string;
    whereToBuy: string[];
    reason: string;
  }[];
  plan30Days: {
    days: string;
    focus: string;
    actions: string[];
  }[];
  confidenceAdvice: string;
  markdown: string;
};

type ValidationResult = {
  valid: boolean;
  reasons: string[];
};

const REQUIRED_HEADINGS = [
  "Style Snapshot",
  "Strengths to Lean Into",
  "Weaknesses Costing You Points",
  "Go-To Outfits",
  "30-Day Transformation Plan",
  "Shopping List",
  "Grooming Routine",
  "Outfit Formulas",
  "Common Mistakes",
  "60 and 90 Day",
];

const MODEL = "gpt-4o";
const TEMPERATURE = 0.7;
const MAX_OUTPUT_TOKENS = 8000;

export function validateReport(content: string): ValidationResult {
  const reasons: string[] = [];

  if (!content) {
    return { valid: false, reasons: ["Empty report"] };
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 3000) {
    reasons.push(`Word count too low: ${wordCount}`);
  }

  REQUIRED_HEADINGS.forEach((heading) => {
    if (!content.includes(heading)) {
      reasons.push(`Missing heading: ${heading}`);
    }
  });

  const outfitMatches = content.match(/###\s*Outfit\s+\d+:/g) || [];
  if (outfitMatches.length < 10) {
    reasons.push(`Not enough outfits: ${outfitMatches.length}`);
  }

  const dayMatches = content.match(/\bDay\s+\d+:/g) || [];
  if (dayMatches.length < 30) {
    reasons.push(`Not enough daily actions: ${dayMatches.length}`);
  }

  if (/\b(as an ai|ai model|artificial intelligence)\b/i.test(content)) {
    reasons.push("AI reference present");
  }

  return { valid: reasons.length === 0, reasons };
}

async function requestReport(
  client: OpenAI,
  profile: ClientProfile,
  repairInstructions = ""
) {
  const userPrompt = `${buildPremiumReportUserPrompt(profile)}${
    repairInstructions ? `\n\n=== REPAIR REQUIREMENTS ===\n${repairInstructions}` : ""
  }`;

  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: PREMIUM_REPORT_SYSTEM_PROMPT }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: userPrompt }],
      },
    ],
    temperature: TEMPERATURE,
    max_output_tokens: MAX_OUTPUT_TOKENS,
  });

  return response.output_text?.trim() || "";
}

export async function retryGeneration(
  client: OpenAI,
  profile: ClientProfile,
  reasons: string[]
) {
  return requestReport(
    client,
    profile,
    `The previous report failed validation: ${reasons.join(
      "; "
    )}. Regenerate the full report from scratch. Keep all 10 required sections, exactly 10 outfits, all 30 daily actions, and 3,500-5,000 words.`
  );
}

export async function generatePremiumReport(profile: ClientProfile) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OPENAI_API_KEY is missing. Using deterministic report fallback.");
    return buildDeterministicPremiumReport(profile);
  }

  try {
    const client = new OpenAI({ apiKey });
    const firstDraft = await requestReport(client, profile);
    const firstValidation = validateReport(firstDraft);

    if (firstValidation.valid) {
      return toPremiumStyleReport(firstDraft, profile);
    }

    const retryDraft = await retryGeneration(
      client,
      profile,
      firstValidation.reasons
    );
    const retryValidation = validateReport(retryDraft);

    if (!retryValidation.valid) {
      console.error(
        `Report validation failed after retry: ${retryValidation.reasons.join(
          "; "
        )}`
      );
      return buildDeterministicPremiumReport(profile);
    }

    return toPremiumStyleReport(retryDraft, profile);
  } catch (error) {
    console.error("OpenAI premium report generation failed:", error);
    return buildDeterministicPremiumReport(profile);
  }
}

function buildDeterministicPremiumReport(profile: ClientProfile) {
  const strongest = profile.strongest.name;
  const weak1 = profile.weakest[0]?.name || "Fit & Proportion";
  const weak2 = profile.weakest[1]?.name || "Shoes & Footwear";
  const weak3 = profile.weakest[2]?.name || "Wardrobe Foundations";
  const greeting = profile.firstName ? `${profile.firstName}, ` : "";
  const retailers = getRetailers(profile.budget);
  const markdown = `# ${profile.archetype} 30-Day Style Blueprint

## 1. Style Snapshot

${greeting}your current StyleScore is ${profile.score}/100, which means your style is not a mystery problem. It is a sequencing problem. Your strongest category is ${strongest}, so there is already something usable in the way you present yourself. The issue is that ${weak1}, ${weak2}, and ${weak3} are dragging the full impression down before your better choices have a chance to register. When one visible category is weak, people do not average it politely. They notice the weakest signal first.

Your goal for the next 30 days is not to become a different person. It is to remove the obvious leaks: poor proportion, weak shoe choices, thin wardrobe logic, inconsistent grooming, or occasion outfits that look improvised. The fastest improvement comes from tightening the pieces you repeat most often. A sharper daily uniform beats ten experimental outfits that only work once.

Because your budget is ${profile.budget.toLowerCase()} and your work style is ${profile.workStyle.toLowerCase()}, the plan below favors upgrades that can be repeated without creating a closet full of one-off purchases. The climate note is ${profile.climate.toLowerCase()}, so fabric weight, shoe practicality, and layering matter. If you follow this for 30 days, your visible style should feel cleaner, more deliberate, and easier to trust. A realistic improvement is 10 to 15 points, mostly by fixing the categories that currently pull attention away from your strengths.

## 2. Strengths to Lean Into

- ${strongest} is your best signal right now. Do not ignore it while chasing a total reinvention. Use it as the anchor: keep the choices that already make you look more intentional, then make the weaker categories support that same standard instead of contradicting it.
- Your archetype, ${profile.archetype}, works best when the outfit feels controlled rather than random. Lean into repeatable formulas, cleaner colors, better fit landmarks, and a smaller set of pieces that actually cooperate. The goal is consistency people can notice quickly.
- Your confidence level is ${profile.confidence}. That means the report should stay practical. You need visible actions: measure, remove, tailor, replace, clean, and repeat. Abstract style advice will not move the score. A short list of disciplined upgrades will.

## 3. Weaknesses Costing You Points

- ${weak1}: This is the first category to fix because it changes how every other piece reads. If fit or proportion is off, even decent clothes look accidental. The highest-impact move is to audit your most-worn outfit and correct the garment that creates the worst silhouette.
- ${weak2}: This weak spot affects first impressions faster than men expect. Shoes, grooming, and color coordination sit in the viewer's direct scan path. A worn shoe, messy neckline, or clashing palette makes the whole outfit look less deliberate even when the clothes are clean.
- ${weak3}: This category is costing you because it controls repeatability. If your wardrobe or occasion dressing is weak, you keep improvising under pressure. Build one dependable formula for work, one for casual, one for dates, and one for dressed-up moments.

## 4. Your 10 Go-To Outfits

### Outfit 1: Clean Daily Uniform
- Top: white or navy fitted tee, shoulder seam on the shoulder point, hem around mid-fly.
- Bottom: dark slim-straight jeans or chinos with little to no break.
- Shoes: clean white leather sneakers or dark minimalist sneakers.
- Outerwear: lightweight overshirt or bomber if weather requires it.
- Accessories: simple watch and belt that does not contrast hard with the trousers.
- Wear for: errands, casual lunch, low-key social plans.
- Why this works for you: This outfit fixes the baseline. It removes sloppy fabric, keeps color simple, and gives you a repeatable daily look that does not feel like trying too hard.

### Outfit 2: Better Casual Friday
- Top: light blue Oxford shirt, sleeves ending at the wrist bone, body fitted but not tight.
- Bottom: olive or navy chinos with a clean taper.
- Shoes: brown loafers, derbies, or slim Chelsea boots.
- Outerwear: navy Harrington, chore jacket, or unstructured blazer.
- Accessories: brown belt matched close to the shoes.
- Wear for: casual office, dinner with friends, weekend plans.
- Why this works for you: It keeps casual comfort but adds structure. The shirt collar, cleaner shoe, and trouser line make the outfit look chosen instead of grabbed.

### Outfit 3: Date Night Without Overdressing
- Top: dark knit polo or fine-gauge crewneck sweater in navy, charcoal, or forest green.
- Bottom: dark jeans or charcoal trousers with no break.
- Shoes: dark brown Chelsea boots or loafers.
- Outerwear: suede-look bomber, leather jacket, or wool overshirt.
- Accessories: watch, clean belt, no loud extras.
- Wear for: dinner, drinks, first date, gallery or show.
- Why this works for you: The dark tonal palette makes the silhouette cleaner and more confident. Texture gives depth without making the outfit loud.

### Outfit 4: Sharp Workday
- Top: white Oxford or light blue dress shirt, tucked cleanly.
- Bottom: charcoal, navy, or medium grey trousers.
- Shoes: dark brown derbies or black loafers depending on office formality.
- Outerwear: navy blazer or structured cardigan.
- Accessories: slim belt, watch, simple bag.
- Wear for: meetings, interviews, client-facing work.
- Why this works for you: This outfit raises authority without becoming stiff. The blazer and trouser line help your strongest category look more intentional.

### Outfit 5: Weekend Social Upgrade
- Top: textured overshirt over a white tee, both cut close enough to avoid bulk.
- Bottom: dark jeans or tapered chinos.
- Shoes: minimalist sneakers, loafers, or desert boots.
- Outerwear: the overshirt acts as the layer.
- Accessories: watch and clean belt.
- Wear for: bar, casual party, brunch, day plans.
- Why this works for you: The layer adds presence, but the outfit still feels relaxed. It is a good middle ground when a tee alone feels too plain.

### Outfit 6: Warm Weather Clean Fit
- Top: linen or cotton camp-collar shirt in white, navy, olive, or light blue.
- Bottom: chino shorts with a 5 to 7 inch inseam or lightweight tapered chinos.
- Shoes: low-profile sneakers, loafers, or espadrilles.
- Outerwear: none unless needed.
- Accessories: sunglasses and a minimal watch.
- Wear for: summer dates, vacation, outdoor dinners.
- Why this works for you: Summer style fails when everything gets oversized. This keeps fabric breathable while preserving shape.

### Outfit 7: Dressed-Up Minimal
- Top: white dress shirt with clean collar and correct sleeve length.
- Bottom: charcoal dress trousers or a navy suit trouser.
- Shoes: black or dark brown dress shoes, polished.
- Outerwear: navy blazer or suit jacket with proper sleeve length.
- Accessories: belt matched to shoes, optional pocket square.
- Wear for: weddings, dinners, formal work events.
- Why this works for you: It gives you one dependable occasion formula so you stop guessing when the room expects more polish.

### Outfit 8: Travel Uniform
- Top: merino tee or wrinkle-resistant knit polo.
- Bottom: stretch chinos or dark travel trousers with a tapered line.
- Shoes: clean sneakers that are comfortable but not athletic-looking.
- Outerwear: packable overshirt, bomber, or lightweight jacket.
- Accessories: structured backpack or weekender.
- Wear for: flights, hotel check-in, day-to-night travel.
- Why this works for you: Travel exposes weak wardrobes fast. This formula stays comfortable without looking careless.

### Outfit 9: Low-Maintenance Smart Casual
- Top: navy crewneck sweater over a white tee or Oxford.
- Bottom: olive chinos, dark denim, or grey trousers.
- Shoes: loafers, derbies, or Chelsea boots.
- Outerwear: optional wool coat or bomber.
- Accessories: slim belt and watch.
- Wear for: dinner, office-adjacent events, family gatherings.
- Why this works for you: It is easy to repeat and hard to mess up. The sweater hides minor shirt issues while still looking intentional.

### Outfit 10: Confidence Reset
- Top: your best-fitting dark top, ideally navy, charcoal, or black.
- Bottom: your cleanest no-break trousers.
- Shoes: your sharpest non-running shoes, cleaned before wearing.
- Outerwear: the jacket that ends closest to the hip.
- Accessories: watch, belt, no novelty items.
- Wear for: any day you need to look better fast.
- Why this works for you: This is your emergency formula. It prioritizes fit, dark color control, and clean shoes because those are the fastest visual upgrades.

## 5. 30-Day Transformation Plan

Day 1: Take three full-body photos in your normal outfit: front, side, and back. Save them in a StyleScore Day 1 album.
Day 2: Remove every item with stains, stretched collars, pilling, broken zippers, or visible damage from your active closet.
Day 3: Try on your five most-worn tops and mark which ones fail at shoulder seam, sleeve length, or hem length.
Day 4: Try on your five most-worn trousers and mark which ones pool at the ankle, sag at the waist, or create excess fabric.
Day 5: Clean your everyday shoes fully, including sides, laces, soles, and heel edges.
Day 6: Remove shoes with collapsed heels, square toes, heavy scuffs, or shapes you would not wear to dinner.
Day 7: Book a haircut or clean up neckline, beard line, eyebrows, and facial hair edges at home.
Day 8: Build one clean daily outfit from your existing wardrobe and photograph it in natural light.
Day 9: Buy or identify one missing foundation piece connected to ${weak1}.
Day 10: Take one trouser or jean to a tailor for hemming if it breaks heavily over the shoe.
Day 11: Create a neutral color base: choose navy, white, grey, black, olive, or brown as your repeat palette.
Day 12: Pair three tops with three bottoms and remove any piece that fails to combine with at least two others.
Day 13: Replace one worn basic you use weekly: tee, Oxford, jeans, chinos, sneakers, or belt.
Day 14: Build your better casual outfit and wear it for a real errand or social plan.
Day 15: Upgrade ${weak2} with one concrete action: shoe replacement, grooming rhythm, color cleanup, or occasion formula.
Day 16: Create a shoe rotation with one casual pair, one smart-casual pair, and one dressed-up pair.
Day 17: Set a weekly grooming appointment on your calendar for hair, beard, nails, and skin maintenance.
Day 18: Test your date-night outfit at home and remove anything that pulls, bags, shines, or feels costume-like.
Day 19: Buy one structured layer: overshirt, bomber, Harrington, blazer, or clean cardigan.
Day 20: Build your work or important-occasion formula and photograph it.
Day 21: Fix ${weak3} by creating one repeatable outfit formula for the situation you usually mishandle.
Day 22: Check belts, socks, watches, and bags; remove anything childish, cracked, oversized, or too loud.
Day 23: Add one texture upgrade: knit polo, merino sweater, Oxford cloth, suede-look jacket, or brushed cotton overshirt.
Day 24: Wear your strongest outfit for a normal day and note which pieces felt easiest to repeat.
Day 25: Create a simple laundry and shoe-care routine so the upgrades stay visible.
Day 26: Build three complete outfits and hang or photograph them as defaults.
Day 27: Replace one item that appears in your Day 1 photos and clearly lowered the outfit.
Day 28: Re-shoot the same three photos from Day 1 in your best current outfit.
Day 29: Compare Day 1 and Day 28 photos and write the three visual changes that made the biggest difference.
Day 30: Lock your four default formulas: daily, work, date, and dressed-up.

## 6. Shopping List

- Fitted white tee: Buy a midweight cotton tee with shoulder seams on the shoulder point and a hem around mid-fly. Shop ${retailers}. Avoid thin transparent fabric.
- Dark fitted tee: Use navy, charcoal, or black for a sharper casual base. Shop ${retailers}. Avoid oversized streetwear cuts unless that is your intentional style.
- Light blue Oxford shirt: Choose a shorter body or plan tailoring. Shop ${retailers}. Avoid ballooning fabric around the waist.
- White dress shirt: Keep collar firm and sleeves exact. Shop ${retailers}. Avoid shiny fabric and loose cuffs.
- Dark slim-straight jeans: Choose a clean taper and minimal break. Shop ${retailers}. Avoid heavy distressing.
- Tapered chinos: Navy, olive, or khaki with a clean rise. Shop ${retailers}. Avoid low-rise skinny pairs.
- Charcoal trousers: Use these for work, dates, and dressed-up outfits. Shop ${retailers}. Avoid long breaks.
- Minimal leather sneakers: White, off-white, black, or dark brown. Shop ${retailers}. Avoid running shoes for every outfit.
- Smart-casual shoes: Loafers, derbies, desert boots, or Chelsea boots. Shop ${retailers}. Avoid square toes.
- Structured overshirt: Cotton twill, wool blend, or textured fabric. Shop ${retailers}. Avoid flimsy shirt-jackets.
- Lightweight bomber or Harrington: Hip length, not long. Shop ${retailers}. Avoid bulky ribbing.
- Navy blazer: Unstructured if casual, tailored if work-focused. Shop ${retailers}. Avoid jackets that cover the seat.
- Slim belt: Match the tone to shoes or trousers. Shop ${retailers}. Avoid oversized buckles.
- Simple watch: Clean dial, leather or metal strap. Shop ${retailers}. Avoid novelty faces.
- Grooming kit: cleanser, moisturizer, SPF, trimmer, nail kit, and hair product. Shop ${retailers}. Avoid ten-step routines you will not follow.
- Shoe care kit: brush, microfiber cloth, cleaner, leather conditioner, and spare laces. Shop ${retailers}. Avoid letting good shoes age badly.
- Tailoring budget: Reserve money for hems, sleeve shortening, and shirt tapering. Spend this before another random purchase.

## 7. Grooming Routine

Morning: Wash your face, apply moisturizer, apply SPF, style hair with a small amount of product, check collar and neckline, and clean visible lint from your clothes. This should take 5 to 7 minutes. The goal is not a beauty routine. The goal is to remove neglect from the first impression.

Evening: Rinse face, use cleanser if oily or sweaty, moisturize, set clothes for the next day, and put shoes back in their place. This takes 3 to 5 minutes and prevents morning decisions from becoming sloppy.

Weekly maintenance: Trim nails, clean beard edges, wash or brush shoes, steam wrinkled shirts, inspect collars, and prepare two outfits for the coming week.

Monthly checkpoints: Schedule haircut before it loses shape, replace worn socks and undershirts, review shoe condition, and remove one item from the closet that no longer supports your style.

## 8. Outfit Formulas for Your Goal

- Better everyday style: fitted tee, tapered trousers, clean sneakers, structured overshirt, simple watch. This is the default when you want easy but not lazy.
- Dating: dark knit polo, dark jeans or trousers, Chelsea boots or loafers, controlled scent, clean neckline. This reads intentional without looking staged.
- Work confidence: Oxford shirt, charcoal trousers, dark shoes, navy layer, belt matched to shoes. This creates authority without shouting.
- Minimalist wardrobe: navy, white, grey, olive, and black only. Repeat the same silhouettes and upgrade fabric quality over time.
- Occasion dressing: white shirt, navy blazer, grey trousers, polished dark shoes, clean grooming. This prevents underdressing when the room expects effort.

## 9. Common Mistakes Your Archetype Makes

- Mistake 1: Trusting the strongest category too much. Fix it by making the weakest category meet the same standard before buying anything expressive.
- Mistake 2: Buying isolated pieces. Fix it by refusing any purchase that does not create at least three outfits with what you already own.
- Mistake 3: Treating shoes as functional only. Fix it by owning one clean casual pair and one sharper non-athletic pair.
- Mistake 4: Letting grooming lag behind clothing. Fix it by setting a haircut rhythm and weekly maintenance block.
- Mistake 5: Waiting for special occasions to dress well. Fix it by making your daily outfit cleaner, because daily repetition shapes how people remember you.

## 10. Your 60 and 90 Day Next Steps

Days 31-60: Upgrade fabric quality in the pieces you repeat most. Add one better shirt, one better trouser, and one better shoe. Use the same colors and silhouettes that worked in the first 30 days. Do not chase novelty yet.

Days 31-60: Tailor the pieces that survived the first month. Hem trousers, shorten sleeves, taper shirts, and replace anything that could not be corrected. Fit is the multiplier for the whole wardrobe.

Days 31-60: Test your four outfit formulas in real settings. Wear the date formula, the work formula, the casual formula, and the dressed-up formula. Keep what earns confidence and remove what creates friction.

Days 61-90: Add personality slowly through texture, not loud color. Use suede, knitwear, Oxford cloth, wool blends, and better outerwear to make simple outfits feel more mature.

Days 61-90: Build a seasonal version of your best outfit. If your climate is hot, use linen and lighter shoes. If it is cold, use wool, boots, and structured layers.

Days 61-90: Retake StyleScore and compare the category scores. Your target is not perfection. Your target is to make ${weak1}, ${weak2}, and ${weak3} stop pulling the total score down.`;

  return toPremiumStyleReport(ensureMinimumLength(markdown, profile), profile);
}

function ensureMinimumLength(markdown: string, profile: ClientProfile) {
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount >= 3200) {
    return markdown;
  }

  return `${markdown}

## Additional Execution Notes

The fastest way to make this plan work is to stop treating each clothing choice as separate. Your score improves when the pieces cooperate. Use your strongest category, ${profile.strongest.name}, as the standard for every weaker category. If a shirt fits well but the shoes are tired, the outfit still loses. If the shoes are clean but the trousers pool heavily at the ankle, the outfit still loses. Every visible category has to support the same message.

Repeat your best formulas more than feels natural. Most stylish men are not inventing a new look every morning. They are repeating a small set of silhouettes with better fit, cleaner grooming, and fewer weak links. That is the practical point of the 30-day plan: reduce decision fatigue, remove the bad defaults, and make your upgraded look easier than your old one.

When you shop, buy the boring correct item before the interesting wrong item. The right dark jeans, clean sneakers, fitted Oxford, and tailored trousers will outperform trend pieces because they show up in more outfits. Your wardrobe should become less random every week. If a purchase does not improve ${profile.weakest[0]?.name || "your weakest category"} or help three outfits, leave it alone.`;
}

function getRetailers(budget: string) {
  if (budget === "High") {
    return "Todd Snyder, Proper Cloth, Buck Mason, Nordstrom, or Bonobos";
  }

  if (budget === "Low") {
    return "Uniqlo, Target Goodfellow, H&M, Old Navy, or sale sections at J.Crew";
  }

  return "J.Crew, Banana Republic, Bonobos, Nordstrom Rack, or Abercrombie";
}

function toPremiumStyleReport(
  markdown: string,
  profile: ClientProfile
): PremiumStyleReport {
  const title = `${profile.archetype} 30-Day Style Blueprint`;

  return {
    title,
    subtitle:
      "A personalized 30-day style transformation plan built from your quiz score, wardrobe weak spots, budget, and lifestyle.",
    snapshot:
      extractSection(markdown, "Style Snapshot") ||
      `${profile.score}/100 means your biggest gains will come from fixing ${profile.weakest[0]?.name || "your weakest category"} first.`,
    strengths: extractBullets(markdown, "Strengths to Lean Into").slice(0, 3),
    opportunities: extractBullets(markdown, "Weaknesses Costing You Points").slice(
      0,
      3
    ),
    topPriorities: profile.weakest
      .slice(0, 3)
      .map((item) => `${item.name}: raise the ${item.score}/100 weak spot first.`),
    buyNext: extractShoppingItems(markdown).slice(0, 8),
    bestPlacesToShop: buildShopSummaries(profile),
    plan30Days: extractDailyActions(markdown),
    confidenceAdvice:
      extractSection(markdown, "Your 60 and 90 Day Next Steps") ||
      "Use the 30-day plan first, then reassess fit, shoes, and grooming before adding more pieces.",
    markdown,
  };
}

function extractSection(markdown: string, heading: string) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markdown.match(
    new RegExp(
      `(?:^|\\n)#{1,3}\\s*(?:\\d+\\.\\s*)?${escapedHeading}[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s|$)`,
      "i"
    )
  );

  return match?.[1]?.trim().replace(/\n{3,}/g, "\n\n") || "";
}

function extractBullets(markdown: string, heading: string) {
  const section = extractSection(markdown, heading);
  const bullets = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, "").trim());

  if (bullets.length > 0) return bullets;

  return section
    .split(/\n{2,}/)
    .map((item) => item.replace(/^#+\s*/, "").trim())
    .filter(Boolean);
}

function extractShoppingItems(markdown: string) {
  const section = extractSection(markdown, "Shopping List");
  const items = extractBullets(markdown, "Shopping List");

  if (items.length > 0) {
    return items;
  }

  return section
    .split("\n")
    .map((line) => line.trim().replace(/^#+\s*/, ""))
    .filter((line) => line.length > 20)
    .slice(0, 12);
}

function extractDailyActions(markdown: string) {
  const section = extractSection(markdown, "30-Day Transformation Plan");
  const matches = Array.from(
    section.matchAll(/\bDay\s+(\d+):\s*([^\n]+)/gi)
  );

  if (matches.length >= 30) {
    return matches.slice(0, 30).map((match) => ({
      days: `Day ${match[1]}`,
      focus: "Daily style action",
      actions: [match[2].trim()],
    }));
  }

  return Array.from({ length: 30 }, (_, index) => ({
    days: `Day ${index + 1}`,
    focus: "Daily style action",
    actions: ["Complete the matching action from your full markdown blueprint."],
  }));
}

function buildShopSummaries(profile: ClientProfile) {
  return profile.weakest.slice(0, 3).map((item) => ({
    challenge: item.name,
    whatToShop:
      item.name === "Shoes & Footwear"
        ? "clean everyday shoes and one sharper going-out pair"
        : item.name === "Grooming"
        ? "haircut, beard, and skin basics"
        : item.name === "Fit & Proportion"
        ? "better-fitting shirts, trousers, and tailoring"
        : "core wardrobe upgrades that support this weak spot",
    whereToBuy:
      profile.budget === "High"
        ? ["Todd Snyder", "Proper Cloth", "Nordstrom"]
        : profile.budget === "Low"
        ? ["Uniqlo", "Target Goodfellow", "H&M"]
        : ["J.Crew", "Banana Republic", "Nordstrom Rack"],
    reason: `${item.name} is one of your lowest scores at ${item.score}/100, so this is where the shopping list should work hardest.`,
  }));
}
