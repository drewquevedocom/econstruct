import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | econstruct Inc. - Los Angeles Luxury Builder",
    default: "econstruct Inc. - Los Angeles Luxury Builder",
  },
  description:
    "Luxury home building, fire rebuilds, custom home construction, remodels, and tenant improvements across Los Angeles. CA License #964015.",
  metadataBase: new URL("https://econstructinc.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/econstruct_red_square.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
      <body className="font-body bg-background text-body-text antialiased">{children}</body>
    </html>
  );
}
