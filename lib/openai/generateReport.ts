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
    throw new Error("OPENAI_API_KEY is missing.");
  }

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
    throw new Error(
      `Report validation failed after retry: ${retryValidation.reasons.join(
        "; "
      )}`
    );
  }

  return toPremiumStyleReport(retryDraft, profile);
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
