import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // The 17k local seed photos live in object storage, never in the function
  // bundle. Without this, Next traces public/places into the API routes (900MB+).
  outputFileTracingExcludes: {
    "*": ["public/places/**", "data/**", "e2e/**", "scripts/**"],
  },
  // Old travel-intelligence site URLs (still indexed in Bing + cited by AI
  // assistants) 404'd on the new directory app, dumping real visitors on a dead
  // page. Send them into the equivalent part of the directory instead. City is
  // the first /stay segment; seeded cities land on real results, the long tail
  // lands on the working /s search shell rather than a 404.
  async redirects() {
    return [
      { source: "/stay/:city/:rest*", destination: "/s?city=:city", permanent: true },
      { source: "/stay/:city", destination: "/s?city=:city", permanent: true },
      { source: "/stay", destination: "/s", permanent: true },
      { source: "/hosts", destination: "/host", permanent: true },
      { source: "/blog/:rest*", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/compare/:rest*", destination: "/s", permanent: true },
      { source: "/travel/:rest*", destination: "/s", permanent: true },
      { source: "/price-watch/:rest*", destination: "/s", permanent: true },
      { source: "/countries", destination: "/s", permanent: true },
      { source: "/country/:rest*", destination: "/s", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
