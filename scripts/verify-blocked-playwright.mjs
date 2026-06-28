// Final pass: the links that block simple fetches (401/403/429) get loaded in a
// REAL headless browser (Playwright), which gets past most bot protection, then
// the rendered page is content-checked (heuristic + Gemini) and bad ones cleared.
import { chromium } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);
const GEM = process.env.GEMINI_API_KEY.replace(/\\n$/, "").trim();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const STAY = ["hotel", "hostel", "b&b", "bed and breakfast", "guest house", "guesthouse", "room", "apartment", "villa", "cottage", "chalet", "booking", "reserv", "accommodat", "suite", "lodge", " inn ", "pension", "casa", "maison", "zimmer", "ferienwohnung", "bnb", "self catering", "holiday", "check-in", "per night", "sleeps", "nightly"];
const PARKED = ["domain for sale", "buy this domain", "is for sale", "parked", "sedo", "hugedomains", "afternic", "dan.com", "domain parking", "purchase this domain", "godaddy", "namecheap", "porkbun", "available for purchase", "已过期", "域名出售"];
const SPAM = ["casino", "slot", "betting", "sportsbook", "poker", "viagra", "cialis", "pharmacy", "payday loan", "crypto", "bitcoin", "forex", "porn", "escort", "replica watches"];
const CJK_OK = new Set(["China", "Taiwan", "Hong Kong", "Macau", "Japan", "South Korea", "Korea", "Singapore", "Malaysia"]);
const cjkRatio = (t) => ((t.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length) / (((t.match(/[a-z぀-ヿ㐀-鿿가-힯]/gi) || []).length) || 1);

// ---- Phase A: find the links that block a simple fetch ----
let from = 0; const all = [];
for (;;) { const { data } = await sb.from("fys_listings").select("slug,property_name,booking_url,city_name,country").not("booking_url", "is", null).range(from, from + 999); if (!data?.length) break; all.push(...data); if (data.length < 1000) break; from += 1000; }
console.log(`Scanning ${all.length} linked listings for bot-blocked ones…`);

const blocked = [];
let ai = 0;
await Promise.all(Array.from({ length: 25 }, async () => {
  while (ai < all.length) {
    const l = all[ai++];
    let url = l.booking_url.trim(); if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 8000); const r = await fetch(url, { redirect: "follow", signal: c.signal, headers: { "User-Agent": UA } }); clearTimeout(t); if ([401, 403, 429].includes(r.status)) blocked.push(l); } catch { /* leave */ }
  }
}));
console.log(`${blocked.length} bot-blocked links to re-check with a real browser`);

// ---- Phase B: Playwright ----
async function judge(text) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEM}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: `Is this the official website of a specific lodging/accommodation business (hotel, B&B, guesthouse, apartment/holiday rental, hostel)? Reply exactly YES or NO.\n\n${text}` }] }], generationConfig: { maxOutputTokens: 8, temperature: 0, thinkingConfig: { thinkingBudget: 0 } } }) });
    const j = await res.json(); const o = (j.candidates?.[0]?.content?.parts?.[0]?.text || "").toUpperCase();
    return o.includes("YES") ? true : o.includes("NO") ? false : null;
  } catch { return null; }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ userAgent: UA, viewport: { width: 1280, height: 800 } });
const toClear = []; let done = 0, ok = 0, cleared = 0, unsure = 0;

async function checkOne(l) {
  let url = l.booking_url.trim(); if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const page = await ctx.newPage();
  let text = "";
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    text = (await page.evaluate(() => (document.title + " " + (document.body?.innerText || "")).slice(0, 2500))).toLowerCase();
  } catch { /* unreadable */ } finally { await page.close(); }

  if (!text) { unsure++; return; }
  if (PARKED.some((w) => text.includes(w)) || SPAM.some((w) => text.includes(w)) || (!CJK_OK.has(l.country) && cjkRatio(text) > 0.15)) { toClear.push(l.slug); cleared++; return; }
  const tokens = l.property_name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  if (tokens.some((w) => text.includes(w)) || (l.city_name && text.includes(l.city_name.toLowerCase())) || STAY.some((w) => text.includes(w))) { ok++; return; }
  const verdict = await judge(text);
  if (verdict === false) { toClear.push(l.slug); cleared++; } else if (verdict === true) ok++; else unsure++;
}

let bi = 0;
await Promise.all(Array.from({ length: 5 }, async () => { while (bi < blocked.length) { await checkOne(blocked[bi++]); if (++done % 25 === 0) console.log(`  ${done}/${blocked.length} · ok ${ok} · clear ${cleared} · unsure ${unsure}`); } }));
await browser.close();

for (let i = 0; i < toClear.length; i += 200) await sb.from("fys_listings").update({ booking_url: null }).in("slug", toClear.slice(i, i + 200));
const { count: linked } = await sb.from("fys_listings").select("*", { count: "exact", head: true }).not("booking_url", "is", null);
console.log(`\n=== DONE ===\nBrowser-checked ${blocked.length} blocked links: ${ok} real, ${cleared} cleared (not accommodation), ${unsure} unreadable (kept).\nListings still showing a Book-direct link: ${linked}`);
