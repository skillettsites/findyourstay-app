import Link from "next/link";
import { ResultsMap } from "@/components/ResultsMap";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import { prettyType } from "@/lib/format";
import type { Listing } from "@/lib/types";

// The standalone host booking site. Rendered both as an example (/sites/[slug],
// with the example banner) and live on a host's own domain (/sites/by-domain).
export function MicrositeView({
  listing,
  domain,
  example = false,
}: {
  listing: Listing;
  domain: string;
  example?: boolean;
}) {
  const photos = listing.photos.length ? listing.photos : [`https://picsum.photos/seed/${listing.id}/1600/900`];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {example && (
        <div className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
            <Link href="/host" className="inline-flex items-center gap-1.5 font-semibold hover:underline shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to hosts
            </Link>
            <span className="text-white/80 text-right">
              Example standalone site · would live at <b className="text-white">{domain}</b>, hosted on Cloudflare
            </span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 glass border-b border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="font-display font-bold text-lg">{listing.propertyName}</span>
            <span className="hidden sm:inline text-xs text-muted">{domain}</span>
          </span>
          <a href="#book" className="bg-brand-gradient text-white text-sm font-semibold px-5 py-2 rounded-full">Book direct</a>
        </div>
      </header>

      <section className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0]} alt={listing.propertyName} className="w-full h-[52vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm uppercase tracking-wide opacity-90">{prettyType(listing.propertyType)} · {listing.cityName}, {listing.country}</p>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl mt-1 max-w-3xl">{listing.propertyName}</h1>
            <p className="mt-2 text-white/90">Book your stay direct with the owner. No platform fees.</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-10 flex-1">
        <div className="lg:col-span-2">
          {photos.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
              {photos.slice(1, 7).map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={p} alt="" className="w-full h-32 sm:h-40 object-cover rounded-xl" />
              ))}
            </div>
          )}

          <h2 className="font-display font-bold text-2xl">About this stay</h2>
          <p className="mt-3 text-ink/90 leading-relaxed">{listing.description}</p>

          <h2 className="font-display font-bold text-2xl mt-8">Amenities</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {listing.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2.5 text-sm">
                <span className="text-brand">✓</span> {a}
              </div>
            ))}
          </div>

          <h2 className="font-display font-bold text-2xl mt-8">Where you&apos;ll be</h2>
          <div className="mt-3 h-72 rounded-2xl overflow-hidden border border-line">
            <ResultsMap points={[{ id: listing.id, slug: listing.slug, name: listing.propertyName, lat: listing.lat, lng: listing.lng, price: listing.pricePerNight, currency: listing.currency }]} />
          </div>
        </div>

        <div id="book" className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <MicrositeBooking listing={listing} />
          </div>
        </div>
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        <p className="font-display font-bold text-ink">{listing.propertyName}</p>
        <p className="mt-1">{domain} · Direct bookings · {listing.cityName}, {listing.country}</p>
        <p className="mt-3 text-xs">Your own website, built &amp; hosted by FindYourStay on Cloudflare</p>
      </footer>
    </div>
  );
}
