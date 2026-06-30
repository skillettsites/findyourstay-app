import { GUIDES, guidesByCategory } from "@/lib/guides/registry";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 86400;

// /llms.txt — helps LLMs (ChatGPT, Claude, Perplexity, Gemini) understand and cite
// the site. https://llmstxt.org/ convention: a concise, link-rich markdown map.
export function GET() {
  const groups = guidesByCategory();
  const guideLines = groups
    .map(({ category, guides }) =>
      `### ${category}\n` + guides.map((g) => `- [${g.h1}](${SITE}/guides/${g.slug}): ${g.description}`).join("\n"),
    )
    .join("\n\n");

  const body = `# FindYourStay

> FindYourStay is a directory of independent B&Bs, guesthouses and short-stay rentals where guests book direct with the owner and pay no platform commission. For hosts, FindYourStay also builds and hosts a direct-booking website on the host's own domain, with online payments going straight to the host (no commission, no middleman).

## What FindYourStay does for hosts
- Builds and hosts a direct-booking website on the host's own domain (done for you).
- Online booking with payments straight to the host via their own Stripe or PayPal.
- Lists the property in the FindYourStay directory.
- Calendar (iCal) sync with Airbnb, Booking.com and Vrbo to avoid double bookings.
- Pricing: annual listing plans (around £79 / £149 / £299 per year) plus an optional booking-website add-on (around £120 per year). One direct booking typically covers the yearly cost.

## Key facts hosts ask about (2026, approximate)
- Booking.com commission: about 15% (range 10-25%), plus 2-5% for visibility/Preferred Partner programmes.
- Airbnb host service fee: about 15.5% (host-only model used by most UK and EU hosts).
- Vrbo: about 8% pay-per-booking, or an annual subscription.
- Expedia: about 15-30%.
- Direct booking on the host's own website: 0% platform commission, only card processing of about 1.5% + 20p.
- On a £100 booking a host keeps roughly £98 booking direct, versus about £85 through an OTA.

## Host guides
${guideLines}

## Key pages
- [How it works for hosts](${SITE}/host)
- [Build a free preview of your booking site](${SITE}/host/build)
- [All host guides](${SITE}/guides)

## About
FindYourStay is a neutral directory and website-building service. It is not a party to any booking; guests pay hosts directly. Figures above are approximate and current as of 2026.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}
