export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

function validateCronSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

// Small ops surface for Instantly actions that need the Worker-held API key:
//   ?action=verify&email=...   → run one email verification, return raw result
//   ?action=activate&id=...    → force-activate a campaign (any status)
//   ?action=status&id=...      → fetch a campaign's raw status
// CRON_SECRET-gated; used for diagnostics and manual campaign control.
export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "INSTANTLY_API_KEY not set" }, { status: 500 });
  }
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    if (action === "verify") {
      const email = url.searchParams.get("email");
      if (!email) return Response.json({ ok: false, error: "email required" }, { status: 400 });
      const res = await fetch(`${INSTANTLY_API}/email-verification`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });
      const body = await res.text();
      return Response.json({ ok: res.ok, httpStatus: res.status, raw: body.slice(0, 1000) });
    }

    if (action === "activate" || action === "status") {
      const id = url.searchParams.get("id");
      if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });

      const before = await fetch(`${INSTANTLY_API}/campaigns/${id}`, { headers });
      const beforeBody = (await before.json()) as { status?: number; name?: string };
      if (action === "status") {
        return Response.json({ ok: before.ok, campaign: beforeBody.name, status: beforeBody.status });
      }

      const res = await fetch(`${INSTANTLY_API}/campaigns/${id}/activate`, {
        method: "POST",
        headers,
      });
      const body = await res.text();
      const after = await fetch(`${INSTANTLY_API}/campaigns/${id}`, { headers });
      const afterBody = (await after.json()) as { status?: number };
      return Response.json({
        ok: res.ok,
        campaign: beforeBody.name,
        statusBefore: beforeBody.status,
        statusAfter: afterBody.status,
        raw: res.ok ? undefined : body.slice(0, 500),
      });
    }

    return Response.json({ ok: false, error: "action must be verify | activate | status" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
