export type CategoryScores = {
  fit: number;
  wardrobe: number;
  color: number;
  shoes: number;
  grooming: number;
  occasion: number;
};

export type ClientProfile = {
  firstName?: string;
  score: number;
  archetype: string;
  confidence: "low" | "medium" | "high";
  categoryScores: CategoryScores;
  strongest: { name: string; score: number };
  weakest: Array<{ name: string; score: number }>;
  goal: string;
  climate: string;
  workStyle: string;
  budget: string;
  stylePreference: string;
  build: string;
  fitChallenges: string[];
  answers?: Record<string, string[]>;
};
