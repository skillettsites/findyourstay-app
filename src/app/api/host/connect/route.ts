import { NextResponse } from "next/server";
import { createConnectOnboarding, stripeEnabled } from "@/lib/payments";

// Host onboards their own Stripe so guests pay them directly. Returns an
// onboarding URL when Stripe is configured; otherwise reports not-configured.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!stripeEnabled()) {
      return NextResponse.json({ ok: false, configured: false, message: "Stripe isn't configured yet (set STRIPE_SECRET_KEY on deploy)." });
    }
    const url = await createConnectOnboarding(email ?? "");
    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ error: "Could not start Stripe onboarding." }, { status: 500 });
  }
}
