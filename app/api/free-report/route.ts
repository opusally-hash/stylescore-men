import { NextResponse } from "next/server";
import { buildFreeAssessmentReport } from "@/app/lib/assessment-report";
import type { OnboardingForm } from "@/app/lib/onboarding";

type FreeReportRequest = {
  answers: Record<string, string[]>;
  onboardingData?: Partial<OnboardingForm> | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FreeReportRequest;

    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json(
        { error: "Answers are required." },
        { status: 400 }
      );
    }

    const report = buildFreeAssessmentReport({
      answers: body.answers,
      onboardingData: body.onboardingData,
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Free report error:", error);

    return NextResponse.json(
      { error: "Failed to build unlocked report." },
      { status: 500 }
    );
  }
}
