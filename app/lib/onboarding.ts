export type OnboardingForm = {
  ageRange: string;
  climate: string;
  workStyle: string;
  budget: string;
  stylePreference: string;
  build: string;
  goals: string[];
  constraints: string[];
  fitChallenges: string[];
};

export const multiSelectFields = {
  goals: [
    "Promotion",
    "Dating",
    "Confidence",
    "Minimalist",
    "Better everyday style",
  ],
  constraints: [
    "No leather",
    "Traditional/cultural wear",
    "Low maintenance only",
    "Budget-sensitive",
  ],
  fitChallenges: [
    "Broad shoulders",
    "Belly/tummy area",
    "Big thighs",
    "Short legs",
    "Long torso",
    "Clothes feel tight in chest/arms",
  ],
} as const;

export const selectFieldOptions = {
  ageRange: ["18-24", "25-34", "35-44", "45-54", "55+"],
  climate: [
    "Hot/Humid",
    "Warm",
    "Mixed",
    "Cold",
    "Mostly indoor/controlled",
  ],
  workStyle: [
    "Corporate",
    "Ops/Warehouse",
    "Sales/Client-facing",
    "Student",
    "Remote/Casual",
  ],
  budget: ["Low", "Medium", "High"],
  stylePreference: [
    "Classic",
    "Smart casual",
    "Streetwear",
    "Athleisure",
    "Minimalist",
  ],
  build: [
    "Slim",
    "Average",
    "Athletic",
    "Stocky",
    "Plus",
    "Prefer not to say",
  ],
} as const;

export const defaultOnboardingForm: OnboardingForm = {
  ageRange: "25-34",
  climate: "Mixed",
  workStyle: "Remote/Casual",
  budget: "Medium",
  stylePreference: "Smart casual",
  build: "Average",
  goals: [],
  constraints: [],
  fitChallenges: [],
};

export function mergeOnboardingData(
  data?: Partial<OnboardingForm> | null
): OnboardingForm {
  return {
    ageRange: data?.ageRange || defaultOnboardingForm.ageRange,
    climate: data?.climate || defaultOnboardingForm.climate,
    workStyle: data?.workStyle || defaultOnboardingForm.workStyle,
    budget: data?.budget || defaultOnboardingForm.budget,
    stylePreference:
      data?.stylePreference || defaultOnboardingForm.stylePreference,
    build: data?.build || defaultOnboardingForm.build,
    goals: data?.goals ?? defaultOnboardingForm.goals,
    constraints: data?.constraints ?? defaultOnboardingForm.constraints,
    fitChallenges: data?.fitChallenges ?? defaultOnboardingForm.fitChallenges,
  };
}

function sameStringArray(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function hasCustomizedOnboardingData(
  data?: Partial<OnboardingForm> | null
) {
  if (!data) return false;

  const merged = mergeOnboardingData(data);

  return (
    merged.ageRange !== defaultOnboardingForm.ageRange ||
    merged.climate !== defaultOnboardingForm.climate ||
    merged.workStyle !== defaultOnboardingForm.workStyle ||
    merged.budget !== defaultOnboardingForm.budget ||
    merged.stylePreference !== defaultOnboardingForm.stylePreference ||
    merged.build !== defaultOnboardingForm.build ||
    !sameStringArray(merged.goals, defaultOnboardingForm.goals) ||
    !sameStringArray(merged.constraints, defaultOnboardingForm.constraints) ||
    !sameStringArray(
      merged.fitChallenges,
      defaultOnboardingForm.fitChallenges
    )
  );
}
