import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { updateListingForHost } from "@/lib/db";

// Host edits their own listing (and booking-site template) from the dashboard.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "Missing listing id." }, { status: 400 });

  const ok = await updateListingForHost(String(body.id), user.id, {
    propertyName: typeof body.propertyName === "string" ? body.propertyName : undefined,
    description: typeof body.description === "string" ? body.description : undefined,
    pricePerNight: body.pricePerNight === "" || body.pricePerNight == null ? undefined : Number(body.pricePerNight),
    amenities: Array.isArray(body.amenities) ? body.amenities.map(String) : undefined,
    photos: Array.isArray(body.photos) ? body.photos.map(String) : undefined,
    siteTheme: ["classic", "modern", "coastal"].includes(body.siteTheme) ? body.siteTheme : undefined,
    payStripe: typeof body.payStripe === "string" ? body.payStripe : undefined,
    payPaypal: typeof body.payPaypal === "string" ? body.payPaypal : undefined,
    perks: Array.isArray(body.perks) ? body.perks.map(String).slice(0, 12) : undefined,
  });

  if (!ok) return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
