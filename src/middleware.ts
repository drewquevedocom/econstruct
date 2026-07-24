import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const COOKIE_NAME = "crm_session";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dzudtdhmvnuipqyoogem.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dWR0ZGhtdm51aXBxeW9vZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDQ4MTMsImV4cCI6MjA5MTc4MDgxM30.OUwN6G_BvZRdTdl2XcxsE5Z19vOy_mRvEMKwZUwwNtE";

const STAFF_ALLOWED_PREFIXES = ["/crm/support", "/crm/leads", "/crm/new-builds"];

async function verifyHmac(value: string, secret: string): Promise<boolean> {
  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expected = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload),
    );
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedHex === signature;
  } catch {
    return false;
  }
}

/** Old shared-password fallback — TODO: remove once magic-link auth is confirmed working in production for a few days. */
async function hasValidLegacyCookie(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.CRM_COOKIE_SECRET;
  if (!cookie || !secret) return false;
  return verifyHmac(cookie, secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host");

  if (host === "www.econstructhomes.com") {
    const url = req.nextUrl.clone();
    url.hostname = "econstructhomes.com";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/our-work") {
    return NextResponse.redirect(new URL("/projects", req.url), 301);
  }

  // Only guard /crm routes (except login + the magic-link callback itself)
  if (!pathname.startsWith("/crm")) return NextResponse.next();
  if (pathname === "/crm/login") return NextResponse.next();
  if (pathname.startsWith("/crm/auth/callback")) return NextResponse.next();

  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    // Real per-user session. Look up role and enforce staff restrictions.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, active")
      .eq("email", user.email)
      .single();

    if (!profile || !profile.active) {
      const loginUrl = new URL("/crm/login", req.url);
      loginUrl.searchParams.set("error", "not_invited");
      return NextResponse.redirect(loginUrl);
    }

    if (profile.role === "staff") {
      const allowed = STAFF_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
      if (!allowed) {
        return NextResponse.redirect(new URL("/crm/support", req.url));
      }
    }
    // role 'owner' → full access, fall through

    return response;
  }

  // No Supabase session — fall back to the old shared-password cookie so
  // Drew isn't locked out mid-rollout. TODO: remove this branch once the
  // magic-link system is confirmed working in production for a few days.
  if (await hasValidLegacyCookie(req)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/crm/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
