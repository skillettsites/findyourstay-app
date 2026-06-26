import { notFound } from "next/navigation";
import { StandaloneSite, type SitePage } from "@/components/site/StandaloneSite";
import { getListingBySlug } from "@/lib/db";
import { suggestDomain } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGES = ["rooms", "gallery", "location", "book"];
function toPage(seg?: string[]): SitePage {
  const s = seg?.[0];
  return (s && PAGES.includes(s) ? s : "home") as SitePage;
}

// Example of a host's standalone website (shows the example banner).
export default async function ExampleSitePage({ params }: { params: Promise<{ slug: string; seg?: string[] }> }) {
  const { slug, seg } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();
  return (
    <StandaloneSite
      listing={listing}
      base={`/sites/${slug}`}
      domain={suggestDomain(listing.propertyName)}
      page={toPage(seg)}
      example
    />
  );
}
