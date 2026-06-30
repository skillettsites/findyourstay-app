import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { searchDomains } from "@/lib/domains";

export const dynamic = "force-dynamic";

// Live domain availability + pricing for the booking-site builder. Login-gated
// so it isn't a free public lookup endpoint.
export async function GET(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ error: "Type at least 2 characters." }, { status: 400 });

  try {
    return NextResponse.json(await searchDomains(q));
  } catch {
    return NextResponse.json({ error: "Could not check domains right now. Try again in a moment." }, { status: 500 });
  }
}
