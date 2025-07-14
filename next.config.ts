import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure ESLint to be less strict on non-security-critical rules
  eslint: {
    // Keep ESLint enabled but ignore specific non-security rules
    ignoreDuringBuilds: false,
  },
  // Keep TypeScript error checking enabled for security
  typescript: {
    ignoreBuildErrors: false,
  },
  // Strip console.* (incl. console.error) in production bundles
  compiler: {
    // Only remove consoles when building for production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
