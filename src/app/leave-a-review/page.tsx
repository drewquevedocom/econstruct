import LogoStatic from "@/components/LogoStatic";
import Image from "next/image";

const GOOGLE_REVIEW_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ||
  "https://g.page/r/CftYRnYSZ0QQEBM/review";
const BBB_URL =
  process.env.NEXT_PUBLIC_BBB_REVIEW_URL ||
  "https://www.bbb.org/us/ca/valencia/profile/construction/econstruct-inc-1216-100043809/leave-a-review";
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

          <div className="mt-8 grid gap-4">
            <ReviewButton
              logoSrc="/lg-66d8fa4c53ece-Google-Logo.webp"
              logoAlt="Google"
              label="Leave a Google Review"
              description="Most helpful for new clients finding econstruct."
              href={GOOGLE_REVIEW_URL}
              tone="blue"
              featured
            />
            <div className="grid gap-4 md:grid-cols-2">
              <ReviewButton
                logoSrc="/kisspng-better-business-bureau-of-central-ohio-logo-brand-home-page-slideshow-holy-angels-5bea07088f78b2.3216586615420638805877.jpg"
                logoAlt="BBB Accredited Business"
                label="Rate us on BBB"
                description="Share your service experience."
                href={BBB_URL}
                tone="gold"
              />
              <ReviewButton
                logoSrc="/9b7aac91bdc65895025fa78f588fd8.webp"
                logoAlt="Houzz"
                label="Review us on Houzz"
                description="Helpful for homeowners planning projects."
                href={HOUZZ_URL}
                tone="green"
              />
            </div>
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
  logoSrc,
  logoAlt,
  label,
  description,
  href,
  tone,
  featured = false,
}: {
  logoSrc: string;
  logoAlt: string;
  label: string;
  description: string;
  href: string;
  tone: "blue" | "red" | "gold" | "green" | "gray";
  featured?: boolean;
}) {
  const colors =
    tone === "blue"
      ? "border-[#B8963E] bg-[#FFF8E7] text-[#1C1C1E] shadow-[0_24px_70px_rgba(184,150,62,0.18)]"
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
      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5 ${featured ? "min-h-44 md:min-h-52 md:p-8" : "min-h-40"} ${colors}`}
    >
      <span
        className={`flex items-center justify-center rounded-xl bg-white shadow-sm ${featured ? "h-20 w-40 p-4" : "h-16 w-24 p-3"}`}
      >
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={featured ? 160 : 96}
          height={featured ? 80 : 64}
          className="h-full w-full object-contain"
        />
      </span>
      <span className="mt-6 block">
        <span className={`block font-black tracking-tight ${featured ? "text-3xl md:text-4xl" : "text-xl"}`}>
          {label}
        </span>
        <span className={`mt-2 block text-sm leading-6 ${featured ? "max-w-xl text-[#6F5A22]" : "text-gray-500"}`}>
          {description}
        </span>
      </span>
    </a>
  );
}
