import type { Metadata } from "next";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({ title, description, path, image, noIndex }: PageMetadataOptions): Metadata {
  const url = `https://econstructinc.com${path}`;
  const ogImage = image || "/econstruct_logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | econstruct Inc.`,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | econstruct Inc.`,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
