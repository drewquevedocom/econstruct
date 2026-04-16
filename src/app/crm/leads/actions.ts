"use server";

import { createServiceClient } from "@/lib/supabase/server";

const VALID_STAGES = [
  "new",
  "enriched",
  "outreach",
  "contacted",
  "replied",
  "meeting",
  "proposal",
  "won",
  "lost",
];

export async function updateLeadStage(leadId: string, stage: string) {
  if (!VALID_STAGES.includes(stage)) {
    return { error: "Invalid stage" };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("leads")
    .update({ lifecycle_stage: stage, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
