/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent double-render in dev (strict mode renders components twice)
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
    optimizePackageImports: ["lucide-react", "firebase"], // Tree-shake large icon/firebase bundles
  },
};

export default nextConfig;
