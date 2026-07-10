import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

// Each partner_type routes to its own segmented Instantly campaign so the
// architect sequence goes to architects, adjuster sequence to adjusters, etc.
// Campaign UUIDs verified against the Instantly workspace 2026-07-10 via
// instantly-audit; env vars remain as overrides. Escrow campaign created
// 2026-07-10 via the one-time escrow-campaign-setup agent.
function campaignForType(type: string): string | undefined {
  const map: Record<string, string | undefined> = {
    Architect: process.env.INSTANTLY_PARTNER_CAMPAIGN_ARCHITECT || "97f518ff-27a1-475e-a9a1-7ae74d2e6df3",
    "Realtor / Real Estate Agent": process.env.INSTANTLY_PARTNER_CAMPAIGN_REALTOR || "ca4fbf88-6cb1-4eee-9aea-362b43465e76",
    "Insurance Agent / Adjuster": process.env.INSTANTLY_PARTNER_CAMPAIGN_ADJUSTER || "be462f28-7c1c-441f-b31c-2c6bccb30899",
    "Expediter / Permit Runner": process.env.INSTANTLY_PARTNER_CAMPAIGN_EXPEDITER || "f413efe9-7a93-43ff-8286-e78bdff63d18",
    "Interior Designer": process.env.INSTANTLY_PARTNER_CAMPAIGN_DESIGNER || "5a23a045-e7a0-44e1-a47c-f04fa3765142",
    "Real Estate Attorney": process.env.INSTANTLY_PARTNER_CAMPAIGN_ATTORNEY || "ec973032-17b6-48a2-aa79-e229964fe215",
    "CPA / Wealth Advisor": process.env.INSTANTLY_PARTNER_CAMPAIGN_CPA || "6fbbaeef-482c-40c2-897f-6b1227e42d79",
    "Escrow Officer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ESCROW || "0048f3ed-6928-4ecd-8ca6-83e82d16a8cf",
    "Structural / Geotech Engineer": process.env.INSTANTLY_PARTNER_CAMPAIGN_ENGINEER || "7ce7ec5b-0740-4488-88ed-a851cbbd05d1",
    "Fire / Water Restoration": process.env.INSTANTLY_PARTNER_CAMPAIGN_RESTORATION || "5ee2e1b5-830e-4f30-9900-59f901b9ce6d",
  };
  // No global fallback — undefined return skips the partner cleanly.
  // Falling through to INSTANTLY_PARTNER_CAMPAIGN_ID was hitting a
  // workspace-mismatch 403 and freezing the queue.
  return map[type];
}

// Category mix per run: top-4 partner types get ~64% of the batch, the rest
// split the remainder round-robin. Prevents FIFO starvation where whichever
// type dominates the oldest backlog monopolizes every send window.
const BATCH_SIZE = 25;
const TOP_TYPES = [
  "Architect",
  "Realtor / Real Estate Agent",
  "Insurance Agent / Adjuster",
  "Expediter / Permit Runner",
];
const TOP_SLOTS = 16; // 64% of 25
const REST_TYPES = [
  "Interior Designer",
  "Real Estate Attorney",
  "CPA / Wealth Advisor",
  "Escrow Officer",
  "Structural / Geotech Engineer",
  "Fire / Water Restoration",
];

// Instantly marks a campaign 3 (completed) when it exhausts its leads; new
// leads added to a completed campaign sit idle until it is activated again.
async function activateCampaign(campaignId: string) {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return;
  try {
    await fetch(`${INSTANTLY_API}/campaigns/${campaignId}/activate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
  } catch {
    // Activation is best-effort; enrollment itself already succeeded.
  }
}

// Pre-send verification via Instantly. Policy: hard invalids are blocked and
// retired (status Inactive) so they never re-enter the queue or re-spend a
// verification credit; everything else fails open — bounce protect remains
// the backstop. The 21.7% bounce pause on the Realtor campaign came from
// enrolling unverified emails.
type VerifyOutcome = "verified" | "invalid" | "risky" | "unknown";

async function verifyEmail(email: string): Promise<VerifyOutcome> {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) return "unknown";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${INSTANTLY_API}/email-verification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      signal: controller.signal,
    });
    if (!res.ok) return "unknown";
    const data = (await res.json()) as { verification_status?: string };
    const status = (data.verification_status || "").toLowerCase();
    if (status === "verified" || status === "valid") return "verified";
    if (status === "invalid") return "invalid";
    if (status === "risky" || status === "catch_all" || status === "accept_all") return "risky";
    return "unknown";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}

const TEMPLATE_KEY_BY_TYPE: Record<string, string> = {
  Architect: "architect_cold_intro",
  "Realtor / Real Estate Agent": "realtor_cold_intro",
  "Insurance Agent / Adjuster": "adjuster_fire_rebuild",
  "Expediter / Permit Runner": "expediter_permit_partner",
  "Interior Designer": "interior_designer_cold",
  "Real Estate Attorney": "real_estate_attorney_cold",
  "CPA / Wealth Advisor": "cpa_wealth_cold",
  "Escrow Officer": "escrow_officer_cold",
  "Structural / Geotech Engineer": "structural_engineer_cold",
  "Fire / Water Restoration": "restoration_cold",
};

async function enrollPartner(params: {
  email: string;
  firstName: string;
  lastName: string;
  campaignId: string;
  customVariables: Record<string, string | number | null>;
}) {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) throw new Error("INSTANTLY_API_KEY not set");

  const res = await fetch(`${INSTANTLY_API}/leads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      first_name: params.firstName,
      last_name: params.lastName,
      campaign: params.campaignId,
      skip_if_in_campaign: true,
      custom_variables: params.customVariables,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Instantly ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

function firstWord(value: string | null | undefined) {
  return (value || "").trim().split(/\s+/)[0] ?? "";
}

function restWords(value: string | null | undefined) {
  const parts = (value || "").trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("partner-enroll", async () => {
    // We allow per-type campaigns; require at least one to be configured.
    const anyCampaignConfigured = Boolean(
      campaignForType("Architect") ||
        campaignForType("Realtor / Real Estate Agent") ||
        campaignForType("Insurance Agent / Adjuster") ||
        campaignForType("Expediter / Permit Runner") ||
        campaignForType("Interior Designer") ||
        campaignForType("Real Estate Attorney") ||
        campaignForType("CPA / Wealth Advisor") ||
        campaignForType("Escrow Officer") ||
        campaignForType("Structural / Geotech Engineer") ||
        campaignForType("Fire / Water Restoration")
    );
    if (!anyCampaignConfigured) {
      return {
        records_pulled: 0,
        records_updated: 0,
        metadata: {
          skipped: true,
          reason: "No Instantly campaigns configured",
        },
      };
    }

    const supabase = createServiceClient();

    // Weighted pull: fetch a small FIFO window per enabled type, then fill
    // the batch by quota — top types ~64%, the rest round-robin. Unfilled
    // slots redistribute so the batch still fills when a type runs dry.
    type PartnerRow = {
      id: string;
      partner_id: string | null;
      partner_name: string | null;
      company_firm: string | null;
      partner_type: string;
      contact_email: string | null;
      contact_phone: string | null;
      source: string | null;
      status: string | null;
    };

    const enabledTop = TOP_TYPES.filter((t) => campaignForType(t));
    const enabledRest = REST_TYPES.filter((t) => campaignForType(t));
    const queues = new Map<string, PartnerRow[]>();

    for (const t of [...enabledTop, ...enabledRest]) {
      const { data, error } = await supabase
        .from("partner_leads")
        .select(
          "id, partner_id, partner_name, company_firm, partner_type, contact_email, contact_phone, source, status"
        )
        .eq("status", "New Lead")
        .eq("partner_type", t)
        .not("contact_email", "is", null)
        .order("created_at", { ascending: true })
        .limit(BATCH_SIZE);
      if (error) throw new Error(`Partner fetch failed (${t}): ${error.message}`);
      if (data?.length) queues.set(t, data as PartnerRow[]);
    }

    // Round-robin drain: top tier fills TOP_SLOTS, rest tier fills the
    // remainder; any leftover capacity goes to whichever tier still has leads.
    const drain = (types: string[], slots: number) => {
      const taken: PartnerRow[] = [];
      let idx = 0;
      let empty = 0;
      while (taken.length < slots && empty < types.length) {
        const q = queues.get(types[idx % types.length]);
        if (q?.length) {
          taken.push(q.shift()!);
          empty = 0;
        } else {
          empty++;
        }
        idx++;
      }
      return taken;
    };

    const fromTop = drain(enabledTop, TOP_SLOTS);
    const fromRest = drain(enabledRest, BATCH_SIZE - TOP_SLOTS);
    // Backfill: if either tier came up short, give remaining slots to the other.
    const backfill = drain(
      [...enabledTop, ...enabledRest],
      BATCH_SIZE - fromTop.length - fromRest.length
    );
    const partners: PartnerRow[] = [...fromTop, ...fromRest, ...backfill];

    if (!partners.length) {
      return { records_pulled: 0, records_updated: 0 };
    }

    let enrolled = 0;
    let blockedInvalid = 0;
    const verifyCounts: Record<VerifyOutcome, number> = {
      verified: 0,
      invalid: 0,
      risky: 0,
      unknown: 0,
    };
    const skippedNoCampaign: string[] = [];
    const enrolledByCampaign: Record<string, number> = {};
    const enrolledByType: Record<string, number> = {};
    const errors: string[] = [];
    const today = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();

    // Verify the whole batch in parallel up front (bounded by the 6s
    // per-call timeout) so the sequential enroll loop stays inside the
    // Worker wall clock.
    const verdicts = new Map<string, VerifyOutcome>();
    await Promise.all(
      partners.map(async (p) => {
        if (p.contact_email) {
          verdicts.set(p.id, await verifyEmail(p.contact_email));
        }
      })
    );

    for (const p of partners) {
      try {
        if (!p.contact_email) continue;

        const verdict = verdicts.get(p.id) ?? "unknown";
        verifyCounts[verdict]++;
        if (verdict === "invalid") {
          // Retire hard bounces before they ever hit a campaign.
          await supabase
            .from("partner_leads")
            .update({
              status: "Inactive",
              notes: `Email failed verification (invalid) ${today} — auto-retired by partner-enroll`,
              updated_at: nowIso,
            })
            .eq("id", p.id);
          blockedInvalid++;
          continue;
        }

        const campaignId = campaignForType(p.partner_type);
        if (!campaignId) {
          skippedNoCampaign.push(`${p.id} (type=${p.partner_type})`);
          continue;
        }

        const firstName = firstWord(p.partner_name);
        const lastName = restWords(p.partner_name);
        const templateKey = TEMPLATE_KEY_BY_TYPE[p.partner_type] || "architect_cold_intro";

        await enrollPartner({
          email: p.contact_email,
          firstName,
          lastName,
          campaignId,
          customVariables: {
            crm_partner_id: p.id,
            partner_type: p.partner_type,
            company: p.company_firm || "",
            phone: p.contact_phone || "",
            source: p.source || "",
            template_key: templateKey,
          },
        });

        await supabase
          .from("partner_leads")
          .update({
            status: "Contacted",
            last_contact_date: today,
            next_follow_up_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10),
            updated_at: nowIso,
          })
          .eq("id", p.id);

        await supabase.from("partner_tasks").insert({
          partner_lead_id: p.id,
          title: `Follow up with ${p.partner_name} if no reply by +5d`,
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        });

        enrolled++;
        enrolledByCampaign[campaignId] = (enrolledByCampaign[campaignId] || 0) + 1;
        enrolledByType[p.partner_type] = (enrolledByType[p.partner_type] || 0) + 1;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`partner ${p.id}: ${message}`);
      }
    }

    // Wake any campaign that Instantly auto-completed when it ran out of
    // leads — otherwise the leads we just added never send.
    await Promise.all(Object.keys(enrolledByCampaign).map(activateCampaign));

    return {
      records_pulled: partners.length,
      records_updated: enrolled,
      errors,
      metadata: {
        enrolledByCampaign,
        enrolledByType,
        skippedNoCampaign,
        verification: { ...verifyCounts, blockedInvalid },
      },
    };
  });

  return Response.json(result);
}
