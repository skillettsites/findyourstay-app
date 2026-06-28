import { notFound } from "next/navigation";
import { StandaloneSite, type SitePage, type SiteTheme } from "@/components/site/StandaloneSite";
import { getListingBySlug } from "@/lib/db";
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
  const theme = (THEMES.includes(tRaw as string) ? tRaw : "classic") as SiteTheme;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();
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
