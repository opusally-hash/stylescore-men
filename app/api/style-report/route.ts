import { NextResponse } from "next/server";
import { generatePremiumReport } from "@/lib/openai/generateReport";
import type { ClientProfile, CategoryScores } from "@/types/clientProfile";

export const runtime = "nodejs";
export const maxDuration = 60;

type StyleReportRequest = {
  firstName?: string;
  score: number;
  archetype: string;
  confidence?: "low" | "medium" | "high";
  focusAreas: string[];
  categoryScores: Partial<CategoryScores>;
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

const categoryLabels: Record<keyof CategoryScores, string> = {
  fit: "Fit & Proportion",
  wardrobe: "Wardrobe Foundations",
  color: "Color Coordination",
  shoes: "Shoes & Footwear",
  grooming: "Grooming",
  occasion: "Occasion Styling",
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StyleReportRequest;

    if (
      typeof body.score !== "number" ||
      !body.archetype ||
      !Array.isArray(body.focusAreas) ||
      !body.categoryScores
    ) {
      return NextResponse.json(
        { error: "Missing required report inputs." },
        { status: 400 }
      );
    }

    const categoryScores = normalizeCategoryScores(body.categoryScores);
    const sortedCategories = (Object.keys(categoryLabels) as Array<
      keyof CategoryScores
    >)
      .map((key) => ({
        key,
        name: categoryLabels[key],
        score: categoryScores[key],
      }))
      .sort((left, right) => left.score - right.score);

    const strongest = [...sortedCategories].sort(
      (left, right) => right.score - left.score
    )[0];
    const onboardingData = body.onboardingData || {};
    const profile: ClientProfile = {
      firstName:
        typeof body.firstName === "string"
          ? body.firstName.trim().slice(0, 50)
          : undefined,
      score: body.score,
      archetype: body.archetype,
      confidence: body.confidence || "medium",
      categoryScores,
      strongest: {
        name: strongest.name,
        score: strongest.score,
      },
      weakest: sortedCategories.slice(0, 3).map((item) => ({
        name: item.name,
        score: item.score,
      })),
      goal: onboardingData.goals?.[0] || "Better everyday style",
      climate: onboardingData.climate || "Mixed",
      workStyle: onboardingData.workStyle || "Remote/Casual",
      budget: onboardingData.budget || "Medium",
      stylePreference: onboardingData.stylePreference || "Smart casual",
      build: onboardingData.build || "Average",
      fitChallenges: onboardingData.fitChallenges || [],
      answers: body.answers || {},
    };

    const report = await generatePremiumReport(profile);

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Style report error:", error);

    return NextResponse.json(
      {
        error:
          "Report generation encountered an issue. Our team has been notified and will deliver your report within 24 hours, or you can request a refund.",
      },
      { status: 500 }
    );
  }
}

function normalizeCategoryScores(
  categoryScores: Partial<CategoryScores>
): CategoryScores {
  return {
    fit: sanitizeScore(categoryScores.fit),
    wardrobe: sanitizeScore(categoryScores.wardrobe),
    color: sanitizeScore(categoryScores.color),
    shoes: sanitizeScore(categoryScores.shoes),
    grooming: sanitizeScore(categoryScores.grooming),
    occasion: sanitizeScore(categoryScores.occasion),
  };
}

function sanitizeScore(score: number | undefined) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 50;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
