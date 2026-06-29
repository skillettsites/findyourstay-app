import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/host/PricingCards";
import { BackButton } from "@/components/BackButton";
import { getFeaturedListings, getDemoListing } from "@/lib/db";
import { EXAMPLE_TEMPLATES } from "@/lib/exampleStays";
import { suggestDomain } from "@/lib/format";

// Cached/ISR marketing page, refreshed hourly (no per-request data).
export const revalidate = 3600;

export const metadata = {
  title: "List your stay - FindYourStay",
  description: "Get direct bookings with no commission. From £79/year.",
};

export default async function HostPage() {
  const demo = (await getDemoListing()) ?? (await getFeaturedListings(1))[0];
  const demoSlug = demo?.slug;
  const demoDomain = demo ? suggestDomain(demo.propertyName) : "yourstay.com";
  const demoPhoto = demo?.photos?.[0] ?? "https://picsum.photos/seed/host-site-preview/900/520";

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 pt-4">
          <BackButton fallback="/" />
        </div>
        {/* Hero */}
        <section className="bg-gradient-to-b from-rose-50 to-white border-b border-line">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 text-center">
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              Get direct bookings. Keep 100%.
            </h1>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              List your B&amp;B, guesthouse or apartment in front of travellers worldwide. No commission, ever.
              You take bookings and payment your own way, and add your own &ldquo;book direct&rdquo; perks (best price,
              free breakfast, a welcome drink) to win more guests. One booking covers your whole year.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full transition-transform active:scale-95 shadow-glow">
                List your stay
              </Link>
              <Link href="#pricing" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                See pricing
              </Link>
              <Link href="/host/demo" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                See a demo dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-14">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              ["1", "List your stay", "Add photos, details and your own booking link or contact. Takes 5 minutes."],
              ["2", "Travellers find you", "We send you views and enquiries from people searching your city."],
              ["3", "Book direct", "Guests book and pay you directly. We never touch your booking money."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <div className="mx-auto w-10 h-10 grid place-items-center rounded-full bg-brand text-white font-bold">{n}</div>
                <h3 className="mt-3 font-semibold">{t}</h3>
                <p className="text-sm text-muted mt-1">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold">Simple yearly pricing</h2>
              <p className="text-muted mt-2">Billed yearly. Cancel anytime. No commission on any booking.</p>
            </div>
            <PricingCards />
          </div>
        </section>

        {/* Booking website add-on explainer */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-rose-50 text-brand text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                Add-on · £120/year
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold">
                Your own standalone booking website.
              </h2>
              <p className="mt-3 text-muted text-lg">
                You don&apos;t need a website, the skills to build one, or an expensive hosting bill, we do all of it
                for you. We design and build a professional website for your B&amp;B or rental, put it on your own
                domain, and host it on Cloudflare so it&apos;s fast and secure. Guests pay you directly through
                <span className="font-semibold text-ink"> your own Stripe or PayPal link</span>, so you keep 100% and
                we&apos;re never in the middle. There&apos;s nothing technical for you to ever touch.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "Perfect if you have no website, or aren't happy with the one you've got",
                  "Replaces pricey website-builder and hosting bills, it's all included",
                  "Choose from 3 professional templates, we build and fill it in for you",
                  "Your own domain, registered for you (e.g. " + demoDomain + ")",
                  "Secure HTTPS with the padlock, included as standard",
                  "Guests pay you directly via your own Stripe or PayPal link, keep 100%",
                  "Calendar synced with Airbnb and Booking.com so you never double-book",
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-gradient text-white text-xs shrink-0 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <p className="text-sm font-semibold mb-2.5">See the 3 templates, each on a real example site:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TEMPLATES.map((x) => (
                    <Link key={x.theme} href={`/sites/${x.slug}?t=${x.theme}`} className="border border-ink font-semibold px-5 py-2.5 rounded-full hover:bg-mist transition text-sm">
                      {x.label} <span className="text-muted font-normal">· {x.place}</span> →
                    </Link>
                  ))}
                </div>
                <Link href="#pricing" className="inline-block mt-4 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">
                  Add it to any plan
                </Link>
              </div>
            </div>

            {/* Mock browser preview */}
            <div className="rounded-2xl border border-line shadow-float overflow-hidden bg-white">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-line bg-mist">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex items-center gap-1.5 text-xs text-muted truncate">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                  {demoDomain}
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={demoPhoto} alt="Example booking website" className="w-full h-64 object-cover" />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold text-lg">{demo?.propertyName ?? "Your Property"}</div>
                    <div className="text-sm text-muted">Book your stay direct</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">£{demo?.pricePerNight ?? 120}<span className="text-muted font-normal text-sm"> night</span></div>
                  </div>
                </div>
                {demoSlug && (
                  <Link href={`/sites/${demoSlug}`} className="block mt-4 bg-brand-gradient text-white text-center font-semibold py-2.5 rounded-full text-sm">
                    Open live example
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How you get paid */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-card">How you get paid</span>
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

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-2"><span className="text-emerald-600">✓</span> Your own Stripe / PayPal account</span>
              <span className="inline-flex items-center gap-2"><span className="text-emerald-600">✓</span> No commission, ever</span>
              <span className="inline-flex items-center gap-2"><span className="text-emerald-600">✓</span> We&apos;re never a party to the payment</span>
              <span className="inline-flex items-center gap-2"><span className="text-emerald-600">✓</span> No payment set up? Guests just send a request</span>
            </div>
          </div>
        </section>

        {/* One-stop shop: SEO + AI discovery */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block bg-white/10 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                One-stop shop for direct bookings
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-display font-bold">
                We don&apos;t just build your site, we get you found.
              </h2>
              <p className="mt-3 text-white/70 text-lg">
                A beautiful website is no good if no one sees it. So we handle the technical side of getting your
                B&amp;B discovered on Google, Bing and the new AI assistants people now use to plan trips, all included.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              {[
                {
                  t: "Ranked on Google & Bing",
                  d: "We submit your site to Google and Bing for indexing the day it goes live, generate your sitemap, and ping IndexNow on every change so updates show up fast.",
                  icon: "M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
                },
                {
                  t: "Found by AI assistants",
                  d: "More people now ask ChatGPT and Gemini where to stay. We add an llms.txt and clean structured data so the AIs can read and recommend your property.",
                  icon: "M12 2a5 5 0 0 1 5 5v1a4 4 0 0 1 0 8 5 5 0 0 1-10 0 4 4 0 0 1 0-8V7a5 5 0 0 1 5-5Z",
                },
                {
                  t: "Direct bookings, you keep 100%",
                  d: "Guests find you, book on your own site and pay you directly via your own Stripe or PayPal link. No commission, no platform fees, no middleman, ever.",
                  icon: "M20 6L9 17l-5-5",
                },
              ].map((c) => (
                <div key={c.t} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-gradient">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon} /></svg>
                  </span>
                  <h3 className="mt-4 font-display font-bold text-lg">{c.t}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{c.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-white/60 text-sm max-w-2xl mx-auto">
                You fill in one simple form about your place, we turn it into a complete website on your own domain,
                keep it indexed and discoverable, and you edit it any time from your dashboard. Genuinely hands-off.
              </p>
              <Link href="#pricing" className="inline-block mt-6 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
                Add a booking website
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
