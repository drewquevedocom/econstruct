import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
