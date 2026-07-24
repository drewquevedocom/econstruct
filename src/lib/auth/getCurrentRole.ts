"use server";

import { createServerAuthClient } from "@/lib/supabase/serverAuthClient";
import { createServiceClient } from "@/lib/supabase/server";

export type CurrentUser = {
  role: "owner" | "staff";
  fullName: string | null;
};

/**
 * Resolves the current user's role for UI purposes (nav filtering). The
 * security boundary is middleware, not this — this only controls what's
 * shown, not what's reachable.
 *
 * No Supabase session (old shared-password fallback) → treated as 'owner'
 * to match pre-rollout behavior, where the single shared password granted
 * full access. TODO: revisit once the CRM_PASSWORD fallback is removed.
 */
export async function getCurrentRole(): Promise<CurrentUser> {
  const supabase = await createServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { role: "owner", fullName: null };
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("role, full_name, active")
    .eq("email", user.email)
    .single();

  if (!profile || !profile.active) {
    return { role: "owner", fullName: null };
  }

  return { role: profile.role as "owner" | "staff", fullName: profile.full_name };
}
