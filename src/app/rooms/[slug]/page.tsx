import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { ResultsMap } from "@/components/ResultsMap";
import { BookingBox } from "@/components/BookingBox";
import { RoomGallery } from "@/components/RoomGallery";
import { BackButton } from "@/components/BackButton";
import { PerksList } from "@/components/PerksList";
import { Stagger, StaggerItem } from "@/components/Motion";
import { getListingBySlug, getRelatedListings, recordEvent } from "@/lib/db";
import { prettyType, formatPrice } from "@/lib/format";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListingBySlug(slug);
  if (!l) return { title: "Stay not found | FindYourStay" };
  const title = `${l.propertyName} — ${l.cityName}, ${l.country} | FindYourStay`;
  const description = `${(l.description ?? `${prettyType(l.propertyType)} in ${l.cityName}.`).slice(0, 150)} Book direct, no fees.`;
  return {
    title,
    description,
    alternates: { canonical: `/rooms/${slug}` },
    openGraph: { title, description, type: "website", url: `${SITE}/rooms/${slug}`, images: l.photos[0] ? [l.photos[0]] : [] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  void recordEvent(listing.id, "view");
  const related = await getRelatedListings(listing, 4);
  const photos = listing.photos;
  const hasPhotos = photos.length > 0;
  const realPhotos = photos[0]?.startsWith("/places/");

  // JSON-LD. We do NOT emit aggregateRating (no real reviews collected).
  const ld = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: listing.propertyName,
    description: listing.description ?? undefined,
    address: { "@type": "PostalAddress", addressLocality: listing.cityName, addressCountry: listing.country },
    geo: listing.lat ? { "@type": "GeoCoordinates", latitude: listing.lat, longitude: listing.lng } : undefined,
    image: photos[0] ? `${photos[0].startsWith("http") ? "" : SITE}${photos[0]}` : undefined,
    priceRange: listing.pricePerNight ? formatPrice(listing.pricePerNight, listing.currency) : undefined,
    url: `${SITE}/rooms/${listing.slug}`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: listing.cityName, item: `${SITE}/s?city=${listing.citySlug}` },
      { "@type": "ListItem", position: 3, name: listing.propertyName },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 w-full py-6">
        <div className="mb-4">
          <BackButton fallback="/s" label="Back to results" />
        </div>
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold">{listing.propertyName}</h1>
        <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted mt-1">
          {listing.rating != null && <span className="text-ink">★ {listing.rating.toFixed(2)}</span>}
          <span>· {listing.reviewCount} reviews ·</span>
          <span className="underline">
            {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
            {listing.cityName}, {listing.country}
          </span>
        </div>

        {/* Gallery */}
        {hasPhotos ? (
          <RoomGallery photos={photos} name={listing.propertyName} />
        ) : (
          <div className="mt-4 grid place-items-center rounded-3xl bg-gradient-to-br from-rose-50 to-mist h-60 sm:h-[440px] shadow-card text-muted">
            <div className="text-center">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="mx-auto text-brand/60">
                <rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6l1.5-2h5L16 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium mt-2">Photos coming soon</p>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="mt-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-5 border-b border-line">
              <div>
                <h2 className="text-lg font-semibold">
                  {prettyType(listing.propertyType)} hosted independently
                </h2>
                <p className="text-muted text-sm">Direct booking · no platform fees</p>
              </div>
            </div>

            <p className="mt-5 text-ink/90 leading-relaxed">{listing.description}</p>

            {listing.perks.length > 0 && <PerksList perks={listing.perks} className="mt-6" />}

            <h3 className="mt-8 font-semibold text-lg">What this stay offers</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {listing.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2.5 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
                    <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {a}
                </div>
              ))}
            </div>

            <h3 className="mt-8 font-semibold text-lg">Where you&apos;ll be</h3>
            <p className="text-sm text-muted mt-1">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country} · approximate location</p>
            <div className="mt-3 h-72 rounded-2xl overflow-hidden border border-line">
              <ResultsMap
                approxArea
                points={[{ id: listing.id, slug: listing.slug, name: listing.propertyName, lat: listing.lat, lng: listing.lng, price: listing.pricePerNight, currency: listing.currency }]}
              />
            </div>
            <p className="text-xs text-muted mt-2">Exact address is shared after booking.</p>
          </div>

          {/* Sticky booking box */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <BookingBox listing={listing} />
              <p className="text-xs text-muted text-center mt-3">
                {realPhotos ? "Photos via Google · " : ""}
                {listing.attribution}
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-line">
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-5">More stays in {listing.cityName}</h3>
            <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
              {related.map((l) => (
                <StaggerItem key={l.id}>
                  <ListingCard listing={l} />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
