import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";

/**
 * Server client bound to the request's cookies — respects the logged-in
 * user's session for AUTH CHECKS ONLY (auth.getUser(), profile lookups).
 * Data fetching stays on createServiceClient(); this is a different client
 * with a different purpose (session-aware, not full-access).
 */
export async function createServerAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore since middleware refreshes the session on every request.
        }
      },
    },
  });
}
