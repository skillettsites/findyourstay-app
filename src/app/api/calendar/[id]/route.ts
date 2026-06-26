import { getListingById } from "@/lib/db";
import { buildIcs } from "@/lib/calendar";

export const dynamic = "force-dynamic";

// Outbound iCal feed for a listing. Hosts paste this URL into Airbnb/Booking.com
// so dates booked on FindYourStay block on those platforms too.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return new Response("Not found", { status: 404 });
  const ics = await buildIcs(id, listing.propertyName);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${listing.slug}.ics"`,
    },
  });
}
