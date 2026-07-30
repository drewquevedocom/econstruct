import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const INSTANTLY_API = 'https://api.instantly.ai/api/v2';
// Hot-lead notifications go to every address listed in HOT_LEAD_NOTIFY_EMAILS
// (comma-separated). FRANK_EMAIL is kept as a fallback for the legacy single-address setup.
const HOT_LEAD_NOTIFY_EMAILS = (process.env.HOT_LEAD_NOTIFY_EMAILS || process.env.FRANK_EMAIL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// ── Supabase client ──────────────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";
  if (!url || !key) return null;
  return createClient(url, key);
}

async function createPartnerReplyTask(
  supabase: SupabaseClient,
  partnerLeadId: string,
  params: { sentiment: string; summary: string; replyText: string }
) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: partner, error: partnerError } = await supabase
    .from('partner_leads')
    .select('id, partner_name, notes')
    .eq('id', partnerLeadId)
    .maybeSingle();

  if (partnerError || !partner) {
    console.error('Partner reply lookup error:', partnerError);
    return;
  }

  const notes = [
    partner.notes,
    `${today}: Instantly reply classified as ${params.sentiment}. ${params.summary} Reply preview: ${params.replyText.slice(0, 300)}`,
  ]
    .filter(Boolean)
    .join('\n');

  // Move to "Replied" stage — surfaces in the Replied column of the Kanban
  // so Frank knows to review and decide whether to send the agreement.
  await supabase
    .from('partner_leads')
    .update({
      status: 'Replied',
      last_contact_date: today,
      next_follow_up_date: today, // due today — Frank should act same day
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', partnerLeadId);

  await supabase.from('partner_tasks').insert({
    partner_lead_id: partnerLeadId,
    title: `Review reply from ${partner.partner_name} — send agreement if interested`,
    due_date: today,
  });
}

const PARTNER_INTEL_RULES: Array<{ partnerType: string; patterns: RegExp[] }> = [
  {
    partnerType: 'Architect',
    patterns: [/architect/i, /architecture/i, /design studio/i, /design firm/i, /architectural/i],
  },
  {
    partnerType: 'Realtor / Real Estate Agent',
    patterns: [/realtor/i, /real estate agent/i, /real estate broker/i, /broker/i, /listing agent/i],
  },
  {
    partnerType: 'Insurance Agent / Adjuster',
    patterns: [/adjuster/i, /insurance agent/i, /claims adjuster/i, /insurance broker/i],
  },
  {
    partnerType: 'Expediter / Permit Runner',
    patterns: [/expediter/i, /permit runner/i, /permit expeditor/i],
  },
  {
    partnerType: 'Builder / General Contractor',
    patterns: [/general contractor/i, /builder/i, /gc\b/i, /construction manager/i],
  },
  {
    partnerType: 'Interior Designer',
    patterns: [/interior designer/i, /interior design/i],
  },
  {
    partnerType: 'Real Estate Attorney',
    patterns: [/real estate attorney/i, /real estate lawyer/i, /attorney/i],
  },
  {
    partnerType: 'Structural / Geotech Engineer',
    patterns: [/structural engineer/i, /geotech/i, /civil engineer/i],
  },
  {
    partnerType: 'Fire / Water Restoration',
    patterns: [/restoration/i, /water damage/i, /fire restoration/i],
  },
];

function detectPartnerIntel(text: string) {
  const haystack = text || '';
  for (const rule of PARTNER_INTEL_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return rule.partnerType;
    }
  }
  return null;
}

function displayNameFromLead(firstName: string, lastName: string, email: string) {
  const combined = `${firstName || ''} ${lastName || ''}`.trim();
  if (combined) return combined;
  return email.split('@')[0].replace(/[._-]+/g, ' ').trim() || email;
}

async function upsertPartnerIntelLead(params: {
  supabase: SupabaseClient;
  leadEmail: string;
  firstName: string;
  lastName: string;
  partnerType: string;
  replyText: string;
  summary: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();
  const displayName = displayNameFromLead(params.firstName, params.lastName, params.leadEmail);
  const notesLine = `${today}: inbound email intel suggested ${params.partnerType}. ${params.summary} Reply preview: ${params.replyText.slice(0, 300)}`;

  const { data: existing, error: lookupError } = await params.supabase
    .from('partner_leads')
    .select('id, notes, status, partner_type')
    .eq('contact_email', params.leadEmail)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Partner intel lookup failed: ${lookupError.message}`);
  }

  if (existing?.id) {
    const notes = [existing.notes, notesLine].filter(Boolean).join('\n');
    const updates: Record<string, string> = {
      status: existing.status === 'Active Partner' ? existing.status : 'Contacted',
      last_contact_date: today,
      next_follow_up_date: today,
      notes,
      updated_at: nowIso,
    };

    if (!existing.partner_type || existing.partner_type === 'Other') {
      updates.partner_type = params.partnerType;
    }

    const { error } = await params.supabase.from('partner_leads').update(updates).eq('id', existing.id);
    if (error) throw new Error(`Partner intel update failed: ${error.message}`);

    await params.supabase.from('partner_tasks').insert({
      partner_lead_id: existing.id,
      title: `Review inbound email intel from ${displayName}`,
      due_date: today,
    });

    return { created: false, partnerLeadId: existing.id };
  }

  const { data: lead, error } = await params.supabase
    .from('partner_leads')
    .insert({
      partner_name: displayName,
      company_firm: null,
      partner_type: params.partnerType,
      specialization: null,
      source: 'Inbound / Found Us',
      contact_email: params.leadEmail,
      contact_phone: null,
      linkedin_url: null,
      how_we_met: 'Inbound email intel',
      referral_agreement_status: 'Not Started',
      referral_fee: 0,
      notes: notesLine,
      next_follow_up_date: today,
      assigned_to: 'Drew Quevedo',
      status: 'New Lead',
    })
    .select('id')
    .single();

  if (error || !lead) {
    throw new Error(`Partner intel insert failed: ${error?.message || 'unknown error'}`);
  }

  await params.supabase.from('partner_tasks').insert({
    partner_lead_id: lead.id,
    title: `Review inbound email intel from ${displayName}`,
    due_date: today,
  });

  return { created: true, partnerLeadId: lead.id };
}

// ── Classify reply sentiment using Claude ────────────────────────────────────
// Cheap OOO/auto-reply detector that runs BEFORE the AI call: it works even
// when ANTHROPIC_API_KEY is missing/out of credits (where classifyReply
// returns 'unknown' and vacation responders used to be treated — and
// counted — as real replies).
function looksLikeAutoReply(text: string): boolean {
  return /\b(out of (the )?office|automatic reply|auto-?reply|auto-?response|away from (the )?office|on vacation|on holiday|annual leave|parental leave|maternity leave|paternity leave|back in (the )?office|will (be )?return(ing)?( on| to)?|limited access to (my )?email|currently (out|away|traveling|travelling))\b/i.test(
    text
  );
}

async function classifyReply(replyText: string): Promise<{
  sentiment: 'interested' | 'not_interested' | 'question' | 'out_of_office' | 'unknown';
  confidence: number;
  summary: string;
}> {
  if (looksLikeAutoReply(replyText)) {
    return { sentiment: 'out_of_office', confidence: 95, summary: 'Auto-reply / out-of-office message.' };
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set — skipping AI classification');
    return { sentiment: 'unknown', confidence: 0, summary: 'No API key configured' };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Classify this email reply from a construction lead. Reply with JSON only.

Categories:
- "interested" = wants to talk, schedule a call, learn more, get a quote
- "not_interested" = declines, already has a contractor, not selling, etc.
- "question" = asks a question but hasn't committed to interest
- "out_of_office" = auto-reply, vacation, OOO message

Reply text:
"""
${replyText.slice(0, 1000)}
"""

Respond with ONLY valid JSON: {"sentiment":"<category>","confidence":<0-100>,"summary":"<one sentence>"}`,
      }],
    }),
  });

  const data = await res.json();
  const text = data?.content?.[0]?.text || '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { sentiment: 'unknown', confidence: 0, summary: text.slice(0, 100) };
  }
}

// ── Send handoff email to hot-lead recipients via Instantly reply API ───────
async function notifyHotLead(lead: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  property?: string;
  replyText: string;
  sentiment: string;
  summary: string;
  campaignName?: string;
}) {
  if (HOT_LEAD_NOTIFY_EMAILS.length === 0) {
    console.warn('HOT_LEAD_NOTIFY_EMAILS / FRANK_EMAIL not set — skipping handoff notification');
    return;
  }

  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;

  const toList = HOT_LEAD_NOTIFY_EMAILS.join(',');
  console.log('=== HOT LEAD HANDOFF ===');
  console.log(`To: ${toList}`);
  console.log(`Lead: ${lead.firstName} ${lead.lastName} <${lead.email}>`);
  console.log(`Property: ${lead.property}`);
  console.log(`Sentiment: ${lead.sentiment} — ${lead.summary}`);
  console.log('========================');

  // Subject + headline reflect the sentiment when available, or just say "Partner Reply" otherwise.
  const sentimentNorm = (lead.sentiment || 'unknown').toLowerCase();
  const isInterested = sentimentNorm === 'interested';
  const isUnknown = sentimentNorm === 'unknown' || sentimentNorm === '';
  const subjectPrefix = isInterested
    ? '🔥 HOT LEAD'
    : isUnknown
      ? '📬 PARTNER REPLY'
      : `📬 REPLY (${sentimentNorm})`;
  const headlineColor = isInterested ? '#0E7C5C' : '#B8963E';
  const sentimentBadge = isInterested
    ? `<strong style="color:#0E7C5C;">${lead.sentiment}</strong>`
    : isUnknown
      ? `<strong style="color:#B8963E;">AI classification unavailable</strong>`
      : `<strong style="color:#B8963E;">${lead.sentiment}</strong>`;

  try {
    const res = await fetch(`${INSTANTLY_API}/emails/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eaccount: 'info@econstructllc.com',
        to_address_email_list: toList,
        subject: `${subjectPrefix}: ${lead.firstName} ${lead.lastName} — ${lead.replyText.slice(0, 60).replace(/\n/g, ' ')}…`,
        body: {
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;">
              <h2 style="color:${headlineColor};">${subjectPrefix}</h2>
              <p><strong>${lead.firstName} ${lead.lastName}</strong> replied to our outreach — sentiment: ${sentimentBadge}.</p>
              <div style="background:#f5f5f0;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid ${headlineColor};">
                <p style="margin:0;font-style:italic;">"${lead.replyText.slice(0, 1500)}"</p>
              </div>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Email</td><td style="padding:6px 12px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
                ${lead.phone ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Phone</td><td style="padding:6px 12px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : ''}
                ${lead.property ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Property</td><td style="padding:6px 12px;">${lead.property}</td></tr>` : ''}
                <tr><td style="padding:6px 12px;font-weight:bold;color:#666;">AI Summary</td><td style="padding:6px 12px;">${lead.summary}</td></tr>
              </table>
              <p style="color:#666;font-size:13px;">Reply directly to the lead's email above. Follow-up task auto-created in <a href="https://econstructhomes.com/crm/partners">/crm/partners</a>.</p>
            </div>
          `,
        },
      }),
    });
    const data = await res.json();
    console.log('Hot lead notification sent:', data);
  } catch (err) {
    console.error('Failed to send hot lead notification:', err);
  }

  const supabase = getSupabase();
  if (supabase) {
    // 'handoff_hot_lead' is what the daily report counts as "Interested
    // replies (hot)" — only log it when the AI actually said interested.
    await supabase.from('lead_events').insert([{
      lead_email: lead.email,
      event_type: isInterested ? 'handoff_hot_lead' : 'reply_notified',
      payload: {
        notify_emails: HOT_LEAD_NOTIFY_EMAILS,
        sentiment: lead.sentiment,
        summary: lead.summary,
        reply_preview: lead.replyText.slice(0, 500),
      },
      created_at: new Date().toISOString(),
    }]).then(({ error }) => {
      if (error) console.error('Supabase handoff log error:', error);
    });
  }
}

// ── Unsubscribe handler ─────────────────────────────────────────────────────
async function handleUnsubscribe(params: {
  supabase: SupabaseClient;
  partnerLeadId: string;
  leadEmail: string;
  firstName: string;
  lastName: string;
  campaignName: string;
}) {
  const { supabase, partnerLeadId, leadEmail, firstName, lastName, campaignName } = params;
  const today = new Date().toISOString().slice(0, 10);

  // Try lookup by partnerLeadId first (custom var), fall back to email match.
  type PartnerLead = {
    id: string;
    partner_name: string;
    contact_email: string | null;
    notes: string | null;
    partner_type: string;
  };
  let partner: PartnerLead | null = null;

  if (partnerLeadId) {
    const { data } = await supabase
      .from('partner_leads')
      .select('id, partner_name, contact_email, notes, partner_type')
      .eq('id', partnerLeadId)
      .maybeSingle();
    partner = data as PartnerLead | null;
  }
  if (!partner && leadEmail) {
    const { data } = await supabase
      .from('partner_leads')
      .select('id, partner_name, contact_email, notes, partner_type')
      .eq('contact_email', leadEmail.toLowerCase())
      .maybeSingle();
    partner = data as PartnerLead | null;
  }

  if (!partner) {
    console.warn(`Unsubscribe: no partner found for email=${leadEmail} id=${partnerLeadId}`);
    return;
  }

  const notes = [
    partner.notes,
    `${today}: UNSUBSCRIBED via Instantly${campaignName ? ' (' + campaignName + ')' : ''}. Status set to Inactive. Do not re-contact.`,
  ]
    .filter(Boolean)
    .join('\n');

  await supabase
    .from('partner_leads')
    .update({
      status: 'Inactive',
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', partner.id);

  await supabase.from('partner_tasks').insert({
    partner_lead_id: partner.id,
    title: `Unsubscribed — verify suppression in Instantly for ${partner.partner_name}`,
    due_date: today,
  });

  await notifyUnsubscribe({
    email: partner.contact_email || leadEmail,
    name: partner.partner_name || `${firstName} ${lastName}`.trim() || leadEmail,
    partnerType: partner.partner_type || 'Unknown',
    campaignName,
  });
}

async function notifyUnsubscribe(params: {
  email: string;
  name: string;
  partnerType: string;
  campaignName: string;
}) {
  if (HOT_LEAD_NOTIFY_EMAILS.length === 0) return;
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;

  try {
    await fetch(`${INSTANTLY_API}/emails/test`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eaccount: 'info@econstructllc.com',
        to_address_email_list: HOT_LEAD_NOTIFY_EMAILS.join(','),
        subject: `🚫 Unsubscribe: ${params.name} (${params.partnerType}) opted out`,
        body: {
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;color:#222;">
            <h2 style="color:#B91C1C;margin-top:0;">Partner Unsubscribed</h2>
            <p><strong>${params.name}</strong> (<a href="mailto:${params.email}">${params.email}</a>) opted out of econstruct cold outreach.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#FAF9F6;border-radius:8px;">
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Partner Type</td><td style="padding:8px 12px;">${params.partnerType}</td></tr>
              ${params.campaignName ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#666;">Campaign</td><td style="padding:8px 12px;">${params.campaignName}</td></tr>` : ''}
              <tr><td style="padding:8px 12px;font-weight:bold;color:#666;">CRM Action</td><td style="padding:8px 12px;color:#0E7C5C;">✓ Status set to Inactive · Follow-up task created · Auto-suppressed from future sends</td></tr>
            </table>
            <p style="color:#666;font-size:13px;">Instantly auto-blocklists this address — they will not receive any further emails from us. View in <a href="https://econstructhomes.com/crm/partners" style="color:#B8963E;">/crm/partners</a>.</p>
          </div>`,
        },
      }),
    });
  } catch (err) {
    console.error('Failed to send unsubscribe notification:', err);
  }
}

// ── Webhook handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('Instantly webhook received:', JSON.stringify(payload).slice(0, 1000));

    // Extract fields from Instantly webhook payload
    const eventType = payload.event_type || payload.type || '';
    const leadEmail = payload.lead_email || payload.email || payload.to_address_email || '';
    const replyText = payload.reply_text || payload.text_body || payload.body || payload.email_body || '';
    const campaignId = payload.campaign_id || payload.campaign || '';
    const firstName = payload.first_name || payload.lead_first_name || '';
    const lastName = payload.last_name || payload.lead_last_name || '';
    const phone = payload.phone || '';
    const property = payload.variables?.property || payload.custom_variables?.property || '';
    const partnerLeadId =
      payload.variables?.crm_partner_id ||
      payload.custom_variables?.crm_partner_id ||
      payload.lead?.custom_variables?.crm_partner_id ||
      '';

    // Log every event to Supabase
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('lead_events').insert([{
        lead_email: leadEmail,
        event_type: eventType,
        campaign_id: campaignId,
        payload,
        created_at: new Date().toISOString(),
      }]).then(({ error }) => {
        if (error) console.error('Supabase event log error:', error);
      });
    }

    // Unsubscribe events — set status=Inactive, create task, notify Drew + Frank
    if (
      eventType === 'lead_unsubscribed' ||
      eventType === 'unsubscribed' ||
      eventType === 'lead_unsubscribe' ||
      eventType === 'unsubscribe'
    ) {
      if (supabase) {
        await handleUnsubscribe({
          supabase,
          partnerLeadId,
          leadEmail,
          firstName,
          lastName,
          campaignName: payload.campaign_name || payload.campaign_title || '',
        });
      }
      return NextResponse.json({ success: true, event: eventType, handled: 'unsubscribe' });
    }

    // Only process reply events for AI classification
    if (eventType === 'reply_received' && replyText) {
      console.log(`Reply from ${leadEmail}: ${replyText.slice(0, 200)}`);

      const classification = await classifyReply(replyText);
      console.log('AI classification:', classification);
      const isAutoReply = classification.sentiment === 'out_of_office';

      // Log the reply. Event type matters: the daily report counts
      // 'reply_received' as "Replies received", so OOO/vacation responders
      // get their own type and never inflate that number.
      if (supabase) {
        const { error } = await supabase.from('lead_events').insert([{
          lead_email: leadEmail,
          event_type: isAutoReply ? 'auto_reply_received' : 'reply_received',
          campaign_id: campaignId,
          payload: { ...classification, reply_preview: replyText.slice(0, 500) },
          created_at: new Date().toISOString(),
        }]);
        if (error) console.error('lead_events reply log error:', error);
      }

      if (isAutoReply) {
        // Don't flip the partner to "Replied", don't create a review task,
        // and don't email Frank — a vacation responder is not a response.
        // Leave a breadcrumb on the partner record and stop here.
        if (supabase && partnerLeadId) {
          const today = new Date().toISOString().slice(0, 10);
          const { data: partner } = await supabase
            .from('partner_leads')
            .select('notes')
            .eq('id', partnerLeadId)
            .maybeSingle();
          await supabase
            .from('partner_leads')
            .update({
              notes: [partner?.notes, `${today}: auto-reply (out of office) received — not counted as a response.`]
                .filter(Boolean)
                .join('\n'),
              updated_at: new Date().toISOString(),
            })
            .eq('id', partnerLeadId);
        }
        return NextResponse.json({ success: true, event: eventType, handled: 'auto_reply' });
      }

      if (supabase && partnerLeadId) {
        await createPartnerReplyTask(supabase, partnerLeadId, {
          sentiment: classification.sentiment ?? 'unknown',
          summary: classification.summary ?? 'AI classification unavailable',
          replyText,
        });
      }

      const partnerIntelType = detectPartnerIntel(
        [payload.subject, payload.campaign_name, payload.campaign_title, replyText, firstName, lastName]
          .filter(Boolean)
          .join(' ')
      );

      if (supabase && partnerIntelType && leadEmail) {
        const intelResult = await upsertPartnerIntelLead({
          supabase,
          leadEmail,
          firstName,
          lastName,
          partnerType: partnerIntelType,

          replyText,
          summary: classification.summary ?? 'AI classification unavailable',
        });

        await supabase.from('lead_events').insert([{
          lead_email: leadEmail,
          event_type: 'partner_intel_captured',
          campaign_id: campaignId,
          payload: {
            partner_type: partnerIntelType,
            created: intelResult.created,
            reply_preview: replyText.slice(0, 500),
            summary: classification.summary ?? 'AI classification unavailable',
          },
          created_at: new Date().toISOString(),
        }]);
      }

      // Fire the alert on EVERY reply, not just AI-classified-interested ones.

      // rate-limited, or out of credits, we still need Frank + marketing to
      // see the reply land in their inbox. Better to surface a "not interested"
      // sometimes than miss a real hot lead because the AI threw 400.
      await notifyHotLead({
        email: leadEmail,
        firstName,
        lastName,
        phone,
        property,
        replyText,
        sentiment: classification.sentiment ?? 'unknown',
        summary:
          classification.summary ??
          'AI classification unavailable — check ANTHROPIC_API_KEY credit balance',
      });

      // If AI confirmed interested → also flip Instantly's internal lead status.
      if (classification.sentiment === 'interested') {
        const apiKey = process.env.INSTANTLY_API_KEY;
        if (apiKey && leadEmail && campaignId) {
          await fetch(`${INSTANTLY_API}/leads/status/update`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: leadEmail,
              campaign: campaignId,
              new_interest_status: 1, // interested
            }),
          }).catch(err => console.error('Lead status update error:', err));
        }
      }
    }

    return NextResponse.json({ success: true, event: eventType });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Allow GET for webhook verification (some services ping GET first)
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'econstruct-instantly-webhook' });
}
