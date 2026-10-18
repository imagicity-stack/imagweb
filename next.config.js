/** @type {import('next').NextConfig} */

// Only the project's own Firebase Storage bucket may be fed through next/image,
// so nobody can make this site's image optimizer process files hosted in some
// other bucket. Falls back to the hostnames if the bucket isn't configured.
const bucket = (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").trim();
const imagePatterns = bucket
  ? [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: `/v0/b/${bucket}/o/**` },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: `/${bucket}/**` }
    ]
  : [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" }
    ];

// Baseline hardening headers for every response. frame-ancestors / X-Frame-Options
// stop other sites from embedding pages (clickjacking, e.g. on /admin).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000" }
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: imagePatterns
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

module.exports = nextConfig;
