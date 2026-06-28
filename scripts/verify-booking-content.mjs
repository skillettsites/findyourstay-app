// Content-verify every live "Book direct" URL: does the page actually look like
// the accommodation's own website, or has the domain been repurposed (parked /
// for-sale / Chinese-AI-spam / casino / unrelated business)?
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const STAY_WORDS = ["hotel", "hostel", "b&b", "bed and breakfast", "bed & breakfast", "guest house", "guesthouse", "room", "rooms", "apartment", "apartament", "villa", "cottage", "chalet", "booking", "book now", "reserv", "accommodation", "accommodat", "stay", "suite", "lodge", "inn", "pension", "casa", "maison", "zimmer", "ferienwohnung", "bnb", "self catering", "holiday", "vacation rental", "check-in", "nightly", "per night", "sleeps"];
const PARKED = ["domain for sale", "buy this domain", "this domain is for sale", "domain is for sale", "domain may be for sale", "is for sale", "parked", "sedo", "hugedomains", "afternic", "dan.com", "domain parking", "purchase this domain", "the domain", "domreg", "godaddy", "namecheap", "porkbun", "available for purchase", "register this domain", "已过期", "域名出售", "domena", "this site can't be reached"];
const SPAM = ["casino", "slot", "betting", "sportsbook", "poker", "viagra", "cialis", "pharmacy", "payday loan", "crypto", "bitcoin", "forex", "porn", "escort", "replica watches", "loan online"];
// Countries where heavy Han/Kana/Hangul script is expected (don't flag those).
const CJK_OK = new Set(["China", "Taiwan", "Hong Kong", "Macau", "Japan", "South Korea", "Korea", "Singapore", "Malaysia"]);

function cjkRatio(text) {
  const cjk = (text.match(/[぀-ヿ㐀-鿿가-힯]/g) || []).length;
  const letters = (text.match(/[a-z぀-ヿ㐀-鿿가-힯]/gi) || []).length || 1;
  return cjk / letters;
}

let from = 0;
const all = [];
for (;;) {
  const { data } = await sb.from("fys_listings").select("id,slug,property_name,booking_url,city_name,country").not("booking_url", "is", null).range(from, from + 999);
  if (!data || !data.length) break;
  all.push(...data); if (data.length < 1000) break; from += 1000;
}
console.log(`Content-checking ${all.length} live booking URLs`);

const flags = [];
const counts = { ok: 0, parked: 0, spam: 0, cjk_mismatch: 0, no_signal: 0, blocked: 0 };

async function check(l) {
  let url = l.booking_url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  let html = "";
  try {
    const res = await fetch(url, { redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA, "Accept-Language": "en" } });
    clearTimeout(t);
    if (res.status === 401 || res.status === 403 || res.status === 429) { counts.blocked++; return; }
    html = (await res.text()).slice(0, 60000);
  } catch { clearTimeout(t); counts.blocked++; return; }

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const text = (title + " " + html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).slice(0, 4000).toLowerCase();

  const reason = (r) => { counts[r]++; flags.push({ slug: l.slug, name: l.property_name, country: l.country, reason: r, title: title.slice(0, 80), url }); };

  if (PARKED.some((w) => text.includes(w))) return reason("parked");
  if (SPAM.some((w) => text.includes(w))) return reason("spam");
  if (!CJK_OK.has(l.country) && cjkRatio(text) > 0.15) return reason("cjk_mismatch");

  const nameTokens = l.property_name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  const hasName = nameTokens.some((w) => text.includes(w));
  const hasCity = l.city_name && text.includes(l.city_name.toLowerCase());
  const hasStay = STAY_WORDS.some((w) => text.includes(w));
  if (hasName || hasCity || hasStay) { counts.ok++; return; }
  return reason("no_signal");
}

let idx = 0, done = 0;
async function worker() { while (idx < all.length) { await check(all[idx++]); if (++done % 200 === 0) console.log(`  ${done}/${all.length} · ok ${counts.ok} · parked ${counts.parked} · spam ${counts.spam} · cjk ${counts.cjk_mismatch} · nosig ${counts.no_signal} · blocked ${counts.blocked}`); } }
await Promise.all(Array.from({ length: 20 }, () => worker()));

console.log("\n=== CONTENT RESULTS ===");
for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(13)} ${v}`);
fs.writeFileSync("booking-content-flags.json", JSON.stringify(flags, null, 2));
console.log(`\nWrote ${flags.length} flagged URLs to booking-content-flags.json`);
