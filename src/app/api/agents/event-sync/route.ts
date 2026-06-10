import { runAgent, validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

type EventSeed = {
  title: string;
  event_date: string;
  location: string;
  host_org: string;
  event_url: string;
  audience: string;
  notes: string;
};

const EVENT_SEEDS: EventSeed[] = [
  {
    title: "Real Estate: Developers, Builders & Professionals Networking Event LA",
    event_date: "2026-06-16",
    location: "The Lincoln, 2536 Lincoln Boulevard, Los Angeles, CA 90291",
    host_org: "Business Minds Events",
    event_url:
      "https://www.eventbrite.com/e/real-estate-developers-builders-professionals-networking-event-la-tickets-1989141792648",
    audience: "mixed-industry",
    notes:
      "LA real estate + construction room with developers, builders, brokers, architects, and service providers.",
  },
  {
    title: "Real Estate, PropTech Founders, Investors, Professionals Mixer Los Angeles",
    event_date: "2026-06-16",
    location: "The Lincoln, 2536 Lincoln Boulevard, Los Angeles, CA 90291",
    host_org: "The Founders Club",
    event_url:
      "https://www.eventbrite.com/e/real-estate-proptech-founders-investors-professionals-mixer-los-angeles-tickets-1989141519832",
    audience: "mixed-industry",
    notes:
      "Good room for founders, investors, architects, and operators working at the intersection of real estate and tech.",
  },
  {
    title: "AIA Conference on Architecture & Design 2026",
    event_date: "2026-06-10",
    location: "San Diego, CA",
    host_org: "AIA",
    event_url: "https://www.aia.org/community/events/aia-conference-architecture-design-2026",
    audience: "architects",
    notes:
      "Architecture and design flagship event; strong fit for design partners, plan reviewers, and architect referrals.",
  },
  {
    title: "Construction Project Manager: 2 Days Workshop in Los Angeles, CA",
    event_date: "2026-06-25",
    location: "Los Angeles, CA",
    host_org: "Eventbrite discovery",
    event_url: "https://www.eventbrite.com/d/ca--los-angeles/construction/",
    audience: "mixed-industry",
    notes:
      "Construction category discovery page surfaces nearby workshop and networking options for the week.",
  },
];

async function upsertEvent(
  supabase: ReturnType<typeof createServiceClient>,
  seed: EventSeed,
  nowIso: string
) {
  const { data: existing, error: lookupError } = await supabase
    .from("crm_events")
    .select("id")
    .eq("title", seed.title)
    .eq("event_date", seed.event_date)
    .maybeSingle();

  if (lookupError) throw new Error(`crm_events lookup failed: ${lookupError.message}`);

  const row = {
    title: seed.title,
    event_date: seed.event_date,
    location: seed.location,
    host_org: seed.host_org,
    event_url: seed.event_url,
    audience: seed.audience,
    notes: `${seed.notes} Synced ${nowIso.slice(0, 10)}.`,
    is_archived: false,
  };

  if (existing?.id) {
    const { error } = await supabase.from("crm_events").update(row).eq("id", existing.id);
    if (error) throw new Error(`crm_events update failed: ${error.message}`);
    return "updated" as const;
  }

  const { error } = await supabase.from("crm_events").insert(row);
  if (error) throw new Error(`crm_events insert failed: ${error.message}`);
  return "created" as const;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runAgent("event-sync", async () => {
    const supabase = createServiceClient();
    const nowIso = new Date().toISOString();

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const seed of EVENT_SEEDS) {
      try {
        const outcome = await upsertEvent(supabase, seed, nowIso);
        if (outcome === "created") created++;
        else updated++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push(`${seed.title}: ${message}`);
      }
    }

    return {
      records_pulled: EVENT_SEEDS.length,
      records_created: created,
      records_updated: updated,
      errors,
      metadata: {
        source: "Eventbrite + AIA curated weekly seed",
      },
    };
  });

  return Response.json(result);
}
