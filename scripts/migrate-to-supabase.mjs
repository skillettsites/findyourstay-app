// One-time migration: local SQLite (data/fys.db) -> shared Supabase (fys_ tables).
import { DatabaseSync } from "node:sqlite";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";

const url = process.env.SUPABASE_URL?.replace(/\\n$/, "").trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\\n$/, "").trim();
if (!url || !key) { console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const db = new DatabaseSync(path.join(process.cwd(), "data", "fys.db"));
const TIER_RANK = { pro: 0, featured: 1, standard: 2, free: 3 };
const j = (v, fb) => { try { return JSON.parse(v) ?? fb; } catch { return fb; } };

const rows = db.prepare("SELECT * FROM listings").all();
console.log(`Migrating ${rows.length} listings…`);

const mapped = rows.map((r) => ({
  id: r.id, host_id: r.host_id ?? null, status: r.status, source: r.source,
  property_name: r.property_name, slug: r.slug, city_slug: r.city_slug, city_name: r.city_name,
  country: r.country ?? null, lat: r.lat, lng: r.lng, neighborhood: r.neighborhood ?? null,
  description: r.description ?? null, property_type: r.property_type, price_range: r.price_range,
  price_per_night: r.price_per_night ?? null, currency: r.currency ?? "gbp",
  amenities: j(r.amenities, []), photos: j(r.photos, []),
  booking_url: r.booking_url ?? null, has_booking_site: !!r.has_booking_site, verified: !!r.verified,
  tier: r.tier, tier_rank: TIER_RANK[r.tier] ?? 3, rating: r.rating ?? null,
  review_count: r.review_count ?? 0, attribution: r.attribution ?? null, real_photo: !!r.real_photo,
  external_ical_urls: j(r.external_ical_urls, []), created_at: r.created_at ?? new Date().toISOString(),
}));

let done = 0;
for (let i = 0; i < mapped.length; i += 500) {
  const batch = mapped.slice(i, i + 500);
  const { error } = await sb.from("fys_listings").upsert(batch, { onConflict: "id" });
  if (error) { console.error("batch error:", error.message); process.exit(1); }
  done += batch.length;
  console.log(`  ${done}/${mapped.length}`);
}

// calendar blocks (if any)
const blocks = db.prepare("SELECT * FROM calendar_blocks").all();
if (blocks.length) {
  await sb.from("fys_calendar_blocks").upsert(blocks.map((b) => ({
    id: b.id, listing_id: b.listing_id, start_date: b.start_date, end_date: b.end_date,
    source: b.source, external_uid: b.external_uid ?? null,
  })), { onConflict: "id" });
  console.log(`Migrated ${blocks.length} calendar blocks.`);
}

const { count } = await sb.from("fys_listings").select("*", { count: "exact", head: true });
console.log(`Done. fys_listings now has ${count} rows.`);
