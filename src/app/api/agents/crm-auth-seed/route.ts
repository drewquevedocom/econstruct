import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

// TEMPORARY — one-time seed for CRM per-user auth. Delete after use.
// Requires: (1) Magic Link email auth enabled in Supabase Dashboard with
// redirect URL https://econstructhomes.com/crm/auth/callback, (2) the
// profiles table migration (20260724_crm_profiles.sql) already applied.
// Invites each user via the Auth Admin API (creates their auth.users row +
// sends them a Supabase invite email), then inserts the matching profiles
// row. Safe to re-run — skips anyone already invited/seeded.
const SEED_USERS: Array<{ email: string; full_name: string; role: "owner" | "staff" }> = [
  { email: "dq@drewquevedo.com", full_name: "Drew Quevedo", role: "owner" },
  { email: "frank@econstructinc.com", full_name: "Frank Neimroozi", role: "owner" },
  { email: "katie@econstructinc.com", full_name: "Katie Krueger", role: "staff" },
];

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const results: Array<Record<string, unknown>> = [];

  for (const seedUser of SEED_USERS) {
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("email", seedUser.email)
        .maybeSingle();

      if (existingProfile) {
        results.push({ email: seedUser.email, status: "already_seeded", profile: existingProfile });
        continue;
      }

      const { data: invited, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        seedUser.email,
        { redirectTo: "https://econstructhomes.com/crm/auth/callback" }
      );

      let userId = invited?.user?.id;

      // If they already have an auth.users row (e.g. re-run after a partial
      // failure), inviteUserByEmail errors — look them up instead of failing.
      if (inviteError && !userId) {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingAuthUser = listData?.users.find((u) => u.email === seedUser.email);
        if (existingAuthUser) userId = existingAuthUser.id;
      }

      if (!userId) {
        results.push({ email: seedUser.email, status: "invite_failed", error: inviteError?.message });
        continue;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: seedUser.full_name,
        email: seedUser.email,
        role: seedUser.role,
        active: true,
      });

      if (profileError) {
        results.push({ email: seedUser.email, status: "profile_insert_failed", error: profileError.message });
        continue;
      }

      results.push({ email: seedUser.email, status: "seeded", user_id: userId, invited: Boolean(invited?.user) });
    } catch (err) {
      results.push({
        email: seedUser.email,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return Response.json({ ok: true, results });
}
