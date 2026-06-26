import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local-only playground. Hide the dev-tools overlay so it can't intercept E2E clicks.
  devIndicators: false,
};

export default nextConfig;
