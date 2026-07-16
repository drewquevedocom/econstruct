export const dynamic = "force-static";

export const metadata = {
  title: "Partner Welcome | econstruct",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="space-y-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#B8963E]">
          econstruct Partner Network
        </p>
        <h1 className="text-4xl font-black text-[#1C1C1E]">You&apos;re officially in.</h1>
        <p className="text-base text-gray-600">
          Welcome aboard. We just emailed you your referral code and 3 simple ways to send your first lead.
          Check your inbox in the next 60 seconds.
        </p>

        <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left text-sm text-emerald-900">
          <p>
            <strong>Next 3 things:</strong>
          </p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Save Frank&apos;s number to your phone: text/call anytime when a referral comes up</li>
            <li>Forward the welcome email to anyone on your team who handles client referrals</li>
            <li>
              When your first lead hits, CC{" "}
              <a href="mailto:frank@econstructinc.com" className="font-bold text-emerald-700 underline">
                frank@econstructinc.com
              </a>{" "}
              and we take it from there
            </li>
          </ol>
        </div>

        <div className="border-t border-[#E8E4DC] pt-6 text-xs text-gray-500">
          <p>
            Email <a href="mailto:frank@econstructinc.com" className="text-[#B8963E] underline">frank@econstructinc.com</a> anytime — replies go straight to Frank&apos;s personal inbox.
          </p>
        </div>
      </div>
    </main>
  );
}
