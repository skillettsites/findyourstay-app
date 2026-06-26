import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/host/PricingCards";
import { BackButton } from "@/components/BackButton";
import { getFeaturedListings } from "@/lib/db";
import { suggestDomain } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "List your stay - FindYourStay",
  description: "Get direct bookings with no commission. From £79/year.",
};

export default async function HostPage() {
  const demo = (await getFeaturedListings(1))[0];
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
              You take bookings and payment your own way. One booking covers your whole year.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full transition-transform active:scale-95 shadow-glow">
                List your stay
              </Link>
              <Link href="#pricing" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                See pricing
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
            <PricingCards demoSlug={demoSlug} />
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
                Not a page on our site, a real website of your own. We register a domain for you, build a
                beautiful direct-booking site, and host it on Cloudflare. Guests pay by card straight into{" "}
                <span className="font-semibold text-ink">your own Stripe</span>. You keep 100%, we handle all the tech.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  "We register your own domain (e.g. " + demoDomain + ")",
                  "Fast, secure hosting on Cloudflare, included",
                  "Your photos, prices and availability calendar",
                  "Card payments via your own Stripe account",
                  "Guests pay you directly, never us, no commission",
                  "Calendar synced with Airbnb and Booking.com",
                ].map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-gradient text-white text-xs shrink-0 mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex gap-3">
                {demoSlug && (
                  <Link href={`/sites/${demoSlug}`} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">
                    See an example site
                  </Link>
                )}
                <Link href="#pricing" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
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
      </main>
      <Footer />
    </>
  );
}
