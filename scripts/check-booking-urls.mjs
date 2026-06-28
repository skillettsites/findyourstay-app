// Check every listing's outbound "Book direct" URL: is it live, and is it a real
// direct site (not a dead link, parked domain, or an OTA redirect)?
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const sb = createClient(
  process.env.SUPABASE_URL.replace(/\\n$/, "").trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.replace(/\\n$/, "").trim(),
  { auth: { persistSession: false } },
);
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const OTA = ["booking.com", "airbnb.", "expedia.", "hotels.com", "vrbo.", "agoda.", "hostelworld.", "tripadvisor.", "trip.com", "lastminute.", "trivago.", "kayak.", "makemytrip"];

let from = 0;
const all = [];
for (;;) {
  const { data } = await sb.from("fys_listings").select("id,slug,property_name,booking_url,city_name").not("booking_url", "is", null).range(from, from + 999);
  if (!data || !data.length) break;
  all.push(...data);
  if (data.length < 1000) break;
  from += 1000;
}
console.log(`${all.length} listings have a booking_url to check`);

const results = { ok: 0, dead: 0, ota: 0, total: all.length };
const problems = [];

async function check(l) {
  let url = l.booking_url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 9000);
  try {
    let res = await fetch(url, { method: "GET", redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": UA } });
    clearTimeout(t);
    const finalHost = new URL(res.url).host.toLowerCase().replace(/^www\./, "");
    if (OTA.some((d) => finalHost.includes(d))) {
      results.ota++; problems.push({ slug: l.slug, name: l.property_name, issue: "redirects to OTA", finalHost, url });
    } else if (res.status >= 200 && res.status < 400) {
      results.ok++;
    } else {
      results.dead++; problems.push({ slug: l.slug, name: l.property_name, issue: `status ${res.status}`, url });
    }
  } catch (e) {
    clearTimeout(t);
    results.dead++; problems.push({ slug: l.slug, name: l.property_name, issue: e.name === "AbortError" ? "timeout" : "unreachable", url });
  }
}

let idx = 0, done = 0;
async function worker() {
  while (idx < all.length) {
    await check(all[idx++]);
    if (++done % 200 === 0) console.log(`  ${done}/${all.length} · ok ${results.ok} · dead ${results.dead} · ota ${results.ota}`);
  }
}
await Promise.all(Array.from({ length: 25 }, () => worker()));

console.log("\n=== RESULTS ===");
console.log(`live & direct : ${results.ok}/${results.total} (${Math.round(results.ok / results.total * 100)}%)`);
console.log(`dead/broken   : ${results.dead}`);
console.log(`OTA redirect  : ${results.ota}`);
fs.writeFileSync("booking-url-problems.json", JSON.stringify(problems, null, 2));
console.log(`\nWrote ${problems.length} problem URLs to booking-url-problems.json`);
