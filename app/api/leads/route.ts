import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, score, archetype, focus_top_3 } = body;
    const trimmedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedFirstName =
      typeof firstName === "string" ? firstName.trim().slice(0, 50) : "";

    if (!trimmedEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const hasLeadData =
      typeof score === "number" ||
      typeof archetype === "string" ||
      Array.isArray(focus_top_3) ||
      Boolean(trimmedFirstName);

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
      if (!hasLeadData) {
        return NextResponse.json({ success: true, data: existingLead });
      }

      const updatePayload = {
        overall_score: score ?? null,
        archetype: archetype ?? null,
        focus_top_3: focus_top_3 ?? null,
        ...(trimmedFirstName ? { first_name: trimmedFirstName } : {}),
      };

      let { data, error } = await supabase
        .from("style_leads")
        .update(updatePayload)
        .eq("email", trimmedEmail)
        .select();

      if (error && trimmedFirstName && isMissingFirstNameColumn(error)) {
        const retry = await supabase
          .from("style_leads")
          .update({
            overall_score: score ?? null,
            archetype: archetype ?? null,
            focus_top_3: focus_top_3 ?? null,
          })
          .eq("email", trimmedEmail)
          .select();

        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json(
          { error: error.message, details: error },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    const insertPayload = {
      email: trimmedEmail,
      overall_score: score ?? null,
      archetype: archetype ?? null,
      focus_top_3: focus_top_3 ?? null,
      ...(trimmedFirstName ? { first_name: trimmedFirstName } : {}),
    };

    let { data, error } = await supabase
      .from("style_leads")
      .insert([insertPayload])
      .select();

    if (error && trimmedFirstName && isMissingFirstNameColumn(error)) {
      const retry = await supabase
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

      data = retry.data;
      error = retry.error;
    }

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

function isMissingFirstNameColumn(error: { message?: string; details?: string }) {
  const text = `${error.message || ""} ${error.details || ""}`.toLowerCase();
  return text.includes("first_name") && text.includes("column");
}
