import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
      serverActions: {
        bodySizeLimit: "4mb",
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "cdn.sanity.io",
          port: "",
        },
        {
          protocol: "https",
          hostname: "utfs.io",
          port: "",
          pathname: "/f/**",
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
          port: "",
        },
      ],
    },
  };

export default nextConfig;
