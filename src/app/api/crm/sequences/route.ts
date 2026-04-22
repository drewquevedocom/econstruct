import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServiceClient();

  const { data: sequences, error: seqError } = await supabase
    .from("email_sequences")
    .select("id, name, description, campaign_id, is_active, created_at, updated_at")
    .order("created_at", { ascending: true });

  if (seqError) {
    return NextResponse.json({ error: seqError.message }, { status: 500 });
  }

  const { data: steps, error: stepsError } = await supabase
    .from("sequence_steps")
    .select("id, sequence_id, step_number, delay_days, subject, body, updated_at")
    .order("step_number", { ascending: true });

  if (stepsError) {
    return NextResponse.json({ error: stepsError.message }, { status: 500 });
  }

  const stepsBySequence: Record<string, typeof steps> = {};
  for (const step of steps ?? []) {
    if (!stepsBySequence[step.sequence_id]) stepsBySequence[step.sequence_id] = [];
    stepsBySequence[step.sequence_id].push(step);
  }

  return NextResponse.json({
    sequences: (sequences ?? []).map((s) => ({
      ...s,
      steps: stepsBySequence[s.id] ?? [],
    })),
  });
}
