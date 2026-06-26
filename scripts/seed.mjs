// Seed the local SQLite DB with REAL direct-booking venues from OpenStreetMap.
// Legitimate "unclaimed listing" model: real names + their OWN website link,
// OTA links filtered out, representative (not scraped) imagery, claim CTA.
// Run: node scripts/seed.mjs   (add --reset to wipe first)
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { ANCHOR_CITIES, OTA_DOMAINS } from "./anchor-cities.mjs";

const DB_PATH = path.join(process.cwd(), "data", "fys.db");
const RESET = process.argv.includes("--reset");
const OVERPASS = [
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
ensureSchema(db);
if (RESET) {
  db.exec("DELETE FROM listings;");
  console.log("Wiped listings.");
}

const PHOTO = (seed, n) => `https://picsum.photos/seed/fys-${seed}-${n}/900/650`;
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

const TYPE_MAP = {
  guest_house: "guest_house",
  hotel: "hotel",
  hostel: "hostel",
  chalet: "chalet",
  apartment: "apartment",
};

const AMENITIES = [
  "WiFi",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Washing Machine",
  "Pool",
  "Hot Tub",
  "Garden",
  "Balcony",
  "Free Parking",
  "Pet Friendly",
  "Gym",
  "Wheelchair Accessible",
  "Breakfast Included",
];

function isOta(url) {
  const u = url.toLowerCase();
  return OTA_DOMAINS.some((d) => u.includes(d));
}

function amenitiesFromTags(tags) {
  const a = new Set();
  if (/wlan|yes/.test(tags["internet_access"] || "")) a.add("WiFi");
  if (tags["swimming_pool"] === "yes" || tags["leisure"] === "swimming_pool") a.add("Pool");
  if (tags["air_conditioning"] === "yes") a.add("Air Conditioning");
  if (tags["wheelchair"] === "yes") a.add("Wheelchair Accessible");
  if (tags["parking"] || tags["amenity"] === "parking") a.add("Free Parking");
  if (/yes|dogs/.test(tags["pets"] || "")) a.add("Pet Friendly");
  if (tags["breakfast"] === "yes" || tags["breakfast"] === "included") a.add("Breakfast Included");
  // fill a couple at random so cards look complete
  while (a.size < rndInt(4, 7)) a.add(rnd(AMENITIES));
  return [...a];
}

function priceFor(country, type) {
  const base = { hostel: [18, 45], room: [40, 90], guest_house: [55, 130], apartment: [70, 180], hotel: [80, 240], chalet: [120, 320], villa: [150, 400], cottage: [90, 220] };
  const [lo, hi] = base[type] || [60, 160];
  const expensive = ["United Kingdom", "United States", "Singapore", "Japan", "United Arab Emirates", "Australia", "France", "Netherlands"].includes(country);
  const mult = expensive ? 1.3 : 0.85;
  return Math.round(((rndInt(lo, hi) * mult) / 5)) * 5;
}

function priceRange(price) {
  if (price < 70) return "budget";
  if (price < 160) return "mid";
  return "luxury";
}

async function overpass(city) {
  const d = 0.12; // ~13km box
  const bbox = `${city.lat - d},${city.lng - d},${city.lat + d},${city.lng + d}`;
  const q = `[out:json][timeout:60];(node["tourism"~"guest_house|hotel|chalet|apartment|hostel"]["website"](${bbox});way["tourism"~"guest_house|hotel|chalet|apartment|hostel"]["website"](${bbox}););out tags center 90;`;
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const endpoint of OVERPASS) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "data=" + encodeURIComponent(q),
        });
        if (res.status === 429) {
          await sleep(3000);
          continue;
        }
        if (!res.ok) continue;
        const json = await res.json();
        return json.elements || [];
      } catch {
        await sleep(800); // mirror down/timeout, try next
      }
    }
  }
  return [];
}

const insert = db.prepare(`INSERT OR IGNORE INTO listings
  (id, host_id, status, source, property_name, slug, city_slug, city_name, country,
   lat, lng, neighborhood, description, property_type, price_range, price_per_night,
   currency, amenities, photos, booking_url, has_booking_site, verified, tier, rating,
   review_count, attribution, created_at)
  VALUES (?, NULL, ?, 'osm_seed', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'gbp', ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`);

let totalInserted = 0;

for (const city of ANCHOR_CITIES) {
  const elements = await overpass(city);
  let cityCount = 0;
  const seenSlugs = new Set();

  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name;
    const website = tags.website || tags["contact:website"];
    if (!name || !website) continue;
    if (isOta(website)) continue;

    const lat = el.lat ?? el.center?.lat;
    const lng = el.lon ?? el.center?.lon;
    if (lat == null || lng == null) continue;

    let slug = slugify(`${name}-${city.slug}`);
    if (seenSlugs.has(slug)) slug = `${slug}-${rndInt(2, 999)}`;
    seenSlugs.add(slug);

    const ptype = TYPE_MAP[tags.tourism] || "guest_house";
    const price = priceFor(city.country, ptype);
    const neighborhood = tags["addr:suburb"] || tags["addr:neighbourhood"] || tags["addr:district"] || city.name;

    // Demo presentation: elevate ~18% to paid tiers so the Featured/Top Pick
    // UI is visible locally. All seeds remain "unclaimed" + link to own site.
    const roll = Math.random();
    const tier = roll < 0.05 ? "pro" : roll < 0.12 ? "featured" : roll < 0.18 ? "standard" : "free";
    const verified = tier !== "free" && Math.random() < 0.7 ? 1 : 0;

    const seedKey = slug;
    const photos =
      tier === "free"
        ? [PHOTO(seedKey, 1)] // unclaimed: single representative image
        : [PHOTO(seedKey, 1), PHOTO(seedKey, 2), PHOTO(seedKey, 3), PHOTO(seedKey, 4), PHOTO(seedKey, 5)];

    const desc = `${cap(ptype)} in ${neighborhood}, ${city.name}. Book direct with the owner, no platform fees. ${
      tags.description || ""
    }`.trim();

    insert.run(
      crypto.randomUUID(),
      "unclaimed",
      name,
      slug,
      city.slug,
      city.name,
      city.country,
      lat,
      lng,
      neighborhood,
      desc,
      ptype,
      priceRange(price),
      price,
      JSON.stringify(amenitiesFromTags(tags)),
      JSON.stringify(photos),
      website,
      0,
      verified,
      tier,
      Number((4.3 + Math.random() * 0.6).toFixed(2)),
      rndInt(6, 240),
      "© OpenStreetMap contributors",
    );
    cityCount++;
    totalInserted++;
  }
  console.log(`${city.name.padEnd(18)} ${cityCount} listings`);
  await sleep(1200); // be polite to Overpass
}

console.log(`\nDone. Inserted ${totalInserted} listings into ${DB_PATH}`);
const total = db.prepare("SELECT COUNT(*) AS n FROM listings").get().n;
console.log(`Total listings in DB: ${total}`);

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS hosts (
      id TEXT PRIMARY KEY, email TEXT UNIQUE, name TEXT, stripe_customer_id TEXT,
      stripe_connect_id TEXT, connect_onboarded INTEGER DEFAULT 0,
      subscription_tier TEXT DEFAULT 'free', subscription_status TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS listings (
      id TEXT PRIMARY KEY, host_id TEXT, status TEXT DEFAULT 'unclaimed',
      source TEXT DEFAULT 'host', property_name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      city_slug TEXT NOT NULL, city_name TEXT NOT NULL, country TEXT, lat REAL, lng REAL,
      neighborhood TEXT, description TEXT, property_type TEXT DEFAULT 'guest_house',
      price_range TEXT DEFAULT 'mid', price_per_night INTEGER, currency TEXT DEFAULT 'gbp',
      amenities TEXT DEFAULT '[]', photos TEXT DEFAULT '[]', booking_url TEXT,
      has_booking_site INTEGER DEFAULT 0, verified INTEGER DEFAULT 0, tier TEXT DEFAULT 'free',
      rating REAL, review_count INTEGER DEFAULT 0, attribution TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city_slug);
    CREATE INDEX IF NOT EXISTS idx_listings_country ON listings(country);
    CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY, listing_id TEXT, guest_email TEXT, check_in TEXT, check_out TEXT,
      guests INTEGER, message TEXT, relayed INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT, listing_id TEXT, type TEXT,
      created_at TEXT DEFAULT (datetime('now')), meta TEXT
    );
  `);
}
