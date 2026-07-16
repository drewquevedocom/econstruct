import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// Read-only queue snapshot: partner_leads grouped by type and status, plus
// sendable-queue depth (New Lead + has email) per type. Used for CRM audits
// and category-mix tuning — makes no writes.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    const pageSize = 1000;
    let offset = 0;
    type Row = {
      partner_type: string | null;
      status: string | null;
      contact_email: string | null;
      created_at: string | null;
      last_contact_date: string | null;
      source: string | null;
    };
    const rows: Row[] = [];
    for (;;) {
      const { data, error } = await supabase
        .from("partner_leads")
        .select("partner_type, status, contact_email, created_at, last_contact_date, source")
        .range(offset, offset + pageSize - 1);
      if (error) throw new Error(`partner_leads fetch failed: ${error.message}`);
      rows.push(...((data ?? []) as Row[]));
      if (!data || data.length < pageSize) break;
      offset += pageSize;
    }

    const byTypeStatus: Record<string, Record<string, number>> = {};
    const sendableByType: Record<string, number> = {};
    const missingEmailByType: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    const cutoff14 = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
    const contactedLast14ByType: Record<string, number> = {};

    for (const r of rows) {
      const t = r.partner_type || "(none)";
      const s = r.status || "(none)";
      byTypeStatus[t] ??= {};
      byTypeStatus[t][s] = (byTypeStatus[t][s] || 0) + 1;
      bySource[r.source || "(none)"] = (bySource[r.source || "(none)"] || 0) + 1;
      if (s === "New Lead") {
        if (r.contact_email) sendableByType[t] = (sendableByType[t] || 0) + 1;
        else missingEmailByType[t] = (missingEmailByType[t] || 0) + 1;
      }
      if (s === "Contacted" && (r.last_contact_date || "") >= cutoff14) {
        contactedLast14ByType[t] = (contactedLast14ByType[t] || 0) + 1;
      }
    }

    return Response.json({
      ok: true,
      total_partner_leads: rows.length,
      by_type_status: byTypeStatus,
      sendable_queue_by_type: sendableByType,
      new_lead_missing_email_by_type: missingEmailByType,
      contacted_last_14d_by_type: contactedLast14ByType,
      by_source: bySource,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
