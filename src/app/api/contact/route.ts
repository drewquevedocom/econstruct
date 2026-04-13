import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      projectType,
      zipCode,
      firstName,
      lastName,
      email,
      phone,
      budget,
      timeline,
      details,
      source, // optional: "contact_form" | "consultation_cta"
    } = body;
    const normalizedProjectType = projectType || "General Inquiry";

    // Basic validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("leads").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        project_type: normalizedProjectType,
        zip_code: zipCode || null,
        budget_range: budget || null,
        timeline: timeline || null,
        details: details || null,
        source: source || "contact_form",
        status: "new",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save lead. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
