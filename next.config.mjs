/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "firebasestorage.googleapis.com",
      "assets.upstox.com",
      "zerodha.com",
      "angelone.in",
      "groww.in"
    ],
  },
};

export default nextConfig;
