// Which listings are substantial enough to be worth a crawl.
//
// The seed corpus (3,182 OSM-derived rows) is overwhelmingly a single
// placeholder photo plus a one-line generated description. Google has declined
// to index effectively all of it, so putting every slug in the sitemap only
// spreads crawl budget across pages that cannot rank. The photo set is the one
// honest quality signal in the data: 2,662 listings hold exactly one photo,
// while the enriched ones hold a real gallery of five.
//
// NOTE: the original quality check was `photos[0]?.startsWith("/places/")`,
// written when enriched photos were served from the local /places folder. They
// now live in blob storage, so that test matches zero rows. These helpers are
// the working replacement and are shared by the room page and the sitemap.

const PLACEHOLDER = /picsum\.photos|placehold|via\.placeholder/i;

/** True when the listing's lead photo is a genuine photo, not a filler image. */
export function hasRealPhotos(photos: string[] | null | undefined): boolean {
  const first = photos?.[0];
  return !!first && !PLACEHOLDER.test(first);
}

/**
 * True when the gallery was sourced from Google Places by lib/enrich.ts, which
 * stores every file under `places/` (blob) or `/places/` (local). Only those
 * listings should carry the "Photos via Google" credit; host-uploaded galleries
 * live elsewhere and must not be credited to Google.
 */
export function isGoogleSourcedPhotos(photos: string[] | null | undefined): boolean {
  const first = photos?.[0];
  return !!first && /(^|\/)places\//.test(first);
}

/** Minimum gallery size for a listing page to earn a place in the sitemap. */
export const MIN_SITEMAP_PHOTOS = 3;

/** True when a listing page carries enough content to be worth submitting. */
export function isSitemapWorthy(photos: string[] | null | undefined): boolean {
  return hasRealPhotos(photos) && (photos?.length ?? 0) >= MIN_SITEMAP_PHOTOS;
}
