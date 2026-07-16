import type { Metadata } from "next";
import Script from "next/script";
import FaviconAnimator from "@/components/FaviconAnimator";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Home Builder Beverly Hills & Los Angeles | eConstruct Homes",
  description:
    "Luxury home building, fire rebuilds, custom home construction, remodels, and tenant improvements across Los Angeles. CA License #964015.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
      { url: "/econstruct_red_square.png?v=3", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.svg?v=3",
    apple: "/econstruct_red_square.png?v=3",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "eConstruct Homes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msvalidate.01" content="354235B0ED282F8C0BEE7E99C9102E6C" />
      </head>
      <body className="font-body bg-background text-body-text antialiased">
        <FaviconAnimator />
        <Script
          id="google-analytics-loader"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LZ9NRKZ7HT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LZ9NRKZ7HT');
          `}
        </Script>
        <Script id="ga4-lead-tracking" strategy="afterInteractive">
          {`
            (function () {
              function trackEvent(name, params) {
                if (typeof window.gtag !== "function") return;
                window.gtag("event", name, params);
              }

              function getClickText(element) {
                var text = (element.innerText || element.textContent || element.getAttribute("aria-label") || "").trim();
                return text || element.getAttribute("href") || "";
              }

              document.body.addEventListener("click", function (event) {
                var target = event.target;
                if (!(target instanceof Element)) return;

                var link = target.closest('a[href^="tel:"], a[href^="mailto:"]');
                if (!(link instanceof HTMLAnchorElement)) return;

                var href = link.getAttribute("href") || "";
                var clickText = getClickText(link);
                var pageLocation = window.location.href;

                if (href.indexOf("tel:") === 0) {
                  trackEvent("phone_click", {
                    phone_number: href.replace(/^tel:/i, ""),
                    click_text: clickText,
                    page_location: pageLocation,
                  });
                  trackEvent("generate_lead", {
                    method: "phone",
                    page_location: pageLocation,
                  });
                  return;
                }

                if (href.indexOf("mailto:") === 0) {
                  trackEvent("mailto_click", {
                    email_address: href.replace(/^mailto:/i, "").split("?")[0],
                    click_text: clickText,
                    page_location: pageLocation,
                  });
                  trackEvent("generate_lead", {
                    method: "email",
                    page_location: pageLocation,
                  });
                }
              });

              window.addEventListener("econstruct:form_submit_success", function (event) {
                var detail = event && event.detail ? event.detail : {};
                trackEvent("form_submit", {
                  form_id: detail.form_id || "",
                  form_destination: detail.form_destination || window.location.href,
                  form_length: detail.form_length || 0,
                  form_name: detail.form_name || "",
                });
                trackEvent("generate_lead", {
                  method: "form",
                  form_id: detail.form_id || "",
                  form_name: detail.form_name || "",
                  page_location: detail.form_destination || window.location.href,
                });
              });
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

