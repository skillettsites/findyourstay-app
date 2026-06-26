import { NextResponse } from "next/server";
import { syncListing, listingsWithIcal } from "@/lib/calendar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cron target (every 1-2h on Vercel) + manual trigger. ?listingId= syncs one.
export async function POST(req: Request) {
  const listingId = new URL(req.url).searchParams.get("listingId");
  const targets = listingId ? [{ id: listingId }] : await listingsWithIcal();
  let imported = 0;
  for (const t of targets) {
    const r = await syncListing(t.id);
    imported += r.imported;
  }
  return NextResponse.json({ ok: true, listings: targets.length, imported });
}

export async function GET(req: Request) {
  return POST(req);
}
