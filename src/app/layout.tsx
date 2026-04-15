import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | econstruct Inc. - Los Angeles Luxury Builder",
    default: "econstruct Inc. - Los Angeles Luxury Builder",
  },
  description:
    "Luxury home building, fire rebuilds, custom home construction, remodels, and tenant improvements across Los Angeles. CA License #964015.",
  metadataBase: new URL("https://econstructhomes.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/econstruct_red_square.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/econstruct_red_square.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "econstruct Inc.",
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

