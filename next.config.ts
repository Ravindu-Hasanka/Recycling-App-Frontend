import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['lh5.googleusercontent.com'],
  },
  transpilePackages: ['recharts'],
};

export default nextConfig;
