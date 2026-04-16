"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "crm_session";

async function signHmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${hex}`;
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const expected = process.env.CRM_PASSWORD;
  const secret = process.env.CRM_COOKIE_SECRET;

  if (!expected || !secret) {
    return { error: "CRM not configured. Contact admin." };
  }

  if (password !== expected) {
    return { error: "Invalid password." };
  }

  const payload = `crm:${Date.now()}`;
  const signed = await signHmac(payload, secret);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signed, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  redirect("/crm/dashboard");
}
