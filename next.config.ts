import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wealthboxai.html',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
