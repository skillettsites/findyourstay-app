import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { GUIDES, guidesByCategory } from "@/lib/guides/registry";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Host Guides: Cut Commission & Get More Direct Bookings",
  description:
    "Free guides for B&B, guesthouse and Airbnb hosts: cut OTA commission, get more direct bookings, and build a booking website you own. Honest, practical advice.",
  alternates: { canonical: `${SITE}/guides` },
  openGraph: { title: "Host Guides | FindYourStay", description: "Cut commission, get more direct bookings, own your booking site.", url: `${SITE}/guides`, type: "website" },
};

export default function GuidesHub() {
  const groups = guidesByCategory();
  const [pillar1, pillar2] = GUIDES;

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FindYourStay host guides",
    itemListElement: GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/guides/${g.slug}`,
      name: g.h1,
    })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="aurora" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <Reveal>
              <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-card">For hosts</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 font-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-[1.05]">
                Keep more of every booking
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-muted max-w-2xl mx-auto">
                Honest, practical guides for independent B&B, guesthouse and Airbnb hosts: cut the commission you pay the OTAs, win more direct bookings, and build a booking website you actually own.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link href="/host/build" className="inline-block mt-7 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
                See your free booking site →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Featured pillars */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-2 gap-5">
            {[pillar1, pillar2].map((g) => (
              <Reveal key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="group block h-full rounded-3xl border border-line p-7 hover:shadow-float hover:border-ink/20 transition bg-mist">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">{g.category}</p>
                  <h2 className="mt-3 font-display font-bold text-2xl leading-snug group-hover:text-brand transition">{g.h1}</h2>
                  <p className="mt-3 text-muted leading-relaxed">{g.description}</p>
                  <span className="inline-block mt-4 text-sm font-semibold text-ink group-hover:translate-x-1 transition-transform">Read the guide →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* By category */}
        {groups.map(({ category, guides }) => (
          <section key={category} className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
            <h2 className="font-display font-bold text-xl text-ink mb-5">{category}</h2>
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((g) => (
                <StaggerItem key={g.slug}>
                  <Link href={`/guides/${g.slug}`} className="group block h-full rounded-2xl border border-line p-5 hover:shadow-card hover:border-ink/20 transition">
                    <h3 className="font-display font-semibold text-ink leading-snug group-hover:text-brand transition">{g.h1}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">{g.description}</p>
                    <span className="inline-block mt-3 text-xs font-semibold text-muted">{g.readMins} min read</span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
          <div className="rounded-3xl bg-ink text-white p-8 sm:p-12 text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Ready to keep 100% of your bookings?</h2>
            <p className="mt-3 text-white/70 max-w-lg mx-auto">Preview your own commission-free booking website in under a minute. No signup, no card.</p>
            <Link href="/host/build" className="inline-block mt-7 bg-brand-gradient bg-brand-gradient-hover font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">See your free site →</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
