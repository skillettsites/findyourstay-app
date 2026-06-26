import Link from "next/link";
import { SiteNav, type NavLink } from "./SiteNav";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import { ResultsMap } from "@/components/ResultsMap";
import { prettyType, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export type SitePage = "home" | "rooms" | "gallery" | "location" | "book";

// A genuinely standalone B&B / short-stay website: its own nav, multiple pages,
// gallery and booking. Rendered as an example (/sites/[slug]) and live on a
// host's own domain (/sites/by-domain). `base` is the URL prefix for links
// ("" on a live custom domain, "/sites/<slug>" for the example).
export function StandaloneSite({
  listing,
  base,
  domain,
  page,
  example = false,
}: {
  listing: Listing;
  base: string;
  domain: string;
  page: SitePage;
  example?: boolean;
}) {
  const photos = listing.photos.length ? listing.photos : [`https://picsum.photos/seed/${listing.id}/1600/900`];
  const home = base || "/";
  const href = (p: string) => `${base}/${p}`;
  const links: NavLink[] = [
    { key: "home", label: "Home", href: home },
    { key: "rooms", label: "The Rooms", href: href("rooms") },
    { key: "gallery", label: "Gallery", href: href("gallery") },
    { key: "location", label: "Location", href: href("location") },
    { key: "book", label: "Book", href: href("book") },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {example && (
        <div className="bg-ink text-white text-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
            <Link href="/host" className="font-semibold hover:underline">← Back to FindYourStay for hosts</Link>
            <span className="text-white/80 text-right">Example of your standalone website · lives at <b className="text-white">{domain}</b>, hosted on Cloudflare</span>
          </div>
        </div>
      )}

      <SiteNav name={listing.propertyName} domain={domain} links={links} active={page} bookHref={href("book")} />

      <main className="flex-1">
        {page === "home" && <Home listing={listing} photos={photos} href={href} />}
        {page === "rooms" && <Rooms listing={listing} photos={photos} href={href} />}
        {page === "gallery" && <Gallery listing={listing} photos={photos} />}
        {page === "location" && <Location listing={listing} />}
        {page === "book" && <Book listing={listing} />}
      </main>

      <Footer listing={listing} domain={domain} links={links} />
    </div>
  );
}

/* ---------------- Home ---------------- */
function Home({ listing, photos, href }: { listing: Listing; photos: string[]; href: (p: string) => string }) {
  return (
    <>
      <section className="relative h-[78vh] min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0]} alt={listing.propertyName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
          <p className="uppercase tracking-[0.25em] text-sm text-white/90">{prettyType(listing.propertyType)} · {listing.cityName}</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl mt-3 max-w-3xl">{listing.propertyName}</h1>
          <p className="mt-4 text-lg text-white/90 max-w-xl">A warm, independent stay in {listing.neighborhood || listing.cityName}. Book direct with us, no platform fees.</p>
          <Link href={href("book")} className="mt-8 bg-brand-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-glow">Check availability</Link>
        </div>
      </section>

      {/* Welcome */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
        <h2 className="font-display font-bold text-3xl">Welcome</h2>
        <p className="mt-4 text-lg text-ink/80 leading-relaxed">{listing.description || `A characterful place to stay in ${listing.cityName}, hosted with care.`}</p>
        <p className="mt-3 text-2xl font-display font-semibold">{formatPrice(listing.pricePerNight, listing.currency)} <span className="text-base font-normal text-muted">per night</span></p>
      </section>

      {/* Highlights */}
      <section className="bg-mist border-y border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["Book direct", "No booking fees, no middleman. You deal straight with us."],
            ["Your home away", `Everything you need for a relaxed stay in ${listing.cityName}.`],
            ["Best rate, guaranteed", "The price here is always our lowest, direct."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-display font-semibold text-lg">{t}</h3>
              <p className="text-muted text-sm mt-2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rooms teaser */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[1] ?? photos[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl">The rooms</h2>
          <p className="mt-3 text-ink/80">Comfortable, well-kept and ready for you. Take a look at the space and what&apos;s included.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {listing.amenities.slice(0, 6).map((a) => (
              <span key={a} className="text-sm border border-line rounded-full px-3 py-1.5">{a}</span>
            ))}
          </div>
          <Link href={href("rooms")} className="inline-block mt-7 font-semibold text-brand hover:underline">See the rooms →</Link>
        </div>
      </section>

      {/* Location teaser */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl">Find us in {listing.cityName}</h2>
            <p className="text-white/70 mt-1">In the heart of {listing.neighborhood || listing.cityName}. Explore the area.</p>
          </div>
          <Link href={href("location")} className="bg-white text-ink font-semibold px-6 py-3 rounded-full whitespace-nowrap">View location</Link>
        </div>
      </section>
    </>
  );
}

/* ---------------- The Rooms ---------------- */
function Rooms({ listing, photos, href }: { listing: Listing; photos: string[]; href: (p: string) => string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">The rooms</h1>
      <p className="text-muted mt-2">{prettyType(listing.propertyType)} · sleeps your group comfortably</p>

      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="rounded-3xl overflow-hidden aspect-[16/10] shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt={listing.propertyName} className="w-full h-full object-cover" />
          </div>
          <h2 className="font-display font-bold text-2xl mt-8">About the space</h2>
          <p className="mt-3 text-ink/80 leading-relaxed">{listing.description || `A comfortable ${prettyType(listing.propertyType).toLowerCase()} in ${listing.cityName}.`}</p>

          <h2 className="font-display font-bold text-2xl mt-8">What&apos;s included</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {listing.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2.5 text-sm"><span className="text-brand">✓</span> {a}</div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 border border-line rounded-2xl shadow-card p-6 text-center">
            <p className="text-3xl font-display font-bold">{formatPrice(listing.pricePerNight, listing.currency)}</p>
            <p className="text-muted text-sm">per night</p>
            <Link href={href("book")} className="block mt-5 bg-brand-gradient text-white font-semibold py-3 rounded-full shadow-glow">Check availability</Link>
            <p className="text-xs text-muted mt-3">Book direct · no platform fees</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery({ listing, photos }: { listing: Listing; photos: string[] }) {
  const imgs = photos.length > 1 ? photos : [...photos, `https://picsum.photos/seed/${listing.id}-a/800/600`, `https://picsum.photos/seed/${listing.id}-b/800/600`];
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">Gallery</h1>
      <p className="text-muted mt-2">A look around {listing.propertyName}</p>
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {imgs.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={p} alt="" className="w-full rounded-2xl object-cover break-inside-avoid" />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Location ---------------- */
function Location({ listing }: { listing: Listing }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">Location</h1>
      <p className="text-muted mt-2">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country} · approximate area</p>
      <div className="mt-6 h-[420px] rounded-3xl overflow-hidden border border-line">
        <ResultsMap approxArea points={[{ id: listing.id, slug: listing.slug, name: listing.propertyName, lat: listing.lat, lng: listing.lng, price: listing.pricePerNight, currency: listing.currency }]} />
      </div>
      <p className="text-xs text-muted mt-2">The exact address is shared with you once your booking is confirmed.</p>

      <div className="mt-10 grid sm:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display font-bold text-2xl">The area</h2>
          <p className="mt-3 text-ink/80">Set in {listing.neighborhood || listing.cityName}, you&apos;re close to the best of {listing.cityName}, with cafes, restaurants and sights within easy reach.</p>
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl">Getting here</h2>
          <p className="mt-3 text-ink/80">Full directions and transport tips are sent with your booking confirmation. We&apos;re happy to help you plan your arrival.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Book ---------------- */
function Book({ listing }: { listing: Listing }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display font-bold text-4xl">Book your stay</h1>
        <p className="mt-3 text-ink/80 text-lg">Check your dates and reserve directly with us. You pay us directly, securely by card, with no platform fees added.</p>
        <ul className="mt-6 space-y-3 text-sm">
          {["Instant request, quick confirmation", "Secure card payment", "Best rate, booked direct", "Personal service from your host"].map((f) => (
            <li key={f} className="flex gap-3"><span className="grid place-items-center w-6 h-6 rounded-full bg-brand-gradient text-white text-xs shrink-0">✓</span> {f}</li>
          ))}
        </ul>
        <div className="mt-8 border-t border-line pt-6 text-sm text-muted">
          <p className="font-semibold text-ink">Questions before you book?</p>
          <p className="mt-1">Use the form to send us a message with your dates, we&apos;ll get straight back to you.</p>
        </div>
      </div>
      <div>
        <div className="lg:sticky lg:top-24">
          <MicrositeBooking listing={listing} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ listing, domain, links }: { listing: Listing; domain: string; links: NavLink[] }) {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="font-display font-bold text-white text-lg">{listing.propertyName}</p>
          <p className="text-sm mt-1">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country}</p>
          <p className="text-sm mt-3 text-white/60">{domain}</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Explore</p>
          <ul className="space-y-2 text-sm">
            {links.map((l) => <li key={l.key}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Book direct</p>
          <p className="text-sm">No platform fees. Best rate, every time. Secure payment, personal service.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs text-white/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {listing.propertyName}</span>
          <span>Website by FindYourStay · hosted on Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}
