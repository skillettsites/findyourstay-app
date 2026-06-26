import { NextResponse } from "next/server";
import { createEnquiry, getListingById } from "@/lib/db";

// In production this also relays an email to the host (Resend) and, for
// booking-site hosts, becomes a request-to-book. Locally it just records it.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, guestEmail, checkIn, checkOut, guests, message } = body;

    const emailOk = typeof guestEmail === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail);
    if (!listingId || !emailOk) {
      return NextResponse.json({ error: "A valid email and listing are required." }, { status: 400 });
    }
    const listing = await getListingById(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    const id = await createEnquiry({
      listingId,
      guestEmail: String(guestEmail),
      checkIn,
      checkOut,
      guests: guests ? Number(guests) : undefined,
      message: typeof message === "string" ? message.slice(0, 2000) : undefined,
    });

    // Honest messaging: unclaimed listings have no host inbox to relay to.
    const claimed = listing.status === "active" && (listing.bookingUrl || listing.hasBookingSite);
    const reply = claimed
      ? `Enquiry sent to ${listing.propertyName}. They'll reply to ${guestEmail}.`
      : `Thanks, we've noted your interest in ${listing.propertyName}. It isn't claimed by its owner yet, so we'll alert you at ${guestEmail} if they join. Meanwhile you can book direct on the venue's own website.`;

    return NextResponse.json({ ok: true, id, message: reply, claimed });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
