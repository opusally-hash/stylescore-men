import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, score, archetype, focus_top_3 } = body;

    const { data, error } = await supabase
      .from("style_leads")
      .insert([
        {
          email,
          overall_score: score,
          archetype: archetype,
          focus_top_3: focus_top_3,
        },
      ]);

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