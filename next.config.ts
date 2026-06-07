import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scene7.toyota.eu",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s.hdnux.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
