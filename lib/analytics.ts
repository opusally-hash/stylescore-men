"use client";

type AnalyticsValue = string | number | boolean | string[] | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: AnalyticsParams
    ) => void;
  }
}

function fire(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const gtag = window.gtag;
  if (!gtag) {
    console.warn("[analytics] gtag not loaded");
    return;
  }

  gtag("event", name, params);
}

export function trackHomepageCtaClicked(ctaLocation: string) {
  fire("homepage_cta_clicked", { cta_location: ctaLocation });
}

export function trackQuizStarted() {
  fire("quiz_started");
}

export function trackQuizQuestionAnswered(
  questionNumber: number,
  questionId: string,
  answer: string
) {
  fire("quiz_question_answered", {
    question_number: questionNumber,
    question_id: questionId,
    answer,
  });
}

export function trackQuizCompleted(
  finalScore: number,
  durationSeconds: number
) {
  fire("quiz_completed", {
    final_score: finalScore,
    duration_seconds: durationSeconds,
  });
}

export function trackScoreRevealed(finalScore: number) {
  fire("score_revealed", { final_score: finalScore });
}

export function trackEmailSubmitted() {
  fire("email_submitted");
}

export function trackEmailSubmissionFailed(reason: string) {
  fire("email_submission_failed", { reason });
}

export function trackEmailCaptured() {
  fire("email_captured");
}

export function trackDetailedReportViewed() {
  fire("detailed_report_viewed");
}

export function trackAffiliateLinkClicked(category: string, product: string) {
  fire("affiliate_link_clicked", { category, product });
}

export function trackUpgradeCtaClicked() {
  fire("upgrade_cta_clicked");
}

export function trackUpgradePurchaseStarted(value = 9) {
  fire("upgrade_purchase_started", {
    currency: "USD",
    value,
    item_name: "StyleScore Personalized Style Blueprint",
  });
}

export function trackPurchase(transactionId: string, value = 9) {
  fire("purchase", {
    transaction_id: transactionId,
    value,
    currency: "USD",
    item_name: "StyleScore Personalized Style Blueprint",
  });
}

export function trackReportGenerationStarted() {
  fire("report_generation_started");
}

export function trackReportGenerationCompleted(durationSeconds: number) {
  fire("report_generation_completed", { duration_seconds: durationSeconds });
}

export function trackReportGenerationFailed(reason: string) {
  fire("report_generation_failed", { reason });
}

export function trackReportDownloaded() {
  fire("report_downloaded");
}
