import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getBookingForHost, setBookingStatus, getListingById } from "@/lib/db";
import { removeBlocksForRange } from "@/lib/calendar";
import { sendEmail, shell } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Host confirms or declines a request-to-book. Confirm emails the guest; decline
// frees the held dates back up.
export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const { bookingId, action } = await req.json();
    const booking = await getBookingForHost(String(bookingId), user.id);
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    const listing = await getListingById(booking.listingId);

    if (action === "confirm") {
      await setBookingStatus(booking.id, "confirmed");
      void sendEmail({
        to: booking.guestEmail,
        replyTo: user.email,
        subject: `Your stay at ${listing?.propertyName ?? "your booking"} is confirmed`,
        html: shell(`
          <h1 style="font-size:20px;margin:0 0 10px">You're confirmed 🎉</h1>
          <p style="color:#5c5853;margin:0 0 8px"><b>${listing?.propertyName ?? "Your stay"}</b></p>
          <p style="color:#5c5853;margin:0 0 16px">${booking.checkIn} → ${booking.checkOut}</p>
          <p style="color:#5c5853;margin:0 0 16px">Your host (${user.email}) will be in touch with payment and arrival details. Reply to this email to reach them.</p>
        `),
      });
      return NextResponse.json({ ok: true, status: "confirmed" });
    }

    if (action === "decline") {
      await setBookingStatus(booking.id, "declined");
      await removeBlocksForRange(booking.listingId, booking.checkIn, booking.checkOut, "fys");
      void sendEmail({
        to: booking.guestEmail,
        replyTo: user.email,
        subject: `Update on your request at ${listing?.propertyName ?? "your booking"}`,
        html: shell(`
          <p style="color:#5c5853;margin:0 0 12px">Unfortunately your requested dates (${booking.checkIn} → ${booking.checkOut}) at <b>${listing?.propertyName ?? "this stay"}</b> aren't available.</p>
          <a href="${SITE}/s" style="display:inline-block;background:#e8385a;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:999px">Find another stay</a>
        `),
      });
      return NextResponse.json({ ok: true, status: "declined" });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Could not update the booking." }, { status: 500 });
  }
}
