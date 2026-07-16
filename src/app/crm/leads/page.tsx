import { createServiceClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/crm/LeadsTable";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  let leads: unknown[] = [];

  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, zip_code, source, lifecycle_stage, lead_score, property_value, enrichment_status, address, owner_name, created_at, updated_at, score_calculated_at"
      )
      .order("lead_score", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[CRM/leads] Supabase query error:", error.message);
    } else {
      leads = data ?? [];
    }
  } catch (err) {
    // Likely missing SUPABASE_SERVICE_ROLE_KEY env var
    console.error("[CRM/leads] Failed to init Supabase client:", err instanceof Error ? err.message : err);
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090c] p-8">
        <div className="max-w-md text-center">
          <p className="text-accent-gold text-xs font-bold uppercase tracking-widest mb-3">CRM — Configuration Error</p>
          <h1 className="text-2xl font-bold text-white mb-4">Database not connected</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            The <code className="text-accent-gold bg-white/10 px-1.5 py-0.5 rounded text-xs">SUPABASE_SERVICE_ROLE_KEY</code> environment variable is missing from Vercel.
          </p>
          <ol className="text-left text-white/60 text-sm leading-relaxed space-y-2 bg-white/5 rounded-xl p-5">
            <li>1. Go to <strong className="text-white">vercel.com</strong> → your project → Settings → Environment Variables</li>
            <li>2. Add <code className="text-accent-gold">SUPABASE_SERVICE_ROLE_KEY</code> with the service role key from Supabase → Project Settings → API</li>
            <li>3. Redeploy</li>
          </ol>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <LeadsTable leads={leads as any[]} />;
}
