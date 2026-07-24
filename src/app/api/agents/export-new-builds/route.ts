import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// GET /api/agents/export-new-builds?limit=180&tier=mail|individual|all&format=csv|json
// Default: limit=180, tier=mail, format=csv
// tier=mail   → entity-owned (LLC/Trust) with mailing address (Lob.com batch ready)
// tier=individual → individual owners (Apollo lookup candidates)
// tier=all    → top N by property_value regardless
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "180", 10), 1000);
  const tier = (url.searchParams.get("tier") || "mail").toLowerCase();
  const format = (url.searchParams.get("format") || "csv").toLowerCase();

  const supabase = createServiceClient();
  // Each branch builds its own query from scratch rather than reassigning a
  // shared `let query` — reassigning across .eq()/.not() calls sends
  // TypeScript's generic inference recursively deep enough to fail to
  // compile ("Type instantiation is excessively deep") on current
  // @supabase/supabase-js. Same filters, just not accumulated via mutation.
  const baseQuery = () =>
    supabase
      .from("leads")
      .select(
        "address, zip_code, apn, subsource, property_value, owner_name, owner_mailing_address, owner_type, enrichment_status, updated_at"
      )
      .eq("source", "ladbs_permits")
      .not("owner_name", "is", null)
      .order("property_value", { ascending: false, nullsFirst: false });

  const { data, error } =
    tier === "mail"
      ? await baseQuery().eq("owner_type", "entity").not("owner_mailing_address", "is", null).limit(limit)
      : tier === "individual"
        ? await baseQuery().eq("owner_type", "individual").limit(limit)
        : await baseQuery().limit(limit);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];

  if (format === "json") {
    return NextResponse.json({ count: rows.length, tier, leads: rows });
  }

  const headers = [
    "owner_name",
    "owner_mailing_address",
    "property_address",
    "zip_code",
    "owner_type",
    "property_value",
    "apn",
    "subsource",
    "enrichment_status",
    "updated_at",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.owner_name,
        r.owner_mailing_address,
        r.address,
        r.zip_code,
        r.owner_type,
        r.property_value,
        r.apn,
        r.subsource,
        r.enrichment_status,
        r.updated_at,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ];

  const filename = `econstruct-top-${limit}-${tier}-permits-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
