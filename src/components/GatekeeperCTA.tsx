"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";

const CTA_COPY = [
  {
    match: (pathname: string) => pathname === "/",
    eyebrow: "econstruct - Los Angeles",
    title: ["Ready to Build", "the Extraordinary?"],
    body:
      "Experience the pinnacle of high-end residential construction. Fast execution, uncompromising quality, and maximum ROI.",
    button: "Get A Quote",
    href: "/free-consultation",
  },
  {
    match: (pathname: string) => pathname.startsWith("/projects"),
    eyebrow: "econstruct - Case Studies",
    title: ["Ready to Start", "Your Own Signature Project?"],
    body:
      "If the work speaks to you, the next move is simple. Bring us your site, your plans, or your idea and we will shape the path forward.",
    button: "Start Your Project",
    href: "/free-consultation",
  },
  {
    match: (pathname: string) => pathname.startsWith("/services"),
    eyebrow: "econstruct - Los Angeles Services",
    title: ["Need the Right Team", "for a Demanding Project?"],
    body:
      "Luxury homes, rebuilds, additions, remodels, and tenant improvements all require disciplined leadership. We can help you choose the right path.",
    button: "Book A Consultation",
    href: "/free-consultation",
  },
  {
    match: (pathname: string) => pathname.startsWith("/about"),
    eyebrow: "econstruct - Leadership",
    title: ["Ready to Work", "Directly with econstruct?"],
    body:
      "When the project is high-stakes, you need more than a contractor. You need a construction partner who leads from the front.",
    button: "Talk With Our Team",
    href: "/free-consultation",
  },
  {
    match: (pathname: string) => pathname.startsWith("/contact"),
    eyebrow: "econstruct - Contact",
    title: ["Let's Turn", "the Vision into a Plan."],
    body:
      "Tell us what you are building, rebuilding, or reimagining. We will help you define the smartest next step.",
    button: "Request A Consultation",
    href: "/free-consultation",
  },
  {
    match: () => true,
    eyebrow: "econstruct - Los Angeles",
    title: ["Bring Us the Project", "That Actually Matters."],
    body:
      "From first planning conversations to final delivery, we build for clients who expect precision, speed, and premium execution.",
    button: "Get A Quote",
    href: "/free-consultation",
  },
] as const;

export default function GatekeeperCTA() {
  const pathname = usePathname();
  const isContactPage = pathname.startsWith("/contact");

  const copy = CTA_COPY.find((item) => item.match(pathname)) ?? CTA_COPY[CTA_COPY.length - 1];

  return (
    <section
      className="relative w-full"
      style={{ height: "clamp(760px, 135vh, 1120px)" }}
    >
      <div
        className="sticky top-0 h-screen min-h-[620px] max-h-[900px] overflow-hidden"
        style={{ height: "clamp(620px, 100svh, 900px)" }}
      >
        <div
          className={`absolute inset-0 bg-cover ${isContactPage ? "bg-top" : "bg-center"}`}
          style={{
            backgroundImage: "url('/hollywood_hills_v2.png')",
            ...(isContactPage
              ? {
                  backgroundAttachment: "fixed",
                  backgroundPosition: "center top",
                  transform: "none",
                }
              : {
                  transform: "scale(1.08)",
                }),
          }}
        />
        <div className="absolute inset-0 bg-[rgba(4,7,12,0.42)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(180deg,transparent_0%,rgba(4,7,12,0.55)_100%)]" />

        <div className="absolute inset-0 flex items-end px-5 pb-8 md:px-14 md:pb-14">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-accent-gold/90"
              >
                {copy.eyebrow.replace("econstruct - ", "")}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-extrabold leading-[0.93] tracking-tight text-white"
                style={{
                  fontSize: "clamp(2.5rem, 5.2vw, 5.25rem)",
                  textShadow:
                    "0 2px 12px rgba(0,0,0,0.9), 0 4px 32px rgba(0,0,0,0.7)",
                  color: "#ffffff",
                }}
              >
                {copy.title[0]}
                <br />
                <span className="text-white">{copy.title[1]}</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-white md:text-[1.35rem]"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
              >
                {copy.body}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <Link
                href={copy.href}
                className="group inline-flex items-center gap-3 rounded-full border border-accent-gold/55 bg-[rgba(17,20,25,0.74)] px-8 py-5 text-base font-bold text-white shadow-[0_18px_40px_rgba(0,0,0,0.24)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-accent-gold hover:text-brand-dark hover:shadow-2xl hover:shadow-accent-gold/25 active:scale-95"
              >
                {copy.button}
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/12 transition-colors duration-300 group-hover:bg-brand-dark/10">
                  <ArrowUpRight
                    size={15}
                    className="text-white group-hover:text-brand-dark"
                  />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
