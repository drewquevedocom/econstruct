import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// Read-only snapshot of the customer (new-build/fire-rebuild) leads pipeline —
// mirrors queue-audit but for the `leads` table instead of `partner_leads`.
// Shows why campaign-enroll pulls 0: no inventory upstream, or inventory
// stuck behind the manual outreach_status='approved' review gate.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    const pageSize = 1000;
    let offset = 0;
    type Row = {
      lifecycle_stage: string | null;
      outreach_status: string | null;
      lead_score: number | null;
      email: string | null;
      dnc: boolean | null;
      created_at: string | null;
    };
    const rows: Row[] = [];
    for (;;) {
      const { data, error } = await supabase
        .from("leads")
        .select("lifecycle_stage, outreach_status, lead_score, email, dnc, created_at")
        .range(offset, offset + pageSize - 1);
      if (error) throw new Error(`leads fetch failed: ${error.message}`);
      rows.push(...((data ?? []) as Row[]));
      if (!data || data.length < pageSize) break;
      offset += pageSize;
    }

    const byLifecycle: Record<string, number> = {};
    const byOutreachStatus: Record<string, number> = {};
    const byLifecycleOutreach: Record<string, Record<string, number>> = {};
    let withEmail = 0;
    let scoreGte70 = 0;
    let readyButUnapproved = 0;
    let approvedWithEmailNotYetSent = 0;
    const cutoff7 = new Date(Date.now() - 7 * 864e5).toISOString();
    let createdLast7d = 0;

    for (const r of rows) {
      const lc = r.lifecycle_stage || "(none)";
      const os = r.outreach_status || "(none)";
      byLifecycle[lc] = (byLifecycle[lc] || 0) + 1;
      byOutreachStatus[os] = (byOutreachStatus[os] || 0) + 1;
      byLifecycleOutreach[lc] ??= {};
      byLifecycleOutreach[lc][os] = (byLifecycleOutreach[lc][os] || 0) + 1;
      if (r.email) withEmail++;
      if ((r.lead_score ?? 0) >= 70) scoreGte70++;
      if (os === "ready_for_email_review" || os === "email_found") readyButUnapproved++;
      if (os === "approved" && r.email) approvedWithEmailNotYetSent++;
      if ((r.created_at || "") >= cutoff7) createdLast7d++;
    }

    return Response.json({
      ok: true,
      total_leads: rows.length,
      by_lifecycle_stage: byLifecycle,
      by_outreach_status: byOutreachStatus,
      by_lifecycle_then_outreach: byLifecycleOutreach,
      with_email: withEmail,
      score_gte_70: scoreGte70,
      ready_for_review_unapproved: readyButUnapproved,
      approved_with_email: approvedWithEmailNotYetSent,
      created_last_7d: createdLast7d,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
