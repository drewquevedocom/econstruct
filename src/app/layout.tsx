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
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/econstruct_red_square.png?v=2", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.svg?v=2",
    apple: "/econstruct_red_square.png?v=2",
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
        {children}
      </body>
    </html>
  );
}

