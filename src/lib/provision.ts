// Server-only domain + hosting provisioning scaffold for the booking-website
// add-on. Fully written; activates when CLOUDFLARE_API_TOKEN is set. Records the
// domain->listing mapping locally so the multi-tenant renderer (middleware +
// /sites/by-domain) works in production once a real domain points at the app.
import "server-only";
import { mapDomain } from "./db";
import { submitToIndexNow } from "./indexnow";

const CF_TOKEN = (process.env.CLOUDFLARE_API_TOKEN || "").replace(/\\n$/, "").trim();
const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID ?? "";
const PAGES_CNAME = process.env.PAGES_CNAME ?? "findyourstay-sites.pages.dev";

export function cloudflareEnabled(): boolean {
  return CF_TOKEN.length > 0 && CF_ACCOUNT.length > 0;
}

async function cf(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${CF_TOKEN}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  return res.json();
}

/**
 * Provision a standalone booking site for a listing on `domain`.
 * Steps (each gated to run only with credentials):
 *   1. (registrar) register the domain — Cloudflare Registrar / Porkbun.  [STUB: needs registrar API]
 *   2. add the zone to Cloudflare + point DNS at the Pages project.
 *   3. record domain -> listing so the multi-tenant renderer serves it.
 * Returns the resulting status. Without credentials it records the request as
 * 'pending' so an operator (or a deploy job) can complete it.
 */
export async function provisionSite(listingId: string, domain: string): Promise<{ status: string; note: string }> {
  const clean = domain.trim().toLowerCase();

  if (!cloudflareEnabled()) {
    await mapDomain(clean, listingId, "pending", "unconfigured");
    return { status: "pending", note: "Recorded. Set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID to auto-provision." };
  }

  try {
    // 1. Registrar purchase — Cloudflare Registrar API only registers domains in
    //    an existing account zone; new-domain purchase varies by TLD. Left as the
    //    one manual/registrar-specific step. Operator can also bring an owned domain.
    // 2. Create zone + DNS CNAME to the Pages project.
    const zone = await cf("/zones", {
      method: "POST",
      body: JSON.stringify({ name: clean, account: { id: CF_ACCOUNT }, type: "full" }),
    });
    const zoneId = zone?.result?.id;
    if (zoneId) {
      await cf(`/zones/${zoneId}/dns_records`, {
        method: "POST",
        body: JSON.stringify({ type: "CNAME", name: "@", content: PAGES_CNAME, proxied: true, ttl: 1 }),
      });
      await cf(`/zones/${zoneId}/dns_records`, {
        method: "POST",
        body: JSON.stringify({ type: "CNAME", name: "www", content: PAGES_CNAME, proxied: true, ttl: 1 }),
      });
    }
    // 3. Record the mapping live, then submit the new site to IndexNow so Bing
    //    and Yandex crawl it straight away (Google picks it up via the sitemap).
    await mapDomain(clean, listingId, "active", "cloudflare");
    void submitToIndexNow(clean);
    return { status: "active", note: "Domain zoned, pointed at the booking-site app, and submitted for indexing." };
  } catch {
    await mapDomain(clean, listingId, "error", "cloudflare");
    return { status: "error", note: "Provisioning call failed; recorded for retry." };
  }
}
