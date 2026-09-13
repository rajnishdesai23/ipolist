/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double-render in dev
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable gzip/brotli compression on all responses
  images: {
    formats: ["image/avif", "image/webp"], // Modern image formats for better compression
    minimumCacheTTL: 86400, // Cache optimised images for 24h
    domains: [
      "images.unsplash.com",
      "firebasestorage.googleapis.com",
      "assets.upstox.com",
      "zerodha.com",
      "angelone.in",
      "groww.in",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Strip console.log in production builds
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "firebase", "date-fns"], // Tree-shake large packages
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
