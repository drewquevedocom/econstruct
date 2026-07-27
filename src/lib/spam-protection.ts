// Importing the .json directly (rather than the package's index.js entry
// point) lets TypeScript infer string[] via resolveJsonModule — no ambient
// type declaration needed for this untyped package.
import disposableDomains from "disposable-email-domains/index.json";

const DISPOSABLE_DOMAIN_SET = new Set(
  disposableDomains.map((d) => d.toLowerCase())
);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;
  return DISPOSABLE_DOMAIN_SET.has(domain);
}

// Not exhaustive — flags common contractor-solicitation phrasing so Frank can
// filter at a glance. Non-blocking by design (see flagSolicitation callers).
const SOLICITATION_KEYWORDS = [
  "seo services",
  "seo service",
  "seo audit",
  "estimating services",
  "estimating service",
  "guest post",
  "link building",
  "backlink",
  "web design services",
  "website design services",
  "web development services",
  "app development services",
  "digital marketing services",
  "content writing services",
  "social media marketing services",
  "logo design services",
  "improve your google ranking",
  "improve your search ranking",
  "increase your rankings",
  "increase your website traffic",
  "drive more traffic to your website",
  "generate more leads for your business",
  "virtual assistant services",
  "software development services",
  "outsource your",
];

export function flagSolicitation(text: string | null | undefined): {
  flagged: boolean;
  matches: string[];
} {
  if (!text) return { flagged: false, matches: [] };
  const lower = text.toLowerCase();
  const matches = SOLICITATION_KEYWORDS.filter((kw) => lower.includes(kw));
  return { flagged: matches.length > 0, matches };
}

export function getClientIp(req: Request): string | null {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return null;
}

// In-memory, best-effort limiter — resets on cold start / new isolate, so
// it under-blocks rather than over-blocks across a fleet of instances.
// That's intentional: failing open here is safer than a shared/global store
// wrongly capping a legitimate burst of real leads.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ip: string | null): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  // Unknown IP: can't fairly attribute a shared bucket to one caller, so
  // don't rate-limit it — fail open per the "never silently drop a real
  // lead" guardrail.
  if (!ip) return { allowed: true };

  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000)
    );
    rateLimitMap.set(ip, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  // Best-effort cleanup so the map can't grow unbounded on a long-lived isolate.
  if (rateLimitMap.size > 5000) {
    for (const [key, times] of rateLimitMap) {
      const fresh = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, fresh);
    }
  }

  return { allowed: true };
}

export type TurnstileResult = {
  ok: boolean;
  reason: "ok" | "missing_token" | "verification_failed" | "not_configured" | "network_error";
};

/**
 * Verifies a Cloudflare Turnstile token server-side. Distinguishes
 * "uncertain" failures (missing secret key config, network/timeout error
 * calling Cloudflare) — which fail OPEN and let the submission through —
 * from confident failures (no token supplied, or Cloudflare explicitly
 * says the token is invalid) — which fail CLOSED, since those are
 * observable signals about the submitter, not infrastructure hiccups.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error(
      "[spam-protection] MISSING ENV VAR: TURNSTILE_SECRET_KEY — Turnstile verification skipped, allowing submission through. Add to Vercel/Cloudflare and redeploy."
    );
    return { ok: true, reason: "not_configured" };
  }

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (ip) params.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    const data = (await res.json()) as { success: boolean };
    if (!data.success) {
      return { ok: false, reason: "verification_failed" };
    }
    return { ok: true, reason: "ok" };
  } catch (err) {
    console.error(
      "[spam-protection] Turnstile siteverify request failed, allowing submission through:",
      err
    );
    return { ok: true, reason: "network_error" };
  }
}
