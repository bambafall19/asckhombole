/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: '/',
  sw: 'sw.js',
});


const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    // This is to allow the Next.js dev server to be accessed from the Firebase Studio preview URL.
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  }
};

module.exports = withPWA(nextConfig);
