import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { COMPANY } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GenericContactForm from "@/components/contact/GenericContactForm";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact econstruct",
  description:
    "Contact econstruct Inc. with a general inquiry, vendor question, or project message. Call 310-740-9999 for direct support.",
  path: "/contact",
});

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: COMPANY.phone.display,
    href: `tel:${COMPANY.phone.primary}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: MapPin,
    label: "Office",
    value: `${COMPANY.address.street}, ${COMPANY.address.suite}`,
    secondary: `${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}`,
    href: `https://maps.google.com/?q=${encodeURIComponent(COMPANY.address.full)}`,
  },
];

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://econstructhomes.com" },
    { name: "Contact", url: "https://econstructhomes.com/contact" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <PageHero
        title="Contact Us"
        subtitle="Use this form for general questions, vendor outreach, and normal company contact. We respond within 24 hours."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="py-24 md:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: Contact Form (3 cols) */}
            <AnimatedSection className="lg:col-span-3">
              <Suspense fallback={null}>
                <GenericContactForm />
              </Suspense>
            </AnimatedSection>

            {/* Right: Contact Info (2 cols) */}
            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <div className="flex flex-col gap-8">
                {/* Contact Details */}
                <div className="bg-[#F8F6F2] rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-brand-dark mb-6">
                    Get in Touch
                  </h3>
                  <div className="flex flex-col gap-6">
                    {contactInfo.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={
                            item.icon === MapPin ? "_blank" : undefined
                          }
                          rel={
                            item.icon === MapPin
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="flex items-start gap-4 group"
                        >
                          <div className="w-11 h-11 bg-accent-gold/10 rounded-xl flex items-center justify-center shrink-0">
                            <Icon
                              size={20}
                              className="text-accent-gold"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                              {item.label}
                            </p>
                            <p className="text-brand-dark font-bold group-hover:text-accent-gold transition-colors">
                              {item.value}
                            </p>
                            {item.secondary && (
                              <p className="text-gray-500 text-sm mt-0.5">
                                {item.secondary}
                              </p>
                            )}
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Response Time Promise */}
                <div className="bg-brand-dark rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} className="text-accent-gold" />
                    <h3 className="text-lg font-bold">
                      24-Hour Response Guarantee
                    </h3>
                  </div>
                  <p className="text-base leading-relaxed text-white/92">
                    Every inquiry receives a personal response from our
                    executive team within 24 hours. For urgent fire rebuild
                    inquiries, call us directly for immediate assistance.
                  </p>
                </div>

                {/* License Badge */}
                <div className="bg-[#F8F6F2] rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield size={20} className="text-accent-gold" />
                    <h3 className="text-lg font-bold text-brand-dark">
                      Licensed & Insured
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {COMPANY.license.display} — Fully licensed, bonded, and
                    insured General Contractor in the State of California.
                  </p>
                </div>

                {/* Office Map */}
                <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
                  <iframe
                    src="https://www.google.com/maps?q=25350+Magic+Mountain+Pkwy,+Valencia,+CA+91355&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="econstruct office location"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </>
  );
}

