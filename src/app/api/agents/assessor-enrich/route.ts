import { validateCronSecret } from "@/lib/agents/runner";

export const maxDuration = 30;

// DISABLED 2026-04-22: The LA County Assessor public API at
// assessor.lacounty.gov/api/properties does not exist — it returns the
// marketing site HTML, not JSON. Owner data was never being filled in.
//
// To re-enable: replace with a working owner-data source (Estated, Regrid,
// or PeopleDataLabs) and restore the previous logic from git history.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json({
    records_pulled: 0,
    records_updated: 0,
    metadata: { disabled: true, reason: "upstream API does not exist" },
  });
}
