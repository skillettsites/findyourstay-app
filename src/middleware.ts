import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Two jobs:
//  1. Multi-tenant routing: a request on a host's OWN domain is rewritten to the
//     live booking-site renderer. The main app domain passes through.
//  2. On the main app, refresh the Supabase auth session so logged-in hosts stay
//     signed in (token rotation happens here, where cookies are writable).
const SITE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").host;
  } catch {
    return "localhost:3000";
  }
})();

const SB_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const SB_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

// Mirror of lib/indexnow.ts INDEXNOW_KEY (kept inline so the edge middleware
// doesn't import the server-only module).
const INDEXNOW_KEY = (process.env.INDEXNOW_KEY || "fysindexnow7c1b4a9e2d").replace(/[^a-z0-9]/gi, "");

function isAppHost(host: string): boolean {
  const h = host.split(":")[0];
  return (
    host === SITE_HOST ||
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".vercel.app") ||
    h.endsWith(".pages.dev")
  );
}

// Old travel-intelligence site sections (the pre-pivot idea). These are gone
// for good: ~1,900 of them were still in Google's index redirecting into /s,
// which Google was flagging as Soft 404 / duplicate-canonical. A hard 410
// tells crawlers to drop them so the index becomes the directory only.
const GONE_PREFIXES = /^\/(stay|blog|compare|travel|price-watch|countries|country|analysestay)(\/|$)/;

function goneResponse(): NextResponse {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Page removed | FindYourStay</title><meta name="robots" content="noindex"></head>` +
    `<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1rem;color:#222">` +
    `<h1 style="font-size:1.4rem">This page has been removed</h1>` +
    `<p>FindYourStay is now a direct-booking stay directory. The travel guides that used to live here are gone.</p>` +
    `<p><a href="/s" style="color:#0a7">Browse stays</a> or <a href="/">go to the homepage</a>.</p></body></html>`,
    { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const hostOnly = host.split(":")[0];
  const appHostOnly = SITE_HOST.split(":")[0];

  // Retired sections 410 on the app host only (tenant microsites keep their
  // own routing below).
  if (isAppHost(host) && GONE_PREFIXES.test(req.nextUrl.pathname)) {
    return goneResponse();
  }

  // Consolidate www -> apex (the canonical host) with a permanent redirect, so
  // www doesn't get mistaken for a tenant microsite and SEO stays on one host.
  if (hostOnly === `www.${appHostOnly}`) {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = appHostOnly;
    return NextResponse.redirect(url, 308);
  }

  // Custom domain -> serve that host's standalone site (no auth needed).
  if (host && !isAppHost(host)) {
    const cleanHost = host.split(":")[0];
    const path = req.nextUrl.pathname;
    // Per-site SEO + AI-discovery files, generated for the host's own domain.
    if (path === "/robots.txt" || path === "/sitemap.xml" || path === "/llms.txt") {
      const url = req.nextUrl.clone();
      url.pathname = "/api/site-seo";
      url.search = `?host=${encodeURIComponent(cleanHost)}&file=${path.slice(1)}`;
      return NextResponse.rewrite(url);
    }
    // IndexNow ownership key file: /<key>.txt -> serve the key so Bing/Yandex
    // accept our instant-indexing submissions for this host's site.
    if (path === `/${INDEXNOW_KEY}.txt`) {
      const url = req.nextUrl.clone();
      url.pathname = "/api/site-seo";
      url.search = `?host=${encodeURIComponent(cleanHost)}&file=indexnow`;
      return NextResponse.rewrite(url);
    }
    const url = req.nextUrl.clone();
    const sub = path === "/" ? "" : path;
    url.pathname = `/sites/by-domain/${encodeURIComponent(cleanHost)}${sub}`;
    return NextResponse.rewrite(url);
  }

  // Main app: refresh the auth session (best-effort).
  let res = NextResponse.next({ request: req });
  if (SB_URL && SB_ANON) {
    try {
      const supabase = createServerClient(SB_URL, SB_ANON, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (toSet) => {
            for (const { name, value } of toSet) req.cookies.set(name, value);
            res = NextResponse.next({ request: req });
            for (const { name, value, options } of toSet) res.cookies.set(name, value, options);
          },
        },
      });
      await supabase.auth.getUser();
    } catch {
      /* never let an auth hiccup break the page */
    }
  }
  return res;
}

export const config = {
  // robots.txt / sitemap.xml / llms.txt are intentionally matched so custom-host
  // requests reach middleware and receive the per-site versions. On the app host
  // they fall through to the static routes.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|places).*)"],
};
