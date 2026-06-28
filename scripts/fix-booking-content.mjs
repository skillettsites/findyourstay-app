// Phase 1: clear the clear-cut bad content (parked/spam/cjk).
// Phase 2: ask Gemini whether each "no_signal" page is really an accommodation
// site; clear only the confirmed No's. Keeps anything uncertain or unreachable.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);
const GEM = process.env.GEMINI_API_KEY.replace(/\\n$/, "").trim();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const flags = JSON.parse(fs.readFileSync("booking-content-flags.json", "utf8"));

// ---- Phase 1: high-confidence clears ----
const hard = flags.filter((f) => ["parked", "spam", "cjk_mismatch"].includes(f.reason));
console.log(`Phase 1: clearing ${hard.length} parked/spam/cjk listings…`);
for (let i = 0; i < hard.length; i += 200) {
  await sb.from("fys_listings").update({ booking_url: null }).in("slug", hard.slice(i, i + 200).map((f) => f.slug));
}

// ---- Phase 2: Gemini judges the ambiguous ----
const ambiguous = flags.filter((f) => f.reason === "no_signal");
console.log(`Phase 2: Gemini-judging ${ambiguous.length} no-signal listings…`);

async function pageText(url) {
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA, "Accept-Language": "en" } });
    clearTimeout(t);
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 40000);
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
    const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500);
    return `${title}\n${body}`;
  } catch { clearTimeout(t); return null; }
}

async function isAccommodation(text) {
  const prompt = `A directory links to this website for a place to stay. Based ONLY on the page text below, is this the official website of a specific lodging/accommodation business (hotel, B&B, guesthouse, apartment/holiday rental, hostel)? Reply with exactly one word: YES or NO.\n\n---\n${text}`;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEM}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 8, temperature: 0, thinkingConfig: { thinkingBudget: 0 } } }),
    });
    const j = await res.json();
    const out = (j.candidates?.[0]?.content?.parts?.[0]?.text || "").toUpperCase();
    return out.includes("YES") ? true : out.includes("NO") ? false : null;
  } catch { return null; }
}

let idx = 0, done = 0, cleared = 0, kept = 0, unsure = 0;
const toClear = [];
async function worker() {
  while (idx < ambiguous.length) {
    const f = ambiguous[idx++];
    const text = await pageText(f.url);
    if (!text) { unsure++; }
    else {
      const ok = await isAccommodation(text);
      if (ok === false) { toClear.push(f.slug); cleared++; }
      else if (ok === true) kept++;
      else unsure++;
    }
    if (++done % 50 === 0) console.log(`  ${done}/${ambiguous.length} · clear ${cleared} · keep ${kept} · unsure ${unsure}`);
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));

for (let i = 0; i < toClear.length; i += 200) {
  await sb.from("fys_listings").update({ booking_url: null }).in("slug", toClear.slice(i, i + 200));
}

const { count: linked } = await sb.from("fys_listings").select("*", { count: "exact", head: true }).not("booking_url", "is", null);
console.log(`\n=== DONE ===`);
console.log(`Phase 1 cleared (parked/spam/cjk): ${hard.length}`);
console.log(`Phase 2 Gemini: cleared ${cleared} not-accommodation, kept ${kept}, unsure/unreachable ${unsure} (kept)`);
console.log(`Listings still showing a Book-direct link: ${linked}`);
