import { validateCronSecret } from "@/lib/agents/runner";

export const maxDuration = 15;

// TEMPORARY — one-off check that the middleware's old CRM_PASSWORD cookie
// fallback still works after the auth rewrite. Delete after use. Generates
// a validly-signed crm_session cookie value using the real deployed
// CRM_COOKIE_SECRET (same algorithm as the old login/actions.ts signHmac) —
// does NOT touch or reveal CRM_PASSWORD itself. Caller then replays this
// value as a Cookie header against a guarded /crm page to confirm
// middleware still accepts it.
async function signHmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${hex}`;
}

export async function POST(req: Request) {
  if (!validateCronSecret(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const secret = process.env.CRM_COOKIE_SECRET;
  if (!secret) {
    return Response.json({ ok: false, error: "CRM_COOKIE_SECRET not set" }, { status: 500 });
  }

  const payload = `crm:${Date.now()}`;
  const cookieValue = await signHmac(payload, secret);

  return Response.json({ ok: true, cookieValue, cookieHeader: `crm_session=${cookieValue}` });
}
