import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Strip console.* (incl. console.error) in production bundles
  compiler: {
    // Only remove consoles when building for production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
