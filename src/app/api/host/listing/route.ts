import { NextResponse } from "next/server";
import { createListing, getListingById, type NewListingInput } from "@/lib/db";
import { enrichListingPhotos } from "@/lib/enrich";
import { provisionSite } from "@/lib/provision";
import { createBillingCheckout } from "@/lib/payments";

interface Body extends NewListingInput {
  bookingDomain?: string;
  withSite?: boolean;
  hostEmail?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.propertyName?.trim() || !body.cityName?.trim()) {
      return NextResponse.json({ error: "Property name and city are required." }, { status: 400 });
    }
    const { id, slug } = await createListing({
      ...body,
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

    // Host pays the plan via Stripe Billing (only when configured; else local flow).
    const checkoutUrl = await createBillingCheckout({
      email: body.hostEmail ?? "",
      tier: body.tier ?? "free",
      withSite: Boolean(body.withSite),
    });

    return NextResponse.json({ ok: true, id, slug, sourcedPhotos, site, checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Could not create the listing." }, { status: 500 });
  }
}
