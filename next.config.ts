import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/app", destination: "/en/app", permanent: false },
    ];
  },
};

export default nextConfig;
