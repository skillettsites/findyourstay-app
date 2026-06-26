import { Suspense } from "react";
import { Header } from "@/components/Header";
import { CategoryRow } from "@/components/CategoryRow";
import { ListingCard } from "@/components/ListingCard";
import { ResultsMap, type MapPoint } from "@/components/ResultsMap";
import { SortSelect } from "@/components/SortSelect";
import { BackButton } from "@/components/BackButton";
import { Stagger, StaggerItem } from "@/components/Motion";
import { searchListings } from "@/lib/db";
import type { ListingQuery, PropertyType } from "@/lib/types";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;

  const query: ListingQuery = {
    q: one(sp.q),
    citySlug: one(sp.city),
    country: one(sp.country),
    propertyType: one(sp.type) as PropertyType | undefined,
    minPrice: one(sp.min) ? Number(one(sp.min)) : undefined,
    maxPrice: one(sp.max) ? Number(one(sp.max)) : undefined,
    sort: (one(sp.sort) as ListingQuery["sort"]) ?? "featured",
    limit: 48,
  };

  const { items, total } = await searchListings(query);
  const points: MapPoint[] = items
    .filter((l) => Number.isFinite(l.lat) && Number.isFinite(l.lng))
    .map((l) => ({ id: l.id, slug: l.slug, name: l.propertyName, lat: l.lat, lng: l.lng, price: l.pricePerNight, currency: l.currency }));

  const heading = query.q
    ? `Stays matching "${query.q}"`
    : query.citySlug
      ? `Stays in ${items[0]?.cityName ?? query.citySlug}`
      : "All stays";

  // Acknowledge the dates/flexible/guests the traveller chose (carried to the booking box).
  const inDate = one(sp.in);
  const outDate = one(sp.out);
  const flex = one(sp.flex);
  const guestCount = one(sp.guests);
  const criteria = [
    inDate && outDate ? `${inDate} → ${outDate}` : inDate ? `from ${inDate}` : null,
    flex ? `flexible: a ${flex}` : null,
    guestCount ? `${guestCount} guest${Number(guestCount) > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ");
  const roomQuery = new URLSearchParams();
  if (inDate) roomQuery.set("in", inDate);
  if (outDate) roomQuery.set("out", outDate);
  if (guestCount) roomQuery.set("guests", guestCount);
  const roomSuffix = roomQuery.toString() ? `?${roomQuery.toString()}` : "";

  return (
    <>
      <Header />
      <Suspense fallback={<div className="h-16" />}>
        <CategoryRow />
      </Suspense>

      <div className="flex flex-1">
        {/* Results column */}
        <div className="flex-1 px-4 sm:px-6 py-5 lg:max-w-[60%]">
          <div className="mb-4">
            <BackButton fallback="/" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold">{heading}</h1>
              <p className="text-sm text-muted">{total.toLocaleString()} stays{criteria ? ` · ${criteria}` : ""}</p>
            </div>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-line rounded-xl text-muted">
              No stays found. Try a different search.
            </div>
          ) : (
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
              {items.map((l) => (
                <StaggerItem key={l.id}>
                  <ListingCard listing={l} hrefSuffix={roomSuffix} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>

        {/* Map column */}
        <div className="hidden lg:block w-[40%] sticky top-[120px] h-[calc(100vh-120px)] border-l border-line">
          <ResultsMap points={points} />
        </div>
      </div>
    </>
  );
}
