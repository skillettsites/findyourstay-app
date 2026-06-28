// Data layer backed by Supabase (shared project, `fys_` tables). All async.
// Mirrors the previous local API so callers just add `await`.
import "server-only";
import { sb, T } from "./sb";
import { submitToIndexNow } from "./indexnow";
import type { CitySummary, Listing, ListingQuery, ListingTier } from "./types";

type Row = Record<string, unknown>;

const TIER_RANK: Record<string, number> = { pro: 0, featured: 1, standard: 2, free: 3 };

function rowToListing(r: Row): Listing {
  return {
    id: String(r.id),
    hostId: (r.host_id as string) ?? null,
    status: r.status as Listing["status"],
    source: r.source as Listing["source"],
    propertyName: r.property_name as string,
    slug: r.slug as string,
    citySlug: r.city_slug as string,
    cityName: r.city_name as string,
    country: (r.country as string) ?? "",
    lat: Number(r.lat ?? 0),
    lng: Number(r.lng ?? 0),
    neighborhood: (r.neighborhood as string) ?? null,
    description: (r.description as string) ?? null,
    propertyType: r.property_type as Listing["propertyType"],
    priceRange: r.price_range as Listing["priceRange"],
    pricePerNight: r.price_per_night == null ? null : Number(r.price_per_night),
    currency: (r.currency as string) ?? "gbp",
    amenities: Array.isArray(r.amenities) ? (r.amenities as string[]) : [],
    photos: Array.isArray(r.photos) ? (r.photos as string[]) : [],
    bookingUrl: (r.booking_url as string) ?? null,
    hasBookingSite: !!r.has_booking_site,
    verified: !!r.verified,
    tier: r.tier as ListingTier,
    rating: r.rating == null ? null : Number(r.rating),
    reviewCount: Number(r.review_count ?? 0),
    attribution: (r.attribution as string) ?? null,
    siteTheme: (["classic", "modern", "coastal"].includes(r.site_theme as string) ? r.site_theme : "classic") as Listing["siteTheme"],
    createdAt: r.created_at as string,
  };
}

function sanitize(q: string): string {
  return q.replace(/[%,()*]/g, " ").trim();
}

const slugify = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

// ---- Read API ----

export async function searchListings(query: ListingQuery = {}): Promise<{ items: Listing[]; total: number }> {
  let qb = sb.from(T.listings).select("*", { count: "exact" }).in("status", ["active", "unclaimed"]);

  if (query.citySlug) qb = qb.eq("city_slug", query.citySlug);
  if (query.country) qb = qb.eq("country", query.country);
  if (query.propertyType) qb = qb.eq("property_type", query.propertyType);
  if (query.minPrice != null) qb = qb.gte("price_per_night", query.minPrice);
  if (query.maxPrice != null) qb = qb.lte("price_per_night", query.maxPrice);
  if (query.q) {
    const t = sanitize(query.q);
    if (t) qb = qb.or(`property_name.ilike.%${t}%,city_name.ilike.%${t}%,neighborhood.ilike.%${t}%,country.ilike.%${t}%`);
  }

  switch (query.sort) {
    case "price_asc": qb = qb.order("price_per_night", { ascending: true, nullsFirst: false }); break;
    case "price_desc": qb = qb.order("price_per_night", { ascending: false, nullsFirst: false }); break;
    case "rating": qb = qb.order("rating", { ascending: false, nullsFirst: false }); break;
    default: qb = qb.order("tier_rank", { ascending: true }).order("rating", { ascending: false, nullsFirst: false });
  }

  const limit = Math.min(query.limit ?? 24, 200);
  const offset = query.offset ?? 0;
  const { data, count } = await qb.range(offset, offset + limit - 1);
  return { items: (data ?? []).map(rowToListing), total: count ?? 0 };
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const { data } = await sb.from(T.listings).select("*").eq("slug", slug).maybeSingle();
  return data ? rowToListing(data) : null;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { data } = await sb.from(T.listings).select("*").eq("id", id).maybeSingle();
  return data ? rowToListing(data) : null;
}

export async function getFeaturedListings(limit = 12): Promise<Listing[]> {
  const { data } = await sb
    .from(T.listings)
    .select("*")
    .in("status", ["active", "unclaimed"])
    .order("tier_rank", { ascending: true })
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []).map(rowToListing);
}

export interface CitySuggestion {
  citySlug: string;
  cityName: string;
  country: string;
  count: number;
}

export async function getTopCities(limit = 12): Promise<CitySummary[]> {
  const { data } = await sb.from(T.citySummary).select("*").order("n", { ascending: false }).limit(limit);
  const cities = (data ?? []) as Row[];
  // one cover photo per city
  const slugs = cities.map((c) => c.city_slug as string);
  const covers: Record<string, string> = {};
  if (slugs.length) {
    const { data: photoRows } = await sb.from(T.listings).select("city_slug,photos").in("city_slug", slugs).limit(800);
    for (const r of (photoRows ?? []) as Row[]) {
      const cs = r.city_slug as string;
      const ph = Array.isArray(r.photos) ? (r.photos as string[]) : [];
      if (!covers[cs] && ph.length) covers[cs] = ph[0];
    }
  }
  return cities.map((c) => ({
    citySlug: c.city_slug as string,
    cityName: c.city_name as string,
    country: (c.country as string) ?? "",
    count: Number(c.n),
    lat: Number(c.lat ?? 0),
    lng: Number(c.lng ?? 0),
    coverPhoto: covers[c.city_slug as string] ?? null,
  }));
}

export async function getCitySuggestions(q: string, limit = 6): Promise<CitySuggestion[]> {
  let qb = sb.from(T.citySummary).select("*");
  const t = sanitize(q);
  if (t) qb = qb.or(`city_name.ilike.%${t}%,country.ilike.%${t}%`);
  const { data } = await qb.order("n", { ascending: false }).limit(limit);
  return ((data ?? []) as Row[]).map((c) => ({
    citySlug: c.city_slug as string,
    cityName: c.city_name as string,
    country: (c.country as string) ?? "",
    count: Number(c.n),
  }));
}

export async function getRelatedListings(listing: Listing, limit = 4): Promise<Listing[]> {
  const { data } = await sb
    .from(T.listings)
    .select("*")
    .eq("city_slug", listing.citySlug)
    .neq("id", listing.id)
    .in("status", ["active", "unclaimed"])
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  return (data ?? []).map(rowToListing);
}

export async function countListings(): Promise<number> {
  const { count } = await sb.from(T.listings).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getAllListingSlugs(limit = 5000): Promise<{ slug: string }[]> {
  const { data } = await sb.from(T.listings).select("slug").in("status", ["active", "unclaimed"]).limit(limit);
  return (data ?? []) as { slug: string }[];
}

// ---- Write API ----

export async function recordEvent(listingId: string, type: string, meta?: unknown) {
  try {
    await sb.from(T.events).insert({ listing_id: listingId, type, meta: meta ? JSON.stringify(meta) : null });
  } catch {
    /* analytics must not break a render */
  }
}

export async function createEnquiry(input: {
  listingId: string;
  guestEmail: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  message?: string;
}): Promise<string> {
  const id = crypto.randomUUID();
  await sb.from(T.enquiries).insert({
    id,
    listing_id: input.listingId,
    guest_email: input.guestEmail,
    check_in: input.checkIn ?? null,
    check_out: input.checkOut ?? null,
    guests: input.guests ?? null,
    message: input.message ?? null,
  });
  await recordEvent(input.listingId, "enquiry");
  return id;
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const key = (process.env.GOOGLE_PLACES_API_KEY || "").replace(/\\n$/, "").trim();
  if (!key) return null;
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`);
    const j = await res.json();
    const loc = j.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch {
    return null;
  }
}

// Offset by up to ~40m so the public map shows a tight approximate spot, never
// the exact pin. Kept small so the circle reads as "this block", not a region.
function fuzz(lat: number, lng: number): { lat: number; lng: number } {
  const d = 0.00035;
  return { lat: lat + (Math.random() - 0.5) * 2 * d, lng: lng + (Math.random() - 0.5) * 2 * d };
}

export interface NewListingInput {
  propertyName: string;
  hostId?: string;
  citySlug?: string;
  cityName: string;
  country: string;
  propertyType: string;
  neighborhood?: string;
  address?: string;
  lat?: number;
  lng?: number;
  description?: string;
  pricePerNight?: number;
  amenities?: string[];
  photos?: string[];
  bookingUrl?: string;
  hasBookingSite?: boolean;
  tier?: string;
  siteTheme?: string;
  hostEmail?: string;
  hostName?: string;
}

export async function createListing(input: NewListingInput): Promise<{ id: string; slug: string }> {
  let lat = Number(input.lat ?? 0), lng = Number(input.lng ?? 0), country = input.country;
  // Exact address -> precise coords. The address autocomplete already resolves
  // coordinates client-side; only fall back to a server geocode if it didn't.
  // The address itself is never stored or shown to guests, just a fuzzed point.
  if ((!lat || !lng) && input.address) {
    const g = await geocode(`${input.address}, ${input.cityName}, ${input.country}`);
    if (g) { lat = g.lat; lng = g.lng; }
  }
  if (!lat && input.citySlug) {
    const { data: c } = await sb.from(T.citySummary).select("*").eq("city_slug", input.citySlug).maybeSingle();
    if (c) { lat = Number(c.lat ?? 0); lng = Number(c.lng ?? 0); country = country || (c.country as string) || ""; }
  }
  if (lat || lng) { const f = fuzz(lat, lng); lat = f.lat; lng = f.lng; }

  let slug = slugify(`${input.propertyName}-${input.cityName}`);
  while ((await sb.from(T.listings).select("id").eq("slug", slug).maybeSingle()).data) {
    slug = `${slug}-${Math.floor(Math.random() * 9999)}`;
  }

  const price = input.pricePerNight ?? null;
  const priceRange = price == null ? "mid" : price < 70 ? "budget" : price < 160 ? "mid" : "luxury";
  const tier = input.tier ?? "free";
  const id = crypto.randomUUID();

  await sb.from(T.listings).insert({
    id, host_id: input.hostId ?? null, status: "active", source: "host",
    property_name: input.propertyName, slug, city_slug: input.citySlug ?? slugify(input.cityName),
    city_name: input.cityName, country, lat, lng, neighborhood: input.neighborhood ?? null,
    description: input.description ?? null, property_type: input.propertyType, price_range: priceRange,
    price_per_night: price, currency: "gbp", amenities: input.amenities ?? [], photos: input.photos ?? [],
    booking_url: input.bookingUrl ?? null, has_booking_site: !!input.hasBookingSite, verified: false,
    tier, tier_rank: TIER_RANK[tier] ?? 3,
  });
  // Persist the chosen template separately so a missing column (pre-migration)
  // can't break listing creation. Silently ignored until the column exists.
  if (input.siteTheme && input.siteTheme !== "classic") {
    await sb.from(T.listings).update({ site_theme: input.siteTheme }).eq("id", id);
  }
  return { id, slug };
}

export interface UpdateListingInput {
  propertyName?: string;
  description?: string | null;
  pricePerNight?: number | null;
  amenities?: string[];
  photos?: string[];
  siteTheme?: string;
}

// Edit a listing the host owns (dashboard). Returns false if not theirs.
export async function updateListingForHost(id: string, hostId: string, patch: UpdateListingInput): Promise<boolean> {
  const { data: l } = await sb.from(T.listings).select("host_id").eq("id", id).maybeSingle();
  if (!l || l.host_id !== hostId) return false;

  const upd: Row = {};
  if (patch.propertyName !== undefined && patch.propertyName.trim()) upd.property_name = patch.propertyName.trim();
  if (patch.description !== undefined) upd.description = patch.description;
  if (patch.amenities !== undefined) upd.amenities = patch.amenities;
  if (patch.photos !== undefined) upd.photos = patch.photos;
  if (patch.pricePerNight !== undefined) {
    const p = patch.pricePerNight;
    upd.price_per_night = p;
    upd.price_range = p == null ? "mid" : p < 70 ? "budget" : p < 160 ? "mid" : "luxury";
  }
  if (Object.keys(upd).length) await sb.from(T.listings).update(upd).eq("id", id);
  // Theme update kept separate so a pre-migration column absence is tolerated.
  if (patch.siteTheme !== undefined) await sb.from(T.listings).update({ site_theme: patch.siteTheme }).eq("id", id);

  // If this listing has a live booking site, re-submit it to IndexNow so the
  // edits are re-crawled quickly by Bing/Yandex.
  const { data: dom } = await sb.from(T.domains).select("domain").eq("listing_id", id).eq("status", "active").maybeSingle();
  if (dom?.domain) void submitToIndexNow(dom.domain as string);
  return true;
}

// A homely B&B/apartment (not a hotel) with real photos, for the example site.
export async function getDemoListing(): Promise<Listing | null> {
  const { data } = await sb
    .from(T.listings)
    .select("*")
    .in("property_type", ["guest_house", "apartment", "villa", "cottage", "chalet"])
    .in("status", ["active", "unclaimed"])
    .eq("real_photo", true)
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(1);
  return data && data[0] ? rowToListing(data[0]) : null;
}

export async function getHostListings(limit = 10): Promise<Listing[]> {
  const { data } = await sb.from(T.listings).select("*").eq("source", "host").order("created_at", { ascending: false }).limit(limit);
  return (data ?? []).map(rowToListing);
}

// Listings owned by a specific logged-in host.
export async function getListingsByHost(hostId: string, limit = 50): Promise<Listing[]> {
  const { data } = await sb
    .from(T.listings)
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(rowToListing);
}

export interface EnquiryRow {
  id: string; listingId: string; listingName: string; guestEmail: string;
  checkIn: string | null; checkOut: string | null; guests: number | null;
  message: string | null; createdAt: string;
}

export async function getEnquiriesForListings(listings: Listing[], limit = 30): Promise<EnquiryRow[]> {
  const ids = listings.map((l) => l.id);
  if (!ids.length) return [];
  const nameById = new Map(listings.map((l) => [l.id, l.propertyName]));
  const { data } = await sb
    .from(T.enquiries)
    .select("*")
    .in("listing_id", ids)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as Row[]).map((r) => ({
    id: String(r.id),
    listingId: r.listing_id as string,
    listingName: nameById.get(r.listing_id as string) ?? "",
    guestEmail: r.guest_email as string,
    checkIn: (r.check_in as string) ?? null,
    checkOut: (r.check_out as string) ?? null,
    guests: r.guests == null ? null : Number(r.guests),
    message: (r.message as string) ?? null,
    createdAt: r.created_at as string,
  }));
}

export interface BookingRow {
  id: string; listingId: string; listingName: string; guestEmail: string;
  checkIn: string; checkOut: string; guests: number | null; status: string; createdAt: string;
}

export async function getBookingsForListings(listings: Listing[], limit = 30): Promise<BookingRow[]> {
  const ids = listings.map((l) => l.id);
  if (!ids.length) return [];
  const nameById = new Map(listings.map((l) => [l.id, l.propertyName]));
  const { data } = await sb
    .from(T.bookings)
    .select("*")
    .in("listing_id", ids)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data ?? []) as Row[]).map((r) => ({
    id: String(r.id),
    listingId: r.listing_id as string,
    listingName: nameById.get(r.listing_id as string) ?? "",
    guestEmail: r.guest_email as string,
    checkIn: r.check_in as string,
    checkOut: r.check_out as string,
    guests: r.guests == null ? null : Number(r.guests),
    status: (r.status as string) ?? "requested",
    createdAt: r.created_at as string,
  }));
}

export async function getBookingForHost(bookingId: string, hostId: string): Promise<{ id: string; listingId: string; guestEmail: string; checkIn: string; checkOut: string } | null> {
  const { data: b } = await sb.from(T.bookings).select("*").eq("id", bookingId).maybeSingle();
  if (!b) return null;
  const { data: l } = await sb.from(T.listings).select("host_id,property_name").eq("id", b.listing_id as string).maybeSingle();
  if (!l || l.host_id !== hostId) return null;
  return { id: String(b.id), listingId: b.listing_id as string, guestEmail: b.guest_email as string, checkIn: b.check_in as string, checkOut: b.check_out as string };
}

export async function setBookingStatus(bookingId: string, status: string): Promise<void> {
  await sb.from(T.bookings).update({ status }).eq("id", bookingId);
}

export async function getListingStats(listingId: string): Promise<{ views: number; enquiries: number }> {
  const v = await sb.from(T.events).select("*", { count: "exact", head: true }).eq("listing_id", listingId).eq("type", "view");
  const e = await sb.from(T.events).select("*", { count: "exact", head: true }).eq("listing_id", listingId).eq("type", "enquiry");
  return { views: v.count ?? 0, enquiries: e.count ?? 0 };
}

export async function mapDomain(domain: string, listingId: string, status: string, provider: string) {
  await sb.from(T.domains).upsert({ domain: domain.toLowerCase(), listing_id: listingId, status, provider });
}

export async function getListingByDomain(domain: string): Promise<Listing | null> {
  const { data: d } = await sb.from(T.domains).select("listing_id").eq("domain", domain.toLowerCase()).eq("status", "active").maybeSingle();
  if (!d) return null;
  return getListingById(d.listing_id as string);
}
