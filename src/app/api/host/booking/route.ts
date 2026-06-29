import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getBookingForHost, setBookingStatus, getListingById, getDomainsForListings } from "@/lib/db";
import { removeBlocksForRange } from "@/lib/calendar";
import { sendEmail, shell } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Escape a host's free-text message before placing it in the email HTML.
function esc(s: string): string {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}
const quote = (m: unknown) => {
  const t = typeof m === "string" ? m.trim() : "";
  return t ? `<div style="color:#1f1d1b;margin:0 0 16px;padding:12px 14px;background:#faf7f4;border-radius:12px;border:1px solid #ececec">${esc(t)}</div>` : "";
};

// Host accepts (with a message + their booking-site link) or declines (with a
// message) a request-to-book. Accept emails the guest; decline frees the dates.
export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const { bookingId, action, message } = await req.json();
    const booking = await getBookingForHost(String(bookingId), user.id);
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    const listing = await getListingById(booking.listingId);

    if (action === "confirm") {
      await setBookingStatus(booking.id, "confirmed");
      // The host's booking-site link, so the guest can pay and confirm.
      const domains = listing ? await getDomainsForListings([listing]) : {};
      const siteUrl = listing ? (domains[listing.id] ? `https://${domains[listing.id]}/book` : `${SITE}/sites/${listing.slug}/book`) : `${SITE}/s`;
      void sendEmail({
        to: booking.guestEmail,
        replyTo: user.email,
        subject: `Your stay at ${listing?.propertyName ?? "your booking"} is confirmed`,
        html: shell(`
          <h1 style="font-size:20px;margin:0 0 10px">You're confirmed 🎉</h1>
          <p style="color:#5c5853;margin:0 0 8px"><b>${listing?.propertyName ?? "Your stay"}</b></p>
          <p style="color:#5c5853;margin:0 0 16px">${booking.checkIn} → ${booking.checkOut}</p>
          ${quote(message)}
          <a href="${siteUrl}" style="display:inline-block;background:#e8385a;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:999px">Confirm &amp; pay</a>
          <p style="color:#8a8580;font-size:13px;margin:16px 0 0">Your host (${user.email}) will be in touch with any arrival details. Reply to this email to reach them.</p>
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
          ${quote(message) || `<p style="color:#5c5853;margin:0 0 12px">Unfortunately your requested dates (${booking.checkIn} → ${booking.checkOut}) at <b>${listing?.propertyName ?? "this stay"}</b> aren't available.</p>`}
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
