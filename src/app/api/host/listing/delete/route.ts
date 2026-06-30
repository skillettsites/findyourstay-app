import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { sb, T } from "@/lib/sb";

export const dynamic = "force-dynamic";

// Permanently delete a stay the host owns. Also tears down its booking website
// (domain mapping) and removes related rows so nothing is orphaned.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing listing id." }, { status: 400 });

  // Ownership check — never let a host delete someone else's listing.
  const { data: l } = await sb.from(T.listings).select("host_id").eq("id", id).maybeSingle();
  if (!l || l.host_id !== user.id) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Free the domain + clear children first (in case FKs don't cascade), then the listing.
  for (const tbl of [T.domains, T.events, T.enquiries, T.bookings, T.calendar] as const) {
    try { await sb.from(tbl).delete().eq("listing_id", id); } catch { /* best-effort */ }
  }
  const { error } = await sb.from(T.listings).delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete the stay." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
