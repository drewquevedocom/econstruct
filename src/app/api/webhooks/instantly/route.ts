import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const INSTANTLY_API = 'https://api.instantly.ai/api/v2';
const FRANK_EMAIL = process.env.FRANK_EMAIL || '';

// ── Supabase client ──────────────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── Classify reply sentiment using Claude ────────────────────────────────────
async function classifyReply(replyText: string): Promise<{
  sentiment: 'interested' | 'not_interested' | 'question' | 'out_of_office' | 'unknown';
  confidence: number;
  summary: string;
}> {
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

// ── Send handoff email to Frank via Instantly reply API ─────────────────────
async function notifyFrank(lead: {
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
  if (!FRANK_EMAIL) {
    console.warn('FRANK_EMAIL not set — skipping handoff notification');
    return;
  }

  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;

  console.log('=== WARM LEAD HANDOFF ===');
  console.log(`To: ${FRANK_EMAIL}`);
  console.log(`Lead: ${lead.firstName} ${lead.lastName} <${lead.email}>`);
  console.log(`Property: ${lead.property}`);
  console.log(`Sentiment: ${lead.sentiment} — ${lead.summary}`);
  console.log('========================');

  // Send Frank a notification email via Instantly test email API
  try {
    const res = await fetch(`${INSTANTLY_API}/emails/test`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eaccount: 'info@econstructllc.com',
        to_address_email_list: FRANK_EMAIL,
        subject: `Warm Lead: ${lead.firstName} ${lead.lastName} at ${lead.property || 'property'} — replied interested`,
        body: {
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;">
              <h2 style="color:#B8860B;">Warm Lead Alert</h2>
              <p><strong>${lead.firstName} ${lead.lastName}</strong> replied to our outreach and the AI classified them as <strong style="color:green;">${lead.sentiment}</strong>.</p>
              <div style="background:#f5f5f0;padding:16px;border-radius:8px;margin:16px 0;border-left:4px solid #B8860B;">
                <p style="margin:0;font-style:italic;">"${lead.replyText.slice(0, 500)}"</p>
              </div>
              <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Email</td><td style="padding:6px 12px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
                ${lead.phone ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Phone</td><td style="padding:6px 12px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : ''}
                ${lead.property ? `<tr><td style="padding:6px 12px;font-weight:bold;color:#666;">Property</td><td style="padding:6px 12px;">${lead.property}</td></tr>` : ''}
                <tr><td style="padding:6px 12px;font-weight:bold;color:#666;">AI Summary</td><td style="padding:6px 12px;">${lead.summary}</td></tr>
              </table>
              <p style="color:#666;font-size:13px;">This lead was auto-classified by the econstruct AI system. Reply to the lead directly or call them to close.</p>
            </div>
          `,
        },
      }),
    });
    const data = await res.json();
    console.log('Frank notification sent:', data);
  } catch (err) {
    console.error('Failed to notify Frank:', err);
  }

  // Store handoff event in Supabase
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('lead_events').insert([{
      lead_email: lead.email,
      event_type: 'handoff_to_frank',
      payload: {
        frank_email: FRANK_EMAIL,
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

    // Only process reply events for AI classification
    if (eventType === 'reply_received' && replyText) {
      console.log(`Reply from ${leadEmail}: ${replyText.slice(0, 200)}`);

      const classification = await classifyReply(replyText);
      console.log('AI classification:', classification);

      // Log classification
      if (supabase) {
        await supabase.from('lead_events').insert([{
          lead_email: leadEmail,
          event_type: 'ai_classification',
          campaign_id: campaignId,
          payload: { ...classification, reply_preview: replyText.slice(0, 500) },
          created_at: new Date().toISOString(),
        }]);
      }

      // If interested → handoff to Frank
      if (classification.sentiment === 'interested') {
        await notifyFrank({
          email: leadEmail,
          firstName,
          lastName,
          phone,
          property,
          replyText,
          sentiment: classification.sentiment,
          summary: classification.summary,
        });

        // Update lead status in Instantly to "interested"
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
