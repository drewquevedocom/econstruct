import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// One-time backfill: nothing currently inserts fresh enrichment_queue rows
// (the old producer, deed-monitor, was retired 2026-05-28). Leads created
// since then — including the higher-scoring non-fire cohort this campaign
// needs — sit in `leads` with no queue entry, so apollo-enrich/assessor-enrich
// never see them regardless of their own filters. This inserts pending queue
// rows for exactly the eligible cohort: no fire tag, no email yet, score>=40.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: candidates, error } = await supabase
    .from("leads")
    .select("id")
    .is("fire_damage_status", null)
    .is("email", null)
    .gte("lead_score", 40)
    .or("dnc.is.null,dnc.eq.false")
    .limit(500);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  if (!candidates?.length) return Response.json({ ok: true, inserted: 0 });

  const { data: existing } = await supabase
    .from("enrichment_queue")
    .select("lead_id")
    .in(
      "lead_id",
      candidates.map((c) => c.id)
    );
  const already = new Set((existing ?? []).map((e) => e.lead_id));

  const toInsert = candidates.filter((c) => !already.has(c.id)).map((c) => ({
    lead_id: c.id,
    status: "pending",
    attempts: 0,
  }));

  if (!toInsert.length) return Response.json({ ok: true, inserted: 0, alreadyQueued: candidates.length });

  const { error: insertError, count } = await supabase
    .from("enrichment_queue")
    .insert(toInsert, { count: "exact" });

  if (insertError) return Response.json({ ok: false, error: insertError.message }, { status: 500 });

  return Response.json({ ok: true, inserted: count ?? toInsert.length, candidatesSeen: candidates.length });
}
