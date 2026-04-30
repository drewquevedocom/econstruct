import ReviewFeedbackForm from "@/components/ReviewFeedbackForm";
import LogoStatic from "@/components/LogoStatic";

const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://g.page/r/CftYRnYSZ0QQEBM/review";
const BBB_URL =
  process.env.NEXT_PUBLIC_BBB_REVIEW_URL ||
  "https://www.bbb.org/us/ca/valencia/profile/construction/econstruct-inc-1216-100043809/leave-a-review";
const GLASSDOOR_URL =
  process.env.NEXT_PUBLIC_GLASSDOOR_REVIEW_URL ||
  "https://www.glassdoor.com/surveys/employer/create?i=2393907&j=true&y=&c=PAGE_INFOSITE_TOP&rt=https://www.glassdoor.com/Reviews/Econstruct-Reviews-E2393907.htm";
const HOUZZ_URL =
  process.env.NEXT_PUBLIC_HOUZZ_REVIEW_URL ||
  "https://www.houzz.com/writeProReview/cmd=r/n=econstructinc";

export const metadata = {
  title: "Leave a Review | econstruct",
  robots: { index: false, follow: false },
};

export default function LeaveAReviewPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2] px-5 py-8 text-[#1C1C1E]">
      <section className="mx-auto max-w-3xl">
        <div className="mb-8 flex justify-center">
          <LogoStatic height={48} tone="light" />
        </div>

        <div className="rounded-[2rem] border border-[#E8E4DC] bg-white p-6 shadow-[0_24px_80px_rgba(28,28,30,0.08)] md:p-10">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B8963E]">
              Private Client Review
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              We&apos;d love your feedback
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
              Your review helps other homeowners and business owners find trusted contractors.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ReviewButton icon="G" label="Leave a Google Review" href={GOOGLE_REVIEW_URL} tone="blue" />
            <ReviewButton icon="B" label="Rate us on BBB" href={BBB_URL} tone="gold" />
            <ReviewButton icon="H" label="Review us on Houzz" href={HOUZZ_URL} tone="green" />
            <ReviewButton icon="★" label="Review us on Glassdoor" href={GLASSDOOR_URL} tone="gray" />
          </div>

          <div className="my-8 h-px bg-[#E8E4DC]" />

          <div>
            <h2 className="text-lg font-bold">Prefer to send feedback privately?</h2>
            <p className="mt-1 text-sm text-gray-500">
              This goes directly to Frank and Drew.
            </p>
            <ReviewFeedbackForm />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          This page is for econstruct clients only. Thank you for your trust.
        </p>
      </section>
    </main>
  );
}

function ReviewButton({
  icon,
  label,
  href,
  tone,
}: {
  icon: string;
  label: string;
  href: string;
  tone: "blue" | "red" | "gold" | "green" | "gray";
}) {
  const colors =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-700"
      : tone === "red"
        ? "border-red-100 bg-red-50 text-red-700"
        : tone === "green"
          ? "border-green-100 bg-green-50 text-green-700"
          : tone === "gray"
            ? "border-gray-200 bg-gray-50 text-gray-700"
            : "border-[#E8E4DC] bg-[#B8963E]/10 text-[#9A7B2F]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-28 flex-col items-center justify-center rounded-2xl border p-4 text-center font-bold transition-transform hover:-translate-y-0.5 ${colors}`}
    >
      <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm">
        {icon}
      </span>
      {label}
    </a>
  );
}
