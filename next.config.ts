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
