import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { ExplainerFilm } from "@/components/ExplainerFilm";
import { ExplainerFeatures } from "@/components/ExplainerFeatures";

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

        {/* Deep-dive features — animated, plain-English */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-4xl font-display font-bold">How we drive you more bookings</h2>
              <p className="mt-3 text-muted text-lg">Some of it you&apos;ll know. Some of it you&apos;ve probably never heard of, but it&apos;s where the bookings are going.</p>
            </div>
          </Reveal>
          <ExplainerFeatures />
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
