import type { OnboardingForm } from "./onboarding";

export type OnboardingData = Partial<OnboardingForm>;

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

type QuestionScoreConfig = {
  category: CategoryKey;
  options: readonly string[];
};

const OPTION_SCORES = [96, 78, 58, 38, 18] as const;

const QUESTION_CONFIG: Record<string, QuestionScoreConfig> = {
  q1: {
    category: "fit",
    options: [
      "fit me well in the shoulders and chest",
      "fit okay but are a little loose",
      "often feel tight in one area",
      "are mostly chosen for comfort, not fit",
      "I'm not really sure",
    ],
  },
  q3: {
    category: "fit",
    options: [
      "sharp and put together",
      "decent, but not polished",
      "comfortable more than stylish",
      "slightly awkward in fit",
      "I'm not really sure",
    ],
  },
  q5: {
    category: "wardrobe",
    options: [
      "versatile basics that work together",
      "a mix of random items",
      "older clothes I still use",
      "mostly athletic or lounge wear",
      "whatever I happened to buy",
    ],
  },
  q8: {
    category: "color",
    options: [
      "neutral and easy to combine",
      "mostly safe but repetitive",
      "mixed without much planning",
      "often bold or loud",
      "just whatever is available",
    ],
  },
  q9: {
    category: "color",
    options: [
      "the whole outfit feels coordinated",
      "the shoes work with the outfit",
      "at least the clothes are clean",
      "I don't really check",
      "I ask someone else",
    ],
  },
  q11: {
    category: "shoes",
    options: [
      "clean casual shoes that suit most outfits",
      "running shoes for almost everything",
      "loafers or boots when needed and sneakers otherwise",
      "old shoes longer than I should",
      "whatever is nearest",
    ],
  },
  q12: {
    category: "shoes",
    options: [
      "clean and presentable",
      "acceptable but a little worn",
      "visibly dirty or aging",
      "mostly functional, not stylish",
      "not something I focus on",
    ],
  },
  q14: {
    category: "grooming",
    options: [
      "regular and intentional",
      "basic but consistent",
      "inconsistent",
      "minimal unless needed",
      "almost nonexistent",
    ],
  },
  q17: {
    category: "occasion",
    options: [
      "dress a level above average",
      "dress appropriately, not memorably",
      "wear some version of what I always wear",
      "underdress more than I should",
      "feel unsure what to wear",
    ],
  },
};

const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  fit: 1,
  wardrobe: 1,
  color: 1,
  shoes: 1,
  grooming: 1,
  occasion: 1,
};

const UNCERTAIN_OPTIONS = new Set([
  "I'm not really sure",
  "I don't really check",
  "I ask someone else",
  "whatever is nearest",
  "feel unsure what to wear",
  "not something I focus on",
]);

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getSelectedAnswer(
  answers: Record<string, string[]>,
  questionId: string
) {
  return answers[questionId]?.[0] || null;
}

function getQuestionScore(answers: Record<string, string[]>, questionId: string) {
  const config = QUESTION_CONFIG[questionId];
  const selectedAnswer = getSelectedAnswer(answers, questionId);

  if (!config || !selectedAnswer) return null;

  const optionIndex = config.options.indexOf(selectedAnswer);

  if (optionIndex === -1) return null;

  return OPTION_SCORES[optionIndex];
}

export function calculateScore(
  _onboarding: OnboardingData,
  answers: Record<string, string[]>
): ScoreResult {
  const categoryBuckets: Record<CategoryKey, number[]> = {
    fit: [],
    wardrobe: [],
    color: [],
    shoes: [],
    grooming: [],
    occasion: [],
  };

  let answeredCount = 0;
  let uncertainCount = 0;

  Object.entries(QUESTION_CONFIG).forEach(([questionId, config]) => {
    const selectedAnswer = getSelectedAnswer(answers, questionId);
    const score = getQuestionScore(answers, questionId);

    if (selectedAnswer) {
      answeredCount += 1;
    }

    if (selectedAnswer && UNCERTAIN_OPTIONS.has(selectedAnswer)) {
      uncertainCount += 1;
    }

    if (score !== null) {
      categoryBuckets[config.category].push(score);
    }
  });

  const category_scores: CategoryScores = {
    fit: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.fit)
      )
    ),
    wardrobe: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.wardrobe)
      )
    ),
    color: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.color)
      )
    ),
    shoes: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.shoes)
      )
    ),
    grooming: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.grooming)
      )
    ),
    occasion: clamp(
      Math.round(
        averageOrFallback(categoryBuckets.occasion)
      )
    ),
  };

  const weightedNumerator =
    category_scores.fit * CATEGORY_WEIGHTS.fit +
    category_scores.wardrobe * CATEGORY_WEIGHTS.wardrobe +
    category_scores.color * CATEGORY_WEIGHTS.color +
    category_scores.shoes * CATEGORY_WEIGHTS.shoes +
    category_scores.grooming * CATEGORY_WEIGHTS.grooming +
    category_scores.occasion * CATEGORY_WEIGHTS.occasion;

  const weightSum =
    CATEGORY_WEIGHTS.fit +
    CATEGORY_WEIGHTS.wardrobe +
    CATEGORY_WEIGHTS.color +
    CATEGORY_WEIGHTS.shoes +
    CATEGORY_WEIGHTS.grooming +
    CATEGORY_WEIGHTS.occasion;

  const overall_score = clamp(Math.round(weightedNumerator / weightSum));

  const focus_top_3 = (Object.keys(category_scores) as CategoryKey[])
    .map((key) => ({
      key,
      score: (100 - category_scores[key]) * CATEGORY_WEIGHTS[key],
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.key);

  let confidence_level: "low" | "medium" | "high" = "medium";

  if (answeredCount < Object.keys(QUESTION_CONFIG).length || uncertainCount >= 3) {
    confidence_level = "low";
  } else if (uncertainCount === 0) {
    confidence_level = "high";
  }

  return {
    overall_score,
    category_scores,
    focus_top_3,
    confidence_level,
  };
}

function averageOrFallback(values: number[], fallback = 50) {
  if (values.length === 0) {
    return fallback;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}
