import Image from "next/image";
import Link from "next/link";

export default function StrategicPartnership() {
  return (
    <section className="w-full bg-[#f6f2ea] py-20 md:py-28 font-body">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-6 flex justify-center">
          <span className="rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/55 backdrop-blur-sm">
            Strategic Partnership
          </span>
        </div>

        <h2 className="mb-5 text-center text-3xl font-heading leading-[1.05] text-brand-dark md:text-5xl">
          Architecture, Permits & Build -{" "}
          <span className="text-[#c9a96e] italic">Under One Roof</span>
        </h2>

        <p className="mx-auto mb-12 max-w-3xl text-center text-lg leading-relaxed text-black/60 md:mb-16">
          Rebuilding after a fire or breaking ground on something new? We&apos;ve partnered
          with LA&apos;s top permit expediting firm so your project moves without delays.
        </p>

        <div className="relative mx-auto mb-12 max-w-5xl overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.07)] md:mb-16">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-accent-gold" />

          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col items-center justify-center border-b border-black/8 bg-[#fcfaf5] p-8 text-center md:w-[34%] md:items-start md:border-b-0 md:border-r md:p-10 md:text-left">
              <div className="flex w-full max-w-[280px] items-center justify-center rounded-[28px] border border-black/8 bg-white px-8 py-6 shadow-[0_14px_30px_rgba(0,0,0,0.05)] md:justify-start">
                <Image
                  src="/LA+Expedite+New+Logo+-+architecture+and+planning.webp"
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
              <h4 className="mb-4 font-heading text-2xl text-brand-dark">
                From Blueprint to Build -{" "}
                <span className="text-[#c9a96e]">Seamlessly</span>
              </h4>
              <p className="mb-6 max-w-3xl leading-relaxed text-black/60">
                LA Expedite handles architecture, engineering, and permit expediting across
                every Southern California jurisdiction. With 40+ years of combined
                experience, they clear the path. We build what they approve.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  "Fire Rebuilds",
                  "Permit Expediting",
                  "Architecture",
                  "Structural Engineering",
                  "ADUs",
                  "Custom Homes",
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
              One Point of Contact
            </h5>
            <p className="text-sm leading-relaxed text-black/60">
              We coordinate directly with their team so you don&apos;t manage two firms
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-black/45">
            <span className="h-px w-8 bg-black/15" />
            Ready to start your project?
            <span className="h-px w-8 bg-black/15" />
          </span>
          <Link
            href="https://laexpedite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center justify-center rounded-full bg-[#c9a96e] px-8 py-4 font-semibold text-[#1a1a17] shadow-[0_10px_20px_rgba(201,169,110,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d6b77c]"
          >
            Learn About Our Partnership {"->"}
          </Link>
          <p className="text-sm text-black/45">
            or call us - we&apos;ll connect you with the right team
          </p>
        </div>
      </div>
    </section>
  );
}
