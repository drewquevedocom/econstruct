import { createClient } from "@supabase/supabase-js";

// Public values — safe to inline. NEXT_PUBLIC_* vars are only available
// client-side on Cloudflare Workers; process.env doesn't have them at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";
/** Read-only client — safe for public reads where RLS allows it */
export function createAnonClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Full-access server client — CRM reads, agents, enrichers, scrapers. Never expose to client bundle. */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables.");
  }
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
