import Image from "next/image";
import Link from "next/link";
import ScrollingPill from "@/components/ui/ScrollingPill";

export default function StrategicPartnership() {
  return (
    <section className="w-full bg-[#f6f2ea] py-20 md:py-28 font-body">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-6 flex justify-center">
          <ScrollingPill
            label="PRECONSTRUCTION STRATEGY & PERMITTING"
            className="border-black/10 text-black/55"
          />
        </div>

        <h2 className="mb-3 text-center text-3xl font-heading leading-[1.05] text-brand-dark md:text-5xl">
          Preconstruction Strategy{" "}
          <span className="text-[#c9a96e] italic">and Permitting</span>
        </h2>
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-black/55 md:mb-10">
          Powered by LA Expedite
        </p>

        <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-black/60 md:mb-16">
          Time and unresolved issues are the greatest risks in any project. With LA Expedite,
          recognized as one of the top expediting firms in Los Angeles, their expertise in high-end
          residential renovations and new construction allows projects to move through approvals
          with clarity and speed. The timelines achieved through their preconstruction strategy
          are ones we, as contractors, can confidently stand behind.
        </p>

        <div className="relative mx-auto mb-12 max-w-5xl overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)] md:mb-16">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-accent-gold" />

          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col items-center justify-center border-b border-black/8 bg-[#fcfaf5] p-8 text-center md:w-[34%] md:items-start md:border-b-0 md:border-r md:p-10 md:text-left">
              <div className="flex w-full max-w-[280px] items-center justify-center rounded-[28px] border border-black/8 bg-white px-8 py-6 shadow-[0_14px_30px_rgba(0,0,0,0.05)] md:justify-start">
                <Image
                  src="/la-expedite-logo.webp"
                  alt="LA Expedite architecture and planning"
                  width={220}
                  height={92}
                  className="h-auto w-full max-w-[220px] object-contain"
                />
              </div>
              <span className="mt-5 text-xs font-semibold uppercase tracking-widest text-[#c9a96e]">
                Architecture, Planning & Permit Expertise
              </span>
            </div>

            <div className="flex-1 p-8 md:p-10">
              <h4 className="mb-5 font-heading text-2xl text-brand-dark">
                How a project{" "}
                <span className="text-[#c9a96e]">moves forward</span>
              </h4>
              <ol className="mb-6 space-y-4">
                <li className="flex gap-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#c9a96e] text-sm font-semibold text-[#1a1a17]">
                    1
                  </span>
                  <p className="leading-relaxed text-black/65">
                    <span className="font-semibold text-brand-dark">Blueprint to Success&reg;</span>{" "}
                    &mdash; LA Expedite leads the feasibility and strategy phase, defining what&apos;s
                    possible on your property before a single drawing is finalized.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#c9a96e] text-sm font-semibold text-[#1a1a17]">
                    2
                  </span>
                  <p className="leading-relaxed text-black/65">
                    <span className="font-semibold text-brand-dark">Path to Build&reg;</span>{" "}
                    &mdash; LA Expedite manages architecture, permitting, and all required consultants
                    (structural, civil, MEP, landscape) until the project reaches full approvals.
                  </p>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#c9a96e] text-sm font-semibold text-[#1a1a17]">
                    3
                  </span>
                  <p className="leading-relaxed text-black/65">
                    <span className="font-semibold text-brand-dark">Construction</span>{" "}
                    &mdash; econstruct takes the wheel, breaks ground, and delivers the build.
                  </p>
                </li>
              </ol>
              <div className="flex flex-wrap gap-3">
                {[
                  "Feasibility Strategy",
                  "Architecture",
                  "Permitting",
                  "Structural / Civil / MEP",
                  "Landscape Consultants",
                  "Full Approvals",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-[#f8f4eb] px-4 py-1.5 text-xs font-medium tracking-wide text-brand-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mb-12 max-w-4xl text-center text-base leading-relaxed text-black/60 md:mb-16 md:text-lg">
          LA Expedite operates as a one-stop hub &mdash; integrating architecture, permitting,
          and consultant coordination under one system &mdash; and works alongside econstruct as a
          trusted consultant, independent from construction activities. Projects that begin with
          preconstruction strategy move faster, cost less in surprises, and close cleaner.
        </p>

        <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 gap-4 md:mb-16 md:grid-cols-3 md:gap-5">
          <div className="flex flex-col items-center rounded-3xl border border-black/8 bg-white p-8 text-center shadow-[0_14px_35px_rgba(0,0,0,0.05)] md:items-start md:text-left">
            <h5 className="mb-3 font-heading text-2xl text-[#c9a96e]">
              4-8 Months Faster
            </h5>
            <p className="text-sm leading-relaxed text-black/60">
              Average permit timeline savings for clients working with LA Expedite
            </p>
          </div>

          <div className="flex flex-col items-center rounded-3xl border border-black/8 bg-white p-8 text-center shadow-[0_14px_35px_rgba(0,0,0,0.05)] md:items-start md:text-left">
            <h5 className="mb-3 font-heading text-2xl text-[#c9a96e]">
              All SoCal Jurisdictions
            </h5>
            <p className="text-sm leading-relaxed text-black/60">
              LA City & County, Malibu, Pasadena, Beverly Hills, Ventura + more
            </p>
          </div>

          <div className="flex flex-col items-center rounded-3xl border border-black/8 bg-white p-8 text-center shadow-[0_14px_35px_rgba(0,0,0,0.05)] md:items-start md:text-left">
            <h5 className="mb-3 font-heading text-2xl text-[#c9a96e]">
              Coordinated Handoff
            </h5>
            <p className="text-sm leading-relaxed text-black/60">
              LA Expedite drives preconstruction; econstruct takes over for the build &mdash; one
              clean handoff between two independent firms.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-black/45">
            <span className="h-px w-8 bg-black/15" />
            Begin with preconstruction
            <span className="h-px w-8 bg-black/15" />
          </span>
          <Link
            href="https://www.laexpedite.com?utm_source=econstructhomes&utm_medium=website&utm_campaign=preconstruction_strategy"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center justify-center rounded-full bg-[#c9a96e] px-8 py-4 font-semibold text-[#1a1a17] shadow-[0_10px_20px_rgba(201,169,110,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d6b77c]"
          >
            Start Your Project Strategy {"->"}
          </Link>
          <p className="text-sm text-black/45">
            Using this link gets you a special offer on LA Expedite&apos;s services.
          </p>
        </div>
      </div>
    </section>
  );
}
