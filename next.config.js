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
};

const pwaConfig = withPWA(nextConfig);

// The `allowedDevOrigins` property is a new experimental feature in Next.js
// that is not yet supported by the `withPWA` plugin.
// To use it, we need to add it to the config after the `withPWA` plugin has been applied.
pwaConfig.experimental = {
    ...pwaConfig.experimental,
    // This is to allow the Next.js dev server to be accessed from the Firebase Studio preview URL.
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
};

module.exports = pwaConfig;
