import { createClient } from "@supabase/supabase-js";

// Public values — safe to inline. NEXT_PUBLIC_* vars are only available
// client-side on Cloudflare Workers; process.env doesn't have them at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Read-only client — safe for CRM UI reads (anon key) */
export function createAnonClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Full-access server client — agents, enrichers, scrapers ONLY. Never expose to client bundle. */
export function createServiceClient() {
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment variables.");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
