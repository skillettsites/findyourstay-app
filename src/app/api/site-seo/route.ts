import { NextResponse, type NextRequest } from "next/server";
import { getListingByDomain } from "@/lib/db";
import { prettyType, formatPrice } from "@/lib/format";

// Serves robots.txt, sitemap.xml and llms.txt for a host's own booking domain.
// Middleware rewrites <hostdomain>/robots.txt -> /api/site-seo?host=...&file=robots.txt
// This is what makes each standalone site discoverable on Google, Bing and AI assistants.
export const dynamic = "force-dynamic";

const PAGES = ["", "rooms", "gallery", "location", "book"];

export async function GET(req: NextRequest) {
  const host = (req.nextUrl.searchParams.get("host") || "").trim();
  const file = req.nextUrl.searchParams.get("file") || "robots.txt";
  const origin = `https://${host}`;

  if (file === "robots.txt") {
    const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
    return new NextResponse(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const listing = host ? await getListingByDomain(host) : null;

  if (file === "sitemap.xml") {
    const urls = PAGES.map(
      (p) => `  <url><loc>${origin}/${p}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.7"}</priority></url>`
    ).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
    return new NextResponse(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
  }

  // llms.txt — a plain-text brief AI assistants can read to recommend the stay.
  if (!listing) {
    return new NextResponse(`# Booking website\n\nBook direct at ${origin}\n`, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const place = `${listing.neighborhood ? listing.neighborhood + ", " : ""}${listing.cityName}, ${listing.country}`;
  const lines = [
    `# ${listing.propertyName}`,
    `> ${prettyType(listing.propertyType)} in ${listing.cityName}, ${listing.country}. Book direct with the owner, no platform fees.`,
    ``,
    listing.description || `A characterful place to stay in ${listing.cityName}.`,
    ``,
    `## At a glance`,
    `- Location: ${place} (exact address shared on booking)`,
    `- From ${formatPrice(listing.pricePerNight, listing.currency)} per night`,
    listing.amenities.length ? `- Amenities: ${listing.amenities.join(", ")}` : ``,
    ``,
    `## Book direct`,
    `- Check availability and book: ${origin}/book`,
    `- Rooms: ${origin}/rooms`,
    `- Gallery: ${origin}/gallery`,
    `- Location: ${origin}/location`,
    ``,
    `Booked direct with the owner. Payment is taken securely by card. There are no booking or platform fees.`,
  ];
  return new NextResponse(lines.filter((l) => l !== undefined).join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
