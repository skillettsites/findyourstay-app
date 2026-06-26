import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryRow } from "@/components/CategoryRow";
import { Hero } from "@/components/Hero";
import { ListingCard } from "@/components/ListingCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { getFeaturedListings, getTopCities, countListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, cities, total] = await Promise.all([
    getFeaturedListings(12),
    getTopCities(10),
    countListings(),
  ]);

  return (
    <>
      <Header showSearch={false} />
      <Hero total={total} />

      <Suspense fallback={<div className="h-16" />}>
        <CategoryRow />
      </Suspense>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Featured */}
        <section className="py-12 sm:py-16">
          <Reveal>
            <div className="flex items-end justify-between mb-7">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Featured stays</h2>
                <p className="text-muted mt-1">Independent stays, booked direct.</p>
              </div>
              <Link href="/s" className="text-sm font-semibold text-brand hover:underline shrink-0">
                Show all
              </Link>
            </div>
          </Reveal>

          {featured.length === 0 ? (
            <EmptyState />
          ) : (
            <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9">
              {featured.map((l) => (
                <StaggerItem key={l.id}>
                  <ListingCard listing={l} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        {/* Popular cities */}
        {cities.length > 0 && (
          <section className="py-6 pb-16">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-7">
                Popular destinations
              </h2>
            </Reveal>
            <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {cities.map((c) => (
                <StaggerItem key={c.citySlug}>
                  <Link
                    href={`/s?city=${c.citySlug}`}
                    className="group relative block aspect-[4/3] rounded-2xl overflow-hidden bg-mist shadow-card hover:shadow-float transition-shadow"
                  >
                    {c.coverPhoto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.coverPhoto}
                        alt={c.cityName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3.5 text-white">
                      <div className="font-semibold text-lg leading-tight">{c.cityName}</div>
                      <div className="text-xs opacity-90">{c.count} stays</div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </main>

      {/* Host band */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="aurora opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Reveal>
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold">Own a stay? Get direct bookings.</h3>
              <p className="text-white/70 mt-2 text-lg">
                List once, keep 100% of every booking. From £79/year, no commission ever.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/host"
              className="inline-block bg-white text-ink hover:bg-white/90 px-7 py-3.5 rounded-full font-semibold whitespace-nowrap transition active:scale-95"
            >
              List your stay
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 border border-dashed border-line rounded-2xl">
      <p className="text-muted">New stays are being added. Check back soon.</p>
    </div>
  );
}
