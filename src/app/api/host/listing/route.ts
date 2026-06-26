import { NextResponse } from "next/server";
import { createListing, getListingById, type NewListingInput } from "@/lib/db";
import { enrichListingPhotos } from "@/lib/enrich";
import { provisionSite } from "@/lib/provision";
import { createBillingCheckout } from "@/lib/payments";
import { getUser, ensureHost } from "@/lib/auth";
import { sendEmail, shell } from "@/lib/email";

interface Body extends NewListingInput {
  bookingDomain?: string;
  withSite?: boolean;
  hostName?: string;
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  try {
    // Must be a logged-in host. The listing is owned by their account.
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to publish a listing.", needsAuth: true }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    if (!body.propertyName?.trim() || !body.cityName?.trim()) {
      return NextResponse.json({ error: "Property name and city are required." }, { status: 400 });
    }

    await ensureHost(user, body.hostName);

    const { id, slug } = await createListing({
      ...body,
      hostId: user.id,
      pricePerNight: body.pricePerNight ? Number(body.pricePerNight) : undefined,
    });

    // Source photos for the host when they didn't add their own (time-boxed).
    let sourcedPhotos = 0;
    if (!body.photos || body.photos.length === 0) {
      const listing = await getListingById(id);
      if (listing) {
        const timeout = new Promise<number>((res) => setTimeout(() => res(0), 12000));
        sourcedPhotos = await Promise.race([enrichListingPhotos(listing), timeout]);
      }
    }

    // Booking-website add-on: register/point the domain (no-op record locally).
    let site: { status: string; note: string } | undefined;
    if (body.hasBookingSite && body.bookingDomain) {
      site = await provisionSite(id, body.bookingDomain);
    }

    // Welcome / live email (best-effort).
    void sendEmail({
      to: user.email,
      subject: `${body.propertyName} is live on FindYourStay`,
      html: shell(`
        <h1 style="font-size:20px;margin:0 0 10px">You're live 🎉</h1>
        <p style="color:#5c5853;margin:0 0 16px"><b>${body.propertyName}</b> in ${body.cityName} is now listed. Travellers can find it and book direct with you.</p>
        <a href="${SITE}/rooms/${slug}" style="display:inline-block;background:#e8385a;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:999px">View your listing</a>
        <p style="color:#8a8580;font-size:13px;margin:16px 0 0">Manage everything from your <a href="${SITE}/host/dashboard" style="color:#e8385a">host dashboard</a>.</p>
      `),
    });

    // Host pays the plan via Stripe Billing (only when a paid tier; promo codes
    // like FOUNDING100 are accepted at checkout).
    const checkoutUrl = await createBillingCheckout({
      email: user.email,
      tier: body.tier ?? "free",
      withSite: Boolean(body.withSite),
    });

    return NextResponse.json({ ok: true, id, slug, sourcedPhotos, site, checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Could not create the listing." }, { status: 500 });
  }
}
