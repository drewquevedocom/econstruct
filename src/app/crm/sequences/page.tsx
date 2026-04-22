import { createServiceClient } from "@/lib/supabase/server";
import SequencesView from "@/components/crm/SequencesView";

export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const supabase = createServiceClient();

  const { data: sequences } = await supabase
    .from("email_sequences")
    .select("id, name, description, campaign_id, is_active")
    .order("created_at", { ascending: true });

  const { data: steps } = await supabase
    .from("sequence_steps")
    .select("id, sequence_id, step_number, delay_days, subject, body, updated_at")
    .order("step_number", { ascending: true });

  const stepsBySequence: Record<string, NonNullable<typeof steps>> = {};
  for (const step of steps ?? []) {
    if (!stepsBySequence[step.sequence_id]) stepsBySequence[step.sequence_id] = [];
    stepsBySequence[step.sequence_id].push(step);
  }

  const sequencesWithSteps = (sequences ?? []).map((s) => ({
    ...s,
    steps: stepsBySequence[s.id] ?? [],
  }));

  return <SequencesView sequences={sequencesWithSteps} />;
}
