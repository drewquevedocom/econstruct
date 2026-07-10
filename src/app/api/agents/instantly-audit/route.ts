export const maxDuration = 60;

const INSTANTLY_API = "https://api.instantly.ai/api/v2";

function validateCronSecret(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

type InstantlyResponse = unknown;

async function instantlyGet(path: string): Promise<InstantlyResponse> {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) throw new Error("INSTANTLY_API_KEY not set");

  const res = await fetch(`${INSTANTLY_API}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // keep raw text
  }

  if (!res.ok) {
    throw new Error(`Instantly ${path} ${res.status}: ${JSON.stringify(body).slice(0, 800)}`);
  }

  return body;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [accounts, campaigns, analytics] = await Promise.all([
      instantlyGet("/accounts?limit=50"),
      instantlyGet("/campaigns?limit=100"),
      instantlyGet("/campaigns/analytics"),
    ]);

    return Response.json({
      ok: true,
      accounts,
      campaigns,
      analytics,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
