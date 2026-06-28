import { notFound } from "next/navigation";
import { StandaloneSite, type SitePage } from "@/components/site/StandaloneSite";
import { getListingByDomain } from "@/lib/db";

export const dynamic = "force-dynamic";

const PAGES = ["rooms", "gallery", "location", "book"];
function toPage(seg?: string[]): SitePage {
  const s = seg?.[0];
  return (s && PAGES.includes(s) ? s : "home") as SitePage;
}

// The LIVE booking website served on a host's own custom domain (no banner).
export default async function ByDomainSitePage({ params }: { params: Promise<{ host: string; seg?: string[] }> }) {
  const { host, seg } = await params;
  const domain = decodeURIComponent(host);
  const listing = await getListingByDomain(domain);
  if (!listing) notFound();
  return <StandaloneSite listing={listing} base="" domain={domain} page={toPage(seg)} theme={listing.siteTheme} />;
}
