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
  title: "Your own booking website, built for you - FindYourStay for hosts",
  description:
    "We build and host a direct-booking website on your own domain, get it found on Google, Bing and AI assistants, and list you in our directory. Guests pay you directly. No commission, ever. From £79/year.",
};

// Honest comparison: axes a direct-booking host actually cares about, where we win.
const COMPARE_COLS = ["FindYourStay", "Booking.com / Airbnb", "DIY builder (Wix etc.)", "Booking software (Lodgify etc.)"];
const COMPARE_ROWS: [string, (boolean | "warn" | string)[]][] = [
  ["No commission on your bookings", [true, false, true, true]],
  ["Guests pay you directly, keep 100%", [true, false, true, true]],
  ["We build the website for you", [true, "—", false, false]],
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
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 pt-4">
          <BackButton fallback="/" />
        </div>

        {/* Founding banner */}
        <div className="bg-ink text-white text-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 text-center">
            <span className="font-semibold">Founding offer:</span> 20% off for life for the first 50 hosts. Use code{" "}
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
                  <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">
                    List your stay
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

        {/* Deep-dive features — animated, plain-English (indexing, llms.txt, HTTPS, calendar, commission) */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-4xl font-display font-bold">Everything we do for you</h2>
              <p className="mt-3 text-muted text-lg">Some of it you&apos;ll know. Some of it you&apos;ve probably never heard of, but it&apos;s where the bookings are going.</p>
            </div>
          </Reveal>
          <ExplainerFeatures />
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
                Founding hosts: <span className="font-semibold">20% off for life</span> with code{" "}
                <span className="font-mono font-bold">FOUNDING20</span> · first 50 only
              </p>
            </div>
            <PricingCards />
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
