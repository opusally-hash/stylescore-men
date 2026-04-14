import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return Response.json(
        { error: "STRIPE_SECRET_KEY is missing." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const { email } = await req.json();
    const premiumPriceId =
      process.env.STRIPE_STYLE_BLUEPRINT_PRICE_ID ||
      process.env.STRIPE_PREMIUM_PRICE_ID_9;

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email || undefined,
      line_items: [
        {
          ...(premiumPriceId
            ? { price: premiumPriceId }
            : {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "StyleScore Personalized Style Blueprint",
                    description: "Your personalized 30-day style upgrade plan.",
                  },
                  unit_amount: 900,
                },
              }),
          quantity: 1,
        },
      ],
      success_url: `${origin}/assessment?stripe_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assessment?stripe_status=cancel`,
      allow_promotion_codes: false,
      billing_address_collection: "auto",
    });

    return Response.json({ url: session.url });
  } catch (error: unknown) {
    const stripeError = error as {
      message?: string;
      raw?: { message?: string };
    };

    console.error("Stripe checkout error:", error);
    return Response.json(
      {
        error:
          stripeError.message ||
          stripeError.raw?.message ||
          "Failed to create checkout session.",
      },
      { status: 500 }
    );
  }
}
