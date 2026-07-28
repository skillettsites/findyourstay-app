import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/host/PricingCards";
import { ExplainerFilm } from "@/components/ExplainerFilm";
import { ExplainerFeatures } from "@/components/ExplainerFeatures";
import { Reveal } from "@/components/Motion";
import { BackButton } from "@/components/BackButton";
import { EXAMPLE_TEMPLATES } from "@/lib/exampleStays";

// Cached/ISR marketing page, refreshed hourly (no per-request data).
export const revalidate = 3600;

export const metadata = {
  title: "Your own direct booking website, built for you",
  description:
    "A direct booking website builder that does the building for you. We create and host your site on your own domain, sync your calendar, and guests pay you directly. No commission, ever. Listings from £79/year.",
  alternates: { canonical: "/host" },
};

// FAQ answers below are the same words shown on the page, so the schema and the
// visible content never drift apart. Nothing here is invented: every figure
// comes from the pricing cards and the features actually shipped.
const FAQS: { q: string; a: string }[] = [
  {
    q: "What is a direct booking website?",
    a: "A direct booking website is your own site, on your own web address, where guests can see your rooms and dates and book with you instead of through Airbnb or Booking.com. Because no platform sits in the middle, there is no commission on the booking and the guest relationship is yours.",
  },
  {
    q: "How do I take bookings on my own website?",
    a: "You need three things: a page that shows your availability, a way for guests to request or confirm dates, and a way to pay you. We put all three together for you. Your calendar keeps itself in step with Airbnb and Booking.com by iCal, booking requests come straight to your inbox, and payment goes through your own Stripe Payment Link or PayPal.Me, so the money never passes through us.",
  },
  {
    q: "How much does a direct booking website cost?",
    a: "A directory listing is £79, £149 or £299 a year depending on how prominent you want to be. Your own booking website is £120 a year on top of any paid plan. With the founding code FOUNDING20 that makes a Standard listing plus your own booking website £159 a year, fixed for life. There is no commission on any booking, ever.",
  },
  {
    q: "Do I need any tech skills to use it?",
    a: "No. You tell us about your property, pick a look and a web address, and we build the site and put it live for you. There is nothing to install, host, update or renew. If you want to change your photos, prices or dates later, you do it from your dashboard in a couple of clicks.",
  },
  {
    q: "Can I keep using Airbnb and Booking.com at the same time?",
    a: "Yes, and most hosts should at first. Use the platforms for discovery and your own site for repeat guests and anyone who finds you directly. Paste your Airbnb and Booking.com iCal links into your dashboard and dates booked anywhere block out everywhere, so you cannot get double booked.",
  },
  {
    q: "How do guests pay me?",
    a: "Through your own Stripe Payment Link or PayPal.Me link, which you paste into your dashboard in about two minutes. Guests pay straight into your account, so there is no payout to wait for and nothing for us to take a cut of. Refunds and cancellations stay entirely in your hands.",
  },
  {
    q: "How do I get more direct bookings for my holiday rental?",
    a: "Give guests somewhere to book and a reason to use it. A site of your own removes the dead end that a Facebook page or an enquiry form creates, a claimed Google Business Profile puts you in local map results, and a best-rate promise or a small arrival perk gives repeat guests a reason to skip the platform. Past guests are the easiest wins, because they already know they like your place.",
  },
  {
    q: "What if I already have a website?",
    a: "Then you do not need ours. Tick 'I already have my own website' on any paid plan and the price drops by £120 a year. We list you in the directory and send travellers straight to your own booking page.",
  },
  {
    q: "Do you take commission on bookings?",
    a: "No, never. You pay one yearly price and keep every penny of every booking. We are not in the payment path at all, so there is nothing for us to deduct.",
  },
];

// Honest comparison: axes a direct-booking host actually cares about, where we win.
const COMPARE_COLS = ["FindYourStay", "Booking.com / Airbnb", "DIY builder (Wix etc.)", "Booking software (Lodgify etc.)"];
const COMPARE_ROWS: [string, (boolean | "warn" | string)[]][] = [
  ["No commission on your bookings", [true, false, true, true]],
  ["Guests pay you directly, keep 100%", [true, false, true, true]],
  ["We build the website for you", [true, "n/a", false, false]],
  ["No tech skills needed", [true, true, false, "warn"]],
  ["Listed in a directory for extra discovery", [true, true, false, false]],
  ["Found on Google, Bing and AI assistants", [true, "warn", "warn", "warn"]],
  ["One simple yearly price", ["from £79/yr", "15-18% per stay", "+ domain + your time", "monthly £££"]],
];

function Cell({ v }: { v: boolean | "warn" | string }) {
  if (v === true) return <span className="text-emerald-600 text-lg font-bold">✓</span>;
  if (v === false) return <span className="text-rose-400 text-lg font-bold">✕</span>;
  if (v === "warn") return <span className="text-amber-500 text-lg font-bold">~</span>;
  return <span className="text-xs sm:text-sm text-muted">{v}</span>;
}

export default async function HostPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 pt-4">
          <BackButton fallback="/" />
        </div>

        {/* Founding banner */}
        <div className="bg-ink text-white text-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 text-center">
            <span className="font-semibold">Founding offer:</span> 20% off for life with code{" "}
            <span className="font-mono font-bold bg-white/15 rounded px-1.5 py-0.5">FOUNDING20</span> at checkout.
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-white border-b border-line">
          <div className="aurora" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <Reveal>
                <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-card">
                  The one-stop shop for direct bookings
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-display font-bold tracking-tight leading-[1.05]">
                  Your own booking website. Built for you. Found everywhere.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-lg text-muted max-w-xl mx-auto lg:mx-0">
                  We build, host and secure a direct-booking website on your own domain, get it ranking on Google,
                  Bing and the AI assistants travellers now plan with, and list you in our directory too. Guests pay
                  you directly, so you keep 100% with no commission ever. One direct booking usually covers the whole year.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Link href="/host/build" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">
                    See what your site would look like →
                  </Link>
                  <Link href="#pricing" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                    See pricing
                  </Link>
                  <Link href="/host/demo" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                    See a demo dashboard
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <ExplainerFilm />
            </Reveal>
          </div>
        </section>

        {/* Answer capsule: the plain definition, first thing on the page */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-12">
          <div className="rounded-2xl border-2 border-brand/25 bg-rose-50/60 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-brand">In short</p>
            <p className="mt-3 text-lg leading-relaxed text-ink/85">
              A <b className="text-ink">direct booking website</b> lets you take reservations straight from guests, on
              your own web address, without paying Airbnb or Booking.com commission. FindYourStay is a{" "}
              <b className="text-ink">direct booking website builder that does the building for you</b>: we make the
              site, host it, keep your calendar in step with the platforms, and connect your own Stripe or PayPal so
              guests pay you and nobody else. Listings start at £79 a year, the booking website is £120 a year on top,
              and we never take a cut of a booking.
            </p>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-display font-bold">Who this is for</h2>
            <p className="mt-3 text-muted text-lg">
              Independent hosts with one property, or a handful. If you are handing 15% of every stay to a platform and
              have nowhere of your own to send a guest, this is built for you.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                t: "Airbnb hosts",
                d: "You have the reviews and the bookings, but the fee comes off every single stay and the guest belongs to the platform, not to you.",
              },
              {
                t: "Holiday let owners",
                d: "You want more direct bookings for your holiday rental, especially repeat guests who already know the place and would happily book with you again.",
              },
              {
                t: "Small B&Bs and guesthouses",
                d: "You want to increase bookings at a small B&B without adding a monthly software bill or learning a booking system.",
              },
              {
                t: "Hosts who already have a site",
                d: "Your website looks fine but nobody finds it. List with us for less, skip the build, and we send travellers straight to your own booking page.",
              },
            ].map((x) => (
              <div key={x.t} className="bg-white rounded-2xl border border-line p-6 shadow-card">
                <h3 className="font-display font-bold text-lg">{x.t}</h3>
                <p className="mt-2 text-muted text-sm leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works, step by step */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-card">
                How it works
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-display font-bold">
                A direct booking website builder that does the building for you
              </h2>
              <p className="mt-3 text-muted text-lg">
                Most builders hand you a blank page and a monthly bill. Here you answer a few questions and we do the
                rest. Five steps, and nothing to maintain afterwards.
              </p>
            </div>
            <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              {[
                {
                  n: "1",
                  t: "Tell us about your place",
                  d: "Name, town, type of property, how many bedrooms, your nightly rate. It takes a couple of minutes and you can see the result before you pay anything.",
                },
                {
                  n: "2",
                  t: "Pick a look and an address",
                  d: "Three templates: Classic, Modern and Coastal. We check which web addresses are free, you choose one, and it becomes yours.",
                },
                {
                  n: "3",
                  t: "We build and host it",
                  d: "Your site goes live on your own domain with the padlock in place, in five pages: home, rooms, gallery, location and book.",
                },
                {
                  n: "4",
                  t: "Connect payments and your calendar",
                  d: "Paste your Stripe or PayPal link and your Airbnb and Booking.com iCal feeds. Guests pay you, and dates block out everywhere at once.",
                },
                {
                  n: "5",
                  t: "We get it found",
                  d: "We submit it to Google and Bing, add the file AI assistants read, and list you in our directory. Then the bookings arrive in your inbox.",
                },
              ].map((s) => (
                <li key={s.n} className="bg-white rounded-2xl border border-line p-6 shadow-card">
                  <div className="w-9 h-9 grid place-items-center rounded-full bg-brand-gradient text-white font-bold text-sm">
                    {s.n}
                  </div>
                  <h3 className="mt-4 font-display font-bold">{s.t}</h3>
                  <p className="mt-2 text-muted text-sm leading-relaxed">{s.d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 text-center">
              <Link
                href="/host/build"
                className="inline-block bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95"
              >
                Build your direct booking site free →
              </Link>
              <p className="mt-3 text-sm text-muted">No signup, no card. You see the site before you decide.</p>
            </div>
          </div>
        </section>

        {/* Why direct */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-display font-bold">Booking platforms take a cut of every stay. We don&apos;t.</h2>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              The big sites can charge 15 to 18% in commission, and guests pay more on top. Booking direct cuts out
              the middleman: better prices for your guests, full margins for you, and a real relationship with the
              people who stay. Add your own &ldquo;book direct&rdquo; perks too, like a best-price promise or free
              breakfast, to give travellers a reason to come straight to you.
            </p>
          </Reveal>
        </section>

        {/* Comparison table */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-4xl font-display font-bold">Why hosts choose us</h2>
                <p className="mt-3 text-muted text-lg">Everything you need to win direct bookings, in one place, for one simple yearly price.</p>
              </div>
            </Reveal>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[640px] border-collapse bg-white rounded-2xl overflow-hidden shadow-card">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left text-sm font-semibold p-4 w-[34%]"></th>
                    {COMPARE_COLS.map((c, i) => (
                      <th key={c} className={`text-center text-sm p-4 ${i === 0 ? "text-brand font-bold bg-rose-50" : "text-muted font-semibold"}`}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map(([label, vals]) => (
                    <tr key={label} className="border-b border-line last:border-0">
                      <td className="text-sm p-4 font-medium">{label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className={`text-center p-4 ${i === 0 ? "bg-rose-50/60" : ""}`}><Cell v={v} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted text-center mt-3">We&apos;re not a channel manager or PMS. We do one thing well: get independent hosts booked direct.</p>
          </div>
        </section>

        {/* Deep-dive features, animated, plain-English (indexing, llms.txt, HTTPS, calendar, commission) */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-4xl font-display font-bold">Everything we do for you</h2>
              <p className="mt-3 text-muted text-lg">Some of it you&apos;ll know. Some of it you&apos;ve probably never heard of, but it&apos;s where the bookings are going.</p>
            </div>
          </Reveal>
          <ExplainerFeatures />
        </section>

        {/* What you actually get */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-4xl font-display font-bold">
                Take bookings on your own website: everything included
              </h2>
              <p className="mt-3 text-muted text-lg">
                One yearly price, no commission and no add-ons to discover later. This is the whole list.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  h: "Your website",
                  items: [
                    "A five page booking site: home, rooms, gallery, location and book",
                    "Your own web address, set up and pointed at your site for you",
                    "Classic, Modern or Coastal template, filled in with your details",
                    "Secured with HTTPS so guests trust the checkout",
                    "Photos, room details, amenities, prices and an approximate map",
                    "Your own book direct perks and guest quotes, if you have them",
                  ],
                },
                {
                  h: "Bookings and money",
                  items: [
                    "An availability calendar guests can check before they ask",
                    "iCal sync with Airbnb and Booking.com so you are never double booked",
                    "Booking requests and enquiries sent straight to your inbox",
                    "Payment through your own Stripe Payment Link or PayPal.Me",
                    "Zero commission: we are not in the payment path at all",
                    "Accept or decline each request yourself, from your dashboard",
                  ],
                },
                {
                  h: "Getting found",
                  items: [
                    "Your own robots.txt and sitemap.xml, submitted to search engines",
                    "An llms.txt file so ChatGPT and other assistants can read and recommend you",
                    "Re-submitted to Bing through IndexNow whenever you update your listing",
                    "A listing in the FindYourStay directory and on our city search pages",
                    "A dashboard showing views, enquiries, bookings and where visitors came from",
                    "Up to 5 properties and 5 websites on the Pro plan",
                  ],
                },
              ].map((col) => (
                <div key={col.h} className="bg-white rounded-2xl border border-line p-7 shadow-card">
                  <h3 className="font-display font-bold text-lg">{col.h}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                        <span className="text-brand font-bold shrink-0">✓</span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted text-center mt-8">
              Want to see the dashboard before you commit?{" "}
              <Link href="/host/demo" className="text-brand font-semibold underline underline-offset-2">
                Open the demo dashboard
              </Link>
              , it uses real screens with sample data.
            </p>
          </div>
        </section>

        {/* Real example sites */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 text-center">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">See a website you could have</h2>
              <p className="text-muted mt-2">Three real example sites we built and host. Click around any of them.</p>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {EXAMPLE_TEMPLATES.map((x) => (
                <Link key={x.theme} href={`/sites/${x.slug}?t=${x.theme}`} className="group rounded-2xl border border-line overflow-hidden bg-white hover:shadow-card transition text-left">
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{x.place}</div>
                      <div className="text-xs text-muted mt-0.5">{x.label} template</div>
                    </div>
                    <span className="text-sm font-semibold text-brand group-hover:underline">Preview →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How you get paid */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block bg-rose-50 text-brand text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">How you get paid</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold">The money goes straight to you. We never touch it.</h2>
            <p className="mt-3 text-muted text-lg">
              You take payment through your <span className="font-semibold text-ink">own Stripe or PayPal</span>, so there&apos;s no
              commission, no waiting for a payout from us, and nothing for us to be in the middle of.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "1", t: "Add your payment link", d: "Paste your own Stripe Payment Link and/or PayPal.Me link. We show you exactly how, it takes about two minutes, and you can change it any time." },
              { n: "2", t: "Guests pay you directly", d: "On your booking site, guests pay straight into your own account. We just send them there and pass you their dates, we never see the card or the cash." },
              { n: "3", t: "You keep 100%", d: "No commission, no booking fees, no platform cut. The full price of every stay lands in your account, and refunds and cancellations stay entirely in your control." },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-2xl border border-line p-7 shadow-card">
                <div className="w-10 h-10 grid place-items-center rounded-full bg-brand-gradient text-white font-bold">{s.n}</div>
                <h3 className="mt-4 font-display font-bold text-lg">{s.t}</h3>
                <p className="mt-2 text-muted text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Simple yearly pricing</h2>
              <p className="text-muted mt-2">Billed yearly. Cancel anytime. No commission on any booking.</p>
              <p className="mt-3 inline-block bg-ink text-white text-sm rounded-full px-4 py-1.5">
                <span className="font-semibold">20% off for life</span> with code{" "}
                <span className="font-mono font-bold">FOUNDING20</span>
              </p>
            </div>
            <PricingCards />
            <div className="mx-auto max-w-3xl mt-10 text-center text-muted">
              <p>
                In plain numbers: a listing is £79, £149 or £299 a year depending on how prominent you want to be, and
                your own booking website is £120 a year on top of any paid plan. With the founding code that makes a
                Standard listing plus your own booking website £159 a year, held for life. At £120 a night, the roughly
                15.5% platform fee is about £19 a night, so the commission on nine nights covers the whole year.
              </p>
            </div>
          </div>
        </section>

        {/* Direct booking tips + supporting reading */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-display font-bold">Direct booking tips that actually work</h2>
            <p className="mt-3 text-muted text-lg">
              A website is the foundation, not the whole job. These are the five things that move the needle for small
              properties, in the order we would do them.
            </p>
          </div>
          <ol className="grid md:grid-cols-2 gap-x-10 gap-y-7 max-w-4xl mx-auto">
            {[
              {
                t: "Give guests somewhere to actually book",
                d: "An enquiry form is a dead end at 11pm on a Sunday. Guests who cannot confirm dates and pay there and then go back to the platform they came from.",
              },
              {
                t: "Claim your Google Business Profile",
                d: "It is free, it takes an hour, and it puts you in the map results when somebody searches for a B&B in your town. For most small properties this is the single best hour of marketing available.",
              },
              {
                t: "Give a reason to skip the platform",
                d: "A best rate promise, a welcome drink, a later checkout. The cost to you is small and the perceived value is not.",
              },
              {
                t: "Keep the guests you already had",
                d: "Past guests convert far better than strangers. One friendly email before your peak season, or a card at check-in with your web address on it, is enough.",
              },
              {
                t: "Stay on the platforms while you build",
                d: "Nobody should switch off their bookings overnight. Use the platforms for discovery, your own site for repeats, and iCal sync so the two never clash.",
              },
            ].map((x, i) => (
              <li key={x.t} className="flex gap-4">
                <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-ink text-white font-bold text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-bold text-lg">{x.t}</h3>
                  <p className="mt-1.5 text-muted leading-relaxed">{x.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-line bg-white p-7 shadow-card">
            <h3 className="font-display font-bold text-lg">Read more before you decide</h3>
            <p className="mt-1.5 text-muted text-sm">
              Longer write-ups on the same ground, with the commission maths worked through.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {[
                ["/guides/how-to-get-direct-bookings", "How to get direct bookings for your B&B", "the full playbook, step by step"],
                ["/guides/best-direct-booking-website-builders", "Best direct booking website builders", "how the options compare for small properties"],
                ["/guides/take-bookings-on-your-own-website", "Take bookings on your own website", "deposits, payments and cancellations"],
                ["/guides/increase-bookings-small-bnb", "How to increase bookings at a small B&B", "what to do when you have few rooms"],
              ].map(([href, label, note]) => (
                <li key={href} className="text-sm">
                  <Link href={href} className="text-brand font-semibold underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
                    {label}
                  </Link>
                  <span className="text-muted"> · {note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-center">Direct booking questions, answered</h2>
            <div className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <details key={f.q} className="group bg-white rounded-2xl border border-line p-5 sm:p-6 shadow-card">
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                    <h3 className="font-display font-bold text-lg">{f.q}</h3>
                    <span className="text-brand text-xl shrink-0 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-ink/80 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">List free, or get the full booking website.</h2>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              Already have a website? List for less and we&apos;ll send you traffic. Need one? We build, host and secure
              it, get you found on Google, Bing and AI, and you keep 100% of every booking.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
                List your stay
              </Link>
              <Link href="#pricing" className="border border-ink font-semibold px-7 py-3.5 rounded-full hover:bg-mist transition">
                See pricing
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
