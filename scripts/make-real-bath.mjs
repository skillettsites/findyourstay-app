// One-off: turn David's demo listing into the REAL Brooks Guesthouse Bath —
// real name, address, coords, website link, photos (Google Places, uploaded to
// Blob) and real Google reviews used as testimonials. Run: node scripts/make-real-bath.mjs
import fs from "node:fs";
import { put } from "@vercel/blob";

const env = fs.readFileSync(".env.local", "utf8") + "\n" + (fs.existsSync(".env.production") ? fs.readFileSync(".env.production", "utf8") : "");
const get = (k) => { const m = env.match(new RegExp("^" + k + "=(.*)$", "m")); return m ? m[1].replace(/^["']|["']$/g, "").replace(/\\n$/, "").trim() : ""; };
const SUPA_URL = get("SUPABASE_URL") || get("NEXT_PUBLIC_SUPABASE_URL"), SUPA_KEY = get("SUPABASE_SERVICE_ROLE_KEY");
const PLACES_KEY = get("GOOGLE_PLACES_API_KEY"), BLOB = get("BLOB_READ_WRITE_TOKEN");
const LISTING_ID = "0f4f2bc4-62af-4026-ad35-baa0bb999ae9";

const sr = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Goog-Api-Key": PLACES_KEY, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.websiteUri,places.editorialSummary,places.reviews" },
  body: JSON.stringify({ textQuery: "Brooks Guesthouse Bath, 1 Crescent Gardens" }),
});
const sj = await sr.json();
const place = (sj.places || [])[0];
if (!place) { console.log("NO PLACE:", JSON.stringify(sj).slice(0, 400)); process.exit(1); }
console.log("Place:", place.displayName?.text, "|", place.formattedAddress, "| photos:", place.photos?.length, "| reviews:", place.reviews?.length, "| web:", place.websiteUri);

async function photoToUrl(name, i) {
  const m = await fetch(`https://places.googleapis.com/v1/${name}/media?maxWidthPx=1600&skipHttpRedirect=true&key=${PLACES_KEY}`);
  const uri = (await m.json()).photoUri;
  if (!uri) return null;
  if (!BLOB) return uri; // fallback to the Google-served URL
  const img = await fetch(uri);
  const buf = Buffer.from(await img.arrayBuffer());
  const { url } = await put(`brooks-bath/${i}.jpg`, buf, { access: "public", token: BLOB, contentType: "image/jpeg", addRandomSuffix: true });
  return url;
}
const names = (place.photos || []).slice(0, 9).map((p) => p.name);
const urls = [];
for (let i = 0; i < names.length; i++) { try { const u = await photoToUrl(names[i], i); if (u) urls.push(u); console.log("  photo", i, u ? "ok" : "skip"); } catch (e) { console.log("  photo", i, "err", e.message); } }

const loc = place.location;
const fz = (v) => v + (Math.random() - 0.5) * 0.0007;
const gallery = urls.slice(0, 5);
const bedrooms = [
  { name: "Boutique double", photos: urls.slice(5, 7) },
  { name: "Superior room", photos: urls.slice(7, 9) },
].filter((b) => b.photos.length);
const reviews = (place.reviews || []).filter((r) => r.text?.text).slice(0, 3).map((r) => ({ quote: r.text.text.replace(/\s+/g, " ").trim().slice(0, 400), author: r.authorAttribution?.displayName || "Guest", source: "Google" }));

const patch = {
  property_name: place.displayName?.text || "Brooks Guesthouse Bath",
  slug: "brooks-guesthouse-bath",
  property_type: "guest_house", city_name: "Bath", city_slug: "bath", country: "England", neighborhood: "Crescent Gardens",
  lat: fz(loc.latitude), lng: fz(loc.longitude), price_per_night: 145, price_range: "mid",
  description: place.editorialSummary?.text || "A family-owned boutique guesthouse on Crescent Gardens, a short stroll from the Royal Crescent and the heart of Bath. Elegant, individually styled bedrooms, a warm welcome and an award-winning breakfast. Book direct for the best rate.",
  amenities: ["WiFi", "Breakfast Included", "Heating", "Garden"],
  perks: ["Best price guaranteed", "Free breakfast", "Flexible cancellation"],
  photos: gallery.length ? gallery : undefined,
  hero_image: urls[0] || undefined,
  bedrooms, bathrooms: 1,
  booking_url: place.websiteUri || "https://www.brooksguesthouse.com",
  testimonials: reviews.length ? reviews : undefined,
  site_theme: "classic", has_booking_site: true, status: "active",
};
Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

const H = { apikey: SUPA_KEY, authorization: "Bearer " + SUPA_KEY, "content-type": "application/json", prefer: "return=minimal" };
const r = await fetch(`${SUPA_URL}/rest/v1/fys_listings?id=eq.${LISTING_ID}`, { method: "PATCH", headers: H, body: JSON.stringify(patch) });
console.log("\nupdate:", r.status, r.status >= 400 ? await r.text() : "ok");
console.log("name:", patch.property_name, "| slug:", patch.slug, "| photos:", gallery.length, "| bedrooms:", bedrooms.length, "| testimonials:", reviews.length, "| link:", patch.booking_url);
