import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const maxDuration = 30;

// DEV MODE — swap these when going live:
// const ALERT_TO = "frank@econstructinc.com";
// const ALERT_CC = ["marketing@econstructinc.com", "robyn@econstructinc.com"];
const ALERT_TO = "marketing@econstructinc.com";
const ALERT_CC: string[] = [];

// SMS goes to Frank only
const FRANK_PHONE = "+13108444656";

async function sendSms(to: string, text: string) {
  const apiKey = process.env.TELNYX_API_KEY;
  const from = process.env.TELNYX_FROM_NUMBER;
  if (!apiKey || !from) return; // Telnyx not configured — skip silently

  await fetch("https://api.telnyx.com/v2/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, text }),
  });
}

async function sendHotLeadAlert(lead: any) {
  const name =
    lead.first_name && lead.last_name
      ? `${lead.first_name} ${lead.last_name}`
      : lead.owner_name ?? "Unknown";
  const address = lead.address ?? lead.zip_code ?? "N/A";
  const value = lead.property_value
    ? `$${Number(lead.property_value).toLocaleString()}`
    : "TBD";
  const score = lead.lead_score ?? "—";

  // Email via Resend
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails
      .send({
        from: "econstruct Alerts <no-reply@econstructinc.com>",
        to: ALERT_TO,
        cc: ALERT_CC,
        subject: `🔥 Hot Lead Alert — ${name} (Score ${score}/100)`,
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
          <div style="background:#07090c;padding:24px 32px;border-radius:12px 12px 0 0;">
            <p style="color:#d9b661;font-weight:700;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">econstruct Inc. — Hot Lead</p>
            <h1 style="color:#ffffff;font-size:22px;margin:8px 0 0;">Score ${score}/100 — Action Required</h1>
          </div>
          <div style="background:#f8f6f2;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e2db;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;font-size:13px;color:#666;width:40%;font-weight:600;">Name</td><td style="padding:8px 0;font-size:14px;">${name}</td></tr>
              <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Address</td><td style="padding:8px 0;font-size:14px;">${address}</td></tr>
              <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Lead Score</td><td style="padding:8px 0;font-size:14px;font-weight:700;color:#c9a227;">${score} / 100</td></tr>
              <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Source</td><td style="padding:8px 0;font-size:14px;">${lead.source ?? "Unknown"}</td></tr>
              ${lead.fire_damage_status ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Fire Status</td><td style="padding:8px 0;font-size:14px;">${lead.fire_damage_status}</td></tr>` : ""}
              <tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Property Value</td><td style="padding:8px 0;font-size:14px;">${value}</td></tr>
              ${lead.email ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>` : ""}
              ${lead.phone ? `<tr><td style="padding:8px 0;font-size:13px;color:#666;font-weight:600;">Phone</td><td style="padding:8px 0;font-size:14px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : ""}
            </table>
          </div>
        </div>
      `,
      })
      .catch((err) => console.error("Resend hot lead alert error:", err));
  }

  // SMS via Telnyx to Frank only
  const smsBody = `🔥 HOT LEAD (${score}/100)\n${name}\n${address}\nSrc: ${lead.source ?? "unknown"}\nReach out NOW — econstruct`;
  await sendSms(FRANK_PHONE, smsBody);
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("sla-alert", async () => {
    const supabase = createServiceClient();

    // Hot leads: score > 85, lifecycle = 'new', created in last 10 min, not yet alerted
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: hotLeads, error } = await supabase
      .from("leads")
      .select("*")
      .gt("lead_score", 85)
      .eq("lifecycle_stage", "new")
      .gte("created_at", tenMinAgo)
      .limit(20);

    if (error) throw new Error(`Failed to fetch hot leads: ${error.message}`);
    if (!hotLeads?.length) return { records_pulled: 0 };

    let alerted = 0;
    for (const lead of hotLeads) {
      // Check if already alerted
      const { data: existing } = await supabase
        .from("lead_activities")
        .select("id")
        .eq("lead_id", lead.id)
        .eq("type", "sla_alert_sent")
        .single();

      if (existing) continue;

      await sendHotLeadAlert(lead);

      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        type: "sla_alert_sent",
        channel: "email_sms",
        metadata: { score: lead.lead_score },
      });

      alerted++;
    }

    return { records_pulled: hotLeads.length, records_updated: alerted };
  });

  return Response.json(result);
}
