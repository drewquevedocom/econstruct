import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

async function notifyPartnerPromotion(params: {
  partnerName: string;
  partnerType: string | null;
  contactEmail: string | null;
  company: string | null;
  referralCode: string;
}) {
  const notifyList = (process.env.HOT_LEAD_NOTIFY_EMAILS || process.env.FRANK_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (notifyList.length === 0) return;
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;
  try {
    await fetch("https://api.instantly.ai/api/v2/emails/test", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        eaccount: "info@econstructllc.com",
        to_address_email_list: notifyList.join(","),
        subject: `🎉 NEW PARTNER SIGNED: ${params.partnerName} (${params.partnerType || "Partner"})`,
        body: {
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;color:#222;">
            <h2 style="color:#0E7C5C;margin-top:0;">🎉 New Active Partner Just Signed</h2>
            <p><strong>${params.partnerName}</strong>${params.company ? ` from <strong>${params.company}</strong>` : ""} just clicked "I agree" on the referral agreement.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#FAF9F6;border-radius:8px;">
              ${params.partnerType ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Type</td><td style="padding:8px 12px;">${params.partnerType}</td></tr>` : ""}
              ${params.contactEmail ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Email</td><td style="padding:8px 12px;"><a href="mailto:${params.contactEmail}" style="color:#B8963E;">${params.contactEmail}</a></td></tr>` : ""}
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Referral Code</td><td style="padding:8px 12px;font-family:monospace;font-weight:bold;">${params.referralCode}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;">CRM Action</td><td style="padding:8px 12px;color:#0E7C5C;">✓ Status → Active Partner · Welcome + monthly check-in tasks auto-created · Promoted to Active Partners panel</td></tr>
            </table>
            <p style="color:#666;font-size:13px;">Pull them up at <a href="https://econstructhomes.com/crm/partners" style="color:#B8963E;">/crm/partners</a>.</p>
          </div>`,
        },
      }),
    });
  } catch (err) {
    console.error("Failed to notify partner promotion:", err);
  }
}

async function sendWelcomeEmail(params: {
  toEmail: string;
  partnerName: string;
  referralCode: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const from =
    process.env.DAILY_REPORT_FROM?.replace("CRM", "Partner Network") ||
    "Frank at econstruct <onboarding@resend.dev>";
  const firstName = params.partnerName.split(/\s+/)[0] || params.partnerName;
  const html = `<div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.65;color:#222;max-width:560px;">
<p>Welcome aboard, ${firstName}.</p>
<p>You're now an official econstruct referral partner. Here's everything you need to start sending referrals.</p>

<h3 style="margin:24px 0 6px 0;color:#1C1C1E;">Your referral code</h3>
<div style="padding:14px;background:#1C1C1E;color:#FFF8E7;border-radius:10px;text-align:center;">
<p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#D4B96A;">Always include this when sending a referral</p>
<p style="margin:8px 0 0 0;font-size:26px;font-weight:900;letter-spacing:0.08em;font-family:'SF Mono',Menlo,Consolas,monospace;">${params.referralCode}</p>
</div>

<h3 style="margin:24px 0 6px 0;color:#1C1C1E;">How to send a referral (3 ways)</h3>
<ol style="padding-left:20px;">
<li><strong>Easiest:</strong> CC <a href="mailto:frank@econstructinc.com" style="color:#B8963E;">frank@econstructinc.com</a> on your intro email to your client. Mention your code in the subject or body. I take it from there.</li>
<li><strong>Direct intro:</strong> Tell your client to email Frank directly and include "<strong>Referred by ${params.referralCode}</strong>" anywhere in the message.</li>
<li><strong>Text it:</strong> If your client is already on the phone with you, text me their name, project, and your code. I'll reach out within 2 hours.</li>
</ol>

<h3 style="margin:24px 0 6px 0;color:#1C1C1E;">When you get paid</h3>
<p>Flat <strong style="color:#B8963E;">$5,000</strong> within 30 days of the signed GC contract. Wire or check — your call. I'll send a 1099 at year-end.</p>

<h3 style="margin:24px 0 6px 0;color:#1C1C1E;">Questions or want to talk strategy</h3>
<p>Just reply to this email — it goes straight to my inbox. Or text me anytime.</p>

<table cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:2px solid #B8963E;padding-top:14px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;line-height:1.5;color:#222;">
<tr><td><strong>Frank Neimroozi</strong></td></tr>
<tr><td style="color:#666;">Owner · econstruct</td></tr>
<tr><td><a href="mailto:frank@econstructinc.com" style="color:#222;text-decoration:none;">frank@econstructinc.com</a></td></tr>
<tr><td><a href="https://econstructinc.com" style="color:#B8963E;text-decoration:none;">econstructinc.com</a></td></tr>
</table>
</div>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: params.toEmail,
        reply_to: "frank@econstructinc.com",
        subject: `You're in, ${firstName} — your referral code + how to send your first lead`,
        html,
      }),
    });
  } catch (err) {
    console.error("Welcome email send failed:", err);
  }
}

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const token = (body.token || "").trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const supabase = createServiceClient();
  const { data: partner, error } = await supabase
    .from("partner_leads")
    .select(
      "id, partner_name, partner_type, contact_email, company_firm, referral_code, agreement_signed_at, status"
    )
    .eq("agreement_token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!partner) return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });

  // Idempotent: if already signed, just return success with the referral code.
  if (partner.agreement_signed_at) {
    return NextResponse.json({
      already_signed: true,
      partner_name: partner.partner_name,
      referral_code: partner.referral_code,
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();
  const addDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  await supabase
    .from("partner_leads")
    .update({
      status: "Active Partner",
      referral_agreement_status: "Signed",
      date_signed: today,
      agreement_signed_at: nowIso,
      next_follow_up_date: addDays(30),
      updated_at: nowIso,
    })
    .eq("id", partner.id);

  await supabase.from("partner_tasks").insert({
    partner_lead_id: partner.id,
    title: `Welcome ${partner.partner_name} — send referral playbook, save number to phone`,
    due_date: addDays(2),
  });
  await supabase.from("partner_tasks").insert({
    partner_lead_id: partner.id,
    title: `Monthly check-in with ${partner.partner_name} — any referrals this month?`,
    due_date: addDays(30),
    is_recurring: true,
    recurrence: "monthly",
  });

  if (partner.contact_email && partner.referral_code) {
    await sendWelcomeEmail({
      toEmail: partner.contact_email,
      partnerName: partner.partner_name,
      referralCode: partner.referral_code,
    });
  }

  await notifyPartnerPromotion({
    partnerName: partner.partner_name,
    partnerType: partner.partner_type,
    contactEmail: partner.contact_email,
    company: partner.company_firm,
    referralCode: partner.referral_code ?? "",
  });

  return NextResponse.json({
    signed: true,
    partner_name: partner.partner_name,
    referral_code: partner.referral_code,
  });
}
