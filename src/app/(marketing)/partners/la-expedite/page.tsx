import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  Phone,
  Award,
  Flame,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  ChefHat,
  Hammer,
  Layers,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import GenericContactForm from "@/components/contact/GenericContactForm";
import Logo from "@/components/Logo";

const PAGE_URL = "https://econstructhomes.com/partners/la-expedite";

export const metadata: Metadata = {
  title: "Fire Rebuild Specialists — econstruct × LA Expedite",
  description:
    "Palisades fire rebuilds delivered by econstruct in partnership with LA Expedite. Streamlined preconstruction, permitting, design, and construction under one roof. Free fire-rebuild consultation.",
  alternates: { canonical: PAGE_URL },
  // Landing page for paid traffic / QR code — keep it out of the organic index
  // so it doesn't compete with the homepage and main service pages for the same keywords.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Fire Rebuild Specialists — econstruct × LA Expedite",
    description:
      "Palisades fire rebuilds. Preconstruction strategy, permitting, design, and build — all under one roof.",
    url: PAGE_URL,
    type: "website",
  },
};

const whyChoose = [
  {
    n: "01",
    icon: Award,
    title: "20+ Years Building in LA",
    body: "639 combined partner projects. CA Lic #964015. NAHB Member. Licensed General Contractor leadership.",
  },
  {
    n: "02",
    icon: Flame,
    title: "Fire Rebuild Specialists",
    body: "WUI codes, Chapter 7A compliance, expedited permits, and insurance coordination for Palisades, Altadena, and Malibu families.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Insurance Coordination",
    body: "We work directly with your insurance adjuster alongside the rebuild — maximizing your settlement and minimizing your out-of-pocket costs.",
  },
];

const services = [
  {
    icon: Building2,
    title: "Heavy Residential Builds",
    body: "Custom luxury homes, fire rebuilds, complex hillside structures.",
  },
  {
    icon: ChefHat,
    title: "Custom Restaurants",
    body: "High-end hospitality, cafes, food service design and build-out.",
  },
  {
    icon: Hammer,
    title: "Commercial Construction",
    body: "Retail, office, tenant improvements, mixed-use projects.",
  },
  {
    icon: Layers,
    title: "Project & Additional Planning",
    body: "Expansions, custom add-ons, and full-home modernization.",
  },
];

export default function LAExpeditePartnerPage() {
  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/01-palisades-modern-glass-v1.png"
            alt="Modern Palisades home with glass walls — fire rebuild by econstruct"
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/60 to-brand-dark" />
        </div>

        {/* Top utility bar */}
        <div className="relative z-10 border-b border-white/10 bg-brand-dark/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-xs sm:text-sm">
            <p className="font-medium uppercase tracking-[0.18em] text-white/85">
              For the Families of Los Angeles
            </p>
            <div className="flex items-center gap-3 sm:gap-5">
              <span className="hidden font-bold uppercase tracking-[0.18em] text-accent-gold sm:inline">
                Free Fire-Rebuild Consultation
              </span>
              <a
                href={`tel:${COMPANY.phone.primary}`}
                className="flex items-center gap-2 rounded-full bg-accent-gold px-4 py-1.5 font-bold text-brand-dark transition-colors hover:bg-white"
              >
                <Phone size={14} />
                {COMPANY.phone.display}
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr,1fr]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
                Palisades Fire Rebuilds
              </p>
              <h1
                className="font-heading text-5xl font-extrabold leading-[0.95] tracking-tight md:text-6xl lg:text-7xl"
                style={{ color: "#ffffff" }}
              >
                Fire Rebuild
                <br />
                Specialists
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
                Partnered with <strong className="text-accent-gold">LA Expedite</strong> to
                streamline preconstruction, permitting, design, and construction for the
                families rebuilding after the LA fires — all under one roof.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/free-consultation?source=la_expedite_flyer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent-gold px-7 py-4 text-base font-bold text-brand-dark shadow-lg transition-all hover:bg-white hover:shadow-2xl active:scale-95"
                >
                  Get Your Free Quote
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`tel:${COMPANY.phone.primary}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-colors hover:border-accent-gold hover:text-accent-gold"
                >
                  <Phone size={16} />
                  Call (310) 740-9999
                </a>
              </div>
            </div>

            {/* Trust badge stack */}
            <div className="flex flex-col gap-3 lg:items-end">
              <div className="rounded-2xl border border-accent-gold/40 bg-brand-dark/80 p-5 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-gold">
                  Est. 2011
                </p>
                <p className="mt-1 font-heading text-4xl font-extrabold leading-none text-white">
                  639
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  Partner Projects
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-brand-dark/80 p-5 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-gold">
                  Licensed
                </p>
                <p className="mt-1 font-heading text-2xl font-bold leading-none text-white">
                  CA Lic #964015
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/70">
                  NAHB Member · Best Contractor 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About econstruct ─────────────────────────────────── */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
            About econstruct
          </p>
          <h2 className="max-w-3xl font-heading text-3xl font-extrabold leading-tight text-brand-dark md:text-4xl">
            From concept to completion, we deliver heavy home builds and specialize in
            exquisite restaurants and commercial construction.
          </h2>
        </div>
      </section>

      {/* ─── Why Choose econstruct ────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
            Why Choose econstruct?
          </p>
          <h2 className="text-center font-heading text-3xl font-extrabold text-brand-dark md:text-4xl">
            Three reasons families across LA trust us with their rebuild.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {whyChoose.map(({ n, icon: Icon, title, body }) => (
              <div
                key={n}
                className="relative rounded-2xl border border-accent-gold/30 bg-brand-dark p-7 text-white shadow-xl"
              >
                <span className="absolute -top-4 left-7 rounded-md bg-accent-gold px-3 py-1 text-xs font-bold tracking-widest text-brand-dark">
                  {n}
                </span>
                <Icon size={28} className="mt-2 text-accent-gold" />
                <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Partnership block ────────────────────────────────── */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr,1.2fr]">
            <div className="rounded-3xl bg-white p-8 shadow-lg md:p-10">
              <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
                <Logo height={44} tone="light" />
                <div className="text-3xl font-light text-gray-300">×</div>
                <Image
                  src="/la-expedite-logo.webp"
                  alt="LA Expedite — Architecture and Planning"
                  width={170}
                  height={70}
                  className="h-14 w-auto object-contain"
                />
              </div>
              <p className="mt-6 text-center text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
                Build-Ready in Half the Time
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
                The Partnership
              </p>
              <h2 className="font-heading text-3xl font-extrabold leading-tight text-brand-dark md:text-4xl">
                Preconstruction strategy and permitting — without the guesswork.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-body-text md:text-lg">
                LA Expedite leads architecture, permitting, and consultant coordination
                so your rebuild moves through approvals with clarity and speed.
                econstruct then takes the wheel, breaks ground, and delivers the build —
                one team, one accountable point of contact, one timeline.
              </p>
              <ul className="mt-6 space-y-3 text-base text-body-text">
                {[
                  "WUI compliance and Chapter 7A handled from day one",
                  "Architectural and permit packages prepared in parallel with site prep",
                  "Insurance adjuster coordination throughout the rebuild",
                  "One firm to call from feasibility through final walkthrough",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services strip ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
            Our Services
          </p>
          <h2 className="text-center font-heading text-3xl font-extrabold text-brand-dark md:text-4xl">
            What we build.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-secondary p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-gold/10">
                  <Icon className="h-6 w-6 text-accent-gold" />
                </div>
                <h3 className="font-heading text-lg font-bold text-brand-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body-text">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quote form ───────────────────────────────────────── */}
      <section id="get-quote" className="bg-brand-dark py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-[1fr,1.2fr]">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-accent-gold">
              Free Fire-Rebuild Consultation
            </p>
            <h2 className="font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl">
              Tell us about your property. We&apos;ll respond within 24 hours.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/85">
              Fire rebuild questions, insurance coordination, permit timelines, scope
              estimates — share what you&apos;re working with and we&apos;ll walk you through the
              path forward together.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-white">
                <Clock className="h-5 w-5 text-accent-gold" />
                <span className="text-sm font-bold">24-Hour Response Guarantee</span>
              </div>
              <div className="flex items-start gap-3 text-white/85">
                <Phone className="mt-0.5 h-5 w-5 text-accent-gold" />
                <div className="text-sm">
                  <p className="font-bold text-white">Prefer to call?</p>
                  <a
                    href={`tel:${COMPANY.phone.primary}`}
                    className="text-accent-gold hover:underline"
                  >
                    {COMPANY.phone.display}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-white/85">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-accent-gold" />
                <div className="text-sm">
                  <p className="font-bold text-white">Licensed & Insured</p>
                  <p>{COMPANY.license.display} — Fully bonded and insured GC in California.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <Suspense fallback={null}>
              <GenericContactForm />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ─── Visit our office ─────────────────────────────────── */}
      <section className="bg-secondary py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 text-center md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-gold">
              Visit Our Office
            </p>
            <p className="mt-2 font-bold text-brand-dark">
              {COMPANY.address.street} {COMPANY.address.suite}
            </p>
            <p className="text-sm text-body-text">
              {COMPANY.address.city}, {COMPANY.address.state} {COMPANY.address.zip}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-gold">
              Contact Us
            </p>
            <a
              href={`tel:${COMPANY.phone.primary}`}
              className="mt-2 block font-bold text-brand-dark hover:text-accent-gold"
            >
              {COMPANY.phone.display}
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="block text-sm text-body-text hover:text-accent-gold"
            >
              {COMPANY.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-gold">
              We Build It
            </p>
            <p className="mt-2 font-heading text-xl font-bold text-brand-dark">
              Fast & Right.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
