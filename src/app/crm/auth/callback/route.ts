import { NextRequest, NextResponse } from "next/server";
import { createServerAuthClient } from "@/lib/supabase/serverAuthClient";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const loginUrl = new URL("/crm/login", req.url);

  if (!code) {
    loginUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    loginUrl.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(loginUrl);
  }

  // Data lookup uses the service client (existing project pattern — full
  // access, security boundary is route-level, not RLS-per-table).
  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("role, active")
    .eq("email", data.user.email)
    .single();

  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("error", "not_invited");
    return NextResponse.redirect(loginUrl);
  }

  const destination = profile.role === "owner" ? "/crm/dashboard" : "/crm/support";
  return NextResponse.redirect(new URL(destination, req.url));
}
