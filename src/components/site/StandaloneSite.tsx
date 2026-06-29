import Link from "next/link";
import { SiteNav, type NavLink } from "./SiteNav";
import { ScrollProgress, FadeUp, HeroStage, HeroItem, ParallaxImage, Stagger, Item } from "./SiteMotion";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import { StickyBook } from "./StickyBook";
import { ResultsMap } from "@/components/ResultsMap";
import { PerksList } from "@/components/PerksList";
import { prettyType, formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export type SitePage = "home" | "rooms" | "gallery" | "location" | "book";
export type SiteTheme = "classic" | "modern" | "coastal";

// Three original, premium standalone website templates for a host's B&B / rental.
// Cinematic, animated, multi-page sites with their own nav, hero search, gallery
// and booking. `theme` swaps the whole palette and feel. Luxury-hospitality genre.
interface Tokens {
  label: string;
  btn: string;
  btnGhost: string;
  accent: string;
  eyebrow: string;
  overlay: string;
  alt: string;
  dark: string;
  pill: string;
  radius: string;
  check: string;
  bar: string;
}

// Shared micro-interaction for primary call-to-action buttons.
const CTA = "transition-all duration-300 active:scale-[0.97] motion-safe:hover:-translate-y-0.5 hover:shadow-xl";
const ZOOM = "transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] will-change-transform";

const THEMES: Record<SiteTheme, Tokens> = {
  classic: {
    label: "Classic",
    btn: "bg-stone-900 text-white rounded-md hover:bg-stone-800",
    btnGhost: "bg-white text-stone-900 rounded-md",
    accent: "text-amber-700",
    eyebrow: "uppercase tracking-[0.3em] text-white/85 text-xs",
    overlay: "bg-gradient-to-b from-black/45 via-black/30 to-black/65",
    alt: "bg-stone-50 border-y border-stone-200",
    dark: "bg-stone-900 text-white",
    pill: "border border-stone-300 rounded-md text-stone-700",
    radius: "rounded-lg",
    check: "text-amber-700",
    bar: "bg-amber-600",
  },
  modern: {
    label: "Modern",
    btn: "bg-ink text-white rounded-none hover:bg-ink/90",
    btnGhost: "bg-white text-ink rounded-none",
    accent: "text-ink",
    eyebrow: "uppercase tracking-[0.4em] text-white/80 text-[11px]",
    overlay: "bg-gradient-to-b from-black/45 via-black/25 to-black/70",
    alt: "bg-white border-y border-ink/10",
    dark: "bg-black text-white",
    pill: "border border-ink/20 rounded-none",
    radius: "rounded-none",
    check: "text-ink",
    bar: "bg-ink",
  },
  coastal: {
    label: "Coastal",
    btn: "bg-emerald-800 text-white rounded-full hover:bg-emerald-900",
    btnGhost: "bg-white text-emerald-900 rounded-full",
    accent: "text-emerald-800",
    eyebrow: "uppercase tracking-[0.25em] text-white/90 text-xs",
    overlay: "bg-gradient-to-b from-emerald-950/35 via-emerald-950/15 to-emerald-950/65",
    alt: "bg-emerald-50/60 border-y border-emerald-100",
    dark: "bg-emerald-950 text-white",
    pill: "border border-emerald-200 rounded-full text-emerald-900",
    radius: "rounded-2xl",
    check: "text-emerald-800",
    bar: "bg-emerald-600",
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
  const themeQ = example ? `?t=${theme}` : "";
  const href = (p: string) => `${base}/${p}${themeQ}`;
  const links: NavLink[] = [
    { key: "home", label: "Home", href: `${home}${themeQ}` },
    { key: "rooms", label: "The Rooms", href: href("rooms") },
    { key: "gallery", label: "Gallery", href: href("gallery") },
    { key: "location", label: "Location", href: href("location") },
    { key: "book", label: "Book", href: href("book") },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <ScrollProgress className={t.bar} />
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

      <SiteNav name={listing.propertyName} domain={domain} links={links} active={page} bookHref={href("book")} btn={`${t.btn} ${CTA}`} activeText={t.accent} />

      <main className="flex-1">
        {page === "home" && <Home listing={listing} photos={photos} href={href} t={t} theme={theme} demo={example} />}
        {page === "rooms" && <Rooms listing={listing} photos={photos} href={href} t={t} />}
        {page === "gallery" && <Gallery listing={listing} photos={photos} t={t} />}
        {page === "location" && <Location listing={listing} t={t} />}
        {page === "book" && <Book listing={listing} t={t} demo={example} />}
      </main>

      <Footer listing={listing} domain={domain} links={links} t={t} />

      {/* Collapsed "Book now" on the inner pages (home + book already have the form) */}
      {(page === "rooms" || page === "gallery" || page === "location") && <StickyBook listing={listing} demo={example} />}
    </div>
  );
}

/* ---------------- Home (dispatches to one of three distinct layouts) ---------------- */
type HomeProps = { listing: Listing; photos: string[]; href: (p: string) => string; t: Tokens; demo: boolean };
function Home(p: HomeProps & { theme: SiteTheme }) {
  const sub: HomeProps = { listing: p.listing, photos: p.photos, href: p.href, t: p.t, demo: p.demo };
  if (p.theme === "modern") return <HomeModern {...sub} />;
  if (p.theme === "coastal") return <HomeCoastal {...sub} />;
  return <HomeClassic {...sub} />;
}

/* Shared premium hero: full-bleed (or rounded-inset) image, the property on the
   left and a real booking/request form on the right. Used by all templates so
   every site opens with a 2-column "book now" hero on a par with the main site. */
function HeroWithForm({ listing, t, demo, inset = false }: { listing: Listing; t: Tokens; demo: boolean; inset?: boolean }) {
  const photo = listing.photos[0] ?? `https://picsum.photos/seed/${listing.id}/1600/900`;
  const inner = (
    <>
      <ParallaxImage src={photo} alt={listing.propertyName} priority />
      <div className={`absolute inset-0 ${t.overlay}`} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <HeroStage className="relative w-full mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="text-white [text-shadow:0_2px_22px_rgba(0,0,0,0.5)]">
          <HeroItem><p className={t.eyebrow}>{prettyType(listing.propertyType)} · {listing.cityName}{listing.country ? `, ${listing.country}` : ""}</p></HeroItem>
          <HeroItem><h1 className="font-serif font-medium tracking-tight text-4xl sm:text-5xl xl:text-6xl mt-4 leading-[1.04]">{listing.propertyName}</h1></HeroItem>
          <HeroItem><p className="mt-5 text-lg text-white/90 max-w-md font-light leading-relaxed">{(listing.description ? listing.description.slice(0, 140) : `An independent stay in ${listing.neighborhood || listing.cityName}`)}. Booked direct, never any platform fees.</p></HeroItem>
          <HeroItem>
            <div className="mt-6 flex flex-wrap gap-2">
              {(listing.perks.length ? listing.perks.slice(0, 3) : ["No platform fees", "Book direct", "Best rate"]).map((x) => (
                <span key={x} className="text-sm bg-white/15 backdrop-blur rounded-full px-3 py-1.5 border border-white/25">✓ {x}</span>
              ))}
            </div>
          </HeroItem>
        </div>
        <HeroItem className="w-full max-w-md lg:justify-self-end mx-auto lg:mx-0">
          <MicrositeBooking listing={listing} demo={demo} />
        </HeroItem>
      </HeroStage>
    </>
  );
  if (inset) {
    return (
      <section className="px-3 pt-3">
        <div className="relative rounded-[2rem] overflow-hidden flex items-center min-h-[84vh]">{inner}</div>
      </section>
    );
  }
  return <section className="relative flex items-center min-h-[86vh]">{inner}</section>;
}

/* Classic — symmetrical, centred, full-bleed cinematic hero. Traditional luxe. */
function HomeClassic({ listing, photos, href, t, demo }: HomeProps) {
  return (
    <>
      <HeroWithForm listing={listing} t={t} demo={demo} />

      {/* Story */}
      <FadeUp className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28 text-center">
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>Welcome</p>
        <h2 className="font-serif font-medium text-4xl sm:text-5xl mt-4 leading-tight">Your home from home in {listing.cityName}</h2>
        <p className="mt-6 text-lg text-ink/75 leading-relaxed font-light">{listing.description || `A characterful place to stay in ${listing.cityName}, hosted with genuine care.`}</p>
        <p className="mt-6 font-serif text-3xl">{formatPrice(listing.pricePerNight, listing.currency)} <span className="text-base font-sans text-muted">per night</span></p>
        <Link href={href("rooms")} className={`inline-block mt-7 font-semibold px-8 py-3.5 ${t.btn} ${CTA}`}>Explore the rooms</Link>
      </FadeUp>

      {/* Feature split */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-4 grid md:grid-cols-2 gap-12 items-center">
        <FadeUp className={`group overflow-hidden aspect-[4/5] shadow-xl ${t.radius}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[1] ?? photos[0]} alt="" className={`w-full h-full object-cover ${ZOOM}`} loading="lazy" />
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>The space</p>
          <h2 className="font-serif font-medium text-4xl mt-3">Designed for a restful stay</h2>
          <p className="mt-4 text-ink/75 leading-relaxed font-light">Thoughtfully kept and full of character, with everything you need close at hand. Book your dates and we&apos;ll take care of the rest.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {listing.amenities.slice(0, 6).map((a) => (
              <span key={a} className="flex items-center gap-2 text-sm"><span className={t.check}>—</span> {a}</span>
            ))}
          </div>
          <Link href={href("rooms")} className={`inline-block mt-7 font-semibold ${t.accent} hover:underline`}>See what&apos;s included →</Link>
        </FadeUp>
      </section>

      {/* Trust band */}
      <section className={`${t.alt} mt-20`}>
        <Stagger className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid sm:grid-cols-3 gap-10 text-center">
          {[
            ["Book direct", "No platform fees, no middleman. You deal straight with us, every time."],
            ["Truly independent", `Genuine, personal hospitality in the heart of ${listing.cityName}.`],
            ["Pay direct", "Pay the host directly via Stripe or PayPal. No middleman, no fees added."],
          ].map(([title, d]) => (
            <Item key={title}>
              <h3 className="font-serif text-2xl">{title}</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">{d}</p>
            </Item>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className={t.dark}>
        <FadeUp className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
          <h2 className="font-serif font-medium text-4xl">Ready when you are</h2>
          <p className="opacity-70 mt-3 max-w-lg mx-auto font-light">Check availability and book {listing.propertyName} directly, for the best rate, every time.</p>
          <Link href={href("book")} className={`inline-block mt-8 font-semibold px-9 py-4 ${t.btnGhost} ${CTA}`}>Check availability</Link>
        </FadeUp>
      </section>
    </>
  );
}

/* Modern — asymmetric split-screen editorial. Monochrome, square, magazine feel. */
function HomeModern({ listing, photos, href, t, demo }: HomeProps) {
  const gal = photos.length > 2 ? photos : [...photos, `https://picsum.photos/seed/${listing.id}-m1/900/600`, `https://picsum.photos/seed/${listing.id}-m2/900/600`];
  return (
    <>
      <HeroWithForm listing={listing} t={t} demo={demo} />

      {/* 01 — The space */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-24 grid lg:grid-cols-12 gap-10 items-center">
        <FadeUp className="lg:col-span-5">
          <p className="font-serif text-7xl text-ink/10 leading-none">01</p>
          <h2 className="font-serif text-4xl -mt-4">The space</h2>
          <p className="mt-5 text-ink/70 font-light leading-relaxed">{listing.description || `A characterful place to stay in the heart of ${listing.cityName}, kept with care and ready for your arrival.`}</p>
          <Link href={href("rooms")} className="inline-block mt-7 text-xs font-semibold uppercase tracking-[0.2em] border-b-2 border-ink pb-1 hover:opacity-60 transition">Explore the rooms</Link>
        </FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-7 group overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[1] ?? photos[0]} alt="" loading="lazy" className={`w-full aspect-[16/10] object-cover ${ZOOM}`} />
        </FadeUp>
      </section>

      {/* 02 — Comforts */}
      <section className="border-y border-ink/10 bg-mist">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <FadeUp>
            <p className="text-[11px] uppercase tracking-[0.45em] text-muted">02 — Comforts</p>
            <h2 className="font-serif text-4xl mt-3">Everything included</h2>
          </FadeUp>
          <Stagger className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12">
            {(listing.amenities.length ? listing.amenities : ["WiFi", "Kitchen", "Heating"]).map((a) => (
              <Item key={a} className="flex items-center justify-between border-b border-ink/10 py-3.5 text-sm">
                <span>{a}</span><span className="text-ink/25 text-xs uppercase tracking-wider">incl.</span>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 03 — Gallery filmstrip */}
      <section className="py-20">
        <FadeUp className="mx-auto max-w-6xl px-4 sm:px-6 flex items-end justify-between mb-7">
          <h2 className="font-serif text-4xl">A look around</h2>
          <Link href={href("gallery")} className="text-xs font-semibold uppercase tracking-[0.2em] border-b-2 border-ink pb-1 hover:opacity-60 transition">View gallery</Link>
        </FadeUp>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 snap-x">
          {gal.slice(0, 7).map((p, i) => (
            <div key={i} className="group overflow-hidden shrink-0 snap-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" loading="lazy" className={`h-72 w-[26rem] max-w-[82vw] object-cover ${ZOOM}`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-white">
        <FadeUp className="mx-auto max-w-6xl px-4 sm:px-6 py-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h2 className="font-serif text-5xl lg:text-6xl max-w-xl leading-[1.05]">Stay with us in {listing.cityName}.</h2>
          <Link href={href("book")} className={`self-start bg-white text-ink px-9 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white/90 ${CTA}`}>Check availability</Link>
        </FadeUp>
      </section>
    </>
  );
}

/* Coastal — airy, rounded, lots of whitespace. Inset hero with a floating search card. */
function HomeCoastal({ listing, photos, href, t, demo }: HomeProps) {
  return (
    <>
      <HeroWithForm listing={listing} t={t} demo={demo} inset />

      {/* Welcome */}
      <FadeUp className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <p className="uppercase tracking-[0.25em] text-emerald-800 text-xs font-semibold">Welcome</p>
        <h2 className="font-serif text-4xl sm:text-5xl mt-4 leading-tight">Your home from home in {listing.cityName}</h2>
        <p className="mt-6 text-lg text-ink/70 leading-relaxed font-light">{listing.description || `A relaxed, characterful place to stay, hosted with genuine care in ${listing.cityName}.`}</p>
        <p className="mt-6 font-serif text-3xl text-emerald-900">{formatPrice(listing.pricePerNight, listing.currency)} <span className="text-base font-sans text-muted">per night</span></p>
      </FadeUp>

      {/* Feature — rounded offset */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
        <FadeUp className="group overflow-hidden rounded-[2rem] aspect-[4/5] shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[1] ?? photos[0]} alt="" loading="lazy" className={`w-full h-full object-cover ${ZOOM}`} />
        </FadeUp>
        <FadeUp delay={0.1} className="bg-emerald-50/60 rounded-[2rem] p-8 sm:p-10">
          <h2 className="font-serif text-3xl text-emerald-950">Made for slow mornings</h2>
          <p className="mt-3 text-ink/70 font-light leading-relaxed">Everything you need for an easy, restful stay, close to the best of {listing.cityName}.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {(listing.amenities.length ? listing.amenities : ["WiFi", "Kitchen", "Heating"]).map((a) => (
              <span key={a} className="bg-white border border-emerald-100 text-emerald-900 text-sm rounded-full px-4 py-1.5 transition hover:border-emerald-300">{a}</span>
            ))}
          </div>
          <Link href={href("rooms")} className="inline-block mt-7 font-semibold text-emerald-800 hover:underline">See what&apos;s included →</Link>
        </FadeUp>
      </section>

      {/* Soft trust cards */}
      <Stagger className="mx-auto max-w-6xl px-4 sm:px-6 py-20 grid sm:grid-cols-3 gap-6">
        {[
          ["Book direct", "No platform fees, no middleman, ever."],
          ["Truly independent", `Personal hospitality in ${listing.cityName}.`],
          ["Pay direct", "Pay the host directly via Stripe or PayPal."],
        ].map(([title, d]) => (
          <Item key={title} className="bg-emerald-50/60 rounded-[2rem] p-8 text-center transition hover:bg-emerald-50 hover:shadow-lg">
            <h3 className="font-serif text-2xl text-emerald-950">{title}</h3>
            <p className="text-muted text-sm mt-2 leading-relaxed">{d}</p>
          </Item>
        ))}
      </Stagger>

      {/* CTA — rounded emerald slab */}
      <section className="px-3 pb-3">
        <FadeUp className="rounded-[2rem] bg-emerald-950 text-white text-center py-20 px-6">
          <h2 className="font-serif text-4xl sm:text-5xl">Ready when you are</h2>
          <p className="opacity-70 mt-3 max-w-lg mx-auto font-light">Check availability and book {listing.propertyName} directly, for the best rate, every time.</p>
          <Link href={href("book")} className={`inline-block mt-8 font-semibold px-9 py-4 bg-white text-emerald-900 rounded-full ${CTA}`}>Check availability</Link>
        </FadeUp>
      </section>
    </>
  );
}

/* ---------------- The Rooms ---------------- */
function Rooms({ listing, photos, href, t }: { listing: Listing; photos: string[]; href: (p: string) => string; t: Tokens }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <FadeUp>
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>Accommodation</p>
        <h1 className="font-serif font-medium text-5xl mt-3">The rooms</h1>
      </FadeUp>

      <div className="mt-10 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <FadeUp className={`group overflow-hidden aspect-[16/10] shadow-xl ${t.radius}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt={listing.propertyName} className={`w-full h-full object-cover ${ZOOM}`} />
          </FadeUp>
          {photos.length > 1 && (
            <Stagger className="grid grid-cols-3 gap-3 mt-3">
              {photos.slice(1, 4).map((p, i) => (
                <Item key={i} className={`group overflow-hidden ${t.radius}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" loading="lazy" className={`w-full h-28 object-cover ${ZOOM}`} />
                </Item>
              ))}
            </Stagger>
          )}
          <FadeUp>
            <h2 className="font-serif text-3xl mt-10">About the space</h2>
            <p className="mt-3 text-ink/75 leading-relaxed font-light text-lg">{listing.description || `A comfortable ${prettyType(listing.propertyType).toLowerCase()} in ${listing.cityName}.`}</p>

            <h2 className="font-serif text-3xl mt-10">What&apos;s included</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {listing.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2.5 text-sm"><span className={t.check}>—</span> {a}</div>
              ))}
            </div>
          </FadeUp>
        </div>

        <aside className="lg:col-span-1">
          <div className={`lg:sticky lg:top-24 border border-line p-7 text-center shadow-lg ${t.radius}`}>
            <p className="font-serif text-4xl">{formatPrice(listing.pricePerNight, listing.currency)}</p>
            <p className="text-muted text-sm">per night</p>
            <Link href={href("book")} className={`block mt-6 font-semibold py-3.5 ${t.btn} ${CTA}`}>Check availability</Link>
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
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <FadeUp>
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>Gallery</p>
        <h1 className="font-serif font-medium text-5xl mt-3">A look around</h1>
      </FadeUp>
      <Stagger className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {imgs.map((p, i) => (
          <Item key={i} className={`group overflow-hidden break-inside-avoid ${t.radius}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt="" loading="lazy" decoding="async" className={`w-full object-cover ${ZOOM}`} />
          </Item>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------------- Location ---------------- */
function Location({ listing, t }: { listing: Listing; t: Tokens }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <FadeUp>
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>Location</p>
        <h1 className="font-serif font-medium text-5xl mt-3">Where you&apos;ll be</h1>
        <p className="text-muted mt-2">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country} · approximate area</p>
      </FadeUp>
      <FadeUp delay={0.1} className={`mt-6 h-[440px] overflow-hidden border border-line ${t.radius}`}>
        <ResultsMap approxArea points={[{ id: listing.id, slug: listing.slug, name: listing.propertyName, lat: listing.lat, lng: listing.lng, price: listing.pricePerNight, currency: listing.currency }]} />
      </FadeUp>
      <p className="text-xs text-muted mt-2">The exact address is shared with you once your booking is confirmed.</p>

      <div className="mt-12 grid sm:grid-cols-2 gap-10">
        <FadeUp>
          <h2 className="font-serif text-3xl">The area</h2>
          <p className="mt-3 text-ink/75 leading-relaxed font-light">Set in {listing.neighborhood || listing.cityName}, you&apos;re close to the best of {listing.cityName}, with cafes, restaurants and sights within easy reach.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="font-serif text-3xl">Getting here</h2>
          <p className="mt-3 text-ink/75 leading-relaxed font-light">Full directions and transport tips are sent with your booking confirmation. We&apos;re always happy to help you plan your arrival.</p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------------- Book ---------------- */
function Book({ listing, t, demo = false }: { listing: Listing; t: Tokens; demo?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-14">
      <FadeUp>
        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${t.accent}`}>Reservations</p>
        <h1 className="font-serif font-medium text-5xl mt-3">Book your stay</h1>
        <p className="mt-4 text-ink/75 text-lg font-light">Send your dates and pay the host directly via Stripe or PayPal, with no platform fees added.</p>
        {listing.perks.length > 0 && <PerksList perks={listing.perks} className="mt-6" />}
        <ul className="mt-7 space-y-3.5 text-sm">
          {["Send your dates, quick confirmation", "Pay the host directly via Stripe or PayPal", "Best rate, booked direct", "Personal service from your host"].map((f) => (
            <li key={f} className="flex gap-3"><span className={`grid place-items-center w-6 h-6 rounded-full bg-ink/5 ${t.check} text-xs shrink-0`}>✓</span> {f}</li>
          ))}
        </ul>
        <div className="mt-9 border-t border-line pt-6 text-sm text-muted">
          <p className="font-semibold text-ink">Questions before you book?</p>
          <p className="mt-1">Send us a message with your dates and we&apos;ll get straight back to you.</p>
        </div>
      </FadeUp>
      <FadeUp delay={0.1}>
        <div className="lg:sticky lg:top-24">
          <MicrositeBooking listing={listing} demo={demo} />
        </div>
      </FadeUp>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ listing, domain, links, t }: { listing: Listing; domain: string; links: NavLink[]; t: Tokens }) {
  return (
    <footer className={t.dark}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-10">
        <div>
          <p className="font-serif text-2xl">{listing.propertyName}</p>
          <p className="text-sm mt-2 opacity-80">{listing.neighborhood ? `${listing.neighborhood}, ` : ""}{listing.cityName}, {listing.country}</p>
          <p className="text-sm mt-3 opacity-60">{domain}</p>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">Explore</p>
          <ul className="space-y-2 text-sm opacity-80">
            {links.map((l) => <li key={l.key}><Link href={l.href} className="hover:opacity-100 transition">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">Book direct</p>
          <p className="text-sm opacity-80 leading-relaxed">No platform fees. Best rate, every time. Secure payment and genuine, personal service.</p>
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
