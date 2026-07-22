import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// One-time-use ops helper mirroring the exact CRM Outreach Queue "Approve"
// action (src/app/crm/outreach/actions.ts) for the non-fire new-construction
// track only. Hard-scoped and capped — this is the same manual review gate
// Drew/Frank use in the UI, just triggered here since there's no browser
// session in this context. fire_damage_status IS NULL is non-negotiable.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const limit = Math.min(Number(body.limit ?? 15), 25);

  const supabase = createServiceClient();
  const { data: candidates, error } = await supabase
    .from("leads")
    .select("id, address, email, lead_score, fire_damage_status")
    .eq("outreach_status", "ready_for_email_review")
    .is("fire_damage_status", null)
    .not("email", "is", null)
    .or("dnc.is.null,dnc.eq.false")
    .order("lead_score", { ascending: false })
    .limit(limit);

  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  if (!candidates?.length) return Response.json({ ok: true, approved: 0, sample: [] });

  const ids = candidates.map((c) => c.id);
  const now = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("leads")
    .update({
      outreach_status: "approved",
      outreach_approved_at: now,
      outreach_status_updated_at: now,
      updated_at: now,
    })
    .in("id", ids);

  if (updateError) return Response.json({ ok: false, error: updateError.message }, { status: 500 });

  await supabase.from("lead_activities").insert(
    ids.map((leadId) => ({
      lead_id: leadId,
      type: "outreach_status_updated",
      channel: "crm",
      metadata: { status: "approved", notes: "Approved via newbuild-approve-batch ops endpoint" },
    }))
  );

  return Response.json({
    ok: true,
    approved: ids.length,
    sample: candidates.slice(0, 5).map((c) => ({ address: c.address, score: c.lead_score })),
  });
}
