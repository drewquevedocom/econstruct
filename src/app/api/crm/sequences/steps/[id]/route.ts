import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.subject === "string") updates.subject = body.subject;
  if (typeof body.body === "string") updates.body = body.body;
  if (typeof body.delay_days === "number") updates.delay_days = body.delay_days;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("sequence_steps")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ step: data });
}
