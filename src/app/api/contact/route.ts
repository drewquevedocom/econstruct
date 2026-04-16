import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Public values — safe to inline. NEXT_PUBLIC_* vars aren't available
// at runtime on Cloudflare Workers (only inlined into client bundle at build).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";
// DEV MODE - all notifications go to Drew only for testing
// When ready to go live, swap these back:
// const NOTIFY_TO = "info@econstructinc.com";
// const NOTIFY_CC = ["robyn@econstructinc.com", "marketing@econstructinc.com"];
const NOTIFY_TO = "marketing@econstructinc.com";
const NOTIFY_CC: string[] = [];

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

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const isConsultation = source === "consultation_cta" || source === "free_consultation";
      const subject = isConsultation
        ? `New Consultation Request - ${firstName} ${lastName}`
        : `New Contact Form Submission - ${firstName} ${lastName}`;

      await resend.emails.send({
        from: "econstruct Website <no-reply@econstructinc.com>",
        to: NOTIFY_TO,
        cc: NOTIFY_CC,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
            <div style="background:#07090c;padding:24px 32px;border-radius:12px 12px 0 0;">
              <p style="color:#d9b661;font-weight:700;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">econstruct Inc.</p>
              <h1 style="color:#ffffff;font-size:22px;margin:8px 0 0;">${subject}</h1>
            </div>
            <div style="background:#f8f6f2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e2db;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-size:13px;color:#666;width:40%;font-weight:600;">Name</td><td style="padding:8px 0;font-size:14px;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${email}">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Phone</td><td style="padding:8px 0;font-size:14px;"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
                ${zipCode ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Zip Code</td><td style="padding:8px 0;font-size:14px;">${zipCode}</td></tr>` : ""}
                <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Project Type</td><td style="padding:8px 0;font-size:14px;">${normalizedProjectType}</td></tr>
                ${budget ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Budget</td><td style="padding:8px 0;font-size:14px;">${budget}</td></tr>` : ""}
                ${timeline ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Timeline</td><td style="padding:8px 0;font-size:14px;">${timeline}</td></tr>` : ""}
                ${details ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;vertical-align:top;">Details</td><td style="padding:8px 0;font-size:14px;">${details}</td></tr>` : ""}
                <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Source</td><td style="padding:8px 0;font-size:14px;">${source || "contact_form"}</td></tr>
              </table>
            </div>
          </div>
        `,
      }).catch((emailErr) => {
        // Log but don't fail the request if email errors
        console.error("Resend email error:", emailErr);
      });
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
