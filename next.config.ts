import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "econstructinc.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/econstructinc.com/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.md": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.econstructhomes.com",
          },
        ],
        destination: "https://econstructhomes.com/:path*",
        permanent: true,
      },
      {
        source: "/services/fire-rebuild",
        destination: "/services/fire-rebuild-contractor-los-angeles",
        permanent: true,
      },
      {
        source: "/services/luxury-modernization",
        destination: "/services/luxury-home-builder-los-angeles",
        permanent: true,
      },
      {
        source: "/services/custom-homes",
        destination: "/services/custom-home-construction-los-angeles",
        permanent: true,
      },
      {
        source: "/services/adu-construction",
        destination: "/services/home-additions-los-angeles",
        permanent: true,
      },
      {
        source: "/luxury-home-builders-beverly-hills",
        destination: "/blog/luxury-home-builders-beverly-hills",
        permanent: true,
      },
      {
        source: "/custom-home-builders-bel-air-los-angeles",
        destination: "/blog/custom-home-builders-bel-air-los-angeles",
        permanent: true,
      },
      {
        source: "/luxury-home-builders-calabasas",
        destination: "/blog/luxury-home-builders-calabasas",
        permanent: true,
      },
      {
        source: "/luxury-home-builders-pacific-palisades",
        destination: "/blog/luxury-home-builders-pacific-palisades",
        permanent: true,
      },
      {
        source: "/luxury-home-builders-malibu",
        destination: "/blog/luxury-home-builders-malibu",
        permanent: true,
      },
      {
        source: "/custom-home-builders-hidden-hills",
        destination: "/blog/custom-home-builders-hidden-hills",
        permanent: true,
      },
      {
        source: "/luxury-home-builders-platinum-triangle-bel-air-holmby-hills-beverly-hills",
        destination: "/blog/luxury-home-builders-platinum-triangle-bel-air-holmby-hills-beverly-hills",
        permanent: true,
      },
      {
        // Renamed 2026-05-28: client (Frank) wants "insurance adjuster" targeting,
        // not "public adjuster". Permanent 308 redirect preserves any existing
        // backlinks / bookmarks to the old URL.
        source: "/for-public-adjusters",
        destination: "/for-insurance-adjusters",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
