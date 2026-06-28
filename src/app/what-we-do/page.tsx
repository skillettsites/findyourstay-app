import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { ExplainerFilm } from "@/components/ExplainerFilm";

export const metadata = {
  title: "What we do - FindYourStay for hosts",
  description:
    "Everything FindYourStay does for independent hosts: drive direct bookings to your existing site or get a brand-new one built and hosted, secured with HTTPS, ranked on Google and Bing, and discoverable by AI assistants. No commission, ever.",
};

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

// Deep-dive feature rows, alternating image/colour side for rhythm.
const FEATURES: { eyebrow: string; title: string; body: string; points: string[]; icon: string }[] = [
  {
    eyebrow: "Already have a website?",
    title: "We drive direct bookings to it",
    body:
      "Keep the site you already have. List your stay with us and we put it in front of travellers searching your area, then send them straight to your own booking page or contact, with the dates they want. Every enquiry lands in your inbox and your dashboard.",
    points: [
      "Listed in the FindYourStay directory travellers browse",
      "Your existing booking link or contact, front and centre",
      "Guest enquiries emailed to you and tracked in your dashboard",
      "Nothing to rebuild, nothing to migrate",
    ],
    icon: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19",
  },
  {
    eyebrow: "No website? Or not happy with yours?",
    title: "We build and host one for you",
    body:
      "Pick one of three professional templates and we fill it in from your details, no tech skills needed. You get a real, multi-page booking website on your own domain, that we register and host for you on Cloudflare. Change anything any time from your dashboard.",
    points: [
      "Three premium templates to choose from",
      "Your own domain, registered and set up for you",
      "Fast, reliable hosting on Cloudflare, all included",
      "Edit your content and switch template whenever you like",
    ],
    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  },
  {
    eyebrow: "Take payment, keep everything",
    title: "Card payments into your own Stripe",
    body:
      "Guests book and pay securely by card on your site. The money goes straight into your own Stripe account, we never touch it. There is no commission and no platform booking fee, so you keep 100% of every booking.",
    points: [
      "Secure card checkout on your own site",
      "Funds land directly in your Stripe account",
      "No commission and no booking fees, ever",
      "You stay in full control of cancellations and refunds",
    ],
    icon: "M3 10h18M7 15h4M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  },
  {
    eyebrow: "Secure by default",
    title: "The padlock, included as standard",
    body:
      "Every site we build is served over HTTPS with a valid SSL certificate, so guests see the padlock and trust the checkout. Security, certificates and renewals are handled for you, with nothing to configure and nothing to remember.",
    points: [
      "HTTPS with the padlock on every page",
      "SSL certificate provisioned and auto-renewed",
      "Hardened, fast hosting out of the box",
      "Zero technical setup on your side",
    ],
    icon: "M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z M9 12l2 2 4-4",
  },
  {
    eyebrow: "Never double-book",
    title: "Your calendar stays in sync",
    body:
      "Connect your Airbnb, Booking.com or any iCal calendar and we keep your availability in sync automatically. Dates booked elsewhere block out on your direct site, so you can take direct bookings with confidence and never clash.",
    points: [
      "Two-way iCal sync with Airbnb, Booking.com and more",
      "Availability updates automatically, around the clock",
      "No risk of double-booking the same dates",
      "Manage everything from one dashboard",
    ],
    icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  },
  {
    eyebrow: "Get found on search",
    title: "Ranked on Google and Bing",
    body:
      "A beautiful site is no use if nobody finds it. We submit your site to Google and Bing for indexing the day it goes live, generate your sitemap, and ping IndexNow on every change so updates show up fast, helping you climb the rankings and reach more travellers.",
    points: [
      "Submitted to Google and Bing for indexing at launch",
      "Sitemap generated and kept up to date",
      "IndexNow pings so changes are crawled quickly",
      "Clean, structured pages built to rank",
    ],
    icon: "M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z",
  },
  {
    eyebrow: "The future of finding stays",
    title: "Discoverable by AI assistants",
    body:
      "More and more travellers ask ChatGPT, Gemini and other AI assistants where to stay. We add an llms.txt file and clean structured data to your site so those assistants can read it and recommend your property, putting you in front of guests on the channels that are only going to grow.",
    points: [
      "llms.txt published for AI assistants to read",
      "Structured data so machines understand your stay",
      "Positioned for AI-driven trip planning, not just search",
      "Future-proofed as discovery shifts to assistants",
    ],
    icon: "M12 2a5 5 0 0 1 5 5v1a4 4 0 0 1 0 8 5 5 0 0 1-10 0 4 4 0 0 1 0-8V7a5 5 0 0 1 5-5z",
  },
];

const PILLARS = [
  { title: "Get discovered", body: "Listed in our directory and put in front of travellers searching your city.", icon: "M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" },
  { title: "Your own booking site", body: "Built, hosted and secured on your own domain, with payments into your Stripe.", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { title: "Found everywhere", body: "Indexed on Google and Bing, and readable by the AI assistants travellers now use.", icon: "M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" },
];

export default function WhatWeDoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-white border-b border-line">
          <div className="aurora" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <Reveal>
                <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-card">
                  The one-stop shop for direct bookings
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-5 text-4xl sm:text-5xl xl:text-6xl font-display font-bold tracking-tight leading-[1.05]">
                  Everything you need to get booked direct.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-lg text-muted max-w-xl mx-auto lg:mx-0">
                  We help independent hosts win bookings without the commission. Drive guests to the site you already
                  have, or let us build, host and secure a brand-new one, then get you found on Google, Bing and the
                  AI assistants travellers are starting to plan with. You keep 100% of every booking.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">
                    List your stay
                  </Link>
                  <Link href="/host#pricing" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">
                    See pricing
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: animated explainer film */}
            <Reveal delay={0.1}>
              <ExplainerFilm />
            </Reveal>
          </div>
        </section>

        {/* Why direct */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-4xl font-display font-bold">Booking platforms take a cut of every stay. We don&apos;t.</h2>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              The big sites can charge 15 to 18% in commission, and guests pay more on top. Booking direct cuts out
              the middleman: better prices for your guests, full margins for you, and a real relationship with the
              people who stay. Our job is to make direct bookings easy to win and easy to run.
            </p>
          </Reveal>
        </section>

        {/* Pillars */}
        <section className="bg-mist border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
            <Stagger className="grid md:grid-cols-3 gap-6">
              {PILLARS.map((p) => (
                <StaggerItem key={p.title} className="bg-white rounded-2xl border border-line p-7 shadow-card">
                  <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-gradient text-white">
                    <Icon d={p.icon} />
                  </span>
                  <h3 className="mt-4 font-display font-bold text-xl">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Deep-dive features */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="space-y-16 sm:space-y-24">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title}>
                <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div>
                    <span className="inline-flex items-center gap-2 text-brand font-semibold text-sm">
                      <span className="grid place-items-center w-9 h-9 rounded-lg bg-rose-50 text-brand"><Icon d={f.icon} /></span>
                      {f.eyebrow}
                    </span>
                    <h3 className="mt-4 text-2xl sm:text-3xl font-display font-bold">{f.title}</h3>
                    <p className="mt-3 text-muted text-lg">{f.body}</p>
                  </div>
                  <ul className="space-y-3 bg-mist/60 rounded-2xl border border-line p-7">
                    {f.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-gradient text-white text-xs shrink-0 mt-0.5">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
            <Reveal>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-center">Live in minutes, hands-off after that</h2>
              <p className="text-white/70 text-center mt-3 max-w-2xl mx-auto">From listing to taking direct bookings, with us doing the technical heavy lifting.</p>
            </Reveal>
            <Stagger className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["1", "Tell us about your stay", "Add your details, photos and price in one short form. Five minutes, no tech skills."],
                ["2", "Choose how guests book", "Use your existing site, or pick a template and we build and host one for you."],
                ["3", "We get you found", "Submitted to Google and Bing, sitemap and IndexNow set up, llms.txt published for AI."],
                ["4", "Take direct bookings", "Guests find you, book and pay into your Stripe. You keep 100%, we never touch the money."],
              ].map(([n, t, d]) => (
                <StaggerItem key={n} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="w-10 h-10 grid place-items-center rounded-full bg-brand-gradient font-bold">{n}</div>
                  <h3 className="mt-4 font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{d}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-20 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">One simple yearly price. No commission, ever.</h2>
            <p className="mt-4 text-muted text-lg max-w-2xl mx-auto">
              List free, or add a fully built, hosted and secured booking website that ranks on search and is ready
              for the AI era. One direct booking usually covers your whole year.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
                List your stay
              </Link>
              <Link href="/host#pricing" className="border border-ink font-semibold px-7 py-3.5 rounded-full hover:bg-mist transition">
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
