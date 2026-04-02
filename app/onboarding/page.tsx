"use client";

import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { useState } from "react";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const EMAIL_CONFIRMED_KEY = "stylescore_email_confirmed";

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

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-2">
          <Link
            href="/"
            className="text-lg font-bold uppercase tracking-[0.28em] text-white/60 sm:text-xl"
          >
            StyleScore for Men
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-14">
          <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                Before You Start
              </p>
              <h1
                className={`mt-5 text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl ${displayFont.className}`}
              >
                Get the full StyleScore report right after the quiz.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/68">
                Drop your email first, then answer the quick assessment and see
                your complete score, diagnosis, archetype, and free upgrade path
                without another gate at the end.
              </p>

              <div className="mt-8 space-y-3 text-white/70">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>10 quick questions</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Full free report unlocked after the quiz</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  <span>Only the AI 30-day plan stays behind the $1 upgrade</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_24px_100px_rgba(0,0,0,0.42)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Start Your Assessment
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Enter your email to begin
              </h2>
              <p className="mt-3 leading-7 text-white/65">
                We&apos;ll use this to save your report and follow up with helpful
                StyleScore updates. We will not spam you.
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-black/30"
                  autoComplete="email"
                />

                {error && <p className="text-sm text-red-300">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="premium-glow w-full rounded-2xl bg-orange-400 px-6 py-4 text-base font-semibold text-black shadow-[0_0_30px_rgba(251,146,60,0.45)] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {isSubmitting
                    ? "Starting your assessment..."
                    : "Start My Style Assessment"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-white/45">
                Takes about 90 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
