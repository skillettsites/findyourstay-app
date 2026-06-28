import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { DashboardView, type DashboardData } from "@/components/host/DashboardView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Host dashboard preview - FindYourStay",
  description: "See the host dashboard before you sign up: impressions, views, website visits, enquiries, booking requests and a 30-day reach trend.",
};

// Deterministic, believable sample data so anyone can preview the dashboard.
function sampleData(): DashboardData {
  const series = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
    const wave = Math.round(55 * Math.sin(i / 4.2));
    const impressions = Math.max(30, 120 + wave + i * 5 + (i % 7 === 0 ? 45 : 0));
    const views = Math.max(4, Math.round(impressions * 0.14) + (i % 5 === 0 ? 6 : 0));
    return { date, views, impressions };
  });
  const impressions = series.reduce((s, d) => s + d.impressions, 0);
  const views = series.reduce((s, d) => s + d.views, 0);
  const siteViews = Math.round(views * 0.58);
  const enquiries = Math.round(views * 0.08);
  const bookings = Math.max(1, Math.round(enquiries * 0.32));
  const enquiryRate = Math.round((enquiries / views) * 1000) / 10;

  return {
    email: "you@example.com",
    analytics: {
      totals: { impressions, views, siteViews, enquiries, bookings },
      series,
      enquiryRate,
      perListing: [
        { id: "d1", impressions: Math.round(impressions * 0.62), views: Math.round(views * 0.6), enquiries: Math.round(enquiries * 0.6) },
        { id: "d2", impressions: Math.round(impressions * 0.38), views: Math.round(views * 0.4), enquiries: Math.round(enquiries * 0.4) },
      ],
    },
    listings: [
      { id: "d1", slug: "demo-1", propertyName: "Casa do Rio Guesthouse", cityName: "Porto", country: "Portugal", pricePerNight: 95, currency: "gbp", photo: "https://picsum.photos/seed/fys-demo-porto/200/200", hasBookingSite: true },
      { id: "d2", slug: "demo-2", propertyName: "Alfama Terrace Apartment", cityName: "Lisbon", country: "Portugal", pricePerNight: 110, currency: "gbp", photo: "https://picsum.photos/seed/fys-demo-lisbon/200/200", hasBookingSite: false },
    ],
    bookings: [
      { id: "b1", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "marie@example.com", checkIn: "2026-07-12", checkOut: "2026-07-15", guests: 2, status: "requested", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: "b2", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "tom@example.com", checkIn: "2026-08-01", checkOut: "2026-08-06", guests: 3, status: "confirmed", createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
    ],
    enquiries: [
      { id: "e1", listingId: "d2", listingName: "Alfama Terrace Apartment", guestEmail: "sofia@example.com", checkIn: "2026-07-20", checkOut: "2026-07-24", guests: 2, message: "Is early check-in possible on the 20th?", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: "e2", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "james@example.com", checkIn: null, checkOut: null, guests: null, message: "Do you have parking nearby?", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: "e3", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "ana@example.com", checkIn: "2026-09-02", checkOut: "2026-09-05", guests: 4, message: null, createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
    ],
  };
}

export default function DemoDashboardPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 pt-6">
        <BackButton fallback="/host" />
      </div>
      <DashboardView data={sampleData()} demo />
    </>
  );
}
