import { NextResponse } from "next/server";
import { setIcalUrls, addManualBlock, removeBlock, syncListing } from "@/lib/calendar";

// Host calendar management: save external iCal feed URLs, add/remove manual blocks.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, listingId } = body;
    if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

    if (action === "set-urls") {
      const urls: string[] = (body.urls ?? []).map((u: string) => u.trim()).filter((u: string) => /^https?:\/\//.test(u));
      await setIcalUrls(listingId, urls);
      const r = await syncListing(listingId);
      return NextResponse.json({ ok: true, synced: r.imported });
    }
    if (action === "add-block") {
      if (!body.start || !body.end || body.end <= body.start) {
        return NextResponse.json({ error: "Valid start and end required." }, { status: 400 });
      }
      await addManualBlock(listingId, body.start, body.end);
      return NextResponse.json({ ok: true });
    }
    if (action === "remove-block") {
      await removeBlock(body.blockId);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Calendar update failed." }, { status: 500 });
  }
}
