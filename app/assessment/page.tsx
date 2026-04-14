"use client";

import { PersonalizationForm } from "../components/personalization-form";
import {
  buildFallbackDiagnosis,
  categoryLabels,
  getScoreExtremes,
  getSelectedAnswer,
  getStyleArchetype,
  type FreeAssessmentReport,
} from "../lib/assessment-report";
import {
  mergeOnboardingData,
  type OnboardingForm,
} from "../lib/onboarding";
import { downloadAIReportPDF } from "../lib/pdf";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Radar as RechartsRadar,
} from "recharts";
import { calculateScore } from "../lib/scoring";
import {
  trackAffiliateLinkClicked,
  trackDetailedReportViewed,
  trackEmailCaptured,
  trackEmailSubmissionFailed,
  trackEmailSubmitted,
  trackPurchase,
  trackQuizCompleted,
  trackQuizQuestionAnswered,
  trackQuizStarted,
  trackReportDownloaded,
  trackReportGenerationCompleted,
  trackReportGenerationFailed,
  trackReportGenerationStarted,
  trackScoreRevealed,
  trackUpgradeCtaClicked,
  trackUpgradePurchaseStarted,
} from "@/lib/analytics";

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
  markdown?: string;
};

const AUTO_ADVANCE_DELAY_MS = 300;
const CATEGORY_INTERSTITIAL_MS = 1200;
const CALCULATION_SCREEN_MS = 4500;
const CALCULATION_STEPS = [
  "Analyzing your responses...",
  "Scoring 6 style categories...",
  "Building your style profile...",
] as const;
const DIAGNOSIS_CACHE_KEY = "stylescore_diagnosis";
const DIAGNOSIS_SIGNATURE_KEY = "stylescore_diagnosis_signature";
const FREE_REPORT_CACHE_KEY = "stylescore_free_report";
const FREE_REPORT_SIGNATURE_KEY = "stylescore_free_report_signature";
const LEAD_SYNC_SIGNATURE_KEY = "stylescore_lead_sync_signature";
const EMAIL_CONFIRMED_KEY = "stylescore_email_confirmed";
const FIRST_NAME_KEY = "stylescore_first_name";
const SCORE_REVEALED_SIGNATURE_KEY = "stylescore_score_revealed_signature";
const PREMIUM_UNLOCKED_KEY = "stylescore_premium_unlocked";
const PREMIUM_PENDING_SESSION_KEY = "stylescore_pending_premium_session";

function GeneratingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950/95 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-orange-400" />
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
          Stylist blueprint
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

function CategoryInterstitial({
  completed,
  next,
}: {
  completed: string;
  next: string;
}) {
  return (
    <div className="interstitial-enter rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-2xl text-emerald-300">
        ✓
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.28em] text-white/45">
        Section Complete
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white">
        {completed} - done
      </h2>
      <p className="mt-3 text-lg text-white/70">Next: {next}</p>
    </div>
  );
}

function ScoreCalculationScreen({
  stepIndex,
  progress,
}: {
  stepIndex: number;
  progress: number;
}) {
  return (
    <div className="results-fade-in rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-orange-400" />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-white/45">
        Building Your Style Score
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-white">
        {CALCULATION_STEPS[stepIndex]}
      </h2>
      <p className="mt-3 text-white/65">
        Matching your answers to the 6 style categories and your overall profile.
      </p>

      <div className="mt-8 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-white transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-white/45">{Math.round(progress)}% complete</p>
    </div>
  );
}

function ResultsEmailGate({
  firstName,
  email,
  error,
  isSubmitting,
  onFirstNameChange,
  onEmailChange,
  onSubmit,
}: {
  firstName: string;
  email: string;
  error: string;
  isSubmitting: boolean;
  onFirstNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return (
    <div className="results-fade-in rounded-3xl border border-orange-300/20 bg-gradient-to-br from-orange-400/10 to-white/5 p-6 text-white backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300/85">
            Unlock Full Breakdown
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            See exactly what to fix - and the order to fix it in.
          </h3>
          <ul className="mt-5 space-y-3 text-white/75">
            {[
              "Full category breakdown across 6 style areas",
              "Your radar chart vs average men",
              "Top 3 upgrade priorities ranked by impact",
              "Specific product recommendations with links",
              "Option to unlock your personalized 30-day upgrade plan",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-orange-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-white/10 bg-black/25 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.32)]"
        >
          <label
            htmlFor="results-first-name"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45"
          >
            First Name
          </label>
          <input
            id="results-first-name"
            type="text"
            value={firstName}
            onChange={(event) => onFirstNameChange(event.target.value)}
            placeholder="First name (optional)"
            maxLength={50}
            autoComplete="given-name"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-white/10"
          />

          <label
            htmlFor="results-email"
            className="mt-4 block text-sm font-semibold uppercase tracking-[0.22em] text-white/45"
          >
            Email Address
          </label>
          <input
            id="results-email"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="Enter your email"
            autoComplete="email"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-white/10"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="premium-glow mt-4 min-h-12 w-full rounded-2xl bg-orange-400 px-5 py-3 font-semibold text-black shadow-[0_0_30px_rgba(251,146,60,0.45)] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {isSubmitting ? "Unlocking your report..." : "Unlock My Full Report"}
          </button>

          <p className="mt-3 text-sm leading-6 text-white/50">
            Unsubscribe anytime.
          </p>

          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </div>
  );
}

const questions: Question[] = [
  {
    id: "q1",
    category: "Fit & Proportion",
    question: "I usually buy tops that...",
    options: [
      "fit me well in the shoulders and chest",
      "fit okay but are a little loose",
      "often feel tight in one area",
      "are mostly chosen for comfort, not fit",
      "I'm not really sure",
    ],
  },
  {
    id: "q3",
    category: "Fit & Proportion",
    question: "My clothes usually make me feel...",
    options: [
      "sharp and put together",
      "decent, but not polished",
      "comfortable more than stylish",
      "slightly awkward in fit",
      "I'm not really sure",
    ],
  },
  {
    id: "q5",
    category: "Wardrobe Foundations",
    question: "My wardrobe is mostly made up of...",
    options: [
      "versatile basics that work together",
      "a mix of random items",
      "older clothes I still use",
      "mostly athletic or lounge wear",
      "whatever I happened to buy",
    ],
  },
  {
    id: "q8",
    category: "Color Coordination",
    question: "I usually wear colors that are...",
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
    question: "Before going out, I usually check whether...",
    options: [
      "the whole outfit feels coordinated",
      "the shoes work with the outfit",
      "at least the clothes are clean",
      "I don't really check",
      "I ask someone else",
    ],
  },
  {
    id: "q11",
    category: "Shoes & Footwear",
    question: "I usually wear...",
    options: [
      "clean casual shoes that suit most outfits",
      "running shoes for almost everything",
      "loafers or boots when needed and sneakers otherwise",
      "old shoes longer than I should",
      "whatever is nearest",
    ],
  },
  {
    id: "q12",
    category: "Shoes & Footwear",
    question: "My shoes are usually...",
    options: [
      "clean and presentable",
      "acceptable but a little worn",
      "visibly dirty or aging",
      "mostly functional, not stylish",
      "not something I focus on",
    ],
  },
  {
    id: "q14",
    category: "Grooming",
    question: "My grooming routine is...",
    options: [
      "regular and intentional",
      "basic but consistent",
      "inconsistent",
      "minimal unless needed",
      "almost nonexistent",
    ],
  },
  {
    id: "q17",
    category: "Occasion Styling",
    question: "For important occasions, I usually...",
    options: [
      "dress a level above average",
      "dress appropriately, not memorably",
      "wear some version of what I always wear",
      "underdress more than I should",
      "feel unsure what to wear",
    ],
  },
  {
    id: "q20",
    category: "Overall Self-View",
    question: "Overall, my style today feels like...",
    options: [
      "a real strength",
      "decent with room to improve",
      "average and forgettable",
      "underdeveloped",
      "something I want help with",
    ],
  },
];

function glassCard(extra = "") {
  return `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${extra}`;
}

function getCategoryLabel(key: string) {
  return categoryLabels[key as keyof typeof categoryLabels] || key;
}

function getVerdict(score: number) {
  if (score >= 85) return "Elite - you dress with intention.";
  if (score >= 70) return "Sharp - small upgrades will push you to elite.";
  if (score >= 55) {
    return "Solid foundation - 3 weak spots are holding you back.";
  }
  if (score >= 40) return "Inconsistent - clear weaknesses to fix.";
  return "Major upgrade opportunity.";
}

export default function AssessmentPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [assessmentAccessReady, setAssessmentAccessReady] = useState(false);
  const [quizPhase, setQuizPhase] = useState<
    "question" | "interstitial" | "calculating"
  >("question");
  const [interstitialInfo, setInterstitialInfo] = useState<{
    completed: string;
    next: string;
  } | null>(null);
  const [calculationStepIndex, setCalculationStepIndex] = useState(0);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingForm | null>(
    null
  );
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [resultsUnlocked, setResultsUnlocked] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [freeReport, setFreeReport] = useState<FreeAssessmentReport | null>(
    null
  );
  const [unlockingResults, setUnlockingResults] = useState(false);
  const [unlockedReportError, setUnlockedReportError] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [showPersonalizationForm, setShowPersonalizationForm] = useState(false);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [, setLoadingReport] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [paidSessionId, setPaidSessionId] = useState<string | null>(null);
  const [postPaymentMessage, setPostPaymentMessage] = useState("");
  const advanceTimerRef = useRef<number | null>(null);
  const calculationTimerRefs = useRef<number[]>([]);
  const interstitialTimerRef = useRef<number | null>(null);
  const quizStartedTrackedRef = useRef(false);
  const quizStartedAtRef = useRef<number | null>(null);
  const detailedReportViewedRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("stylescore_onboarding");
    if (saved) {
      setOnboardingData(JSON.parse(saved));
    }

    const savedAnswers = localStorage.getItem("stylescore_answers");
    if (savedAnswers) {
      const activeQuestionIds = new Set(questions.map((question) => question.id));
      const parsedAnswers = JSON.parse(savedAnswers) as Record<string, string[]>;
      const filteredAnswers = Object.fromEntries(
        Object.entries(parsedAnswers).filter(([questionId]) =>
          activeQuestionIds.has(questionId)
        )
      );

      setAnswers(filteredAnswers);
      localStorage.setItem(
        "stylescore_answers",
        JSON.stringify(filteredAnswers)
      );

      if (Object.keys(filteredAnswers).length === questions.length) {
        setShowResult(true);
      }
    }

    const savedEmail = localStorage.getItem("stylescore_email");
    const savedFirstName = localStorage.getItem(FIRST_NAME_KEY);
    const savedEmailConfirmed =
      localStorage.getItem(EMAIL_CONFIRMED_KEY) === "true";
    const savedPremiumUnlocked =
      sessionStorage.getItem(PREMIUM_UNLOCKED_KEY) === "true";
    const pendingPremiumSessionId = sessionStorage.getItem(
      PREMIUM_PENDING_SESSION_KEY
    );

    if (savedFirstName) {
      setFirstName(savedFirstName);
    }

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (savedEmail && savedEmailConfirmed) {
      setEmailConfirmed(true);
    }

    if (savedPremiumUnlocked) {
      setPremiumUnlocked(true);
      setShowPersonalizationForm(true);
    }

    const params = new URLSearchParams(window.location.search);
    const stripeStatus = params.get("stripe_status");
    const sessionId = params.get("session_id");

    if (stripeStatus === "success" && sessionId) {
      sessionStorage.setItem(PREMIUM_PENDING_SESSION_KEY, sessionId);
      setShowResult(true);
      setPaidSessionId(sessionId);
      setQuizPhase("question");
    } else if (pendingPremiumSessionId) {
      setShowResult(true);
      setPaidSessionId(pendingPremiumSessionId);
      setQuizPhase("question");
    }

    if (stripeStatus || sessionId) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    setAssessmentAccessReady(true);
  }, []);

  const effectiveOnboardingData = useMemo(
    () => mergeOnboardingData(onboardingData),
    [onboardingData]
  );

  const result = useMemo(
    () => calculateScore(effectiveOnboardingData, answers),
    [effectiveOnboardingData, answers]
  );
  const selfViewAnswer = getSelectedAnswer(answers, "q20");
  const archetype = useMemo(
    () =>
      getStyleArchetype(
        result.overall_score,
        result.category_scores,
        selfViewAnswer
      ),
    [result, selfViewAnswer]
  );
  const diagnosisSignature = useMemo(
    () =>
      JSON.stringify({
        overall: result.overall_score,
        categories: result.category_scores,
        archetype: archetype.title,
        focus: result.focus_top_3,
      }),
    [result, archetype.title]
  );
  const freeReportSignature = useMemo(
    () => JSON.stringify({ answers }),
    [answers]
  );
  const leadSyncSignature = useMemo(
    () =>
      JSON.stringify({
        email,
        firstName,
        overall: result.overall_score,
        archetype: archetype.title,
        focus: result.focus_top_3,
      }),
    [email, firstName, result, archetype.title]
  );
  const diagnosisFallback = useMemo(
    () =>
      buildFallbackDiagnosis({
        overallScore: result.overall_score,
        categoryScores: result.category_scores,
        focusAreas: result.focus_top_3,
      }),
    [result]
  );

  const requestDiagnosis = useCallback(async () => {
    if (typeof window !== "undefined") {
      const cachedSignature = window.sessionStorage.getItem(
        DIAGNOSIS_SIGNATURE_KEY
      );
      const cachedDiagnosis = window.sessionStorage.getItem(DIAGNOSIS_CACHE_KEY);

      if (cachedSignature === diagnosisSignature && cachedDiagnosis) {
        return cachedDiagnosis;
      }
    }

    try {
      const response = await fetch("/api/style-diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          overallScore: result.overall_score,
          categoryScores: result.category_scores,
          archetypeName: archetype.title,
          focusAreas: result.focus_top_3,
        }),
      });

      const data = await response.json();
      const nextDiagnosis = data.diagnosis || diagnosisFallback;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(DIAGNOSIS_CACHE_KEY, nextDiagnosis);
        window.sessionStorage.setItem(
          DIAGNOSIS_SIGNATURE_KEY,
          diagnosisSignature
        );
      }

      return nextDiagnosis;
    } catch {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(DIAGNOSIS_CACHE_KEY, diagnosisFallback);
        window.sessionStorage.setItem(
          DIAGNOSIS_SIGNATURE_KEY,
          diagnosisSignature
        );
      }

      return diagnosisFallback;
    }
  }, [
    archetype.title,
    diagnosisFallback,
    diagnosisSignature,
    result.category_scores,
    result.focus_top_3,
    result.overall_score,
  ]);

  const fetchUnlockedReport = useCallback(async (force = false) => {
    if (typeof window !== "undefined" && !force) {
      const cachedSignature = window.sessionStorage.getItem(
        FREE_REPORT_SIGNATURE_KEY
      );
      const cachedReport = window.sessionStorage.getItem(FREE_REPORT_CACHE_KEY);

      if (cachedSignature === freeReportSignature && cachedReport) {
        setFreeReport(JSON.parse(cachedReport) as FreeAssessmentReport);
        setResultsUnlocked(true);
        setUnlockedReportError("");
        return true;
      }
    }

    try {
      setUnlockingResults(true);
      setUnlockedReportError("");

      const response = await fetch("/api/free-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          onboardingData: effectiveOnboardingData,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.report) {
        setUnlockedReportError(
          data.error || "Could not load your unlocked report."
        );
        return false;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          FREE_REPORT_CACHE_KEY,
          JSON.stringify(data.report)
        );
        window.sessionStorage.setItem(
          FREE_REPORT_SIGNATURE_KEY,
          freeReportSignature
        );
      }

      setFreeReport(data.report as FreeAssessmentReport);
      setResultsUnlocked(true);
      return true;
    } catch {
      setUnlockedReportError("Could not load your unlocked report.");
      return false;
    } finally {
      setUnlockingResults(false);
    }
  }, [answers, effectiveOnboardingData, freeReportSignature]);

  useEffect(() => {
    return () => {
      clearScheduledTransitions();
    };
  }, []);

  useEffect(() => {
    if (!showResult || typeof window === "undefined") return;

    const cachedSignature = window.sessionStorage.getItem(
      DIAGNOSIS_SIGNATURE_KEY
    );
    const cachedDiagnosis = window.sessionStorage.getItem(DIAGNOSIS_CACHE_KEY);

    if (cachedSignature === diagnosisSignature && cachedDiagnosis) {
      setDiagnosis(cachedDiagnosis);
      return;
    }

    if (!diagnosis) {
      void requestDiagnosis();
    }
  }, [
    showResult,
    diagnosisSignature,
    diagnosis,
    diagnosisFallback,
    requestDiagnosis,
  ]);

  useEffect(() => {
    if (!showResult || typeof window === "undefined") return;

    const scoreSignature = JSON.stringify({
      overall: result.overall_score,
      categories: result.category_scores,
    });

    if (
      window.sessionStorage.getItem(SCORE_REVEALED_SIGNATURE_KEY) ===
      scoreSignature
    ) {
      return;
    }

    trackScoreRevealed(result.overall_score);
    window.sessionStorage.setItem(SCORE_REVEALED_SIGNATURE_KEY, scoreSignature);
  }, [showResult, result.overall_score, result.category_scores]);

  useEffect(() => {
    if (!resultsUnlocked || !freeReport || detailedReportViewedRef.current) {
      return;
    }

    detailedReportViewedRef.current = true;
    trackDetailedReportViewed();
  }, [resultsUnlocked, freeReport]);

  useEffect(() => {
    if (quizPhase !== "calculating" || showResult) return;

    setCalculationStepIndex(0);
    setCalculationProgress(0);

    const progressKickoff = window.setTimeout(() => {
      setCalculationProgress(100);
    }, 60);
    const secondStep = window.setTimeout(() => {
      setCalculationStepIndex(1);
    }, 1500);
    const thirdStep = window.setTimeout(() => {
      setCalculationStepIndex(2);
    }, 3000);

    calculationTimerRefs.current = [progressKickoff, secondStep, thirdStep];

    let cancelled = false;
    const minimumDelay = new Promise<void>((resolve) => {
      const finishTimer = window.setTimeout(resolve, CALCULATION_SCREEN_MS);
      calculationTimerRefs.current.push(finishTimer);
    });

    const completeResultsTransition = async () => {
      const diagnosisText = await requestDiagnosis();
      await minimumDelay;

      if (cancelled) return;

      setDiagnosis(diagnosisText);
      setShowResult(true);
      setQuizPhase("question");
      setCalculationProgress(0);
    };

    void completeResultsTransition();

    return () => {
      cancelled = true;
      calculationTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
      calculationTimerRefs.current = [];
    };
  }, [
    quizPhase,
    showResult,
    diagnosisSignature,
    diagnosisFallback,
    requestDiagnosis,
  ]);

  useEffect(() => {
    if (!showResult || !emailConfirmed || !email) return;

    void fetchUnlockedReport();
  }, [
    showResult,
    emailConfirmed,
    email,
    freeReportSignature,
    fetchUnlockedReport,
  ]);

  useEffect(() => {
    if (!showResult || !emailConfirmed || !email) return;

    const cachedLeadSignature = window.sessionStorage.getItem(
      LEAD_SYNC_SIGNATURE_KEY
    );

    if (cachedLeadSignature === leadSyncSignature) {
      return;
    }

    async function syncLeadData() {
      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            firstName,
            score: result.overall_score,
            archetype: archetype.title,
            focus_top_3: result.focus_top_3,
          }),
        });

        if (response.ok) {
          window.sessionStorage.setItem(
            LEAD_SYNC_SIGNATURE_KEY,
            leadSyncSignature
          );
        }
      } catch {
        // Ignore lead sync failures. The report experience should continue.
      }
    }

    void syncLeadData();
  }, [
    showResult,
    emailConfirmed,
    email,
    firstName,
    leadSyncSignature,
    result,
    archetype.title,
  ]);

  useEffect(() => {
    async function verifyPremiumCheckout() {
      if (!paidSessionId || !showResult) return;

      try {
        setPostPaymentMessage(
          "Payment confirmed. Unlocking your premium setup..."
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

        trackPurchase(paidSessionId, 19);

        sessionStorage.setItem(PREMIUM_UNLOCKED_KEY, "true");
        sessionStorage.removeItem(PREMIUM_PENDING_SESSION_KEY);
        setPremiumUnlocked(true);
        setShowPersonalizationForm(true);
        setPaidSessionId(null);
        setPostPaymentMessage("");
      } catch {
        setAiError("Failed to verify payment.");
        setPostPaymentMessage("");
      } finally {
        setLoadingReport(false);
      }
    }

    void verifyPremiumCheckout();
  }, [paidSessionId, showResult]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = getSelectedAnswer(answers, currentQuestion.id);

  const progress = useMemo(
    () => Math.round(((currentIndex + 1) / questions.length) * 100),
    [currentIndex]
  );

  function clearScheduledTransitions() {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    if (interstitialTimerRef.current !== null) {
      window.clearTimeout(interstitialTimerRef.current);
      interstitialTimerRef.current = null;
    }

    calculationTimerRefs.current.forEach((timer) => window.clearTimeout(timer));
    calculationTimerRefs.current = [];
  }

  function advanceToNextStep(questionIndex: number) {
    const nextIndex = questionIndex + 1;

    if (questionIndex >= questions.length - 1) {
      setInterstitialInfo(null);
      setQuizPhase("calculating");
      return;
    }

    const nextQuestion = questions[nextIndex];

    if (nextQuestion.category !== questions[questionIndex].category) {
      setInterstitialInfo({
        completed: questions[questionIndex].category,
        next: nextQuestion.category,
      });
      setQuizPhase("interstitial");

      interstitialTimerRef.current = window.setTimeout(() => {
        setCurrentIndex(nextIndex);
        setQuizPhase("question");
        setInterstitialInfo(null);
        interstitialTimerRef.current = null;
      }, CATEGORY_INTERSTITIAL_MS);

      return;
    }

    setCurrentIndex(nextIndex);
  }

  function handleAnswerSelect(option: string) {
    if (quizPhase !== "question") return;

    const questionId = currentQuestion.id;
    const questionIndex = currentIndex;
    const updatedAnswers = {
      ...answers,
      [questionId]: [option],
    };

    if (questionIndex === 0 && !quizStartedTrackedRef.current) {
      quizStartedTrackedRef.current = true;
      quizStartedAtRef.current = Date.now();
      trackQuizStarted();
    }

    trackQuizQuestionAnswered(questionIndex + 1, questionId, option);

    if (questionIndex >= questions.length - 1) {
      const finalResult = calculateScore(effectiveOnboardingData, updatedAnswers);
      const durationSeconds = quizStartedAtRef.current
        ? Math.max(1, Math.round((Date.now() - quizStartedAtRef.current) / 1000))
        : 0;

      trackQuizCompleted(finalResult.overall_score, durationSeconds);
    }

    setAnswers(updatedAnswers);
    localStorage.setItem("stylescore_answers", JSON.stringify(updatedAnswers));

    clearScheduledTransitions();
    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      advanceToNextStep(questionIndex);
    }, AUTO_ADVANCE_DELAY_MS);
  }

  function previousQuestion() {
    clearScheduledTransitions();

    if (currentIndex > 0) {
      setInterstitialInfo(null);
      setQuizPhase("question");
      setCurrentIndex((prev) => prev - 1);
    }
  }

  async function handleResultsEmailSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      trackEmailSubmissionFailed("invalid_email");
      setEmailError("Please enter a valid email.");
      return;
    }

    const normalizedFirstName = firstName.trim().slice(0, 50);

    setSubmittingEmail(true);
    setEmailError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          firstName: normalizedFirstName,
          score: result.overall_score,
          archetype: archetype.title,
          focus_top_3: result.focus_top_3,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "lead_capture_failed");
      }

      setEmail(normalizedEmail);
      setFirstName(normalizedFirstName);
      localStorage.setItem("stylescore_email", normalizedEmail);
      localStorage.setItem(FIRST_NAME_KEY, normalizedFirstName);
      localStorage.setItem(EMAIL_CONFIRMED_KEY, "true");
      setEmailConfirmed(true);
      trackEmailSubmitted();
      trackEmailCaptured();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "lead_capture_failed";
      trackEmailSubmissionFailed(message);
      setEmailError(
        "We could not save that email yet. Please try again in a moment."
      );
    } finally {
      setSubmittingEmail(false);
    }
  }

  async function generatePremiumReport(
    personalizationData?: OnboardingForm | null
  ) {
    const startedAt = Date.now();

    try {
      const reportOnboardingData = mergeOnboardingData(
        personalizationData ?? onboardingData
      );

      setLoadingReport(true);
      setAiError("");
      setShowPersonalizationForm(false);
      setPostPaymentMessage(
        "Building your premium 30-day style blueprint..."
      );
      trackReportGenerationStarted();

      const response = await fetch("/api/style-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          score: result.overall_score,
          archetype: archetype.title,
          confidence: result.confidence_level,
          focusAreas: result.focus_top_3,
          categoryScores: result.category_scores,
          onboardingData: reportOnboardingData,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAiError(data.error || "Failed to generate style report.");
        setShowPersonalizationForm(true);
        setPostPaymentMessage("");
        trackReportGenerationFailed(data.error || "api_error");
        return;
      }

      setAiReport(data.report);
      trackReportGenerationCompleted(
        Math.max(1, Math.round((Date.now() - startedAt) / 1000))
      );
      setTimeout(() => {
        setShowAiModal(true);
        setPostPaymentMessage("");
      }, 1200);
    } catch {
      setAiError("Failed to generate style report.");
      setShowPersonalizationForm(true);
      setPostPaymentMessage("");
      trackReportGenerationFailed("network_error");
    } finally {
      setLoadingReport(false);
    }
  }

  function handlePersonalizationSave(form: OnboardingForm) {
    setOnboardingData(form);
    void generatePremiumReport(form);
  }

  function handlePersonalizationSkip() {
    void generatePremiumReport(mergeOnboardingData(onboardingData));
  }

  async function startPremiumCheckout() {
    try {
      trackUpgradeCtaClicked();

      if (!resultsUnlocked) {
        setAiError("Unlock your full report first.");
        return;
      }

      setLoadingCheckout(true);
      setAiError("");
      trackUpgradePurchaseStarted(19);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName }),
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

  if (!assessmentAccessReady) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
        <div className="relative mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className={glassCard("p-8 text-center")}>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-orange-400" />
            <p className="mt-4 text-white/65">Loading your assessment...</p>
          </div>
        </div>
      </main>
    );
  }

  if (showResult) {
    const teaserTarget = "#premium-plan";
    const visibleDiagnosis = diagnosis || diagnosisFallback;
    const { weakest } = getScoreExtremes(result.category_scores);
    const weakestLabel = getCategoryLabel(weakest);
    const weakestScore =
      result.category_scores[weakest as keyof typeof result.category_scores];

    return (
      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
          <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
        </div>

        {postPaymentMessage && <GeneratingOverlay message={postPaymentMessage} />}

        <div className="relative mx-auto max-w-4xl space-y-6 results-fade-in">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-white backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Your Style Score
            </p>

            <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-[72px] font-bold leading-none tracking-tight sm:text-[88px]">
                  {result.overall_score}
                  <span className="ml-1 text-2xl font-medium text-white/45 sm:text-3xl">
                    /100
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-lg text-white/70">
                  {getVerdict(result.overall_score)}
                </p>
                <p className="mt-4 text-xl font-semibold text-white">
                  Archetype: {archetype.title}
                </p>
                <p className="mt-2 text-base text-orange-200/85">
                  Your biggest weak spot: {weakestLabel} ({weakestScore}/100)
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
            <p className="mt-3 leading-7 text-white/75">{visibleDiagnosis}</p>
            <a
              href={teaserTarget}
              className="mt-5 inline-flex text-sm font-medium text-orange-300 transition hover:text-orange-200"
            >
              Your full 30-day upgrade plan breaks this down into weekly steps. →
            </a>
          </div>

          {!emailConfirmed && (
            <ResultsEmailGate
              firstName={firstName}
              email={email}
              error={emailError}
              isSubmitting={submittingEmail}
              onFirstNameChange={(value) => setFirstName(value)}
              onEmailChange={(value) => {
                setEmail(value);
                if (emailError) {
                  setEmailError("");
                }
              }}
              onSubmit={handleResultsEmailSubmit}
            />
          )}

          {emailConfirmed && !resultsUnlocked && (
            <div className={glassCard("p-6")}>
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-white">
                  Preparing your full free report
                </h3>

                <p className="mt-3 text-white/70">
                  Your email is already saved, so we&apos;re unlocking the full
                  report automatically.
                </p>
              </div>

              {!unlockedReportError ? (
                <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-white/75">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-orange-400" />
                  <p>
                    {unlockingResults
                      ? "Loading your archetype, category breakdown, and recommendations..."
                      : "Getting your report ready..."}
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-5">
                  <p className="text-sm text-red-200">{unlockedReportError}</p>
                  <button
                    type="button"
                    onClick={() => void fetchUnlockedReport(true)}
                    className="mt-4 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
                  >
                    Retry loading full report
                  </button>
                </div>
              )}
            </div>
          )}

          {emailConfirmed && resultsUnlocked && freeReport && (
            <div className="space-y-6">
            <div className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Your Style Archetype
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                {freeReport.archetype.title}
              </h3>
              <p className="mt-3 max-w-2xl leading-7 text-white/70">
                {freeReport.archetype.description}
              </p>
            </div>

            <div className={glassCard("p-6")}>
              <h3 className="text-xl font-semibold text-white">
                Archetype Style Direction
              </h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-white/75">
                {freeReport.archetypeSuggestions.map((tip, i) => (
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
                  <RadarChart data={freeReport.radarData}>
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
                {Object.entries(freeReport.result.category_scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-2 flex justify-between">
                      <span className="font-medium text-white/85">
                        {getCategoryLabel(key)}
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
                {freeReport.result.focus_top_3.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 font-medium text-white/90"
                  >
                    {getCategoryLabel(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className={glassCard("p-6")}>
              <h3 className="text-xl font-semibold text-white">
                Recommended Improvements
              </h3>

              <div className="mt-4 space-y-4">
                {freeReport.result.focus_top_3.map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <h4 className="text-lg font-semibold text-white">
                      {getCategoryLabel(area)}
                    </h4>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-white/75">
                      {freeReport.personalizedRecommendations[area]?.map((tip, i) => (
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
                {freeReport.result.focus_top_3.map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <h4 className="text-lg font-semibold text-white">
                      {getCategoryLabel(area)}
                    </h4>

                    <ul className="mt-4 space-y-3 text-white/80">
                      {freeReport.recommendedNeeds[area]?.map((item, i) => (
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
                              onClick={() =>
                                trackAffiliateLinkClicked(
                                  getCategoryLabel(area),
                                  item
                                )
                              }
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
                              onClick={() =>
                                trackAffiliateLinkClicked(
                                  getCategoryLabel(area),
                                  item
                                )
                              }
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
          )}

          {resultsUnlocked && freeReport && premiumUnlocked && showPersonalizationForm && (
            <div id="premium-plan" className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Premium Report Setup
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                One last step before we build your upgrade plan
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/70">
                Add a little context so the paid report fits your budget, daily
                environment, style direction, and fit issues instead of staying
                generic.
              </p>

              <div className="mt-6">
                <PersonalizationForm
                  mode="premium"
                  title="Personalize your premium report"
                  description="These answers only shape the $19 style blueprint. Your quiz score and free report stay the same."
                  submitLabel="Generate my style blueprint"
                  showSkip
                  skipLabel="Use defaults and generate"
                  onSaved={handlePersonalizationSave}
                  onSkip={handlePersonalizationSkip}
                />

                {aiError && (
                  <p className="mt-4 text-sm text-red-300">{aiError}</p>
                )}
              </div>
            </div>
          )}

          {resultsUnlocked && !premiumUnlocked && (
            <div id="premium-plan" className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Personalized Style Blueprint
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Upgrade Your Style in 30 Days
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/70">
                Get a detailed personalized style blueprint built from your quiz
                answers, body type, work environment, budget, and lifestyle.
              </p>

              <ul className="mt-5 space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Your complete style strengths and blind spots</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>10 specific outfits built for your archetype and body type</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Day-by-day 30-day transformation roadmap</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Detailed shopping list with retailer recommendations for your budget</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Complete grooming routine tailored to your lifestyle</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Outfit formulas for your specific goal</span>
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
                    : "Get My 30-Day Style Upgrade Plan - $19"}
                </button>

                <p className="mt-3 text-center text-sm text-white/45">
                  Instant report delivered after checkout - one-time payment,
                  no subscription
                </p>

                {aiError && (
                  <p className="mt-3 text-sm text-red-300">{aiError}</p>
                )}
              </div>
            </div>
          )}

          {resultsUnlocked && premiumUnlocked && aiReport && !showPersonalizationForm && (
            <div id="premium-plan" className={glassCard("p-6")}>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Premium Report
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Your 30-day upgrade plan is ready
              </h3>
              <p className="mt-3 max-w-3xl leading-7 text-white/70">
                Open your premium report again anytime to review the roadmap,
                strengths, blind spots, and shopping guidance.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
                >
                  Open My Premium Report
                </button>

                <button
                  type="button"
                  onClick={() => setShowPersonalizationForm(true)}
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Edit Premium Personalization
                </button>
              </div>
            </div>
          )}

          {showAiModal && aiReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/40">
                      Premium Report
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
                      onClick={() => {
                        if (!aiReport) return;

                        trackReportDownloaded();
                        downloadAIReportPDF({
                          aiReport,
                          result,
                          categoryLabels,
                          getStyleArchetype: (overallScore, categoryScores) =>
                            getStyleArchetype(
                              overallScore,
                              categoryScores,
                              selfViewAnswer
                            ),
                        });
                      }}
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
                  {aiReport.markdown ? (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-white/78">
                        {aiReport.markdown}
                      </pre>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
              clearScheduledTransitions();
              setShowResult(false);
              setQuizPhase("question");
              setInterstitialInfo(null);
              setCalculationStepIndex(0);
              setCalculationProgress(0);
              setCurrentIndex(0);
              setAnswers({});
              setOnboardingData(null);
              setFirstName("");
              setEmail("");
              setEmailConfirmed(false);
              setEmailError("");
              setDiagnosis("");
              setFreeReport(null);
              setResultsUnlocked(false);
              setUnlockingResults(false);
              setUnlockedReportError("");
              setShareMessage("");
              setPremiumUnlocked(false);
              setShowPersonalizationForm(false);
              setAiReport(null);
              setAiError("");
              setShowAiModal(false);
              setPaidSessionId(null);
              setPostPaymentMessage("");
              localStorage.removeItem("stylescore_answers");
              localStorage.removeItem("stylescore_onboarding");
              localStorage.removeItem("stylescore_email");
              localStorage.removeItem(FIRST_NAME_KEY);
              localStorage.removeItem(EMAIL_CONFIRMED_KEY);
              sessionStorage.removeItem(DIAGNOSIS_CACHE_KEY);
              sessionStorage.removeItem(DIAGNOSIS_SIGNATURE_KEY);
              sessionStorage.removeItem(SCORE_REVEALED_SIGNATURE_KEY);
              sessionStorage.removeItem(FREE_REPORT_CACHE_KEY);
              sessionStorage.removeItem(FREE_REPORT_SIGNATURE_KEY);
              sessionStorage.removeItem(LEAD_SYNC_SIGNATURE_KEY);
              sessionStorage.removeItem(PREMIUM_UNLOCKED_KEY);
              sessionStorage.removeItem(PREMIUM_PENDING_SESSION_KEY);
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

        {quizPhase === "calculating" ? (
          <ScoreCalculationScreen
            stepIndex={calculationStepIndex}
            progress={calculationProgress}
          />
        ) : quizPhase === "interstitial" && interstitialInfo ? (
          <CategoryInterstitial
            completed={interstitialInfo.completed}
            next={interstitialInfo.next}
          />
        ) : (
          <div key={currentQuestion.id} className={`${glassCard("p-6")} quiz-card-enter`}>
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
                const active = selectedAnswer === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerSelect(option)}
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

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={currentIndex === 0}
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <p className="text-sm text-white/45">Tap an answer to continue.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

