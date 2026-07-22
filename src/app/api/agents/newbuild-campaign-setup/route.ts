export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";
const TEMPLATE_CAMPAIGN_ID = "e053a38e-fde2-47d7-9841-ed62e568a068"; // Brentwood Luxury

function validateCronSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

// One-time setup: creates "econstruct — New Construction Outreach" cloned
// from Brentwood Luxury's schedule/sending accounts, with copy scoped to
// LADBS new-construction permit leads countywide — no neighborhood framing,
// no fire-rebuild language. Safe to re-run — returns the existing campaign
// if a campaign with this name already exists.
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
    const name = "econstruct — New Construction Outreach";

    const listRes = await fetch(`${INSTANTLY_API}/campaigns?limit=100`, { headers });
    const listData = (await listRes.json()) as { items?: Array<{ id: string; name: string }> };
    const existing = listData.items?.find((c) => c.name === name);
    if (existing) {
      return Response.json({ ok: true, alreadyExists: true, campaignId: existing.id });
    }

    const srcRes = await fetch(`${INSTANTLY_API}/campaigns/${TEMPLATE_CAMPAIGN_ID}`, { headers });
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
                subject: "Building options for {{property}}",
                body: `<div>Hi there,</div><div><br /></div><div>I'm Frank with econstruct Inc, a licensed general contractor (CA #964015) based in Los Angeles.</div><div><br /></div><div>I came across the recent permit activity at {{property}} and wanted to reach out. Whether you're finishing out a new build, planning an addition, or scoping the next phase, we handle everything from design coordination through final inspection.</div><div><br /></div><div>Projects in this range ({{value}}) are exactly what we specialize in — happy to walk through what's realistic for scope, timeline, and budget.</div><div><br /></div><div>Open to a quick 15-minute call this week or next?</div><div><br /></div><div>Best,</div><div>Frank Neimroozi</div><div>econstruct Inc.</div><div>License: CA #964015</div><div>Phone: (661) 299-9836</div>`,
              },
            ],
          },
          {
            type: "email",
            delay: 4,
            variants: [
              {
                subject: "",
                body: `<div>Following up on {{property}} — if the timing isn't right now, no worries. We work across LA County on new construction, additions, and remodels, and I'm glad to be a resource whenever the next phase comes up.</div><div><br /></div><div>Best,</div><div>Frank</div>`,
              },
            ],
          },
          {
            type: "email",
            delay: 8,
            variants: [
              {
                subject: "",
                body: `<div>Last note on this one — if a GC conversation is useful down the line, keep econstruct in mind. We handle design-build, permitting, and construction end to end.</div><div><br /></div><div>Best,</div><div>Frank Neimroozi</div><div>econstruct Inc. — CA #964015</div>`,
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
