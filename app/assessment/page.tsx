"use client";
import { downloadAIReportPDF } from "../lib/pdf";
import { useEffect, useMemo, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Radar as RechartsRadar,
} from "recharts";
import { calculateScore } from "../lib/scoring";

type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
};

type AIReport = {
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
};

function GeneratingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-orange-400" />
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
          AI stylist at work
        </p>

        <h3 className="mt-3 text-2xl font-semibold text-white">
          Generating your personalized report...
        </h3>

        <p className="mt-3 leading-7 text-white/65">{message}</p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-orange-400" />
        </div>

        <p className="mt-4 text-sm text-white/45">
          Usually takes around 5–10 seconds.
        </p>
      </div>
    </div>
  );
}

const questions: Question[] = [
  {
    id: "q1",
    category: "Fit & Proportion",
    question: "I usually buy tops that…",
    options: [
      "fit me well in the shoulders and chest",
      "fit okay but are a little loose",
      "often feel tight in one area",
      "are mostly chosen for comfort, not fit",
      "I’m not really sure",
    ],
  },
  {
    id: "q2",
    category: "Fit & Proportion",
    question: "When I wear pants, they usually…",
    options: [
      "sit cleanly and look intentional",
      "are a bit long or bunch at the bottom",
      "feel tight in the thigh or seat",
      "feel loose and shapeless",
      "I don’t pay much attention",
    ],
  },
  {
    id: "q3",
    category: "Fit & Proportion",
    question: "My clothes usually make me feel…",
    options: [
      "sharp and put together",
      "decent, but not polished",
      "comfortable more than stylish",
      "slightly awkward in fit",
      "I’m not really sure",
    ],
  },
  {
    id: "q4",
    category: "Fit & Proportion",
    question: "When I try clothes on, I usually…",
    options: [
      "care a lot about proportion and fit",
      "check only whether they feel comfortable",
      "buy if they look okay quickly",
      "struggle to know what flatters me",
      "rarely try before buying",
    ],
  },
  {
    id: "q5",
    category: "Wardrobe Foundations",
    question: "My wardrobe is mostly made up of…",
    options: [
      "versatile basics that work together",
      "a mix of random items",
      "older clothes I still use",
      "mostly athletic or lounge wear",
      "whatever I happened to buy",
    ],
  },
  {
    id: "q6",
    category: "Wardrobe Foundations",
    question: "I usually wear the same few outfits because…",
    options: [
      "they work well and I like them",
      "I don’t have many good alternatives",
      "most of my wardrobe is hard to combine",
      "I don’t enjoy planning outfits",
      "that’s just easier",
    ],
  },
  {
    id: "q7",
    category: "Wardrobe Foundations",
    question: "When I buy clothes, I usually choose…",
    options: [
      "pieces that work with what I already own",
      "whatever catches my eye",
      "whatever is on sale",
      "whatever feels comfortable",
      "I don’t think much about it",
    ],
  },
  {
    id: "q8",
    category: "Color Coordination",
    question: "I usually wear colors that are…",
    options: [
      "neutral and easy to combine",
      "mostly safe but repetitive",
      "mixed without much planning",
      "often bold or loud",
      "just whatever is available",
    ],
  },
  {
    id: "q9",
    category: "Color Coordination",
    question: "Before going out, I usually check whether…",
    options: [
      "the whole outfit feels coordinated",
      "the shoes work with the outfit",
      "at least the clothes are clean",
      "I don’t really check",
      "I ask someone else",
    ],
  },
  {
    id: "q10",
    category: "Color Coordination",
    question: "My outfits usually look…",
    options: [
      "balanced and intentional",
      "simple but fine",
      "inconsistent from piece to piece",
      "too plain or too random",
      "I’m not sure",
    ],
  },
  {
    id: "q11",
    category: "Shoes & Footwear",
    question: "I usually wear…",
    options: [
      "clean casual shoes that suit most outfits",
      "running shoes for almost everything",
      "loafers/boots when needed and sneakers otherwise",
      "old shoes longer than I should",
      "whatever is nearest",
    ],
  },
  {
    id: "q12",
    category: "Shoes & Footwear",
    question: "My shoes are usually…",
    options: [
      "clean and presentable",
      "acceptable but a little worn",
      "visibly dirty or aging",
      "mostly functional, not stylish",
      "not something I focus on",
    ],
  },
  {
    id: "q13",
    category: "Shoes & Footwear",
    question: "For going out or dressing better, I have…",
    options: [
      "at least one strong shoe option",
      "something okay but not great",
      "only athletic or casual options",
      "no real dress-up option",
      "I haven’t thought about it",
    ],
  },
  {
    id: "q14",
    category: "Grooming",
    question: "My grooming routine is…",
    options: [
      "regular and intentional",
      "basic but consistent",
      "inconsistent",
      "minimal unless needed",
      "almost nonexistent",
    ],
  },
  {
    id: "q15",
    category: "Grooming",
    question: "My hair and facial grooming usually look…",
    options: [
      "clean and well-maintained",
      "okay but not sharp",
      "uneven or overdue",
      "mostly ignored",
      "I’m not sure",
    ],
  },
  {
    id: "q16",
    category: "Grooming",
    question: "My daily presentation habits are…",
    options: [
      "solid and consistent",
      "decent but basic",
      "inconsistent",
      "reactive, not planned",
      "not something I prioritize",
    ],
  },
  {
    id: "q17",
    category: "Occasion Styling",
    question: "For important occasions, I usually…",
    options: [
      "dress a level above average",
      "dress appropriately, not memorably",
      "wear some version of what I always wear",
      "underdress more than I should",
      "feel unsure what to wear",
    ],
  },
  {
    id: "q18",
    category: "Occasion Styling",
    question: "At work or in social settings, my style usually feels…",
    options: [
      "polished and appropriate",
      "good enough",
      "too casual",
      "inconsistent",
      "not really intentional",
    ],
  },
  {
    id: "q19",
    category: "Occasion Styling",
    question: "When I want to look impressive, I rely on…",
    options: [
      "a few well-built outfits that work",
      "one decent fallback outfit",
      "trial and error",
      "the same outfit every time",
      "luck",
    ],
  },
  {
    id: "q20",
    category: "Overall Self-View",
    question: "Overall, my style today feels like…",
    options: [
      "a real strength",
      "decent with room to improve",
      "average and forgettable",
      "underdeveloped",
      "something I want help with",
    ],
  },
];

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function glassCard(extra = "") {
  return `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${extra}`;
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
      if (has("q12", "visibly dirty or aging")) {
        tips.push("Start by cleaning or replacing the pair you use most often.");
      }
      if (has("q11", "old shoes longer than I should")) {
        tips.push("Rotate out worn shoes faster — old footwear quietly lowers the whole outfit.");
      }
      if (has("q13", "only athletic or casual options")) {
        tips.push("Add one non-athletic option like clean minimal sneakers, loafers, or smart-casual shoes.");
      }
      if (has("q13", "no real dress-up option")) {
        tips.push("Get one reliable dress-better shoe before buying more casual pairs.");
      }
      if (tips.length === 0) {
        tips.push("Upgrade to one clean, versatile shoe that works across multiple outfits.");
        tips.push("Make shoe upkeep a regular part of your weekly presentation routine.");
      }
    }

    if (area === "grooming") {
      if (has("q14", "almost nonexistent")) {
        tips.push("Build a minimal grooming baseline: haircut rhythm, beard cleanup, deodorant, and daily hygiene.");
      }
      if (has("q15", "uneven or overdue")) {
        tips.push("Small maintenance matters here — sharper grooming creates an immediate lift.");
      }
      if (
        has("q16", "reactive, not planned") ||
        has("q16", "not something I prioritize")
      ) {
        tips.push("Make presentation automatic instead of last-minute. Simple systems work better than motivation.");
      }
      if (tips.length === 0) {
        tips.push("Create a grooming routine that is consistent enough to become effortless.");
        tips.push("The goal is not complexity — it is reliable sharpness.");
      }
    }

    if (area === "fit") {
      if (has("q1", "often feel tight in one area")) {
        tips.push("Prioritize fit corrections before new style purchases — poor fit ruins the whole look.");
      }
      if (has("q2", "are a bit long or bunch at the bottom")) {
        tips.push("Fix trouser length first — better hems create instant visual polish.");
      }
      if (has("q2", "feel loose and shapeless")) {
        tips.push("Move away from shapeless silhouettes and toward cleaner lines.");
      }
      if (has("q4", "struggle to know what flatters me")) {
        tips.push("Use fit as your first filter: shoulders, waist line, trouser break, and length.");
      }
      if (tips.length === 0) {
        tips.push("Sharper proportions will improve your style faster than buying trendier pieces.");
        tips.push("Better fit usually makes even simple clothing look more expensive.");
      }
    }

    if (area === "wardrobe") {
      if (
        has("q5", "a mix of random items") ||
        has("q5", "whatever I happened to buy")
      ) {
        tips.push("You need more coherence, not more pieces. Build around versatile basics first.");
      }
      if (has("q6", "most of my wardrobe is hard to combine")) {
        tips.push("Stop thinking item by item. Build outfits that can share the same core pieces.");
      }
      if (
        has("q7", "whatever catches my eye") ||
        has("q7", "whatever is on sale")
      ) {
        tips.push("Buy fewer, better-aligned pieces that fit your actual style direction.");
      }
      if (tips.length === 0) {
        tips.push("A stronger wardrobe comes from repeatable combinations, not volume.");
        tips.push("Your wardrobe should feel easier to use, not just bigger.");
      }
    }

    if (area === "color") {
      if (
        has("q8", "mixed without much planning") ||
        has("q8", "just whatever is available")
      ) {
        tips.push("Move toward a more intentional base palette — neutrals make everything easier.");
      }
      if (has("q9", "I don’t really check")) {
        tips.push("A 10-second coordination check before leaving will improve consistency immediately.");
      }
      if (
        has("q10", "inconsistent from piece to piece") ||
        has("q10", "too plain or too random")
      ) {
        tips.push("You do not need louder outfits — you need cleaner, more deliberate coordination.");
      }
      if (tips.length === 0) {
        tips.push("Color works best when it feels controlled rather than accidental.");
        tips.push("Start by making your base colors more repeatable across outfits.");
      }
    }

    if (area === "occasion") {
      if (has("q17", "wear some version of what I always wear")) {
        tips.push("Occasion dressing improves when you have a separate elevated lane, not just a casual default.");
      }
      if (has("q17", "underdress more than I should")) {
        tips.push("Upgrade one level more than your current instinct for important settings.");
      }
      if (has("q19", "trial and error") || has("q19", "luck")) {
        tips.push("Build 1–2 reliable occasion outfits so you are not improvising when it matters.");
      }
      if (tips.length === 0) {
        tips.push("Your occasion style improves fastest when you pre-build go-to looks instead of reacting in the moment.");
        tips.push("Occasion dressing is more about preparation than owning more clothes.");
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
      if (has("q12", "visibly dirty or aging")) items.push("clean white minimalist sneakers");
      if (has("q13", "only athletic or casual options")) items.push("one versatile smart-casual shoe");
      if (has("q13", "no real dress-up option")) items.push("one polished dress-better shoe");
      if (items.length === 0) {
        items.push("clean everyday sneakers");
        items.push("one versatile going-out shoe");
      }
    }

    if (area === "grooming") {
      if (has("q14", "almost nonexistent")) items.push("basic grooming starter set");
      if (has("q15", "uneven or overdue")) items.push("hair or beard maintenance tool");
      if (has("q16", "not something I prioritize")) items.push("simple daily grooming essentials");
      if (items.length === 0) {
        items.push("minimal skincare routine");
        items.push("reliable grooming essentials");
      }
    }

    if (area === "fit") {
      if (has("q2", "are a bit long or bunch at the bottom")) items.push("better-length trousers or hemming");
      if (has("q2", "feel tight in the thigh or seat")) items.push("tapered stretch trousers");
      if (has("q1", "often feel tight in one area")) items.push("better-fitting shirts with more room where needed");
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
      if (has("q6", "most of my wardrobe is hard to combine")) {
        items.push("mix-and-match core pieces");
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
      if (has("q10", "too plain or too random")) {
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
      if (has("q19", "trial and error") || has("q19", "luck")) {
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

function getStyleArchetype(
  overallScore: number,
  categoryScores: Record<string, number>
) {
  const sortedHighToLow = Object.entries(categoryScores).sort(
    (a, b) => b[1] - a[1]
  );

  const strongest = sortedHighToLow[0][0];
  const weakest = sortedHighToLow[sortedHighToLow.length - 1][0];

  if (overallScore >= 80) {
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

  if (overallScore >= 65) {
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

  if (overallScore >= 50) {
    return {
      title: "The Untapped Potential",
      description:
        "Your style has real potential, but a few weak categories are holding back the full picture. The right fixes will create visible gains quickly.",
    };
  }

  if (weakest === "grooming" || weakest === "shoes") {
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

function getArchetypeStyleSuggestions(archetypeTitle: string): string[] {
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

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [resultsUnlocked, setResultsUnlocked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [paidSessionId, setPaidSessionId] = useState<string | null>(null);
  const [postPaymentMessage, setPostPaymentMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("stylescore_onboarding");
    if (saved) setOnboardingData(JSON.parse(saved));

    const savedAnswers = localStorage.getItem("stylescore_answers");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

    const savedEmail = localStorage.getItem("stylescore_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setResultsUnlocked(true);
    }

    const params = new URLSearchParams(window.location.search);
    const stripeStatus = params.get("stripe_status");
    const sessionId = params.get("session_id");

    if (stripeStatus === "success" && sessionId) {
      setShowResult(true);
      setPaidSessionId(sessionId);
    }

    if (stripeStatus || sessionId) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const result = calculateScore(
    onboardingData || {
      ageRange: "",
      climate: "",
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

  useEffect(() => {
    async function finalizePaidReport() {
      if (!paidSessionId || !showResult) return;

      try {
        setPostPaymentMessage(
          "Payment successful. We’re building your 30-day style blueprint now."
        );
        setAiError("");

        const verifyRes = await fetch(
          `/api/verify-checkout-session?session_id=${encodeURIComponent(
            paidSessionId
          )}`
        );
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.paid) {
          setAiError("Payment could not be verified.");
          setPostPaymentMessage("");
          return;
        }

        const archetype = getStyleArchetype(
          result.overall_score,
          result.category_scores
        );

        setLoadingReport(true);

        const response = await fetch("/api/style-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: result.overall_score,
            archetype: archetype.title,
            focusAreas: result.focus_top_3,
            categoryScores: result.category_scores,
            onboardingData,
            answers,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setAiError(data.error || "Failed to generate style report.");
          setPostPaymentMessage("");
          return;
        }

        setAiReport(data.report);

        setTimeout(() => {
          setShowAiModal(true);
          setPostPaymentMessage("");
        }, 1200);

        setPaidSessionId(null);
      } catch {
        setAiError("Failed to verify payment or generate report.");
        setPostPaymentMessage("");
      } finally {
        setLoadingReport(false);
      }
    }

    finalizePaidReport();
  }, [paidSessionId, showResult, onboardingData, answers, result]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswers = answers[currentQuestion.id] || [];
  const canProceed = selectedAnswers.length > 0;

  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / questions.length) * 100),
    [currentIndex]
  );

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
    if (!canProceed) return;
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

  const categoryLabels: Record<string, string> = {
    fit: "Fit & Proportion",
    wardrobe: "Wardrobe Foundations",
    color: "Color Coordination",
    shoes: "Shoes & Footwear",
    grooming: "Grooming",
    occasion: "Occasion Styling",
  };

  async function unlockResults() {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      const archetype = getStyleArchetype(
        result.overall_score,
        result.category_scores
      );

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          score: result.overall_score,
          archetype: archetype.title,
          focus_top_3: result.focus_top_3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.error || "Could not save your email. Please try again.");
        return;
      }

      localStorage.setItem("stylescore_email", email);
      setEmailError("");
      setResultsUnlocked(true);
    } catch {
      setEmailError("Could not save your email. Please try again.");
    }
  }

  async function startPremiumCheckout() {
    try {
      if (!resultsUnlocked) {
        setAiError("Unlock your full report first.");
        return;
      }

      setLoadingCheckout(true);
      setAiError("");

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setAiError(data.error || "Failed to start checkout.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setAiError("Failed to start checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function shareScore() {
    const archetype = getStyleArchetype(
      result.overall_score,
      result.category_scores
    );

    const text = `My StyleScore is ${result.overall_score}/100 — ${archetype.title}. Can you beat it? Take yours on https://stylescore.live`;
    const url = "https://stylescore.live";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "StyleScore for Men",
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareMessage("Copied. Share your score.");
        setTimeout(() => setShareMessage(""), 2500);
      }
    } catch {
      // ignore
    }
  }

  if (showResult) {
    const strongestArea = Object.entries(result.category_scores).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    const radarData = Object.entries(result.category_scores).map(
      ([key, value]) => ({
        category:
          categoryLabels[key] || key.charAt(0).toUpperCase() + key.slice(1),
        score: value,
      })
    );

    const personalizedRecommendations = buildPersonalizedRecommendations(
      answers,
      result.focus_top_3
    );

    const recommendedNeeds = buildRecommendedNeeds(
      answers,
      result.focus_top_3
    );

    const archetype = getStyleArchetype(
      result.overall_score,
      result.category_scores
    );

    const archetypeSuggestions = getArchetypeStyleSuggestions(archetype.title);

    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
          <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        {postPaymentMessage && <GeneratingOverlay message={postPaymentMessage} />}

        <div className="relative mx-auto max-w-4xl space-y-6">
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
                  <span className="font-semibold text-white">occasions</span>.
                  Your biggest opportunity right now is{" "}
                  <span className="font-semibold text-white">
                    {categoryLabels[result.focus_top_3[0]] ||
                      result.focus_top_3[0]}
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
                    {categoryLabels[result.focus_top_3[0]] ||
                      result.focus_top_3[0]}
                  </span>
                  . Fixing your top 3 focus areas first will improve your score
                  faster than trying to upgrade everything at once.
                </>
              )}
            </p>
          </div>

          {!resultsUnlocked && (
            <div className={glassCard("p-6")}>
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-white">
                  🔒 Your Style Report Is Ready
                </h3>

                <p className="mt-3 text-white/70">
                  Your answers are saved for this session. Unlock your complete
                  style report before leaving this page.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                  Unlock to see
                </p>

                <ul className="mt-4 space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span>Your full StyleScore category breakdown</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span>Your personal style archetype</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span>The top 3 upgrades that will improve your appearance fastest</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                    <span>Personalized recommendations and starter product searches</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-orange-300"
                />

                {emailError && (
                  <p className="text-sm text-red-300">{emailError}</p>
                )}

                <button
                  type="button"
                  onClick={unlockResults}
                  className="premium-glow w-full rounded-2xl bg-orange-400 px-6 py-4 text-base font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_30px_rgba(251,146,60,0.45)]"
                >
                  Unlock My Full Style Report
                </button>

                <p className="text-center text-sm text-white/45">
                  Free report • No spam • Takes 2 seconds
                </p>
              </div>
            </div>
          )}

          {!resultsUnlocked && (
            <div className="py-2 text-center text-white/70">
              🔒 Unlock your full Style Report to see:
              <div className="mt-2 text-sm text-white/55">
                • Category breakdown • Style archetype • Personalized
                recommendations
              </div>
            </div>
          )}

          <div
            className={
              !resultsUnlocked
                ? "space-y-6 blur-md opacity-60 pointer-events-none"
                : "space-y-6"
            }
          >
            <div className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Your Style Archetype
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                {archetype.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-white/70">
                {archetype.description}
              </p>
            </div>

            <div className={glassCard("p-6")}>
              <h3 className="text-xl font-semibold text-white">
                Archetype Style Direction
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-white/75">
                {archetypeSuggestions.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

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
                    <RechartsRadar
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
              <h3 className="text-xl font-semibold text-white">
                Category Scores
              </h3>
              <div className="mt-5 space-y-5">
                {Object.entries(result.category_scores).map(([key, value]) => (
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
                ))}
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
              <h3 className="text-xl font-semibold text-white">
                Recommended Needs
              </h3>
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
          </div>

          {resultsUnlocked && (
            <div className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                AI Personal Stylist Report
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Upgrade Your Style in 30 Days
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/70">
                Get a detailed AI-powered style blueprint built from your quiz
                answers, body type, work environment, budget, and lifestyle.
              </p>

              <ul className="mt-5 space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Your style strengths and blind spots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>The 3 fastest upgrades for your appearance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Exactly what clothes you should buy next</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Best places to shop for your budget</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>A practical 30-day style upgrade roadmap</span>
                </li>
              </ul>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={startPremiumCheckout}
                  className="premium-glow w-full rounded-2xl bg-orange-400 px-6 py-4 text-base font-semibold text-black transition hover:bg-orange-300 shadow-[0_0_30px_rgba(251,146,60,0.45)]"
                >
                  {loadingCheckout
                    ? "Redirecting to secure checkout..."
                    : "Get My 30-Day Style Upgrade Plan — $1"}
                </button>

                <p className="mt-3 text-center text-sm text-white/45">
                  Normally $9.49 • Instant report • One-time payment • No subscription
                </p>

                {aiError && (
                  <p className="mt-3 text-sm text-red-300">{aiError}</p>
                )}
              </div>
            </div>
          )}

          {showAiModal && aiReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
                      Premium AI Report
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">
                      {aiReport.title || "Your 30-Day Style Upgrade Plan"}
                    </h2>
                    <p className="mt-2 max-w-2xl leading-7 text-white/65">
                      {aiReport.subtitle}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                   aiReport &&
                 downloadAIReportPDF({
                  aiReport,
                  result,
                categoryLabels,
               getStyleArchetype,
                  })
                  }
                      className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => setShowAiModal(false)}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-3xl border border-blue-400/30 bg-blue-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      🧭 Style Snapshot
                    </h3>
                    <p className="mt-3 leading-8 text-white/80">
                      {aiReport.snapshot}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-green-400/30 bg-green-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      ✅ What You Already Do Well
                    </h3>
                    <ul className="mt-3 space-y-3 text-white/80">
                      {aiReport.strengths?.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-orange-400/30 bg-orange-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      ⚠ What Is Holding You Back
                    </h3>
                    <ul className="mt-3 space-y-3 text-white/80">
                      {aiReport.opportunities?.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      🎯 Your Top 3 Priorities
                    </h3>
                    <ul className="mt-3 space-y-3 text-white/80">
                      {aiReport.topPriorities?.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-purple-400/30 bg-purple-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      🛍 What To Buy Next
                    </h3>
                    <ul className="mt-3 space-y-3 text-white/80">
                      {aiReport.buyNext?.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-teal-400/30 bg-teal-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      🏬 Best Places To Shop
                    </h3>

                    <div className="mt-4 space-y-4">
                      {aiReport.bestPlacesToShop?.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/10 bg-black/10 p-4"
                        >
                          <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                            {item.challenge}
                          </p>
                          <h4 className="mt-2 text-lg font-semibold text-white">
                            Shop for: {item.whatToShop}
                          </h4>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.whereToBuy?.map((store, idx) => (
                              <span
                                key={idx}
                                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/85"
                              >
                                {store}
                              </span>
                            ))}
                          </div>

                          <p className="mt-3 leading-7 text-white/75">
                            {item.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      📅 Your 30-Day Style Upgrade Plan
                    </h3>

                    <div className="mt-4 grid gap-4">
                      {aiReport.plan30Days?.map((block, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/10 bg-black/10 p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="text-lg font-semibold text-white">
                              {block.days}
                            </h4>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
                              {block.focus}
                            </span>
                          </div>

                          <ul className="mt-3 space-y-3 text-white/80">
                            {block.actions?.map((action, idx) => (
                              <li key={idx}>• {action}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-pink-400/30 bg-pink-400/10 p-5">
                    <h3 className="text-xl font-semibold text-white">
                      🔥 Final Confidence Advice
                    </h3>
                    <p className="mt-3 leading-8 text-white/80">
                      {aiReport.confidenceAdvice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={shareScore}
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Share My Score
            </button>

            {shareMessage && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70">
                {shareMessage}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setShowResult(false);
              setCurrentIndex(0);
              setAnswers({});
              setEmail("");
              setResultsUnlocked(false);
              setShareMessage("");
              setAiReport(null);
              setAiError("");
              setShowAiModal(false);
              setPaidSessionId(null);
              setPostPaymentMessage("");
              localStorage.removeItem("stylescore_answers");
              localStorage.removeItem("stylescore_email");
              localStorage.removeItem("stylescore_onboarding");
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

          {!canProceed && (
            <p className="mt-4 text-sm text-amber-200">
              Please select at least one option to continue.
            </p>
          )}

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
              disabled={!canProceed}
              className={`rounded-2xl px-5 py-3 font-medium transition ${
                canProceed
                  ? "bg-white text-black hover:bg-white/90"
                  : "cursor-not-allowed bg-white/20 text-white/40"
              }`}
            >
              {currentIndex === questions.length - 1 ? "See Result" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}