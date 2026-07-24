import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";

/** Browser-side client for the magic-link login flow (signInWithOtp). Auth only — data fetching stays on createServiceClient(). */
export function createBrowserClient() {
  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey);
}
