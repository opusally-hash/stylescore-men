import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactRequest = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequest;
    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (name.length < 2 || !isValidEmail(email) || message.length < 12) {
      return NextResponse.json(
        { error: "Please complete all fields with valid information." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "opusally@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "StyleScore <onboarding@resend.dev>";

    if (!apiKey) {
      console.error("Contact form is missing RESEND_API_KEY.");
      return NextResponse.json(
        { error: "Contact form is not configured right now." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `StyleScore feedback from ${name}`,
        text: [
          "New contact form submission",
          "",
          `Name: ${name}`,
          `Reply email: ${email}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Contact form send failed:", errorText);
      return NextResponse.json(
        { error: "Could not send your message right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Could not send your message right now." },
      { status: 500 }
    );
  }
}
