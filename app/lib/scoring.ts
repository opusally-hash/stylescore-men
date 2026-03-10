export type OnboardingData = {
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

function hasAny(answers: Record<string, string[]>, questionId: string, options: string[]) {
  const selected = answers[questionId] || [];
  return options.some((option) => selected.includes(option));
}

function countSelected(answers: Record<string, string[]>, questionId: string, options: string[]) {
  const selected = answers[questionId] || [];
  return options.filter((option) => selected.includes(option)).length;
}

export function calculateScore(
  onboarding: OnboardingData,
  answers: Record<string, string[]>
): ScoreResult {
  const categoryScores: CategoryScores = {
    fit: 50,
    wardrobe: 50,
    color: 50,
    shoes: 50,
    grooming: 50,
    occasion: 50,
  };

  let contradictionCount = 0;
  let notSureCount = 0;

  const addScore = (category: CategoryKey, points: number) => {
    categoryScores[category] += points;
  };

  const addNotSurePenalty = (questionId: string) => {
    if (hasAny(answers, questionId, ["Not sure", "I’m not sure", "Not sure what suits me"])) {
      notSureCount += 1;
    }
  };

  // Q1 Build
  if (hasAny(answers, "q1", ["Athletic", "Average"])) addScore("fit", 4);
  if (hasAny(answers, "q1", ["Stocky", "Plus"])) addScore("fit", -3);
  addNotSurePenalty("q1");

  // Q2 Fit challenges
  addScore("fit", -4 * countSelected(answers, "q2", [
    "Broad shoulders",
    "Belly/tummy area",
    "Big thighs",
    "Short legs",
    "Long torso",
    "Clothes feel tight in chest/arms",
  ]));

  // Q3 Shirt fit
  if (hasAny(answers, "q3", ["Shoulder seams sit correctly"])) addScore("fit", 12);
  if (hasAny(answers, "q3", ["Chest feels tight"])) addScore("fit", -10);
  if (hasAny(answers, "q3", ["Shirt is too long/too short"])) addScore("fit", -8);
  if (hasAny(answers, "q3", ["Collar/neck feels loose"])) addScore("fit", -5);
  if (hasAny(answers, "q3", ["Sleeves feel too tight"])) addScore("fit", -7);
  addNotSurePenalty("q3");

  // Q4 Pant fit
  if (hasAny(answers, "q4", ["Clean at waist (no constant adjusting)"])) addScore("fit", 12);
  if (hasAny(answers, "q4", ["Tight in thighs"])) addScore("fit", -8);
  if (hasAny(answers, "q4", ["Baggy in seat"])) addScore("fit", -8);
  if (hasAny(answers, "q4", ["Too long/dragging"])) addScore("fit", -10);
  if (hasAny(answers, "q4", ["Too short/high water"])) addScore("fit", -8);
  addNotSurePenalty("q4");

  // Q5 Wardrobe basics
  addScore("wardrobe", 6 * countSelected(answers, "q5", [
    "Solid tees/polos",
    "Neutral chinos/jeans",
    "Casual button-downs",
    "A good jacket/overshirt",
    "Clean sneakers",
  ]));
  if (hasAny(answers, "q5", ["None of these"])) addScore("wardrobe", -18);

  // Q6 Go-to outfit pieces
  if (hasAny(answers, "q6", ["Neutral basics"])) addScore("wardrobe", 10);
  if (hasAny(answers, "q6", ["Logos/graphics"])) addScore("wardrobe", -5);
  if (hasAny(answers, "q6", ["Random mix"])) addScore("wardrobe", -8);
  if (hasAny(answers, "q6", ["Mostly athletic wear"])) addScore("wardrobe", -6);
  if (hasAny(answers, "q6", ["Work uniform only"])) addScore("wardrobe", -4);

  // Q7 Closet quality
  if (hasAny(answers, "q7", ["Mix-and-match"])) addScore("wardrobe", 12);
  if (hasAny(answers, "q7", ["Only a few repeats"])) addScore("wardrobe", -4);
  if (hasAny(answers, "q7", ["Lots of items but hard to pair"])) addScore("wardrobe", -10);
  if (hasAny(answers, "q7", ["Mostly impulse buys"])) addScore("wardrobe", -8);
  if (hasAny(answers, "q7", ["Hand-me-downs/old"])) addScore("wardrobe", -10);

  // Q8 Colors
  addScore("color", 4 * countSelected(answers, "q8", [
    "Black",
    "White",
    "Grey",
    "Navy",
    "Earth tones",
  ]));
  if (hasAny(answers, "q8", ["Bright colors"])) addScore("color", -2);
  if (hasAny(answers, "q8", ["Whatever is clean"])) addScore("color", -10);

  // Q9 Coordination checks
  addScore("color", 4 * countSelected(answers, "q9", [
    "Top + bottom match",
    "Shoe color matches outfit",
    "Belt matches shoes (when formal)",
    "Socks match vibe",
  ]));
  if (hasAny(answers, "q9", ["Nothing—I just wear"])) addScore("color", -16);

  // Q10 Patterns
  if (hasAny(answers, "q10", ["Solid only"])) addScore("color", 6);
  if (hasAny(answers, "q10", ["Simple stripes/checks"])) addScore("color", 8);
  if (hasAny(answers, "q10", ["Loud prints"])) addScore("color", -6);
  if (hasAny(answers, "q10", ["Mix multiple patterns"])) addScore("color", -10);
  addNotSurePenalty("q10");

  // Q11 Shoes worn most
  if (hasAny(answers, "q11", ["Clean sneakers", "Loafers", "Boots", "Dress shoes"])) addScore("shoes", 8);
  if (hasAny(answers, "q11", ["Running shoes"])) addScore("shoes", -4);
  if (hasAny(answers, "q11", ["Slides/sandals"])) addScore("shoes", -8);

  // Q12 Shoe condition
  if (hasAny(answers, "q12", ["Clean and presentable"])) addScore("shoes", 16);
  if (hasAny(answers, "q12", ["Slightly dusty/scuffed"])) addScore("shoes", -5);
  if (hasAny(answers, "q12", ["Often dirty"])) addScore("shoes", -15);
  if (hasAny(answers, "q12", ["Falling apart"])) addScore("shoes", -20);
  addNotSurePenalty("q12");

  // Q13 Nice shoe options
  if (hasAny(answers, "q13", ["1 solid nice pair"])) addScore("shoes", 8);
  if (hasAny(answers, "q13", ["2+ nice pairs"])) addScore("shoes", 14);
  if (hasAny(answers, "q13", ["Only casual shoes"])) addScore("shoes", -6);
  if (hasAny(answers, "q13", ["Only athletic shoes"])) addScore("shoes", -12);
  if (hasAny(answers, "q13", ["None"])) addScore("shoes", -16);

  // Q14 Hair routine
  addScore("grooming", 5 * countSelected(answers, "q14", [
    "Regular haircut schedule",
    "Style hair most days",
    "Beard trimmed/clean line",
    "Shave regularly",
  ]));
  if (hasAny(answers, "q14", ["No routine"])) addScore("grooming", -18);

  // Q15 Skin routine
  addScore("grooming", 4 * countSelected(answers, "q15", [
    "Face wash",
    "Moisturizer",
    "Sunscreen",
    "Beard oil/balm",
  ]));
  if (hasAny(answers, "q15", ["None"])) addScore("grooming", -12);

  // Q16 Hygiene
  addScore("grooming", 4 * countSelected(answers, "q16", [
    "Nails trimmed",
    "Clean shoes/socks",
    "Deodorant daily",
    "Breath care",
  ]));
  if (hasAny(answers, "q16", ["I ignore these"])) addScore("grooming", -18);

  // Q17 Fragrance
  if (hasAny(answers, "q17", ["Daily (light)", "Only events"])) addScore("grooming", 4);
  if (hasAny(answers, "q17", ["Deodorant only"])) addScore("grooming", 1);
  if (hasAny(answers, "q17", ["I avoid fragrance"])) addScore("grooming", 0);
  addNotSurePenalty("q17");

  // Q18 Fragrance issue
  if (hasAny(answers, "q18", ["No issue"])) addScore("grooming", 2);
  if (hasAny(answers, "q18", ["Too strong/headaches", "Doesn’t last", "Confusing choices", "Don’t want to spend"])) {
    addScore("grooming", -2);
  }

  // Q19 Accessories
  const accessoryCount = countSelected(answers, "q19", [
    "Watch",
    "Belt that fits well",
    "Sunglasses",
    "Simple chain/ring",
    "Neat bag/backpack",
  ]);
  addScore("wardrobe", accessoryCount * 2);
  addScore("occasion", accessoryCount * 2);
  if (hasAny(answers, "q19", ["None"])) {
    addScore("wardrobe", -4);
    addScore("occasion", -4);
  }

  // Q20 Occasion dressing
  if (hasAny(answers, "q20", ["Dress slightly better than average"])) addScore("occasion", 16);
  if (hasAny(answers, "q20", ["Same outfit everywhere"])) addScore("occasion", -14);
  if (hasAny(answers, "q20", ["Under-dress often"])) addScore("occasion", -16);
  if (hasAny(answers, "q20", ["Over-dress often"])) addScore("occasion", -6);
  if (hasAny(answers, "q20", ["I ask someone"])) addScore("occasion", 2);
  addNotSurePenalty("q20");

  // Onboarding adjustments
  if (onboarding.workStyle === "Corporate") addScore("occasion", 8);
  if (onboarding.workStyle === "Sales/Client-facing") addScore("occasion", 6);
  if (onboarding.workStyle === "Ops/Warehouse") {
    addScore("occasion", -2);
    addScore("shoes", 2);
  }

  if (onboarding.stylePreference === "Classic" || onboarding.stylePreference === "Minimalist") {
    addScore("color", 6);
    addScore("wardrobe", 6);
  }

  if (onboarding.stylePreference === "Streetwear") {
    addScore("wardrobe", 2);
    addScore("occasion", -2);
  }

  if (onboarding.budget === "Low") {
    addScore("wardrobe", -3);
    addScore("shoes", -3);
  }

  if (onboarding.budget === "High") {
    addScore("wardrobe", 3);
    addScore("shoes", 3);
  }

  if (onboarding.build === "Stocky" || onboarding.build === "Plus") {
    addScore("fit", -4);
  }

  if (onboarding.fitChallenges?.includes("Short legs")) addScore("fit", -4);
  if (onboarding.fitChallenges?.includes("Belly/tummy area")) addScore("fit", -4);
  if (onboarding.fitChallenges?.includes("Big thighs")) addScore("fit", -3);

  // Contradictions
  if (
    hasAny(answers, "q9", ["Top + bottom match", "Shoe color matches outfit"]) &&
    hasAny(answers, "q9", ["Nothing—I just wear"])
  ) {
    contradictionCount += 1;
  }

  if (
    hasAny(answers, "q12", ["Clean and presentable"]) &&
    hasAny(answers, "q13", ["None"])
  ) {
    contradictionCount += 1;
  }

  if (
    hasAny(answers, "q14", ["Regular haircut schedule"]) &&
    hasAny(answers, "q14", ["No routine"])
  ) {
    contradictionCount += 1;
  }

  // Clamp final scores
  (Object.keys(categoryScores) as CategoryKey[]).forEach((key) => {
    categoryScores[key] = clamp(Math.round(categoryScores[key]));
  });

  const overall_score = Math.round(
    Object.values(categoryScores).reduce((sum, value) => sum + value, 0) /
      Object.values(categoryScores).length
  );

  const focus_top_3 = Object.entries(categoryScores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([key]) => key);

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
    category_scores: categoryScores,
    focus_top_3,
    confidence_level,
  };
}