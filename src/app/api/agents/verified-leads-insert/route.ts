import { validateCronSecret } from "@/lib/agents/runner";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

interface VerifiedLead {
  first_name: string;
  last_name: string;
  firm: string;
  email: string;
  partner_type: string;
  notes?: string;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { leads }: { leads: VerifiedLead[] } = await req.json();
  if (!leads?.length) return Response.json({ inserted: 0, errors: [] });

  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  const existing = await supabase
    .from("partner_leads")
    .select("contact_email")
    .in("contact_email", leads.map((l) => l.email));

  const existingEmails = new Set(
    (existing.data ?? []).map((r) => r.contact_email)
  );

  let inserted = 0;
  const errors: string[] = [];
  const skipped: string[] = [];

  for (const lead of leads) {
    if (existingEmails.has(lead.email)) {
      skipped.push(lead.email);
      continue;
    }
    const { error } = await supabase.from("partner_leads").insert({
      partner_name: `${lead.first_name} ${lead.last_name}`,
      company_firm: lead.firm,
      contact_email: lead.email,
      partner_type: lead.partner_type,
      source: "Cold Outreach",
      status: "New Lead",
      referral_agreement_status: "Not Started",
      referral_fee: 5000,
      assigned_to: "Drew Quevedo",
      notes: lead.notes ?? "Email verified via SMTP pattern matching",
      created_at: nowIso,
      updated_at: nowIso,
    });
    if (error) {
      errors.push(`${lead.email}: ${error.message}`);
    } else {
      inserted++;
    }
  }

  return Response.json({ inserted, skipped: skipped.length, errors });
}
