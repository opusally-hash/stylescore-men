import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const {
      score,
      archetype,
      focusAreas,
      categoryScores,
      onboardingData,
      answers,
    } = await req.json();

    const prompt = `
You are an elite men's fashion strategist and personal style consultant.

Return ONLY valid JSON.
Do not wrap it in markdown.
Do not add any text before or after the JSON.

Create a highly personalized premium style report for this user.

USER PROFILE:
${JSON.stringify(onboardingData ?? {}, null, 2)}

STYLE RESULT:
- Overall Score: ${score}
- Archetype: ${archetype}
- Focus Areas: ${JSON.stringify(focusAreas ?? [])}
- Category Scores: ${JSON.stringify(categoryScores ?? {}, null, 2)}

QUIZ ANSWERS:
${JSON.stringify(answers ?? {}, null, 2)}

Use all the information carefully. Be specific. Tailor the advice to build, budget, work environment, climate, style preference, fit challenges, goals, and exact weak scoring areas.

Return JSON in exactly this shape:

{
  "title": "string",
  "subtitle": "string",
  "snapshot": "string",
  "strengths": ["string", "string", "string"],
  "opportunities": ["string", "string", "string"],
  "topPriorities": ["string", "string", "string"],
  "buyNext": ["string", "string", "string", "string"],
  "bestPlacesToShop": [
    {
      "challenge": "string",
      "whatToShop": "string",
      "whereToBuy": ["string", "string", "string"],
      "reason": "string"
    }
  ],
  "plan30Days": [
    {
      "days": "Day 1-2",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 3-4",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 5-6",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 7-8",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 9-10",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 11-12",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 13-14",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 15-16",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 17-18",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 19-20",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 21-22",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 23-24",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 25-26",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 27-28",
      "focus": "string",
      "actions": ["string", "string", "string"]
    },
    {
      "days": "Day 29-30",
      "focus": "string",
      "actions": ["string", "string", "string"]
    }
  ],
  "confidenceAdvice": "string"
}

Critical rules:
- Make "bestPlacesToShop" highly specific to the actual challenge.
- Example: if shoes are weak, say where to buy clean white sneakers, versatile loafers, or dress-better shoes.
- Example: if fit is weak, mention tailoring, Uniqlo, J.Crew, Mango Man, local alteration shops, etc depending on budget.
- Example: if grooming is weak, mention Amazon, Target, Sephora, Ulta, barber, etc depending on the item and budget.
- "whereToBuy" should be realistic store names or store types.
- "whatToShop" must be specific, like "clean white sneakers", "tapered chinos", "basic skincare starter set", not vague phrases.

- Make "plan30Days" practical and highly specific.
- It must be written in 2-day blocks exactly like Day 1-2, Day 3-4, etc.
- Each block must focus on one concrete challenge.
- Each block should include actions that are realistic and easy to follow.
- Prioritize the user’s weakest categories first.
- If fit is weak, push fit fixes early.
- If shoes are weak, push shoes early.
- If grooming is weak, push grooming early.
- Make it feel like a stylist-built plan, not generic self-help.

Tone:
- premium
- modern
- clean
- direct
- stylish
- motivating
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const report = JSON.parse(raw);

    return Response.json({ report });
  } catch (error: any) {
    console.error("Style report error:", error);

    return Response.json(
      {
        error:
          error?.message ||
          error?.error?.message ||
          "Failed to generate style report.",
      },
      { status: 500 }
    );
  }
}