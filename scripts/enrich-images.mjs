// Enrich listings with a REAL photo of the actual place: each venue's own public
// website preview image (og:image / twitter:image), i.e. the link-preview photo
// the venue itself publishes. Listing links back to that venue's own site; this
// is the standard directory/link-preview model. Hosts replace with their own
// uploads on claim. Run: node scripts/enrich-images.mjs   (--all to redo all)
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "fys.db");
const REDO_ALL = process.argv.includes("--all");
const CONCURRENCY = 10;
const TIMEOUT_MS = 9000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const db = new DatabaseSync(DB_PATH);

// Add a column to remember which listings carry a real photo (idempotent).
try {
  db.exec("ALTER TABLE listings ADD COLUMN real_photo INTEGER DEFAULT 0");
} catch {
  /* already exists */
}

const rows = db
  .prepare(
    `SELECT id, booking_url, photos FROM listings
     WHERE booking_url IS NOT NULL AND booking_url != ''
     ${REDO_ALL ? "" : "AND real_photo = 0"}`,
  )
  .all();

console.log(`Enriching ${rows.length} listings (concurrency ${CONCURRENCY})…`);

const update = db.prepare("UPDATE listings SET photos = ?, real_photo = 1 WHERE id = ?");

let done = 0;
let hits = 0;

function extractImage(html, pageUrl) {
  const patterns = [
    /<meta[^>]+(?:property|name)=["']og:image(?::secure_url|:url)?["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']og:image/i,
    /<meta[^>]+(?:property|name)=["']twitter:image(?::src)?["'][^>]*content=["']([^"']+)["']/i,
    /<link[^>]+rel=["']image_src["'][^>]*href=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) {
      try {
        const abs = new URL(m[1].trim(), pageUrl).toString();
        if (/^https?:\/\//i.test(abs) && !/\.svg(\?|$)/i.test(abs) && !abs.startsWith("data:")) {
          return abs;
        }
      } catch {
        /* bad url */
      }
    }
  }
  return null;
}

async function fetchImage(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("html")) return null;
    const html = (await res.text()).slice(0, 200_000); // head is enough
    return extractImage(html, res.url || url);
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function worker(queue) {
  while (queue.length) {
    const row = queue.pop();
    let url = row.booking_url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const img = await fetchImage(url);
    if (img) {
      let existing = [];
      try {
        existing = JSON.parse(row.photos) || [];
      } catch {
        /* ignore */
      }
      // Real photo first, keep a couple of placeholders behind it for the gallery.
      const photos = [img, ...existing.filter((p) => !p.includes(img)).slice(0, 3)];
      update.run(JSON.stringify(photos), row.id);
      hits++;
    }
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${rows.length} processed, ${hits} real photos`);
  }
}

const queue = [...rows];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

console.log(`\nDone. ${hits}/${rows.length} listings now have a real photo of the place.`);
const withReal = db.prepare("SELECT COUNT(*) n FROM listings WHERE real_photo = 1").get().n;
console.log(`Total listings with a real photo: ${withReal}`);
