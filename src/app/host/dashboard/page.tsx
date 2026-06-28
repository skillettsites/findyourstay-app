import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { DashboardView, type DashboardListing } from "@/components/host/DashboardView";
import { getUser, ensureHost } from "@/lib/auth";
import { getListingsByHost, getHostAnalytics, getEnquiriesForListings, getBookingsForListings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getUser();
  if (!user) redirect("/login?next=/host/dashboard");
  await ensureHost(user!);

  const myListings = await getListingsByHost(user!.id, 50);
  const [analytics, enquiries, bookings] = await Promise.all([
    getHostAnalytics(myListings, 30),
    getEnquiriesForListings(myListings, 30),
    getBookingsForListings(myListings, 30),
  ]);

  const listings: DashboardListing[] = myListings.map((l) => ({
    id: l.id, slug: l.slug, propertyName: l.propertyName, cityName: l.cityName, country: l.country,
    pricePerNight: l.pricePerNight, currency: l.currency, photo: l.photos[0], hasBookingSite: l.hasBookingSite,
  }));

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 pt-6">
        <BackButton fallback="/" />
      </div>
      <DashboardView data={{ email: user!.email, analytics, listings, enquiries, bookings }} />
    </>
  );
}
