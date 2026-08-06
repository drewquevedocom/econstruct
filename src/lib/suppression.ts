import type { SupabaseClient } from "@supabase/supabase-js";

export type SuppressionReason = "unsubscribed" | "hard_bounce" | "complaint" | "manual";
export type SourceTrack = "partner" | "homeowner";

/** Adds an email to the shared suppression list. Idempotent — re-suppressing
 * an already-suppressed address (e.g. a second bounce) is a no-op; the first
 * reason recorded wins. Never throws — a suppression-write failure shouldn't
 * take down whatever caller triggered it (a webhook, an enrollment run). */
export async function suppressEmail(
  supabase: SupabaseClient,
  email: string,
  reason: SuppressionReason,
  sourceTrack: SourceTrack
): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  const { error } = await supabase
    .from("suppression_list")
    .upsert(
      { email: normalized, reason, source_track: sourceTrack },
      { onConflict: "email", ignoreDuplicates: true }
    );
  if (error) console.error(`[suppression] failed to suppress ${normalized}:`, error.message);
}

/** Bulk-checks which of the given emails are currently suppressed. Returns a
 * Set for O(1) lookups against an enrollment batch — one query per chunk
 * instead of one query per lead. On a lookup failure, callers get an empty
 * result for that chunk rather than a thrown error — matches how the rest of
 * the enrollment pipeline treats Supabase as best-effort infrastructure, not
 * a hard dependency that should crash a whole run over one query. */
export async function getSuppressedEmails(
  supabase: SupabaseClient,
  emails: string[]
): Promise<Set<string>> {
  const normalized = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
  const suppressed = new Set<string>();
  if (!normalized.length) return suppressed;

  for (let i = 0; i < normalized.length; i += 200) {
    const chunk = normalized.slice(i, i + 200);
    const { data, error } = await supabase.from("suppression_list").select("email").in("email", chunk);
    if (error) {
      console.error("[suppression] lookup failed:", error.message);
      continue;
    }
    for (const row of data ?? []) suppressed.add(String(row.email).toLowerCase());
  }
  return suppressed;
}
