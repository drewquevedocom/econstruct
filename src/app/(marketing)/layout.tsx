import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import { generateOrganizationSchema } from "@/lib/blog/schema";
import { generateLocalBusinessSchema } from "@/lib/schema";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessSchema = generateLocalBusinessSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <ClientWidgets position="top" />
      <Header />
      <main>{children}</main>
      <Footer />
      <ClientWidgets position="bottom" />
    </>
  );
}
