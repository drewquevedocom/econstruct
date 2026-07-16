import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, CheckCircle2, ClipboardCheck, Home, MapPin, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import PrivateLotWalkForm from "@/components/campaigns/PrivateLotWalkForm";
import { COMPANY } from "@/lib/constants";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Reserve a Private Lot Walk | eConstruct Homes",
  description:
    "Private lot walk request for families planning a high-end custom home, full estate remodel, major addition, or pre-design property evaluation in Los Angeles.",
  path: "/private-lot-walk",
  image: "/campaigns/new-build-postcard/postcard-page-1.png",
  imageAlt: "eConstruct Homes private lot walk postcard for high-end custom home clients",
  noIndex: true,
});

const proofStats = [
  { value: "15", label: "Years heritage" },
  { value: "634", label: "Custom projects" },
  { value: "$200M", label: "Total built" },
];

const fitSignals = [
  "You own or are evaluating a valuable lot.",
  "You are planning a ground-up custom home or serious remodel.",
  "You need builder input before architecture, pricing, or permit strategy gets locked in.",
  "You want a private, appointment-only conversation instead of a sales handoff.",
];

const process = [
  {
    title: "Tell us about the property",
    body: "ZIP code, scope, budget range, and timing give the team enough context to prepare.",
    icon: MapPin,
  },
  {
    title: "We review feasibility before the call",
    body: "We look at neighborhood, likely constraints, permit path, and what needs to be clarified first.",
    icon: ClipboardCheck,
  },
  {
    title: "Walk the lot or scope the remodel",
    body: "Frank's team discusses buildability, order of operations, and where early decisions protect the project.",
    icon: Home,
  },
];

export default function PrivateLotWalkPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#070707] pt-44 text-white md:pt-52">
        <div className="absolute inset-0">
          <Image
            src="/campaigns/new-build-postcard/postcard-page-1.png"
            alt="Private note from the founder postcard for eConstruct Homes"
            fill
            priority
            className="object-cover opacity-42"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.98)_0%,rgba(7,7,7,0.82)_42%,rgba(7,7,7,0.42)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070707] to-transparent" />
        </div>

        <Container className="relative z-10 pb-20 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.58fr)] lg:items-end">
            <div className="max-w-4xl">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-accent-gold">
                A quiet note before you build
              </p>
              <h1 className="max-w-5xl text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white md:text-7xl lg:text-8xl">
                For families building just once.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
                If you are planning a new build, full estate remodel, or major addition, reserve a private lot walk before pencils hit paper.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#reserve"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-accent-gold px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_rgba(184,150,62,0.28)] transition hover:bg-white hover:text-brand-dark"
                >
                  Reserve your lot walk
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href={`tel:${COMPANY.phone.primary}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/28 bg-white/8 px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-brand-dark"
                >
                  <Phone className="h-5 w-5" />
                  {COMPANY.phone.display}
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/12 bg-[#0d0d0d]/84 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-md">
              <Image
                src="/campaigns/new-build-postcard/postcard-page-2.png"
                alt="eConstruct Homes postcard back with referral practice proof points and lot walk call to action"
                width={1066}
                height={720}
                className="rounded-[1.35rem] border border-white/10"
              />
              <div className="grid grid-cols-3 gap-2 pt-4">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white/8 px-3 py-4 text-center">
                    <p className="font-heading text-2xl font-bold text-accent-gold md:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/70">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f7f0df] py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-gold">
                Private, not mass market
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-[-0.035em] text-brand-dark md:text-5xl">
                The right builder conversation happens before the plans are final.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {fitSignals.map((signal) => (
                <div key={signal} className="rounded-[1.5rem] border border-[#dfd2b8] bg-[#fffaf0] p-5">
                  <CheckCircle2 className="mb-4 h-6 w-6 text-accent-gold" />
                  <p className="text-base font-semibold leading-7 text-brand-dark">{signal}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="reserve" className="bg-[#fdf9f0] py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.84fr)_minmax(420px,0.62fr)] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent-gold">
                What happens next
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-brand-dark md:text-5xl">
                A short request. A prepared conversation.
              </h2>
              <div className="mt-10 space-y-6">
                {process.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-accent-gold">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold text-brand-dark">{item.title}</h3>
                        <p className="mt-2 max-w-xl text-base leading-7 text-body-text">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 rounded-[1.75rem] border border-[#dfd2b8] bg-white p-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
                  Built for high-intent homeowners
                </p>
                <p className="mt-3 text-base leading-7 text-body-text">
                  This page is intentionally not a generic quote form. It is for owners considering a serious build or remodel who want early, practical builder input before committing to the wrong sequence.
                </p>
              </div>
            </div>

            <Suspense fallback={<div className="rounded-[2rem] bg-white p-8">Loading form...</div>}>
              <PrivateLotWalkForm />
            </Suspense>
          </div>
        </Container>
      </section>
    </>
  );
}
