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
