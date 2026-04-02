import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, score, archetype, focus_top_3 } = body;
    const trimmedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!trimmedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const hasQuizData =
      typeof score === "number" ||
      typeof archetype === "string" ||
      Array.isArray(focus_top_3);

    const { data: existingLead, error: lookupError } = await supabase
      .from("style_leads")
      .select("email")
      .eq("email", trimmedEmail)
      .limit(1);

    if (lookupError) {
      console.error("Supabase lookup error:", lookupError);
      return NextResponse.json(
        { error: lookupError.message, details: lookupError },
        { status: 500 }
      );
    }

    if (existingLead && existingLead.length > 0) {
      if (!hasQuizData) {
        return NextResponse.json({ success: true, data: existingLead });
      }

      const { data, error } = await supabase
        .from("style_leads")
        .update({
          overall_score: score ?? null,
          archetype: archetype ?? null,
          focus_top_3: focus_top_3 ?? null,
        })
        .eq("email", trimmedEmail)
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json(
          { error: error.message, details: error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await supabase
      .from("style_leads")
      .insert([
        {
          email: trimmedEmail,
          overall_score: score ?? null,
          archetype: archetype ?? null,
          focus_top_3: focus_top_3 ?? null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
