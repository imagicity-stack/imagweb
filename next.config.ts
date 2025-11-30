import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**"
      }
    ]
  },
  experimental: {
    // Allow Turbopack to use system TLS certs so font downloads succeed in CI
    turbopackUseSystemTlsCerts: true
  }
};

export default nextConfig;
