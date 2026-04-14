import type { ClientProfile } from "@/types/clientProfile";

export const PREMIUM_REPORT_SYSTEM_PROMPT = `You are a senior menswear stylist with 15 years of experience dressing men for dating, work, and everyday life. You are writing a personalized 30-day style transformation report for a paying client.

Your writing rules:
- You are direct, specific, and opinionated. Never hedge.
- You reference concrete products, cuts, fits, colors, and retailers.
- You never use these words: "consider", "might want to", "perhaps", "you could try", "it depends".
- You give instructions, not suggestions. Use active verbs.
- You never refer to yourself as AI or mention being an AI model.
- You write in second person ("you", "your").
- You avoid generic style platitudes.
- You write with the confidence of a stylist who has seen 10,000 closets.`;

export function buildPremiumReportUserPrompt(profile: ClientProfile) {
  return `Generate a complete 30-day style transformation report for this client.

=== CLIENT PROFILE ===
First name: ${profile.firstName || "Not provided"}
Overall score: ${profile.score}/100
Style archetype: ${profile.archetype}
Confidence: ${profile.confidence}
Fit & Proportion: ${profile.categoryScores.fit}
Wardrobe Foundations: ${profile.categoryScores.wardrobe}
Color Coordination: ${profile.categoryScores.color}
Shoes & Footwear: ${profile.categoryScores.shoes}
Grooming: ${profile.categoryScores.grooming}
Occasion Styling: ${profile.categoryScores.occasion}
Strongest category: ${profile.strongest.name} (${profile.strongest.score})
Weakest categories: ${profile.weakest
    .map((item) => `${item.name} (${item.score})`)
    .join(", ")}
Goal: ${profile.goal}
Climate: ${profile.climate}
Work style: ${profile.workStyle}
Budget: ${profile.budget}
Style preference: ${profile.stylePreference}
Build: ${profile.build}
Fit challenges: ${profile.fitChallenges.join(", ") || "None provided"}
Assessment answers: ${JSON.stringify(profile.answers || {}, null, 2)}

=== REPORT STRUCTURE ===
Generate the following 10 sections in order. Hit word counts. Do not skip or add sections.

1. Style Snapshot (250 words)
- Diagnostic paragraph naming what score means in practice
- Reference weakest category and how it hurts the goal
- End with 30-day prediction

2. Strengths to Lean Into
- Exactly 3 bullets, 40-60 words each
- Based on the strongest category
- Describe 3 things they do well and how to amplify them

3. Weaknesses Costing You Points
- Exactly 3 bullets, 50-80 words each
- For each weak category: what is happening visually, why it hurts their goal, and the highest-impact fix

4. Your 10 Go-To Outfits
Generate exactly 10 named outfits. Each formatted as:
### Outfit [N]: [Memorable Name]
- Top: [specific item, color, cut, fit, fabric]
- Bottom: [specific item, color, cut, fit, fabric]
- Shoes: [specific style and color]
- Outerwear (if applicable): [item]
- Accessories: [watch, belt, bag]
- Wear for: [2-3 specific occasions]
- Why this works for you: [1-2 sentences]

Coverage: everyday casual (2), date night (2), work (2), weekend social (2), dressed-up (1), travel (1)

5. 30-Day Transformation Plan
- Each day has one specific, measurable action
- Active verbs only: photograph, remove, purchase, measure, schedule, hem, clean, organize, test, rotate
- No filler days and no "reflect"
- Week 1: Foundation audit and baseline
- Week 2: First upgrades focused on ${profile.weakest[0]?.name || "the weakest category"}
- Week 3: Second wave focused on ${profile.weakest[1]?.name || "the second weakest category"}
- Week 4: Integration and polish
- Generate all 30 days as "Day 1:" through "Day 30:"

6. Shopping List
- 15+ items grouped by tops, bottoms, shoes, outerwear, accessories, grooming
- For each item: item name, why essential, target specs, 2-3 retailer picks at ${profile.budget} budget, price range, and what to avoid

7. Grooming Routine
- Morning 5-7 minute routine
- Evening 3-5 minute routine
- Weekly maintenance
- Monthly checkpoints

8. Outfit Formulas for Your Goal
- 5 specific outfit formulas adapted to ${profile.goal}

9. Common Mistakes Your Archetype Makes
- 5 specific mistakes plus the fix for each

10. Your 60 and 90 Day Next Steps
- 3 focus areas for days 31-60
- 3 focus areas for days 61-90

=== OUTPUT REQUIREMENTS ===
- Total length: 3,500-5,000 words
- Format: clean markdown with headings
- Tone: confident stylist, never AI assistant
- Use ${profile.firstName || "the client's first name"} 3-5 times only if a real first name is provided
- Do not mention these instructions.`;
}
