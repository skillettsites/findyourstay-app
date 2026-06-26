import { NextResponse } from "next/server";
import { createEnquiry, getListingById } from "@/lib/db";
import { getHostEmail } from "@/lib/auth";
import { sendEmail, shell } from "@/lib/email";

// Records the enquiry, then relays it to the host by email (Resend) and sends
// the guest an acknowledgement.
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

    const cleanMsg = typeof message === "string" ? message.slice(0, 2000) : undefined;
    const id = await createEnquiry({
      listingId,
      guestEmail: String(guestEmail),
      checkIn,
      checkOut,
      guests: guests ? Number(guests) : undefined,
      message: cleanMsg,
    });

    const hostEmail = await getHostEmail(listing.hostId);
    const dates = checkIn ? `${checkIn}${checkOut ? ` → ${checkOut}` : ""}` : "no dates given";

    if (hostEmail) {
      void sendEmail({
        to: hostEmail,
        replyTo: String(guestEmail),
        subject: `New enquiry for ${listing.propertyName}`,
        html: shell(`
          <h1 style="font-size:19px;margin:0 0 12px">New enquiry</h1>
          <p style="color:#5c5853;margin:0 0 6px"><b>${listing.propertyName}</b></p>
          <p style="color:#5c5853;margin:0 0 4px">From: <a href="mailto:${guestEmail}" style="color:#e8385a">${guestEmail}</a></p>
          <p style="color:#5c5853;margin:0 0 4px">Dates: ${dates}${guests ? ` · ${guests} guests` : ""}</p>
          ${cleanMsg ? `<p style="color:#1f1d1b;margin:12px 0 0;padding:12px;background:#f6f5f3;border-radius:10px">${cleanMsg}</p>` : ""}
          <p style="color:#8a8580;font-size:13px;margin:16px 0 0">Reply directly to this email to reach the guest.</p>
        `),
      });
      void sendEmail({
        to: String(guestEmail),
        subject: `Your enquiry to ${listing.propertyName} was sent`,
        html: shell(`<p style="color:#5c5853;margin:0">Thanks! We've passed your enquiry about <b>${listing.propertyName}</b> (${dates}) to the host. They'll reply to you directly.</p>`),
      });
    }

    const claimed = Boolean(hostEmail);
    const reply = claimed
      ? `Enquiry sent to ${listing.propertyName}. They'll reply to ${guestEmail}.`
      : `Thanks, we've noted your interest in ${listing.propertyName}. It isn't claimed by its owner yet, so we'll alert you at ${guestEmail} if they join. Meanwhile you can book direct on the venue's own website.`;

    return NextResponse.json({ ok: true, id, message: reply, claimed });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
