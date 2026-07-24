"use server";

import { redirect } from "next/navigation";
import { createServerAuthClient } from "@/lib/supabase/serverAuthClient";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Only called from a real user click (see CompleteSignIn.tsx) — never on
 * page load. Corporate email security (Outlook Safe Links, Google
 * Workspace link scanning) GET-fetches every URL in an inbound email to
 * scan it, which silently burns a one-time magic-link code before the
 * real user clicks it if the exchange runs on page load. Gating the
 * exchange behind a button click means scanners render the page but
 * never trigger this action.
 */
export async function completeSignIn(code: string) {
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    return { error: "auth_failed" as const };
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("role, active")
    .eq("email", data.user.email)
    .single();

  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    return { error: "not_invited" as const };
  }

  const destination = profile.role === "owner" ? "/crm/dashboard" : "/crm/support";
  redirect(destination);
}
