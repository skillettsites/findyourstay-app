import { NextRequest, NextResponse } from "next/server";

// Multi-tenant routing: a request arriving on a host's OWN domain is rewritten
// to the live booking-site renderer. Requests on the main app domain (or local
// dev) pass straight through. The domain -> listing lookup happens in the
// rewritten page (Node runtime), not here, so this stays Edge-safe.
const SITE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").host;
  } catch {
    return "localhost:3000";
  }
})();

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

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (!host || isAppHost(host)) return NextResponse.next();

  // Custom domain -> serve that host's booking site, keeping the URL intact.
  const url = req.nextUrl.clone();
  url.pathname = `/sites/by-domain/${encodeURIComponent(host.split(":")[0])}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|places|robots.txt|sitemap.xml).*)"],
};
