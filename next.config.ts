import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // The 17k local seed photos live in object storage, never in the function
  // bundle. Without this, Next traces public/places into the API routes (900MB+).
  outputFileTracingExcludes: {
    "*": ["public/places/**", "data/**", "e2e/**", "scripts/**"],
  },
  // Only aliases within the NEW directory app live here. The old
  // travel-intelligence sections (/stay, /blog, /compare, /country, ...) now
  // return 410 Gone from middleware so search engines drop them; redirecting
  // them into /s was being flagged by Google as Soft 404 / duplicate-canonical.
  async redirects() {
    return [
      { source: "/hosts", destination: "/host", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
