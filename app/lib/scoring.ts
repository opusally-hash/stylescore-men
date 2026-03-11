export type OnboardingData = {
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

export type CategoryScores = {
  fit: number;
  wardrobe: number;
  color: number;
  shoes: number;
  grooming: number;
  occasion: number;
};

export type ScoreResult = {
  overall_score: number;
  category_scores: CategoryScores;
  focus_top_3: string[];
  confidence_level: "low" | "medium" | "high";
};

type CategoryKey = keyof CategoryScores;

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function hasAny(
  answers: Record<string, string[]>,
  questionId: string,
  options: string[]
) {
  const selected = answers[questionId] || [];
  return options.some((option) => selected.includes(option));
}

function countSelected(
  answers: Record<string, string[]>,
  questionId: string,
  options: string[]
) {
  const selected = answers[questionId] || [];
  return options.filter((option) => selected.includes(option)).length;
}

export function calculateScore(
  onboarding: OnboardingData,
  answers: Record<string, string[]>
): ScoreResult {
  const rawScores: CategoryScores = {
    fit: 50,
    wardrobe: 50,
    color: 50,
    shoes: 50,
    grooming: 50,
    occasion: 50,
  };

  const weights: Record<CategoryKey, number> = {
    fit: 1,
    wardrobe: 1,
    color: 1,
    shoes: 1,
    grooming: 1,
    occasion: 1,
  };

  let contradictionCount = 0;
  let notSureCount = 0;

  const add = (category: CategoryKey, points: number) => {
    rawScores[category] += points;
  };

  const trackUncertainty = (questionId: string) => {
    if (
      hasAny(answers, questionId, [
        "I’m not really sure",
        "I don’t pay much attention",
        "I’m not sure",
        "Not sure",
      ])
    ) {
      notSureCount += 1;
    }
  };

  // Q1
  if (hasAny(answers, "q1", ["fit me well in the shoulders and chest"])) add("fit", 12);
  if (hasAny(answers, "q1", ["fit okay but are a little loose"])) add("fit", 4);
  if (hasAny(answers, "q1", ["often feel tight in one area"])) add("fit", -10);
  if (hasAny(answers, "q1", ["are mostly chosen for comfort, not fit"])) add("fit", -8);
  trackUncertainty("q1");

  // Q2
  if (hasAny(answers, "q2", ["sit cleanly and look intentional"])) add("fit", 12);
  if (hasAny(answers, "q2", ["are a bit long or bunch at the bottom"])) add("fit", -8);
  if (hasAny(answers, "q2", ["feel tight in the thigh or seat"])) add("fit", -10);
  if (hasAny(answers, "q2", ["feel loose and shapeless"])) add("fit", -10);
  if (hasAny(answers, "q2", ["I don’t pay much attention"])) add("fit", -6);
  trackUncertainty("q2");

  // Q3
  if (hasAny(answers, "q3", ["sharp and put together"])) add("fit", 10);
  if (hasAny(answers, "q3", ["decent, but not polished"])) add("fit", 3);
  if (hasAny(answers, "q3", ["comfortable more than stylish"])) add("fit", -4);
  if (hasAny(answers, "q3", ["slightly awkward in fit"])) add("fit", -12);
  trackUncertainty("q3");

  // Q4
  if (hasAny(answers, "q4", ["care a lot about proportion and fit"])) add("fit", 10);
  if (hasAny(answers, "q4", ["check only whether they feel comfortable"])) add("fit", -3);
  if (hasAny(answers, "q4", ["buy if they look okay quickly"])) add("fit", -5);
  if (hasAny(answers, "q4", ["struggle to know what flatters me"])) add("fit", -10);
  if (hasAny(answers, "q4", ["rarely try before buying"])) add("fit", -6);

  // Q5
  if (hasAny(answers, "q5", ["versatile basics that work together"])) add("wardrobe", 14);
  if (hasAny(answers, "q5", ["a mix of random items"])) add("wardrobe", -8);
  if (hasAny(answers, "q5", ["older clothes I still use"])) add("wardrobe", -5);
  if (hasAny(answers, "q5", ["mostly athletic or lounge wear"])) add("wardrobe", -8);
  if (hasAny(answers, "q5", ["whatever I happened to buy"])) add("wardrobe", -10);

  // Q6
  if (hasAny(answers, "q6", ["they work well and I like them"])) add("wardrobe", 6);
  if (hasAny(answers, "q6", ["I don’t have many good alternatives"])) add("wardrobe", -6);
  if (hasAny(answers, "q6", ["most of my wardrobe is hard to combine"])) add("wardrobe", -12);
  if (hasAny(answers, "q6", ["I don’t enjoy planning outfits"])) add("wardrobe", -4);
  if (hasAny(answers, "q6", ["that’s just easier"])) add("wardrobe", -3);

  // Q7
  if (hasAny(answers, "q7", ["pieces that work with what I already own"])) add("wardrobe", 12);
  if (hasAny(answers, "q7", ["whatever catches my eye"])) add("wardrobe", -8);
  if (hasAny(answers, "q7", ["whatever is on sale"])) add("wardrobe", -5);
  if (hasAny(answers, "q7", ["whatever feels comfortable"])) add("wardrobe", -4);
  if (hasAny(answers, "q7", ["I don’t think much about it"])) add("wardrobe", -8);

  // Q8
  if (hasAny(answers, "q8", ["neutral and easy to combine"])) add("color", 12);
  if (hasAny(answers, "q8", ["mostly safe but repetitive"])) add("color", 5);
  if (hasAny(answers, "q8", ["mixed without much planning"])) add("color", -8);
  if (hasAny(answers, "q8", ["often bold or loud"])) add("color", -4);
  if (hasAny(answers, "q8", ["just whatever is available"])) add("color", -12);

  // Q9
  add(
    "color",
    4 *
      countSelected(answers, "q9", [
        "the whole outfit feels coordinated",
        "the shoes work with the outfit",
      ])
  );
  if (hasAny(answers, "q9", ["at least the clothes are clean"])) add("color", -2);
  if (hasAny(answers, "q9", ["I don’t really check"])) add("color", -12);
  if (hasAny(answers, "q9", ["I ask someone else"])) add("color", -3);

  // Q10
  if (hasAny(answers, "q10", ["balanced and intentional"])) add("color", 12);
  if (hasAny(answers, "q10", ["simple but fine"])) add("color", 6);
  if (hasAny(answers, "q10", ["inconsistent from piece to piece"])) add("color", -8);
  if (hasAny(answers, "q10", ["too plain or too random"])) add("color", -6);
  trackUncertainty("q10");

  // Q11
  if (hasAny(answers, "q11", ["clean casual shoes that suit most outfits"])) add("shoes", 12);
  if (hasAny(answers, "q11", ["running shoes for almost everything"])) add("shoes", -8);
  if (hasAny(answers, "q11", ["loafers/boots when needed and sneakers otherwise"])) add("shoes", 8);
  if (hasAny(answers, "q11", ["old shoes longer than I should"])) add("shoes", -12);
  if (hasAny(answers, "q11", ["whatever is nearest"])) add("shoes", -6);

  // Q12
  if (hasAny(answers, "q12", ["clean and presentable"])) add("shoes", 16);
  if (hasAny(answers, "q12", ["acceptable but a little worn"])) add("shoes", -2);
  if (hasAny(answers, "q12", ["visibly dirty or aging"])) add("shoes", -15);
  if (hasAny(answers, "q12", ["mostly functional, not stylish"])) add("shoes", -8);
  if (hasAny(answers, "q12", ["not something I focus on"])) add("shoes", -10);

  // Q13
  if (hasAny(answers, "q13", ["at least one strong shoe option"])) add("shoes", 12);
  if (hasAny(answers, "q13", ["something okay but not great"])) add("shoes", 4);
  if (hasAny(answers, "q13", ["only athletic or casual options"])) add("shoes", -10);
  if (hasAny(answers, "q13", ["no real dress-up option"])) add("shoes", -14);
  if (hasAny(answers, "q13", ["I haven’t thought about it"])) add("shoes", -6);

  // Q14
  if (hasAny(answers, "q14", ["regular and intentional"])) add("grooming", 14);
  if (hasAny(answers, "q14", ["basic but consistent"])) add("grooming", 8);
  if (hasAny(answers, "q14", ["inconsistent"])) add("grooming", -6);
  if (hasAny(answers, "q14", ["minimal unless needed"])) add("grooming", -10);
  if (hasAny(answers, "q14", ["almost nonexistent"])) add("grooming", -16);

  // Q15
  if (hasAny(answers, "q15", ["clean and well-maintained"])) add("grooming", 12);
  if (hasAny(answers, "q15", ["okay but not sharp"])) add("grooming", 3);
  if (hasAny(answers, "q15", ["uneven or overdue"])) add("grooming", -10);
  if (hasAny(answers, "q15", ["mostly ignored"])) add("grooming", -14);
  trackUncertainty("q15");

  // Q16
  if (hasAny(answers, "q16", ["solid and consistent"])) add("grooming", 10);
  if (hasAny(answers, "q16", ["decent but basic"])) add("grooming", 4);
  if (hasAny(answers, "q16", ["inconsistent"])) add("grooming", -6);
  if (hasAny(answers, "q16", ["reactive, not planned"])) add("grooming", -8);
  if (hasAny(answers, "q16", ["not something I prioritize"])) add("grooming", -12);

  // Q17
  if (hasAny(answers, "q17", ["dress a level above average"])) add("occasion", 16);
  if (hasAny(answers, "q17", ["dress appropriately, not memorably"])) add("occasion", 8);
  if (hasAny(answers, "q17", ["wear some version of what I always wear"])) add("occasion", -8);
  if (hasAny(answers, "q17", ["underdress more than I should"])) add("occasion", -14);
  trackUncertainty("q17");

  // Q18
  if (hasAny(answers, "q18", ["polished and appropriate"])) add("occasion", 12);
  if (hasAny(answers, "q18", ["good enough"])) add("occasion", 4);
  if (hasAny(answers, "q18", ["too casual"])) add("occasion", -10);
  if (hasAny(answers, "q18", ["inconsistent"])) add("occasion", -6);
  if (hasAny(answers, "q18", ["not really intentional"])) add("occasion", -10);

  // Q19
  if (hasAny(answers, "q19", ["a few well-built outfits that work"])) add("occasion", 12);
  if (hasAny(answers, "q19", ["one decent fallback outfit"])) add("occasion", 5);
  if (hasAny(answers, "q19", ["trial and error"])) add("occasion", -6);
  if (hasAny(answers, "q19", ["the same outfit every time"])) add("occasion", -10);
  if (hasAny(answers, "q19", ["luck"])) add("occasion", -12);

  // Q20
  if (hasAny(answers, "q20", ["a real strength"])) {
    add("fit", 3);
    add("wardrobe", 3);
    add("color", 3);
    add("shoes", 3);
    add("grooming", 3);
    add("occasion", 3);
  }
  if (hasAny(answers, "q20", ["decent with room to improve"])) {
    add("fit", 1);
    add("wardrobe", 1);
    add("color", 1);
    add("shoes", 1);
    add("grooming", 1);
    add("occasion", 1);
  }
  if (hasAny(answers, "q20", ["average and forgettable"])) {
    add("fit", -3);
    add("wardrobe", -3);
    add("color", -3);
    add("shoes", -3);
    add("grooming", -3);
    add("occasion", -3);
  }
  if (hasAny(answers, "q20", ["underdeveloped"])) {
    add("fit", -6);
    add("wardrobe", -6);
    add("color", -6);
    add("shoes", -6);
    add("grooming", -6);
    add("occasion", -6);
  }
  if (hasAny(answers, "q20", ["something I want help with"])) {
    add("fit", -3);
    add("wardrobe", -3);
    add("color", -3);
    add("shoes", -3);
    add("grooming", -3);
    add("occasion", -3);
  }

  // Pre-assessment: contextual weights
  if (onboarding.workStyle === "Corporate") {
    weights.occasion += 0.2;
    weights.grooming += 0.1;
    weights.shoes += 0.1;
  }

  if (onboarding.workStyle === "Sales/Client-facing") {
    weights.occasion += 0.15;
    weights.grooming += 0.1;
    weights.color += 0.05;
  }

  if (onboarding.workStyle === "Remote/Casual") {
    weights.fit += 0.1;
    weights.wardrobe += 0.1;
  }

  if (onboarding.workStyle === "Ops/Warehouse") {
    weights.fit += 0.05;
    weights.shoes += 0.1;
    weights.occasion -= 0.05;
  }

  if (onboarding.goals?.includes("Dating")) {
    weights.grooming += 0.2;
    weights.shoes += 0.15;
    weights.fit += 0.15;
  }

  if (onboarding.goals?.includes("Promotion")) {
    weights.occasion += 0.15;
    weights.grooming += 0.1;
    weights.wardrobe += 0.1;
  }

  if (onboarding.goals?.includes("Confidence")) {
    weights.fit += 0.1;
    weights.grooming += 0.1;
    weights.shoes += 0.05;
  }

  if (onboarding.goals?.includes("Minimalist")) {
    weights.wardrobe += 0.15;
    weights.color += 0.1;
  }

  if (onboarding.stylePreference === "Classic") {
    weights.occasion += 0.1;
    weights.color += 0.1;
    add("occasion", 2);
    add("color", 2);
  }

  if (onboarding.stylePreference === "Minimalist") {
    weights.wardrobe += 0.1;
    weights.color += 0.1;
    add("wardrobe", 2);
    add("color", 2);
  }

  if (onboarding.stylePreference === "Streetwear") {
    weights.wardrobe += 0.05;
    weights.fit += 0.05;
    weights.occasion -= 0.05;
  }

  if (onboarding.stylePreference === "Smart casual") {
    weights.occasion += 0.08;
    weights.shoes += 0.05;
  }

  if (onboarding.budget === "Low") {
    add("wardrobe", -2);
    add("shoes", -2);
  }

  if (onboarding.budget === "High") {
    add("wardrobe", 2);
    add("shoes", 2);
  }

  if (onboarding.build === "Stocky" || onboarding.build === "Plus") {
    weights.fit += 0.1;
    add("fit", -2);
  }

  if (onboarding.fitChallenges?.includes("Short legs")) {
    weights.fit += 0.08;
    add("fit", -3);
  }

  if (onboarding.fitChallenges?.includes("Belly/tummy area")) {
    weights.fit += 0.08;
    add("fit", -3);
  }

  if (onboarding.fitChallenges?.includes("Big thighs")) {
    weights.fit += 0.06;
    add("fit", -2);
  }

  if (onboarding.climate === "Hot/Humid") {
    weights.grooming += 0.05;
    weights.fit += 0.05;
  }

  // Contradictions
  if (
    hasAny(answers, "q9", ["the whole outfit feels coordinated"]) &&
    hasAny(answers, "q9", ["I don’t really check"])
  ) {
    contradictionCount += 1;
  }

  if (
    hasAny(answers, "q12", ["clean and presentable"]) &&
    hasAny(answers, "q12", ["visibly dirty or aging"])
  ) {
    contradictionCount += 1;
  }

  if (
    hasAny(answers, "q14", ["regular and intentional"]) &&
    hasAny(answers, "q14", ["almost nonexistent"])
  ) {
    contradictionCount += 1;
  }

  // Final displayed category scores
  const category_scores: CategoryScores = {
    fit: clamp(Math.round(rawScores.fit)),
    wardrobe: clamp(Math.round(rawScores.wardrobe)),
    color: clamp(Math.round(rawScores.color)),
    shoes: clamp(Math.round(rawScores.shoes)),
    grooming: clamp(Math.round(rawScores.grooming)),
    occasion: clamp(Math.round(rawScores.occasion)),
  };

  // Weighted overall score
  const weightedNumerator =
    category_scores.fit * weights.fit +
    category_scores.wardrobe * weights.wardrobe +
    category_scores.color * weights.color +
    category_scores.shoes * weights.shoes +
    category_scores.grooming * weights.grooming +
    category_scores.occasion * weights.occasion;

  const weightSum =
    weights.fit +
    weights.wardrobe +
    weights.color +
    weights.shoes +
    weights.grooming +
    weights.occasion;

  const overall_score = clamp(Math.round(weightedNumerator / weightSum));

  // Weighted urgency for focus areas
  const urgency = (Object.keys(category_scores) as CategoryKey[]).map((key) => ({
    key,
    score: (100 - category_scores[key]) * weights[key],
  }));

  const focus_top_3 = urgency
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.key);

  const answeredCount = Object.keys(answers).filter(
    (key) => (answers[key] || []).length > 0
  ).length;

  let confidence_level: "low" | "medium" | "high" = "medium";

  if (answeredCount < 12 || notSureCount >= 4 || contradictionCount >= 2) {
    confidence_level = "low";
  } else if (answeredCount >= 18 && notSureCount <= 1 && contradictionCount === 0) {
    confidence_level = "high";
  }

  return {
    overall_score,
    category_scores,
    focus_top_3,
    confidence_level,
  };
}