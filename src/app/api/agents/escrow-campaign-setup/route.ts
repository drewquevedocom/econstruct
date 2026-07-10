export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";
const ATTORNEY_CAMPAIGN_ID = "ec973032-17b6-48a2-aa79-e229964fe215";

function validateCronSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

// One-time setup: creates the "ECON — Partners — Escrow Officers" campaign by
// cloning the attorney campaign's schedule and sending accounts, with
// escrow-specific copy. Safe to re-run — refuses if a campaign with the same
// name already exists. Remove this route once the campaign ID is hardcoded
// in partner-enroll.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "INSTANTLY_API_KEY not set" }, { status: 500 });
  }
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  try {
    const name = "ECON — Partners — Escrow Officers";

    const listRes = await fetch(`${INSTANTLY_API}/campaigns?limit=100`, { headers });
    const listData = (await listRes.json()) as { items?: Array<{ id: string; name: string }> };
    const existing = listData.items?.find((c) => c.name === name);
    if (existing) {
      return Response.json({ ok: true, alreadyExists: true, campaignId: existing.id });
    }

    const srcRes = await fetch(`${INSTANTLY_API}/campaigns/${ATTORNEY_CAMPAIGN_ID}`, { headers });
    if (!srcRes.ok) {
      throw new Error(`Fetch source campaign ${srcRes.status}: ${(await srcRes.text()).slice(0, 300)}`);
    }
    const src = (await srcRes.json()) as Record<string, unknown>;

    const sequences = [
      {
        steps: [
          {
            type: "email",
            delay: 0,
            variants: [
              {
                subject: "quick question {{firstName}}",
                body: `Hi {{firstName}},<br><br>I handle partnerships at econstruct, a licensed LA general contractor (CA #964015) focused on luxury remodels, ADUs, and fire rebuilds across Los Angeles.<br><br>Escrow officers are usually first to know when a closing hinges on repairs, unpermitted work, or lender-required fixes. When that comes up, we give your clients fast walkthroughs, real bids within 48 hours, and clean permit resolution — so COE doesn't slip.<br><br>We also pay referral fees to our escrow partners. Open to a quick intro call this week?<br><br>Drew<br>econstruct — Partnerships`,
              },
            ],
          },
          {
            type: "email",
            delay: 3,
            variants: [
              {
                subject: "",
                body: `{{firstName}} — following up. Two ways we help escrow teams keep deals on track: pre-close repair bids within 48 hours, and Section 1 / lender-required work executed on timelines that don't blow up closing dates.<br><br>Worth a 10-minute call?<br><br>Drew`,
              },
            ],
          },
          {
            type: "email",
            delay: 4,
            variants: [
              {
                subject: "",
                body: `{{firstName}}, last note from me. If a transaction ever stalls on repair credits, permits, or fire-damage scope, keep econstruct in your back pocket — we specialize in exactly those saves.<br><br>Either way, good luck with the summer closings.<br><br>Drew<br>econstruct — Partnerships`,
              },
            ],
          },
        ],
      },
    ];

    const createRes = await fetch(`${INSTANTLY_API}/campaigns`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        campaign_schedule: src.campaign_schedule,
        email_list: src.email_list ?? [],
        sequences,
        daily_limit: src.daily_limit,
        stop_on_reply: true,
        link_tracking: false,
        open_tracking: false,
      }),
    });
    const created = (await createRes.json()) as { id?: string };
    if (!createRes.ok) {
      throw new Error(`Create campaign ${createRes.status}: ${JSON.stringify(created).slice(0, 500)}`);
    }

    return Response.json({ ok: true, campaignId: created.id, name });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
