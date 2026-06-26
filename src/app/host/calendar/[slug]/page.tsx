import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { CalendarManager } from "@/components/host/CalendarManager";
import { getListingBySlug } from "@/lib/db";
import { getBlocks, getIcalUrls } from "@/lib/calendar";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function CalendarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const [blocks, urls] = await Promise.all([getBlocks(listing.id), getIcalUrls(listing.id)]);
  const exportUrl = `${SITE}/api/calendar/${listing.id}`;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton fallback="/host/dashboard" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Calendar</h1>
        <p className="text-muted mt-1 mb-8">{listing.propertyName} · {listing.cityName}</p>
        <CalendarManager listingId={listing.id} exportUrl={exportUrl} initialUrls={urls} initialBlocks={blocks} />
      </main>
    </>
  );
}
