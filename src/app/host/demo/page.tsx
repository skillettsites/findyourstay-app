import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { DashboardView, type DashboardData } from "@/components/host/DashboardView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Host dashboard preview - FindYourStay",
  description: "See the host dashboard before you sign up: impressions, views, website visits, enquiries, booking requests, a 30-day reach trend, plus edit-stay and edit-website tabs.",
};

// Deterministic, believable sample data so anyone can preview the dashboard.
// Tuned to look healthy and growing (positive deltas vs the previous month).
function sampleData(days = 30, listingId?: string): DashboardData {
  const share = listingId === "d1" ? 0.58 : listingId === "d2" ? 0.42 : 1; // per-listing filter
  const series = Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().slice(0, 10);
    const wave = Math.round(55 * Math.sin(i / 4.5));
    const impressions = Math.round((Math.max(150, 360 + wave + i * 22 + (i % 7 === 0 ? 110 : 0))) * share); // strong upward trend
    const views = Math.max(6, Math.round(impressions * 0.17) + (i % 5 === 0 ? 10 : 0));
    return { date, views, impressions };
  });
  const impressions = series.reduce((s, d) => s + d.impressions, 0);
  const views = series.reduce((s, d) => s + d.views, 0);
  const siteViews = Math.round(views * 0.62);
  const enquiries = Math.round(views * 0.085);
  const bookings = Math.max(4, Math.round(enquiries * 0.34));
  const enquiryRate = Math.round((enquiries / views) * 1000) / 10;
  // Previous 30 days were ~22-30% lower -> healthy green deltas everywhere.
  const prev = {
    impressions: Math.round(impressions * 0.79),
    views: Math.round(views * 0.74),
    siteViews: Math.round(siteViews * 0.7),
    enquiries: Math.round(enquiries * 0.72),
    bookings: Math.round(bookings * 0.65),
  };

  // Pro website analytics, modelled off the booking-site visits.
  const part = (frac: number) => Math.round(siteViews * frac);
  const siteAnalytics = {
    visits: siteViews,
    prevVisits: Math.round(siteViews * 0.69),
    series: series.map((s) => ({ date: s.date, visits: Math.max(3, Math.round(s.views * 0.62)) })),
    sources: [
      { label: "Google", visits: part(0.36) },
      { label: "Direct", visits: part(0.23) },
      { label: "ChatGPT", visits: part(0.14) },
      { label: "Social", visits: part(0.11) },
      { label: "Bing", visits: part(0.08) },
      { label: "Referral", visits: part(0.08) },
    ],
    countries: [
      { code: "GB", visits: part(0.39) },
      { code: "US", visits: part(0.18) },
      { code: "FR", visits: part(0.09) },
      { code: "DE", visits: part(0.08) },
      { code: "PT", visits: part(0.07) },
      { code: "ES", visits: part(0.06) },
      { code: "NL", visits: part(0.05) },
      { code: "IE", visits: part(0.04) },
    ],
    devices: [
      { label: "Mobile", visits: part(0.62) },
      { label: "Desktop", visits: part(0.33) },
      { label: "Tablet", visits: part(0.05) },
    ],
    pages: [
      { path: "home", visits: part(0.42) },
      { path: "rooms", visits: part(0.22) },
      { path: "book", visits: part(0.17) },
      { path: "gallery", visits: part(0.12) },
      { path: "location", visits: part(0.07) },
    ],
  };

  return {
    email: "you@example.com",
    siteAnalytics,
    analytics: {
      totals: { impressions, views, siteViews, enquiries, bookings },
      prev,
      series,
      enquiryRate,
      perListing: listingId
        ? [{ id: listingId, impressions, views, enquiries }]
        : [
            { id: "d1", impressions: Math.round(impressions * 0.58), views: Math.round(views * 0.6), enquiries: Math.round(enquiries * 0.62) },
            { id: "d2", impressions: Math.round(impressions * 0.42), views: Math.round(views * 0.4), enquiries: Math.round(enquiries * 0.38) },
          ],
    },
    listings: [
      { id: "d1", slug: "demo-1", propertyName: "Casa do Rio Guesthouse", cityName: "Porto", country: "Portugal", pricePerNight: 95, currency: "gbp", photo: "https://images.unsplash.com/photo-1762529716272-b316f61502e7?auto=format&fit=crop&w=400&q=70", hasBookingSite: true, siteTheme: "coastal", domain: "casadorio.com" },
      { id: "d2", slug: "demo-2", propertyName: "Alfama Terrace Apartment", cityName: "Lisbon", country: "Portugal", pricePerNight: 120, currency: "gbp", photo: "https://images.unsplash.com/photo-1759264244827-1dde5bee00a5?auto=format&fit=crop&w=400&q=70", hasBookingSite: true, siteTheme: "modern", domain: "alfamaterrace.com" },
    ],
    bookings: [
      { id: "b1", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "marie@example.com", checkIn: "2026-07-12", checkOut: "2026-07-15", guests: 2, status: "requested", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: "b2", listingId: "d2", listingName: "Alfama Terrace Apartment", guestEmail: "lucas@example.com", checkIn: "2026-07-18", checkOut: "2026-07-22", guests: 3, status: "requested", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      { id: "b3", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "tom@example.com", checkIn: "2026-08-01", checkOut: "2026-08-06", guests: 3, status: "confirmed", createdAt: new Date(Date.now() - 6 * 86400000).toISOString() },
    ],
    enquiries: [
      { id: "e1", listingId: "d2", listingName: "Alfama Terrace Apartment", guestEmail: "sofia@example.com", checkIn: "2026-07-20", checkOut: "2026-07-24", guests: 2, message: "Is early check-in possible on the 20th?", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
      { id: "e2", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "james@example.com", checkIn: null, checkOut: null, guests: null, message: "Do you have parking nearby?", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
      { id: "e3", listingId: "d1", listingName: "Casa do Rio Guesthouse", guestEmail: "ana@example.com", checkIn: "2026-09-02", checkOut: "2026-09-05", guests: 4, message: null, createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
    ],
  };
}

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function DemoDashboardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const range = String(sp.range ?? "30");
  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
  const listingId = typeof sp.listing === "string" ? sp.listing : undefined;
  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 pt-6">
        <BackButton fallback="/host" />
      </div>
      <DashboardView data={sampleData(days, listingId)} demo />
    </>
  );
}
