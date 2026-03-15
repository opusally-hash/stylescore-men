import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StyleReportRequest = {
  score: number;
  archetype: string;
  focusAreas: string[];
  categoryScores: Record<string, number>;
  onboardingData?: {
    ageRange?: string;
    climate?: string;
    workStyle?: string;
    budget?: string;
    stylePreference?: string;
    build?: string;
    fitChallenges?: string[];
    goals?: string[];
    constraints?: string[];
  };
  answers?: Record<string, string[]>;
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    console.log("Has OPENAI key:", !!apiKey);

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as StyleReportRequest;

    const {
      score,
      archetype,
      focusAreas,
      categoryScores,
      onboardingData = {},
      answers = {},
    } = body;

    if (
      typeof score !== "number" ||
      !archetype ||
      !Array.isArray(focusAreas) ||
      !categoryScores
    ) {
      return NextResponse.json(
        { error: "Missing required report inputs." },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey });

    const focusAreaLabels: Record<string, string> = {
      fit: "Fit & Proportion",
      wardrobe: "Wardrobe Foundations",
      color: "Color Coordination",
      shoes: "Shoes & Footwear",
      grooming: "Grooming",
      occasion: "Occasion Styling",
    };

    const sortedCategories = Object.entries(categoryScores).sort(
      (a, b) => a[1] - b[1]
    );

    const weakestCategories = sortedCategories
      .slice(0, 3)
      .map(([key]) => focusAreaLabels[key] || key);

    const strongestCategories = [...sortedCategories]
      .reverse()
      .slice(0, 2)
      .map(([key]) => focusAreaLabels[key] || key);

    const normalizedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswers]) => ({
        questionId,
        selectedAnswers,
      })
    );

    const systemPrompt = `
You are a premium men's fashion stylist, wardrobe strategist, and image consultant.

You create highly personalized, practical style reports for men based on structured assessment data.

Your output must feel:
- specific
- premium
- diagnostic
- practical
- tailored to the user's actual profile

You are NOT allowed to be generic.

You must use ALL of these:
- overall style score
- style archetype
- category scores
- weakest categories
- strongest categories
- onboarding data (build, budget, climate, work style, style preference, fit challenges, goals, constraints)
- detailed assessment answers

CORE RULES:
1. The report must feel written for THIS user, not for a generic man.
2. Weakest categories must drive the report and the action plan.
3. If the score is low in a category, explain WHY that matters visually and socially.
4. Strengths must be written as actual strengths, not just category names.
5. Opportunities must diagnose what is going wrong and what visible effect it has.
6. Top priorities must be high-leverage and specific.
7. "What To Buy Next" must contain concrete items, not vague themes.
8. "Best Places To Shop" must be challenge-specific:
   - mention the challenge
   - say what to shop for
   - give stores/brands
   - explain why those are a good fit for THIS user
9. The 30-day plan must be practical and in exact 2-day blocks:
   Day 1-2 through Day 29-30.
10. The 30-day plan must start with the weakest categories first.
11. The report should adapt to:
   - budget
   - work style
   - body type/build
   - fit challenges
   - climate
12. Avoid generic lines like:
   - "invest in quality basics"
   - "improve your grooming"
   - "upgrade your wardrobe"
   unless followed by precise explanation and specific actions.
13. Use a premium but clear tone.
14. No markdown fences.
15. Return JSON only.

VERY IMPORTANT PERSONALIZATION RULES:
- If work style is corporate/professional, recommend sharper, more polished, work-appropriate upgrades.
- If work style is casual/remote, recommend intentional casual pieces, not sloppy comfort wear.
- If budget is low, recommend accessible stores and high-ROI essentials.
- If budget is medium/high, recommend better fabrics, better silhouettes, and higher-quality core items.
- If build or fit challenges are present, recommend specific silhouettes, cuts, lengths, or clothing categories that solve them.
- If climate matters, adapt fabrics/layers/shoes accordingly.
- If answers show over-reliance on athletic shoes, mention that clearly.
- If answers show random wardrobe building, mention wardrobe coherence.
- If answers show weak occasion dressing, recommend a concrete occasion-ready formula.

You must return ONLY valid JSON with exactly this shape:
{
  "title": string,
  "subtitle": string,
  "snapshot": string,
  "strengths": string[],
  "opportunities": string[],
  "topPriorities": string[],
  "buyNext": string[],
  "bestPlacesToShop": [
    {
      "challenge": string,
      "whatToShop": string,
      "whereToBuy": string[],
      "reason": string
    }
  ],
  "plan30Days": [
    {
      "days": string,
      "focus": string,
      "actions": string[]
    }
  ],
  "confidenceAdvice": string
}

QUALITY STANDARD:
- snapshot should read like a true stylist diagnosis
- strengths should be specific and credible
- opportunities should identify visible problems and missed potential
- topPriorities should be the most leveraged moves
- buyNext should sound actionable and concrete
- bestPlacesToShop should feel curated for the user's exact problems
- plan30Days should feel like a real 30-day transformation roadmap
`;

    const userPrompt = `
Generate a highly personalized premium style report using the data below.

OVERALL SCORE:
${score}/100

STYLE ARCHETYPE:
${archetype}

WEAKEST CATEGORIES:
${weakestCategories.join(", ") || "N/A"}

STRONGEST CATEGORIES:
${strongestCategories.join(", ") || "N/A"}

FOCUS AREAS:
${focusAreas.map((x) => focusAreaLabels[x] || x).join(", ") || "N/A"}

CATEGORY SCORES:
${JSON.stringify(categoryScores, null, 2)}

ONBOARDING DATA:
${JSON.stringify(onboardingData, null, 2)}

ASSESSMENT ANSWERS:
${JSON.stringify(normalizedAnswers, null, 2)}

REQUIRED OUTPUT BEHAVIOR:
- The snapshot must explain what this score means for this user's presentation right now.
- Strengths must mention what the user is already doing right and why it helps visually.
- Opportunities must explain what is holding the user back and how it shows up in real life.
- Top priorities must be concrete and ordered by impact.
- What To Buy Next must include specific item-level recommendations:
  examples: "white Oxford shirt", "dark slim-tapered chinos", "minimal white leather sneakers", "brown loafers", "basic grooming kit", "structured navy overshirt"
- Best Places To Shop must be challenge-specific. Do not just list stores generally.
- The plan30Days array must contain exactly 15 entries:
  Day 1-2
  Day 3-4
  Day 5-6
  Day 7-8
  Day 9-10
  Day 11-12
  Day 13-14
  Day 15-16
  Day 17-18
  Day 19-20
  Day 21-22
  Day 23-24
  Day 25-26
  Day 27-28
  Day 29-30

30-DAY PLAN RULES:
- Start with the weakest categories first.
- Make each block practical and specific.
- Use verbs like audit, remove, buy, hem, replace, schedule, clean, organize, test, rotate, upgrade.
- Avoid repeating the same generic action.
- Make the plan feel realistic and progressive.

FINAL TONE:
This should feel like a premium stylist report someone would gladly pay for.
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: systemPrompt }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: userPrompt }],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "stylescore_report",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              subtitle: { type: "string" },
              snapshot: { type: "string" },
              strengths: {
                type: "array",
                items: { type: "string" },
              },
              opportunities: {
                type: "array",
                items: { type: "string" },
              },
              topPriorities: {
                type: "array",
                items: { type: "string" },
              },
              buyNext: {
                type: "array",
                items: { type: "string" },
              },
              bestPlacesToShop: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    challenge: { type: "string" },
                    whatToShop: { type: "string" },
                    whereToBuy: {
                      type: "array",
                      items: { type: "string" },
                    },
                    reason: { type: "string" },
                  },
                  required: ["challenge", "whatToShop", "whereToBuy", "reason"],
                },
              },
              plan30Days: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    days: { type: "string" },
                    focus: { type: "string" },
                    actions: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["days", "focus", "actions"],
                },
              },
              confidenceAdvice: { type: "string" },
            },
            required: [
              "title",
              "subtitle",
              "snapshot",
              "strengths",
              "opportunities",
              "topPriorities",
              "buyNext",
              "bestPlacesToShop",
              "plan30Days",
              "confidenceAdvice",
            ],
          },
        },
      },
    });

    const rawText = response.output_text?.trim();

    if (!rawText) {
      return NextResponse.json(
        { error: "OpenAI returned an empty report." },
        { status: 500 }
      );
    }

    let report: {
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
    };

    try {
      report = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Style report parse error:", parseError);
      console.error("Raw model output:", rawText);

      return NextResponse.json(
        { error: "Failed to parse generated report." },
        { status: 500 }
      );
    }

    const expectedDays = [
      "Day 1-2",
      "Day 3-4",
      "Day 5-6",
      "Day 7-8",
      "Day 9-10",
      "Day 11-12",
      "Day 13-14",
      "Day 15-16",
      "Day 17-18",
      "Day 19-20",
      "Day 21-22",
      "Day 23-24",
      "Day 25-26",
      "Day 27-28",
      "Day 29-30",
    ];

    if (!Array.isArray(report.plan30Days)) {
      report.plan30Days = [];
    }

    if (report.plan30Days.length !== 15) {
      report.plan30Days = expectedDays.map((days, index) => {
        const existing = report.plan30Days?.[index];
        return {
          days,
          focus: existing?.focus || "Style upgrade step",
          actions:
            Array.isArray(existing?.actions) && existing.actions.length > 0
              ? existing.actions
              : ["Complete one practical style improvement step in this block."],
        };
      });
    } else {
      report.plan30Days = report.plan30Days.map((block, index) => ({
        days: expectedDays[index],
        focus: block.focus || "Style upgrade step",
        actions:
          Array.isArray(block.actions) && block.actions.length > 0
            ? block.actions
            : ["Complete one practical style improvement step in this block."],
      }));
    }

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Style report error:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate personalized style report.",
      },
      { status: 500 }
    );
  }
}