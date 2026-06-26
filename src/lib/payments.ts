// Server-only Stripe scaffold. Fully written; activates automatically when keys
// are present (STRIPE_SECRET_KEY). Without keys it returns null so the local /
// E2E flow keeps working unchanged (listing publishes, no checkout redirect).
//
// Two separate Stripe systems by design:
//   Billing  = host pays US (the listing fee + booking-site add-on).
//   Connect  = guests pay the HOST directly (host is merchant of record).
import "server-only";
import Stripe from "stripe";

const KEY = (process.env.STRIPE_SECRET_KEY || "").replace(/\\n$/, "").trim();
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function stripeEnabled(): boolean {
  return KEY.length > 0;
}

function client(): Stripe | null {
  return KEY ? new Stripe(KEY) : null;
}

const TIER_YEARLY: Record<string, number> = { free: 0, standard: 7900, featured: 14900, pro: 29900 };
const ADDON_YEARLY = 12000;

/** Host pays the yearly listing fee (+ optional booking website). Returns a
 *  Checkout URL, or null when Stripe isn't configured (local/dev). */
export async function createBillingCheckout(opts: {
  email: string;
  tier: string;
  withSite: boolean;
}): Promise<string | null> {
  const stripe = client();
  if (!stripe) return null;
  const amount = (TIER_YEARLY[opts.tier] ?? 0) + (opts.withSite ? ADDON_YEARLY : 0);
  if (amount === 0) return null; // free plan, no payment

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: "gbp",
        recurring: { interval: "year" },
        unit_amount: amount,
        product_data: { name: `FindYourStay ${opts.tier} plan${opts.withSite ? " + booking website" : ""}` },
      },
    },
  ];
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: opts.email,
    line_items,
    success_url: `${SITE}/host/dashboard?paid=1`,
    cancel_url: `${SITE}/host/new`,
  });
  return session.url;
}

/** Host onboards their OWN Stripe (Express) so guests pay them directly.
 *  Returns an onboarding URL, or null when Stripe isn't configured. */
export async function createConnectOnboarding(hostEmail: string): Promise<string | null> {
  const stripe = client();
  if (!stripe) return null;
  const account = await stripe.accounts.create({ type: "express", email: hostEmail });
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${SITE}/host/dashboard`,
    return_url: `${SITE}/host/dashboard?connected=1`,
    type: "account_onboarding",
  });
  return link.url;
}
