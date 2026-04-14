import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type RefundRequest = {
  sessionId?: string;
  email?: string;
  reason?: string;
};

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is missing." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as RefundRequest;
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Checkout session is required." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" &&
      session.status !== "complete"
    ) {
      return NextResponse.json(
        { error: "Payment is not eligible for refund yet." },
        { status: 400 }
      );
    }

    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "Could not find the payment to refund." },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create(
      {
        payment_intent: paymentIntent,
        reason: "requested_by_customer",
        metadata: {
          source: "stylescore_report_generation_failed",
          checkout_session_id: sessionId,
          customer_email: body.email?.trim().toLowerCase() || "",
          request_reason:
            body.reason?.trim().slice(0, 240) || "report_generation_failed",
        },
      },
      {
        idempotencyKey: `stylescore-refund-${sessionId}`,
      }
    );

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status,
    });
  } catch (error: unknown) {
    const refundError = error as {
      message?: string;
      raw?: { message?: string };
    };

    console.error("Refund request error:", error);

    return NextResponse.json(
      {
        error:
          refundError.message ||
          refundError.raw?.message ||
          "Could not request the refund right now.",
      },
      { status: 500 }
    );
  }
}
