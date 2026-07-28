import { NextResponse } from "next/server";
import { recordEvent } from "@/lib/db";

// Client-side view recorder. The room page is cached (ISR) so it no longer
// renders once per visitor, which means the view can't be counted server-side
// any more. The browser reports it here instead, which also keeps crawler hits
// out of the host's numbers.
const ALLOWED = new Set(["view"]);

export async function POST(req: Request) {
  try {
    const { listingId, type } = (await req.json()) as { listingId?: string; type?: string };
    if (!listingId || !type || !ALLOWED.has(type)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordEvent(listingId, type);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
