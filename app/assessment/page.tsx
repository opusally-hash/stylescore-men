"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { calculateScore } from "../lib/scoring";

type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: "q1",
    category: "Fit",
    question: "Your build (pick what fits best):",
    options: ["Slim", "Average", "Athletic", "Stocky", "Plus", "Prefer not to say"],
  },
  {
    id: "q2",
    category: "Fit",
    question: "Your common fit challenges:",
    options: [
      "Broad shoulders",
      "Belly/tummy area",
      "Big thighs",
      "Short legs",
      "Long torso",
      "Clothes feel tight in chest/arms",
    ],
  },
  {
    id: "q3",
    category: "Fit",
    question: "When you wear shirts/tees, what happens most often?",
    options: [
      "Shoulder seams sit correctly",
      "Chest feels tight",
      "Shirt is too long/too short",
      "Collar/neck feels loose",
      "Sleeves feel too tight",
      "Not sure",
    ],
  },
  {
    id: "q4",
    category: "Fit",
    question: "Your pants usually fit like:",
    options: [
      "Clean at waist (no constant adjusting)",
      "Tight in thighs",
      "Baggy in seat",
      "Too long/dragging",
      "Too short/high water",
      "Not sure",
    ],
  },
  {
    id: "q5",
    category: "Wardrobe",
    question: "What do you own that you wear weekly?",
    options: [
      "Solid tees/polos",
      "Neutral chinos/jeans",
      "Casual button-downs",
      "A good jacket/overshirt",
      "Clean sneakers",
      "None of these",
    ],
  },
  {
    id: "q6",
    category: "Wardrobe",
    question: "Your go-to outfit pieces are mostly:",
    options: [
      "Neutral basics",
      "Logos/graphics",
      "Random mix",
      "Mostly athletic wear",
      "Work uniform only",
    ],
  },
  {
    id: "q7",
    category: "Wardrobe",
    question: "Your clothes are mostly:",
    options: [
      "Mix-and-match",
      "Only a few repeats",
      "Lots of items but hard to pair",
      "Mostly impulse buys",
      "Hand-me-downs/old",
    ],
  },
  {
    id: "q8",
    category: "Color",
    question: "Colors you wear most:",
    options: [
      "Black",
      "White",
      "Grey",
      "Navy",
      "Earth tones",
      "Bright colors",
      "Whatever is clean",
    ],
  },
  {
    id: "q9",
    category: "Color",
    question: "When you dress, what do you check?",
    options: [
      "Top + bottom match",
      "Shoe color matches outfit",
      "Belt matches shoes (when formal)",
      "Socks match vibe",
      "Nothing—I just wear",
    ],
  },
  {
    id: "q10",
    category: "Color",
    question: "Patterns you wear comfortably:",
    options: ["Solid only", "Simple stripes/checks", "Loud prints", "Mix multiple patterns", "Not sure"],
  },
  {
    id: "q11",
    category: "Shoes",
    question: "Shoes you wear most days:",
    options: ["Clean sneakers", "Running shoes", "Loafers", "Boots", "Dress shoes", "Slides/sandals"],
  },
  {
    id: "q12",
    category: "Shoes",
    question: "Your shoes are usually:",
    options: [
      "Clean and presentable",
      "Slightly dusty/scuffed",
      "Often dirty",
      "Falling apart",
      "I’m not sure",
    ],
  },
  {
    id: "q13",
    category: "Shoes",
    question: "For work or going out, you have:",
    options: ["1 solid nice pair", "2+ nice pairs", "Only casual shoes", "Only athletic shoes", "None"],
  },
  {
    id: "q14",
    category: "Grooming",
    question: "Hair routine:",
    options: [
      "Regular haircut schedule",
      "Style hair most days",
      "Beard trimmed/clean line",
      "Shave regularly",
      "No routine",
    ],
  },
  {
    id: "q15",
    category: "Grooming",
    question: "Skin routine:",
    options: ["Face wash", "Moisturizer", "Sunscreen", "Beard oil/balm", "None"],
  },
  {
    id: "q16",
    category: "Grooming",
    question: "Nails + hygiene basics:",
    options: ["Nails trimmed", "Clean shoes/socks", "Deodorant daily", "Breath care", "I ignore these"],
  },
  {
    id: "q17",
    category: "Fragrance",
    question: "Fragrance usage:",
    options: ["Daily (light)", "Only events", "Deodorant only", "I avoid fragrance", "Not sure what suits me"],
  },
  {
    id: "q18",
    category: "Fragrance",
    question: "Main issue with fragrance:",
    options: ["Too strong/headaches", "Doesn’t last", "Confusing choices", "Don’t want to spend", "No issue"],
  },
  {
    id: "q19",
    category: "Accessories",
    question: "Accessories you use:",
    options: ["Watch", "Belt that fits well", "Sunglasses", "Simple chain/ring", "Neat bag/backpack", "None"],
  },
  {
    id: "q20",
    category: "Occasion",
    question: "When you dress for an occasion, you usually:",
    options: [
      "Dress slightly better than average",
      "Same outfit everywhere",
      "Under-dress often",
      "Over-dress often",
      "I ask someone",
      "Not sure",
    ],
  },
];

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function buildPersonalizedRecommendations(
  answers: Record<string, string[]>,
  focusTop3: string[]
): Record<string, string[]> {
  const personalized: Record<string, string[]> = {};
  const has = (questionId: string, option: string) =>
    (answers[questionId] || []).includes(option);

  focusTop3.forEach((area) => {
    const tips: string[] = [];

    if (area === "shoes") {
      if (has("q12", "Often dirty")) {
        tips.push("Start by cleaning or replacing your most-used shoes.");
      }
      if (has("q12", "Falling apart")) {
        tips.push("Retire visibly worn-out pairs and replace them with one versatile everyday option.");
      }
      if (has("q13", "Only athletic shoes")) {
        tips.push("Add one non-athletic pair like clean white sneakers or loafers.");
      }
      if (has("q13", "None")) {
        tips.push("Get one solid 'nice' pair first for work, outings, or events.");
      }
      if (tips.length === 0) {
        tips.push("Add one clean white sneaker for versatile casual wear.");
        tips.push("Keep one nicer pair ready for outings or work.");
      }
    }

    if (area === "grooming") {
      if (has("q14", "No routine")) {
        tips.push("Create a simple grooming base: haircut schedule, beard cleanup, and daily hygiene.");
      }
      if (has("q15", "None")) {
        tips.push("Start with just 2 basics: face wash and moisturizer.");
      }
      if (has("q16", "I ignore these")) {
        tips.push("Fix hygiene basics first: nails, deodorant, breath care, and clean socks.");
      }
      if (tips.length === 0) {
        tips.push("Maintain a regular haircut schedule.");
        tips.push("Use basic moisturizer and sunscreen daily.");
      }
    }

    if (area === "fit") {
      if (has("q3", "Chest feels tight")) {
        tips.push("Try shirts with more room in the chest and shoulders instead of sizing down.");
      }
      if (has("q3", "Shirt is too long/too short")) {
        tips.push("Prioritize better shirt length so tops end cleanly around your mid-zip area.");
      }
      if (has("q4", "Too long/dragging")) {
        tips.push("Hem your pants or choose shorter inseams to avoid bunching.");
      }
      if (has("q4", "Tight in thighs")) {
        tips.push("Look for tapered pants with thigh room and some stretch.");
      }
      if (has("q2", "Short legs")) {
        tips.push("Use mid-rise pants and cleaner leg lines to improve proportion.");
      }
      if (tips.length === 0) {
        tips.push("Choose clothes that follow your body shape better.");
        tips.push("Avoid overly baggy or overly tight tops.");
      }
    }

    if (area === "wardrobe") {
      if (has("q5", "None of these")) {
        tips.push("Build your wardrobe foundation first: solid tees, neutral bottoms, and one jacket.");
      }
      if (has("q6", "Random mix")) {
        tips.push("Reduce randomness and build around neutral basics that work together.");
      }
      if (has("q7", "Lots of items but hard to pair")) {
        tips.push("Stop adding more pieces. Focus on mix-and-match basics instead.");
      }
      if (has("q7", "Mostly impulse buys")) {
        tips.push("Buy with a plan: each new item should work with at least 3 existing outfits.");
      }
      if (tips.length === 0) {
        tips.push("Add more neutral basics like navy, white, grey, and black.");
        tips.push("Own at least one solid jacket or overshirt.");
      }
    }

    if (area === "color") {
      if (has("q8", "Whatever is clean")) {
        tips.push("Start planning outfits instead of wearing whatever is available.");
      }
      if (has("q9", "Nothing—I just wear")) {
        tips.push("Before leaving, do one quick check: top, bottom, shoes.");
      }
      if (has("q10", "Mix multiple patterns")) {
        tips.push("Keep only one pattern per outfit until your coordination improves.");
      }
      if (has("q10", "Loud prints")) {
        tips.push("Balance loud pieces with plain neutrals.");
      }
      if (tips.length === 0) {
        tips.push("Stick to simpler color combinations.");
        tips.push("Use neutrals as the base of most outfits.");
      }
    }

    if (area === "occasion") {
      if (has("q20", "Same outfit everywhere")) {
        tips.push("Create separate go-to outfits for daily wear, work, and occasions.");
      }
      if (has("q20", "Under-dress often")) {
        tips.push("Upgrade one level for important settings: better shoes, better outer layer, cleaner fit.");
      }
      if (has("q20", "Over-dress often")) {
        tips.push("Simplify by matching the formality of the event more closely.");
      }
      if (tips.length === 0) {
        tips.push("Keep one polished outfit ready for important occasions.");
        tips.push("Dress slightly better than average for key events.");
      }
    }

    if (area === "fragrance") {
      if (has("q18", "Too strong/headaches")) {
        tips.push("Use lighter fragrances and fewer sprays.");
      }
      if (has("q18", "Confusing choices")) {
        tips.push("Start with one versatile fragrance instead of trying many.");
      }
      if (tips.length === 0) {
        tips.push("Use light fragrance only if it suits you.");
        tips.push("Avoid overspraying.");
      }
    }

    if (area === "accessories") {
      if (has("q19", "None")) {
        tips.push("Start with one useful accessory: a watch or a well-fitted belt.");
      }
      if (tips.length === 0) {
        tips.push("Keep accessories simple and clean.");
        tips.push("Choose items that match your wardrobe basics.");
      }
    }

    personalized[area] = tips.slice(0, 3);
  });

  return personalized;
}

function buildRecommendedNeeds(
  answers: Record<string, string[]>,
  focusTop3: string[]
): Record<string, string[]> {
  const needs: Record<string, string[]> = {};
  const has = (questionId: string, option: string) =>
    (answers[questionId] || []).includes(option);

  focusTop3.forEach((area) => {
    const items: string[] = [];

    if (area === "shoes") {
      if (has("q12", "Often dirty") || has("q12", "Falling apart")) {
        items.push("white minimalist sneakers");
      }
      if (has("q13", "Only athletic shoes") || has("q13", "None")) {
        items.push("one versatile going-out shoe");
      }
      if (items.length === 0) {
        items.push("clean white sneakers");
        items.push("brown loafers or smart casual shoes");
      }
    }

    if (area === "grooming") {
      if (has("q15", "None")) {
        items.push("basic face wash");
        items.push("daily moisturizer");
      }
      if (has("q14", "No routine")) {
        items.push("hair styling product");
      }
      if (has("q16", "I ignore these")) {
        items.push("deodorant");
        items.push("nail clipper or grooming kit");
      }
      if (items.length === 0) {
        items.push("basic skincare starter set");
        items.push("grooming essentials");
      }
    }

    if (area === "fit") {
      if (has("q4", "Tight in thighs")) {
        items.push("tapered stretch chinos");
      }
      if (has("q4", "Too long/dragging")) {
        items.push("better-length trousers or hemming");
      }
      if (has("q3", "Chest feels tight")) {
        items.push("better-fitting shirts with more chest room");
      }
      if (has("q2", "Short legs")) {
        items.push("mid-rise tapered pants");
      }
      if (items.length === 0) {
        items.push("well-fitted chinos");
        items.push("proper-length shirts");
      }
    }

    if (area === "wardrobe") {
      if (has("q5", "None of these")) {
        items.push("solid neutral t-shirts");
        items.push("neutral chinos or jeans");
        items.push("casual button-down shirt");
      }
      if (has("q6", "Random mix") || has("q7", "Mostly impulse buys")) {
        items.push("mix-and-match wardrobe basics");
      }
      if (items.length === 0) {
        items.push("neutral basics");
        items.push("structured overshirt or jacket");
      }
    }

    if (area === "color") {
      if (has("q8", "Whatever is clean") || has("q9", "Nothing—I just wear")) {
        items.push("neutral wardrobe basics");
      }
      if (has("q10", "Loud prints") || has("q10", "Mix multiple patterns")) {
        items.push("solid color shirts");
      }
      if (items.length === 0) {
        items.push("navy, white, grey, and black basics");
      }
    }

    if (area === "occasion") {
      if (has("q20", "Under-dress often")) {
        items.push("one polished occasion outfit");
        items.push("smart casual shoes");
      }
      if (has("q20", "Same outfit everywhere")) {
        items.push("separate work and occasion outfit options");
      }
      if (items.length === 0) {
        items.push("one polished outfit for key occasions");
      }
    }

    needs[area] = Array.from(new Set(items)).slice(0, 4);
  });

  return needs;
}

function glassCard(extra = "") {
  return `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${extra}`;
}

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [resultsUnlocked, setResultsUnlocked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("stylescore_onboarding");
    if (saved) {
      setOnboardingData(JSON.parse(saved));
    }

    const savedAnswers = localStorage.getItem("stylescore_answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    const savedEmail = localStorage.getItem("stylescore_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setResultsUnlocked(true);
    }
  }, []);

  const currentQuestion = questions[currentIndex];
  const selectedAnswers = answers[currentQuestion.id] || [];

  const progress = useMemo(() => {
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex]);

  function toggleOption(questionId: string, option: string) {
    setAnswers((prev) => {
      const existing = prev[questionId] || [];
      const alreadySelected = existing.includes(option);

      const updated = {
        ...prev,
        [questionId]: alreadySelected
          ? existing.filter((item: string) => item !== option)
          : [...existing, option],
      };

      localStorage.setItem("stylescore_answers", JSON.stringify(updated));
      return updated;
    });
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  }

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function unlockResults() {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("stylescore_email", email);
    setEmailError("");
    setResultsUnlocked(true);
  }

  async function shareScore() {
    const text = "I just checked my StyleScore. Try yours.";
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "StyleScore for Men",
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied. Share your style score.");
        setTimeout(() => setShareMessage(""), 2500);
      }
    } catch {
      // user cancelled share; ignore
    }
  }

  const result = calculateScore(
    onboardingData || {
      workStyle: "",
      budget: "",
      stylePreference: "",
      build: "",
      fitChallenges: [],
      goals: [],
      constraints: [],
    },
    answers
  );

  const categoryLabels: Record<string, string> = {
    fit: "Fit & Proportion",
    wardrobe: "Wardrobe Foundations",
    color: "Color Coordination",
    shoes: "Shoes & Footwear",
    grooming: "Grooming",
    occasion: "Occasion Styling",
  };

  if (showResult) {
    const strongestArea = Object.entries(result.category_scores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const radarData = Object.entries(result.category_scores).map(([key, value]) => ({
      category: categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1),
      score: value,
    }));

    const personalizedRecommendations = buildPersonalizedRecommendations(
      answers,
      result.focus_top_3
    );

    const recommendedNeeds = buildRecommendedNeeds(
      answers,
      result.focus_top_3
    );

    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
          <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
              Personal Style Intelligence
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your style, measured with clarity.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/70">
              See where your style is strongest, where it needs work, and what to
              upgrade first.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-white backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Overall Fashion Score
            </p>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-6xl font-bold tracking-tight sm:text-7xl">
                  {result.overall_score}
                  <span className="ml-1 text-2xl font-medium text-white/45 sm:text-3xl">
                    /100
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-lg text-white/70">
                  {result.overall_score >= 80
                    ? "Strong style foundation"
                    : result.overall_score >= 65
                    ? "Good base, clear upgrade path"
                    : result.overall_score >= 50
                    ? "Average right now, with big improvement potential"
                    : "Early stage style foundation"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Confidence
                </p>
                <p className="mt-1 text-lg font-semibold capitalize text-white">
                  {result.confidence_level}
                </p>
              </div>
            </div>
          </div>

          <div className={glassCard("p-6")}>
            <h3 className="text-xl font-semibold text-white">Style Diagnosis</h3>
            <p className="mt-3 leading-7 text-white/75">
              {strongestArea === "occasion" ? (
                <>
                  Your styling is best during{" "}
                  <span className="font-semibold text-white">occasions</span>. Your
                  biggest opportunity right now is{" "}
                  <span className="font-semibold text-white">
                    {categoryLabels[result.focus_top_3[0]] || result.focus_top_3[0]}
                  </span>
                  . Fixing your top 3 focus areas first will improve your score
                  faster than trying to upgrade everything at once.
                </>
              ) : (
                <>
                  Your strongest area is{" "}
                  <span className="font-semibold text-white">
                    {categoryLabels[strongestArea] || strongestArea}
                  </span>
                  . Your biggest opportunity right now is{" "}
                  <span className="font-semibold text-white">
                    {categoryLabels[result.focus_top_3[0]] || result.focus_top_3[0]}
                  </span>
                  . Fixing your top 3 focus areas first will improve your score
                  faster than trying to upgrade everything at once.
                </>
              )}
            </p>
          </div>

          {!resultsUnlocked && (
            <div className={glassCard("p-6")}>
              <h3 className="text-xl font-semibold text-white">
                Unlock Your Full Style Plan
              </h3>
              <p className="mt-2 text-white/70">
                Enter your email to unlock your full diagnosis, style profile,
                focus areas, and personalized upgrade recommendations.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-white/30"
                />

                {emailError && (
                  <p className="text-sm text-red-300">{emailError}</p>
                )}

                <button
                  type="button"
                  onClick={unlockResults}
                  className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
                >
                  Unlock Full Results
                </button>

                <p className="text-sm text-white/45">
                  No spam. We only send useful style insights and updates.
                </p>
              </div>
            </div>
          )}

          {resultsUnlocked && (
            <>
              <div className={glassCard("p-6")}>
                <h3 className="text-xl font-semibold text-white">Style Profile</h3>
                <p className="mt-2 text-sm text-white/60">
                  This chart shows how your score is distributed across key style
                  categories.
                </p>

                <div className="mt-6 h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.12)" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: "rgba(255,255,255,0.75)", fontSize: 13 }}
                      />
                      <Radar
                        dataKey="score"
                        stroke="#ffffff"
                        fill="#ffffff"
                        fillOpacity={0.18}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={glassCard("p-6")}>
                <h3 className="text-xl font-semibold text-white">Category Scores</h3>
                <div className="mt-5 space-y-5">
                  {Object.entries(result.category_scores).map(
                    ([key, value]: [string, number]) => (
                      <div key={key}>
                        <div className="mb-2 flex justify-between">
                          <span className="font-medium text-white/85">
                            {categoryLabels[key] || key}
                          </span>
                          <span className="font-semibold text-white">{value}</span>
                        </div>

                        <div className="h-3 w-full rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-white"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className={glassCard("p-6")}>
                <h3 className="text-xl font-semibold text-white">Focus Top 3</h3>
                <ul className="mt-4 space-y-3">
                  {result.focus_top_3.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 font-medium text-white/90"
                    >
                      {categoryLabels[item] || item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={glassCard("p-6")}>
                <h3 className="text-xl font-semibold text-white">
                  Recommended Improvements
                </h3>

                <div className="mt-4 space-y-4">
                  {result.focus_top_3.map((area) => (
                    <div
                      key={area}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h4 className="text-lg font-semibold text-white">
                        {categoryLabels[area] || area}
                      </h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-white/75">
                        {personalizedRecommendations[area]?.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className={glassCard("p-6")}>
                <h3 className="text-xl font-semibold text-white">Recommended Needs</h3>
                <p className="mt-2 text-sm text-white/60">
                  Suggested starter search terms based on your current priorities.
                </p>

                <div className="mt-4 space-y-4">
                  {result.focus_top_3.map((area) => (
                    <div
                      key={area}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h4 className="text-lg font-semibold text-white">
                        {categoryLabels[area] || area}
                      </h4>

                      <ul className="mt-4 space-y-3 text-white/80">
                        {recommendedNeeds[area]?.map((item, i) => (
                          <li
                            key={i}
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                          >
                            <span className="capitalize text-white">{item}</span>

                            <div className="flex flex-col gap-3 sm:flex-row">
                              <a
                                href={`https://www.amazon.com/s?k=${encodeURIComponent(
                                  item + " men"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                              >
                                Search Amazon
                              </a>

                              <a
                                href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(
                                  item + " men"
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                              >
                                Search Google Shopping
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={shareScore}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Share Your Score
                </button>

                {shareMessage && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
                    {shareMessage}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={() => {
              setShowResult(false);
              setCurrentIndex(0);
              setAnswers({});
              localStorage.removeItem("stylescore_answers");
            }}
            className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
          >
            Retake Assessment
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            Personal Style Intelligence
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Build a sharper version of your style.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Answer a few quick questions and get a style score, diagnosis,
            priorities, and upgrade path.
          </p>
        </div>

        <div className={glassCard("p-6")}>
          <p className="mb-2 text-sm font-medium text-white/55">
            {currentQuestion.category}
          </p>
          <h2 className="text-2xl font-semibold text-white">
            {currentQuestion.question}
          </h2>

          <div className="mt-4 h-2.5 w-full rounded-full bg-white/10">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-white/55">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option) => {
              const active = selectedAnswers.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleOption(currentQuestion.id, option)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? "border-white bg-white text-black shadow-lg"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={currentIndex === 0}
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={nextQuestion}
              className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
            >
              {currentIndex === questions.length - 1 ? "See Result" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}