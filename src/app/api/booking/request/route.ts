import { NextResponse } from "next/server";
import { getListingById } from "@/lib/db";
import { getHostEmail } from "@/lib/auth";
import { requestBooking } from "@/lib/calendar";
import { sendEmail, shell } from "@/lib/email";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Request-to-book for booking-site listings: validates availability, records the
// booking request, holds the dates, and emails the host (reply-to the guest) plus
// a confirmation to the guest. The guest pays the host directly via the host's own
// Stripe/PayPal link; we never touch the money.
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

    const hostEmail = await getHostEmail(listing.hostId);
    if (hostEmail) {
      void sendEmail({
        to: hostEmail,
        replyTo: String(guestEmail),
        subject: `Booking request for ${listing.propertyName}`,
        html: shell(`
          <h1 style="font-size:19px;margin:0 0 12px">New booking request</h1>
          <p style="color:#5c5853;margin:0 0 6px"><b>${listing.propertyName}</b></p>
          <p style="color:#5c5853;margin:0 0 4px">Guest: <a href="mailto:${guestEmail}" style="color:#e8385a">${guestEmail}</a></p>
          <p style="color:#5c5853;margin:0 0 14px">Dates: ${checkIn} → ${checkOut}${guests ? ` · ${guests} guests` : ""}</p>
          <a href="${SITE}/host/dashboard" style="display:inline-block;background:#e8385a;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:999px">Confirm or decline</a>
        `),
      });
    }
    void sendEmail({
      to: String(guestEmail),
      subject: `Booking request sent for ${listing.propertyName}`,
      html: shell(`<p style="color:#5c5853;margin:0">Thanks! Your request for <b>${listing.propertyName}</b> (${checkIn} → ${checkOut}) has been sent. The owner will confirm and arrange payment with you directly.</p>`),
    });

    return NextResponse.json({
      ok: true,
      bookingId: result.bookingId,
      message: `Request sent for ${checkIn} to ${checkOut}. The owner will confirm and arrange payment with you directly.`,
    });
  } catch {
    return NextResponse.json({ error: "Booking request failed." }, { status: 500 });
  }
}
