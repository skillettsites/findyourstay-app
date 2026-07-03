import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { sb, T } from "@/lib/sb";
import { searchListings, recordEvent } from "@/lib/db";
import type { Listing, PropertyType } from "@/lib/types";

// Guest "trip assistant": a genuinely helpful travel concierge that recommends
// stays from our OWN directory (grounded, never hallucinated). It remembers the
// conversation, understands cities AND countries, and geocodes places it doesn't
// recognise so it can still point you to the nearest stays we cover.
export const dynamic = "force-dynamic";

const ANON_LIMIT = 3;
const GUEST_LIMIT = 20;
const GKEY = (process.env.GEMINI_API_KEY || "").replace(/\\n$/, "").trim();
const MAPS_KEY = (process.env.GOOGLE_PLACES_API_KEY || "").replace(/\\n$/, "").trim();

type Turn = { role: "user" | "assistant"; text: string };

function monthStartISO() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}
async function usageThisMonth(key: string): Promise<number> {
  const { count } = await sb.from(T.events).select("*", { count: "exact", head: true }).eq("listing_id", key).eq("type", "ai_message").gte("created_at", monthStartISO());
  return count ?? 0;
}

function parseMax(m: string): number | undefined {
  const x = m.match(/(?:under|below|max|up to|less than|<)\s*£?\s*(\d{2,4})/i) || m.match(/£\s*(\d{2,4})/);
  return x ? Number(x[1]) : undefined;
}
function parseType(m: string): PropertyType | undefined {
  const s = m.toLowerCase();
  if (/b ?& ?b|bed and breakfast|guest ?house/.test(s)) return "guest_house";
  if (/apartment|flat|loft/.test(s)) return "apartment";
  if (/villa/.test(s)) return "villa";
  if (/cabin|chalet|lodge/.test(s)) return "chalet";
  if (/cottage/.test(s)) return "cottage";
  return undefined;
}

let _countriesCache: { at: number; list: string[] } | null = null;
async function distinctCountries(): Promise<string[]> {
  if (_countriesCache && Date.now() - _countriesCache.at < 300000) return _countriesCache.list;
  const { data } = await sb.from(T.citySummary).select("country").limit(2000);
  const list = [...new Set(((data ?? []) as { country: string }[]).map((c) => c.country).filter(Boolean))];
  _countriesCache = { at: Date.now(), list };
  return list;
}

async function findCity(msg: string): Promise<{ slug: string; name: string } | null> {
  const { data } = await sb.from(T.citySummary).select("city_slug,city_name").limit(900);
  const lower = " " + msg.toLowerCase() + " ";
  let best: { slug: string; name: string } | null = null;
  for (const c of (data ?? []) as { city_slug: string; city_name: string }[]) {
    const n = (c.city_name || "").toLowerCase();
    if (n.length > 2 && lower.includes(" " + n) && (!best || n.length > best.name.length)) best = { slug: c.city_slug, name: c.city_name };
  }
  return best;
}

const COUNTRY_ALIASES: Record<string, string[]> = {
  "united states": ["usa", "u.s.", "u.s.a", "the us", "america", "the states"],
  "united kingdom": ["uk", "u.k.", "britain", "great britain"],
};
async function findCountry(msg: string): Promise<string | null> {
  const countries = await distinctCountries();
  const lower = " " + msg.toLowerCase() + " ";
  let best: string | null = null;
  for (const c of countries) {
    const n = c.toLowerCase();
    if (n.length > 2 && lower.includes(" " + n) && (!best || n.length > best.length)) best = c;
  }
  if (best) return best;
  for (const c of countries) for (const alias of COUNTRY_ALIASES[c.toLowerCase()] ?? []) if (lower.includes(" " + alias + " ")) return c;
  return null;
}

// Map a geocoded country name to whichever country string our data actually uses
// (e.g. Google's "United Kingdom" → our "England").
function normalizeCountry(geo: string, ours: string[]): string | null {
  const g = geo.toLowerCase().trim();
  const direct = ours.find((c) => c.toLowerCase() === g);
  if (direct) return direct;
  const families: string[][] = [
    ["united kingdom", "uk", "great britain", "england", "scotland", "wales", "northern ireland"],
    ["united states", "usa", "united states of america", "us", "america"],
  ];
  for (const fam of families) if (fam.includes(g)) { const hit = ours.find((c) => fam.includes(c.toLowerCase())); if (hit) return hit; }
  return null;
}

// Geocode a free-text place ("cornwall", "a beach near Nice") to a city/country
// via Google, so we can still find the nearest stays we cover. Best-effort.
async function geocodePlace(q: string): Promise<{ country?: string; city?: string } | null> {
  if (!MAPS_KEY) return null;
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${MAPS_KEY}`);
    const j = await res.json();
    const r = j.results?.[0];
    if (!r) return null;
    let country: string | undefined, city: string | undefined;
    for (const c of (r.address_components ?? []) as { types: string[]; long_name: string }[]) {
      if (c.types.includes("country")) country = c.long_name;
      if (c.types.includes("locality") || c.types.includes("postal_town")) city = c.long_name;
    }
    return { country, city };
  } catch {
    return null;
  }
}

// Returns the prose reply AND the list numbers of the stays it actually
// recommended, so the tiles shown can be exactly the ones it suggested.
async function geminiReply(history: Turn[], message: string, items: Listing[], note: string): Promise<{ reply: string; picks: number[] }> {
  if (!GKEY) return { reply: "", picks: [] };
  const list = items
    .map((l, i) => {
      const beds = l.bedrooms?.length ? `${l.bedrooms.length} bedroom${l.bedrooms.length > 1 ? "s" : ""}` : "";
      const baths = l.bathrooms ? `${l.bathrooms} bathroom${l.bathrooms > 1 ? "s" : ""}` : "";
      const size = [beds, baths].filter(Boolean).join(", ");
      const amen = (l.amenities ?? []).join(", ");
      const perks = (l.perks ?? []).join(", ");
      return `${i + 1}. ${l.propertyName} — ${l.cityName}${l.country ? ", " + l.country : ""}. ${l.propertyType.replace("_", " ")}, £${l.pricePerNight ?? "?"}/night${size ? ", " + size : ""}.`
        + (amen ? ` Facilities: ${amen}.` : "")
        + (perks ? ` Free perks: ${perks}.` : "")
        + (l.description ? ` About: ${l.description.slice(0, 240)}` : "")
        + ` [approx coords ${l.lat?.toFixed(2)},${l.lng?.toFixed(2)}]`;
    })
    .join("\n");
  const system = `You are FindYourStay's expert travel concierge — warm, knowledgeable and genuinely helpful, like the world's best travel agent. Recommend places to stay ONLY from the "Available stays" list; never invent a stay or a location detail you can't support. Use your own geographic knowledge to judge fit — which stays are near a beach/coast, mountains, old town, nightlife, transport, family attractions, etc.
Rules:
- Remember the whole conversation; combine what the traveller said across messages (e.g. "near a beach" then "in Canada" = a beach stay in Canada).
- Match on EVERYTHING each stay lists: price/budget, facilities/amenities (wifi, parking, kitchen, pool, breakfast, pet-friendly, etc.), free perks, number of bedrooms/bathrooms, property type and the description — as well as location and vibe. If they ask for something specific (e.g. "with parking", "free breakfast", "family of 5", "under £120"), prefer stays that actually have it and say so; if none do, say that honestly.
- When stays are available, recommend the best 1-3 for the request BY NAME, say WHY each fits (call out the specific facilities/perks/price/size that match), and put THOSE stays' list numbers in "picks".
- If the matches aren't a perfect fit (e.g. they wanted beachfront but ours are city stays), be honest, recommend the closest, and still put its number in "picks".
- Only leave "picks" empty if there are genuinely no stays to offer and you're asking a clarifying question — never invent places.
- Keep "reply" to 2-4 warm sentences. Everything is booked direct with the owner, no platform fees.
Return JSON: { "reply": string, "picks": number[] } where picks are the list numbers of the stays named in your reply.`;
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const t of history.slice(-8)) contents.push({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.text }] });
  contents.push({ role: "user", parts: [{ text: `${message}\n\n${note ? note + "\n\n" : ""}Available stays:\n${list || "(none found for this request)"}` }] });
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GKEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: {
          temperature: 0.6, maxOutputTokens: 600, thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: { type: "OBJECT", properties: { reply: { type: "STRING" }, picks: { type: "ARRAY", items: { type: "INTEGER" } } }, required: ["reply", "picks"] },
        },
      }),
    });
    const j = await res.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    try {
      const p = JSON.parse(text);
      const picks = Array.isArray(p.picks) ? p.picks.map(Number).filter((n: number) => Number.isInteger(n) && n >= 1 && n <= items.length) : [];
      return { reply: String(p.reply ?? "").trim(), picks };
    } catch {
      return { reply: text, picks: [] };
    }
  } catch {
    return { reply: "", picks: [] };
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").trim().slice(0, 500);
  const history: Turn[] = Array.isArray(body.history)
    ? body.history.filter((t: unknown): t is Turn => !!t && typeof (t as Turn).text === "string").map((t: Turn) => ({ role: t.role === "assistant" ? "assistant" : "user", text: String(t.text).slice(0, 500) })).slice(-8)
    : [];
  if (!message) return NextResponse.json({ error: "Tell me what you're looking for." }, { status: 400 });

  const user = await getUser();
  const jar = await cookies();
  let anon = jar.get("fys_anon")?.value;
  const setAnon = !anon;
  if (!anon) anon = crypto.randomUUID();
  const key = user ? `ai:u:${user.id}` : `ai:a:${anon}`;
  const limit = user ? GUEST_LIMIT : ANON_LIMIT;

  const used = await usageThisMonth(key);
  if (used >= limit) {
    const r = NextResponse.json({ limited: true, signedIn: !!user, limit });
    if (setAnon) r.cookies.set("fys_anon", anon, { httpOnly: true, sameSite: "lax", maxAge: 31536000 });
    return r;
  }

  // Build a retrieval context from the last few user turns + this message, so
  // intent expressed across messages ("near a beach" … "in canada") combines.
  const recentUser = [...history.filter((t) => t.role === "user").slice(-3).map((t) => t.text), message];
  const context = recentUser.join(". ");

  const max = parseMax(context);
  const type = parseType(context);
  let city = await findCity(context);
  let country = city ? null : await findCountry(context);
  let note = "";

  // Maps fallback: if we didn't recognise a place, geocode it and map to the
  // nearest city/country we actually cover.
  if (!city && !country) {
    const geo = await geocodePlace(context);
    if (geo?.city) { const c = await findCity(" " + geo.city + " "); if (c) city = c; }
    if (!city && geo?.country) { country = normalizeCountry(geo.country, await distinctCountries()); if (country && geo.city) note = `(Note: we don't have stays in ${geo.city} specifically, but here are the closest we cover in ${country}.)`; }
  }

  let items: Listing[] = [];
  if (city) {
    items = (await searchListings({ citySlug: city.slug, propertyType: type, maxPrice: max, limit: 6 })).items;
    if (!items.length) items = (await searchListings({ citySlug: city.slug, limit: 6 })).items;
  } else if (country) {
    items = (await searchListings({ country, propertyType: type, maxPrice: max, limit: 6 })).items;
    if (!items.length) items = (await searchListings({ country, limit: 6 })).items;
  }
  // Never show mismatched stays: if we don't cover the place, tiles stay empty
  // and the assistant asks for another area.

  const { reply: aiReply, picks } = await geminiReply(history, message, items, note);

  // Tiles = only the stays the assistant actually recommended. Prefer its
  // explicit picks; fall back to name-matching its prose; if it recommended
  // nothing (a clarifying question), show no tiles.
  let tiles: Listing[] = items; // when the AI is off, show what we retrieved
  if (GKEY && aiReply) {
    tiles = picks.length
      ? picks.map((n) => items[n - 1]).filter(Boolean)
      : items.filter((it) => aiReply.toLowerCase().includes(it.propertyName.toLowerCase()));
  }
  tiles = [...new Set(tiles)];

  const reply = aiReply || (
    !GKEY ? "Our trip assistant is just being switched on. In the meantime, tell me a city or country and I'll find you a place."
    : items.length ? "Here are a few places that might suit, take a look below."
    : "I couldn't find a match there yet. Tell me another city or country and I'll look again."
  );

  await recordEvent(key, "ai_message");

  const r = NextResponse.json({
    reply,
    listings: tiles.map((l) => ({ slug: l.slug, name: l.propertyName, city: l.cityName, country: l.country, price: l.pricePerNight, currency: l.currency, photo: l.photos[0] ?? null, type: l.propertyType })),
    used: used + 1,
    limit,
    signedIn: !!user,
  });
  if (setAnon) r.cookies.set("fys_anon", anon, { httpOnly: true, sameSite: "lax", maxAge: 31536000 });
  return r;
}
