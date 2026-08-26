import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel maneja su propio sistema de build — no usar "standalone"
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
