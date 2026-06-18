import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import crypto from "node:crypto";

export const maxDuration = 30;

function generateReferralCode(partnerName: string): string {
  const cleanName = partnerName
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 5)
    .toUpperCase();
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${cleanName || "PARTNER"}-${suffix}`;
}

function generateToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

async function sendAgreementEmail(params: {
  toEmail: string;
  partnerName: string;
  partnerType: string | null;
  referralCode: string;
  agreementToken: string;
  baseUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");

  const from =
    process.env.DAILY_REPORT_FROM?.replace("CRM", "Partner Agreement") ||
    "Frank at econstruct <onboarding@resend.dev>";

  const agreeUrl = `${params.baseUrl}/partners/agree/${params.agreementToken}`;
  const firstName = params.partnerName.split(/\s+/)[0] || params.partnerName;

  const html = `<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Hi ${firstName},</p>

<p>Glad to officially welcome you into the econstruct referral network. Here's the deal in plain English — no lawyer-speak, no fine print.</p>

<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:18px 0;border-collapse:collapse;background:#FAF9F6;border-radius:10px;">
<tr><td style="padding:14px 18px;">
<p style="margin:0 0 8px 0;"><strong>What you do:</strong> Send qualified leads our way when your client needs a GC for a luxury rebuild, new build, ADU, or post-fire reconstruction in LA County.</p>
<p style="margin:8px 0;"><strong>What we do:</strong> Close the contract, deliver the project to your client's standard, and pay you a flat <strong style="color:#B8963E;">$5,000 referral fee</strong> within 30 days of the GC contract signing.</p>
<p style="margin:8px 0;"><strong>How we track it:</strong> Every referral you send gets tagged to your unique code below. Share it with your client at intro, or just CC me on the intro email and I'll handle the rest.</p>
<p style="margin:8px 0;"><strong>What you don't have to do:</strong> No exclusivity. No minimums. No monthly fees. Send us 1 or 50 — same terms either way.</p>
<p style="margin:8px 0 0 0;"><strong>You can leave anytime.</strong> Just email me — no notice required.</p>
</td></tr>
</table>

<p>Your referral code:</p>

<div style="margin:6px 0 18px 0;padding:14px 18px;background:#1C1C1E;color:#FFF8E7;border-radius:10px;text-align:center;">
<p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#D4B96A;">Your Code</p>
<p style="margin:6px 0 0 0;font-size:24px;font-weight:900;letter-spacing:0.06em;font-family:'SF Mono',Menlo,Consolas,monospace;">${params.referralCode}</p>
</div>

<p>Click below to count yourself in. That's the whole agreement.</p>

<p style="margin:20px 0;">
<a href="${agreeUrl}" style="display:inline-block;padding:14px 28px;background:#B8963E;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;border-radius:8px;">I AGREE — COUNT ME IN</a>
</p>

<p style="font-size:12px;color:#666;">If the button doesn't work, paste this into your browser: <a href="${agreeUrl}" style="color:#B8963E;word-break:break-all;">${agreeUrl}</a></p>

<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
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
      to: params.toEmail,
      reply_to: "frank@econstructinc.com",
      subject: `Welcome to econstruct, ${firstName} — quick partnership agreement`,
      html,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body;
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { partner_lead_id?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.partner_lead_id && !body.email) {
    return NextResponse.json({ error: "partner_lead_id or email required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const query = supabase
    .from("partner_leads")
    .select(
      "id, partner_name, partner_type, contact_email, status, referral_code, agreement_token, agreement_sent_at"
    );
  const { data: partner, error } = body.partner_lead_id
    ? await query.eq("id", body.partner_lead_id).maybeSingle()
    : await query.eq("contact_email", (body.email || "").toLowerCase()).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!partner) return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  if (!partner.contact_email) {
    return NextResponse.json({ error: "Partner has no contact_email" }, { status: 400 });
  }

  const referralCode = partner.referral_code || generateReferralCode(partner.partner_name);
  const agreementToken = partner.agreement_token || generateToken();

  await supabase
    .from("partner_leads")
    .update({
      referral_code: referralCode,
      agreement_token: agreementToken,
      agreement_sent_at: new Date().toISOString(),
      referral_agreement_status: "Sent",
      status: partner.status === "New Lead" ? "Agreement Sent" : partner.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", partner.id);

  const baseUrl = process.env.PUBLIC_BASE_URL || "https://econstructhomes.com";
  try {
    const sendResult = await sendAgreementEmail({
      toEmail: partner.contact_email,
      partnerName: partner.partner_name,
      partnerType: partner.partner_type,
      referralCode,
      agreementToken,
      baseUrl,
    });
    return NextResponse.json({
      sent: true,
      partner_lead_id: partner.id,
      referral_code: referralCode,
      agreement_token: agreementToken,
      agree_url: `${baseUrl}/partners/agree/${agreementToken}`,
      resend_id: sendResult?.id ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), partner_lead_id: partner.id },
      { status: 502 }
    );
  }
}
