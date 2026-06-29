import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { DashboardView, type DashboardListing } from "@/components/host/DashboardView";
import { getUser, ensureHost } from "@/lib/auth";
import { getListingsByHost, getHostAnalytics, getSiteAnalytics, getEnquiriesForListings, getBookingsForListings, getDomainsForListings } from "@/lib/db";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function Dashboard({ searchParams }: { searchParams: SP }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/host/dashboard");
  await ensureHost(user!);

  const sp = await searchParams;
  const range = String(sp.range ?? "30");
  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
  const listingId = typeof sp.listing === "string" ? sp.listing : undefined;

  const myListings = await getListingsByHost(user!.id, 50);
  // The date range + per-listing filter scope the analytics; the management
  // lists (stays/website/bookings/enquiries) always show everything.
  const scoped = listingId ? myListings.filter((l) => l.id === listingId) : myListings;
  const [analytics, siteAnalytics, enquiries, bookings, domains] = await Promise.all([
    getHostAnalytics(scoped, days),
    getSiteAnalytics(scoped, days),
    getEnquiriesForListings(myListings, 30),
    getBookingsForListings(myListings, 30),
    getDomainsForListings(myListings),
  ]);

  const listings: DashboardListing[] = myListings.map((l) => ({
    id: l.id, slug: l.slug, propertyName: l.propertyName, cityName: l.cityName, country: l.country,
    pricePerNight: l.pricePerNight, currency: l.currency, photo: l.photos[0], hasBookingSite: l.hasBookingSite,
    siteTheme: l.siteTheme, domain: domains[l.id],
  }));

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 pt-6">
        <BackButton fallback="/" />
      </div>
      <DashboardView data={{ email: user!.email, analytics, siteAnalytics, listings, enquiries, bookings }} />
    </>
  );
}
