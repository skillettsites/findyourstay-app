// IndexNow ownership key for the MAIN site (findyourstay.com). Served as a route
// (not a public file) so the middleware matcher doesn't swallow it. Bing/Yandex
// fetch this to verify our instant-indexing submissions.
export const dynamic = "force-static";

export function GET() {
  return new Response("fysindexnow7c1b4a9e2d", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
