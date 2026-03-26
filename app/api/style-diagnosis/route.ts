import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { Response as OpenAIResponse } from "openai/resources/responses/responses";
import {
  buildFallbackDiagnosis,
  categoryLabels,
  getScoreExtremes,
} from "@/app/lib/assessment-report";

export const runtime = "nodejs";

type StyleDiagnosisRequest = {
  overallScore: number;
  categoryScores: Record<string, number>;
  archetypeName: string;
  focusAreas: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StyleDiagnosisRequest;
    const { overallScore, categoryScores, archetypeName, focusAreas } = body;

    if (
      typeof overallScore !== "number" ||
      !categoryScores ||
      typeof archetypeName !== "string" ||
      !Array.isArray(focusAreas)
    ) {
      return NextResponse.json(
        { error: "Missing required diagnosis inputs." },
        { status: 400 }
      );
    }

    const fallbackDiagnosis = buildFallbackDiagnosis({
      overallScore,
      categoryScores,
      focusAreas,
    });

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        diagnosis: fallbackDiagnosis,
        source: "fallback",
      });
    }

    const { strongest, weakest } = getScoreExtremes(categoryScores);
    const client = new OpenAI({ apiKey });

    const prompt = `You are a men's style expert giving a brief, direct style diagnosis.

Here are the user's quiz results:
- Overall Score: ${overallScore}/100
- Fit & Proportion: ${categoryScores.fit}
- Wardrobe Foundations: ${categoryScores.wardrobe}
- Color Coordination: ${categoryScores.color}
- Shoes & Footwear: ${categoryScores.shoes}
- Grooming: ${categoryScores.grooming}
- Occasion Styling: ${categoryScores.occasion}
- Style Archetype: ${archetypeName}
- Strongest Category: ${categoryLabels[strongest]} (${categoryScores[strongest]})
- Weakest Category: ${categoryLabels[weakest]} (${categoryScores[weakest]})
- Top 3 Focus Areas: ${focusAreas
  .map((area) => categoryLabels[area as keyof typeof categoryLabels] || area)
  .join(", ")}

Write a 3-4 sentence style diagnosis for this person. Rules:
- Be specific to their scores. Reference actual category names and numbers.
- Name their strongest category and weakest category. These must be different.
- Give one concrete, actionable insight they haven't heard before.
- Tone: direct, confident, slightly blunt — like a stylist friend, not a brand.
- Do NOT use generic advice like "focus on your weak areas first."
- Do NOT repeat what the user already told you.
- Do NOT use phrases like "Based on your answers" or "You indicated that."
- Keep it under 60 words.`;

    const response = await Promise.race<OpenAIResponse | null>([
      client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
        stream: false,
        temperature: 0.7,
        max_output_tokens: 120,
      }),
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 4000)
      ),
    ]);

    const diagnosis = response?.output_text?.replace(/\s+/g, " ").trim();

    if (!diagnosis) {
      return NextResponse.json({
        diagnosis: fallbackDiagnosis,
        source: "fallback",
      });
    }

    return NextResponse.json({
      diagnosis,
      source: "openai",
    });
  } catch (error) {
    console.error("Style diagnosis error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate style diagnosis.",
      },
      { status: 500 }
    );
  }
}
