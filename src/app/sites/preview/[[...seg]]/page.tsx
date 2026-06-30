import Link from "next/link";
import { StandaloneSite, type SitePage, type SiteTheme } from "@/components/site/StandaloneSite";
import { EXAMPLE_STAYS } from "@/lib/exampleStays";
import { suggestDomain } from "@/lib/format";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

// Vibe -> template + the curated example image set we preview their site with.
const VIBES: Record<string, { theme: SiteTheme; slug: string }> = {
  beach: { theme: "coastal", slug: "beach-house-algarve" },
  city: { theme: "modern", slug: "city-loft-lisbon" },
  mountain: { theme: "classic", slug: "mountain-chalet-geres" },
};

// Render the real page for the nav segment so inner pages (rooms/gallery/
// location) show their own content, NOT the home hero + booking form.
const PAGES = ["rooms", "gallery", "location", "book"];
function toPage(seg?: string[]): SitePage {
  const s = seg?.[0];
  return (s && PAGES.includes(s) ? s : "home") as SitePage;
}

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function prettyTypeWord(t: string): string {
  const m: Record<string, string> = { guest_house: "guesthouse", apartment: "apartment", villa: "villa", chalet: "chalet", cottage: "cottage", house: "house", room: "room", hostel: "hostel", hotel: "boutique hotel" };
  return m[t] ?? "place";
}

// Live, no-signup preview of a host's future site, built from the builder form.
// A catch-all so the template nav never 404s; it always renders the home preview.
export default async function PreviewSitePage({ params, searchParams }: { params: Promise<{ seg?: string[] }>; searchParams: SP }) {
  const { seg } = await params;
  const sp = await searchParams;
  const vibe = one(sp.vibe) && VIBES[one(sp.vibe)!] ? one(sp.vibe)! : "beach";
  const base = EXAMPLE_STAYS[VIBES[vibe].slug];

  const name = (one(sp.name) || base.propertyName).slice(0, 60);
  const city = (one(sp.city) || base.cityName).slice(0, 60);
  const country = (one(sp.country) || base.country).slice(0, 60);
  const price = one(sp.price) ? Math.max(10, Math.min(9999, Number(one(sp.price)) || 0)) : base.pricePerNight;
  const bedrooms = one(sp.bedrooms) ? Math.max(1, Math.min(20, Number(one(sp.bedrooms)) || 0)) : 0;
  const type = (one(sp.type) || base.propertyType) as Listing["propertyType"];

  const amenitiesParam = one(sp.amenities);
  const amenities = amenitiesParam
    ? amenitiesParam.split("|").filter(Boolean).slice(0, 10)
    : [...(bedrooms ? [`${bedrooms} bedroom${bedrooms > 1 ? "s" : ""}`] : []), ...base.amenities].slice(0, 8);

  // Optional real content passed from the add/edit forms so the preview shows the
  // host's own photos, hero, description and perks (not just the example defaults).
  const heroImage = one(sp.hero) || null;
  const photoParam = sp.photo;
  const photos = Array.isArray(photoParam) ? photoParam : photoParam ? [photoParam] : base.photos;
  const desc = one(sp.desc);
  const perksParam = one(sp.perks);
  const perks = perksParam ? perksParam.split("|").filter(Boolean).slice(0, 8) : base.perks;
  let bedroomsData = base.bedrooms;
  try { const rd = one(sp.rooms); if (rd) { const parsed = JSON.parse(rd); if (Array.isArray(parsed)) bedroomsData = parsed.slice(0, 20); } } catch { /* ignore bad json */ }
  const bathParam = one(sp.bath);
  const bathrooms = bathParam ? Math.max(0, Math.min(20, Number(bathParam) || 0)) : base.bathrooms;

  const listing: Listing = {
    ...base,
    id: "preview",
    slug: "preview",
    propertyName: name,
    cityName: city,
    country,
    pricePerNight: price,
    propertyType: type,
    neighborhood: null,
    amenities,
    photos,
    bedrooms: bedroomsData,
    bathrooms,
    heroImage,
    perks,
    siteTheme: VIBES[vibe].theme,
    description: desc || `A wonderful ${prettyTypeWord(type)} to stay in ${city}, booked direct with the owner.`,
  };

  const domain = suggestDomain(name);
  const liveHref = `/host/new?website=1&tier=featured&theme=${VIBES[vibe].theme}&name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&price=${price ?? ""}`;

  // Embedded in the builder iframe: the builder supplies its own CTA, so drop
  // our sticky bar to give the small mobile preview its full height back.
  const embed = !!one(sp.embed);

  // Keep the builder inputs on the template's own nav links so inner pages
  // render the host's data (and stay embedded) instead of the default example.
  const qs = new URLSearchParams();
  for (const k of ["vibe", "name", "city", "country", "price", "bedrooms", "type", "embed"]) {
    const v = one(sp[k]);
    if (v) qs.set(k, String(v));
  }
  const linkQuery = qs.toString();

  return (
    <>
      <StandaloneSite listing={listing} base="/sites/preview" domain={domain} page={toPage(seg)} theme={VIBES[vibe].theme} example linkQuery={linkQuery} />

      {/* Sticky "make it live" bar — hidden when embedded in the builder */}
      {!embed && (
      <div className="sticky bottom-0 z-50 bg-ink text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">
            <b>This is a free preview</b> of your site. We&apos;ll source real photos of your place and put it on your own domain.
          </p>
          <div className="flex items-center gap-2">
            <Link href="/host/build" className="text-sm font-semibold border border-white/30 rounded-full px-4 py-2 hover:bg-white/10">Change details</Link>
            <Link href={liveHref} className="text-sm font-semibold bg-brand-gradient text-white rounded-full px-5 py-2 shadow-glow">Create this site &amp; make it live →</Link>
          </div>
        </div>
      </div>
      )}
    </>
  );
}
