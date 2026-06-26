import { notFound } from "next/navigation";
import { MicrositeView } from "@/components/MicrositeView";
import { getListingBySlug } from "@/lib/db";
import { suggestDomain } from "@/lib/format";

export const dynamic = "force-dynamic";

// Example of the booking-website add-on (shows the example banner).
export default async function MicrositePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();
  return <MicrositeView listing={listing} domain={suggestDomain(listing.propertyName)} example />;
}
