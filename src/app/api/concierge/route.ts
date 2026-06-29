import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { sb, T } from "@/lib/sb";
import { searchListings, getFeaturedListings, recordEvent } from "@/lib/db";
import type { Listing, PropertyType } from "@/lib/types";

// Guest "trip assistant": recommends stays from our OWN directory (grounded, no
// hallucinated places). Free, but rate-limited — anonymous get a few questions,
// signed-in guests get 20/month. Usage is counted via fys_events (no new table).
export const dynamic = "force-dynamic";

const ANON_LIMIT = 3;
const GUEST_LIMIT = 20;
const GKEY = (process.env.GEMINI_API_KEY || "").replace(/\\n$/, "").trim();

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
async function findCity(msg: string): Promise<{ slug: string; name: string } | null> {
  const { data } = await sb.from(T.citySummary).select("city_slug,city_name").limit(900);
  const lower = " " + msg.toLowerCase() + " ";
  let best: { slug: string; name: string } | null = null;
  for (const c of (data ?? []) as { city_slug: string; city_name: string }[]) {
    const n = (c.city_name || "").toLowerCase();
    if (n.length > 2 && lower.includes(n) && (!best || n.length > best.name.length)) best = { slug: c.city_slug, name: c.city_name };
  }
  return best;
}

async function geminiReply(message: string, items: Listing[]): Promise<string> {
  if (!GKEY) return "";
  const list = items.map((l, i) => `${i + 1}. ${l.propertyName}, ${l.cityName}${l.country ? ", " + l.country : ""} — ${l.propertyType.replace("_", " ")}, £${l.pricePerNight ?? "?"}/night. ${(l.description || "").slice(0, 130)}`).join("\n");
  const prompt = `You are FindYourStay's warm, concise travel assistant. Recommend places to stay ONLY from the numbered list below — never invent a stay. Reply in 2-4 sentences, mention 1-3 by name and why they fit the request. If the list is empty, gently ask which city or area they have in mind.\n\nTraveller said: "${message}"\n\nAvailable stays:\n${list || "(none found yet)"}\n\nYour reply:`;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GKEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } } }),
    });
    const j = await res.json();
    return j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").trim().slice(0, 500);
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

  // Retrieve candidate stays from our directory.
  const max = parseMax(message);
  const type = parseType(message);
  const city = await findCity(message);
  let items: Listing[] = [];
  if (city) {
    items = (await searchListings({ citySlug: city.slug, propertyType: type, maxPrice: max, limit: 6 })).items;
    if (!items.length) items = (await searchListings({ citySlug: city.slug, limit: 6 })).items;
  }
  if (!items.length) items = await getFeaturedListings(6);

  const ai = await geminiReply(message, items);
  const reply = ai || (GKEY ? "Here are a few places that might suit, take a look below." : "Our trip assistant is just being switched on. In the meantime, here are some places you might like.");

  await recordEvent(key, "ai_message");

  const r = NextResponse.json({
    reply,
    listings: items.map((l) => ({ slug: l.slug, name: l.propertyName, city: l.cityName, country: l.country, price: l.pricePerNight, currency: l.currency, photo: l.photos[0] ?? null, type: l.propertyType })),
    used: used + 1,
    limit,
    signedIn: !!user,
  });
  if (setAnon) r.cookies.set("fys_anon", anon, { httpOnly: true, sameSite: "lax", maxAge: 31536000 });
  return r;
}
