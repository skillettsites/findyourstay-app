import { NextResponse } from "next/server";
import { getListingById } from "@/lib/db";
import { requestBooking } from "@/lib/calendar";

// Request-to-book for booking-site listings: validates availability against the
// calendar, records the booking, and holds the dates. (Payment is taken on the
// host's own Stripe at deploy time; locally this is the confirmation step.)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, guestEmail, checkIn, checkOut, guests } = body;
    const emailOk = typeof guestEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail);
    if (!listingId || !emailOk || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Listing, valid email and dates are required." }, { status: 400 });
    }
    const listing = await getListingById(listingId);
    if (!listing) return NextResponse.json({ error: "Listing not found." }, { status: 404 });

    const result = await requestBooking({ listingId, guestEmail, checkIn, checkOut, guests: guests ? Number(guests) : undefined });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });

    return NextResponse.json({
      ok: true,
      bookingId: result.bookingId,
      message: `Request sent for ${checkIn} to ${checkOut}. The owner will confirm and take payment securely.`,
    });
  } catch {
    return NextResponse.json({ error: "Booking request failed." }, { status: 500 });
  }
}
