import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // The 17k local seed photos live in object storage, never in the function
  // bundle. Without this, Next traces public/places into the API routes (900MB+).
  outputFileTracingExcludes: {
    "*": ["public/places/**", "data/**", "e2e/**", "scripts/**"],
  },
};

export default nextConfig;
