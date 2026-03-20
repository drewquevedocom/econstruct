import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { COMPANY } from "@/lib/constants";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";

export const metadata: Metadata = generatePageMetadata({
  title: "Privacy Policy — eConstruct Inc.",
  description:
    "Learn how eConstruct Inc. collects, uses, and protects your personal information. Read our full privacy policy.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" compact />

      <section className="py-24 md:py-32">
        <Container size="narrow">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-500 text-sm mb-12">
              Last updated: March 2026
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              {COMPANY.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our website
              or engage our construction services.
            </p>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              Information We Collect
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may collect information about you in a variety of ways,
              including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone
                number, mailing address, and other information you voluntarily
                provide when filling out forms, requesting consultations, or
                contacting us.
              </li>
              <li>
                <strong>Project Information:</strong> Details about your property,
                construction project, budget, and timeline preferences shared
                during consultations or through our forms.
              </li>
              <li>
                <strong>Usage Data:</strong> Information automatically collected
                when you visit our website, including your IP address, browser
                type, operating system, referring URLs, pages viewed, and the
                dates and times of your visits.
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              How We Use Your Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>Respond to your inquiries and consultation requests</li>
              <li>Provide estimates and project proposals</li>
              <li>
                Communicate with you about your project, including updates,
                scheduling, and follow-ups
              </li>
              <li>Improve our website, services, and customer experience</li>
              <li>
                Send marketing communications (only with your consent, and you
                may opt out at any time)
              </li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              Information Sharing
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>
                <strong>Service Providers:</strong> We may share information with
                trusted third-party vendors who assist us in operating our
                website, conducting business, or servicing you (e.g., email
                marketing platforms, analytics tools).
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required by law, court order, or governmental
                regulation.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be
                transferred as part of that transaction.
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              Cookies and Tracking
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our website may use cookies and similar tracking technologies to
              enhance your browsing experience. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>
                <strong>Essential Cookies:</strong> Required for basic site
                functionality, such as navigation and form submissions.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use our website so we can improve content and
                performance.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements and track campaign effectiveness.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              You can control cookie preferences through your browser settings.
              Disabling certain cookies may affect your experience on our website.
            </p>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              Your Rights
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding
              your personal data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
              <li>
                The right to access the personal information we hold about you
              </li>
              <li>
                The right to request correction of inaccurate or incomplete data
              </li>
              <li>
                The right to request deletion of your personal information
              </li>
              <li>The right to opt out of marketing communications</li>
              <li>
                The right to data portability (receiving your data in a
                structured, machine-readable format)
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-8">
              California residents have additional rights under the California
              Consumer Privacy Act (CCPA), including the right to know what
              personal information is collected, the right to delete personal
              information, and the right to opt out of the sale of personal
              information.
            </p>

            <h3 className="text-2xl font-bold text-brand-dark mt-12 mb-4">
              Contact Us
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise
              any of your rights, please contact us:
            </p>
            <div className="bg-[#F8F6F2] rounded-2xl p-8 text-gray-600">
              <p className="font-bold text-brand-dark mb-2">{COMPANY.name}</p>
              <p>{COMPANY.address.full}</p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-accent-gold hover:underline"
                >
                  {COMPANY.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${COMPANY.phone.primary.replace(/-/g, "")}`}
                  className="text-accent-gold hover:underline"
                >
                  {COMPANY.phone.display}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
