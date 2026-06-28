import { notFound } from "next/navigation";
import { StandaloneSite, type SitePage, type SiteTheme } from "@/components/site/StandaloneSite";
import { getListingBySlug } from "@/lib/db";
import { EXAMPLE_STAYS } from "@/lib/exampleStays";
import { suggestDomain } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGES = ["rooms", "gallery", "location", "book"];
const THEMES = ["classic", "modern", "coastal"];
function toPage(seg?: string[]): SitePage {
  const s = seg?.[0];
  return (s && PAGES.includes(s) ? s : "home") as SitePage;
}

type SP = Promise<Record<string, string | string[] | undefined>>;

// Example of a host's standalone website. ?t=classic|modern|coastal picks the template.
export default async function ExampleSitePage({ params, searchParams }: { params: Promise<{ slug: string; seg?: string[] }>; searchParams: SP }) {
  const { slug, seg } = await params;
  const tRaw = (await searchParams).t;
  const listing = EXAMPLE_STAYS[slug] ?? (await getListingBySlug(slug));
  if (!listing) notFound();
  // Honour ?t=, else fall back to the stay's own template.
  const theme = (THEMES.includes(tRaw as string) ? tRaw : listing.siteTheme ?? "classic") as SiteTheme;
  return (
    <StandaloneSite
      listing={listing}
      base={`/sites/${slug}`}
      domain={suggestDomain(listing.propertyName)}
      page={toPage(seg)}
      theme={theme}
      example
    />
  );
}
