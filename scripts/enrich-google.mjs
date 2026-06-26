// Enrich listings with REAL photos of the actual places via Google Places API.
// Photos are downloaded to /public/places (keeps the API key private, works
// offline, avoids re-billing on every page view).
//
// Run:  GOOGLE_PLACES_API_KEY=AIza... node scripts/enrich-google.mjs [--limit N] [--all] [--photos M]
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const KEY = (process.env.GOOGLE_PLACES_API_KEY || "").replace(/\\n$/, "").trim();
if (!KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY");
  process.exit(1);
}

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
};
const LIMIT = Number(arg("--limit", "0")) || 0;
const REDO_ALL = process.argv.includes("--all");
const MAX_PHOTOS_PAID = Number(arg("--photos", "5"));
const CONCURRENCY = 6;
const PHOTO_DIR = path.join(process.cwd(), "public", "places");
fs.mkdirSync(PHOTO_DIR, { recursive: true });

const DB_PATH = path.join(process.cwd(), "data", "fys.db");
const db = new DatabaseSync(DB_PATH);
try {
  db.exec("ALTER TABLE listings ADD COLUMN real_photo INTEGER DEFAULT 0");
} catch {
  /* exists */
}

// Most-visible first: paid tiers, then rating.
const rows = db
  .prepare(
    `SELECT id, property_name, city_name, country, lat, lng, tier, photos
     FROM listings ${REDO_ALL ? "" : "WHERE real_photo = 0"}
     ORDER BY CASE tier WHEN 'pro' THEN 0 WHEN 'featured' THEN 1 WHEN 'standard' THEN 2 ELSE 3 END, rating DESC
     ${LIMIT ? `LIMIT ${LIMIT}` : ""}`,
  )
  .all();

console.log(`Google Places enrichment: ${rows.length} listings, up to ${MAX_PHOTOS_PAID} photos each (paid tiers).`);

const update = db.prepare("UPDATE listings SET photos = ?, real_photo = 1 WHERE id = ?");
let done = 0, hits = 0, photos = 0, calls = 0;

function haversine(a, b, c, d) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (c - a) * r, dLng = (d - b) * r;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

async function runQuery(textQuery) {
  calls++;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": "places.displayName,places.location,places.photos",
    },
    body: JSON.stringify({ textQuery, maxResultCount: 4 }),
  });
  if (!res.ok) return [];
  const j = await res.json();
  return j.places || [];
}

async function searchPlace(row) {
  // Try a few phrasings; pick the closest result (within 6km) that has photos.
  const queries = [
    `${row.property_name}, ${row.city_name}, ${row.country}`,
    `${row.property_name} ${row.city_name}`,
  ];
  for (const q of queries) {
    const places = await runQuery(q);
    let best = null;
    let bestKm = Infinity;
    for (const p of places) {
      if (!p.photos?.length) continue;
      let km = 0;
      if (p.location && Number.isFinite(row.lat)) {
        km = haversine(row.lat, row.lng, p.location.latitude, p.location.longitude);
      }
      if (km <= 6 && km < bestKm) {
        best = p.photos;
        bestKm = km;
      }
    }
    if (best) return best;
  }
  return null;
}

async function downloadPhoto(photoName, dest) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1000&key=${KEY}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) return false;
  fs.writeFileSync(dest, buf);
  return true;
}

async function worker(queue) {
  while (queue.length) {
    const row = queue.pop();
    try {
      const found = await searchPlace(row);
      if (found) {
        const max = row.tier === "free" ? 1 : MAX_PHOTOS_PAID;
        const urls = [];
        for (let n = 0; n < Math.min(found.length, max); n++) {
          const file = `${row.id}-${n}.jpg`;
          const ok = await downloadPhoto(found[n].name, path.join(PHOTO_DIR, file));
          if (ok) {
            urls.push(`/places/${file}`);
            photos++;
          }
        }
        if (urls.length) {
          update.run(JSON.stringify(urls), row.id);
          hits++;
        }
      }
    } catch {
      /* skip this one */
    }
    done++;
    if (done % 50 === 0) console.log(`  ${done}/${rows.length} done · ${hits} matched · ${photos} photos · ${calls} searches`);
  }
}

const queue = [...rows];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

console.log(`\nDone. ${hits}/${rows.length} listings got real photos (${photos} images, ${calls} text searches).`);
console.log(`With real photos in DB: ${db.prepare("SELECT COUNT(*) n FROM listings WHERE real_photo=1").get().n}`);
