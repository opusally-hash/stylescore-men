import { mergeOnboardingData, type OnboardingForm } from "./onboarding";
import { calculateScore, type CategoryScores, type ScoreResult } from "./scoring";

export type AssessmentAnswers = Record<string, string[]>;
export type CategoryKey = keyof CategoryScores;

export type StyleArchetype = {
  title: string;
  description: string;
};

export type FreeAssessmentReport = {
  result: ScoreResult;
  archetype: StyleArchetype;
  archetypeSuggestions: string[];
  personalizedRecommendations: Record<string, string[]>;
  recommendedNeeds: Record<string, string[]>;
  radarData: { category: string; score: number }[];
};

export const categoryLabels: Record<CategoryKey, string> = {
  fit: "Fit & Proportion",
  wardrobe: "Wardrobe Foundations",
  color: "Color Coordination",
  shoes: "Shoes & Footwear",
  grooming: "Grooming",
  occasion: "Occasion Styling",
};

export function getSelectedAnswer(
  answers: AssessmentAnswers,
  questionId: string
) {
  return answers[questionId]?.[0] || null;
}

export function getScoreExtremes(categoryScores: Record<string, number>) {
  const keys = Object.keys(categoryLabels) as CategoryKey[];

  const strongest = [...keys].sort((left, right) => {
    const scoreDiff = categoryScores[right] - categoryScores[left];
    if (scoreDiff !== 0) return scoreDiff;
    return keys.indexOf(left) - keys.indexOf(right);
  })[0];

  const weakest =
    [...keys]
      .sort((left, right) => {
        const scoreDiff = categoryScores[left] - categoryScores[right];
        if (scoreDiff !== 0) return scoreDiff;
        return keys.indexOf(left) - keys.indexOf(right);
      })
      .find((key) => key !== strongest) ?? strongest;

  return { strongest, weakest };
}

export function getStyleArchetype(
  overallScore: number,
  categoryScores: Record<string, number>,
  selfView: string | null = null
): StyleArchetype {
  const { strongest, weakest } = getScoreExtremes(categoryScores);
  const feelsStrong = selfView === "a real strength";
  const feelsStuck =
    selfView === "underdeveloped" || selfView === "something I want help with";

  if (overallScore >= 80 && feelsStrong) {
    if (strongest === "occasion") {
      return {
        title: "The Occasion Specialist",
        description:
          "You already know how to present yourself well when it counts. Your style is polished, intentional, and close to being a true strength.",
      };
    }

    return {
      title: "The Sharp Minimalist",
      description:
        "You already have a strong style foundation. Your presentation feels deliberate, clean, and well above average.",
    };
  }

  if (overallScore >= 68) {
    if (strongest === "occasion") {
      return {
        title: "The Emerging Professional",
        description:
          "You already show up well in important settings. The next step is making your everyday style as strong as your occasion presence.",
      };
    }

    return {
      title: "The Casual Optimizer",
      description:
        "You have a good base and clear upside. With a few focused upgrades, your style can move from decent to consistently sharp.",
    };
  }

  if (overallScore >= 52) {
    return {
      title: "The Untapped Potential",
      description:
        "Your style has real potential, but a few weak categories are holding back the full picture. The right fixes will create visible gains quickly.",
    };
  }

  if (weakest === "grooming" || weakest === "shoes" || feelsStuck) {
    return {
      title: "The Style Rebuilder",
      description:
        "Your current style needs a reset in a few high-impact areas. Starting with the basics will give you the fastest visible improvement.",
    };
  }

  return {
    title: "The Early Stage Improver",
    description:
      "You are still building your style foundation. The good news is that a stronger wardrobe, better fit, and cleaner presentation can change the outcome quickly.",
  };
}

export function getArchetypeStyleSuggestions(archetypeTitle: string): string[] {
  const suggestions: Record<string, string[]> = {
    "The Occasion Specialist": [
      "Bring the same polish from special occasions into your everyday looks.",
      "Focus on consistency, not reinvention — your base is already strong.",
      "Upgrade weaker categories so your overall style matches your best moments.",
    ],
    "The Sharp Minimalist": [
      "Keep your wardrobe clean, repeatable, and intentional.",
      "Avoid adding noise — your strength is clarity and restraint.",
      "Invest in better versions of your essentials rather than chasing trends.",
    ],
    "The Emerging Professional": [
      "Turn occasion-level effort into everyday reliability.",
      "Build a few strong weekday outfits so you are not relying on effort in the moment.",
      "Sharpen shoes, grooming, and fit first for the fastest lift.",
    ],
    "The Casual Optimizer": [
      "You do not need a new identity — you need more consistency.",
      "Prioritize upgrades that make your existing style cleaner and sharper.",
      "Make your wardrobe easier to use, not just bigger.",
    ],
    "The Untapped Potential": [
      "A few stronger basics will change your style faster than buying more random pieces.",
      "Start with fit, shoes, and grooming before worrying about trendiness.",
      "You do not need more fashion knowledge yet — you need better foundations.",
    ],
    "The Style Rebuilder": [
      "Reset the visible basics first: shoes, grooming, fit, and clean wardrobe anchors.",
      "Avoid impulse buying while rebuilding your style base.",
      "Think in terms of simple, reliable upgrades, not dramatic reinvention.",
    ],
    "The Early Stage Improver": [
      "Build your style around a small number of reliable pieces.",
      "Choose functionally sharp basics before experimenting.",
      "Your goal is to become clearer and more intentional, not more complicated.",
    ],
  };

  return (
    suggestions[archetypeTitle] || [
      "Focus on consistency across your wardrobe, fit, shoes, and grooming.",
      "Improve the basics first before adding complexity.",
      "Build a style that is easy to repeat and easy to trust.",
    ]
  );
}

export function buildPersonalizedRecommendations(
  answers: AssessmentAnswers,
  focusTop3: string[]
): Record<string, string[]> {
  const personalized: Record<string, string[]> = {};
  const has = (questionId: string, option: string) =>
    (answers[questionId] || []).includes(option);

  focusTop3.forEach((area) => {
    let tip =
      "Make one deliberate improvement in this area before buying anything else.";

    if (area === "shoes") {
      if (has("q12", "visibly dirty or aging")) {
        tip = "Replace or clean the pair you wear most — old shoes quietly drag down the whole outfit.";
      } else if (has("q11", "running shoes for almost everything")) {
        tip = "Add one non-athletic shoe option so every outfit stops defaulting to the same casual energy.";
      } else if (has("q11", "whatever is nearest")) {
        tip = "Build a small shoe rotation so you stop letting convenience decide the look.";
      } else {
        tip = "Upgrade to one clean, versatile shoe that makes the rest of your wardrobe look sharper.";
      }
    }

    if (area === "grooming") {
      if (has("q14", "almost nonexistent")) {
        tip = "Set a basic grooming baseline first — haircut timing, beard cleanup, and daily hygiene will change your presentation fastest.";
      } else if (has("q14", "minimal unless needed") || has("q14", "inconsistent")) {
        tip = "Turn grooming into a routine instead of a reaction, because inconsistency reads as neglect.";
      } else {
        tip = "Keep grooming tight and repeatable so your clothes are not doing all the work.";
      }
    }

    if (area === "fit") {
      if (has("q1", "often feel tight in one area")) {
        tip = "Fix fit before buying more clothes — tightness in one area makes the whole outfit look off.";
      } else if (has("q1", "are mostly chosen for comfort, not fit")) {
        tip = "Keep the comfort, but stop choosing sizes that hide your shape and flatten the outfit.";
      } else if (has("q3", "slightly awkward in fit")) {
        tip = "Use shoulders, waist, and trouser line as your filter so the silhouette stops looking accidental.";
      } else {
        tip = "Sharper proportions will improve your look faster than trendier pieces ever will.";
      }
    }

    if (area === "wardrobe") {
      if (
        has("q5", "a mix of random items") ||
        has("q5", "whatever I happened to buy")
      ) {
        tip = "Build around versatile basics instead of random pickups so your wardrobe starts acting like a system.";
      } else if (has("q5", "older clothes I still use")) {
        tip = "Refresh your oldest repeat items first, because dated basics age every outfit around them.";
      } else if (has("q5", "mostly athletic or lounge wear")) {
        tip = "Add a few non-athletic anchors so casual does not automatically read as careless.";
      } else {
        tip = "Make your wardrobe easier to combine, not just bigger.";
      }
    }

    if (area === "color") {
      if (
        has("q8", "mixed without much planning") ||
        has("q8", "just whatever is available")
      ) {
        tip = "Move to a neutral base palette so your current pieces start working together instead of fighting each other.";
      } else if (has("q9", "I don't really check")) {
        tip = "A 10-second coordination check before leaving will improve your consistency more than buying new clothes.";
      } else if (has("q9", "I ask someone else") || has("q8", "often bold or loud")) {
        tip = "Dial color back until you can repeat combinations confidently without outside help.";
      } else {
        tip = "Keep your base colors repeatable so the outfit feels intentional at a glance.";
      }
    }

    if (area === "occasion") {
      if (has("q17", "underdress more than I should")) {
        tip = "Build one polished occasion formula now, because underdressing is costing you before you even speak.";
      } else if (
        has("q17", "wear some version of what I always wear") ||
        has("q17", "feel unsure what to wear")
      ) {
        tip = "Separate your occasion outfit from your everyday default so important settings stop getting the same safe uniform.";
      } else {
        tip = "Pre-build one go-to dressed-up look so you are not improvising when the stakes are higher.";
      }
    }

    personalized[area] = [tip];
  });

  return personalized;
}

export function buildRecommendedNeeds(
  answers: AssessmentAnswers,
  focusTop3: string[]
): Record<string, string[]> {
  const needs: Record<string, string[]> = {};
  const has = (questionId: string, option: string) =>
    (answers[questionId] || []).includes(option);

  focusTop3.forEach((area) => {
    const items: string[] = [];

    if (area === "shoes") {
      if (has("q12", "visibly dirty or aging")) {
        items.push("clean white minimalist sneakers");
      }
      if (has("q11", "running shoes for almost everything")) {
        items.push("one versatile smart-casual shoe");
      }
      if (has("q11", "whatever is nearest")) {
        items.push("one polished dress-better shoe");
      }
      if (items.length === 0) {
        items.push("clean everyday sneakers");
        items.push("one versatile going-out shoe");
      }
    }

    if (area === "grooming") {
      if (has("q14", "almost nonexistent")) {
        items.push("basic grooming starter set");
      }
      if (has("q14", "inconsistent") || has("q14", "minimal unless needed")) {
        items.push("simple daily grooming essentials");
      }
      if (items.length === 0) {
        items.push("minimal skincare routine");
        items.push("reliable grooming essentials");
      }
    }

    if (area === "fit") {
      if (has("q1", "often feel tight in one area")) {
        items.push("better-fitting shirts with more room where needed");
      }
      if (has("q3", "slightly awkward in fit")) {
        items.push("one tailored or hemmed core outfit");
      }
      if (items.length === 0) {
        items.push("better-fitting chinos");
        items.push("cleaner-proportion tops");
      }
    }

    if (area === "wardrobe") {
      if (
        has("q5", "a mix of random items") ||
        has("q5", "whatever I happened to buy")
      ) {
        items.push("neutral wardrobe basics");
      }
      if (has("q5", "mostly athletic or lounge wear")) {
        items.push("mix-and-match casual essentials");
      }
      if (items.length === 0) {
        items.push("versatile basics");
        items.push("one structured layer");
      }
    }

    if (area === "color") {
      if (
        has("q8", "just whatever is available") ||
        has("q8", "mixed without much planning")
      ) {
        items.push("navy, white, grey, and black basics");
      }
      if (has("q9", "I ask someone else")) {
        items.push("more coordinated solid-color tops");
      }
      if (items.length === 0) {
        items.push("neutral color foundation");
      }
    }

    if (area === "occasion") {
      if (has("q17", "underdress more than I should")) {
        items.push("one polished occasion outfit");
        items.push("smart-casual shoes");
      }
      if (
        has("q17", "wear some version of what I always wear") ||
        has("q17", "feel unsure what to wear")
      ) {
        items.push("one reliable go-to occasion combination");
      }
      if (items.length === 0) {
        items.push("occasion-ready outfit formula");
      }
    }

    needs[area] = Array.from(new Set(items)).slice(0, 4);
  });

  return needs;
}

export function buildFallbackDiagnosis({
  overallScore,
  categoryScores,
  focusAreas,
}: {
  overallScore: number;
  categoryScores: Record<string, number>;
  focusAreas: string[];
}) {
  const { strongest, weakest } = getScoreExtremes(categoryScores);

  const actionByWeakest: Record<string, string> = {
    fit: "Start by fixing the cut of the clothes you wear most, because better proportions make everything else look more expensive.",
    wardrobe:
      "Stop adding random pieces and replace your three most-worn basics with cleaner, more versatile versions.",
    color:
      "A tighter neutral palette would make your current wardrobe look twice as intentional with almost no extra effort.",
    shoes:
      "Replacing the pair you wear most often would probably move your score faster than buying another top.",
    grooming:
      "A simple haircut-and-maintenance rhythm would sharpen your look faster than any new purchase.",
    occasion:
      "Build one reliable dressed-up formula now, because you are losing points whenever the setting asks for more than your default.",
  };

  const lead =
    overallScore < 45
      ? `At ${overallScore}, the issue is not taste — it is visible neglect in the wrong places.`
      : `At ${overallScore}, you are not far off, but the weak links are flattening the whole impression.`;

  const closingFocus =
    focusAreas[1] && focusAreas[1] !== weakest
      ? ` ${categoryLabels[focusAreas[1] as CategoryKey]} is the next lever after that.`
      : "";

  return `${lead} ${categoryLabels[strongest]} (${categoryScores[strongest]}) is your strongest category, while ${categoryLabels[weakest]} (${categoryScores[weakest]}) is dragging the score down. ${actionByWeakest[weakest]}${closingFocus}`;
}

export function buildFreeAssessmentReport({
  answers,
  onboardingData,
}: {
  answers: AssessmentAnswers;
  onboardingData?: Partial<OnboardingForm> | null;
}): FreeAssessmentReport {
  const mergedOnboardingData = mergeOnboardingData(onboardingData);
  const result = calculateScore(mergedOnboardingData, answers);
  const selfView = getSelectedAnswer(answers, "q20");
  const archetype = getStyleArchetype(
    result.overall_score,
    result.category_scores,
    selfView
  );

  return {
    result,
    archetype,
    archetypeSuggestions: getArchetypeStyleSuggestions(archetype.title),
    personalizedRecommendations: buildPersonalizedRecommendations(
      answers,
      result.focus_top_3
    ),
    recommendedNeeds: buildRecommendedNeeds(answers, result.focus_top_3),
    radarData: (Object.keys(categoryLabels) as CategoryKey[]).map((key) => ({
      category: categoryLabels[key],
      score: result.category_scores[key],
    })),
  };
}
