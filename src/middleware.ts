import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "crm_session";

async function verifyHmac(value: string, secret: string): Promise<boolean> {
  try {
    const [payload, signature] = value.split(".");
    if (!payload || !signature) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expected = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payload)
    );
    const expectedHex = Array.from(new Uint8Array(expected))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return expectedHex === signature;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/our-work") {
    return NextResponse.redirect(new URL("/projects", req.url), 301);
  }

  // Only guard /crm routes (except /crm/login)
  if (!pathname.startsWith("/crm")) return NextResponse.next();
  if (pathname === "/crm/login") return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.CRM_COOKIE_SECRET;

  if (!cookie || !secret || !(await verifyHmac(cookie, secret))) {
    const loginUrl = new URL("/crm/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm/:path*", "/our-work"],
};
