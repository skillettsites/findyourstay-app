// Server-only: fetch real photos of an actual place from Google Places and
// download them locally, then update the listing. Used to fulfil the host
// "we'll source photos for you" promise. Best-effort: never throws to the caller.
import "server-only";
import { sb, T } from "./sb";
import { storePhoto } from "./storage";
import type { Listing } from "./types";

const KEY = (process.env.GOOGLE_PLACES_API_KEY || "").replace(/\\n$/, "").trim();

function haversine(a: number, b: number, c: number, d: number) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (c - a) * r, dLng = (d - b) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function searchPhotos(listing: Listing): Promise<{ name: string }[] | null> {
  const queries = [`${listing.propertyName}, ${listing.cityName}, ${listing.country}`, `${listing.propertyName} ${listing.cityName}`];
  for (const textQuery of queries) {
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "places.location,places.photos" },
        body: JSON.stringify({ textQuery, maxResultCount: 4 }),
      });
      if (!res.ok) continue;
      const j = await res.json();
      let best: { name: string }[] | null = null;
      let bestKm = Infinity;
      for (const p of j.places || []) {
        if (!p.photos?.length) continue;
        let km = 0;
        if (p.location && Number.isFinite(listing.lat) && listing.lat !== 0) {
          km = haversine(listing.lat, listing.lng, p.location.latitude, p.location.longitude);
        }
        if (km <= 8 && km < bestKm) { best = p.photos; bestKm = km; }
      }
      if (best) return best;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function enrichListingPhotos(listing: Listing): Promise<number> {
  if (!KEY) return 0;
  try {
    const photos = await searchPhotos(listing);
    if (!photos) return 0;
    const max = listing.tier === "free" ? 1 : 5;
    const urls: string[] = [];
    for (let n = 0; n < Math.min(photos.length, max); n++) {
      try {
        const r = await fetch(`https://places.googleapis.com/v1/${photos[n].name}/media?maxWidthPx=1000&key=${KEY}`, { redirect: "follow" });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length < 1000) continue;
        const url = await storePhoto(buf, `${listing.id}-${n}.jpg`);
        urls.push(url);
      } catch {
        /* skip photo */
      }
    }
    if (urls.length) {
      await sb.from(T.listings).update({ photos: urls, real_photo: true }).eq("id", listing.id);
    }
    return urls.length;
  } catch {
    return 0;
  }
}
