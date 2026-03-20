import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | eConstruct Inc.",
    default: "eConstruct Inc. — Los Angeles' Premier High-End Home Builder",
  },
  description: "Fire Rebuilds. Luxury Modernization. Ground-Up Custom Homes. CA License #964015. 25+ years of premium residential construction in Los Angeles.",
  metadataBase: new URL("https://econstructinc.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "eConstruct Inc.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${jakarta.variable} font-body bg-background text-body-text antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
