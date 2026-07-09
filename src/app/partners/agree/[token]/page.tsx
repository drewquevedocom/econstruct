import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AgreeForm from "./AgreeForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partner Agreement | econstruct",
  robots: { index: false, follow: false },
};

export default async function AgreePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token) notFound();

  const supabase = createServiceClient();
  const { data: partner } = await supabase
    .from("partner_leads")
    .select("partner_name, partner_type, company_firm, agreement_signed_at, referral_code")
    .eq("agreement_token", token)
    .maybeSingle();

  if (!partner) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h1 className="text-xl font-black text-rose-900">Link not found</h1>
          <p className="mt-2 text-sm text-rose-700">
            This agreement link is invalid or expired. Reach out to{" "}
            <a href="mailto:frank@econstructinc.com" className="underline">
              frank@econstructinc.com
            </a>{" "}
            for a fresh one.
          </p>
        </div>
      </main>
    );
  }

  if (partner.agreement_signed_at) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h1 className="text-xl font-black text-emerald-900">You&apos;re already in</h1>
          <p className="mt-2 text-sm text-emerald-700">
            Hi {partner.partner_name.split(" ")[0]}, you signed up on{" "}
            {new Date(partner.agreement_signed_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            .
          </p>
          {partner.referral_code && (
            <p className="mt-4 text-sm text-emerald-800">
              Your referral code:{" "}
              <code className="rounded bg-emerald-100 px-2 py-0.5 font-bold tracking-wider">
                {partner.referral_code}
              </code>
            </p>
          )}
        </div>
      </main>
    );
  }

  const firstName = partner.partner_name.split(" ")[0] || partner.partner_name;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B8963E]">
            econstruct Partner Network
          </p>
          <h1 className="mt-1 text-3xl font-black text-[#1C1C1E]">
            Welcome, {firstName}.
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Here&apos;s the partnership in plain English. Read it, click the button. You&apos;re in.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8E4DC] bg-[#FAF9F6] p-6">
          <div className="space-y-4 text-sm leading-7 text-[#1C1C1E]">
            <p>
              <strong>What you do:</strong> Send qualified leads our way when your client needs a GC for a
              luxury rebuild, new build, ADU, or post-fire reconstruction in LA County.
            </p>
            <p>
              <strong>What we do:</strong> Close the contract, deliver the project to your client&apos;s
              standard, and pay you a flat{" "}
              <strong className="text-[#B8963E]">$5,000 referral fee</strong> within 30 days of the GC
              contract signing.
            </p>
            <p>
              <strong>How we track it:</strong> Every referral you send gets attributed to your unique
              referral code, which you&apos;ll see on the next screen. Share it at intro, or CC Frank on
              the intro email.
            </p>
            <p>
              <strong>What you don&apos;t have to do:</strong> No exclusivity. No minimums. No monthly
              fees. Send us 1 referral or 50 — same terms either way.
            </p>
            <p>
              <strong>You can leave anytime.</strong> Just email Frank — no notice required, no clawback.
            </p>
          </div>
        </div>

        <AgreeForm token={token} firstName={firstName} />

        <div className="border-t border-[#E8E4DC] pt-4 text-xs text-gray-500">
          <p>
            Questions before you sign? Email{" "}
            <a href="mailto:frank@econstructinc.com" className="text-[#B8963E] underline">
              frank@econstructinc.com
            </a>{" "}
            or just reply to the agreement email Frank sent you.
          </p>
          <p className="mt-2">
            By clicking &quot;I agree&quot; you confirm you&apos;re authorized to enter this referral
            partnership on behalf of yourself or your firm. This is not exclusive, not a real-estate
            commission, and creates no fiduciary obligation. Simple referral arrangement with a flat fee.
          </p>
        </div>
      </div>
    </main>
  );
}
