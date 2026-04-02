"use client";

import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const EMAIL_CONFIRMED_KEY = "stylescore_email_confirmed";

const previewQuestion = {
  category: "Fit & Proportion",
  question: "I usually buy tops that...",
  options: [
    "fit me well in the shoulders and chest",
    "fit okay but are a little loose",
    "often feel tight in one area",
    "are mostly chosen for comfort, not fit",
    "I'm not really sure",
  ],
};

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function OnboardingPage() {
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem("stylescore_email") || "";
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [pulseCard, setPulseCard] = useState(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowNudge(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pulseCard) return;

    const timer = window.setTimeout(() => {
      setPulseCard(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [pulseCard]);

  function nudgeEmailCapture() {
    setShowNudge(true);
    setPulseCard(true);
    emailInputRef.current?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    window.localStorage.setItem("stylescore_email", normalizedEmail);
    window.localStorage.setItem(EMAIL_CONFIRMED_KEY, "true");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });
    } catch {
      // Let the user continue even if lead capture fails server-side.
    }

    window.location.href = "/assessment";
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_32%),radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(251,146,60,0.10),_transparent_22%),linear-gradient(180deg,_#0a1023_0%,_#050816_52%,_#02040b_100%)]" />
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
      </div>

      <div
        className={`fixed left-1/2 top-4 z-40 w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-4 shadow-[0_24px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-500 ease-out sm:p-5 ${
          showNudge
            ? "translate-y-0 opacity-100"
            : "-translate-y-[140%] opacity-0"
        } ${pulseCard ? "ring-2 ring-orange-300/45" : ""}`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300/80">
              Save Your Full Report
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Enter your email to keep your results and continue.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              The full free report unlocks right after the quiz. We will not spam
              you.
            </p>
          </div>

          <form
            className="flex w-full flex-col gap-3 lg:max-w-md lg:flex-row"
            onSubmit={handleSubmit}
          >
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-black/30"
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-glow rounded-2xl bg-orange-400 px-5 py-3 font-semibold text-black shadow-[0_0_30px_rgba(251,146,60,0.45)] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isSubmitting ? "Starting..." : "Continue"}
            </button>
          </form>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-2">
          <Link
            href="/"
            className="text-lg font-bold uppercase tracking-[0.28em] text-white/60 sm:text-xl"
          >
            StyleScore for Men
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-14">
          <div className="w-full pt-20 sm:pt-24">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
                First Question Preview
              </p>
              <h1
                className={`mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl ${displayFont.className}`}
              >
                Start with the quiz. Save the full report before you answer.
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-white/70">
                The question appears first so the flow feels natural. The email
                nudge slides in at the top to save your result before you go on.
              </p>
            </div>

            <div className="quiz-card-enter rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="mb-2 text-sm font-medium text-white/55">
                {previewQuestion.category}
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {previewQuestion.question}
              </h2>

              <div className="mt-4 h-2.5 w-full rounded-full bg-white/10">
                <div className="h-2.5 w-[10%] rounded-full bg-white transition-all" />
              </div>

              <p className="mt-3 text-sm text-white/55">Question 1 of 10</p>

              <div className="mt-6 grid gap-3">
                {previewQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={nudgeEmailCapture}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-white transition hover:bg-white/10"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white/40"
                >
                  Previous
                </button>

                <p className="text-sm text-white/45">
                  Pick any answer or use the card above to continue.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/60">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                10 quick questions
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Full free report after the quiz
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                AI 30-day plan stays behind the $1 upgrade
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
