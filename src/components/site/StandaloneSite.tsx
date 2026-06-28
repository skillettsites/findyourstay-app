import Link from "next/link";
import { SiteNav, type NavLink } from "./SiteNav";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import { ResultsMap } from "@/components/ResultsMap";
import { prettyType, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export type SitePage = "home" | "rooms" | "gallery" | "location" | "book";
export type SiteTheme = "classic" | "modern" | "coastal";

// Three premium, ready-made website templates a host can choose from. Each is a
// full standalone multi-page site (Home/Rooms/Gallery/Location/Book) with its own
// nav, booking and footer. The `theme` swaps the entire look and feel.
interface Tokens {
  label: string;
  btn: string; // primary CTA
  btnGhost: string; // secondary CTA on dark/photo
  accent: string; // accent text colour
  eyebrow: string; // hero eyebrow
  heroH1: string; // hero heading style
  overlay: string; // hero photo overlay
  alt: string; // alternating section background
  dark: string; // dark band background
  pill: string; // amenity chip
  radius: string; // card radius
  check: string; // tick colour
}

const THEMES: Record<SiteTheme, Tokens> = {
  classic: {
    label: "Classic",
    btn: "bg-brand-gradient text-white rounded-full shadow-glow",
    btnGhost: "bg-white text-ink rounded-full",
    accent: "text-brand",
    eyebrow: "uppercase tracking-[0.25em] text-white/90 text-sm",
    heroH1: "font-display font-extrabold",
    overlay: "bg-gradient-to-b from-black/45 via-black/15 to-black/55",
    alt: "bg-mist border-y border-line",
    dark: "bg-ink text-white",
    pill: "border border-line rounded-full",
    radius: "rounded-3xl",
    check: "text-brand",
  },
  modern: {
    label: "Modern",
    btn: "bg-ink text-white rounded-none hover:bg-ink/90",
    btnGhost: "bg-white text-ink rounded-none",
    accent: "text-ink",
    eyebrow: "uppercase tracking-[0.35em] text-white/80 text-xs",
    heroH1: "font-display font-bold uppercase tracking-[0.12em]",
    overlay: "bg-gradient-to-b from-black/55 via-black/30 to-black/65",
    alt: "bg-white border-y border-ink/10",
    dark: "bg-black text-white",
    pill: "border border-ink/25 rounded-none",
    radius: "rounded-none",
    check: "text-ink",
  },
  coastal: {
    label: "Coastal",
    btn: "bg-teal-600 text-white rounded-full hover:bg-teal-700",
    btnGhost: "bg-white text-teal-700 rounded-full",
    accent: "text-teal-600",
    eyebrow: "uppercase tracking-[0.2em] text-white/90 text-sm",
    heroH1: "font-display font-extrabold",
    overlay: "bg-gradient-to-b from-sky-950/40 via-sky-900/15 to-sky-950/60",
    alt: "bg-sky-50 border-y border-sky-100",
    dark: "bg-slate-800 text-white",
    pill: "border border-sky-200 rounded-full text-sky-800",
    radius: "rounded-[1.75rem]",
    check: "text-teal-600",
  },
};

export function StandaloneSite({
  listing,
  base,
  domain,
  page,
  theme = "classic",
  example = false,
}: {
  listing: Listing;
  base: string;
  domain: string;
  page: SitePage;
  theme?: SiteTheme;
  example?: boolean;
}) {
  const t = THEMES[theme];
  const photos = listing.photos.length ? listing.photos : [`https://picsum.photos/seed/${listing.id}/1600/900`];
  const home = base || "/";
  const q = base ? "" : ""; // theme persists via the example query string (added in href)
  const themeQ = example ? `?t=${theme}` : "";
  const href = (p: string) => `${base}/${p}${themeQ}`;
  const links: NavLink[] = [
    { key: "home", label: "Home", href: `${home}${themeQ}` },
    { key: "rooms", label: "The Rooms", href: href("rooms") },
    { key: "gallery", label: "Gallery", href: href("gallery") },
    { key: "location", label: "Location", href: href("location") },
    { key: "book", label: "Book", href: href("book") },
  ];
  void q;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {example && (
        <div className="bg-ink text-white text-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
            <Link href="/host" className="font-semibold hover:underline">← Back to FindYourStay for hosts</Link>
            <span className="text-white/80 text-right">
              <b className="text-white">{t.label}</b> template · would live at <b className="text-white">{domain}</b>, built &amp; hosted for you
            </span>
          </div>
        </div>
      )}

      <SiteNav name={listing.propertyName} domain={domain} links={links} active={page} bookHref={href("book")} btn={t.btn} activeText={t.accent} />

      <main className="flex-1">
        {page === "home" && <Home listing={listing} photos={photos} href={href} t={t} />}
        {page === "rooms" && <Rooms listing={listing} photos={photos} href={href} t={t} />}
        {page === "gallery" && <Gallery listing={listing} photos={photos} t={t} />}
        {page === "location" && <Location listing={listing} t={t} />}
        {page === "book" && <Book listing={listing} t={t} />}
      </main>

      <Footer listing={listing} domain={domain} links={links} t={t} />
    </div>
  );
}

/* ---------------- Home ---------------- */
function Home({ listing, photos, href, t }: { listing: Listing; photos: string[]; href: (p: string) => string; t: Tokens }) {
  return (
    <>
      <section className="relative h-[80vh] min-h-[540px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0]} alt={listing.propertyName} className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 ${t.overlay}`} />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
          <p className={t.eyebrow}>{prettyType(listing.propertyType)} · {listing.cityName}</p>
          <h1 className={`${t.heroH1} text-4xl sm:text-6xl mt-4 max-w-3xl`}>{listing.propertyName}</h1>
          <p className="mt-4 text-lg text-white/90 max-w-xl">A warm, independent stay in {listing.neighborhood || listing.cityName}. Book direct with us, never any platform fees.</p>
          <Link href={href("book")} className={`mt-8 font-semibold px-8 py-3.5 ${t.btn}`}>Check availability</Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <p className={`text-xs font-bold uppercase tracking-[0.25em] ${t.accent}`}>Welcome</p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Your home from home in {listing.cityName}</h2>
        <p className="mt-5 text-lg text-ink/80 leading-relaxed">{listing.description || `A characterful place to stay in ${listing.cityName}, hosted with care.`}</p>
        <p className="mt-5 text-2xl font-display font-semibold">{formatPrice(listing.pricePerNight, listing.currency)} <span className="text-base font-normal text-muted">per night</span></p>
      </section>

      <section className={t.alt}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-8 text-center">
          {[
            ["Book direct", "No booking fees and no middleman. You deal straight with us."],
            ["Truly local", `Genuine, personal hospitality in the heart of ${listing.cityName}.`],
            ["Best rate, always", "The price here is our lowest, guaranteed, because it's direct."],
          ].map(([title, d]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-lg">{title}</h3>
              <p className="text-muted text-sm mt-2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className={`overflow-hidden aspect-[4/3] shadow-card ${t.radius}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[1] ?? photos[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-display font-bold text-3xl">The rooms</h2>
          <p className="mt-3 text-ink/80">Comfortable, well-kept and ready for you. Take a look at the space and everything that&apos;s included.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {listing.amenities.slice(0, 6).map((a) => (
              <span key={a} className={`text-sm px-3 py-1.5 ${t.pill}`}>{a}</span>
            ))}
          </div>
          <Link href={href("rooms")} className={`inline-block mt-7 font-semibold ${t.accent} hover:underline`}>See the rooms →</Link>
        </div>
      </section>

      <section className={t.dark}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl">Find us in {listing.cityName}</h2>
            <p className="opacity-70 mt-1">In the heart of {listing.neighborhood || listing.cityName}. Explore the area.</p>
          </div>
          <Link href={href("location")} className={`font-semibold px-6 py-3 whitespace-nowrap ${t.btnGhost}`}>View location</Link>
        </div>
      </section>
    </>
  );
}

/* ---------------- The Rooms ---------------- */
function Rooms({ listing, photos, href, t }: { listing: Listing; photos: string[]; href: (p: string) => string; t: Tokens }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">The rooms</h1>
      <p className="text-muted mt-2">{prettyType(listing.propertyType)} · comfortable space for your group</p>

      <div className="mt-8 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className={`overflow-hidden aspect-[16/10] shadow-card ${t.radius}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt={listing.propertyName} className="w-full h-full object-cover" />
          </div>
          {photos.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {photos.slice(1, 4).map((p, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={p} alt="" className={`w-full h-24 object-cover ${t.radius}`} />
              ))}
            </div>
          )}
          <h2 className="font-display font-bold text-2xl mt-8">About the space</h2>
          <p className="mt-3 text-ink/80 leading-relaxed">{listing.description || `A comfortable ${prettyType(listing.propertyType).toLowerCase()} in ${listing.cityName}.`}</p>

          <h2 className="font-display font-bold text-2xl mt-8">What&apos;s included</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {listing.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2.5 text-sm"><span className={t.check}>✓</span> {a}</div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className={`lg:sticky lg:top-24 border border-line p-6 text-center shadow-card ${t.radius}`}>
            <p className="text-3xl font-display font-bold">{formatPrice(listing.pricePerNight, listing.currency)}</p>
            <p className="text-muted text-sm">per night</p>
            <Link href={href("book")} className={`block mt-5 font-semibold py-3 ${t.btn}`}>Check availability</Link>
            <p className="text-xs text-muted mt-3">Book direct · no platform fees</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ---------------- Gallery ---------------- */
function Gallery({ listing, photos, t }: { listing: Listing; photos: string[]; t: Tokens }) {
  const imgs = photos.length > 1 ? photos : [...photos, `https://picsum.photos/seed/${listing.id}-a/800/600`, `https://picsum.photos/seed/${listing.id}-b/800/600`];
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">Gallery</h1>
      <p className="text-muted mt-2">A look around {listing.propertyName}</p>
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {imgs.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={p} alt="" loading="lazy" decoding="async" className={`w-full object-cover break-inside-avoid ${t.radius}`} />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Location ---------------- */
function Location({ listing, t }: { listing: Listing; t: Tokens }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="font-display font-bold text-4xl">Location</h1>
      <p className="text-muted mt-2">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country} · approximate area</p>
      <div className={`mt-6 h-[420px] overflow-hidden border border-line ${t.radius}`}>
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
          <p className="mt-3 text-ink/80">Full directions and transport tips are sent with your booking confirmation. We&apos;re always happy to help you plan your arrival.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Book ---------------- */
function Book({ listing, t }: { listing: Listing; t: Tokens }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display font-bold text-4xl">Book your stay</h1>
        <p className="mt-3 text-ink/80 text-lg">Check your dates and reserve directly with us. You pay securely by card with no platform fees added.</p>
        <ul className="mt-6 space-y-3 text-sm">
          {["Instant request, quick confirmation", "Secure card payment, padlock protected", "Best rate, booked direct", "Personal service from your host"].map((f) => (
            <li key={f} className="flex gap-3"><span className={`grid place-items-center w-6 h-6 rounded-full bg-ink/5 ${t.check} text-xs shrink-0`}>✓</span> {f}</li>
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
function Footer({ listing, domain, links, t }: { listing: Listing; domain: string; links: NavLink[]; t: Tokens }) {
  return (
    <footer className={t.dark}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <p className="font-display font-bold text-lg">{listing.propertyName}</p>
          <p className="text-sm mt-1 opacity-80">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country}</p>
          <p className="text-sm mt-3 opacity-60">{domain}</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Explore</p>
          <ul className="space-y-2 text-sm opacity-80">
            {links.map((l) => <li key={l.key}><Link href={l.href} className="hover:opacity-100">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Book direct</p>
          <p className="text-sm opacity-80">No platform fees. Best rate, every time. Secure payment and genuine, personal service.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 text-xs opacity-50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} {listing.propertyName}</span>
          <span>Website by FindYourStay · built &amp; hosted on Cloudflare</span>
        </div>
      </div>
    </footer>
  );
}
