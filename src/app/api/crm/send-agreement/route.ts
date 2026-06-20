import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "node:crypto";

export const maxDuration = 30;

function generateReferralCode(partnerName: string): string {
  const clean = partnerName.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase();
  return `${clean || "PARTN"}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

function generateToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

// CRM-internal endpoint — validates via Supabase session cookie (same auth as the CRM pages).
// No CRON_SECRET needed; only works when logged into the CRM.
export async function POST(req: NextRequest) {
  let body: { partner_lead_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.partner_lead_id) {
    return NextResponse.json({ error: "partner_lead_id required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: partner, error } = await supabase
    .from("partner_leads")
    .select("id, partner_name, partner_type, contact_email, status, referral_code, agreement_token, agreement_sent_at")
    .eq("id", body.partner_lead_id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  if (!partner.contact_email) return NextResponse.json({ error: "Partner has no email" }, { status: 400 });

  const referralCode = partner.referral_code || generateReferralCode(partner.partner_name);
  const agreementToken = partner.agreement_token || generateToken();
  const baseUrl = process.env.PUBLIC_BASE_URL || "https://econstructhomes.com";
  const agreeUrl = `${baseUrl}/partners/agree/${agreementToken}`;
  const firstName = partner.partner_name.split(/\s+/)[0] || partner.partner_name;

  await supabase.from("partner_leads").update({
    referral_code: referralCode,
    agreement_token: agreementToken,
    agreement_sent_at: new Date().toISOString(),
    referral_agreement_status: "Sent",
    status: partner.status === "New Lead" ? "Agreement Sent" : partner.status,
    updated_at: new Date().toISOString(),
  }).eq("id", partner.id);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });

  const from = process.env.DAILY_REPORT_FROM?.replace("CRM", "Partner Agreement") || "Frank at econstruct <onboarding@resend.dev>";

  const html = `<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi ${firstName},</p>
<p>Excited to have you in our network. Here's the deal in plain English — no lawyer-speak.</p>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:18px 0;border-collapse:collapse;background:#FAF9F6;border-radius:10px;">
<tr><td style="padding:14px 18px;">
<p style="margin:0 0 8px 0;"><strong>What you do:</strong> Send qualified leads our way when your client needs a GC for a luxury rebuild, new build, ADU, or post-fire reconstruction in LA County.</p>
<p style="margin:8px 0;"><strong>What we do:</strong> Close the contract, deliver the project, and pay you a flat <strong style="color:#B8963E;">$5,000 referral fee</strong> within 30 days of the GC contract signing.</p>
<p style="margin:8px 0;"><strong>No exclusivity. No minimums. No monthly fees.</strong> Leave anytime — no notice required.</p>
</td></tr>
</table>
<p>Your referral code:</p>
<div style="margin:6px 0 18px 0;padding:14px 18px;background:#1C1C1E;color:#FFF8E7;border-radius:10px;text-align:center;">
<p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#D4B96A;">Your Code</p>
<p style="margin:6px 0 0 0;font-size:24px;font-weight:900;letter-spacing:0.06em;font-family:'SF Mono',Menlo,Consolas,monospace;">${referralCode}</p>
</div>
<p style="margin:20px 0;">
<a href="${agreeUrl}" style="display:inline-block;padding:14px 28px;background:#B8963E;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;border-radius:8px;">I AGREE — COUNT ME IN</a>
</p>
<p style="font-size:12px;color:#666;">Or paste this link: <a href="${agreeUrl}" style="color:#B8963E;word-break:break-all;">${agreeUrl}</a></p>
<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: partner.contact_email,
      reply_to: "frank@econstructinc.com",
      subject: `Welcome to econstruct, ${firstName} — quick partnership agreement`,
      html,
    }),
  });

  const resBody = await res.json();
  if (!res.ok) return NextResponse.json({ error: `Resend ${res.status}: ${JSON.stringify(resBody).slice(0, 200)}` }, { status: 502 });

  return NextResponse.json({
    sent: true,
    to: partner.contact_email,
    referral_code: referralCode,
    agree_url: agreeUrl,
    resend_id: resBody?.id ?? null,
  });
}
