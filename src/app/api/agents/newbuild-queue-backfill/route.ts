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
  if (!candidates?.length) return Response.json({ ok: true, inserted: 0, reset: 0 });

  const candidateIds = candidates.map((c) => c.id);
  const { data: existingRows } = await supabase
    .from("enrichment_queue")
    .select("lead_id, status, last_error")
    .in("lead_id", candidateIds);
  const existing = existingRows ?? [];
  const alreadyIds = new Set(existing.map((e) => e.lead_id));

  const toInsert = candidateIds
    .filter((id) => !alreadyIds.has(id))
    .map((id) => ({ lead_id: id, status: "pending", attempts: 0 }));

  let inserted = 0;
  if (toInsert.length) {
    const { error: insertError, count } = await supabase
      .from("enrichment_queue")
      .insert(toInsert, { count: "exact" });
    if (insertError) return Response.json({ ok: false, error: insertError.message }, { status: 500 });
    inserted = count ?? toInsert.length;
  }

  // Reset stuck 'failed' rows for this cohort back to pending — most were
  // paused specifically because the old Melissa/PDL residential-email
  // provider doesn't work for this data, or hit a transient error. Apollo
  // (a person-search provider, not address-based) hasn't been tried on
  // these leads yet, so retrying them here is a genuinely new attempt, not
  // an override of the fire-rebuild pivot decision. The 'ATTOM: ... SuccessWithoutResult'
  // no-match rows are left as-is — that's a real data gap, not a stale pause.
  const toReset = existing
    .filter((e) => e.status === "failed" && !(e.last_error || "").includes("SuccessWithoutResult"))
    .map((e) => e.lead_id);

  let reset = 0;
  if (toReset.length) {
    const { error: resetError, count } = await supabase
      .from("enrichment_queue")
      .update({ status: "pending", attempts: 0, last_error: null }, { count: "exact" })
      .in("lead_id", toReset);
    if (resetError) return Response.json({ ok: false, error: resetError.message }, { status: 500 });
    reset = count ?? toReset.length;
  }

  return Response.json({
    ok: true,
    inserted,
    reset,
    candidatesSeen: candidates.length,
    alreadyQueued: alreadyIds.size,
  });
}
